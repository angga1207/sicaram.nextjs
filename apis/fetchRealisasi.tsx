import { useRouter } from "next/router";
import { useState, useEffect, use } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { BaseUri } from "./serverConfig";
import { setCookie, getCookie, hasCookie, deleteCookie } from 'cookies-next';

// const BaseUri = 'https://simoedanep.in/api';
// const BaseUri = 'https://sicaram.oganilirkab.go.id/api';
// const BaseUri = 'http://127.0.0.1:8000/api';
// const BaseUri = process.env.BASE_SERVER_URI;
const baseUri = BaseUri();
const CurrentToken = getCookie('token');

// Instances Start
export async function fetchInstances(search: any = '') {
    const res = await axios.get(baseUri + '/caram/realisasi/listInstance?search=' + search, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = await res.data;
    return data;
}

export async function fetchInstance(id: string = '') {
    const res = await axios.get(baseUri + '/caram/realisasi/listInstance/' + id, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = await res.data;
    return data;
}

// Kode Rekening Start
export async function fetchKodeRekening(level: any = 1, parent_id: any = null) {
    // caram/getKodeRekening
    const res = await axios.get(baseUri + '/caram/getKodeRekening?level=' + level + '&parent_id=' + parent_id, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = await res.data;
    return data;
}

export async function fetchProgramsSubKegiatan(instance: string = '') {
    // caram/realisasi/listProgramsSubKegiatan
    const res = await axios.get(baseUri + '/caram/realisasi/listProgramsSubKegiatan?instance_id=' + instance, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = await res.data;
    return data;
}


export async function fetchDataInformasiSubKegiatan(id: string, periode: any, year: number, month: number) {
    const res = await axios.get(baseUri + '/caram/realisasi/getDataSubKegiatan/' + id + '?periode=' + periode + '&year=' + year + '&month=' + month, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = await res.data;
    return data;
}

export async function fetchDataRealisasi(id: string, periode: any, year: number, month: number) {
    const res = await axios.get(baseUri + '/caram/realisasi/getDataRealisasi/' + id + '?periode=' + periode + '&year=' + year + '&month=' + month, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = await res.data;
    return data;
}


// saveDataSubKegiatan
export async function saveDataSubKegiatan(data: any) {
    const res = await axios.post(baseUri + '/caram/realisasi/saveDataSubKegiatan', data, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const datas = await res.data;
    return datas;
}

// getDetailDataSubKegiatan
export async function detailDataSubKegiatan(id: string, periode: any, year: number, month: number) {
    const res = await axios.get(baseUri + '/caram/realisasi/detailDataSubKegiatan/' + id + '?periode=' + periode + '&year=' + year + '&month=' + month, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const datas = await res.data;
    return datas;
}

// updateDataSubKegiatan
export async function updateDataSubKegiatan(id : any, data: any) {
    const res = await axios.post(baseUri + '/caram/realisasi/updateDataSubKegiatan/' + id, data, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const datas = await res.data;
    return datas;
}

// Delete Data Sub Kegiatan
export async function deleteDataRealisasiRincian(id: string, periode: any, year: number, month: number) {
    // caram/realisasi/deleteDataSubKegiatan/
    const res = await axios.delete(baseUri + '/caram/realisasi/deleteDataSubKegiatan/' + id + '?periode=' + periode + '&year=' + year + '&month=' + month, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const datas = await res.data;
    return datas;
}

