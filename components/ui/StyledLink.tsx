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
      className={cn(
        cva(
          "cursor-pointer underline underline-offset-2 focus-within:text-white hover:text-white motion-safe:transition-colors motion-safe:duration-moderate-01 motion-safe:ease-productive-standard",
          {
            variants: {
              bold: {
                true: "font-bold",
              },
            },
          }
        )({ bold: bold }),
        className
      )}
      href={href}
      {...rest}
    >
      {children}
      {!iconless && (
        <span className="whitespace-nowrap [&>svg]:inline">
          {/* don't allow for line breaks between copy and icon */}
          {"\u00a0"}
          {icon}
        </span>
      )}
    </UnstyledLink>
  );
};

export default StyledLinkWithIcon;

import { UnstyledLink } from "@/ui/primitives";

import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/styling";
import type { FC, HtmlHTMLAttributes, ReactNode } from "react";
