import { createFileRoute } from "@tanstack/react-router";
import TheManualPage from "app/work/the-manual/page";
import { psykipMeta } from "app/work/metas";

export const Route = createFileRoute("/work/the-manual")({
  component: TheManualPage,
  head: () => ({
    meta: [
      { title: `${psykipMeta.name} — Igor Bedesqui` },
      {
        name: "description",
        content: psykipMeta.description,
      },
    ],
  }),
});
