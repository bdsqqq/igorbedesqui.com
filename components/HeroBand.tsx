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
    <Band gridless id="hero" padless>
      <div className="relative w-full min-h-70vh">
        {(heroImg || heroVideo) && (
          <div className="absolute h-full w-full my-0 mx-auto">
            {heroImg && (
              <Image
                priority
                className="p-sm-caralho md:p-lg-caralho"
                src={heroImg.src}
                alt={heroImg.alt}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
              />
            )}
            {heroVideo && (
              <div className="block overflow-hidden w-full h-full box-border absolute">
                <video
                  preload="none"
                  playsInline
                  autoPlay
                  muted
                  loop
                  className="absolute visible w-0 h-0 object-center object-cover min-h-full max-h-full min-w-full max-w-full p-sm-caralho md:p-lg-caralho"
                >
                  <source src={`${heroVideo}.webm`} type="video/webm" />
                  <source src={`${heroVideo}.mp4`} type="video/mp4" />
                </video>
              </div>
            )}
            <div className="absolute h-full bg-mauve-mauve1 w-full opacity-75" />
          </div>
        )}
        <div className="relative min-h-70vh flex items-center max-w-6xl px-8 md:px-16 mx-auto">
          <h1
            id="skip"
            tabIndex={-1}
            className="md:max-w-2xl md:w-2/3 md:mx-8 md:mr-16 text-2xl md:text-3xl tracking-tight mb-4 md:leading-snug uppercase"
          >
            {children}
          </h1>
        </div>
      </div>
    </Band>
  );
};

export default HeroBand;

import Image from "next/image";
import Band from "@/components/Band";
