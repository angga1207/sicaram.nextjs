import Select from 'react-select';
import { faChevronLeft, faChevronRight, faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { deletePenyesuaianAset, getPenyesuaianAset, storePenyesuaianAset } from '@/apis/Accountancy/PenyesuaianAsetDanBeban';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrash from '@/components/Icon/IconTrash';
import InputRupiah from '@/components/InputRupiah';
import DownloadButtons from '@/components/Buttons/DownloadButtons';


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

const PenyesuaianAset = (data: any) => {
    const paramData = data.data
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null)
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [maxPage, setMaxPage] = useState(1);

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
            const arrKodeRekening = paramData[1].map((data: any, index: number) => {
                if (data.code_2 == 2) {
                    return {
                        id: data?.id,
                        code_1: data?.code_1,
                        code_2: data?.code_2,
                        code_3: data?.code_3,
                        code_4: data?.code_4,
                        code_5: data?.code_5,
                        code_6: data?.code_6,
                        fullcode: data?.fullcode,
                        name: data?.name,
                        periode_id: data?.periode_id,
                        year: data?.year,
                    }
                } else {
                    return null;
                }
            }).filter((data: any) => data != null);
            setArrKodeRekening(arrKodeRekening)
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
            getPenyesuaianAset(instance, periode?.id, year).then((res: any) => {
                if (res.status == 'success') {
                    if (res.data.length > 0) {
                        setDataInput(res.data);
                        const maxPage = Math.ceil(res.data.length / perPage);
                        setMaxPage(maxPage);
                    } else {
                        setDataInput([
                            {
                                id: '',
                                instance_id: instance ?? '',
                                kode_rekening_id: '',
                                nama_barang_pekerjaan: '',
                                nomor_kontrak: '',
                                nomor_sp2d: '',

                                plus_aset_tetap_tanah: 0,
                                plus_aset_tetap_peralatan_mesin: 0,
                                plus_aset_tetap_gedung_bangunan: 0,
                                plus_aset_tetap_jalan_jaringan_irigasi: 0,
                                plus_aset_tetap_lainnya: 0,
                                plus_konstruksi_dalam_pekerjaan: 0,
                                plus_aset_lain_lain: 0,
                                plus_jumlah_penyesuaian: 0,

                                min_aset_tetap_tanah: 0,
                                min_aset_tetap_peralatan_mesin: 0,
                                min_aset_tetap_gedung_bangunan: 0,
                                min_aset_tetap_jalan_jaringan_irigasi: 0,
                                min_aset_tetap_lainnya: 0,
                                min_konstruksi_dalam_pekerjaan: 0,
                                min_aset_lain_lain: 0,
                                min_jumlah_penyesuaian: 0,
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
        plus_aset_tetap_tanah: 0,
        plus_aset_tetap_peralatan_mesin: 0,
        plus_aset_tetap_gedung_bangunan: 0,
        plus_aset_tetap_jalan_jaringan_irigasi: 0,
        plus_aset_tetap_lainnya: 0,
        plus_konstruksi_dalam_pekerjaan: 0,
        plus_aset_lain_lain: 0,
        plus_jumlah_penyesuaian: 0,

        min_aset_tetap_tanah: 0,
        min_aset_tetap_peralatan_mesin: 0,
        min_aset_tetap_gedung_bangunan: 0,
        min_aset_tetap_jalan_jaringan_irigasi: 0,
        min_aset_tetap_lainnya: 0,
        min_konstruksi_dalam_pekerjaan: 0,
        min_aset_lain_lain: 0,
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

            plus_aset_tetap_tanah: 0,
            plus_aset_tetap_peralatan_mesin: 0,
            plus_aset_tetap_gedung_bangunan: 0,
            plus_aset_tetap_jalan_jaringan_irigasi: 0,
            plus_aset_tetap_lainnya: 0,
            plus_konstruksi_dalam_pekerjaan: 0,
            plus_aset_lain_lain: 0,
            plus_jumlah_penyesuaian: 0,

            min_aset_tetap_tanah: 0,
            min_aset_tetap_peralatan_mesin: 0,
            min_aset_tetap_gedung_bangunan: 0,
            min_aset_tetap_jalan_jaringan_irigasi: 0,
            min_aset_tetap_lainnya: 0,
            min_konstruksi_dalam_pekerjaan: 0,
            min_aset_lain_lain: 0,
            min_jumlah_penyesuaian: 0,
        }
        setDataInput((prevData: any) => [...prevData, newData]);
        setIsUnsaved(true);
        setMaxPage(Math.ceil((dataInput.length + 1) / perPage));
        setPage(Math.ceil((dataInput.length + 1) / perPage));
    }

    const updatedData = (data: any, index: number) => {
        setDataInput((prev: any) => {
            const updated = [...prev];
            const keysToSumPlus = ['plus_aset_tetap_tanah', 'plus_aset_tetap_peralatan_mesin', 'plus_aset_tetap_gedung_bangunan', 'plus_aset_tetap_jalan_jaringan_irigasi', 'plus_aset_tetap_lainnya', 'plus_konstruksi_dalam_pekerjaan', 'plus_aset_lain_lain'];
            const sumPlus = keysToSumPlus.reduce((acc: any, key: any) => acc + parseFloat(updated[index][key] || 0), 0);
            updated[index]['plus_jumlah_penyesuaian'] = sumPlus;
            const keysToSumMinus = ['min_aset_tetap_tanah', 'min_aset_tetap_peralatan_mesin', 'min_aset_tetap_gedung_bangunan', 'min_aset_tetap_jalan_jaringan_irigasi', 'min_aset_tetap_lainnya', 'min_konstruksi_dalam_pekerjaan', 'min_aset_lain_lain'];
            const sumMinus = keysToSumMinus.reduce((acc: any, key: any) => acc + parseFloat(updated[index][key] || 0), 0);
            updated[index]['min_jumlah_penyesuaian'] = sumMinus;
            return updated;
        })
        setIsUnsaved(true);
    }

    useEffect(() => {
        if (isMounted && dataInput.length > 0) {
            setTotalData((prev: any) => {
                const updated = { ...prev };
                updated['plus_aset_tetap_tanah'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['plus_aset_tetap_tanah']), 0);
                updated['plus_aset_tetap_peralatan_mesin'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['plus_aset_tetap_peralatan_mesin']), 0);
                updated['plus_aset_tetap_gedung_bangunan'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['plus_aset_tetap_gedung_bangunan']), 0);
                updated['plus_aset_tetap_jalan_jaringan_irigasi'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['plus_aset_tetap_jalan_jaringan_irigasi']), 0);
                updated['plus_aset_tetap_lainnya'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['plus_aset_tetap_lainnya']), 0);
                updated['plus_konstruksi_dalam_pekerjaan'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['plus_konstruksi_dalam_pekerjaan']), 0);
                updated['plus_aset_lain_lain'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['plus_aset_lain_lain']), 0);
                updated['plus_jumlah_penyesuaian'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['plus_jumlah_penyesuaian']), 0);

                updated['min_aset_tetap_tanah'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['min_aset_tetap_tanah']), 0);
                updated['min_aset_tetap_peralatan_mesin'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['min_aset_tetap_peralatan_mesin']), 0);
                updated['min_aset_tetap_gedung_bangunan'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['min_aset_tetap_gedung_bangunan']), 0);
                updated['min_aset_tetap_jalan_jaringan_irigasi'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['min_aset_tetap_jalan_jaringan_irigasi']), 0);
                updated['min_aset_tetap_lainnya'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['min_aset_tetap_lainnya']), 0);
                updated['min_konstruksi_dalam_pekerjaan'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['min_konstruksi_dalam_pekerjaan']), 0);
                updated['min_aset_lain_lain'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['min_aset_lain_lain']), 0);
                updated['min_jumlah_penyesuaian'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['min_jumlah_penyesuaian']), 0);
                return updated;
            })
        }
    }, [isMounted, dataInput])

    const save = () => {
        setIsSaving(true);
        storePenyesuaianAset(dataInput, periode?.id, year).then((res: any) => {
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
        deletePenyesuaianAset(id).then((res: any) => {
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
                            <th className='whitespace-nowrap border text-center'>
                                Kode Rekening
                            </th>
                            <th className='whitespace-nowrap border text-center sticky top-0 left-0 bg-slate-100 dark:bg-slate-800'>
                                Nama Barang / Pekerjaan
                            </th>
                            <th className='whitespace-nowrap border text-center'>
                                Nomor Kontrak
                            </th>
                            <th className='whitespace-nowrap border text-center'>
                                Nomor SP2D
                            </th>

                            <th className='!bg-white border !px-2'></th>

                            <th className='whitespace-nowrap border text-center bg-yellow-200'>
                                Aset Tetap Tanah
                            </th>
                            <th className='whitespace-nowrap border text-center bg-yellow-200'>
                                Aset Tetap Peralatan dan Mesin
                            </th>
                            <th className='whitespace-nowrap border text-center bg-yellow-200'>
                                Aset Tetap Gedung dan Bangunan
                            </th>
                            <th className='whitespace-nowrap border text-center bg-yellow-200'>
                                Aset Tetap Jalan Jaringan Irigasi
                            </th>
                            <th className='whitespace-nowrap border text-center bg-yellow-200'>
                                Aset Tetap Lainnya
                            </th>
                            <th className='whitespace-nowrap border text-center bg-yellow-200'>
                                Konstruksi dalam Pekerjaan
                            </th>
                            <th className='whitespace-nowrap border text-center bg-yellow-200'>
                                Aset Lain-lain
                            </th>
                            <th className='whitespace-nowrap border text-center bg-yellow-200'>
                                Jumlah Penyesuaian
                            </th>

                            <th className='!bg-white border !px-2'></th>

                            <th className='whitespace-nowrap border text-center bg-green-200'>
                                Aset Tetap Tanah
                            </th>
                            <th className='whitespace-nowrap border text-center bg-green-200'>
                                Aset Tetap Peralatan dan Mesin
                            </th>
                            <th className='whitespace-nowrap border text-center bg-green-200'>
                                Aset Tetap Gedung dan Bangunan
                            </th>
                            <th className='whitespace-nowrap border text-center bg-green-200'>
                                Aset Tetap Jalan Jaringan Irigasi
                            </th>
                            <th className='whitespace-nowrap border text-center bg-green-200'>
                                Aset Tetap Lainnya
                            </th>
                            <th className='whitespace-nowrap border text-center bg-green-200'>
                                Konstruksi dalam Pekerjaan
                            </th>
                            <th className='whitespace-nowrap border text-center bg-green-200'>
                                Aset Lain-lain
                            </th>
                            <th className='whitespace-nowrap border text-center bg-green-200'>
                                Jumlah Penyesuaian
                            </th>

                        </tr>
                    </thead>

                    <tbody>
                        {dataInput?.map((input: any, index: number) => (
                            <>
                                {(index >= (page - 1) * perPage && index < (page * perPage)) && (
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
                                                                setIsUnsaved(true);
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
                                        <td className='border'>
                                            {/* Kode Rekening */}
                                            <div className="flex items-center gap-2">
                                                <Select placeholder="Pilih Kode Rekening"
                                                    isDisabled={isSaving == true}
                                                    className='min-w-[400px]'
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
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.plus_aset_tetap_tanah}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['plus_aset_tetap_tanah'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border bg-yellow-200'>
                                            {/* Beban Persediaan */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.plus_aset_tetap_peralatan_mesin}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['plus_aset_tetap_peralatan_mesin'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border bg-yellow-200'>
                                            {/* Beban Jasa */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.plus_aset_tetap_gedung_bangunan}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['plus_aset_tetap_gedung_bangunan'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border bg-yellow-200'>
                                            {/* Beban Pemeliharaan */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.plus_aset_tetap_jalan_jaringan_irigasi}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['plus_aset_tetap_jalan_jaringan_irigasi'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border bg-yellow-200'>
                                            {/* Beban Perjalanan Dinas */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.plus_aset_tetap_lainnya}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['plus_aset_tetap_lainnya'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border bg-yellow-200'>
                                            {/* Beban Hibah */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.plus_konstruksi_dalam_pekerjaan}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['plus_konstruksi_dalam_pekerjaan'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border bg-yellow-200'>
                                            {/* Beban Lain-lain */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.plus_aset_lain_lain}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['plus_aset_lain_lain'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border bg-yellow-200'>
                                            {/* Jumlah Penyesuaian */}
                                            <InputRupiah
                                                // isDisabled={isSaving == true}
                                                readOnly={true}
                                                dataValue={input.plus_jumlah_penyesuaian}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['plus_jumlah_penyesuaian'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>

                                        <td className='bg-white !px-2'>
                                            {/* Separator */}
                                        </td>

                                        <td className='border bg-green-300'>
                                            {/* Beban Pegawai */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.min_aset_tetap_tanah}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['min_aset_tetap_tanah'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border bg-green-300'>
                                            {/* Beban Persediaan */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.min_aset_tetap_peralatan_mesin}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['min_aset_tetap_peralatan_mesin'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border bg-green-300'>
                                            {/* Beban Jasa */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.min_aset_tetap_gedung_bangunan}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['min_aset_tetap_gedung_bangunan'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border bg-green-300'>
                                            {/* Beban Pemeliharaan */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.min_aset_tetap_jalan_jaringan_irigasi}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['min_aset_tetap_jalan_jaringan_irigasi'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border bg-green-300'>
                                            {/* Beban Perjalanan Dinas */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.min_aset_tetap_lainnya}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['min_aset_tetap_lainnya'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border bg-green-300'>
                                            {/* Beban Hibah */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.min_konstruksi_dalam_pekerjaan}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['min_konstruksi_dalam_pekerjaan'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border bg-green-300'>
                                            {/* Beban Lain-lain */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.min_aset_lain_lain}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['min_aset_lain_lain'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border bg-green-300'>
                                            {/* Jumlah Penyesuaian */}
                                            <InputRupiah
                                                // isDisabled={isSaving == true}
                                                readOnly={true}
                                                dataValue={input.min_jumlah_penyesuaian}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['min_jumlah_penyesuaian'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>

                                    </tr>
                                )}
                            </>
                        ))}

                        <tr className='!bg-slate-400'>
                            <td colSpan={([9].includes(CurrentUser?.role_id) == false) ? 4 : 3} className='!bg-slate-300'></td>
                            <td className='sticky left-0 text-end font-semibold !bg-slate-300'>
                                Jumlah :
                            </td>
                            <td colSpan={1} className='!bg-slate-300'></td>

                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.plus_aset_tetap_tanah)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.plus_aset_tetap_peralatan_mesin)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.plus_aset_tetap_gedung_bangunan)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.plus_aset_tetap_jalan_jaringan_irigasi)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.plus_aset_tetap_lainnya)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.plus_konstruksi_dalam_pekerjaan)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.plus_aset_lain_lain)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.plus_jumlah_penyesuaian)}
                            </td>

                            <td></td>

                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.min_aset_tetap_tanah)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.min_aset_tetap_peralatan_mesin)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.min_aset_tetap_gedung_bangunan)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.min_aset_tetap_jalan_jaringan_irigasi)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.min_aset_tetap_lainnya)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.min_konstruksi_dalam_pekerjaan)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.min_aset_lain_lain)}
                            </td>
                            <td className='text-end font-semibold !bg-slate-300'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.min_jumlah_penyesuaian)}
                            </td>

                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between gap-4 mt-4 px-5">
                <div className="flex items-center gap-2">
                    <button type="button"
                        onClick={(e) => {
                            if (page > 1) {
                                setPage(page - 1);
                            }
                        }}
                        disabled={page == 1}
                        className='btn btn-primary whitespace-nowrap text-xs'>
                        <FontAwesomeIcon icon={faChevronLeft} className='w-3 h-3 mr-1' />
                    </button>

                    <div className="flex align-center justify-center gap-1">
                        <input
                            type="number"
                            className="form-input min-w-1 text-center py-0 px-1"
                            value={page}
                            onChange={(e: any) => {
                                const value = e.target.value;
                                if (value < 1) {
                                    setPage(1);
                                } else if (value > maxPage) {
                                    setPage(maxPage);
                                }
                                else {
                                    setPage(parseInt(e.target.value));
                                }
                            }}
                            onFocus={(e) => e.target.select()}
                            onClick={(e: any) => e.target.select()}
                            min={1}
                            max={maxPage} />
                        <div>
                            <input
                                type="text"
                                className="form-input min-w-1 text-center py-0 px-1"
                                value={'/ ' + maxPage}
                                readOnly={true}
                                min={1}
                                max={maxPage} />
                        </div>
                    </div>

                    <button type="button"
                        onClick={(e) => {
                            if (page < maxPage) {
                                setPage(page + 1);
                            }
                        }}
                        disabled={page == maxPage}
                        className='btn btn-primary whitespace-nowrap text-xs'>
                        <FontAwesomeIcon icon={faChevronRight} className='w-3 h-3 mr-1' />
                    </button>
                </div>
                <div className="flex items-center justify-end gap-4">
                    {dataInput.length > 0 && (
                        <>
                            <DownloadButtons
                                data={dataInput}
                                endpoint='/accountancy/download/excel'
                                params={{
                                    type: 'penyesuaian_aset',
                                    category: 'padb',
                                }}
                                afterClick={(e: any) => {
                                    if (e === 'error') {
                                        Swal.fire({
                                            title: 'Download Gagal!',
                                            text: 'Terjadi kesalahan saat mendownload file.',
                                            icon: 'error',
                                            showCancelButton: false,
                                            confirmButtonText: 'Tutup',
                                            confirmButtonColor: '#00ab55',
                                        });
                                        return;
                                    } else {
                                        Swal.fire({
                                            title: 'Download Berhasil!',
                                            text: 'File telah berhasil didownload.',
                                            icon: 'success',
                                            showCancelButton: false,
                                            confirmButtonText: 'Tutup',
                                            confirmButtonColor: '#00ab55',
                                        });
                                        return;
                                    }
                                }}
                            />
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
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
export default PenyesuaianAset;
