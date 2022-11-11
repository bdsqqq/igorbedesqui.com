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
          <div className="pointer-events-none absolute inset-0 z-50 w-full h-full bg-[url('/images/grain.png')] bg-left-top bg-[length:250px] opacity-30" />
          <Component {...pageProps} />
        </div>
      </MDXProvider>
    </HistoryProvider>
  );
}

export default MyApp;
