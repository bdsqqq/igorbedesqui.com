"use client";

import { Button, ButtonGroup } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { InPortal, OutPortal, useOutPortal } from "@/components/ui/Portal";
import { PortalDevtools } from "@/components/ui/Portal/devtools";
import { cn } from "@/lib/styling";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { ReactNode, useCallback, useRef, useState } from "react";

export const TOOLBOX_PORTAL_NAME = "toolbox";

export const Toolbox = () => {
  const [isDebugging, setIsDebugging] = useState(false);
  const toggleDebugging = useCallback(() => {
    setIsDebugging((prev) => !prev);
  }, []);

  const toolboxRef = useOutPortal<HTMLDivElement>(TOOLBOX_PORTAL_NAME);

  return (
    <>
      <ToolboxItem name="portal-debugging">
        <Popover>
          <PopoverTrigger asChild>
            <Button onClick={toggleDebugging} icon={<OpenInNewWindowIcon />} />
          </PopoverTrigger>
          <PopoverContent side="left" align="start">
            <PortalDevtools />
          </PopoverContent>
        </Popover>
      </ToolboxItem>

      <div
        className={cn(
          "fixed right-4 top-4 z-50",
          `opacity-0 transition-opacity duration-fast-02 ease-productive-standard focus-within:opacity-100 hover:opacity-100 has-[button[data-state="open"]]:opacity-100`,
        )}
      >
        <ButtonGroup orientation="vertical" ref={toolboxRef} />
      </div>
    </>
  );
};

export const ToolboxItem = ({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) => {
  return (
    <InPortal name={name} outPortalName={TOOLBOX_PORTAL_NAME}>
      {children}
    </InPortal>
  );
};
