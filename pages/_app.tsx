function MyApp({ Component, pageProps }: AppProps) {
  return (
    <HistoryProvider>
      <div className="relative">
        <motion.div
          className="fixed z-50 h-screen w-full bg-igor-700"
          animate={{ x: "100vw" }}
          transition={{ delay: 0.4, duration: 0.2 }}
        />
        <motion.div
          className="fixed z-40 h-screen w-full bg-igor-500"
          animate={{ x: "100vw" }}
          transition={{ delay: 0.6, duration: 0.2 }}
        />
        <motion.div
          className="fixed z-30 h-screen w-full bg-igor-700"
          animate={{ x: "100vw" }}
          transition={{ delay: 0.8, duration: 0.1 }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-igor-light"
        >
          <AnimatePresence exitBeforeEnter>
            <Component {...pageProps} />
          </AnimatePresence>
        </motion.div>
      </div>
    </HistoryProvider>
  );
}

export default MyApp;

import "../styles/index.css";
import type { AppProps } from "next/app";
import { HistoryProvider } from "../contexts/History";
import { motion, AnimatePresence } from "framer-motion";
