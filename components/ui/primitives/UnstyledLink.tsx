const UnstyledLink = ({
  className,
  href,
  children,
  ...rest
}: LinkProps & HtmlHTMLAttributes<{}>) => {
  const isInternalLink =
    typeof href == "string" && (href.startsWith("/") || href.startsWith("#"));
  if (isInternalLink) {
    return (
      <Link href={href} passHref className={className} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    // eslint-disable-next-line react/jsx-no-target-blank
    <a className={className} target="_blank" href={href as string} {...rest}>
      {children}
    </a>
  );
};

export default UnstyledLink;

import Link from "next/link";
import type { LinkProps } from "next/link";
import type { HtmlHTMLAttributes } from "react";
