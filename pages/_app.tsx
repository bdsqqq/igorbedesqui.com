import "../styles/globals.css";
import type { AppProps } from "next/app";
import { HistoryProvider } from "@/contexts/History";
import { MDXProvider } from "@mdx-js/react";

import StyledLinkWithIcon from "@/components/ui/StyledLink";

import { Lora } from "@next/font/google";

const customFont = Lora({ display: "swap" });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <HistoryProvider>
      <MDXProvider
        components={{
          // @ts-ignore
          a: StyledLinkWithIcon,
        }}
      >
        <div className={`${customFont.className} relative`}>
          <div className="z-40 pointer-events-none absolute inset-0 w-full h-full bg-[url('/images/grain.png')] bg-left-top bg-[length:250px] opacity-25" />
          <div className="max-w-7xl mx-auto relative">
            <Component {...pageProps} />
          </div>
          <div
            className="pointer-events-none w-full h-full top-0 absolute opacity-[5%] filter blur-[100px] saturate-150"
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

export default MyApp;
