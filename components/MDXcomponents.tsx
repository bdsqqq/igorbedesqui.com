import Image from "next/image";
import Band from "@/components/Band";
import StyledLinkWithIcon from "@/components/ui/StyledLink";
import { Box } from "@/ui/primitives";
import Text from "@/ui/Text";

const RoundedImage = styled(Image, {
  borderRadius: "$md",
});

const MDXComponents = {
  Band,
  Box,
  Text,
  Image: RoundedImage,
  Link: StyledLinkWithIcon,
};

export default MDXComponents;

import { styled } from "stitches.config";
