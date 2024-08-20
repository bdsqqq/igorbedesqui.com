import { cn } from "@/lib/styling";
import {
  cloneElement,
  ComponentPropsWithoutRef,
  forwardRef,
  isValidElement,
  ReactElement,
  useId,
} from "react";

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
} & ComponentPropsWithoutRef<"div">;

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
