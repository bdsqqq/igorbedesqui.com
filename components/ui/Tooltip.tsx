interface Tooltip {
  children: React.ReactElement;
  content: React.ReactNode;
  options?: VariantProps<typeof tooltipVariants> & {
    side?: "bottom" | "left" | "right" | "top" | undefined;
  };
}

const Tooltip: React.FC<Tooltip> = ({ children, content, options }) => {
  const tooltipState = useTooltipState({
    animated: true,
    placement: options?.side ?? "top",
    gutter: 0,
    timeout: 200,
  });

  return (
    <>
      <TooltipAnchor state={tooltipState}>
        {(referenceProps: any) => cloneElement(children, referenceProps)}
      </TooltipAnchor>
      <AriaKitTooltip
        state={tooltipState}
        className={tooltipVariants({
          bg: options?.bg,
          maxW: options?.maxW,
          size: options?.size,
        })}
        data-dir={options?.side || "top"}
      >
        {content}
        <TooltipArrow className="fill-mauve3 stroke-mauve7 filter drop-shadow-sm" />
      </AriaKitTooltip>
    </>
  );
};

const tooltipVariants = cva(
  [
    "text-mauve12 shadow-sm border border-mauve7 rounded-sm transform motion-safe:transition-all duration-fast-02",
    "data-[dir=top]:origin-bottom",
    "data-[dir=bottom]:origin-top",
    "data-[enter]:opacity-100 data-[enter]:translate-y-0 data-[enter]:scale-100 data-[enter]:ease-productive-enter",
    "data-[leave]:opacity-0 data-[leave]:scale-0 data-[leave]:ease-productive-exit",
    "data-[dir=top]:data-[leave]:translate-y-1",
    "data-[dir=bottom]:data-[leave]:-translate-y-1",
  ],
  {
    variants: {
      bg: {
        standard: "bg-mauve3",
        subtle: "bg-mauve2",
      },
      size: {
        sm: ["text-sm", "py-0.5", "px-1"],
        md: ["text-base", "py-1", "px-2"],
      },
      maxW: {
        full: "max-w-full",
        md: "max-w-[16rem]",
      },
    },
    defaultVariants: {
      bg: "standard",
      size: "md",
      maxW: "md",
    },
  }
);

import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import { cloneElement } from "react";
import {
  Tooltip as AriaKitTooltip,
  TooltipAnchor,
  useTooltipState,
  TooltipArrow,
} from "ariakit/tooltip";
export default Tooltip;
