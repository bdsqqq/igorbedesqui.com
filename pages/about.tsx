export default function Home() {
  const { t } = useTranslation("home");
  const wasmGifMeta = useProjMeta("wasmGif");

  return (
    <>
      <NextSeo />
      <SocialProfileJsonLd
        type="Person"
        name="Igor Bedesqui"
        url="http://igorbedesqui.com"
        sameAs={["https://www.linkedin.com/in/igor-bedesqui/"]}
      />

      <Container key="index"></Container>
    </>
  );
}

import useTranslation from "next-translate/useTranslation";
import useProjMeta from "../hooks/useProjMeta";
import { NextSeo, SocialProfileJsonLd } from "next-seo";

import Band from "../components/Band";
import Container from "../components/Container";
import TransWithComps from "../components/i18nStuff/TransWithComps";
import HeroBand from "../components/HeroBand";
