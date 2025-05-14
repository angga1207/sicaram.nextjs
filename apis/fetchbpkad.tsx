import { getCookie } from 'cookies-next';
import axios from "axios";
import { BaseUri } from "./serverConfig";
import { getSession } from 'next-auth/react';
const baseUri = BaseUri();

export async function fetchMonitorPagu(periode: any, instance: any, year: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/sipd/getMonitorPagu', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                periode: periode,
                instance: instance,
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
