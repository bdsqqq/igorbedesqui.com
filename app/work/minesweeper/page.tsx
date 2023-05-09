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

const makeSeo = ({
  title,
  description,
  slug,
  ogText,
}: {
  title: string;
  description: string;
  slug: string;
  ogText: string;
}): Metadata => {
  const ogImageUrl = new URL(
    `https://www.igorbedesqui.com/api/og?text=${ogText}`
  ).href;

  return {
    title,
    description,
    twitter: {
      site: "@bdsqqq",
      creator: "@bdsqqq",
      // @ts-ignore
      card: "summary_large_image",
      title: title,
      description: description,
      image: ogImageUrl,
      imageAlt: ogText.replace("*", ""),
    },
    openGraph: {
      title: title,
      description: description,
      url: `https://www.igorbedesqui.com${slug}`,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogText.replace("*", "").replace("/n", ""),
        },
      ],
    },
  };
};

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
