import { cn } from "@/lib/styling";
import type { HTMLProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const stageVariants = cva("", {
  variants: {
    border: {
      true: "ak-frame-ring",
    },
    rounded: {
      true: "ak-frame-card",
      false: "ak-frame-force ak-frame-rounded-none",
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
          "ak-layer ak-layer-canvas ak-ink-60 absolute -top-3 left-4 z-10 whitespace-nowrap px-0.5 text-center text-xs",
          title ? "block" : "hidden",
        )}
      >
        {title}
      </div>
      <div
        className={cn(
          "ak-layer ak-layer-darken-2 ak-frame ak-frame-p-card relative grid h-full w-full place-items-center overflow-visible",
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
