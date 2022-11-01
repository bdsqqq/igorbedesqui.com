export default function Bebop() {
  const { t, lang } = useTypeSafeTranslation("projs/bebop");
  const bebopMeta = useMeta("bebop", "projs");
  const issMeta = useMeta("iss", "projs");

  return (
    <>
      <Seo
        title="The work, which becomes a new genre itself, will be called... COWBOY BEBOP"
        description="My entry for, and winner of, the second installment of the WebJam — made by Igor Bedesqui"
        url="p/bebop"
      />

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
          <Band options={{ padding: "smol" }} gridless id="update">
            <h2 className="text-xl font-bold text-mauve11 uppercase mb-2">
              {t("update.title")}
            </h2>
            <p>
              {t("update.copy.body")}
              {"  "}
              <StyledLink href="https://raw.githubusercontent.com/bdsqqq/bebop-webjam/main/docs/img/winner.jpg">
                {t("update.copy.linkLabel")}
              </StyledLink>
            </p>
          </Band>
          <Band
            options={{ padding: "smol" }}
            headline={{ bold: "01", thin: t("01Thin") }}
          >
            <p>
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
            </p>
          </Band>

          <Band
            options={{ padding: "smol" }}
            headline={{ bold: "02", thin: t("02Thin") }}
          >
            <p>
              <TransWithComps text={t("02Copy")} />
            </p>
          </Band>

          <Band
            options={{ padding: "smol" }}
            headline={{ bold: "03", thin: t("03Thin") }}
          >
            <p>
              <TransWithComps text={t("03Copy")} />
            </p>
          </Band>

          <Band
            options={{ padding: "smol" }}
            headline={{ bold: "04", thin: t("04Thin") }}
          >
            <p>
              <TransWithComps
                text={t("04IntroCopy")}
                extraComponents={{
                  a: (
                    <StyledLink href="https://bebop-webjam.vercel.app/"></StyledLink>
                  ),
                }}
              />
            </p>

            <div className="grid grid-cols-4 items-center min-h-0 gap-1 my-1">
              <div className="col-start-1 col-end-2">
                <Image
                  src={smartphoneScreenshot}
                  layout="responsive"
                  width="100%"
                  height="192%"
                  objectFit="contain"
                  alt=""
                />
              </div>
              <div className="col-start-2 col-end-5">
                <Image
                  src={desktopScreenshot}
                  layout="responsive"
                  width="100%"
                  height="63%"
                  objectFit="contain"
                  alt=""
                />
              </div>
            </div>
            <p>
              <TransWithComps text={t("04Copy")} />
            </p>
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
import Image from "next/image";
import { FABContainer } from "@/ui/primitives/";
import BackToTop from "@/ui/BackToTop";
import StyledLink from "@/ui/StyledLink";

import useMeta from "@/hooks/useMeta";
import { ProjectLayout } from "@/components/ProjectStuff/ProjectLayout";

import desktopScreenshot from "@/public/images/projs/bebop/desktop-screenshot.png";
import smartphoneScreenshot from "@/public/images/projs/bebop/smartphone-screenshot.png";
