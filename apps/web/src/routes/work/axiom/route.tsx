import { createFileRoute } from "@tanstack/react-router";
import Band from "@/components/Band";
import Container from "@/components/Container";
import HeroBand from "@/components/HeroBand";
import type { Meta } from "@/components/ProjectStuff/Projects";
import { AxiomStory } from "@/components/features/axiom";
import { axiomBeats } from "./-timeline";

export const axiomMeta: Meta = {
  shortName: "Axiom",
  name: "Axiom",
  description: "Lorem ipsum dolor sit amet.",
  roles: ["Lorem ipsum"],
  type: "Lorem ipsum",
  tools: [],
  date: "Lorem ipsum",
  urlSlug: "axiom",
  draft: true,
};

function AxiomWorkPage() {
  return (
    <Container backable backAnchor="/work">
      <HeroBand>Axiom</HeroBand>
      <Band gridless id="timeline">
        <AxiomStory beats={axiomBeats} />
      </Band>
    </Container>
  );
}

export const Route = createFileRoute("/work/axiom")({
  component: AxiomWorkPage,
  head: () => ({
    meta: [
      { title: `${axiomMeta.name} — Igor Bedesqui` },
      {
        name: "description",
        content: axiomMeta.description,
      },
    ],
  }),
});
