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

export async function saveSingleNeraca(data: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/report/neraca/' + data.id, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
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

export async function downloadReportNeraca(data: any, instance: any, periode: any, year: any, level: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/report/neraca', { data: data }, {
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
        const response = await res.data;
        return response;
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

export async function saveSingleLaporanOperasional(data: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/report/lo/' + data.id, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
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

export async function downloadReportLaporanOperasional(data: any, instance: any, periode: any, year: any, level: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/report/lo', { data: data }, {
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
        const response = await res.data;
        return response;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function getReportLPE(instance: any = null, periode: any, year: any, level: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/report/lpe', {
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

export async function downloadReportLaporanLPE(data: any, instance: any, periode: any, year: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/report/lpe', { data: data }, {
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
        const response = await res.data;
        return response;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}
