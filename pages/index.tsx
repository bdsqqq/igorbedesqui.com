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
                  <AnimatedLink href="https://github.com/bdsqqq"></AnimatedLink>
                ),
                email: (
                  <AnimatedLink href="mailto:igorbedesqui@gmail.com"></AnimatedLink>
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

const AnimatedLink = styled(UnstyledLink, {
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

import useTranslation from "next-translate/useTranslation";
import useMeta from "@/hooks/useMeta";

import Seo from "@/components/Seo";
import Band from "@/components/Band";
import Container from "@/components/Container";
import TransWithComps from "@/components/i18nStuff/TransWithComps";
import HeroBand from "@/components/HeroBand";
import Projects from "@/components/ProjectStuff/Projects";
import { FABContainer, UnstyledLink } from "@/ui/primitives/";
import BackToTop from "@/components/ui/BackToTop";

import { styled } from "stitches.config";
