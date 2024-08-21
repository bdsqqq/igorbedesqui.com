import HeroBand from "@/components/HeroBand";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import {
  ProjectBand,
  ProjectLayout,
} from "@/components/ProjectStuff/ProjectLayout";
import type { Metadata } from "next";

import { bebopMeta, issMeta } from "../../metas";
import { MDX } from "@/components/MDX";
import Image from "next/image";

import desktopScreenshot from "@/public/images/projs/bebop/desktop-screenshot.png";
import smartphoneScreenshot from "@/public/images/projs/bebop/smartphone-screenshot.png";

export default async function Think() {
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
