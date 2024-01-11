import { cn } from "@/lib/styling";
import {
  Children,
  forwardRef,
  isValidElement,
  type PropsWithChildren,
} from "react";
import { Slot } from "@radix-ui/react-slot";

/**
 * @see https://html.spec.whatwg.org/multipage/syntax.html#void-elements
 */
const VOID_ELEMENTS = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
];

const MANUALLY_ADDED_ELEMENTS_THAT_BEHAVE_LIKE_VOID = ["video"];

export const shadowBorderStyles =
  "relative after:pointer-events-none after:absolute after:inset-0 after:block after:rounded-inherit after:shadow-[0px_0px_0px_1px_inset_--tw-shadow-color] after:shadow-gray-A5 overflow-hidden";

export type BorderProps = PropsWithChildren<{
  className?: string;
  asWrapper?: boolean;
}>;

/**
 * Nice gradient borders around elements.
 *
 * This relies on the :after pseudo-element
 * any void element (elements that can't contain children
 * eg: img, video, inputs, other self-closing elements)
 * should use the `asWrapper` prop to render a helper div.
 *
 * This component will try to automatically detect if the child is a void element,
 * but it's not perfect, so it's recommended to explicitly set `asWrapper` to true
 * when needed.
 */
export const Border = forwardRef<HTMLElement, BorderProps>(
  ({ children, asWrapper, className, ...rest }, ref) => {
    if (children === undefined || children === null) {
      console.error("Border must have a child");
      throw new Error("Border must have a child");
      return null;
    }

    if (
      typeof children === "string" ||
      typeof children === "number" ||
      typeof children === "boolean" ||
      Array.isArray(children)
    ) {
      console.error("Border's child must be a single React element");
      throw new Error("Border's child must be a single React element");
      return null;
    }

    const child = Children.only(children) as React.ReactElement;
    const shouldWrap =
      VOID_ELEMENTS.includes(child.type as string) ||
      MANUALLY_ADDED_ELEMENTS_THAT_BEHAVE_LIKE_VOID.includes(
        child.type as string
      );
    const isValid = isValidElement(child);
    if (!isValid)
      throw new Error(
        `Border's child must be a valid react element, got ${typeof child}`
      );

    if (!asWrapper && shouldWrap) {
      console.warn(
        "Border's child is a void element, you should use the `asWrapper` prop to render a helper div"
      );

      if (asWrapper === undefined && shouldWrap) {
        console.warn(
          "Automatically wrapping void element in a helper div, if you want to avoid this behavior, set the `asWrapper` prop explicitly"
        );
        return (
          <span
            className={cn("block", shadowBorderStyles, className)}
            {...rest}
          >
            {children}
          </span>
        );
      }
    }

    if (asWrapper)
      return (
        <span className={cn("block", shadowBorderStyles, className)} {...rest}>
          {children}
        </span>
      );

    return (
      <Slot className={cn(shadowBorderStyles, className)} {...rest}>
        {children}
      </Slot>
    );
  }
);
Border.displayName = "Border";
