export default function wasmGif() {
  const { t, lang } = useTranslation("projs/wasmGif");
  const wasmGifMeta = useProjMeta("wasmGif");
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
        <DetailsBand projName={wasmGifMeta.name}>
          <div className="leading-loose mb-6">
            <h3 className="font-bold text-3xl">{t("projs/detail:role")}</h3>
            <ul>
              {wasmGifMeta.roles.map((role, i) => {
                return (
                  <li key={i}>
                    {role}
                    {i < wasmGifMeta.roles.length - 1 && ","}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="leading-loose mb-6">
            <h3 className="font-bold text-3xl">{t("projs/detail:date")}</h3>
            <p>{wasmGifMeta.date}</p>
            <h3 className="font-bold text-3xl">{t("projs/detail:type")}</h3>
            <p>{wasmGifMeta.type}</p>
          </div>

          <div className="leading-loose mb-6">
            <h3 className="font-bold text-3xl">{t("projs/detail:tools")}</h3>
            <ul>
              {wasmGifMeta.tools.map((tool, i) => {
                return (
                  <li key={i}>
                    {tool}
                    {i < wasmGifMeta.tools.length - 1 && ","}
                  </li>
                );
              })}
            </ul>
          </div>
        </DetailsBand>
      </ProjectContainer>
    </>
  );
}

import useTranslation from "next-translate/useTranslation";
import TransWithComps from "../../components/i18nStuff/TransWithComps";

import ProjectContainer from "../../components/ProjectStuff/ProjectContainer";
import CodeAndDemoButtons from "../../components/ProjectStuff/CodeAndDemoButtons";
import Seo from "../../components/Seo";
import Band from "../../components/Band";
import HeroBand from "../../components/HeroBand";
import DetailsBand from "../../components/ProjectStuff/DetailsBand";

import useProjMeta from "../../hooks/useProjMeta";
