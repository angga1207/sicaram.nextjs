import { useEffect, useState, Fragment, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/themeConfigSlice';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Dialog, Transition } from '@headlessui/react';
import Dropdown from '@/components/Dropdown';
import Swal from 'sweetalert2';
import Link from 'next/link';
import LoadingSicaram from '@/components/LoadingSicaram';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';

import { getRealisasiHead, getRealisasi } from '@/apis/report_apis';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCloudDownloadAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faFileExcel, faFilePdf, faFolder, faFolderOpen, faTimesCircle, faTimesRectangle } from '@fortawesome/free-regular-svg-icons';
import { randomInt } from 'crypto';

const showAlert = async (icon: any, text: any) => {
    const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
    });
    toast.fire({
        icon: icon,
        title: text,
        padding: '10px 20px',
    });
};

const showBoxAlert = async (icon: any, title: any, text: any) => {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
        padding: '2em',
        customClass: 'sweet-alerts',
    });
}

const Index = () => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [CurrentUser, setCurrentUser] = useState<any>([]);
    useEffect(() => {
        if (document.cookie) {
            let user = document.cookie.split(';').find((row) => row.trim().startsWith('user='))?.split('=')[1];
            user = user ? JSON.parse(user) : null;
            setCurrentUser(user);
        }
    }, [isMounted]);

    const route = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Laporan Program'));
    });


    const [loaded, setLoaded] = useState<number>(0);
    const [datas, setDatas] = useState<any>([]);
    const [instanceId, setInstanceId] = useState<any>(null);
    const [instance, setInstance] = useState<any>(null);
    const [year, setYear] = useState<any>(new Date().getFullYear());
    const [triwulan, setTriwulan] = useState<any>(null);
    const [arrTujuanSasaran, setArrTujuanSasaran] = useState<any>([]);
    const [showTujuanSasaran, setShowTujuanSasaran] = useState<boolean>(false);
    const [showProgram, setShowProgram] = useState<any>(null);
    const [showKegiatan, setShowKegiatan] = useState<any>(null);
    const [showSubKegiatan, setShowSubKegiatan] = useState<any>(null);

    const [triwulans, setTriwulans] = useState<any>([
        { id: 1, name: 'Triwulan I' },
        { id: 2, name: 'Triwulan II' },
        { id: 3, name: 'Triwulan III' },
        { id: 4, name: 'Triwulan IV' },
    ]);

    const [months, setMonths] = useState<any>([
        { id: 1, name: 'Januari' },
        { id: 2, name: 'Februari' },
        { id: 3, name: 'Maret' },
        { id: 4, name: 'April' },
        { id: 5, name: 'Mei' },
        { id: 6, name: 'Juni' },
        { id: 7, name: 'Juli' },
        { id: 8, name: 'Agustus' },
        { id: 9, name: 'September' },
        { id: 10, name: 'Oktober' },
        { id: 11, name: 'November' },
        { id: 12, name: 'Desember' },
    ]);

    useEffect(() => {
        if (route.query) {
            const { instance, year, triwulan } = route.query;
            setInstanceId(instance);
            setYear(year);
            setTriwulan(triwulan);
        }
    }, [route.query]);

    useEffect(() => {
        if (triwulan == 1) {
            setMonths([
                { id: 1, name: 'Januari' },
                { id: 2, name: 'Februari' },
                { id: 3, name: 'Maret' },
            ]);
            setTriwulans([
                { id: 1, name: 'Triwulan I' },
            ]);
        } else if (triwulan == 2) {
            setMonths([
                { id: 4, name: 'April' },
                { id: 5, name: 'Mei' },
                { id: 6, name: 'Juni' },
            ]);
            setTriwulans([
                { id: 2, name: 'Triwulan II' },
            ]);
        } else if (triwulan == 3) {
            setMonths([
                { id: 7, name: 'Juli' },
                { id: 8, name: 'Agustus' },
                { id: 9, name: 'September' },
            ]);
            setTriwulans([
                { id: 3, name: 'Triwulan III' },
            ]);
        } else if (triwulan == 4) {
            setMonths([
                { id: 10, name: 'Oktober' },
                { id: 11, name: 'November' },
                { id: 12, name: 'Desember' },
            ]);
            setTriwulans([
                { id: 4, name: 'Triwulan IV' },
            ]);
        }
    }, [triwulan]);

    useEffect(() => {
        if (loaded <= 0) {
            if (instanceId && year) {
                getRealisasiHead(instanceId, year).then((res) => {
                    if (res.status == 'success') {
                        setInstance(res.data.instance);
                        setArrTujuanSasaran(res.data.tujuan);
                    }
                    setLoaded(1);
                });
            }
        }
    }, [instanceId, year, triwulan]);

    const refGprgs = useRef(null);
    const [widthGprgs, setWidthGprgs] = useState(0);

    useEffect(() => {
    }, []);

    useEffect(() => {
        if (loaded == 1) {
            let progress = 0;
            let interval = setInterval(() => {
                progress += 1;
                if (progress >= 100) {
                    clearInterval(interval);
                }
                if (refGprgs) {
                    setWidthGprgs(progress);
                }
            }, 250);

            if (instanceId && year) {
                getRealisasi(instanceId, year, triwulan).then((res) => {
                    if (res.status == 'success') {
                        setDatas(res.data);
                    }
                    setLoaded(2);
                });
            }
        }
    }, [loaded == 1]);

    if (!instanceId) {
        return <LoadingSicaram />;
    }

    const downloadRekap = (type: any, fileType: any, id: any) => {
        showBoxAlert('info', 'Mohon Maaf', 'Fitur ini sedang dipersiapkan...');
    }

    return (
        <>
            <div className="">
                <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5">
                    <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                        Laporan Realisasi <br />
                        {!instance?.name && (
                            <div className='w-[500px] max-w-full h-10 animate-pulse rounded-md bg-white'></div>
                        )}
                        {instance?.name ?? '\u00A0'}
                    </h2>
                    <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">

                        {arrTujuanSasaran?.length > 0 && (
                            <button
                                className='btn btn-outline-warning text-xs'
                                onClick={() => {
                                    setShowTujuanSasaran(!showTujuanSasaran);
                                }}>
                                Lihat Tujuan Sasaran
                            </button>
                        )}

                        <Link href={`/report`}
                            className="btn btn-secondary whitespace-nowrap text-xs">
                            <IconArrowBackward className="w-4 h-4" />
                            <span className="ltr:ml-2 rtl:mr-2">
                                Kembali
                            </span>
                        </Link>

                    </div>

                </div>
            </div>

            {showTujuanSasaran && (
                <div className="mb-10">
                    <div className="uppercase text-lg font-bold">
                        TUJUAN {instance?.name}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2">

                        {arrTujuanSasaran?.map((tujuan: any, index: number) => (
                            <div className="col-span-2 xl:col-span-1">
                                <div className="panel shadow-primary">
                                    <div className="font-semibold text-base">
                                        {tujuan?.tujuan_name}
                                    </div>
                                    <div className="my-3 pt-3 border-t">
                                        <div className='underline'>
                                            Indikator Tujuan
                                        </div>
                                        <div className="space-y-2">
                                            {tujuan?.indikator_tujuan?.length == 0 && (
                                                <div className="text-center text-[#3b3f5c] dark:text-white-light">
                                                    Belum ada indikator tujuan
                                                </div>
                                            )}
                                            {tujuan?.indikator_tujuan?.map((indikator: any) => (
                                                <div className="">
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <FontAwesomeIcon icon={faCircle} className="w-2 h-2 text-[#3b3f5c] dark:text-white-light" />
                                                        <div className='font-semibold'>
                                                            {indikator?.name}
                                                        </div>
                                                    </div>
                                                    <div className="ml-3 py-2 px-3 rounded border border-dotted">
                                                        {indikator?.rumus}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-3 pt-3 border-t pl-4">
                                            <div className="uppercase font-bold mb-2">
                                                SASARAN
                                            </div>

                                            <div className="space-y-3">
                                                {tujuan?.sasaran?.map((sasaran: any) => (
                                                    <div className="panel shadow-success">
                                                        <div className="font-semibold text-base">
                                                            {sasaran?.sasaran_name}
                                                        </div>
                                                        <div className="my-3 pt-3 border-t">
                                                            <div className='underline'>
                                                                Indikator Sasaran
                                                            </div>
                                                            <div className="space-y-3">
                                                                {sasaran?.indikator_sasaran?.length == 0 && (
                                                                    <div className="text-center text-[#3b3f5c] dark:text-white-light">
                                                                        Belum ada indikator sasaran
                                                                    </div>
                                                                )}
                                                                {sasaran?.indikator_sasaran?.map((indikatorSasaran: any) => (
                                                                    <div className="">
                                                                        <div className="flex items-center gap-1.5 mb-1">
                                                                            <FontAwesomeIcon icon={faCircle} className="w-2 h-2 text-[#3b3f5c] dark:text-white-light" />
                                                                            <div className='font-semibold'>
                                                                                {indikatorSasaran?.name}
                                                                            </div>
                                                                        </div>
                                                                        <div className="ml-3 py-2 px-3 rounded border border-dotted">
                                                                            {indikatorSasaran?.rumus}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            )}

            <div className="space-y-8">

                {datas?.length == 0 && (
                    <div className='w-full h-[calc(100vh-300px)] flex flex-col gap-3 items-center justify-center'>
                        <LoadingSicaram />
                        <div className="w-[500px] max-w-full">
                            <div className="w-full h-3 bg-gray-200 rounded-md overflow-hidden">
                                <div className="h-full bg-primary"
                                    ref={refGprgs}
                                    style={{ width: widthGprgs + '%' }}></div>
                            </div>
                        </div>
                        <div className="dots-loading text-xl">
                            {loaded == 0 && 'Memuat Data Perangkat Daerah...'}
                            {loaded == 1 && 'Memuat Data Laporan...'}
                        </div>
                    </div>
                )}

                {datas?.map((data: any, index: number) => (
                    <>
                        <div key={`prg-${index}`} className={`${(showProgram == null || showProgram == index) ? '' : 'hidden'} text-black p-5 pl-3.5 bg-white shadow-md rounded-tr-md rounded-br-md border border-white-light border-l-2 !border-l-primary dark:bg-dark dark:border-dark cursor-pointer hover:bg-blue-50`}>

                            <div className="flex items-center justify-between pr-5">
                                <div className="not-italic text-[#515365] text-md font-semibold dark:text-white-light m-0">
                                    {data?.fullcode} - {data?.name}
                                </div>
                                <div className="flex items-center gap-3">

                                    <Tippy content='Unduh Rekap PDF Program' arrow={true} theme='default'>
                                        <button
                                            onClick={() => {
                                                downloadRekap('pdf', 'program', data?.id);
                                            }}
                                            className='group flex items-center gap-2'>
                                            <FontAwesomeIcon icon={faFilePdf} className="w-5 h-4.5 text-[#3b3f5c] dark:text-white-light group-hover:hidden" />
                                            <FontAwesomeIcon icon={faCloudDownloadAlt} className="w-5 h-5 text-[#3b3f5c] dark:text-white-light hidden group-hover:block" />
                                            <span className='hidden group-hover:block font-semibold text-xs'>
                                                PDF
                                            </span>
                                        </button>
                                    </Tippy>

                                    <Tippy content='Unduh Rekap Excel Program' arrow={true} theme='default'>
                                        <button
                                            onClick={() => {
                                                downloadRekap('excel', 'program', data?.id);
                                            }}
                                            className='group flex items-center gap-2'>
                                            <FontAwesomeIcon icon={faFileExcel} className="w-5 h-4.5 text-[#3b3f5c] dark:text-white-light group-hover:hidden" />
                                            <FontAwesomeIcon icon={faCloudDownloadAlt} className="w-5 h-5 text-[#3b3f5c] dark:text-white-light hidden group-hover:block" />
                                            <span className='hidden group-hover:block font-semibold text-xs'>
                                                Excel
                                            </span>
                                        </button>
                                    </Tippy>


                                    {showProgram == null && (
                                        <Tippy content='Buka Rincian' arrow={true} theme='default'>
                                            <button onClick={() => {
                                                showProgram == index ?
                                                    setShowProgram(null) :
                                                    setShowProgram(index)

                                                setShowKegiatan(null);
                                                setShowSubKegiatan(null);
                                            }} className='group'>
                                                <FontAwesomeIcon icon={faFolder} className="w-5 h-4.5 text-[#3b3f5c] dark:text-white-light group-hover:hidden" />
                                                <FontAwesomeIcon icon={faFolderOpen} className="w-5 h-5 text-[#3b3f5c] dark:text-white-light hidden group-hover:block" />
                                            </button>
                                        </Tippy>
                                    )}

                                    {showProgram != null && (
                                        <Tippy content='Tutup Rincian' arrow={true} theme='default'>
                                            <button onClick={() => {
                                                showProgram == index ?
                                                    setShowProgram(null) :
                                                    setShowProgram(index)

                                                setShowKegiatan(null);
                                                setShowSubKegiatan(null);
                                            }} className='group'>
                                                <FontAwesomeIcon icon={faTimesRectangle} className="w-5 h-4.5 text-red-500 group-hover:hidden" />
                                                <FontAwesomeIcon icon={faTimesCircle} className="w-5 h-5 text-red-500 hidden group-hover:block" />
                                            </button>
                                        </Tippy>
                                    )}

                                </div>
                            </div>

                            <div className="my-3">
                                <div className="font-semibold mb-2">
                                    Indikator Kinerja
                                </div>
                                <div className="space-y-2">
                                    {data?.indikatorKinerja?.map((indikator: any, index: number) => (
                                        <div className="flex items-center gap-1.5">
                                            <FontAwesomeIcon icon={faCircle} className="w-2 h-2 text-[#3b3f5c] dark:text-white-light" />
                                            <div>
                                                {indikator}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="my-3 flex flex-wrap xl:flex-nowrap gap-3">
                                <table className='w-full xl:w-1/2'>
                                    <tbody>

                                        <tr>
                                            <td className='!w-[200px] !text-end'>
                                                <div className='font-semibold'>
                                                    Anggaran Renstra
                                                </div>
                                            </td>
                                            <td className='w-[350px]'>
                                                Rp. {new Intl.NumberFormat('id-ID', {}).format(data?.anggaranRenstra)}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className='!text-end'>
                                                <div className='font-semibold'>
                                                    Anggaran Renja
                                                </div>
                                            </td>
                                            <td className='w-[350px]'>
                                                Rp. {new Intl.NumberFormat('id-ID', {}).format(data?.anggaranRenja)}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className='!text-end'>
                                                <div className='font-semibold'>
                                                    Anggaran APBD
                                                </div>
                                            </td>
                                            <td className='w-[350px]'>
                                                Rp. {new Intl.NumberFormat('id-ID', {}).format(data?.anggaranApbd)}
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                                <div className="w-full xl:w-1/2">
                                    <table>
                                        <thead>
                                            <tr className='!bg-slate-800 text-white'>
                                                <th className='!text-center'>
                                                    Indikator Kinerja RPJMD
                                                </th>
                                                <th className='!text-center'>
                                                    Target Kinerja <br /> RPJMD
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.targetKinerja?.map((target: any, index: number) => (
                                                <>
                                                    <tr>
                                                        <td className='border !bg-white dark:!bg-slate-600 dark:!text-white'>
                                                            {target?.name}
                                                        </td>
                                                        <td className='border !text-center !bg-white dark:!bg-slate-600 dark:!text-white'>
                                                            {target?.targetRpjmd} {target?.satuanRpjmd}
                                                        </td>
                                                    </tr>
                                                </>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="text-center text-md font-semibold mb-4">
                                    Tabel Realisasi Program
                                </div>
                                <div className="table-responsive">
                                    <table>
                                        <thead className='sticky top-0 left-0'>
                                            <tr className=''>
                                                <th rowSpan={3} colSpan={1} className='!text-center !bg-slate-800 text-white sticky top-0 left-0'>
                                                    Indikator
                                                </th>
                                                {triwulans?.map((triwulan: any, index: number) => (
                                                    <th colSpan={6} className='!text-center !bg-slate-800 text-white'>
                                                        {triwulan?.name}
                                                    </th>
                                                ))}
                                            </tr>
                                            <tr className=''>
                                                {months?.map((mnth: any, index: number) => (
                                                    <th className='!text-center !text-xs !bg-slate-800 text-white' colSpan={2}>
                                                        {mnth?.name}
                                                    </th>
                                                ))}
                                            </tr>
                                            <tr>
                                                {months?.map((mnth: any, index: number) => (
                                                    <>
                                                        <th className='!bg-primary text-white !text-center !text-xs px-2 !whitespace-nowrap'>
                                                            <Tippy
                                                                content='Realisasi Kinerja'
                                                                arrow={true}
                                                                theme='primary'>
                                                                <span>
                                                                    [R] Kinerja
                                                                </span>
                                                            </Tippy>
                                                        </th>
                                                        <th className='!bg-success text-white !text-center !text-xs px-2 !whitespace-nowrap'>
                                                            <Tippy
                                                                content='Realisasi Keuangan'
                                                                arrow={true}
                                                                theme='success'>
                                                                <span>
                                                                    [R] Keuangan
                                                                </span>
                                                            </Tippy>
                                                        </th>
                                                    </>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {data?.realisasi?.map((realisasi: any, index: number) => (
                                                <tr className='!bg-white dark:!bg-slate-600 dark:!text-white'>
                                                    <td className='!min-w-[400px] sticky left-0 !bg-white dark:!bg-slate-600 dark:!text-white !p-8 border'>
                                                        {realisasi?.name}
                                                    </td>
                                                    {months?.map((mnth: any, indexMonth: number) => (
                                                        <>
                                                            <td className='!whitespace-nowrap !py-8 border'>
                                                                {new Intl.NumberFormat('id-ID', {}).format(realisasi?.[indexMonth + 1]?.kinerja?.toFixed(2))} {realisasi?.[indexMonth + 1]?.kinerjaSatuan}
                                                            </td>
                                                            <td className='!whitespace-nowrap !py-8 border'>
                                                                Rp. {new Intl.NumberFormat('id-ID', {}).format(realisasi?.[indexMonth + 1]?.keuangan)}
                                                            </td>
                                                        </>
                                                    ))}
                                                </tr>
                                            ))}

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {showProgram == index && (
                            <div className='xl:pl-5 space-y-8'>
                                {data?.kegiatan?.map((kegiatan: any, indexKeg: number) => (
                                    <>
                                        <div key={`kgt-${indexKeg}`} className={`${(showKegiatan == null || showKegiatan == indexKeg) ? '' : 'hidden'} text-black p-5 pl-3.5 bg-white shadow-md rounded-tr-md rounded-br-md border border-white-light border-l-2 !border-l-secondary dark:bg-dark dark:border-dark cursor-pointer hover:bg-purple-50`}>

                                            <div className="flex items-center justify-between pr-5">
                                                <div className="font-semibold text-lg">
                                                    {kegiatan?.fullcode} - {kegiatan?.name}
                                                </div>
                                                <div className="flex items-center gap-3">

                                                    <Tippy content='Unduh Rekap PDF Kegiatan' arrow={true} theme='default'>
                                                        <button
                                                            onClick={() => {
                                                                downloadRekap('pdf', 'kegiatan', kegiatan?.id);
                                                            }}
                                                            className='group flex items-center gap-2'>
                                                            <FontAwesomeIcon icon={faFilePdf} className="w-5 h-4.5 text-[#3b3f5c] dark:text-white-light group-hover:hidden" />
                                                            <FontAwesomeIcon icon={faCloudDownloadAlt} className="w-5 h-5 text-[#3b3f5c] dark:text-white-light hidden group-hover:block" />
                                                            <span className='hidden group-hover:block font-semibold text-xs'>
                                                                PDF
                                                            </span>
                                                        </button>
                                                    </Tippy>

                                                    <Tippy content='Unduh Rekap Excel Kegiatan' arrow={true} theme='default'>
                                                        <button
                                                            onClick={() => {
                                                                downloadRekap('excel', 'kegiatan', kegiatan?.id);
                                                            }}
                                                            className='group flex items-center gap-2'>
                                                            <FontAwesomeIcon icon={faFileExcel} className="w-5 h-4.5 text-[#3b3f5c] dark:text-white-light group-hover:hidden" />
                                                            <FontAwesomeIcon icon={faCloudDownloadAlt} className="w-5 h-5 text-[#3b3f5c] dark:text-white-light hidden group-hover:block" />
                                                            <span className='hidden group-hover:block font-semibold text-xs'>
                                                                Excel
                                                            </span>
                                                        </button>
                                                    </Tippy>


                                                    {showKegiatan == null && (
                                                        <Tippy content='Buka Rincian' arrow={true} theme='default'>
                                                            <button onClick={() => {
                                                                showKegiatan == indexKeg ?
                                                                    setShowKegiatan(null) :
                                                                    setShowKegiatan(indexKeg)

                                                                setShowSubKegiatan(null);
                                                            }}
                                                                className='group'>
                                                                <FontAwesomeIcon icon={faFolder} className="w-5 h-4.5 text-[#3b3f5c] dark:text-white-light group-hover:hidden" />
                                                                <FontAwesomeIcon icon={faFolderOpen} className="w-5 h-5 text-[#3b3f5c] dark:text-white-light hidden group-hover:block" />
                                                            </button>
                                                        </Tippy>
                                                    )}

                                                    {showKegiatan != null && (
                                                        <Tippy content='Tutup Rincian' arrow={true} theme='default'>
                                                            <button onClick={() => {
                                                                showKegiatan == indexKeg ?
                                                                    setShowKegiatan(null) :
                                                                    setShowKegiatan(indexKeg)

                                                                setShowSubKegiatan(null);
                                                            }}
                                                                className='group'>
                                                                <FontAwesomeIcon icon={faTimesRectangle} className="w-5 h-4.5 text-red-500 group-hover:hidden" />
                                                                <FontAwesomeIcon icon={faTimesCircle} className="w-5 h-5 text-red-500 hidden group-hover:block" />
                                                            </button>
                                                        </Tippy>
                                                    )}

                                                </div>
                                            </div>


                                            <div className="my-3">
                                                <div className="font-semibold mb-2">
                                                    Indikator Kinerja
                                                </div>
                                                <div className="space-y-2">
                                                    {kegiatan?.indikatorKinerja?.map((indikator: any, index: number) => (
                                                        <div className="flex items-center gap-1.5">
                                                            <FontAwesomeIcon icon={faCircle} className="w-2 h-2 text-[#3b3f5c] dark:text-white-light" />
                                                            <div>
                                                                {indikator}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="my-3 flex flex-wrap xl:flex-nowrap gap-3">
                                                <table className='w-full xl:w-1/2'>
                                                    <tbody>

                                                        <tr>
                                                            <td className='!w-[200px] !text-end'>
                                                                <div className='font-semibold'>
                                                                    Anggaran Renstra
                                                                </div>
                                                            </td>
                                                            <td className='w-[350px]'>
                                                                Rp. {new Intl.NumberFormat('id-ID', {}).format(kegiatan?.anggaranRenstra)}
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td className='!text-end'>
                                                                <div className='font-semibold'>
                                                                    Anggaran Renja
                                                                </div>
                                                            </td>
                                                            <td className='w-[350px]'>
                                                                Rp. {new Intl.NumberFormat('id-ID', {}).format(kegiatan?.anggaranRenja)}
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td className='!text-end'>
                                                                <div className='font-semibold'>
                                                                    Anggaran APBD
                                                                </div>
                                                            </td>
                                                            <td className='w-[350px]'>
                                                                Rp. {new Intl.NumberFormat('id-ID', {}).format(kegiatan?.anggaranApbd)}
                                                            </td>
                                                        </tr>

                                                    </tbody>
                                                </table>
                                                <div className="w-full xl:w-1/2">
                                                    <table>
                                                        <thead>
                                                            <tr className='!bg-slate-800 text-white'>
                                                                <th className='!text-center'>
                                                                    Indikator Kinerja
                                                                </th>
                                                                <th className='!text-center'>
                                                                    Target Kinerja <br /> Renstra
                                                                </th>
                                                                <th className='!text-center'>
                                                                    Target Kinerja <br /> Renstra Perubahan
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {kegiatan?.targetKinerja?.map((target: any, index: number) => (
                                                                <>
                                                                    <tr>
                                                                        <td className='border !bg-white dark:!bg-slate-600 dark:!text-white'>
                                                                            {target?.name}
                                                                        </td>
                                                                        <td className='border !text-center !bg-white dark:!bg-slate-600 dark:!text-white'>
                                                                            {target?.targetRenstra} {target?.satuanRenstra}
                                                                        </td>
                                                                        <td className='border !text-center !bg-white dark:!bg-slate-600 dark:!text-white'>
                                                                            {target?.targetRenja} {target?.satuanRenja}
                                                                        </td>
                                                                    </tr>
                                                                </>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <div className="text-center text-md font-semibold mb-4">
                                                    Tabel Realisasi Kegiatan
                                                </div>
                                                <div className="table-responsive">
                                                    <table>
                                                        <thead className='sticky top-0 left-0'>
                                                            <tr className=''>
                                                                <th rowSpan={3} colSpan={1} className='!text-center !bg-slate-800 text-white sticky top-0 left-0'>
                                                                    Indikator
                                                                </th>
                                                                {triwulans?.map((triwulan: any, index: number) => (
                                                                    <th colSpan={6} className='!text-center !bg-slate-800 text-white'>
                                                                        {triwulan?.name}
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                            <tr className=''>
                                                                {months?.map((mnth: any, index: number) => (
                                                                    <th className='!text-center !text-xs !bg-slate-800 text-white' colSpan={2}>
                                                                        {mnth?.name}
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                            <tr>
                                                                {months?.map((mnth: any, index: number) => (
                                                                    <>
                                                                        <th className='!bg-primary text-white !text-center !text-xs px-2 !whitespace-nowrap'>
                                                                            <Tippy
                                                                                content='Realisasi Kinerja'
                                                                                arrow={true}
                                                                                theme='primary'>
                                                                                <span>
                                                                                    [R] Kinerja
                                                                                </span>
                                                                            </Tippy>
                                                                        </th>
                                                                        <th className='!bg-success text-white !text-center !text-xs px-2 !whitespace-nowrap'>
                                                                            <Tippy
                                                                                content='Realisasi Keuangan'
                                                                                arrow={true}
                                                                                theme='success'>
                                                                                <span>
                                                                                    [R] Keuangan
                                                                                </span>
                                                                            </Tippy>
                                                                        </th>
                                                                    </>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                            {kegiatan?.realisasi?.map((realisasi: any, index: number) => (
                                                                <tr className='!bg-white dark:!bg-slate-600 dark:!text-white'>
                                                                    <td className='!min-w-[400px] sticky left-0 !bg-white dark:!bg-slate-600 dark:!text-white !p-8 border'>
                                                                        {realisasi?.name}
                                                                    </td>
                                                                    {months?.map((mnth: any, indexMonth: number) => (
                                                                        <>
                                                                            <td className='!whitespace-nowrap !py-8 border'>
                                                                                {new Intl.NumberFormat('id-ID', {}).format(realisasi?.[indexMonth + 1]?.kinerja?.toFixed(2))} {realisasi?.[indexMonth + 1]?.kinerjaSatuan}
                                                                            </td>
                                                                            <td className='!whitespace-nowrap !py-8 border'>
                                                                                Rp. {new Intl.NumberFormat('id-ID', {}).format(realisasi?.[indexMonth + 1]?.keuangan)}
                                                                            </td>
                                                                        </>
                                                                    ))}
                                                                </tr>
                                                            ))}

                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                        </div>


                                        {showKegiatan == indexKeg && (
                                            <div className='xl:pl-5 space-y-8'>
                                                {kegiatan?.subKegiatan?.map((subKegiatan: any, indexSubKeg: number) => (
                                                    <div key={`skgt-${indexSubKeg}`} className={`${(showSubKegiatan == null || showSubKegiatan == indexSubKeg) ? '' : 'hidden'} text-black p-5 pl-3.5 bg-white shadow-md rounded-tr-md rounded-br-md border border-white-light border-l-2 !border-l-success dark:bg-dark dark:border-dark cursor-pointer hover:bg-green-50`}>

                                                        <div className="flex items-center justify-between pr-5">
                                                            <div className="font-semibold text-lg">
                                                                {subKegiatan?.fullcode} - {subKegiatan?.name}
                                                            </div>
                                                            <div className="flex items-center gap-3">

                                                                <Tippy content='Unduh Rekap PDF Sub Kegiatan' arrow={true} theme='default'>
                                                                    <button
                                                                        onClick={() => {
                                                                            downloadRekap('pdf', 'sub-kegiatan', subKegiatan?.id);
                                                                        }}
                                                                        className='group flex items-center gap-2'>
                                                                        <FontAwesomeIcon icon={faFilePdf} className="w-5 h-4.5 text-[#3b3f5c] dark:text-white-light group-hover:hidden" />
                                                                        <FontAwesomeIcon icon={faCloudDownloadAlt} className="w-5 h-5 text-[#3b3f5c] dark:text-white-light hidden group-hover:block" />
                                                                        <span className='hidden group-hover:block font-semibold text-xs'>
                                                                            PDF
                                                                        </span>
                                                                    </button>
                                                                </Tippy>

                                                                <Tippy content='Unduh Rekap Excel Sub Kegiatan' arrow={true} theme='default'>
                                                                    <button
                                                                        onClick={() => {
                                                                            downloadRekap('excel', 'sub-kegiatan', subKegiatan?.id);
                                                                        }}
                                                                        className='group flex items-center gap-2'>
                                                                        <FontAwesomeIcon icon={faFileExcel} className="w-5 h-4.5 text-[#3b3f5c] dark:text-white-light group-hover:hidden" />
                                                                        <FontAwesomeIcon icon={faCloudDownloadAlt} className="w-5 h-5 text-[#3b3f5c] dark:text-white-light hidden group-hover:block" />
                                                                        <span className='hidden group-hover:block font-semibold text-xs'>
                                                                            Excel
                                                                        </span>
                                                                    </button>
                                                                </Tippy>

                                                            </div>
                                                        </div>

                                                        <div className="my-3">
                                                            <div className="font-semibold mb-2">
                                                                Indikator Kinerja
                                                            </div>
                                                            <div className="space-y-2">
                                                                {subKegiatan?.indikatorKinerja?.map((indikator: any, index: number) => (
                                                                    <div className="flex items-center gap-1.5">
                                                                        <FontAwesomeIcon icon={faCircle} className="w-2 h-2 text-[#3b3f5c] dark:text-white-light" />
                                                                        <div>
                                                                            {indikator}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>


                                                        {subKegiatan?.tagsSumberDana?.length > 0 && (
                                                            <div className="my-3">
                                                                <div className="font-semibold mb-2">
                                                                    Sumber Dana
                                                                </div>
                                                                <div className="flex items-center flex-wrap gap-4">

                                                                    {subKegiatan?.tagsSumberDana?.map((sumberDana: any, index: number) => (
                                                                        <div className="text-xs border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white dark:border-blue-700 dark:hover:bg-blue-700 dark:text-blue-300 dark:hover:text-white px-2 py-1 rounded-md cursor-pointer whitespace-nowrap">
                                                                            <div className='font-semibold text-center'>
                                                                                {sumberDana?.name}
                                                                            </div>
                                                                            <div className='text-center'>
                                                                                Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(sumberDana?.nominal)}
                                                                            </div>
                                                                        </div>
                                                                    ))}

                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="my-3 flex flex-wrap xl:flex-nowrap gap-3">
                                                            <table className='w-full xl:w-1/2'>
                                                                <tbody>

                                                                    <tr>
                                                                        <td className='!w-[200px] !text-end'>
                                                                            <div className='font-semibold'>
                                                                                Anggaran Renstra
                                                                            </div>
                                                                        </td>
                                                                        <td className='w-[350px]'>
                                                                            Rp. {new Intl.NumberFormat('id-ID', {}).format(subKegiatan?.anggaranRenstra)}
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className='!text-end'>
                                                                            <div className='font-semibold'>
                                                                                Anggaran Renja
                                                                            </div>
                                                                        </td>
                                                                        <td className='w-[350px]'>
                                                                            Rp. {new Intl.NumberFormat('id-ID', {}).format(subKegiatan?.anggaranRenja)}
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className='!text-end'>
                                                                            <div className='font-semibold'>
                                                                                Anggaran APBD
                                                                            </div>
                                                                        </td>
                                                                        <td className='w-[350px]'>
                                                                            Rp. {new Intl.NumberFormat('id-ID', {}).format(subKegiatan?.anggaranApbd)}
                                                                        </td>
                                                                    </tr>

                                                                </tbody>
                                                            </table>
                                                            <div className="w-full xl:w-1/2">
                                                                <table>
                                                                    <thead>
                                                                        <tr className='!bg-slate-800 text-white'>
                                                                            <th className='!text-center'>
                                                                                Indikator Kinerja
                                                                            </th>
                                                                            <th className='!text-center'>
                                                                                Target Kinerja <br /> Renstra
                                                                            </th>
                                                                            <th className='!text-center'>
                                                                                Target Kinerja <br /> Renstra Perubahan
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {subKegiatan?.targetKinerja?.map((target: any, index: number) => (
                                                                            <>
                                                                                <tr>
                                                                                    <td className='border !bg-white dark:!bg-slate-600 dark:!text-white'>
                                                                                        {target?.name}
                                                                                    </td>
                                                                                    <td className='border !text-center !bg-white dark:!bg-slate-600 dark:!text-white'>
                                                                                        {target?.targetRenstra} {target?.satuanRenstra}
                                                                                    </td>
                                                                                    <td className='border !text-center !bg-white dark:!bg-slate-600 dark:!text-white'>
                                                                                        {target?.targetRenja} {target?.satuanRenja}
                                                                                    </td>
                                                                                </tr>
                                                                            </>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4">
                                                            <div className="text-center text-md font-semibold mb-4">
                                                                Tabel Realisasi Kegiatan
                                                            </div>
                                                            <div className="table-responsive">
                                                                <table>
                                                                    <thead className='sticky top-0 left-0'>
                                                                        <tr className=''>
                                                                            <th rowSpan={3} colSpan={1} className='!text-center !bg-slate-800 text-white sticky top-0 left-0'>
                                                                                Indikator
                                                                            </th>
                                                                            {triwulans?.map((triwulan: any, index: number) => (
                                                                                <th colSpan={6} className='!text-center !bg-slate-800 text-white'>
                                                                                    {triwulan?.name}
                                                                                </th>
                                                                            ))}
                                                                        </tr>
                                                                        <tr className=''>
                                                                            {months?.map((mnth: any, index: number) => (
                                                                                <th className='!text-center !text-xs !bg-slate-800 text-white' colSpan={2}>
                                                                                    {mnth?.name}
                                                                                </th>
                                                                            ))}
                                                                        </tr>
                                                                        <tr>
                                                                            {months?.map((mnth: any, index: number) => (
                                                                                <>
                                                                                    <th className='!bg-primary text-white !text-center !text-xs px-2 !whitespace-nowrap'>
                                                                                        <Tippy
                                                                                            content='Realisasi Kinerja'
                                                                                            arrow={true}
                                                                                            theme='primary'>
                                                                                            <span>
                                                                                                [R] Kinerja
                                                                                            </span>
                                                                                        </Tippy>
                                                                                    </th>
                                                                                    <th className='!bg-success text-white !text-center !text-xs px-2 !whitespace-nowrap'>
                                                                                        <Tippy
                                                                                            content='Realisasi Keuangan'
                                                                                            arrow={true}
                                                                                            theme='success'>
                                                                                            <span>
                                                                                                [R] Keuangan
                                                                                            </span>
                                                                                        </Tippy>
                                                                                    </th>
                                                                                </>
                                                                            ))}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>

                                                                        {subKegiatan?.realisasi?.map((realisasi: any, index: number) => (
                                                                            <tr className='!bg-white dark:!bg-slate-600 dark:!text-white'>
                                                                                <td className='!min-w-[400px] sticky left-0 !bg-white dark:!bg-slate-600 dark:!text-white !p-8 border'>
                                                                                    {realisasi?.name}
                                                                                </td>
                                                                                {months?.map((mnth: any, indexMonth: number) => (
                                                                                    <>
                                                                                        <td className='!whitespace-nowrap !py-8 border'>
                                                                                            {/* {new Intl.NumberFormat('id-ID', {}).format(realisasi?.[indexMonth + 1]?.kinerja?.toFixed(2))} {realisasi?.[indexMonth + 1]?.kinerjaSatuan} */}
                                                                                            {new Intl.NumberFormat('id-ID', {}).format(realisasi?.[indexMonth + 1]?.kinerja)} {realisasi?.[indexMonth + 1]?.kinerjaSatuan}
                                                                                        </td>
                                                                                        <td className='!whitespace-nowrap !py-8 border'>
                                                                                            Rp. {new Intl.NumberFormat('id-ID', {}).format(realisasi?.[indexMonth + 1]?.keuangan)}
                                                                                        </td>
                                                                                    </>
                                                                                ))}
                                                                            </tr>
                                                                        ))}

                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>

                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ))}
                            </div>
                        )}
                    </>
                ))}

            </div>
        </>
    );
}

export default Index;
