import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MDXProvider } from "@mdx-js/react";

import StyledLinkWithIcon from "@/components/ui/StyledLink";

import { IBM_Plex_Serif } from "next/font/google";
import { useEffect, useRef } from "react";

const customFont = IBM_Plex_Serif({
  display: "swap",
  subsets: ["latin"],
  weight: ["200", "400", "700"],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MDXProvider
      components={{
        // @ts-ignore
        a: (props) => <StyledLinkWithIcon {...props} />,
        h1: (props) => <h1 className="mb-8 text-2xl text-gray-11" {...props} />,
        h2: (props) => <h1 className="my-2 text-lg font-bold" {...props} />,
        strong: (props) => (
          <strong className="font-bold text-gray-12" {...props} />
        ),
        pre: (props) => (
          <pre
            className="my-2 overflow-x-auto rounded bg-gray-2 p-4 text-sm"
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
        <div className="relative mx-auto max-w-4xl">
          <Component {...pageProps} />
        </div>
        <div
          className="pointer-events-none absolute top-0 h-full w-full opacity-[3%] blur-[100px] saturate-150 filter"
          style={{
            backgroundImage:
              "radial-gradient(at 27% 37%,#3a8bfd 0,transparent 0),radial-gradient(at 97% 21%,#72fe7d 0,transparent 50%),radial-gradient(at 52% 99%,#fd3a4e 0,transparent 50%),radial-gradient(at 10% 29%,#855afc 0,transparent 50%),radial-gradient(at 97% 96%,#e4c795 0,transparent 50%),radial-gradient(at 33% 50%,#8ca8e8 0,transparent 50%),radial-gradient(at 79% 53%,#eea5ba 0,transparent 50%)",
          }}
        />
      </div>
    </MDXProvider>
  );
}

const Grain = () => {
  const grainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grain = grainRef.current;
    if (!grain) return;

    const keyframesX = [
      "0%",
      "-5%",
      "-15%",
      "7%",
      "-5%",
      "-15%",
      "15%",
      "0%",
      "3%",
      "-10%",
    ];
    const keyframesY = [
      "0%",
      "-10%",
      "5%",
      "-25%",
      "25%",
      "10%",
      "0%",
      "15%",
      "35%",
      "10%",
    ];
    let i = 0;

    const interval = setInterval(() => {
      grain.style.transform = `translateX(${
        keyframesX[i % keyframesX.length]
      }) translateY(${keyframesY[i % keyframesY.length]})`;

      i++;
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-40 h-full w-full overflow-hidden">
      <div
        ref={grainRef}
        className="absolute inset-[-200%] h-[400%] w-[400%] bg-[url('/images/framernoise.png')] bg-[length:256px] bg-left-top opacity-[3%]"
      />
    </div>
  );
};

export default MyApp;
