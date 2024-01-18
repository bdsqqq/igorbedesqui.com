"use client";
import { Border } from "@/components/ui/Border";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { cn } from "@/lib/styling";
import { EnterFullScreenIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import Image, { ImageProps } from "next/image";
import { ComponentProps, useState } from "react";

const MotionImage = motion(Image);
const MotionBorder = motion(Border);

export const LightBox = ({
  className,
  ...props
}: ComponentProps<typeof MotionImage> & { className?: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
      }}
    >
      <MotionBorder
        layoutId={props.src as string}
        asWrapper
        className={cn("relative", open && "overflow-visible", className)}
      >
        <>
          <MotionImage
            className="w-full rounded-inherit bg-gray-1"
            {...props}
          />

          <DialogTrigger asChild>
            <Button className="absolute top-0 right-0 h-8 bg-gray-0">
              <EnterFullScreenIcon />
            </Button>
          </DialogTrigger>
        </>
      </MotionBorder>

      <DialogContent className="!pointer-events-none top-px left-0 right-0 bottom-0 grid w-full max-w-none translate-x-0 translate-y-0 place-items-center bg-transparent p-0">
        <MotionBorder layoutId={props.src as string} asWrapper>
          <MotionImage {...props} />
        </MotionBorder>
      </DialogContent>
    </Dialog>
  );
};
