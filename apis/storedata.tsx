
import axios from "axios";
import { BaseUri } from "./serverConfig";
import { getCookie } from 'cookies-next';

// const CurrentToken = getCookie('token');
// const CurrentToken = sessionStorage.getItem('token') ?? '';
// const BaseUri = 'https://simoedanep.in/api';
// const BaseUri = 'https://sicaram.oganilirkab.go.id/api';


// const BaseUri = 'http://127.0.0.1:8000/api';
// const BaseUri = 'http://103.162.35.44/api';
const baseUri = BaseUri();
// const BaseUri = process.env.BASE_SERVER_URI;

var FormData = require('form-data');
const CurrentToken = getCookie('token');

// Users Start
export async function storeUser(data: any) {
    const res = await fetch(baseUri + '/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
        body: JSON.stringify(data),
    });
    const dataRes = await res.json();
    return dataRes;
}

export async function updateUserWithPhoto(data: any) {
    const res = await axios.post(baseUri + '/users/' + data.id, {
        'fullname': data.fullname,
        'firstname': data.firstname,
        'lastname': data.lastname,
        'username': data.username,
        'email': data.email,
        'password': data.password,
        'password_confirmation': data.password_confirmation,
        'role': data.role,
        'instance_id': data.instance_id,
        'instance_ids': data.instance_ids,
        'instance_type': data.instance_type,
        // foto = path to file
        'foto': data.fotoPath,
    }, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${CurrentToken}`,
        }
    })
    const dataRes = await res.data;
    return dataRes;
}

export async function updateUser(data: any) {
    const newData = {
        'fullname': data.fullname,
        'firstname': data.firstname,
        'lastname': data.lastname,
        'username': data.username,
        'email': data.email,
        'password': data.password,
        'password_confirmation': data.password_confirmation,
        'role': data.role,
        'instance_id': data.instance_id,
        'instance_ids': data.instance_ids,
        'instance_type': data.instance_type,
    };
    const res = await fetch(baseUri + '/users/' + data.id, {
        method: 'POST',
        headers: {
            // 'Content-Type': 'multipart/form-data; boundary=---WebKitFormBoundary7MA4YWxkTrZu0gW',
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            // 'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
            'Accept': '*/*',
            'Connection': 'keep-alive',
            Authorization: `Bearer ${CurrentToken}`,
        },
        body: JSON.stringify(newData),
        // body: data,
    });
    const dataRes = await res.json();
    return dataRes;
}

export async function deleteUser(id: string) {
    const res = await fetch(baseUri + '/users/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const dataRes = await res.json();
    return dataRes;
}
// Users End

// Periode Start
export async function storePeriode(data: any) {
    const res = await fetch(baseUri + '/ref-periode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
        body: JSON.stringify(data),
    });
    const dataRes = await res.json();
    return dataRes;
}

export async function updatePeriode(data: any) {
    const res = await fetch(baseUri + '/ref-periode/' + data.id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
        body: JSON.stringify(data),
    });
    const dataRes = await res.json();
    return dataRes;
}

// Satuan Start
export async function storeSatuan(data: any) {
    const res = await fetch(baseUri + '/ref-satuan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
        body: JSON.stringify(data),
    });
    const dataRes = await res.json();
    return dataRes;
}

export async function updateSatuan(data: any) {
    const res = await fetch(baseUri + '/ref-satuan/' + data.id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
        body: JSON.stringify(data),
    });
    const dataRes = await res.json();
    return dataRes;
}

export async function deleteSatuan(id: string) {
    const res = await fetch(baseUri + '/ref-satuan/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const dataRes = await res.json();
    return dataRes;
}

// Instances Start
export async function storeInstance(data: any) {
    try {
        const res = await fetch(baseUri + '/instances', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            body: JSON.stringify(data),
        });
        const dataRes = await res.json();
        return dataRes;
    } catch (error) {
        return error;
    }
}

export async function updateInstance(data: any) {
    const res = await fetch(baseUri + '/instances/' + data.id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
        body: JSON.stringify(data),
    });
    const dataRes = await res.json();
    return dataRes;
}

export async function deleteInstance(id: number) {
    const res = await fetch(baseUri + '/instances/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const dataRes = await res.json();
    return dataRes;
}
// Instances End

// Ref Rekening Start
export async function storeRefRekening(periode: any, data: any, year: any) {
    try {
        const res = await axios.post(baseUri + '/ref-rekening?periode=' + periode + '&year=' + year, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        })
        const dataRes = await res.data;
        return dataRes;
    } catch (error) {
        return error;
    }
}

export async function updateRefRekening(periode: any, data: any) {
    try {
        const res = await axios.post(baseUri + '/ref-rekening/' + data.id + '?periode=' + periode, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        })
        const dataRes = await res.data;
        return dataRes;
    } catch (error) {
        return error;
    }
}

export async function deleteRefRekening(level: any, id: string) {
    const res = await fetch(baseUri + '/ref-rekening/' + id + '?level=' + level, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const dataRes = await res.json();
    return dataRes;
}

export async function uploadExcel(file: any, periode: any, year: any) {
    const res = await axios.post(baseUri + '/ref-rekening-upload', {
        'file': file,
        periode: periode,
        year: year,
    }, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${CurrentToken}`,
        }
    })
    const dataRes = await res.data;
    return dataRes;
}

