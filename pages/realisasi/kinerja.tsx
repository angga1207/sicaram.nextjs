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
import { faCaretDown, faCaretRight, faGlobeAsia, faMinus } from '@fortawesome/free-solid-svg-icons';
import IconPencil from '@/components/Icon/IconPencil';
import IconLaptop from '@/components/Icon/IconLaptop';
import IconX from '@/components/Icon/IconX';

import { fetchPeriodes, fetchSatuans } from '@/apis/fetchdata';
import { fetchInstances, fetchProgramsSubKegiatan } from '@/apis/fetchRealisasi';
import { fetchRangePeriode } from '@/apis/fetchdata';
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
    const [isClient, setIsClient] = useState(false);
    const ref = useRef<any>(null);

    const [CurrentUser, setCurrentUser] = useState<any>([]);
    useEffect(() => {
        if (window) {
            if (localStorage.getItem('user')) {
                setCurrentUser(JSON.parse(localStorage.getItem('user') ?? '{[]}') ?? []);
            }
        }
    }, []);

    const { t, i18n } = useTranslation();


    const [datas, setDatas] = useState([]);
    const [periodes, setPeriodes] = useState([]);
    const [periode, setPeriode] = useState(1);
    const [years, setYears] = useState<any>(null);
    const [year, setYear] = useState<any>(router.query.year ?? new Date().getFullYear());
    const [months, setMonths] = useState<any>([
        { id: 1, name: 'Januari' },
        { id: 2, name: 'Februari' },
        { id: 3, name: 'Maret' },
        { id: 4, name: 'April' },
        { id: 5, name: 'Mei' },
        { id: 6, name: 'Juni' },
        { id: 7, name: 'Juli' },
        { id: 8, name: 'Agustus' },
        { id: 9, name: 'September' },
        { id: 10, name: 'Oktober' },
        { id: 11, name: 'November' },
        { id: 12, name: 'Desember' },
    ]);

    const [month, setMonth] = useState<any>(null);
    const [instance, setInstance] = useState<any>((router.query.instance ?? null) ?? CurrentUser?.instance_id);
    const [instances, setInstances] = useState<any>([]);
    const [searchInstance, setSearchInstance] = useState('');
    const [satuans, setSatuans] = useState<any>([]);
    const [modalRealisasi, setModalRealisasi] = useState(false);
    const [viewType, setViewType] = useState<any>('grid')

    useEffect(() => {
        setInstance((router.query.instance ?? null) ?? CurrentUser?.instance_id);
    }, [CurrentUser, router.query.instance]);

    // useEffect(() => {
    //     if (!router.query.year) {
    //         if (instance) {
    //             // prevent default instance
    //             router.push({
    //                 pathname: '/realisasi/kinerja',
    //                 query: {
    //                     year: new Date().getFullYear(),
    //                     instance: instance,
    //                 },
    //             });
    //         } else {
    //             router.push({
    //                 pathname: '/realisasi/kinerja',
    //                 query: {
    //                     year: new Date().getFullYear(),
    //                 },
    //             });
    //         }
    //     }
    //     setYear(router.query.year ?? new Date().getFullYear());
    // }, [router.query.year]);

    useEffect(() => {
        fetchPeriodes().then((data) => {
            setPeriodes(data.data);
        });
        fetchInstances(searchInstance).then((data) => {
            setInstances(data.data);
        });
        fetchSatuans().then((data) => {
            setSatuans(data.data);
        });
        fetchRangePeriode(periode).then((data) => {
            if (data.status == 'success') {
                setYears(data.data.years);
            }
        });
    }, [CurrentUser, periode]);

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

    const backToInstances = () => {
        setInstance(null);
        setDatas([]);
    }

    useEffect(() => {
        if (instance) {
            fetchProgramsSubKegiatan(instance).then((data) => {
                setDatas(data.data);
            });
        }
    }, [instance]);

    const [showPrograms, setShowPrograms] = useState<string[]>([]);
    const [showKegiatans, setShowKegiatans] = useState<string[]>([]);
    const [showSubKegiatans, setShowSubKegiatans] = useState<string[]>([]);

    const togglePrograms = (id: any) => {
        if (showPrograms.includes(id)) {
            setShowPrograms((value) => value.filter((d) => d !== id));
        } else {
            setShowPrograms([...showPrograms, id]);
        }
    }

    const toggleKegiatans = (id: any) => {
        if (showKegiatans.includes(id)) {
            setShowKegiatans((value) => value.filter((d) => d !== id));
        } else {
            setShowKegiatans([...showKegiatans, id]);
        }
    }

    const toggleSubKegiatans = (id: any) => {
        if (showSubKegiatans.includes(id)) {
            setShowSubKegiatans((value) => value.filter((d) => d !== id));
        } else {
            setShowSubKegiatans([...showSubKegiatans, id]);
        }
    }

    // click outside container to collapse all
    useEffect(() => {
        const handleOutSideClick = (event: any) => {
            if (!ref.current?.contains(event.target)) {
                setShowPrograms([]);
                setShowKegiatans([]);
                setShowSubKegiatans([]);
            }
        };
        window.addEventListener("mousedown", handleOutSideClick);
        return () => {
            window.removeEventListener("mousedown", handleOutSideClick);
        };
    }, [ref]);

    return (
        <>

            <div className="">
                <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5">
                    <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                        Realisasi Kinerja <br />
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
                                        <button type="button" className="btn btn-secondary whitespace-nowrap" onClick={(e) => {
                                            e.preventDefault();
                                            backToInstances();
                                        }} >
                                            <IconArrowBackward className="w-4 h-4" />
                                            <span className="ltr:ml-2 rtl:mr-2">
                                                Kembali
                                            </span>
                                        </button>
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
                                <th className="!text-center bg-dark text-white border !w-[200px]">
                                    Sosial Media
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
                                            <ul className="flex space-x-2 rtl:space-x-reverse items-center justify-center h-5">
                                                {data?.website && (
                                                    <li>
                                                        <Tippy content={"Website"} >
                                                            <a href={data?.website} target='_blank' className="btn btn-outline-dark p-0 h-5 w-5 rounded-full">
                                                                <FontAwesomeIcon icon={faGlobeAsia} className="w-2.5 h-2.5" />
                                                            </a>
                                                        </Tippy>
                                                    </li>
                                                )}
                                                {data?.facebook && (
                                                    <li>
                                                        <Tippy content={"Facebook"} >
                                                            <a href={data?.facebook} target='_blank' className="btn btn-outline-primary p-0 h-5 w-5 rounded-full">
                                                                <FontAwesomeIcon icon={faFacebookF} className="w-2.5 h-2.5" />
                                                            </a>
                                                        </Tippy>
                                                    </li>
                                                )}
                                                {data?.instagram && (
                                                    <li>
                                                        <Tippy content={"Instagram"} >
                                                            <a href={data?.instagram} target='_blank' className="btn btn-outline-secondary p-0 h-5 w-5 rounded-full">
                                                                <FontAwesomeIcon icon={faInstagram} className="w-2.5 h-2.5" />
                                                            </a>
                                                        </Tippy>
                                                    </li>
                                                )}
                                                {data?.youtube && (
                                                    <li>
                                                        <Tippy content={"Youtube"} >
                                                            <a href={data?.youtube} target='_blank' className="btn btn-outline-danger p-0 h-5 w-5 rounded-full">
                                                                <FontAwesomeIcon icon={faYoutube} className="w-2.5 h-2.5" />
                                                            </a>
                                                        </Tippy>
                                                    </li>
                                                )}
                                            </ul>
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
                <div className="space-y-2" ref={ref}>
                    {datas?.map((program: any, index: number) => {
                        return (
                            <div
                                className={showPrograms.includes(program?.id)
                                    ? 'pb-3'
                                    : ''}>
                                <div
                                    onClick={(e) => {
                                        e.preventDefault();
                                        togglePrograms(program.id);
                                    }}
                                    className={showPrograms.includes(program?.id)
                                        ? 'panel cursor-pointer bg-blue-100 dark:bg-blue-900 mb-2 font-semibold'
                                        : 'panel cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600'}>
                                    <div className="flex gap-x-4">
                                        <div className="w-[70px] text-right">
                                            {program?.fullcode}
                                        </div>
                                        <div className="grow">
                                            {program?.name}
                                        </div>
                                        <div className="flex-none w-[30px]">
                                            <IconCaretDown className={showPrograms.includes(program?.id)
                                                ? 'w-4 h-4 transform rotate-0 transition duration-500'
                                                : 'w-4 h-4 transform rotate-180 transition duration-500'} />
                                        </div>
                                    </div>
                                </div>

                                {showPrograms.includes(program?.id) && (
                                    <div className="space-y-2">
                                        {program?.kegiatans?.map((kegiatan: any, index: number) => {
                                            return (
                                                <div
                                                    className='ml-5'>
                                                    <div
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            toggleKegiatans(kegiatan.id);
                                                        }}
                                                        className={showKegiatans.includes(kegiatan?.id)
                                                            ? 'panel cursor-pointer bg-blue-100 dark:bg-blue-900 mb-2 font-semibold'
                                                            : 'panel cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600'}>
                                                        <div className="flex gap-x-4">
                                                            <div className="w-[90px] text-right">
                                                                {kegiatan?.fullcode}
                                                            </div>
                                                            <div className="">
                                                                {kegiatan?.name}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {showKegiatans.includes(kegiatan?.id) && (
                                                        <div className="space-y-2">
                                                            {kegiatan?.sub_kegiatans?.map((subkegiatan: any, index: number) => {
                                                                return (
                                                                    <div
                                                                        className='ml-5'>
                                                                        <div
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                toggleSubKegiatans(subkegiatan.id);
                                                                            }}
                                                                            className={showSubKegiatans.includes(subkegiatan?.id)
                                                                                ? 'panel cursor-pointer bg-blue-100 dark:bg-blue-900 font-semibold  rounded-b-none'
                                                                                : 'panel cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600'}>
                                                                            <div
                                                                                className="flex gap-x-4">
                                                                                <div className="w-[90px] text-right">
                                                                                    {subkegiatan?.fullcode}
                                                                                </div>
                                                                                <div className="">
                                                                                    {subkegiatan?.name}
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {showSubKegiatans.includes(subkegiatan?.id) && (
                                                                            <div className="mt-0 mb-5 panel p-3 pt-1 bg-blue-100 dark:bg-blue-900 rounded-t-none">
                                                                                <div className="">
                                                                                    <div className="text-xs font-normal mb-1">
                                                                                        Input Realisasi
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex items-center justify-start divide-x divide-indigo-500 overflow-x-auto pb-3 lg:pb-0">
                                                                                    <select
                                                                                        value={year}
                                                                                        onChange={(e) => {
                                                                                            e.preventDefault();
                                                                                            setYear(e.target.value);
                                                                                        }}
                                                                                        className='form-select w-[130px] border-indigo-400 bg-transparent font-normal mr-2'>
                                                                                        {years?.map((yr: any, index: number) => {
                                                                                            return (
                                                                                                <option key={index} value={yr}>
                                                                                                    {yr}
                                                                                                </option>
                                                                                            )
                                                                                        })}
                                                                                    </select>

                                                                                    <div className="px-2">
                                                                                        <select
                                                                                            className='form-select rw-[130px] border-indigo-400 bg-transparent font-normal mr-2'
                                                                                            onChange={(e) => {
                                                                                                setMonth(e.target.value);
                                                                                            }}
                                                                                            value={month}>
                                                                                            <option value="" >Pilih Bulan</option>
                                                                                            {months?.map((item: any, index: number) => {
                                                                                                return (
                                                                                                    <option key={index} value={item?.id}>
                                                                                                        {item?.name}
                                                                                                    </option>
                                                                                                )
                                                                                            })}
                                                                                        </select>
                                                                                    </div>
                                                                                    {(periode && year && month) && (
                                                                                        <div className="px-2 flex items-center gap-x-1">
                                                                                            {/* <Link
                                                                                                target='_blank'
                                                                                                href="#"
                                                                                                className='btn btn-secondary font-normal'>
                                                                                                Input DPA
                                                                                                <IconArrowForward className='w-4 h-4 ml-2' />
                                                                                            </Link> */}
                                                                                            {/* <Link
                                                                                                target='_blank'
                                                                                                href={`/realisasi/kontrak/${subkegiatan.id}?periode=${periode}&year=${year}&month=${month}`}
                                                                                                className='btn btn-warning font-normal'>
                                                                                                Input Kontrak
                                                                                                <IconArrowForward className='w-4 h-4 ml-2' />
                                                                                            </Link> */}
                                                                                            <Link
                                                                                                target='_blank'
                                                                                                href={`/realisasi/anggaran/${subkegiatan.id}?periode=${periode}&year=${year}&month=${month}`}
                                                                                                className='btn btn-success font-normal'>
                                                                                                Input Realisasi Anggaran
                                                                                                <IconArrowForward className='w-4 h-4 ml-2' />
                                                                                            </Link>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                        }
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    )
                                                    }

                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                                }
                            </div>
                        )
                    })}

                    {datas?.length == 0 && (
                        <div className="w-full h-[calc(100vh-300px)] flex flex-col items-center justify-center">
                            <div className="dots-loading text-xl">Memuat Program {instances?.[instance - 1]?.alias ?? '\u00A0'}...</div>
                        </div>
                    )}
                </div >
            )}
        </>
    );
};

export default Index;
