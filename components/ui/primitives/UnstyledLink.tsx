export type UnstyledLinkProps = LinkProps & ComponentPropsWithoutRef<"a">;

const UnstyledLink = forwardRef<HTMLAnchorElement, UnstyledLinkProps>(
  ({ className, href, children, ...rest }, ref) => {
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
      // eslint-disable-next-line react/jsx-no-target-blank
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
  },
);
UnstyledLink.displayName = "UnstyledLink";

export default UnstyledLink;

import Link from "next/link";
import type { LinkProps } from "next/link";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type HtmlHTMLAttributes,
} from "react";
