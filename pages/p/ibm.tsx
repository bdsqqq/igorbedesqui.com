export default function Bebop() {
  const { t, lang } = useTypeSafeTranslation("projs/bebop");
  const bebopMeta = useMeta("bebop", "projs");
  const wasmGifMeta = useMeta("wasmGif", "projs");

  return (
    <>
      <Seo t={t} lang={lang} url="p/ibm" />

      <Container key="bebopProj" backable>
        <HeroBand heroVideo={"/videos/ibm/tapes"}>
          <TransWithComps text={""} />
        </HeroBand>

        <Band smolPadding gridless id="update">
          <Text
            as="h2"
            css={{
              fontSize: "$lg",
              fontWeight: "bold",
              color: "$mauve11",
              textTransform: "uppercase",
              marginBottom: "$spacing-03",
            }}
          >
            Disclaimer
          </Text>
          <p>
            For legal reasons: While working full time for IBM, I was hired
            through a third party and technically was a consultant,{" "}
            <StyledLink href="/p/ibm/rant#cost-saving">
              here are my very sincere feelings on this.
            </StyledLink>
          </p>
        </Band>
        <Band smolPadding headline={{ bold: "01", thin: "timeline" }}>
          <Box
            css={{
              position: "relative",
              height: "20rem",
              borderLeftWidth: "1px",
              borderLeftStyle: "solid",
              borderColor: "$mauve7",

              "&:before": {
                content: " ",
                width: "9px",
                height: "9px",
                display: "block",
                backgroundColor: "$mauve7",
                borderRadius: "100%",
                position: "absolute",
                left: "-5px",
                top: 0,
              },
            }}
          ></Box>
        </Band>
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
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import Seo from "@/components/Seo";
import Band from "@/components/Band";
import HeroBand from "@/components/HeroBand";
import Popover from "@/components/ui/Popover";
import Text from "@/components/ui/Text";
import Image from "next/image";
import { FABContainer, Box } from "@/ui/primitives/";
import BackToTop from "@/ui/BackToTop";
import StyledLink from "@/ui/StyledLink";

import useMeta from "@/hooks/useMeta";
import { ProjectLayout } from "@/components/ProjectStuff/ProjectLayout";

import desktopScreenshot from "@/public/images/projs/bebop/desktop-screenshot.png";
import smartphoneScreenshot from "@/public/images/projs/bebop/smartphone-screenshot.png";
