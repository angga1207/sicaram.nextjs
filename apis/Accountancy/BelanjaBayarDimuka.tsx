import { getCookie } from 'cookies-next';
import axios from "axios";
import { BaseUri } from "../serverConfig";
import { getSession } from 'next-auth/react';

// const BaseUri = 'https://simoedanep.in/api';
// const BaseUri = 'https://sicaram.oganilirkab.go.id/api';
const baseUri = BaseUri();

export async function getData(instance: any = null, periode: any, year: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/accountancy/bbdm', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                instance: instance,
                periode: periode,
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

export async function storeData(dataInput: any, periode: any, year: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.post(baseUri + '/accountancy/bbdm', {
            periode: periode,
            year: year,
            data: dataInput,
        }, {
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

export async function deleteData(id: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.delete(baseUri + '/accountancy/bbdm', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            data: {
                id: id
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
