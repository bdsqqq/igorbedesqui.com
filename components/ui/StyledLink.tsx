const StyledLink = styled(UnstyledLink, {
  fontSize: "inherit",
  cursor: "pointer",

  textDecoration: "underline",
  textUnderlineOffset: "2px",

  transitionDuration: "150ms",
  transitionTimingFunction: "cubic-bezier(0.4, 0.14, 0.3, 1)",

  "&:hover, &:focus-within": {
    color: "$crimson11",
  },

  "& > svg": {
    display: "inline",
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
    twitter: <TwitterLogoIcon />,
    github: <GitHubLogoIcon />,
  };

  // TODO: make this into a switch statement?
  //TODO: make a function to get the domainName from the href withouth the subdomain and TLD

  const isInternalLink: boolean =
    (href && href.startsWith("/")) || href.startsWith("#");

  if (!iconless && icon === null && !isInternalLink) {
    if (
      href.startsWith("https://www.twitter.com") ||
      href.startsWith("https://twitter.com")
    ) {
      icon = ICONS_ENUM.twitter;
    } else if (
      href.startsWith("https://www.github.com") ||
      href.startsWith("https://github.com")
    ) {
      icon = ICONS_ENUM.github;
    } else {
      icon = ICONS_ENUM.external;
    }
  }

  return (
    <StyledLink {...rest} href={href} bold={bold}>
      {children} {!iconless && icon}
    </StyledLink>
  );
};

export default StyledLinkWithIcon;

import { styled } from "stitches.config";
import { UnstyledLink } from "@/ui/primitives";

import {
  ArrowTopRightIcon,
  TwitterLogoIcon,
  GitHubLogoIcon,
} from "@radix-ui/react-icons";
