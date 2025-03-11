import axios from "axios";
import { getCookie } from 'cookies-next';
import { BaseUri } from "../serverConfig";
import { getSession } from "next-auth/react";

const baseUri = BaseUri();

export async function getReportLRA(instance: any = null, periode: any, year: any, level: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/accountancy/report/lra', {
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

export async function getReportNeraca(instance: any = null, periode: any, year: any, level: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
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
        const session = await getSession();
        const CurrentToken = session?.user?.name;
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
        const session = await getSession();
        const CurrentToken = session?.user?.name;
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
        const session = await getSession();
        const CurrentToken = session?.user?.name;
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
        const session = await getSession();
        const CurrentToken = session?.user?.name;
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
        const session = await getSession();
        const CurrentToken = session?.user?.name;
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
        const session = await getSession();
        const CurrentToken = session?.user?.name;
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

export async function saveReportLPE(data: any, instance: any, periode: any, year: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.post(baseUri + '/accountancy/report/lpe', {
            data: data,
            instance: instance,
            periode: periode,
            year: year,
        }, {
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

export async function resetReportLPE(instance: any, periode: any, year: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.post(baseUri + '/accountancy/report/lpe/reset', {
            instance: instance,
            periode: periode,
            year: year,
        }, {
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

export async function downloadReportLaporanLPE(data: any, instance: any, periode: any, year: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.post(baseUri + '/accountancy/report/lpe/download', { data: data }, {
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
