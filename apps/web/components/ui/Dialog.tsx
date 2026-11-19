"use client";

import * as React from "react";
import * as Ariakit from "@ariakit/react";
import { cn } from "@/lib/styling";
import type { OpenStateProps, AsChildProps } from "./ownership";

const DialogModalContext = React.createContext(true);

function Dialog({
  children,
  open,
  defaultOpen,
  onOpenChange,
  modal = true,
}: React.PropsWithChildren<OpenStateProps & { modal?: boolean }>) {
  if (open !== undefined && (defaultOpen !== undefined || !onOpenChange)) {
    throw new Error(
      "Dialog requires onOpenChange with open and forbids defaultOpen with open",
    );
  }
  return (
    <Ariakit.DialogProvider
      open={open}
      defaultOpen={defaultOpen}
      setOpen={onOpenChange}
    >
      <DialogModalContext value={modal}>{children}</DialogModalContext>
    </Ariakit.DialogProvider>
  );
}

function DialogTrigger({
  asChild,
  children,
  ...props
}: AsChildProps<React.ComponentPropsWithRef<typeof Ariakit.DialogDisclosure>>) {
  if (asChild && props.render !== undefined) {
    throw new Error("DialogTrigger accepts either asChild or render");
  }
  const context = Ariakit.useDialogContext();
  const store = props.store ?? context;
  const open = Ariakit.useStoreState(store, "open");
  return (
    <Ariakit.DialogDisclosure
      data-state={open ? "open" : "closed"}
      {...props}
      render={asChild ? React.Children.only(children) : props.render}
    >
      {asChild ? undefined : children}
    </Ariakit.DialogDisclosure>
  );
}

function DialogClose({
  asChild,
  children,
  ...props
}: AsChildProps<React.ComponentPropsWithRef<typeof Ariakit.DialogDismiss>>) {
  if (asChild && props.render !== undefined) {
    throw new Error("DialogClose accepts either asChild or render");
  }
  return (
    <Ariakit.DialogDismiss
      {...props}
      render={asChild ? React.Children.only(children) : props.render}
    >
      {asChild ? null : children}
    </Ariakit.DialogDismiss>
  );
}

function DialogPortal({
  container,
  forceMount,
  ...props
}: Ariakit.PortalProps & {
  container?: HTMLElement | null;
  forceMount?: true;
}) {
  const store = Ariakit.useDialogContext();
  const mounted = Ariakit.useStoreState(store, "mounted");
  if (!forceMount && !mounted) return null;
  return <Ariakit.Portal portalElement={container} {...props} />;
}

function DialogOverlay({ className, ...props }: React.ComponentProps<"div">) {
  const store = Ariakit.useDialogContext();
  const open = Ariakit.useStoreState(store, "open");
  return (
    <div
      data-state={open ? "open" : "closed"}
      className={cn(
        "surface-backdrop ak-layer ak-layer-canvas fixed inset-0 z-aboveVignette",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  surface = true,
  ...props
}: Ariakit.DialogProps & { surface?: boolean }) {
  const modal = React.useContext(DialogModalContext);
  const context = Ariakit.useDialogContext();
  const store = props.store ?? context;
  const open = Ariakit.useStoreState(store, "open");
  return (
    <Ariakit.Dialog
      modal={modal}
      backdrop={modal ? <DialogOverlay /> : false}
      portal
      unmountOnHide
      data-state={open ? "open" : "closed"}
      className={cn(
        "fixed left-1/2 top-1/2 z-aboveVignette grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
        surface &&
          "surface-dialog ak-layer ak-layer-lighten-6 ak-frame ak-frame-dialog/dialog",
        className,
      )}
      {...props}
    >
      {children}
    </Ariakit.Dialog>
  );
}

const DialogHeader = ({
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
const DialogFooter = ({
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);

function DialogTitle({ className, ...props }: Ariakit.DialogHeadingProps) {
  return (
    <Ariakit.DialogHeading
      render={<h2 />}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: Ariakit.DialogDescriptionProps) {
  return (
    <Ariakit.DialogDescription
      className={cn("ak-ink-70 text-sm", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
