"use client";

import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { InPortal, OutPortal } from "@/components/ui/Portal";
import { cn } from "@/lib/styling";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";

const TOOLBOX_PORTAL_NAME = "toolbox";

export const Toolbox = () => {
  return (
    <div
      className={cn(
        "fixed right-4 top-4 z-50",
        "has-[data-state='open']: opacity-0 transition-opacity duration-fast-02 ease-productive-standard focus-within:opacity-100 hover:opacity-100",
      )}
    >
      <OutPortal name={TOOLBOX_PORTAL_NAME} />
    </div>
  );
};

export const ToolboxSection = ({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) => {
  return (
    <InPortal name={name} outPortalName={TOOLBOX_PORTAL_NAME}>
      <div className="flex gap-2">{children}</div>
    </InPortal>
  );
};
