import { IRootState } from '@/store';
import { setPageTitle } from '@/store/themeConfigSlice';
import { faAngleDoubleLeft, faAngleDoubleRight, faCartArrowDown, faExclamationTriangle, faSearch, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fragment, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});
import { Dialog, Transition } from '@headlessui/react';
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
import IconX from '@/components/Icon/IconX';

const Page = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        dispatch(setPageTitle(`Paket Swakelola Terumumkan`));
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
    const [slug, setSlug] = useState<any>(null);

    useEffect(() => {
        if (isMounted) {
            setYear(parseInt(router.query.year as string));
        }
        setSlug(router.query.slug as string);
    }, [router.query.year]);

    const CurrentToken = getCookie('token');
    const baseUri = BaseUri();

    const [datas, setDatas] = useState<any[]>([]);
    const [search, setSearch] = useState<string>('');
    const [perangkatDaerah, setPerangkatDaerah] = useState<any>(null);
    const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
    const [isEmptyData, setIsEmptyData] = useState<boolean>(false);

    const fetchData = async (slug: any) => {
        if (slug) {
            setIsEmptyData(false);
            setIsLoadingData(true);
            const res = await axios.get(`${baseUri}/lpse/getSwakelolaTerumumkan/${slug}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${CurrentToken}`,
                },
                params: {
                    year: year
                }
            });
            const data = await res.data;
            setDatas(data.data.data);
            setPerangkatDaerah(data.data.perangkat_daerah);
            if (data.data.length == 0) {
                setIsEmptyData(true);
            }
            if (data.data.data.length == 0) {
                setIsEmptyData(true);
            }
            setIsLoadingData(false);
        } else {
            setIsLoadingData(false);
        }
    }

    const [detail, setDetail] = useState<any>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);

    const fetchDetail = async (kd_rup: any) => {
        const res = await axios.get(`${baseUri}/lpse/getSwakelolaTerumumkan/${slug}/${kd_rup}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                year: year
            }
        });
        const data = await res.data;
        return data;
    }

    const [modalDetail, setModalDetail] = useState<boolean>(false);
    const [uraianPekerjaanLong, setUraianPekerjaanLong] = useState<boolean>(false);
    const [spesifikasiPekerjaanLong, setSpesifikasiPekerjaanLong] = useState<boolean>(false);

    const handleDetail = (kd_rup: any) => {
        setIsLoadingDetail(true);
        setModalDetail(true);
        fetchDetail(kd_rup).then((data) => {
            if (data.status == 'success') {
                setDetail(data.data);
            }
            setIsLoadingDetail(false);
        });
    }

    const closeModalDetail = () => {
        setModalDetail(false);
        setDetail(null);
    }

    useEffect(() => {
        if (isMounted) {
            fetchData(slug);
        }
    }, [slug, isMounted]);


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
            <div className='panel'>

                <div className="flex flex-col lg:flex-row gap-y-5 lg:items-center lg:justify-between">
                    <div className="">
                        <h2 className="text-xl font-semibold">
                            Daftar Paket Swakelola Terumumkan Tahun {year}
                        </h2>
                        <p className="text-md text-gray-500">
                            {isLoadingData ? (
                                <div className="w-auto h-6 bg-slate-200 rounded animate-pulse"></div>
                            ) : (
                                <>
                                    {perangkatDaerah?.nama_satker}
                                </>
                            )}
                        </p>
                        {isLoadingData ? (
                            <div className="mt-1 w-[200px] h-4 bg-slate-200 rounded animate-pulse"></div>
                        ) : (
                            <div className='text-xs text-slate-500'>
                                {datas?.length} Data Ditemukan
                            </div>
                        )}
                    </div>
                    <div className="self-end flex items-center gap-2">
                        <form className="flex items-center gap-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (search == '') {
                                    setDatas([]);
                                    fetchData(slug);
                                    return;
                                }
                                setDatas((prev) => {
                                    return prev.filter((item) => {
                                        return item.nama_paket.toLowerCase().includes(search.toLowerCase());
                                    })
                                })
                            }}>

                            <div className="relative">
                                <input type="text"
                                    placeholder="Cari Nama Paket..."
                                    className="form-input"
                                    value={search}
                                    onChange={
                                        (e: any) => {
                                            if (e.target.value == '') {
                                                setDatas([]);
                                                fetchData(slug);
                                            }
                                            setSearch(e.target.value)
                                        }
                                    } />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <FontAwesomeIcon icon={faSearch} className="w-4 h-4 text-gray-500" />
                                </div>
                            </div>
                        </form>
                        <Link href={`/lpse/swakelola?year=${year}`}>
                            <div className="btn btn-primary">
                                <FontAwesomeIcon icon={faAngleDoubleLeft} className="w-4 h-4 mr-2" />
                                Kembali
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="mt-5 table-responsive">
                    <table>
                        <thead>
                            <tr className='!bg-dark text-white'>
                                <th>
                                    #
                                </th>
                                <th>
                                    Kode RUP
                                </th>
                                <th>
                                    Nama Paket
                                </th>
                                <th className='!text-center'>
                                    Pagu
                                </th>
                                <th className='!text-center'>
                                    Tipe Swakelola
                                </th>
                                <th className='!text-center'>
                                    Tanggal Pembuatan
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoadingData && (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="flex items-center justify-center p-10">
                                            <LoadingSicaram />
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!isLoadingData && isEmptyData && (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="flex items-center justify-center p-10">
                                            <div className="text-center">
                                                <div className="flex items-center justify-center">
                                                    <FontAwesomeIcon icon={faExclamationTriangle} className="h-10 w-10 text-yellow-500 mr-2" />
                                                </div>
                                                <h3 className="text-lg font-semibold">
                                                    Tidak ada data
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Belum ada paket yang terumumkan
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                            )}

                            {datas?.map((item: any, index: number) => (
                                <tr key={`paket-${index}`}
                                    className='cursor-pointer hover:bg-slate-100 group'>
                                    <td>
                                        {index + 1}
                                    </td>
                                    <td>
                                        {item.kd_rup}
                                    </td>
                                    <td>
                                        <div className="inline-block">
                                            <Tippy content={`Klik untuk Melihat Paket`}>
                                                <div
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleDetail(item.kd_rup);
                                                    }}
                                                    className='group-hover:text-blue-500'>
                                                    {item.nama_paket}
                                                </div>
                                            </Tippy>
                                        </div>
                                    </td>
                                    <td>
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.pagu)}
                                    </td>
                                    <td>
                                        <div className="text-center">
                                            {item.tipe_swakelola}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-center">
                                            {new Date(item.tgl_buat_paket).toLocaleString('id-ID',
                                                {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                }
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>

            </div>


            <Transition appear show={modalDetail} as={Fragment}>
                <Dialog as="div"
                    open={modalDetail}
                    onClose={() => closeModalDetail()}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg w-full max-w-[80%] md:max-w-[90%] my-8 text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3 rounded-t-lg">
                                        <h5 className="font-semibold text-md">
                                            {isLoadingDetail ? (
                                                <div className="w-full h-10 bg-slate-200 rounded animate-pulse"></div>
                                            ) : (
                                                <>
                                                    {detail?.penyedia?.kd_rup} - {detail?.penyedia?.nama_paket}
                                                </>
                                            )}
                                        </h5>
                                        <button
                                            type="button"
                                            className="text-white-dark hover:text-dark"
                                            onClick={() => closeModalDetail()}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <div className="border rounded border-dashed">
                                            <table className='!border-dashed'>
                                                <tbody>

                                                    <tr>
                                                        <td className='w-[200px] !text-end text-slate-500 text-xs font-semibold'>
                                                            Kode RUP
                                                        </td>
                                                        <td>
                                                            {isLoadingDetail ? (
                                                                <div className="w-full h-6 bg-slate-200 rounded animate-pulse"></div>
                                                            ) : (
                                                                <>
                                                                    {detail?.penyedia?.kd_rup}
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className='!text-end text-slate-500 text-xs font-semibold'>
                                                            Nama Paket
                                                        </td>
                                                        <td>
                                                            {isLoadingDetail ? (
                                                                <div className="w-full h-6 bg-slate-200 rounded animate-pulse"></div>
                                                            ) : (
                                                                <>
                                                                    {detail?.penyedia?.nama_paket}
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className='!text-end text-slate-500 text-xs font-semibold'>
                                                            Nama KLPD
                                                        </td>
                                                        <td>
                                                            {isLoadingDetail ? (
                                                                <div className="w-full h-6 bg-slate-200 rounded animate-pulse"></div>
                                                            ) : (
                                                                <>
                                                                    {detail?.penyedia?.nama_klpd}
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className='!text-end text-slate-500 text-xs font-semibold'>
                                                            Satuan Kerja
                                                        </td>
                                                        <td>

                                                            {isLoadingDetail ? (
                                                                <div className="w-full h-10 bg-slate-200 rounded animate-pulse"></div>
                                                            ) : (
                                                                <>
                                                                    <div className="">
                                                                        {detail?.penyedia?.kd_satker}
                                                                    </div>
                                                                    <div className="">
                                                                        {detail?.penyedia?.nama_satker}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className='!text-end text-slate-500 text-xs font-semibold'>
                                                            Tahun Anggaran
                                                        </td>
                                                        <td>
                                                            {isLoadingDetail ? (
                                                                <div className="w-full h-6 bg-slate-200 rounded animate-pulse"></div>
                                                            ) : (
                                                                <>
                                                                    {detail?.penyedia?.tahun_anggaran}
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className='!text-end text-slate-500 text-xs font-semibold'>
                                                            Lokasi Pekerjaan
                                                        </td>
                                                        <td>
                                                            {isLoadingDetail ? (
                                                                <div className="w-full h-12 bg-slate-200 rounded animate-pulse"></div>
                                                            ) : (
                                                                <>
                                                                    <table className="w-full border">
                                                                        <thead>
                                                                            <tr>
                                                                                <th className="p-2 bg-slate-200 text-slate-800 w-[1px]">
                                                                                    No.
                                                                                </th>
                                                                                <th className="p-2 bg-slate-200 text-slate-800">
                                                                                    Provinsi
                                                                                </th>
                                                                                <th className="p-2 bg-slate-200 text-slate-800">
                                                                                    Kabupaten/Kota
                                                                                </th>
                                                                                <th className="p-2 bg-slate-200 text-slate-800">
                                                                                    Detail Lokasi
                                                                                </th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {detail?.lokasi?.map((item: any, index: number) => (
                                                                                <tr>
                                                                                    <td className="p-2 text-center">
                                                                                        {index + 1}
                                                                                    </td>
                                                                                    <td className="p-2 text-left">
                                                                                        {item.provinsi}
                                                                                    </td>
                                                                                    <td className="p-2 text-left">
                                                                                        {item.kab_kota}
                                                                                    </td>
                                                                                    <td className="p-2 text-left">
                                                                                        {item.detail_lokasi}
                                                                                    </td>
                                                                                </tr>
                                                                            ))}

                                                                            {detail?.lokasi?.length == 0 && (
                                                                                <tr>
                                                                                    <td colSpan={4} className="p-2 text-center">
                                                                                        <div className="text-gray-500">
                                                                                            Lokasi pekerjaan tidak ditemukan
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            )}
                                                                        </tbody>
                                                                    </table>
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className='!text-end text-slate-500 text-xs font-semibold'>
                                                            Volume Pekerjaan
                                                        </td>
                                                        <td>
                                                            {isLoadingDetail ? (
                                                                <div className="w-full h-6 bg-slate-200 rounded animate-pulse"></div>
                                                            ) : (
                                                                <>
                                                                    {detail?.penyedia?.volume_pekerjaan}
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className='!text-end text-slate-500 text-xs font-semibold'>
                                                            Uraian Pekerjaan
                                                        </td>
                                                        <td>

                                                            {isLoadingDetail ? (
                                                                <div className="w-full h-16 bg-slate-200 rounded animate-pulse"></div>
                                                            ) : (
                                                                <>
                                                                    <div
                                                                        onClick={() => {
                                                                            setUraianPekerjaanLong(false)
                                                                            setSpesifikasiPekerjaanLong(false)
                                                                        }}
                                                                        className={`${uraianPekerjaanLong ? 'cursor-pointer' : 'line-clamp-5'}`}>
                                                                        {detail?.penyedia?.uraian_pekerjaan}
                                                                    </div>

                                                                    {detail?.penyedia?.uraian_pekerjaan?.length > 1000 && (
                                                                        <div className="mt-1 text-end">
                                                                            <div className="text-blue-500 cursor-pointer text-xs"
                                                                                onClick={() => {
                                                                                    setUraianPekerjaanLong(!uraianPekerjaanLong)
                                                                                    setSpesifikasiPekerjaanLong(false)
                                                                                }}>
                                                                                {uraianPekerjaanLong ? 'Sembunyikan' : 'Lihat Selengkapnya'}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}

                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td colSpan={2} className='text-slate-500 text-xs font-semibold'>
                                                            {isLoadingDetail ? (
                                                                <div className="w-full h-16 bg-slate-200 rounded animate-pulse"></div>
                                                            ) : (
                                                                <>
                                                                    <div className="text-base text-center mb-2">
                                                                        Sumber Dana
                                                                    </div>
                                                                    <table className="w-full border">
                                                                        <thead>
                                                                            <tr>
                                                                                <th className="p-2 bg-slate-200 text-slate-800 w-[1px]">
                                                                                    No.
                                                                                </th>
                                                                                <th className="p-2 bg-slate-200 text-slate-800">
                                                                                    Sumber Dana
                                                                                </th>
                                                                                <th className="p-2 bg-slate-200 text-slate-800">
                                                                                    T.A
                                                                                </th>
                                                                                <th className="p-2 bg-slate-200 text-slate-800">
                                                                                    KLPD
                                                                                </th>
                                                                                <th className="p-2 bg-slate-200 text-slate-800">
                                                                                    MAK
                                                                                </th>
                                                                                <th className="p-2 bg-slate-200 text-slate-800">
                                                                                    Pagu
                                                                                </th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {detail?.anggaran?.map((item: any, index: number) => (
                                                                                <tr>
                                                                                    <td className="p-2 text-center">
                                                                                        {index + 1}
                                                                                    </td>
                                                                                    <td className="p-2 text-left">
                                                                                        {item.sumber_dana}
                                                                                    </td>
                                                                                    <td className="p-2 text-left">
                                                                                        {item.tahun_anggaran}
                                                                                    </td>
                                                                                    <td className="p-2 text-left">
                                                                                        {item.nama_klpd}
                                                                                    </td>
                                                                                    <td className="p-2 text-left">
                                                                                        {item.mak}
                                                                                    </td>
                                                                                    <td className="p-2 text-left">
                                                                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.pagu)}
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className='!text-end text-slate-500 text-xs font-semibold'>
                                                            Total Pagu
                                                        </td>
                                                        <td>
                                                            {isLoadingDetail ? (
                                                                <div className="w-full h-6 bg-slate-200 rounded animate-pulse"></div>
                                                            ) : (
                                                                <>
                                                                    <div className="ordinal">
                                                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(detail?.penyedia?.pagu)}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className='!text-end text-slate-500 text-xs font-semibold'>
                                                            Jadwal Pelaksanaan Kontrak
                                                        </td>
                                                        <td>
                                                            {isLoadingDetail ? (
                                                                <div className="w-full h-12 bg-slate-200 rounded animate-pulse"></div>
                                                            ) : (
                                                                <>
                                                                    <div className="flex items-center gap-2 w-full">
                                                                        <div className="w-1/2 px-2 flex flex-col gap-1">
                                                                            <div className="border-b border-dashed pb-1 text-xs text-slate-400">
                                                                                Mulai
                                                                            </div>
                                                                            <div className="font-semibold">
                                                                                {new Date(detail?.penyedia?.tgl_awal_pelaksanaan_kontrak).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                                            </div>
                                                                        </div>
                                                                        <div className="w-1/2 px-2 flex flex-col gap-1">
                                                                            <div className="border-b border-dashed pb-1 text-xs text-slate-400">
                                                                                Akhir
                                                                            </div>
                                                                            <div className="font-semibold">
                                                                                {new Date(detail?.penyedia?.tgl_akhir_pelaksanaan_kontrak).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className='!text-end text-slate-500 text-xs font-semibold'>
                                                            Diperbarui
                                                        </td>
                                                        <td>
                                                            {isLoadingDetail ? (
                                                                <div className="w-full h-6 bg-slate-200 rounded animate-pulse"></div>
                                                            ) : (
                                                                <>
                                                                    {new Date(detail?.penyedia?.tgl_pengumuman_paket).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

        </>
    );
}

export default Page;
