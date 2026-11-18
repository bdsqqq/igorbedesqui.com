import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/route-catalog";
import { TokenExplorer } from "./-explorer";

const page = {
  name: "Design tokens",
  description:
    "Source-generated palettes, color recipes, and the site’s type, spacing, shape, and motion definitions.",
};

export const Route = createFileRoute("/library/tokens")({
  component: TokenExplorer,
  staticData: { page },
  head: () => pageHead(page, "Library"),
});
