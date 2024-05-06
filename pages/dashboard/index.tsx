import { IRootState } from '@/store';
import { setPageTitle } from '@/store/themeConfigSlice';
import { faCartArrowDown, faExclamationTriangle, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
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

const Index = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Dashboard'));
    });
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    });


    const [CurrentUser, setCurrentUser] = useState<any>([]);
    const [periode, setPeriode] = useState<number>(1);
    const [view, setView] = useState<number>(1);

    const [AnggaranSeries, setAnggaranSeries] = useState<any>([]);
    const [AnggaranSummary, setAnggaranSummary] = useState<any>([]);
    const [RankInstances, setRankInstances] = useState<any>([]);

    useEffect(() => {
        if (window) {
            if (localStorage.getItem('user')) {
                setCurrentUser(JSON.parse(localStorage.getItem('user') ?? '{[]}') ?? []);
            }
        }
    }, []);

    useEffect(() => {
        setAnggaranSeries([]);
        chartRealisasi(periode, new Date().getFullYear(), view).then((data) => {
            if (data.status === 'success') {
                setAnggaranSeries(data.data);
            }
        });
    }, [view]);

    useEffect(() => {
        summaryRealisasi(periode, new Date().getFullYear()).then((data) => {
            if (data.status === 'success') {
                setAnggaranSummary(data.data);
            }
        });
        getRankInstance(periode, new Date().getFullYear()).then((data) => {
            if (data.status === 'success') {
                setRankInstances(data.data);
            }
        });
    }, []);

    // Kinerja Chart
    const chartKinerja: any = {
        series: [
            {
                name: 'Capaian',
                data: [44, 55, 41, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                name: 'Target',
                data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
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
            colors: ['#20E647', '#4361ee'], // capaian, target
            xaxis: {
                labels: {
                    show: true,
                },
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
            },
            yaxis: {
                show: false,
                labels: {
                    show: true,
                    formatter: (value: number) => {
                        return value + ' %';
                    },
                },
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

    const chartKinerja2: any = {
        series: [44],
        options: {
            chart: {
                height: 280,
                type: "radialBar",
            },

            colors: ["#4361ee"],
            plotOptions: {
                radialBar: {
                    hollow: {
                        margin: 0,
                        size: "70%",
                        background: "#293450"
                    },
                    track: {
                        dropShadow: {
                            enabled: true,
                            top: 2,
                            left: 0,
                            blur: 4,
                            opacity: 0.15
                        }
                    },
                    dataLabels: {
                        name: {
                            offsetY: -10,
                            color: "#fff",
                            fontSize: "13px"
                        },
                        value: {
                            color: "#fff",
                            fontSize: "30px",
                            show: true
                        }
                    }
                }
            },
            fill: {
                type: "gradient",
                gradient: {
                    shade: "dark",
                    type: "vertical",
                    gradientToColors: ["#20E647"],
                    stops: [0, 100]
                }
            },
            stroke: {
                lineCap: "round"
            },
            labels: ["Rata-Rata Laporan Kinerja"],
        }
    };

    return (
        <>
            <div className="space-y-4">
                <div className=''>
                    <div>
                        <img src="/assets/images/logo-caram.png" alt="logo" className="mx-auto w-auto h-32 object-contain" />
                    </div>
                    <div className='text-center text-lg font-semibold'>
                        Selamat Datang, {CurrentUser?.fullname}.
                    </div>
                    <div className="text-center mt-2">
                        Dashboard ini menampilkan informasi capaian kinerja dan realisasi anggaran di Pemerintahan Kabupaten Ogan Ilir.
                    </div>
                </div>

                <div className="flex items-center justify-around flex-wrap lg:h-[calc(100vh-400px)]">

                    <Link href={`/dashboard/capaian-keuangan`}
                        className='relative group p-4 rounded-xl hover:shadow-xl transition-all delay-200 duration-500'>
                        <div className="flex items-center justify-center cursor-pointer">
                            <svg className="transform -rotate-90 w-[360px] h-[360px]">
                                <circle
                                    cx="180"
                                    cy="180"
                                    r="120"
                                    stroke="currentColor"
                                    stroke-width="60"
                                    fill="transparent"
                                    className="text-dark-light" />

                                <circle
                                    cx="180"
                                    cy="180"
                                    r="120"
                                    stroke="currentColor"
                                    stroke-width="60"
                                    stroke-linecap="round" // square or round
                                    fill="transparent"
                                    stroke-dasharray={754.285714286}
                                    stroke-dashoffset={(754.285714286) - 59 / 100 * (754.285714286)}
                                    className="text-success progress-ring__circle stroke-current group-hover:animate-blinkingTextSuccess" />

                            </svg>
                            <div className="absolute w-[180px] h-[180px] rounded-full flex flex-col items-center justify-center text-success">
                                <Player
                                    autoplay
                                    loop
                                    src="https://lottie.host/57136a3b-aff5-4b0b-99c7-2408199230ad/aneTHQRQbg.json"
                                    // style={{ height: '100px', width: '200px' }}
                                    className='w-32 h-32'
                                >
                                </Player>
                                <div className="text-5xl font-semibold -mt-10">
                                    59%
                                </div>
                            </div>
                            <div className='absolute w-[300px] h-[300px] rounded-full overflow-hidden'>
                                <div className="relative w-full h-full bg-white rounded-full bg-opacity-0 group-hover:bg-opacity-10 -left-[270px] group-hover:left-[0px] transition-all duration-500"></div>
                            </div>
                        </div>
                        <div className='cursor-pointer text-xl font-bold text-center group-hover:text-success group-hover:-skew-x-12 transition-all duration-500'>
                            Capaian Keuangan
                        </div>
                        <div className="text-xs text-center badge bg-success opacity-0 group-hover:opacity-100 transition-all delay-200 duration-500">
                            Tekan untuk Melihat Rincian Capaian Keuangan
                        </div>
                    </Link>

                    <div className='relative group p-4 rounded-xl hover:shadow-xl transition-all delay-200 duration-500'>
                        <div className="flex items-center justify-center cursor-pointer">
                            <svg className="transform -rotate-90 w-[360px] h-[360px]">
                                <circle
                                    cx="180"
                                    cy="180"
                                    r="120"
                                    stroke="currentColor"
                                    stroke-width="60"
                                    fill="transparent"
                                    className="text-dark-light" />

                                <circle
                                    cx="180"
                                    cy="180"
                                    r="120"
                                    stroke="currentColor"
                                    stroke-width="60"
                                    stroke-linecap="round" // square or round
                                    fill="transparent"
                                    stroke-dasharray={754.285714286}
                                    stroke-dashoffset={(754.285714286) - 23 / 100 * (754.285714286)}
                                    className="text-primary progress-ring__circle stroke-current group-hover:animate-blinkingTextPrimary" />

                            </svg>
                            <div className="absolute w-[180px] h-[180px] rounded-full flex flex-col items-center justify-center text-primary">
                                <Player
                                    autoplay
                                    loop
                                    src="https://lottie.host/d24409b0-afb0-445f-be09-884f03bc70a6/Q6WQhrKAkZ.json"
                                    className='w-32 h-32'
                                >
                                </Player>
                                <div className="text-5xl font-semibold -mt-10">
                                    23%
                                </div>
                            </div>
                            <div className='absolute w-[300px] h-[300px] rounded-full overflow-hidden'>
                                <div className="relative w-full h-full bg-white rounded-full bg-opacity-0 group-hover:bg-opacity-10 -left-[270px] group-hover:left-[0px] transition-all duration-500"></div>
                            </div>
                        </div>
                        <div className='cursor-pointer text-xl font-bold text-center group-hover:text-primary group-hover:-skew-x-12 transition-all duration-500'>
                            Capaian Kinerja
                        </div>
                        <div className="text-xs text-center badge bg-primary opacity-0 group-hover:opacity-100 transition-all delay-200 duration-500">
                            Tekan untuk Melihat Rincian Capaian Kinerja
                        </div>
                    </div>

                </div>

                <div className="grid grid-cols-10 gap-4 hidden">
                    <div className="col-span-10 lg:col-span-7 relative panel">
                        <h5 className="text-lg font-semibold">
                            Laporan Kinerja Kabupaten Ogan Ilir
                        </h5>
                        <div className="rounded-lg bg-white dark:bg-black">
                            {isMounted ? (
                                <ReactApexChart series={chartKinerja.series} options={chartKinerja.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="bar" height={350} width={'100%'} />
                            ) : (
                                <div className="grid min-h-[350px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                    <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-span-10 lg:col-span-3 relative panel h-full">
                        <div className="mb-5 flex items-center justify-between dark:text-white-light">
                            <h5 className="">
                                <div className="text-base font-semibold">
                                    Rata-Rata Laporan Kinerja
                                </div>
                                <span className='font-normal text-xs'>
                                    Per 1 Januari hingga Saat Ini
                                </span>
                            </h5>
                        </div>
                        <div>
                            <div className="space-y-6">

                                {isMounted ? (
                                    <ReactApexChart series={chartKinerja2.series} options={chartKinerja2.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="radialBar" height={350} width={'100%'} />
                                ) : (
                                    <div className="grid min-h-[350px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                        <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </>
    );
};

export default Index;
