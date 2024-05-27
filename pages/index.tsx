import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const Index = () => {

    const router = useRouter();
    const [CurrentUser, setCurrentUser] = useState<any>([]);
    useEffect(() => {
        if (window) {
            if (localStorage.getItem('user')) {
                setCurrentUser(JSON.parse(localStorage.getItem('user') ?? '{[]}') ?? []);
            }
        }
    }, []);
    useEffect(() => {
        if (CurrentUser?.role_id === 9) {
            router.push('/dashboard/pd');
        } else {
            router.push('/dashboard');
        }
    }, []);

    return (
        <>
            SICARAM OGAN ILIR
        </>
    );
}
export default Index;
