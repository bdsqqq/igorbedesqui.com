export default function IBM() {
  return (
    <>
      <Seo title="IBM" description="IBM" url="p/ibm" />
      {/* TODO: actual title and description */}

      <Container key="bebopProj" backable>
        <HeroBand fullBleed heroVideo={"/videos/ibm/tapes"}>
          <TransWithComps text={""} />
        </HeroBand>
      </Container>
      <FABContainer>
        <BackToTop />
      </FABContainer>
    </>
  );
}

import TransWithComps from "@/components/i18nStuff/TransWithComps";

import Container from "@/components/Container";
import Seo from "@/components/Seo";
import Band from "@/components/Band";
import HeroBand from "@/components/HeroBand";
import { FABContainer } from "@/ui/primitives/";
import BackToTop from "@/ui/BackToTop";
import StyledLink from "@/ui/StyledLink";
