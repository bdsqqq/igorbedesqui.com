import { createFileRoute } from "@tanstack/react-router";
import Container from "@/components/Container";
import Band from "@/components/Band";
import {
  Scales as ScalesFeature,
  ScalesInputs,
  ScalesResults,
} from "~/routes/writing/scales/-scales";

export const scalesMeta = {
  shortName: "Scales",
  name: "Scales",
  description: "An interactive exploration of typographic scales.",
  date: "",
  urlSlug: "scales",
  backMessage: "",
};

export const Route = createFileRoute("/writing/scales")({
  component: Scales,
  head: () => ({
    meta: [
      { title: `${scalesMeta.name} — Igor Bedesqui` },
      {
        name: "description",
        content: scalesMeta.description,
      },
    ],
  }),
});

function Scales() {
  return (
    <Container>
      <Band headline={{ bold: "01", thin: "what's this?" }}>
        <p className="lg:max-w-prose">
          {`Recently I've been curious about Design and its relation to website development. During one of my usual rabbit hole deep dives, I stumbled upon a blog post by spencer Mortensen. It was a fascinating read that went into detail about the history of the typographic scale. But more importantly to me, it presented a mathematical formula that can generate harmonic scales.`}
          <br />
          <br />
          {`Spencer Mortensen himself made a tool to calculate type scales, but after the subject lingered in my head for a while, I decided to implement my version of it.`}
        </p>
      </Band>
      <ScalesFeature>
        <Band headline={{ bold: "01", thin: "Title" }}>
          <ScalesInputs />
        </Band>
        <Band gridless options={{ padding: "none" }} id="results">
          <ScalesResults />
        </Band>
      </ScalesFeature>
    </Container>
  );
}
