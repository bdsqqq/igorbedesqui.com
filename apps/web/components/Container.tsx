export type ContainerProps = React.ComponentPropsWithRef<"div"> & {
  mainProps?: Omit<React.ComponentPropsWithRef<"main">, "children">;
  /** undefined uses the site footer; null deliberately omits it. */
  footer?: React.ReactNode;
} & (
    | (BackNavigationProps & { navigation?: never })
    | {
        navigation: React.ReactNode;
        backable?: never;
        backMessage?: never;
        backAnchor?: never;
      }
  );

/** Application shell: GridOverlay uses the app's PortalStoreProvider.
 * Reusable features stay outside this shell; null navigation/footer deliberately omit them.
 */
function Container({
  backable,
  backMessage,
  backAnchor,
  children,
  navigation,
  footer,
  mainProps,
  className,
  ...props
}: ContainerProps) {
  return (
    <>
      <div className="bg-canvas pointer-events-none absolute inset-0 z-30 opacity-0 motion-safe:animate-fadeOut" />

      <div className={cn("relative mx-auto max-w-7xl", className)} {...props}>
        <div className="relative min-h-screen">
          {navigation !== undefined ? (
            navigation
          ) : !backable ? (
            <MainNav />
          ) : (
            <MainNav
              backable={backable}
              backMessage={backMessage}
              backAnchor={backAnchor}
            />
          )}
          <GridOverlay />
          <div className="relative -mr-2 flex min-h-[calc(100vh_-_104px)] w-full flex-col justify-between gap-16">
            <main
              {...mainProps}
              className={cn(
                "flex flex-col justify-center",
                mainProps?.className,
              )}
            >
              {children}
            </main>
            {footer === undefined ? <Footer /> : footer}
          </div>
        </div>
      </div>
    </>
  );
}

export default Container;

import React from "react";

import { Overlay as GridOverlay } from "@/components/ui/Grid/Overlay";
import MainNav, { type BackNavigationProps } from "@/components/MainNav";
import { cn } from "@/lib/styling";
import Footer from "@/components/Footer";
