import axios from "axios";
import { BaseUri } from "./serverConfig";
import { getCookie } from 'cookies-next';
import { getSession } from "next-auth/react";

const baseUri = BaseUri();


export async function IndexTaggingSumberDana(instance: number, periode: number) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(`${baseUri}/caram/tagging-sumber-dana`, {
            headers: { 'Authorization': `Bearer ${CurrentToken}` },
            params: {
                instance: instance,
                periode: periode,
            }
        });
        return await res.data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function DetailTaggingSumberDana(id: number, instance: number, year: number) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(`${baseUri}/caram/tagging-sumber-dana/${id}`, {
            headers: { 'Authorization': `Bearer ${CurrentToken}` },
            params: {
                instance: instance,
                year: year
            }
        });
        return await res.data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function SaveTaggingSumberDana(id: number, data: any, instance: number) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.post(`${baseUri}/caram/tagging-sumber-dana/${id}`, data, {
            headers: { 'Authorization': `Bearer ${CurrentToken}` },
            params: {
                instance: instance,
                year: data.year
            }
        });
        return await res.data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}
