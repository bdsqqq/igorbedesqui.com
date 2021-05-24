export default function ProjectsPage() {
  const wasmGifMeta = useMeta("wasmGif", "projs");
  const projsMeta = [wasmGifMeta];

  const { t, lang } = useTranslation("common");

  return (
    <>
      <Seo t={t} lang={lang} url="p" />
      <Container key="projsHome" backable>
        <Band headline={{ bold: "01", thin: "Work" }}>
          <Projects projectsMeta={projsMeta} />
        </Band>
      </Container>
    </>
  );
}

import useTranslation from "next-translate/useTranslation";

import useMeta from "../../hooks/useMeta";

import Seo from "../../components/Seo";
import Band from "../../components/Band";
import Projects from "../../components/ProjectStuff/Projects";
import Container from "../../components/Container";
