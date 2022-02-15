import Image from "next/image";
import Band from "@/components/Band";
import StyledLinkWithIcon from "@/components/ui/StyledLink";
import { Box } from "@/ui/primitives";
import Text from "@/ui/Text";
import HeroBand from "@/components/HeroBand";
import { ProjectLayout } from "@/components/ProjectStuff/ProjectLayout";

const RoundedImage = styled(Image, {
  borderRadius: "$md",
});

const MDXComponents = {
  HeroBand,
  ProjectLayout,
  Band,
  Box,
  Text,
  Image: RoundedImage,
  Link: StyledLinkWithIcon,
};

export default MDXComponents;

import { styled } from "stitches.config";
