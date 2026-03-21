import { createFileRoute } from "@tanstack/react-router";
import SyncedPositionsPage from "app/play/synced-positions/page";

export const Route = createFileRoute("/play/synced-positions")({
  component: SyncedPositionsPage,
  head: () => ({
    meta: [{ title: "Synced Positions — Play — Igor Bedesqui" }],
  }),
});
