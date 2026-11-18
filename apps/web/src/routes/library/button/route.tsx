import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/route-catalog";
import { createServerFn } from "@tanstack/react-start";
import { promises as fs } from "node:fs";
import { ButtonPageContent } from "./-content";

const getButtonSource = createServerFn().handler(async () => {
  return fs.readFile(
    process.cwd() + "/src/routes/library/button/-client-button.tsx",
    "utf8",
  );
});

const page = {
  name: "Button",
  description: "Button primitive permutations, composition, and source.",
};

export const Route = createFileRoute("/library/button")({
  loader: () => getButtonSource(),
  component: ButtonRoute,
  staticData: { page },
  head: () => pageHead(page, "Library"),
});

function ButtonRoute() {
  const source = Route.useLoaderData();
  return <ButtonPageContent source={source} />;
}
