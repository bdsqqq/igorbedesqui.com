import type { LinkProps } from "next/link";

const UnstyledLink: React.FC<LinkProps> = ({ href, children, ...rest }) => {
  const isInternalLink =
    typeof href == "string" && (href.startsWith("/") || href.startsWith("#"));
  const { t } = useTranslation("common");

  if (isInternalLink) {
    return (
      <Link href={href} passHref {...rest}>
        <a {...rest}>{children}</a>
      </Link>
    );
  }

  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href as string}
      {...rest}
    >
      {children}
      <SrOnly>{t("newTab")}</SrOnly>
    </a>
  );
};

export default UnstyledLink;

import { styled } from "stitches.config";

import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { SrOnly } from "@/ui/primitives";
