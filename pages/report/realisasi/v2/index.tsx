import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { useDispatch } from "react-redux";
import { setPageTitle } from "@/store/themeConfigSlice";

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

    console.log(month, monthID)

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
                            TAHUN ANGGARAN 2024
                        </div>
                    </div>

                    <div className="flex items-center gap-x-2">
                        <div className="shrink w-[50px]">
                            OPD
                        </div>
                        <div>
                            : BAGIAN PEREKONOMIAN DAN SDA SETDA OGAN ILIR
                            {/* {instanceId} */}
                        </div>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <div className="shrink w-[50px]">
                            BULAN
                        </div>
                        <div className="uppercase">
                            : {month?.name ?? '-'}
                        </div>
                    </div>
                </div>
                <div className="table-responsive max-h-[calc(100vh-300px)] overflow-x-auto">
                    <table className="table-striped">
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
                                    Anggaran Tahun 2024
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
                                <th className="text-center border bg-slate-900 text-white min-w-[200px]"
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
                                <th className="text-center border bg-slate-900 text-white"
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
                                <th className="text-center border bg-slate-900 text-white min-w-[200px]">
                                    (%)
                                </th>

                                <th className="text-center border bg-slate-900 text-white min-w-[200px]"
                                    colSpan={2}>
                                    Target Kinerja s.d Akhir Tahun
                                </th>
                                <th className="text-center border bg-slate-900 text-white min-w-[200px]">
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
                                <th className="text-center border bg-slate-900 text-white min-w-[200px]">
                                    (%)
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((item: any, index: number) => (
                                <tr key={index}>
                                    <td className="border border-slate-600">
                                        1
                                    </td>
                                    {/* kode rekening start */}
                                    <td className="border border-slate-600">
                                        1
                                    </td>
                                    <td className="border border-slate-600">
                                        1.2
                                    </td>
                                    <td className="border border-slate-600">
                                        1.2.3
                                    </td>
                                    <td className="border border-slate-600">
                                        1.2.3.4
                                    </td>
                                    <td className="border border-slate-600">
                                        1.2.3.4.5
                                    </td>
                                    <td className="border border-slate-600">
                                        1.2.3.4.5.6
                                    </td>
                                    {/* kode rekening end */}

                                    <td className="border border-slate-600">
                                        test
                                    </td>
                                    <td className="border border-slate-600">
                                        test
                                    </td>
                                    <td className="border border-slate-600">
                                        test
                                    </td>
                                    <td className="border border-slate-600">
                                        test
                                    </td>
                                    <td className="border border-slate-600">
                                        test
                                    </td>
                                    <td className="border border-slate-600">
                                        test
                                    </td>
                                    <td className="border border-slate-600">
                                        test
                                    </td>
                                    <td className="border border-slate-600">
                                        test
                                    </td>
                                    <td className="border border-slate-600">
                                        test
                                    </td>
                                    <td className="border border-slate-600">
                                        test
                                    </td>
                                    <td className="border border-slate-600">
                                        test
                                    </td>
                                    <td className="border border-slate-600">
                                        test
                                    </td>
                                    <td className="border border-slate-600">
                                        test
                                    </td>
                                    <td className="border border-slate-600">
                                        test
                                    </td>
                                    <td className="border border-slate-600">
                                        test
                                    </td>
                                    <td className="border border-slate-600">
                                        test
                                    </td>
                                    <td className="border border-slate-600">
                                        test
                                    </td>
                                    <td className="border border-slate-600">
                                        test
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


