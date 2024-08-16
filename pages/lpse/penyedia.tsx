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
import IconHorizontalDots from '@/components/Icon/IconHorizontalDots';

const Page = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        dispatch(setPageTitle(`Paket Penyedia Terumumkan`));
    });

    const [CurrentUser, setCurrentUser] = useState<any>([]);
    useEffect(() => {
        if (document.cookie) {
            let user = document.cookie.split(';').find((row) => row.trim().startsWith('user='))?.split('=')[1];
            user = user ? JSON.parse(user) : null;
            setCurrentUser(user);
        }
    }, [isMounted]);

    const [year, setYear] = useState<number>(router.query.year ? parseInt(router.query.year as string) : new Date().getFullYear());
    const [arrYear, setArrYear] = useState<number[]>([]);

    useEffect(() => {
        if (isMounted) {
            if (router.query.year == 'NaN') {
                router.query.year = new Date().getFullYear().toString();
            }
            setYear(parseInt(router.query.year as string));
        }
    }, [router.query.year]);

    useEffect(() => {
        let arrYear: number[] = [];
        for (let i = 2021; i <= new Date().getFullYear(); i++) {
            arrYear.push(i);
        }
        setArrYear(arrYear);
    }, []);

    useEffect(() => {
        if (isMounted) {
            router.query.year = year.toString();
            router.push(router);
        }
    }, [year]);


    const CurrentToken = getCookie('token');
    const baseUri = BaseUri();

    const [datas, setDatas] = useState<any[]>([]);
    const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

    const fetchPenyedia = async () => {
        setIsLoadingData(true)
        try {
            const res = await axios.get(`${baseUri}/lpse/getPenyediaTerumumkan`, {
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
        if (isMounted) {
            fetchPenyedia();
        }
    }, [year, isMounted]);

    if (CurrentUser?.role_id >= 9) {
        return (
            <>
                <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-5xl font-bold text-slate-500 dark:text-slate-400">
                            403
                        </div>
                        <div className="text-2xl font-medium text-slate-600 dark:text-slate-400">
                            Forbidden
                        </div>
                        <div className="text-slate-600 dark:text-slate-400">
                            You are not allowed to access this page!
                        </div>
                        <div className="mt-5">
                            <Link href="/">
                                <div className="btn btn-outline-primary">
                                    Back to Home
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="panel">
                <div className="flex items-center justify-between flex-col md:flex-row gap-y-3">
                    <div className="">
                        <h2 className="text-xl font-semibold">Paket Penyedia Terumumkan</h2>
                        <p className="text-sm text-gray-500">Daftar paket yang telah terumumkan dari Sirup</p>
                    </div>
                    <div className="">
                        <select className="form-select !pr-10"
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                        >
                            {arrYear.map((item, index) => (
                                <option key={'option-year-' + index} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-5 table-responsive">
                    <table className='w-full'>
                        <thead>
                            <tr className='!bg-dark text-white'>
                                <th className='w-[10px]'>#</th>
                                <th>Kode Perangkat Daerah</th>
                                <th>Perangkat Daerah</th>
                                <th>Penyedia</th>
                                <th>Pagu Penyedia</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoadingData && (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="flex items-center justify-center p-10">
                                            <LoadingSicaram />
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!isLoadingData && datas?.length === 0 && (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="flex items-center justify-center">
                                            <div className="text-center">
                                                <Player
                                                    autoplay
                                                    loop
                                                    src="https://assets3.lottiefiles.com/packages/lf20_2yjz6b.json"
                                                    style={{ height: '200px', width: '200px' }}
                                                >
                                                    <Controls visible={false} />
                                                </Player>
                                                <p className="text-gray-500">Data tidak ditemukan</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!isLoadingData && datas?.length > 0 && datas.map((item: any, index: number) => (
                                <tr key={'data-' + index}
                                    className='cursor-pointer'>
                                    <td>{index + 1}</td>
                                    <td>{item.kd_satker_str}</td>
                                    <td>
                                        <Link href={`/lpse/penyedia/${item.kd_satker_str}?year=${year}`} className="inline-block">
                                            <Tippy content={`Klik untuk melihat detail`}>
                                                <div className="hover:text-blue-400">
                                                    {item.nama_satker}
                                                </div>
                                            </Tippy>
                                        </Link>
                                    </td>
                                    <td className='!text-center'>
                                        {new Intl.NumberFormat('id-ID').format(item.paket)}
                                    </td>
                                    <td>
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.pagu)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Page
