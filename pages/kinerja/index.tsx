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
        if (isMounted) {
            if (instance && year && month) {
                if (datas?.length == 0) {
                    fetchProgramsSubKegiatan(instance, year).then((data) => {
                        if (data.status === 'success') {
                            setDatas(data.data);
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
            }
        }
    }, [instance, year, month, isMounted]);

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

    const [showPrograms, setShowPrograms] = useState<string[]>([]);
    const [showKegiatans, setShowKegiatans] = useState<string[]>([]);
    const [showSubKegiatans, setShowSubKegiatans] = useState<string[]>([]);

    const backToInstances = () => {
        setInstance(null);
        // setYear(null);
        setDatas([]);
        setShowPrograms([]);
        setShowKegiatans([]);
        setShowSubKegiatans([]);

        if (router.query) {
            // router.query.year = '';
            router.query.month = '';
            router.query.instance = '';
            router.push(router);
        }
    }

    const togglePrograms = (id: any) => {
        if (showPrograms.includes(id)) {
            setShowPrograms((value) => value.filter((d) => d !== id));
        } else {
            setShowPrograms([...showPrograms, id]);
        }
        setShowKegiatans([]);
    }

    const toggleKegiatans = (id: any) => {
        if (showKegiatans.includes(id)) {
            setShowKegiatans((value) => value.filter((d) => d !== id));
        } else {
            setShowKegiatans([...showKegiatans, id]);
        }
        setShowSubKegiatans([]);
    }

    const toggleSubKegiatans = (id: any) => {
        if (showSubKegiatans.includes(id)) {
            setShowSubKegiatans((value) => value.filter((d) => d !== id));
        } else {
            setShowSubKegiatans([...showSubKegiatans, id]);
        }
    }

    const baseUri = BaseUri();
    const uploadFile = () => {
        setSaveLoading(true);
        uploadExcelCodeSubToCodeRekening(file).then((data: any) => {
            if (data.status == 'success') {
                showAlert('success', data.message);
                fetchInstances(searchInstance).then((data) => {
                    setInstances(data.data);
                });
                setSaveLoading(false);
                // setModalImport(false);
                setFile(null);
                setUploadMessages(data.data)
            } else if (data.status == 'error validation') {
                showAlert('error', data.message.file[0]);
                setSaveLoading(false);
            } else {
                showAlert('error', data.message);
                setSaveLoading(false);
                setFile(null);
            }
        });
    }

    // click outside container to collapse all
    // useEffect(() => {
    //     const handleOutSideClick = (event: any) => {
    //         if (!ref.current?.contains(event.target)) {
    //             setShowPrograms([]);
    //             setShowKegiatans([]);
    //             setShowSubKegiatans([]);
    //         }
    //     };
    //     window.addEventListener("mousedown", handleOutSideClick);
    //     return () => {
    //         window.removeEventListener("mousedown", handleOutSideClick);
    //     };
    // }, [ref]);

    return (
        <>

            <div className="">
                <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5">
                    <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                        Input Kinerja & Anggaran {year} <br />
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
                <div className='mb-10'>
                    <div className='mb-3'>
                        <div className="text-center text-md font-semibold mb-2">
                            Pilih Tahun
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            {years?.map((yr: any, index: number) => (
                                <button
                                    key={`yr-${yr}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setYear(yr);
                                    }}
                                    className={year == yr ? 'btn btn-primary mr-2' : 'btn btn-outline-primary mr-2'}>
                                    {yr}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className=''>
                        <div className="text-center text-md font-semibold mb-2">
                            Pilih Bulan
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            {months?.map((mth: any, index: number) => (
                                <button
                                    key={`mth-${index}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setMonth(mth.value);
                                    }}
                                    className={month == mth.value ? 'btn btn-primary mr-2' : 'btn btn-outline-primary mr-2'}>
                                    {mth.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {(instance && year && month) && (
                <>
                    <div className="font-semibold text-lg mb-4">
                        Pilih Program
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                        {datas?.map((program: any, index: number) => (
                            <>
                                {(showPrograms.includes(program?.id) || showPrograms.length == 0) && (
                                    <div
                                        onClick={(e) => {
                                            e.preventDefault();
                                            togglePrograms(program.id);
                                        }}
                                        className={`panel hover:bg-primary-light cursor-pointer ${(showPrograms.includes(program.id)) ? 'col-span-12 bg-primary-light' : 'col-span-12 md:col-span-6 lg:col-span-4'}`}>

                                        <div className="h-full gap-x-4">
                                            <div className="font-semibold">
                                                {program?.fullcode}
                                            </div>
                                            <div className="grow">
                                                {program?.name}
                                            </div>
                                        </div>

                                    </div>
                                )}
                                {showPrograms.includes(program?.id) && (
                                    <div className='col-span-12'>
                                        <div className="font-semibold text-lg mb-4">
                                            Pilih Kegiatan
                                        </div>
                                        <div className='grid grid-cols-12 gap-4'>
                                            {program?.kegiatans?.map((kegiatan: any, index: number) => (
                                                <>
                                                    {(showKegiatans.includes(kegiatan.id) || showKegiatans.length == 0) && (
                                                        <div
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                toggleKegiatans(kegiatan.id);
                                                            }}
                                                            className={`panel hover:bg-primary-light cursor-pointer ${showKegiatans.includes(kegiatan.id) ? 'col-span-12 bg-primary-light' : 'col-span-12 md:col-span-6 lg:col-span-4'}`}>

                                                            <div className="h-full gap-x-4">
                                                                <div className="font-semibold">
                                                                    {kegiatan?.fullcode}
                                                                </div>
                                                                <div className="grow">
                                                                    {kegiatan?.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {showKegiatans.includes(kegiatan?.id) && (
                                                        <div className='col-span-12'>
                                                            <div className="font-semibold text-lg mb-4">
                                                                Pilih Sub Kegiatan
                                                            </div>
                                                            <div className='grid grid-cols-12 gap-4'>
                                                                {kegiatan?.sub_kegiatans?.map((subkegiatan: any, index: number) => (
                                                                    <>
                                                                        {(showSubKegiatans.includes(subkegiatan.id) || showSubKegiatans.length == 0) && (
                                                                            <div
                                                                                className={`panel hover:bg-primary-light cursor-pointer ${showSubKegiatans.includes(subkegiatan.id) ? 'col-span-12 bg-primary-light' : 'col-span-12 md:col-span-6 lg:col-span-4'}`}>

                                                                                <div className="h-full gap-x-4">
                                                                                    <div
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            toggleSubKegiatans(subkegiatan.id);
                                                                                        }} className=''>
                                                                                        <div className="font-semibold">
                                                                                            {subkegiatan?.fullcode}
                                                                                        </div>
                                                                                        <div className="">
                                                                                            {subkegiatan?.name}
                                                                                        </div>
                                                                                    </div>

                                                                                    {showSubKegiatans.includes(subkegiatan?.id) && (
                                                                                        <>
                                                                                            <div className="flex items-center gap-2 border-t border-slate-500 pt-3 mt-3 hidden">

                                                                                                <div className="text-center">
                                                                                                    <div className="text-xs mb-1">
                                                                                                        Renstra
                                                                                                    </div>
                                                                                                    {subkegiatan?.renstra_status == 'draft' && (
                                                                                                        <span className="badge bg-primary">
                                                                                                            Draft
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.renstra_status == 'verified' && (
                                                                                                        <span className="badge bg-success">
                                                                                                            Terverifikasi
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.renstra_status == 'return' && (
                                                                                                        <span className="badge bg-warning">
                                                                                                            Dikembalikan
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.renstra_status == 'waiting' && (
                                                                                                        <span className="badge bg-warning">
                                                                                                            Menunggu
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.renstra_status == 'sent' && (
                                                                                                        <span className="badge bg-info">
                                                                                                            Dikirim
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.renstra_status == 'reject' && (
                                                                                                        <span className="badge bg-danger">
                                                                                                            Ditolak
                                                                                                        </span>
                                                                                                    )}
                                                                                                </div>

                                                                                                <div className="text-center">
                                                                                                    <div className="text-xs mb-1">
                                                                                                        Renja
                                                                                                    </div>
                                                                                                    {subkegiatan?.renja_status == 'draft' && (
                                                                                                        <span className="badge bg-primary">
                                                                                                            Draft
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.renja_status == 'verified' && (
                                                                                                        <span className="badge bg-success">
                                                                                                            Terverifikasi
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.renja_status == 'return' && (
                                                                                                        <span className="badge bg-warning">
                                                                                                            Dikembalikan
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.renja_status == 'waiting' && (
                                                                                                        <span className="badge bg-warning">
                                                                                                            Menunggu
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.renja_status == 'sent' && (
                                                                                                        <span className="badge bg-info">
                                                                                                            Dikirim
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.renja_status == 'reject' && (
                                                                                                        <span className="badge bg-danger">
                                                                                                            Ditolak
                                                                                                        </span>
                                                                                                    )}
                                                                                                </div>

                                                                                                <div className="text-center">
                                                                                                    <div className="text-xs mb-1">
                                                                                                        APBD
                                                                                                    </div>
                                                                                                    {subkegiatan?.apbd_status == 'draft' && (
                                                                                                        <span className="badge bg-primary">
                                                                                                            Draft
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.apbd_status == 'verified' && (
                                                                                                        <span className="badge bg-success">
                                                                                                            Terverifikasi
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.apbd_status == 'return' && (
                                                                                                        <span className="badge bg-warning">
                                                                                                            Dikembalikan
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.apbd_status == 'waiting' && (
                                                                                                        <span className="badge bg-warning">
                                                                                                            Menunggu
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.apbd_status == 'sent' && (
                                                                                                        <span className="badge bg-info">
                                                                                                            Dikirim
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.apbd_status == 'reject' && (
                                                                                                        <span className="badge bg-danger">
                                                                                                            Ditolak
                                                                                                        </span>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex gap-2 mt-4">
                                                                                                <div className="text-xs font-normal mb-1">
                                                                                                    Input Realisasi Tahun {year}
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="flex flex-col md:flex-row items-center justify-start gap-2 md:divide-x divide-indigo-500 pb-3 lg:pb-0">
                                                                                                {/* <div className="px-0 flex-none">
                                                                                                    <Select
                                                                                                        className="min-w-[200px]"
                                                                                                        id="month"
                                                                                                        options={months}
                                                                                                        value={months?.find((option: any) => option.value === month)}
                                                                                                        onChange={(e: any) => {
                                                                                                            setMonth(e.value)
                                                                                                            router.query.month = e.value;
                                                                                                            router.push(router);
                                                                                                        }}
                                                                                                        isSearchable={true}
                                                                                                        isClearable={false}
                                                                                                        menuPlacement={'top'}
                                                                                                        classNamePrefix={'selectAngga'}
                                                                                                        isDisabled={(months?.length === 0) || false}
                                                                                                    />
                                                                                                </div> */}

                                                                                                {(periode?.id && year && month) && (
                                                                                                    <div className="px-2 flex items-center gap-x-1">
                                                                                                        {(subkegiatan.renstra_status === 'verified' && subkegiatan.renja_status === 'verified' && subkegiatan.apbd_status === 'verified') ? (
                                                                                                            <Tippy content={CurrentUser?.role_id === 6 ? 'Lihat Target' : 'Pagu Anggaran'}>
                                                                                                                <Link
                                                                                                                    target='_blank'
                                                                                                                    href={`/kinerja/target/${subkegiatan.id}?periode=${periode?.id}&year=${year}&month=${month}`}
                                                                                                                    className='btn btn-secondary font-normal'>
                                                                                                                    <span className='truncate w-[80px] md:w-[100px] lg:w-auto'>
                                                                                                                        {CurrentUser?.role_id === 6 ? 'Lihat Target' : 'Pagu Anggaran'}
                                                                                                                    </span>
                                                                                                                    <IconArrowForward className='w-4 h-4 ml-2 flex-none' />
                                                                                                                </Link>
                                                                                                            </Tippy>
                                                                                                        ) : (
                                                                                                            <div className="flex items-center gap-2">
                                                                                                                {subkegiatan.renstra_status !== 'verified' && (
                                                                                                                    <span className="badge bg-danger">
                                                                                                                        Renstra Belum Terverifikasi
                                                                                                                    </span>
                                                                                                                )}
                                                                                                                {subkegiatan.renja_status !== 'verified' && (
                                                                                                                    <span className="badge bg-danger">
                                                                                                                        Renja Belum Terverifikasi
                                                                                                                    </span>
                                                                                                                )}
                                                                                                                {subkegiatan.apbd_status !== 'verified' && (
                                                                                                                    <span className="badge bg-danger">
                                                                                                                        APBD Belum Terverifikasi
                                                                                                                    </span>
                                                                                                                )}
                                                                                                            </div>
                                                                                                        )}

                                                                                                        {subkegiatan.target_status === 'verified' && (
                                                                                                            <Tippy content={CurrentUser?.role_id === 6 ? 'Lihat Realisasi' : 'Input Realisasi'}>
                                                                                                                <Link
                                                                                                                    target='_blank'
                                                                                                                    href={`/realisasi/${subkegiatan.id}?periode=${periode?.id}&year=${year}&month=${month}`}
                                                                                                                    className='btn btn-success font-normal'>
                                                                                                                    <span className='truncate w-[80px] md:w-[100px] lg:w-auto'>
                                                                                                                        {CurrentUser?.role_id === 6 ? 'Lihat Realisasi' : 'Input Realisasi'}
                                                                                                                    </span>
                                                                                                                    <IconArrowForward className='w-4 h-4 ml-2 flex-none' />
                                                                                                                </Link>
                                                                                                            </Tippy>
                                                                                                        )}
                                                                                                    </div>
                                                                                                )}

                                                                                            </div>
                                                                                        </>
                                                                                    )}


                                                                                </div>

                                                                            </div>
                                                                        )}
                                                                    </>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ))}
                    </div>

                    {datas?.length == 0 && (
                        <div className="w-full h-[calc(100vh-300px)] flex flex-col items-center justify-center">
                            <div className="dots-loading text-xl">Memuat Program {instances?.[instance - 1]?.alias ?? '\u00A0'}...</div>
                        </div>
                    )}
                </>
            )}


            {/* <Transition appear show={modalImport} as={Fragment}>
                <Dialog as="div" open={modalImport} onClose={() => setModalImport(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-[80%] md:max-w-[50%] my-8 text-black dark:text-white-dark">

                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <h5 className="font-bold text-lg">
                                            Import Data Rekap Versi 5 dari SIPD
                                        </h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalImport(false)}>
                                            <IconX></IconX>
                                        </button>
                                    </div>

                                    <div className="p-5 pb-10 w-full relative overflow-auto">
                                        {uploadMessages == null && (
                                            <div className="flex flex-col space-y-3">

                                                <div>
                                                    <label className="text-xs font-normal">
                                                        Pilih File Excel
                                                    </label>
                                                    <div className="">
                                                        <input type="file" className="form-input" onChange={(e: any) => setFile(e?.target?.files[0])} accept='.xlsx,.xls' />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {uploadMessages && (
                                            <div className="mt-4">
                                                <div className="text-xs font-semibold">
                                                    Hasil Unggah
                                                </div>
                                                <div className='mb-4 flex items-center gap-x-1'>
                                                    <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 mr-2 text-warning" />
                                                    <span className='font-normal text-lg text-warning'>
                                                        {uploadMessages?.message}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    {uploadMessages?.missing_data?.map((item: any, index: number) => {
                                                        return (
                                                            <div className="border-b py-1 px-2 hover:bg-slate-200">
                                                                <div className="text-sm font-semibold">
                                                                    {item?.kode_sub_kegiatan} - {item?.nama_sub_kegiatan}
                                                                </div>
                                                                <div className="">
                                                                    {item?.nama_instansi}
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {uploadMessages == null && (
                                        <div className="sticky bottom-0 left-0 w-full p-4 bg-white dark:bg-slate-900">
                                            <div className="flex justify-end items-center">

                                                {saveLoading == false ? (
                                                    <>
                                                        <button type="button" className="btn btn-outline-danger" onClick={() => setModalImport(false)}>
                                                            Batalkan
                                                        </button>
                                                        <button type="button" className="btn btn-success ltr:ml-4 rtl:mr-4" onClick={() => uploadFile()}>
                                                            Unggah
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button type="button" className="btn btn-success ltr:ml-4 rtl:mr-4 gap-2">
                                                            <div className="w-4 h-4 border-2 border-transparent border-l-white rounded-full animate-spin"></div>
                                                            Mengunggah...
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition > */}
        </>
    );
};

export default Index;
