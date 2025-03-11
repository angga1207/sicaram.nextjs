import axios from "axios";
import { BaseUri } from "./serverConfig";
import { getCookie } from 'cookies-next';
import { getSession } from "next-auth/react";
const baseUri = BaseUri();

export async function getIndex(periode: number, year: number, instance: any = null) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        let uri = '';
        uri = baseUri + '/realisasi/tujuan-sasaran-list';
        const res = await axios.get(uri, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            },
            params: {
                periode_id: periode,
                instance_id: instance,
                year: year,
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

export async function getDetail(type: string, data_id: any, ref_id: any, year: number, month: number, periode: any, instance: any = null) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        let uri = '';
        uri = baseUri + '/realisasi/tujuan-sasaran/' + data_id;
        const res = await axios.get(uri, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            },
            params: {
                type: type,
                ref_id: ref_id,
                year: year,
                month: month,
                periode_id: periode,
                instance_id: instance ?? null,
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

export async function update(dataInput: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        let uri = '';
        uri = baseUri + '/realisasi/tujuan-sasaran/' + dataInput.id;
        const res = await axios.post(uri, dataInput, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            },
        });

        const response = await res.data;
        return response;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}
