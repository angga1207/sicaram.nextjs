import { IRootState } from '@/store';
import { setPageTitle } from '@/store/themeConfigSlice';
import { faExclamationTriangle, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
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
import { Player, Controls } from '@lottiefiles/react-lottie-player';

import { chartRealisasi, summaryRealisasi } from '@/apis/fetchdashboard';

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


    const [periode, setPeriode] = useState<number>(1);
    const [view, setView] = useState<number>(1);

    const [AnggaranSeries, setAnggaranSeries] = useState<any>([]);
    const [AnggaranSummary, setAnggaranSummary] = useState<any>([]);

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
    }, []);

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
                tickAmount: 7,
                labels: {
                    formatter: (value: number) => {
                        // return value / 1000000 + 'Jt';
                        return 'Rp. ' + new Intl.NumberFormat('id-ID').format(value);
                    },
                    offsetX: isRtl ? -30 : -10,
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
                    offsetX: -2,
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
                <div className='panel'>
                    <h1 className='text-center font-semibold text-xl'>
                        Si Caram Kabupaten Ogan Ilir
                    </h1>
                    <div className='flex justify-center items-center font-semibold text-orange-500'>
                        <FontAwesomeIcon icon={faExclamationTriangle} className='w-4 h-4 mr-1' />
                        Work in Progress
                    </div>
                </div>

                <div className="grid grid-cols-10 gap-4">
                    <div className="col-span-10 lg:col-span-7 relative panel">
                        <div className="flex items-center justify-between">
                            <h5 className="text-lg font-semibold">
                                Laporan Anggaran Kabupaten Ogan Ilir
                            </h5>
                            <div className="flex items-center gap-x-0.5">
                                <button
                                    onClick={(e) => {
                                        setView(1);
                                    }}
                                    type="button"
                                    className={view === 1 ? `btn btn-info btn-sm w-[80px]` : `btn btn-outline-info btn-sm w-[80px]`}>
                                    Tahun Ini
                                </button>
                                <button
                                    onClick={(e) => {
                                        setView(2);
                                    }}
                                    type="button"
                                    className={view === 2 ? `btn btn-info btn-sm w-[80px]` : `btn btn-outline-info btn-sm w-[80px]`}>
                                    TW I
                                </button>
                                <button
                                    onClick={(e) => {
                                        setView(3);
                                    }}
                                    type="button"
                                    className={view === 3 ? `btn btn-info btn-sm w-[80px]` : `btn btn-outline-info btn-sm w-[80px]`}>
                                    TW II
                                </button>
                                <button
                                    onClick={(e) => {
                                        setView(4);
                                    }}
                                    type="button"
                                    className={view === 4 ? `btn btn-info btn-sm w-[80px]` : `btn btn-outline-info btn-sm w-[80px]`}>
                                    TW III
                                </button>
                                <button
                                    onClick={(e) => {
                                        setView(5);
                                    }}
                                    type="button"
                                    className={view === 5 ? `btn btn-info btn-sm w-[80px]` : `btn btn-outline-info btn-sm w-[80px]`}>
                                    TW IV
                                </button>
                            </div>
                        </div>
                        <div className="rounded-lg bg-white dark:bg-black">
                            {isMounted ? (
                                <ReactApexChart series={chartAnggaran.series} options={chartAnggaran.options} type="area" height={450} width={'100%'} />
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
                                    Laporan Anggaran
                                </div>
                                <span className='font-normal text-xs'>
                                    Per 1 Januari hingga Saat Ini
                                </span>
                            </h5>
                            <div className="dropdown hidden">
                                <Dropdown
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                                >
                                    <ul>
                                        <li>
                                            <button type="button">View Report</button>
                                        </li>
                                        <li>
                                            <button type="button">Edit Report</button>
                                        </li>
                                        <li>
                                            <button type="button">Mark as Done</button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div>
                            <div className="space-y-6">

                                <div className="flex">
                                    <span className="grid h-9 w-9 shrink-0 place-content-center rounded-md bg-primary-light text-primary dark:bg-primary dark:text-primary-light">
                                        <IconBolt />
                                    </span>
                                    <div className="flex-1 px-3">
                                        <div>
                                            Target Anggaran
                                        </div>
                                        <div className="text-xs text-white-dark dark:text-gray-500">
                                            {new Date(AnggaranSummary?.target?.updated_at).toLocaleString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric'
                                            })} WIB
                                        </div>
                                    </div>
                                    <span className="whitespace-pre px-1 text-base text-primary ltr:ml-auto rtl:mr-auto">
                                        Rp. {new Intl.NumberFormat('id-ID').format(AnggaranSummary?.target?.target)}
                                    </span>
                                </div>

                                <div className="flex">
                                    <span className="grid h-9 w-9 shrink-0 place-content-center rounded-md bg-success-light text-success dark:bg-success dark:text-success-light">
                                        <IconCashBanknotes />
                                    </span>
                                    <div className="flex-1 px-3">
                                        <div>
                                            Realisasi Anggaran
                                        </div>
                                        <div className="text-xs text-white-dark dark:text-gray-500">
                                            {new Date(AnggaranSummary?.realisasi?.updated_at).toLocaleString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric'
                                            })} WIB
                                        </div>
                                    </div>
                                    <span className="whitespace-pre px-1 text-base text-success ltr:ml-auto rtl:mr-auto">
                                        Rp. {new Intl.NumberFormat('id-ID').format(AnggaranSummary?.realisasi?.realisasi)}
                                    </span>
                                </div>

                                <div className="flex border-t pt-5">
                                    <span className="grid h-9 w-9 shrink-0 place-content-center rounded-md bg-warning-light text-warning dark:bg-warning dark:text-warning-light">
                                        <IconBox />
                                    </span>
                                    <div className="flex-1 px-3"></div>
                                    <span className="whitespace-pre px-1 text-base text-danger ltr:ml-auto rtl:mr-auto">
                                        Rp. {new Intl.NumberFormat('id-ID').format(AnggaranSummary?.realisasi?.realisasi - AnggaranSummary?.target?.target)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-center">
                                    <Player
                                        autoplay
                                        loop
                                        // src="https://lottie.host/5d52a038-c6c3-4e21-b904-885be1674743/PMMUZR9shN.json"
                                        src="https://lottie.host/c11c5760-37c1-47b2-b155-16e647ea6f00/mzk6sxn6TU.json"
                                        style={{ height: '250px', width: '300px' }}
                                    >
                                    </Player>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-10 gap-4">
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

                <div className="grid grid-cols-10 gap-4">
                    <div className="col-span-10 lg:col-span-3 relative h-full">
                        <div className="panel h-full overflow-hidden border-0 p-0">
                            <div className="min-h-[200px] bg-gradient-to-r from-[#4361ee] to-[#160f6b] p-6">
                                <div className="mb-4 text-center font-semibold text-base text-white">
                                    Perangkat Daerah Terbaik Bulan Ini
                                </div>
                                <Tippy content="Dinas Komunikasi, Informatika, Statistik dan Persandian">
                                    <div className="flex gap-x-2 items-center justify-between text-white">
                                        <div className="flex-none">
                                            <img src='http://127.0.0.1:8000/storage/images/pd/4.png' alt='award' className='w-16 h-16 object-contain rounded-full bg-white p-1' />
                                        </div>
                                        <p className="text-xl font-semibold line-clamp-2 cursor-pointer">
                                            DINAS KOMUNIKASI, INFORMATIKA, STATISTIK DAN PERSANDIAN
                                        </p>
                                    </div>
                                </Tippy>
                            </div>
                            <div className="-mt-12 grid grid-cols-2 gap-2 px-8">
                                <div className="rounded-md bg-white px-4 py-2.5 shadow dark:bg-[#060818]">
                                    <p className="mb-4 text-center dark:text-white">
                                        Capaian Kinerja
                                    </p>
                                    <div className="btn w-full  border-0 bg-[#ebedf2] py-1 text-base text-[#515365] shadow-none dark:bg-black dark:text-[#bfc9d4]">
                                        62,44 %
                                    </div>
                                </div>
                                <div className="rounded-md bg-white px-4 py-2.5 shadow dark:bg-[#060818]">
                                    <p className="mb-4 text-center dark:text-white">
                                        Capaian Anggaran
                                    </p>
                                    <div className="btn w-full  border-0 bg-[#ebedf2] py-1 text-base text-[#515365] shadow-none dark:bg-black dark:text-[#bfc9d4]">
                                        57,21 %
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
                                            Target Anggaran
                                        </p>
                                        <p className="text-base">
                                            <span>Rp. </span>
                                            <span className="font-semibold">
                                                122.752.000
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-[#515365]">
                                            Realisasi Anggaran
                                        </p>
                                        <p className="text-base">
                                            <span>Rp. </span>
                                            <span className="font-semibold">
                                                65.550.000
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-around px-2 text-center">
                                    <button type="button" className="btn btn-secondary ltr:mr-2 rtl:ml-2">
                                        Lihat Detail
                                    </button>
                                    <button type="button" className="btn btn-success">
                                        Beri Pujian
                                        <FontAwesomeIcon icon={faThumbsUp} className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Index;
