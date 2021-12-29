const StyledLink = styled(UnstyledLink, {
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
});

export default StyledLink;

import { styled } from "stitches.config";
import { UnstyledLink } from "@/ui/primitives";
