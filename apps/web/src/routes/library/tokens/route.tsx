import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/route-catalog";
import { TokenExplorer } from "./-explorer";

const page = {
  name: "Tokens",
  description: "Colors, type, spacing, and motion from the site’s CSS.",
};

export const Route = createFileRoute("/library/tokens")({
  component: TokenExplorer,
  staticData: { page },
  head: () => pageHead(page, "Library"),
});
