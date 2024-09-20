import Band from "@/components/Band";
import Container from "@/components/Container";
import { MDX } from "@/components/MDX";
import { grid } from "@/components/ui/Grid";
import { cn } from "@/lib/styling";
import { Test } from "./client";

export default async function Page() {
  return (
    <Container backable backAnchor="library">
      <div className={"absolute inset-0 h-full overflow-clip"}>
        <Test />
      </div>

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

              `}
              </MDX>
            </section>
          </div>
        </div>
      </Band>
    </Container>
  );
}
