const UnstyledLink: FC<LinkProps & HtmlHTMLAttributes<{}>> = ({
  className,
  href,
  children,
  ...rest
}) => {
  const isInternalLink =
    typeof href == "string" && (href.startsWith("/") || href.startsWith("#"));
  if (isInternalLink) {
    return (
      <Link href={href} passHref {...rest}>
        <a className={className} {...rest}>
          {children}
        </a>
      </Link>
    );
  }

  return (
    // eslint-disable-next-line react/jsx-no-target-blank
    <a className={className} target="_blank" href={href as string} {...rest}>
      {children}
      <span className="sr-only">Opens in a new tab</span>
    </a>
  );
};

export default UnstyledLink;

import Link from "next/link";
import type { LinkProps } from "next/link";
import type { FC, HtmlHTMLAttributes } from "react";
