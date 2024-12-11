import Select from 'react-select';
import { faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { getPenyusutan, savePenyusutan } from '@/apis/Accountancy/RekonsiliasiAset';


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

    return (
        <div>
            <div className="">
                <div className="table-responsive mb-5 pb-5">
                    <table className="table-striped">
                        <thead>
                            <tr className='!bg-slate-900 !text-white'>
                                <th rowSpan={2} className='text-center border border-white min-w-[300px]'>
                                    Nama Aset
                                </th>
                                <th rowSpan={2} className='text-center border border-white w-[250px]'>
                                    Akumulasi Penyusutan 31 Des {year - 1}
                                </th>
                                <th colSpan={2} className='text-center border border-white'>
                                    Mutasi
                                </th>
                                <th rowSpan={2} className='text-center border border-white w-[250px]'>
                                    Akumulasi Penyusutan 31 Des {year}
                                </th>
                            </tr>
                            <tr className='!bg-slate-900 !text-white'>
                                <th className='text-center border border-white w-[250px]'>
                                    Tambah
                                </th>
                                <th className='text-center border border-white w-[250px]'>
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
                                                        value={data.akumulasi_penyusutan_last_year}
                                                        onChange={(e) => {
                                                            if (instance) {
                                                                setDataInput((prev: any) => {
                                                                    const value = parseFloat(e?.target?.value);
                                                                    const data = [...prev];
                                                                    data[index].akumulasi_penyusutan_last_year = isNaN(value) ? 0 : value;
                                                                    return data;
                                                                });
                                                            }
                                                        }}
                                                        readOnly={!instance}
                                                        className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.akumulasi_penyusutan_last_year)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Mutasi Tambah"
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
                                                        value={data.mutasi_tambah}
                                                        onChange={(e) => {
                                                            if (instance) {
                                                                setDataInput((prev: any) => {
                                                                    const value = parseFloat(e?.target?.value);
                                                                    const data = [...prev];
                                                                    data[index].mutasi_tambah = isNaN(value) ? 0 : value;
                                                                    return data;
                                                                });
                                                            }
                                                        }}
                                                        readOnly={!instance}
                                                        className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.mutasi_tambah)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Mutasi Kurang"
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
                                                        value={data.mutasi_kurang}
                                                        onChange={(e) => {
                                                            if (instance) {
                                                                setDataInput((prev: any) => {
                                                                    const value = parseFloat(e?.target?.value);
                                                                    const data = [...prev];
                                                                    data[index].mutasi_kurang = isNaN(value) ? 0 : value;
                                                                    return data;
                                                                });
                                                            }
                                                        }}
                                                        readOnly={!instance}
                                                        className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.mutasi_kurang)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-slate-900'>
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
                                                        value={data.akumulasi_penyusutan}
                                                        onChange={(e) => {
                                                            if (instance) {
                                                                setDataInput((prev: any) => {
                                                                    const value = parseFloat(e?.target?.value);
                                                                    const data = [...prev];
                                                                    data[index].akumulasi_penyusutan = isNaN(value) ? 0 : value;
                                                                    return data;
                                                                });
                                                            }
                                                        }}
                                                        readOnly={!instance}
                                                        className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                    <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.akumulasi_penyusutan)}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td className='border border-slate-900 p-3 bg-slate-400 text-white'>
                                    <div className="font-semibold">
                                        Jumlah
                                    </div>
                                </td>
                                <td className='border border-slate-900 p-3 bg-slate-400 text-white'>
                                    <div className="text-end font-semibold">
                                        Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.akumulasi_penyusutan_last_year)}
                                    </div>
                                </td>
                                <td className='border border-slate-900 p-3 bg-slate-400 text-white'>
                                    <div className="text-end font-semibold">
                                        Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.mutasi_tambah)}
                                    </div>
                                </td>
                                <td className='border border-slate-900 p-3 bg-slate-400 text-white'>
                                    <div className="text-end font-semibold">
                                        Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.mutasi_kurang)}
                                    </div>
                                </td>
                                <td className='border border-slate-900 p-3 bg-slate-400 text-white'>
                                    <div className="text-end font-semibold">
                                        Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.akumulasi_penyusutan)}
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2">
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
                )}
            </div>
        </div>
    );
}
export default Penyusutan;
