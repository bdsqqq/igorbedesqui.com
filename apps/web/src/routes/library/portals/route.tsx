import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/route-catalog";
import { createServerFn } from "@tanstack/react-start";
import { promises as fs } from "node:fs";
import { PortalsPageContent } from "./-content";

const getPortalSource = createServerFn({ method: "GET" }).handler(async () => {
  return fs.readFile(
    process.cwd() + "/src/routes/library/portals/-portal.tsx",
    "utf8",
  );
});

const page = {
  name: "Portals",
  description: "Portal helpers, examples, and source.",
};

export const Route = createFileRoute("/library/portals")({
  loader: () => getPortalSource(),
  component: PortalsRoute,
  staticData: { page },
  head: () => pageHead(page, "Library"),
});

function PortalsRoute() {
  const source = Route.useLoaderData();
  return <PortalsPageContent source={source} />;
}
