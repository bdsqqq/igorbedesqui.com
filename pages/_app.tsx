import "../styles/globals.css";
import type { AppProps } from "next/app";
import { HistoryProvider } from "@/contexts/History";
import { styled } from "stitches.config";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <HistoryProvider>
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 z-50 w-full h-full bg-[url('/images/grain.png')] bg-left-top bg-[length:250px] opacity-30" />
        <Component {...pageProps} />
      </div>
    </HistoryProvider>
  );
}

export default MyApp;
