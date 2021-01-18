import NextLink from "next/link";
import Image from "next/image";

import Footer from "./Footer";
import ChangeLang from "./ChangeLang";
interface ContainerProps {
  heading: JSX.Element;
  heroSrc: string;
}

const Container: React.FC<ContainerProps> = ({
  heading,
  heroSrc,
  children,
}) => {
  return (
    <div className="relative min-h-screen">
      <div className="absolute h-70vh w-full my-0 mx-auto">
        <Image
          className="p-16-caralho md:p-24-caralho"
          src={heroSrc}
          alt=""
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute h-full w-full bg-oliver-light bg-opacity-90" />
      </div>
      <div className="h-70vh relative">
        <nav className="flex justify-between items-start w-full px-8 py-8 my-0 md:pt-8 md:px-16 mx-auto">
          <div>
            <h1 className="font-bold text-xl md:text-2xl my-auto tracking-tight text-gray-700"></h1>
          </div>
          <div>
            <ChangeLang
              generalClasses="p-1 sm:p-2 lowercase"
              activeClasses="font-bold text-gray-900"
              inactiveClasses="text-gray-500"
            />
          </div>
        </nav>
        <h1 className="max-w-xs mx-8 mt-8 md:max-w-3xl md:mx-16 md:mt-16 text-lg md:text-3xl tracking-tight mb-4 text-oliver-500 md:leading-snug uppercase">
          {heading}
        </h1>
      </div>
      <div className="relative -mt-2 bg-oliver-light min-h-30vh rounded-tl-2xl w-full">
        <main className="flex flex-col justify-center">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Container;
