import Select from 'react-select';
import { faChevronLeft, faChevronRight, faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { deleteBarjasKeAset, getBarjasKeAset, storeBarjasKeAset } from '@/apis/Accountancy/PenyesuaianAsetDanBeban';
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

const BarjasKeAset = (data: any) => {
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
                if (data.code_2 == 1 && data.code_3 == '02') {
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
    const [dataInputOrigin, setDataInputOrigin] = useState<any>([]);
    const [search, setSearch] = useState<any>('');
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const _getDatas = () => {
        if (periode?.id) {
            getBarjasKeAset(instance, periode?.id, year).then((res: any) => {
                if (res.status == 'success') {
                    if (res.data.length > 0) {
                        setDataInput(res.data);
                        setDataInputOrigin(res.data);
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

                                min_beban_pegawai: 0,
                                min_beban_persediaan: 0,
                                min_beban_jasa: 0,
                                min_beban_pemeliharaan: 0,
                                min_beban_perjalanan_dinas: 0,
                                min_beban_hibah: 0,
                                min_beban_lain_lain: 0,
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

            plus_aset_tetap_tanah: 0,
            plus_aset_tetap_peralatan_mesin: 0,
            plus_aset_tetap_gedung_bangunan: 0,
            plus_aset_tetap_jalan_jaringan_irigasi: 0,
            plus_aset_tetap_lainnya: 0,
            plus_konstruksi_dalam_pekerjaan: 0,
            plus_aset_lain_lain: 0,
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
        setMaxPage(Math.ceil((dataInput.length + 1) / perPage));
        setPage(Math.ceil((dataInput.length + 1) / perPage));
    }

    const updatedData = (data: any, index: number) => {
        setDataInput((prev: any) => {
            const updated = [...prev];
            const keysToSumPlus = ['plus_aset_tetap_tanah', 'plus_aset_tetap_peralatan_mesin', 'plus_aset_tetap_gedung_bangunan', 'plus_aset_tetap_jalan_jaringan_irigasi', 'plus_aset_tetap_lainnya', 'plus_konstruksi_dalam_pekerjaan', 'plus_aset_lain_lain'];
            const sumPlus = keysToSumPlus.reduce((acc: any, key: any) => acc + parseFloat(updated[index][key] || 0), 0);
            updated[index]['plus_jumlah_penyesuaian'] = sumPlus;
            const keysToSumMinus = ['min_beban_pegawai', 'min_beban_persediaan', 'min_beban_jasa', 'min_beban_pemeliharaan', 'min_beban_perjalanan_dinas', 'min_beban_hibah', 'min_beban_lain_lain'];
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
        storeBarjasKeAset(dataInput, periode?.id, year).then((res: any) => {
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
        deleteBarjasKeAset(id).then((res: any) => {
            if (res.status == 'success') {
                _getDatas();
                showAlert('success', 'Data berhasil dihapus');
            } else {
                showAlert('error', 'Data gagal dihapus');
            }
        });
    }

    const handleSearch = (e: any) => {
        if (e.length > 0) {
            setSearch(e);
            const filteredData = dataInputOrigin.filter((item: any) => {
                return (
                    item.instance?.name?.toLowerCase().includes(e.toLowerCase()) ||
                    item.instance?.alias?.toLowerCase().includes(e.toLowerCase()) ||
                    item.instance?.code?.toLowerCase().includes(e.toLowerCase()) ||
                    item.kode_rekening?.fullcode?.toString().toLowerCase().includes(e.toLowerCase()) ||
                    item.kode_rekening?.name?.toString().toLowerCase().includes(e.toLowerCase()) ||
                    item.nama_barang_pekerjaan?.toLowerCase().includes(e.toLowerCase()) ||
                    item.nomor_sp2d?.toLowerCase().includes(e.toLowerCase()) ||
                    item.nomor_kontrak?.toLowerCase().includes(e.toLowerCase())
                );
            });
            setDataInput(filteredData);
            setMaxPage(Math.ceil(filteredData.length / perPage));
            setPage(1);
        } else {
            setSearch(e);
            setDataInput(dataInputOrigin);
            setMaxPage(Math.ceil(dataInputOrigin.length / perPage));
            setPage(1);
        }
    }

    return (
        <>
            <div className="table-responsive h-[calc(100vh-400px)] pb-5">
                <table className="table-striped">
                    <thead>
                        <tr className='left-0 sticky top-0 z-[1]'>
                            {([9].includes(CurrentUser?.role_id) == false) && (
                                <th className='border whitespace-nowrap'>
                                    Nama Perangkat Daerah
                                </th>
                            )}
                            <th className='border text-center whitespace-nowrap'>
                                Kode Rekening
                            </th>
                            <th className='bg-slate-100 border text-center dark:bg-slate-800 left-0 sticky top-0 whitespace-nowrap'>
                                Nama Barang / Pekerjaan
                            </th>
                            <th className='border text-center whitespace-nowrap'>
                                Nomor Kontrak
                            </th>
                            <th className='border text-center whitespace-nowrap'>
                                Nomor SP2D
                            </th>

                            <th className='border !bg-white !px-2'></th>

                            <th className='bg-yellow-200 border text-center whitespace-nowrap'>
                                Aset Tetap Tanah
                            </th>
                            <th className='bg-yellow-200 border text-center whitespace-nowrap'>
                                Aset Tetap Peralatan dan Mesin
                            </th>
                            <th className='bg-yellow-200 border text-center whitespace-nowrap'>
                                Aset Tetap Gedung dan Bangunan
                            </th>
                            <th className='bg-yellow-200 border text-center whitespace-nowrap'>
                                Aset Tetap Jalan Jaringan Irigasi
                            </th>
                            <th className='bg-yellow-200 border text-center whitespace-nowrap'>
                                Aset Tetap Lainnya
                            </th>
                            <th className='bg-yellow-200 border text-center whitespace-nowrap'>
                                Konstruksi dalam Pekerjaan
                            </th>
                            <th className='bg-yellow-200 border text-center whitespace-nowrap'>
                                Aset Lain-lain
                            </th>
                            <th className='bg-yellow-200 border text-center whitespace-nowrap'>
                                Jumlah Penyesuaian
                            </th>

                            <th className='border !bg-white !px-2'></th>

                            <th className='bg-green-200 border text-center whitespace-nowrap'>
                                Beban Pegawai
                            </th>
                            <th className='bg-green-200 border text-center whitespace-nowrap'>
                                Beban Persediaan
                            </th>
                            <th className='bg-green-200 border text-center whitespace-nowrap'>
                                Beban Jasa
                            </th>
                            <th className='bg-green-200 border text-center whitespace-nowrap'>
                                Beban Pemeliharaan
                            </th>
                            <th className='bg-green-200 border text-center whitespace-nowrap'>
                                Beban Perjalanan Dinas
                            </th>
                            <th className='bg-green-200 border text-center whitespace-nowrap'>
                                Beban Hibah
                            </th>
                            <th className='bg-green-200 border text-center whitespace-nowrap'>
                                Beban Uang / Jasa Diberikan
                            </th>
                            <th className='bg-green-200 border text-center whitespace-nowrap'>
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
                                            <div className="flex gap-2 items-center">
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
                                                                className="btn btn-danger h-8 p-0 rounded-full w-8">
                                                                <IconTrash className='h-4 w-4' />
                                                            </button>
                                                        </Tippy>
                                                    </div>
                                                )}

                                            </div>
                                        </td>
                                        <td className='bg-slate-50 border dark:bg-slate-900 left-0 sticky'>
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

                                        <td className='bg-yellow-200 border'>
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
                                        <td className='bg-yellow-200 border'>
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
                                        <td className='bg-yellow-200 border'>
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
                                        <td className='bg-yellow-200 border'>
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
                                        <td className='bg-yellow-200 border'>
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
                                        <td className='bg-yellow-200 border'>
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
                                        <td className='bg-yellow-200 border'>
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
                                        <td className='bg-yellow-200 border'>
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

                                        <td className='bg-green-200 border'>
                                            {/* Beban Pegawai */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.min_beban_pegawai}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['min_beban_pegawai'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='bg-green-200 border'>
                                            {/* Beban Persediaan */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.min_beban_persediaan}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['min_beban_persediaan'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='bg-green-200 border'>
                                            {/* Beban Jasa */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.min_beban_jasa}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['min_beban_jasa'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='bg-green-200 border'>
                                            {/* Beban Pemeliharaan */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.min_beban_pemeliharaan}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['min_beban_pemeliharaan'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='bg-green-200 border'>
                                            {/* Beban Perjalanan Dinas */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.min_beban_perjalanan_dinas}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['min_beban_perjalanan_dinas'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='bg-green-200 border'>
                                            {/* Beban Hibah */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.min_beban_hibah}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['min_beban_hibah'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='bg-green-200 border'>
                                            {/* Beban Lain-lain */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.min_beban_lain_lain}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['min_beban_lain_lain'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='bg-green-200 border'>
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
                            <td className='text-end !bg-slate-300 font-semibold left-0 sticky'>
                                Jumlah :
                            </td>
                            <td colSpan={1} className='!bg-slate-300'></td>

                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.plus_aset_tetap_tanah)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.plus_aset_tetap_peralatan_mesin)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.plus_aset_tetap_gedung_bangunan)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.plus_aset_tetap_jalan_jaringan_irigasi)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.plus_aset_tetap_lainnya)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.plus_konstruksi_dalam_pekerjaan)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.plus_aset_lain_lain)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.plus_jumlah_penyesuaian)}
                            </td>

                            <td></td>

                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.min_beban_pegawai)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.min_beban_persediaan)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.min_beban_jasa)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.min_beban_pemeliharaan)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.min_beban_perjalanan_dinas)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.min_beban_hibah)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.min_beban_lain_lain)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.min_jumlah_penyesuaian)}
                            </td>

                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between gap-4 items-center mt-4 px-5">
                <div className="flex gap-2 items-center">
                    <button type="button"
                        onClick={(e) => {
                            if (page > 1) {
                                setPage(page - 1);
                            }
                        }}
                        disabled={page == 1}
                        className='btn btn-primary text-xs whitespace-nowrap'>
                        <FontAwesomeIcon icon={faChevronLeft} className='h-3 w-3 mr-1' />
                    </button>

                    <div className="flex align-center justify-center gap-1">
                        <input
                            type="number"
                            className="form-input text-center min-w-1 px-1 py-0"
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
                                className="form-input text-center min-w-1 px-1 py-0"
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
                        className='btn btn-primary text-xs whitespace-nowrap'>
                        <FontAwesomeIcon icon={faChevronRight} className='h-3 w-3 mr-1' />
                    </button>

                    <div className="">
                        <input
                            type="text"
                            className="form-input text-xs min-w-1 py-1.5 px-2"
                            placeholder="Pencarian"
                            value={search}
                            onChange={(e: any) => {
                                handleSearch(e.target.value);
                            }} />
                    </div>
                </div>
                <div className="flex justify-end gap-4 items-center">
                    {dataInput.length > 0 && (
                        <>
                            <DownloadButtons
                                data={dataInput}
                                endpoint='/accountancy/download/excel'
                                params={{
                                    type: 'barjas_aset',
                                    category: 'padb',
                                    instance: instance,
                                    periode: periode?.id,
                                    year: year,
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
                                className='btn btn-primary text-xs whitespace-nowrap'>
                                <FontAwesomeIcon icon={faPlus} className='h-3 w-3 mr-1' />
                                Tambah Data
                            </button>

                            {isSaving == false ? (
                                <button type="button"
                                    onClick={(e) => {
                                        save()
                                    }}
                                    className='btn btn-success text-xs whitespace-nowrap'>
                                    <FontAwesomeIcon icon={faSave} className='h-3 w-3 mr-1' />
                                    Simpan
                                </button>
                            ) : (
                                <button type="button"
                                    disabled={true}
                                    className='btn btn-success text-xs whitespace-nowrap'>
                                    <FontAwesomeIcon icon={faSpinner} className='h-3 w-3 animate-spin mr-1' />
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
export default BarjasKeAset;
