import axios from "axios";
import { BaseUri } from "./serverConfig";
import { getCookie } from 'cookies-next';
const baseUri = BaseUri();
const CurrentToken = getCookie('token');

export async function getMasterTujuan(search: string, instance: any) {
    // /master-tujuan
    try {
        let uri = '';
        if (search) {
            uri = baseUri + '/master-tujuan?search=' + search + '&instance=' + instance;
        } else {
            uri = baseUri + '/master-tujuan?instance=' + instance;
        }
        const res = await axios.get(uri, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
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
};

export async function getDetailMasterTujuan(id: number) {
    try {
        const res = await axios.get(baseUri + '/master-tujuan/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
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

export async function saveMasterTujuan(data: any) {
    try {
        const res = await axios.post(baseUri + '/master-tujuan', data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            }
        });

        const returns = await res.data;
        return returns;

    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function deleteMasterTujuan(id: any) {
    try {
        const res = await axios.delete(baseUri + '/master-tujuan/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            }
        });

        const returns = await res.data;
        return returns;

    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function getDetailMasterSasaran(id: number) {
    try {
        const res = await axios.get(baseUri + '/master-sasaran/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
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

export async function saveMasterSasaran(data: any) {
    try {
        const res = await axios.post(baseUri + '/master-sasaran', data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            }
        });

        const returns = await res.data;
        return returns;

    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function deleteMasterSasaran(id: any) {
    try {
        const res = await axios.delete(baseUri + '/master-sasaran/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            }
        });

        const returns = await res.data;
        return returns;

    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}
