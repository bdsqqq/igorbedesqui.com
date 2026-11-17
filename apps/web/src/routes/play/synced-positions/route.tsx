import { createFileRoute } from "@tanstack/react-router";
import { SyncedPositions } from "~/routes/play/synced-positions/-positions";

function SyncedPositionsPlayPage() {
  return (
    <div className="grid min-h-dvh place-items-center">
      <SyncedPositions className="w-96 grid grid-cols-3 gap-8" />
    </div>
  );
}

export const Route = createFileRoute("/play/synced-positions")({
  component: SyncedPositionsPlayPage,
  head: () => ({
    meta: [{ title: "Synced positions — Play — Igor Bedesqui" }],
  }),
});
