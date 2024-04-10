"use client";

export const Overlay = () => {
  const [mode, setMode] = useState<"wide" | "narrow" | "condensed">("narrow");
  const [visible, setVisible] = useState<boolean>(false);

  const setVisibleCallback = useCallback(() => {
    setVisible((v) => !v);
  }, []);

  return (
    <>
      <div className="fixed right-4 top-4 z-50">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className={cn(
                "h-8",
                "opacity-0 transition-opacity duration-fast-02 ease-productive-standard focus-within:opacity-100 hover:opacity-100 data-[state=open]:opacity-100",
              )}
            >
              <MixerHorizontalIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            options={{
              padding: "md",
            }}
            align="end"
          >
            <Button onClick={setVisibleCallback} className="h-8">
              <GridIcon />
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      <div
        className={cn(
          !visible ? "opacity-0" : "opacity-100",
          "pointer-events-none absolute inset-0 z-50 bg-gray-A1 transition-opacity duration-fast-01 ease-productive-standard",
        )}
      >
        <div
          className={cn(grid({ mode: mode }), "h-full w-full px-4 md:px-16")}
        >
          <GridColumns />
        </div>
      </div>

      {/* Subtle grid overlay visible at all times */}
      {/* <div className={cn("pointer-events-none absolute inset-0")}>
        <div
          className={cn(grid({ mode: mode }), "h-full w-full px-4 md:px-16")}
        >
          {[...Array(16)].map((_, i) => {
            return (
              <div
                key={`${i}-always_visible`}
                className={cn(
                  "hidden border-l border-dashed border-gray-A1",
                  i < 4 && "block",
                  i + 1 == 4 && "border-r md:border-r-0",
                  i < 8 && "md:block",
                  i + 1 == 8 && "md:border-r lg:border-r-0",
                  i < 16 && "lg:block",
                  i + 1 == 16 && "lg:border-r"
                )}
              >
                <div className="relative h-full w-full border-x border-dashed border-gray-A2" />
              </div>
            );
          })}
        </div>
      </div> */}
    </>
  );
};

const GridColumns = () => {
  return (
    <>
      {[...Array(16)].map((_, i) => {
        return (
          <div
            key={i}
            className={cn(
              "hidden border-x border-gray-A3 bg-gray-A2",
              i < 4 && "block",
              i < 8 && "md:block",
              i < 16 && "lg:block",
            )}
          >
            <div className="relative h-full w-full bg-gray-A2 text-center text-gray-10">
              <div className="sticky left-0 right-0 top-4">{i + 1}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};

import { grid } from "@/components/ui/Grid";

import { useState, Fragment, useCallback } from "react";
import { Button } from "@/ui/Button";
import {
  EyeClosedIcon,
  EyeOpenIcon,
  GridIcon,
  LayoutIcon,
  MixerHorizontalIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/styling";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
