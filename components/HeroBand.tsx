type HeroBandProps = {
  heroImg?: {
    src: string;
    alt: string;
  };
};

const HeroBand: React.FC<HeroBandProps> = ({ heroImg, children }) => {
  return (
    <Band gridless id="hero" padless>
      <div className="relative w-full min-h-70vh">
        {heroImg && (
          <div className="absolute h-full w-full my-0 mx-auto">
            <Image
              priority
              className="p-sm-caralho md:p-lg-caralho"
              src={heroImg.src}
              alt={heroImg.alt}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
            />
            <div className="absolute h-full bg-igor-light w-full bg-opacity-75" />
          </div>
        )}
        <div className="relative min-h-70vh flex items-center">
          <h1
            id="skip"
            tabIndex={-1}
            className="max-w-2xl md:w-2/3 mx-8 md:mx-16 text-3xl tracking-tight mb-4 md:leading-snug uppercase"
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
import Band from "./Band";
