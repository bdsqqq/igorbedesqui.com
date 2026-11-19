import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/route-catalog";
import Band from "@/components/Band";
import Container from "@/components/Container";
import HeroBand from "@/components/HeroBand";
import type { Meta } from "@/components/ProjectStuff/Projects";
import { AxiomStory } from "~/routes/work/axiom/-story";
import { axiomBeats } from "./-timeline";

export const axiomMeta: Meta = {
  shortName: "Axiom",
  name: "Axiom",
  description: "UI & Engineering for making sense of petabytes of logs.",
  roles: ["Lorem ipsum"],
  type: "Lorem ipsum",
  tools: [],
  date: "2023 ~ 2026",
  urlSlug: "axiom",
  draft: true,
};

function AxiomWorkPage() {
  return (
    <Container backable backAnchor="/work">
      <HeroBand>{axiomMeta.name}</HeroBand>
      <Band gridless id="timeline">
        <AxiomStory beats={axiomBeats} />
      </Band>
    </Container>
  );
}

const page = { ...axiomMeta, order: 0 };

export const Route = createFileRoute("/work/axiom")({
  component: AxiomWorkPage,
  staticData: { page },
  head: () => pageHead(page),
});
