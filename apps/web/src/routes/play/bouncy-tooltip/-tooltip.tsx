"use client";

import React from "react";
import { useStore } from "zustand";
import { AnimatePresence } from "motion/react";
import {
  Tooltip,
  TooltipAnchor,
  TooltipProvider,
  Portal,
} from "@ariakit/react";
import { cn } from "@/lib/styling";
import {
  createBouncyTooltipStore,
  type BouncyTooltipStore,
  type BouncyTooltipState,
  type BouncyTooltipPosition,
} from "./-store";
export * from "./-store";
export {
  AnimatedElements,
  type AnimationName,
  type AnimatedMedia,
} from "./-animated-elements";

export type BouncyTooltipOwner =
  | { store: BouncyTooltipStore; initialPosition?: never }
  | { store?: never; initialPosition?: BouncyTooltipPosition };
const Context = React.createContext<BouncyTooltipStore | null>(null);

/** Each root owns an independent identity. Ownership inputs initialize once; remount to change.
 * Position uses viewport coordinates, including in bounded layouts and portalled overlays.
 * Supplied stores are never reset on unmount. No global pointer listeners are installed.
 */
export function BouncyTooltipRoot({
  children,
  store,
  initialPosition,
}: React.PropsWithChildren<BouncyTooltipOwner>) {
  if (store !== undefined && initialPosition !== undefined)
    throw new Error("BouncyTooltipRoot: supply store OR initialPosition");
  const [instance] = React.useState(
    () => store ?? createBouncyTooltipStore(initialPosition),
  );
  return (
    <Context.Provider value={instance}>
      <TooltipState>{children}</TooltipState>
    </Context.Provider>
  );
}
export const CursorWithAttachedElement = BouncyTooltipRoot;
export function useBouncyTooltipStore() {
  const store = React.useContext(Context);
  if (!store)
    throw new Error("BouncyTooltip parts must be inside BouncyTooltipRoot");
  return store;
}
export function useBouncyTooltip<T>(
  selector: (state: BouncyTooltipState) => T,
) {
  return useStore(useBouncyTooltipStore(), selector);
}
function TooltipState({ children }: React.PropsWithChildren) {
  const store = useBouncyTooltipStore();
  const open = useBouncyTooltip((state) => state.isHovering);
  return (
    <TooltipProvider
      showTimeout={0}
      open={open}
      setOpen={(value) => store.getState().setIsHovering(value)}
    >
      {children}
    </TooltipProvider>
  );
}
export function BouncyTooltip({
  label,
  children,
  ...owner
}: React.PropsWithChildren<BouncyTooltipOwner & { label: React.ReactNode }>) {
  return (
    <BouncyTooltipRoot {...owner}>
      <CursorWithAttachedElementTrigger>
        {label}
      </CursorWithAttachedElementTrigger>
      <CursorWithAttachedElementContent>
        {children}
      </CursorWithAttachedElementContent>
    </BouncyTooltipRoot>
  );
}

/** The real trigger owns native hover/focus/ARIA; the virtual rect only positions content.
 * In particular, pointer-opened popovers must not turn autofocus into keyboard intent.
 */
export function CursorWithAttachedElementTrigger({
  className,
  onPointerEnter,
  onPointerMove,
  onFocusVisible,
  ...props
}: Omit<React.ComponentPropsWithRef<typeof TooltipAnchor>, "store">) {
  const store = useBouncyTooltipStore();
  return (
    <TooltipAnchor
      {...props}
      className={cn(
        "ak-frame ak-frame-field/1 cursor-alias focus-visible:ak-outline focus-visible:outline-2 focus-visible:outline-offset-2",
        className,
      )}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (!event.defaultPrevented) {
          store.getState().updatePos(event.clientX, event.clientY);
        }
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (!event.defaultPrevented)
          store.getState().updatePos(event.clientX, event.clientY);
      }}
      onFocusVisible={(event) => {
        onFocusVisible?.(event);
        if (!event.defaultPrevented) {
          const rect = event.currentTarget.getBoundingClientRect();
          store.getState().updatePos(rect.right, rect.top);
        }
      }}
    />
  );
}
export function CursorWithAttachedElementContent({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof Tooltip>) {
  const pos = useBouncyTooltip((state) => state.pos);
  const shown = useBouncyTooltip((state) => state.isHovering);
  return (
    <AnimatePresence>
      {shown ? (
        <Portal>
          <Tooltip
            fixed
            getAnchorRect={() => new DOMRect(pos.x, pos.y, 0, 0)}
            shift={144}
            {...props}
            className={cn("pointer-events-none", className)}
          />
        </Portal>
      ) : null}
    </AnimatePresence>
  );
}
