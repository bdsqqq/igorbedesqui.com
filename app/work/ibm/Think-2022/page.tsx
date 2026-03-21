import HeroBand from "@/components/HeroBand";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import {
  ProjectBand,
  ProjectLayout,
} from "@/components/ProjectStuff/ProjectLayout";
import { bebopMeta, issMeta } from "../../metas";
import { MDX } from "@/components/MDX";

export default function Think() {
  return (
    <ProjectContainer key="bebopProj" backMessage={bebopMeta.backMessage}>
      <HeroBand heroVideo={"/videos/bebop/noodles"}>
        <MDX>
          {`
            Leading bleeding edge at massive scale.
          `}
        </MDX>
      </HeroBand>
      <div className="mb-16" />

      <ProjectLayout
        projMeta={bebopMeta}
        nextProjMeta={issMeta}
      ></ProjectLayout>
    </ProjectContainer>
  );
}
