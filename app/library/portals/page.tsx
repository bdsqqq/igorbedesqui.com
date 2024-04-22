import Container from "@/components/Container";
import { MDX } from "@/components/MDX";
import { Border } from "@/components/ui/Border";
import { CopyButton } from "@/components/ui/CopyButton";
import { grid, subGrid } from "@/components/ui/Grid";
import { InPortal } from "@/components/ui/Portal";
import { ScrollBar, ScrollArea } from "@/components/ui/ScrollArea";
import { cn } from "@/lib/styling";
import { promises as fs } from "fs";
import { ComponentProps } from "react";

// TODO: Turn this into the default CODE component for all MDX things.
// TODO: make this count the lines of it's children and set height accordingly; code will never wrap
const ScrollableCodeWithCopy = (
  props: ComponentProps<"code"> & { heightclassname: string },
) => {
  return (
    <Border>
      <pre className="relative -mx-4 my-2 rounded-sm bg-gray-2 text-sm">
        <ScrollArea className={cn("p-4", props.heightclassname)}>
          <code
            className={cn("rounded bg-gray-2 font-mono", props.className)}
            {...props}
          />
          <ScrollBar orientation="vertical" />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <CopyButton
          className="absolute right-0 top-0"
          contentToCopy={props.children?.toString() || ""}
        />
      </pre>
    </Border>
  );
};

export default async function Page() {
  const PortalsSource = await fs.readFile(
    process.cwd() + "/components/ui/Portal/index.tsx",
    "utf8",
  );

  return (
    <Container backable backAnchor="library">
      <div className={cn(grid({ mode: "narrow" }), "mt-32 gap-y-8")}>
        <div
          className={
            "col-start-1 col-end-5 md:col-start-2 md:col-end-8 lg:col-start-2 lg:col-end-9"
          }
        >
          <section className="space-y-4">
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
          <div className="">
            <ScrollableCodeWithCopy heightclassname="h-96">{`${PortalsSource}`}</ScrollableCodeWithCopy>
          </div>
        </section>
      </div>
    </Container>
  );
}
