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
  children,
  className,
  title,
  ...rest
}: { options?: {} & StageVariants } & HTMLProps<HTMLDivElement>) => {
  return (
    <div className="relative isolate">
      <div
        className={cn(
          "text-gray-09 bg-gray-00 absolute -top-3 left-4 z-10 whitespace-nowrap px-0.5 text-center text-xs",
          title ? "block" : "hidden",
        )}
      >
        {title}
      </div>
      <div
        className={cn(
          "relative grid h-full w-full place-items-center overflow-visible p-4",
          stageVariants({ ...options }),
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    </div>
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
        className,
      )}
      {...rest}
    />
  );
};
