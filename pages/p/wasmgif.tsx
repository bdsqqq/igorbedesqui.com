export default function wasmGif() {
  const { t, lang } = useTranslation("projs/wasmGif");
  const wasmGifMeta = useMeta("wasmGif", "projs");
  return (
    <>
      <Seo t={t} lang={lang} url="p/wasmgif" />

      <ProjectContainer key="wasmGifProj">
        <HeroBand heroVideo={"/videos/wasmgif/wow"}>
          <TransWithComps i18nKey={"projs/wasmGif:heroTitle"} />
          <div className="mt-6">
            <CodeAndDemoButtons
              codeUrl="https://github.com/bdsqqq/next-wasm-gif"
              demoUrl="https://gif-maker-bdsq.vercel.app/"
            />
          </div>
        </HeroBand>

        <ProjectLayout projMeta={wasmGifMeta}>
          <Band smolPadding headline={{ bold: "01", thin: t("01Thin") }}>
            <Text presetStyle="paragraph">
              <TransWithComps i18nKey={"projs/wasmGif:01Copy"} />
            </Text>
          </Band>
          <Band smolPadding headline={{ bold: "02", thin: t("02Thin") }}>
            <Text presetStyle="paragraph">
              <TransWithComps i18nKey={"projs/wasmGif:02Copy"} />
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
import { FABContainer } from "@/ui/primitives/";
import BackToTop from "@/components/ui/BackToTop";
import { ProjectLayout } from "@/components/ProjectStuff/ProjectLayout";

import useMeta from "@/hooks/useMeta";
import Text from "@/components/ui/Text";
