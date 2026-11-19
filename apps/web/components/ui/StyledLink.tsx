export interface StyledLinkProps extends ComponentProps<typeof UnstyledLink> {
  href: string;
  icon?: ReactNode;
  iconless?: boolean;
  bold?: boolean;
}

function StyledLinkWithIcon({
  className,
  href,
  children,
  icon = null,
  iconless,
  bold,
  ...rest
}: StyledLinkProps) {
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
          "cursor-pointer underline underline-offset-2 [:where(&)]:text-inherit hover:ak-ink-100 focus-visible:ak-ink-100 focus-visible:ak-outline focus-visible:ak-outline-primary focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:transition-colors motion-safe:duration-moderate-01 motion-safe:ease-productive-standard",
          {
            variants: {
              bold: {
                true: "font-bold",
              },
            },
          },
        )({ bold: bold }),
        className,
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
}

export default StyledLinkWithIcon;

import { UnstyledLink } from "@/ui/primitives";

import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/styling";
import type { ComponentProps, ReactNode } from "react";
