export default function Home() {
  const { t, lang } = useTypeSafeTranslation("home");

  const wasmGifMeta = useMeta("wasmGif", "projs");
  const bebopMeta = useMeta("bebop", "projs");
  const issMeta = useMeta("iss", "projs");
  const projsMeta = [bebopMeta, issMeta, wasmGifMeta];

  return (
    <>
      <Seo
        title="Igor Bedesqui — Web Developer"
        description="front-end Web Developer based in São Paulo"
      />

      <Container key="index">
        <HeroBand>
          <TransWithComps
            text={t("hero")}
            extraComponents={{
              intro: <span className="font-light text-xl md:text-2xl" />,
            }}
          />
        </HeroBand>
        <Band headline={{ bold: "01", thin: t("01.title") }}>
          <p className="text-xl md:text-2xl">
            <TransWithComps
              text={t("01.copy")}
              extraComponents={{
                now: <StyledLink href="/now" />,
              }}
            />
          </p>
        </Band>
        <Band headline={{ bold: "02", thin: t("02.title") }}>
          <Projects projectsMeta={projsMeta} />
        </Band>
        <Band headline={{ bold: t("hey.greet"), thin: t("hey.title") }}>
          <p className="text-xl md:text-2xl">
            <TransWithComps
              text={t("hey.copy")}
              extraComponents={{
                github: (
                  <StyledLink href="https://github.com/bdsqqq"></StyledLink>
                ),
                twitter: <StyledLink href="https://twitter.com/bedesqui" />,
              }}
            />
          </p>
        </Band>
      </Container>
      <FABContainer>
        <BackToTop />
      </FABContainer>
    </>
  );
}

import { useTypeSafeTranslation } from "@/hooks/useTypeSafeTranslation";
import useMeta from "@/hooks/useMeta";

import Seo from "@/components/Seo";
import Band from "@/components/Band";
import Container from "@/components/Container";
import TransWithComps from "@/components/i18nStuff/TransWithComps";
import HeroBand from "@/components/HeroBand";
import Projects from "@/components/ProjectStuff/Projects";
import { FABContainer } from "@/ui/primitives/";
import BackToTop from "@/ui/BackToTop";
import StyledLink from "@/ui/StyledLink";
