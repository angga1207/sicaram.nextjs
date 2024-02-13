import { useEffect } from 'react';
import { useRouter } from 'next/router';


const Index = () => {

    const Router = useRouter();
    // redirect to /dashboard
    useEffect(() => {
        Router.push('/dashboard');
    }, []);

    return (
        <>
            <div>
                <h1>starter page</h1>
            </div>
        </>
    );
};

export default Index;
