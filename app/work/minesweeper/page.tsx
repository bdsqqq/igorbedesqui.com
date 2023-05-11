import HeroBand from "@/components/HeroBand";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import {
  ProjectBand,
  ProjectLayout,
} from "@/components/ProjectStuff/ProjectLayout";
import Tooltip from "@/components/ui/Tooltip";
import type { Metadata } from "next";

import { minesweeperMeta, bebopMeta } from "../metas";
import { MDX } from "@/components/MDX";

import { makeSeo } from "@/lib/makeSeo";

export const metadata: Metadata = makeSeo({
  title: minesweeperMeta.name,
  description: minesweeperMeta.description,
  slug: `/work/${minesweeperMeta.urlSlug}}`,
  ogText: "The classic minesweeper game,/n made modern.",
});

export default async function Minesweeper() {
  return (
    <ProjectContainer
      key="minesweeperProj"
      backMessage={minesweeperMeta.backMessage}
    >
      <HeroBand heroVideo="/videos/wasmgif/wow">
        <MDX>{`The classic minesweeper game, made modern.`}</MDX>
        <div className="mt-6">
          <CodeAndDemoButtons
            codeUrl="https://github.com/bdsqqq/minesweeper"
            demoUrl="https://minesweeper-iota.vercel.app/"
          />
        </div>
      </HeroBand>
      <div className="mb-16" />

      <ProjectLayout projMeta={minesweeperMeta} nextProjMeta={bebopMeta}>
        <ProjectBand headline={{ bold: "01", thin: "Why?" }}>
          <MDX>
            {`
               Hej do
            `}
          </MDX>
        </ProjectBand>
      </ProjectLayout>
    </ProjectContainer>
  );
}
