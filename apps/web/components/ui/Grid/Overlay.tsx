"use client";

import { useState } from "react";
import { grid } from "@/components/ui/Grid";
import { Button } from "~/routes/library/button/-button";
import { GridIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/styling";
import { ToolboxItem } from "@/components/toolbox";

/** This diagnostic must remain see-through; derive transparent paint from ink,
 * rather than opening opaque layers over the content being inspected. */
export const Overlay = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <ToolboxItem name="grid-overlay">
        <Button
          aria-pressed={visible}
          aria-label="toggle grid overlay"
          className="ak-frame-join-item"
          onClick={() => setVisible((value) => !value)}
          icon={<GridIcon />}
        />
      </ToolboxItem>
      <div
        aria-hidden="true"
        className={cn(
          visible ? "opacity-100" : "opacity-0",
          "pointer-events-none absolute inset-0 z-50 transition-opacity duration-fast-01 ease-productive-standard",
        )}
        style={{
          backgroundColor:
            "color-mix(in oklab, var(--ak-text) 1%, transparent)",
        }}
      >
        <div
          className={cn(
            grid({ mode: "narrow" }),
            "h-full w-full px-4 md:px-16",
          )}
        >
          {Array.from({ length: 16 }, (_, index) => (
            <div
              key={index}
              className={cn(
                "hidden border-x",
                index < 4 && "block",
                index < 8 && "md:block",
                index < 16 && "lg:block",
              )}
              style={{
                borderColor:
                  "color-mix(in oklab, var(--ak-text) 8%, transparent)",
                backgroundColor:
                  "color-mix(in oklab, var(--ak-text) 4%, transparent)",
              }}
            >
              <div className="relative h-full w-full text-center ak-ink-70">
                <div className="sticky inset-x-0 top-4">{index + 1}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
