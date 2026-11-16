"use client";

import React from "react";
import { useStore } from "zustand";
import { motion } from "motion/react";
import { cn } from "@/lib/styling";
import {
  createCursorPositionStore,
  type CursorPositionState,
  type CursorPositionStore,
  type Position,
} from "./store";
export * from "./store";

export type SyncedPositionsOwner =
  | { store: CursorPositionStore; initialPosition?: never }
  | { store?: never; initialPosition?: Position };
const Context = React.createContext<CursorPositionStore | null>(null);

/** Store and initialPosition initialize once. Remount to replace ownership. No global listeners. */
export function SyncedPositionsRoot({
  children,
  store,
  initialPosition,
}: React.PropsWithChildren<SyncedPositionsOwner>) {
  if (store !== undefined && initialPosition !== undefined)
    throw new Error("SyncedPositionsRoot: supply store OR initialPosition");
  const [instance] = React.useState(
    () => store ?? createCursorPositionStore(initialPosition),
  );
  return <Context.Provider value={instance}>{children}</Context.Provider>;
}
export function useSyncedPositionsStore() {
  const store = React.useContext(Context);
  if (!store)
    throw new Error("SyncedPositions parts must be inside SyncedPositionsRoot");
  return store;
}
export function useSyncedPositions<T>(
  selector: (state: CursorPositionState) => T,
) {
  return useStore(useSyncedPositionsStore(), selector);
}

export function SyncedPositions({
  children,
  store,
  initialPosition,
  ...props
}: React.ComponentPropsWithRef<"div"> & SyncedPositionsOwner) {
  if (store !== undefined && initialPosition !== undefined)
    throw new Error("SyncedPositions: supply store OR initialPosition");
  return (
    <SyncedPositionsRoot
      {...(store !== undefined ? { store } : { initialPosition })}
    >
      <div {...props}>
        {children === undefined
          ? Array.from({ length: 11 }, (_, i) => (
              <SyncedPositionSurface key={i} />
            ))
          : children}
      </div>
    </SyncedPositionsRoot>
  );
}
export function SyncedPositionSurface({
  className,
  children,
  onMouseMove,
  ...props
}: React.ComponentPropsWithRef<"div">) {
  const store = useSyncedPositionsStore();
  return (
    <div
      {...props}
      className={cn(
        "ak-layer ak-layer-darken-3 ak-frame ak-frame-card/0 ak-frame-border -ak-frame-m-px relative w-[calc(100%+2px)] h-[calc(4rem+2px)]",
        className,
      )}
      onMouseMove={(event) => {
        onMouseMove?.(event);
        if (event.defaultPrevented) return;
        // currentTarget stays the surface when the pointer crosses caller children.
        const rect = event.currentTarget.getBoundingClientRect();
        store
          .getState()
          .updatePos(event.clientX - rect.left, event.clientY - rect.top);
      }}
    >
      {children === undefined ? <SyncedPositionCrosshair /> : children}
    </div>
  );
}
export function SyncedPositionCrosshair({
  className,
  style,
  ...props
}: React.ComponentPropsWithRef<typeof motion.div>) {
  const pos = useSyncedPositions((state) => state.pos);
  return (
    <motion.div
      {...props}
      className={cn(
        "ak-layer ak-layer-primary ak-layer-contrast ak-frame ak-frame-badge/0 absolute pointer-events-none h-1 w-1",
        className,
      )}
      style={{ ...pos, ...style }}
    />
  );
}
