import { AppProps } from "next/app";
import MainLayout from "@/components/Layout/MainLayout";
import { DarkModeProvider } from "@/contexts/DarkModeContext";
import "./globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DarkModeProvider>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </DarkModeProvider>
  );
}

export default MyApp;
