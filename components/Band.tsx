interface BandPropsBasic {
  options?: VariantProps<typeof sectionStyles> & {
    subGrid?: {
      lg: number;
      md: number;
      sm: number;
    };
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

  {
    console.log(options?.subGrid);
  }

  return (
    <section
      className={cx(
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
            <div className="col-span-4 md:col-span-1 lg:col-span-2">
              <Headline bold={headline.bold} thin={headline.thin} />
            </div>

            <div className="md:col-start-2 lg:col-start-3 col-span-full">
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
    <h2 className="mb-12 h-max grid items-end md:items-start md:h-min md:sticky top-4 pr-16">
      <span className="font-bold text-gray-1 [grid-area:1/1/1/1] text-7xl leading-none md:[writing-mode:vertical-lr]">
        {bold}
      </span>
      <div className="font-bold align-top [grid-area:1/1/1/1] pb-4 md:w-min md:pl-2 md:pb-2 text-lg md:[writing-mode:vertical-lr]">
        {thin}
      </div>
    </h2>
  );
};

export default Band;

import { cva, cx, type VariantProps } from "class-variance-authority";
import React from "react";
import { grid, subGrid } from "@/ui/Grid";
