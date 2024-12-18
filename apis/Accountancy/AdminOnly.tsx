import { getCookie } from 'cookies-next';
import axios from "axios";
import { BaseUri } from "../serverConfig";


const CurrentToken = getCookie('token');
// const BaseUri = 'https://simoedanep.in/api';
// const BaseUri = 'https://sicaram.oganilirkab.go.id/api';
const baseUri = BaseUri();

export async function storeSaldoAwal(instance: any, periode: any, year: any, file: any) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('instance', instance ?? 0);
        formData.append('periode', periode);
        formData.append('year', year);
        const res = await axios.post(baseUri + '/accountancy/saldo-awal', formData, {
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
