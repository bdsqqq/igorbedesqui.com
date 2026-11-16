"use client";

import { cn } from "@/lib/styling";
import {
  Children,
  isValidElement,
  type PropsWithChildren,
  type Ref,
} from "react";
import { Role } from "@ariakit/react";

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
  "relative ak-frame ak-frame-ring ring-(--ak-edge)";

const wrapperStyles =
  "block ak-layer ak-layer-darken-2 [:where(&)]:ak-frame-card/0.5 [&>img]:ak-frame [&>video]:ak-frame";

export type BorderProps = PropsWithChildren<{
  className?: string;
  asWrapper?: boolean;
  ref?: Ref<HTMLElement>;
}>;

/**
 * Adds a frame edge to a child, or a recessed media bed when wrapping it.
 *
 * The ring stays outside the box so opaque media cannot paint over the edge.
 * A thin media inset lets direct image and video frames derive concentric radii.
 * The default frame has zero specificity so caller shortcuts can override it.
 *
 * This component will try to automatically detect if the child is a void element,
 * but it's not perfect, so it's recommended to explicitly set `asWrapper` to true
 * when needed.
 */
export function Border({
  children,
  asWrapper,
  className,
  ref,
  ...rest
}: BorderProps) {
  if (children === undefined || children === null) {
    console.error("Border must have a child");
    throw new Error("Border must have a child");
  }

  if (
    typeof children === "string" ||
    typeof children === "number" ||
    typeof children === "boolean" ||
    Array.isArray(children)
  ) {
    console.error("Border's child must be a single React element");
    throw new Error("Border's child must be a single React element");
  }

  const child = Children.only(children) as React.ReactElement;
  const shouldWrap =
    VOID_ELEMENTS.includes(child.type as string) ||
    MANUALLY_ADDED_ELEMENTS_THAT_BEHAVE_LIKE_VOID.includes(
      child.type as string,
    );
  const isValid = isValidElement(child);
  if (!isValid)
    throw new Error(
      `Border's child must be a valid react element, got ${typeof child}`,
    );

  if (!asWrapper && shouldWrap) {
    console.warn(
      "Border's child is a void element, you should use the `asWrapper` prop to render a helper div",
    );

    if (asWrapper === undefined && shouldWrap) {
      console.warn(
        "Automatically wrapping void element in a helper div, if you want to avoid this behavior, set the `asWrapper` prop explicitly",
      );
      return (
        <span
          className={cn(shadowBorderStyles, wrapperStyles, className)}
          ref={ref}
          {...rest}
        >
          {children}
        </span>
      );
    }
  }

  if (asWrapper)
    return (
      <span
        className={cn(shadowBorderStyles, wrapperStyles, className)}
        ref={ref}
        {...rest}
      >
        {children}
      </span>
    );

  return (
    <Role.span
      className={cn(shadowBorderStyles, className)}
      ref={ref}
      {...rest}
      render={child}
    />
  );
}
