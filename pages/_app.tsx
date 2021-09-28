function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-sand-sand1">
      <HistoryProvider>
        <div className="fadeIn">
          <Component {...pageProps} />
        </div>
      </HistoryProvider>
    </div>
  );
}

export default MyApp;

import "../styles/index.css";
import type { AppProps } from "next/app";
import { HistoryProvider } from "@/contexts/History";
