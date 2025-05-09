import { IRootState } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle, toggleShowMoney } from '@/store/themeConfigSlice';
import { faAngleDoubleDown, faBoxesPacking, faBriefcase, faCartArrowDown, faChartLine, faClock, faExclamationTriangle, faExternalLinkAlt, faFileSignature, faGlobeAsia, faNoteSticky, faPenClip, faPercent, faProjectDiagram, faSackDollar, faShare, faSign, faStar, faSuitcase, faTachometerAltAverage, faThumbsUp, faToolbox, faUsers } from '@fortawesome/free-solid-svg-icons';
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

import { getDetailInstance, getDetailProgram, getDetaiKegiatan, getDetailSubKegiatan } from '@/apis/fetchdashboard';
import { getMasterTujuan } from '@/apis/tujuan_sasaran';
import Link from 'next/link';
import { faFacebook, faSuperpowers, faYoutubeSquare } from '@fortawesome/free-brands-svg-icons';
import { colors } from 'react-select/dist/declarations/src/theme';
import IconX from '@/components/Icon/IconX';
import { format } from 'path';
import LoadingSicaram from '@/components/LoadingSicaram';
import { faEyeSlash, faQuestionCircle } from '@fortawesome/free-regular-svg-icons';


import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { faFileAlt, faTrashAlt } from '@fortawesome/free-regular-svg-icons';

