import Select from 'react-select';
import { faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
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
        if (paramData[4]) {
            setInstance(paramData[4]);
        }
    }, [isMounted, paramData]);

    const [dataInput, setDataInput] = useState<any>([]);
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [totalData, setTotalData] = useState<any>({
        total_data: 0,
        nilai_perolehan: 0,
        akumulasi_penyusutan: 0,

        plus_aset_tetap_tanah: 0,
        plus_aset_tetap_perlatan_mesin: 0,
        plus_aset_tetap_gedung_bangunan: 0,
        plus_aset_tetap_jalan_jaringan_irigasi: 0,
        plus_aset_tetap_lainnya: 0,
        plus_kdp: 0,
        plus_aset_lainnya: 0,

        min_aset_tetap_tanah: 0,
        min_aset_tetap_perlatan_mesin: 0,
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
                                plus_aset_tetap_perlatan_mesin: 0,
                                plus_aset_tetap_gedung_bangunan: 0,
                                plus_aset_tetap_jalan_jaringan_irigasi: 0,
                                plus_aset_tetap_lainnya: 0,
                                plus_kdp: 0,
                                plus_aset_lainnya: 0,

                                min_aset_tetap_tanah: 0,
                                min_aset_tetap_perlatan_mesin: 0,
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
                plus_aset_tetap_perlatan_mesin: 0,
                plus_aset_tetap_gedung_bangunan: 0,
                plus_aset_tetap_jalan_jaringan_irigasi: 0,
                plus_aset_tetap_lainnya: 0,
                plus_kdp: 0,
                plus_aset_lainnya: 0,

                min_aset_tetap_tanah: 0,
                min_aset_tetap_perlatan_mesin: 0,
                min_aset_tetap_gedung_bangunan: 0,
                min_aset_tetap_jalan_jaringan_irigasi: 0,
                min_aset_tetap_lainnya: 0,
                min_kdp: 0,
                min_aset_lainnya: 0,
            }
        ]);
        setIsUnsaved(true);
    }

    useEffect(() => {
        if (isMounted && dataInput.length > 0) {
            setTotalData((prev: any) => {
                const updated = { ...prev };
                updated.total_data = dataInput.length;
                updated.nilai_perolehan = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.nilai_perolehan), 0);
                updated.akumulasi_penyusutan = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.akumulasi_penyusutan), 0);

                updated.plus_aset_tetap_tanah = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_aset_tetap_tanah), 0);
                updated.plus_aset_tetap_perlatan_mesin = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_aset_tetap_perlatan_mesin), 0);
                updated.plus_aset_tetap_gedung_bangunan = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_aset_tetap_gedung_bangunan), 0);
                updated.plus_aset_tetap_jalan_jaringan_irigasi = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_aset_tetap_jalan_jaringan_irigasi), 0);
                updated.plus_aset_tetap_lainnya = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_aset_tetap_lainnya), 0);
                updated.plus_kdp = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_kdp), 0);
                updated.plus_aset_lainnya = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.plus_aset_lainnya), 0);

                updated.min_aset_tetap_tanah = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.min_aset_tetap_tanah), 0);
                updated.min_aset_tetap_perlatan_mesin = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.min_aset_tetap_perlatan_mesin), 0);
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

    return (
        <>
            <div className="table-responsive h-[calc(100vh-400px)] pb-5">
                <table className="table-striped">
                    <thead className='sticky top-0 left-0 z-[1]'>
                        <tr className='!bg-slate-900 !text-white'>
                            <th className='whitespace-nowrap border text-center' rowSpan={2}>
                                No
                            </th>
                            <th className='whitespace-nowrap border text-center' rowSpan={2}>
                                Info
                            </th>
                            <th className='whitespace-nowrap border text-center w-[300px]' rowSpan={2}>
                                Perangkat Daerah Lama
                            </th>
                            <th className='whitespace-nowrap border text-center w-[300px]' rowSpan={2}>
                                Perangkat Daerah Baru
                            </th>
                            <th className='whitespace-nowrap border text-center' rowSpan={2}>
                                Kelompok Aset
                            </th>
                            <th className='whitespace-nowrap border text-center' rowSpan={2}>
                                Nama dan Rincian Barang
                            </th>
                            <th className='whitespace-nowrap border text-center' rowSpan={2}>
                                Tahun Perolehan
                            </th>
                            <th className='whitespace-nowrap border text-center' rowSpan={2}>
                                Nilai Perolehan
                            </th>
                            <th className='whitespace-nowrap border text-center' rowSpan={2}>
                                Akumulasi Penyusutan
                            </th>
                            <th className='whitespace-nowrap border text-center' colSpan={2}>
                                Berita Acara Serah Terima
                            </th>

                            <th className='whitespace-nowrap border text-center !bg-white w-[1px] !p-1' rowSpan={2}>
                            </th>

                            <th className='whitespace-nowrap border border-slate-800 text-center bg-yellow-300 text-slate-800' colSpan={7}>
                                Kelompok Aset (+++)
                            </th>

                            <th className='whitespace-nowrap border text-center !bg-white w-[1px] !p-1' rowSpan={2}>
                            </th>

                            <th className='whitespace-nowrap border border-slate-800 text-center bg-green-300 text-slate-800' colSpan={7}>
                                Kelompok Aset (---)
                            </th>
                        </tr>
                        <tr className='!bg-slate-900 !text-white'>
                            <th className='whitespace-nowrap border text-center'>
                                No Bast
                            </th>
                            <th className='whitespace-nowrap border text-center'>
                                Tanggal Bast
                            </th>

                            <th className='whitespace-nowrap border border-slate-800 text-center bg-yellow-300 text-slate-800'>
                                Aset Tetap Tanah
                            </th>
                            <th className='whitespace-nowrap border border-slate-800 text-center bg-yellow-300 text-slate-800'>
                                Aset Tetap Peralatan dan Mesin
                            </th>
                            <th className='whitespace-nowrap border border-slate-800 text-center bg-yellow-300 text-slate-800'>
                                Aset Tetap Gedung dan Bangunan
                            </th>
                            <th className='whitespace-nowrap border border-slate-800 text-center bg-yellow-300 text-slate-800'>
                                Aset Tetap Jalan Jaringan Irigasi
                            </th>
                            <th className='whitespace-nowrap border border-slate-800 text-center bg-yellow-300 text-slate-800'>
                                Aset Tetap Lainnya
                            </th>
                            <th className='whitespace-nowrap border border-slate-800 text-center bg-yellow-300 text-slate-800'>
                                Konstruksi Dalam Pengerjaan
                            </th>
                            <th className='whitespace-nowrap border border-slate-800 text-center bg-yellow-300 text-slate-800'>
                                Aset Lainnya
                            </th>


                            <th className='whitespace-nowrap border border-slate-800 text-center bg-green-300 text-slate-800'>
                                Aset Tetap Tanah
                            </th>
                            <th className='whitespace-nowrap border border-slate-800 text-center bg-green-300 text-slate-800'>
                                Aset Tetap Peralatan dan Mesin
                            </th>
                            <th className='whitespace-nowrap border border-slate-800 text-center bg-green-300 text-slate-800'>
                                Aset Tetap Gedung dan Bangunan
                            </th>
                            <th className='whitespace-nowrap border border-slate-800 text-center bg-green-300 text-slate-800'>
                                Aset Tetap Jalan Jaringan Irigasi
                            </th>
                            <th className='whitespace-nowrap border border-slate-800 text-center bg-green-300 text-slate-800'>
                                Aset Tetap Lainnya
                            </th>
                            <th className='whitespace-nowrap border border-slate-800 text-center bg-green-300 text-slate-800'>
                                Konstruksi Dalam Pengerjaan
                            </th>
                            <th className='whitespace-nowrap border border-slate-800 text-center bg-green-300 text-slate-800'>
                                Aset Lainnya
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dataInput.length > 0 && dataInput.map((data: any, index: number) => {
                                return (
                                    <tr key={index}>
                                        <td className='whitespace-nowrap border text-center'>
                                            <div className="font-semibold">
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex justify-center items-center gap-2">
                                                <Tippy content={`Dibuat Oleh : ${data.created_by} | Diperbarui Oleh : ${data.updated_by}`} theme='info' placement='top-start'>
                                                    <button className='text-info select-none'>
                                                        <FontAwesomeIcon icon={faUser} className='w-3.5 h-3.5' />
                                                    </button>
                                                </Tippy>

                                                <Tippy content='Hapus Data' theme='danger'>
                                                    <button
                                                        className='text-danger select-none'
                                                        onClick={(e) => {
                                                            Swal.fire({
                                                                title: 'Hapus Data',
                                                                text: 'Apakah Anda yakin ingin menghapus data ini?',
                                                                icon: 'warning',
                                                                showCancelButton: true,
                                                                confirmButtonColor: '#d33',
                                                                cancelButtonColor: '#3085d6',
                                                                confirmButtonText: 'Ya',
                                                                cancelButtonText: 'Tidak',
                                                            }).then((result) => {
                                                                if (result.isConfirmed) {
                                                                    if (data.id) {
                                                                        _deleteData(data.id);
                                                                    } else {
                                                                        // showAlert('info', 'Data ini belum tersimpan');
                                                                        setDataInput((prev: any) => {
                                                                            const updated = [...prev];
                                                                            updated.splice(index, 1);
                                                                            return updated;
                                                                        });
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        <IconTrash className='w-5 h-5' />
                                                    </button>
                                                </Tippy>
                                            </div>
                                        </td>
                                        <td className='border'>
                                            <Select
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
                                                        if (item.id == data.from_instance_id) {
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
                                                    instances?.map((data: any, index: number) => {
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
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.nilai_perolehan)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
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

                                        <td className='whitespace-nowrap border text-center !bg-white w-[1px] !p-1'></td>

                                        <td className="border">
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
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.plus_aset_tetap_tanah)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    value={data.plus_aset_tetap_perlatan_mesin}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['plus_aset_tetap_perlatan_mesin'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.plus_aset_tetap_perlatan_mesin)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.plus_aset_tetap_gedung_bangunan)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.plus_aset_tetap_jalan_jaringan_irigasi)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.plus_aset_tetap_lainnya)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.plus_kdp)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.plus_aset_lainnya)}
                                                </div>
                                            </div>
                                        </td>

                                        <td className='whitespace-nowrap border text-center !bg-white w-[1px] !p-1'></td>

                                        <td className="border">
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
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.min_aset_tetap_tanah)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    value={data.min_aset_tetap_perlatan_mesin}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['min_aset_tetap_perlatan_mesin'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.min_aset_tetap_perlatan_mesin)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.min_aset_tetap_gedung_bangunan)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.min_aset_tetap_jalan_jaringan_irigasi)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.min_aset_tetap_lainnya)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.min_kdp)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border">
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
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.min_aset_lainnya)}
                                                </div>
                                            </div>
                                        </td>

                                    </tr>
                                )
                            })
                        }
                    </tbody>
                    <tfoot className='sticky -bottom-5 left-0 z-[1]'>
                        <tr className='!bg-slate-300 !text-slate-800'>
                            <td></td>
                            <td></td>
                            <td colSpan={1} className='!bg-slate-300 !text-slate-800 border p-3 text-center font-semibold sticky -bottom-5 left-0'>
                                Jumlah
                            </td>
                            <td className='!bg-slate-300 !text-slate-800 border p-3 text-center font-semibold'>
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
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.plus_aset_tetap_perlatan_mesin)}
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

                            <td colSpan={1}></td>

                            <td className='border p-3 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.min_aset_tetap_tanah)}
                            </td>
                            <td className='border p-3 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.min_aset_tetap_perlatan_mesin)}
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
                        Simpan Mutasi Aset
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
export default MutasiAset;