export default function Home() {
  const { t, lang } = useTranslation("now");
  const thingsImDoing = t(
    "doingArray",
    {},
    {
      returnObjects: true,
    }
  ) as string[];

  return (
    <>
      <Seo t={t} lang={lang} />

      <Container backable key="index">
        <Band gridless id="main">
          <Box css={{ maxWidth: "60ch", marginX: "auto" }}>
            <Text as="h1" presetStyle="heading">
              {t("doingTitle")}
            </Text>
            <Flex
              as="ul"
              css={{
                flexDirection: "column",
                gap: "$spacing-03",

                marginTop: "$spacing-06",
                marginBottom: "$spacing-11",

                listStyleType: "circle",
                listStylePosition: "outside",
              }}
            >
              {thingsImDoing.map((thing) => {
                return (
                  <Text
                    as="li"
                    css={{
                      fontSize: "$lg",
                      lineHeight: "$lg",
                    }}
                    key={thing}
                  >
                    {thing}
                  </Text>
                );
              })}
            </Flex>

            <Text
              as="p"
              css={{
                marginBottom: "$spacing-07",
              }}
            >
              <TransWithComps text={t("bottomText")} />
            </Text>

            <Separator
              css={{
                width: "12rem",
                marginX: "auto",
                marginBottom: "$spacing-07",
                borderColor: "$mauve6",

                "@md": {
                  width: "24rem",
                },
              }}
            />

            <Text as="p">
              <TransWithComps
                text={t("lastUpdated")}
                extraComponents={{ date: <span /> }}
              />
            </Text>
          </Box>
        </Band>
      </Container>
    </>
  );
}

import useTranslation from "next-translate/useTranslation";

import Seo from "@/components/Seo";
import Band from "@/components/Band";
import Container from "@/components/Container";
import TransWithComps from "@/components/i18nStuff/TransWithComps";
import HeroBand from "@/components/HeroBand";
import Projects from "@/components/ProjectStuff/Projects";
import { FABContainer, Box, Flex, Separator } from "@/ui/primitives/";
import Text from "@/components/ui/Text";
import BackToTop from "@/ui/BackToTop";
import StyledLink from "@/ui/StyledLink";

import { styled } from "stitches.config";
import { useEffect } from "react";
