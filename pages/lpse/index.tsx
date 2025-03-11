import { IRootState } from '@/store';
import { setPageTitle } from '@/store/themeConfigSlice';
import { faAngleDoubleRight, faCartArrowDown, faExclamationTriangle, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});
import axios from "axios";
import { getCookie } from 'cookies-next';
import { BaseUri } from "@/apis/serverConfig";
import { useDispatch, useSelector } from 'react-redux';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Link from 'next/link';
import LoadingSicaram from '@/components/LoadingSicaram';
import { useRouter } from 'next/router';
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import Dropdown from '@/components/Dropdown';
import { useSession } from 'next-auth/react';

const Index = () => {

    const dispatch = useDispatch();

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [CurrentUser, setCurrentUser] = useState<any>([]);
    const [CurrentToken, setCurrentToken] = useState<any>(null);
    const session = useSession();
    useEffect(() => {
        if (isMounted && session.status === 'authenticated') {
            const token = session?.data?.user?.name;
            setCurrentToken(token);
        }
    }, [isMounted, session]);

    useEffect(() => {
        dispatch(setPageTitle('Dashboard LPSE'));
    });

    // const CurrentToken = getCookie('token');
    const baseUri = BaseUri();

    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(new Date().getFullYear());
    const [datas, setDatas] = useState<any>(null);
    const [isLoadingData, setIsLoadingData] = useState<boolean>(false);


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


    const fetchLPSE = async () => {
        setIsLoadingData(true)
        try {
            const res = await axios.get(`${baseUri}/lpse`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${CurrentToken}`,
                },
                params: {
                    year: year
                },
            });
            const data = await res.data;
            setDatas(data?.data);
            setIsLoadingData(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (isMounted && year) {
            fetchLPSE();
        }
    }, [isMounted, year]);

    return (
        <>
            <div className="grid grid-cols-6 gap-x-10 gap-y-5">

                <div
                    className="col-span-6 md:col-span-3 panel cursor-pointer text-white bg-gradient-to-r from-sky-500 to-sky-400">
                    <div className="">
                        <Player
                            autoplay
                            loop
                            className='w-full'
                            src="/lottie/lpse-1.json"
                            style={{ height: '150px', width: '150px' }}
                        >
                        </Player>
                    </div>
                    <div className="text-xl font-semibold text-center">
                        Paket Terumumkan
                    </div>
                    <div className="mt-1 text-center">
                        {isLoadingData ? (
                            <div className="w-full h-10 rounded bg-sky-100/50 animate-pulse"></div>
                        ) : (
                            <div className="text-xl ltr:mr-3 rtl:ml-3">
                                {new Intl.NumberFormat('id-ID').format(datas?.terumumkan)} Paket
                            </div>
                        )}
                        {isLoadingData ? (
                            <div className="w-full h-4 mt-2 rounded bg-sky-100/50 animate-pulse"></div>
                        ) : (
                            <div className="capitalize">
                                {datas?.terumumkan_terbilang}
                            </div>
                        )}

                    </div>
                </div>

                <div
                    className="col-span-6 md:col-span-3 panel cursor-pointer text-white bg-gradient-to-r from-orange-500 to-orange-400">
                    <div className="">
                        <Player
                            autoplay
                            loop
                            className='w-full p-5'
                            src="/lottie/lpse-2.json"
                            style={{ height: '150px', width: '150px' }}
                        >
                        </Player>
                    </div>
                    <div className="text-xl font-semibold text-center">
                        Belum Diumumkan
                    </div>
                    <div className="mt-1 text-center">
                        {isLoadingData ? (
                            <div className="w-full h-10 rounded bg-orange-100/50 animate-pulse"></div>
                        ) : (
                            <div className="text-xl ltr:mr-3 rtl:ml-3">
                                {new Intl.NumberFormat('id-ID').format(datas?.belum_diumumkan)} Paket
                            </div>
                        )}
                        {isLoadingData ? (
                            <div className="w-full h-4 mt-2 rounded bg-orange-100/50 animate-pulse"></div>
                        ) : (
                            <div className="capitalize">
                                {datas?.belum_diumumkan_terbilang}
                            </div>
                        )}

                    </div>
                </div>

                <div
                    className="col-span-6 md:col-span-2 panel cursor-pointer text-white bg-gradient-to-r from-slate-400 to-slate-300">
                    <div className="">
                        <Player
                            autoplay
                            loop
                            className='w-full p-0'
                            src="/lottie/lpse-3.json"
                            style={{ height: '150px', width: '150px' }}
                        >
                        </Player>
                    </div>
                    <div className="text-xl font-semibold text-center">
                        Dikerjakan
                    </div>
                    <div className="mt-1 text-center">
                        {isLoadingData ? (
                            <div className="w-full h-10 rounded bg-slate-100/50 animate-pulse"></div>
                        ) : (
                            <div className="text-xl ltr:mr-3 rtl:ml-3">
                                {new Intl.NumberFormat('id-ID').format(datas?.dikerjakan)} Paket
                            </div>
                        )}
                        {isLoadingData ? (
                            <div className="w-full h-4 mt-2 rounded bg-slate-100/50 animate-pulse"></div>
                        ) : (
                            <div className="capitalize">
                                {datas?.dikerjakan_terbilang}
                            </div>
                        )}

                    </div>
                </div>

                <div
                    className="col-span-6 md:col-span-2 panel cursor-pointer text-white bg-gradient-to-r from-green-500 to-green-400">
                    <div className="">
                        <Player
                            autoplay
                            loop
                            className='w-full p-0'
                            src="/lottie/lpse-4.json"
                            style={{ height: '150px', width: '150px' }}
                        >
                        </Player>
                    </div>
                    <div className="text-xl font-semibold text-center">
                        Terlambat
                    </div>
                    <div className="mt-1 text-center">
                        {isLoadingData ? (
                            <div className="w-full h-10 rounded bg-green-100/50 animate-pulse"></div>
                        ) : (
                            <div className="text-xl ltr:mr-3 rtl:ml-3">
                                {new Intl.NumberFormat('id-ID').format(datas?.terlambat)} Paket
                            </div>
                        )}
                        {isLoadingData ? (
                            <div className="w-full h-4 mt-2 rounded bg-green-100/50 animate-pulse"></div>
                        ) : (
                            <div className="capitalize">
                                {datas?.terlambat_terbilang}
                            </div>
                        )}

                    </div>
                </div>

                <div
                    className="col-span-6 md:col-span-2 panel cursor-pointer text-white bg-gradient-to-r from-pink-500 to-pink-400">
                    <div className="">
                        <Player
                            autoplay
                            loop
                            className='w-full'
                            src="/lottie/lpse-5.json"
                            style={{ height: '150px', width: '150px' }}
                        >
                        </Player>
                    </div>
                    <div className="text-xl font-semibold text-center">
                        Belum Dikerjakan
                    </div>
                    <div className="mt-1 text-center">
                        {isLoadingData ? (
                            <div className="w-full h-10 rounded bg-pink-100/50 animate-pulse"></div>
                        ) : (
                            <div className="text-xl ltr:mr-3 rtl:ml-3">
                                {new Intl.NumberFormat('id-ID').format(datas?.belum_dikerjakan)} Paket
                            </div>
                        )}
                        {isLoadingData ? (
                            <div className="w-full h-4 mt-2 rounded bg-pink-100/50 animate-pulse"></div>
                        ) : (
                            <div className="capitalize">
                                {datas?.belum_dikerjakan_terbilang}
                            </div>
                        )}

                    </div>
                </div>

            </div>

        </>
    );
};

export default Index;
