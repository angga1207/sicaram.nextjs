import Select from 'react-select';
import { faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrash from '@/components/Icon/IconTrash';
import { deleteAtribusi, getAtribusi, storeAtribusi } from '@/apis/Accountancy/PenyesuaianAsetDanBeban';


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

const Atribusi = (data: any) => {
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

    const [dataInput, setDataInput] = useState<any>([]);
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const _getDatas = () => {
        if (periode?.id) {
            getAtribusi(instance, periode?.id, year).then((res: any) => {
                if (res.status == 'success') {
                    if (res.data.length > 0) {
                        setDataInput(res.data);
                    } else {
                        setDataInput([
                            {
                                id: '',
                                instance_id: instance ?? '',

                                bel_peg_kode_rekening_id: '',
                                bel_peg_nama_rekening: '',
                                bel_peg_belanja_last_year: 0,
                                bel_peg_hutang_last_year: 0,
                                bel_peg_jumlah: 0,

                                bel_barjas_kode_rekening_id: '',
                                bel_barjas_nama_rekening_rincian_paket: '',
                                bel_barjas_belanja: 0,
                                bel_barjas_hutang: 0,
                                bel_barjas_jumlah: 0,

                                bel_modal_kode_rekening_id: '',
                                bel_modal_nama_rekening_rincian_paket: '',
                                bel_modal_belanja: 0,
                                bel_modal_hutang: 0,
                                bel_modal_jumlah: 0,

                                ket_no_kontrak_pegawai_barang_jasa: '',
                                ket_no_sp2d_pegawai_barang_jasa: '',

                                atri_aset_tetap_tanah: 0,
                                atri_aset_tetap_peralatan_mesin: 0,
                                atri_aset_tetap_gedung_bangunan: 0,
                                atri_aset_tetap_jalan_jaringan_irigasi: 0,
                                atri_aset_tetap_tetap_lainnya: 0,
                                atri_konstruksi_dalam_pekerjaan: 0,
                                atri_aset_lain_lain: 0,
                                atri_ket_no_kontrak_sp2d: '',
                            }
                        ])
                    }
                }
            });
        }
    }

    useEffect(() => {
        // if (isMounted) {
        //     setInstance(CurrentUser?.instance_id ?? '');
        //     _getDatas();
        // }
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
        bel_peg_belanja_last_year: 0,
        bel_peg_hutang_last_year: 0,
        bel_peg_jumlah: 0,

        bel_barjas_belanja: 0,
        bel_barjas_hutang: 0,
        bel_barjas_jumlah: 0,

        bel_modal_belanja: 0,
        bel_modal_hutang: 0,
        bel_modal_jumlah: 0,

        atri_aset_tetap_tanah: 0,
        atri_aset_tetap_peralatan_mesin: 0,
        atri_aset_tetap_gedung_bangunan: 0,
        atri_aset_tetap_jalan_jaringan_irigasi: 0,
        atri_aset_tetap_tetap_lainnya: 0,
        atri_konstruksi_dalam_pekerjaan: 0,
        atri_aset_lain_lain: 0,
    });

    const addDataInput = () => {
        const newData = {
            id: '',
            instance_id: instance ?? '',

            bel_peg_kode_rekening_id: '',
            bel_peg_nama_rekening: '',
            bel_peg_belanja_last_year: 0,
            bel_peg_hutang_last_year: 0,
            bel_peg_jumlah: 0,

            bel_barjas_kode_rekening_id: '',
            bel_barjas_nama_rekening_rincian_paket: '',
            bel_barjas_belanja: 0,
            bel_barjas_hutang: 0,
            bel_barjas_jumlah: 0,

            bel_modal_kode_rekening_id: '',
            bel_modal_nama_rekening_rincian_paket: '',
            bel_modal_belanja: 0,
            bel_modal_hutang: 0,
            bel_modal_jumlah: 0,

            ket_no_kontrak_pegawai_barang_jasa: '',
            ket_no_sp2d_pegawai_barang_jasa: '',

            atri_aset_tetap_tanah: 0,
            atri_aset_tetap_peralatan_mesin: 0,
            atri_aset_tetap_gedung_bangunan: 0,
            atri_aset_tetap_jalan_jaringan_irigasi: 0,
            atri_aset_tetap_tetap_lainnya: 0,
            atri_konstruksi_dalam_pekerjaan: 0,
            atri_aset_lain_lain: 0,
            atri_ket_no_kontrak_sp2d: '',
        }
        setDataInput((prevData: any) => [...prevData, newData]);
        setIsUnsaved(true);
    }

    const updatedData = (data: any, index: number) => {
        setDataInput((prevData: any) => {
            const updated = [...prevData];

            const keysToSumBelPeg = ['bel_peg_belanja_last_year', 'bel_peg_hutang_last_year'];
            const sumBelPeg = keysToSumBelPeg.reduce((acc, key) => acc + (parseFloat(data[index][key]) || 0), 0);
            updated[index]['bel_peg_jumlah'] = sumBelPeg;

            const keyToSumBelBarjas = ['bel_barjas_belanja', 'bel_barjas_hutang'];
            const sumBelBarjas = keyToSumBelBarjas.reduce((acc, key) => acc + (parseFloat(data[index][key]) || 0), 0);
            updated[index]['bel_barjas_jumlah'] = sumBelBarjas;

            const keyToSumBelModal = ['bel_modal_belanja', 'bel_modal_hutang'];
            const sumBelModal = keyToSumBelModal.reduce((acc, key) => acc + (parseFloat(data[index][key]) || 0), 0);
            updated[index]['bel_modal_jumlah'] = sumBelModal;

            // const keysToSumAtri = [
            //     'atri_aset_tetap_tanah',
            //     'atri_aset_tetap_peralatan_mesin',
            //     'atri_aset_tetap_gedung_bangunan',
            //     'atri_aset_tetap_jalan_jaringan_irigasi',
            //     'atri_aset_tetap_tetap_lainnya',
            //     'atri_konstruksi_dalam_pekerjaan',
            //     'atri_aset_lain_lain'
            // ];
            // const sumAtri = keysToSumAtri.reduce((acc, key) => acc + (data[index][key] || 0), 0);
            // updated[index]['atri_jumlah'] = sumAtri;
            return updated;
        })
        setIsUnsaved(true);
    }

    useEffect(() => {
        if (isMounted && dataInput.length > 0) {
            setTotalData((prev: any) => {
                const updated = { ...prev };
                updated['bel_peg_belanja_last_year'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.bel_peg_belanja_last_year), 0);
                updated['bel_peg_hutang_last_year'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.bel_peg_hutang_last_year), 0);
                updated['bel_peg_jumlah'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.bel_peg_jumlah), 0);

                updated['bel_barjas_belanja'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.bel_barjas_belanja), 0);
                updated['bel_barjas_hutang'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.bel_barjas_hutang), 0);
                updated['bel_barjas_jumlah'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.bel_barjas_jumlah), 0);

                updated['bel_modal_belanja'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.bel_modal_belanja), 0);
                updated['bel_modal_hutang'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.bel_modal_hutang), 0);
                updated['bel_modal_jumlah'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.bel_modal_jumlah), 0);

                updated['atri_aset_tetap_tanah'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.atri_aset_tetap_tanah), 0);
                updated['atri_aset_tetap_peralatan_mesin'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.atri_aset_tetap_peralatan_mesin), 0);
                updated['atri_aset_tetap_gedung_bangunan'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.atri_aset_tetap_gedung_bangunan), 0);
                updated['atri_aset_tetap_jalan_jaringan_irigasi'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.atri_aset_tetap_jalan_jaringan_irigasi), 0);
                updated['atri_aset_tetap_tetap_lainnya'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.atri_aset_tetap_tetap_lainnya), 0);
                updated['atri_konstruksi_dalam_pekerjaan'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.atri_konstruksi_dalam_pekerjaan), 0);
                updated['atri_aset_lain_lain'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.atri_aset_lain_lain), 0);
                return updated;
            })
        }
    }, [isMounted, dataInput])

    const save = () => {
        setIsSaving(true);
        storeAtribusi(dataInput, periode?.id, year).then((res: any) => {
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
        deleteAtribusi(id).then((res: any) => {
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
                        <tr className='sticky top-0 left-0 z-[1] !bg-slate-900 !text-white'>
                            {([9].includes(CurrentUser?.role_id) == false) && (
                                <th rowSpan={2}
                                    className='whitespace-nowrap border text-center'>
                                    Nama Perangkat Daerah
                                </th>
                            )}

                            <th colSpan={5}
                                className="text-center">
                                Belanja Pegawai
                            </th>
                            <th rowSpan={1}
                                className='!bg-white border !px-2'></th>
                            <th colSpan={5}
                                className="text-center">
                                Belanja Barang dan Jasa
                            </th>
                            <th rowSpan={1}
                                className='!bg-white border !px-2'></th>
                            <th colSpan={5}
                                className="text-center">
                                Belanja Modal
                            </th>
                            <th rowSpan={1}
                                className='!bg-white border !px-2'></th>
                            <th colSpan={2}
                                className="text-center bg-green-300 !text-slate-900">
                                Keterangan
                            </th>
                            <th rowSpan={1}
                                className='!bg-white border !px-2'></th>
                            <th colSpan={7}
                                className="text-center bg-yellow-300 !text-slate-900">
                                Atribusi/ Kapitalisasi ke Kelompok Aset (Rp)
                            </th>
                            <th rowSpan={2}
                                className='whitespace-nowrap border text-center bg-yellow-300 !text-slate-900'>
                                Keterangan - No Kontrak/ No SP2D
                            </th>
                        </tr>
                        <tr className='sticky top-[45px] left-0 z-[1] !bg-slate-900 !text-white'>
                            <th className='whitespace-nowrap border'>
                                Kode Rekening
                            </th>
                            <th className='whitespace-nowrap border'>
                                Nama Rekening
                            </th>
                            <th className='whitespace-nowrap border'>
                                Belanja 2022 (Rp)
                            </th>
                            <th className='whitespace-nowrap border'>
                                Hutang 2022 (Rp)
                            </th>
                            <th className='whitespace-nowrap border'>
                                Jumlah (Rp)
                            </th>

                            <th className='!bg-white border !px-2'></th>

                            <th className='whitespace-nowrap border'>
                                Kode Rekening
                            </th>
                            <th className='whitespace-nowrap border'>
                                Nama Rekening & Rincian Paket Pekerjaannya
                            </th>
                            <th className='whitespace-nowrap border'>
                                Belanja 2022 (Rp)
                            </th>
                            <th className='whitespace-nowrap border'>
                                Hutang 2022 (Rp)
                            </th>
                            <th className='whitespace-nowrap border'>
                                Jumlah (Rp)
                            </th>

                            <th className='!bg-white border !px-2'></th>

                            <th className='whitespace-nowrap border'>
                                Kode Rekening & Rincian Paket Pekerjaannya
                            </th>
                            <th className='whitespace-nowrap border'>
                                Nama Rekening
                            </th>
                            <th className='whitespace-nowrap border'>
                                Belanja 2023 (Rp)
                            </th>
                            <th className='whitespace-nowrap border'>
                                Hutang 2023 (Rp)
                            </th>
                            <th className='whitespace-nowrap border'>
                                Jumlah (Rp)
                            </th>

                            <th className='!bg-white border !px-2'></th>

                            <th className='whitespace-nowrap border bg-green-300 !text-slate-900'>
                                No Kontrak Pegawai / Barang Jasa
                            </th>
                            <th className='whitespace-nowrap border bg-green-300 !text-slate-900'>
                                No SP2D Pegawai / Barang Jasa
                            </th>

                            <th className='!bg-white border !px-2'></th>

                            <th className='whitespace-nowrap border bg-yellow-300 !text-slate-900'>
                                Aset Tetap Tanah
                            </th>
                            <th className='whitespace-nowrap border bg-yellow-300 !text-slate-900'>
                                Aset Tetap Peralatan dan Mesin
                            </th>
                            <th className='whitespace-nowrap border bg-yellow-300 !text-slate-900'>
                                Aset Tetap Gedung dan Bangunan
                            </th>
                            <th className='whitespace-nowrap border bg-yellow-300 !text-slate-900'>
                                Aset Tetap Jalan Jaringan Irigasi
                            </th>
                            <th className='whitespace-nowrap border bg-yellow-300 !text-slate-900'>
                                Aset Tetap Lainnya
                            </th>
                            <th className='whitespace-nowrap border bg-yellow-300 !text-slate-900'>
                                Konstruksi Dalam Pekerjaan
                            </th>
                            <th className='whitespace-nowrap border bg-yellow-300 !text-slate-900'>
                                Aset Lain-lain
                            </th>

                        </tr>
                    </thead>

                    <tbody>
                        {dataInput?.map((input: any, index: number) => (
                            <tr>
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
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['instance_id'] = e?.value;
                                                            return updated;
                                                        })
                                                    }
                                                }}
                                                isDisabled={[9].includes(CurrentUser?.role_id) ? true : (isSaving == true)}
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


                                {/* BELANJA PEGAWAI */}
                                <td className='border'>
                                    {/* Kode Rekening */}
                                    <div className="flex items-center gap-2">
                                        <Select placeholder="Pilih Kode Rekening"
                                            isDisabled={isSaving == true}
                                            className='min-w-[400px]'
                                            onChange={(e: any) => {
                                                setDataInput((prev: any) => {
                                                    const updated = [...prev];
                                                    updated[index]['bel_peg_kode_rekening_id'] = e?.value;
                                                    updated[index]['bel_peg_nama_rekening'] = arrKodeRekening?.filter((data: any, index: number) => data?.id === e.value)[0].name
                                                    return updated;
                                                })
                                            }}
                                            value={
                                                arrKodeRekening?.map((data: any, index: number) => {
                                                    if (data.id == input.bel_peg_kode_rekening_id) {
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

                                <td className='border'>
                                    {/* Nama Barang / Pekerjaan */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Nama Barang / Pekerjaan"
                                                className="form-input min-w-[250px] placeholder:font-normal"
                                                value={input.bel_peg_nama_rekening}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['bel_peg_nama_rekening'] = e?.target?.value;
                                                        return updated;
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>

                                <td className='border'>
                                    {/* Belanja Last Year */}
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
                                            value={input.bel_peg_belanja_last_year}
                                            onChange={(e) => {
                                                setDataInput((prev: any) => {
                                                    const updated = [...prev];
                                                    const value = parseFloat(e?.target?.value);
                                                    updated[index]['bel_peg_belanja_last_year'] = isNaN(value) ? 0 : value;
                                                    updatedData(updated, index);
                                                    return updated;
                                                });
                                            }}
                                            className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                        <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(input.bel_peg_belanja_last_year)}
                                        </div>
                                    </div>
                                </td>

                                <td className='border'>
                                    {/* Hutang Last Year */}
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
                                            value={input.bel_peg_hutang_last_year}
                                            onChange={(e) => {
                                                setDataInput((prev: any) => {
                                                    const updated = [...prev];
                                                    const value = parseFloat(e?.target?.value);
                                                    updated[index]['bel_peg_hutang_last_year'] = isNaN(value) ? 0 : value;
                                                    updatedData(updated, index);
                                                    return updated;
                                                });
                                            }}
                                            className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                        <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(input.bel_peg_hutang_last_year)}
                                        </div>
                                    </div>
                                </td>

                                <td className='border'>
                                    {/* Belanja Pegawai Jumlah */}
                                    <div className="flex group">
                                        <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                            Rp.
                                        </div>
                                        <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end bg-slate-100">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(input.bel_peg_jumlah)}
                                        </div>
                                    </div>
                                </td>


                                <td className='bg-white !px-2'>
                                    {/* Separator */}
                                </td>

                                {/* BELANJA BARANG DAN JASA */}
                                <td className='border'>
                                    {/* Kode Rekening */}
                                    <Select placeholder="Pilih Kode Rekening"
                                        className='min-w-[400px]'
                                        onChange={(e: any) => {
                                            setDataInput((prev: any) => {
                                                const updated = [...prev];
                                                updated[index]['bel_barjas_kode_rekening_id'] = e?.value;
                                                updated[index]['bel_barjas_nama_rekening_rincian_paket'] = arrKodeRekening?.filter((data: any, index: number) => data?.id === e.value)[0].name
                                                return updated;
                                            })
                                        }}
                                        value={
                                            arrKodeRekening?.map((data: any, index: number) => {
                                                if (data.id == input.bel_barjas_kode_rekening_id) {
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
                                </td>

                                <td className='border'>
                                    {/* Nama Barang / Pekerjaan */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Nama Barang / Pekerjaan"
                                                className="form-input min-w-[250px] placeholder:font-normal"
                                                value={input.bel_barjas_nama_rekening_rincian_paket}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['bel_barjas_nama_rekening_rincian_paket'] = e?.target?.value;
                                                        return updated;
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>

                                <td className='border'>
                                    {/* Belanja */}
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
                                            value={input.bel_barjas_belanja}
                                            onChange={(e) => {
                                                setDataInput((prev: any) => {
                                                    const updated = [...prev];
                                                    const value = parseFloat(e?.target?.value);
                                                    updated[index]['bel_barjas_belanja'] = isNaN(value) ? 0 : value;
                                                    updatedData(updated, index);
                                                    return updated;
                                                });
                                            }}
                                            className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                        <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(input.bel_barjas_belanja)}
                                        </div>
                                    </div>
                                </td>

                                <td className='border'>
                                    {/* Hutang Last Year */}
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
                                            value={input.bel_barjas_hutang}
                                            onChange={(e) => {
                                                setDataInput((prev: any) => {
                                                    const updated = [...prev];
                                                    const value = parseFloat(e?.target?.value);
                                                    updated[index]['bel_barjas_hutang'] = isNaN(value) ? 0 : value;
                                                    updatedData(updated, index);
                                                    return updated;
                                                });
                                            }}
                                            className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                        <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(input.bel_barjas_hutang)}
                                        </div>
                                    </div>
                                </td>

                                <td className='border'>
                                    {/* Belanja Pegawai Jumlah */}
                                    <div className="flex group">
                                        <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                            Rp.
                                        </div>
                                        <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end bg-slate-100">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(input.bel_barjas_jumlah)}
                                        </div>
                                    </div>
                                </td>


                                <td className='bg-white !px-2'>
                                    {/* Separator */}
                                </td>

                                {/* BELANJA MODAL */}
                                <td className='border'>
                                    {/* Kode Rekening */}
                                    <div className="">
                                        <Select placeholder="Pilih Kode Rekening"
                                            className='min-w-[400px]'
                                            onChange={(e: any) => {
                                                setDataInput((prev: any) => {
                                                    const updated = [...prev];
                                                    updated[index]['bel_modal_kode_rekening_id'] = e?.value;
                                                    updated[index]['bel_modal_nama_rekening_rincian_paket'] = arrKodeRekening?.filter((data: any, index: number) => data?.id === e.value)[0].name
                                                    return updated;
                                                })
                                            }}
                                            value={
                                                arrKodeRekening?.map((data: any, index: number) => {
                                                    if (data.id == input.bel_modal_kode_rekening_id) {
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
                                    </div>
                                </td>

                                <td className='border'>
                                    {/* Nama Barang / Pekerjaan */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Nama Barang / Pekerjaan"
                                                className="form-input min-w-[250px] placeholder:font-normal"
                                                value={input.bel_modal_nama_rekening_rincian_paket}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['bel_modal_nama_rekening_rincian_paket'] = e?.target?.value;
                                                        return updated;
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>

                                <td className='border'>
                                    {/* Belanja */}
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
                                            value={input.bel_modal_belanja}
                                            onChange={(e) => {
                                                setDataInput((prev: any) => {
                                                    const updated = [...prev];
                                                    const value = parseFloat(e?.target?.value);
                                                    updated[index]['bel_modal_belanja'] = isNaN(value) ? 0 : value;
                                                    updatedData(updated, index);
                                                    return updated;
                                                });
                                            }}
                                            className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                        <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(input.bel_modal_belanja)}
                                        </div>
                                    </div>
                                </td>

                                <td className='border'>
                                    {/* Hutang Last Year */}
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
                                            value={input.bel_modal_hutang}
                                            onChange={(e) => {
                                                setDataInput((prev: any) => {
                                                    const updated = [...prev];
                                                    const value = parseFloat(e?.target?.value);
                                                    updated[index]['bel_modal_hutang'] = isNaN(value) ? 0 : value;
                                                    updatedData(updated, index);
                                                    return updated;
                                                });
                                            }}
                                            className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                        <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(input.bel_modal_hutang)}
                                        </div>
                                    </div>
                                </td>

                                <td className='border'>
                                    {/* Belanja Pegawai Jumlah */}
                                    <div className="flex group">
                                        <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                            Rp.
                                        </div>
                                        <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end bg-slate-100">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(input.bel_modal_jumlah)}
                                        </div>
                                    </div>
                                </td>


                                <td className='bg-white !px-2'>
                                    {/* Separator */}
                                </td>

                                {/* KETERANGAN */}
                                <td className='border'>
                                    {/* Nomor Kontrak Pegawai / Barang Jasa */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Nomor Kontrak Pegawai / Barang Jasa"
                                                className="form-input min-w-[250px] placeholder:font-normal"
                                                value={input.ket_no_kontrak_pegawai_barang_jasa}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['ket_no_kontrak_pegawai_barang_jasa'] = e?.target?.value;
                                                        return updated;
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>

                                <td className='border'>
                                    {/* Nomor SP2D Pegawai / Barang Jasa */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Nomor SP2D Pegawai / Barang Jasa"
                                                className="form-input min-w-[250px] placeholder:font-normal"
                                                value={input.ket_no_sp2d_pegawai_barang_jasa}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['ket_no_sp2d_pegawai_barang_jasa'] = e?.target?.value;
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


                                {/* ATRIBUSI */}
                                <td className='border'>
                                    {/* Aset Tetap Tanah */}
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
                                            value={input.atri_aset_tetap_tanah}
                                            onChange={(e) => {
                                                setDataInput((prev: any) => {
                                                    const updated = [...prev];
                                                    const value = parseFloat(e?.target?.value);
                                                    updated[index]['atri_aset_tetap_tanah'] = isNaN(value) ? 0 : value;
                                                    updatedData(updated, index);
                                                    return updated;
                                                });
                                            }}
                                            className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                        <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(input.atri_aset_tetap_tanah)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border'>
                                    {/* Aset Tetap Peralatan dan Mesin */}
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
                                            value={input.atri_aset_tetap_peralatan_mesin}
                                            onChange={(e) => {
                                                setDataInput((prev: any) => {
                                                    const updated = [...prev];
                                                    const value = parseFloat(e?.target?.value);
                                                    updated[index]['atri_aset_tetap_peralatan_mesin'] = isNaN(value) ? 0 : value;
                                                    updatedData(updated, index);
                                                    return updated;
                                                });
                                            }}
                                            className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                        <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(input.atri_aset_tetap_peralatan_mesin)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border'>
                                    {/* Aset Tetap Gedung dan Bangunan */}
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
                                            value={input.atri_aset_tetap_gedung_bangunan}
                                            onChange={(e) => {
                                                setDataInput((prev: any) => {
                                                    const updated = [...prev];
                                                    const value = parseFloat(e?.target?.value);
                                                    updated[index]['atri_aset_tetap_gedung_bangunan'] = isNaN(value) ? 0 : value;
                                                    updatedData(updated, index);
                                                    return updated;
                                                });
                                            }}
                                            className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                        <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(input.atri_aset_tetap_gedung_bangunan)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border'>
                                    {/* Aset Tetap Jalan Jaringan Irigasi */}
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
                                            value={input.atri_aset_tetap_jalan_jaringan_irigasi}
                                            onChange={(e) => {
                                                setDataInput((prev: any) => {
                                                    const updated = [...prev];
                                                    const value = parseFloat(e?.target?.value);
                                                    updated[index]['atri_aset_tetap_jalan_jaringan_irigasi'] = isNaN(value) ? 0 : value;
                                                    updatedData(updated, index);
                                                    return updated;
                                                });
                                            }}
                                            className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                        <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(input.atri_aset_tetap_jalan_jaringan_irigasi)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border'>
                                    {/* Aset Tetap Lainnya */}
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
                                            value={input.atri_aset_tetap_tetap_lainnya}
                                            onChange={(e) => {
                                                setDataInput((prev: any) => {
                                                    const updated = [...prev];
                                                    const value = parseFloat(e?.target?.value);
                                                    updated[index]['atri_aset_tetap_tetap_lainnya'] = isNaN(value) ? 0 : value;
                                                    updatedData(updated, index);
                                                    return updated;
                                                });
                                            }}
                                            className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                        <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(input.atri_aset_tetap_tetap_lainnya)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border'>
                                    {/* Konstruksi Dalam Pekerjaan */}
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
                                            value={input.atri_konstruksi_dalam_pekerjaan}
                                            onChange={(e) => {
                                                setDataInput((prev: any) => {
                                                    const updated = [...prev];
                                                    const value = parseFloat(e?.target?.value);
                                                    updated[index]['atri_konstruksi_dalam_pekerjaan'] = isNaN(value) ? 0 : value;
                                                    updatedData(updated, index);
                                                    return updated;
                                                });
                                            }}
                                            className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                        <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(input.atri_konstruksi_dalam_pekerjaan)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border'>
                                    {/* Aset Lain-lain */}
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
                                            value={input.atri_aset_lain_lain}
                                            onChange={(e) => {
                                                setDataInput((prev: any) => {
                                                    const updated = [...prev];
                                                    const value = parseFloat(e?.target?.value);
                                                    updated[index]['atri_aset_lain_lain'] = isNaN(value) ? 0 : value;
                                                    updatedData(updated, index);
                                                    return updated;
                                                });
                                            }}
                                            className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                        <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(input.atri_aset_lain_lain)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border'>
                                    {/* Keterangan Nomor Kontrak / SP2D */}
                                    <div className="">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Keterangan Nomor Kontrak / SP2D"
                                                className="form-input min-w-[250px]"
                                                value={input.atri_ket_no_kontrak_sp2d}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['atri_ket_no_kontrak_sp2d'] = e?.target?.value;
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
                            <td colSpan={([9].includes(CurrentUser?.role_id) == false) ? 2 : 0} className='!bg-slate-300'></td>
                            <td className='sticky left-0 text-end font-semibold !bg-slate-300'>
                                Jumlah :
                            </td>

                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.bel_peg_belanja_last_year)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.bel_peg_hutang_last_year)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.bel_peg_jumlah)}
                            </td>

                            <td colSpan={3} className='!bg-slate-300'></td>

                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.bel_barjas_belanja)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.bel_barjas_hutang)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.bel_barjas_jumlah)}
                            </td>

                            <td colSpan={3} className='!bg-slate-300'></td>

                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.bel_modal_belanja)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.bel_modal_hutang)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.bel_modal_jumlah)}
                            </td>

                            <td colSpan={4} className='!bg-slate-300'></td>

                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.atri_aset_tetap_tanah)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.atri_aset_tetap_peralatan_mesin)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.atri_aset_tetap_gedung_bangunan)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.atri_aset_tetap_jalan_jaringan_irigasi)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.atri_aset_tetap_tetap_lainnya)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.atri_konstruksi_dalam_pekerjaan)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.atri_aset_lain_lain)}
                            </td>

                            <td className='text-end font-semibold !bg-slate-300'></td>

                        </tr>

                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-end gap-4 mt-4 px-5">
                <button type="button"
                    disabled={isSaving == true}
                    onClick={(e) => {
                        addDataInput()
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
                        Simpan Atribusi
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
export default Atribusi;
