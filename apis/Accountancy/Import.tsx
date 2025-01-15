import axios from "axios";
import { getCookie } from 'cookies-next';
import { BaseUri } from "../serverConfig";


const CurrentToken = getCookie('token');
const baseUri = BaseUri();

export async function storeKodeRekening(periode: any, year: any, file: any) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('periode', periode);
        formData.append('year', year);
        const res = await axios.post(baseUri + '/accountancy/import/kode_rekening', formData, {
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

export async function storeSaldoAwalNeraca(instance: any, periode: any, year: any, file: any) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('instance', instance ?? '');
        formData.append('periode', periode);
        formData.append('year', year);
        const res = await axios.post(baseUri + '/accountancy/saldo-awal-neraca', formData, {
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

export async function storeSaldoAwalLO(instance: any, periode: any, year: any, file: any) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('instance', instance ?? '');
        formData.append('periode', periode);
        formData.append('year', year);
        const res = await axios.post(baseUri + '/accountancy/saldo-awal-lo', formData, {
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
