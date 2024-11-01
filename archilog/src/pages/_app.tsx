import React from "react";
import { AppProps } from "next/app";
import MainLayout from "@/components/Layout/MainLayout";
import { DarkModeProvider } from "@/contexts/DarkModeContext";
import "./globals.css";
import { AuthProvider } from "@/components/contexts/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <DarkModeProvider>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </DarkModeProvider>
    </AuthProvider>
  );
}

export default MyApp;
