interface Tooltip {
  children: React.ReactElement;
  content: React.ReactNode;
  options?: VariantProps<typeof tooltip> & {
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
        className={tooltip({
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

const tooltip = cva(
  [
    "relative text-mauve12 shadow-sm border border-mauve7 rounded-sm",
    "data-[leave]:opacity-0",
    "data-[dir=top]:origin-bottom",
    "data-[dir=bottom]:origin-top",
    "data-[enter]:data-[dir=top]:animate-scaleInSlideUp",
    // TODO: leat animation was playing on enter for some reason, see: https://twitter.com/bedesqui/status/1584761741053169666/video/1
    // "data-[leave]:data-[dir=top]:animate-scaleOutSlideDown",
    "data-[enter]:data-[dir=bottom]:animate-scaleInSlideDown",
    // "data-[leave]:data-[dir=bottom]:animate-scaleOutSlideUp",
    "motion-reduce:!animate-none",
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
