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
});

const Overlay = () => {
  const [mode, setMode] = useState<"wide" | "narrow" | "condensed">("wide");
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <>
      <div className="fixed top-4 right-4 z-50 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-fast-02 ease-productive-standard">
        <PopOver
          Icon={Fragment}
          content={
            <div>
              <div className="flex items-center">
                <Button
                  className="border-none"
                  onClick={() => setVisible((visible) => !visible)}
                >
                  {visible ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </Button>
              </div>
              <div>
                <Button
                  size="sm"
                  className="border-none"
                  onClick={() => setMode("wide")}
                >
                  Wide
                </Button>
                <Button
                  size="sm"
                  className="border-none"
                  onClick={() => setMode("narrow")}
                >
                  Narrow
                </Button>
                <Button
                  size="sm"
                  className="border-none"
                  onClick={() => setMode("condensed")}
                >
                  Condensed
                </Button>
              </div>
            </div>
          }
        >
          <Button className="h-8" size="sm">
            <LayoutIcon />
          </Button>
        </PopOver>
      </div>
      {visible && (
        <div className="z-50 absolute inset-0 pointer-events-none bg-gray-A4">
          <div
            className={cx(grid({ mode: mode }), "h-full w-full px-4 md:px-16")}
          >
            {[...Array(16)].map((_, i) => {
              return (
                <div key={i} className="bg-gray-A4 border-x border-gray-A6">
                  <div className="bg-gray-A4 h-full w-full" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

const subGrid = ({ lg, md, sm }: { lg: number; md: number; sm: number }) => {
  return cva(`grid grid-cols-${sm} md:grid-cols-${md} lg:grid-cols-${lg}`, {
    variants: {
      mode: {
        wide: "[&>*]:px-8 -mx-8",
        narrow: "[&>*]:px-4 -mx-4",
        condensed: "[&>*]:px-[1px] -mx-[1px]",
      },
    },
  });
};

export { Overlay, grid, subGrid };

import { useState, Fragment } from "react";

import { cva, cx } from "class-variance-authority";
import PopOver from "@/ui/Popover";
import { Button } from "@/ui/Button";
import { EyeClosedIcon, EyeOpenIcon, LayoutIcon } from "@radix-ui/react-icons";
