export default function ProjectsPage() {
  const wasmGifMeta = useProjMeta("wasmGif");
  const projsMeta = [wasmGifMeta];

  return (
    <Container key="projsHome" backable>
      <Band headline={{ bold: "01", thin: "Work" }}>
        <Projects projectsMeta={projsMeta} />
      </Band>
    </Container>
  );
}

import useProjMeta from "../../hooks/useProjMeta";

import Band from "../../components/Band";
import Projects from "../../components/ProjectStuff/Projects";
import Container from "../../components/Container";
