export default function wasmGif() {
  const { t, lang } = useTranslation("projs/wasmGif");
  const wasmGifMeta = useMeta("wasmGif", "projs");
  return (
    <>
      <Seo t={t} lang={lang} url="p/wasmgif" />

      <ProjectContainer key="wasmGifProj">
        <HeroBand heroVideo={"/videos/wow"}>
          <TransWithComps i18nKey={"projs/wasmGif:heroTitle"} />
          <div className="mt-6">
            <CodeAndDemoButtons
              codeUrl="https://github.com/bdsqqq/next-wasm-gif"
              demoUrl="https://gif-maker-bdsq.vercel.app/"
            />
          </div>
        </HeroBand>

        <Band headline={{ bold: "01", thin: t("01Thin") }}>
          <p className="text-xl md:text-2xl">
            <TransWithComps i18nKey={"projs/wasmGif:01Copy"} />
          </p>
        </Band>
        <Band dark headline={{ bold: "02", thin: t("02Thin") }}>
          <p className="text-xl md:text-2xl">
            <TransWithComps i18nKey={"projs/wasmGif:02Copy"} />
          </p>
        </Band>
        <DetailsBand id="details" projMeta={wasmGifMeta} t={t} />
      </ProjectContainer>
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
import DetailsBand from "@/components/Bands/DetailsBand";

import useMeta from "@/hooks/useMeta";
