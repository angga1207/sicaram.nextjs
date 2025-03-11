import axios from "axios";
import { BaseUri } from "./serverConfig";
import { getCookie } from 'cookies-next';
import { getSession } from "next-auth/react";
const baseUri = BaseUri();

export async function getMasterTujuan(search: string, instance: any, periode: any) {
    // /master-tujuan
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const uri = baseUri + '/master-tujuan'
        const res = await axios.get(uri, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            },
            params: {
                search: search,
                instance: instance,
                periode: periode,
            }
        });

        const data = await res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
};

export async function getDetailMasterTujuan(id: number) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/master-tujuan/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            }
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

export async function saveMasterTujuan(data: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.post(baseUri + '/master-tujuan', data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            }
        });

        const returns = await res.data;
        return returns;

    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function deleteMasterTujuan(id: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.delete(baseUri + '/master-tujuan/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            }
        });

        const returns = await res.data;
        return returns;

    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function getDetailMasterSasaran(id: number) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/master-sasaran/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            }
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

export async function saveMasterSasaran(data: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.post(baseUri + '/master-sasaran', data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            }
        });

        const returns = await res.data;
        return returns;

    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function deleteMasterSasaran(id: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.delete(baseUri + '/master-sasaran/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            }
        });

        const returns = await res.data;
        return returns;

    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}
