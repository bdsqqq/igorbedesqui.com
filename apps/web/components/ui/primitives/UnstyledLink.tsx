"use client";

import { Role } from "@ariakit/react";
import { Link } from "@tanstack/react-router";
import type { ComponentPropsWithoutRef, Ref } from "react";

export type UnstyledLinkProps = ComponentPropsWithoutRef<"a"> & {
  href: string;
  ref?: Ref<HTMLAnchorElement>;
};

function UnstyledLink({
  className,
  href,
  children,
  ref,
  ...rest
}: UnstyledLinkProps) {
  const isInternalRoute = href.startsWith("/");
  const isHashLink = href.startsWith("#");

  if (isInternalRoute) {
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
      {...(!isHashLink && { target: "_blank" })}
      {...rest}
    >
      {children}
    </Role.a>
  );
}
UnstyledLink.displayName = "UnstyledLink";

export default UnstyledLink;
