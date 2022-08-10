export default function Home() {
  const { t, lang } = useTypeSafeTranslation("now");
  const thingsImDoing = t(
    "doingArray",
    {},
    {
      returnObjects: true,
    }
  ) as unknown as string[];

  return (
    <>
      <Seo t={t} lang={lang} />

      <Container backable key="index">
        <Band gridless id="main">
          <Box css={{ marginX: "auto" }}>
            <Text as="h1" presetStyle="heading">
              {t("doingTitle")}
            </Text>
            <Text
              as="p"
              css={{
                color: "$mauve11",
                fontSize: "$sm",
                fontWeight: "600",
              }}
            >
              <TransWithComps
                text={t("lastUpdated")}
                extraComponents={{ date: <span /> }}
              />
            </Text>

            <Box
              css={{
                height: "$space$spacing-10",
              }}
            />
            <Flex
              as="ul"
              css={{
                flexDirection: "column",
                gap: "$spacing-03",

                listStyleType: "circle",
                listStylePosition: "inside",
              }}
            >
              {thingsImDoing.map((thing) => {
                return (
                  <Text
                    as="li"
                    css={{
                      fontSize: "$md",
                      lineHeight: "$lg",
                    }}
                    key={thing}
                  >
                    {thing}
                  </Text>
                );
              })}
            </Flex>
            <Box
              css={{
                height: "$space$spacing-13",
              }}
            />
            <Text
              as="p"
              css={{
                color: "$mauve11",
                fontSize: "$xs",
                fontWeight: "600",
              }}
            >
              <TransWithComps text={t("bottomText")} />
            </Text>
          </Box>
        </Band>
      </Container>
    </>
  );
}

import { useTypeSafeTranslation } from "@/hooks/useTypeSafeTranslation";
import Seo from "@/components/Seo";
import Band from "@/components/Band";
import Container from "@/components/Container";
import TransWithComps from "@/components/i18nStuff/TransWithComps";
import { Box, Flex } from "@/ui/primitives/";
import Text from "@/components/ui/Text";
