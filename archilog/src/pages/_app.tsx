import { AppProps } from 'next/app';
import './globals.css';
import MainLayout from '@/components/Layout/MainLayout';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <MainLayout>
            <Component {...pageProps} />
        </MainLayout>
    );
}

export default MyApp;
