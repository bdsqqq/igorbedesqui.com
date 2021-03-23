export default function ProjectsPage() {
  const issMeta = useProjMeta("iss");
  const projsMeta = [
    issMeta,
    issMeta,
    issMeta,
    issMeta,
    issMeta,
    issMeta,
    issMeta,
    issMeta,
  ];

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
