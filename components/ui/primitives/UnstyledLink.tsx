export type UnstyledLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps

export const UnstyledLink = React.forwardRef<HTMLAnchorElement, UnstyledLinkProps>(({ className, href, ...rest }, ref) => {
  if (!href) return (<a className={className} {...rest} ref={ref} />)

  const isInternalLink = (href.startsWith("/") || href.startsWith("#") || typeof href === "object"); // href can be an object if it is an URLObject from NextJS
  if (isInternalLink) {
    return (
      <Link href={href} passHref className={className} {...rest} ref={ref} />
    );
  }

  return (
    <a className={className} target="_blank" href={href} {...rest} ref={ref} />
  );
})

export default UnstyledLink;

import React from "react";
import Link from "next/link";
import type { LinkProps } from "next/link";