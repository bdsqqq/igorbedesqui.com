export default function Iss() {
  const { t, lang } = useTranslation("projs/iss");
  const issMeta = useMeta("iss", "projs");

  return (
    <>
      <Seo t={t} lang={lang} url="p/iss" />
      <ProjectContainer key="issProj" backMessage="Fly back home">
        <HeroBand heroVideo="/videos/iss/space">
          <TransWithComps i18nKey="projs/iss:heroTitle" />
          <p aria-hidden="true" className="text-transparent">
            {t("projs/iss:heroSubHead")}
          </p>
          <div className="mt-6">
            <CodeAndDemoButtons
              codeUrl="https://github.com/bdsqqq/iss-asset"
              demoUrl="https://iss.igorbedesqui.com/"
            />
          </div>
        </HeroBand>
        <Band headline={{ bold: "01", thin: t("01Thin") }}>
          <p className="text-xl md:text-2xl">
            <TransWithComps i18nKey={"projs/iss:01Copy"} />
          </p>
        </Band>
        <Band dark headline={{ bold: "02", thin: t("02Thin") }}>
          <p className="text-xl md:text-2xl">
            <TransWithComps i18nKey={"projs/iss:02Copy"} />
          </p>
        </Band>
        <Band headline={{ bold: "03", thin: t("03Thin") }}>
          <p className="text-xl md:text-2xl">
            <TransWithComps i18nKey={"projs/iss:03Copy"} />
          </p>
        </Band>
        <DetailsBand id={issMeta.name} projMeta={issMeta} t={t} />
      </ProjectContainer>
    </>
  );
}

import useTranslation from "next-translate/useTranslation";
import TransWithComps from "@/components/i18nStuff/TransWithComps";

import Seo from "@/components/Seo";
import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import HeroBand from "@/components/HeroBand";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import Band from "@/components/Band";
import DetailsBand from "@/components/Bands/DetailsBand";

import useMeta from "@/hooks/useMeta";
