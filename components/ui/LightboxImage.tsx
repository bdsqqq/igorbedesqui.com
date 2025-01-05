"use client";
import { Border } from "@/components/ui/Border";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { cn } from "@/lib/styling";
import { Cross2Icon, EnterFullScreenIcon } from "@radix-ui/react-icons";
import { motion } from "motion/react";
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
            className="w-full rounded-inherit bg-gray-01"
            {...props}
          />

          <DialogTrigger asChild>
            <Button
              onClick={() => setOpen(true)}
              icon={<EnterFullScreenIcon />}
              className="absolute right-0 top-0 bg-gray-00"
            />
          </DialogTrigger>
        </>
      </MotionBorder>

      <DialogContent onClick={(e) => setOpen(false)} className="bottom-0 left-0 right-0 top-0 grid w-full max-w-none translate-x-0 translate-y-0 place-items-center bg-transparent p-0">
        <MotionBorder layoutId={props.src as string} asWrapper>
          <MotionImage {...props} />
        </MotionBorder>

          <DialogClose asChild>
            <Button
              onClick={() => setOpen(false)}
              icon={<Cross2Icon aria-label="Close" />}
              className="absolute right-4 top-4"
            />
          </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
