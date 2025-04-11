import { useEffect, useState, Fragment, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/themeConfigSlice';
import { Tab } from '@headlessui/react';
// import dynamic from 'next/dynamic';
// const ReactApexChart = dynamic(() => import('react-apexcharts'), {
//     ssr: false,
// });
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Swal from 'sweetalert2';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BaseUri } from '@/apis/serverConfig';
import { getReportByRekening, getReportRekening } from '@/apis/report_apis';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import LoadingSicaram from '@/components/LoadingSicaram';


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
        padding: '10px 20px',
    });
}


const Page = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [periode, setPeriode] = useState<any>({});

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
        if (isMounted) {
            const localPeriode = localStorage.getItem('periode');
            if (localPeriode) {
                setPeriode(JSON.parse(localPeriode ?? ""));
            }
        }
    }, [isMounted]);

    const route = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Laporan Rekening'));
    });


    const [datas, setDatas] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [instanceId, setInstanceId] = useState<number>(0);
    const [instance, setInstance] = useState<any>(null);
    const [year, setYear] = useState<any>(null);
    const [arrMonths, setArrMonths] = useState<any>([]);
    const [month, setMonth] = useState<number>(0);
    const [kodeRekeningId, setKodeRekeningId] = useState<any>(null);
    const [kodeRekening, setKodeRekening] = useState<any>(null);

    useEffect(() => {
        if (route.query) {
            const { instance, kd_rek, month, year } = route.query;
            setInstanceId((parseInt(instance as string) || 0));
            setYear(year);
            setMonth((parseInt(month as string) || 0));
            setKodeRekeningId(kd_rek);
        }
    }, [route.query]);


    const refGprgs = useRef(null);
    const [widthGprgs, setWidthGprgs] = useState(0);

    useEffect(() => {
        if (periode.id && year && kodeRekeningId) {
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

            setIsLoading(true);
            getReportByRekening(instanceId, periode.id, year, month, kodeRekeningId).then((res) => {
                if (res.status === 'success') {
                    setDatas(res.data.datas);
                    setKodeRekening(res.data.kode_rekening);
                    setInstance(res.data.instance);
                    setArrMonths(res.data.arrMonths);
                } else {
                    showAlert('error', res.message);
                }
                setIsLoading(false);
            }).catch((err) => {
                showAlert('error', err.message);
                setIsLoading(false);
            });
        }
    }, [instanceId, year, month, kodeRekeningId, periode.id]);

    const getMonthName = (month: number) => {
        const monthNames = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];

        if (month >= 1 && month <= 12) {
            return monthNames[month - 1];
        } else {
            return 'Invalid month';
        }
    }

    return (
        <div>
            <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5">
                <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-3 uppercase">
                    Laporan Rekening {month ? getMonthName(month) : ''} Tahun {year}<br />
                    {isLoading == false && (
                        <>
                            {instance?.name ?? 'Kabupaten Ogan Ilir'}
                        </>
                    )}
                </h2>

                <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">

                    <Link href={`/report`}
                        className="btn btn-secondary whitespace-nowrap text-xs">
                        <IconArrowBackward className="w-4 h-4" />
                        <span className="ltr:ml-2 rtl:mr-2">
                            Kembali
                        </span>
                    </Link>

                </div>
            </div>


            <div className="panel">
                {isLoading && (
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
                            Memuat Data Laporan...
                        </div>
                    </div>
                )}
                {isLoading === false && (
                    <>
                        {arrMonths?.length > 1 && (
                            <Tab.Group>
                                <Tab.List className="mt-3 flex flex-wrap gap-0 pb-2 border-b-2">
                                    {arrMonths?.map((item: any, index: number) => (
                                        <Tab as={Fragment}>
                                            {({ selected }) => (
                                                <button
                                                    className={`${selected ? 'bg-primary text-white !outline-none' : 'border'} before:inline-block -mb-[1px] flex items-center p-3.5 py-2 hover:bg-primary hover:text-white grow justify-center`}
                                                >
                                                    <Tippy content={getMonthName(item)}>
                                                        <span className="text-sm font-semibold">
                                                            {getMonthName(item)}
                                                        </span>
                                                    </Tippy>
                                                </button>
                                            )}
                                        </Tab>
                                    ))}
                                </Tab.List>

                                <Tab.Panels>
                                    {arrMonths?.map((month: any, indexMomth: number) => (
                                        <Tab.Panel>
                                            <div className="table-responsive mt-4 max-h-[calc(100vh-300px)]">
                                                <table className="table-hover">
                                                    <thead className='sticky top-0 left-0 w-full'>
                                                        <tr className='!bg-dark !text-white'>
                                                            <th className='text-start w-[400px]'>
                                                                Perangkat Daerah
                                                            </th>
                                                            <th className='text-center w-[400px]'>
                                                                Kode Rekening
                                                            </th>
                                                            <th className='text-center'>
                                                                Tahun
                                                            </th>
                                                            <th className='text-center'>
                                                                Bulan
                                                            </th>
                                                            <th className='text-center w-[400px]'>
                                                                Pagu Anggaran
                                                            </th>
                                                            <th className='text-center w-[400px]'>
                                                                Realisasi
                                                            </th>
                                                            <th className='text-center'>
                                                                Persentase
                                                            </th>
                                                            <th className='text-center'>
                                                                Tanggal Diperbarui
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {datas[month]?.map((item: any, index: number) => (
                                                            <tr>
                                                                <td className='border-x'>
                                                                    {item.instance_name}
                                                                </td>
                                                                <td className='border-x'>
                                                                    {item.kode_rekening_fullcode} - {item.kode_rekening_name}
                                                                </td>
                                                                <td className='border-x'>
                                                                    {item.year}
                                                                </td>
                                                                <td className='border-x'>
                                                                    {item.month_name}
                                                                </td>
                                                                <td className='border-x'>
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="">
                                                                            Rp.
                                                                        </div>
                                                                        <div className={`${item.pagu_anggaran < 0 ? '!text-red-500' : ''}`}>
                                                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(item.pagu_anggaran)}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className='border-x'>
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="">
                                                                            Rp.
                                                                        </div>
                                                                        <div className={`${item.realisasi_anggaran < 0 ? '!text-red-500' : ''}`}>
                                                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(item.realisasi_anggaran)}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className='border-x'>
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        <div className={`${item.persentase_realisasi < 0 ? '!text-red-500' : ''}`}>
                                                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(item.persentase_realisasi)}
                                                                        </div>
                                                                        <div className="">
                                                                            %
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className='border-x'>
                                                                    {item?.updated_at ? (
                                                                        <div className="whitespace-nowrap">
                                                                            {new Date(item?.updated_at).toLocaleString('id-ID', {
                                                                                day: 'numeric',
                                                                                month: 'long',
                                                                                year: 'numeric',
                                                                            })}

                                                                            &nbsp;
                                                                            |
                                                                            &nbsp;
                                                                            {new Date(item?.updated_at).toLocaleString('id-ID', {
                                                                                hour: 'numeric',
                                                                                minute: 'numeric',
                                                                            })}
                                                                            &nbsp;
                                                                            WIB
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            -
                                                                        </>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Tab.Panel>
                                    ))}
                                </Tab.Panels>
                            </Tab.Group>
                        )}
                        {arrMonths?.length == 1 && (
                            <>
                                {arrMonths?.map((month: any, indexMomth: number) => (
                                    <div className="table-responsive mt-4 max-h-[calc(100vh-300px)]">
                                        <table className="table-hover">
                                            <thead className='sticky top-0 left-0 w-full'>
                                                <tr className='!bg-dark !text-white'>
                                                    <th className='text-start w-[400px]'>
                                                        Perangkat Daerah
                                                    </th>
                                                    <th className='text-center w-[400px]'>
                                                        Kode Rekening
                                                    </th>
                                                    <th className='text-center'>
                                                        Tahun
                                                    </th>
                                                    <th className='text-center'>
                                                        Bulan
                                                    </th>
                                                    <th className='text-center'>
                                                        Pagu Anggaran
                                                    </th>
                                                    <th className='text-center'>
                                                        Realisasi
                                                    </th>
                                                    <th className='text-center'>
                                                        Persentase
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {datas[month]?.map((item: any, index: number) => (
                                                    <tr>
                                                        <td>
                                                            {item.instance_name}
                                                        </td>
                                                        <td>
                                                            {item.kode_rekening_fullcode} - {item.kode_rekening_name}
                                                        </td>
                                                        <td>
                                                            {item.year}
                                                        </td>
                                                        <td>
                                                            {item.month_name}
                                                        </td>
                                                        <td>
                                                            <div className="flex items-center justify-between">
                                                                <div className="">
                                                                    Rp.
                                                                </div>
                                                                <div className={`${item.pagu_anggaran < 0 ? '!text-red-500' : ''}`}>
                                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(item.pagu_anggaran)}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="flex items-center justify-between">
                                                                <div className="">
                                                                    Rp.
                                                                </div>
                                                                <div className={`${item.realisasi_anggaran < 0 ? '!text-red-500' : ''}`}>
                                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(item.realisasi_anggaran)}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="flex items-center justify-center gap-2">
                                                                <div className={`${item.persentase_realisasi < 0 ? '!text-red-500' : ''}`}>
                                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(item.persentase_realisasi)}
                                                                </div>
                                                                <div className="">
                                                                    %
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </>
                        )}
                    </>
                )}
            </div>

        </div>
    );
}

export default Page;
export const metadata = {
    title: 'Rekening',
    description: 'Rekening',
    icons: {
        icon: '/images/logo.png',
        shortcut: '/images/logo.png',
        apple: '/images/logo.png',
    },
};
export const dynamic = 'force-dynamic';
