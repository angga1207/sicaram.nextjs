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

const KIB_C = (data: any) => {
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
        <div>
            <div className="mb-4 text-lg font-semibold underline">
                Gedung dan Bangunan
            </div>
            <div className="">
                <div className="table-responsive mb-5 pb-5">
                    <table className="table-striped">
                        <thead>
                            <tr>
                                <th rowSpan={2} className='text-center border whitespace-nowrap border-slate-900 xl:min-w-[300px] xl:max-w-[300px] sticky top-0 left-0 bg-slate-50'>
                                    Perangkat Daerah
                                </th>
                                <th rowSpan={2} className='text-center border whitespace-nowrap border-slate-900 xl:min-w-[300px] xl:max-w-[300px] sticky top-0 left-[300px] bg-slate-50'>
                                    Saldo Awal
                                </th>
                                <th colSpan={16} className='text-center border whitespace-nowrap border-slate-900 bg-yellow-300'>
                                    Mutasi Tambah
                                </th>
                                <th colSpan={14} className='text-center border whitespace-nowrap border-slate-900 bg-green-300'>
                                    Mutasi Kurang
                                </th>
                                <th rowSpan={2} className='text-center border whitespace-nowrap border-slate-900'>
                                    Saldo Akhir
                                </th>
                            </tr>
                            <tr>
                                {/* Tambah Start */}
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900'>
                                    Realisasi Belanja
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900'>
                                    Hutang Kegiatan 2023
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900'>
                                    Atribusi
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900'>
                                    Reklasifikasi dari Barang Habis Pakai
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900'>
                                    Reklasifikasi dari Pemeliharaan
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900'>
                                    Reklasifikasi dari Jasa
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900'>
                                    Reklasifikasi dari KIB A
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900'>
                                    Reklasifikasi dari KIB B
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900'>
                                    Reklasifikasi dari KIB C
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900'>
                                    Reklasifikasi dari KIB D
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900'>
                                    Reklasifikasi dari KIB E
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900'>
                                    Reklasifikasi dari KDP
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900'>
                                    Reklasifikasi dari Aset Lain-lain
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900'>
                                    Hibah Masuk
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900'>
                                    Penilaian
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900'>
                                    Mutasi Antar SKPD
                                </th>
                                {/* Tambah End */}

                                {/* Kurang Start */}
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900'>
                                    Pembayaran Hutang
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900'>
                                    Reklasifikasi Ke Beban Persediaan
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900'>
                                    Reklasifikasi Ke Beban Pemeliharaan
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900'>
                                    Reklasifikasi Ke Beban Hibah/Bansos
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900'>
                                    Reklasifikasi ke KIB A
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900'>
                                    Reklasifikasi ke KIB B
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900'>
                                    Reklasifikasi ke KIB C
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900'>
                                    Reklasifikasi ke KIB D
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900'>
                                    Reklasifikasi ke KIB E
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900'>
                                    Reklasifikasi ke KDP
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900'>
                                    Reklasifikasi ke Aset Lain-lain
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900'>
                                    Penghapusan/ Penjualan
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900'>
                                    Mutasi Antar SKPD
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900'>
                                    TPTGR
                                </th>
                                {/* Kurang End */}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='border border-slate-900 sticky top-0 left-0 bg-slate-50'>
                                    PERANGKAT DAERAH
                                </td>
                                <td className='border border-slate-900 sticky top-0 left-[300px] bg-slate-50'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                                <td className='border border-slate-900'>
                                    Rp. 0
                                    [MANUAL INPUT]
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
export default KIB_C;
