import { createFileRoute } from "@tanstack/react-router";
import ActionsPage from "app/play/actions/page";

export const Route = createFileRoute("/play/actions")({
  component: ActionsPage,
  head: () => ({
    meta: [{ title: "Actions — Play — Igor Bedesqui" }],
  }),
});
