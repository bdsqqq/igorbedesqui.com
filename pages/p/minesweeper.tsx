export default function Minesweeper() {
  const { t, lang } = useTypeSafeTranslation("projs/minesweeper");
  const minesweeperMeta = useMeta("minesweeper", "projs");

  return (
    <>
      <Seo
        title="Minesweeper"
        description="A modern implementation of the classic game minesweeper — made by Igor Bedesqui"
        url="p/minesweeper"
      />
      <ProjectContainer key="minesweeperProj">
        <HeroBand>
          <TransWithComps text={t("heroTitle")} />
          <p aria-hidden="true" className="text-transparent">
            {t("heroSubHead")}
          </p>
          <div className="mt-6">
            <CodeAndDemoButtons
              codeUrl="https://github.com/bdsqqq/minesweeper"
              demoUrl="https://minesweeper-iota.vercel.app/"
            />
          </div>
        </HeroBand>
      </ProjectContainer>
    </>
  );
}

import { useTypeSafeTranslation } from "@/hooks/useTypeSafeTranslation";
import TransWithComps from "@/components/i18nStuff/TransWithComps";

import Seo from "@/components/Seo";
import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import HeroBand from "@/components/HeroBand";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import Band from "@/components/Band";
import DetailsBand from "@/components/Bands/DetailsBand";

import useMeta from "@/hooks/useMeta";
