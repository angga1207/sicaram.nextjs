import axios from "axios";
import { BaseUri } from "./serverConfig";
import { getCookie } from 'cookies-next';
const baseUri = BaseUri();
const CurrentToken = getCookie('token');

export async function getIndex(periode: number, instance: any = null) {
    try {
        let uri = '';
        uri = baseUri + '/target-tujuan-sasaran-list';
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

export async function getDetail(type: string, data_id: any, periode: any, instance: any = null) {
    try {
        let uri = '';
        uri = baseUri + '/target-tujuan-sasaran/' + data_id;
        const res = await axios.get(uri, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            },
            params: {
                type: type,
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
        let uri = '';
        uri = baseUri + '/target-tujuan-sasaran/' + dataInput.id;
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

// Perubahan
export async function getIndexPerubahan(periode: number, year: number, instance: any = null) {
    try {
        let uri = '';
        uri = baseUri + '/target-perubahan-tujuan-sasaran-list';
        const res = await axios.get(uri, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            },
            params: {
                periode_id: periode,
                year: year,
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

export async function getDetailPerubahan(type: string, data_id: any, year: any, periode: any, instance: any = null) {
    try {
        let uri = '';
        uri = baseUri + '/target-perubahan-tujuan-sasaran/' + data_id;
        const res = await axios.get(uri, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            },
            params: {
                type: type,
                year: year,
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

export async function updatePerubahan(dataInput: any) {
    try {
        let uri = '';
        uri = baseUri + '/target-perubahan-tujuan-sasaran/' + dataInput.id;
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
