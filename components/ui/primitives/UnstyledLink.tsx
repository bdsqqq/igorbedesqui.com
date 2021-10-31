type unstyledLink = {
  href: string;
};

const UnstyledLink: React.FC<unstyledLink> = ({ href, children, ...rest }) => {
  const isInternalLink = href && (href.startsWith("/") || href.startsWith("#"));
  const { t } = useTranslation("common");

  if (isInternalLink) {
    return (
      <Link href={href} passHref>
        <A {...rest}>{children}</A>
      </Link>
    );
  }

  return (
    <A target="_blank" rel="noopener noreferrer" href={href} {...rest}>
      {children}
      <SrOnly>{t("newTab")}</SrOnly>
    </A>
  );
};

const A = styled("a");

export default UnstyledLink;

import { styled } from "stitches.config";

import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { SrOnly } from "@/ui/primitives";
