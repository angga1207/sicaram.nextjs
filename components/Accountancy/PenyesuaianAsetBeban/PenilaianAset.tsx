import Select from 'react-select';
import { faChevronLeft, faChevronRight, faPlus, faSave, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import IconTrash from '@/components/Icon/IconTrash';
import { deletePenilaianAset, getPenilaianAset, storePenilaianAset } from '@/apis/Accountancy/PenyesuaianAsetDanBeban';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import InputRupiah from '@/components/InputRupiah';
import DownloadButtons from '@/components/Buttons/DownloadButtons';
import { massDeleteData } from '@/apis/Accountancy/Accountancy';


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

const PenilaianAset = (data: any) => {
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
            setArrKodeRekening(paramData[1])
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
    const [selectedMode, setSelectedMode] = useState<boolean>(false);
    const [selectedData, setSelectedData] = useState<any>([]);

    const _getDatas = () => {
        if (periode?.id) {
            getPenilaianAset(instance, periode?.id, year).then((res: any) => {
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

                                kelompok_barang_aset: '',
                                nama_barang: '',
                                tahun_perolehan: '',
                                metode_perolehan: '',
                                nilai_awal_aset: 0,
                                hasil_penilaian: 0,
                                nomor_berita_acara: '',
                                tanggal_berita_acara: '',
                                keterangan: '',

                                persediaan: 0,
                                aset_tetap_tanah: 0,
                                aset_tetap_peralatan_mesin: 0,
                                aset_tetap_gedung_bangunan: 0,
                                aset_tetap_jalan_jaringan_irigasi: 0,
                                aset_tetap_lainnya: 0,
                                konstruksi_dalam_pekerjaan: 0,
                                aset_lainnya: 0,
                                jumlah_penyesuaian: 0,
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
        total_data: 0,
        nilai_awal_aset: 0,
        hasil_penilaian: 0,

        persediaan: 0,
        aset_tetap_tanah: 0,
        aset_tetap_peralatan_mesin: 0,
        aset_tetap_gedung_bangunan: 0,
        aset_tetap_jalan_jaringan_irigasi: 0,
        aset_tetap_lainnya: 0,
        konstruksi_dalam_pekerjaan: 0,
        aset_lainnya: 0,
        jumlah_penyesuaian: 0,
    });

    const addDataInput = () => {
        const newData = {
            id: '',
            instance_id: instance ?? '',

            kelompok_barang_aset: '',
            nama_barang: '',
            tahun_perolehan: '',
            metode_perolehan: '',
            nilai_awal_aset: 0,
            hasil_penilaian: 0,
            nomor_berita_acara: '',
            tanggal_berita_acara: '',
            keterangan: '',

            persediaan: 0,
            aset_tetap_tanah: 0,
            aset_tetap_peralatan_mesin: 0,
            aset_tetap_gedung_bangunan: 0,
            aset_tetap_jalan_jaringan_irigasi: 0,
            aset_tetap_lainnya: 0,
            konstruksi_dalam_pekerjaan: 0,
            aset_lainnya: 0,
            jumlah_penyesuaian: 0,
        }
        setDataInput((prevData: any) => [...prevData, newData]);
        setIsUnsaved(true);
        setMaxPage(Math.ceil((dataInput.length + 1) / perPage));
        setPage(Math.ceil((dataInput.length + 1) / perPage));
    }

    const updatedData = (data: any, index: number) => {
        setDataInput((prevData: any) => {
            const updated = [...prevData];
            const keysToSum = ['persediaan', 'aset_tetap_tanah', 'aset_tetap_peralatan_mesin', 'aset_tetap_gedung_bangunan', 'aset_tetap_jalan_jaringan_irigasi', 'aset_tetap_lainnya', 'konstruksi_dalam_pekerjaan', 'aset_lainnya'];
            const sumPenyesuaian = keysToSum.reduce((acc, key) => acc + (parseFloat(data[index][key]) || 0), 0);
            updated[index]['jumlah_penyesuaian'] = sumPenyesuaian;
            return updated;
        })
        setIsUnsaved(true);
    }

    useEffect(() => {
        if (isMounted && dataInput.length > 0) {
            setTotalData((prev: any) => {
                const updated = { ...prev };
                updated.total_data = dataInput.length;
                updated.nilai_awal_aset = dataInput.reduce((acc: any, curr: any) => acc + (parseFloat(curr.nilai_awal_aset) || 0), 0);
                updated.hasil_penilaian = dataInput.reduce((acc: any, curr: any) => acc + (parseFloat(curr.hasil_penilaian) || 0), 0);

                updated.persediaan = dataInput.reduce((acc: any, curr: any) => acc + (parseFloat(curr.persediaan) || 0), 0);
                updated.aset_tetap_tanah = dataInput.reduce((acc: any, curr: any) => acc + (parseFloat(curr.aset_tetap_tanah) || 0), 0);
                updated.aset_tetap_peralatan_mesin = dataInput.reduce((acc: any, curr: any) => acc + (parseFloat(curr.aset_tetap_peralatan_mesin) || 0), 0);
                updated.aset_tetap_gedung_bangunan = dataInput.reduce((acc: any, curr: any) => acc + (parseFloat(curr.aset_tetap_gedung_bangunan) || 0), 0);
                updated.aset_tetap_jalan_jaringan_irigasi = dataInput.reduce((acc: any, curr: any) => acc + (parseFloat(curr.aset_tetap_jalan_jaringan_irigasi) || 0), 0);
                updated.aset_tetap_lainnya = dataInput.reduce((acc: any, curr: any) => acc + (parseFloat(curr.aset_tetap_lainnya) || 0), 0);
                updated.konstruksi_dalam_pekerjaan = dataInput.reduce((acc: any, curr: any) => acc + (parseFloat(curr.konstruksi_dalam_pekerjaan) || 0), 0);
                updated.aset_lainnya = dataInput.reduce((acc: any, curr: any) => acc + (parseFloat(curr.aset_lainnya) || 0), 0);
                updated.jumlah_penyesuaian = dataInput.reduce((acc: any, curr: any) => acc + (parseFloat(curr.jumlah_penyesuaian) || 0), 0);
                return updated;
            });
        }
    }, [isMounted, dataInput])

    const save = () => {
        setIsSaving(true);
        storePenilaianAset(dataInput, periode?.id, year).then((res: any) => {
            if (res.status == 'error validation') {
                showAlert('error', 'Data gagal disimpan, pastikan data yang diinputkan sudah benar');
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
        deletePenilaianAset(id).then((res: any) => {
            if (res.status == 'success') {
                _getDatas();
                showAlert('success', 'Data berhasil dihapus');
            } else {
                showAlert('error', 'Data gagal dihapus');
            }
        });
    }

    const deleteSelectedData = () => {
        massDeleteData(selectedData, 'acc_padb_penilaian_aset').then((res: any) => {
            if (res.status == 'success') {
                _getDatas();
                setSelectedData([]);
                setSelectedMode(false);
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
                    item.instance_name?.toLowerCase().includes(e.toLowerCase()) ||
                    item.kelompok_barang_aset?.toLowerCase().includes(e.toLowerCase()) ||
                    item.nama_barang?.toLowerCase().includes(e.toLowerCase()) ||
                    item.metode_perolehan?.toLowerCase().includes(e.toLowerCase()) ||
                    item.nomor_berita_acara?.toLowerCase().includes(e.toLowerCase()) ||
                    item.tanggal_berita_acara?.toLowerCase().includes(e.toLowerCase()) ||
                    item.keterangan?.toLowerCase().includes(e.toLowerCase())
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
                        <tr className='!bg-slate-900 !text-white left-0 sticky top-0 z-[1]'>
                            <th className='border text-center whitespace-nowrap' rowSpan={2}>
                                Info
                            </th>
                            {([9].includes(CurrentUser?.role_id) == false) && (
                                <th rowSpan={2}
                                    className='border text-center whitespace-nowrap'>
                                    Nama Perangkat Daerah
                                </th>
                            )}

                            <th rowSpan={2}
                                className='border text-center whitespace-nowrap'>
                                Kelompok Barang / Aset
                            </th>
                            <th rowSpan={2}
                                className='border text-center whitespace-nowrap'>
                                Nama Barang
                            </th>
                            <th rowSpan={2}
                                className='border text-center whitespace-nowrap'>
                                Tahun Perolehan
                            </th>
                            <th rowSpan={2}
                                className='border text-center whitespace-nowrap'>
                                Metode Perolehan
                            </th>
                            <th rowSpan={2}
                                className='border text-center whitespace-nowrap'>
                                Nilai Awal Aset
                            </th>
                            <th rowSpan={2}
                                className='border text-center whitespace-nowrap'>
                                Hasil Penilaian
                            </th>
                            <th colSpan={2}
                                className='border text-center whitespace-nowrap'>
                                Berita Acara
                            </th>
                            <th rowSpan={2}
                                className='border text-center whitespace-nowrap'>
                                Keterangan
                            </th>

                            <th rowSpan={2} className='border !bg-white !px-2'></th>

                            <th colSpan={8}
                                className="border border-slate-900 text-center text-slate-900 !bg-yellow-300 whitespace-nowrap">
                                Kelompok Barang (+++)
                            </th>
                            <th rowSpan={2}
                                className="border border-slate-900 text-center text-slate-900 !bg-yellow-300 whitespace-nowrap">
                                Jumlah Penyesuaian
                            </th>
                        </tr>
                        <tr className='!bg-slate-900 !text-white left-0 sticky top-[45px] z-[1]'>
                            <th className='border text-center whitespace-nowrap'>
                                Nomor BA
                            </th>
                            <th className='border text-center whitespace-nowrap'>
                                Tanggal BA
                            </th>

                            <th className='bg-yellow-300 border border-slate-900 text-center text-slate-900 whitespace-nowrap'>
                                Persediaan
                            </th>
                            <th className='bg-yellow-300 border border-slate-900 text-center text-slate-900 whitespace-nowrap'>
                                Aset Tetap Tanah
                            </th>
                            <th className='bg-yellow-300 border border-slate-900 text-center text-slate-900 whitespace-nowrap'>
                                Aset Tetap Peralatan dan Mesin
                            </th>
                            <th className='bg-yellow-300 border border-slate-900 text-center text-slate-900 whitespace-nowrap'>
                                Aset Tetap Gedung dan Bangunan
                            </th>
                            <th className='bg-yellow-300 border border-slate-900 text-center text-slate-900 whitespace-nowrap'>
                                Aset Tetap Jalan, Jaringan dan Irigasi
                            </th>
                            <th className='bg-yellow-300 border border-slate-900 text-center text-slate-900 whitespace-nowrap'>
                                Aset Tetap Lainnya
                            </th>
                            <th className='bg-yellow-300 border border-slate-900 text-center text-slate-900 whitespace-nowrap'>
                                Konstruksi Dalam Pekerjaan
                            </th>
                            <th className='bg-yellow-300 border border-slate-900 text-center text-slate-900 whitespace-nowrap'>
                                Aset Lainnya
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataInput.map((data: any, index: number) => (
                            <>
                                {(index >= (page - 1) * perPage && index < (page * perPage)) && (
                                    <tr key={index} className='text-center'>
                                        <td>
                                            <div className="flex justify-center gap-2 items-center">
                                                <Tippy content={`Dibuat Oleh : ${data.created_by ?? ''} | Diperbarui Oleh : ${data.updated_by ?? ''}`}
                                                    theme='info'
                                                    placement='top-start'>
                                                    <button className='text-info select-none'>
                                                        <FontAwesomeIcon icon={faUser} className='h-3.5 w-3.5' />
                                                    </button>
                                                </Tippy>

                                                {data?.id && (
                                                    <div className="flex gap-2">
                                                        {selectedMode ? (
                                                            <label className="w-12 h-6 relative">
                                                                <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox1"
                                                                    disabled={isSaving == true}
                                                                    checked={selectedData.includes(data.id)}
                                                                    onChange={(e: any) => {
                                                                        if (e.target.checked) {
                                                                            setSelectedData((prev: any) => [...prev, data.id])
                                                                        } else {
                                                                            setSelectedData((prev: any) => prev.filter((item: any) => item != data.id))
                                                                        }
                                                                    }}
                                                                />
                                                                <span className="outline_checkbox bg-icon border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full before:bg-[url(/assets/images/close.svg)] before:bg-no-repeat before:bg-center peer-checked:before:left-7 peer-checked:before:bg-[url(/assets/images/checked.svg)] peer-checked:border-primary peer-checked:before:bg-primary before:transition-all before:duration-300"></span>
                                                            </label>
                                                        ) : (
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
                                                                    className="btn btn-danger h-8 p-0 rounded-full w-8">
                                                                    <IconTrash className='h-4 w-4' />
                                                                </button>
                                                            </Tippy>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        {([9].includes(CurrentUser?.role_id) == false) && (
                                            <td className='border'>
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
                                            </td>
                                        )}
                                        <td className='border'>
                                            <input type="text"
                                                placeholder='Kelompok Barang / Aset'
                                                autoComplete='off'
                                                value={data.kelompok_barang_aset}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setDataInput((prevData: any) => {
                                                        const updated = [...prevData];
                                                        updated[index].kelompok_barang_aset = value;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }}
                                                className='form-input w-[250px] font-normal' />
                                        </td>
                                        <td className='border'>
                                            <input type="text"
                                                placeholder='Nama Barang'
                                                autoComplete='off'
                                                value={data.nama_barang}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setDataInput((prevData: any) => {
                                                        const updated = [...prevData];
                                                        updated[index].nama_barang = value;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }}
                                                className='form-input w-[250px] font-normal' />
                                        </td>
                                        <td className='border'>
                                            <input type="text"
                                                placeholder='Tahun Perolehan'
                                                autoComplete='off'
                                                value={data.tahun_perolehan}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setDataInput((prevData: any) => {
                                                        const updated = [...prevData];
                                                        updated[index].tahun_perolehan = value;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }}
                                                className='form-input w-[250px] font-normal' />
                                        </td>
                                        <td className='border'>
                                            <input type="text"
                                                placeholder='Metode Perolehan'
                                                autoComplete='off'
                                                value={data.metode_perolehan}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setDataInput((prevData: any) => {
                                                        const updated = [...prevData];
                                                        updated[index].metode_perolehan = value;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }}
                                                className='form-input w-[250px] font-normal' />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={data.nilai_awal_aset}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['nilai_awal_aset'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={data.hasil_penilaian}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['hasil_penilaian'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border'>
                                            <input type="text"
                                                placeholder='Nomor Berita Acara'
                                                autoComplete='off'
                                                value={data.nomor_berita_acara}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setDataInput((prevData: any) => {
                                                        const updated = [...prevData];
                                                        updated[index].nomor_berita_acara = value;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }}
                                                className='form-input w-[250px] font-normal' />
                                        </td>
                                        <td className='border'>
                                            <Flatpickr
                                                placeholder='Tanggal Berita Acara'
                                                options={{
                                                    dateFormat: 'Y-m-d',
                                                    position: 'auto right'
                                                }}
                                                className="form-input w-[200px]"
                                                value={data?.tanggal_berita_acara}
                                                onChange={(date) => {
                                                    let Ymd = new Date(date[0].toISOString());
                                                    Ymd.setDate(Ymd.getDate() + 1);
                                                    const newYmd = Ymd.toISOString().split('T')[0];
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['tanggal_berita_acara'] = newYmd;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }} />
                                        </td>
                                        <td className='border'>
                                            <input type="text"
                                                placeholder='Keterangan'
                                                autoComplete='off'
                                                value={data.keterangan}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setDataInput((prevData: any) => {
                                                        const updated = [...prevData];
                                                        updated[index].keterangan = value;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }}
                                                className='form-input w-[250px] font-normal' />
                                        </td>

                                        <td className='border text-center w-[1px] !bg-white !p-1 whitespace-nowrap'></td>

                                        <td className='border'>
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={data.persediaan}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['persediaan'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border'>
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={data.aset_tetap_tanah}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['aset_tetap_tanah'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border'>
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={data.aset_tetap_peralatan_mesin}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['aset_tetap_peralatan_mesin'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border'>
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={data.aset_tetap_gedung_bangunan}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['aset_tetap_gedung_bangunan'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border'>
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={data.aset_tetap_jalan_jaringan_irigasi}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['aset_tetap_jalan_jaringan_irigasi'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border'>
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={data.aset_tetap_lainnya}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['aset_tetap_lainnya'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border'>
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={data.konstruksi_dalam_pekerjaan}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['konstruksi_dalam_pekerjaan'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border'>
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={data.aset_lainnya}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['aset_lainnya'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>

                                        <td className='border'>
                                            <InputRupiah
                                                // isDisabled={isSaving == true}
                                                readOnly={true}
                                                dataValue={data.jumlah_penyesuaian}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['jumlah_penyesuaian'] = value;
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
                    </tbody>
                    <tfoot>
                        <tr>
                            <td></td>

                            <td colSpan={1} className='border p-3 text-center'>
                                Total
                            </td>
                            <td colSpan={([1, 2, 3, 4, 5, 10].includes(CurrentUser?.role_id)) ? 4 : 3} className='border p-3 text-center'>
                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.total_data)} Item
                            </td>
                            <td className='border p-3 text-end'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.nilai_awal_aset)}
                            </td>
                            <td className='border p-3 text-end'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.hasil_penilaian)}
                            </td>

                            <td colSpan={3}></td>
                            <td className='border text-center w-[1px] !bg-white !p-1 whitespace-nowrap'></td>

                            <td className='border p-3 text-end'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.persediaan)}
                            </td>
                            <td className='border p-3 text-end'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.aset_tetap_tanah)}
                            </td>
                            <td className='border p-3 text-end'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.aset_tetap_peralatan_mesin)}
                            </td>
                            <td className='border p-3 text-end'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.aset_tetap_gedung_bangunan)}
                            </td>
                            <td className='border p-3 text-end'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.aset_tetap_jalan_jaringan_irigasi)}
                            </td>
                            <td className='border p-3 text-end'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.aset_tetap_lainnya)}
                            </td>
                            <td className='border p-3 text-end'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.konstruksi_dalam_pekerjaan)}
                            </td>
                            <td className='border p-3 text-end'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.aset_lainnya)}
                            </td>
                            <td className='border p-3 text-end'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.jumlah_penyesuaian)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="flex flex-col lg:flex-row lg:justify-between gap-4 items-center mt-4 px-5">
                <div className="flex gap-2 items-center flex-wrap lg:flex-nowrap">
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
                    <div className="flex items-center gap-2">
                        <label className="flex-none flex items-center gap-2 cursor-pointer select-none mb-0">
                            <div className="w-12 h-6 relative">
                                <input
                                    type="checkbox"
                                    className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                    checked={selectedMode}
                                    onChange={(e: any) => {
                                        if (e?.target?.checked == false) {
                                            setSelectedData([]);
                                        }
                                        setSelectedMode(e?.target?.checked);
                                    }}
                                />
                                <span className="outline_checkbox border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:border-primary peer-checked:before:bg-primary before:transition-all before:duration-300"></span>
                            </div>
                            <div className="text-xs">
                                Hapus Mode {selectedData.length > 0 ? `(${selectedData.length}) Item` : ''}
                            </div>
                        </label>

                        {selectedData.length > 0 && (
                            <button type="button"
                                disabled={isSaving == true}
                                onClick={(e) => {
                                    if (isSaving == false) {
                                        deleteSelectedData()
                                    }
                                }}
                                className='btn btn-danger btn-sm text-xs w-full'>
                                <FontAwesomeIcon icon={faTrash} className='h-3 w-3 mr-1' />
                                Hapus
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-4 items-center">
                    {dataInput.length > 0 && (
                        <>
                            <DownloadButtons
                                data={dataInput}
                                endpoint='/accountancy/download/excel'
                                uploadEndpoint='/accountancy/upload/excel'
                                params={{
                                    type: 'penilaian_aset',
                                    category: 'padb',
                                    instance: instance,
                                    periode: periode?.id,
                                    year: year,
                                }}
                                afterClick={(e: any) => {
                                    if (e[0] === 'error') {
                                        Swal.fire({
                                            title: 'Gagal!',
                                            text: e[1] ? e[1] : 'Terjadi kesalahan saat proses berlangsung.',
                                            icon: 'error',
                                            showCancelButton: false,
                                            confirmButtonText: 'Tutup',
                                            confirmButtonColor: '#00ab55',
                                        });
                                        return;
                                    } else {
                                        Swal.fire({
                                            title: e[1] === 'Downloaded' ? 'Download Berhasil!' : 'Upload Berhasil!',
                                            text: e[1] === 'Downloaded' ? 'File berhasil diunduh.' : 'File berhasil diunggah.',
                                            icon: 'success',
                                            showCancelButton: false,
                                            confirmButtonText: 'Tutup',
                                            confirmButtonColor: '#00ab55',
                                        });
                                        if (e[1] == 'Uploaded') {
                                            _getDatas();
                                        }
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

export default PenilaianAset;
