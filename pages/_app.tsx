import "../styles/index.css";
import type { AppProps } from "next/app";
import { HistoryProvider } from "../contexts/History";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <HistoryProvider>
      <Component {...pageProps} />
    </HistoryProvider>
  );
}

export default MyApp;
