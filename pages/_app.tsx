import "../styles/globals.css";
import type { AppProps } from "next/app";
import { HistoryProvider } from "@/contexts/History";
import { MDXProvider } from "@mdx-js/react";

import StyledLinkWithIcon from "@/components/ui/StyledLink";

import { IBM_Plex_Serif } from "@next/font/google";
import { useEffect, useRef } from "react";

const customFont = IBM_Plex_Serif({
  display: "swap",
  subsets: ["latin"],
  weight: ["200", "400", "700"],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <HistoryProvider>
      <MDXProvider
        components={{
          // @ts-ignore
          a: (props) => <StyledLinkWithIcon {...props} />,
          h1: (props) => (
            <h1 className="text-2xl text-gray-11 mb-8" {...props} />
          ),
          h2: (props) => <h1 className="text-lg font-bold my-2" {...props} />,
          strong: (props) => (
            <strong className="font-bold text-gray-12" {...props} />
          ),
          pre: (props) => (
            <pre
              className="bg-gray-2 rounded p-4 my-2 overflow-x-auto text-sm"
              {...props}
            />
          ),
        }}
      >
        <div className={`${customFont.className} relative`}>
          <Grain />
          {/* <svg
            id="texture"
            className="filter contrast-[30%] brightness-[70%] z-40 pointer-events-none absolute inset-0 w-full h-full opacity-25 overflow-clip"
          >
            <filter id="noise">
              <feTurbulence
                type="fractalNoise"
                baseFrequency=".8"
                numOctaves="4"
                stitchTiles="stitch"
              ></feTurbulence>
              <feColorMatrix type="saturate" values="0"></feColorMatrix>
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)"></rect>
          </svg> */}
          <div className="max-w-4xl mx-auto relative">
            <Component {...pageProps} />
          </div>
          <div
            className="pointer-events-none w-full h-full top-0 absolute opacity-[3%] filter blur-[100px] saturate-150"
            style={{
              backgroundImage:
                "radial-gradient(at 27% 37%,#3a8bfd 0,transparent 0),radial-gradient(at 97% 21%,#72fe7d 0,transparent 50%),radial-gradient(at 52% 99%,#fd3a4e 0,transparent 50%),radial-gradient(at 10% 29%,#855afc 0,transparent 50%),radial-gradient(at 97% 96%,#e4c795 0,transparent 50%),radial-gradient(at 33% 50%,#8ca8e8 0,transparent 50%),radial-gradient(at 79% 53%,#eea5ba 0,transparent 50%)",
            }}
          />
        </div>
      </MDXProvider>
    </HistoryProvider>
  );
}

const Grain = () => {
  const grainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grain = grainRef.current;
    if (!grain) return;

    const offSets = ["-3", "-2", "-1", "0", "1", "2", "3"];
    let x = 3;
    let xUp = true;
    let y = 7;
    let yUp = true;

    const interval = setInterval(() => {
      grain.style.transform = `translateX(${offSets[x]}%) translateY(${offSets[y]}%)`;
      if (xUp) {
        x += Math.floor(Math.random() * 4);
        if (x >= offSets.length - 1) xUp = false;
      } else {
        x -= Math.floor(Math.random() * 4);
        if (x <= 0) xUp = true;
      }
      if (yUp) {
        y += Math.floor(Math.random() * 2);
        if (y >= offSets.length - 1) yUp = false;
      } else {
        y -= Math.floor(Math.random() * 2);
        if (y <= 0) yUp = true;
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none z-40 fixed w-full h-full inset-0 overflow-hidden">
      <div
        ref={grainRef}
        className="absolute inset-[-200%] w-[400%] h-[400%] bg-[url('/images/framernoise.png')] bg-left-top bg-[length:256px] opacity-[3%]"
      />
    </div>
  );
};

export default MyApp;
