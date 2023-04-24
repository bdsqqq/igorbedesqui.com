interface BandPropsBasic {
  options?: VariantProps<typeof sectionStyles> & {
    subGrid?: {
      lg: number;
      md: number;
      sm: number;
    };
    narrow?: boolean;
  };
}

interface BandWithGrid extends BandPropsBasic {
  headline: {
    bold: string;
    thin: string;
  };
  gridless?: never;
  id?: never;
}

interface BandGridless extends BandPropsBasic {
  headline?: never;
  gridless: true;
  id: string;
}

export type BandProps = BandWithGrid | BandGridless;

// TODO: update this typedef and component API. Instead of a mandatory gridless I could assume it by the absence of heading. Also, I can probably write a typedef that gives me nicer autocomplete .

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

const Band: React.FC<React.PropsWithChildren<BandProps>> = ({
  gridless,
  options,
  id,
  headline,
  children,
}) => {
  let bandId: string = "";
  id && (bandId = id);
  headline && (bandId = headline.thin);

  return (
    <section
      className={cn(
        sectionStyles({
          padding: options?.padding,
        }),
        !gridless && !options?.subGrid ? "px-4 md:px-16" : ""
      )}
      id={bandId.replace(/\s+/g, "-").toLowerCase()}
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
                "col-span-4 md:col-span-1 md:-mx-4",
                options?.narrow ? "md:col-start-1 lg:col-start-4" : ""
              )}
            >
              <Headline bold={headline.bold} thin={headline.thin} />
            </div>

            <div
              className={cn(
                "col-span-full md:col-start-2 lg:col-start-2",
                options?.narrow ? "md:col-start-2 lg:col-start-5" : ""
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
};

const Headline = ({ bold, thin }: { bold: string; thin: string }) => {
  return (
    <h2 className="top-4 mb-12 grid h-max items-end pr-16 md:sticky md:h-min md:items-start">
      <span className="text-7xl font-bold leading-none text-gray-1 [grid-area:1/1/1/1] md:[writing-mode:vertical-lr]">
        {bold}
      </span>
      <div className="pb-4 align-top text-lg font-bold [grid-area:1/1/1/1] md:w-min md:pl-3 md:pb-3 md:[writing-mode:vertical-lr]">
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
