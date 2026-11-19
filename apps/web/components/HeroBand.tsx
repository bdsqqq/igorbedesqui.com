import type { ComponentPropsWithRef, ReactNode } from "react";
import Band from "@/components/Band";
import { cn } from "@/lib/styling";
import { Image } from "@/components/ui/Image";
import { grid } from "./ui/Grid";

type HeroBandImg = {
  heroImg?: { src: string; alt: string };
  heroVideo?: never;
};
type HeroBandVideo = {
  /** Bundled asset URLs from imports. */
  heroVideo?: { webm: string; mp4: string };
  heroImg?: never;
};
export type HeroBandMediaProps = HeroBandImg | HeroBandVideo;
export type HeroBandProps = ComponentPropsWithRef<"section"> & {
  headingProps?: Omit<ComponentPropsWithRef<"h1">, "children">;
} & (
    | (HeroBandMediaProps & { media?: never })
    | { media: ReactNode; heroImg?: never; heroVideo?: never }
  );

/** The data-backed media is also usable without the hero's page layout. */
export function HeroBandMedia({ heroImg, heroVideo }: HeroBandMediaProps) {
  if (heroVideo) {
    return (
      <video
        tabIndex={-1}
        preload="none"
        playsInline
        autoPlay
        muted
        loop
        className="visible h-full w-full object-cover object-center "
      >
        <source src={heroVideo.webm} type="video/webm" />
        <source src={heroVideo.mp4} type="video/mp4" />
      </video>
    );
  }
  return heroImg ? (
    <Image
      priority
      layout="fullWidth"
      className="h-full w-full object-center"
      src={heroImg.src}
      alt={heroImg.alt}
      objectFit="cover"
    />
  ) : null;
}

function HeroBand({
  heroImg,
  heroVideo,
  media,
  headingProps,
  id = "hero",
  children,
  ...props
}: HeroBandProps) {
  const visual =
    media !== undefined ? (
      media
    ) : heroImg || heroVideo ? (
      <HeroBandMedia {...(heroVideo ? { heroVideo } : { heroImg })} />
    ) : null;
  return (
    <Band gridless id={id} {...props}>
      <div
        className={cn(grid({ mode: "narrow" }), "relative min-h-[40vh] w-full")}
      >
        {visual !== null && visual !== undefined && visual !== false && (
          <div className="absolute col-span-full col-start-2 row-start-1 my-0 -ml-4 h-full w-full md:col-start-3 lg:col-start-5 lg:col-end-16">
            <div className="absolute h-full w-full overflow-hidden">
              {visual}
              <div className="bg-canvas absolute top-0 h-full w-full opacity-75" />
            </div>
          </div>
        )}
        <div className="relative col-span-full row-start-1 flex min-h-[40vh] items-center md:col-end-7 lg:col-start-2 lg:col-end-13">
          <h1
            {...headingProps}
            className={cn(
              "mb-4 text-3xl uppercase tracking-tight md:text-4xl",
              headingProps?.className,
            )}
          >
            {children}
          </h1>
        </div>
      </div>
    </Band>
  );
}

export default HeroBand;
