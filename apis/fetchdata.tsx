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

export async function fetchAllDataUsers(role: string, search: string = '') {
    const res = await axios.get(baseUri + '/users?' + '_fRole=' + role + '&search=' + search, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = await res.data;
    return data;
}

// Roles Start
export async function fetchRoles(search: string = '') {
    const res = await axios.get(baseUri + '/roles?search=' + search, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = await res.data;
    return data;
}

export async function fetchRole(id: string = '') {
    const res = await axios.get(baseUri + '/roles/' + id, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = await res.data;
    return data;
}
// Roles End


// Users Start
export async function fetchUsers(role: string, search: string = '') {
    const res = await axios.get(baseUri + '/users?' + '_fRole=' + role + '&search=' + search, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = await res.data;
    return data;
}

export async function fetchUser(id: string = '') {
    const res = await axios.get(baseUri + '/users/' + id, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = await res.data;
    return data;
}
// Users End


// Instances Start
export async function fetchInstances(search: any = '') {
    const res = await axios.get(baseUri + '/instances?search=' + search, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = await res.data;
    return data;
}

export async function fetchInstance(id: string = '') {
    const res = await axios.get(baseUri + '/instances/' + id, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = await res.data;
    return data;
}
// Instances End


// Periode Start
export async function fetchPeriodes(search: any = '') {
    const res = await axios.get(baseUri + '/ref-periode?search=' + search, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = await res.data;
    return data;
}

export async function fetchRangePeriode(id: any) {
    // ref-periode-range
    const res = await axios.get(baseUri + '/ref-periode-range?periode_id=' + id, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = res.data;
    return data;
}

// Satuan Start
export async function fetchSatuans(search: any = '') {
    const res = await axios.get(baseUri + '/ref-satuan?search=' + search, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    // console.log(res);
    const data = await res.data;
    return data;
}
// Satuan End


// Urusan Start
export async function fetchUrusans(periode: any, search: any = '') {
    const res = await axios.get(baseUri + '/ref-urusan?periode=' + periode + '&search=' + search, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = await res.data;
    return data;
}

export async function fetchUrusan(id: string = '') {
    const res = await axios.get(baseUri + '/ref-urusan/' + id, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = res.data;
    return data;
}
// Urusan End

// Bidang Start
export async function fetchBidangs(periode: any, search: any = '') {
    const res = await axios.get(baseUri + '/ref-bidang?periode=' + periode + '&search=' + search, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = await res.data;
    return data;
}

export async function fetchBidang(id: string = '') {
    const res = await axios.get(baseUri + '/ref-bidang/' + id, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = res.data;
    return data;
}
// Bidang End

// Program Start
export async function fetchPrograms(periode: any, instance: any, search: any = '') {
    try {
        const res = await axios.get(baseUri + '/ref-program?periode=' + periode + '&instance=' + instance + '&search=' + search, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = await res.data;
        return data;
    } catch (error) {
        return {
            status: 'no instance'
        }
    }
}

export async function fetchProgram(id: string = '') {
    const res = await axios.get(baseUri + '/ref-program/' + id, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = res.data;
    return data;
}
// Program End

// Kegiatan Start
export async function fetchKegiatans(periode: any, instance: any, search: any = '') {
    try {
        const res = await axios.get(baseUri + '/ref-kegiatan?periode=' + periode + '&instance=' + instance + '&search=' + search, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = await res.data;
        return data;
    } catch (error) {
        return {
            status: 'no instance'
        }
    }
}

export async function fetchKegiatan(id: string = '') {
    const res = await axios.get(baseUri + '/ref-kegiatan/' + id, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = res.data;
    return data;
}
// Kegiatan End

// SubKegiatan Start
export async function fetchSubKegiatans(periode: any, instance: any, search: any = '') {
    try {
        const res = await axios.get(baseUri + '/ref-sub-kegiatan?periode=' + periode + '&instance=' + instance + '&search=' + search, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = await res.data;
        return data;
    } catch (error) {
        return {
            status: 'no instance'
        }
    }
}

export async function fetchSubKegiatan(id: string = '') {
    const res = await axios.get(baseUri + '/ref-sub-kegiatan/' + id, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = res.data;
    return data;
}
// SubKegiatan End

// Indikator Kinjerja Kegiatan Start
export async function fetchIndikatorKegiatans(instance: any, kegiatan: any, search: any = '') {
    // ref-indikator-kegiatan
    const res = await axios.get(baseUri + '/ref-indikator-kegiatan?instance=' + instance + '&kegiatan=' + kegiatan + '&search=' + search, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = await res.data;
    return data;
}

export async function fetchIndikatorKegiatan(id: string = '') {
    // ref-indikator-kegiatan
    const res = await axios.get(baseUri + '/ref-indikator-kegiatan/' + id, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = await res.data;
    return data;
}
// Indikator Kinjerja Kegiatan Start

// Indikator Kinjerja SubKegiatan Start
export async function fetchIndikatorSubKegiatans(instance: any, subkegiatan: any, search: any = '') {
    // ref-indikator-kegiatan
    const res = await axios.get(baseUri + '/ref-indikator-sub-kegiatan?instance=' + instance + '&subkegiatan=' + subkegiatan + '&search=' + search, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = await res.data;
    return data;
}

export async function fetchIndikatorSubKegiatan(id: string = '') {
    // ref-indikator-kegiatan
    const res = await axios.get(baseUri + '/ref-indikator-sub-kegiatan/' + id, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = await res.data;
    return data;
}
// Indikator Kinjerja SubKegiatan Start


// RPJMD Start
export async function fetchRPJMD(periode: any, instance: any, program: any) {
    const res = await axios.get(baseUri + '/caram/rpjmd?periode=' + periode + '&instance=' + instance + '&program=' + program, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = res.data;
    return data;
}
// RPJMD End


// Renstra Start
export async function fetchRenstra(periode: any, instance: any, program: any) {
    const res = await axios.get(baseUri + '/caram/renstra?periode=' + periode + '&instance=' + instance + '&program=' + program, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = res.data;
    return data;
}

export async function fetchDetailRenstraKegiatan(periode: any, instance: any, program: any, kegiatan: any, year: any) {
    const res = await axios.get(baseUri + '/caram/renstra/' + kegiatan + '?periode=' + periode + '&instance=' + instance + '&program=' + program + '&year=' + year + '&type=kegiatan', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = res.data;
    return data;
}

export async function fetchDetailRenstraSubKegiatan(periode: any, instance: any, program: any, subkegiatan: any, year: any) {
    const res = await axios.get(baseUri + '/caram/renstra/' + subkegiatan + '?periode=' + periode + '&instance=' + instance + '&program=' + program + '&year=' + year + '&type=subkegiatan', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = res.data;
    return data;
}

export async function fetchRenstraValidatorNotes(periode: any, instance: any, program: any, renstra: any) {
    const res = await axios.get(baseUri + '/caram/renstra/' + renstra + '/notes?periode=' + periode + '&instance=' + instance + '&program=' + program, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = res.data;
    return data;
}
// Renstra End


// Renja Start
export async function fetchRenja(periode: any, instance: any, program: any) {
    const res = await axios.get(baseUri + '/caram/renja?periode=' + periode + '&instance=' + instance + '&program=' + program, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    // console.log(res);
    const data = res.data;
    return data;
}

export async function fetchDetailRenjaKegiatan(periode: any, instance: any, program: any, kegiatan: any, year: any) {
    const res = await axios.get(baseUri + '/caram/renja/' + kegiatan + '?periode=' + periode + '&instance=' + instance + '&program=' + program + '&year=' + year + '&type=kegiatan', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = res.data;
    return data;
}

export async function fetchDetailRenjaSubKegiatan(periode: any, instance: any, program: any, subkegiatan: any, year: any) {
    const res = await axios.get(baseUri + '/caram/renja/' + subkegiatan + '?periode=' + periode + '&instance=' + instance + '&program=' + program + '&year=' + year + '&type=subkegiatan', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = res.data;
    return data;
}

export async function fetchRenjaValidatorNotes(periode: any, instance: any, program: any, renja: any) {
    const res = await axios.get(baseUri + '/caram/renja/' + renja + '/notes?periode=' + periode + '&instance=' + instance + '&program=' + program, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = res.data;
    return data;
}
