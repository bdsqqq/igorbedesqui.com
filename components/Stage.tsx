import { cn } from "@/lib/styling";
import type { HTMLProps } from "react";
import { shadowBorderStyles } from "./ui/Border";
import { cva, type VariantProps } from "class-variance-authority";

const stageVariants = cva("", {
  variants: {
    border: {
      true: shadowBorderStyles,
    },
    rounded: {
      true: "rounded-md",
    },
  },
  defaultVariants: {
    border: true,
    rounded: true,
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
        "grid h-full w-full place-items-center p-4",
        stageVariants({ ...options }),
        className
      )}
      {...rest}
    />
  );
};

export const StagesWrap = ({
  className,
  ...rest
}: HTMLProps<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4",
        className
      )}
      {...rest}
    />
  );
};