const DashboardOPD = () => {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
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
    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null)

    useEffect(() => {
        if (document.cookie) {
            let user = document.cookie.split(';').find((row) => row.trim().startsWith('user='))?.split('=')[1];
            user = user ? JSON.parse(user) : null;
            setCurrentUser(user);
        }
        if (isMounted) {
            setPeriode(JSON.parse(localStorage.getItem('periode') ?? ""));
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

    const [slug, setSlug] = useState<any>(null);
    const [month, setMonth] = useState<any>(null);
    const [tab, setTab] = useState<string>('summary');
    const [tab2, setTab2] = useState<string>('capaian'); // capaian / tujuan-sasaran
    const [view, setView] = useState<number>(1);
    const [descriptionShort, setDescriptionShort] = useState<boolean>(true);

    const [Instance, setInstance] = useState<any>(null);
    const [admins, setAdmins] = useState<any>([]);
    const [dataTujuanSasaran, setDataTujuanSasaran] = useState<any>([]);

    const [AnggaranSeries, setAnggaranSeries] = useState<any>([]);
    const [AnggaranSummary, setAnggaranSummary] = useState<any>([]);
    const [KinerjaSeries, setKinerjaSeries] = useState<any>([]);
    const [KinerjaSummary, setKinerjaSummary] = useState<any>([]);

    const [dataPrograms, setDataPrograms] = useState<any>([]);
    const [loadingDataPrograms, setLoadingDataPrograms] = useState<boolean>(false);
    const [selectedProgram, setSelectedProgram] = useState<any>(null);
    const [tabSelectedProgram, setTabSelectedProgram] = useState<any>('anggaran');
    const [AnggaranSeriesProgram, setAnggaranSeriesProgram] = useState<any>([]);
    const [KinerjaSeriesProgram, setKinerjaSeriesProgram] = useState<any>([]);

    const [dataKegiatans, setDataKegiatans] = useState<any>([]);
    const [loadingDataKegiatans, setLoadingDataKegiatans] = useState<boolean>(false);
    const [selectedKegiatan, setSelectedKegiatan] = useState<any>(null);
    const [tabSelectedKegiatan, setTabSelectedKegiatan] = useState<any>('anggaran');
    const [AnggaranSeriesKegiatan, setAnggaranSeriesKegiatan] = useState<any>([]);
    const [KinerjaSeriesKegiatan, setKinerjaSeriesKegiatan] = useState<any>([]);

    const [dataSubKegiatans, setDataSubKegiatans] = useState<any>([]);
    const [loadingDataSubKegiatans, setLoadingDataSubKegiatans] = useState<boolean>(false);
    const [selectedSubKegiatan, setSelectedSubKegiatan] = useState<any>(null);
    const [tabSelectedSubKegiatan, setTabSelectedSubKegiatan] = useState<any>('anggaran');
    const [AnggaranSeriesSubKegiatan, setAnggaranSeriesSubKegiatan] = useState<any>([]);
    const [KinerjaSeriesSubKegiatan, setKinerjaSeriesSubKegiatan] = useState<any>([]);

    const [detailRealisasi, setDetailRealisasi] = useState<any>([]);
    const [loadingDetailRealisasi, setLoadingDetailRealisasi] = useState<boolean>(false);
    const [selectedDetailRealisasi, setSelectedDetailRealisasi] = useState<any>(null);

    useEffect(() => {
        if (isMounted) {
            setMonth(router.query.month ?? new Date().getMonth());
            setSlug(router.query.slug as string);
        }
    }, [isMounted, router.query.slug]);

    useEffect(() => {
        if (CurrentUser.role_id !== 9 && slug && isMounted && periode?.id && year) {
            setLoadingDataPrograms(true);
            getDetailInstance(router.query.slug as string, periode?.id, year, view).then((res) => {
                if (res.status === 'success') {
                    setInstance(res.data.instance);
                    setAdmins(res.data.admins)
                    setAnggaranSeries(res.data.main_anggaran);
                    setAnggaranSummary(res.data.summary_anggaran);
                    setKinerjaSeries(res.data.main_kinerja);
                    setKinerjaSummary(res.data.summary_kinerja);
                    setDataPrograms(res.data.programs);
                    setLoadingDataPrograms(false);
                }
            });

        }
    }, [slug, view, isMounted, periode?.id, year]);

    useEffect(() => {
        if (CurrentUser.role_id === 9 && CurrentUser.instance_alias && view && year) {
            getDetailInstance(CurrentUser.instance_alias as string, 1, year, view).then((res) => {
                if (res.status === 'success') {
                    setInstance(res.data.instance);
                    setAdmins(res.data.admins)
                    setAnggaranSeries(res.data.main_anggaran);
                    setAnggaranSummary(res.data.summary_anggaran);
                    setKinerjaSeries(res.data.main_kinerja);
                    setKinerjaSummary(res.data.summary_kinerja);
                    setDataPrograms(res.data.programs);
                    setSlug(CurrentUser.instance_alias);
                }
            });
        }
    }, [CurrentUser, view, year]);

    useEffect(() => {
        if (Instance) {
            getMasterTujuan('', Instance?.id, periode?.id).then((data: any) => {
                if (data.status === 'success') {
                    setDataTujuanSasaran(data.data);
                }
            });
        }
    }, [Instance]);


    const chartSummaryAnggaran: any = {
        series: [AnggaranSummary?.persentase ?? 0],
        options: {
            chart: {
                height: 440,
                type: 'radialBar',
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    // endAngle: 225,
                    endAngle: 135,
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
            labels: ['Capaian Belanja'],
        },
    };

    const chartSummaryKinerja: any = {
        series: [KinerjaSummary?.realisasi ?? 0],
        options: {
            chart: {
                height: 440,
                type: 'radialBar',
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    // endAngle: 225,
                    endAngle: 135,
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
                name: 'Anggaran',
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
                        if (themeConfig.showMoney) {
                            if (value >= 1000000000000) {
                                return 'Rp. ' + new Intl.NumberFormat('id-ID').format(value / 1000000000000) + ' T';
                            } else if (value >= 1000000000) {
                                return 'Rp. ' + new Intl.NumberFormat('id-ID').format(value / 1000000000) + ' M';
                            } else if (value >= 1000000) {
                                return 'Rp. ' + new Intl.NumberFormat('id-ID').format(value / 1000000) + ' Jt';
                            } else {
                                return 'Rp. ' + new Intl.NumberFormat('id-ID').format(value);
                            }
                        } else {
                            return 'Rp. ' + '-';
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

    const pickProgram = (data: any) => {
        setSelectedProgram(data);
        setLoadingDataKegiatans(true);
        getDetailProgram(slug ?? data.instance_alias, data.id, periode?.id, year, view).then((res) => {
            if (res.status === 'success') {
                // push to data.data to selectedProgram
                setSelectedProgram((prevState: any) => ({
                    ...prevState,
                    ...res.data,
                }));
                setAnggaranSeriesProgram(res.data.chart_keuangan);
                setKinerjaSeriesProgram(res.data.chart_kinerja);
            }
            setLoadingDataKegiatans(false);
        });
    }

    // Chart Program Start
    const chartAnggaranProgram: any = {
        series: [
            {
                name: 'Anggaran',
                // data: [168000, 268000, 327000, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                data: AnggaranSeriesProgram?.target?.map((item: any) => item.target),
            },
            {
                name: 'Realisasi Anggaran',
                // data: [165000, 225000, 268000, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                data: AnggaranSeriesProgram?.realisasi?.map((item: any) => item.realisasi),
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
            // labels: AnggaranSeriesProgram?.target?.map((item: any) => item.month_short),
            labels: AnggaranSeriesProgram?.target?.map((item: any) => item.month_name),
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
                        if (themeConfig.showMoney) {
                            if (value >= 1000000000000) {
                                return 'Rp. ' + new Intl.NumberFormat('id-ID').format(value / 1000000000000) + ' T';
                            } else if (value >= 1000000000) {
                                return 'Rp. ' + new Intl.NumberFormat('id-ID').format(value / 1000000000) + ' M';
                            } else if (value >= 1000000) {
                                return 'Rp. ' + new Intl.NumberFormat('id-ID').format(value / 1000000) + ' Jt';
                            } else {
                                return 'Rp. ' + new Intl.NumberFormat('id-ID').format(value);
                            }
                        } else {
                            return 'Rp. ' + '-';
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

    const chartKinerjaProgram: any = {
        series: [
            {
                name: 'Capaian',
                data: KinerjaSeriesProgram?.realisasi?.map((item: any) => item.realisasi),
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
                categories: KinerjaSeriesProgram?.realisasi?.map((item: any) => item.month_name) ?? [],
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
                show: true,
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
    // Chart Program End

    const unPickProgram = () => {
        setSelectedProgram(null);
        setSelectedKegiatan(null);
        setSelectedSubKegiatan(null);
    }

    const pickKegiatan = (data: any) => {
        setSelectedKegiatan(data);
        setLoadingDataSubKegiatans(true);
        getDetaiKegiatan(slug ?? data.instance_alias, data.id, periode?.id, year, view).then((res) => {
            if (res.status === 'success') {
                // push to data.data to selectedProgram
                setSelectedKegiatan((prevState: any) => ({
                    ...prevState,
                    ...res.data,
                }));
                setAnggaranSeriesKegiatan(res.data.chart_keuangan);
                setKinerjaSeriesKegiatan(res.data.chart_kinerja);
            }
            setLoadingDataSubKegiatans(false);
        });
    }

    // Chart Kegiatan Start
    const chartAnggaranKegiatan: any = {
        series: [
            {
                name: 'Anggaran',
                // data: [168000, 268000, 327000, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                data: AnggaranSeriesKegiatan?.target?.map((item: any) => item.target),
            },
            {
                name: 'Realisasi Anggaran',
                // data: [165000, 225000, 268000, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                data: AnggaranSeriesKegiatan?.realisasi?.map((item: any) => item.realisasi),
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
            colors: isDark ? ['purple', 'green'] : ['purple', 'green'],
            markers: {
                discrete: [
                    {
                        seriesIndex: 0,
                        dataPointIndex: new Date().getMonth(),
                        fillColor: 'purple',
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
            // labels: AnggaranSeriesKegiatan?.target?.map((item: any) => item.month_short),
            labels: AnggaranSeriesKegiatan?.target?.map((item: any) => item.month_name),
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
                        if (themeConfig.showMoney) {
                            if (value >= 1000000000000) {
                                return 'Rp. ' + new Intl.NumberFormat('id-ID').format(value / 1000000000000) + ' T';
                            } else if (value >= 1000000000) {
                                return 'Rp. ' + new Intl.NumberFormat('id-ID').format(value / 1000000000) + ' M';
                            } else if (value >= 1000000) {
                                return 'Rp. ' + new Intl.NumberFormat('id-ID').format(value / 1000000) + ' Jt';
                            } else {
                                return 'Rp. ' + new Intl.NumberFormat('id-ID').format(value);
                            }
                        } else {
                            return 'Rp. ' + '-';
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

    const chartKinerjaKegiatan: any = {
        series: [
            {
                name: 'Capaian',
                data: KinerjaSeriesKegiatan?.realisasi?.map((item: any) => item.realisasi),
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
                categories: KinerjaSeriesKegiatan?.realisasi?.map((item: any) => item.month_name) ?? [],
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
                show: true,
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
    // Chart Kegiatan End

    const unPickKegiatan = () => {
        setSelectedKegiatan(null);
        setSelectedSubKegiatan(null);
    }

    const pickSubKegiatan = (data: any) => {
        setSelectedSubKegiatan(data);
        setLoadingDetailRealisasi(true);
        getDetailSubKegiatan(slug ?? data.instance_alias, data.id, periode?.id, year, view).then((res) => {
            if (res.status === 'success') {
                // push to data.data to selectedProgram
                setSelectedSubKegiatan((prevState: any) => ({
                    ...prevState,
                    ...res.data,
                }));
                setAnggaranSeriesSubKegiatan(res.data.chart_keuangan);
                setKinerjaSeriesSubKegiatan(res.data.chart_kinerja);
                setDetailRealisasi(res.data.rincian_realisasi)
            }
            setLoadingDetailRealisasi(false);
        });
    }

    // Chart SubKegiatan Start
    const chartAnggaranSubKegiatan: any = {
        series: [
            {
                name: 'Anggaran',
                // data: [168000, 268000, 327000, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                data: AnggaranSeriesSubKegiatan?.target?.map((item: any) => item.target),
            },
            {
                name: 'Realisasi Anggaran',
                // data: [165000, 225000, 268000, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                data: AnggaranSeriesSubKegiatan?.realisasi?.map((item: any) => item.realisasi),
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
            colors: isDark ? ['orange', 'green'] : ['orange', 'green'],
            markers: {
                discrete: [
                    {
                        seriesIndex: 0,
                        dataPointIndex: new Date().getMonth(),
                        fillColor: 'orange',
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
            // labels: AnggaranSeriesSubKegiatan?.target?.map((item: any) => item.month_short),
            labels: AnggaranSeriesSubKegiatan?.target?.map((item: any) => item.month_name),
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
                        if (themeConfig.showMoney) {
                            if (value >= 1000000000000) {
                                return 'Rp. ' + new Intl.NumberFormat('id-ID').format(value / 1000000000000) + ' T';
                            } else if (value >= 1000000000) {
                                return 'Rp. ' + new Intl.NumberFormat('id-ID').format(value / 1000000000) + ' M';
                            } else if (value >= 1000000) {
                                return 'Rp. ' + new Intl.NumberFormat('id-ID').format(value / 1000000) + ' Jt';
                            } else {
                                return 'Rp. ' + new Intl.NumberFormat('id-ID').format(value);
                            }
                        } else {
                            return 'Rp. ' + '-';
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

    const chartKinerjaSubKegiatan: any = {
        series: [
            {
                name: 'Capaian',
                data: KinerjaSeriesSubKegiatan?.realisasi?.map((item: any) => item.realisasi),
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
                categories: KinerjaSeriesSubKegiatan?.realisasi?.map((item: any) => item.month_name) ?? [],
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
                show: true,
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
    // Chart SubKegiatan End

    const unPickSubKegiatan = () => {
        setSelectedSubKegiatan(null);
    }

    const [tabDetail, setTabDetail] = useState(1);


    function nextImageUrl(src: any, size: any) {
        // return `/_next/image?url=${encodeURIComponent(src)}&w=${size}&q=75`;
        return `${src}?w=${size}&q=75`;
    }

    const [imagesIndex, setImagesIndex] = useState<any>(-1)
    const imageSizes = [16, 32, 48, 64, 96, 128, 256, 384];
    const deviceSizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
    const [openLightBox, setOpenLightBox] = useState(false);

    const slides = detailRealisasi?.files?.filter((item: any) => item?.mime_type.includes('image/')).map((img: any) => ({
        width: img.width ?? 1080,
        height: img.height ?? 1280,
        src: nextImageUrl(img.file, 1080),
        srcSet: imageSizes
            .concat(...deviceSizes)
            .filter((size) => size <= 1080)
            .map((size) => ({
                src: nextImageUrl(img.file, size),
                width: size,
                height: Math.round((1280 / 1080) * size),
            })),
    }));

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
                        <div className="z-[7] mb-16 flex flex-col md:flex-row gap-2 items-center justify-between text-white-light">
                            <div className="order-2 md:order-1">
                                <h5 className="text-lg font-semibold">
                                    {Instance?.name}
                                </h5>
                                <span className='text-md'>
                                    {Instance?.code}
                                </span>
                            </div>

                            <div className="order-1 md:order-2 relative whitespace-nowrap text-xl flex-none w-32 h-32">
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
                                                    <div className="cursor-pointer"
                                                        onClick={() => dispatch(toggleShowMoney(!themeConfig.showMoney))}>
                                                        {themeConfig.showMoney ? (
                                                            <>
                                                                Rp. {new Intl.NumberFormat('id-ID').format(AnggaranSummary?.anggaran ?? 0)}
                                                            </>
                                                        ) : (
                                                            <div className='flex items-center gap-x-2'>
                                                                Rp.
                                                                <FontAwesomeIcon icon={faEyeSlash} className='w-5 h-5' />
                                                            </div>
                                                        )}
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
                                                    <div className="cursor-pointer"
                                                        onClick={() => dispatch(toggleShowMoney(!themeConfig.showMoney))}>
                                                        {themeConfig.showMoney ? (
                                                            <>
                                                                Rp. {new Intl.NumberFormat('id-ID').format(AnggaranSummary?.realisasi ?? 0)}
                                                            </>
                                                        ) : (
                                                            <div className='flex items-center gap-x-2'>
                                                                Rp.
                                                                <FontAwesomeIcon icon={faEyeSlash} className='w-5 h-5' />
                                                            </div>
                                                        )}
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
                    <div className="flex flex-wrap border-b border-white-light dark:border-[#191e3a]">

                        <button
                            onClick={(e) => {
                                setTab('summary');
                            }}
                            className={tab === 'summary' ?
                                `grow min-w-[150px] w-auto rounded-tl-lg bg-primary font-semibold !border-white-light !border-b-white text-white !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:font-semibold ` :
                                `grow min-w-[150px] w-auto rounded-tl-lg bg-white dark:bg-slate-900 !border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:text-primary`}
                            type="button">
                            <FontAwesomeIcon icon={faTachometerAltAverage} className="w-4 h-4 mr-2" />
                            Rangkuman
                        </button>

                        <button
                            onClick={(e) => {
                                setTab('anggaran');
                            }}
                            className={tab === 'anggaran' ?
                                `grow min-w-[150px] w-auto bg-primary font-semibold !border-white-light !border-b-white text-white !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:font-semibold ` :
                                `grow min-w-[150px] w-auto bg-white dark:bg-slate-900 !border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:text-primary`}
                            type="button">
                            <FontAwesomeIcon icon={faSackDollar} className="w-4 h-4 mr-2" />
                            Keuangan
                        </button>

                        <button
                            onClick={(e) => {
                                setTab('kinerja');
                            }}
                            className={tab === 'kinerja' ?
                                `grow min-w-[150px] w-auto bg-primary font-semibold !border-white-light !border-b-white text-white !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:font-semibold ` :
                                `grow min-w-[150px] w-auto bg-white dark:bg-slate-900 !border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:text-primary`}
                            type="button">
                            <FontAwesomeIcon icon={faToolbox} className="w-4 h-4 mr-2" />
                            Kinerja
                        </button>

                        <button
                            onClick={(e) => {
                                setTab('users');
                            }}
                            className={tab === 'users' ?
                                `grow min-w-[150px] w-auto rounded-tr-lg bg-primary font-semibold !border-white-light !border-b-white text-white !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:font-semibold` :
                                `grow min-w-[150px] w-auto bg-white dark:bg-slate-900 rounded-tr-lg !border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:text-primary`}
                            type="button">
                            <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-2" />
                            Pengguna
                        </button>

                    </div>

                    {tab === 'summary' && (
                        <div className="panel rounded-t-none">
                            <div className="h-full grid md:grid-cols-2">
                                <div className="">
                                    <div className="text-center">
                                        <div className="">
                                            Capaian Belanja
                                        </div>
                                        {AnggaranSummary.anggaran_updated_at && (
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
                                        )}
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
                                                className="w-full h-[440px]"
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
                                        {KinerjaSummary.realisasi_updated_at && (
                                            <div className="text-xs">
                                                Diperbarui
                                                <span className='ml-1 font-semibold'>
                                                    {new Date(KinerjaSummary?.realisasi_updated_at).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                        )}
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
                                                className="w-full h-[440px]"
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
                        <div className="relative panel rounded-t-none">
                            <div className="flex flex-col md:flex-row gap-y-3 items-center justify-between">
                                <h5 className="text-lg font-semibold">
                                    Capaian Belanja
                                </h5>
                                <div className="flex items-center gap-x-1 overflow-x-auto w-full md:w-auto md:overflow-x-hidden">
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
                                {isMounted ? (
                                    <div className="min-w-[800px] md:min-w-full max-w-full">
                                        <ReactApexChart
                                            series={chartAnggaran.series}
                                            options={chartAnggaran.options}
                                            type="area"
                                            height={430}
                                            width={'100%'} />
                                    </div>
                                ) : (
                                    <div className="grid min-h-[400px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                        <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-black !border-l-transparent dark:border-white"></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {tab === 'kinerja' && (
                        <div className="relative panel rounded-t-none">
                            <div className="flex flex-col md:flex-row gap-y-3 items-center justify-between">
                                <h5 className="text-lg font-semibold">
                                    Capaian Belanja
                                </h5>
                                <div className="flex items-center gap-x-1 overflow-x-auto w-full md:w-auto md:overflow-x-hidden">
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
                                {isMounted ? (
                                    <div className="min-w-[800px] md:min-w-full max-w-full">
                                        <ReactApexChart
                                            series={apexChartKinerja.series}
                                            options={apexChartKinerja.options}
                                            className="rounded-lg bg-white dark:bg-black overflow-hidden"
                                            type="bar"
                                            height={430}
                                            width={'100%'} />
                                    </div>
                                ) : (
                                    <div className="grid min-h-[350px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                        <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {tab === 'users' && (
                        <div className="relative panel rounded-t-none px-0">
                            <div className="table-responsive h-[500px]">
                                <table>
                                    <thead>
                                        <tr>
                                            <th className="ltr:rounded-l-md rtl:rounded-r-md bg-dark text-white dark:bg-slate-800">
                                                Pengguna
                                            </th>
                                            <th className='bg-dark text-white dark:bg-slate-800'>
                                                Email
                                            </th>
                                            <th className='bg-dark text-white dark:bg-slate-800'>
                                                Jenis Pengguna
                                            </th>
                                            <th className="ltr:rounded-r-md rtl:rounded-l-md bg-dark text-white dark:bg-slate-800">
                                                Aktivitas Terakhir
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {admins?.map((user: any, index: number) => (
                                            <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                                <td className="min-w-[150px] text-black dark:text-white">
                                                    <div className="flex items-center">
                                                        <img
                                                            className="h-14 w-14 object-cover mr-3 bg-white p-1 rounded-full border"
                                                            // src="/assets/images/profile-6.jpeg"
                                                            src={user?.photo}
                                                            alt="avatar" />
                                                        <span className="whitespace-nowrap font-semibold">
                                                            {user?.fullname}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    {user?.email}
                                                </td>
                                                <td>
                                                    <div className="flex items-center justify-center">
                                                        {user?.instance_type === 'kepala' && (
                                                            <span className="badge bg-success shadow-md dark:group-hover:bg-transparent">
                                                                Kepala Dinas
                                                            </span>
                                                        )}
                                                        {user?.instance_type === 'staff' && (
                                                            <span className="badge bg-info shadow-md dark:group-hover:bg-transparent">
                                                                Staff
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-center">
                                                        {user?.last_activity ? (
                                                            <>
                                                                {new Date(user?.last_activity)?.toLocaleDateString('id-ID', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                })}
                                                            </>
                                                        ) : (
                                                            <div className='text-[10px]'>
                                                                Tidak ada aktivitas
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>

            </div>

            <div className="mt-5 p-0">
                <div className="w-full flex items-center flex-wrap bg-white rounded-t">
                    <button
                        onClick={() => {
                            setTab2('capaian')
                        }}
                        className={`${tab2 === 'capaian' ? 'text-white !outline-none before:!w-full bg-blue-500 w-auto' : 'w-20'} rounded-tl text-blue-500 !outline-none relative -mb-[1px] flex items-center justify-center gap-2 p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-blue-500 before:transition-all before:duration-700 hover:before:w-full max-w-full transition-all duration-300`}
                    >
                        <FontAwesomeIcon icon={faChartLine} className='w-5 h-5' />
                        {tab2 === 'capaian' && (
                            <span className='font-semibold whitespace-nowrap text-lg uppercase'>
                                Capaian Kinerja & Keuangan
                            </span>
                        )}
                    </button>

                    {/* <button
                        onClick={() => {
                            setTab2('paket')
                        }}
                        className={`${tab2 === 'paket' ? 'text-white !outline-none before:!w-full bg-blue-500 w-auto' : 'w-20'} text-blue-500 !outline-none relative -mb-[1px] flex items-center justify-center gap-2 p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-blue-500 before:transition-all before:duration-700 hover:before:w-full transition-all duration-300`}
                    >
                        <FontAwesomeIcon icon={faBoxesPacking} className='w-5 h-5' />
                        {tab2 === 'paket' && (
                            <span className='font-semibold whitespace-nowrap text-lg uppercase'>
                                Paket Pekerjaan
                            </span>
                        )}
                    </button> */}

                    <button
                        onClick={() => {
                            setTab2('tujuan-sasaran')
                        }}
                        className={`${tab2 === 'tujuan-sasaran' ? 'text-white !outline-none before:!w-full bg-blue-500 w-auto' : 'w-20'} rounded-tr text-blue-500 !outline-none relative -mb-[1px] flex items-center justify-center gap-2 p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-blue-500 before:transition-all before:duration-700 hover:before:w-full transition-all duration-300`}
                    >
                        <FontAwesomeIcon icon={faProjectDiagram} className='w-5 h-5' />
                        {tab2 === 'tujuan-sasaran' && (
                            <span className='font-semibold whitespace-nowrap text-lg uppercase'>
                                Tujuan & Sasaran
                            </span>
                        )}
                    </button>
                </div>

                {tab2 === 'capaian' && (
                    <div className="space-y-2 mt-4">
                        <div className="font-semibold text-lg pb-3 px-4">
                            PROGRAM {Instance?.name}
                        </div>

                        {loadingDataPrograms && (
                            <div className='flex flex-col items-center justify-center gap-2 p-10'>
                                <LoadingSicaram />
                                <div className="dots-loading text-xl">Memuat Data...</div>
                            </div>
                        )}

                        {!selectedProgram && (
                            <>
                                {dataPrograms.map((program: any, index: number) => (
                                    <div key={`program-` + program.id} onClick={() => {
                                        pickProgram(program);
                                    }}
                                        className="panel !cursor-pointer group hover:bg-blue-500 hover:shadow-md hover:shadow-blue-500 transition-all duration-200">
                                        <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between">
                                            <div className="flex items-center flex-col md:flex-row gap-2 font-semibold group-hover:text-white">
                                                <div className='text-md'>
                                                    {program?.code}
                                                </div>
                                                <div className="">
                                                    <div className='text-[15px]'>
                                                        {program?.name}
                                                    </div>
                                                    <div className="text-[11px] font-normal text-slate-400 group-hover:text-white hidden md:flex items-center gap-2">
                                                        {/* {program?.instance_name} - */}
                                                        {program?.instance_sub_unit?.map((subUnit: any, index: number) => (
                                                            <Tippy content="Bidang / Bagian" placement='top-start'>
                                                                <div className='uppercase'>
                                                                    - {subUnit?.name}
                                                                </div>
                                                            </Tippy>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center flex-col md:flex-row gap-4">
                                                <Tippy content="Anggaran Program">
                                                    <div className="flex flex-col justify-center items-center gap-x-2">
                                                        <div className="text-xs text-center mb-1 text-dark dark:text-slate-400 font-semibold group-hover:text-white">
                                                            Anggaran
                                                        </div>
                                                        <div className='self-end text-dark dark:text-slate-400 group-hover:text-white'>
                                                            {themeConfig.showMoney ? (
                                                                <>
                                                                    Rp. {new Intl.NumberFormat('id-ID', {}).format(program?.anggaran)}
                                                                </>
                                                            ) : (
                                                                <div className='flex items-center gap-x-2'>
                                                                    Rp.
                                                                    <FontAwesomeIcon icon={faEyeSlash} className='w-4 h-4' />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Tippy>

                                                <Tippy content={`Realisasi Keuangan : ${program?.persentase_realisasi_anggaran?.toFixed(2)} %`}>
                                                    <div className="w-[200px]">
                                                        <div className="text-xs text-center mb-1 text-success font-semibold group-hover:text-white">
                                                            Keuangan
                                                        </div>
                                                        <div className="w-full h-4 border bg-slate-200 dark:bg-dark/40 rounded-full flex items-center px-0.5">
                                                            <div
                                                                style={{ width: program?.persentase_realisasi_anggaran + '%' }}
                                                                className={`bg-success h-3 rounded-full rounded-bl-full text-center text-white text-xs`}></div>
                                                        </div>
                                                    </div>
                                                </Tippy>

                                                <Tippy content={`Realisasi Kinerja : ${program?.persentase_realisasi_kinerja?.toFixed(2)} %`}>
                                                    <div className="w-[200px]">
                                                        <div className="text-xs text-center mb-1 text-primary font-semibold group-hover:text-white">
                                                            Kinerja
                                                        </div>
                                                        <div className="w-full h-4 border bg-slate-200 dark:bg-dark/40 rounded-full flex items-center px-0.5">
                                                            <div
                                                                style={{ width: program?.persentase_realisasi_kinerja + '%' }}
                                                                className={`bg-primary h-3 rounded-full rounded-bl-full text-center text-white text-xs`}></div>
                                                        </div>
                                                    </div>
                                                </Tippy>

                                                <div className="">
                                                    <FontAwesomeIcon icon={faAngleDoubleDown} className='w-4 h-4 rotate-180 text-info group-hover:text-white' />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {selectedProgram && (
                            <div className="panel shadow-md shadow-primary">
                                <div className="flex items-center justify-between">
                                    <div className="text-md font-semibold dark:text-white">
                                        {selectedProgram?.code} - {selectedProgram?.name}
                                    </div>
                                    <Tippy content="Tutup Program">
                                        <div
                                            onClick={() => {
                                                unPickProgram();
                                            }}
                                            className='cursor-pointer rounded-full p-2 group hover:shadow'>
                                            <IconX className='w-4 h-4 group-hover:text-primary' />
                                        </div>
                                    </Tippy>
                                </div>
                                <div className="grid grid-cols-10 gap-5">
                                    <div className="col-span-10 md:col-span-7">
                                        {tabSelectedProgram === 'anggaran' && (
                                            <>
                                                {isMounted ? (
                                                    <ReactApexChart series={chartAnggaranProgram.series} options={chartAnggaranProgram.options} type="area" height={430} width={'100%'} />
                                                ) : (
                                                    <div className="grid min-h-[400px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                                        <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-black !border-l-transparent dark:border-white"></span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {tabSelectedProgram === 'kinerja' && (
                                            <>
                                                {isMounted ? (
                                                    <ReactApexChart series={chartKinerjaProgram.series} options={chartKinerjaProgram.options} type="bar" height={430} width={'100%'} />
                                                ) : (
                                                    <div className="grid min-h-[400px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                                        <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-black !border-l-transparent dark:border-white"></span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <div className="col-span-10 md:col-span-3">
                                        <div className="w-full mt-3 flex">

                                            <div
                                                onClick={(e) => {
                                                    setTabSelectedProgram('anggaran')
                                                }}
                                                className={`${tabSelectedProgram === 'anggaran' ? '!border-primary' : '!border-primary border-0 !border-b shadow-inner'} grow border border-b-0 rounded-tl-xl  text-primary !outline-none -mb-[1px] flex gap-2 justify-center items-center border-transparent p-5 py-3 before:inline-block hover:text-primary cursor-pointer font-semibold`}
                                            >
                                                <FontAwesomeIcon icon={faSackDollar} className='w-4 h-4' />
                                                <span>
                                                    KEUANGAN
                                                </span>
                                            </div>

                                            <div
                                                onClick={(e) => {
                                                    setTabSelectedProgram('kinerja')
                                                }}
                                                className={`${tabSelectedProgram === 'kinerja' ? '!border-primary' : '!border-primary border-0 !border-b shadow-inner'} grow border border-b-0 rounded-tr-xl text-primary !outline-none -mb-[1px] flex gap-2 justify-center items-center border-transparent p-5 py-3 before:inline-block hover:text-primary cursor-pointer font-semibold`}
                                            >
                                                <FontAwesomeIcon icon={faToolbox} className='w-4 h-4' />
                                                <span>
                                                    KINERJA
                                                </span>
                                            </div>

                                        </div>

                                        <div className="border border-t-0 rounded-b-xl border-primary min-h-[350px] p-4 pt-10">
                                            {tabSelectedProgram === 'anggaran' && (
                                                <div className="">

                                                    <div className="space-y-9">
                                                        <div className="flex items-center">
                                                            <div className="h-9 w-9 mr-3">
                                                                <div className="grid h-9 w-9 place-content-center  rounded-full bg-primary-light text-primary dark:bg-primary dark:text-primary-light">
                                                                    <FontAwesomeIcon icon={faSackDollar} className='w-3 h-3' />
                                                                </div>
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex font-semibold">
                                                                    <h6>Anggaran</h6>
                                                                    <p className="ltr:ml-auto rtl:mr-auto">
                                                                        {(selectedProgram?.summary?.target_anggaran ||
                                                                            selectedProgram?.summary?.target_anggaran === 0) ? (
                                                                            <>
                                                                                {themeConfig.showMoney ? (
                                                                                    <>
                                                                                        Rp. {new Intl.NumberFormat('id-ID', {}).format(selectedProgram?.summary?.target_anggaran)}
                                                                                    </>
                                                                                ) : (
                                                                                    <div className='flex items-center gap-x-2'>
                                                                                        Rp.
                                                                                        <FontAwesomeIcon icon={faEyeSlash} className='w-4 h-4' />
                                                                                    </div>
                                                                                )}
                                                                            </>
                                                                        ) : (
                                                                            <div className="dots-loading text-xs">...</div>
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <div className="h-9 w-9 mr-3">
                                                                <div className="grid h-9 w-9 place-content-center rounded-full bg-success-light text-success dark:bg-success dark:text-success-light">
                                                                    <FontAwesomeIcon icon={faSackDollar} className='w-3 h-3' />
                                                                </div>
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex font-semibold">
                                                                    <div className="">
                                                                        <h6>
                                                                            Realisasi
                                                                        </h6>
                                                                        <div className="text-[10px] font-normal text-slate-400 flex items-center gap-x-1">
                                                                            {selectedProgram?.summary?.realisasi_anggaran_updated_at && (
                                                                                <>
                                                                                    <FontAwesomeIcon icon={faClock} className='w-3 h-3' />
                                                                                    {new Date(selectedProgram?.summary?.realisasi_anggaran_updated_at)?.toLocaleDateString('id-ID', {
                                                                                        year: 'numeric',
                                                                                        month: 'long',
                                                                                        day: 'numeric',
                                                                                    })}
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <p className="ltr:ml-auto rtl:mr-auto">
                                                                        {(selectedProgram?.summary?.realisasi_anggaran ||
                                                                            selectedProgram?.summary?.realisasi_anggaran === 0) ? (
                                                                            <>
                                                                                {themeConfig.showMoney ? (
                                                                                    <>
                                                                                        Rp. {new Intl.NumberFormat('id-ID', {}).format(selectedProgram?.summary?.realisasi_anggaran)}

                                                                                    </>
                                                                                ) : (
                                                                                    <div className='flex items-center gap-x-2'>
                                                                                        Rp.
                                                                                        <FontAwesomeIcon icon={faEyeSlash} className='w-4 h-4' />
                                                                                    </div>
                                                                                )}
                                                                            </>
                                                                        ) : (
                                                                            <div className="dots-loading text-xs">...</div>
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <div className="h-9 w-9 mr-3">
                                                                <div className="grid h-9 w-9 place-content-center rounded-full bg-info-light text-info dark:bg-info dark:text-info-light">
                                                                    <FontAwesomeIcon icon={faPercent} className='w-3 h-3' />
                                                                </div>
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="mb-2 flex font-semibold text-white-dark">
                                                                    <h6>Persentase Capaian</h6>
                                                                    <p className="ltr:ml-auto rtl:mr-auto">
                                                                        {selectedProgram?.summary?.persentase_realisasi_anggaran && (
                                                                            <>
                                                                                {selectedProgram?.summary?.persentase_realisasi_anggaran.toFixed(2)} %
                                                                            </>
                                                                        )}
                                                                    </p>
                                                                </div>
                                                                <div className="h-2 w-full rounded-full bg-dark-light shadow dark:bg-[#1b2e4b]">
                                                                    <div
                                                                        className="h-full w-full rounded-full bg-gradient-to-r from-[#75f8ff] to-[#24efec] max-w-full"
                                                                        style={{ width: selectedProgram?.summary?.persentase_realisasi_anggaran + '%' }}></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {tabSelectedProgram === 'kinerja' && (
                                                <div className="space-y-9">
                                                    <div className="flex items-center">
                                                        <div className="h-9 w-9 mr-3">
                                                            <div className="grid h-9 w-9 place-content-center  rounded-full bg-primary-light text-primary dark:bg-primary dark:text-primary-light">
                                                                <FontAwesomeIcon icon={faToolbox} className='w-3 h-3' />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex font-semibold">
                                                                <h6>Target</h6>
                                                                <p className="ltr:ml-auto rtl:mr-auto">
                                                                    {(selectedProgram?.summary?.target_kinerja ||
                                                                        selectedProgram?.summary?.target_kinerja === 0) ? (
                                                                        <>
                                                                            {selectedProgram?.summary?.target_kinerja.toFixed(2)} %
                                                                        </>
                                                                    ) : (
                                                                        <div className="dots-loading text-xs">...</div>
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center">
                                                        <div className="h-9 w-9 mr-3">
                                                            <div className="grid h-9 w-9 place-content-center rounded-full bg-success-light text-success dark:bg-success dark:text-success-light">
                                                                <FontAwesomeIcon icon={faToolbox} className='w-3 h-3' />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex font-semibold">
                                                                <div className="">
                                                                    <h6>
                                                                        Realisasi
                                                                    </h6>
                                                                    <div className="text-[10px] font-normal text-slate-400 flex items-center gap-x-1">
                                                                        {selectedProgram?.summary?.realisasi_kinerja_updated_at && (
                                                                            <>
                                                                                <FontAwesomeIcon icon={faClock} className='w-3 h-3' />
                                                                                {new Date(selectedProgram?.summary?.realisasi_kinerja_updated_at)?.toLocaleDateString('id-ID', {
                                                                                    year: 'numeric',
                                                                                    month: 'long',
                                                                                    day: 'numeric',
                                                                                })}
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <p className="ltr:ml-auto rtl:mr-auto">
                                                                    {(selectedProgram?.summary?.realisasi_kinerja ||
                                                                        selectedProgram?.summary?.realisasi_kinerja === 0) ? (
                                                                        <>
                                                                            {selectedProgram?.summary?.realisasi_kinerja?.toFixed(2)} %
                                                                        </>
                                                                    ) : (
                                                                        <div className="dots-loading text-xs">...</div>
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedProgram && (
                            <>
                                <div className="pt-10">
                                    <div className="font-semibold text-lg pb-3 px-4">
                                        KEGIATAN
                                    </div>
                                </div>

                                {loadingDataKegiatans && (
                                    <div className='flex flex-col items-center justify-center gap-2 p-10'>
                                        <LoadingSicaram />
                                        <div className="dots-loading text-xl">Memuat Data...</div>
                                    </div>
                                )}

                                {!selectedKegiatan && (
                                    <>
                                        {selectedProgram?.kegiatans?.map((kegiatan: any, index: number) => (
                                            <div key={`kegiatan-` + kegiatan.id}
                                                onClick={() => {
                                                    pickKegiatan(kegiatan);
                                                }}
                                                className="panel !cursor-pointer group bg-slate-50 hover:bg-purple-500 hover:shadow-md hover:shadow-purple-500 transition-all duration-200">
                                                <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between">
                                                    <div className="flex items-center flex-col md:flex-row gap-2 font-semibold group-hover:text-white">
                                                        <div className='text-md'>
                                                            {kegiatan?.code}
                                                        </div>
                                                        <div className="">
                                                            <div className='text-[15px]'>
                                                                {kegiatan?.name}
                                                            </div>
                                                            <div className="text-[11px] font-normal text-slate-400 group-hover:text-white hidden md:block">
                                                                {Instance?.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 flex-col md:flex-row">
                                                        <Tippy content="Anggaran Program">
                                                            <div className="flex flex-col justify-center items-center gap-x-2">
                                                                <div className="text-xs text-center mb-1 text-dark dark:text-slate-400 font-semibold group-hover:text-white">
                                                                    Anggaran
                                                                </div>
                                                                <div className='self-end text-dark dark:text-slate-400 group-hover:text-white'>
                                                                    {themeConfig.showMoney ? (
                                                                        <>
                                                                            Rp. {new Intl.NumberFormat('id-ID', {}).format(kegiatan?.anggaran)}
                                                                        </>
                                                                    ) : (
                                                                        <div className='flex items-center gap-x-2'>
                                                                            Rp.
                                                                            <FontAwesomeIcon icon={faEyeSlash} className='w-4 h-4' />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </Tippy>

                                                        <Tippy content={`Realisasi Keuangan : ${kegiatan?.persentase_realisasi_anggaran?.toFixed(2)} %`}>
                                                            <div className="w-[200px]">
                                                                <div className="text-xs text-center mb-1 text-success font-semibold group-hover:text-white">
                                                                    Keuangan
                                                                </div>
                                                                <div className="w-full h-4 border bg-slate-200 dark:bg-dark/40 rounded-full flex items-center px-0.5">
                                                                    <div
                                                                        style={{ width: kegiatan?.persentase_realisasi_anggaran + '%' }}
                                                                        className={`bg-success h-3 rounded-full rounded-bl-full text-center text-white text-xs`}></div>
                                                                </div>
                                                            </div>
                                                        </Tippy>

                                                        <Tippy content={`Realisasi Kinerja : ${kegiatan?.persentase_realisasi_kinerja?.toFixed(2)} %`}>
                                                            <div className="w-[200px]">
                                                                <div className="text-xs text-center mb-1 text-primary font-semibold group-hover:text-white">
                                                                    Kinerja
                                                                </div>
                                                                <div className="w-full h-4 border bg-slate-200 dark:bg-dark/40 rounded-full flex items-center px-0.5">
                                                                    <div
                                                                        style={{ width: kegiatan?.persentase_realisasi_kinerja + '%' }}
                                                                        className={`bg-primary h-3 rounded-full rounded-bl-full text-center text-white text-xs`}></div>
                                                                </div>
                                                            </div>
                                                        </Tippy>

                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}

                                {selectedKegiatan && (
                                    <div className="panel shadow-md shadow-secondary">
                                        <div className="flex items-center justify-between">
                                            <div className="text-md font-semibold dark:text-white">
                                                {selectedKegiatan?.code} - {selectedKegiatan?.name}
                                            </div>
                                            <Tippy content="Tutup Kegiatan">
                                                <div
                                                    onClick={() => {
                                                        unPickKegiatan();
                                                    }}
                                                    className='cursor-pointer rounded-full p-2 group hover:shadow'>
                                                    <IconX className='w-4 h-4 group-hover:text-secondary' />
                                                </div>
                                            </Tippy>
                                        </div>
                                        <div className="grid grid-cols-10 gap-5">
                                            <div className="col-span-10 md:col-span-7">
                                                {tabSelectedKegiatan === 'anggaran' && (
                                                    <>
                                                        {isMounted ? (
                                                            <ReactApexChart series={chartAnggaranKegiatan.series} options={chartAnggaranKegiatan.options} type="area" height={430} width={'100%'} />
                                                        ) : (
                                                            <div className="grid min-h-[400px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                                                <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-black !border-l-transparent dark:border-white"></span>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                                {tabSelectedKegiatan === 'kinerja' && (
                                                    <>
                                                        {isMounted ? (
                                                            <ReactApexChart series={chartKinerjaKegiatan.series} options={chartKinerjaKegiatan.options} type="bar" height={430} width={'100%'} />
                                                        ) : (
                                                            <div className="grid min-h-[400px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                                                <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-black !border-l-transparent dark:border-white"></span>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                            <div className="col-span-10 md:col-span-3">
                                                <div className="w-full mt-3 flex">

                                                    <div
                                                        onClick={(e) => {
                                                            setTabSelectedKegiatan('anggaran')
                                                        }}
                                                        className={`${tabSelectedKegiatan === 'anggaran' ? '!border-secondary' : '!border-secondary border-0 !border-b shadow-inner'} grow border border-b-0 rounded-tl-xl  text-secondary !outline-none -mb-[1px] flex gap-2 justify-center items-center border-transparent p-5 py-3 before:inline-block hover:text-secondary cursor-pointer font-semibold`}
                                                    >
                                                        <FontAwesomeIcon icon={faSackDollar} className='w-4 h-4' />
                                                        <span>
                                                            KEUANGAN
                                                        </span>
                                                    </div>

                                                    <div
                                                        onClick={(e) => {
                                                            setTabSelectedKegiatan('kinerja')
                                                        }}
                                                        className={`${tabSelectedKegiatan === 'kinerja' ? '!border-secondary' : '!border-secondary border-0 !border-b shadow-inner'} grow border border-b-0 rounded-tr-xl text-secondary !outline-none -mb-[1px] flex gap-2 justify-center items-center border-transparent p-5 py-3 before:inline-block hover:text-secondary cursor-pointer font-semibold`}
                                                    >
                                                        <FontAwesomeIcon icon={faToolbox} className='w-4 h-4' />
                                                        <span>
                                                            KINERJA
                                                        </span>
                                                    </div>

                                                </div>

                                                <div className="border border-t-0 rounded-b-xl border-secondary min-h-[350px] p-4 pt-10">
                                                    {tabSelectedKegiatan === 'anggaran' && (
                                                        <div className="">

                                                            <div className="space-y-9">
                                                                <div className="flex items-center">
                                                                    <div className="h-9 w-9 mr-3">
                                                                        <div className="grid h-9 w-9 place-content-center  rounded-full bg-secondary-light text-secondary dark:bg-secondary dark:text-secondary-light">
                                                                            <FontAwesomeIcon icon={faSackDollar} className='w-3 h-3' />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="flex font-semibold">
                                                                            <h6>Anggaran</h6>
                                                                            <p className="ltr:ml-auto rtl:mr-auto">
                                                                                {(selectedKegiatan?.summary?.target_anggaran ||
                                                                                    selectedKegiatan?.summary?.target_anggaran === 0) ? (
                                                                                    <>
                                                                                        {themeConfig.showMoney ? (
                                                                                            <>
                                                                                                Rp. {new Intl.NumberFormat('id-ID', {}).format(selectedKegiatan?.summary?.target_anggaran)}
                                                                                            </>
                                                                                        ) : (
                                                                                            <div className='flex items-center gap-x-2'>
                                                                                                Rp.
                                                                                                <FontAwesomeIcon icon={faEyeSlash} className='w-4 h-4' />
                                                                                            </div>
                                                                                        )}
                                                                                    </>
                                                                                ) : (
                                                                                    <div className="dots-loading text-xs">...</div>
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <div className="h-9 w-9 mr-3">
                                                                        <div className="grid h-9 w-9 place-content-center rounded-full bg-success-light text-success dark:bg-success dark:text-success-light">
                                                                            <FontAwesomeIcon icon={faSackDollar} className='w-3 h-3' />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="flex font-semibold">
                                                                            <div className="">
                                                                                <h6>
                                                                                    Realisasi
                                                                                </h6>
                                                                                <div className="text-[10px] font-normal text-slate-400 flex items-center gap-x-1">
                                                                                    {selectedKegiatan?.summary?.realisasi_anggaran_updated_at && (
                                                                                        <>
                                                                                            <FontAwesomeIcon icon={faClock} className='w-3 h-3' />
                                                                                            {new Date(selectedKegiatan?.summary?.realisasi_anggaran_updated_at)?.toLocaleDateString('id-ID', {
                                                                                                year: 'numeric',
                                                                                                month: 'long',
                                                                                                day: 'numeric',
                                                                                            })}
                                                                                        </>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <p className="ltr:ml-auto rtl:mr-auto">
                                                                                {(selectedKegiatan?.summary?.realisasi_anggaran ||
                                                                                    selectedKegiatan?.summary?.realisasi_anggaran === 0) ? (
                                                                                    <>
                                                                                        {themeConfig.showMoney ? (
                                                                                            <>
                                                                                                Rp. {new Intl.NumberFormat('id-ID', {}).format(selectedKegiatan?.summary?.realisasi_anggaran)}
                                                                                            </>
                                                                                        ) : (
                                                                                            <div className='flex items-center gap-x-2'>
                                                                                                Rp.
                                                                                                <FontAwesomeIcon icon={faEyeSlash} className='w-4 h-4' />
                                                                                            </div>
                                                                                        )}
                                                                                    </>
                                                                                ) : (
                                                                                    <div className="dots-loading text-xs">...</div>
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <div className="h-9 w-9 mr-3">
                                                                        <div className="grid h-9 w-9 place-content-center rounded-full bg-info-light text-info dark:bg-info dark:text-info-light">
                                                                            <FontAwesomeIcon icon={faPercent} className='w-3 h-3' />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="mb-2 flex font-semibold text-white-dark">
                                                                            <h6>Persentase Capaian</h6>
                                                                            <p className="ltr:ml-auto rtl:mr-auto">
                                                                                {selectedKegiatan?.summary?.persentase_realisasi_anggaran && (
                                                                                    <>
                                                                                        {selectedKegiatan?.summary?.persentase_realisasi_anggaran.toFixed(2)} %
                                                                                    </>
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                        <div className="h-2 w-full rounded-full bg-dark-light shadow dark:bg-[#1b2e4b]">
                                                                            <div
                                                                                className="h-full w-full rounded-full bg-gradient-to-r from-[#75f8ff] to-[#24efec] max-w-full"
                                                                                style={{ width: selectedKegiatan?.summary?.persentase_realisasi_anggaran + '%' }}></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {tabSelectedKegiatan === 'kinerja' && (
                                                        <div className="space-y-9">
                                                            <div className="flex items-center">
                                                                <div className="h-9 w-9 mr-3">
                                                                    <div className="grid h-9 w-9 place-content-center  rounded-full bg-secondary-light text-secondary dark:bg-secondary dark:text-secondary-light">
                                                                        <FontAwesomeIcon icon={faToolbox} className='w-3 h-3' />
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex font-semibold">
                                                                        <h6>Target</h6>
                                                                        <p className="ltr:ml-auto rtl:mr-auto">
                                                                            {(selectedKegiatan?.summary?.target_kinerja ||
                                                                                selectedKegiatan?.summary?.target_kinerja === 0) ? (
                                                                                <>
                                                                                    {selectedKegiatan?.summary?.target_kinerja.toFixed(2)} %
                                                                                </>
                                                                            ) : (
                                                                                <div className="dots-loading text-xs">...</div>
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center">
                                                                <div className="h-9 w-9 mr-3">
                                                                    <div className="grid h-9 w-9 place-content-center rounded-full bg-success-light text-success dark:bg-success dark:text-success-light">
                                                                        <FontAwesomeIcon icon={faToolbox} className='w-3 h-3' />
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex font-semibold">
                                                                        <div className="">
                                                                            <h6>
                                                                                Realisasi
                                                                            </h6>
                                                                            <div className="text-[10px] font-normal text-slate-400 flex items-center gap-x-1">
                                                                                {selectedKegiatan?.summary?.realisasi_kinerja_updated_at && (
                                                                                    <>
                                                                                        <FontAwesomeIcon icon={faClock} className='w-3 h-3' />
                                                                                        {new Date(selectedKegiatan?.summary?.realisasi_kinerja_updated_at)?.toLocaleDateString('id-ID', {
                                                                                            year: 'numeric',
                                                                                            month: 'long',
                                                                                            day: 'numeric',
                                                                                        })}
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <p className="ltr:ml-auto rtl:mr-auto">
                                                                            {(selectedKegiatan?.summary?.realisasi_kinerja ||
                                                                                selectedKegiatan?.summary?.realisasi_kinerja === 0) ? (
                                                                                <>
                                                                                    {selectedKegiatan?.summary?.realisasi_kinerja.toFixed(2)} %
                                                                                </>
                                                                            ) : (
                                                                                <div className="dots-loading text-xs">...</div>
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedKegiatan && (
                                    <>
                                        <div className="pt-10">
                                            <div className="font-semibold text-lg pb-3 px-4 uppercase">
                                                SUB KEGIATAN
                                            </div>
                                        </div>

                                        {loadingDataSubKegiatans && (
                                            <div className='flex flex-col items-center justify-center gap-2 p-10'>
                                                <LoadingSicaram />
                                                <div className="dots-loading text-xl">Memuat Data...</div>
                                            </div>
                                        )}

                                        {!selectedSubKegiatan && (
                                            <>
                                                {selectedKegiatan?.sub_kegiatans?.map((subKegiatan: any, index: number) => (
                                                    <div key={`sub-kegiatan-` + subKegiatan.id}
                                                        onClick={() => {
                                                            pickSubKegiatan(subKegiatan);
                                                        }}
                                                        className="panel !cursor-pointer group bg-slate-50 hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500 dark:hover:bg-amber-800 transition-all duration-200">
                                                        <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between">
                                                            <div className="flex items-center flex-col md:flex-row gap-2 font-semibold group-hover:text-white">
                                                                <div className='text-md'>
                                                                    {subKegiatan?.code}
                                                                </div>
                                                                <div className="">
                                                                    <div className='text-[15px]'>
                                                                        {subKegiatan?.name}
                                                                    </div>
                                                                    <div className="text-[11px] font-normal text-slate-400 group-hover:text-white hidden md:block">
                                                                        {Instance?.name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4 flex-col md:flex-row">
                                                                <Tippy content="Anggaran Program">
                                                                    <div className="flex flex-col justify-center items-center gap-x-2">
                                                                        <div className="text-xs text-center mb-1 text-dark dark:text-slate-400 font-semibold group-hover:text-white">
                                                                            Anggaran
                                                                        </div>
                                                                        <div className='self-end text-dark dark:text-slate-400 group-hover:text-white'>
                                                                            {themeConfig.showMoney ? (
                                                                                <>
                                                                                    Rp. {new Intl.NumberFormat('id-ID', {}).format(subKegiatan?.anggaran)}
                                                                                </>
                                                                            ) : (
                                                                                <div className='flex items-center gap-x-2'>
                                                                                    Rp.
                                                                                    <FontAwesomeIcon icon={faEyeSlash} className='w-4 h-4' />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </Tippy>

                                                                <Tippy content={`Realisasi Keuangan : ${subKegiatan?.persentase_realisasi_anggaran?.toFixed(2)} %`}>
                                                                    <div className="w-[200px]">
                                                                        <div className="text-xs text-center mb-1 text-success font-semibold group-hover:text-white">
                                                                            Keuangan
                                                                        </div>
                                                                        <div className="w-full h-4 border bg-slate-200 dark:bg-dark/40 rounded-full flex items-center px-0.5">
                                                                            <div
                                                                                style={{ width: subKegiatan?.persentase_realisasi_anggaran + '%' }}
                                                                                className={`bg-success h-3 rounded-full rounded-bl-full text-center text-white text-xs`}></div>
                                                                        </div>
                                                                    </div>
                                                                </Tippy>

                                                                <Tippy content={`Realisasi Kinerja : ${subKegiatan?.persentase_realisasi_kinerja?.toFixed(2)} %`}>
                                                                    <div className="w-[200px]">
                                                                        <div className="text-xs text-center mb-1 text-primary font-semibold group-hover:text-white">
                                                                            Kinerja
                                                                        </div>
                                                                        <div className="w-full h-4 border bg-slate-200 dark:bg-dark/40 rounded-full flex items-center px-0.5">
                                                                            <div
                                                                                style={{ width: subKegiatan?.persentase_realisasi_kinerja + '%' }}
                                                                                className={`bg-primary h-3 rounded-full rounded-bl-full text-center text-white text-xs`}></div>
                                                                        </div>
                                                                    </div>
                                                                </Tippy>

                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        )}

                                        {selectedSubKegiatan && (

                                            <div className="panel shadow-md shadow-warning">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-md font-semibold dark:text-white">
                                                        {selectedSubKegiatan?.code} - {selectedSubKegiatan?.name}
                                                    </div>
                                                    <Tippy content="Tutup Program">
                                                        <div
                                                            onClick={() => {
                                                                unPickSubKegiatan();
                                                            }}
                                                            className='cursor-pointer rounded-full p-2 group hover:shadow'>
                                                            <IconX className='w-4 h-4 group-hover:text-warning' />
                                                        </div>
                                                    </Tippy>
                                                </div>
                                                <div className="grid grid-cols-10 gap-5">
                                                    <div className="col-span-10 md:col-span-7">
                                                        {tabSelectedSubKegiatan === 'anggaran' && (
                                                            <>
                                                                {isMounted ? (
                                                                    <ReactApexChart series={chartAnggaranSubKegiatan.series} options={chartAnggaranSubKegiatan.options} type="area" height={430} width={'100%'} />
                                                                ) : (
                                                                    <div className="grid min-h-[400px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                                                        <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-black !border-l-transparent dark:border-white"></span>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                        {tabSelectedSubKegiatan === 'kinerja' && (
                                                            <>
                                                                {isMounted ? (
                                                                    <ReactApexChart series={chartKinerjaSubKegiatan.series} options={chartKinerjaSubKegiatan.options} type="bar" height={430} width={'100%'} />
                                                                ) : (
                                                                    <div className="grid min-h-[400px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                                                        <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-black !border-l-transparent dark:border-white"></span>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="col-span-10 md:col-span-3">
                                                        <div className="w-full mt-3 flex">

                                                            <div
                                                                onClick={(e) => {
                                                                    setTabSelectedSubKegiatan('anggaran')
                                                                }}
                                                                className={`${tabSelectedSubKegiatan === 'anggaran' ? '!border-warning' : '!border-warning border-0 !border-b shadow-inner'} grow border border-b-0 rounded-tl-xl  text-warning !outline-none -mb-[1px] flex gap-2 justify-center items-center border-transparent p-5 py-3 before:inline-block hover:text-warning cursor-pointer font-semibold`}
                                                            >
                                                                <FontAwesomeIcon icon={faSackDollar} className='w-4 h-4' />
                                                                <span>
                                                                    KEUANGAN
                                                                </span>
                                                            </div>

                                                            <div
                                                                onClick={(e) => {
                                                                    setTabSelectedSubKegiatan('kinerja')
                                                                }}
                                                                className={`${tabSelectedSubKegiatan === 'kinerja' ? '!border-warning' : '!border-warning border-0 !border-b shadow-inner'} grow border border-b-0 rounded-tr-xl text-warning !outline-none -mb-[1px] flex gap-2 justify-center items-center border-transparent p-5 py-3 before:inline-block hover:text-warning cursor-pointer font-semibold`}
                                                            >
                                                                <FontAwesomeIcon icon={faToolbox} className='w-4 h-4' />
                                                                <span>
                                                                    KINERJA
                                                                </span>
                                                            </div>

                                                        </div>

                                                        <div className="border border-t-0 rounded-b-xl border-warning min-h-[350px] p-4 pt-10">
                                                            {tabSelectedSubKegiatan === 'anggaran' && (
                                                                <div className="">

                                                                    <div className="space-y-9">
                                                                        <div className="flex items-center">
                                                                            <div className="h-9 w-9 mr-3">
                                                                                <div className="grid h-9 w-9 place-content-center  rounded-full bg-warning-light text-warning dark:bg-warning dark:text-warning-light">
                                                                                    <FontAwesomeIcon icon={faSackDollar} className='w-3 h-3' />
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <div className="flex font-semibold">
                                                                                    <h6>Anggaran</h6>
                                                                                    <p className="ltr:ml-auto rtl:mr-auto">
                                                                                        {(selectedSubKegiatan?.summary?.target_anggaran ||
                                                                                            selectedSubKegiatan?.summary?.target_anggaran === 0) ? (
                                                                                            <>
                                                                                                {themeConfig.showMoney ? (
                                                                                                    <>
                                                                                                        Rp. {new Intl.NumberFormat('id-ID', {}).format(selectedSubKegiatan?.summary?.target_anggaran)}
                                                                                                    </>
                                                                                                ) : (
                                                                                                    <div className='flex items-center gap-x-2'>
                                                                                                        Rp.
                                                                                                        <FontAwesomeIcon icon={faEyeSlash} className='w-4 h-4' />
                                                                                                    </div>
                                                                                                )}
                                                                                            </>
                                                                                        ) : (
                                                                                            <div className="dots-loading text-xs">...</div>
                                                                                        )}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center">
                                                                            <div className="h-9 w-9 mr-3">
                                                                                <div className="grid h-9 w-9 place-content-center rounded-full bg-success-light text-success dark:bg-success dark:text-success-light">
                                                                                    <FontAwesomeIcon icon={faSackDollar} className='w-3 h-3' />
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <div className="flex font-semibold">
                                                                                    <div className="">
                                                                                        <h6>
                                                                                            Realisasi
                                                                                        </h6>
                                                                                        <div className="text-[10px] font-normal text-slate-400 flex items-center gap-x-1">
                                                                                            {selectedSubKegiatan?.summary?.realisasi_anggaran_updated_at && (
                                                                                                <>
                                                                                                    <FontAwesomeIcon icon={faClock} className='w-3 h-3' />
                                                                                                    {new Date(selectedSubKegiatan?.summary?.realisasi_anggaran_updated_at)?.toLocaleDateString('id-ID', {
                                                                                                        year: 'numeric',
                                                                                                        month: 'long',
                                                                                                        day: 'numeric',
                                                                                                    })}
                                                                                                </>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                    <p className="ltr:ml-auto rtl:mr-auto">
                                                                                        {(selectedSubKegiatan?.summary?.realisasi_anggaran ||
                                                                                            selectedSubKegiatan?.summary?.realisasi_anggaran === 0) ? (
                                                                                            <>
                                                                                                {themeConfig.showMoney ? (
                                                                                                    <>
                                                                                                        Rp. {new Intl.NumberFormat('id-ID', {}).format(selectedSubKegiatan?.summary?.realisasi_anggaran)}
                                                                                                    </>
                                                                                                ) : (
                                                                                                    <div className='flex items-center gap-x-2'>
                                                                                                        Rp.
                                                                                                        <FontAwesomeIcon icon={faEyeSlash} className='w-4 h-4' />
                                                                                                    </div>
                                                                                                )}
                                                                                            </>
                                                                                        ) : (
                                                                                            <div className="dots-loading text-xs">...</div>
                                                                                        )}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center">
                                                                            <div className="h-9 w-9 mr-3">
                                                                                <div className="grid h-9 w-9 place-content-center rounded-full bg-info-light text-info dark:bg-info dark:text-info-light">
                                                                                    <FontAwesomeIcon icon={faPercent} className='w-3 h-3' />
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <div className="mb-2 flex font-semibold text-white-dark">
                                                                                    <h6>Persentase Capaian</h6>
                                                                                    <p className="ltr:ml-auto rtl:mr-auto">
                                                                                        {selectedSubKegiatan?.summary?.persentase_realisasi_anggaran && (
                                                                                            <>
                                                                                                {selectedSubKegiatan?.summary?.persentase_realisasi_anggaran.toFixed(2)} %
                                                                                            </>
                                                                                        )}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="h-2 w-full rounded-full bg-dark-light shadow dark:bg-[#1b2e4b]">
                                                                                    <div
                                                                                        className="h-full w-full rounded-full bg-gradient-to-r from-[#75f8ff] to-[#24efec] max-w-full"
                                                                                        style={{ width: selectedSubKegiatan?.summary?.persentase_realisasi_anggaran + '%' }}></div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {tabSelectedSubKegiatan === 'kinerja' && (
                                                                <div className="space-y-9">
                                                                    <div className="flex items-center">
                                                                        <div className="h-9 w-9 mr-3">
                                                                            <div className="grid h-9 w-9 place-content-center  rounded-full bg-warning-light text-warning dark:bg-warning dark:text-warning-light">
                                                                                <FontAwesomeIcon icon={faToolbox} className='w-3 h-3' />
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <div className="flex font-semibold">
                                                                                <h6>Target</h6>
                                                                                <p className="ltr:ml-auto rtl:mr-auto">
                                                                                    {(selectedSubKegiatan?.summary?.target_kinerja ||
                                                                                        selectedSubKegiatan?.summary?.target_kinerja === 0) ? (
                                                                                        <>
                                                                                            {selectedSubKegiatan?.summary?.target_kinerja.toFixed(2)} %
                                                                                        </>
                                                                                    ) : (
                                                                                        <div className="dots-loading text-xs">...</div>
                                                                                    )}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center">
                                                                        <div className="h-9 w-9 mr-3">
                                                                            <div className="grid h-9 w-9 place-content-center rounded-full bg-success-light text-success dark:bg-success dark:text-success-light">
                                                                                <FontAwesomeIcon icon={faToolbox} className='w-3 h-3' />
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <div className="flex font-semibold">
                                                                                <div className="">
                                                                                    <h6>
                                                                                        Realisasi
                                                                                    </h6>
                                                                                    <div className="text-[10px] font-normal text-slate-400 flex items-center gap-x-1">
                                                                                        {selectedSubKegiatan?.summary?.realisasi_kinerja_updated_at && (
                                                                                            <>
                                                                                                <FontAwesomeIcon icon={faClock} className='w-3 h-3' />
                                                                                                {new Date(selectedSubKegiatan?.summary?.realisasi_kinerja_updated_at)?.toLocaleDateString('id-ID', {
                                                                                                    year: 'numeric',
                                                                                                    month: 'long',
                                                                                                    day: 'numeric',
                                                                                                })}
                                                                                            </>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <p className="ltr:ml-auto rtl:mr-auto">
                                                                                    {(selectedSubKegiatan?.summary?.realisasi_kinerja ||
                                                                                        selectedSubKegiatan?.summary?.realisasi_kinerja === 0) ? (
                                                                                        <>
                                                                                            {selectedSubKegiatan?.summary?.realisasi_kinerja.toFixed(2)} %
                                                                                        </>
                                                                                    ) : (
                                                                                        <div className="dots-loading text-xs">...</div>
                                                                                    )}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}

                        {selectedSubKegiatan && (
                            <div className="panel">
                                <div className="flex overflow-x-auto">

                                    <button
                                        onClick={(e) => {
                                            setTabDetail(1);
                                        }}
                                        className={tabDetail === 1 ?
                                            `w-full rounded-tl-lg bg-primary font-semibold !border-white-light !border-b-white text-white !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:font-semibold ` :
                                            `w-full rounded-tl-lg bg-white dark:bg-slate-900 !border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:text-primary`}
                                        type="button">
                                        <FontAwesomeIcon icon={faTachometerAltAverage} className="w-4 h-4 mr-2 flex-none" />
                                        <span>
                                            Rincian Realisasi
                                        </span>
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            setTabDetail(2);
                                        }}
                                        className={tabDetail === 2 ?
                                            `w-full bg-primary font-semibold !border-white-light !border-b-white text-white !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:font-semibold ` :
                                            `w-full bg-white dark:bg-slate-900 !border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:text-primary`}
                                        type="button">
                                        <FontAwesomeIcon icon={faSackDollar} className="w-4 h-4 mr-2 flex-none" />
                                        <span>
                                            Sumber Dana
                                        </span>
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            setTabDetail(3);
                                        }}
                                        className={tabDetail === 3 ?
                                            `w-full bg-primary font-semibold !border-white-light !border-b-white text-white !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:font-semibold ` :
                                            `w-full bg-white dark:bg-slate-900 !border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:text-primary`}
                                        type="button">
                                        <FontAwesomeIcon icon={faQuestionCircle} className="w-4 h-4 mr-2 flex-none" />
                                        <span>
                                            Keterangan
                                        </span>
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            setTabDetail(4);
                                        }}
                                        className={tabDetail === 4 ?
                                            `w-full rounded-tr-lg bg-primary font-semibold !border-white-light !border-b-white text-white !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:font-semibold ` :
                                            `w-full rounded-tr-lg bg-white dark:bg-slate-900 !border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:text-primary`}
                                        type="button">
                                        <FontAwesomeIcon icon={faFileSignature} className="w-4 h-4 mr-2 flex-none" />
                                        <span>
                                            Kontrak
                                        </span>
                                    </button>

                                </div>


                                {loadingDetailRealisasi == false && (
                                    <>
                                        {tabDetail == 1 && (
                                            <div className="table-responsive">
                                                <table className=''>
                                                    <thead className='!bg-slate-800 sticky top-0 left-0 w-full'>
                                                        <tr>
                                                            <th className='!bg-slate-800 !text-white !text-center !w-[150px]'>
                                                                Kode Rekening
                                                            </th>
                                                            <th className='!bg-slate-800 !text-white !text-center'>
                                                                Uraian
                                                            </th>
                                                            <th className='!bg-slate-800 !text-white !text-center !w-[120px]'>
                                                                Koefisien Target
                                                            </th>
                                                            <th className='!bg-slate-800 !text-white !text-center !w-[120px]'>
                                                                Koefisien Realisasi
                                                            </th>
                                                            <th className='!bg-slate-800 !text-white !text-center !w-[120px]'>
                                                                Harga Satuan
                                                            </th>
                                                            <th className='!bg-slate-800 !text-white !text-center !w-[200px]'>
                                                                Anggaran
                                                            </th>
                                                            <th className='!bg-slate-800 !text-white !text-center !w-[200px]'>
                                                                Realisasi
                                                            </th>
                                                            <th className='!bg-slate-800 !text-white !text-center !w-[100px]'>
                                                                Data Bulan
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {detailRealisasi?.data_error === true && (
                                                            <tr>
                                                                <td colSpan={100}>
                                                                    <div className="text-md font-semibold flex items-center justify-center gap-2 py-10">
                                                                        <FontAwesomeIcon icon={faExclamationTriangle} className='w-5 h-5 text-warning' />
                                                                        <div className="">
                                                                            {detailRealisasi?.error_message}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                        {detailRealisasi?.data?.map((detail: any, indexRincian: number) => (
                                                            <>
                                                                <tr className={detail?.type === 'target-kinerja' ? '!bg-blue-50' : ''}>
                                                                    <td>
                                                                        {detail?.fullcode}
                                                                    </td>
                                                                    <td colSpan={4}>
                                                                        {detail?.type === 'rekening' && (
                                                                            <>
                                                                                {detail?.uraian}
                                                                            </>
                                                                        )}
                                                                        {detail?.type === 'target-kinerja' && (
                                                                            <span className="font-semibold">
                                                                                [#] {detail?.nama_paket}
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                    <td className='!text-end'>
                                                                        {themeConfig.showMoney ? (
                                                                            <>
                                                                                Rp. {new Intl.NumberFormat('id-ID', {}).format(detail?.pagu)}
                                                                            </>
                                                                        ) : (
                                                                            <div className='flex items-center gap-x-2'>
                                                                                Rp.
                                                                                <FontAwesomeIcon icon={faEyeSlash} className='w-4 h-4' />
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                    <td className='!text-end'>
                                                                        {themeConfig.showMoney ? (
                                                                            <>
                                                                                Rp. {new Intl.NumberFormat('id-ID', {}).format(detail?.realisasi_anggaran)}
                                                                            </>
                                                                        ) : (
                                                                            <div className='flex items-center gap-x-2'>
                                                                                Rp.
                                                                                <FontAwesomeIcon icon={faEyeSlash} className='w-4 h-4' />
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        <div className="!whitespace-nowrap">
                                                                            {new Date(
                                                                                detail?.realisasi_year + '-' + detail?.realisasi_month + '-01'
                                                                            )?.toLocaleDateString('id-ID', {
                                                                                year: 'numeric',
                                                                                month: 'long',
                                                                            })}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                {detail?.rincian_belanja?.map((rincian: any, indexRincianBelanja: number) => (
                                                                    <>
                                                                        <tr className='!bg-blue-50'>
                                                                            <td></td>
                                                                            <td colSpan={4} className="!font-semibold">
                                                                                {rincian?.title}
                                                                            </td>
                                                                            <td className='!text-end !whitespace-nowrap'>
                                                                                {themeConfig.showMoney ? (
                                                                                    <>
                                                                                        Rp. {new Intl.NumberFormat('id-ID', {}).format(rincian?.pagu)}
                                                                                    </>
                                                                                ) : (
                                                                                    <div className='flex items-center gap-x-2'>
                                                                                        Rp.
                                                                                        <FontAwesomeIcon icon={faEyeSlash} className='w-4 h-4' />
                                                                                    </div>
                                                                                )}
                                                                            </td>
                                                                            <td className='!text-end !whitespace-nowrap'>
                                                                                {themeConfig.showMoney ? (
                                                                                    <>
                                                                                        Rp. {new Intl.NumberFormat('id-ID', {}).format(rincian?.realisasi_anggaran)}
                                                                                    </>
                                                                                ) : (
                                                                                    <div className='flex items-center gap-x-2'>
                                                                                        Rp.
                                                                                        <FontAwesomeIcon icon={faEyeSlash} className='w-4 h-4' />
                                                                                    </div>
                                                                                )}
                                                                            </td>
                                                                            <td>
                                                                                <div className="!whitespace-nowrap">
                                                                                    {new Date(
                                                                                        rincian?.realisasi_year + '-' + rincian?.realisasi_month + '-01'
                                                                                    )?.toLocaleDateString('id-ID', {
                                                                                        year: 'numeric',
                                                                                        month: 'long',
                                                                                    })}
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        {rincian?.keterangan_rincian?.map((keterangan: any, indexKeterangan: number) => (
                                                                            <tr className='!bg-blue-50'>
                                                                                <td></td>
                                                                                <td className="">
                                                                                    {keterangan?.title}
                                                                                </td>
                                                                                <td className="">
                                                                                    {keterangan?.koefisien + ' ' + keterangan?.satuan_name}
                                                                                </td>
                                                                                <td className="">
                                                                                    {keterangan?.koefisien_realisasi + ' ' + keterangan?.satuan_name}
                                                                                </td>
                                                                                <td className="!text-end !whitespace-nowrap">
                                                                                    {themeConfig.showMoney ? (
                                                                                        <>
                                                                                            Rp. {new Intl.NumberFormat('id-ID', {}).format(keterangan?.harga_satuan)}
                                                                                        </>
                                                                                    ) : (
                                                                                        <div className='flex items-center gap-x-2'>
                                                                                            Rp.
                                                                                            <FontAwesomeIcon icon={faEyeSlash} className='w-4 h-4' />
                                                                                        </div>
                                                                                    )}
                                                                                </td>
                                                                                <td className="!text-end !whitespace-nowrap">
                                                                                    {themeConfig.showMoney ? (
                                                                                        <>
                                                                                            Rp. {new Intl.NumberFormat('id-ID', {}).format(keterangan?.pagu)}
                                                                                        </>
                                                                                    ) : (
                                                                                        <div className='flex items-center gap-x-2'>
                                                                                            Rp.
                                                                                            <FontAwesomeIcon icon={faEyeSlash} className='w-4 h-4' />
                                                                                        </div>
                                                                                    )}
                                                                                </td>
                                                                                <td className="!text-end !whitespace-nowrap">
                                                                                    {themeConfig.showMoney ? (
                                                                                        <>
                                                                                            Rp. {new Intl.NumberFormat('id-ID', {}).format(keterangan?.realisasi_anggaran_keterangan)}
                                                                                        </>
                                                                                    ) : (
                                                                                        <div className='flex items-center gap-x-2'>
                                                                                            Rp.
                                                                                            <FontAwesomeIcon icon={faEyeSlash} className='w-4 h-4' />
                                                                                        </div>
                                                                                    )}
                                                                                </td>
                                                                                <td>
                                                                                    <div className="!whitespace-nowrap">
                                                                                        {new Date(
                                                                                            keterangan?.realisasi_year + '-' + keterangan?.realisasi_month + '-01'
                                                                                        )?.toLocaleDateString('id-ID', {
                                                                                            year: 'numeric',
                                                                                            month: 'long',
                                                                                        })}
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </>
                                                                ))}
                                                            </>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}

                                        {tabDetail == 2 && (
                                            <div className='table-responsive'>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>
                                                                Nama Tag
                                                            </th>
                                                            <th>
                                                                Nominal
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {detailRealisasi?.tags_sumber_dana?.map((tagSumberDana: any, indexTagSumberDana: number) => (
                                                            <tr>
                                                                <td>
                                                                    <div className="font-semibold">
                                                                        {tagSumberDana?.tag_name}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="font-semibold">
                                                                        Rp. {new Intl.NumberFormat('id-ID', {}).format(tagSumberDana?.nominal)}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}

                                        {tabDetail == 3 && (
                                            <div className='table-responsive mt-5'>
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <td className='!w-[200px] !text-end font-semibold'>
                                                                Keterangan
                                                            </td>
                                                            <td>
                                                                {detailRealisasi?.keterangan?.keterangan}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className='!text-end font-semibold'>
                                                                Faktor Penghambat
                                                            </td>
                                                            <td>
                                                                {detailRealisasi?.keterangan?.faktor_penghambat}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className='!text-end font-semibold'>
                                                                Map
                                                            </td>
                                                            <td>
                                                                {detailRealisasi?.keterangan?.link_map && (
                                                                    <Tippy content="Klik Untuk Membuka Tautan Map">
                                                                        <Link
                                                                            target='_blank'
                                                                            href={detailRealisasi?.keterangan?.link_map}
                                                                            className="text-primary hover:underline flex items-center gap-1 font-semibold">
                                                                            <FontAwesomeIcon icon={faExternalLinkAlt} className='w-3 h-3' />
                                                                            Tautan Map
                                                                        </Link>
                                                                    </Tippy>
                                                                )}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className='!text-end font-semibold'>
                                                                Berkas Pendukung
                                                            </td>
                                                            <td>
                                                                {detailRealisasi?.files?.filter((item: any) => item?.mime_type.includes('image/')).length > 0 && (
                                                                    <div>
                                                                        <div className="font-semibold underline mb-2">
                                                                            Gambar
                                                                        </div>
                                                                        <div className="grid grid-cols-10 gap-5">
                                                                            {detailRealisasi?.files?.filter((item: any) => item?.mime_type.includes('image/')).map((image: any, indexImg: any) => (
                                                                                <div className="col-span-10 md:col-span-1">
                                                                                    <div className="relative group rounded-lg cursor-pointer overflow-hidden">
                                                                                        <img
                                                                                            onClick={() => {
                                                                                                setImagesIndex(indexImg);
                                                                                                setOpenLightBox(true);
                                                                                            }}
                                                                                            src={image?.file}
                                                                                            alt="Image"
                                                                                            className="w-full h-full border p-1 object-cover rounded-lg grayscale group-hover:grayscale-0 group-hover:scale-125 hover:shadow transition-all duration-300"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <Lightbox
                                                                    index={imagesIndex}
                                                                    open={openLightBox}
                                                                    close={() => setOpenLightBox(false)}
                                                                    slides={slides}
                                                                    plugins={[Zoom]}
                                                                />


                                                                {detailRealisasi?.files?.filter((item: any) => !item?.mime_type.includes('image/')).length > 0 && (
                                                                    <div>
                                                                        <div className="font-semibold underline mb-2">
                                                                            Berkas Pendukung Lainnya
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            {detailRealisasi?.files?.filter((item: any) => !item?.mime_type.includes('image/')).map((file: any, indexImg: any) => (
                                                                                <div className='flex items-center gap-x-2'>
                                                                                    <a
                                                                                        href={file?.file ?? '/'}
                                                                                        target="_blank"
                                                                                        download={file?.filename}
                                                                                        className="flex items-center gap-2 group cursor-pointer">
                                                                                        <FontAwesomeIcon icon={faFileAlt} className='text-blue-500 w-4 h-4' />
                                                                                        <div className="group-hover:underline">
                                                                                            {file?.filename}
                                                                                        </div>
                                                                                    </a>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}

                                        {tabDetail == 4 && (

                                            <div className="p-4 grid grid-cols-2 gap-4">
                                                {detailRealisasi?.contracts?.length == 0 && (
                                                    <div className="col-span-2 bg-red-50 p-4 shadow-md cursor-pointer select-none hover:bg-red-100 hover:shadow-red-200 group">
                                                        <div className="font-semibold text-lg">
                                                            Tidak Ada Kontrak
                                                        </div>
                                                    </div>
                                                )}
                                                {detailRealisasi?.contracts?.length > 0 && detailRealisasi?.contracts?.map((kontrak: any, index: any) => (
                                                    <div key={`list-kontrak-aktif-${index}`}
                                                        className={`col-span-2 xl:col-span-1 bg-green-50 p-4 shadow-md cursor-pointer select-none hover:bg-green-100 hover:shadow-green-200 group`}>
                                                        <div className="font-semibold text-lg">
                                                            {index + 1}
                                                        </div>
                                                        <div className="table-responsive mt-5">
                                                            <table className=''>
                                                                <tbody>

                                                                    <tr>
                                                                        <td className='!w-[200px]'>
                                                                            Nomor Kontrak
                                                                        </td>
                                                                        <td>
                                                                            {kontrak?.data_spse?.no_kontrak}
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className='!w-[200px]'>
                                                                            Jenis Kontrak
                                                                        </td>
                                                                        <td>
                                                                            {kontrak?.data_spse?.jenis_kontrak}
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className=''>
                                                                            Nomor SPPBJ
                                                                        </td>
                                                                        <td>
                                                                            {kontrak?.data_spse?.no_sppbj}
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className=''>
                                                                            Nama Paket
                                                                        </td>
                                                                        <td>
                                                                            {kontrak?.data_spse?.nama_paket}
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className=''>
                                                                            Tanggal Kontrak
                                                                        </td>
                                                                        <td>
                                                                            {new Date(kontrak?.data_spse?.tgl_kontrak).toLocaleString('id-ID', { dateStyle: 'full' })}
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className=''>
                                                                            Tanggal Kontrak Awal
                                                                        </td>
                                                                        <td>
                                                                            {new Date(kontrak?.data_spse?.tgl_kontrak_awal).toLocaleString('id-ID', { dateStyle: 'full' })}
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className=''>
                                                                            Tanggal Kontrak Akhir
                                                                        </td>
                                                                        <td>
                                                                            {new Date(kontrak?.data_spse?.tgl_kontrak_akhir).toLocaleString('id-ID', { dateStyle: 'full' })}
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className=''>
                                                                            Status Kontrak
                                                                        </td>
                                                                        <td>
                                                                            {kontrak?.data_spse?.status_kontrak}
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className='!text-center font-semibold' colSpan={2}>
                                                                            Satuan Kerja
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className=''>
                                                                            Nama Satuan Kerja
                                                                        </td>
                                                                        <td>
                                                                            {/* {kontrak?.data_spse?.kd_satker_str + ' - ' + kontrak?.data_spse?.nama_satker} */}
                                                                            {kontrak?.data_spse?.kd_satker_str}
                                                                            <br />
                                                                            {kontrak?.data_spse?.nama_satker}
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className='!text-center font-semibold' colSpan={2}>
                                                                            PPK
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className=''>
                                                                            Nama PPK
                                                                        </td>
                                                                        <td>
                                                                            <div className="">
                                                                                {kontrak?.data_spse?.nama_ppk}
                                                                            </div>
                                                                            <div className="text-xs">
                                                                                {kontrak?.data_spse?.nip_ppk}
                                                                            </div>
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className=''>
                                                                            Jabatan PPK
                                                                        </td>
                                                                        <td>
                                                                            <div className="">
                                                                                {kontrak?.data_spse?.jabatan_ppk}
                                                                            </div>
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className=''>
                                                                            Nomor SK PPK
                                                                        </td>
                                                                        <td>
                                                                            <div className="">
                                                                                {kontrak?.data_spse?.no_sk_ppk}
                                                                            </div>
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className='!text-center font-semibold' colSpan={2}>
                                                                            Penyedia
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className=''>
                                                                            Nama Penyedia
                                                                        </td>
                                                                        <td>
                                                                            <div className="">
                                                                                {kontrak?.data_spse?.nama_penyedia}
                                                                            </div>
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className=''>
                                                                            NPWP Penyedia
                                                                        </td>
                                                                        <td>
                                                                            <div className="">
                                                                                {kontrak?.data_spse?.npwp_penyedia}
                                                                            </div>
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className=''>
                                                                            Bentuk Usaha Penyedia
                                                                        </td>
                                                                        <td>
                                                                            <div className="">
                                                                                {kontrak?.data_spse?.bentuk_usaha_penyedia}
                                                                            </div>
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className=''>
                                                                            Wakil Sah Penyedia
                                                                        </td>
                                                                        <td>
                                                                            <div className="">
                                                                                {kontrak?.data_spse?.wakil_sah_penyedia}
                                                                            </div>
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className=''>
                                                                            Jabatan Wakil Penyedia
                                                                        </td>
                                                                        <td>
                                                                            <div className="">
                                                                                {kontrak?.data_spse?.jabatan_wakil_penyedia}
                                                                            </div>
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className=''>
                                                                            Jabatan Wakil Penyedia
                                                                        </td>
                                                                        <td>
                                                                            <div className="">
                                                                                {kontrak?.data_spse?.jabatan_wakil_penyedia}
                                                                            </div>
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className='!text-center font-semibold' colSpan={2}>
                                                                            Nilai Kontrak
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className=''>
                                                                            Nilai Kontrak
                                                                        </td>
                                                                        <td>
                                                                            <div className="">
                                                                                Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(kontrak?.data_spse?.nilai_kontrak)}
                                                                            </div>
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className=''>
                                                                            Nilai PDN Kontrak
                                                                        </td>
                                                                        <td>
                                                                            <div className="">
                                                                                Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(kontrak?.data_spse?.nilai_pdn_kontrak)}
                                                                            </div>
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className=''>
                                                                            Nilai UMK Kontrak
                                                                        </td>
                                                                        <td>
                                                                            <div className="">
                                                                                Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(kontrak?.data_spse?.nilai_umk_kontrak)}
                                                                            </div>
                                                                        </td>
                                                                    </tr>

                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}


                                {loadingDetailRealisasi && (
                                    <div className='flex flex-col items-center justify-center gap-2 p-10'>
                                        <LoadingSicaram />
                                        <div className="dots-loading text-xl">Memuat Data...</div>
                                    </div>
                                )}

                            </div>
                        )}
                    </div>
                )}

                {tab2 === 'tujuan-sasaran' && (
                    <>
                        {dataTujuanSasaran?.length === 0 && (
                            <div className="">
                                <div className="text-center text-white-dark py-20 text-xl font-semibold flex items-center justify-center gap-2">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className='w-5 h-5 text-warning' />
                                    <div className="text-warning">
                                        Perangkat Daerah Belum Membuat Tujuan & Sasaran
                                    </div>
                                </div>
                            </div>
                        )}
                        {dataTujuanSasaran?.length > 0 && (
                            <div className="pt-10 p-4">
                                {dataTujuanSasaran?.map((tujuanSasaranKabupaten: any, index: number) => (
                                    <div className="">
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="">
                                                <button className="btn btn-sm btn-primary">
                                                    Tujuan Kabupaten Ogan Ilir
                                                </button>
                                                <h5 className="mt-4 font-semibold text-xl dark:text-white-light">
                                                    {tujuanSasaranKabupaten?.tujuan}
                                                </h5>
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="mb-1 text-white-dark underline">
                                                Indikator Tujuan Kabupaten :
                                            </div>

                                            <div className="font-semibold mb-7 space-y-2">
                                                {tujuanSasaranKabupaten?.indikator_tujuan?.map((indikatorKabupaten: any, indexIndikatorKabupaten: number) => (
                                                    <div className='flex items-center gap-2'>
                                                        <div className="flex-none w-2 h-2 rounded-full bg-slate-500"></div>
                                                        <div className="">
                                                            <div className="text-[15px] dark:text-white">
                                                                {indikatorKabupaten?.name}
                                                            </div>
                                                            <div className="flex gap-2 mt-1">
                                                                <div className="">
                                                                    <FontAwesomeIcon icon={faShare} className='w-4 h-4 -scale-y-100' />
                                                                </div>

                                                                <div>
                                                                    <div className="text-xs font-normal text-white-dark underline">Rumus :</div>
                                                                    <div className="font-normal dark:text-white">
                                                                        {indikatorKabupaten?.rumus}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="pl-6">
                                                <button className="btn btn-sm btn-secondary">
                                                    Sasaran Kabupaten Ogan Ilir
                                                </button>
                                                <div className="space-y-4 mt-4">
                                                    {tujuanSasaranKabupaten?.sasaran?.map((sasaranKabupaten: any, indexSasaranKabupaten: number) => (
                                                        <div className="border border-[#ebedf2] rounded dark:bg-[#1b2e4b] dark:border-0 p-4 py-2 cursor-pointer group">
                                                            <div className="flex items-center justify-between">
                                                                <h6 className="text-dark text-[15px] dark:text-white font-semibold group-hover:text-secondary">
                                                                    {sasaranKabupaten?.sasaran}
                                                                </h6>
                                                            </div>
                                                            <div className="mb-1 text-xs text-white-dark underline">
                                                                Indikator
                                                            </div>

                                                            <div className="font-semibold mb-7 space-y-2">
                                                                {sasaranKabupaten?.indikator_sasaran?.map((indikatorSasaranKabupaten: any, indexIndikatorSasaranKabupaten: number) => (
                                                                    <div className='flex items-center gap-2'>
                                                                        <div className="flex-none w-2 h-2 rounded-full bg-purple-500"></div>
                                                                        <div className="">
                                                                            <div className="text-[15px] dark:text-white group-hover:text-secondary">
                                                                                {indikatorSasaranKabupaten?.name}
                                                                            </div>
                                                                            <div className="flex gap-2 mt-1">
                                                                                <div className="">
                                                                                    <FontAwesomeIcon icon={faShare} className='w-4 h-4 -scale-y-100 text-purple-500' />
                                                                                </div>

                                                                                <div>
                                                                                    <div className="text-xs font-normal text-white-dark underline">Rumus :</div>
                                                                                    <div className="font-normal dark:text-white">
                                                                                        {indikatorSasaranKabupaten?.rumus}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                        </div>
                                                    ))}

                                                </div>
                                            </div>

                                            <div className="pl-10 pt-5 mt-5 border-t border-slate-900 dark:border-white">
                                                <div className="">
                                                    <button className="btn btn-sm btn-primary uppercase">
                                                        Tujuan {Instance?.name}
                                                    </button>
                                                </div>

                                                <div className="space-y-4 mt-4">
                                                    {tujuanSasaranKabupaten?.opd?.map((opd: any, indexOpd: number) => (
                                                        <div className="panel">
                                                            <div className="flex">
                                                                <span className='mr-1 font-semibold text-xl'>
                                                                    {indexOpd + 1}.
                                                                </span>
                                                                <span className='font-semibold text-xl'>
                                                                    {opd?.tujuan}
                                                                </span>
                                                            </div>

                                                            <div className="mt-4">
                                                                <div className="mb-1 text-white-dark underline">
                                                                    Indikator Tujuan :
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {opd?.indikator_tujuan?.map((indikatorOpd: any, indexIndikatorOpd: number) => (
                                                                        <>
                                                                            <div className="flex items-center gap-4">
                                                                                <div className="flex-none w-2 h-2 rounded-full bg-blue-500"></div>
                                                                                <div className="">
                                                                                    <div className="font-semibold text-lg mb-1">
                                                                                        {indikatorOpd?.name}
                                                                                    </div>

                                                                                    <div>
                                                                                        <div className="text-xs font-normal text-white-dark underline">Rumus :</div>
                                                                                        <div className="font-normal dark:text-white">
                                                                                            {indikatorOpd?.rumus}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    ))}
                                                                </div>

                                                                <div className="pl-9 mt-4">
                                                                    <button className="btn btn-sm btn-secondary">
                                                                        Sasaran
                                                                    </button>

                                                                    <div className="space-y-4 mt-4">
                                                                        {tujuanSasaranKabupaten?.sasaran?.map((sasaranOpd: any, indexSasaranOpd: number) => (
                                                                            <div className="rounded border p-3">
                                                                                <div className="flex">
                                                                                    <span className='mr-1 font-semibold text-md'>
                                                                                        {indexOpd + 1}. {indexSasaranOpd + 1}.
                                                                                    </span>
                                                                                    <span className='font-semibold text-md'>
                                                                                        {opd?.tujuan}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="mt-2">
                                                                                    <div className="mb-1 text-white-dark underline">
                                                                                        Indikator Sasaran :
                                                                                    </div>

                                                                                    <div className="space-y-3">
                                                                                        {sasaranOpd?.indikator_sasaran?.map((indikatorSasaranOpd: any, indexIndikatorSasaranOpd: number) => (
                                                                                            <>
                                                                                                <div className="flex items-center gap-4">
                                                                                                    <div className="flex-none w-2 h-2 rounded-full bg-purple-500"></div>
                                                                                                    <div className="">
                                                                                                        <div className="font-semibold text-md mb-1">
                                                                                                            {indikatorSasaranOpd?.name}
                                                                                                        </div>

                                                                                                        <div>
                                                                                                            <div className="text-[10px] font-normal text-white-dark underline">Rumus :</div>
                                                                                                            <div className="font-normal text-xs dark:text-white">
                                                                                                                {indikatorSasaranOpd?.rumus}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div >
        </>
    );
}

export default DashboardOPD;
