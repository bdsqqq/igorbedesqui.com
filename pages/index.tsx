export default function Home() {
  const { t } = useTranslation("home");
  const wasmGifMeta = useProjMeta("wasmGif");
  const projsMeta = [wasmGifMeta];

  return (
    <>
      <NextSeo
        title={t("title")}
        description={t("description")}
        openGraph={{
          type: "website",
          url: "https://igorbedesquidotcom.vercel.app/",
          title: t("title"),
          description: t("description"),
          images: [
            {
              url: "https://igorbedesquidotcom.vercel.app/images/og/home.jpg",
              width: 800,
              height: 600,
              alt: "Street lit by neon sign of a restaurant",
            },
          ],
          site_name: "Igor Bedesqui",
        }}
        twitter={{
          handle: "@igorbdsq",
          site: "@site",
          cardType: "summary_large_image",
        }}
        languageAlternates={[
          {
            hrefLang: "pt",
            href: "https://igorbedesquidotcom.vercel.app/pt",
          },
          {
            hrefLang: "en",
            href: "https://igorbedesquidotcom.vercel.app/",
          },
        ]}
        additionalMetaTags={[
          {
            property: "viewport",
            content: "initial-scale=1.0, width=device-width",
          },
          {
            httpEquiv: "x-ua-compatible",
            content: "IE=edge; chrome=1",
          },
        ]}
      />

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
                    aClassList="font-bold opacity-90 hover:opacity-100 focus:opacity-100 transition transition-all"
                    href="https://github.com/bdsqqq"
                  ></ExternalLink>
                ),
                email: (
                  <ExternalLink
                    aClassList="font-bold opacity-90 hover:opacity-100 focus:opacity-100 transition transition-all"
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

import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import useProjMeta from "../hooks/useProjMeta";
import { NextSeo } from "next-seo";

import Band from "../components/Band";
import Container from "../components/Container";
import TransWithComps from "../components/i18nStuff/TransWithComps";
import HeroBand from "../components/HeroBand";
import Projects from "../components/ProjectStuff/Projects";
import ExternalLink from "../components/ExternalLink";
