"use client";
import { StoreApi, createStore, useStore } from "zustand";
import React, { useId, useRef } from "react";
import { createPortal } from "react-dom";
import { Role } from "@ariakit/react";

/**
 * Update this dictionary to add new portals.
 * Used to keep track of portal names and avoid clashes.
 */
const PORTAL_DICTIONARY = {
  out: ["toolbox", "intentionallyEmpty"],
} as const;
export type OutPortalName =
  | (typeof PORTAL_DICTIONARY)["out"][number]
  | (string & {});

type InPortal = {
  name: string;
  intendedOut: OutPortalName;
};
type OutPortal = {
  name: OutPortalName;
  ref: React.RefObject<HTMLElement | null> | null;
};
export interface PortalStore {
  inPortals: Map<string, InPortal>;
  outPortals: Map<OutPortalName, OutPortal>;

  addInPortal: (portal: InPortal) => void;
  removeInPortal: (id: string, expected?: InPortal) => void;

  addOutPortal: (portal: OutPortal) => void;
  removeOutPortal: (id: OutPortalName, expected?: OutPortal) => void;
}

const PortalStoreContext = React.createContext<StoreApi<PortalStore> | null>(
  null,
);
export const createPortalStore = () =>
  createStore<PortalStore>((set) => ({
    inPortals: new Map(),
    outPortals: new Map(),

    addInPortal: (portal) =>
      set((prev) => ({
        inPortals: new Map(prev.inPortals).set(portal.name, portal),
      })),
    removeInPortal: (name, expected) =>
      set((prev) => {
        if (expected && prev.inPortals.get(name) !== expected) return prev;
        const newInPortals = new Map(prev.inPortals);
        newInPortals.delete(name);
        return { inPortals: newInPortals };
      }),

    addOutPortal: (portal) =>
      set((prev) => ({
        outPortals: new Map(prev.outPortals).set(portal.name, portal),
      })),
    removeOutPortal: (name, expected) =>
      set((prev) => {
        if (expected && prev.outPortals.get(name) !== expected) return prev;
        const newOutPortals = new Map(prev.outPortals);
        newOutPortals.delete(name);
        return { outPortals: newOutPortals };
      }),
  }));

/** Store ownership is fixed at mount. Supplied stores are never cleared here. */
export const PortalStoreProvider = ({
  children,
  store: suppliedStore,
}: {
  children: React.ReactNode;
  store?: StoreApi<PortalStore>;
}) => {
  const [store] = React.useState(() => suppliedStore ?? createPortalStore());
  const initialStore = React.useRef(suppliedStore);
  if (initialStore.current !== suppliedStore) {
    throw new Error(
      "PortalStoreProvider store cannot change after mount; remount the provider",
    );
  }

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
    const registration = { name, intendedOut };
    addInPortal(registration);

    return () => {
      removeInPortal(name, registration);
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
    const registration = { name, ref };
    addOutPortal(registration);

    return () => {
      removeOutPortal(name, registration);
    };
  }, [name, ref, addOutPortal, removeOutPortal]);

  return ref;
};

/**
 * Children passed to this component will be behave as if they were mounted here (they are),
 * but will be rendered as children of the matching `OutPortal` in the DOM.
 * Keep the direct React portal: an extra element would change flex/grid and
 * joined-control relationships at named endpoints such as the toolbox.
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
}: { name: OutPortalName } & React.ComponentPropsWithRef<"div">) {
  const ref = useOutPortal<HTMLDivElement>(name);

  return <Role.div ref={ref} render={<div {...rest} />} />;
}
