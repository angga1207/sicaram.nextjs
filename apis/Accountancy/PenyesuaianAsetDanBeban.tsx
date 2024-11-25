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
