import Select from 'react-select';
import { faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import IconTrash from '@/components/Icon/IconTrash';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { deleteLoTa, getLoTa, storeLoTa } from '@/apis/Accountancy/PiutangPdd';
import InputRupiah from '@/components/InputRupiah';
import IconX from '@/components/Icon/IconX';

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

const LoTa = (data: any) => {
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
        if (paramData[4]) {
            setInstance(paramData[4]);
        }
    }, [isMounted, paramData]);

    const [dataInput1, setDataInput1] = useState<any>([]);
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const _getDatas = () => {
        if (periode?.id) {
            getLoTa(instance, periode?.id, year).then((res: any) => {
                if (res.status == 'success') {
                    if (res.data.length > 0) {
                        setDataInput1(res.data);
                    } else {
                        setDataInput1([
                            {
                                id: '',
                                instance_id: instance ?? '',
                                type: 'pendapatan_pajak_daerah',
                                kode_rekening_id: '',
                                anggaran_perubahan: 0,
                                lra: 0,
                                lra_percent: 0,
                                piutang_awal: 0,
                                piutang_akhir: 0,
                                pdd_awal: 0,
                                pdd_akhir: 0,
                                laporan_operasional: 0,
                                laporan_operasional_percent: 0,
                                penambahan_pengurangan_lo: 0,
                                reklas_koreksi_lo: 0,
                                perbedaan_lo_lra: 0,
                            }
                        ])
                    }
                }
            });
        }
    }


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
    }, [isMounted, instance, year])

    const [totalData, setTotalData] = useState<any>({
        anggaran_perubahan: 0,
        lra: 0,
        lra_percent: 0,
        piutang_awal: 0,
        piutang_akhir: 0,
        pdd_awal: 0,
        pdd_akhir: 0,
        laporan_operasional: 0,
        laporan_operasional_percent: 0,
        penambahan_pengurangan_lo: 0,
        reklas_koreksi_lo: 0,
        perbedaan_lo_lra: 0,
    });


    const addDataInput = (number: number) => {
        const type = number == 1 ? 'pendapatan_pajak_daerah' : number == 2 ? 'hasil_retribusi_daerah' : number == 3 ? 'hasil_pengelolaan_kekayaan_daerah_yang_dipisahkan' : number == 4 ? 'lain_lain_pad_yang_sah' : number == 5 ? 'transfer_pemerintah_pusat' : 'transfer_antar_daerah';
        const newData = {
            id: '',
            instance_id: instance ?? '',
            type: type,
            kode_rekening_id: '',
            anggaran_perubahan: 0,
            lra: 0,
            lra_percent: 0,
            piutang_awal: 0,
            piutang_akhir: 0,
            pdd_awal: 0,
            pdd_akhir: 0,
            laporan_operasional: 0,
            laporan_operasional_percent: 0,
            penambahan_pengurangan_lo: 0,
            reklas_koreksi_lo: 0,
            perbedaan_lo_lra: 0,
        }
        if (number == 1) {
            setDataInput1((prevData: any) => [...prevData, newData]);
        }
        setIsUnsaved(true);
    }

    const updatedData = (data: any, index: number) => {
        if (data.length > 0 && data[0]) {
            setDataInput1((prev: any) => {
                const updated = [...prev];
                updated[index].lra_percent = parseFloat(updated[index].anggaran_perubahan) !== 0 ? ((parseFloat(updated[index].lra) / parseFloat(updated[index].anggaran_perubahan)) * 100) : 0;
                updated[index].laporan_operasional = (parseFloat(updated[index].lra) - parseFloat(updated[index].piutang_awal) + parseFloat(updated[index].piutang_akhir) - parseFloat(updated[index].pdd_akhir) + parseFloat(updated[index].pdd_awal)) + parseFloat(updated[index].penambahan_pengurangan_lo) - parseFloat(updated[index].reklas_koreksi_lo);
                updated[index].laporan_operasional_percent = (parseFloat(updated[index].laporan_operasional) / parseFloat(updated[index].lra)) * 100;
                updated[index].perbedaan_lo_lra = parseFloat(updated[index].laporan_operasional) - parseFloat(updated[index].lra);

                return updated;
            })
        }
        setIsUnsaved(true);
    }

    useEffect(() => {
        if (isMounted) {
            setTotalData((prev: any) => {
                const updated = { ...prev };
                updated['anggaran_perubahan'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['anggaran_perubahan']), 0);
                updated['lra'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['lra']), 0);
                updated['lra_percent'] = updated['anggaran_perubahan'] !== 0 ? ((updated['lra'] / updated['anggaran_perubahan']) * 100) : 0;
                updated['piutang_awal'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['piutang_awal']), 0);
                updated['piutang_akhir'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['piutang_akhir']), 0);
                updated['pdd_awal'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['pdd_awal']), 0);
                updated['pdd_akhir'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['pdd_akhir']), 0);
                updated['laporan_operasional'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['laporan_operasional']), 0);
                updated['laporan_operasional_percent'] = updated['lra'] !== 0 ? ((updated['laporan_operasional'] / updated['lra']) * 100) : 0;
                updated['penambahan_pengurangan_lo'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['penambahan_pengurangan_lo']), 0);
                updated['reklas_koreksi_lo'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['reklas_koreksi_lo']), 0);
                updated['perbedaan_lo_lra'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['perbedaan_lo_lra']), 0);
                return updated;
            })
        }
    }, [isMounted, dataInput1])

    const save = () => {
        setIsSaving(true);
        storeLoTa(dataInput1, periode?.id, year).then((res: any) => {
            if (res.status == 'error validation') {
                showAlert('error', 'Data gagal disimpan, pastikan semua data terisi dengan benar');
                setIsSaving(false);
            }
            else if (res.status == 'success') {
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
        deleteLoTa(id).then((res: any) => {
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
                {!instance && (
                    <div className="flex items-center p-3.5 rounded text-white bg-gradient-to-r from-[#BD194D] to-[#004fe6]">
                        <div className="grow flex items-center justify-center gap-3 ltr:pr-2 rtl:pl-2">
                            <strong className="ltr:mr-1 rtl:ml-1">
                                Peringatan!
                            </strong>
                            <div>
                                Pilih Perangkat Daerah Terlebih Dahulu.
                            </div>
                        </div>
                        <button type="button" className="ltr:ml-auto rtl:mr-auto hover:opacity-80">
                            <IconX className="w-6 h-6" />
                        </button>
                    </div>
                )}
                {instance && (
                    <table className="table-striped">
                        <thead>
                            <tr className='sticky top-0 bg-slate-900 text-white z-[1]'>
                                {([9].includes(CurrentUser?.role_id) == false) && (
                                    <th rowSpan={2} className='text-center whitespace-nowrap border bg-slate-900 text-white min-w-[200px]'>
                                        Nama Perangkat Daerah
                                    </th>
                                )}
                                <th rowSpan={2} className="text-center whitespace-nowrap border bg-slate-900 text-white min-w-[200px]">
                                    Uraian
                                </th>
                                <th rowSpan={2} className="text-center whitespace-nowrap border bg-slate-900 text-white min-w-[200px]">
                                    Anggaran Perubahan
                                </th>
                                <th rowSpan={2} className="text-center whitespace-nowrap border bg-slate-900 text-white min-w-[200px]">
                                    Laporan Realisasi Anggaran (LRA)
                                </th>
                                <th rowSpan={2} className="text-center whitespace-nowrap border bg-slate-900 text-white min-w-[200px]">
                                    % (LRA)
                                </th>
                                <th rowSpan={2} className="text-center whitespace-nowrap border bg-slate-900 text-white min-w-[200px]">
                                    Piutang Awal
                                </th>
                                <th rowSpan={2} className="text-center whitespace-nowrap border bg-slate-900 text-white min-w-[200px]">
                                    Piutang Akhir
                                </th>
                                <th rowSpan={2} className="text-center whitespace-nowrap border bg-slate-900 text-white min-w-[200px]">
                                    PDD Awal TA {year} (Kredit)
                                </th>
                                <th rowSpan={2} className="text-center whitespace-nowrap border bg-slate-900 text-white min-w-[200px]">
                                    PDD Akhir TA {year} (Debet)
                                </th>
                                <th rowSpan={2} className="text-center whitespace-nowrap border bg-slate-900 text-white min-w-[200px]">
                                    Laporan Operasional
                                </th>
                                <th rowSpan={2} className="text-center whitespace-nowrap border bg-slate-900 text-white min-w-[200px]">
                                    % LO
                                </th>
                                <th rowSpan={2} className="text-center whitespace-nowrap border bg-slate-900 text-white min-w-[200px]">
                                    Penambahan / Pengurangan LO
                                </th>
                                <th rowSpan={2} className="text-center whitespace-nowrap border bg-slate-900 text-white min-w-[200px]">
                                    Reklas & Koreksi LO
                                </th>
                                <th rowSpan={2} className="text-center whitespace-nowrap border bg-slate-900 text-white min-w-[200px]">
                                    Perbedaan LO & LRA
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(dataInput1.length > 0) ? (
                                <>
                                    {dataInput1.map((data: any, index: any) => (
                                        <tr key={index}>
                                            {([9].includes(CurrentUser?.role_id) == false) && (
                                                <td className='border'>
                                                    {/* Perangkat Daerah */}
                                                    <div className="">
                                                        <Select placeholder="Pilih Perangkat Daerah"
                                                            className='min-w-[300px]'
                                                            onChange={(e: any) => {
                                                                if ([9].includes(CurrentUser?.role_id)) {
                                                                    showAlert('error', 'Anda tidak memiliki akses ke Perangkat Daerah ini');
                                                                } else {
                                                                    setDataInput1((prev: any) => {
                                                                        const updated = [...prev];
                                                                        updated[index]['instance_id'] = e?.value;
                                                                        return updated;
                                                                    })
                                                                    setIsUnsaved(true);
                                                                }
                                                            }}
                                                            isDisabled={[9].includes(CurrentUser?.role_id) ? true : ((isSaving == true) || instance ? true : false)}
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
                                            )}
                                            <td className='border'>
                                                {/* Kode Rekening */}
                                                <div className="flex items-center gap-2">
                                                    <Select placeholder="Pilih Kode Rekening"
                                                        className='min-w-[400px]'
                                                        classNamePrefix={'selectAngga'}
                                                        isDisabled={isSaving == true}
                                                        onChange={(e: any) => {
                                                            setDataInput1((prev: any) => {
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
                                                            arrKodeRekening?.map((item: any, index: number) => {
                                                                return {
                                                                    value: item.id,
                                                                    label: item.fullcode + ' - ' + item.name,
                                                                }
                                                            })
                                                        } />


                                                    {data?.id && (
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
                                                                                    deleteData(data.id);
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

                                            <td className="border">
                                                <InputRupiah
                                                    dataValue={data.anggaran_perubahan}
                                                    onChange={(value: any) => {
                                                        setDataInput1((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['anggaran_perubahan'] = isNaN(value) ? 0 : value;
                                                            updatedData(updated, index);
                                                            return updated;
                                                        });
                                                    }} />
                                            </td>
                                            <td className="border">
                                                <InputRupiah
                                                    readOnly={true}
                                                    dataValue={data.lra}
                                                    onChange={(value: any) => {
                                                        setDataInput1((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['lra'] = isNaN(value) ? 0 : value;
                                                            updatedData(updated, index);
                                                            return updated;
                                                        });
                                                    }} />
                                            </td>
                                            <td className="border">
                                                <div className="text-center font-semibold">
                                                    {/* {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data.lra_percent)} % */}
                                                    {parseFloat(data.lra_percent)?.toFixed(2)} %
                                                </div>
                                            </td>
                                            <td className="border">
                                                <InputRupiah
                                                    readOnly={true}
                                                    dataValue={data.piutang_awal}
                                                    onChange={(value: any) => {
                                                        setDataInput1((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['piutang_awal'] = isNaN(value) ? 0 : value;
                                                            updatedData(updated, index);
                                                            return updated;
                                                        });
                                                    }} />
                                            </td>
                                            <td className="border">
                                                <InputRupiah
                                                    readOnly={true}
                                                    dataValue={data.piutang_akhir}
                                                    onChange={(value: any) => {
                                                        setDataInput1((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['piutang_akhir'] = isNaN(value) ? 0 : value;
                                                            updatedData(updated, index);
                                                            return updated;
                                                        });
                                                    }} />
                                            </td>
                                            <td className="border">
                                                <InputRupiah
                                                    readOnly={true}
                                                    dataValue={data.pdd_awal}
                                                    onChange={(value: any) => {
                                                        setDataInput1((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['pdd_awal'] = isNaN(value) ? 0 : value;
                                                            updatedData(updated, index);
                                                            return updated;
                                                        });
                                                    }} />
                                            </td>
                                            <td className="border">
                                                <InputRupiah
                                                    readOnly={true}
                                                    dataValue={data.pdd_akhir}
                                                    onChange={(value: any) => {
                                                        setDataInput1((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['pdd_akhir'] = isNaN(value) ? 0 : value;
                                                            updatedData(updated, index);
                                                            return updated;
                                                        });
                                                    }} />
                                            </td>
                                            <td className="border">
                                                <InputRupiah
                                                    readOnly={true}
                                                    dataValue={data.laporan_operasional}
                                                    onChange={(value: any) => {
                                                        setDataInput1((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['laporan_operasional'] = isNaN(value) ? 0 : value;
                                                            updatedData(updated, index);
                                                            return updated;
                                                        });
                                                    }} />
                                            </td>
                                            <td className="border">
                                                <div className="text-center font-semibold">
                                                    {parseFloat(data.laporan_operasional_percent)?.toFixed(2)} %
                                                </div>
                                            </td>
                                            <td className="border">
                                                <InputRupiah
                                                    // readOnly={true}
                                                    dataValue={data.penambahan_pengurangan_lo}
                                                    onChange={(value: any) => {
                                                        setDataInput1((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['penambahan_pengurangan_lo'] = isNaN(value) ? 0 : value;
                                                            updatedData(updated, index);
                                                            return updated;
                                                        });
                                                    }} />
                                            </td>
                                            <td className="border">
                                                <InputRupiah
                                                    // readOnly={true}
                                                    dataValue={data.reklas_koreksi_lo}
                                                    onChange={(value: any) => {
                                                        setDataInput1((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['reklas_koreksi_lo'] = isNaN(value) ? 0 : value;
                                                            updatedData(updated, index);
                                                            return updated;
                                                        });
                                                    }} />
                                            </td>
                                            <td className="border">
                                                <InputRupiah
                                                    readOnly={true}
                                                    dataValue={data.perbedaan_lo_lra}
                                                    onChange={(value: any) => {
                                                        setDataInput1((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['perbedaan_lo_lra'] = isNaN(value) ? 0 : value;
                                                            updatedData(updated, index);
                                                            return updated;
                                                        });
                                                    }} />
                                            </td>

                                        </tr>
                                    ))}
                                </>
                            ) : (
                                <tr>
                                    <td colSpan={12} className='border text-center'>
                                        <div className="font-semibold text-md uppercase">
                                            Sedang Memuat Data
                                            <span className='dots-loading'>
                                                ...
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        {(dataInput1.length > 0) && (
                            <tfoot>
                                <tr>
                                    <td className='border p-4'></td>
                                    <td className="border p-4 bg-slate-50 dark:bg-slate-900">
                                        <div className="text-end font-semibold">
                                            Jumlah
                                        </div>
                                    </td>
                                    <td className="border p-4">
                                        <div className="flex justify-between font-semibold text-end whitespace-nowrap">
                                            <div className="">
                                                Rp.
                                            </div>
                                            <div className="">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.anggaran_perubahan)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border p-4">
                                        <div className="flex justify-between font-semibold text-end whitespace-nowrap">
                                            <div className="">
                                                Rp.
                                            </div>
                                            <div className="">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.lra)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border p-4">
                                        <div className="flex justify-between font-semibold text-end whitespace-nowrap">
                                            <div className="">
                                                {parseFloat(totalData.lra_percent)?.toFixed(2)}
                                            </div>
                                            <div className="">
                                                %
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border p-4">
                                        <div className="flex justify-between font-semibold text-end whitespace-nowrap">
                                            <div className="">
                                                Rp.
                                            </div>
                                            <div className="">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.piutang_awal)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border p-4">
                                        <div className="flex justify-between font-semibold text-end whitespace-nowrap">
                                            <div className="">
                                                Rp.
                                            </div>
                                            <div className="">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.piutang_akhir)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border p-4">
                                        <div className="flex justify-between font-semibold text-end whitespace-nowrap">
                                            <div className="">
                                                Rp.
                                            </div>
                                            <div className="">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.pdd_awal)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border p-4">
                                        <div className="flex justify-between font-semibold text-end whitespace-nowrap">
                                            <div className="">
                                                Rp.
                                            </div>
                                            <div className="">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.pdd_akhir)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border p-4">
                                        <div className="flex justify-between font-semibold text-end whitespace-nowrap">
                                            <div className="">
                                                Rp.
                                            </div>
                                            <div className="">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.laporan_operasional)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border p-4">
                                        <div className="flex justify-between font-semibold text-end whitespace-nowrap">
                                            <div className="">
                                                {parseFloat(totalData.laporan_operasional_percent)?.toFixed(2)}
                                            </div>
                                            <div className="">
                                                %
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border p-4">
                                        <div className="flex justify-between font-semibold text-end whitespace-nowrap">
                                            <div className="">
                                                Rp.
                                            </div>
                                            <div className="">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.penambahan_pengurangan_lo)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border p-4">
                                        <div className="flex justify-between font-semibold text-end whitespace-nowrap">
                                            <div className="">
                                                Rp.
                                            </div>
                                            <div className="">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.reklas_koreksi_lo)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border p-4">
                                        <div className="flex justify-between font-semibold text-end whitespace-nowrap">
                                            <div className="">
                                                Rp.
                                            </div>
                                            <div className="">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.perbedaan_lo_lra)}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                )}
            </div>

            {instance && (
                <div className="flex items-center justify-end gap-4 mt-4 px-5">
                    <div className="">
                        <button type="button"
                            disabled={isSaving == true}
                            onClick={(e) => {
                                addDataInput(1)
                            }}
                            className='btn btn-primary whitespace-nowrap text-xs'>
                            <FontAwesomeIcon icon={faPlus} className='w-3 h-3 mr-1' />
                            Tambah Data
                        </button>
                    </div>

                    {isSaving == false ? (
                        <button type="button"
                            onClick={(e) => {
                                save()
                            }}
                            className='btn btn-success whitespace-nowrap text-xs'>
                            <FontAwesomeIcon icon={faSave} className='w-3 h-3 mr-1' />
                            Simpan
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
            )}
        </>
    );
}

export default LoTa;

