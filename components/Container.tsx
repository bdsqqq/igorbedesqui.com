type ContainerProps =
  | {
      heading: JSX.Element;
      heroImg?: {
        src: string;
        alt: string;
      };
      backable?: boolean;
      backMessage?: never;
      backTarget?: never;
    }
  | {
      heading: JSX.Element;
      heroImg?: {
        src: string;
        alt: string;
      };
      backable: true;
      backMessage?: string;
      backTarget?: string;
    };

const Container: React.FC<ContainerProps> = ({
  heading,
  heroImg,
  backable,
  backMessage,
  backTarget,
  children,
}) => {
  const childrenArray: any = Children.toArray(children);
  const dark: boolean | undefined =
    childrenArray[childrenArray.length - 1].props.dark;

  return (
    <div className="relative min-h-screen bg-igor-light">
      {heroImg && (
        <div className="absolute h-70vh w-full my-0 mx-auto">
          <Image
            priority
            className="p-16-caralho md:p-24-caralho"
            src={heroImg.src}
            alt={heroImg.alt}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
          <div className="absolute h-full w-full bg-igor-light bg-opacity-75" />
        </div>
      )}
      <div className="h-70vh relative">
        {!backable ? (
          <MainNav />
        ) : (
          <MainNav
            backable={backable}
            backMessage={backMessage}
            backTarget={backTarget}
          />
        )}
        <h1
          id="skip"
          tabIndex={-1}
          className="max-w-2xl md:max-w-4xl mx-8 mt-8 md:mx-16 md:mt-16 text-lg sm:text-2xl md:text-3xl tracking-tight mb-4 text-igor-500 md:leading-snug uppercase"
        >
          {heading}
        </h1>
      </div>
      <div className="relative -mt-2 bg-igor-light min-h-30vh rounded-tl-2xl w-full">
        <main className="flex flex-col justify-center">{children}</main>
        <Footer dark={dark} />
      </div>
    </div>
  );
};

export default Container;

import { Children } from "react";
import Image from "next/image";

import MainNav from "./MainNav";
import Footer from "./Footer";
