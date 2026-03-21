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
  const isInternalLink = href.startsWith("/") || href.startsWith("#");

  return (
    <a
      ref={ref}
      className={className}
      href={href}
      {...(!isInternalLink && { target: "_blank" })}
      {...rest}
    >
      {children}
    </a>
  );
}
UnstyledLink.displayName = "UnstyledLink";

export default UnstyledLink;
