import { useRouter } from "next/router";

import { setCookie, getCookie, hasCookie, deleteCookie } from 'cookies-next';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { BaseUri } from "./serverConfig";


const CurrentToken = getCookie('token');
// const BaseUri = 'https://simoedanep.in/api';
// const BaseUri = 'https://sicaram.oganilirkab.go.id/api';
const baseUri = BaseUri();


export async function fetchDashboardOPD(code: string, year: number, month: number) {
    const res = await axios.get(baseUri + '/public/rka-pd/' + code + '?year=' + year + '&month=' + month, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = await res.data;
    return data;
}

export async function chartRealisasi(periode: any, year: any, view: any) {
    const res = await axios.get(baseUri + '/dashboard/chart-realisasi?periode=' + periode + '&year=' + year + '&view=' + view, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = await res.data;
    return data;
}

export async function summaryRealisasi(periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/dashboard/summary-realisasi?periode=' + periode + '&year=' + year, {
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

export async function getRankInstance(periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/dashboard/rank-instance?periode=' + periode + '&year=' + year, {
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

export async function chartKinerja(periode: any, year: number, view: any) {
    try {
        const res = await axios.get(baseUri + '/dashboard/chart-kinerja?periode=' + periode + '&year=' + year + '&view=' + view, {
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

export async function summaryKinerja(periode: any, year: any, view: any) {
    try {
        const res = await axios.get(baseUri + '/dashboard/summary-kinerja?periode=' + periode + '&year=' + year + '&view=' + view, {
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

export async function getDetailInstance(slug: any, periode: any, year: any, view: any) {
    try {
        const res = await axios.get(baseUri + '/dashboard/instance/' + slug + '?periode=' + periode + '&year=' + year, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                view: view
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
