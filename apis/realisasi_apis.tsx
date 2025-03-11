import { getCookie } from 'cookies-next';
import axios from "axios";
import { BaseUri } from "./serverConfig";
import { getSession } from 'next-auth/react';

const baseUri = BaseUri();

var FormData = require('form-data');

export async function getMasterData(id: any, year: any, month: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/caram/realisasi/' + id, {
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
            status: 'error',
            message: error
        }
    }
}

export async function getKeteranganSubKegiatan(idRealisasiSubKegiatan: any, year: any, month: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/caram/realisasi-keterangan/' + idRealisasiSubKegiatan + '/get', {
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
            status: 'error',
            message: error
        }
    }
}

export async function SaveRealisasi(id: any, datas: any, periode: any, year: any, month: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.post(baseUri + '/caram/realisasi/' + id, {
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
            status: 'error',
            message: error
        }
    }
}

export async function SaveRincianRealisasi(id: any, datas: any, periode: any, year: any, month: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.post(baseUri + '/caram/realisasi/' + id + '/detail', {
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
            status: 'error',
            message: error
        }
    }
}

export async function SyncRealisasi(id: any, datas: any, periode: any, year: any, month: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.post(baseUri + '/caram/realisasi/' + id + '/sync', {
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
            status: 'error',
            message: error
        }
    }
}

export async function SyncRincianRealisasi(id: any, datas: any, periode: any, year: any, month: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.post(baseUri + '/caram/realisasi/' + id + '/detail/sync', {
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
            status: 'error',
            message: error
        }
    }
}

export async function SaveKeterangan(idRealisasiSubKegiatan: any, datas: any, year: any, month: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.post(baseUri + '/caram/realisasi-keterangan/' + idRealisasiSubKegiatan + '/save', {
            'id': datas.id,
            'notes': datas.notes,
            'link_map': datas.link_map,
            'faktor_penghambat': datas.faktor_penghambat,
            'longitude': datas.longitude,
            'latitude': datas.latitude,
            'newFiles': datas.newFiles
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${CurrentToken}`,
            },
        })
        // console.log(res);
        const data = await res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function DeleteKeteranganImage(id: any) {
    // /caram/realisasi-keterangan-delete-file/{id)
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.delete(baseUri + '/caram/realisasi-keterangan-delete-file/' + id, {
            headers: {
                'Content-Type': 'application/json',
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

export async function fetchLogs(id: any, year: any, month: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/caram/realisasi/' + id + '/logs', {
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
            status: 'error',
            message: error
        }
    }
}

export async function sendRequestVerification(id: any, data: any, year: any, month: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.post(baseUri + '/caram/realisasi/' + id + '/logs', {
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
            status: 'error',
            message: error
        }
    }
}

export async function sendReplyVerification(id: any, data: any, year: any, month: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.post(baseUri + '/caram/realisasi/' + id + '/logs', {
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

export async function getKontrakSPSE(search: any, year: any, kodeSatker: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        // /caram/realisasi-keterangan-fetch-spse-kontrak
        const res = await axios.get(baseUri + '/caram/realisasi-keterangan-fetch-spse-kontrak', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                kode_satker: kodeSatker,
                search: search,
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


export async function getContract(subKegiatanId: any, year: any, month: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/caram/realisasi-keterangan-get-kontrak', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                subKegiatanId: subKegiatanId,
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


export async function addContract(id: any, data: any, year: any, month: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.post(baseUri + '/caram/realisasi-keterangan-add-kontrak', {
            id: id,
            data: data,
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

export async function deleteContract(id: any, no_kontrak: any, year: any, month: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.delete(baseUri + '/caram/realisasi-keterangan-delete-kontrak/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                id: id,
                no_kontrak: no_kontrak,
                year: year,
                month: month
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


export async function uploadRealisasiExcel(subKegiatanId: any, instance: any, periode: any, year: any, month: any, file: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('periode', periode);
        formData.append('year', year);
        formData.append('month', month);
        formData.append('id', subKegiatanId);
        formData.append('instance', instance);
        const res = await axios.post(baseUri + '/caram/realisasi/' + subKegiatanId + '/upload/excel', formData, {
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
