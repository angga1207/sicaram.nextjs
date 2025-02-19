import { getCookie } from 'cookies-next';
import axios from "axios";
import { BaseUri } from "../serverConfig";


const CurrentToken = getCookie('token');
// const BaseUri = 'https://simoedanep.in/api';
// const BaseUri = 'https://sicaram.oganilirkab.go.id/api';
const baseUri = BaseUri();

export async function getPenyesuaianBebanBarjas(instance: any = null, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/padb/1', {
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

export async function storePenyesuaianBebanBarjas(dataInput: any, periode: any, year: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/padb/1', {
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

export async function deletePenyesuaianBebanBarjas(id: any) {
    try {
        const res = await axios.delete(baseUri + '/accountancy/padb/1', {
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


export async function getModalKeBeban(instance: any = null, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/padb/2', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                periode: periode,
                year: year,
                instance: instance,
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

export async function storeModalKeBeban(dataInput: any, periode: any, year: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/padb/2', {
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

export async function deleteModalKeBeban(id: any) {
    try {
        const res = await axios.delete(baseUri + '/accountancy/padb/2', {
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


export async function getBarjasKeAset(instance: any = null, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/padb/3', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                periode: periode,
                year: year,
                instance: instance,
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

export async function storeBarjasKeAset(dataInput: any, periode: any, year: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/padb/3', {
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

export async function deleteBarjasKeAset(id: any) {
    try {
        const res = await axios.delete(baseUri + '/accountancy/padb/3', {
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


export async function getPenyesuaianAset(instance: any = null, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/padb/4', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                periode: periode,
                year: year,
                instance: instance,
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

export async function storePenyesuaianAset(dataInput: any, periode: any, year: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/padb/4', {
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

export async function deletePenyesuaianAset(id: any) {
    try {
        const res = await axios.delete(baseUri + '/accountancy/padb/4', {
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


export async function getAtribusi(instance: any = null, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/padb/5', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                periode: periode,
                year: year,
                instance: instance,
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

export async function storeAtribusi(dataInput: any, periode: any, year: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/padb/5', {
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

export async function deleteAtribusi(id: any) {
    try {
        const res = await axios.delete(baseUri + '/accountancy/padb/5', {
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


// Kertas Kerja Tambahan
// Mutasi Aset
export async function getMutasiAset(instance: any = null, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/padb/6.1', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                periode: periode,
                year: year,
                instance: instance,
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
export async function storeMutasiAset(dataInput: any, periode: any, year: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/padb/6.1', {
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

export async function deleteMutasiAset(id: any) {
    try {
        const res = await axios.delete(baseUri + '/accountancy/padb/6.1', {
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
// Mutasi Aset

// Dafter Pekerjaan
export async function getDaftarPekerjaan(instance: any = null, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/padb/6.2', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                periode: periode,
                year: year,
                instance: instance,
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
export async function storeDaftarPekerjaan(dataInput: any, periode: any, year: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/padb/6.2', {
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

export async function deleteDaftarPekerjaan(id: any) {
    try {
        const res = await axios.delete(baseUri + '/accountancy/padb/6.2', {
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
// Dafter Pekerjaan

// Hibah Masuk
export async function getHibahMasuk(instance: any = null, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/padb/6.3', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                periode: periode,
                year: year,
                instance: instance,
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
export async function storeHibahMasuk(dataInput: any, periode: any, year: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/padb/6.3', {
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

export async function deleteHibahMasuk(id: any) {
    try {
        const res = await axios.delete(baseUri + '/accountancy/padb/6.3', {
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
// Hibah Masuk

// Hibah Keluar
export async function getHibahKeluar(instance: any = null, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/padb/6.4', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                periode: periode,
                year: year,
                instance: instance,
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
export async function storeHibahKeluar(dataInput: any, periode: any, year: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/padb/6.4', {
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

export async function deleteHibahKeluar(id: any) {
    try {
        const res = await axios.delete(baseUri + '/accountancy/padb/6.4', {
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
// Hibah Keluar

// PenilaianAset
export async function getPenilaianAset(instance: any = null, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/padb/7', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                periode: periode,
                year: year,
                instance: instance,
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
export async function storePenilaianAset(dataInput: any, periode: any, year: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/padb/7', {
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
export async function deletePenilaianAset(id: any) {
    try {
        const res = await axios.delete(baseUri + '/accountancy/padb/7', {
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
// PenilaianAset

// PenghapusanAset
export async function getPenghapusanAset(instance: any = null, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/padb/8', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                periode: periode,
                year: year,
                instance: instance,
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
export async function storePenghapusanAset(dataInput: any, periode: any, year: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/padb/8', {
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
export async function deletePenghapusanAset(id: any) {
    try {
        const res = await axios.delete(baseUri + '/accountancy/padb/8', {
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
// PenghapusanAset

// PenjualanAset
export async function getPenjualanAset(instance: any = null, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/padb/9', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                periode: periode,
                year: year,
                instance: instance,
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
export async function storePenjualanAset(dataInput: any, periode: any, year: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/padb/9', {
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
export async function deletePenjualanAset(id: any) {
    try {
        const res = await axios.delete(baseUri + '/accountancy/padb/9', {
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
// PenjualanAset
