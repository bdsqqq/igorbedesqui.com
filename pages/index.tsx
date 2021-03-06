export default function Home() {
  const { t, lang } = useTranslation("home");
  const wasmGifMeta = useProjMeta("wasmGif");
  const projsMeta = [wasmGifMeta];

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
                  <ExternalLink
                    aClassList="font-bold border-current border-solid border-b-2 opacity-90 hover:opacity-100 focus:opacity-100 transition transition-all"
                    href="https://github.com/bdsqqq"
                  ></ExternalLink>
                ),
                email: (
                  <ExternalLink
                    aClassList="font-bold border-current border-solid border-b-2 opacity-90 hover:opacity-100 focus:opacity-100 transition transition-all"
                    href="mailto:igorbedesqui@gmail.com"
                  ></ExternalLink>
                ),
              }}
            />
          </p>
        </Band>
      </Container>
    </>
  );
}

import useTranslation from "next-translate/useTranslation";
import useProjMeta from "../hooks/useProjMeta";

import Seo from "../components/Seo";
import Band from "../components/Band";
import Container from "../components/Container";
import TransWithComps from "../components/i18nStuff/TransWithComps";
import HeroBand from "../components/HeroBand";
import Projects from "../components/ProjectStuff/Projects";
import ExternalLink from "../components/ExternalLink";
