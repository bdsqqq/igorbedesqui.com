import Image from "next/image";
import Band from "@/components/Band";
import StyledLinkWithIcon from "@/components/ui/StyledLink";

const RoundedImage = styled(Image, {
  borderRadius: "$md",
});

const MDXComponents = {
  Band,
  Image: RoundedImage,
  Link: StyledLinkWithIcon,
};

export default MDXComponents;

import { styled } from "stitches.config";
