import { IRootState } from '@/store';
import { setPageTitle } from '@/store/themeConfigSlice';
import { faAngleDoubleRight, faArrowLeft, faArrowUpRightDots, faCartArrowDown, faClipboardCheck, faCoins, faExclamationTriangle, faLink, faMoneyBills, faMoneyCheckAlt, faTags, faThumbsUp, faTree } from '@fortawesome/free-solid-svg-icons';
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

import { chartRealisasi, summaryKinerja } from '@/apis/fetchdashboard';
import Link from 'next/link';
import LoadingSicaram from '@/components/LoadingSicaram';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import MainMenu from '@/components/MainMenu';

const Index = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    useEffect(() => {
        dispatch(setPageTitle('Dashboard'));
    });

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    });

    const [CurrentUser, setCurrentUser] = useState<any>([]);
    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null)
    const [view, setView] = useState<number>(1);

    const [AnggaranSeries, setAnggaranSeries] = useState<any>([]);
    const [AnggaranSummary, setAnggaranSummary] = useState<any>([]);
    const [percentageAnggaranSummary, setPercentageAnggaranSummary] = useState<any>(null);
    const [KinerjaSeries, setKinerjaSeries] = useState<any>([]);
    const [KinerjaSummary, setKinerjaSummary] = useState<any>([]);
    const [RankInstances, setRankInstances] = useState<any>([]);

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
        router.push('/dashboard/pd');
    }

    useEffect(() => {
        if (isMounted && periode?.id && year) {
            summaryKinerja(periode?.id, year, view).then((data) => {
                if (data.status === 'success') {
                    setKinerjaSummary(data.data);
                }
            });
        }
    }, [view]);

    useEffect(() => {
        if (isMounted && periode?.id && year) {
            chartRealisasi(periode?.id, year, view).then((data) => {
                if (data.status === 'success') {
                    setAnggaranSeries(data.data);

                    const target = Math.max(...data.data?.target?.map((item: any) => item.target));
                    const realisasi = Math.max(...data.data?.realisasi?.map((item: any) => item.realisasi));
                    const percent = target > 0 ? ((realisasi / target) * 100) : 0;
                    setAnggaranSummary({
                        'target': target,
                        'realisasi': realisasi,
                        'percent': percent,
                    });
                    setPercentageAnggaranSummary(percent);
                }
            });

            summaryKinerja(periode?.id, year, view).then((data) => {
                if (data.status === 'success') {
                    setKinerjaSummary(data.data);
                }
            });
        }
    }, [isMounted, periode?.id, year]);


    // Chart Capaian Keuangan
    const chartCapaianKeuangan: any = {
        series: [percentageAnggaranSummary?.toFixed(2) ?? 0],
        options: {
            chart: {
                type: 'radialBar',
                height: 600,
                fontFamily: 'Nunito, sans-serif',
            },
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 225,
                    hollow: {
                        margin: 0,
                        size: '50%',
                        background: '#fff',
                        image: undefined,
                        imageOffsetX: 0,
                        imageOffsetY: 0,
                        position: 'front',
                        dropShadow: {
                            enabled: true,
                            top: 3,
                            left: 0,
                            blur: 4,
                            opacity: 0.24
                        }
                    },
                    track: {
                        background: '#fff',
                        strokeWidth: '67%',
                        margin: 0, // margin is in pixels
                        dropShadow: {
                            enabled: true,
                            top: -3,
                            left: 0,
                            blur: 4,
                            opacity: 0.35
                        }
                    },

                    dataLabels: {
                        show: true,
                        name: {
                            offsetY: 20,
                            // offsetY: -10,
                            show: true,
                            color: '#888',
                            fontSize: '17px'
                        },
                        value: {
                            offsetY: 30,
                            // offsetY: 10,
                            formatter: function (val: any) {
                                return parseFloat(val) + '%';
                            },
                            color: '#111',
                            // fontSize: '36px',
                            fontSize: '26px',
                            show: true,
                        }
                    }
                }
            },
            colors: ['#C1E899'],
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    type: 'horizontal',
                    shadeIntensity: 0.5,
                    gradientToColors: ['#ABE5A1'],
                    inverseColors: true,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 100]
                }
            },
            stroke: {
                lineCap: 'round'
            },
            labels: ['Capaian Belanja'],
        },
    };

    // Chart Capaian Kinerja
    const chartCapaianKinerja: any = {
        series: [KinerjaSummary?.realisasi?.toFixed(2) ?? 0],
        options: {
            chart: {
                type: 'radialBar',
                height: 600,
                fontFamily: 'Nunito, sans-serif',
            },
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 225,
                    hollow: {
                        margin: 0,
                        size: '50%',
                        background: '#fff',
                        image: undefined,
                        imageOffsetX: 0,
                        imageOffsetY: 0,
                        position: 'front',
                        dropShadow: {
                            enabled: true,
                            top: 3,
                            left: 0,
                            blur: 4,
                            opacity: 0.24
                        }
                    },
                    track: {
                        background: '#fff',
                        strokeWidth: '67%',
                        margin: 0, // margin is in pixels
                        dropShadow: {
                            enabled: true,
                            top: -3,
                            left: 0,
                            blur: 4,
                            opacity: 0.35
                        }
                    },

                    dataLabels: {
                        show: true,
                        name: {
                            offsetY: 20,
                            // offsetY: -10,
                            show: true,
                            color: '#888',
                            fontSize: '17px'
                        },
                        value: {
                            offsetY: 30,
                            // offsetY: 10,
                            formatter: function (val: any) {
                                return parseFloat(val) + '%';
                            },
                            color: '#111',
                            // fontSize: '36px',
                            fontSize: '26px',
                            show: true,
                        }
                    }
                }
            },
            colors: ['#0D92F4'],
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    type: 'horizontal',
                    shadeIntensity: 0.5,
                    gradientToColors: ['#77CDFF'],
                    inverseColors: true,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 100]
                }
            },
            stroke: {
                lineCap: 'round'
            },
            labels: ['Capaian Kinerja'],
        },
    };

    return (
        <>
            <div className='mb-5'>
                <div>
                    <img src="/assets/images/logo-caram.png" alt="logo" className="mx-auto w-auto h-32 object-contain" />
                </div>
                <div className='text-center text-lg font-semibold'>
                    Selamat Datang, {CurrentUser?.fullname}.
                </div>
                <div className="text-center mt-2">
                    Dashboard ini menampilkan informasi capaian kinerja dan realisasi belanja di Pemerintahan Kabupaten Ogan Ilir.
                </div>
            </div>

            <div className="grid md:grid-cols-8 justify-center items-center gap-x-5">
                <div className='hidden md:block xl:col-span-4 md:col-span-4 self-start'>
                    <MainMenu />
                </div>

                <div className='cols-span-4 xl:col-span-4 md:col-span-4 grid grid-cols-1 xl:grid-cols-2 gap-2'>
                    <div className="flex items-center justify-center">
                        <div className="h-[500px] w-full relative group p-4 rounded-xl transition-all delay-100 duration-300">

                            {percentageAnggaranSummary != null ? (
                                <>

                                    {/* <div className="absolute top-0 inset-x-0">
                                        <Player
                                            autoplay
                                            loop
                                            src="/lottie/animation-6.json"
                                            className='w-[100%] h-[400px]'
                                        >
                                        </Player>
                                    </div> */}

                                    <div className="absolute z-[1] top-[10%] xl:top-[10%] 2xl:top-[15%] 4xl:top-[18%] inset-x-0 group-hover:top-[5%] group-hover:xl:top-[5%] group-hover:2xl:top-[10%] group-hover:4xl:top-[13%] transition-all delay-100 duration-300">
                                        <Player
                                            autoplay
                                            loop
                                            src="/lottie/animation-4.json"
                                            className='w-32 h-32 group-hover:w-40 group-hover:h-40 transition-all delay-100 duration-300'
                                        >
                                        </Player>
                                    </div>

                                    <Link href={`/dashboard/capaian-keuangan`} className=''>
                                        {isMounted ? (
                                            <ReactApexChart
                                                series={chartCapaianKeuangan.series}
                                                options={chartCapaianKeuangan.options}
                                                type="radialBar" height={500} width={'100%'} />
                                        ) : (
                                            <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                                <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                            </div>
                                        )}

                                        <div className='cursor-pointer text-xl font-bold text-center group-hover:text-success group-hover:-skew-x-12 transition-all duration-300'>
                                            Capaian Belanja
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <div className="text-xs text-center badge bg-success opacity-0 group-hover:opacity-100 transition-all delay-100 duration-300 flex items-center justify-center">
                                                <FontAwesomeIcon icon={faAngleDoubleRight} className='mr-1 w-3 h-3' />
                                                Klik untuk Melihat Rincian Capaian Belanja
                                            </div>
                                        </div>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <LoadingSicaram />
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="h-[500px] w-full relative group p-4 rounded-xl transition-all delay-100 duration-300">

                            {KinerjaSummary?.realisasi != null ? (
                                <>

                                    {/* <div className="absolute -top-7 inset-x-0">
                                        <Player
                                            autoplay
                                            loop
                                            src="/lottie/animation-7.json"
                                            className='w-[100%] h-[500px]'
                                        >
                                        </Player>
                                    </div> */}

                                    <div className="absolute z-[1] top-[10%] xl:top-[10%] 2xl:top-[15%] 4xl:top-[18%] inset-x-0 group-hover:top-[5%] group-hover:xl:top-[5%] group-hover:2xl:top-[10%] group-hover:4xl:top-[13%] transition-all delay-100 duration-300">
                                        <Player
                                            autoplay
                                            loop
                                            src="/lottie/animation-3.json"
                                            className='w-32 h-32 group-hover:w-40 group-hover:h-40 transition-all delay-100 duration-300'
                                        >
                                        </Player>
                                    </div>

                                    <Link href={`/dashboard/capaian-kinerja`} className=''>
                                        {isMounted ? (
                                            <ReactApexChart series={chartCapaianKinerja.series} options={chartCapaianKinerja.options} type="radialBar" height={500} width={'100%'} />
                                        ) : (
                                            <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                                <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                            </div>
                                        )}
                                        <div className='cursor-pointer text-xl font-bold text-center group-hover:text-primary group-hover:-skew-x-12 transition-all duration-300'>
                                            Capaian Kinerja
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <div className="text-xs text-center badge bg-primary opacity-0 group-hover:opacity-100 transition-all delay-100 duration-300 flex items-center justify-center">
                                                <FontAwesomeIcon icon={faAngleDoubleRight} className='mr-1 w-3 h-3' />
                                                Klik untuk Melihat Rincian Capaian Kinerja
                                            </div>
                                        </div>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <LoadingSicaram />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Index;
