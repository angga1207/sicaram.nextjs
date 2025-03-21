import axios from "axios";
import { BaseUri } from "./serverConfig";
import { getCookie } from 'cookies-next';
import { getSession } from "next-auth/react";

const baseUri = BaseUri();
// const CurrentToken = getCookie('token');

// const session = useSession();
// const CurrentToken = session.data?.name;


export async function fetchUserMe() {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/users-me', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = await res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function fetchLogs(page: number = 1) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/users-me/logs?page=' + page, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = await res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function fetchNotifLess() {
    const session = await getSession();
    const CurrentToken = session?.user?.name;
    try {
        const res = await axios.get(baseUri + '/users-me/notifications-less', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function fetchNotif(page: number = 1) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/users-me/notifications', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                page: page
            }
        });
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function markNotifAsRead(id: string) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/users-me/mark-notif-as-read/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        return res;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function postSavePassword(data: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const response = await axios.post(`${baseUri}/users-me/save-password`, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        return response.data;

    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}
