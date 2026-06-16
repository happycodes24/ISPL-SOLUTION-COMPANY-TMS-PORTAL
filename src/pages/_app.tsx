import type { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AnimatePresence mode="wait">
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </AuthProvider>
    </ThemeProvider>
  );
}
