import { MDX } from "@/components/MDX";

export function PortalsContent() {
  return (
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
  );
}
