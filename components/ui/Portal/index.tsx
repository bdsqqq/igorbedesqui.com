import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";
import { newId } from "@/lib/id";
import React, { useMemo } from "react";
import { createPortal } from "react-dom";

type InPortal = {
  id: string;
  name: string;
  intendedOut: string;
};
type OutPortal = {
  id: string;
  name: string;
  element: HTMLElement | null;
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

export const useRegisterOutPortal = ({
  name,
  element,
}: {
  name: string;
  element: HTMLElement | null;
}) => {
  const { addOutPortal, removeOutPortal } = useStore(PortalStore);
  const id = React.useMemo(() => newId("portal"), []);
  const portal = useMemo(() => ({ id, name, element }), [id, name, element]);

  React.useEffect(() => {
    addOutPortal(portal);

    return () => {
      removeOutPortal(portal.id);
    };
  }, [portal, addOutPortal, removeOutPortal]);
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
    const element =
      outPortals.find((p) => p.name === outPortalName)?.element || null;

    setOutPortalNode(element);
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
  const ref = React.useRef<HTMLDivElement>(null);
  useRegisterOutPortal({ name, element: ref.current });

  return <div ref={ref} {...rest} />;
}
