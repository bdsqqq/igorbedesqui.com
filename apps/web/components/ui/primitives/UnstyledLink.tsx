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
      <Link ref={ref} to={href} className={className} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a
      ref={ref}
      className={className}
      href={href}
      {...(!isHashLink && { target: "_blank" })}
      {...rest}
    >
      {children}
    </a>
  );
}
UnstyledLink.displayName = "UnstyledLink";

export default UnstyledLink;
