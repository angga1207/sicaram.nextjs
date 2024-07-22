import { IRootState } from '@/store';
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

import { chartRealisasi, summaryRealisasi, getRankInstance, chartKinerja, summaryKinerja } from '@/apis/fetchdashboard';
import Link from 'next/link';
import LoadingSicaram from '@/components/LoadingSicaram';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

const Index = () => {
    const dispatch = useDispatch();
    const router = useRouter();
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
    const [percentageAnggaranSummary, setPercentageAnggaranSummary] = useState<any>(0);
    const [KinerjaSeries, setKinerjaSeries] = useState<any>([]);
    const [KinerjaSummary, setKinerjaSummary] = useState<any>([]);
    const [RankInstances, setRankInstances] = useState<any>([]);

    useEffect(() => {
        if (document.cookie) {
            let user = document.cookie.split(';').find((row) => row.trim().startsWith('user='))?.split('=')[1];
            user = user ? JSON.parse(user) : null;
            setCurrentUser(user);
        }
    }, [isMounted]);

    if (CurrentUser?.role_id === 9) {
        router.push('/dashboard/pd');
    }

    useEffect(() => {
        if (isMounted) {
            summaryKinerja(periode, new Date().getFullYear(), view).then((data) => {
                if (data?.message?.response?.status === 401) {
                    signOut();
                }
                if (data.status === 'success') {
                    setKinerjaSummary(data.data);
                }
            });
        }
    }, [view]);

    useEffect(() => {
        if (isMounted) {
            // summaryRealisasi(periode, new Date().getFullYear()).then((data) => {
            //     if (data.status === 'success') {
            //         if (data?.message?.response?.status === 401) {
            //             signOut();
            //         }
            //         setAnggaranSummary(data?.data);
            //         setPercentageAnggaranSummary(data?.data?.realisasi?.realisasi / data?.data?.target?.target * 100);
            //     }
            // });

            chartRealisasi(periode, new Date().getFullYear(), view).then((data) => {
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

            summaryKinerja(periode, new Date().getFullYear(), view).then((data) => {
                if (data?.message?.response?.status === 401) {
                    signOut();
                }
                if (data.status === 'success') {
                    setKinerjaSummary(data.data);
                }
            });
        }
    }, [isMounted]);

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
                        {AnggaranSummary?.length === 0 && (
                            <div className="w-[360px] h-[360px] flex items-center justify-center">
                                <LoadingSicaram></LoadingSicaram>
                            </div>
                        )}
                        {AnggaranSummary?.length !== 0 && (
                            <>
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
                                        strokeWidth="60"
                                        strokeLinecap="round" // square or round
                                        fill="transparent"
                                        strokeDasharray={754.285714286}
                                        strokeDashoffset={(754.285714286) - percentageAnggaranSummary?.toFixed(2) ?? 0 / 100 * (754.285714286)}
                                        className="text-success progress-ring__circle stroke-current group-hover:animate-blinkingTextSuccess" />

                                </svg>
                                <div className="absolute w-[180px] h-[180px] rounded-full flex flex-col items-center justify-center text-success">
                                    <Player
                                        autoplay
                                        loop
                                        // src="https://lottie.host/57136a3b-aff5-4b0b-99c7-2408199230ad/aneTHQRQbg.json"
                                        src="/lottie/animation-4.json"
                                        className='w-32 h-32'
                                    >
                                    </Player>
                                    <div className="text-5xl font-semibold -mt-10">
                                        {percentageAnggaranSummary?.toFixed(2) ?? 0}%
                                    </div>
                                </div>
                                <div className='absolute w-[300px] h-[300px] rounded-full overflow-hidden'>
                                    <div className="relative w-full h-full bg-white rounded-full bg-opacity-0 group-hover:bg-opacity-10 -left-[270px] group-hover:left-[0px] transition-all duration-500"></div>
                                </div>
                            </div>
                            </>
                        )}
                        <div className='cursor-pointer text-xl font-bold text-center group-hover:text-success group-hover:-skew-x-12 transition-all duration-500'>
                            Capaian Keuangan
                        </div>
                        <div className="text-xs text-center badge bg-success opacity-0 group-hover:opacity-100 transition-all delay-200 duration-500 flex items-center justify-center">
                            <FontAwesomeIcon icon={faAngleDoubleRight} className='mr-1 w-3 h-3' />
                            Klik untuk Melihat Rincian Capaian Keuangan
                        </div>
                    </Link>

                    <Link href={`/dashboard/capaian-kinerja`}
                        className='relative group p-4 rounded-xl hover:shadow-xl transition-all delay-200 duration-500'>
                        {KinerjaSummary?.length === 0 && (
                            <div className="w-[360px] h-[360px] flex items-center justify-center">
                                <LoadingSicaram></LoadingSicaram>
                            </div>
                        )}
                        {KinerjaSummary?.length !== 0 && (
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
                                        stroke-dashoffset={(754.285714286) - KinerjaSummary?.realisasi?.toFixed(2) / 100 * (754.285714286)}
                                        className="text-primary progress-ring__circle stroke-current group-hover:animate-blinkingTextPrimary" />

                                </svg>
                                <div className="absolute w-[180px] h-[180px] rounded-full flex flex-col items-center justify-center text-primary">
                                    <Player
                                        autoplay
                                        loop
                                        // src="https://lottie.host/d24409b0-afb0-445f-be09-884f03bc70a6/Q6WQhrKAkZ.json"
                                        src="/lottie/animation-3.json"
                                        className='w-32 h-32'
                                    >
                                    </Player>
                                    <div className="text-5xl font-semibold -mt-10">
                                        {KinerjaSummary?.realisasi?.toFixed(2)}%
                                    </div>
                                </div>
                                <div className='absolute w-[300px] h-[300px] rounded-full overflow-hidden'>
                                    <div className="relative w-full h-full bg-white rounded-full bg-opacity-0 group-hover:bg-opacity-10 -left-[270px] group-hover:left-[0px] transition-all duration-500"></div>
                                </div>
                            </div>
                        )}
                        <div className='cursor-pointer text-xl font-bold text-center group-hover:text-primary group-hover:-skew-x-12 transition-all duration-500'>
                            Capaian Kinerja
                        </div>
                        <div className="text-xs text-center badge bg-primary opacity-0 group-hover:opacity-100 transition-all delay-200 duration-500 flex items-center justify-center">
                            <FontAwesomeIcon icon={faAngleDoubleRight} className='mr-1 w-3 h-3' />
                            Klik untuk Melihat Rincian Capaian Kinerja
                        </div>
                    </Link>

                </div>

            </div>
        </>
    );
};

export default Index;
