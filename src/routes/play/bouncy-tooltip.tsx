import { createFileRoute } from "@tanstack/react-router";
import BouncyTooltipPage from "app/play/bouncy-tooltip/page";

export const Route = createFileRoute("/play/bouncy-tooltip")({
  component: BouncyTooltipPage,
  head: () => ({
    meta: [{ title: "Bouncy Tooltip — Play — Igor Bedesqui" }],
  }),
});
