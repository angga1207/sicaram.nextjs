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
import { faCloudUploadAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { BaseUri } from '@/apis/serverConfig';


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
        dispatch(setPageTitle('Import SIPD - BPKAD'));
    });

    const [isMounted, setIsMounted] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        setIsClient(true);
    }, []);

    const [CurrentUser, setCurrentUser] = useState<any>([]);
    useEffect(() => {
        if (window) {
            if (localStorage.getItem('user')) {
                setCurrentUser(JSON.parse(localStorage.getItem('user') ?? '{[]}') ?? []);
            }
        }
    }, []);

    const { t, i18n } = useTranslation();

    const [CurrentToken, setCurrentToken] = useState<any>(null);
    useEffect(() => {
        if (isMounted) {
            setCurrentToken(localStorage.getItem('token') ?? '');
            if (CurrentToken && localStorage.getItem('user')) {
                setCurrentUser(JSON.parse(localStorage.getItem('user') ?? '{[]}') ?? []);
            }
        }
    }, [isMounted]);


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
    const [year, setYear] = useState<any>(new Date().getFullYear())
    const [fileApbd, setFileApbd] = useState<any>(null)
    const [messageApbd, setMessageApbd] = useState<any>('')
    const [fileTargetBelanja, setFileTargetBelanja] = useState<any>(null)
    const [messageTargetBelanja, setMessageTargetBelanja] = useState<any>('')
    const [isUploading, setIsUploading] = useState<any>(false)

    const [logs, setLogs] = useState<any>([])

    useEffect(() => {
        if (isMounted) {
            setYears([]);
            const currentYear = new Date().getFullYear();
            for (let i = currentYear - 1; i < currentYear + 2; i++) {
                setYears((years: any) => [
                    ...years,
                    {
                        label: i,
                        value: i,
                    },
                ]);
            }
        }
    }, [isMounted])

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
        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', fileApbd)
            formData.append('month', month)
            formData.append('year', year)
            formData.append('message', messageApbd)

            const res = await axios.post(BaseUri() + '/caram/upload-apbd', formData, {
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
                                    APBD
                                </>
                            )}
                            {menu === 2 && (
                                <>
                                    Target Belanja
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 pr-4 h-[calc(100vh-350px)] overflow-y-auto overflow-x-hidden">
                        {logs?.map((item: any, index: number) => (
                            <div className="col-span-2 md:col-span-1 flex items-center gap-2 p-4 cursor-pointer border rounded hover:bg-slate-100">
                                <div className="flex-none mr-1">
                                    <FontAwesomeIcon icon={faFolderClosed} className='w-8 h-8' />
                                </div>
                                <div className="grow">
                                    <div className="line-clamp-1 font-semibold">
                                        {item?.file_name}
                                    </div>
                                    <div className="flex items-center">
                                        <div className="mr-1">
                                            {new Date(item?.created_at).toLocaleString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </div>
                                        -
                                        <div className="ml-1">
                                            {item?.author}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[350px]">
                                    {item?.message}
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
                                            Import APBD
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            onClick={(e) => {
                                                setMenu(2)
                                            }}
                                            className={`${selected ? 'text-primary !outline-none before:!w-full' : ''} grow
                                                relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-primary before:transition-all before:duration-700 hover:text-primary hover:before:w-full justify-center font-bold tracking-wide uppercase`}
                                        >
                                            <FontAwesomeIcon icon={faCloudUploadAlt} className='w-5 h-5 mr-2' />
                                            Import Target Belanja
                                        </button>
                                    )}
                                </Tab>
                            </Tab.List>
                            <Tab.Panels>

                                <Tab.Panel>
                                    <div className="active pt-5">
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
                                            <div className="grow">
                                                <Select
                                                    required={true}
                                                    value={years.filter((item: any) => item.value === year)[0]}
                                                    onChange={(e: any) => {
                                                        setYear(e.value)
                                                    }}
                                                    placeholder="Pilih Tahun"
                                                    options={years} />
                                            </div>
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
                                                            Upload Apbd
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
                                    <div className='pt-5'>
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
                                            <div className="grow">
                                                <Select
                                                    required={true}
                                                    value={years.filter((item: any) => item.value === year)[0]}
                                                    onChange={(e: any) => {
                                                        setYear(e.value)
                                                    }}
                                                    placeholder="Pilih Tahun"
                                                    options={years} />
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(e: any) => {
                                                    setFileTargetBelanja(e.target.files[0])
                                                }}
                                                accept='.xls,.xlsx'
                                                id="fileTarget" />
                                            <label htmlFor="fileTarget" className="btn btn-primary cursor-pointer">
                                                Pilih File
                                            </label>

                                            {fileTargetBelanja && (
                                                <div className="mt-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="">
                                                            <div className="line-clamp-1 text-md">
                                                                {fileTargetBelanja.name}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <button
                                                                onClick={(e) => {
                                                                    setFileTargetBelanja(null)
                                                                }}
                                                                className="btn btn-danger px-0.5 py-0.5 rounded-full btn-xs">
                                                                <IconX className='w-4 h-4' />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {months && years && fileTargetBelanja && (
                                            <div className="">
                                                <div className="flex items-center justify-end gap-4 mt-5">
                                                    {isUploading == false && (
                                                        <button
                                                            onClick={(e) => {
                                                                uploadTargetBelanja()
                                                            }}
                                                            className="btn btn-success">
                                                            <FontAwesomeIcon icon={faCloudUploadAlt} className='w-5 h-5 mr-2' />
                                                            Upload Target Belanja
                                                        </button>
                                                    )}
                                                    {isUploading == true && (
                                                        <button className="btn btn-success">
                                                            <FontAwesomeIcon icon={faSpinner} className='w-5 h-5 mr-2 animate-spin' />
                                                            Sedang Upload
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
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
