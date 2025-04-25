import { useEffect, useState, Fragment, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setPageTitle } from '@/store/themeConfigSlice';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import { Tab } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import Link from 'next/link';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import IconX from '@/components/Icon/IconX';
const angkaTerbilang = require('@develoka/angka-terbilang-js');
import axios, { AxiosRequestConfig } from "axios";
import LoadingSicaram from '@/components/LoadingSicaram';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderClosed } from '@fortawesome/free-regular-svg-icons';
import { faCloudUploadAlt, faLongArrowRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { BaseUri } from '@/apis/serverConfig';
import { useSession } from 'next-auth/react';


const showAlert = async (icon: any, text: any) => {
    const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
    });
    toast.fire({
        icon: icon,
        title: text,
        padding: '10px 20px',
    });
};

const showAlertBox = async (icon: any, title: any, text: any) => {
    const toast = Swal.mixin({
        toast: false,
        position: 'center',
        showConfirmButton: true,
        showCancelButton: false,
        confirmButtonText: 'Tutup',
    });
    toast.fire({
        icon: icon,
        title: title,
        text: text,
        padding: '10px 20px',
    });
};

const Page = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Upload Rekap 5 - BPKAD'));
    });

    const [isMounted, setIsMounted] = useState(false);
    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null)

    useEffect(() => {
        setIsMounted(true);
    }, []);

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

    const [CurrentToken, setCurrentToken] = useState<any>(null);
    const session = useSession();
    useEffect(() => {
        if (isMounted && session.status === 'authenticated') {
            const token = session?.data?.user?.name;
            setCurrentToken(token);
        }
    }, [isMounted, session]);


    const [menu, setMenu] = useState<any>(1);
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
    const [years, setYears] = useState<any>([]);

    const [month, setMonth] = useState<any>(new Date().getMonth())
    const [monthTo, setMonthTo] = useState<any>(12);
    const [fileApbd, setFileApbd] = useState<any>(null)
    const [messageApbd, setMessageApbd] = useState<any>('')
    const [fileTargetBelanja, setFileTargetBelanja] = useState<any>(null)
    const [messageTargetBelanja, setMessageTargetBelanja] = useState<any>('')
    const [fileRekap5, setFileRekap5] = useState<any>(null)
    const [isUploading, setIsUploading] = useState<any>(false)

    const [logs, setLogs] = useState<any>([])

    useEffect(() => {
        if (isMounted) {
            setYears([]);
            if (periode?.id) {
                if (year >= periode?.start_year && year <= periode?.end_year) {
                    for (let i = periode?.start_year; i <= periode?.end_year; i++) {
                        setYears((years: any) => [
                            ...years,
                            {
                                label: i,
                                value: i,
                            },
                        ]);
                    }
                }
            }
        }
    }, [isMounted, year, periode?.id])

    useEffect(() => {
        if (CurrentToken && isMounted) {
            getLogs();
        }
    }, [CurrentToken, isMounted])

    const uploadApbd = async () => {
        if (isUploading) {
            showAlert('error', 'Sedang dalam proses upload, mohon tunggu');
            return
        }

        if (monthTo < month) {
            showAlert('error', 'Bulan yang dipilih tidak sesuai. Minimal sama!');
            return
        }
        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', fileApbd)
            formData.append('month', month)
            formData.append('monthTo', monthTo)
            formData.append('year', year)
            formData.append('periode', periode?.id)
            formData.append('message', messageApbd)

            const res = await axios.post(BaseUri() + '/caram/upload-apbd', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${CurrentToken}`,
                }
            })

            if (res.data.status === 'success') {
                showAlert('success', 'Data berhasil diupload')
                setFileApbd(null)
            } else {
                showAlert('error', 'Data gagal diupload')
            }
            setIsUploading(false)
            getLogs()
        } catch (e) {
            setIsUploading(false)
            console.log(e)
        }
    }

    const uploadRekap5 = async () => {
        if (isUploading) {
            showAlert('error', 'Sedang dalam proses upload, mohon tunggu');
            return
        }
        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', fileRekap5)
            formData.append('month', month)
            formData.append('year', year)
            formData.append('periode', periode?.id)

            const res = await axios.post(BaseUri() + '/caram/upload-rekap5-program', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${CurrentToken}`,
                }
            })

            if (res.data.status === 'success') {
                showAlert('success', 'Data berhasil diupload')
                setFileRekap5(null)
            } else {
                showAlert('error', 'Data gagal diupload')
            }
            setIsUploading(false)
            getLogs()
        } catch (e) {
            setIsUploading(false)
            console.log(e)
        }
    }

    const uploadTargetBelanja = async () => {
        if (isUploading) {
            showAlert('error', 'Sedang dalam proses upload, mohon tunggu');
            return
        }
        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', fileTargetBelanja)
            formData.append('month', month)
            formData.append('year', year)
            formData.append('message', messageTargetBelanja)

            const res = await axios.post(BaseUri() + '/ref-sub-to-rekening-upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${CurrentToken}`,
                }
            })

            if (res.data.status === 'success') {
                showAlert('success', 'Data berhasil diupload')
            } else {
                showAlert('error', 'Data gagal diupload')
            }
            setIsUploading(false)
            getLogs()
        } catch (e) {
            setIsUploading(false)
            console.log(e)
        }
    }

    const getLogs = async () => {
        try {
            await axios.get(BaseUri() + '/sipd/listLogs', {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${CurrentToken}`,
                }
            }).then((res) => {
                if (res.data.status === 'success') {
                    setLogs(res?.data?.data)
                }
            });
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <div className="text-xl font-semibold mb-5">
                BPKAD Panel Import SIPD
            </div>

            <div className="grid grid-cols-12 gap-5">

                <div className="col-span-12 md:col-span-6 panel">

                    <div className="w-full">
                        <div className="text-lg font-semibold mb-3">
                            Upload History &nbsp;
                            {menu === 1 && (
                                <>
                                    Rekap 5 Ke Pagu
                                </>
                            )}
                            {menu === 2 && (
                                <>
                                    Target Belanja
                                </>
                            )}
                            {menu === 3 && (
                                <>
                                    Rekap 5 ke Program Kegiatan
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 pr-4 h-[calc(100vh-350px)] overflow-y-auto overflow-x-hidden">
                        {logs?.map((item: any, index: number) => (
                            <div className={`col-span-2 md:col-span-1 flex items-start gap-2 p-4 cursor-pointer border rounded ${item?.status == 'success' ? 'hover:bg-slate-100' : 'bg-red-100 hover:bg-red-200'}`}>
                                <div className="flex-none mr-1">
                                    <FontAwesomeIcon icon={faFolderClosed} className='w-8 h-8' />
                                </div>
                                <div className="grow">
                                    <div className="line-clamp-1 font-semibold">
                                        {item?.file_name}
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="mr-1">
                                            {new Date(item?.created_at).toLocaleString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                            &nbsp;
                                            {new Date(item?.created_at).toLocaleString('id-ID', {
                                                hour: 'numeric',
                                                minute: 'numeric',
                                            })}
                                            &nbsp;WIB
                                        </div>
                                        <div className="">
                                            {item?.author}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[350px]">
                                    {/* {item?.message} */}
                                    <div className='font-semibold'>
                                        {item?.message?.note ?? item?.message?.message ?? '-'}
                                    </div>
                                    <div className='font-semibold'>
                                        Data Terunggah : {item?.message?.datas_count ?? 0}
                                    </div>
                                    <div className='font-semibold'>
                                        Data Tidak Terunggah : {item?.message?.missing_data_count ?? 0}
                                    </div>
                                    {item?.message?.missing_data?.length > 0 && (
                                        <div>
                                            <div className='font-semibold mb-2 border-b-2'>
                                                Missing Data :
                                            </div>
                                            <div>
                                                {item?.message?.missing_data?.map((item: any) => (
                                                    <div className='mb-1 border-b'>
                                                        {item?.kode_sub_kegiatan} - {item?.nama_sub_kegiatan}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                <div className="col-span-12 md:col-span-6 panel">
                    <div className="">
                        <Tab.Group>
                            <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            onClick={(e) => {
                                                setMenu(1)
                                            }}
                                            className={`${selected ? 'text-primary !outline-none before:!w-full' : ''} grow
                                                    relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-primary before:transition-all before:duration-700 hover:text-primary hover:before:w-full justify-center font-bold tracking-wide uppercase`}
                                        >
                                            <FontAwesomeIcon icon={faCloudUploadAlt} className='w-5 h-5 mr-2' />
                                            REKAP 5 Ke Pagu
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            onClick={(e) => {
                                                setMenu(3)
                                            }}
                                            className={`${selected ? 'text-primary !outline-none before:!w-full' : ''} grow
                                                    relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-primary before:transition-all before:duration-700 hover:text-primary hover:before:w-full justify-center font-bold tracking-wide uppercase`}
                                        >
                                            <FontAwesomeIcon icon={faCloudUploadAlt} className='w-5 h-5 mr-2' />
                                            REKAP 5 ke Master Sub Kegiatan (Referensi)
                                        </button>
                                    )}
                                </Tab>
                            </Tab.List>
                            <Tab.Panels>

                                <Tab.Panel>
                                    <div className="pt-5">
                                        <div className="flex items-center gap-4">
                                            <div className="grow">
                                                <Select
                                                    placeholder="Pilih Bulan"
                                                    required={true}
                                                    value={months.filter((item: any) => item.value === month)[0]}
                                                    onChange={(e: any) => {
                                                        setMonth(e.value)
                                                    }}
                                                    options={months} />
                                            </div>
                                            <div className="">
                                                <FontAwesomeIcon icon={faLongArrowRight} className='text-slate-500 w-4 h-4' />
                                            </div>
                                            <div className="grow">
                                                <Select
                                                    placeholder="Sampai Bulan"
                                                    required={true}
                                                    value={months.filter((item: any) => item.value === monthTo)[0]}
                                                    onChange={(e: any) => {
                                                        setMonthTo(e.value)
                                                    }}
                                                    options={months} />
                                            </div>
                                        </div>
                                        <div className="w-full mt-2">
                                            <Select
                                                required={true}
                                                value={years.filter((item: any) => item.value === year)[0]}
                                                onChange={(e: any) => {
                                                    setYear(e.value)
                                                }}
                                                placeholder="Pilih Tahun"
                                                options={years} />
                                        </div>

                                        <div className="mt-4">
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(e: any) => {
                                                    setFileApbd(e.target.files[0])
                                                }}
                                                accept='.xls,.xlsx'
                                                id="fileApbd" />
                                            <label htmlFor="fileApbd" className="btn btn-primary cursor-pointer">
                                                Pilih File
                                            </label>

                                            {fileApbd && (
                                                <div className="mt-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="">
                                                            <div className="line-clamp-1 text-md">
                                                                {fileApbd.name}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <button
                                                                onClick={(e) => {
                                                                    setFileApbd(null)
                                                                }}
                                                                className="btn btn-danger px-0.5 py-0.5 rounded-full btn-xs">
                                                                <IconX className='w-4 h-4' />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>


                                        {months && years && fileApbd && (
                                            <>
                                                <div className="mt-4">
                                                    <textarea
                                                        className="w-full h-20 border border-gray-300 dark:border-[#191e3a] rounded-md p-2"
                                                        placeholder="Keterangan"
                                                        value={messageApbd}
                                                        onChange={(e) => {
                                                            setMessageApbd(e.target.value)
                                                        }}
                                                    ></textarea>
                                                </div>

                                                <div className="">
                                                    {isUploading == false && (
                                                        <button
                                                            onClick={(e) => {
                                                                uploadApbd()
                                                            }}
                                                            className="btn btn-success">
                                                            <FontAwesomeIcon icon={faCloudUploadAlt} className='w-5 h-5 mr-2' />
                                                            Upload Rekap 5 ke Pagu
                                                        </button>
                                                    )}
                                                    {isUploading == true && (
                                                        <button className="btn btn-success">
                                                            <FontAwesomeIcon icon={faSpinner} className='w-5 h-5 mr-2 animate-spin' />
                                                            Sedang Upload
                                                        </button>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </Tab.Panel>

                                <Tab.Panel>
                                    <div className="active pt-5">

                                        <div className="mt-4">
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(e: any) => {
                                                    setFileRekap5(e.target.files[0])
                                                }}
                                                accept='.xls,.xlsx'
                                                id="fileRekap5" />
                                            <label htmlFor="fileRekap5" className="btn btn-primary cursor-pointer">
                                                Pilih Rekap 5
                                            </label>

                                            {fileRekap5 && (
                                                <div className="mt-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="">
                                                            <div className="line-clamp-1 text-md">
                                                                {fileRekap5.name}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <button
                                                                onClick={(e) => {
                                                                    setFileRekap5(null)
                                                                }}
                                                                className="btn btn-danger px-0.5 py-0.5 rounded-full btn-xs">
                                                                <IconX className='w-4 h-4' />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>


                                        {fileRekap5 && (
                                            <>
                                                <div className="">
                                                    {isUploading == false && (
                                                        <button
                                                            onClick={(e) => {
                                                                uploadRekap5()
                                                            }}
                                                            className="btn btn-success">
                                                            <FontAwesomeIcon icon={faCloudUploadAlt} className='w-5 h-5 mr-2' />
                                                            Upload Rekap 5 ke Program Kegiatan
                                                        </button>
                                                    )}
                                                    {isUploading == true && (
                                                        <button className="btn btn-success">
                                                            <FontAwesomeIcon icon={faSpinner} className='w-5 h-5 mr-2 animate-spin' />
                                                            Sedang Upload
                                                        </button>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </Tab.Panel>

                            </Tab.Panels>
                        </Tab.Group>
                    </div>
                </div>

            </div>
        </>
    );
}

export default Page;
