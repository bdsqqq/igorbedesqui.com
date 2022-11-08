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
  fullBleed,
}) => {
  return (
    <Band gridless id="hero" fullBleed={fullBleed}>
      <div className="relative w-full min-h-[40vh]">
        {(heroImg || heroVideo) && (
          <div className="absolute w-full h-full my-0 mx-auto">
            <div className="overflow-hidden w-full h-full absolute pl-16 md:p-0 md:pl-72">
              {heroImg && !!!heroVideo && (
                <Image
                  priority
                  src={heroImg.src}
                  alt={heroImg.alt}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                />
              )}

              {heroVideo && (
                <video
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
              <div className="absolute w-full h-full top-0 bg-mauve1 opacity-75" />
            </div>
          </div>
        )}
        <div className="relative min-h-[40vh] flex items-center md:max-w-7xl">
          <h1
            className="mb-4 uppercase tracking-tight text-3xl max-w-xl md:w-2/3 md:text-4xl"
            id="skip"
          >
            {children}
          </h1>
        </div>
      </div>
    </Band>
  );
};

export default HeroBand;

import Band from "@/components/Band";

import Image from "next/image";
import React from "react";
