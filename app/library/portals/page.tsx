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
} from "app/library/portals/showcase";
import { promises as fs } from "fs";

export default async function Page() {
  const PortalsSource = await fs.readFile(
    process.cwd() + "/components/ui/Portal/index.tsx",
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
              # Portals
              
              Usually, **the react tree maps 1:1 with the DOM tree. However, this is not always convenient.** The most common cases where this is unwanted is for dialogs, dropdowns, and any other UI element that needs to be rendered on top of everything else. Libraries like Radix UI and Ariakit deal with this by letting you use the component anywhere in the react tree, but rendering it at the end of the body tag in the DOM tree.
              
              This solution is possible due to **\`Portals\`, a React primitive** that **lets you untie the react tree and the DOM tree.** When an element is "Portalled" it's life-cycle, access to context providers, and event propagation will be tied to the react tree, but the rendred DOM element will be placed inside an of our choosing, anywhere in the DOM.
              
              **These are some helpers I always end up creating to make Portals more ergonomic and easier to debug.**
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
${PortalsSource}
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
