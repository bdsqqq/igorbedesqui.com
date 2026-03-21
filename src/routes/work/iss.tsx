import { createFileRoute } from "@tanstack/react-router";
import IssPage from "app/work/iss/page";
import { issMeta } from "app/work/metas";

export const Route = createFileRoute("/work/iss")({
  component: IssPage,
  head: () => ({
    meta: [
      { title: `${issMeta.name} — Igor Bedesqui` },
      {
        name: "description",
        content: issMeta.description,
      },
    ],
  }),
});
