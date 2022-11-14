import { meta, default as MD } from "data/work/bebop.mdx";
import { meta as issMeta } from "data/work/iss.mdx";

export default function Bebop() {
  return (
    <>
      <Seo
        title="The work, which becomes a new genre itself, will be called... COWBOY BEBOP"
        description="My entry for, and winner of, the second installment of the WebJam — made by Igor Bedesqui"
        url="p/bebop"
      />

      <ProjectContainer key="bebopProj" backMessage={meta.backMessage}>
        <HeroBand fullBleed heroVideo={"/videos/bebop/noodles"}>
          <span className="text-gray-12">
            The work, which becomes a new genre itself, will be called... COWBOY
            BEBOP
          </span>
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

import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import Seo from "@/components/Seo";
import HeroBand from "@/components/HeroBand";
import { FABContainer } from "@/ui/primitives/";
import BackToTop from "@/ui/BackToTop";

import { ProjectLayout } from "@/components/ProjectStuff/ProjectLayout";