// Role Start
export async function storeRole(data: any) {
    const res = await fetch(baseUri + '/roles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
        body: JSON.stringify(data),
    });
    const dataRes = await res.json();
    return dataRes;
}

export async function updateRole(data: any) {
    const res = await fetch(baseUri + '/roles/' + data.id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
        body: JSON.stringify(data),
    });
    const dataRes = await res.json();
    return dataRes;
}

export async function deleteRole(id: string) {
    const res = await fetch(baseUri + '/roles/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const dataRes = await res.json();
    return dataRes;
}
// Role End

// Master Urusan Start
export async function storeUrusan(data: any) {
    const res = await fetch(baseUri + '/ref-urusan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
        body: JSON.stringify(data),
    });
    const dataRes = await res.json();
    return dataRes;
}

export async function updateUrusan(data: any) {
    const res = await fetch(baseUri + '/ref-urusan/' + data.id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
        body: JSON.stringify(data),
    });
    const dataRes = await res.json();
    return dataRes;
}

export async function deleteUrusan(id: number) {
    const res = await fetch(baseUri + '/ref-urusan/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const dataRes = await res.json();
    return dataRes;
}
// Master Urusan End

// Master Bidang Start
export async function storeBidang(data: any) {
    const res = await fetch(baseUri + '/ref-bidang', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
        body: JSON.stringify(data),
    });
    const dataRes = await res.json();
    return dataRes;
}

export async function updateBidang(data: any) {
    const res = await fetch(baseUri + '/ref-bidang/' + data.id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
        body: JSON.stringify(data),
    });
    const dataRes = await res.json();
    return dataRes;
}

export async function deleteBidang(id: number) {
    const res = await fetch(baseUri + '/ref-bidang/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const dataRes = await res.json();
    return dataRes;
}
// Master Bidang End

// Master Program Start
export async function storeProgram(data: any) {
    try {
        const res = await fetch(baseUri + '/ref-program', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            body: JSON.stringify(data),
        });
        const dataRes = await res.json();
        return dataRes;
    } catch (error) {
        return error;
    }
}

export async function updateProgram(data: any) {
    const res = await fetch(baseUri + '/ref-program/' + data.id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
        body: JSON.stringify(data),
    });
    const dataRes = await res.json();
    return dataRes;
}

export async function deleteProgram(id: number) {
    const res = await fetch(baseUri + '/ref-program/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const dataRes = await res.json();
    return dataRes;
}
// Master Program End

// Master Kegiatan Start
export async function storeKegiatan(data: any) {
    const res = await fetch(baseUri + '/ref-kegiatan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
        body: JSON.stringify(data),
    });
    const dataRes = await res.json();
    return dataRes;
}

export async function updateKegiatan(data: any) {
    const res = await fetch(baseUri + '/ref-kegiatan/' + data.id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
        body: JSON.stringify(data),
    });
    const dataRes = await res.json();
    return dataRes;
}

export async function deleteKegiatan(id: number) {
    const res = await fetch(baseUri + '/ref-kegiatan/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const dataRes = await res.json();
    return dataRes;
}
// Master Kegiatan End

// Master SubKegiatan Start
export async function storeSubKegiatan(data: any) {
    const res = await fetch(baseUri + '/ref-sub-kegiatan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
        body: JSON.stringify(data),
    });
    const dataRes = await res.json();
    return dataRes;
}

