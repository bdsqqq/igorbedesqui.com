import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/styling";
import { motion } from "motion/react";
import { Image } from "@/components/ui/Image";
import type { StaticImageData } from "@/lib/static-image";

export type AnimatedMedia =
  | { key: string; src: StaticImageData; type: "image" }
  | { key: string; src: string; type: "video" };

export const AnimatedElements = ({
  animation,
  media,
  className,
  ...props
}: ComponentPropsWithRef<"div"> & {
  animation: AnimationName;
  media: readonly AnimatedMedia[];
}) => {
  const duration = 0.2;
  // Intentional square crops: these previews read as floating cards, not literal screenshots.
  const tooltipThumbnailSize = 144;

  return (
    <div {...props} className={cn("grid grid-cols-1 grid-rows-1", className)}>
      {media.map((item, i) => (
        <motion.div
          key={`${item.key}-${i}`}
          {...animationFns[animation](i, duration)}
          className="ak-frame ak-frame-card/0 shadow row-start-1 row-end-1 col-start-1 col-end-1"
        >
          <div className="ak-layer ak-layer-lighten-6 ak-frame ak-frame-card/0 ak-frame-border w-36">
            {item.type === "image" ? (
              <Image
                src={item.src}
                alt=""
                width={tooltipThumbnailSize}
                aspectRatio={1}
                objectFit="cover"
                className="ak-frame w-full"
              />
            ) : (
              <video
                className="ak-frame w-full"
                src={item.src}
                autoPlay
                loop
                muted
                playsInline
              />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
const bouncyAnimation = (i: number, duration: number) => {
  return {
    initial: { scale: 0.5, opacity: 0, rotate: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: i !== 0 ? 10 * (i % 2 === 0 ? -1 : 1) : 0,
    },
    exit: { scale: 0.5, opacity: 0 },
    transition: {
      ease: [0.175, 0.885, 0.32, 1.275] as const,
      duration: duration,
      delay: i * duration * 0.3,
    },
    style: {
      marginLeft: `${i * 30}px`,
      marginTop: i !== 0 ? `${20 * (i % 2 === 0 ? 1 : -1)}px` : 0,
    },
  };
};

const glitchAnimation = (i: number, duration: number) => {
  return {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: [0, 1, 0, 1, 0, 1],
    },
    exit: {
      opacity: [1, 0, 1, 0, 1, 0],
    },
    transition: {
      duration: duration,
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      delay: i * duration * 0.3,
    },
    style: {
      marginLeft: `${i * 30}px`,
      marginTop: i !== 0 ? `${20 * (i % 2 === 0 ? 1 : -1)}px` : 0,
    },
  };
};

const animationFns = {
  bouncy: bouncyAnimation,
  glichy: glitchAnimation,
} as const;
export type AnimationName = keyof typeof animationFns;
