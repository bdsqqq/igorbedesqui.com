type HeroBandImg = {
  heroImg?: {
    src: string;
    alt: string;
  };
  heroVideo?: never;
};

type HeroBandVideo = {
  heroVideo?: string;
  heroImg?: never;
};

type HeroBandProps = HeroBandVideo | HeroBandImg;

const HeroBand: React.FC<React.PropsWithChildren<HeroBandProps>> = ({
  heroImg,
  heroVideo,
  children,
}) => {
  return (
    <Band gridless id="hero">
      <div
        className={cn(grid({ mode: "narrow" }), "relative min-h-[40vh] w-full")}
      >
        {(heroImg || heroVideo) && (
          <div className="absolute col-span-full col-start-2 row-start-1 my-0 -ml-4 h-full w-full md:col-start-3 lg:col-start-5 lg:col-end-16">
            <div className="absolute h-full w-full overflow-hidden">
              {heroImg && !!!heroVideo && (
                <Image
                  priority
                  src={heroImg.src}
                  alt={heroImg.alt}
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              )}

              {heroVideo && (
                <video
                  tabIndex={-1}
                  preload="none"
                  playsInline
                  autoPlay
                  muted
                  loop
                  className="visible h-full w-full object-cover object-center "
                >
                  <source src={`${heroVideo}.webm`} type="video/webm" />
                  <source src={`${heroVideo}.mp4`} type="video/mp4" />
                </video>
              )}
              <div className="absolute top-0 h-full w-full bg-gray-1 opacity-75" />
            </div>
          </div>
        )}
        <div className="relative col-span-full row-start-1 flex min-h-[40vh] items-center md:col-end-7 lg:col-start-2 lg:col-end-13">
          <h1 className="mb-4 text-3xl uppercase tracking-tight md:text-4xl">
            {children}
          </h1>
        </div>
      </div>
    </Band>
  );
};

export default HeroBand;

import Band from "@/components/Band";
import { cn } from "@/lib/styling";

import Image from "next/image";
import React from "react";
import { grid } from "./ui/Grid";
