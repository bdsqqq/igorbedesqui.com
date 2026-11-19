import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/route-catalog";
import { SyncedPositions } from "~/routes/play/synced-positions/-positions";

function SyncedPositionsPlayPage() {
  return (
    <div className="grid min-h-dvh place-items-center">
      <SyncedPositions className="w-96 grid grid-cols-3 gap-8" />
    </div>
  );
}

const page = {
  name: "Synced positions",
};

export const Route = createFileRoute("/play/synced-positions")({
  component: SyncedPositionsPlayPage,
  staticData: { page },
  head: () => pageHead(page, "Play"),
});
