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
    try {
        const res = await axios.get(baseUri + '/caram/realisasi/listInstance?search=' + search, {
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

export async function fetchInstance(id: string = '') {
    try {
        const res = await axios.get(baseUri + '/caram/realisasi/listInstance/' + id, {
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

// Kode Rekening Start
export async function fetchKodeRekening(level: any = 1, parent_id: any = null) {
    // caram/getKodeRekening
    try {
        const res = await axios.get(baseUri + '/caram/getKodeRekening?level=' + level + '&parent_id=' + parent_id, {
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

export async function fetchProgramsSubKegiatan(instance: string = '', year: number = 0) {
    // caram/realisasi/listProgramsSubKegiatan
    try {
        const res = await axios.get(baseUri + '/caram/realisasi/listProgramsSubKegiatan', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                instance_id: instance,
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


export async function fetchDataInformasiSubKegiatan(id: string, periode: any, year: number, month: number) {
    try {
        const res = await axios.get(baseUri + '/caram/realisasi/getDataSubKegiatan/' + id + '?periode=' + periode + '&year=' + year + '&month=' + month, {
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

export async function fetchDataRealisasi(id: string, periode: any, year: number, month: number) {
    try {
        const res = await axios.get(baseUri + '/caram/realisasi/getDataRealisasi/' + id + '?periode=' + periode + '&year=' + year + '&month=' + month, {
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


// saveDataSubKegiatan
export async function saveDataSubKegiatan(data: any) {
    try {
        const res = await axios.post(baseUri + '/caram/realisasi/saveDataSubKegiatan', data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const datas = await res.data;
        return datas;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

// getDetailDataSubKegiatan
export async function detailDataSubKegiatan(id: string, periode: any, year: number, month: number) {
    try {
        const res = await axios.get(baseUri + '/caram/realisasi/detailDataSubKegiatan/' + id + '?periode=' + periode + '&year=' + year + '&month=' + month, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const datas = await res.data;
        return datas;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

// updateDataSubKegiatan
export async function updateDataSubKegiatan(id: any, data: any) {
    try {
        const res = await axios.post(baseUri + '/caram/realisasi/updateDataSubKegiatan/' + id, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const datas = await res.data;
        return datas;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

// Delete Data Sub Kegiatan
export async function deleteDataRealisasiRincian(id: string, periode: any, year: number, month: number) {
    try {
        // caram/realisasi/deleteDataSubKegiatan/
        const res = await axios.delete(baseUri + '/caram/realisasi/deleteDataSubKegiatan/' + id + '?periode=' + periode + '&year=' + year + '&month=' + month, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const datas = await res.data;
        return datas;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}


// getDataKontrak
export async function fetchDataKontrak(id: string, periode: any, year: number, month: number) {
    try {
        const res = await axios.get(baseUri + '/caram/kontrak/' + id + '?periode=' + periode + '&year=' + year + '&month=' + month, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const datas = await res.data;
        return datas;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

// saveKontrak
export async function saveKontrak(data: any) {
    try {
        const res = await axios.post(baseUri + '/caram/kontrak', data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const datas = await res.data;
        return datas;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

// detailKontrak
export async function detailKontrak(id: any, periode: any, year: number, month: number) {
    try {
        const res = await axios.get(baseUri + '/caram/kontrak/edit/' + id + '?periode=' + periode + '&year=' + year + '&month=' + month, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const datas = await res.data;
        return datas;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

// updateKontrak
export async function updateKontrak(id: any, data: any, periode: any, year: number, month: number) {
    try {
        const res = await axios.post(baseUri + '/caram/kontrak/edit/' + id + '?periode=' + periode + '&year=' + year + '&month=' + month, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const datas = await res.data;
        return datas;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

// deleteKontrak
export async function deleteKontrak(id: any, periode: any, year: number, month: number) {
    try {
        const res = await axios.delete(baseUri + '/caram/kontrak/delete/' + id + '?periode=' + periode + '&year=' + year + '&month=' + month, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const datas = await res.data;
        return datas;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}
