import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";
import React, { useMemo, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Update this dictionary to add new portals.
 * Used to keep track of portal names and avoid clashes.
 */
const PORTAL_DICTIONARY = {
  in: [""],
  out: ["intentionallyEmpty"],
} as const;
type InPortalName = (typeof PORTAL_DICTIONARY)["in"][number];
type OutPortalName = (typeof PORTAL_DICTIONARY)["out"][number];

type InPortal = {
  name: InPortalName;
  intendedOut: OutPortalName;
};
type OutPortal = {
  name: OutPortalName;
  ref: React.RefObject<HTMLElement> | null;
};
interface PortalStore {
  inPortals: ReadonlyArray<InPortal>;
  outPortals: ReadonlyArray<OutPortal>;

  addInPortal: (portal: InPortal) => void;
  removeInPortal: (id: InPortalName) => void;

  addOutPortal: (portal: OutPortal) => void;
  removeOutPortal: (id: OutPortalName) => void;
}
export const PortalStore = createStore<PortalStore>((set) => ({
  inPortals: [],
  outPortals: [],

  addInPortal: (portal) =>
    set((state) => ({ inPortals: [...state.inPortals, portal] })),
  removeInPortal: (name) =>
    set((state) => ({
      inPortals: state.inPortals.filter((p) => p.name !== name),
    })),

  addOutPortal: (portal) =>
    set((state) => ({ outPortals: [...state.outPortals, portal] })),
  removeOutPortal: (name) =>
    set((state) => ({
      outPortals: state.outPortals.filter((p) => p.name !== name),
    })),
}));

const useRegisterInPortal = ({
  name,
  intendedOut,
}: {
  name: InPortalName;
  intendedOut: OutPortalName;
}) => {
  const { addInPortal, removeInPortal } = useStore(PortalStore);

  React.useEffect(() => {
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
  const { addOutPortal, removeOutPortal } = useStore(PortalStore);
  const ref = useRef<T>(null);

  React.useEffect(() => {
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
  name: InPortalName;
  outPortalName: OutPortalName;
}) {
  useRegisterInPortal({ name, intendedOut: outPortalName });
  const { outPortals } = useStore(PortalStore);
  const [outPortalNode, setOutPortalNode] = React.useState<HTMLElement | null>(
    null,
  );

  const tryToFindOutPortal = React.useCallback(() => {
    const ref =
      outPortals.find((outPortal) => outPortal.name === outPortalName)?.ref ||
      null;

    setOutPortalNode(ref?.current || null);
  }, [outPortalName, outPortals]);

  React.useLayoutEffect(() => {
    tryToFindOutPortal();
  }, [tryToFindOutPortal]);

  return <>{outPortalNode ? createPortal(children, outPortalNode) : null}</>;
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
