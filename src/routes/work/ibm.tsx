import { createFileRoute } from "@tanstack/react-router";
import IbmPage from "app/work/ibm/page";
import { ibmMeta } from "app/work/metas";

export const Route = createFileRoute("/work/ibm")({
  component: IbmPage,
  head: () => ({
    meta: [
      { title: `${ibmMeta.name} — Igor Bedesqui` },
      {
        name: "description",
        content: ibmMeta.description,
      },
    ],
  }),
});
