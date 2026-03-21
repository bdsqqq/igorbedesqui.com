import { createFileRoute } from "@tanstack/react-router";
import PlayPage from "app/play/page";

export const Route = createFileRoute("/play/")({
  component: PlayPage,
  head: () => ({
    meta: [
      { title: "Play — Igor Bedesqui" },
      {
        name: "description",
        content: "Interactive experiments and component explorations.",
      },
    ],
  }),
});
