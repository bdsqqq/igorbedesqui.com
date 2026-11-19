import { cn } from "@/lib/styling";
import type { HTMLProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const stageVariants = cva("", {
  variants: {
    border: {
      true: "ak-frame-border -ak-frame-m-px h-[calc(100%+2px)]",
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
    <div
      className={cn(
        "ak-layer ak-layer-darken-2 ak-frame ak-frame-p-card relative isolate flex h-full min-w-0 flex-col overflow-visible",
        stageVariants({ ...options }),
        className,
      )}
      {...rest}
    >
      {title && (
        <div className="ak-frame ak-frame-cover ak-frame-start px-4 py-1 text-xs ak-ink-60">
          {title}
        </div>
      )}
      <div
        className={cn("grid w-full flex-1 place-items-center", title && "pt-4")}
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
