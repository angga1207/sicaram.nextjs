import { getCookie } from 'cookies-next';
import axios from "axios";
import { BaseUri } from "../serverConfig";


const CurrentToken = getCookie('token');
// const BaseUri = 'https://simoedanep.in/api';
// const BaseUri = 'https://sicaram.oganilirkab.go.id/api';
const baseUri = BaseUri();

export async function getData(instance: any = null, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/lra', {
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

export async function storeData(instance: any, periode: any, year: any, file: any) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('instance', instance ?? 0);
        formData.append('periode', periode);
        formData.append('year', year);
        const res = await axios.post(baseUri + '/accountancy/lra', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${CurrentToken}`,
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

export async function resetData(instance: any, periode: any, year: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/lra/reset', {
            instance: instance,
            periode: periode,
            year: year,
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
