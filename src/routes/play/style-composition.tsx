import { createFileRoute } from "@tanstack/react-router";
import StyleCompositionPage from "app/play/style-composition/page";

export const Route = createFileRoute("/play/style-composition")({
  component: StyleCompositionPage,
  head: () => ({
    meta: [{ title: "Style Composition — Play — Igor Bedesqui" }],
  }),
});
