import { createFileRoute } from "@tanstack/react-router";
import WorkPage from "app/work/page";

export const Route = createFileRoute("/work/")({
  component: WorkPage,
  head: () => ({
    meta: [
      { title: "Work — Igor Bedesqui" },
      {
        name: "description",
        content: "Selected work by Igor Bedesqui.",
      },
    ],
  }),
});
