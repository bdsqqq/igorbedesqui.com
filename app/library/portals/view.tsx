import Band from "@/components/Band";
import Container from "@/components/Container";
import { MDX } from "@/components/MDX";
import { grid } from "@/components/ui/Grid";
import { Separator } from "@/components/ui/Separator";
import { cn } from "@/lib/styling";
import {
  PortalShowcase_FarAwaySlots,
  PortalShowcase_Multiplexer,
  PortalShowcase_dynamicOut,
} from "./showcase";
import { PortalsContent } from "./content";

export function PortalsView({ source }: { source: string }) {
  return (
    <Container backable backAnchor="library">
      <Band gridless id="">
        <div className={cn(grid(), " gap-y-8")}>
          <div
            className={
              "col-start-1 col-end-5 md:col-start-2 md:col-end-8 lg:col-start-2 lg:col-end-9"
            }
          >
            <PortalsContent />
          </div>

          <section
            className={
              "col-start-1 col-end-5 md:col-start-2 md:col-end-8 lg:col-start-3 lg:col-end-15"
            }
          >
            <MDX>
              {`
\`\`\`jsx
${source}
\`\`\``.trim()}
            </MDX>
          </section>
        </div>
      </Band>
      <Band gridless id="showcase">
        <PortalShowcase_FarAwaySlots />
        <Separator />
        <PortalShowcase_Multiplexer />
        <Separator />
        <PortalShowcase_dynamicOut />
      </Band>
    </Container>
  );
}
