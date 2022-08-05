export default function TimelinePage() {
  const { t, lang } = useTypeSafeTranslationWithNonLeafs("timeline");

  let timelineData = t(
    "years",
    {},
    {
      returnObjects: true,
    }
  ) as unknown as typeof timelineType.years;

  return (
    <>
      <Seo t={t} lang={lang} />

      <Container backable key="index">
        <Band gridless id="main">
          {Object.keys(timelineData).map((year) => (
            <>
              <h1 key={year}>{year}</h1>
              <ul>
                {timelineData[year as keyof typeof timelineData].map((item) => (
                  <li key={item.title}>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
            </>
          ))}
        </Band>
      </Container>
      <FABContainer>
        <BackToTop />
      </FABContainer>
    </>
  );
}

import {
  useTypeSafeTranslation,
  useTypeSafeTranslationWithNonLeafs,
} from "@/hooks/useTypeSafeTranslation";
import Seo from "@/components/Seo";
import Band from "@/components/Band";
import Container from "@/components/Container";
import TransWithComps from "@/components/i18nStuff/TransWithComps";
import { FABContainer, Box, Flex, Separator } from "@/ui/primitives/";
import Text from "@/components/ui/Text";
import BackToTop from "@/ui/BackToTop";
import StyledLink from "@/ui/StyledLink";

import { styled } from "stitches.config";

import type timelineType from "@/locales/en/timeline.json";
import { TuplifyUnion } from "@/lib/tsWizardry/tuplifyUnion";
