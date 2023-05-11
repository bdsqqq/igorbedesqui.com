"use client";

export const Overlay = () => {
  const [mode, setMode] = useState<"wide" | "narrow" | "condensed">("narrow");
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <>
      <div className="fixed top-4 right-4 z-50 opacity-0 transition-opacity duration-fast-02 ease-productive-standard focus-within:opacity-100 hover:opacity-100">
        <Button
          onClick={() => {
            setVisible((v) => !v);
          }}
          className="h-8"
          size="sm"
        >
          {visible ? <EyeOpenIcon /> : <EyeClosedIcon />}
        </Button>
      </div>

      <div
        className={cn(
          !visible && "hidden",
          "pointer-events-none absolute inset-0 z-50 bg-gray-A4"
        )}
      >
        <div
          className={cn(grid({ mode: mode }), "h-full w-full px-4 md:px-16")}
        >
          {[...Array(16)].map((_, i) => {
            return (
              <div key={i} className="border-x border-gray-A6 bg-gray-A4">
                <div className="h-full w-full bg-gray-A4" />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

import { grid } from "@/components/ui/Grid";

import { useState, Fragment } from "react";
import { Button } from "@/ui/Button";
import { EyeClosedIcon, EyeOpenIcon, LayoutIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/styling";
