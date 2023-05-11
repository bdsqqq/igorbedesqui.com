import { cn } from "@/lib/styling";
import { HTMLProps } from "react";

const dirs = ["top", "bottom", "left", "right"] as const;
type Dir = (typeof dirs)[number];

const opositeDir = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

const orientation = {
  top: "vertical",
  bottom: "vertical",
  left: "horizontal",
  right: "horizontal",
};

export const Fade = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 h-full w-full overflow-hidden">
      <FadeThing sizing={"300px"} pos="top" />
      {dirs.map((dir) => (
        <FadeThing key={dir} pos={dir} />
      ))}
    </div>
  );
};

const defaultSizes = {
  top: "100px",
  bottom: "100px",
  left: "20vw",
  right: "20vw",
};

const FadeThing = ({
  sizing,
  pos,
  className,
  ...rest
}: { sizing?: string; pos: Dir } & HTMLProps<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "fixed z-10 select-none from-transparent to-gray-1 blur-[1px] backdrop-filter",
        orientation[pos] === "vertical" && "w-full",
        orientation[pos] === "horizontal" &&
          "h-full min-w-[120px] max-md:hidden",
        pos === "top" && "top-0 bg-gradient-to-t",
        pos === "bottom" && "bottom-0 bg-gradient-to-b",
        pos === "left" && "-left-6 bg-gradient-to-l",
        pos === "right" && "-right-6 bg-gradient-to-r",
        className
      )}
      style={{
        [pos === "top" || pos === "bottom" ? "height" : "width"]:
          sizing || defaultSizes[pos],
        maskImage: `linear-gradient(to ${opositeDir[pos]}, var(--color-gray-1) 25%, transparent)`,
      }}
      {...rest}
    />
  );
};
