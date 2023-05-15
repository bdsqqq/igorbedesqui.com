import { cn } from "@/lib/styling";
import type { HTMLProps } from "react";
import { Border, shadowBorderStyles } from "./ui/Border";
import { cva, type VariantProps } from "class-variance-authority";

const stageVariants = cva("", {
  variants: {
    border: {
      true: shadowBorderStyles,
    },
  },
  defaultVariants: {
    border: true,
  },
});

type StageVariants = VariantProps<typeof stageVariants>;

/**
 * Used to preview components in isolation.
 */
export const Stage = ({
  options,
  className,
  ...rest
}: { options?: {} & StageVariants } & HTMLProps<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "grid min-h-[300px] place-items-center p-24",
        stageVariants({ ...options }),
        className
      )}
      {...rest}
    />
  );
};
