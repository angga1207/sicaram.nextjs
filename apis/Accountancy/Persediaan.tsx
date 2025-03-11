import { getCookie } from 'cookies-next';
import axios from "axios";
import { BaseUri } from "../serverConfig";
import { getSession } from 'next-auth/react';

// const BaseUri = 'https://simoedanep.in/api';
// const BaseUri = 'https://sicaram.oganilirkab.go.id/api';
const baseUri = BaseUri();

// Rekap Start
export async function getRekap(instance: any = null, periode: any, year: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/accountancy/persediaan/rekap', {
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
        const data = await res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}
// Rekap Start

// BarangHabisPakai Start
export async function getBarangHabisPakai(instance: any = null, periode: any, year: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/accountancy/persediaan/1', {
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
        const data = await res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}
export async function storeBarangHabisPakai(dataInput: any, periode: any, year: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.post(baseUri + '/accountancy/persediaan/1', {
            periode: periode,
            year: year,
            data: dataInput,
        }, {
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
export async function deleteBarangHabisPakai(id: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.delete(baseUri + '/accountancy/persediaan/1', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            data: {
                id: id
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
// BarangHabisPakai End

// BelanjaPersediaan Start
export async function getBelanjaPersediaan(instance: any = null, periode: any, year: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/accountancy/persediaan/2', {
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
        const data = await res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}
export async function storeBelanjaPersediaan(dataInput: any, periode: any, year: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.post(baseUri + '/accountancy/persediaan/2', {
            periode: periode,
            year: year,
            data: dataInput,
        }, {
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
export async function deleteBelanjaPersediaan(id: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.delete(baseUri + '/accountancy/persediaan/2', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            data: {
                id: id
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
// BelanjaPersediaan End

// PersediaanNeraca Start
export async function getPersediaanNeraca(instance: any = null, periode: any, year: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.get(baseUri + '/accountancy/persediaan/3', {
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
        const data = await res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}
export async function storePersediaanNeraca(dataInput: any, periode: any, year: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.post(baseUri + '/accountancy/persediaan/3', {
            periode: periode,
            year: year,
            data: dataInput,
        }, {
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
export async function deletePersediaanNeraca(id: any) {
    try {
        const session = await getSession();
        const CurrentToken = session?.user?.name;
        const res = await axios.delete(baseUri + '/accountancy/persediaan/3', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            data: {
                id: id
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
// PersediaanNeraca End
