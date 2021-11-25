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
            <h1 className="text-4xl font-semibold">What I'm doing now</h1>
            <Ul>
              {thingsImDoing.map((thing) => {
                return <li key={thing}>{thing}</li>;
              })}
            </Ul>

            <p>Lorem ipsum dolor sit amet consectetur.</p>

            <hr />

            <p>
              <TransWithComps i18nKey="now:lastUpdated" />
            </p>
          </Box>
        </Band>
      </Container>
    </>
  );
}

const Ul = styled("ul", {
  listStyleType: "circle",
  listStylePosition: "outside",
});

import useTranslation from "next-translate/useTranslation";

import Seo from "@/components/Seo";
import Band from "@/components/Band";
import Container from "@/components/Container";
import TransWithComps from "@/components/i18nStuff/TransWithComps";
import HeroBand from "@/components/HeroBand";
import Projects from "@/components/ProjectStuff/Projects";
import { FABContainer, Box } from "@/ui/primitives/";
import BackToTop from "@/ui/BackToTop";
import StyledLink from "@/ui/StyledLink";

import { styled } from "stitches.config";
import { useEffect } from "react";
