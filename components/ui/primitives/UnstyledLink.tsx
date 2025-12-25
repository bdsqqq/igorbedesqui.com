import Link from "next/link";
import type { LinkProps } from "next/link";
import type { ComponentPropsWithoutRef, Ref } from "react";

export type UnstyledLinkProps = LinkProps &
  ComponentPropsWithoutRef<"a"> & {
    ref?: Ref<HTMLAnchorElement>;
  };

function UnstyledLink({
  className,
  href,
  children,
  ref,
  ...rest
}: UnstyledLinkProps) {
  const isInternalLink =
    typeof href == "string" && (href.startsWith("/") || href.startsWith("#"));
  if (isInternalLink) {
    return (
      <Link ref={ref} href={href} passHref className={className} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a
      ref={ref}
      className={className}
      target="_blank"
      href={href as string}
      {...rest}
    >
      {children}
    </a>
  );
}
UnstyledLink.displayName = "UnstyledLink";

export default UnstyledLink;
