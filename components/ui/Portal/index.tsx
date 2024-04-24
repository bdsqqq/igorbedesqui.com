import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";
import { newId } from "@/lib/id";
import React, { useMemo, useRef } from "react";
import { createPortal } from "react-dom";

type InPortal = {
  id: string; // mostly for logging/debugging. Name *should*  be unique, but it's not enforced.
  name: string;
  intendedOut: string;
};
type OutPortal = {
  id: string; // mostly for logging/debugging. Name *should*  be unique, but it's not enforced.
  name: string;
  ref: React.RefObject<HTMLElement> | null;
};
interface PortalStore {
  inPortals: ReadonlyArray<InPortal>;
  outPortals: ReadonlyArray<OutPortal>;

  addInPortal: (portal: InPortal) => void;
  removeInPortal: (id: string) => void;

  addOutPortal: (portal: OutPortal) => void;
  removeOutPortal: (id: string) => void;
}
export const PortalStore = createStore<PortalStore>((set) => ({
  inPortals: [],
  outPortals: [],

  addInPortal: (portal) =>
    set((state) => ({ inPortals: [...state.inPortals, portal] })),
  removeInPortal: (id) =>
    set((state) => ({ inPortals: state.inPortals.filter((p) => p.id !== id) })),

  addOutPortal: (portal) =>
    set((state) => ({ outPortals: [...state.outPortals, portal] })),
  removeOutPortal: (id) =>
    set((state) => ({
      outPortals: state.outPortals.filter((p) => p.id !== id),
    })),
}));

const useRegisterInPortal = ({
  name,
  intendedOut,
}: {
  name: string;
  intendedOut: string;
}) => {
  const { addInPortal, removeInPortal } = useStore(PortalStore);
  const id = React.useMemo(() => newId("portal"), []);
  const portal = useMemo(
    () => ({ id, name, intendedOut }),
    [id, name, intendedOut],
  );

  React.useEffect(() => {
    addInPortal(portal);

    return () => {
      removeInPortal(portal.id);
    };
  }, [portal, addInPortal, removeInPortal]);
};

/**
 * Returns a ref that will make an element into an `OutPortal`.
 */
export const useOutPortal = <T extends HTMLElement>(name: string) => {
  const { addOutPortal, removeOutPortal } = useStore(PortalStore);
  const id = React.useMemo(() => newId("portal"), []);

  const ref = useRef<T>(null);

  React.useEffect(() => {
    addOutPortal({ id, name, ref });

    return () => {
      removeOutPortal(id);
    };
  }, [id, name, ref, addOutPortal, removeOutPortal]);

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
  outPortalName: string;
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

interface OutPortalProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
}

/**
 * Renders a DOM node that can be targeted by an `InPortal`.
 */
export function OutPortal({ name, ...rest }: OutPortalProps) {
  const ref = useOutPortal<HTMLDivElement>(name);

  return <div ref={ref} {...rest} />;
}
