import { IRootState } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/themeConfigSlice';
import { faAngleDoubleRight, faCartArrowDown, faExclamationTriangle, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
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

import { chartRealisasi, summaryRealisasi, getRankInstance } from '@/apis/fetchdashboard';
import Link from 'next/link';
import LoadingSicaram from '@/components/LoadingSicaram';

const Index = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    useEffect(() => {
        dispatch(setPageTitle('Capaian Keuangan'));
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

    const [AnggaranSeries, setAnggaranSeries] = useState<any>([]);
    const [AnggaranSummary, setAnggaranSummary] = useState<any>([]);
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
                setYear(currentYear);
            } else {
                setYear(periode?.start_year)
            }
        }
    }, [isMounted, periode?.id])

    if (CurrentUser?.role_id === 9) {
        router.push('/dashboard');
    }


    useEffect(() => {
        setAnggaranSeries([]);
        if (isMounted && periode?.id && year) {
            chartRealisasi(periode?.id, year, view).then((data) => {
                if (data.status === 'success') {
                    setAnggaranSeries(data.data);
                    const target = Math.max(...data.data?.target?.map((item: any) => item.target));
                    const realisasi = Math.max(...data.data?.realisasi?.map((item: any) => item.realisasi));
                    const percent = target > 0 ? ((realisasi / target) * 100).toFixed(2) : 0;
                    setAnggaranSummary({
                        'target': target,
                        'realisasi': realisasi,
                        'percent': percent,
                    });
                }
            });
        }
    }, [view, periode?.id, year, isMounted]);

    useEffect(() => {
        if (isMounted && periode?.id && year) {
            getRankInstance(periode?.id, year, 'keuangan').then((data) => {
                if (data.status === 'success') {
                    setRankInstances(data.data);
                }
            });
        }
    }, [isMounted, periode?.id, year]);

    // Anggaran Chart
    const chartAnggaran: any = {
        series: [
            {
                name: 'Target Anggaran',
                // data: [168000, 268000, 327000, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                data: AnggaranSeries?.target?.map((item: any) => item.target),
            },
            {
                name: 'Realisasi Anggaran',
                // data: [165000, 225000, 268000, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                data: AnggaranSeries?.realisasi?.map((item: any) => item.realisasi),
            },
        ],
        options: {
            chart: {
                height: 350,
                type: 'area',
                fontFamily: 'Popins, sans-serif',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },

            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                curve: 'smooth',
                width: 2,
                lineCap: 'square',
            },
            dropShadow: {
                enabled: true,
                opacity: 0.2,
                blur: 10,
                left: -7,
                top: 22,
            },
            colors: isDark ? ['cyan', 'green'] : ['blue', 'green'],
            markers: {
                discrete: [
                    {
                        seriesIndex: 0,
                        dataPointIndex: new Date().getMonth(),
                        fillColor: 'blue',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                    {
                        seriesIndex: 1,
                        dataPointIndex: new Date().getMonth(),
                        fillColor: 'green',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                ],
            },
            // labels: AnggaranSeries?.target?.map((item: any) => item.month_short),
            labels: AnggaranSeries?.target?.map((item: any) => item.month_name),
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    show: true,
                },
                labels: {
                    offsetX: isRtl ? 2 : 0,
                    offsetY: 5,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-xaxis-title',
                    },
                },
            },
            yaxis: {
                // show: false,
                tickAmount: 7,
                labels: {
                    formatter: (value: number) => {
                        // return value / 1000000 + 'Jt';
                        // return 'Rp. ' + new Intl.NumberFormat('id-ID').format(value);

                        // return jt / m / t
                        if (value >= 1000000000000) {
                            return 'Rp. ' + new Intl.NumberFormat('id-ID').format(value / 1000000000000) + ' T';
                        } else if (value >= 1000000000) {
                            return 'Rp. ' + new Intl.NumberFormat('id-ID').format(value / 1000000000) + ' M';
                        } else if (value >= 1000000) {
                            return 'Rp. ' + new Intl.NumberFormat('id-ID').format(value / 1000000) + ' Jt';
                        } else {
                            return 'Rp. ' + new Intl.NumberFormat('id-ID').format(value);
                        }
                    },
                    offsetX: isRtl ? -30 : -10,
                    // offsetX: isRtl ? 0 : 0,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-yaxis-title',
                    },
                },
                opposite: isRtl ? true : false,
            },
            grid: {
                borderColor: isDark ? '#191E3A' : '#E0E6ED',
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
                yaxis: {
                    lines: {
                        show: true,
                    },
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '12px',
                markers: {
                    width: 10,
                    height: 10,
                    // offsetX: -2,
                    offsetX: 0,
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 5,
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                x: {
                    show: false,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: isDark ? 0.19 : 0.28,
                    opacityTo: 0.05,
                    stops: isDark ? [100, 100] : [45, 100],
                },
            },
        },
    };


    return (
        <>
            <div className="space-y-10">

                <div className="grid grid-cols-10 gap-4">
                    <div className="col-span-10 lg:col-span-7 relative panel">
                        <div className="flex flex-col md:flex-row gap-y-3 items-center justify-between">
                            <h5 className="text-lg font-semibold">
                                Capaian Keuangan Kabupaten Ogan Ilir
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
                            {isMounted && AnggaranSeries?.length !== 0 ? (
                                <div className="min-w-[800px] md:min-w-full max-w-full">
                                    <ReactApexChart
                                        clasName=""
                                        series={chartAnggaran.series}
                                        options={chartAnggaran.options}
                                        type="area"
                                        height={550}
                                        width={'100%'}
                                    />
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
                                    Capaian Keuangan
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
                                            Anggaran
                                        </div>
                                        <div className="text-xs text-white-dark dark:text-gray-500">
                                            {AnggaranSummary?.target?.updated_at ? (
                                                <>
                                                    {new Date(AnggaranSummary?.target?.updated_at).toLocaleString('id-ID', {
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
                                        {AnggaranSummary?.target ? (
                                            <>
                                                Rp. {new Intl.NumberFormat('id-ID').format(AnggaranSummary?.target)}
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
                                        <IconCashBanknotes />
                                    </span>
                                    <div className="flex-1 px-3">
                                        <div>
                                            Realisasi
                                        </div>
                                        <div className="text-xs text-white-dark dark:text-gray-500">
                                            {AnggaranSummary?.realisasi?.updated_at ? (
                                                <>
                                                    {new Date(AnggaranSummary?.realisasi?.updated_at).toLocaleString('id-ID', {
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
                                        {AnggaranSummary?.realisasi ? (
                                            <>
                                                Rp. {new Intl.NumberFormat('id-ID').format(AnggaranSummary?.realisasi)}
                                            </>
                                        ) : (
                                            <>
                                                <div className="dots-loading text-sm">...</div>
                                            </>
                                        )}
                                    </span>
                                </div>

                                <div className="flex items-center border-t pt-5">
                                    <span className="grid h-9 w-9 shrink-0 place-content-center rounded-md bg-warning-light text-warning dark:bg-warning dark:text-warning-light">
                                        <IconBox />
                                    </span>
                                    <div className="flex-1 px-3">
                                        Capaian Realisasi
                                    </div>
                                    <span className="whitespace-pre px-1 text-base text-slate-800 dark:text-white font-semibold ltr:ml-auto rtl:mr-auto">
                                        {AnggaranSummary?.percent ? (
                                            <>
                                                {AnggaranSummary.percent} %
                                            </>
                                        ) : (
                                            <>
                                                <div className="dots-loading text-sm">..</div>
                                            </>
                                        )}
                                    </span>
                                </div>

                                <div className="flex items-center justify-center">
                                    <Player
                                        autoplay
                                        loop
                                        // src="https://lottie.host/c11c5760-37c1-47b2-b155-16e647ea6f00/mzk6sxn6TU.json"
                                        src="/lottie/animation-5.json"
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
                        Capaian Keuangan
                        <br />
                        Perangkat Daerah Kabupaten Ogan Ilir
                    </div>

                    <div className="col-span-10 lg:col-span-10">

                        <div className='space-y-2 h-full lg:h-[calc(100vh-200px)qwe] overflow-x-auto'>
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
                                            <div className='mt-2 pt-2 border-t'>
                                                <div className="font-semibold text-center mb-5">
                                                    Capaian Keuangan
                                                </div>
                                                <div className='w-full text-center flex flex-col md:flex-row gap-y-10'>
                                                    <div className="flex flex-col md:flex-row gap-4 items-center">
                                                        <Tippy content="Capaian Keuangan" theme='success'>
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
                                                                        className="text-success  progress-ring__circle stroke-current animate-pulse"
                                                                        stroke-width="20"
                                                                        // stroke-linecap="round"
                                                                        cx="50"
                                                                        cy="50"
                                                                        r="40"
                                                                        fill="transparent"
                                                                        stroke-dasharray="251.2"
                                                                        stroke-dashoffset={`calc(251.2 - (251.2 * ${item.persentase_realisasi_anggaran ?? 0}) / 100)`}
                                                                    ></circle>

                                                                    <text x="50" y="50" font-family="Verdana" font-size="12" text-anchor="middle" alignment-baseline="middle" className="">
                                                                        {item.persentase_realisasi_anggaran.toFixed(2)}%
                                                                    </text>

                                                                </svg>
                                                            </div>
                                                        </Tippy>
                                                        <div className="flex flex-col gap-4 justify-start items-start ml-4">
                                                            <Tippy content="Nilai Anggaran" theme='dark'>
                                                                <div className="text-lg font-semibold flex flex-col md:flex-row justify-center items-center w-full gap-y-1 gap-x-2 text-gray-500 group-hover:text-dark">
                                                                    <span className="text-slate-800 dark:text-white">Anggaran: </span>
                                                                    Rp. {new Intl.NumberFormat('id-ID').format(item.target_anggaran)}
                                                                </div>
                                                            </Tippy>
                                                            <Tippy content="Nilai Realisasi" theme='dark'>
                                                                <div className="text-lg font-semibold flex flex-col md:flex-row justify-center items-center w-full gap-y-1 gap-x-2 text-gray-500 group-hover:text-dark">
                                                                    <span className="text-slate-800 dark:text-white">Realisasi: </span>
                                                                    Rp. {new Intl.NumberFormat('id-ID').format(item.realisasi_anggaran)}
                                                                </div>
                                                            </Tippy>
                                                            <div className="flex items-center justify-center flex-wrap gap-4">
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

                                            </div>
                                        </div>

                                        <div className="w-32 md:w-60 hidden md:block">
                                            <div className="w-32 md:w-60 h-32 md:h-60 relative rounded-full">
                                                <img
                                                    src={item.instance_logo}
                                                    alt={item.instance_name}
                                                    onError={(e: any) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/assets/images/logo-oi.png';
                                                    }}
                                                    className='w-full h-full p-1 rounded-full object-contain' />
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
}

export default Index;
