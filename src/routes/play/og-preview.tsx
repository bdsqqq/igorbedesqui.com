import { createFileRoute } from "@tanstack/react-router";
import OgPreviewPage from "app/play/og-preview/page";

export const Route = createFileRoute("/play/og-preview")({
  component: OgPreviewPage,
  head: () => ({
    meta: [{ title: "OG Preview — Play — Igor Bedesqui" }],
  }),
});
