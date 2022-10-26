export default function Bebop() {
  const { t, lang } = useTypeSafeTranslation("projs/bebop");
  const bebopMeta = useMeta("bebop", "projs");
  const issMeta = useMeta("iss", "projs");

  return (
    <>
      <Seo t={t} lang={lang} url="p/bebop" />

      <ProjectContainer key="bebopProj" backMessage={t("backMessage")}>
        <HeroBand fullBleed heroVideo={"/videos/bebop/noodles"}>
          <TransWithComps text={t("heroTitle")} />
          <div className="mt-6">
            <CodeAndDemoButtons
              codeUrl="https://github.com/bdsqqq/bebop-webjam"
              demoUrl="https://bebop-webjam.vercel.app/"
            />
          </div>
        </HeroBand>

        <ProjectLayout projMeta={bebopMeta} nextProjMeta={issMeta}>
          <Band smolPadding gridless id="update">
            <Text
              as="h2"
              css={{
                fontSize: "$lg",
                fontWeight: "bold",
                color: "$mauve11",
                textTransform: "uppercase",
                marginBottom: "$spacing-03",
              }}
            >
              {t("update.title")}
            </Text>
            <p>
              {t("update.copy.body")}
              {"  "}
              <StyledLink href="https://raw.githubusercontent.com/bdsqqq/bebop-webjam/main/docs/img/winner.jpg">
                {t("update.copy.linkLabel")}
              </StyledLink>
            </p>
          </Band>
          <Band smolPadding headline={{ bold: "01", thin: t("01Thin") }}>
            <Text presetStyle="paragraph">
              <TransWithComps
                text={t("01Copy")}
                extraComponents={{
                  hc: (
                    <Popover
                      content={<TransWithComps text={t("webjamHc")} />}
                    ></Popover>
                  ),
                  s: <span className="cursor-pointer font-bold"></span>,
                }}
              />
            </Text>
          </Band>

          <Band smolPadding headline={{ bold: "02", thin: t("02Thin") }}>
            <Text presetStyle="paragraph">
              <TransWithComps text={t("02Copy")} />
            </Text>
          </Band>

          <Band smolPadding headline={{ bold: "03", thin: t("03Thin") }}>
            <Text presetStyle="paragraph">
              <TransWithComps text={t("03Copy")} />
            </Text>
          </Band>

          <Band smolPadding headline={{ bold: "04", thin: t("04Thin") }}>
            <Text presetStyle="paragraph">
              <TransWithComps
                text={t("04IntroCopy")}
                extraComponents={{
                  a: (
                    <StyledLink href="https://bebop-webjam.vercel.app/"></StyledLink>
                  ),
                }}
              />
            </Text>

            <Box
              css={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                alignItems: "center",
                minHeight: "0",
                gap: "$spacing-02",
                marginY: "$spacing-02",
              }}
            >
              <Box
                css={{
                  gridColumn: "1 / 2",
                }}
              >
                <Image
                  src={smartphoneScreenshot}
                  layout="responsive"
                  width="100%"
                  height="192%"
                  objectFit="contain"
                  alt=""
                />
              </Box>
              <Box
                css={{
                  gridColumn: "2 / 5",
                }}
              >
                <Image
                  src={desktopScreenshot}
                  layout="responsive"
                  width="100%"
                  height="63%"
                  objectFit="contain"
                  alt=""
                />
              </Box>
            </Box>
            <Text presetStyle="paragraph">
              <TransWithComps text={t("04Copy")} />
            </Text>
          </Band>
        </ProjectLayout>
      </ProjectContainer>
      <FABContainer>
        <BackToTop />
      </FABContainer>
    </>
  );
}

import { useTypeSafeTranslation } from "@/hooks/useTypeSafeTranslation";
import TransWithComps from "@/components/i18nStuff/TransWithComps";

import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import Seo from "@/components/Seo";
import Band from "@/components/Band";
import HeroBand from "@/components/HeroBand";
import Popover from "@/components/ui/Popover";
import Text from "@/components/ui/Text";
import Image from "next/image";
import { FABContainer, Box } from "@/ui/primitives/";
import BackToTop from "@/ui/BackToTop";
import StyledLink from "@/ui/StyledLink";

import useMeta from "@/hooks/useMeta";
import { ProjectLayout } from "@/components/ProjectStuff/ProjectLayout";

import desktopScreenshot from "@/public/images/projs/bebop/desktop-screenshot.png";
import smartphoneScreenshot from "@/public/images/projs/bebop/smartphone-screenshot.png";
