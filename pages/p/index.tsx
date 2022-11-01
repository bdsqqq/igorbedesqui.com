export default function ProjectsPage() {
  const wasmGifMeta = useMeta("wasmGif", "projs");
  const bebopMeta = useMeta("bebop", "projs");
  const issMeta = useMeta("iss", "projs");
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

import useMeta from "@/hooks/useMeta";

import Seo from "@/components/Seo";
import Band from "@/components/Band";
import Projects from "@/components/ProjectStuff/Projects";
import Container from "@/components/Container";
