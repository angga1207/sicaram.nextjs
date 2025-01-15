import axios from "axios";
import { getCookie } from 'cookies-next';
import { BaseUri } from "../serverConfig";

const CurrentToken = getCookie('token');
const baseUri = BaseUri();

export async function getReportNeraca(instance: any = null, periode: any, year: any, level: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/report/neraca', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                instance: instance,
                periode: periode,
                year: year,
                level: level,
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

export async function getReportLaporanOperasional(instance: any = null, periode: any, year: any, level: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/report/lo', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                instance: instance,
                periode: periode,
                year: year,
                // level: level,
                level: 6,
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
