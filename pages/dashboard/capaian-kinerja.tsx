import { IRootState } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/themeConfigSlice';
import { faAngleDoubleRight, faCartArrowDown, faExclamationTriangle, faThumbsUp, faToolbox } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from '@/components/Dropdown';
import IconHorizontalDots from '@/components/Icon/IconHorizontalDots';
import IconCashBanknotes from '@/components/Icon/IconCashBanknotes';
import IconBolt from '@/components/Icon/IconBolt';
import IconBox from '@/components/Icon/IconBox';
import IconPlus from '@/components/Icon/IconPlus';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React from "react";
// import CountUp from 'react-countup';
import { Player, Controls } from '@lottiefiles/react-lottie-player';

import { chartRealisasi, summaryRealisasi, getRankInstance, chartKinerja, summaryKinerja } from '@/apis/fetchdashboard';
import Link from 'next/link';
import LoadingSicaram from '@/components/LoadingSicaram';


const Index = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    useEffect(() => {
        dispatch(setPageTitle('Capaian Kinerja'));
    });
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    });

    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null)
    const [view, setView] = useState<number>(1);

    const [KinerjaSeries, setKinerjaSeries] = useState<any>([]);
    const [KinerjaSummary, setKinerjaSummary] = useState<any>([]);
    const [RankInstances, setRankInstances] = useState<any>([]);


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


    if (CurrentUser?.role_id === 9) {
        router.push('/dashboard');
    }

    useEffect(() => {
        setKinerjaSeries([]);
        if (isMounted && periode?.id && year) {
            chartKinerja(periode?.id, year, view).then((data) => {
                if (data.status === 'success') {
                    setKinerjaSeries(data.data);
                }
            });
        }
    }, [view, isMounted, periode?.id, year]);

    useEffect(() => {
        if (isMounted && periode?.id && year) {
            summaryKinerja(periode?.id, year, view).then((data) => {
                if (data.status === 'success') {
                    setKinerjaSummary(data.data);
                }
            });
            getRankInstance(periode?.id, year, 'kinerja').then((data) => {
                if (data.status === 'success') {
                    setRankInstances(data.data);
                }
            });
        }
    }, [isMounted, periode?.id, year]);


    // Kinerja Chart
    const apexChartKinerja: any = {
        series: [
            {
                name: 'Capaian',
                data: KinerjaSeries?.realisasi?.map((item: any) => item.realisasi),
            },
        ],
        options: {
            chart: {
                height: 350,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 0,
            },
            colors: ['#000080'], // target, capaian
            xaxis: {
                labels: {
                    show: true,
                },
                // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
                categories: KinerjaSeries?.realisasi?.map((item: any) => item.month_name) ?? [],
            },
            yaxis: {
                show: true,
                labels: {
                    show: true,
                    formatter: (value: number) => {
                        return new Intl.NumberFormat('id-ID').format(value ?? 0) + ' %';
                    },
                },
                max: KinerjaSeries?.realisasi?.reduce((prev: any, current: any) => (prev.realisasi > current.realisasi) ? prev : current).realisasi == 0
                    ? 100
                    : KinerjaSeries?.realisasi?.reduce((prev: any, current: any) => (prev.realisasi > current.realisasi) ? prev : current).realisasi,
            },
            fill: {
                // opacity: 1,
                type: 'gradient',
                gradient: {
                    shade: 'light',
                    type: "vertical",
                    shadeIntensity: 0.5,
                    gradientToColors: undefined,
                    inverseColors: true,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 50, 100],
                    colorStops: []
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '90%',
                    borderRadius: 5,
                    borderRadiusApplication: 'around',
                    borderRadiusWhenStacked: 'last',
                },
            },
            legend: {
                show: false,
            },
            grid: {
                show: false,
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
        },
    };

    return (
        <>
            <div className="space-y-10">

                <div className="grid grid-cols-10 gap-4">
                    <div className="col-span-10 lg:col-span-7 relative panel">
                        <div className="flex items-center justify-between flex-col md:flex-row gap-y-2">
                            <h5 className="text-lg font-semibold">
                                Capaian Kinerja Kabupaten Ogan Ilir
                            </h5>
                            <div className="flex items-center gap-x-1 overflow-x-auto w-full sm:w-auto sm:overflow-hidden">
                                <div className="relative group">
                                    <div
                                        className={view === 1 ? `absolute transitiona-all duration-1000 bg-gradient-to-r from-[#44BCFF] via-[#445aff] to-[#965eff] rounded-xl blur-lg opacity-100 -inset-[1px] duration-400 animate-tilt` : `absolute transitiona-all duration-1000 opacity-0 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#445aff] to-[#965eff] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-[1px] group-hover:duration-400 animate-tilt`}>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            setView(1);
                                        }}
                                        type="button"
                                        className={view === 1 ? `relative inline-flex items-center justify-center px-2 py-2 text-xs text-white transition-all font-semibold duration-200 bg-slate-800 font-pj rounded-xl w-[80px] ` : `relative inline-flex items-center justify-center px-2 py-2 text-xs text-white transition-all duration-200 bg-slate-800 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 w-[80px]`}>
                                        Tahun Ini
                                    </button>
                                </div>
                                <div className="relative group">
                                    <div
                                        className={view === 2 ? `absolute transitiona-all duration-1000 bg-gradient-to-r from-[#44BCFF] via-[#445aff] to-[#965eff] rounded-xl blur-lg opacity-100 -inset-[1px] duration-400 animate-tilt` : `absolute transitiona-all duration-1000 opacity-0 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#445aff] to-[#965eff] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-[1px] group-hover:duration-400 animate-tilt`}>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            setView(2);
                                        }}
                                        type="button"
                                        className={view === 2 ? `relative inline-flex items-center justify-center px-2 py-2 text-xs text-white transition-all font-semibold duration-200 bg-slate-800 font-pj rounded-xl w-[80px] ` : `relative inline-flex items-center justify-center px-2 py-2 text-xs text-white transition-all duration-200 bg-slate-800 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 w-[80px]`}>
                                        TW I
                                    </button>
                                </div>
                                <div className="relative group">
                                    <div
                                        className={view === 3 ? `absolute transitiona-all duration-1000 bg-gradient-to-r from-[#44BCFF] via-[#445aff] to-[#965eff] rounded-xl blur-lg opacity-100 -inset-[1px] duration-400 animate-tilt` : `absolute transitiona-all duration-1000 opacity-0 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#445aff] to-[#965eff] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-[1px] group-hover:duration-400 animate-tilt`}>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            setView(3);
                                        }}
                                        type="button"
                                        className={view === 3 ? `relative inline-flex items-center justify-center px-2 py-2 text-xs text-white transition-all font-semibold duration-200 bg-slate-800 font-pj rounded-xl w-[80px] ` : `relative inline-flex items-center justify-center px-2 py-2 text-xs text-white transition-all duration-200 bg-slate-800 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 w-[80px]`}>
                                        TW II
                                    </button>
                                </div>
                                <div className="relative group">
                                    <div
                                        className={view === 4 ? `absolute transitiona-all duration-1000 bg-gradient-to-r from-[#44BCFF] via-[#445aff] to-[#965eff] rounded-xl blur-lg opacity-100 -inset-[1px] duration-400 animate-tilt` : `absolute transitiona-all duration-1000 opacity-0 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#445aff] to-[#965eff] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-[1px] group-hover:duration-400 animate-tilt`}>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            setView(4);
                                        }}
                                        type="button"
                                        className={view === 4 ? `relative inline-flex items-center justify-center px-2 py-2 text-xs text-white transition-all font-semibold duration-200 bg-slate-800 font-pj rounded-xl w-[80px] ` : `relative inline-flex items-center justify-center px-2 py-2 text-xs text-white transition-all duration-200 bg-slate-800 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 w-[80px]`}>
                                        TW III
                                    </button>
                                </div>
                                <div className="relative group">
                                    <div
                                        className={view === 5 ? `absolute transitiona-all duration-1000 bg-gradient-to-r from-[#44BCFF] via-[#445aff] to-[#965eff] rounded-xl blur-lg opacity-100 -inset-[1px] duration-400 animate-tilt` : `absolute transitiona-all duration-1000 opacity-0 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#445aff] to-[#965eff] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-[1px] group-hover:duration-400 animate-tilt`}>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            setView(5);
                                        }}
                                        type="button"
                                        className={view === 5 ? `relative inline-flex items-center justify-center px-2 py-2 text-xs text-white transition-all font-semibold duration-200 bg-slate-800 font-pj rounded-xl w-[80px] ` : `relative inline-flex items-center justify-center px-2 py-2 text-xs text-white transition-all duration-200 bg-slate-800 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 w-[80px]`}>
                                        TW IV
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-lg bg-white dark:bg-black relative w-full overflow-x-auto">
                            {isMounted && KinerjaSeries?.length !== 0 ? (
                                <div className="min-w-[800px] md:min-w-full max-w-full">
                                    <ReactApexChart series={apexChartKinerja.series} options={apexChartKinerja.options} type="bar" height={550} width={'100%'} />
                                </div>
                            ) : (
                                <div className="flex flex-col gap-10 min-h-[550px] items-center justify-center">
                                    <LoadingSicaram></LoadingSicaram>
                                    <div className="dots-loading text-xl">Memuat Data...</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-span-10 lg:col-span-3 relative panel h-full">
                        <div className="mb-5 flex items-center justify-between dark:text-white-light">
                            <h5 className="">
                                <div className="text-base font-semibold">
                                    Capaian Kinerja
                                </div>
                                <span className='font-normal text-xs'>
                                    Per 1 Januari hingga Saat Ini
                                </span>
                            </h5>
                        </div>
                        <div>
                            <div className="space-y-6">

                                <div className="flex">
                                    <span className="grid h-9 w-9 shrink-0 place-content-center rounded-md bg-primary-light text-primary dark:bg-primary dark:text-primary-light">
                                        <IconBolt />
                                    </span>
                                    <div className="flex-1 px-3">
                                        <div>
                                            Target
                                        </div>
                                        <div className="text-xs text-white-dark dark:text-gray-500">
                                            {KinerjaSummary?.target?.updated_at ? (
                                                <>
                                                    {new Date(KinerjaSummary?.target?.updated_at).toLocaleString('id-ID', {
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </>
                                            ) : (
                                                <>
                                                    -
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <span className="whitespace-pre px-1 text-base text-primary ltr:ml-auto rtl:mr-auto">
                                        {KinerjaSummary?.target ? (
                                            <>
                                                {new Intl.NumberFormat('id-ID').format(KinerjaSummary?.target)} %
                                            </>
                                        ) : (
                                            <>
                                                <div className="dots-loading text-sm">...</div>
                                            </>
                                        )}
                                    </span>
                                </div>

                                <div className="flex">
                                    <span className="grid h-9 w-9 shrink-0 place-content-center rounded-md bg-success-light text-success dark:bg-success dark:text-success-light">
                                        <FontAwesomeIcon icon={faToolbox} className="w-4 h-4" />
                                    </span>
                                    <div className="flex-1 px-3">
                                        <div>
                                            Realisasi
                                        </div>
                                        <div className="text-xs text-white-dark dark:text-gray-500">
                                            {KinerjaSummary?.realisasi?.updated_at ? (
                                                <>
                                                    {new Date(KinerjaSummary?.realisasi?.updated_at).toLocaleString('id-ID', {
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </>
                                            ) : (
                                                <>
                                                    -
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <span className="whitespace-pre px-1 text-base text-success ltr:ml-auto rtl:mr-auto">
                                        {KinerjaSummary?.realisasi ? (
                                            <>
                                                {new Intl.NumberFormat('id-ID').format(KinerjaSummary?.realisasi)} %
                                            </>
                                        ) : (
                                            <>
                                                <div className="dots-loading text-sm">...</div>
                                            </>
                                        )}
                                    </span>
                                </div>

                                <div className="flex items-center justify-center">
                                    <Player
                                        autoplay
                                        loop
                                        src="/lottie/animation-1.json"
                                        style={{ height: '250px', width: '300px' }}
                                    >
                                    </Player>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-10 gap-4">
                    <div className="col-span-10 mb-0 text-center font-bold text-xl">
                        Capaian Kinerja
                        <br />
                        Perangkat Daerah Kabupaten Ogan Ilir
                    </div>
                    <div className="col-span-10 lg:col-span-4 relative h-full">
                        <div className="panel h-full overflow-hidden border-0 p-0">
                            <div className="min-h-[280px] bg-gradient-to-r from-[#49ee43] to-[#206b0f] p-6">
                                <div className="flex gap-x-2 items-center justify-between text-white">
                                    <div className="flex-none relative bg-white rounded-full w-32 h-32 shadow">
                                        <div className="absolute top-0 left-0 w-32 h-32 rounded-full animate-blinkingBg"></div>
                                        {RankInstances?.length !== 0 ? (
                                            <img src={RankInstances[0]?.instance_logo} alt='award' className='w-32 h-32 object-contain rounded-full p-1 relative z-10 shadow-xl' />
                                        ) : (
                                            <div className="animate-pulse w-32 h-32 bg-slate-200 rounded-full"></div>
                                        )}
                                    </div>
                                    <div className="text-xl font-semibold line-clamp-4 cursor-pointer">
                                        <div className="text-md">
                                            {RankInstances?.length !== 0 ? (
                                                <>
                                                    {RankInstances[0]?.instance_code}
                                                </>
                                            ) : (
                                                <div className="animate-pulse w-full h-[25px] bg-slate-200 rounded"></div>
                                            )}
                                        </div>
                                        {RankInstances?.length !== 0 ? (
                                            <>
                                                {RankInstances[0]?.instance_name}
                                                {RankInstances[0]?.instance_alias ? ` (${RankInstances[0]?.instance_alias})` : ''}
                                            </>
                                        ) : (
                                            <div className="animate-pulse w-full h-[25px] bg-slate-200 rounded"></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="-mt-12 px-8">
                                <div className="rounded-md bg-white px-4 py-2.5 shadow dark:bg-[#060818]">
                                    <p className="mb-4 text-center dark:text-white">
                                        Capaian Kinerja
                                    </p>
                                    <div className="btn w-full  border-0 bg-[#ebedf2] py-1 text-base text-[#515365] shadow-none dark:bg-black dark:text-[#bfc9d4]">
                                        {(RankInstances[0]?.persentase_realisasi_kinerja ?? 0).toFixed(2)} %
                                    </div>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="mb-5">
                                    <span className="rounded-full bg-[#1b2e4b] px-4 py-1.5 text-xs text-white before:inline-block before:h-1.5 before:w-1.5 before:rounded-full before:bg-white ltr:before:mr-2 rtl:before:ml-2">
                                        Rincian
                                    </span>
                                </div>
                                <div className="mb-5 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-[#515365]">
                                            Target
                                        </p>
                                        <p className="text-base">
                                            <span className="font-semibold">
                                                {new Intl.NumberFormat('id-ID').format(RankInstances[0]?.target_kinerja)}
                                            </span>
                                            <span> %</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-[#515365]">
                                            Realisasi
                                        </p>
                                        <p className="text-base">
                                            <span className="font-semibold">
                                                {new Intl.NumberFormat('id-ID').format(RankInstances[0]?.realisasi_kinerja)}
                                            </span>
                                            <span> %</span>
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-center gap-4 pt-4">
                                        {RankInstances?.length !== 0 && (
                                            <>
                                                <div className="font-semibold text-md">
                                                    ({RankInstances[0]?.instance_programs_count})
                                                    <span className='text-sm ml-1'>
                                                        Program
                                                    </span>
                                                </div>
                                                <div className="font-semibold text-md">
                                                    ({RankInstances[0]?.instance_kegiatans_count})
                                                    <span className='text-sm ml-1'>
                                                        Kegiatan
                                                    </span>
                                                </div>
                                                <div className="font-semibold text-md">
                                                    ({RankInstances[0]?.instance_sub_kegiatans_count})
                                                    <span className='text-sm ml-1'>
                                                        Sub Kegiatan
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-around px-2 text-center">
                                    {RankInstances?.length !== 0 && (
                                        <>
                                            <Link href={`/dashboard/pd/${RankInstances[0]?.instance_alias}`} className="btn btn-outline-success ltr:mr-2 rtl:ml-2">
                                                Lihat Detail
                                            </Link>
                                            <button type="button" className="btn btn-success hidden">
                                                Beri Pujian
                                                <FontAwesomeIcon icon={faThumbsUp} className="w-4 h-4 ml-1" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-10 lg:col-span-6">

                        <div className='space-y-2 h-full lg:h-[calc(100vh-200px)] overflow-x-auto'>
                            {RankInstances?.length === 0 && (
                                <div className='panel h-full shadow-xl'>
                                    <LoadingSicaram></LoadingSicaram>
                                </div>
                            )}
                            {RankInstances.map((item: any, index: number) => (
                                <div
                                    key={`rank-` + index}
                                    onClick={(e) => {
                                        router.push(`/dashboard/pd/${item.instance_alias}`);
                                    }}
                                    className='bg-white dark:bg-[#192A3A] w-full items-center p-4 hover:bg-blue-200 hover:animate-blinkingBg dark:hover:bg-blue-900 rounded shadow cursor-pointer group'
                                >
                                    <div className="px-4 flex items-center justify-between">
                                        <div className="w-full">
                                            <div className="flex items-baseline font-semibold">
                                                <div className="text-xl mr-2">
                                                    <span className='text-xs'>#</span>{item.rank}.
                                                </div>
                                                <div className="text-md uppercase">{item.instance_name}</div>
                                            </div>
                                            <div className='mt-2 pt-2 flex items-center border-t'>

                                                <div className='w-full text-center'>
                                                    <div className="font-semibold">
                                                        Capaian Kinerja
                                                    </div>
                                                    <div className="flex gap-4 justify-center items-center">
                                                        <Tippy content="Capaian Kinerja" theme='primary'>
                                                            <div className="relative w-40 h-40 cursor-pointer">
                                                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                                                    <circle
                                                                        className="text-gray-200 stroke-current"
                                                                        stroke-width="20"
                                                                        cx="50"
                                                                        cy="50"
                                                                        r="40"
                                                                        fill="transparent"
                                                                    ></circle>
                                                                    <circle
                                                                        className="text-primary  progress-ring__circle stroke-current animate-pulse"
                                                                        stroke-width="20"
                                                                        // stroke-linecap="round"
                                                                        cx="50"
                                                                        cy="50"
                                                                        r="40"
                                                                        fill="transparent"
                                                                        stroke-dasharray="251.2"
                                                                        stroke-dashoffset={`calc(251.2 - (251.2 * ${item.persentase_realisasi_kinerja ?? 0}) / 100)`}
                                                                    ></circle>

                                                                    <text x="50" y="50" font-family="Verdana" font-size="12" text-anchor="middle" alignment-baseline="middle" className="">
                                                                        {item.persentase_realisasi_kinerja.toFixed(2)}%
                                                                    </text>

                                                                </svg>
                                                            </div>
                                                        </Tippy>
                                                    </div>
                                                    <div className="flex items-center justify-center flex-wrap gap-4 mt-3">
                                                        <div className="font-semibold">
                                                            ({item?.instance_programs_count})
                                                            <span className='text-xs ml-1'>
                                                                Program
                                                            </span>
                                                        </div>
                                                        <div className="font-semibold">
                                                            ({item?.instance_kegiatans_count})
                                                            <span className='text-xs ml-1'>
                                                                Kegiatan
                                                            </span>
                                                        </div>
                                                        <div className="font-semibold">
                                                            ({item?.instance_sub_kegiatans_count})
                                                            <span className='text-xs ml-1'>
                                                                Sub Kegiatan
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="w-32 hidden md:block">
                                            <div className="w-32 h-32 relative rounded-full">
                                                <img src={item.instance_logo} alt={item.instance_name} className='w-full h-full p-1 rounded-full object-contain' />
                                            </div>
                                            <div className="mt-4 text-[10px] flex items-center justify-center text-lime-700 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                <FontAwesomeIcon icon={faAngleDoubleRight} className="w-2 h-2 mr-1" />
                                                <div className="whitespace-nowrap">
                                                    Klik untuk Melihat Detail
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

            </div>


            <div className="fixed bottom-[110px] z-50 ltr:right-[10px] rtl:left-[10px]">
                <button
                    onClick={(e) => {
                        router.back();
                    }}
                    type="button"
                    className="btn btn-outline-warning animate-pulse rounded-full bg-[#fafafa] p-2 dark:bg-[#060818] dark:hover:bg-warning -rotate-90">
                    <svg width="24" height="24" className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            opacity="0.5"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 20.75C12.4142 20.75 12.75 20.4142 12.75 20L12.75 10.75L11.25 10.75L11.25 20C11.25 20.4142 11.5858 20.75 12 20.75Z"
                            fill="currentColor"
                        ></path>
                        <path
                            d="M6.00002 10.75C5.69667 10.75 5.4232 10.5673 5.30711 10.287C5.19103 10.0068 5.25519 9.68417 5.46969 9.46967L11.4697 3.46967C11.6103 3.32902 11.8011 3.25 12 3.25C12.1989 3.25 12.3897 3.32902 12.5304 3.46967L18.5304 9.46967C18.7449 9.68417 18.809 10.0068 18.6929 10.287C18.5768 10.5673 18.3034 10.75 18 10.75L6.00002 10.75Z"
                            fill="currentColor"
                        ></path>
                    </svg>
                </button>
            </div>

        </>
    );
};

export default Index;
