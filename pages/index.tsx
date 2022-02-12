export default function Home() {
  const homeTranslation = useTranslation("home");
  const t = (translationKey: Leaves<typeof homeNamespace>) => {
    return homeTranslation.t(translationKey);
  };

  const wasmGifMeta = useMeta("wasmGif", "projs");
  const bebopMeta = useMeta("bebop", "projs");
  const projsMeta = [bebopMeta, wasmGifMeta];

  return (
    <>
      <Seo t={homeTranslation.t} lang={homeTranslation.lang} />

      <Container key="index">
        <HeroBand>
          <TransWithComps
            text={t("hero")}
            extraComponents={{
              intro: (
                <Text
                  presetStyle="lgParagraph"
                  css={{
                    fontWeight: "300",
                  }}
                />
              ),
            }}
          />
        </HeroBand>
        <Band headline={{ bold: "01", thin: t("01.title") }}>
          <Text as="p" presetStyle="lgParagraph">
            <TransWithComps text={t("01.copy")} />
          </Text>
        </Band>
        <Band dark headline={{ bold: "02", thin: t("02.title") }}>
          <Projects projectsMeta={projsMeta} />
        </Band>
        <Band headline={{ bold: t("hey.greet"), thin: t("hey.title") }}>
          <Text as="p" presetStyle="lgParagraph">
            <TransWithComps
              text={t("hey.copy")}
              extraComponents={{
                github: (
                  <StyledLink href="https://github.com/bdsqqq"></StyledLink>
                ),
                email: (
                  <StyledLink href="mailto:igorbedesqui@gmail.com"></StyledLink>
                ),
              }}
            />
          </Text>
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

import type { Leaves } from "@/lib/nestedKeyOfTypes";
import homeNamespace from "@/locales/en/home.json";
import Text from "@/components/ui/Text";
