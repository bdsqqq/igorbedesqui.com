import { meta, default as MD } from "data/work/bebop.mdx";

export default function Bebop() {
  const { t } = useTypeSafeTranslation("projs/bebop");
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

        <ProjectLayout projMeta={meta} nextProjMeta={issMeta}>
          <MD />
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
import HeroBand from "@/components/HeroBand";
import { FABContainer } from "@/ui/primitives/";
import BackToTop from "@/ui/BackToTop";

import useMeta from "@/hooks/useMeta";
import { ProjectLayout } from "@/components/ProjectStuff/ProjectLayout";
