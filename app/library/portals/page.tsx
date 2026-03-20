import { promises as fs } from "fs";
import { PortalsView } from "./view";

export default async function Page() {
  const source = await fs.readFile(
    process.cwd() + "/components/ui/Portal/index.tsx",
    "utf8",
  );

  return <PortalsView source={source} />;
}
