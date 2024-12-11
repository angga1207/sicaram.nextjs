import Select from 'react-select';
import { faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { getRekap } from '@/apis/Accountancy/RekonsiliasiAset';


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

const Rekap = (data: any) => {
    const paramData = data.data
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null)
    const [years, setYears] = useState<any>(null)

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
        setYear(paramData[3]);
    }, [isMounted]);

    useEffect(() => {
        if (isMounted && periode?.id && !year) {
            const currentYear = new Date().getFullYear();
            if (periode?.start_year <= currentYear) {
                setYear(currentYear);
            } else {
                setYear(periode?.start_year)
            }
        }
    }, [isMounted, periode?.id])

    useEffect(() => {
        if (isMounted) {
            setYears([]);
            if (periode?.id) {
                if (year >= periode?.start_year && year <= periode?.end_year) {
                    for (let i = periode?.start_year; i <= periode?.end_year; i++) {
                        setYears((years: any) => [
                            ...years,
                            {
                                label: i,
                                value: i,
                            },
                        ]);
                    }
                }
            }
        }
    }, [isMounted, year, periode?.id])

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
        if (paramData[2]) {
            setInstance(paramData[2]);
        }
        if (paramData[3]) {
            setYear(paramData[3]);
        }
    }, [isMounted, paramData]);

    const [dataInput, setDataInput] = useState<any>([]);
    const [grandTotal, setGrandTotal] = useState<any>([]);
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isMounted && periode?.id && year && !instance) {
            if ([9].includes(CurrentUser?.role_id)) {
                setInstance(CurrentUser?.instance_id ?? '');
            } else {
                _getDatas();
            }
        }
        if (isMounted && periode?.id && year && instance) {
            _getDatas();
        }
    }, [isMounted, instance, periode?.id, year]);

    const _getDatas = () => {
        getRekap(instance, periode?.id, year).then((res) => {
            if (res.status === 'success') {
                setDataInput(res.data.datas);
                setGrandTotal(res.data.grand_total);
            }
        });
    }

    return (
        <div>
            <div className="">
                <div className="table-responsive mb-5">
                    <table className="table-hover">
                        <thead>
                            <tr className='!bg-slate-900 !text-white'>
                                <th className='text-center'>
                                    No.
                                </th>
                                <th className='text-center'>
                                    Uraian
                                </th>
                                <th className='text-center'>
                                    Per 31 Desember {year - 1}
                                </th>
                                <th className='text-center'>
                                    Mutasi Tambah
                                </th>
                                <th className='text-center'>
                                    Mutasi Kurang
                                </th>
                                <th className='text-center'>
                                    Per 31 Desember {year}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dataInput?.map((item: any, index: any) => {
                                    return (
                                        <tr key={index} className='cursor-pointer'>
                                            <td>{index + 1}</td>
                                            <td>
                                                {item.uraian}
                                            </td>
                                            <td className='border-x'>
                                                <div className='flex items-center justify-between'>
                                                    <div>
                                                        Rp.
                                                    </div>
                                                    <div>
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(item.saldo_awal)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border-x'>
                                                <div className='flex items-center justify-between'>
                                                    <div>
                                                        Rp.
                                                    </div>
                                                    <div>
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(item.mutasi_tambah)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border-x'>
                                                <div className='flex items-center justify-between'>
                                                    <div>
                                                        Rp.
                                                    </div>
                                                    <div>
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(item.mutasi_kurang)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border-x'>
                                                <div className='flex items-center justify-between'>
                                                    <div>
                                                        Rp.
                                                    </div>
                                                    <div>
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(item.saldo_akhir)}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }

                        </tbody>
                        <tfoot>
                            <tr className='!bg-slate-500 !text-white'>
                                <td>

                                </td>
                                <td className='font-semibold !text-end p-3'>
                                    JUMLAH
                                </td>
                                <td className='p-3 font-semibold'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            Rp.
                                        </div>
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal?.saldo_awal)}
                                        </div>
                                    </div>
                                </td>
                                <td className='p-3 font-semibold'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            Rp.
                                        </div>
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal?.mutasi_tambah)}
                                        </div>
                                    </div>
                                </td>
                                <td className='p-3 font-semibold'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            Rp.
                                        </div>
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal?.mutasi_kurang)}
                                        </div>
                                    </div>
                                </td>
                                <td className='p-3 font-semibold'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            Rp.
                                        </div>
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal?.saldo_akhir)}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-end">
                        <div className="w-[200px]">
                            Kenaikan / Penurunan
                        </div>
                        <div className="w-[300px] font-semibold">
                            Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal?.saldo_akhir - grandTotal?.saldo_awal)}
                        </div>
                    </div>
                    <div className="flex items-center justify-end">
                        <div className="w-[200px]">
                            Persentase
                        </div>
                        <div className="w-[300px] font-semibold">
                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal?.saldo_awal > 0 ? ((grandTotal?.saldo_akhir - grandTotal?.saldo_awal) / grandTotal?.saldo_awal * 100) : 0)} %
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Rekap;
