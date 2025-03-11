import axios from "axios";
import { BaseUri } from "./serverConfig";
import { getCookie } from 'cookies-next';
import { getSession } from "next-auth/react";

// const BaseUri = 'https://simoedanep.in/api';
// const BaseUri = 'https://sicaram.oganilirkab.go.id/api';
// const BaseUri = 'http://127.0.0.1:8000/api';
// const BaseUri = process.env.BASE_SERVER_URI;
const baseUri = BaseUri();

export async function fetchAllDataUsers(role: string, search: string = '') {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/users?' + '_fRole=' + role + '&search=' + search, {
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

// Roles Start
export async function fetchRoles(search: string = '') {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/roles?search=' + search, {
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

export async function fetchRole(id: string = '') {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/roles/' + id, {
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
// Roles End


// Users Start
export async function fetchUsers(role: string, search: string = '', instance: string = '') {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/users', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                _fRole: role,
                search: search,
                instance: instance
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

export async function fetchUser(id: string = '') {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/users/' + id, {
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
// Users End


// Instances Start
export async function fetchInstances(search: any = '') {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/instances?search=' + search, {
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
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/instances/' + id, {
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

export async function fetchInstanceSubUnit(id: string = '', periode: number) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/instances/' + id + '/sub_unit', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                periode: periode,
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

export async function fetchInstanceSubUnitDetail(alias: string = '', id: any, periode: number) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/instances/' + alias + '/sub_unit/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                periode: periode,
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

export async function fetchInstanceSubUnitDelete(alias: string = '', id: any, periode: number) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.delete(baseUri + '/instances/' + alias + '/sub_unit/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                periode: periode,
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

export async function storeInstanceSubUnit(instanceId: any, data: any) {
    const Slug = instanceId;
    if (!Slug) {
        return {
            status: 'error',
            message: 'Id not found'
        }
    }
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.post(baseUri + '/instances/' + Slug + '/sub_unit', data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        })
        const dataRes = await res.data;
        return dataRes;
    } catch (error) {
        return {
            status: 'error',
            message: error
        };
    }
}
// Instances End


// Periode Start
export async function fetchPeriodes(search: any = '') {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/ref-periode?search=' + search, {
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

    // const res = await axios.get(baseUri + '/ref-periode?search=' + search, {
    //     headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${CurrentToken}`,
    //     },
    // });
    // const data = await res.data;
    // return data;
}

export async function fetchRangePeriode(id: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/ref-periode-range?periode_id=' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

// Satuan Start
export async function fetchSatuans(search: any = '') {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/ref-satuan?search=' + search, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
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
// Satuan End

// Master Rekening Start
export async function fetchRekenings(periode: any, level: any, parent_id: any = '', search: any = '') {
    // ref/rekening
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/ref-rekening?periode=' + periode + '&search=' + search + '&level=' + level + '&parent_id=' + parent_id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
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

export async function fetchRekening(id: string = '', level: any, periode: any) {
    // ref-rekening/{id}
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/ref-rekening/' + id + '?level=' + level + '&periode=' + periode, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        // console.log(res);
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

// Master Sumber Dana
export async function fetchSumberDanas(periode: any, search: any = '') {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/ref-sumber-dana?periode=' + periode + '&search=' + search, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
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


// Urusan Start
export async function fetchUrusans(periode: any, search: any = '') {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/ref-urusan?periode=' + periode + '&search=' + search, {
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

export async function fetchUrusan(id: string = '') {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/ref-urusan/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}
// Urusan End

// Bidang Start
export async function fetchBidangs(periode: any, search: any = '') {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/ref-bidang?periode=' + periode + '&search=' + search, {
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

export async function fetchBidang(id: string = '') {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/ref-bidang/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}
// Bidang End

// Program Start
export async function fetchPrograms(periode: any, instance: any, search: any = '') {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
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
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/ref-program/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}
// Program End

// Kegiatan Start
export async function fetchKegiatans(periode: any, instance: any, search: any = '') {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
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
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/ref-kegiatan/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}
// Kegiatan End

// SubKegiatan Start
export async function fetchSubKegiatans(periode: any, instance: any, search: any = '') {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
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
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/ref-sub-kegiatan/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}
// SubKegiatan End

// Indikator Kinjerja Kegiatan Start
export async function fetchIndikatorKegiatans(instance: any, kegiatan: any, search: any = '') {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/ref-indikator-kegiatan?instance=' + instance + '&kegiatan=' + kegiatan + '&search=' + search, {
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

export async function fetchIndikatorKegiatan(id: string = '') {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/ref-indikator-kegiatan/' + id, {
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
// Indikator Kinjerja Kegiatan Start

// Indikator Kinjerja SubKegiatan Start
export async function fetchIndikatorSubKegiatans(instance: any, subkegiatan: any, search: any = '') {
    // ref-indikator-kegiatan
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/ref-indikator-sub-kegiatan?instance=' + instance + '&subkegiatan=' + subkegiatan + '&search=' + search, {
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

export async function fetchIndikatorSubKegiatan(id: string = '') {
    // ref-indikator-kegiatan
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/ref-indikator-sub-kegiatan/' + id, {
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
// Indikator Kinjerja SubKegiatan Start


// RPJMD Start
export async function fetchRPJMD(periode: any, instance: any, program: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/caram/rpjmd?periode=' + periode + '&instance=' + instance + '&program=' + program, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}
// RPJMD End


// Renstra Start
export async function fetchRenstra(periode: any, instance: any, program: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/caram/renstra?periode=' + periode + '&instance=' + instance + '&program=' + program, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function fetchDetailRenstraKegiatan(periode: any, instance: any, program: any, kegiatan: any, year: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/caram/renstra/' + kegiatan + '?periode=' + periode + '&instance=' + instance + '&program=' + program + '&year=' + year + '&type=kegiatan', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function fetchDetailRenstraSubKegiatan(periode: any, instance: any, program: any, subkegiatan: any, year: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/caram/renstra/' + subkegiatan + '?periode=' + periode + '&instance=' + instance + '&program=' + program + '&year=' + year + '&type=subkegiatan', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function fetchRenstraValidatorNotes(periode: any, instance: any, program: any, renstra: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/caram/renstra/' + renstra + '/notes?periode=' + periode + '&instance=' + instance + '&program=' + program, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}
// Renstra End


// Renja Start
export async function fetchRenja(periode: any, instance: any, program: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/caram/renja?periode=' + periode + '&instance=' + instance + '&program=' + program, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        // console.log(res);
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function fetchDetailRenjaKegiatan(periode: any, instance: any, program: any, kegiatan: any, year: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/caram/renja/' + kegiatan + '?periode=' + periode + '&instance=' + instance + '&program=' + program + '&year=' + year + '&type=kegiatan', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function fetchDetailRenjaSubKegiatan(periode: any, instance: any, program: any, subkegiatan: any, year: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/caram/renja/' + subkegiatan + '?periode=' + periode + '&instance=' + instance + '&program=' + program + '&year=' + year + '&type=subkegiatan', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function fetchRenjaValidatorNotes(periode: any, instance: any, program: any, renja: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/caram/renja/' + renja + '/notes?periode=' + periode + '&instance=' + instance + '&program=' + program, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}


// APBD Start
export async function fetchProgramsAPBD(periode: any, instance: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/caram/ref-apbd?periode=' + periode + '&instance=' + instance, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        // console.log(res);
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function fetchAPBD(periode: any, instance: any, program: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/caram/apbd?periode=' + periode + '&instance=' + instance + '&program=' + program, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        // console.log(res);
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function fetchDetailApbdKegiatan(periode: any, instance: any, program: any, kegiatan: any, year: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/caram/apbd/' + kegiatan + '?periode=' + periode + '&instance=' + instance + '&program=' + program + '&year=' + year + '&type=kegiatan', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function fetchDetailApbdSubKegiatan(periode: any, instance: any, program: any, kegiatan: any, year: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/caram/apbd/' + kegiatan + '?periode=' + periode + '&instance=' + instance + '&program=' + program + '&year=' + year + '&type=subkegiatan', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function fetchApbdValidatorNotes(periode: any, instance: any, program: any, apbd: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/caram/apbd/' + apbd + '/notes?periode=' + periode + '&instance=' + instance + '&program=' + program, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}
