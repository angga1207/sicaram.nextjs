import Select from 'react-select';
import { faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { deletePenyesuaianBebanBarjas, getPenyesuaianBebanBarjas, storePenyesuaianBebanBarjas } from '@/apis/Accountancy/PenyesuaianAsetDanBeban';
import IconTrash from '@/components/Icon/IconTrash';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

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

const PenyesuaianBebanDanBarjas = (data: any) => {
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
        // if (isMounted) {
        //     const localPeriode = localStorage.getItem('periode');
        //     if (localPeriode) {
        //         setPeriode(JSON.parse(localPeriode ?? ""));
        //     }
        // }
        setPeriode(paramData[2]);
        setYear(paramData[3]);
    }, [isMounted]);

    // useEffect(() => {
    //     if (isMounted && periode?.id) {
    //         const currentYear = new Date().getFullYear();
    //         if (periode?.start_year <= currentYear) {
    //             setYear(currentYear);
    //         } else {
    //             setYear(periode?.start_year)
    //         }
    //     }
    // }, [isMounted, periode?.id])

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
    }, [isMounted, paramData]);

    const [dataInput, setDataInput] = useState<any>([]);
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const _getDatas = () => {
        if (periode?.id) {
            getPenyesuaianBebanBarjas(instance, periode?.id, year).then((res: any) => {
                if (res.status == 'success') {
                    if (res.data.length > 0) {
                        setDataInput(res.data);
                    } else {
                        setDataInput([{
                            id: '',
                            instance_id: instance ?? '',
                            kode_rekening_id: '',
                            nama_barang_pekerjaan: '',
                            nomor_kontrak: '',
                            nomor_sp2d: '',

                            plus_beban_pegawai: 0,
                            plus_beban_persediaan: 0,
                            plus_beban_jasa: 0,
                            plus_beban_pemeliharaan: 0,
                            plus_beban_perjalanan_dinas: 0,
                            plus_beban_hibah: 0,
                            plus_beban_lain_lain: 0,
                            plus_jumlah_penyesuaian: 0,

                            min_beban_pegawai: 0,
                            min_beban_persediaan: 0,
                            min_beban_jasa: 0,
                            min_beban_pemeliharaan: 0,
                            min_beban_perjalanan_dinas: 0,
                            min_beban_hibah: 0,
                            min_beban_lain_lain: 0,
                            min_jumlah_penyesuaian: 0,
                        }
                        ]);
                    }
                }
            });
        }
    }

    useEffect(() => {
        if (isMounted && periode?.id && year) {
            setInstance(CurrentUser?.instance_id ?? '');
            _getDatas();
        }
    }, [isMounted, instance, periode?.id, year])

    const [totalData, setTotalData] = useState<any>({
        plus_beban_pegawai: 0,
        plus_beban_persediaan: 0,
        plus_beban_jasa: 0,
        plus_beban_pemeliharaan: 0,
        plus_beban_perjalanan_dinas: 0,
        plus_beban_hibah: 0,
        plus_beban_lain_lain: 0,
        plus_jumlah_penyesuaian: 0,

        min_beban_pegawai: 0,
        min_beban_persediaan: 0,
        min_beban_jasa: 0,
        min_beban_pemeliharaan: 0,
        min_beban_perjalanan_dinas: 0,
        min_beban_hibah: 0,
        min_beban_lain_lain: 0,
        min_jumlah_penyesuaian: 0,
    });

    const addDataInput = () => {
        const newData = {
            id: '',
            instance_id: instance ?? '',
            kode_rekening_id: '',
            nama_barang_pekerjaan: '',
            nomor_kontrak: '',
            nomor_sp2d: '',

            plus_beban_pegawai: 0,
            plus_beban_persediaan: 0,
            plus_beban_jasa: 0,
            plus_beban_pemeliharaan: 0,
            plus_beban_perjalanan_dinas: 0,
            plus_beban_hibah: 0,
            plus_beban_lain_lain: 0,
            plus_jumlah_penyesuaian: 0,

            min_beban_pegawai: 0,
            min_beban_persediaan: 0,
            min_beban_jasa: 0,
            min_beban_pemeliharaan: 0,
            min_beban_perjalanan_dinas: 0,
            min_beban_hibah: 0,
            min_beban_lain_lain: 0,
            min_jumlah_penyesuaian: 0,
        }
        setDataInput((prevData: any) => [...prevData, newData]);
        setIsUnsaved(true);
    }

    const updatedData = (data: any, index: number) => {
        setDataInput((prev: any) => {
            const updated = [...prev];
            const keysToSumPlus = ['plus_beban_pegawai', 'plus_beban_persediaan', 'plus_beban_jasa', 'plus_beban_pemeliharaan', 'plus_beban_perjalanan_dinas', 'plus_beban_hibah', 'plus_beban_lain_lain'];
            const sumPlus = keysToSumPlus.reduce((acc: any, key: any) => acc + (updated[index][key] || 0), 0);
            updated[index]['plus_jumlah_penyesuaian'] = sumPlus;
            const keysToSumMinus = ['min_beban_pegawai', 'min_beban_persediaan', 'min_beban_jasa', 'min_beban_pemeliharaan', 'min_beban_perjalanan_dinas', 'min_beban_hibah', 'min_beban_lain_lain'];
            const sumMinus = keysToSumMinus.reduce((acc: any, key: any) => acc + (updated[index][key] || 0), 0);
            updated[index]['min_jumlah_penyesuaian'] = sumMinus;
            return updated;
        })
        setIsUnsaved(true);
    }

    useEffect(() => {
        if (isMounted && dataInput.length > 0) {
            setTotalData((prev: any) => {
                const updated = { ...prev };
                updated['plus_beban_pegawai'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['plus_beban_pegawai']), 0);
                updated['plus_beban_persediaan'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['plus_beban_persediaan']), 0);
                updated['plus_beban_jasa'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['plus_beban_jasa']), 0);
                updated['plus_beban_pemeliharaan'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['plus_beban_pemeliharaan']), 0);
                updated['plus_beban_perjalanan_dinas'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['plus_beban_perjalanan_dinas']), 0);
                updated['plus_beban_hibah'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['plus_beban_hibah']), 0);
                updated['plus_beban_lain_lain'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['plus_beban_lain_lain']), 0);
                updated['plus_jumlah_penyesuaian'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['plus_jumlah_penyesuaian']), 0);

                updated['min_beban_pegawai'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['min_beban_pegawai']), 0);
                updated['min_beban_persediaan'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['min_beban_persediaan']), 0);
                updated['min_beban_jasa'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['min_beban_jasa']), 0);
                updated['min_beban_pemeliharaan'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['min_beban_pemeliharaan']), 0);
                updated['min_beban_perjalanan_dinas'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['min_beban_perjalanan_dinas']), 0);
                updated['min_beban_hibah'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['min_beban_hibah']), 0);
                updated['min_beban_lain_lain'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['min_beban_lain_lain']), 0);
                updated['min_jumlah_penyesuaian'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['min_jumlah_penyesuaian']), 0);
                return updated;
            })
        }
    }, [isMounted, dataInput])

    const save = () => {
        setIsSaving(true);
        // console.log(dataInput);
        storePenyesuaianBebanBarjas(dataInput, periode?.id, year).then((res: any) => {
            if (res.status == 'success') {
                showAlert('success', 'Data berhasil disimpan');
                setIsUnsaved(false);
                setIsSaving(false);
            } else {
                showAlert('error', 'Data gagal disimpan');
                setIsSaving(false);
            }
            _getDatas();
        });
    }

    const deleteData = (id: any) => {
        deletePenyesuaianBebanBarjas(id).then((res: any) => {
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
            <div className="table-responsive h-[calc(100vh-400px)] pb-5">
                <table className="table-striped">
                    <thead>
                        <tr className='sticky top-0 left-0 z-[1]'>
                            {([9].includes(CurrentUser?.role_id) == false) && (
                                <th className='whitespace-nowrap border'>
                                    Nama Perangkat Daerah
                                </th>
                            )}
                            <th className='whitespace-nowrap border'>
                                Kode Rekening
                            </th>
                            <th className='whitespace-nowrap border sticky top-0 left-0 bg-slate-100 dark:bg-slate-800'>
                                Nama Barang / Pekerjaan
                            </th>
                            <th className='whitespace-nowrap border'>
                                Nomor Kontrak
                            </th>
                            <th className='whitespace-nowrap border'>
                                Nomor SP2D
                            </th>

                            <th className='!bg-white border !px-2'></th>

                            <th className='whitespace-nowrap border bg-yellow-200'>
                                Beban Pegawai
                            </th>
                            <th className='whitespace-nowrap border bg-yellow-200'>
                                Beban Persediaan
                            </th>
                            <th className='whitespace-nowrap border bg-yellow-200'>
                                Beban Jasa
                            </th>
                            <th className='whitespace-nowrap border bg-yellow-200'>
                                Beban Pemeliharaan
                            </th>
                            <th className='whitespace-nowrap border bg-yellow-200'>
                                Beban Perjalanan Dinas
                            </th>
                            <th className='whitespace-nowrap border bg-yellow-200'>
                                Beban Hibah
                            </th>
                            <th className='whitespace-nowrap border bg-yellow-200'>
                                Beban Lain-lain
                            </th>
                            <th className='whitespace-nowrap border bg-yellow-200'>
                                Jumlah Penyesuaian
                            </th>

                            <th className='!bg-white border !px-2'></th>

                            <th className='whitespace-nowrap border bg-green-200'>
                                Beban Pegawai
                            </th>
                            <th className='whitespace-nowrap border bg-green-200'>
                                Beban Persediaan
                            </th>
                            <th className='whitespace-nowrap border bg-green-200'>
                                Beban Jasa
                            </th>
                            <th className='whitespace-nowrap border bg-green-200'>
                                Beban Pemeliharaan
                            </th>
                            <th className='whitespace-nowrap border bg-green-200'>
                                Beban Perjalanan Dinas
                            </th>
                            <th className='whitespace-nowrap border bg-green-200'>
                                Beban Hibah
                            </th>
                            <th className='whitespace-nowrap border bg-green-200'>
                                Beban Lain-lain
                            </th>
                            <th className='whitespace-nowrap border bg-green-200'>
                                Jumlah Penyesuaian
                            </th>

                        </tr>
                    </thead>

                    <tbody>
                        {dataInput?.map((input: any, index: number) => (
                            <tr>
                                {([9].includes(CurrentUser?.role_id) == false) && (
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
                                                isDisabled={[9].includes(CurrentUser?.role_id) ? true : (isSaving == true)}
                                                required={true}
                                                value={
                                                    instances?.map((data: any, index: number) => {
                                                        if (data.id == input.instance_id) {
                                                            return {
                                                                value: data.id,
                                                                label: data.name,
                                                            }
                                                        }
                                                    })
                                                }
                                                options={
                                                    instances?.map((data: any, index: number) => {
                                                        return {
                                                            value: data.id,
                                                            label: data.name,
                                                        }
                                                    })
                                                } />
                                        </div>
                                    </td>
                                )}
                                <td className='border'>
                                    {/* Kode Rekening */}
                                    <div className="flex items-center gap-2">
                                        <Select placeholder="Pilih Kode Rekening"
                                            className='w-[400px]'
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
                                                arrKodeRekening?.map((data: any, index: number) => {
                                                    if (data.id == input.kode_rekening_id) {
                                                        return {
                                                            value: data.id,
                                                            label: data.fullcode + ' - ' + data.name,
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

                                        {input?.id && (
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
                                                                        deleteData(input.id);
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
                                        )}

                                    </div>
                                </td>
                                <td className='border sticky left-0 bg-slate-50 dark:bg-slate-900'>
                                    {/* Nama Barang / Pekerjaan */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Nama Barang / Pekerjaan"
                                                className="form-input min-w-[250px] placeholder:font-normal"
                                                value={input.nama_barang_pekerjaan}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['nama_barang_pekerjaan'] = e?.target?.value;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className='border'>
                                    {/* Nomor Kontrak */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Nomor Kontrak"
                                                className="form-input min-w-[250px] placeholder:font-normal"
                                                value={input.nomor_kontrak}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['nomor_kontrak'] = e?.target?.value;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className='border'>
                                    {/* Nomor SP2D */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Nomor SP2D"
                                                className="form-input min-w-[250px]"
                                                value={input.nomor_sp2d}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['nomor_sp2d'] = e?.target?.value;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>

                                <td className='bg-white !px-2'>
                                    {/* Separator */}
                                </td>

                                <td className='border bg-yellow-200'>
                                    {/* Beban Pegawai */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Beban Pegawai"
                                                className="form-input min-w-[250px]"
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
                                                value={input.plus_beban_pegawai}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        const value = parseFloat(e?.target?.value);
                                                        updated[index]['plus_beban_pegawai'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className='border bg-yellow-200'>
                                    {/* Beban Persediaan */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Beban Persediaan"
                                                className="form-input min-w-[250px]"
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
                                                value={input.plus_beban_persediaan}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        const value = parseFloat(e?.target?.value);
                                                        updated[index]['plus_beban_persediaan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className='border bg-yellow-200'>
                                    {/* Beban Jasa */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Beban Jasa"
                                                className="form-input min-w-[250px]"
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
                                                value={input.plus_beban_jasa}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        const value = parseFloat(e?.target?.value);
                                                        updated[index]['plus_beban_jasa'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className='border bg-yellow-200'>
                                    {/* Beban Pemeliharaan */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Beban Pemeliharaan"
                                                className="form-input min-w-[250px]"
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
                                                value={input.plus_beban_pemeliharaan}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        const value = parseFloat(e?.target?.value);
                                                        updated[index]['plus_beban_pemeliharaan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className='border bg-yellow-200'>
                                    {/* Beban Perjalanan Dinas */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Beban Perjalanan Dinas"
                                                className="form-input min-w-[250px]"
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
                                                value={input.plus_beban_perjalanan_dinas}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        const value = parseFloat(e?.target?.value);
                                                        updated[index]['plus_beban_perjalanan_dinas'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className='border bg-yellow-200'>
                                    {/* Beban Hibah */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Beban Hibah"
                                                className="form-input min-w-[250px]"
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
                                                value={input.plus_beban_hibah}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        const value = parseFloat(e?.target?.value);
                                                        updated[index]['plus_beban_hibah'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className='border bg-yellow-200'>
                                    {/* Beban Lain-lain */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Beban Lain-lain"
                                                className="form-input min-w-[250px]"
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
                                                value={input.plus_beban_lain_lain}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        const value = parseFloat(e?.target?.value);
                                                        updated[index]['plus_beban_lain_lain'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className='border bg-yellow-200'>
                                    {/* Jumlah Penyesuaian */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Jumlah Penyesuaian"
                                                className="form-input min-w-[250px] read-only:bg-slate-100"
                                                readOnly
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
                                                value={input.plus_jumlah_penyesuaian}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        const value = parseFloat(e?.target?.value);
                                                        updated[index]['plus_jumlah_penyesuaian'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>

                                <td className='bg-white !px-2'>
                                    {/* Separator */}
                                </td>

                                <td className='border bg-green-200'>
                                    {/* Beban Pegawai */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Beban Pegawai"
                                                className="form-input min-w-[250px]"
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
                                                value={input.min_beban_pegawai}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        const value = parseFloat(e?.target?.value);
                                                        updated[index]['min_beban_pegawai'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className='border bg-green-200'>
                                    {/* Beban Persediaan */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Beban Persediaan"
                                                className="form-input min-w-[250px]"
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
                                                value={input.min_beban_persediaan}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        const value = parseFloat(e?.target?.value);
                                                        updated[index]['min_beban_persediaan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className='border bg-green-200'>
                                    {/* Beban Jasa */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Beban Jasa"
                                                className="form-input min-w-[250px]"
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
                                                value={input.min_beban_jasa}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        const value = parseFloat(e?.target?.value);
                                                        updated[index]['min_beban_jasa'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className='border bg-green-200'>
                                    {/* Beban Pemeliharaan */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Beban Pemeliharaan"
                                                className="form-input min-w-[250px]"
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
                                                value={input.min_beban_pemeliharaan}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        const value = parseFloat(e?.target?.value);
                                                        updated[index]['min_beban_pemeliharaan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className='border bg-green-200'>
                                    {/* Beban Perjalanan Dinas */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Beban Perjalanan Dinas"
                                                className="form-input min-w-[250px]"
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
                                                value={input.min_beban_perjalanan_dinas}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        const value = parseFloat(e?.target?.value);
                                                        updated[index]['min_beban_perjalanan_dinas'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className='border bg-green-200'>
                                    {/* Beban Hibah */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Beban Hibah"
                                                className="form-input min-w-[250px]"
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
                                                value={input.min_beban_hibah}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        const value = parseFloat(e?.target?.value);
                                                        updated[index]['min_beban_hibah'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className='border bg-green-200'>
                                    {/* Beban Lain-lain */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Beban Lain-lain"
                                                className="form-input min-w-[250px]"
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
                                                value={input.min_beban_lain_lain}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        const value = parseFloat(e?.target?.value);
                                                        updated[index]['min_beban_lain_lain'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className='border bg-green-200'>
                                    {/* Jumlah Penyesuaian */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Jumlah Penyesuaian"
                                                className="form-input min-w-[250px]"
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
                                                value={input.min_jumlah_penyesuaian}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        const value = parseFloat(e?.target?.value);
                                                        updated[index]['min_jumlah_penyesuaian'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>

                            </tr>
                        ))}

                        <tr className='!bg-slate-400'>
                            <td colSpan={([9].includes(CurrentUser?.role_id) == false) ? 4 : 3} className='!bg-slate-300'></td>
                            <td className='sticky left-0 text-end font-semibold !bg-slate-300'>
                                Jumlah :
                            </td>
                            <td colSpan={1} className='!bg-slate-300'></td>

                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', {}).format(totalData?.plus_beban_pegawai)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', {}).format(totalData?.plus_beban_persediaan)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', {}).format(totalData?.plus_beban_jasa)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', {}).format(totalData?.plus_beban_pemeliharaan)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', {}).format(totalData?.plus_beban_perjalanan_dinas)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', {}).format(totalData?.plus_beban_hibah)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', {}).format(totalData?.plus_beban_lain_lain)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', {}).format(totalData?.plus_jumlah_penyesuaian)}
                            </td>

                            <td></td>

                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', {}).format(totalData?.min_beban_pegawai)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', {}).format(totalData?.min_beban_persediaan)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', {}).format(totalData?.min_beban_jasa)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', {}).format(totalData?.min_beban_pemeliharaan)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', {}).format(totalData?.min_beban_perjalanan_dinas)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', {}).format(totalData?.min_beban_hibah)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', {}).format(totalData?.min_beban_lain_lain)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', {}).format(totalData?.min_jumlah_penyesuaian)}
                            </td>

                        </tr>
                    </tbody>
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
export default PenyesuaianBebanDanBarjas;
