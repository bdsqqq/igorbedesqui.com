import Band from "@/components/Band";
import Container from "@/components/Container";
import { MDX } from "@/components/MDX";
import { grid, subGrid } from "@/components/ui/Grid";
import { cn } from "@/lib/styling";
import {
  cloneElement,
  ComponentProps,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  useId,
} from "react";
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
                displayName(element) {
                  if (!isValidElement(element)) return "";

                  // console.log(element);
                  return element.props["data-display-name"] ?? "";
                },
              }).replace(/ /g, " "); // replace spaces with non-breaking spaces, otherwise they'll be collapsed and indentation will break
              // to debug the string, use:
              // .replace(/ /g, "·") // Regular space
              // .replace(/\t/g, "→") // Tab
              // .replace(/\n/g, "↵") // Line feed
              // .replace(/\r/g, "←") // Carriage return
              // .replace(/\f/g, "♦") // Form feed
              // .replace(/\v/g, "↕") // Vertical tab
              // .replace(/\u00A0/g, "°"); // Non-breaking space

              return (
                <div key={`${usage.title}-usage-fragment`}>
                  <MDX>
                    {`
                    ### ${usage.title}                    `}
                  </MDX>
                  <div
                    className={cn(
                      subGrid({
                        lg: 16,
                        md: 8,
                        sm: 4,
                      })({ mode: "narrow" }),
                    )}
                  >
                    <div className="col-start-1 col-end-5 md:col-start-1 md:col-end-5 lg:col-start-1 lg:col-end-8">
                      <MDX>
                        {`
                    \`\`\` jsx
                    ${formattedUsage}
                    \`\`\`
                    `}
                      </MDX>
                    </div>
                    <div
                      className={cn(
                        "col-start-1 col-end-5 md:col-start-5 md:col-end-9 lg:col-start-8 lg:col-end-17",
                      )}
                    >
                      {usage.code}
                    </div>
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

/**
 * A ReactElement or `undefined` or `null` AKA: elements, including conditionally rendered ones.
 */
export type TileNode = ReactElement | undefined | null;

type TiledLayoutProps = {
  nodes: (
    | {
        "~name"?: string;
        node: TileNode; // MUST VALIDATE BEFORE RENDERING
        size: "fitContent";
        frOfRemainingSpace?: never;
      }
    | {
        "~name"?: string;
        node: TileNode; // MUST VALIDATE BEFORE RENDERING
        size: "remainingSpace";
        /**
         * The remaining space will be divided amongst the other elements that want it.
         *
         * This follows the same logic as CSS grid's `fr` unit.
         * eg. if one has a `frOfRemainingSpace` of `1` and the other has a `frOfRemainingSpace` of `2` then the first element will get `1/3` of the remaining space and the second element will get `2/3` of the remaining space.
         * 
         * ```  
          ┌───┐──────┐  
          │1fr│  2fr │  
          └───┘──────┘  
         * ```
         * 
         */
        frOfRemainingSpace?: number;
      }
  )[];
  direction: "horizontal" | "vertical";
} & ComponentProps<"div">;

/**
 * Makes a one-dimentional grid of elements where each element can take either as much space it needs OR stretch to fill the remaining space divided amongts the other elements that want it. Keeps the grid stable by rendering a fallback for conditionally rendered elements
 *
 * @usage
 * ```tsx
 *  <TiledLayout
        className="w-full h-dvh"
        nodes={[
            {
            node: <PrimaryNav />,
            size: 'fitContent',
            },
            {
            node: <TopNav />,
            size: 'fitContent',
            },
            {
            node: (
                <TiledLayout
                    className="h-96"
                    direction="horizontal"
                    nodes={[
                        {
                            node: <Sidebar className="h-full" /> // can be a component that conditionally returns null|undefined|ReactElement. eg: a collapsible sidebar
                            size: 'fitContent',,
                        },
                        {
                            node: <FlowsContent className="h-full" />,
                            size: 'remainingSpace',
                        },
                    ]}
                />
            ),
            size: 'remainingSpace',
            },
        ]}
    />
 * ```
 *  would render a layout like this:
 *  ```  
    ┌───────────────────────────────────────┐
    │ PrimaryNav                            │
    ┌───────────────────────────────────────┐
    │ TopNav                                │
    ┌────────┐──────────────────────────────┘
    │        │                              │
    │        │                              │
    │ Side   │                              │
    │  Bar   │     FlowsContent             │
    │        │                              │
    │        │                              │
    │        │                              │
    │        │                              │
    └────────┘──────────────────────────────┘
    ```
 * 
 *  */
export const TiledLayout = forwardRef<HTMLDivElement, TiledLayoutProps>(
  function TiledLayout({ nodes, direction, className, style, ...rest }, ref) {
    const colsOrRows =
      direction === "horizontal" ? "gridTemplateColumns" : "gridTemplateRows";
    const layoutId = useId();

    return (
      <div
        ref={ref}
        {...rest}
        className={cn(
          "grid h-full",
          direction === "horizontal" && "min-w-0", // allow this element to shrink to fit it's parent instead of stretching it
          direction === "vertical" && "min-h-0", // allow this element to shrink to fit it's parent instead of stretching it
          className,
        )}
        style={{
          ...style,
          ...{
            [colsOrRows]: nodes
              .map((node) => {
                if (node.size === "remainingSpace") {
                  return `minmax(0px, ${node.frOfRemainingSpace ?? 1}fr)`; // minmax(0px, *fr) === share the remaining space with other minmax(0px, *fr) elements.
                }

                if (node.size === "fitContent") {
                  return "auto"; //auto === take up as much space as the element needs.
                }

                return "auto"; // default to auto to make TS happy
              })
              .join(" "),
          },
        }}
      >
        {nodes.map((entry, i) => {
          if (entry["~name"]) {
            console.debug(
              `node for ${entry["~name"]} is ${
                isValidElement(entry.node)
                  ? "valid"
                  : "invalid, replacing with empty div"
              }`,
              entry.node,
            );
          }

          const Node = isValidElement(entry.node) ? (
            cloneElement(entry.node, {
              key: `${layoutId}-node_${i}-cloned_provided_element`,
            }) // Need include a key, this is rendered from a map.
          ) : (
            <div
              data-fallback-for={entry["~name"]}
              key={`${layoutId}-node_${i}-invalid-_element_fallback`}
              className="h-full w-full"
            /> // default `undefined` and `null` elements to an empty div to preserve the grid.
          );

          return Node;
        })}
      </div>
    );
  },
);

// MOCK COMPONENTS
const Box = ({ children, className }: ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "relative z-aboveVignette border border-gray-A05 bg-gray-A02",
        className,
      )}
    >
      {children}
    </div>
  );
};

