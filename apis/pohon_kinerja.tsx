import axios from "axios";
import { BaseUri } from "./serverConfig";
import { getCookie } from 'cookies-next';
import { getSession } from "next-auth/react";
const baseUri = BaseUri();

export async function getIndex(periode: number, instance: any = null) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        let uri = '';
        uri = baseUri + '/pohon-kinerja-list';
        const res = await axios.get(uri, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            },
            params: {
                periode_id: periode,
                instance_id: instance,
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

export async function postSave(dataInput: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        let uri = '';
        uri = baseUri + '/pohon-kinerja-list/' + dataInput.id;
        const res = await axios.post(uri, dataInput, {
            headers: {
                // 'Content-Type': 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${CurrentToken}`
            },
        })
        const respon = await res.data;
        return respon;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function postDelete(id: number, periode: any, instance: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        let uri = '';
        uri = baseUri + '/pohon-kinerja-list/' + id + '/delete';
        const res = await axios.post(uri, {
            id: id,
            periode_id: periode,
            instance_id: instance,
        }, {
            headers: {
                // 'Content-Type': 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${CurrentToken}`
            },
        })
        const respon = await res.data;
        return respon;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}
