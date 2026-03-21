import { promises as fs } from "fs";
import { PortalsPageContent } from "./content";

export default async function Page() {
  const source = await fs.readFile(
    process.cwd() + "/components/ui/Portal/index.tsx",
    "utf8",
  );

  return <PortalsPageContent source={source} />;
}
