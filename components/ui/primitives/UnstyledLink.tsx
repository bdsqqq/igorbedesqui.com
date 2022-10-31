import type { LinkProps } from "next/link";

const UnstyledLink: React.FC<LinkProps & React.HtmlHTMLAttributes<{}>> = ({
  className,
  href,
  children,
  ...rest
}) => {
  const isInternalLink =
    typeof href == "string" && (href.startsWith("/") || href.startsWith("#"));
  const { t } = useTypeSafeTranslation("common");

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
      <span className="sr-only">{t("newTab")}</span>
    </a>
  );
};

export default UnstyledLink;

import Link from "next/link";
import { useTypeSafeTranslation } from "@/hooks/useTypeSafeTranslation";
import React from "react";
