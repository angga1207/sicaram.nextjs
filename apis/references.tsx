
import axios from "axios";
import { BaseUri } from "./serverConfig";
import { getCookie } from 'cookies-next';
const baseUri = BaseUri();
const CurrentToken = getCookie('token');

export async function getSumberDana(search: string, page: number) {
    try {
        let uri = '';
        if (search) {
            uri = baseUri + '/ref-tag-sumber-dana?search=' + search + '&page=' + page;
        } else {
            uri = baseUri + '/ref-tag-sumber-dana?page=' + page;
        }
        const res = await axios.get(uri, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
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

export async function saveSumberDana(data: any) {
    try {
        const res = await axios.post(baseUri + '/ref-tag-sumber-dana', data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
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

export async function deleteSumberDana(id: number) {
    try {
        const res = await axios.delete(baseUri + '/ref-tag-sumber-dana/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
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

export async function getRefTujuanSasaran(search: string, page: number, instance: string, type: string, periode: any) {
    try {
        let uri = '';
        if (search) {
            uri = baseUri + '/ref-tujuan-sasaran?search=' + search + '&page=' + page;
        } else {
            uri = baseUri + '/ref-tujuan-sasaran?page=' + page;
        }
        const res = await axios.get(uri, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            },
            params: {
                instance: instance,
                type: type,
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

export async function getDetailRefTujuanSasaran(id: number, type: any) {
    try {
        const res = await axios.get(baseUri + '/ref-tujuan-sasaran/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            },
            params: {
                type: type
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

export async function saveRefTujuanSasaran(data: any) {
    try {
        const res = await axios.post(baseUri + '/ref-tujuan-sasaran', data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
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

export async function deleteRefTujuanSasaran(id: number, type: any) {
    try {
        const res = await axios.delete(baseUri + '/ref-tujuan-sasaran/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            },
            params: {
                type: type
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

export async function getRefIndikatorTujuanSasaran(search: string, page: number, instance: string, type: string, periode:any) {
    try {
        let uri = '';
        if (search) {
            uri = baseUri + '/ref-indikator-tujuan-sasaran?search=' + search + '&page=' + page;
        } else {
            uri = baseUri + '/ref-indikator-tujuan-sasaran?page=' + page;
        }
        const res = await axios.get(uri, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            },
            params: {
                instance: instance,
                type: type,
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

export async function getDetailRefIndikatorTujuanSasaran(id: number, type: any) {
    try {
        const res = await axios.get(baseUri + '/ref-indikator-tujuan-sasaran/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            },
            params: {
                type: type
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

export async function saveRefIndikatorTujuanSasaran(data: any) {
    try {
        const res = await axios.post(baseUri + '/ref-indikator-tujuan-sasaran', data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
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

export async function deleteRefIndikatorTujuanSasaran(id: number) {
    try {
        const res = await axios.delete(baseUri + '/ref-indikator-tujuan-sasaran/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
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
