export default function IBM() {
  return (
    <>
      <Seo title="IBM" description="IBM" url="p/ibm" ogText="" />
      {/* TODO: actual title and description */}

      <Container key="bebopProj" backable>
        <HeroBand heroVideo={"/videos/ibm/tapes"}>Hej do</HeroBand>
      </Container>
      <FABContainer>
        <BackToTop />
      </FABContainer>
    </>
  );
}

import Container from "@/components/Container";
import Seo from "@/components/Seo";
import Band from "@/components/Band";
import HeroBand from "@/components/HeroBand";
import { FABContainer } from "@/ui/primitives/";
import BackToTop from "@/ui/BackToTop";
import StyledLink from "@/ui/StyledLink";
