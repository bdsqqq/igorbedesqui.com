import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { promises as fs } from "fs";
import { PortalsPageContent } from "app/library/portals/content";

const getPortalSource = createServerFn({ method: "GET" }).handler(async () => {
  return fs.readFile(
    process.cwd() + "/components/ui/Portal/index.tsx",
    "utf8",
  );
});

export const Route = createFileRoute("/library/portals")({
  loader: () => getPortalSource(),
  component: PortalsRoute,
  head: () => ({
    meta: [{ title: "Portals — Library — Igor Bedesqui" }],
  }),
});

function PortalsRoute() {
  const source = Route.useLoaderData();
  return <PortalsPageContent source={source} />;
}
