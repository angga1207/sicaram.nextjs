import Select from 'react-select';
import { faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { getPenyusutan, savePenyusutan } from '@/apis/Accountancy/RekonsiliasiAset';
import InputRupiah from '@/components/InputRupiah';


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

const Penyusutan = (data: any) => {
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
        akumulasi_penyusutan_last_year: 0,
        mutasi_tambah: 0,
        mutasi_kurang: 0,
        akumulasi_penyusutan: 0,
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
        getPenyusutan(instance, periode?.id, year).then((res) => {
            if (res.status === 'success') {
                setDataInput(res.data.datas);
            }
        });
    }

    const updatedData = (data: any, index: number) => {
        setDataInput((prev: any) => {
            const updated = [...prev];
            // const keysToSumPlus = ['plus_aset_tetap_tanah', 'plus_aset_tetap_peralatan_mesin', 'plus_aset_tetap_gedung_bangunan', 'plus_aset_tetap_jalan_jaringan_irigasi', 'plus_aset_tetap_lainnya', 'plus_konstruksi_dalam_pekerjaan', 'plus_aset_lain_lain'];
            // const sumPlus = keysToSumPlus.reduce((acc: any, key: any) => acc + (updated[index][key] || 0), 0);
            // updated[index]['plus_jumlah_penyesuaian'] = sumPlus;
            updated[index]['akumulasi_penyusutan'] = parseFloat(updated[index]['akumulasi_penyusutan_last_year']) + parseFloat(updated[index]['mutasi_tambah']) - parseFloat(updated[index]['mutasi_kurang']);
            return updated;
        })
        setIsUnsaved(true);
    }

    useEffect(() => {
        if (isMounted && dataInput.length > 0) {
            setGrandTotal((prev: any) => {
                const updated = { ...prev };
                updated['akumulasi_penyusutan_last_year'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.akumulasi_penyusutan_last_year), 0);
                updated['mutasi_tambah'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.mutasi_tambah), 0);
                updated['mutasi_kurang'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.mutasi_kurang), 0);
                updated['akumulasi_penyusutan'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.akumulasi_penyusutan), 0);
                return updated;
            });
        }
    }, [isMounted && dataInput]);

    const _saveData = () => {
        setIsSaving(true);
        savePenyusutan(instance, periode?.id, year, dataInput).then((res) => {
            if (res.status === 'success') {
                _getDatas();
                setIsSaving(false);
            } else {
                setIsSaving(false);
                showAlert('error', 'Data gagal disimpan');
            }
        });
    };

    const [percentage, setPercentage] = useState<any>(0);

    useEffect(() => {
        if (isMounted) {
            setPercentage(grandTotal?.akumulasi_penyusutan_last_year != 0 ? ((grandTotal?.akumulasi_penyusutan - grandTotal?.akumulasi_penyusutan_last_year) / grandTotal?.akumulasi_penyusutan_last_year * 100).toFixed(2) : 0);
        }
    }, [grandTotal])

    return (
        <div>
            <div className="">
                <div className="table-responsive mb-5 pb-5">
                    <table className="table-striped">
                        <thead>
                            <tr className='!bg-slate-900 !text-white'>
                                <th rowSpan={2} className='border border-white text-center min-w-[300px]'>
                                    Nama Aset
                                </th>
                                <th rowSpan={2} className='border border-white text-center w-[250px]'>
                                    Akumulasi Penyusutan 31 Des {year - 1}
                                </th>
                                <th colSpan={2} className='border border-white text-center'>
                                    Mutasi
                                </th>
                                <th rowSpan={2} className='border border-white text-center w-[250px]'>
                                    Akumulasi Penyusutan 31 Des {year}
                                </th>
                            </tr>
                            <tr className='!bg-slate-900 !text-white'>
                                <th className='border border-white text-center w-[250px]'>
                                    Tambah
                                </th>
                                <th className='border border-white text-center w-[250px]'>
                                    Kurang
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dataInput.map((data: any, index: any) => {
                                    return (
                                        <tr key={index}>
                                            <td className='border border-slate-900'>
                                                <div className="font-semibold">
                                                    {data.uraian}
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                <InputRupiah
                                                    dataValue={data.akumulasi_penyusutan_last_year}
                                                    onChange={(value: any) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['akumulasi_penyusutan_last_year'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        });
                                                        updatedData(data, index);
                                                    }} />
                                            </td>
                                            <td className='border border-slate-900'>
                                                <InputRupiah
                                                    dataValue={data.mutasi_tambah}
                                                    onChange={(value: any) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['mutasi_tambah'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        });
                                                        updatedData(data, index);
                                                    }} />
                                            </td>
                                            <td className='border border-slate-900'>
                                                <InputRupiah
                                                    dataValue={data.mutasi_kurang}
                                                    onChange={(value: any) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['mutasi_kurang'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        });
                                                        updatedData(data, index);
                                                    }} />
                                            </td>
                                            <td className='border border-slate-900'>
                                                <InputRupiah
                                                    readOnly={true}
                                                    dataValue={data.akumulasi_penyusutan}
                                                    onChange={(value: any) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['akumulasi_penyusutan'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        });
                                                    }} />
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td className='bg-slate-400 border border-slate-900 p-3 text-white'>
                                    <div className="font-semibold">
                                        Jumlah
                                    </div>
                                </td>
                                <td className='bg-slate-400 border border-slate-900 p-3 text-white'>
                                    <div className="text-end font-semibold">
                                        Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.akumulasi_penyusutan_last_year)}
                                    </div>
                                </td>
                                <td className='bg-slate-400 border border-slate-900 p-3 text-white'>
                                    <div className="text-end font-semibold">
                                        Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.mutasi_tambah)}
                                    </div>
                                </td>
                                <td className='bg-slate-400 border border-slate-900 p-3 text-white'>
                                    <div className="text-end font-semibold">
                                        Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.mutasi_kurang)}
                                    </div>
                                </td>
                                <td className='bg-slate-400 border border-slate-900 p-3 text-white'>
                                    <div className="text-end font-semibold">
                                        Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.akumulasi_penyusutan)}
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <div className="flex justify-end gap-2 items-center">
                <div className="flex flex-col items-end">
                    <div className="">
                        Kenaikan / Penurunan
                    </div>
                    <div className="w-[200px] font-semibold">
                        <div className='flex justify-between cursor-pointer items-center'>
                            <div className="">
                                Rp.
                            </div>
                            <div className="">
                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal?.akumulasi_penyusutan - grandTotal?.akumulasi_penyusutan_last_year)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="">
                        Persentase
                    </div>
                    <div className="w-[200px] font-semibold">
                        <div className='flex justify-end cursor-pointer gap-1 items-center'>
                            <div className="">
                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(percentage)}
                            </div>
                            <div className="">
                                %
                            </div>
                        </div>
                    </div>
                </div>
                {instance && (
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
                                confirmButtonColor: '#00ab55',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    _saveData();
                                }
                            });
                        }}
                        className="btn btn-success">
                        <FontAwesomeIcon icon={faSave} className="h-4 w-4 mr-2" />
                        Simpan
                    </button>
                )}
            </div>
        </div>
    );
}
export default Penyusutan;
