import { AppProps } from 'next/app';
import './globals.css';
import MainLayout from '@/components/Layout/MainLayout';
import { AuthProvider } from '../components/contexts/AuthContext';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
        <MainLayout>
            <Component {...pageProps} />
        </MainLayout>
        </AuthProvider>
    );
}

export default MyApp;
