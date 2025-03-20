import Band from "@/components/Band";
import Container from "@/components/Container";
import { MDX } from "@/components/MDX";
import { grid, subGrid } from "@/components/ui/Grid";
import { cn } from "@/lib/styling";
import { dedent } from "app/play/markdown-popovers/page";
import { isValidElement, ReactElement } from "react";
import jsxToString from "react-element-to-jsx-string";

export default function Page() {
  return (
    <Container backable backAnchor="library">
      <Band gridless id="">
        <div className={cn(grid(), "gap-y-8")}>
          <section
            className={cn(
              "prose flex flex-col gap-6",
              "col-start-1 col-end-5 md:col-start-1 md:col-end-9 lg:col-start-1 lg:col-end-17",
            )}
          >
            {usages.map((usage) => {
              const formattedUsage = jsxToString(usage.code, {
                filterProps: ["data-display-name"],
                displayName(element: unknown) {
                  if (!isValidElement(element)) return "";

                  // console.log(element);
                  const el = element as ReactElement;
                  return (
                    (el.props as Record<string, unknown>)[
                      "data-display-name"
                    ]?.toString() ?? ""
                  );
                },
              }).replace(/ /g, " "); // replace spaces with non-breaking spaces, otherwise they'll be collapsed and indentation will break
              // to debug the string, use:
              // .replace(/ /g, "·") // Regular space
              // .replace(/\t/g, "→") // Tab
              // .replace(/\n/g, "↵") // Line feed
              // .replace(/\r/g, "←") // Carriage return
              // .replace(/\f/g, "♦") // Form feed
              // .replace(/\v/g, "↕") // Vertical tab
              // .replace(/\u00A0/g, "°"); // Non-breaking space

              return (
                <div
                  key={`${usage.title}-usage-fragment`}
                  className="max-w-prose"
                >
                  <MDX>
                    {`
                    ### ${usage.title}                    `}
                  </MDX>
                  <div className={cn("flex flex-col gap-2")}>
                    <div>
                      <MDX>
                        {`
                    \`\`\` jsx
                    ${formattedUsage}
                    \`\`\`
                    `}
                      </MDX>
                    </div>
                    <div>{usage.code}</div>
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </Band>
    </Container>
  );
}

const usages = [
  {
    title: "Quick Popover syntax",
    code: (
      <MDX data-display-name="MD">
        {dedent`
        I often use popovers to explain things, and it feels super annoying to actually write \`<Popover>\` and \`</Popover>\` everywhere. So now markdown footnotes are automatically transformed into popovers in my MD content.
        
        For example: [^Pandoc] is great, inline^[This is an inline footnote content.].
        or even a [multi word inline footnote^][Like this]
      
        
        [^Pandoc]: [Pandoc](https://pandoc.org) is a Haskell library for converting from one markup format to another, and a command-line tool that uses this library.
        `}
      </MDX>
    ),
  },
];
