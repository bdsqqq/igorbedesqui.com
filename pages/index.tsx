export default function Home() {
  const { t, lang } = useTranslation("home");
  const wasmGifMeta = useMeta("wasmGif", "projs");
  const bebopMeta = useMeta("bebop", "projs");
  const projsMeta = [bebopMeta, wasmGifMeta];

  return (
    <>
      <Seo t={t} lang={lang} />

      <Container key="index">
        <HeroBand>
          <TransWithComps
            i18nKey="home:hero"
            extraComponents={{
              intro: <span className="font-light text-lg md:text-2xl" />,
            }}
          />
        </HeroBand>
        <Band headline={{ bold: "01", thin: t("01Title") }}>
          <p className="text-xl md:text-3xl tracking-tight ">
            <TransWithComps i18nKey="home:01Copy" />
          </p>
        </Band>
        <Band dark headline={{ bold: "02", thin: t("02Title") }}>
          <Projects projectsMeta={projsMeta} />
        </Band>
        <Band headline={{ bold: t("hey"), thin: t("heyTitle") }}>
          <p className="text-2xl">
            <TransWithComps
              i18nKey="home:heyCopy"
              extraComponents={{
                github: (
                  <StyledLink href="https://github.com/bdsqqq"></StyledLink>
                ),
                email: (
                  <StyledLink href="mailto:igorbedesqui@gmail.com"></StyledLink>
                ),
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

import useTranslation from "next-translate/useTranslation";
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
