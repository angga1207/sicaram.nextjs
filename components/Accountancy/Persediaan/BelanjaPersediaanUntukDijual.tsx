import Select from 'react-select';
import { faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import IconTrash from '@/components/Icon/IconTrash';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { deleteBelanjaPersediaan, getBelanjaPersediaan, storeBelanjaPersediaan } from '@/apis/Accountancy/Persediaan';

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

const BelanjaPersediaanUntukDijual = (data: any) => {
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
        setPeriode(paramData[2]);
        setYear(paramData[3]);
    }, [isMounted]);

    const [instance, setInstance] = useState<any>(CurrentUser?.instance_id ?? '');
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
        if (paramData[4]) {
            setInstance(paramData[4]);
        }
    }, [isMounted, paramData]);

    const [dataInput, setDataInput] = useState<any>([]);
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const _getDatas = () => {
        if (periode?.id) {
            getBelanjaPersediaan(instance, periode?.id, year).then((res: any) => {
                if (res.status == 'success') {
                    console.log(res.data.length)
                    if (res.data.length > 0) {
                        setDataInput(res.data);
                    } else {
                        setDataInput([
                            {
                                id: '',
                                instance_id: instance ?? '',

                                nama_persediaan: '',
                                saldo_awal: 0,
                                kode_rekening_id: '',
                                realisasi_lra: 0,
                                hutang_belanja: 0,
                                perolehan_hibah: 0,
                                saldo_akhir: 0,
                                beban_hibah: 0,
                            }
                        ]);
                    }
                }
            });
        }
    }

    const addDataInput = () => {
        const newData = {
            id: '',
            instance_id: instance ?? '',

            nama_persediaan: '',
            saldo_awal: 0,
            kode_rekening_id: '',
            realisasi_lra: 0,
            hutang_belanja: 0,
            perolehan_hibah: 0,
            saldo_akhir: 0,
            beban_hibah: 0,
        }
        setDataInput((prevData: any) => [...prevData, newData]);
        setIsUnsaved(true);
    }

    const [totalData, setTotalData] = useState<any>({
        total_data: 0,
        saldo_awal: 0,
        realisasi_lra: 0,
        hutang_belanja: 0,
        perolehan_hibah: 0,
        saldo_akhir: 0,
        beban_hibah: 0,
    });

    useEffect(() => {
        if (isMounted && periode?.id && year && !instance) {
            if ([9].includes(CurrentUser?.role_id)) {
                setInstance(CurrentUser?.instance_id ?? '');
            } else {
                _getDatas();
            }
        }
        else if (isMounted && periode?.id && year && instance) {
            _getDatas();
        }
    }, [isMounted, instance, periode?.id, year]);

    const updatedData = (data: any, index: number) => {
        setDataInput((prev: any) => {
            const updated = [...prev];
            updated[index].beban_hibah = parseFloat(updated[index].saldo_awal ?? 0) + parseFloat(updated[index].realisasi_lra ?? 0) + parseFloat(updated[index].hutang_belanja ?? 0) + parseFloat(updated[index].perolehan_hibah ?? 0) - parseFloat(updated[index].saldo_akhir ?? 0);
            return updated;
        })
        setIsUnsaved(true);
    }

    useEffect(() => {
        if (isMounted && dataInput.length > 0) {
            setTotalData((prev: any) => {
                const updated = { ...prev };
                updated.total_data = dataInput.length;
                updated.saldo_awal = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['saldo_awal']), 0);
                updated.realisasi_lra = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['realisasi_lra']), 0);
                updated.hutang_belanja = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['hutang_belanja']), 0);
                updated.perolehan_hibah = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['perolehan_hibah']), 0);
                updated.saldo_akhir = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['saldo_akhir']), 0);
                updated.beban_hibah = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['beban_hibah']), 0);
                return updated;
            })
        }
    }, [isMounted, dataInput])

    const save = () => {
        setIsSaving(true);
        // console.log(dataInput);
        storeBelanjaPersediaan(dataInput, periode?.id, year).then((res: any) => {
            if (res.status == 'error validation') {
                showAlert('error', 'Perangkat Daerah dan Nama Persediaan tidak boleh kosong');
                setIsSaving(false);
            } else if (res.status == 'success') {
                showAlert('success', 'Data berhasil disimpan');
                setIsUnsaved(false);
                setIsSaving(false);
                _getDatas();
            } else {
                showAlert('error', 'Data gagal disimpan');
                setIsSaving(false);
            }
        });
    }

    const deleteData = (id: any) => {
        deleteBelanjaPersediaan(id).then((res: any) => {
            if (res.status == 'success') {
                _getDatas();
                showAlert('success', 'Data berhasil dihapus');
            } else {
                showAlert('error', 'Data gagal dihapus');
            }
        });
    }

    return (
        <>
            <div className="table-responsive h-[calc(100vh-420px)] pb-5">
                <table className="table-striped">
                    <thead>
                        <tr className='sticky top-0 left-0 z-[1] !bg-slate-900 !text-white'>
                            <th rowSpan={2} className='whitespace-nowrap border text-center'>
                                Nama Perangkat Daerah
                            </th>
                            <th rowSpan={2} className='whitespace-nowrap border text-center'>
                                Nama Persediaan
                            </th>
                            <th rowSpan={2} className='whitespace-nowrap border text-center'>
                                Saldo Awal {year} (Saldo Akhir {year - 1})
                            </th>
                            <th colSpan={4} className='whitespace-nowrap border text-center'>
                                Mutasi Penambahan Beban {year} (Belanja {year})
                            </th>
                            <th rowSpan={2} className='whitespace-nowrap border text-center'>
                                Saldo Akhir {year}
                            </th>
                            <th rowSpan={2} className='whitespace-nowrap border text-center !max-w-[250px]'>
                                Beban Hibah / Bantuan Sosial
                                <div className='text-xs !whitespace-normal'>
                                    (Saldo Awal + Realisasi LRA + Hutang Belanja + Perolehan Hibah - Saldo Akhir)
                                </div>
                            </th>
                        </tr>
                        <tr className='sticky top-[45px] left-0 z-[1] !bg-slate-900 !text-white'>
                            <th className='whitespace-nowrap border text-center'>
                                Kode Rekening
                            </th>
                            <th className='whitespace-nowrap border text-center'>
                                Realisasi LRA {year} (Rp)
                            </th>
                            <th className='whitespace-nowrap border text-center'>
                                Hutang Belanja {year} (Rp)
                            </th>
                            <th className='whitespace-nowrap border text-center'>
                                Perolehan dari Hibah {year} (Rp)
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataInput?.map((data: any, index: any) => (
                            <tr>
                                <td className='border'>
                                    {/* Perangkat Daerah */}
                                    <div className="flex items-center gap-2">
                                        <Select placeholder="Pilih Perangkat Daerah"
                                            className='min-w-[300px]'
                                            onChange={(e: any) => {
                                                if ([9].includes(CurrentUser?.role_id)) {
                                                    showAlert('error', 'Anda tidak memiliki akses ke Perangkat Daerah ini');
                                                } else {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['instance_id'] = e?.value;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }
                                            }}
                                            isDisabled={[9].includes(CurrentUser?.role_id) ? true : ((isSaving == true) || instance ? true : false)}
                                            required={true}
                                            value={
                                                instances?.map((item: any, index: number) => {
                                                    if (item.id == data.instance_id) {
                                                        return {
                                                            value: item.id,
                                                            label: item.name,
                                                        }
                                                    }
                                                })
                                            }
                                            options={
                                                instances?.map((item: any, index: number) => {
                                                    return {
                                                        value: item.id,
                                                        label: item.name,
                                                    }
                                                })
                                            } />
                                    </div>
                                </td>
                                <td className='border'>
                                    <div className="flex items-center gap-2">
                                        <input type="text"
                                            placeholder='Nama Persediaan'
                                            autoComplete='off'
                                            value={data.nama_persediaan}
                                            onChange={(e) => {
                                                setDataInput((prev: any) => {
                                                    const updated = [...prev];
                                                    updated[index]['nama_persediaan'] = e.target.value;
                                                    return updated;
                                                });
                                            }}
                                            className='form-input font-normal min-w-[250px]' />

                                        <div className="">
                                            <Tippy content="Hapus Data" placement='top' theme='danger'>
                                                <button
                                                    type="button"
                                                    onClick={() => {

                                                        const swalWithBootstrapButtons = Swal.mixin({
                                                            customClass: {
                                                                confirmButton: 'btn btn-danger',
                                                                cancelButton: 'btn btn-slate-200 ltr:mr-3 rtl:ml-3',
                                                                popup: 'sweet-alerts',
                                                            },
                                                            buttonsStyling: false,
                                                        });
                                                        swalWithBootstrapButtons
                                                            .fire({
                                                                title: 'Hapus Data?',
                                                                text: "Apakah Anda yakin untuk menghapus Data Ini!",
                                                                icon: 'question',
                                                                showCancelButton: true,
                                                                confirmButtonText: 'Ya, Hapus!',
                                                                cancelButtonText: 'Tidak!',
                                                                reverseButtons: true,
                                                                padding: '2em',
                                                            })
                                                            .then((result) => {
                                                                if (result.value) {
                                                                    if (data.id) {
                                                                        deleteData(data.id);
                                                                    } else {
                                                                        setDataInput((prev: any) => {
                                                                            const updated = [...prev];
                                                                            updated.splice(index, 1);
                                                                            return updated;
                                                                        });
                                                                    }
                                                                } else if (result.dismiss === Swal.DismissReason.cancel) {
                                                                    swalWithBootstrapButtons.fire('Batal', 'Batal menghapus Data', 'info');
                                                                }
                                                            });
                                                    }}
                                                    className="btn btn-danger w-8 h-8 p-0 rounded-full">
                                                    <IconTrash className='w-4 h-4' />
                                                </button>
                                            </Tippy>
                                        </div>

                                    </div>
                                </td>
                                <td className='border'>
                                    <div className="flex group">
                                        <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                            Rp.
                                        </div>
                                        <input
                                            type="text"
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
                                            value={data.saldo_awal}
                                            onChange={(e) => {
                                                setDataInput((prev: any) => {
                                                    const updated = [...prev];
                                                    const value = parseFloat(e?.target?.value);
                                                    updated[index]['saldo_awal'] = isNaN(value) ? 0 : value;
                                                    updatedData(updated, index);
                                                    return updated;
                                                });
                                            }}
                                            className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                        <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.saldo_awal)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border'>
                                    <Select placeholder="Pilih Kode Rekening"
                                        className='w-[250px]'
                                        isDisabled={isSaving == true}
                                        onChange={(e: any) => {
                                            setDataInput((prev: any) => {
                                                const updated = [...prev];
                                                updated[index]['kode_rekening_id'] = e?.value;
                                                return updated;
                                            })
                                            setIsUnsaved(true);
                                        }}
                                        value={
                                            arrKodeRekening?.map((item: any, index: number) => {
                                                if (item.id == data.kode_rekening_id) {
                                                    return {
                                                        value: item.id,
                                                        label: item.fullcode + ' - ' + item.name,
                                                    }
                                                }
                                            })
                                        }
                                        options={
                                            arrKodeRekening?.map((data: any, index: number) => {
                                                return {
                                                    value: data.id,
                                                    label: data.fullcode + ' - ' + data.name,
                                                }
                                            })
                                        } />
                                </td>
                                <td className='border'>
                                    <div className="flex group">
                                        <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                            Rp.
                                        </div>
                                        <input
                                            type="text"
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
                                            value={data.realisasi_lra}
                                            onChange={(e) => {
                                                setDataInput((prev: any) => {
                                                    const updated = [...prev];
                                                    const value = parseFloat(e?.target?.value);
                                                    updated[index]['realisasi_lra'] = isNaN(value) ? 0 : value;
                                                    updatedData(updated, index);
                                                    return updated;
                                                });
                                            }}
                                            className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                        <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.realisasi_lra)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border'>
                                    <div className="flex group">
                                        <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                            Rp.
                                        </div>
                                        <input
                                            type="text"
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
                                            value={data.hutang_belanja}
                                            onChange={(e) => {
                                                setDataInput((prev: any) => {
                                                    const updated = [...prev];
                                                    const value = parseFloat(e?.target?.value);
                                                    updated[index]['hutang_belanja'] = isNaN(value) ? 0 : value;
                                                    updatedData(updated, index);
                                                    return updated;
                                                });
                                            }}
                                            className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                        <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.hutang_belanja)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border'>
                                    <div className="flex group">
                                        <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                            Rp.
                                        </div>
                                        <input
                                            type="text"
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
                                            value={data.perolehan_hibah}
                                            onChange={(e) => {
                                                setDataInput((prev: any) => {
                                                    const updated = [...prev];
                                                    const value = parseFloat(e?.target?.value);
                                                    updated[index]['perolehan_hibah'] = isNaN(value) ? 0 : value;
                                                    updatedData(updated, index);
                                                    return updated;
                                                });
                                            }}
                                            className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                        <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.perolehan_hibah)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border'>
                                    <div className="flex group">
                                        <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                            Rp.
                                        </div>
                                        <input
                                            type="text"
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
                                            value={data.saldo_akhir}
                                            onChange={(e) => {
                                                setDataInput((prev: any) => {
                                                    const updated = [...prev];
                                                    const value = parseFloat(e?.target?.value);
                                                    updated[index]['saldo_akhir'] = isNaN(value) ? 0 : value;
                                                    updatedData(updated, index);
                                                    return updated;
                                                });
                                            }}
                                            className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                        <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.saldo_akhir)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border'>
                                    <div className="flex group">
                                        <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                            Rp.
                                        </div>
                                        <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end bg-slate-200">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.beban_hibah)}
                                        </div>
                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className='!bg-slate-400 sticky left-0 -bottom-5'>
                            <td className='border text-center font-semibold p-3'>
                                Jumlah
                            </td>
                            <td className='border text-end font-semibold p-3'>
                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.total_data)} Data
                            </td>
                            <td className='border text-end font-semibold p-3'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.saldo_awal)}
                            </td>
                            <td className='border'></td>
                            <td className='border text-end font-semibold p-3'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.realisasi_lra)}
                            </td>
                            <td className='border text-end font-semibold p-3'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.hutang_belanja)}
                            </td>
                            <td className='border text-end font-semibold p-3'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.perolehan_hibah)}
                            </td>
                            <td className='border text-end font-semibold p-3'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.saldo_akhir)}
                            </td>
                            <td className='border text-end font-semibold p-3'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.beban_hibah)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="flex items-center justify-end gap-4 mt-4 px-5">
                <button type="button"
                    disabled={isSaving == true}
                    onClick={(e) => {
                        if (isSaving == false) {
                            addDataInput()
                        }
                    }}
                    className='btn btn-primary whitespace-nowrap text-xs'>
                    <FontAwesomeIcon icon={faPlus} className='w-3 h-3 mr-1' />
                    Tambah Data
                </button>

                {isSaving == false ? (
                    <button type="button"
                        onClick={(e) => {
                            save()
                        }}
                        className='btn btn-success whitespace-nowrap text-xs'>
                        <FontAwesomeIcon icon={faSave} className='w-3 h-3 mr-1' />
                        Simpan Penyesuaian Beban Barjas
                    </button>
                ) : (
                    <button type="button"
                        disabled={true}
                        className='btn btn-success whitespace-nowrap text-xs'>
                        <FontAwesomeIcon icon={faSpinner} className='w-3 h-3 mr-1 animate-spin' />
                        Menyimpan..
                    </button>
                )}

            </div>
        </>
    );
}

export default BelanjaPersediaanUntukDijual;
