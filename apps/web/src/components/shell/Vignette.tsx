import { cn } from "@/lib/styling";
import { HTMLProps } from "react";

const directions = ["top", "bottom", "left", "right"] as const;
type Direction = (typeof directions)[number];
const orientations = ["vertical", "horizontal"] as const;
type Orientation = (typeof orientations)[number];

const orientation_of_dir: Record<Direction, Orientation> = {
  top: "vertical",
  bottom: "vertical",
  left: "horizontal",
  right: "horizontal",
} as const;

const ease_out_quart = (n: number) => Math.pow(n, 1.125);

/**
 * given N steps, and a function to calculate the value at each step,
 * returns an array of `opacity`(0-1), `at`(0-100) pairs.
 * ALWAYS puts the first step at 0% and the last step at 100%.
 */
const gradient_for = (steps: number, opacity_fn: (t: number) => number) => {
  return [
    { opacity: 0, at: 0 },
    ...Array.from({ length: steps }, (_, i) => {
      const t = i / steps;
      return {
        opacity: opacity_fn(t).toFixed(3),
        at: Math.round(t * 100),
      };
    }),
    { opacity: 1, at: 100 },
  ];
};

export const Fade = ({
  fade_stop_count = 4,
  to: direction,
  className,
  ...rest
}: {
  fade_stop_count?: number;
  to: Direction;
} & HTMLProps<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "pointer-events-none select-none",
        "from-transparent to-gray-01 fixed z-vignette",
        orientation_of_dir[direction] === "vertical" && "w-full",
        orientation_of_dir[direction] === "horizontal" && "h-full",
        direction === "top" && "bg-linear-to-t",
        direction === "bottom" && "bg-linear-to-b",
        direction === "left" && "bg-linear-to-l",
        direction === "right" && "bg-linear-to-r",
        className,
      )}
      style={{
        maskImage: `linear-gradient(to ${direction}, ${gradient_for(
          fade_stop_count,
          ease_out_quart,
        )
          .map(({ opacity, at }) => `rgba(0, 0, 0, ${opacity}) ${at}%`)
          .join(", ")}`,
      }}
      {...rest}
    />
  );
};
