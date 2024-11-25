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
import Swal from 'sweetalert2';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BaseUri } from '@/apis/serverConfig';
import { getReportRekening } from '@/apis/report_apis';
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
    const [year, setYear] = useState<any>(null)

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

    const [loaded, setLoaded] = useState<number>(0);
    const [datas, setDatas] = useState<any>([]);
    const [instanceId, setInstanceId] = useState<any>(null);
    const [instance, setInstance] = useState<any>(null);

    useEffect(() => {
        if (route.query) {
            const { instance, year, triwulan } = route.query;
            setInstanceId(instance);
            setYear(year);
        }
    }, [route.query]);


    const refGprgs = useRef(null);
    const [widthGprgs, setWidthGprgs] = useState(0);

    useEffect(() => {
        setLoaded(0)
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

        if (isMounted && instanceId && year && periode?.id) {
            getReportRekening(instanceId, year, periode?.id).then((res: any) => {
                if (res.status === 'success') {
                    setInstance(res.data.instance)
                    setDatas(res.data.datas)
                }
                if (res.status === 'error') {
                    showBoxAlert('error', 'Error', res.message);
                }
                setLoaded(1)
            });
        }
    }, [isMounted, instanceId, year, periode?.id])

    return (
        <>
            <div className="">
                <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5">
                    <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                        Laporan Rekening <br />
                        {instance?.name ?? 'Kabupaten Ogan Ilir'}
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



                {loaded !== 1 && (
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
                            {loaded == 0 && 'Memuat Data Laporan...'}
                        </div>
                    </div>
                )}

                {loaded === 1 && (
                    <div className="panel">
                        <div className="table-responsive">
                            <table className="table-hover">
                                <thead>
                                    <tr className='!bg-dark !text-white'>
                                        <th className='!py-5 border uppercase text-center whitespace-nowrap' rowSpan={2}>
                                            Kode Rekening
                                        </th>
                                        <th className='!py-5 border uppercase text-center whitespace-nowrap' rowSpan={2}>
                                            Uraian
                                        </th>
                                        <th className='!py-5 border uppercase text-center whitespace-nowrap' rowSpan={2}>
                                            Anggaran
                                        </th>
                                        <th className='!py-5 border uppercase text-center whitespace-nowrap' colSpan={3}>
                                            Realisasi
                                        </th>
                                        <th className='!py-5 border uppercase text-center whitespace-nowrap' rowSpan={2}>
                                            Lebih/Kurang
                                        </th>
                                        <th className='!py-5 border uppercase text-center whitespace-nowrap' rowSpan={2}>
                                            Persentase
                                        </th>
                                    </tr>
                                    <tr className='!bg-dark !text-white'>
                                        <th className='!py-5 border uppercase text-center whitespace-nowrap'>
                                            Periode Lalu
                                        </th>
                                        <th className='!py-5 border uppercase text-center whitespace-nowrap'>
                                            Periode Ini
                                        </th>
                                        <th className='!py-5 border uppercase text-center whitespace-nowrap'>
                                            Total
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {datas?.map((data: any, index: number) => (
                                        <tr>
                                            <td>
                                                <div className="font-semibold whitespace-nowrap">
                                                    {data?.kode_rekening}
                                                </div>
                                            </td>
                                            <td>
                                                <div className=''>
                                                    {data?.nama_rekening}
                                                </div>
                                            </td>
                                            <td className='whitespace-nowrap'>
                                                Rp. {new Intl.NumberFormat('id-ID', {}).format(data?.pagu_anggaran)}
                                            </td>
                                            <td className='whitespace-nowrap'>
                                                Rp. {new Intl.NumberFormat('id-ID', {}).format(data?.realisasi_anggaran_lalu)}
                                            </td>
                                            <td className='whitespace-nowrap'>
                                                Rp. {new Intl.NumberFormat('id-ID', {}).format(data?.realisasi_anggaran_ini)}
                                            </td>
                                            <td className='whitespace-nowrap'>
                                                Rp. {new Intl.NumberFormat('id-ID', {}).format(data?.realisasi_anggaran_total)}
                                            </td>
                                            <td className={`whitespace-nowrap ${(data?.realisasi_anggaran_total - data?.pagu_anggaran) < 0 ? 'text-success' : ''}`}>
                                                Rp. {new Intl.NumberFormat('id-ID', {}).format(data?.realisasi_anggaran_total - data?.pagu_anggaran)}
                                            </td>
                                            <td className='text-center whitespace-nowrap'>
                                                <Tippy
                                                    content={`(Rp. ${new Intl.NumberFormat('id-ID', {}).format(data?.realisasi_anggaran_total)} / Rp. ${new Intl.NumberFormat('id-ID', {}).format(data?.pagu_anggaran)}) x 100`}
                                                    placement='top-end'>
                                                    <div className="cursor-pointer">
                                                        {((data?.realisasi_anggaran_total / data?.pagu_anggaran) * 100).toFixed(2)} %
                                                    </div>
                                                </Tippy>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div >
        </>
    );
}
export default Page;
