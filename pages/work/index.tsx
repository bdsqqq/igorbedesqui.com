import { bebopMeta } from "app/work/poor_mans_cms";
import { meta as issMeta } from "./iss";
import { meta as wasmGifMeta } from "./wasmgif";

export default function ProjectsPage() {
  const projsMeta = [bebopMeta, issMeta, wasmGifMeta];

  return (
    <>
      <Seo title="Work" description="" url="p" ogText="" />
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
