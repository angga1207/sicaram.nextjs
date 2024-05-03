import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const Index = () => {

    const router = useRouter();
    useEffect(() => {
        router.push('/dashboard');
    }, []);

    return (
        <>
            SICARAM OGAN ILIR
        </>
    );
}
export default Index;
