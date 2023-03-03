const grid = cva("grid grid-cols-4 md:grid-cols-8 lg:grid-cols-16", {
  variants: {
    mode: {
      // wide: "gap-x-8",
      // narrow: "gap-x-4",
      // condensed: "gap-x-[1px]",
      wide: "[&>*]:px-8",
      narrow: "[&>*]:px-4",
      condensed: "[&>*]:px-[1px]",
    },
  },
  defaultVariants: {
    mode: "narrow",
  },
});

// all arguments are optional
const subGrid = (
  { lg = 14, md = 7, sm = 4 }: { lg?: number; md?: number; sm?: number } = {
    lg: 14,
    md: 7,
    sm: 4,
  }
) => {
  return cva(`grid grid-cols-${sm} md:grid-cols-${md} lg:grid-cols-${lg}`, {
    variants: {
      mode: {
        wide: "[&>*]:px-8 -mx-8",
        narrow: "[&>*]:px-4 -mx-4",
        condensed: "[&>*]:px-[1px] -mx-[1px]",
      },
    },
    defaultVariants: {
      mode: "narrow",
    },
  });
};

export { grid, subGrid };

import { cva } from "class-variance-authority";
