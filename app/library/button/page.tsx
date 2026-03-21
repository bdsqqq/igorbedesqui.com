import { promises as fs } from "fs";
import { ButtonPageContent } from "./content";

export default async function Page() {
  const source = await fs.readFile(
    process.cwd() + "/components/ui/Button/ClientButton.tsx",
    "utf8",
  );

  return <ButtonPageContent source={source} />;
}
