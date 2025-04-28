import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { useDispatch } from "react-redux";
import { setPageTitle } from "@/store/themeConfigSlice";
import { BaseUri } from "@/apis/serverConfig";
import { useSession } from "next-auth/react";
import axios from "axios";
import DisplayMoney from "@/components/DisplayMoney";
import Link from "next/link";

export default function Page() {

    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        dispatch(setPageTitle('Laporan'));
    });


    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    })

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
            const localPeriode = localStorage.getItem('periode');
            if (localPeriode) {
                setPeriode(JSON.parse(localPeriode ?? ""));
            }
        }
    }, [isMounted]);

    const [instanceId, setInstanceId] = useState<any>((router.query.instance ?? null) ?? CurrentUser?.instance_id);
    const [instance, setInstance] = useState<any>(null);
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
    const [month, setMonth] = useState<any>(null);
    const [monthID, setMonthID] = useState<any>(null);

    useEffect(() => {
        if (router.query) {
            const { instance, year, month } = router.query;
            if (!CurrentUser?.instance_id) {
                setInstanceId(instance);
            }
            setYear(year);
            setMonthID(month)
            setMonth(months.filter((item: any, index: number) => item.id == month)[0]);
        }
    }, [router.query]);


    const [CurrentToken, setCurrentToken] = useState<any>(null);
    const session = useSession();
    useEffect(() => {
        if (isMounted && session.status === 'authenticated') {
            const token = session?.data?.user?.name;
            setCurrentToken(token);
        }
    }, [isMounted, session]);

    const fetchReport = async () => {
        if (CurrentToken) {
            const response = await axios.get(`${BaseUri()}/report/1/v2`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${CurrentToken}`
                },
                params: {
                    periode: periode?.id,
                    instance: instanceId,
                    year: year,
                    month: monthID,
                }
            });
            const data = await response.data;
            return data;
        }
    }

    const [isFetching, setIsFetching] = useState(true)
    const [datas, setDatas] = useState<any>([]);
    useEffect(() => {
        if (isMounted && year && month && instanceId && CurrentToken) {
            setIsFetching(true)
            fetchReport().then((data) => {
                if (data.status == 'success') {
                    setDatas(data.data.data)
                    setInstance(data.data.instance);
                } else if (data.status == 'error') {
                    // showAlert('error', data.message);
                } else {
                    // showAlert('error', 'Terjadi kesalahan');
                }
                setIsFetching(false)
            });
        }
    }, [instanceId, month, year, isMounted, CurrentToken]);

    // console.log(month, monthID)

    return (
        <div>
            <div className="panel">
                <div className="">
                    <div className="text-center font-semibold text-md">
                        <div>
                            LAPORAN KONSOLIDASI PROGRAM APBD KABUAPTEN OGAN ILIR
                        </div>
                        <div>
                            DIRINCI MENURUT PROGRAM/KEGIATAN
                        </div>
                        <div>
                            TAHUN ANGGARAN {year}
                        </div>
                    </div>

                    <div className="flex items-center gap-x-2">
                        <div className="shrink w-[150px]">
                            PERANGKAT DAERAH
                        </div>
                        <div>
                            : {instance?.name ?? '-'}
                        </div>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <div className="shrink w-[150px]">
                            BULAN
                        </div>
                        <div className="uppercase">
                            : {month?.name ?? '-'}
                        </div>
                    </div>
                </div>
                <div className="table-responsive max-h-[calc(100vh-300px)] overflow-x-auto pb-5">
                    <table className="table-stripeds">
                        <thead className="sticky top-0 left-0">
                            <tr>
                                <th className="text-center border bg-slate-900 text-white"
                                    rowSpan={4}
                                >
                                    No
                                </th>
                                <th className="text-center border bg-slate-900 text-white min-w-[300px]"
                                    colSpan={6}
                                    rowSpan={4}
                                >
                                    Kode Rekening
                                </th>
                                <th className="text-center border bg-slate-900 text-white min-w-[400px]"
                                    rowSpan={4}
                                >
                                    Program/Kegiatan/Sub Kegiatan
                                </th>
                                <th className="text-center border bg-slate-900 text-white"
                                    colSpan={7}
                                >
                                    Anggaran Tahun {year}
                                </th>
                                <th className="text-center border bg-slate-900 text-white"
                                    colSpan={10}
                                >
                                    Indikator Kinerja Program/Kegiatan(Outcome/Outputs)
                                </th>
                            </tr>
                            <tr>
                                <th className="text-center border bg-slate-900 text-white"
                                    colSpan={2}
                                >
                                    Anggaran
                                </th>
                                <th className="text-center border bg-slate-900 text-white"
                                    rowSpan={3}
                                >
                                    Target Bulan Ini
                                </th>
                                <th className="text-center border bg-slate-900 text-white"
                                    colSpan={4}
                                >
                                    Realisasi Anggaran
                                </th>

                                <th className="text-center border bg-slate-900 text-white min-w-[200px]"
                                    rowSpan={3}
                                >
                                    Indikator Kinerja Program/Kegiatan(Outcome/Outputs)
                                </th>
                                <th className="text-center border bg-slate-900 text-white"
                                    colSpan={9}
                                >
                                    Realisasi Kinerja
                                </th>
                            </tr>
                            <tr>
                                <th className="text-center border bg-slate-900 text-white min-w-[200px]"
                                    rowSpan={2}
                                >
                                    Pagu (Rp)
                                </th>
                                <th className="text-center border bg-slate-900 text-white min-w-[100px]"
                                    rowSpan={2}
                                >
                                    Bobot (%)
                                </th>
                                <th className="text-center border bg-slate-900 text-white">
                                    Realisasi s.d Bulan Lalu
                                </th>
                                <th className="text-center border bg-slate-900 text-white">
                                    Realisasi Bulan Ini
                                </th>
                                <th className="text-center border bg-slate-900 text-white"
                                    colSpan={2}
                                >
                                    Realisasi s.d Bulan Ini
                                </th>

                                <th className="text-center border bg-slate-900 text-white"
                                    colSpan={3}
                                >
                                    Realisasi Kinerja s.d Akhir Tahun
                                </th>
                                <th className="text-center border bg-slate-900 text-white"
                                    colSpan={5}
                                >
                                    Realisasi Kinerja
                                </th>
                                <th className="text-center border bg-slate-900 text-white min-w-[300px]"
                                    rowSpan={2}
                                >
                                    Data Pendukung (Photo)
                                </th>
                            </tr>
                            <tr>
                                <th className="text-center border bg-slate-900 text-white min-w-[200px]">
                                    (Rp)
                                </th>
                                <th className="text-center border bg-slate-900 text-white min-w-[200px]">
                                    (Rp)
                                </th>
                                <th className="text-center border bg-slate-900 text-white min-w-[200px]">
                                    (Rp)
                                </th>
                                <th className="text-center border bg-slate-900 text-white min-w-[100px]">
                                    (%)
                                </th>

                                <th className="text-center border bg-slate-900 text-white min-w-[200px]"
                                    colSpan={2}>
                                    Target Kinerja s.d Akhir Tahun
                                </th>
                                <th className="text-center border bg-slate-900 text-white min-w-[100px]">
                                    %
                                </th>
                                <th className="text-center border bg-slate-900 text-white min-w-[200px]">
                                    Realisasi Kinerja Bulan Lalu
                                </th>
                                <th className="text-center border bg-slate-900 text-white min-w-[200px]">
                                    Realisasi Kinerja Bulan Ini
                                </th>
                                <th className="text-center border bg-slate-900 text-white min-w-[200px]"
                                    colSpan={2}
                                >
                                    Realisasi Kinerja s.d Bulan Ini
                                </th>
                                <th className="text-center border bg-slate-900 text-white min-w-[100px]">
                                    (%)
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {isFetching ? (
                                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td className="border border-slate-600">

                                        </td>
                                        {/* kode rekening start */}
                                        <td className="border border-slate-600">

                                        </td>
                                        <td className="border border-slate-600">

                                        </td>
                                        <td className="border border-slate-600">

                                        </td>
                                        <td className="border border-slate-600">

                                        </td>
                                        <td className="border border-slate-600">

                                        </td>
                                        <td className="border border-slate-600">

                                        </td>
                                        {/* kode rekening end */}

                                        <td className="border border-slate-600">

                                        </td>
                                        <td className="border border-slate-600">

                                        </td>
                                        <td className="border border-slate-600">

                                        </td>
                                        <td className="border border-slate-600">

                                        </td>
                                        <td className="border border-slate-600">

                                        </td>
                                        <td className="border border-slate-600">

                                        </td>
                                        <td className="border border-slate-600">

                                        </td>
                                        <td className="border border-slate-600">

                                        </td>
                                        <td className="border border-slate-600">

                                        </td>
                                        <td className="border border-slate-600">

                                        </td>
                                        <td className="border border-slate-600">

                                        </td>
                                        <td className="border border-slate-600">

                                        </td>
                                        <td className="border border-slate-600">

                                        </td>
                                        <td className="border border-slate-600">

                                        </td>
                                        <td className="border border-slate-600">

                                        </td>
                                        <td className="border border-slate-600">

                                        </td>
                                        <td className="border border-slate-600">

                                        </td>
                                        <td className="border border-slate-600">

                                        </td>

                                    </tr>
                                ))
                            ) : (
                                datas?.map((item: any, index: number) => (
                                    <tr
                                        key={index}
                                        className={`${item.data_type == 'data' ? '' : 'bg-slate-300 !text-whites'}`}
                                    >
                                        <td className="border border-slate-600 text-center">
                                            {item.data_type == 'data' ? '' : item.no}
                                        </td>

                                        {/* kode rekening start */}
                                        <td className="border border-slate-600">
                                            {item.rek_code_1}
                                        </td>
                                        <td className="border border-slate-600">
                                            {item.rek_code_2}
                                        </td>
                                        <td className="border border-slate-600">
                                            {item.rek_code_3}
                                        </td>
                                        <td className="border border-slate-600">
                                            {item.rek_code_4}
                                        </td>
                                        <td className="border border-slate-600">
                                            {item.rek_code_5}
                                        </td>
                                        <td className="border border-slate-600">
                                            {item.rek_code_6}
                                        </td>
                                        {/* kode rekening end */}

                                        <td className="border border-slate-600">
                                            <div className="font-semibold">
                                                {item.name}
                                            </div>
                                        </td>
                                        <td className="border border-slate-600">
                                            {(item.data_type == 'data' || item.data_type == 'total' || item.data_type == 'sub_kegiatan') && (
                                                <DisplayMoney
                                                    data={item.pagu}
                                                />
                                            )}
                                        </td>
                                        <td className="border border-slate-600">
                                            {(item.data_type == 'data' || item.data_type == 'total' || item.data_type == 'sub_kegiatan') && (
                                                <div className="text-center">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(item?.bobot)} %
                                                </div>
                                            )}
                                        </td>
                                        <td className="border border-slate-600">

                                        </td>
                                        <td className="border border-slate-600">
                                            {/* Realisasi Lalu */}
                                            {(item.data_type == 'data' || item.data_type == 'total' || item.data_type == 'sub_kegiatan') && (
                                                <DisplayMoney
                                                    data={item.realisasi_lalu}
                                                />
                                            )}
                                        </td>
                                        <td className="border border-slate-600">
                                            {/* Realisasi Ini */}
                                            {(item.data_type == 'data' || item.data_type == 'total' || item.data_type == 'sub_kegiatan') && (
                                                <DisplayMoney
                                                    data={item.realisasi_ini}
                                                />
                                            )}
                                        </td>
                                        <td className="border border-slate-600">
                                            {/* Realisasi s.d Bulan Ini */}
                                            {(item.data_type == 'data' || item.data_type == 'total' || item.data_type == 'sub_kegiatan') && (
                                                <DisplayMoney
                                                    data={item.realisasi}
                                                />
                                            )}
                                        </td>
                                        <td className="border border-slate-600">
                                            {/* Realisasi s.d Bulan Ini Percent */}
                                            {(item.data_type == 'data' || item.data_type == 'total' || item.data_type == 'sub_kegiatan') && (
                                                <div className="text-center">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(item?.realisasi_percent)} %
                                                </div>
                                            )}
                                        </td>
                                        <td className="border border-slate-600">
                                            <div className="space-y-2 divide-y">
                                                {item.indikator_kinerja && (
                                                    item.indikator_kinerja.map((item: any, index: number) => (
                                                        <div className="pt-1">
                                                            {item}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </td>
                                        <td className="border border-slate-600">
                                            <div className="space-y-2 divide-y">
                                                {item.target_kinerja && (
                                                    item.target_kinerja.map((item: any, index: number) => (
                                                        <div className="pt-1">
                                                            {item ?? '0'}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </td>
                                        <td className="border border-slate-600">
                                            <div className="space-y-2 divide-y">
                                                {item.target_kinerja_satuan && (
                                                    item.target_kinerja_satuan.map((item: any, index: number) => (
                                                        <div className="pt-1">
                                                            {item ?? '-'}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </td>
                                        <td className="border border-slate-600">
                                            <div className="text-center">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(item?.target_kinerja_percent)} %
                                            </div>
                                        </td>
                                        <td className="border border-slate-600">
                                            <div className="space-y-2 divide-y">
                                                {item.realisasi_kinerja_lalu && (
                                                    item.realisasi_kinerja_lalu.map((item: any, index: number) => (
                                                        <div>
                                                            {item ?? '0'}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </td>
                                        <td className="border border-slate-600">
                                            [onprogress]
                                        </td>
                                        <td className="border border-slate-600">
                                            <div className="space-y-2 divide-y">
                                                {item.realisasi_kinerja && (
                                                    item.realisasi_kinerja.map((item: any, index: number) => (
                                                        <div className="pt-1">
                                                            {item ?? '0'}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </td>
                                        <td className="border border-slate-600">
                                            <div className="space-y-2 divide-y">
                                                {item.target_kinerja_satuan && (
                                                    item.target_kinerja_satuan.map((item: any, index: number) => (
                                                        <div className="pt-1">
                                                            {item ?? '-'}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </td>
                                        <td className="border border-slate-600">
                                            <div className="text-center">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(item?.realisasi_kinerja_percent)} %
                                            </div>
                                        </td>
                                        <td className="border border-slate-600">
                                            <div className="space-y-2 divide-y">
                                                {item.data_pendukung && (
                                                    item.data_pendukung.map((item: any, index: number) => (
                                                        <div className="pt-1">
                                                            <Link
                                                                href={item.path}
                                                                target="_blank"
                                                                className="text-blue-500 hover:text-blue-700 hover:underline">
                                                                {item.filename ?? '-'}
                                                            </Link>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


