import { fetchInstances, fetchProgramsSubKegiatan } from "@/apis/fetchRealisasi";
import { setPageTitle } from "@/store/themeConfigSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BaseUri, GlobalEndPoint } from '@/apis/serverConfig';
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import Select from 'react-select';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';
import Link from "next/link";
import { faCloudUploadAlt, faSpinner } from "@fortawesome/free-solid-svg-icons";


const showAlert = async (icon: any, text: any) => {
    const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
    });
    toast.fire({
        icon: icon,
        title: text,
        padding: '10px 20px',
    });
};
const showAlertCenter = async (icon: any, text: any) => {
    const toast = Swal.mixin({
        toast: false,
        position: 'center',
        showConfirmButton: true,
        confirmButtonText: 'Tutup',
        showCancelButton: false,
    });
    toast.fire({
        icon: icon,
        title: text,
        padding: '10px 20px',
    });
};

const Page = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Import SIPD - BPKAD'));
    });

    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null)
    const [month, setMonth] = useState<any>(null)
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    })

    const [CurrentToken, setCurrentToken] = useState<any>(null);
    const session = useSession();
    useEffect(() => {
        if (isMounted && session.status === 'authenticated') {
            const token = session?.data?.user?.name;
            setCurrentToken(token);
        }
    }, [isMounted, session]);

    const [CurrentUser, setCurrentUser] = useState<any>([]);
    useEffect(() => {
        if (document.cookie) {
            let user = document.cookie.split(';').find((row) => row.trim().startsWith('user='))?.split('=')[1];
            user = user ? JSON.parse(user) : null;
            setCurrentUser(user);
        }
        if (isMounted) {
            const localPeriode = localStorage.getItem('periode');
            if (localPeriode) {
                setPeriode(JSON.parse(localPeriode ?? ""));
            }
        }
    }, [isMounted]);

    useEffect(() => {
        if (isMounted && periode?.id) {
            const currentYear = new Date().getFullYear();
            if (periode?.start_year <= currentYear) {
                setYear(currentYear);
            } else {
                setYear(periode?.start_year)
            }
        }
    }, [isMounted, periode?.id])

    const [years, setYears] = useState<any>([]);
    const [months, setMonths] = useState([
        {
            id: 1,
            label: 'Januari',
            value: 1,
        },
        {
            id: 2,
            label: 'Februari',
            value: 2,
        },
        {
            id: 3,
            label: 'Maret',
            value: 3,
        },
        {
            id: 4,
            label: 'April',
            value: 4,
        },
        {
            id: 5,
            label: 'Mei',
            value: 5,
        },
        {
            id: 6,
            label: 'Juni',
            value: 6,
        },
        {
            id: 7,
            label: 'Juli',
            value: 7,
        },
        {
            id: 8,
            label: 'Agustus',
            value: 8,
        },
        {
            id: 9,
            label: 'September',
            value: 9,
        },
        {
            id: 10,
            label: 'Oktober',
            value: 10,
        },
        {
            id: 11,
            label: 'November',
            value: 11,
        },
        {
            id: 12,
            label: 'Desember',
            value: 12,
        },
    ]);
    const [instances, setInstances] = useState<any>([]);
    const [programs, setPrograms] = useState<any>([]);
    const [kegiatans, setKegiatans] = useState<any>([]);
    const [subKegiatans, setSubKegiatans] = useState<any>([]);

    useEffect(() => {
        if (isMounted) {
            setYears([]);
            if (periode?.id) {
                if (year >= periode?.start_year && year <= periode?.end_year) {
                    for (let i = periode?.start_year; i <= periode?.end_year; i++) {
                        setYears((years: any) => [
                            ...years,
                            {
                                label: parseInt(i),
                                value: parseInt(i),
                            },
                        ]);
                    }
                }
            }
        }
    }, [isMounted, year, periode?.id])


    const fetchRefs = async () => {
        const response = await axios.get(`${BaseUri()}/report/getRefs`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            },
            params: {
                periode_id: periode?.id,
            }
        });
        const data = await response.data;
        return data;
    }

    useEffect(() => {
        if (isMounted && instances.length == 0 && CurrentToken) {
            fetchRefs().then((data: any) => {
                if (data.status == 'success') {
                    setInstances(data.data.instances);
                    // setYears(data.data.periodeRange.years);
                } else if (data.status == 'error') {
                    showAlert('error', data.message);
                } else {
                    showAlert('error', 'Terjadi kesalahan');
                }
            });
        }
    }, [isMounted, CurrentToken]);

    const [instance, setInstance] = useState<any>(null);
    const [programId, setProgramId] = useState<any>(null);
    const [program, setProgram] = useState<any>(null);
    const [kegiatanId, setKegiatanId] = useState<any>(null);
    const [kegiatan, setKegiatan] = useState<any>(null);
    const [subKegiatanId, setSubKegiatanId] = useState<any>(null);
    const [subKegiatan, setSubKegiatan] = useState<any>(null);
    const [datas, setDatas] = useState<any>([]);
    const [file, setFile] = useState<any>(null)

    useEffect(() => {
        if (isMounted && instance && year && month) {
            fetchProgramsSubKegiatan(instance, year).then((data) => {
                if (data.status === 'success') {
                    setDatas(data.data);
                    setPrograms(data.data)
                }

                if (data.status === 'error') {
                    showAlert('error', data.message);
                }

                if (data?.message?.response?.status == 401) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Sesi Anda telah berakhir',
                        text: 'Silahkan login kembali',
                        padding: '10px 20px',
                        showCancelButton: false,
                        confirmButtonText: 'Login',
                        cancelButtonText: 'Batal',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = '/login';
                        }
                    });
                }
            });
        }
    }, [instance, year, month]);

    useEffect(() => {
        setDatas([]);
        setPrograms([]);
        setKegiatans([]);
        setSubKegiatans([]);
    }, [instance, year])

    useEffect(() => {
        if (datas.length > 0) {
            const kegs = datas.filter((item: any, index: number) => {
                if (item.id == programId) {
                    return item;
                }
            });
            setKegiatans(kegs[0]?.kegiatans ?? [])
            setSubKegiatans([])
        }
    }, [programId])

    useEffect(() => {
        if (datas.length > 0) {
            const subKegs = kegiatans.filter((item: any, index: number) => {
                if (item.id == kegiatanId) {
                    return item;
                }
            });
            setSubKegiatans(subKegs[0]?.sub_kegiatans ?? [])
        }
    }, [kegiatanId])

    useEffect(() => {
        if (subKegiatanId) {
            setSubKegiatan(subKegiatans.find((item: any) => item.id == subKegiatanId))
        } else {
            setSubKegiatan(null)
        }
    }, [subKegiatanId])


    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = () => {
        if (isUploading) {
            showAlertCenter('error', 'Sedang dalam proses upload, mohon tunggu');
            return
        }

        // if (monthTo < month) {
        //     showAlert('error', 'Bulan yang dipilih tidak sesuai. Minimal sama!');
        //     return
        // }
        if (subKegiatan) {
            Swal.fire({
                // title: 'Unggah Berkas Realisasi',
                title: 'Apakah anda yakin untuk mengunggah berkas realisasi <br/> Sub Kegiatan : ' + subKegiatan.fullcode + ' - ' + subKegiatan.name + ', <br/> Bulan ' + months.find((item: any) => item.value == month)?.label + ' Tahun ' + year,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Unggah',
                cancelButtonText: 'Batal',
                cancelButtonColor: '#3085d6',
                confirmButtonColor: '#00ab55',
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    goUpload();
                }
            });
            return;
        } else {
            showAlertCenter('error', 'Pilih Sub Kegiatan!');
            return
        }
    }

    const goUpload = async () => {
        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('periode', periode?.id)
            formData.append('instance', instance)
            formData.append('year', year)
            formData.append('month', month)
            formData.append('id', subKegiatanId)

            const res = await axios.post(BaseUri() + '/caram/realisasi/' + subKegiatanId + '/upload/excel', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${CurrentToken}`,
                }
            })

            if (res.data.status === 'success') {
                showAlertCenter('success', 'Data Realisasi berhasil diupload')
                // setFile(null)
            } else {
                showAlertCenter('error', res.data.message);
            }
            setIsUploading(false)
        } catch (e) {
            setIsUploading(false)
            // console.log(e)
        }
    }

    return (
        <div>
            <div className="panel">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                    <div className="">
                        <div className="mb-5">
                            <label className="form-label mb-0">
                                Perangkat Daerah
                            </label>
                            <Select placeholder="Pilih Perangkat Daerah"
                                className='w-full'
                                onChange={(e: any) => {
                                    if ([9].includes(CurrentUser?.role_id)) {
                                        showAlert('error', 'Anda tidak memiliki akses ke Perangkat Daerah ini');
                                    } else {
                                        setInstance(e?.value);
                                    }
                                }}
                                isDisabled={[9].includes(CurrentUser?.role_id) ? true : false}
                                value={
                                    instances?.map((data: any, index: number) => {
                                        if (data.id == instance) {
                                            return {
                                                value: data.id,
                                                label: data.name,
                                            }
                                        }
                                    })
                                }
                                options={
                                    instances?.map((data: any, index: number) => {
                                        return {
                                            value: data.id,
                                            label: data.name,
                                        }
                                    })
                                } />
                        </div>

                        <div className="mb-5">
                            <label className="form-label mb-0">
                                Tahun
                            </label>
                            <Select placeholder="Pilih Tahun"
                                className='w-full'
                                onChange={(e: any) => {
                                    console.log(e)
                                    setYear(e?.value);
                                }}
                                value={
                                    years?.map((data: any, index: number) => {
                                        if (data?.value == year) {
                                            return {
                                                value: data.value,
                                                label: data.label,
                                            }
                                        }
                                    })
                                }
                                options={
                                    years?.map((data: any, index: number) => {
                                        return {
                                            value: data.label,
                                            label: data.value,
                                        }
                                    })
                                } />
                        </div>

                        <div className="mb-5">
                            <label className="form-label mb-0">
                                Bulan
                            </label>
                            <Select placeholder="Pilih Bulan"
                                className='w-full'
                                onChange={(e: any) => {
                                    setMonth(e?.value);
                                }}
                                value={
                                    months?.map((data: any, index: number) => {
                                        if (data.id == month) {
                                            return {
                                                value: data.id,
                                                label: data.label,
                                            }
                                        }
                                    })
                                }
                                options={
                                    months?.map((data: any, index: number) => {
                                        return {
                                            value: data.id,
                                            label: data.label,
                                        }
                                    })
                                } />
                        </div>
                    </div>

                    {datas?.length > 0 ? (
                        <div className="">
                            {(instance && year && month) && (
                                <div className="mb-5">
                                    <label className="form-label mb-0">
                                        Program
                                    </label>
                                    <Select placeholder="Pilih Program"
                                        className='w-full'
                                        onChange={(e: any) => {
                                            if ([9].includes(CurrentUser?.role_id)) {
                                                showAlert('error', 'Anda tidak memiliki akses ke Program ini');
                                            } else {
                                                setProgramId(e?.value);
                                            }
                                        }}
                                        isDisabled={[9].includes(CurrentUser?.role_id) ? true : false}
                                        value={
                                            programs?.map((data: any, index: number) => {
                                                if (data.id == programId) {
                                                    return {
                                                        value: data.id,
                                                        label: data.fullcode + ' - ' + data.name,
                                                    }
                                                }
                                            })
                                        }
                                        options={
                                            programs?.map((data: any, index: number) => {
                                                return {
                                                    value: data.id,
                                                    label: data.fullcode + ' - ' + data.name,
                                                }
                                            })
                                        } />
                                </div>
                            )}

                            {(instance && year && month && programId) && (
                                <div className="mb-5">
                                    <label className="form-label mb-0">
                                        Kegiatan
                                    </label>
                                    <Select placeholder="Pilih Kegiatan"
                                        className='w-full'
                                        onChange={(e: any) => {
                                            if ([9].includes(CurrentUser?.role_id)) {
                                                showAlert('error', 'Anda tidak memiliki akses ke Kegiatan ini');
                                            } else {
                                                setKegiatanId(e?.value);
                                            }
                                        }}
                                        isDisabled={[9].includes(CurrentUser?.role_id) ? true : false}
                                        value={
                                            kegiatans?.map((data: any, index: number) => {
                                                if (data.id == kegiatanId) {
                                                    return {
                                                        value: data.id,
                                                        label: data.fullcode + ' - ' + data.name,
                                                    }
                                                }
                                            })
                                        }
                                        options={
                                            kegiatans?.map((data: any, index: number) => {
                                                return {
                                                    value: data.id,
                                                    label: data.fullcode + ' - ' + data.name,
                                                }
                                            })
                                        } />
                                </div>
                            )}

                            {(instance && year && month && programId && kegiatanId) && (
                                <div className="mb-5">
                                    <label className="form-label mb-0">
                                        Sub Kegiatan
                                    </label>
                                    <Select placeholder="Pilih Sub Kegiatan"
                                        className='w-full'
                                        onChange={(e: any) => {
                                            if ([9].includes(CurrentUser?.role_id)) {
                                                showAlert('error', 'Anda tidak memiliki akses ke Sub Kegiatan ini');
                                            } else {
                                                setSubKegiatanId(e?.value);
                                            }
                                        }}
                                        isDisabled={[9].includes(CurrentUser?.role_id) ? true : false}
                                        value={
                                            subKegiatans?.map((data: any, index: number) => {
                                                if (data.id == subKegiatanId) {
                                                    return {
                                                        value: data.id,
                                                        label: data.fullcode + ' - ' + data.name,
                                                    }
                                                }
                                            })
                                        }
                                        options={
                                            subKegiatans?.map((data: any, index: number) => {
                                                return {
                                                    value: data.id,
                                                    label: data.fullcode + ' - ' + data.name,
                                                }
                                            })
                                        } />
                                </div>
                            )}
                        </div>
                    ) : (
                        <></>
                    )}

                    {(instance && year && month && programId && kegiatanId && subKegiatanId) && (
                        <>
                            <div className="">
                                <div className="mb-5">
                                    <div className="btn btn-primary w-full relative cursor-pointer">
                                        <input
                                            id="inputFile"
                                            type="file"
                                            accept=".xlsx"
                                            title="Pilih Berkas Realisasi"
                                            onChange={(e: any) => {
                                                setFile(e.target.files[0])
                                                // console.log(e.target.files[0])
                                            }}
                                            className="opacity-0 absolute top-0 left-0 w-full h-full" />
                                        <label htmlFor="inputFile" className="cursor-pointer select-none mb-0">
                                            {file ? file?.name : 'Pilih Berkas Realisasi'}
                                        </label>
                                        {file && (
                                            <Tippy content="Hapus Berkas" theme="danger">
                                                <button
                                                    onClick={() => {
                                                        if (isUploading) {
                                                            return;
                                                        }
                                                        setFile(null)
                                                    }}
                                                    className="btn btn-sm rounded-full w-6 h-6 p-1 btn-danger ml-5">
                                                    <FontAwesomeIcon icon={faTimesCircle} className="w-4 h-4" />
                                                </button>
                                            </Tippy>
                                        )}
                                    </div>
                                </div>
                                <div className="mb-5">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            if (isUploading) {
                                                return;
                                            }
                                            handleUpload();
                                        }}
                                        className="btn btn-success w-full">
                                        {isUploading == false ? (
                                            <FontAwesomeIcon icon={faCloudUploadAlt} className="w-4 h-4 mr-1" />
                                        ) : (
                                            <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 mr-1 animate-spin" />
                                        )}
                                        {isUploading ? 'Sedang Mengunggah' : 'Unggah'}
                                    </button>
                                </div>
                            </div>
                            <div className="">
                                <div className="mb-5">
                                    <Link
                                        href={`/realisasi/${subKegiatanId}?periode=${periode?.id}&year=${year}&month=${month}`}
                                        target="_blank"
                                        className="btn btn-secondary w-full">
                                        Buka Halaman Realisasi
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}


                </div>

            </div>
        </div>
    );
}

export default Page;
