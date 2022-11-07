import { meta as bebopMeta } from "data/work/bebop.mdx";
import { meta as issMeta } from "data/work/iss.mdx";
import { meta as wasmGifMeta } from "data/work/wasmgif.mdx";

export default function ProjectsPage() {
  const projsMeta = [bebopMeta, issMeta, wasmGifMeta];

  return (
    <>
      <Seo title="Work" description="" url="p" />
      {/* TODO: actual title and description */}
      <Container key="projsHome" backable>
        <Band headline={{ bold: "01", thin: "Work" }}>
          <Projects projectsMeta={projsMeta} />
        </Band>
      </Container>
    </>
  );
}

import Seo from "@/components/Seo";
import Band from "@/components/Band";
import Projects from "@/components/ProjectStuff/Projects";
import Container from "@/components/Container";
