import { useRouter } from 'next/router';

const useBasePath = () => {
    const router = useRouter();
    const basePath = router.asPath.split('/').slice(1, 2)[0];
    return basePath;
}

export default useBasePath;