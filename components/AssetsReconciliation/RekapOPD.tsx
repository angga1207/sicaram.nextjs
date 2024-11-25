import Select from 'react-select';
import { faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';


const showAlert = async (icon: any, text: any) => {
    const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
    });
    toast.fire({
        icon: icon,
        title: text,
        padding: '10px 20px',
    });
};

const RekapOPD = (data: any) => {
    const paramData = data.data
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null)

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [CurrentUser, setCurrentUser] = useState<any>([]);
    const [CurrentToken, setCurrentToken] = useState<any>(null);
    useEffect(() => {
        if (document.cookie) {
            let user = document.cookie.split(';').find((row) => row.trim().startsWith('user='))?.split('=')[1];
            user = user ? JSON.parse(user) : null;
            setCurrentUser(user);

            let token = document.cookie.split(';').find((row) => row.trim().startsWith('token='))?.split('=')[1];
            setCurrentToken(token);
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
                setYear(currentYear);
            } else {
                setYear(periode?.start_year)
            }
        }
    }, [isMounted, periode?.id])

    const [instance, setInstance] = useState<any>((router.query.instance ?? null) ?? CurrentUser?.instance_id);
    const [instances, setInstances] = useState<any>([]);
    const [arrKodeRekening, setArrKodeRekening] = useState<any>([])

    useEffect(() => {
        if (paramData[0]?.length > 0) {
            setInstances(paramData[0]);
        }
    }, [isMounted, paramData]);

    useEffect(() => {
        if (paramData[1]?.length > 0) {
            setArrKodeRekening(paramData[1])
        }
    }, [isMounted, paramData]);

    const [dataInput, setDataInput] = useState<any>([]);
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    return (
        <>
            <div className="mb-4 text-lg font-semibold underline">
                Rekap OPD
            </div>
            <div className="">
                <div className="table-responsive mb-5">
                    <table className="table-striped">
                        <thead>
                            <tr>
                                <th rowSpan={2} className='text-center border border-slate-900 min-w-[300px] max-w-[300px]'>
                                    Perangkat Daerah
                                </th>
                                <th colSpan={2} className='text-center border border-slate-900'>
                                    Tanah
                                </th>
                                <th colSpan={2} className='text-center border border-slate-900'>
                                    Peralatan Mesin
                                </th>
                                <th colSpan={2} className='text-center border border-slate-900'>
                                    Gedung dan Bangunan
                                </th>
                                <th colSpan={2} className='text-center border border-slate-900'>
                                    Jalan Jaringan Irigasi
                                </th>
                                <th colSpan={2} className='text-center border border-slate-900'>
                                    Aset Tetap Lainnya
                                </th>
                                <th colSpan={2} className='text-center border border-slate-900'>
                                    KDP
                                </th>
                                <th colSpan={2} className='text-center border border-slate-900'>
                                    Aset Lainnya
                                </th>
                            </tr>
                            <tr>
                                <th className='text-center border border-slate-900'>2023</th>
                                <th className='text-center border border-slate-900'>2024</th>

                                <th className='text-center border border-slate-900'>2023</th>
                                <th className='text-center border border-slate-900'>2024</th>

                                <th className='text-center border border-slate-900'>2023</th>
                                <th className='text-center border border-slate-900'>2024</th>

                                <th className='text-center border border-slate-900'>2023</th>
                                <th className='text-center border border-slate-900'>2024</th>

                                <th className='text-center border border-slate-900'>2023</th>
                                <th className='text-center border border-slate-900'>2024</th>

                                <th className='text-center border border-slate-900'>2023</th>
                                <th className='text-center border border-slate-900'>2024</th>

                                <th className='text-center border border-slate-900'>2023</th>
                                <th className='text-center border border-slate-900'>2024</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    Perangkat Daerah
                                </td>

                                <td>
                                    Rp. 0
                                    [KIB_A - SALDO AWAL]
                                </td>
                                <td>
                                    Rp. 0
                                    [KIB_A - SALDO AKHIR]
                                </td>

                                <td>
                                    Rp. 0
                                    [KIB_B - SALDO AWAL]
                                </td>
                                <td>
                                    Rp. 0
                                    [KIB_B - SALDO AKHIR]
                                </td>

                                <td>
                                    Rp. 0
                                    [KIB_C - SALDO AWAL]
                                </td>
                                <td>
                                    Rp. 0
                                    [KIB_C - SALDO AKHIR]
                                </td>

                                <td>
                                    Rp. 0
                                    [KIB_D - SALDO AWAL]
                                </td>
                                <td>
                                    Rp. 0
                                    [KIB_D - SALDO AKHIR]
                                </td>

                                <td>
                                    Rp. 0
                                    [KIB_E - SALDO AWAL]
                                </td>
                                <td>
                                    Rp. 0
                                    [KIB_E - SALDO AKHIR]
                                </td>

                                <td>
                                    Rp. 0
                                    [KDP - SALDO AWAL]
                                </td>
                                <td>
                                    Rp. 0
                                    [KDP - SALDO AKHIR]
                                </td>

                                <td>
                                    Rp. 0
                                    [ASET LAIN LAIN - SALDO AWAL]
                                </td>
                                <td>
                                    Rp. 0
                                    [ASET LAIN LAIN - SALDO AKHIR]
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-end">
                        <div className="w-[200px]">
                            Kenaikan / Penurunan
                        </div>
                        <div className="w-[300px]">
                            Rp. 0
                            <br />
                            [Total Per 31 Des 2024 - Total Per 31 Des 2023]
                        </div>
                    </div>
                    <div className="flex items-center justify-end">
                        <div className="w-[200px]">
                            Persentase
                        </div>
                        <div className="w-[300px]">
                            0 %
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default RekapOPD;
