"use client";

export const Overlay = () => {
  const [mode, setMode] = useState<"wide" | "narrow" | "condensed">("narrow");
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <>
      <div className="fixed top-4 right-4 z-50 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-fast-02 ease-productive-standard">
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

import { grid } from "@/components/ui/Grid";

import { cx } from "class-variance-authority";
import { useState, Fragment } from "react";
import { Button } from "@/ui/Button";
import { EyeClosedIcon, EyeOpenIcon, LayoutIcon } from "@radix-ui/react-icons";
