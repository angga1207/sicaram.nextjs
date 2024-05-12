import { IRootState } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/themeConfigSlice';
import { faBriefcase, faCartArrowDown, faExclamationTriangle, faGlobeAsia, faSackDollar, faSuitcase, faTachometerAltAverage, faThumbsUp, faToolbox } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fragment, useEffect, useState } from 'react';
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
import IconCreditCard from '@/components/Icon/IconCreditCard';

import { getDetailInstance } from '@/apis/fetchdashboard';
import Link from 'next/link';
import { faFacebook, faYoutubeSquare } from '@fortawesome/free-brands-svg-icons';
import { colors } from 'react-select/dist/declarations/src/theme';

const Index = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    useEffect(() => {
        dispatch(setPageTitle('Dashboard Perangkat Daerah'));
    });
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    });


    const [CurrentUser, setCurrentUser] = useState<any>([]);
    useEffect(() => {
        if (window) {
            if (localStorage.getItem('user')) {
                setCurrentUser(JSON.parse(localStorage.getItem('user') ?? '{[]}') ?? []);
            }
        }
    }, []);

    const [slug, setSlug] = useState<any>(null);
    const [year, setYear] = useState<any>(null);
    const [month, setMonth] = useState<any>(null);
    const [tab, setTab] = useState<string>('summary');
    const [view, setView] = useState<number>(1);
    const [descriptionShort, setDescriptionShort] = useState<boolean>(true);

    const [Instance, setInstance] = useState<any>(null);
    const [AnggaranSeries, setAnggaranSeries] = useState<any>([]);
    const [AnggaranSummary, setAnggaranSummary] = useState<any>([]);
    const [KinerjaSeries, setKinerjaSeries] = useState<any>([]);
    const [KinerjaSummary, setKinerjaSummary] = useState<any>([]);
    const [dataPrograms, setDataPrograms] = useState<any>([]);
    const [selectedProgram, setSelectedProgram] = useState<any>(null);

    useEffect(() => {
        setYear(router.query.year ?? new Date().getFullYear());
        setMonth(router.query.month ?? new Date().getMonth());
        setSlug(router.query.slug as string);
    });

    useEffect(() => {
        if (slug) {
            getDetailInstance(router.query.slug as string, 1, year, view).then((res) => {
                if (res.status === 'success') {
                    setInstance(res.data.instance);
                    setAnggaranSeries(res.data.main_anggaran);
                    setAnggaranSummary(res.data.summary_anggaran);
                    setKinerjaSeries(res.data.main_kinerja);
                    setKinerjaSummary(res.data.summary_kinerja);
                    setDataPrograms(res.data.programs);
                }
            });
        }
    }, [slug, view]);


    const chartSummaryAnggaran: any = {
        series: [AnggaranSummary?.persentase ?? 0],
        options: {
            chart: {
                height: 400,
                type: 'radialBar',
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 225,
                    hollow: {
                        margin: 0,
                        size: '50%',
                        background: 'transparent',
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
                            offsetY: -10,
                            show: true,
                            color: '#888',
                            fontSize: '17px'
                        },
                        value: {
                            formatter: function (val: any) {
                                return (val.toFixed(2) + '%');
                            },
                            color: '#111',
                            fontSize: '36px',
                            show: true,
                        }
                    }
                }
            },
            colors: ['#61db5c'],
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    type: 'horizontal',
                    shadeIntensity: 0.5,
                    gradientToColors: ['#42bc3d'],
                    inverseColors: true,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 100]
                }
            },
            stroke: {
                lineCap: 'round'
            },
            labels: ['Capaian Keuangan'],
        },
    };

    const chartSummaryKinerja: any = {
        series: [KinerjaSummary?.realisasi ?? 0],
        options: {
            chart: {
                height: 400,
                type: 'radialBar',
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 225,
                    hollow: {
                        margin: 0,
                        size: '50%',
                        background: 'transparent',
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
                            offsetY: -10,
                            show: true,
                            color: '#888',
                            fontSize: '17px'
                        },
                        value: {
                            formatter: function (val: any) {
                                return (val.toFixed(2) + '%');
                            },
                            color: '#111',
                            fontSize: '36px',
                            show: true,
                        }
                    }
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    type: 'horizontal',
                    shadeIntensity: 0.5,
                    gradientToColors: ['#5d46e2'],
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
                        if (value >= 1000000000) {
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
                show: false,
                labels: {
                    show: true,
                    formatter: (value: number) => {
                        return value + ' %';
                    },
                },
                max: 100,
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

    const apexChartKinerja2: any = {
        // series: [44],
        series: [KinerjaSummary?.realisasi?.toFixed(2) ?? 0],
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
            <div className="grid grid-cols-12 gap-4">

                <div className="col-span-12 lg:col-span-4">
                    <div
                        className="panel grid h-full grid-cols-1 content-between overflow-hidden before:absolute before:-right-44 before:top-0 before:bottom-0 before:m-auto before:h-96 before:w-96 before:rounded-full before:bg-[#1937cc6c]"
                        style={{
                            background: 'linear-gradient(0deg,#00c6fb -227%,#005bea)',
                        }}
                    >
                        <div className="z-[7] mb-16 flex items-center justify-between text-white-light">
                            <div className="">
                                <h5 className="text-lg font-semibold">
                                    {Instance?.name}
                                </h5>
                                <span className='text-md'>
                                    {Instance?.code}
                                </span>
                            </div>

                            <div className="relative whitespace-nowrap text-xl flex-none w-32 h-32">
                                <img src={Instance?.logo} alt="" className="w-full h-full rounded-full object-contain bg-white dark:bg-dark p-1" />
                            </div>
                        </div>

                        {tab === 'summary' && (
                            <div className="z-10">
                                <Tippy content={descriptionShort === true ? 'Lihat Selengkapnya' : 'Kecilkan'}>
                                    <div onClick={(e) => {
                                        setDescriptionShort(!descriptionShort);
                                    }}
                                        className={descriptionShort === true ? `text-white cursor-pointer select-none line-clamp-6` : 'text-white cursor-pointer select-none'}>
                                        {Instance?.description?.replace(/(<([^>]+)>)/ig, '')}
                                    </div>
                                </Tippy>
                            </div>
                        )}

                        {tab === 'anggaran' && (
                            <div className="relative z-10">
                                <table className='w-full'>
                                    <tbody>

                                        <tr>
                                            <td className='!w-[150px] !text-white text-md'>
                                                Anggaran
                                            </td>
                                            <td className='!text-white text-md font-semibold'>
                                                <Tippy content={`Diperbarui ` + new Date(AnggaranSummary?.anggaran_updated_at).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}>
                                                    <div className="cursor-pointer">
                                                        Rp. {new Intl.NumberFormat('id-ID').format(AnggaranSummary?.anggaran ?? 0)}
                                                    </div>
                                                </Tippy>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className='!text-white text-md'>
                                                Realisasi
                                            </td>
                                            <td className='!text-white text-md font-semibold'>
                                                <Tippy content={`Diperbarui ` + new Date(AnggaranSummary?.realisasi_updated_at).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}>
                                                    <div className="cursor-pointer">
                                                        Rp. {new Intl.NumberFormat('id-ID').format(AnggaranSummary?.realisasi ?? 0)}
                                                    </div>
                                                </Tippy>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className='!text-white text-md'>
                                                Persentase
                                            </td>
                                            <td className='!text-white text-md font-semibold'>
                                                <div className="cursor-pointer">
                                                    {(AnggaranSummary?.persentase ?? 0).toFixed(2)} %
                                                </div>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="z-10 px-4 space-y-1 mt-4">
                            <div className="flex items-center text-white">
                                <FontAwesomeIcon icon={faBriefcase} className="w-4 h-4 mr-3" />
                                <span className='text-md font-semibold'>
                                    {Instance?.programs_count} Program
                                </span>
                            </div>
                            <div className="flex items-center text-white">
                                <FontAwesomeIcon icon={faToolbox} className="w-4 h-4 mr-3" />
                                <span className='text-md font-semibold'>
                                    {Instance?.kegiatans_count} Kegiatan
                                </span>
                            </div>
                            <div className="flex items-center text-white">
                                <FontAwesomeIcon icon={faSuitcase} className="w-4 h-4 mr-3" />
                                <span className='text-md font-semibold'>
                                    {Instance?.sub_kegiatans_count} Sub Kegiatan
                                </span>
                            </div>
                        </div>

                        <div className="z-10 mt-4 flex items-center justify-between flex-wrap gap-2">
                            {Instance?.website && (
                                <Link target='_blank' href={Instance?.website ?? '#'}>
                                    <div className="flex items-center justify-between p-2 text-white-light hover:bg-[#1937cc] rounded-lg">
                                        <FontAwesomeIcon icon={faGlobeAsia} className="w-5 h-5" />
                                        <span className="ml-2 text-sm">
                                            {Instance?.website}
                                        </span>
                                    </div>
                                </Link>
                            )}
                            {Instance?.youtube && (
                                <Link target='_blank' href={Instance?.youtube ?? '#'}>
                                    <div className="flex items-center justify-between p-2 text-white-light hover:bg-[#1937cc] rounded-lg">
                                        <FontAwesomeIcon icon={faYoutubeSquare} className="w-5 h-5" />
                                        <span className="ml-2 text-sm">
                                            {Instance?.youtubeName}
                                        </span>
                                    </div>
                                </Link>
                            )}
                            {Instance?.facebook && (
                                <Link target='_blank' href={Instance?.facebook ?? '#'}>
                                    <div className="flex items-center justify-between p-2 text-white-light hover:bg-[#1937cc] rounded-lg">
                                        <FontAwesomeIcon icon={faFacebook} className="w-5 h-5" />
                                        <span className="ml-2 text-sm">
                                            {Instance?.facebookName}
                                        </span>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-8 ">
                    <div className="">
                        <div className="mr-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">

                            <button
                                onClick={(e) => {
                                    setTab('summary');
                                }}
                                className={tab === 'summary' ?
                                    `w-[150px] rounded-tl-lg bg-primary font-semibold !border-white-light !border-b-white text-white !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:font-semibold ` :
                                    `w-[150px] rounded-tl-lg !border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:text-primary`}
                                type="button">
                                <FontAwesomeIcon icon={faTachometerAltAverage} className="w-4 h-4 mr-2" />
                                Rangkuman
                            </button>

                            <button
                                onClick={(e) => {
                                    setTab('anggaran');
                                }}
                                className={tab === 'anggaran' ?
                                    `w-[150px] bg-primary font-semibold !border-white-light !border-b-white text-white !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:font-semibold ` :
                                    `w-[150px] !border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:text-primary`}
                                type="button">
                                <FontAwesomeIcon icon={faSackDollar} className="w-4 h-4 mr-2" />
                                Keuangan
                            </button>

                            <button
                                onClick={(e) => {
                                    setTab('kinerja');
                                }}
                                className={tab === 'kinerja' ?
                                    `w-[150px] rounded-tr-lg bg-primary font-semibold !border-white-light !border-b-white text-white !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:font-semibold ` :
                                    `w-[150px] rounded-tr-lg !border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:text-primary`}
                                type="button">
                                <FontAwesomeIcon icon={faToolbox} className="w-4 h-4 mr-2" />
                                Kinerja
                            </button>

                        </div>
                    </div>

                    {tab === 'summary' && (
                        <div className="panel">
                            <div className="h-full flex items-center justify-around flex-wrap">
                                <div className="">
                                    <div className="text-center">
                                        <div className="">
                                            Capaian Keuangan
                                        </div>
                                        <div className="text-xs">
                                            Diperbarui
                                            <span className='ml-1 font-semibold'>
                                                {new Date(AnggaranSummary?.anggaran_updated_at).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    {isMounted ? (
                                        <div
                                            onClick={(e) => {
                                                setTab('anggaran');
                                            }}
                                            className="cursor-pointer">
                                            <ReactApexChart
                                                series={chartSummaryAnggaran.series}
                                                options={chartSummaryAnggaran.options}
                                                type="radialBar"
                                                height={440}
                                                width={'100%'} />
                                        </div>
                                    ) : (
                                        <div className="grid min-h-[400px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                            <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-black !border-l-transparent dark:border-white"></span>
                                        </div>
                                    )}
                                </div>
                                <div className="">
                                    <div className="text-center">
                                        <div className="">
                                            Capaian Kinerja
                                        </div>
                                        <div className="text-xs">
                                            Diperbarui
                                            <span className='ml-1 font-semibold'>
                                                {new Date(KinerjaSummary?.realisasi_updated_at).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    // day: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    {isMounted ? (
                                        <div
                                            onClick={(e) => {
                                                setTab('kinerja');
                                            }}
                                            className="cursor-pointer">
                                            <ReactApexChart
                                                series={chartSummaryKinerja.series}
                                                options={chartSummaryKinerja.options}
                                                type="radialBar"
                                                height={440}
                                                width={'100%'} />
                                        </div>
                                    ) : (
                                        <div className="grid min-h-[400px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                            <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-black !border-l-transparent dark:border-white"></span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === 'anggaran' && (
                        <div className="relative panel">
                            <div className="flex items-center justify-between">
                                <h5 className="text-lg font-semibold">
                                    Capaian Keuangan Kabupaten Ogan Ilir
                                </h5>
                                <div className="flex items-center gap-x-1">
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
                            <div className="rounded-lg bg-white dark:bg-black">
                                {isMounted ? (
                                    <ReactApexChart series={chartAnggaran.series} options={chartAnggaran.options} type="area" height={430} width={'100%'} />
                                ) : (
                                    <div className="grid min-h-[400px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                        <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-black !border-l-transparent dark:border-white"></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {tab === 'kinerja' && (
                        <div className="relative panel">
                            <div className="flex items-center justify-between">
                                <h5 className="text-lg font-semibold">
                                    Capaian Keuangan Kabupaten Ogan Ilir
                                </h5>
                                <div className="flex items-center gap-x-1">
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
                            <div className="rounded-lg bg-white dark:bg-black">
                                {isMounted ? (
                                    <ReactApexChart series={apexChartKinerja.series} options={apexChartKinerja.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="bar" height={350} width={'100%'} />
                                ) : (
                                    <div className="grid min-h-[350px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                        <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                    </div>
                                )}
                            </div>
                        </div>


                        // <div className="grid grid-cols-10 gap-4">
                        //     <div className="col-span-10 lg:col-span-7 relative panel">
                        //         <div className="flex items-center justify-between">
                        //             <h5 className="text-lg font-semibold">
                        //                 Capaian Kinerja Kabupaten Ogan Ilir
                        //             </h5>
                        //             <div className="flex items-center gap-x-1">
                        //                 <div className="relative group">
                        //                     <div
                        //                         className={view === 1 ? `absolute transitiona-all duration-1000 bg-gradient-to-r from-[#44BCFF] via-[#445aff] to-[#965eff] rounded-xl blur-lg opacity-100 -inset-[1px] duration-400 animate-tilt` : `absolute transitiona-all duration-1000 opacity-0 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#445aff] to-[#965eff] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-[1px] group-hover:duration-400 animate-tilt`}>
                        //                     </div>
                        //                     <button
                        //                         onClick={(e) => {
                        //                             setView(1);
                        //                         }}
                        //                         type="button"
                        //                         className={view === 1 ? `relative inline-flex items-center justify-center px-2 py-2 text-xs text-white transition-all font-semibold duration-200 bg-slate-800 font-pj rounded-xl w-[80px] ` : `relative inline-flex items-center justify-center px-2 py-2 text-xs text-white transition-all duration-200 bg-slate-800 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 w-[80px]`}>
                        //                         Tahun Ini
                        //                     </button>
                        //                 </div>
                        //                 <div className="relative group">
                        //                     <div
                        //                         className={view === 2 ? `absolute transitiona-all duration-1000 bg-gradient-to-r from-[#44BCFF] via-[#445aff] to-[#965eff] rounded-xl blur-lg opacity-100 -inset-[1px] duration-400 animate-tilt` : `absolute transitiona-all duration-1000 opacity-0 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#445aff] to-[#965eff] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-[1px] group-hover:duration-400 animate-tilt`}>
                        //                     </div>
                        //                     <button
                        //                         onClick={(e) => {
                        //                             setView(2);
                        //                         }}
                        //                         type="button"
                        //                         className={view === 2 ? `relative inline-flex items-center justify-center px-2 py-2 text-xs text-white transition-all font-semibold duration-200 bg-slate-800 font-pj rounded-xl w-[80px] ` : `relative inline-flex items-center justify-center px-2 py-2 text-xs text-white transition-all duration-200 bg-slate-800 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 w-[80px]`}>
                        //                         TW I
                        //                     </button>
                        //                 </div>
                        //                 <div className="relative group">
                        //                     <div
                        //                         className={view === 3 ? `absolute transitiona-all duration-1000 bg-gradient-to-r from-[#44BCFF] via-[#445aff] to-[#965eff] rounded-xl blur-lg opacity-100 -inset-[1px] duration-400 animate-tilt` : `absolute transitiona-all duration-1000 opacity-0 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#445aff] to-[#965eff] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-[1px] group-hover:duration-400 animate-tilt`}>
                        //                     </div>
                        //                     <button
                        //                         onClick={(e) => {
                        //                             setView(3);
                        //                         }}
                        //                         type="button"
                        //                         className={view === 3 ? `relative inline-flex items-center justify-center px-2 py-2 text-xs text-white transition-all font-semibold duration-200 bg-slate-800 font-pj rounded-xl w-[80px] ` : `relative inline-flex items-center justify-center px-2 py-2 text-xs text-white transition-all duration-200 bg-slate-800 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 w-[80px]`}>
                        //                         TW II
                        //                     </button>
                        //                 </div>
                        //                 <div className="relative group">
                        //                     <div
                        //                         className={view === 4 ? `absolute transitiona-all duration-1000 bg-gradient-to-r from-[#44BCFF] via-[#445aff] to-[#965eff] rounded-xl blur-lg opacity-100 -inset-[1px] duration-400 animate-tilt` : `absolute transitiona-all duration-1000 opacity-0 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#445aff] to-[#965eff] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-[1px] group-hover:duration-400 animate-tilt`}>
                        //                     </div>
                        //                     <button
                        //                         onClick={(e) => {
                        //                             setView(4);
                        //                         }}
                        //                         type="button"
                        //                         className={view === 4 ? `relative inline-flex items-center justify-center px-2 py-2 text-xs text-white transition-all font-semibold duration-200 bg-slate-800 font-pj rounded-xl w-[80px] ` : `relative inline-flex items-center justify-center px-2 py-2 text-xs text-white transition-all duration-200 bg-slate-800 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 w-[80px]`}>
                        //                         TW III
                        //                     </button>
                        //                 </div>
                        //                 <div className="relative group">
                        //                     <div
                        //                         className={view === 5 ? `absolute transitiona-all duration-1000 bg-gradient-to-r from-[#44BCFF] via-[#445aff] to-[#965eff] rounded-xl blur-lg opacity-100 -inset-[1px] duration-400 animate-tilt` : `absolute transitiona-all duration-1000 opacity-0 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#445aff] to-[#965eff] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-[1px] group-hover:duration-400 animate-tilt`}>
                        //                     </div>
                        //                     <button
                        //                         onClick={(e) => {
                        //                             setView(5);
                        //                         }}
                        //                         type="button"
                        //                         className={view === 5 ? `relative inline-flex items-center justify-center px-2 py-2 text-xs text-white transition-all font-semibold duration-200 bg-slate-800 font-pj rounded-xl w-[80px] ` : `relative inline-flex items-center justify-center px-2 py-2 text-xs text-white transition-all duration-200 bg-slate-800 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 w-[80px]`}>
                        //                         TW IV
                        //                     </button>
                        //                 </div>
                        //             </div>
                        //         </div>
                        //         <div className="rounded-lg bg-white dark:bg-black">
                        //             {isMounted ? (
                        //                 <ReactApexChart series={apexChartKinerja.series} options={apexChartKinerja.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="bar" height={350} width={'100%'} />
                        //             ) : (
                        //                 <div className="grid min-h-[350px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                        //                     <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                        //                 </div>
                        //             )}
                        //         </div>
                        //     </div>

                        //     <div className="col-span-10 lg:col-span-3 relative panel h-full">
                        //         <div className="mb-5 flex items-center justify-between dark:text-white-light">
                        //             <h5 className="">
                        //                 <div className="text-base font-semibold">
                        //                     Rata-Rata Capaian Kinerja
                        //                 </div>
                        //                 <span className='font-normal text-xs'>
                        //                     Per 1 Januari hingga Saat Ini
                        //                 </span>
                        //             </h5>
                        //         </div>
                        //         <div>
                        //             <div className="space-y-6">

                        //                 {isMounted ? (
                        //                     <ReactApexChart series={apexChartKinerja2.series} options={apexChartKinerja2.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="radialBar" height={350} width={'100%'} />
                        //                 ) : (
                        //                     <div className="grid min-h-[350px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                        //                         <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                        //                     </div>
                        //                 )}

                        //             </div>
                        //         </div>
                        //     </div>
                        // </div>
                    )}

                </div>

            </div>

            <div className="space-y-2 mt-10">
                <div className="font-semibold text-lg pb-3 px-4">
                    PROGRAM {Instance?.name}
                </div>
                {dataPrograms.map((program: any, index: number) => (
                    <div key={`program-` + program.id} onClick={() => {
                        setSelectedProgram(program);
                    }}
                        className="panel !cursor-pointer">
                        {program?.code}
                    </div>
                ))}
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

