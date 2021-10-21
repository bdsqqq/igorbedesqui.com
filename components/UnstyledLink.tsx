type unstyledLink = {
  href: string;
  className?: HTMLAttributes<HTMLAnchorElement>["className"];
};

const UnstyledLink: React.FC<unstyledLink> = ({
  href,
  children,
  className,
  ...rest
}) => {
  const isInternalLink = href && (href.startsWith("/") || href.startsWith("#"));
  const { t } = useTranslation("common");

  if (isInternalLink) {
    return (
      <Link href={href}>
        <a {...rest} className={`${className}`}>
          {children}
        </a>
      </Link>
    );
  }

  return (
    <a
      className={`${className}`}
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      {...rest}
    >
      {children}
      <span className="sr-only">{t("newTab")}</span>
    </a>
  );
};

export default UnstyledLink;

import Link from "next/link";
import { HTMLAttributes } from "react";
import useTranslation from "next-translate/useTranslation";
