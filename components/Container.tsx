import NextLink from "next/link";
import Image from "next/image";

import Footer from "./Footer";

const Container: React.FC = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      <div className="absolute h-70vh w-full my-0 mx-auto">
        <Image
          className="p-16-caralho md:p-24-caralho"
          src="/images/giphy.gif"
          alt=""
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute h-full w-full bg-gray-400 bg-opacity-70" />
      </div>
      <div className="z-10 h-70vh relative">
        <nav className="sticky-nav flex justify-between items-start w-full px-8 py-8 my-0 md:pt-8 md:px-16 mx-auto">
          <div>
            <h1 className="font-bold text-xl md:text-2xl my-auto tracking-tight text-gray-700">
              IgorBedesqui
            </h1>
          </div>
          <div>
            <NextLink href="/work">
              <a className="p-1 sm:p-4 text-gray-900">/work </a>
            </NextLink>
          </div>
        </nav>
        <h1 className="max-w-xs mx-8 mt-8 md:max-w-3xl md:mx-16 md:mt-16 font-bold text-3xl md:text-5xl tracking-tight mb-4 text-gray-700 uppercase">
          desenvolvedor criativo pronto para criar algo incrivel
        </h1>
      </div>
      <div className="z-10 relative -mt-6 bg-gray-300 rounded-tl-2xl min-h-30vh w-full px-8">
        <main className="flex flex-col justify-center max-w-5xl mx-auto">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Container;
