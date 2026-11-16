"use client";

import type { ComponentPropsWithRef } from "react";
import { ArrowLeftIcon, PinLeftIcon } from "@radix-ui/react-icons";
import { useBreadcrumbsStore } from "@/providers/breadcrumbs";
import { UnstyledLink } from "@/ui/primitives";
import type { UnstyledLinkProps } from "@/ui/primitives/UnstyledLink";
import { cn } from "@/lib/styling";

export type BackNavigationProps =
  | { backable?: false; backMessage?: never; backAnchor?: never }
  | { backable: true; backMessage?: string; backAnchor?: string };

type MainNavBaseProps = Omit<ComponentPropsWithRef<"nav">, "children"> & {
  backLinkProps?: Omit<UnstyledLinkProps, "href" | "children">;
};

export type MainNavProps = BackNavigationProps &
  MainNavBaseProps & {
    /** Omit to use application history; [] deliberately supplies no history. */
    breadcrumbs?: readonly string[];
  };

export type MainNavViewProps = BackNavigationProps &
  MainNavBaseProps & {
    breadcrumbs: readonly string[];
  };

export function resolveBackAnchor(
  breadcrumbs: readonly string[],
  backAnchor?: string,
): string {
  for (let i = breadcrumbs.length - 1; i >= 0; i--) {
    if (breadcrumbs[i] === backAnchor || breadcrumbs[i] === "/") {
      return breadcrumbs[i];
    }
  }
  return "/";
}

/** History is an app service, not a hidden dependency of supplied navigation. */
function MainNav(props: MainNavProps) {
  return props.breadcrumbs !== undefined ? (
    <MainNavView {...props} breadcrumbs={props.breadcrumbs} />
  ) : (
    <HistoryMainNav {...props} />
  );
}

function HistoryMainNav(props: MainNavProps) {
  const breadcrumbs = useBreadcrumbsStore((state) => state.breadcrumbs);
  return <MainNavView {...props} breadcrumbs={breadcrumbs} />;
}

export function MainNavView({
  backable,
  backMessage,
  backAnchor,
  breadcrumbs,
  backLinkProps,
  className,
  ...props
}: MainNavViewProps) {
  const anchor = resolveBackAnchor(breadcrumbs, backAnchor);
  return (
    <nav
      className={cn(
        "relative z-aboveVignette flex w-full items-start justify-start p-8 md:mx-auto md:px-16",
        backable && "justify-between",
        className,
      )}
      {...props}
    >
      {backable && (
        <UnstyledLink
          href={anchor}
          aria-label={backMessage === "" ? "Back" : undefined}
          {...backLinkProps}
          className={cn(
            "group -mx-4 flex translate-x-0 transform cursor-pointer select-none items-center gap-1 px-4 pb-0 text-xl ak-ink-85 duration-moderate-01 ease-productive-standard hover:-translate-x-2 hover:ak-ink-100 focus:-translate-x-2 focus:ak-ink-100 motion-safe:transition-all",
            backLinkProps?.className,
          )}
        >
          <span className="shrink-0 translate-y-px">
            {anchor === "/" ? <PinLeftIcon /> : <ArrowLeftIcon />}
          </span>
          <span className="ml-1 opacity-[0.01] duration-fast-02 ease-productive-standard group-hover:opacity-100 group-focus:opacity-100 motion-safe:transition-opacity">
            {backMessage ?? "Back"}
          </span>
        </UnstyledLink>
      )}
    </nav>
  );
}

export default MainNav;
