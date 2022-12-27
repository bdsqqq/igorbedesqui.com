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

type HeroBandProps = {
  fullBleed?: boolean;
} & (HeroBandVideo | HeroBandImg);

const HeroBand: React.FC<React.PropsWithChildren<HeroBandProps>> = ({
  heroImg,
  heroVideo,
  children,
}) => {
  return (
    <Band gridless id="hero">
      <div
        className={cx(grid({ mode: "narrow" }), "relative w-full min-h-[40vh]")}
      >
        {(heroImg || heroVideo) && (
          <div className="absolute w-full h-full my-0 -ml-4 col-start-2 md:col-start-3 lg:col-start-5 row-start-1 col-span-full">
            <div className="overflow-hidden w-full h-full absolute">
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
                  className="visible w-full h-full object-center object-cover "
                >
                  <source src={`${heroVideo}.webm`} type="video/webm" />
                  <source src={`${heroVideo}.mp4`} type="video/mp4" />
                </video>
              )}
              <div className="absolute w-full h-full top-0 bg-gray-1 opacity-75" />
            </div>
          </div>
        )}
        <div className="relative min-h-[40vh] col-span-full md:col-end-7 lg:col-end-13 row-start-1 flex items-center ">
          <h1 className="mb-4 uppercase tracking-tight text-3xl md:text-4xl">
            {children}
          </h1>
        </div>
      </div>
    </Band>
  );
};

export default HeroBand;

import Band from "@/components/Band";
import { cx } from "class-variance-authority";

import Image from "next/image";
import React from "react";
import { grid } from "./ui/Grid";
