interface BandPropsBasic {
  fullBleed?: boolean;
  options?: VariantProps<typeof sectionStyles>;
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

type BandProps = BandWithGrid | BandGridless;

// TODO: update this typedef and component API. Instead of a mandatory gridless I could assume it by the absence of heading. Also, I can probably write a typedef that gives me nicer autocomplete .

const sectionStyles = cva("w-full", {
  variants: {
    padding: {
      none: "p-0",
      smol: "py-8",
      default: "p-8 md:px-16",
    },
  },
  defaultVariants: {
    padding: "default",
  },
});

const Band: React.FC<React.PropsWithChildren<BandProps>> = ({
  gridless,
  fullBleed,
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
      className={sectionStyles({ padding: options?.padding })}
      id={bandId.replace(/\s+/g, "-").toLowerCase()}
    >
      <div
        className={cva("", {
          variants: {
            gridless: {
              false: grid({ mode: "narrow" }),
            },
            fullBleed: {
              false: "md:max-w-7xl m-auto",
            },
          },
          defaultVariants: { gridless: false, fullBleed: false },
        })({ gridless: gridless, fullBleed: fullBleed })}
      >
        {!gridless ? (
          <>
            <h2 className="mb-12 h-max grid items-end md:items-start md:h-min md:sticky top-4 col-span-2 pr-16">
              <span className="font-bold text-gray-1 [grid-area:1/1/1/1] text-7xl leading-none md:[writing-mode:vertical-lr]">
                {headline?.bold}
              </span>
              <div className="font-bold align-top [grid-area:1/1/1/1] pb-4 md:w-min md:pl-2 md:pb-2 text-lg md:[writing-mode:vertical-lr]">
                {headline?.thin}
              </div>
            </h2>

            <div className="col-span-2 md:col-span-6 lg:col-span-14">
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

export default Band;

import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { grid } from "@/ui/Grid";
