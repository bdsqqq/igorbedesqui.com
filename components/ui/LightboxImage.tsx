"use client";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { cn } from "@/lib/styling";
import { EnterFullScreenIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import Image, { ImageProps } from "next/image";
import { ComponentProps, useState } from "react";

const MotionImage = motion(Image);

export const LightBox = (props: ComponentProps<typeof MotionImage>) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
      }}
    >
      <div className={cn("relative", open && "overflow-visible")}>
        <>
          <MotionImage
            layoutId={props.src as string}
            className="rounded-inherit bg-gray-1"
            {...props}
          />

          <DialogTrigger asChild>
            <Button className="absolute top-0 right-0 h-8 bg-gray-0">
              <EnterFullScreenIcon />
            </Button>
          </DialogTrigger>
        </>
      </div>

      <DialogContent className="!pointer-events-none top-0 left-0 right-0 bottom-0 grid w-full max-w-none translate-x-0 translate-y-0 place-items-center bg-transparent p-0">
        <MotionImage layoutId={props.src as string} {...props} />
      </DialogContent>
    </Dialog>
  );
};
