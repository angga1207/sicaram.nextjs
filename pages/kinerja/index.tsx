import { useEffect, useState, Fragment, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useRouter } from 'next/router';
import { setPageTitle } from '../../store/themeConfigSlice';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { BaseUri } from "@/apis/serverConfig";
import axios, { AxiosRequestConfig } from "axios";
import { setCookie, getCookie, hasCookie, deleteCookie } from 'cookies-next';
const CurrentToken = getCookie('token');

import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';
import Dropdown from '../../components/Dropdown';
import Swal from 'sweetalert2';
import Link from 'next/link';
import Select from 'react-select';
import LoadingSicaram from '@/components/LoadingSicaram';
import IconSearch from '@/components/Icon/IconSearch';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconFacebook from '@/components/Icon/IconFacebook';
import IconTwitter from '@/components/Icon/IconTwitter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faCaretDown, faCaretRight, faExclamationTriangle, faFileUpload, faGlobeAsia, faMinus } from '@fortawesome/free-solid-svg-icons';
import IconPencil from '@/components/Icon/IconPencil';
import IconLaptop from '@/components/Icon/IconLaptop';
import IconX from '@/components/Icon/IconX';

import { fetchPeriodes, fetchSatuans, fetchRangePeriode } from '@/apis/fetchdata';
import { fetchInstances, fetchProgramsSubKegiatan } from '@/apis/fetchRealisasi';
import { uploadExcelCodeSubToCodeRekening } from '@/apis/storedata';
import { Router } from 'next/router';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconFolder from '@/components/Icon/IconFolder';
import IconFile from '@/components/Icon/IconFile';
import IconLayoutGrid from '@/components/Icon/IconLayoutGrid';
import IconListCheck from '@/components/Icon/IconListCheck';
import IconArrowForward from '@/components/Icon/IconArrowForward';
import Content1 from '@/components/Kinerja/Content1';


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

