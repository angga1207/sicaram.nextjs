import Select from 'react-select';
import { faChevronLeft, faChevronRight, faPlus, faSave, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { deleteBarjasKeAset, deleteDaftarPekerjaan, getBarjasKeAset, getDaftarPekerjaan, storeBarjasKeAset, storeDaftarPekerjaan } from '@/apis/Accountancy/PenyesuaianAsetDanBeban';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import IconTrash from '@/components/Icon/IconTrash';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { forEach } from 'lodash';
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

const DaftarPekerjaanKontrak = (data: any) => {
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

    const [instance, setInstance] = useState<any>((router.query.instance ?? null) ?? CurrentUser?.instance_id);
    const [instances, setInstances] = useState<any>([]);
    const [arrKodeRekening, setArrKodeRekening] = useState<any>([])

    useEffect(() => {
        if (paramData[0]?.length > 0) {
            if (CurrentUser?.role_id == 9) {
                setInstances(paramData[0].filter((item: any) => item.id == CurrentUser?.instance_id));
            } else {
                setInstances(paramData[0]);
            }
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

    const [totalData, setTotalData] = useState<any>({
        total_data: 0,
        nilai_belanja_kontrak: 0,

        payment_1_jumlah: 0,
        payment_2_jumlah: 0,
        payment_3_jumlah: 0,
        payment_4_jumlah: 0,

        jumlah_pembayaran_sd_desember: 0,
        kewajiban_tidak_terbayar_sd_desember: 0,
    });

    const _getDatas = () => {
        if (periode?.id) {
            getDaftarPekerjaan(instance, periode?.id, year).then((res: any) => {
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
                                kode_rekening_name: '',
                                nama_kegiatan_paket: '',
                                pelaksana_pekerjaan: '',
                                no_kontrak: '',
                                periode_kontrak: '',
                                tanggal_kontrak: '',
                                nilai_belanja_kontrak: 0,

                                payment_1_sp2d: '',
                                payment_1_tanggal: '',
                                payment_1_jumlah: 0,

                                payment_2_sp2d: '',
                                payment_2_tanggal: '',
                                payment_2_jumlah: 0,

                                payment_3_sp2d: '',
                                payment_3_tanggal: '',
                                payment_3_jumlah: 0,

                                payment_4_sp2d: '',
                                payment_4_tanggal: '',
                                payment_4_jumlah: 0,

                                jumlah_pembayaran_sd_desember: 0,
                                kewajiban_tidak_terbayar_sd_desember: 0,
                                tanggal_berita_acara: '',
                                tanggal_surat_pengakuan_hutang: '',
                            }
                        ])
                    }
                }
            });
        }
    }

    useEffect(() => {
        setDataInput([])
        setTotalData({
            total_data: 0,
            nilai_belanja_kontrak: 0,

            payment_1_jumlah: 0,
            payment_2_jumlah: 0,
            payment_3_jumlah: 0,
            payment_4_jumlah: 0,

            jumlah_pembayaran_sd_desember: 0,
            kewajiban_tidak_terbayar_sd_desember: 0,
        });
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

    const addDataInput = () => {
        setDataInput([
            ...dataInput,
            {
                id: '',
                instance_id: instance ?? '',

                kode_rekening: '',
                nama_rekening: '',
                nama_kegiatan_paket: '',
                pelaksana_pekerjaan: '',
                no_kontrak: '',
                periode_kontrak: '',
                tanggal_kontrak: '',
                nilai_belanja_kontrak: 0,

                payment_1_sp2d: '',
                payment_1_tanggal: '',
                payment_1_jumlah: 0,

                payment_2_sp2d: '',
                payment_2_tanggal: '',
                payment_2_jumlah: 0,

                payment_3_sp2d: '',
                payment_3_tanggal: '',
                payment_3_jumlah: 0,

                payment_4_sp2d: '',
                payment_4_tanggal: '',
                payment_4_jumlah: 0,

                jumlah_pembayaran_sd_desember: 0,
                kewajiban_tidak_terbayar_sd_desember: 0,
                tanggal_berita_acara: '',
                tanggal_surat_pengakuan_hutang: '',
            }
        ]);
        setIsUnsaved(true);
        setMaxPage(Math.ceil((dataInput.length + 1) / perPage));
        setPage(Math.ceil((dataInput.length + 1) / perPage));
    }

    const updatedData = (data: any, index: number) => {
        setDataInput((prev: any) => {
            const updated = [...prev];
            // --------------------------- INI BELUM SUDAH YAA !!!!!!!!!!!!!!!!!!!!

            // const keysToSumPlus = ['plus_aset_tetap_tanah', 'plus_aset_tetap_peralatan_mesin', 'plus_aset_tetap_gedung_bangunan', 'plus_aset_tetap_jalan_jaringan_irigasi', 'plus_aset_tetap_lainnya', 'plus_konstruksi_dalam_pekerjaan', 'plus_aset_lain_lain'];
            // const sumPlus = keysToSumPlus.reduce((acc: any, key: any) => acc + parseFloat(updated[index][key] || 0), 0);
            // updated[index]['plus_jumlah_penyesuaian'] = sumPlus;
            // const keysToSumMinus = ['min_aset_tetap_tanah', 'min_aset_tetap_peralatan_mesin', 'min_aset_tetap_gedung_bangunan', 'min_aset_tetap_jalan_jaringan_irigasi', 'min_aset_tetap_lainnya', 'min_konstruksi_dalam_pekerjaan', 'min_aset_lain_lain'];
            // const sumMinus = keysToSumMinus.reduce((acc: any, key: any) => acc + parseFloat(updated[index][key] || 0), 0);
            // updated[index]['min_jumlah_penyesuaian'] = sumMinus;
            return updated;
        })
        setIsUnsaved(true);
    }

    useEffect(() => {
        if (isMounted && dataInput.length > 0) {
            setTotalData((prevState: any) => {
                const updated = { ...prevState };
                updated.total_data = dataInput.length;
                updated.nilai_belanja_kontrak = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.nilai_belanja_kontrak), 0);
                updated.payment_1_jumlah = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.payment_1_jumlah), 0);
                updated.payment_2_jumlah = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.payment_2_jumlah), 0);
                updated.payment_3_jumlah = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.payment_3_jumlah), 0);
                updated.payment_4_jumlah = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.payment_4_jumlah), 0);
                updated.jumlah_pembayaran_sd_desember = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.jumlah_pembayaran_sd_desember), 0);
                updated.kewajiban_tidak_terbayar_sd_desember = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.kewajiban_tidak_terbayar_sd_desember), 0);
                return updated;
            });
        }
    }, [isMounted, dataInput]);

    const save = () => {
        setIsSaving(true);
        storeDaftarPekerjaan(dataInput, periode?.id, year).then((res: any) => {
            if (res.status == 'error validation') {
                showAlert('error', 'Data gagal disimpan, pastikan semua data terisi');
            }
            else if (res.status == 'success') {
                setIsUnsaved(false);
                showAlert('success', 'Data berhasil disimpan');
            } else {
                showAlert('error', 'Data gagal disimpan');
            }
            setIsSaving(false);
        });
    };

    const _deleteData = (id: number) => {
        deleteDaftarPekerjaan(id).then((res: any) => {
            if (res.status == 'success') {
                showAlert('success', 'Data berhasil dihapus');
                _getDatas();
            } else {
                showAlert('error', 'Data gagal dihapus');
            }
        });
    }

    const selectAll = () => {
        if (selectedData.length < dataInput.filter((item: any) => item.id != '').length) {
            const allDataIds = dataInput.filter((item: any) => item.id != '').map((item: any) => item.id);
            setSelectedData(allDataIds);
        } else {
            setSelectedData([]);
        }
    }

    const deleteSelectedData = () => {
        massDeleteData(selectedData, 'acc_padb_tambahan_daftar_pekerjaan').then((res: any) => {
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
                    item.kode_rekening_name?.toLowerCase().includes(e.toLowerCase()) ||
                    item.nama_kegiatan_paket?.toLowerCase().includes(e.toLowerCase()) ||
                    item.no_kontrak?.toLowerCase().includes(e.toLowerCase()) ||
                    item.payment_1_sp2d?.toLowerCase().includes(e.toLowerCase()) ||
                    item.payment_2_sp2d?.toLowerCase().includes(e.toLowerCase()) ||
                    item.payment_3_sp2d?.toLowerCase().includes(e.toLowerCase()) ||
                    item.payment_4_sp2d?.toLowerCase().includes(e.toLowerCase()) ||
                    item.periode_kontrak?.toLowerCase().includes(e.toLowerCase()) ||
                    item.tanggal_berita_acara?.toLowerCase().includes(e.toLowerCase()) ||
                    item.tanggal_surat_pengakuan_hutang?.toLowerCase().includes(e.toLowerCase()) ||
                    item.pelaksana_pekerjaan?.toLowerCase().includes(e.toLowerCase())
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
                    <thead className='left-0 sticky top-0 z-[1]'>
                        <tr className='!bg-slate-900 !text-white'>
                            <th className='border text-center w-[1px] whitespace-nowrap' rowSpan={2}>
                                No
                            </th>
                            <th className='border text-center whitespace-nowrap' rowSpan={2}>
                                Info
                            </th>
                            <th className='border text-center min-w-[300px] whitespace-nowrap' rowSpan={2}>
                                Perangkat Daerah
                            </th>
                            <th className='border text-center whitespace-nowrap' colSpan={2}>
                                Belanja
                            </th>
                            <th className='border text-center min-w-[200px] whitespace-nowrap' rowSpan={2}>
                                Uraian Paket Pekerjaan
                            </th>
                            <th className='border text-center min-w-[200px] whitespace-nowrap' rowSpan={2}>
                                Pelaksana Pekerjaan
                            </th>
                            <th className='border text-center min-w-[200px] whitespace-nowrap' rowSpan={2}>
                                No Kontrak
                            </th>
                            <th className='border text-center min-w-[200px] whitespace-nowrap' rowSpan={2}>
                                Tanggal Kontrak
                            </th>
                            <th className='border text-center min-w-[200px] whitespace-nowrap' rowSpan={2}>
                                Periode Kontrak
                            </th>
                            <th className='border text-center min-w-[200px] whitespace-nowrap' rowSpan={2}>
                                Nilai Belanja / Nilai Kontrak
                            </th>
                            <th className='border text-center whitespace-nowrap' colSpan={3}>
                                Pembayaran Ke-1
                            </th>
                            <th className='border text-center whitespace-nowrap' colSpan={3}>
                                Pembayaran Ke-2
                            </th>
                            <th className='border text-center whitespace-nowrap' colSpan={3}>
                                Pembayaran Ke-3
                            </th>
                            <th className='border text-center whitespace-nowrap' colSpan={3}>
                                Pembayaran Ke-4
                            </th>
                            <th className='border text-center min-w-[250px]' rowSpan={2}>
                                Jumlah Pembayaran s/d 31 Desember {year}
                            </th>
                            <th className='border text-center min-w-[250px]' rowSpan={2}>
                                Kewajiban Tidak Terbayar s/d 31 Desember {year}
                            </th>
                            {/* <th className='border text-center min-w-[250px]' rowSpan={2}>
                                Tanggal Berita Acara Serah Terima Barang/ Pekerjaan
                            </th> */}
                            {/* <th className='border text-center min-w-[250px]' rowSpan={2}>
                                Tanggal Surat Pengakuan Hutang
                            </th> */}
                        </tr>
                        <tr className='!bg-slate-900 !text-white'>
                            <th className='border text-center min-w-[300px] whitespace-nowrap'>
                                Kode Rekening
                            </th>
                            <th className='border text-center min-w-[300px] whitespace-nowrap'>
                                Nama Rekening
                            </th>
                            <th className='border text-center min-w-[150px] whitespace-nowrap'>
                                SP2D
                            </th>
                            <th className='border text-center min-w-[150px] whitespace-nowrap'>
                                Tanggal
                            </th>
                            <th className='border text-center min-w-[150px] whitespace-nowrap'>
                                Jumlah
                            </th>

                            <th className='border text-center min-w-[150px] whitespace-nowrap'>
                                SP2D
                            </th>
                            <th className='border text-center min-w-[150px] whitespace-nowrap'>
                                Tanggal
                            </th>
                            <th className='border text-center min-w-[150px] whitespace-nowrap'>
                                Jumlah
                            </th>

                            <th className='border text-center min-w-[150px] whitespace-nowrap'>
                                SP2D
                            </th>
                            <th className='border text-center min-w-[150px] whitespace-nowrap'>
                                Tanggal
                            </th>
                            <th className='border text-center min-w-[150px] whitespace-nowrap'>
                                Jumlah
                            </th>

                            <th className='border text-center min-w-[150px] whitespace-nowrap'>
                                SP2D
                            </th>
                            <th className='border text-center min-w-[150px] whitespace-nowrap'>
                                Tanggal
                            </th>
                            <th className='border text-center min-w-[150px] whitespace-nowrap'>
                                Jumlah
                            </th>
                            {/* Pembayaran End */}
                        </tr>
                    </thead>
                    <tbody>
                        {dataInput.map((data: any, index: number) => (
                            <>
                                {(index >= (page - 1) * perPage && index < (page * perPage)) && (
                                    <tr key={index}>
                                        <td className='border text-center font-semibold'>
                                            {(index + 1)}
                                        </td>
                                        <td>
                                            <div className="flex justify-center gap-2 items-center">
                                                <Tippy content={`Dibuat Oleh : ${data.created_by} | Diperbarui Oleh : ${data.updated_by}`} theme='info' placement='top-start'>
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
                                                                                    _deleteData(data.id);
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
                                        <td className='border'>
                                            <Select
                                                id="input-instance"
                                                className='w-[300px]'
                                                options={
                                                    instances?.map((data: any, index: number) => {
                                                        return {
                                                            value: data.id,
                                                            label: data.name,
                                                        }
                                                    })
                                                }
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
                                                classNamePrefix={'selectAngga'}
                                                placeholder='Pilih Perangkat Daerah'
                                                isDisabled={isSaving == true || [9].includes(CurrentUser?.role_id)}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['instance_id'] = e?.value;
                                                        return updated;
                                                    })
                                                }}
                                            />
                                        </td>
                                        <td className='border'>
                                            <Select placeholder="Pilih Kode Rekening"
                                                className='w-[300px]'
                                                classNamePrefix={'selectAngga'}
                                                isDisabled={isSaving == true}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['kode_rekening_id'] = e?.value;
                                                        updated[index]['kode_rekening_name'] = e?.label;
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
                                        </td>
                                        <td className='border'>
                                            {data.kode_rekening_name}
                                        </td>
                                        <td className='border'>
                                            <input
                                                type="text"
                                                placeholder='Nama Kegiatan - Paket Pekerjaan'
                                                value={data.nama_kegiatan_paket}
                                                onChange={(e) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['nama_kegiatan_paket'] = e?.target?.value;
                                                        return updated;
                                                    })
                                                }}
                                                className='form-input'
                                            />
                                        </td>
                                        <td className='border'>
                                            <input
                                                type="text"
                                                placeholder='Pelaksana Pekerjaan'
                                                value={data.pelaksana_pekerjaan}
                                                onChange={(e) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['pelaksana_pekerjaan'] = e?.target?.value;
                                                        return updated;
                                                    })
                                                }}
                                                className='form-input'
                                            />
                                        </td>
                                        <td className='border'>
                                            <input
                                                type="text"
                                                placeholder='No Kontrak'
                                                value={data.no_kontrak}
                                                onChange={(e) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['no_kontrak'] = e?.target?.value;
                                                        return updated;
                                                    })
                                                }}
                                                className='form-input'
                                            />
                                        </td>
                                        <td className='border'>
                                            <Flatpickr
                                                placeholder='Tanggal Kontrak'
                                                options={{
                                                    dateFormat: 'Y-m-d',
                                                    position: 'auto right'
                                                }}
                                                className="form-input w-[200px]"
                                                value={data?.tanggal_kontrak}
                                                onChange={(date) => {
                                                    let Ymd = new Date(date[0].toISOString());
                                                    Ymd.setDate(Ymd.getDate() + 1);
                                                    const newYmd = Ymd.toISOString().split('T')[0];
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['tanggal_kontrak'] = newYmd;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }} />
                                        </td>
                                        <td className='border'>
                                            <input
                                                type="text"
                                                placeholder='Periode Kontrak'
                                                value={data.periode_kontrak}
                                                onChange={(e) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['periode_kontrak'] = e?.target?.value;
                                                        return updated;
                                                    })
                                                }}
                                                className='form-input'
                                            />
                                        </td>

                                        <td className='border'>
                                            <div className="flex group">
                                                <div className="flex bg-[#eee] border border-white-light justify-center dark:bg-[#1b2e4b] dark:border-[#17263c] font-semibold items-center ltr:border-r-0 ltr:rounded-l-md px-3 rtl:border-l-0 rtl:rounded-r-md">
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
                                                    value={data.nilai_belanja_kontrak}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['nilai_belanja_kontrak'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input text-end w-[250px] font-normal group-focus-within:block group-hover:block hidden ltr:rounded-l-none rtl:rounded-r-none" />
                                                <div className="form-input text-end w-[250px] block font-normal group-focus-within:hidden group-hover:hidden ltr:rounded-l-none rtl:rounded-r-none">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.nilai_belanja_kontrak)}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Payment 1 */}
                                        <td className='border'>
                                            <input
                                                type="text"
                                                placeholder='SP2D'
                                                value={data.payment_1_sp2d}
                                                onChange={(e) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['payment_1_sp2d'] = e?.target?.value;
                                                        return updated;
                                                    })
                                                }}
                                                className='form-input w-[200px]'
                                            />
                                        </td>
                                        <td className='border'>
                                            <Flatpickr
                                                placeholder='Tanggal Pembayaran'
                                                options={{
                                                    dateFormat: 'Y-m-d',
                                                    position: 'auto right'
                                                }}
                                                className="form-input w-[200px]"
                                                value={data?.payment_1_tanggal}
                                                onChange={(date) => {
                                                    let Ymd = new Date(date[0].toISOString());
                                                    Ymd.setDate(Ymd.getDate() + 1);
                                                    const newYmd = Ymd.toISOString().split('T')[0];
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['payment_1_tanggal'] = newYmd;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }} />
                                        </td>
                                        <td className='border'>
                                            <div className="flex group">
                                                <div className="flex bg-[#eee] border border-white-light justify-center dark:bg-[#1b2e4b] dark:border-[#17263c] font-semibold items-center ltr:border-r-0 ltr:rounded-l-md px-3 rtl:border-l-0 rtl:rounded-r-md">
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
                                                    value={data.payment_1_jumlah}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['payment_1_jumlah'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input text-end w-[250px] font-normal group-focus-within:block group-hover:block hidden ltr:rounded-l-none rtl:rounded-r-none" />
                                                <div className="form-input text-end w-[250px] block font-normal group-focus-within:hidden group-hover:hidden ltr:rounded-l-none rtl:rounded-r-none">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.payment_1_jumlah)}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Payment 2 */}
                                        <td className='border'>
                                            <input
                                                type="text"
                                                placeholder='SP2D'
                                                value={data.payment_2_sp2d}
                                                onChange={(e) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['payment_2_sp2d'] = e?.target?.value;
                                                        return updated;
                                                    })
                                                }}
                                                className='form-input w-[200px]'
                                            />
                                        </td>
                                        <td className='border'>
                                            <Flatpickr
                                                placeholder='Tanggal Pembayaran'
                                                options={{
                                                    dateFormat: 'Y-m-d',
                                                    position: 'auto right'
                                                }}
                                                className="form-input w-[200px]"
                                                value={data?.payment_2_tanggal}
                                                onChange={(date) => {
                                                    let Ymd = new Date(date[0].toISOString());
                                                    Ymd.setDate(Ymd.getDate() + 1);
                                                    const newYmd = Ymd.toISOString().split('T')[0];
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['payment_2_tanggal'] = newYmd;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }} />
                                        </td>
                                        <td className='border'>
                                            <div className="flex group">
                                                <div className="flex bg-[#eee] border border-white-light justify-center dark:bg-[#1b2e4b] dark:border-[#17263c] font-semibold items-center ltr:border-r-0 ltr:rounded-l-md px-3 rtl:border-l-0 rtl:rounded-r-md">
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
                                                    value={data.payment_2_jumlah}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['payment_2_jumlah'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input text-end w-[250px] font-normal group-focus-within:block group-hover:block hidden ltr:rounded-l-none rtl:rounded-r-none" />
                                                <div className="form-input text-end w-[250px] block font-normal group-focus-within:hidden group-hover:hidden ltr:rounded-l-none rtl:rounded-r-none">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.payment_2_jumlah)}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Payment 3 */}
                                        <td className='border'>
                                            <input
                                                type="text"
                                                placeholder='SP2D'
                                                value={data.payment_3_sp2d}
                                                onChange={(e) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['payment_3_sp2d'] = e?.target?.value;
                                                        return updated;
                                                    })
                                                }}
                                                className='form-input w-[200px]'
                                            />
                                        </td>
                                        <td className='border'>
                                            <Flatpickr
                                                placeholder='Tanggal Pembayaran'
                                                options={{
                                                    dateFormat: 'Y-m-d',
                                                    position: 'auto right'
                                                }}
                                                className="form-input w-[200px]"
                                                value={data?.payment_3_tanggal}
                                                onChange={(date) => {
                                                    let Ymd = new Date(date[0].toISOString());
                                                    Ymd.setDate(Ymd.getDate() + 1);
                                                    const newYmd = Ymd.toISOString().split('T')[0];
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['payment_3_tanggal'] = newYmd;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }} />
                                        </td>
                                        <td className='border'>
                                            <div className="flex group">
                                                <div className="flex bg-[#eee] border border-white-light justify-center dark:bg-[#1b2e4b] dark:border-[#17263c] font-semibold items-center ltr:border-r-0 ltr:rounded-l-md px-3 rtl:border-l-0 rtl:rounded-r-md">
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
                                                    value={data.payment_3_jumlah}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['payment_3_jumlah'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input text-end w-[250px] font-normal group-focus-within:block group-hover:block hidden ltr:rounded-l-none rtl:rounded-r-none" />
                                                <div className="form-input text-end w-[250px] block font-normal group-focus-within:hidden group-hover:hidden ltr:rounded-l-none rtl:rounded-r-none">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.payment_3_jumlah)}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Payment 4 */}
                                        <td className='border'>
                                            <input
                                                type="text"
                                                placeholder='SP2D'
                                                value={data.payment_4_sp2d}
                                                onChange={(e) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['payment_4_sp2d'] = e?.target?.value;
                                                        return updated;
                                                    })
                                                }}
                                                className='form-input w-[200px]'
                                            />
                                        </td>
                                        <td className='border'>
                                            <Flatpickr
                                                placeholder='Tanggal Pembayaran'
                                                options={{
                                                    dateFormat: 'Y-m-d',
                                                    position: 'auto right'
                                                }}
                                                className="form-input w-[200px]"
                                                value={data?.payment_4_tanggal}
                                                onChange={(date) => {
                                                    let Ymd = new Date(date[0].toISOString());
                                                    Ymd.setDate(Ymd.getDate() + 1);
                                                    const newYmd = Ymd.toISOString().split('T')[0];
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['payment_4_tanggal'] = newYmd;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }} />
                                        </td>
                                        <td className='border'>
                                            <div className="flex group">
                                                <div className="flex bg-[#eee] border border-white-light justify-center dark:bg-[#1b2e4b] dark:border-[#17263c] font-semibold items-center ltr:border-r-0 ltr:rounded-l-md px-3 rtl:border-l-0 rtl:rounded-r-md">
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
                                                    value={data.payment_4_jumlah}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['payment_4_jumlah'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input text-end w-[250px] font-normal group-focus-within:block group-hover:block hidden ltr:rounded-l-none rtl:rounded-r-none" />
                                                <div className="form-input text-end w-[250px] block font-normal group-focus-within:hidden group-hover:hidden ltr:rounded-l-none rtl:rounded-r-none">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.payment_4_jumlah)}
                                                </div>
                                            </div>
                                        </td>


                                        <td className='border'>
                                            <div className="flex group">
                                                <div className="flex bg-[#eee] border border-white-light justify-center dark:bg-[#1b2e4b] dark:border-[#17263c] font-semibold items-center ltr:border-r-0 ltr:rounded-l-md px-3 rtl:border-l-0 rtl:rounded-r-md">
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
                                                    value={data.jumlah_pembayaran_sd_desember}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['jumlah_pembayaran_sd_desember'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input text-end w-[250px] font-normal group-focus-within:block group-hover:block hidden ltr:rounded-l-none rtl:rounded-r-none" />
                                                <div className="form-input text-end w-[250px] block font-normal group-focus-within:hidden group-hover:hidden ltr:rounded-l-none rtl:rounded-r-none">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.jumlah_pembayaran_sd_desember)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='border'>
                                            <div className="flex group">
                                                <div className="flex bg-[#eee] border border-white-light justify-center dark:bg-[#1b2e4b] dark:border-[#17263c] font-semibold items-center ltr:border-r-0 ltr:rounded-l-md px-3 rtl:border-l-0 rtl:rounded-r-md">
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
                                                    value={data.kewajiban_tidak_terbayar_sd_desember}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['kewajiban_tidak_terbayar_sd_desember'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input text-end w-[250px] font-normal group-focus-within:block group-hover:block hidden ltr:rounded-l-none rtl:rounded-r-none" />
                                                <div className="form-input text-end w-[250px] block font-normal group-focus-within:hidden group-hover:hidden ltr:rounded-l-none rtl:rounded-r-none">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.kewajiban_tidak_terbayar_sd_desember)}
                                                </div>
                                            </div>
                                        </td>
                                        {/* <td className='border'>
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
                                        </td> */}
                                        {/* <td className='border'>
                                            <Flatpickr
                                                placeholder='Tanggal Surat Pengakuan Hutang'
                                                options={{
                                                    dateFormat: 'Y-m-d',
                                                    position: 'auto right'
                                                }}
                                                className="form-input w-[200px]"
                                                value={data?.tanggal_surat_pengakuan_hutang}
                                                onChange={(date) => {
                                                    let Ymd = new Date(date[0].toISOString());
                                                    Ymd.setDate(Ymd.getDate() + 1);
                                                    const newYmd = Ymd.toISOString().split('T')[0];
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['tanggal_surat_pengakuan_hutang'] = newYmd;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }} />
                                        </td> */}

                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={9} className='border p-4 text-end font-semibold'>
                                Total
                            </td>
                            <td className='border p-4 text-end font-semibold'>
                                {new Intl.NumberFormat('id-ID', {}).format(totalData.total_data)} Item
                            </td>
                            <td className='border p-4 text-end font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.nilai_belanja_kontrak)}
                            </td>
                            <td className='border p-4 text-end font-semibold' colSpan={3}>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.payment_1_jumlah)}
                            </td>
                            <td className='border p-4 text-end font-semibold' colSpan={3}>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.payment_2_jumlah)}
                            </td>
                            <td className='border p-4 text-end font-semibold' colSpan={3}>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.payment_3_jumlah)}
                            </td>
                            <td className='border p-4 text-end font-semibold' colSpan={3}>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.payment_4_jumlah)}
                            </td>
                            <td className='border p-4 text-end font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.jumlah_pembayaran_sd_desember)}
                            </td>
                            <td className='border p-4 text-end font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.kewajiban_tidak_terbayar_sd_desember)}
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

                        {selectedMode && (
                            <button type="button"
                                disabled={isSaving == true}
                                onClick={(e) => {
                                    if (isSaving == false) {
                                        selectAll()
                                    }
                                }}
                                className='btn btn-primary btn-sm text-xs w-full whitespace-nowrap'>
                                Pilih Semua
                            </button>
                        )}

                        {selectedData.length > 0 && (
                            <>
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
                            </>
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
                                    type: 'pekerjaan_kontrak',
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
export default DaftarPekerjaanKontrak;
