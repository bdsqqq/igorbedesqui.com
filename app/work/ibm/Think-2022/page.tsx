import HeroBand from "@/components/HeroBand";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import {
  ProjectBand,
  ProjectLayout,
} from "@/components/ProjectStuff/ProjectLayout";
import { bebopMeta, issMeta } from "../../metas";
import { MDX } from "@/components/MDX";

import noodles_webm from "../../bebop/-noodles.webm";
import noodles_mp4 from "../../bebop/-noodles.mp4";

export default function Think() {
  return (
    <ProjectContainer key="bebopProj" backMessage={bebopMeta.backMessage}>
      <HeroBand heroVideo={{ webm: noodles_webm, mp4: noodles_mp4 }}>
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
