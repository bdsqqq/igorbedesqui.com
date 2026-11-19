"use client";

import { Role } from "@ariakit/react";
import { Link } from "@tanstack/react-router";
import type { ComponentPropsWithoutRef, Ref } from "react";

export type UnstyledLinkProps = ComponentPropsWithoutRef<"a"> & {
  href: string;
  ref?: Ref<HTMLAnchorElement>;
  /** Supplying a host keeps routing with the caller, even for local hrefs. */
  render?: React.ComponentProps<typeof Role.a>["render"];
};

function UnstyledLink({
  className,
  href,
  children,
  ref,
  render,
  ...rest
}: UnstyledLinkProps) {
  const isInternalRoute = href.startsWith("/");
  const isHashLink = href.startsWith("#");

  if (isInternalRoute && render === undefined) {
    return (
      <Role.a
        ref={ref}
        render={<Link to={href} />}
        className={className}
        {...rest}
      >
        {children}
      </Role.a>
    );
  }

  return (
    <Role.a
      ref={ref}
      className={className}
      href={href}
      render={render}
      {...(!isInternalRoute && !isHashLink && { target: "_blank" })}
      {...rest}
    >
      {children}
    </Role.a>
  );
}
UnstyledLink.displayName = "UnstyledLink";

export default UnstyledLink;
