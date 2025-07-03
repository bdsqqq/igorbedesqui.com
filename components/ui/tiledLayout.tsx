import { cn } from "@/lib/styling";
import {
  Children,
  ComponentPropsWithoutRef,
  forwardRef,
  isValidElement,
  ReactElement,
  useId,
  cloneElement,
} from "react";

type TiledLayoutProps = ComponentPropsWithoutRef<"div"> & {
  direction: "horizontal" | "vertical";
};

/**
 * Makes a one-dimentional grid of elements where each element can take either as much space it needs OR stretch to fill the remaining space divided amongts the other elements that want it. Keeps the grid stable by rendering a fallback for conditionally rendered elements
 *
 * @usage
 * ```tsx
 *  <TiledLayout className="w-full h-dvh">
 *      <PrimaryNav />
 *      <TopNav />
 *      <TiledLayout
 *          className="h-96"
 *          direction="horizontal"
 *          data-tile-size="remainingSpace"
 *      >
 *          <Sidebar className="h-full" />
 *          <FlowsContent className="h-full" data- />
 *      </TiledLayout>
 * </TiledLayout>

 * ```
 *  would render a layout like this:
 *  ```
 *  ┌───────────────────────────────────────┐
 *  │ PrimaryNav                            │
 *  ┌───────────────────────────────────────┐
 *  │ TopNav                                │
 *  ┌────────┐──────────────────────────────┘
 *  │        │                              │
 *  │        │                              │
 *  │ Side   │                              │
 *  │  Bar   │     FlowsContent             │
 *  │        │                              │
 *  │        │                              │
 *  │        │                              │
 *  │        │                              │
 *  └────────┘──────────────────────────────┘
 *  ```
 * Instead of using `data-layout-size`, you can use the <Tile /> component for typesafe access to the properties used when defining the layout.
 * 
 */
export const TiledLayout = forwardRef<HTMLDivElement, TiledLayoutProps>(
  function TiledLayout(
    { direction, className, style, children, ...rest },
    ref,
  ) {
    const colsOrRows =
      direction === "horizontal" ? "gridTemplateColumns" : "gridTemplateRows";
    const layoutId = useId();

    const childrenArray = Children.toArray(children);

    /**
     * Copy of children, but with ReactNodes that are not ReactElements wrapped in a div.
     * ReactNodes that are not valid ReactElements are rendered as a single DOM node when in sequence.
     *
     *
     * ```
     *  <TiledLayout direction="vertical">
     *      <MockNav />
     *      <MockNav />
     *      {undefined}
     *      {null}
     *      {"string"}
     *      {42}
     *      {true}
     *      <Box />
     *  </TiledLayout>
     *  ```
     * Outputs:
     *  ```
     *  Children.toArray(children)
     *  > [[Object], [Object], "string", 42, [Object]]
     *  ```
     * that is rendered as follows in the DOM:
     *  ```
     *  div>
     *      <div></div>
     *      <div></div>
     *      "string" "42"
     *      <div></div>
     *  </div>
     *  ```
     * this treats "string" and "42" as a single thing,
     * so when using grid they occupy 1 grid cell instead of 2.
     *
     * To solve this issue, we wrap all non-ReactElements in a div.
     */
    const gridCellConsistentChildrenArray: ReactElement[] = childrenArray.map(
      (child, i) => {
        if (isValidElement(child)) {
          return child;
        }
        return (
          <Tile
            data-tile-size="fitContent"
            key={`${layoutId}-invalid_react_element_wrapper_for_child-${i}`}
          >
            {child}
          </Tile>
        );
      },
    );
    const colCells = gridCellConsistentChildrenArray.map((child) => {
      /**
       * Use whatever space the element needs, but don't grow beyong that.
       * If used "auto" instead, the item could grow if the grid had a defined height that wasn't fully occupied by the other items.
       */
      const fitContentCellSize = "minmax(auto, min-content)";

      const size = child.props["data-tile-size"];
      if (size === "fitContent") {
        return fitContentCellSize;
      }
      if (size === "remainingSpace") {
        /**
         * The remaining space will be divided amongst the other elements that want it.
         *
         * This follows the same logic as CSS grid's `fr` unit.
         * eg. if one has a `frOfRemainingSpace` of `1` and the other has a `frOfRemainingSpace` of `2` then the first element will get `1/3` of the remaining space and the second element will get `2/3` of the remaining space.
         *
         * ```
         * ┌───┐──────┐
         * │1fr│  2fr │
         * └───┘──────┘
         * ```
         *
         */
        return `minmax(0px, ${child.props["data-tile-fr-of-remaining-spacer"] ?? 1}fr)`;
      }
      return fitContentCellSize;
    });

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
            [colsOrRows]: colCells.join(" "),
          },
        }}
      >
        {gridCellConsistentChildrenArray}
      </div>
    );
  },
);

type TileProps =
  | {
      "data-tile-size": "fitContent";
      "data-tile-fr-of-remaining-space"?: never;
    }
  | {
      "data-tile-size": "remainingSpace";
      "data-tile-fr-of-remaining-space"?: number;
    };

export const Tile = ({
  asChild,
  children,
  ...props
}: TileProps & ComponentPropsWithoutRef<"div"> & { asChild?: boolean; children?: React.ReactNode }) => {
  if (asChild && isValidElement(children)) {
    return cloneElement(children as React.ReactElement<any>, {
      ...(children as React.ReactElement<any>).props,
      ...props,
    });
  }
  return <div {...props}>{children}</div>;
};
