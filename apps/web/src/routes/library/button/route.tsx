import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { promises as fs } from "node:fs";
import { ButtonPageContent } from "./-content";

const getButtonSource = createServerFn().handler(async () => {
  return fs.readFile(
    process.cwd() + "/src/routes/library/button/-client-button.tsx",
    "utf8",
  );
});

export const Route = createFileRoute("/library/button")({
  loader: () => getButtonSource(),
  component: ButtonRoute,
  head: () => ({
    meta: [{ title: "Button — Library — Igor Bedesqui" }],
  }),
});

function ButtonRoute() {
  const source = Route.useLoaderData();
  return <ButtonPageContent source={source} />;
}
