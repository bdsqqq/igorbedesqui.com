export default function IBM() {
  const { t, lang } = useTypeSafeTranslation("projs/bebop");

  return (
    <>
      <Seo t={t} lang={lang} url="p/ibm" />

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

import { useTypeSafeTranslation } from "@/hooks/useTypeSafeTranslation";
import TransWithComps from "@/components/i18nStuff/TransWithComps";

import Container from "@/components/Container";
import Seo from "@/components/Seo";
import Band from "@/components/Band";
import HeroBand from "@/components/HeroBand";
import { FABContainer } from "@/ui/primitives/";
import BackToTop from "@/ui/BackToTop";
import StyledLink from "@/ui/StyledLink";
