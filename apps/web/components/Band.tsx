interface BandPropsBasic {
  options?: VariantProps<typeof sectionStyles> & {
    subGrid?: {
      lg?: number;
      md?: number;
      sm?: number;
    };
    narrow?: boolean;
  };
}

interface BandWithGrid extends BandPropsBasic {
  headline: {
    bold: string;
    thin: string;
  };
  gridless?: false;
  id?: string;
  renderHeadline?: (props: BandHeadlineProps) => React.ReactNode;
}

interface BandGridless extends BandPropsBasic {
  headline?: never;
  gridless: true;
  id: string;
  renderHeadline?: never;
}

export type BandProps = (BandWithGrid | BandGridless) &
  Omit<React.ComponentPropsWithRef<"section">, "id">;

export type BandHeadlineProps = Omit<
  React.ComponentPropsWithRef<"h2">,
  "children"
> & {
  bold: string;
  thin: string;
};

const sectionStyles = cva("w-full", {
  variants: {
    padding: {
      none: "p-0",
      default: "px-4 md:px-16",
    },
  },
  defaultVariants: {
    padding: "default",
  },
});

function Band({
  gridless,
  options,
  id,
  headline,
  children,
  className,
  renderHeadline,
  ...props
}: BandProps) {
  // Explicit IDs are caller-owned; only the convenient title-derived ID is slugged.
  const bandId = id ?? headline?.thin.replace(/\s+/g, "-").toLowerCase();

  return (
    <section
      className={cn(
        sectionStyles({
          padding: options?.padding,
        }),
        !gridless && !options?.subGrid ? "px-4 md:px-16" : "",
        className,
      )}
      id={bandId}
      {...props}
    >
      <div
        className={
          !gridless
            ? !!options?.subGrid
              ? subGrid({
                  lg: options?.subGrid?.lg,
                  md: options?.subGrid?.md,
                  sm: options?.subGrid?.sm,
                })({ mode: "narrow" })
              : grid({ mode: "narrow" })
            : ""
        }
      >
        {headline ? (
          <>
            <div
              className={cn(
                "z-aboveVignette col-span-4 md:col-span-1 md:-mx-4",
                options?.narrow ? "md:col-start-1 lg:col-start-4" : "",
              )}
            >
              {renderHeadline === undefined ? (
                <BandHeadline {...headline} />
              ) : (
                renderHeadline(headline)
              )}
            </div>

            <div
              className={cn(
                "col-span-full md:col-start-2 lg:col-start-2",
                options?.narrow ? "md:col-start-2 lg:col-start-5" : "",
              )}
            >
              {children}
            </div>
          </>
        ) : (
          <>{children}</>
        )}
      </div>
    </section>
  );
}

export const BandHeadline = ({
  bold,
  thin,
  className,
  ...props
}: BandHeadlineProps) => {
  return (
    <h2
      className={cn(
        "top-4 mb-12 grid h-max items-end pr-16 md:sticky md:h-min md:items-start",
        className,
      )}
      {...props}
    >
      <span className="text-gray-A02 text-7xl font-bold leading-none [grid-area:1/1/1/1] md:[writing-mode:vertical-lr]">
        {bold}
      </span>
      <div className="ak-ink-60 pb-4 align-top text-lg font-bold [grid-area:1/1/1/1] md:w-min md:pb-3 md:pl-3 md:[writing-mode:vertical-lr]">
        {thin}
      </div>
    </h2>
  );
};

export default Band;

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/styling";
import React from "react";
import { grid, subGrid } from "@/ui/Grid";
