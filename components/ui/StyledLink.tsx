import type { LinkProps } from "next/link";
interface StyledLinkProps extends LinkProps {
  href: string;
  icon?: ReactNode;
  iconless?: boolean;
  bold?: boolean;
}

const StyledLinkWithIcon: FC<StyledLinkProps & HtmlHTMLAttributes<{}>> = ({
  className,
  href,
  children,
  icon = null,
  iconless,
  bold,
  ...rest
}) => {
  const ICONS_ENUM = {
    external: <ArrowTopRightIcon />,
  };

  const isInternalLink: boolean =
    (href && href.startsWith("/")) || href.startsWith("#");

  if (!iconless && icon === null && !isInternalLink) {
    icon = ICONS_ENUM.external;
  }

  return (
    <UnstyledLink
      className={clsx(
        bold && "font-bold",
        "cursor-pointer underline underline-offset-2 motion-safe:transition-colors motion-safe:duration-moderate-01 motion-safe:ease-productive-standard hover:text-crimson11 [&>svg]:inline",
        className
      )}
      href={href}
      {...rest}
    >
      {children}
      {!iconless && icon}
    </UnstyledLink>
  );
};

export default StyledLinkWithIcon;

import { UnstyledLink } from "@/ui/primitives";

import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import type { FC, HtmlHTMLAttributes, ReactNode } from "react";
