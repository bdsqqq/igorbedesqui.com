export default function Knows() {
  const { t, lang } = useTranslation("knows");

  return (
    <>
      <Seo t={t} lang={lang} />

      <Container backable key="index">
        <Band gridless id="searchBand">
          <Search />
        </Band>
        <Band gridless id="allTech"></Band>
      </Container>
    </>
  );
}

const Hr = styled("hr", {});

import useTranslation from "next-translate/useTranslation";

import Seo from "@/components/Seo";
import Band from "@/components/Band";
import Container from "@/components/Container";
import TransWithComps from "@/components/i18nStuff/TransWithComps";
import HeroBand from "@/components/HeroBand";
import Projects from "@/components/ProjectStuff/Projects";
import { FABContainer, Box, Flex } from "@/ui/primitives/";
import Text from "@/components/ui/Text";
import BackToTop from "@/ui/BackToTop";
import StyledLink from "@/ui/StyledLink";

import { styled } from "stitches.config";
import { Search } from "@/components/knows/Search";
