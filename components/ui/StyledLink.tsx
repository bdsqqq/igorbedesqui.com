const StyledLink = styled(UnstyledLink, {
  fontSize: "inherit",
  cursor: "pointer",

  textDecoration: "underline",
  textUnderlineOffset: "2px",

  "@motionOk": {
    transitionDuration: "150ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0.14, 0.3, 1)",
  },

  "&:hover, &:focus-within": {
    color: "$crimson11",

    "& > svg": {
      color: "$crimson11",
    },
  },

  "& > svg": {
    display: "inline",
    color: "$mauve11",
  },

  variants: {
    bold: {
      true: {
        fontWeight: "bold",
      },
    },
  },

  defaultVariants: {
    bold: true,
  },
});

import type { LinkProps } from "next/link";
interface StyledLinkProps extends LinkProps {
  href: string;
  icon?: React.ReactNode;
  iconless?: boolean;
  bold?: boolean;
}

const StyledLinkWithIcon: React.FC<StyledLinkProps> = ({
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
    <StyledLink {...rest} href={href} bold={bold}>
      {children}
      {!iconless && icon}
    </StyledLink>
  );
};

export default StyledLinkWithIcon;

import { styled } from "stitches.config";
import { UnstyledLink } from "@/ui/primitives";

import { ArrowTopRightIcon } from "@radix-ui/react-icons";
