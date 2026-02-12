import Select from 'react-select';
import { faChevronLeft, faChevronRight, faPlus, faSave, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { deleteMutasiAset, getMutasiAset, storeMutasiAset } from '@/apis/Accountancy/PenyesuaianAsetDanBeban';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrash from '@/components/Icon/IconTrash';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { faUser } from '@fortawesome/free-regular-svg-icons';
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

const MutasiAset = (data: any) => {
    const paramData = data.data
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null)
    const [years, setYears] = useState<any>(null)
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

    useEffect(() => {
        if (isMounted) {
            setYears([]);
            if (periode?.id) {
                if (year >= periode?.start_year && year <= periode?.end_year) {
                    // for (let i = periode?.start_year; i <= periode?.end_year; i++) {
                    for (let i = 2004; i <= periode?.end_year; i++) {
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
        nilai_perolehan: 0,
        akumulasi_penyusutan: 0,

        plus_aset_tetap_tanah: 0,
        plus_aset_tetap_peralatan_mesin: 0,
        plus_aset_tetap_gedung_bangunan: 0,
        plus_aset_tetap_jalan_jaringan_irigasi: 0,
        plus_aset_tetap_lainnya: 0,
        plus_kdp: 0,
        plus_aset_lainnya: 0,

        min_aset_tetap_tanah: 0,
        min_aset_tetap_peralatan_mesin: 0,
        min_aset_tetap_gedung_bangunan: 0,
        min_aset_tetap_jalan_jaringan_irigasi: 0,
        min_aset_tetap_lainnya: 0,
        min_kdp: 0,
        min_aset_lainnya: 0,
    });

    const _getDatas = () => {
        if (periode?.id) {
            getMutasiAset(instance, periode?.id, year).then((res: any) => {
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

                                from_instance_id: '',
                                to_instance_id: '',
                                kelompok_aset: '',
                                nama_barang: '',
                                tahun_perolehan: year,
                                nilai_perolehan: 0,
                                akumulasi_penyusutan: 0,
                                bast_number: '',
                                bast_date: '',

                                plus_aset_tetap_tanah: 0,
                                plus_aset_tetap_peralatan_mesin: 0,
                                plus_aset_tetap_gedung_bangunan: 0,
                                plus_aset_tetap_jalan_jaringan_irigasi: 0,
                                plus_aset_tetap_lainnya: 0,
                                plus_kdp: 0,
                                plus_aset_lainnya: 0,

                                min_aset_tetap_tanah: 0,
                                min_aset_tetap_peralatan_mesin: 0,
                                min_aset_tetap_gedung_bangunan: 0,
                                min_aset_tetap_jalan_jaringan_irigasi: 0,
                                min_aset_tetap_lainnya: 0,
                                min_kdp: 0,
                                min_aset_lainnya: 0,
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
    }, [isMounted, instance, periode?.id, year]);

    const addDataInput = () => {
        setDataInput([
            ...dataInput,
            {
                id: '',
                instance_id: instance ?? '',

                from_instance_id: instance ?? '',
                to_instance_id: '',
                kelompok_aset: '',
                nama_barang: '',
                tahun_perolehan: year,
                nilai_perolehan: 0,
                akumulasi_penyusutan: 0,
                bast_number: '',
                bast_date: '',

                plus_aset_tetap_tanah: 0,
                plus_aset_tetap_peralatan_mesin: 0,
                plus_aset_tetap_gedung_bangunan: 0,
                plus_aset_tetap_jalan_jaringan_irigasi: 0,
                plus_aset_tetap_lainnya: 0,
                plus_kdp: 0,
                plus_aset_lainnya: 0,

                min_aset_tetap_tanah: 0,
                min_aset_tetap_peralatan_mesin: 0,
                min_aset_tetap_gedung_bangunan: 0,
                min_aset_tetap_jalan_jaringan_irigasi: 0,
                min_aset_tetap_lainnya: 0,
                min_kdp: 0,
                min_aset_lainnya: 0,
            }
        ]);
        setIsUnsaved(true);
        setMaxPage(Math.ceil((dataInput.length + 1) / perPage));
        setPage(Math.ceil((dataInput.length + 1) / perPage));
    }

    useEffect(() => {
        if (isMounted && dataInput.length > 0) {
            setTotalData((prev: any) => {
                const updated = { ...prev };
                updated.total_data = dataInput.length;
                updated.nilai_perolehan = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.nilai_perolehan), 0);
                updated.akumulasi_penyusutan = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.akumulasi_penyusutan), 0);

                updated.plus_aset_tetap_tanah = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_aset_tetap_tanah), 0);
                updated.plus_aset_tetap_peralatan_mesin = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_aset_tetap_peralatan_mesin), 0);
                updated.plus_aset_tetap_gedung_bangunan = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_aset_tetap_gedung_bangunan), 0);
                updated.plus_aset_tetap_jalan_jaringan_irigasi = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_aset_tetap_jalan_jaringan_irigasi), 0);
                updated.plus_aset_tetap_lainnya = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_aset_tetap_lainnya), 0);
                updated.plus_kdp = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_kdp), 0);
                updated.plus_aset_lainnya = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_aset_lainnya), 0);

                updated.min_aset_tetap_tanah = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.min_aset_tetap_tanah), 0);
                updated.min_aset_tetap_peralatan_mesin = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.min_aset_tetap_peralatan_mesin), 0);
                updated.min_aset_tetap_gedung_bangunan = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.min_aset_tetap_gedung_bangunan), 0);
                updated.min_aset_tetap_jalan_jaringan_irigasi = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.min_aset_tetap_jalan_jaringan_irigasi), 0);
                updated.min_aset_tetap_lainnya = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.min_aset_tetap_lainnya), 0);
                updated.min_kdp = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.min_kdp), 0);
                updated.min_aset_lainnya = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.min_aset_lainnya), 0);
                return updated;
            });
        }
    }, [isMounted, dataInput]);

    const save = () => {
        setIsSaving(true);
        storeMutasiAset(dataInput, periode?.id, year).then((res: any) => {
            if (res.status == 'success') {
                setIsUnsaved(false);
                showAlert('success', 'Data berhasil disimpan');
            } else {
                showAlert('error', 'Data gagal disimpan');
            }
            setIsSaving(false);
        });
    };

    const _deleteData = (id: number) => {
        deleteMutasiAset(id).then((res: any) => {
            if (res.status == 'success') {
                showAlert('success', 'Data berhasil dihapus');
                _getDatas();
            } else {
                showAlert('error', 'Data gagal dihapus');
            }
        });
    }

    const deleteSelectedData = () => {
        massDeleteData(selectedData, 'acc_padb_tambahan_mutasi_aset').then((res: any) => {
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
                    item.from_instance_name?.toLowerCase().includes(e.toLowerCase()) ||
                    item.bast_date?.toLowerCase().includes(e.toLowerCase()) ||
                    item.bast_number?.toLowerCase().includes(e.toLowerCase()) ||
                    item.kelompok_aset?.toLowerCase().includes(e.toLowerCase()) ||
                    item.nama_barang?.toLowerCase().includes(e.toLowerCase()) ||
                    item.to_instance_name?.toLowerCase().includes(e.toLowerCase())
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
                            <th className='border text-center whitespace-nowrap' rowSpan={2}>
                                No
                            </th>
                            <th className='border text-center whitespace-nowrap' rowSpan={2}>
                                Info
                            </th>
                            <th className='border text-center w-[300px] whitespace-nowrap' rowSpan={2}>
                                Perangkat Daerah Lama
                            </th>
                            <th className='border text-center w-[300px] whitespace-nowrap' rowSpan={2}>
                                Perangkat Daerah Baru
                            </th>
                            <th className='border text-center whitespace-nowrap' rowSpan={2}>
                                Kelompok Aset
                            </th>
                            <th className='border text-center whitespace-nowrap' rowSpan={2}>
                                Nama dan Rincian Barang
                            </th>
                            <th className='border text-center whitespace-nowrap' rowSpan={2}>
                                Tahun Perolehan
                            </th>
                            <th className='border text-center whitespace-nowrap' rowSpan={2}>
                                Nilai Perolehan
                            </th>
                            <th className='border text-center whitespace-nowrap' rowSpan={2}>
                                Akumulasi Penyusutan
                            </th>
                            <th className='border text-center whitespace-nowrap' colSpan={2}>
                                Berita Acara Serah Terima
                            </th>

                            <th className='border text-center w-[1px] !bg-white !p-1 whitespace-nowrap' rowSpan={2}>
                            </th>

                            <th className='bg-yellow-300 border border-slate-800 text-center text-slate-800 whitespace-nowrap' colSpan={7}>
                                Kelompok Aset (+++)
                            </th>

                            {/* <th className='border text-center w-[1px] !bg-white !p-1 whitespace-nowrap' rowSpan={2}>
                            </th>

                            <th className='bg-green-300 border border-slate-800 text-center text-slate-800 whitespace-nowrap' colSpan={7}>
                                Kelompok Aset (---)
                            </th> */}
                        </tr>
                        <tr className='!bg-slate-900 !text-white'>
                            <th className='border text-center whitespace-nowrap'>
                                No Bast
                            </th>
                            <th className='border text-center whitespace-nowrap'>
                                Tanggal Bast
                            </th>

                            <th className='bg-yellow-300 border border-slate-800 text-center text-slate-800 whitespace-nowrap'>
                                Aset Tetap Tanah
                            </th>
                            <th className='bg-yellow-300 border border-slate-800 text-center text-slate-800 whitespace-nowrap'>
                                Aset Tetap Peralatan dan Mesin
                            </th>
                            <th className='bg-yellow-300 border border-slate-800 text-center text-slate-800 whitespace-nowrap'>
                                Aset Tetap Gedung dan Bangunan
                            </th>
                            <th className='bg-yellow-300 border border-slate-800 text-center text-slate-800 whitespace-nowrap'>
                                Aset Tetap Jalan Jaringan Irigasi
                            </th>
                            <th className='bg-yellow-300 border border-slate-800 text-center text-slate-800 whitespace-nowrap'>
                                Aset Tetap Lainnya
                            </th>
                            <th className='bg-yellow-300 border border-slate-800 text-center text-slate-800 whitespace-nowrap'>
                                Konstruksi Dalam Pengerjaan
                            </th>
                            <th className='bg-yellow-300 border border-slate-800 text-center text-slate-800 whitespace-nowrap'>
                                Aset Lainnya
                            </th>


                            {/* <th className='bg-green-300 border border-slate-800 text-center text-slate-800 whitespace-nowrap'>
                                Aset Tetap Tanah
                            </th>
                            <th className='bg-green-300 border border-slate-800 text-center text-slate-800 whitespace-nowrap'>
                                Aset Tetap Peralatan dan Mesin
                            </th>
                            <th className='bg-green-300 border border-slate-800 text-center text-slate-800 whitespace-nowrap'>
                                Aset Tetap Gedung dan Bangunan
                            </th>
                            <th className='bg-green-300 border border-slate-800 text-center text-slate-800 whitespace-nowrap'>
                                Aset Tetap Jalan Jaringan Irigasi
                            </th>
                            <th className='bg-green-300 border border-slate-800 text-center text-slate-800 whitespace-nowrap'>
                                Aset Tetap Lainnya
                            </th>
                            <th className='bg-green-300 border border-slate-800 text-center text-slate-800 whitespace-nowrap'>
                                Konstruksi Dalam Pengerjaan
                            </th>
                            <th className='bg-green-300 border border-slate-800 text-center text-slate-800 whitespace-nowrap'>
                                Aset Lainnya
                            </th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {dataInput.length > 0 && dataInput.map((data: any, index: number) => (
                            <>
                                {(index >= (page - 1) * perPage && index < (page * perPage)) && (
                                    <tr key={index}>
                                        <td className='border text-center whitespace-nowrap'>
                                            <div className="font-semibold">
                                                {index + 1}
                                            </div>
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
                                                className='w-[300px]'
                                                options={
                                                    instances?.filter((data: any) => data.id != dataInput[index]?.to_instance_id).map((data: any, index: number) => {
                                                        return {
                                                            value: data.id,
                                                            label: data.name,
                                                        }
                                                    })
                                                }
                                                value={
                                                    instances?.map((item: any, index: number) => {
                                                        if (item.id == data.from_instance_id) {
                                                            return {
                                                                value: item.id,
                                                                label: item.name,
                                                            }
                                                        }
                                                    })
                                                }
                                                isDisabled={CurrentUser?.role_id == 9}
                                                classNamePrefix={'selectAngga'}
                                                placeholder='Pilih Perangkat Daerah Lama'
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['from_instance_id'] = e?.value;
                                                        return updated;
                                                    })
                                                }}
                                            />
                                        </td>
                                        <td className='border'>
                                            <Select
                                                className='w-[300px]'
                                                options={
                                                    instances?.filter((data: any) => data.id != dataInput[index]?.from_instance_id).map((data: any, index: number) => {
                                                        return {
                                                            value: data.id,
                                                            label: data.name,
                                                        }
                                                    })
                                                }
                                                value={
                                                    instances?.map((item: any, index: number) => {
                                                        if (item.id == data.to_instance_id) {
                                                            return {
                                                                value: item.id,
                                                                label: item.name,
                                                            }
                                                        }
                                                    })
                                                }
                                                classNamePrefix={'selectAngga'}
                                                placeholder='Pilih Perangkat Daerah Baru'
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['to_instance_id'] = e?.value;
                                                        return updated;
                                                    })
                                                }}
                                            />
                                        </td>
                                        <td className='border'>
                                            <input
                                                type="text"
                                                placeholder="Kelompok Aset"
                                                className="form-input w-[300px]"
                                                value={data.kelompok_aset}
                                                onChange={(e) => {
                                                    let temp = [...dataInput];
                                                    temp[index].kelompok_aset = e.target.value;
                                                    setDataInput(temp);
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border'>
                                            <input
                                                type="text"
                                                placeholder="Nama dan Rincian Barang"
                                                className="form-input w-[300px]"
                                                value={data.nama_barang}
                                                onChange={(e) => {
                                                    let temp = [...dataInput];
                                                    temp[index].nama_barang = e.target.value;
                                                    setDataInput(temp);
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border'>
                                            <Select
                                                className="w-[200px]"
                                                options={years}
                                                value={years?.map((item: any, index: number) => {
                                                    if (item.value == data.tahun_perolehan) {
                                                        return {
                                                            value: item.value,
                                                            label: item.value,
                                                        }
                                                    }
                                                })}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['tahun_perolehan'] = e?.value;
                                                        return updated;
                                                    })
                                                }}
                                                isSearchable={false}
                                                isClearable={false}
                                                classNamePrefix={'selectAngga'}
                                                isDisabled={years?.length === 0}
                                            />
                                        </td>
                                        <td className="border">
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
                                                    value={data.nilai_perolehan}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['nilai_perolehan'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input text-end w-[250px] font-normal group-focus-within:block group-hover:block hidden ltr:rounded-l-none rtl:rounded-r-none" />
                                                <div className="form-input text-end w-[250px] block font-normal group-focus-within:hidden group-hover:hidden ltr:rounded-l-none rtl:rounded-r-none">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.nilai_perolehan)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    value={data.akumulasi_penyusutan}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['akumulasi_penyusutan'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input text-end w-[250px] font-normal group-focus-within:block group-hover:block hidden ltr:rounded-l-none rtl:rounded-r-none" />
                                                <div className="form-input text-end w-[250px] block font-normal group-focus-within:hidden group-hover:hidden ltr:rounded-l-none rtl:rounded-r-none">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.akumulasi_penyusutan)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='border'>
                                            <input
                                                type="text"
                                                placeholder="Nomor Bast"
                                                className="form-input w-[300px]"
                                                value={data.bast_number}
                                                onChange={(e) => {
                                                    let temp = [...dataInput];
                                                    temp[index].bast_number = e.target.value;
                                                    setDataInput(temp);
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className="border">
                                            <Flatpickr
                                                placeholder='Tanggal Bast'
                                                options={{
                                                    dateFormat: 'Y-m-d',
                                                    position: 'auto right'
                                                }}
                                                className="form-input w-[300px]"
                                                value={data?.bast_date}
                                                onChange={(date) => {
                                                    let Ymd = new Date(date[0].toISOString());
                                                    Ymd.setDate(Ymd.getDate() + 1);
                                                    const newYmd = Ymd.toISOString().split('T')[0];
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['bast_date'] = newYmd;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }} />
                                        </td>

                                        <td className='border text-center w-[1px] !bg-white !p-1 whitespace-nowrap'></td>

                                        <td className="border">
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
                                                    value={data.plus_aset_tetap_tanah}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['plus_aset_tetap_tanah'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input text-end w-[250px] font-normal group-focus-within:block group-hover:block hidden ltr:rounded-l-none rtl:rounded-r-none" />
                                                <div className="form-input text-end w-[250px] block font-normal group-focus-within:hidden group-hover:hidden ltr:rounded-l-none rtl:rounded-r-none">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.plus_aset_tetap_tanah)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    value={data.plus_aset_tetap_peralatan_mesin}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['plus_aset_tetap_peralatan_mesin'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input text-end w-[250px] font-normal group-focus-within:block group-hover:block hidden ltr:rounded-l-none rtl:rounded-r-none" />
                                                <div className="form-input text-end w-[250px] block font-normal group-focus-within:hidden group-hover:hidden ltr:rounded-l-none rtl:rounded-r-none">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.plus_aset_tetap_peralatan_mesin)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    value={data.plus_aset_tetap_gedung_bangunan}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['plus_aset_tetap_gedung_bangunan'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input text-end w-[250px] font-normal group-focus-within:block group-hover:block hidden ltr:rounded-l-none rtl:rounded-r-none" />
                                                <div className="form-input text-end w-[250px] block font-normal group-focus-within:hidden group-hover:hidden ltr:rounded-l-none rtl:rounded-r-none">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.plus_aset_tetap_gedung_bangunan)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    value={data.plus_aset_tetap_jalan_jaringan_irigasi}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['plus_aset_tetap_jalan_jaringan_irigasi'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input text-end w-[250px] font-normal group-focus-within:block group-hover:block hidden ltr:rounded-l-none rtl:rounded-r-none" />
                                                <div className="form-input text-end w-[250px] block font-normal group-focus-within:hidden group-hover:hidden ltr:rounded-l-none rtl:rounded-r-none">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.plus_aset_tetap_jalan_jaringan_irigasi)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    value={data.plus_aset_tetap_lainnya}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['plus_aset_tetap_lainnya'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input text-end w-[250px] font-normal group-focus-within:block group-hover:block hidden ltr:rounded-l-none rtl:rounded-r-none" />
                                                <div className="form-input text-end w-[250px] block font-normal group-focus-within:hidden group-hover:hidden ltr:rounded-l-none rtl:rounded-r-none">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.plus_aset_tetap_lainnya)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    value={data.plus_kdp}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['plus_kdp'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input text-end w-[250px] font-normal group-focus-within:block group-hover:block hidden ltr:rounded-l-none rtl:rounded-r-none" />
                                                <div className="form-input text-end w-[250px] block font-normal group-focus-within:hidden group-hover:hidden ltr:rounded-l-none rtl:rounded-r-none">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.plus_kdp)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    value={data.plus_aset_lainnya}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['plus_aset_lainnya'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input text-end w-[250px] font-normal group-focus-within:block group-hover:block hidden ltr:rounded-l-none rtl:rounded-r-none" />
                                                <div className="form-input text-end w-[250px] block font-normal group-focus-within:hidden group-hover:hidden ltr:rounded-l-none rtl:rounded-r-none">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.plus_aset_lainnya)}
                                                </div>
                                            </div>
                                        </td>

                                        {/* <td className='border text-center w-[1px] !bg-white !p-1 whitespace-nowrap'></td>

                                        <td className="border">
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
                                                    value={data.min_aset_tetap_tanah}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['min_aset_tetap_tanah'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input text-end w-[250px] font-normal group-focus-within:block group-hover:block hidden ltr:rounded-l-none rtl:rounded-r-none" />
                                                <div className="form-input text-end w-[250px] block font-normal group-focus-within:hidden group-hover:hidden ltr:rounded-l-none rtl:rounded-r-none">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.min_aset_tetap_tanah)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    value={data.min_aset_tetap_peralatan_mesin}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['min_aset_tetap_peralatan_mesin'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input text-end w-[250px] font-normal group-focus-within:block group-hover:block hidden ltr:rounded-l-none rtl:rounded-r-none" />
                                                <div className="form-input text-end w-[250px] block font-normal group-focus-within:hidden group-hover:hidden ltr:rounded-l-none rtl:rounded-r-none">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.min_aset_tetap_peralatan_mesin)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    value={data.min_aset_tetap_gedung_bangunan}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['min_aset_tetap_gedung_bangunan'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input text-end w-[250px] font-normal group-focus-within:block group-hover:block hidden ltr:rounded-l-none rtl:rounded-r-none" />
                                                <div className="form-input text-end w-[250px] block font-normal group-focus-within:hidden group-hover:hidden ltr:rounded-l-none rtl:rounded-r-none">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.min_aset_tetap_gedung_bangunan)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    value={data.min_aset_tetap_jalan_jaringan_irigasi}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['min_aset_tetap_jalan_jaringan_irigasi'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input text-end w-[250px] font-normal group-focus-within:block group-hover:block hidden ltr:rounded-l-none rtl:rounded-r-none" />
                                                <div className="form-input text-end w-[250px] block font-normal group-focus-within:hidden group-hover:hidden ltr:rounded-l-none rtl:rounded-r-none">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.min_aset_tetap_jalan_jaringan_irigasi)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    value={data.min_aset_tetap_lainnya}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['min_aset_tetap_lainnya'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input text-end w-[250px] font-normal group-focus-within:block group-hover:block hidden ltr:rounded-l-none rtl:rounded-r-none" />
                                                <div className="form-input text-end w-[250px] block font-normal group-focus-within:hidden group-hover:hidden ltr:rounded-l-none rtl:rounded-r-none">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.min_aset_tetap_lainnya)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    value={data.min_kdp}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['min_kdp'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input text-end w-[250px] font-normal group-focus-within:block group-hover:block hidden ltr:rounded-l-none rtl:rounded-r-none" />
                                                <div className="form-input text-end w-[250px] block font-normal group-focus-within:hidden group-hover:hidden ltr:rounded-l-none rtl:rounded-r-none">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.min_kdp)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    value={data.min_aset_lainnya}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['min_aset_lainnya'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input text-end w-[250px] font-normal group-focus-within:block group-hover:block hidden ltr:rounded-l-none rtl:rounded-r-none" />
                                                <div className="form-input text-end w-[250px] block font-normal group-focus-within:hidden group-hover:hidden ltr:rounded-l-none rtl:rounded-r-none">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.min_aset_lainnya)}
                                                </div>
                                            </div>
                                        </td> */}

                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                    <tfoot className='-bottom-5 left-0 sticky z-[1]'>
                        <tr className='!bg-slate-300 !text-slate-800'>
                            <td></td>
                            <td></td>
                            <td colSpan={1} className='border p-3 text-center -bottom-5 !bg-slate-300 !text-slate-800 font-semibold left-0 sticky'>
                                Jumlah
                            </td>
                            <td className='border p-3 text-center !bg-slate-300 !text-slate-800 font-semibold'>
                                {new Intl.NumberFormat('id-ID', {}).format(totalData.total_data)} Mutasi
                            </td>
                            <td colSpan={3}></td>
                            <td className='border p-3 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.nilai_perolehan)}
                            </td>
                            <td className='border p-3 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.akumulasi_penyusutan)}
                            </td>
                            <td colSpan={3}></td>

                            <td className='border p-3 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.plus_aset_tetap_tanah)}
                            </td>
                            <td className='border p-3 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.plus_aset_tetap_peralatan_mesin)}
                            </td>
                            <td className='border p-3 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.plus_aset_tetap_gedung_bangunan)}
                            </td>
                            <td className='border p-3 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.plus_aset_tetap_jalan_jaringan_irigasi)}
                            </td>
                            <td className='border p-3 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.plus_aset_tetap_lainnya)}
                            </td>
                            <td className='border p-3 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.plus_kdp)}
                            </td>
                            <td className='border p-3 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.plus_aset_lainnya)}
                            </td>

                            {/* <td colSpan={1}></td>

                            <td className='border p-3 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.min_aset_tetap_tanah)}
                            </td>
                            <td className='border p-3 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.min_aset_tetap_peralatan_mesin)}
                            </td>
                            <td className='border p-3 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.min_aset_tetap_gedung_bangunan)}
                            </td>
                            <td className='border p-3 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.min_aset_tetap_jalan_jaringan_irigasi)}
                            </td>
                            <td className='border p-3 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.min_aset_tetap_lainnya)}
                            </td>
                            <td className='border p-3 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.min_kdp)}
                            </td>
                            <td className='border p-3 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.min_aset_lainnya)}
                            </td> */}
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
                                    type: 'mutasi_aset',
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
export default MutasiAset;
