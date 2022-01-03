const StyledLink = styled(UnstyledLink, {
  display: "inline-flex",
  alignItems: "center",
  gap: "$spacing-01",

  fontSize: "inherit",
  cursor: "pointer",
  fontWeight: "bold",

  textDecoration: "underline",
  textUnderlineOffset: "2px",

  transitionDuration: "150ms",
  transitionTimingFunction: "cubic-bezier(0.4, 0.14, 0.3, 1)",

  "&:hover, &:focus-within": {
    color: "$crimson11",
  },

  "& > svg": {
    transform: "translateY(-2px)",
  },
});

const StyledLinkWithIcon = ({
  href,
  children,
  icon = null,
  iconless,
}: {
  href: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  iconless?: boolean;
}) => {
  const ICONS_ENUM = {
    external: <ArrowTopRightIcon />,
    twitter: <TwitterLogoIcon />,
    github: <GitHubLogoIcon />,
  };
  const isInternalLink = href && (href.startsWith("/") || href.startsWith("#"));

  // Sets the icon automatically if icon isn't set in props.
  // Only runs this logic if this link isn't iconless
  !iconless && icon == null && isInternalLink
    ? (icon = null)
    : href.startsWith("https://www.github.com") ||
      href.startsWith("https://github.com")
    ? (icon = ICONS_ENUM["github"])
    : href.startsWith("https://www.twitter.com") ||
      href.startsWith("https://twitter.com")
    ? (icon = ICONS_ENUM["twitter"])
    : (icon = ICONS_ENUM["external"]);

  return (
    <StyledLink href={href}>
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
