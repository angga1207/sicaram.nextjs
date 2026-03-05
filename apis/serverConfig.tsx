import axios from "axios";
import { getSession, signOut } from "next-auth/react";

export function BaseUri() {
    // const uri = 'https://sicaram.oganilirkab.go.id/api';

    // const uri = 'http://103.162.35.44/api';
    const uri = 'http://127.0.0.1:8000/api';
    // const uri = 'https://sicaramapis.oganilirkab.go.id/api';
    return uri;
}

export async function serverCheck() {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        if (CurrentToken === undefined) {
            const res = await axios.post(BaseUri() + '/bdsm', {}, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const data = await res.data;
            if (data.status == 'success') {
                if (data.data.user === null) {
                    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    // await signOut();
                }
                document.cookie = `user=${JSON.stringify(data?.data?.user)}; path=/`;
            }
            return data;
        } else {
            const res = await axios.post(BaseUri() + '/bdsm', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${CurrentToken}`,
                }
            })
            const data = await res.data;
            if (data.status == 'success') {
                if (data.data.user === null) {
                    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    // await signOut();
                }
                document.cookie = `user=${JSON.stringify(data?.data?.user)}; path=/`;
            }
            return data;
        }

    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function GlobalEndPoint(_get: any, q: any = null) {
    try {
        // aioe
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.post(BaseUri() + '/aioe', {
            '_get': _get,
            'q': q,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },

        })
        const data = await res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error,
        }
    }
}