const MockNav = ({
  variant = "primary",
}: {
  variant?: "primary" | "secondary";
}) => {
  return (
    <Box className="flex w-full items-center justify-between gap-2 p-1">
      {variant === "primary" ? (
        <>
          <div className="flex gap-2">
            <Box className="aspect-square h-6" />
            <Box className="h-6 w-24" />
            <Box className="h-6 w-24" />
            <Box className="h-6 w-24" />
            <Box className="h-6 w-24" />
          </div>

          <div className="flex gap-2">
            <Box className="h-6 w-24" />
            <Box className="aspect-square h-6" />
          </div>
        </>
      ) : null}

      {variant === "secondary" ? (
        <>
          <div className="flex gap-2">
            <Box className="h-6 w-24" />
          </div>

          <div className="flex gap-2">
            <Box className="h-6 w-16" />
            <Box className="h-6 w-16" />
          </div>
        </>
      ) : null}
    </Box>
  );
};

const MockPage = ({
  className,
  ...props
}: ComponentProps<typeof TiledLayout>) => {
  return (
    <TiledLayout
      direction="vertical"
      nodes={[
        {
          node: <MockNav />,
          size: "fitContent",
        },
        {
          node: <MockNav variant="secondary" />,
          size: "fitContent",
        },
        {
          node: <MockMainWithSidebar />,
          size: "remainingSpace",
        },
      ]}
    />
  );
};

const MockMainWithSidebar = ({
  className,
  ...props
}: Omit<ComponentProps<typeof TiledLayout>, "nodes" | "direction">) => {
  return (
    <TiledLayout
      className={cn("h-96", className)}
      direction="horizontal"
      {...props}
      nodes={[
        {
          node: <Box className="w-40" />,
          size: "fitContent",
        },
        {
          node: <MockFlowsContent />,
          size: "remainingSpace",
        },
      ]}
    />
  );
};

const MockFlowsContent = ({
  className,
  ...props
}: Omit<ComponentProps<typeof TiledLayout>, "nodes" | "direction">) => {
  return (
    <TiledLayout
      direction="vertical"
      className={cn("h-full", className)}
      nodes={[
        {
          node: <Box className="h-full" data-display-name="Nav" />,
          size: "remainingSpace",
        },
        {
          node: <Box className="h-24" data-display-name="Nav" />,
          size: "fitContent",
        },
      ]}
    />
  );
};

const usages = [
  {
    title: "flows AKA: main nav, top nav, main with sidebar and content",
    code: (
      <TiledLayout
        direction="vertical"
        data-display-name="TiledLayout"
        nodes={[
          {
            node: <MockNav data-display-name="Nav" />,
            size: "fitContent",
          },
          {
            node: <MockNav data-display-name="Nav" variant="secondary" />,
            size: "fitContent",
          },
          {
            node: (
              <TiledLayout
                data-display-name="Main"
                className="h-96"
                direction="horizontal"
                nodes={[
                  {
                    node: undefined,
                    size: "fitContent",
                  },
                  {
                    node: (
                      <Box
                        data-display-name="sidebar"
                        className="h-full w-40"
                      />
                    ),
                    size: "fitContent",
                  },
                  {
                    node: <MockFlowsContent className="h-full" />,
                    size: "remainingSpace",
                  },
                ]}
              />
            ),
            size: "remainingSpace",
          },
        ]}
      />
    ),
  },
];
