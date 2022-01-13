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

        <ProjectLayout projMeta={issMeta}>
          <Band headline={{ bold: "01", thin: t("01Thin") }}>
            <Text>
              <TransWithComps i18nKey={"projs/iss:01Copy"} />
            </Text>
          </Band>
          <Band headline={{ bold: "02", thin: t("02Thin") }}>
            <Text>
              <TransWithComps i18nKey={"projs/iss:02Copy"} />
            </Text>
          </Band>
          <Band headline={{ bold: "03", thin: t("03Thin") }}>
            <Text>
              <TransWithComps i18nKey={"projs/iss:03Copy"} />
            </Text>
          </Band>
        </ProjectLayout>
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
import Text from "@/components/ui/Text";
import { ProjectLayout } from "@/components/ProjectStuff/ProjectLayout";

import useMeta from "@/hooks/useMeta";
