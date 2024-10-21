import axios from "axios";
import { getCookie } from 'cookies-next';
import { BaseUri } from "./serverConfig";
const baseUri = BaseUri();

var FormData = require('form-data');
const CurrentToken = getCookie('token');


export async function getMasterData(id: any, year: any, month: any) {
    try {
        const res = await axios.get(baseUri + '/caram/target-kinerja/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                year: year,
                month: month
            }
        });
        // console.log(res);
        const data = await res.data;
        return data;
    } catch (error) {
        return {
            status: 'no instance'
        }
    }
}

export async function Save(id: any, datas: any, periode: any, year: any, month: any) {
    try {
        const res = await axios.post(baseUri + '/caram/target-kinerja/' + id, {
            data: datas,
            periode: periode,
            year: year,
            month: month
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        });
        // console.log(res);
        const data = await res.data;
        return data;
    } catch (error) {
        return {
            status: 'no instance'
        }
    }
}

export async function fetchLogs(id: any, year: any, month: any) {
    try {
        const res = await axios.get(baseUri + '/caram/target-kinerja/' + id + '/logs', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                year: year,
                month: month
            }
        });
        const data = await res.data;
        return data;
    } catch (error) {
        return {
            status: 'no instance'
        }
    }
}

export async function sendRequestVerification(id: any, data: any, year: any, month: any) {
    try {
        const res = await axios.post(baseUri + '/caram/target-kinerja/' + id + '/logs', {
            message: data?.message,
            status: 'sent',
            year: year,
            month: month
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        });
        const returns = await res.data;
        return returns;
    } catch (error) {
        return {
            status: 'no instance'
        }
    }
}

export async function sendReplyVerification(id: any, data: any, year: any, month: any) {
    try {
        const res = await axios.post(baseUri + '/caram/target-kinerja/' + id + '/logs', {
            message: data?.message,
            status: data?.status,
            year: year,
            month: month
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
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

export async function DeleteRincianBelanja(id: any, periode: any, year: any, month: any) {
    try {
        const res = await axios.delete(baseUri + '/caram/target-kinerja-delete-rincian/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                periode: periode,
                year: year,
                month: month
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

export async function DeleteTargetKinerja(id: any) {
    try {
        const res = await axios.delete(baseUri + '/caram/target-kinerja-delete/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
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