const Index = () => {

    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        dispatch(setPageTitle('Realisasi Kinerja'));
    });

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

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
                if (localStorage.getItem('year')) {
                    setYear(localStorage.getItem('year'));
                } else {
                    setYear(currentYear);
                }
            } else {
                setYear(periode?.start_year)
            }
        }
    }, [isMounted, periode?.id]);

    const { t, i18n } = useTranslation();

    const [datas, setDatas] = useState([]);
    const [periodes, setPeriodes] = useState([]);
    const [years, setYears] = useState<any>(null);
    // const [year, setYear] = useState<any>(router.query.year ?? new Date().getFullYear());
    const [months, setMonths] = useState<any>([
        { value: 1, label: 'Januari' },
        { value: 2, label: 'Februari' },
        { value: 3, label: 'Maret' },
        { value: 4, label: 'April' },
        { value: 5, label: 'Mei' },
        { value: 6, label: 'Juni' },
        { value: 7, label: 'Juli' },
        { value: 8, label: 'Agustus' },
        { value: 9, label: 'September' },
        { value: 10, label: 'Oktober' },
        { value: 11, label: 'November' },
        { value: 12, label: 'Desember' },
    ]);

    const [month, setMonth] = useState<any>(null);
    const [instance, setInstance] = useState<any>(null);
    const [instances, setInstances] = useState<any>([]);
    const [searchInstance, setSearchInstance] = useState('');
    const [satuans, setSatuans] = useState<any>([]);
    const [modalRealisasi, setModalRealisasi] = useState(false);
    const [modalImport, setModalImport] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [viewType, setViewType] = useState<any>('grid')
    const [file, setFile] = useState<any>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [uploadMessages, setUploadMessages] = useState<any>(null);

    useEffect(() => {
        if ([9].includes(CurrentUser?.role_id)) {
            if (router.query.instance !== CurrentUser?.instance_id) {
                router.query.instance = CurrentUser?.instance_id;
                router.push(router);
            }
            setInstance(CurrentUser?.instance_id);
        }
    }, [CurrentUser, router.query]);

    useEffect(() => {
        setYear(router.query.year);
        setInstance(router.query.instance);
        setMonth(router.query.month);
    }, [router.query]);

    useEffect(() => {
        if (isMounted && periode?.id) {
            fetchPeriodes().then((data) => {
                if (data.status == 'success') {
                    setPeriodes(data.data);
                }
            });
            fetchInstances(searchInstance).then((data) => {
                if (data.status == 'success') {
                    setInstances(data.data);
                }
            });
            fetchSatuans().then((data) => {
                if (data.status == 'success') {
                    setSatuans(data.data);
                }
            });
            fetchRangePeriode(periode?.id).then((data) => {
                if (data.status == 'success') {
                    setYears(data.data.years);
                }
            });
        }
    }, [isMounted, periode?.id]);

    useEffect(() => {
        if (searchInstance == '') {
            fetchInstances(searchInstance).then((data) => {
                setInstances(data.data);
            });
        } else {
            const instcs = instances.map((item: any) => {
                if (item.name.toLowerCase().includes(searchInstance.toLowerCase())) {
                    return item;
                }
            }).filter((item: any) => item != undefined);
            setInstances(instcs);
        }
    }, [searchInstance]);

    useEffect(() => {
        router.query.instance = instance;
        setYear(null)
        router.query.year = '';
        setMonth(null)
        router.query.month = '';

        setDatas([]);

        router.push(router);
    }, [instance]);

    useEffect(() => {
        router.query.year = year;
        setMonth(null)
        router.query.month = '';

        setDatas([]);

        router.push(router);
    }, [year]);

    useEffect(() => {
        router.query.month = month;
        router.push(router);
    }, [month]);

    const backToInstances = () => {
        setInstance(null);
        setDatas([]);

        if (router.query) {
            // router.query.year = '';
            router.query.month = '';
            router.query.instance = '';
            router.push(router);
        }
    }

    return (
        <>

            <div className="">
                <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5">
                    <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                        INPUT REALISASI {year} <br />
                        {instances?.[instance - 1]?.name ?? '\u00A0'}
                    </h2>
                    <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">

                        {!instance ? (
                            <>
                                <div className="flex items-center gap-1">

                                    <button
                                        onClick={() => {
                                            setViewType('grid')
                                        }}
                                        className={viewType == 'grid'
                                            ? 'btn btn-dark text-white px-2.5'
                                            : 'btn btn-outline-dark text-slate-900 hover:text-white dark:text-white px-2.5'
                                        }
                                        type='button'>
                                        <IconLayoutGrid className='w-4 h-4' />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setViewType('list')
                                        }}
                                        className={viewType == 'list'
                                            ? 'btn btn-dark text-white px-2.5'
                                            : 'btn btn-outline-dark text-slate-900 hover:text-white dark:text-white px-2.5'
                                        }
                                        type='button'>
                                        <IconListCheck className='w-4 h-4' />
                                    </button>
                                </div>
                                <div className="relative">
                                    <input type="search"
                                        className="form-input sm:w-[300px] rtl:pl-12 ltr:pr-12"
                                        placeholder='Cari Perangkat Daerah...'
                                        onChange={(e) => setSearchInstance(e.target.value)}
                                    />
                                    <div className="absolute rtl:left-0 ltr:right-0 top-0 bottom-0 flex items-center justify-center w-12 h-full">
                                        <IconSearch className="w-4 h-4 text-slate-400" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {(CurrentUser?.role_id == 1 || CurrentUser?.role_id == 2 || CurrentUser?.role_id == 3 || CurrentUser?.role_id == 4 || CurrentUser?.role_id == 5 || CurrentUser?.role_id == 6 || CurrentUser?.role_id == 7 || CurrentUser?.role_id == 8) && (
                                    <>
                                        <button type="button" className="btn btn-secondary whitespace-nowrap"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                backToInstances();
                                            }}
                                        >
                                            <IconArrowBackward className="w-4 h-4" />
                                            <span className="ltr:ml-2 rtl:mr-2">
                                                Kembali
                                            </span>
                                        </button>
                                        {/* <Link href="/kinerja" className="btn btn-secondary whitespace-nowrap" >
                                            <IconArrowBackward className="w-4 h-4" />
                                            <span className="ltr:ml-2 rtl:mr-2">
                                                Kembali
                                            </span>
                                        </Link> */}
                                    </>
                                )}

                            </>
                        )}

                    </div>

                </div>
            </div>

            {(!instance && viewType == 'grid') && (
                <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-5 w-full">
                    {instances?.map((data: any, index: number) => {
                        return (
                            <div className="bg-white dark:bg-[#1c232f] rounded-md overflow-hidden text-center shadow relative">
                                <div className="bg-slate-700 rounded-t-md bg-center bg-cover p-6 pb-0" style={
                                    {
                                        backgroundImage: "url('/assets/images/notification-bg.png')"
                                        // backgroundImage: data?.logo ? `url(${data?.logo})` : "url('/assets/images/notification-bg.png')"
                                    }
                                }>
                                    <img className="object-contain w-4/5 h-40 mx-auto" src={data?.logo} alt="contact_image" />
                                </div>
                                <div className="px-2 py-4">
                                    <div className="cursor-pointer group"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setInstance(data.id);
                                        }}>
                                        <div className="text-lg font-semibold line-clamp-2 h-15 group-hover:text-primary">
                                            {data?.name}
                                        </div>
                                        <div className="text-white-dark group-hover:text-primary">
                                            ({data?.alias})
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-center gap-4 w-full">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setInstance(data.id);
                                            }}
                                            type="button"
                                            className="btn btn-outline-primary">
                                            <IconPencil className="w-4 h-4 mr-2" />
                                            Buka
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {(!instance && viewType == 'list') && (
                <div className="table-responsive panel">
                    <table className='table-hover'>
                        <thead className=''>
                            <tr>
                                <th className="!text-center bg-dark text-white border !min-w-[500px]">
                                    Nama Perangkat Daerah
                                </th>
                                <th className="!text-center bg-dark text-white border !w-[300px]">
                                    Program / Kegiatan / Sub Kegiatan
                                </th>
                                <th className="!text-center bg-dark text-white border !w-[150px]">
                                    Opt
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {instances?.map((data: any, index: number) => {
                                return (
                                    <tr>
                                        <td className='!p-2 border'>
                                            <div className="flex items-center gap-x-3">
                                                <div className="w-[38px] flex-none">
                                                    <img className="object-contain w-full h-[38px] mx-auto" src={data?.logo} alt="contact_image" />
                                                </div>
                                                <div className="font-semibold">
                                                    {data?.name}
                                                    <div className="text-white-dark text-xs font-normal group-hover:text-primary">
                                                        ({data?.alias})
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="!p-2 border">
                                            <div className="flex items-center justify-center divide-x divide-slate-400">
                                                <div className='px-1'>
                                                    {data?.programs}
                                                    <span className='text-[10px] pl-0.5'>
                                                        (Prg)
                                                    </span>
                                                </div>
                                                <div className='px-1'>
                                                    {data?.kegiatans}
                                                    <span className='text-[10px] pl-0.5'>
                                                        (Kgt)
                                                    </span>
                                                </div>
                                                <div className='px-1'>
                                                    {data?.sub_kegiatans}
                                                    <span className='text-[10px] pl-0.5'>
                                                        (Skgt)
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="!p-2 border">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setInstance(data.id);
                                                    }}
                                                    type="button"
                                                    className="btn btn-outline-primary px-2 py-1 whitespace-nowrap text-[10px]">
                                                    <IconPencil className="w-4 h-4 mr-1" />
                                                    Buka
                                                </button>
                                                {/* <button type="button" className="btn btn-outline-secondary px-2 py-1 whitespace-nowrap text-[10px]">
                                                    <IconLaptop className="w-4 h-4 mr-1" />
                                                    Lihat Laporan
                                                </button> */}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {!instance && instances?.length == 0 && (
                <>
                    <div className="w-full h-[calc(100vh-300px)] flex flex-col items-center justify-center">
                        {LoadingSicaram()}
                        <div className="dots-loading text-xl">Memuat Perangkat Daerah...</div>
                    </div>
                </>
            )}

            {instance && (
                <Content1
                    arrInstances={instances}
                    arrYears={years}
                    arrMonths={months}
                    instance={instance}
                    changeInstance={setInstance}
                    year={year}
                    changeYear={setYear}
                    month={month}
                    changeMonth={setMonth}
                />
            )}
        </>
    );
};

export default Index;
