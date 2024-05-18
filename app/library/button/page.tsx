import Band from "@/components/Band";
import Container from "@/components/Container";
import { MDX } from "@/components/MDX";
import { grid } from "@/components/ui/Grid";
import { cn } from "@/lib/styling";
import { promises as fs } from "fs";

export default async function Page() {
  const ButtonSource = await fs.readFile(
    process.cwd() + "/components/ui/Button.tsx",
    "utf8",
  );

  return (
    <Container backable backAnchor="library">
      <Band gridless id="">
        <div className={cn(grid(), " gap-y-8")}>
          <div
            className={
              "col-start-1 col-end-5 md:col-start-2 md:col-end-8 lg:col-start-2 lg:col-end-9"
            }
          >
            <section className="prose space-y-4">
              <MDX>
                {`
              # The last Button primitive
              
              A \`Button\` is usually the first component you'll create, and the one your users will interact with the most. Given it's importance, I find it important to use a primitive with good defaults and a few extra details. 
              `}
              </MDX>
            </section>
          </div>

          <section
            className={
              "col-start-1 col-end-5 md:col-start-2 md:col-end-8 lg:col-start-3 lg:col-end-15"
            }
          >
            <MDX>
              {`
\`\`\`jsx
${ButtonSource}
\`\`\``.trim()}
            </MDX>
          </section>
        </div>
      </Band>
    </Container>
  );
}
