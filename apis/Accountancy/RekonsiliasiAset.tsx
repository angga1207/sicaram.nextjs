import { getCookie } from 'cookies-next';
import axios from "axios";
import { BaseUri } from "../serverConfig";


const CurrentToken = getCookie('token');
// const BaseUri = 'https://simoedanep.in/api';
// const BaseUri = 'https://sicaram.oganilirkab.go.id/api';
const baseUri = BaseUri();

// Rekap Belanja Start
export async function getRekapBelanja(instance: any, periode: any, year: any) {
    // /accountancy/rekon-aset/rekap-belanja
    try {
        const res = await axios.get(baseUri + '/accountancy/rekon-aset/rekap-belanja', {
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

export async function saveRekapBelanja(instance: any, periode: any, year: any, dataInput: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/rekon-aset/rekap-belanja', {
            instance: dataInput?.instance_id,
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
// Rekap Belanja End

// KIB A Start
export async function getKibA(instance: any, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/rekon-aset/kib_a', {
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

export async function saveKibA(instance: any, periode: any, year: any, dataInput: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/rekon-aset/kib_a', {
            instance: dataInput?.instance_id,
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
// KIB A End

// KIB B Start
export async function getKibB(instance: any, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/rekon-aset/kib_b', {
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

export async function saveKibB(instance: any, periode: any, year: any, dataInput: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/rekon-aset/kib_b', {
            instance: dataInput?.instance_id,
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
// KIB B End

// KIB C Start
export async function getKibC(instance: any, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/rekon-aset/kib_c', {
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

export async function saveKibC(instance: any, periode: any, year: any, dataInput: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/rekon-aset/kib_c', {
            instance: dataInput?.instance_id,
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
// KIB C End

// KIB D Start
export async function getKibD(instance: any, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/rekon-aset/kib_d', {
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

export async function saveKibD(instance: any, periode: any, year: any, dataInput: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/rekon-aset/kib_d', {
            instance: dataInput?.instance_id,
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
// KIB D End

// KIB E Start
export async function getKibE(instance: any, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/rekon-aset/kib_e', {
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

export async function saveKibE(instance: any, periode: any, year: any, dataInput: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/rekon-aset/kib_e', {
            instance: dataInput?.instance_id,
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
// KIB E End

// Aset Lain-lain Start
export async function getAsetLainLain(instance: any, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/rekon-aset/aset-lain-lain', {
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

export async function saveAsetLainLain(instance: any, periode: any, year: any, dataInput: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/rekon-aset/aset-lain-lain', {
            instance: dataInput?.instance_id,
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
// Aset Lain-lain End

// KDP Start
export async function getKDP(instance: any, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/rekon-aset/kdp', {
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

export async function saveKDP(instance: any, periode: any, year: any, dataInput: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/rekon-aset/kdp', {
            instance: dataInput?.instance_id,
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
// KDP End

// AsetTakBerwujud Start
export async function getAsetTakBerwujud(instance: any, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/rekon-aset/aset-tak-berwujud', {
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

export async function saveAsetTakBerwujud(instance: any, periode: any, year: any, dataInput: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/rekon-aset/aset-tak-berwujud', {
            instance: dataInput?.instance_id,
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
// AsetTakBerwujud End

// RekapAsetLainnya Start
export async function getRekapAsetLainnya(instance: any, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/rekon-aset/rekap-aset-lainnya', {
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

export async function saveRekapAsetLainnya(instance: any, periode: any, year: any, dataInput: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/rekon-aset/rekap-aset-lainnya', {
            instance: dataInput?.instance_id,
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
// RekapAsetLainnya End

// RekapAsetTetap Start
export async function getRekapAsetTetap(instance: any, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/rekon-aset/rekap-aset-tetap', {
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
// RekapAsetTetap End

// RekapOPD Start
export async function getRekapOPD(instance: any, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/rekon-aset/rekap-opd', {
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
// RekapOPD End

// Rekap Start
export async function getRekap(instance: any, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/rekon-aset/rekap', {
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
// Rekap End

// Penyusutan Start
export async function getPenyusutan(instance: any, periode: any, year: any) {
    try {
        const res = await axios.get(baseUri + '/accountancy/rekon-aset/penyusutan', {
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

export async function savePenyusutan(instance: any, periode: any, year: any, dataInput: any) {
    try {
        const res = await axios.post(baseUri + '/accountancy/rekon-aset/penyusutan', {
            instance: instance,
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
        console.log('error', error);
        return {
            status: 'error',
            message: error
        }
    }
}
// Penyusutan End
