import Select from 'react-select';
import { faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { getKibC, saveKibC } from '@/apis/Accountancy/RekonsiliasiAset';


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
        setYear(paramData[3])
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
    }, [isMounted, paramData]);

    const [dataInput, setDataInput] = useState<any>([]);
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [grandTotal, setGrandTotal] = useState<any>({
        saldo_awal: 0,
        saldo_akhir: 0,
        plus_realisasi_belanja: 0,
        plus_hutang_kegiatan: 0,
        plus_atribusi: 0,
        plus_reklasifikasi_barang_habis_pakai: 0,
        plus_reklasifikasi_pemeliharaan: 0,
        plus_reklasifikasi_jasa: 0,
        plus_reklasifikasi_kib_a: 0,
        plus_reklasifikasi_kib_b: 0,
        plus_reklasifikasi_kib_c: 0,
        plus_reklasifikasi_kib_d: 0,
        plus_reklasifikasi_kib_e: 0,
        plus_reklasifikasi_kdp: 0,
        plus_reklasifikasi_aset_lain_lain: 0,
        plus_hibah_masuk: 0,
        plus_penilaian: 0,
        plus_total: 0,

        min_pembayaran_utang: 0,
        min_reklasifikasi_beban_persediaan: 0,
        min_reklasifikasi_beban_pemeliharaan: 0,
        min_reklasifikasi_beban_hibah: 0,
        min_reklasifikasi_beban_kib_a: 0,
        min_reklasifikasi_beban_kib_b: 0,
        min_reklasifikasi_beban_kib_c: 0,
        min_reklasifikasi_beban_kib_d: 0,
        min_reklasifikasi_beban_kib_e: 0,
        min_reklasifikasi_beban_kdp: 0,
        min_reklasifikasi_beban_aset_lain_lain: 0,
        min_penghapusan: 0,
        min_mutasi_antar_opd: 0,
        min_tptgr: 0,
        min_total: 0,
    });

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
        getKibC(instance, periode?.id, year).then((res) => {
            if (res.status === 'success') {
                setDataInput(res.data.datas);
            }
        });
    }

    const _calculateData = (index: any) => {
        const plusKyes = [
            'plus_realisasi_belanja',
            'plus_hutang_kegiatan',
            'plus_atribusi',
            'plus_reklasifikasi_barang_habis_pakai',
            'plus_reklasifikasi_pemeliharaan',
            'plus_reklasifikasi_jasa',
            'plus_reklasifikasi_kib_a',
            'plus_reklasifikasi_kib_b',
            'plus_reklasifikasi_kib_c',
            'plus_reklasifikasi_kib_d',
            'plus_reklasifikasi_kib_e',
            'plus_reklasifikasi_kdp',
            'plus_reklasifikasi_aset_lain_lain',
            'plus_hibah_masuk',
            'plus_penilaian',
            'plus_mutasi_antar_opd',
        ];
        const minusKeys = [
            'min_pembayaran_utang',
            'min_reklasifikasi_beban_persediaan',
            'min_reklasifikasi_beban_pemeliharaan',
            'min_reklasifikasi_beban_hibah',
            'min_reklasifikasi_beban_kib_a',
            'min_reklasifikasi_beban_kib_b',
            'min_reklasifikasi_beban_kib_c',
            'min_reklasifikasi_beban_kib_d',
            'min_reklasifikasi_beban_kib_e',
            'min_reklasifikasi_beban_kdp',
            'min_reklasifikasi_beban_aset_lain_lain',
            'min_penghapusan',
            'min_mutasi_antar_opd',
            'min_tptgr',
        ];
        let plus = 0;
        let minus = 0;
        plusKyes.forEach((key: any) => {
            plus += parseInt(dataInput[index][key] ?? 0);
        });
        minusKeys.forEach((key: any) => {
            minus += parseInt(dataInput[index][key] ?? 0);
        });
        const saldo_awal = parseInt(dataInput[index].saldo_awal);
        const saldo_akhir = saldo_awal + plus - minus;

        setDataInput((prev: any) => {
            const data = [...prev];
            data[index].plus_total = plus;
            data[index].min_total = minus;
            data[index].saldo_akhir = saldo_akhir ?? 0;
            return data;
        });
    }

    const _saveData = () => {
        setIsSaving(true);
        saveKibC(instance, periode?.id, year, dataInput).then((res) => {
            if (res.status === 'success') {
                setIsUnsaved(false);
                showAlert('success', 'Data berhasil disimpan');
            } else {
                showAlert('error', 'Data gagal disimpan');
            }
            setIsSaving(false);
        });
    }

    useEffect(() => {
        if (isMounted && dataInput.length > 0) {
            setGrandTotal((prev: any) => {
                const updated = { ...prev };
                updated['saldo_awal'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.saldo_awal), 0);
                updated['saldo_akhir'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.saldo_akhir), 0);
                updated['plus_realisasi_belanja'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_realisasi_belanja), 0);
                updated['plus_hutang_kegiatan'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_hutang_kegiatan), 0);
                updated['plus_atribusi'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_atribusi), 0);
                updated['plus_reklasifikasi_barang_habis_pakai'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_reklasifikasi_barang_habis_pakai), 0);
                updated['plus_reklasifikasi_pemeliharaan'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_reklasifikasi_pemeliharaan), 0);
                updated['plus_reklasifikasi_jasa'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_reklasifikasi_jasa), 0);
                updated['plus_reklasifikasi_kib_a'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_reklasifikasi_kib_a), 0);
                updated['plus_reklasifikasi_kib_b'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_reklasifikasi_kib_b), 0);
                updated['plus_reklasifikasi_kib_c'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_reklasifikasi_kib_c), 0);
                updated['plus_reklasifikasi_kib_d'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_reklasifikasi_kib_d), 0);
                updated['plus_reklasifikasi_kib_e'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_reklasifikasi_kib_e), 0);
                updated['plus_reklasifikasi_kdp'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_reklasifikasi_kdp), 0);
                updated['plus_reklasifikasi_aset_lain_lain'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_reklasifikasi_aset_lain_lain), 0);
                updated['plus_hibah_masuk'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_hibah_masuk), 0);
                updated['plus_penilaian'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_penilaian), 0);
                updated['plus_mutasi_antar_opd'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_mutasi_antar_opd), 0);
                updated['plus_total'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_total), 0);

                updated['min_pembayaran_utang'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.min_pembayaran_utang), 0);
                updated['min_reklasifikasi_beban_persediaan'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.min_reklasifikasi_beban_persediaan), 0);
                updated['min_reklasifikasi_beban_pemeliharaan'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.min_reklasifikasi_beban_pemeliharaan), 0);
                updated['min_reklasifikasi_beban_hibah'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.min_reklasifikasi_beban_hibah), 0);
                updated['min_reklasifikasi_beban_kib_a'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.min_reklasifikasi_beban_kib_a), 0);
                updated['min_reklasifikasi_beban_kib_b'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.min_reklasifikasi_beban_kib_b), 0);
                updated['min_reklasifikasi_beban_kib_c'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.min_reklasifikasi_beban_kib_c), 0);
                updated['min_reklasifikasi_beban_kib_d'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.min_reklasifikasi_beban_kib_d), 0);
                updated['min_reklasifikasi_beban_kib_e'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.min_reklasifikasi_beban_kib_e), 0);
                updated['min_reklasifikasi_beban_kdp'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.min_reklasifikasi_beban_kdp), 0);
                updated['min_reklasifikasi_beban_aset_lain_lain'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.min_reklasifikasi_beban_aset_lain_lain), 0);
                updated['min_penghapusan'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.min_penghapusan), 0);
                updated['min_mutasi_antar_opd'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.min_mutasi_antar_opd), 0);
                updated['min_tptgr'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.min_tptgr), 0);
                updated['min_total'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.min_total), 0);
                return updated;
            });
        }
    }, [isMounted && dataInput]);

    return (
        <div>
            <div className="">
                <div className="table-responsive mb-5 pb-5 max-h-[calc(100vh-400px)]">
                    <table className="table-striped">
                        <thead className='sticky top-0 left-0 z-[2]'>
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
                                <th rowSpan={2} className='text-center border whitespace-nowrap border-slate-900  bg-yellow-300 min-w-[250px]'>
                                    Total Penambahan
                                </th>
                                <th colSpan={14} className='text-center border whitespace-nowrap border-slate-900 bg-green-300'>
                                    Mutasi Kurang
                                </th>
                                <th rowSpan={2} className='text-center border whitespace-nowrap border-slate-900  bg-green-300 min-w-[250px]'>
                                    Total Pengurangan
                                </th>
                                <th rowSpan={2} className='text-center border whitespace-nowrap border-slate-900 min-w-[300px]'>
                                    Saldo Akhir
                                </th>
                            </tr>
                            <tr>
                                {/* Tambah Start */}
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Realisasi Belanja
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Hutang Kegiatan {year}
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Atribusi
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Reklasifikasi dari Barang Habis Pakai
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Reklasifikasi dari Pemeliharaan
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Reklasifikasi dari Jasa
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Reklasifikasi dari KIB A
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Reklasifikasi dari KIB B
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Reklasifikasi dari KIB C
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Reklasifikasi dari KIB D
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Reklasifikasi dari KIB E
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Reklasifikasi dari KDP
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Reklasifikasi dari Aset Lain-lain
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Hibah Masuk
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Penilaian
                                </th>
                                <th className='text-center bg-yellow-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Mutasi Antar OPD
                                </th>
                                {/* Tambah End */}

                                {/* Kurang Start */}
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Pembayaran Hutang
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Reklasifikasi Ke Beban Persediaan
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Reklasifikasi Ke Beban Pemeliharaan
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Reklasifikasi Ke Beban Hibah/Bansos
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Reklasifikasi ke KIB A
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Reklasifikasi ke KIB B
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Reklasifikasi ke KIB C
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Reklasifikasi ke KIB D
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Reklasifikasi ke KIB E
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Reklasifikasi ke KDP
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Reklasifikasi ke Aset Lain-lain
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Penghapusan/ Penjualan
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    Mutasi Antar OPD
                                </th>
                                <th className='text-center bg-green-300 border whitespace-nowrap border-slate-900 min-w-[250px]'>
                                    TPTGR
                                </th>
                                {/* Kurang End */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dataInput.map((row: any, index: any) => {
                                    return (
                                        <tr key={index}>
                                            <td className='border border-slate-900 sticky top-0 left-0 z-[1] bg-slate-50'>
                                                <div className="font-semibold">
                                                    {row.instance_name}
                                                </div>
                                            </td>
                                            <td className='border border-slate-900 sticky top-0 left-[300px] z-[1] bg-slate-50'>
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.saldo_awal}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].saldo_awal = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.saldo_awal)}
                                                    </div>
                                                </div>
                                            </td>


                                            {/* PLUS START */}
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.plus_realisasi_belanja)} */}
                                                <div className="flex">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end read-only:bg-slate-200 dark:read-only:bg-slate-800">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.plus_realisasi_belanja)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.plus_hutang_kegiatan)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.plus_hutang_kegiatan}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].plus_hutang_kegiatan = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.plus_hutang_kegiatan)}
                                                    </div>
                                                </div>

                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.plus_atribusi)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.plus_atribusi}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].plus_atribusi = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.plus_atribusi)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.plus_reklasifikasi_barang_habis_pakai)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.plus_reklasifikasi_barang_habis_pakai}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].plus_reklasifikasi_barang_habis_pakai = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.plus_reklasifikasi_barang_habis_pakai)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.plus_reklasifikasi_pemeliharaan)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.plus_reklasifikasi_pemeliharaan}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].plus_reklasifikasi_pemeliharaan = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.plus_reklasifikasi_pemeliharaan)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.plus_reklasifikasi_jasa)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.plus_reklasifikasi_jasa}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].plus_reklasifikasi_jasa = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.plus_reklasifikasi_jasa)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.plus_reklasifikasi_kib_a)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.plus_reklasifikasi_kib_a}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].plus_reklasifikasi_kib_a = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.plus_reklasifikasi_kib_a)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.plus_reklasifikasi_kib_b)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.plus_reklasifikasi_kib_b}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].plus_reklasifikasi_kib_b = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.plus_reklasifikasi_kib_b)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.plus_reklasifikasi_kib_c)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.plus_reklasifikasi_kib_c}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].plus_reklasifikasi_kib_c = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.plus_reklasifikasi_kib_c)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.plus_reklasifikasi_kib_d)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.plus_reklasifikasi_kib_d}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].plus_reklasifikasi_kib_d = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.plus_reklasifikasi_kib_d)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.plus_reklasifikasi_kib_e)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.plus_reklasifikasi_kib_e}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].plus_reklasifikasi_kib_e = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.plus_reklasifikasi_kib_e)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.plus_reklasifikasi_kdp)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.plus_reklasifikasi_kdp}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].plus_reklasifikasi_kdp = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.plus_reklasifikasi_kdp)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.plus_reklasifikasi_aset_lain_lain)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.plus_reklasifikasi_aset_lain_lain}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].plus_reklasifikasi_aset_lain_lain = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.plus_reklasifikasi_aset_lain_lain)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.plus_hibah_masuk)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.plus_hibah_masuk}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].plus_hibah_masuk = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.plus_hibah_masuk)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.plus_penilaian)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.plus_penilaian}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].plus_penilaian = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.plus_penilaian)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.plus_mutasi_antar_opd)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.plus_mutasi_antar_opd}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].plus_mutasi_antar_opd = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.plus_mutasi_antar_opd)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.plus_total)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.plus_total}
                                                        readOnly={true}
                                                        // onChange={(e) => {
                                                        //     setDataInput((prev: any) => {
                                                        //         const value = parseFloat(e?.target?.value);
                                                        //         const data = [...prev];
                                                        //         data[index].plus_total = isNaN(value) ? 0 : value;
                                                        //         _calculateData(index)
                                                        //         return data;
                                                        //     });
                                                        // }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.plus_total)}
                                                    </div>
                                                </div>
                                            </td>


                                            {/* MINUS START */}
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.min_pembayaran_utang)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.min_pembayaran_utang}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].min_pembayaran_utang = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.min_pembayaran_utang)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.min_reklasifikasi_beban_persediaan)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.min_reklasifikasi_beban_persediaan}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].min_reklasifikasi_beban_persediaan = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.min_reklasifikasi_beban_persediaan)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.min_reklasifikasi_beban_pemeliharaan)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.min_reklasifikasi_beban_pemeliharaan}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].min_reklasifikasi_beban_pemeliharaan = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.min_reklasifikasi_beban_pemeliharaan)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.min_reklasifikasi_beban_hibah)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.min_reklasifikasi_beban_hibah}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].min_reklasifikasi_beban_hibah = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.min_reklasifikasi_beban_hibah)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.min_reklasifikasi_beban_kib_a)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.min_reklasifikasi_beban_kib_a}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].min_reklasifikasi_beban_kib_a = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.min_reklasifikasi_beban_kib_a)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.min_reklasifikasi_beban_kib_b)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.min_reklasifikasi_beban_kib_b}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].min_reklasifikasi_beban_kib_b = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.min_reklasifikasi_beban_kib_b)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.min_reklasifikasi_beban_kib_c)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.min_reklasifikasi_beban_kib_c}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].min_reklasifikasi_beban_kib_c = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.min_reklasifikasi_beban_kib_c)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.min_reklasifikasi_beban_kib_d)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.min_reklasifikasi_beban_kib_d}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].min_reklasifikasi_beban_kib_d = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.min_reklasifikasi_beban_kib_d)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.min_reklasifikasi_beban_kib_e)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.min_reklasifikasi_beban_kib_e}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].min_reklasifikasi_beban_kib_e = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.min_reklasifikasi_beban_kib_e)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.min_reklasifikasi_beban_kdp)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.min_reklasifikasi_beban_kdp}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].min_reklasifikasi_beban_kdp = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.min_reklasifikasi_beban_kdp)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.min_reklasifikasi_beban_aset_lain_lain)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.min_reklasifikasi_beban_aset_lain_lain}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].min_reklasifikasi_beban_aset_lain_lain = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.min_reklasifikasi_beban_aset_lain_lain)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.min_penghapusan)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.min_penghapusan}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].min_penghapusan = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.min_penghapusan)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.min_mutasi_antar_opd)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.min_mutasi_antar_opd}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].min_mutasi_antar_opd = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.min_mutasi_antar_opd)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.min_tptgr)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.min_tptgr}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const value = parseFloat(e?.target?.value);
                                                                const data = [...prev];
                                                                data[index].min_tptgr = isNaN(value) ? 0 : value;
                                                                _calculateData(index)
                                                                return data;
                                                            });
                                                        }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.min_tptgr)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.min_total)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.min_total}
                                                        readOnly={true}
                                                        // onChange={(e) => {
                                                        //     setDataInput((prev: any) => {
                                                        //         const value = parseFloat(e?.target?.value);
                                                        //         const data = [...prev];
                                                        //         data[index].min_total = isNaN(value) ? 0 : value;
                                                        //         // _calculateData(index)
                                                        //         return data;
                                                        //     });
                                                        // }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.min_total)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                {/* Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(row.saldo_akhir)} */}
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Akumulasi Penyusutan"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.saldo_akhir}
                                                        readOnly={true}
                                                        // onChange={(e) => {
                                                        //     setDataInput((prev: any) => {
                                                        //         const value = parseFloat(e?.target?.value);
                                                        //         const data = [...prev];
                                                        //         data[index].saldo_akhir = isNaN(value) ? 0 : value;
                                                        //         // _calculateData(index)
                                                        //         return data;
                                                        //     });
                                                        // }}
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.saldo_akhir)}
                                                    </div>
                                                </div>
                                            </td>

                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                        <tfoot>
                            <tr className='sticky -bottom-5 left-0 z-[2]'>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white font-semibold sticky -bottom-5 left-0'>
                                    Jumlah
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold sticky -bottom-5 left-[300px]'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.saldo_awal)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.plus_realisasi_belanja)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.plus_hutang_kegiatan)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.plus_atribusi)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.plus_reklasifikasi_barang_habis_pakai)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.plus_reklasifikasi_pemeliharaan)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.plus_reklasifikasi_jasa)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.plus_reklasifikasi_kib_a)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.plus_reklasifikasi_kib_b)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.plus_reklasifikasi_kib_c)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.plus_reklasifikasi_kib_d)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.plus_reklasifikasi_kib_e)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.plus_reklasifikasi_kdp)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.plus_reklasifikasi_aset_lain_lain)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.plus_hibah_masuk)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.plus_penilaian)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.plus_mutasi_antar_opd)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.plus_total)}
                                </td>

                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.min_pembayaran_utang)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.min_reklasifikasi_beban_persediaan)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.min_reklasifikasi_beban_pemeliharaan)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.min_reklasifikasi_beban_hibah)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.min_reklasifikasi_beban_kib_a)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.min_reklasifikasi_beban_kib_b)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.min_reklasifikasi_beban_kib_c)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.min_reklasifikasi_beban_kib_d)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.min_reklasifikasi_beban_kib_e)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.min_reklasifikasi_beban_kdp)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.min_reklasifikasi_beban_aset_lain_lain)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.min_penghapusan)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.min_mutasi_antar_opd)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.min_tptgr)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.min_total)}
                                </td>
                                <td className='border border-slate-900 p-4 bg-slate-400 text-white text-end font-semibold'>
                                    Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.saldo_akhir)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={(e) => {
                            // confirm swal
                            Swal.fire({
                                title: 'Simpan perubahan?',
                                text: 'Perubahan yang disimpan tidak dapat dikembalikan!',
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonText: 'Simpan',
                                cancelButtonText: 'Batal',
                                cancelButtonColor: '#3085d6',
                                confirmButtonColor: '#d33',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    _saveData();
                                }
                            });
                        }}
                        className="btn btn-success">
                        <FontAwesomeIcon icon={faSave} className="w-4 h-4 mr-2" />
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
}
export default KIB_C;
