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

const HeroBand: React.FC<HeroBandProps> = ({
  heroImg,
  heroVideo,
  children,
}) => {
  return (
    <Band gridless fullBleed id="hero" padless>
      <div className="relative w-full min-h-[70vh]">
        {(heroImg || heroVideo) && (
          <div className="absolute w-full h-full my-0 mx-auto">
            {heroImg && (
              <Image
                priority
                className="p-16 md:pr-24 md:pl-72"
                src={heroImg.src}
                alt={heroImg.alt}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
              />
            )}
            {heroVideo && (
              <div className="overflow-hidden w-full h-full absolute">
                <video
                  preload="none"
                  playsInline
                  autoPlay
                  muted
                  loop
                  className="absolute visible w-full h-full object-center object-cover p-16 md:pr-24 md:pl-72"
                >
                  <source src={`${heroVideo}.webm`} type="video/webm" />
                  <source src={`${heroVideo}.mp4`} type="video/mp4" />
                </video>
              </div>
            )}
            <div className="absolute  w-full h-full bg-mauve1 opacity-75" />
          </div>
        )}
        <div className="relative min-h-[70vh] flex items-center max-w-6xl p-8  md:p-16">
          <h1
            className="mb-4 uppercase tracking-tight text-3xl max-w-xl md:w-2/3  md:text-4xl"
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
