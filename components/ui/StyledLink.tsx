const StyledLink = styled(UnstyledLink, {
  cursor: "pointer",
  fontWeight: "bold",

  color: "$mauve12",
  borderBottom: "2px",
  borderColor: "CurrentColor",
  borderStyle: "solid",

  transitionDuration: "150ms",
  transitionTimingFunction: "cubic-bezier(0.4, 0.14, 0.3, 1)",

  "&:hover, &:focus-within": {
    color: "$crimson11",
  },
});

export default StyledLink;

import { styled } from "stitches.config";
import { UnstyledLink } from "@/ui/primitives";
