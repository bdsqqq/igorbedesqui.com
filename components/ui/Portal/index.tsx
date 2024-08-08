"use client";
import { StoreApi, createStore, useStore } from "zustand";
import React, { useId, useMemo, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Update this dictionary to add new portals.
 * Used to keep track of portal names and avoid clashes.
 */
const PORTAL_DICTIONARY = {
  out: ["toolbox", "intentionallyEmpty"],
} as const;
type OutPortalName = (typeof PORTAL_DICTIONARY)["out"][number] | (string & {});

type InPortal = {
  name: string;
  intendedOut: OutPortalName;
};
type OutPortal = {
  name: OutPortalName;
  ref: React.RefObject<HTMLElement> | null;
};
interface PortalStore {
  inPortals: Map<string, InPortal>;
  outPortals: Map<OutPortalName, OutPortal>;

  addInPortal: (portal: InPortal) => void;
  removeInPortal: (id: string) => void;

  addOutPortal: (portal: OutPortal) => void;
  removeOutPortal: (id: OutPortalName) => void;
}

const PortalStoreContext = React.createContext<StoreApi<PortalStore> | null>(
  null,
);
export const PortalStoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [store] = React.useState(() =>
    createStore<PortalStore>((set) => ({
      inPortals: new Map(),
      outPortals: new Map(),

      addInPortal: (portal) =>
        set((prev) => ({
          inPortals: new Map(prev.inPortals).set(portal.name, portal),
        })),
      removeInPortal: (name) =>
        set((prev) => {
          const newInPortals = new Map(prev.inPortals);
          newInPortals.delete(name);
          return { inPortals: newInPortals };
        }),

      addOutPortal: (portal) =>
        set((prev) => ({
          outPortals: new Map(prev.outPortals).set(portal.name, portal),
        })),
      removeOutPortal: (name) =>
        set((prev) => {
          const newOutPortals = new Map(prev.outPortals);
          newOutPortals.delete(name);
          return { outPortals: newOutPortals };
        }),
    })),
  );

  return (
    <PortalStoreContext.Provider value={store}>
      {children}
    </PortalStoreContext.Provider>
  );
};
export const usePortalStore = () => {
  const store = React.useContext(PortalStoreContext);
  if (!store) {
    throw new Error("Missing PortalStoreProvider");
  }
  return useStore(store);
};

const useInPortal = ({
  name,
  intendedOut,
}: {
  name: string;
  intendedOut: OutPortalName;
}) => {
  const { addInPortal, removeInPortal } = usePortalStore();

  React.useLayoutEffect(() => {
    addInPortal({ name, intendedOut });

    return () => {
      removeInPortal(name);
    };
  }, [name, intendedOut, addInPortal, removeInPortal]);
};

/**
 * Returns a ref that will make an element into an `OutPortal`.
 */
export const useOutPortal = <T extends HTMLElement>(name: OutPortalName) => {
  const { addOutPortal, removeOutPortal } = usePortalStore();
  const ref = useRef<T>(null);

  React.useLayoutEffect(() => {
    addOutPortal({ name, ref });

    return () => {
      removeOutPortal(name);
    };
  }, [name, ref, addOutPortal, removeOutPortal]);

  return ref;
};

/**
 * Children passed to this component will be behave as if they were mounted here (they are),
 * but will be rendered as children of the matching `OutPortal` in the DOM.
 */
export function InPortal({
  children,
  name,
  outPortalName,
}: {
  children: React.ReactNode;
  name: string;
  outPortalName: OutPortalName;
}) {
  const id = useId();
  useInPortal({ name, intendedOut: outPortalName });
  const { outPortals } = usePortalStore();
  const [outPortalNode, setOutPortalNode] = React.useState<HTMLElement | null>(
    null,
  );

  React.useLayoutEffect(() => {
    const ref = outPortals.get(outPortalName)?.ref || null;

    setOutPortalNode(ref?.current || null);
  }, [outPortalName, outPortals]);

  return (
    <>{outPortalNode ? createPortal(children, outPortalNode, id) : null}</>
  );
}

/**
 * Renders a DOM node that can be targeted by an `InPortal`.
 */
export function OutPortal({
  name,
  ...rest
}: { name: OutPortalName } & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useOutPortal<HTMLDivElement>(name);

  return <div ref={ref} {...rest} />;
}
