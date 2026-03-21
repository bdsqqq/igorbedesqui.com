import { createFileRoute } from "@tanstack/react-router";
import StyleOverhaulPage from "app/play/style-overhaul/page";

export const Route = createFileRoute("/play/style-overhaul")({
  component: StyleOverhaulPage,
  head: () => ({
    meta: [{ title: "Style Overhaul — Play — Igor Bedesqui" }],
  }),
});