export async function updateSubKegiatan(data: any) {
    const res = await fetch(baseUri + '/ref-sub-kegiatan/' + data.id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
        body: JSON.stringify(data),
    });
    const dataRes = await res.json();
    return dataRes;
}

export async function deleteSubKegiatan(id: number) {
    const res = await fetch(baseUri + '/ref-sub-kegiatan/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const dataRes = await res.json();
    return dataRes;
}
// Master SubKegiatan End


// Indikator Kinerja Kegiatan Start
export async function storeIndikatorKegiatan(data: any) {
    try {
        const res = await axios.post(baseUri + '/ref-indikator-kegiatan', {
            'name': data.name,
            'instance_id': data.instance_id,
            'periode_id': data.periode_id,
            'kegiatan_id': data.kegiatan_id,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        })
        const dataRes = await res.data;
        return dataRes;
    } catch (error) {
        return error;
    }
}

export async function updateIndikatorKegiatan(data: any) {

    try {
        const res = await axios.post(baseUri + '/ref-indikator-kegiatan/' + data.id, {
            'name': data.name,
            'instance_id': data.instance_id,
            'periode_id': data.periode_id,
            'kegiatan_id': data.kegiatan_id,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        })
        const dataRes = await res.data;
        return dataRes;
    } catch (error) {
        return error;
    }
}

export async function deleteIndikatorKegiatan(id: string) {
    const res = await fetch(baseUri + '/ref-indikator-kegiatan/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const dataRes = res.json();
    return dataRes;
}
// Indikator Kinerja Kegiatan End

// Indikator Kinerja SubKegiatan Start
export async function storeIndikatorSubKegiatan(data: any) {
    try {
        const res = await axios.post(baseUri + '/ref-indikator-sub-kegiatan', {
            'name': data.name,
            'instance_id': data.instance_id,
            'periode_id': data.periode_id,
            'sub_kegiatan_id': data.sub_kegiatan_id,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        })
        const dataRes = await res.data;
        return dataRes;
    } catch (error) {
        return error;
    }
}

export async function updateIndikatorSubKegiatan(data: any) {

    try {
        const res = await axios.post(baseUri + '/ref-indikator-sub-kegiatan/' + data.id, {
            'name': data.name,
            'instance_id': data.instance_id,
            'periode_id': data.periode_id,
            'sub_kegiatan_id': data.sub_kegiatan_id,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        })
        const dataRes = await res.data;
        return dataRes;
    } catch (error) {
        return error;
    }
}

export async function deleteIndikatorSubKegiatan(id: string) {
    const res = await fetch(baseUri + '/ref-indikator-sub-kegiatan/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const dataRes = res.json();
    return dataRes;
}


export async function saveRpjmd(periode: any, instance: any, program: any, rpjmd: any, data: any) {
    try {
        const res = await axios.post(baseUri + '/caram/rpjmd', {
            'periode': periode,
            'instance': instance,
            'program': program,
            'rpjmd': rpjmd,
            'data': data,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        })
        const dataRes = await res.data;
        return dataRes;
    } catch (error) {
        return error;
    }
}


export async function saveRenstraKegiatan(periode: any, instance: any, program: any, kegiatan: any, year: any, data: any) {
    try {
        const res = await axios.post(baseUri + '/caram/renstra/' + kegiatan, {
            'periode': periode,
            'instance': instance,
            'program': program,
            'year': year,
            'data': data,
            'type': 'kegiatan',
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        })
        const dataRes = await res.data;
        return dataRes;
    } catch (error) {
        return error;
    }
}

export async function saveRenstraSubKegiatan(periode: any, instance: any, program: any, sub_kegiatan: any, year: any, data: any) {
    try {
        const res = await axios.post(baseUri + '/caram/renstra/' + sub_kegiatan, {
            'periode': periode,
            'instance': instance,
            'program': program,
            'year': year,
            'data': data,
            'type': 'subkegiatan',
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        })
        const dataRes = await res.data;
        return dataRes;
    } catch (error) {
        return error;
    }
}

export async function postRenstraNotes(periode: any, instance: any, program: any, renstra: any, message: any, status: any) {
    try {
        const res = await axios.post(baseUri + '/caram/renstra/' + renstra + '/notes?periode=' + periode + '&instance=' + instance + '&program=' + program, {
            'periode': periode,
            'instance': instance,
            'program': program,
            'renstra': renstra,
            'message': message,
            'status': status,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        })
        const dataRes = await res.data;
        return dataRes;
    } catch (error) {
        return error;
    }
}

export async function saveRenjaKegiatan(periode: any, instance: any, program: any, kegiatan: any, year: any, data: any) {
    try {
        const res = await axios.post(baseUri + '/caram/renja/' + kegiatan, {
            'periode': periode,
            'instance': instance,
            'program': program,
            'year': year,
            'data': data,
            'type': 'kegiatan',
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        })
        const dataRes = await res.data;
        return dataRes;
    } catch (error) {
        return error;
    }
}

export async function saveRenjaSubKegiatan(periode: any, instance: any, program: any, sub_kegiatan: any, year: any, data: any) {
    try {
        const res = await axios.post(baseUri + '/caram/renja/' + sub_kegiatan, {
            'periode': periode,
            'instance': instance,
            'program': program,
            'year': year,
            'data': data,
            'type': 'subkegiatan',
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        })
        const dataRes = await res.data;
        return dataRes;
    } catch (error) {
        return error;
    }
}

export async function postRenjaNotes(periode: any, instance: any, program: any, renja: any, message: any, status: any) {
    try {
        const res = await axios.post(baseUri + '/caram/renja/' + renja + '/notes?periode=' + periode + '&instance=' + instance + '&program=' + program, {
            'periode': periode,
            'instance': instance,
            'program': program,
            'renja': renja,
            'message': message,
            'status': status,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        })
        const dataRes = await res.data;
        return dataRes;
    } catch (error) {
        return error;
    }
}

export async function saveApbdKegiatan(periode: any, instance: any, program: any, kegiatan: any, year: any, data: any) {
    try {
        const res = await axios.post(baseUri + '/caram/apbd/' + kegiatan, {
            'periode': periode,
            'instance': instance,
            'program': program,
            'year': year,
            'data': data,
            'type': 'kegiatan',
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        })
        const dataRes = await res.data;
        return dataRes;
    } catch (error) {
        return error;
    }
}

export async function saveApbdSubKegiatan(periode: any, instance: any, program: any, kegiatan: any, year: any, data: any) {
    try {
        const res = await axios.post(baseUri + '/caram/apbd/' + kegiatan, {
            'periode': periode,
            'instance': instance,
            'program': program,
            'year': year,
            'data': data,
            'type': 'subkegiatan',
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        })
        const dataRes = await res.data;
        return dataRes;
    } catch (error) {
        return error;
    }
}

export async function postApbdNotes(periode: any, instance: any, program: any, apbd: any, message: any, status: any) {
    try {
        const res = await axios.post(baseUri + '/caram/apbd/' + apbd + '/notes?periode=' + periode + '&instance=' + instance + '&program=' + program, {
            'periode': periode,
            'instance': instance,
            'program': program,
            'apbd': apbd,
            'message': message,
            'status': status,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        })
        const dataRes = await res.data;
        return dataRes;
    } catch (error) {
        return error;
    }
}

export async function uploadExcelApbd(dataInputExcel: any) {
    try {
        const res = await axios.post(baseUri + '/caram/upload-apbd', {
            'file': dataInputExcel?.file,
            'date': dataInputExcel?.date,
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${CurrentToken}`,
            }
        })
        const dataRes = await res.data;
        return dataRes;
    } catch (error) {
        return {
            'status': 'error',
            'message': error,
        }
    }
}

// const [remaining, setRemaining] = useState(0);
// const [progress, setProgress] = useState(0);

export async function uploadExcelCodeSubToCodeRekening(file: any) {
    try {
        const res = await axios.post(baseUri + '/ref-sub-to-rekening-upload', {
            'file': file,
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${CurrentToken}`,
            }
        })
        const dataRes = await res.data;
        return dataRes;
    } catch (error) {
        return error;
    }
}

export async function uploadExcelSumberDana(file: any, periode: any, year: any) {
    try {
        const res = await axios.post(baseUri + '/ref-sumber-dana-upload', {
            'file': file,
            periode: periode,
            year: year,
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${CurrentToken}`,
            }
        })
        const dataRes = await res.data;
        return dataRes;
    } catch (error) {
        return error;
    }
}
