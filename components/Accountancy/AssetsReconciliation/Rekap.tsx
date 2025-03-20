import Select from 'react-select';
import { faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { getRekap } from '@/apis/Accountancy/RekonsiliasiAset';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import LoadingSicaram from '@/components/LoadingSicaram';


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
    const [isLoading, setIsLoading] = useState(true);
    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null)
    const [years, setYears] = useState<any>(null)

    useEffect(() => {
        setIsMounted(true);
        setIsLoading(true);
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
    const [percentage, setPercentage] = useState<any>(0);
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isMounted && periode?.id && year && !instance) {
            if ([9].includes(CurrentUser?.role_id)) {
                setInstance(CurrentUser?.instance_id ?? '');
            } else {
                if (dataInput.length === 0) {
                    _getDatas();
                }
            }
        }
        if (isMounted && periode?.id && year && instance) {
            _getDatas();
        }
    }, [isMounted, instance, periode?.id, year]);

    useEffect(() => {
        if (isMounted) {
            setPercentage(grandTotal?.saldo_awal > 0 ? ((grandTotal?.saldo_akhir - grandTotal?.saldo_awal) / grandTotal?.saldo_awal * 100).toFixed(2) : 0);
        }
    }, [grandTotal])

    const _getDatas = () => {
        setIsLoading(true);
        getRekap(instance, periode?.id, year).then((res) => {
            if (res.status === 'success') {
                setDataInput(res.data.datas);
                setGrandTotal(res.data.grand_total);
            }
            setIsLoading(false);
        }).catch((err) => {
            setIsLoading(false);
        });
    }

    const terbilang = (a: number) => {
        // let angka = parseFloat(a.toString().replace(/./g, ''));
        // remove dot
        // let angka = parseFloat(a.toString().replace(/\./g, ''));

        let angka = a;
        let bilangan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
        let kalimat = '';

        // 1 - 11
        if (angka < 12) {
            kalimat = bilangan[angka] ?? '';
        }
        // 12 - 19
        else if (angka < 20) {
            kalimat = bilangan[angka - 10] + ' Belas';
        }
        // 20 - 99
        else if (angka < 100) {
            let utama = angka / 10;
            let depan = parseInt(String(utama).substr(0, 1));
            let belakang = angka % 10;
            if (belakang % 1 != 0) {
                belakang = parseInt(String(belakang).substr(0, 1));
                kalimat = bilangan[depan] + ' Puluh ' + bilangan[belakang];
            } else {
                kalimat = bilangan[depan] + ' Puluh ' + bilangan[belakang];
            }
        }
        // 100 - 199
        else if (angka < 200) {
            kalimat = 'Seratus ' + terbilang(angka - 100);
        }
        // 200 - 999
        else if (angka < 1000) {
            let utama = angka / 100;
            let depan = parseInt(String(utama).substr(0, 1));
            let belakang = angka % 100;
            kalimat = bilangan[depan] + ' Ratus ' + terbilang(belakang);
        }
        // 1,000 - 1,999
        else if (angka < 2000) {
            kalimat = 'Seribu ' + terbilang(angka - 1000);
        }
        // 2,000 - 9,999
        else if (angka < 10000) {
            let utama = angka / 1000;
            let depan = parseInt(String(utama).substr(0, 1));
            let belakang = angka % 1000;
            kalimat = bilangan[depan] + ' Ribu ' + terbilang(belakang);
        }
        // 10,000 - 99,999
        else if (angka < 100000) {
            let utama = angka / 100;
            let depan = parseInt(String(utama).substr(0, 2));
            let belakang = angka % 1000;
            kalimat = terbilang(depan) + ' Ribu ' + terbilang(belakang);
        }
        // 100,000 - 999,999
        else if (angka < 1000000) {
            let utama = angka / 1000;
            let depan = parseInt(String(utama).substr(0, 3));
            let belakang = angka % 1000;
            kalimat = terbilang(depan) + ' Ribu ' + terbilang(belakang);
        }
        // 1,000,000 - 	99,999,999
        else if (angka < 100000000) {
            let utama = angka / 1000000;
            let depan = parseInt(String(utama).substr(0, 4));
            let belakang = angka % 1000000;
            kalimat = terbilang(depan) + ' Juta ' + terbilang(belakang);
        }
        else if (angka < 1000000000) {
            let utama = angka / 1000000;
            let depan = parseInt(String(utama).substr(0, 4));
            let belakang = angka % 1000000;
            kalimat = terbilang(depan) + ' Juta ' + terbilang(belakang);
        }
        else if (angka < 10000000000) {
            let utama = angka / 1000000000;
            let depan = parseInt(String(utama).substr(0, 1));
            let belakang = angka % 1000000000;
            kalimat = terbilang(depan) + ' Milyar ' + terbilang(belakang);
        }
        else if (angka < 100000000000) {
            let utama = angka / 1000000000;
            let depan = parseInt(String(utama).substr(0, 2));
            let belakang = angka % 1000000000;
            kalimat = terbilang(depan) + ' Milyar ' + terbilang(belakang);
        }
        else if (angka < 1000000000000) {
            let utama = angka / 1000000000;
            let depan = parseInt(String(utama).substr(0, 3));
            let belakang = angka % 1000000000;
            kalimat = terbilang(depan) + ' Milyar ' + terbilang(belakang);
        }
        else if (angka < 10000000000000) {
            let utama = angka / 10000000000;
            let depan = parseInt(String(utama).substr(0, 1));
            let belakang = angka % 10000000000;
            kalimat = terbilang(depan) + ' Triliun ' + terbilang(belakang);
        }
        else if (angka < 100000000000000) {
            let utama = angka / 1000000000000;
            let depan = parseInt(String(utama).substr(0, 2));
            let belakang = angka % 1000000000000;
            kalimat = terbilang(depan) + ' Triliun ' + terbilang(belakang);
        }

        else if (angka < 1000000000000000) {
            let utama = angka / 1000000000000;
            let depan = parseInt(String(utama).substr(0, 3));
            let belakang = angka % 1000000000000;
            kalimat = terbilang(depan) + ' Triliun ' + terbilang(belakang);
        }

        else if (angka < 10000000000000000) {
            let utama = angka / 1000000000000000;
            let depan = parseInt(String(utama).substr(0, 1));
            let belakang = angka % 1000000000000000;
            kalimat = terbilang(depan) + ' Kuadriliun ' + terbilang(belakang);
        }

        let pisah = kalimat.split(' ');
        let full = [];
        for (let i = 0; i < pisah.length; i++) {
            if (pisah[i] != "") { full.push(pisah[i]); }
        }
        return full.join(' ');
    }

    return (
        <div>
            <div className="">
                {isLoading === true && (
                    <div className="flex bg-black bg-opacity-50 h-screen justify-center w-screen fixed items-center left-0 top-0 z-50">
                        {/* <FontAwesomeIcon icon={faSpinner} spin size="3x" className="h-80 text-white w-80 animate-spin" /> */}
                        <LoadingSicaram />
                    </div>
                )}
                {isLoading === false && (
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
                                                    <Tippy content={(item.saldo_awal ? terbilang(item.saldo_awal) : 'Nol') + ' Rupiah'} placement='top-end'>
                                                        <div className='flex justify-between cursor-pointer items-center'>
                                                            <div>
                                                                Rp.
                                                            </div>
                                                            <div>
                                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(item.saldo_awal)}
                                                            </div>
                                                        </div>
                                                    </Tippy>
                                                </td>
                                                <td className='border-x'>
                                                    <Tippy content={(item.mutasi_tambah ? terbilang(item.mutasi_tambah) : 'Nol') + ' Rupiah'} placement='top-end'>
                                                        <div className='flex justify-between cursor-pointer items-center'>
                                                            <div>
                                                                Rp.
                                                            </div>
                                                            <div>
                                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(item.mutasi_tambah)}
                                                            </div>
                                                        </div>
                                                    </Tippy>
                                                </td>
                                                <td className='border-x'>
                                                    <Tippy content={(item.mutasi_kurang ? terbilang(item.mutasi_kurang) : 'Nol') + ' Rupiah'} placement='top-end'>
                                                        <div className='flex justify-between cursor-pointer items-center'>
                                                            <div>
                                                                Rp.
                                                            </div>
                                                            <div>
                                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(item.mutasi_kurang)}
                                                            </div>
                                                        </div>
                                                    </Tippy>
                                                </td>
                                                <td className='border-x'>
                                                    <Tippy content={(item.saldo_akhir ? terbilang(item.saldo_akhir) : 'Nol') + ' Rupiah'} placement='top-end'>
                                                        <div className='flex justify-between cursor-pointer items-center'>
                                                            <div>
                                                                Rp.
                                                            </div>
                                                            <div>
                                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(item.saldo_akhir)}
                                                            </div>
                                                        </div>
                                                    </Tippy>
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
                                    <td className='p-3 !text-end font-semibold'>
                                        JUMLAH
                                    </td>
                                    <td className='p-3 font-semibold'>
                                        <div className='flex justify-between cursor-pointer items-center'>
                                            <div>
                                                Rp.
                                            </div>

                                            <Tippy content={(grandTotal.saldo_awal ? terbilang(grandTotal.saldo_awal) : 'Nol') + ' Rupiah'} placement='top-end'>
                                                <div>
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal?.saldo_awal)}
                                                </div>
                                            </Tippy>
                                        </div>
                                    </td>
                                    <td className='p-3 font-semibold'>
                                        <div className='flex justify-between cursor-pointer items-center'>
                                            <div>
                                                Rp.
                                            </div>
                                            <Tippy content={(grandTotal.mutasi_tambah ? terbilang(grandTotal.mutasi_tambah) : 'Nol') + ' Rupiah'} placement='top-end'>
                                                <div>
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal?.mutasi_tambah)}
                                                </div>
                                            </Tippy>
                                        </div>
                                    </td>
                                    <td className='p-3 font-semibold'>
                                        <div className='flex justify-between cursor-pointer items-center'>
                                            <div>
                                                Rp.
                                            </div>

                                            <Tippy content={(grandTotal.mutasi_kurang ? terbilang(grandTotal.mutasi_kurang) : 'Nol') + ' Rupiah'} placement='top-end'>
                                                <div>
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal?.mutasi_kurang)}
                                                </div>
                                            </Tippy>
                                        </div>
                                    </td>
                                    <td className='p-3 font-semibold'>
                                        <div className='flex justify-between cursor-pointer items-center'>
                                            <div>
                                                Rp.
                                            </div>
                                            <Tippy content={(grandTotal.saldo_akhir ? terbilang(grandTotal.saldo_akhir) : 'Nol') + ' Rupiah'} placement='top-end'>
                                                <div>
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal?.saldo_akhir)}
                                                </div>
                                            </Tippy>
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}

                <div className="space-y-3">
                    <div className="flex justify-end items-center">
                        <div className="w-[200px]">
                            Kenaikan / Penurunan
                        </div>
                        <div className="text-lg w-[300px] font-semibold">

                            <Tippy content={(grandTotal.saldo_awal ? terbilang(grandTotal.saldo_awal) : 'Nol') + ' Rupiah'} placement='top-end'>
                                <div className='flex justify-between cursor-pointer items-center'>
                                    <div className="">
                                        Rp.
                                    </div>
                                    <div className="">
                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal?.saldo_akhir - grandTotal?.saldo_awal)}
                                    </div>
                                </div>
                            </Tippy>
                        </div>
                    </div>
                    <div className="flex justify-end items-center">
                        <div className="w-[200px]">
                            Persentase
                        </div>
                        <div className="text-lg w-[300px] font-semibold">
                            <div className='flex justify-between cursor-pointer items-center'>
                                <div className="">
                                    %
                                </div>
                                <div className="">
                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(percentage)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Rekap;
