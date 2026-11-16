"use client";
import { Border } from "@/components/ui/Border";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { cn } from "@/lib/styling";
import { isStaticImageData } from "@/lib/static-image";
import { Cross2Icon, EnterFullScreenIcon } from "@radix-ui/react-icons";
import { motion, useReducedMotion } from "motion/react";
import { Image } from "@/components/ui/Image";
import { ComponentProps, useId, useState } from "react";

const MotionImage = motion(Image);
const MotionBorder = motion(Border);

export const LightBox = ({
  className,
  ...props
}: ComponentProps<typeof MotionImage> & { className?: string }) => {
  const [open, setOpen] = useState(false);
  const instanceId = useId();
  const reducedMotion = useReducedMotion();
  // Reused image URLs must not join unrelated lightboxes' layout animations.
  const layoutId = reducedMotion
    ? undefined
    : `${instanceId}-${isStaticImageData(props.src) ? props.src.src : props.src}`;
  const transition = {
    duration: reducedMotion ? 0 : 0.3,
    ease: [0.32, 0.72, 0, 1] as const,
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
      }}
    >
      <MotionBorder
        layoutId={layoutId}
        transition={transition}
        asWrapper
        className={cn("relative", open && "overflow-visible", className)}
      >
        <>
          <MotionImage className="ak-frame w-full" {...props} />

          <DialogTrigger asChild>
            <Button
              aria-label="enlarge image"
              icon={<EnterFullScreenIcon />}
              className="absolute right-0 top-0 bg-gray-00"
            />
          </DialogTrigger>
        </>
      </MotionBorder>

      <DialogContent
        surface={false}
        aria-label={props.alt || "image preview"}
        onClick={() => setOpen(false)}
        className="surface-lightbox bottom-0 left-0 right-0 top-0 grid w-full max-w-none translate-x-0 translate-y-0 place-items-center"
      >
        {/* Release the shared layout on close while Ariakit retains the modal
            shell for the backdrop's exit and focus restoration. */}
        {open && (
          <MotionBorder
            layoutId={layoutId}
            transition={transition}
            asWrapper
            className="ak-frame-m-0"
          >
            <MotionImage {...props} />
          </MotionBorder>
        )}

        <DialogClose asChild>
          <Button
            aria-label="close image preview"
            icon={<Cross2Icon aria-label="Close" />}
            className="absolute right-4 top-4"
          />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
