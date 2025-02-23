import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const Index = () => {

    const router = useRouter();

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [CurrentUser, setCurrentUser] = useState<any>([]);
    useEffect(() => {
        if (document.cookie) {
            let user = document.cookie.split(';').find((row) => row.trim().startsWith('user='))?.split('=')[1];
            user = user ? JSON.parse(user) : null;
            setCurrentUser(user);
        }
    }, [isMounted]);

    useEffect(() => {
        if (CurrentUser?.role_id === 9) {
            router.push('/dashboard/pd');
        } else {
            router.push('/dashboard');
        }
    }, []);

    return (
        <>
            {/* SICARAM OGAN ILIR */}
        </>
    );
}
export default Index;
