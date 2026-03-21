import { createFileRoute } from "@tanstack/react-router";
import BebopPage from "app/work/bebop/page";
import { bebopMeta } from "app/work/metas";

export const Route = createFileRoute("/work/bebop")({
  component: BebopPage,
  head: () => ({
    meta: [
      { title: `${bebopMeta.name} — Igor Bedesqui` },
      {
        name: "description",
        content: bebopMeta.description,
      },
    ],
  }),
});
