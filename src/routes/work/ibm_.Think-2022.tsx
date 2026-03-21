import { createFileRoute } from "@tanstack/react-router";
import ThinkPage from "app/work/ibm/Think-2022/page";

export const Route = createFileRoute("/work/ibm_/Think-2022")({
  component: ThinkPage,
  head: () => ({
    meta: [
      { title: "Think 2022 — Igor Bedesqui" },
      {
        name: "description",
        content:
          "Creating the digital experience for IBM's flagship event with bleeding-edge tech.",
      },
    ],
  }),
});
