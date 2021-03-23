export default function wasmGif() {
  const { t } = useTranslation();
  const wasmGifMeta = useProjMeta("wasmGif");
  return (
    <ProjectContainer key="wasmGifProj">
      <HeroBand>
        <Trans
          i18nKey="projs/wasmGif:something"
          components={[
            <span className="font-light text-sm sm:text-lg md:text-2xl" />,
            <br />,
            <span className="font-bold" />,
          ]}
        />
      </HeroBand>
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
      <Band
        dark
        headline={{ bold: "A", thin: "aa" }}
        cta={{ target: "/", text: "something" }}
      ></Band>
      <Band
        dark
        headline={{ bold: "A", thin: "aa" }}
        cta={{ target: "/", text: "something", outOfSite: true }}
      ></Band>
    </ProjectContainer>
  );
}

import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";

import ProjectContainer from "../../components/ProjectStuff/ProjectContainer";
import Band from "../../components/Band";
import HeroBand from "../../components/HeroBand";
import DetailsBand from "../../components/ProjectStuff/DetailsBand";

import useProjMeta from "../../hooks/useProjMeta";
