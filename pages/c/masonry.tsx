export default function Masonry() {
  const { t, lang } = useTranslation("comps/masonry");
  const masonryMeta = useMeta("masonry", "comps");

  return (
    <>
      <Seo t={t} lang={lang} url="c/masonry" />

      <ProjectContainer key="masonryComp">
        <HeroBand heroVideo={"/videos/wow"}>
          <TransWithComps i18nKey={"comps/masonry:heroTitle"} />
        </HeroBand>

        <Band headline={{ bold: "01", thin: t("01Thin") }}>
          <p className="text-xl md:text-2xl">
            <TransWithComps i18nKey={"comps/masonry:01Copy"} />
          </p>
        </Band>
        <Band dark headline={{ bold: "02", thin: t("02Thin") }}>
          <p className="text-xl md:text-2xl">
            <TransWithComps i18nKey={"comps/masonry:02Copy"} />
          </p>
        </Band>
        <DetailsBand id={masonryMeta.name}>
          <div className="leading-loose mb-6">
            <h3 className="font-bold text-3xl">{t("detail:date")}</h3>
            <p>{masonryMeta.date}</p>
          </div>
          <div className="leading-loose mb-6">
            <h3 className="font-bold text-3xl">{t("detail:type")}</h3>
            <p>{masonryMeta.type}</p>
          </div>

          <div className="leading-loose mb-6">
            <h3 className="font-bold text-3xl">{t("detail:tools")}</h3>
            <ul>
              {masonryMeta.tools.map((tool, i) => {
                return (
                  <li key={i}>
                    {tool}
                    {i < masonryMeta.tools.length - 1 && ","}
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
import TransWithComps from "@/components/i18nStuff/TransWithComps";

import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import Seo from "@/components/Seo";
import Band from "@/components/Band";
import HeroBand from "@/components/HeroBand";
import DetailsBand from "@/components/Bands/DetailsBand";

import useMeta from "../../hooks/useMeta";
