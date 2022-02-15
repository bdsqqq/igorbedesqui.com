export default function Bebop() {
  const { t, lang } = useTranslation("projs/bebop");
  const bebopMeta = useMeta("bebop", "projs");
  const wasmGifMeta = useMeta("wasmGif", "projs");

  return (
    <>
      <Seo t={t} lang={lang} url="p/bebop" />

      <ProjectContainer key="bebopProj" backMessage={t("backMessage")}>
        <HeroBand heroVideo={"/videos/bebop/noodles"}>
          <TransWithComps text={t("heroTitle")} />
          <div className="mt-6">
            <CodeAndDemoButtons
              codeUrl="https://github.com/bdsqqq/bebop-webjam"
              demoUrl="https://bebop-webjam.vercel.app/"
            />
          </div>
        </HeroBand>

        <ProjectLayout projMeta={bebopMeta} nextProjMeta={wasmGifMeta}>
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

            <div className="grid grid-cols-4 items-center min-h-0 gap-1 my-2">
              <div className=" col-start-1 col-end-2">
                <Image
                  layout="responsive"
                  width="100%"
                  height="192%"
                  objectFit="contain"
                  src="/images/projs/bebop/smartphone-screenshot.png"
                ></Image>
              </div>
              <div className=" col-start-2 col-end-5">
                <Image
                  layout="responsive"
                  width="100%"
                  height="100%"
                  objectFit="contain"
                  src="/images/projs/bebop/desktop-screenshot.png"
                ></Image>
              </div>
            </div>
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

import useTranslation from "next-translate/useTranslation";
import TransWithComps from "@/components/i18nStuff/TransWithComps";

import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import Seo from "@/components/Seo";
import Band from "@/components/Band";
import HeroBand from "@/components/HeroBand";
import Popover from "@/components/ui/Popover";
import Text from "@/components/ui/Text";
import Image from "next/image";
import { FABContainer } from "@/ui/primitives/";
import BackToTop from "@/ui/BackToTop";
import StyledLink from "@/ui/StyledLink";

import useMeta from "@/hooks/useMeta";
import { ProjectLayout } from "@/components/ProjectStuff/ProjectLayout";
