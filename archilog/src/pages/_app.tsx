// import { AppProps } from "next/app";
// import "./globals.css";
// import MainLayout from "@/components/Layout/MainLayout";

// function MyApp({ Component, pageProps }: AppProps) {
//   return (
//     <MainLayout>
//       <Component {...pageProps} />
//     </MainLayout>
//   );
// }

// export default MyApp;

// 다크모드 수정
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
