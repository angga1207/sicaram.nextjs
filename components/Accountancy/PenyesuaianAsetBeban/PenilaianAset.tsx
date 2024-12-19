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
import { deletePenilaianAset, getPenilaianAset, storePenilaianAset } from '@/apis/Accountancy/PenyesuaianAsetDanBeban';
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

const PenilaianAset = (data: any) => {
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
            getPenilaianAset(instance, periode?.id, year).then((res: any) => {
                if (res.status == 'success') {
                    if (res.data.length > 0) {
                        setDataInput(res.data);
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

    return (
        <>
            <div className="table-responsive h-[calc(100vh-400px)] pb-5">
                <table className="table-striped">
                    <thead>
                        <tr className='sticky top-0 left-0 z-[1] !bg-slate-900 !text-white'>
                            <th className='whitespace-nowrap border text-center' rowSpan={2}>
                                Info
                            </th>
                            {([9].includes(CurrentUser?.role_id) == false) && (
                                <th rowSpan={2}
                                    className='whitespace-nowrap border text-center'>
                                    Nama Perangkat Daerah
                                </th>
                            )}

                            <th rowSpan={2}
                                className='whitespace-nowrap border text-center'>
                                Kelompok Barang / Aset
                            </th>
                            <th rowSpan={2}
                                className='whitespace-nowrap border text-center'>
                                Nama Barang
                            </th>
                            <th rowSpan={2}
                                className='whitespace-nowrap border text-center'>
                                Tahun Perolehan
                            </th>
                            <th rowSpan={2}
                                className='whitespace-nowrap border text-center'>
                                Metode Perolehan
                            </th>
                            <th rowSpan={2}
                                className='whitespace-nowrap border text-center'>
                                Nilai Awal Aset
                            </th>
                            <th rowSpan={2}
                                className='whitespace-nowrap border text-center'>
                                Hasil Penilaian
                            </th>
                            <th colSpan={2}
                                className='whitespace-nowrap border text-center'>
                                Berita Acara
                            </th>
                            <th rowSpan={2}
                                className='whitespace-nowrap border text-center'>
                                Keterangan
                            </th>

                            <th rowSpan={2} className='!bg-white border !px-2'></th>

                            <th colSpan={8}
                                className="whitespace-nowrap border border-slate-900 text-center !bg-yellow-300 text-slate-900">
                                Kelompok Barang (+++)
                            </th>
                            <th rowSpan={2}
                                className="whitespace-nowrap border border-slate-900 text-center !bg-yellow-300 text-slate-900">
                                Jumlah Penyesuaian
                            </th>
                        </tr>
                        <tr className='sticky top-[45px] left-0 z-[1] !bg-slate-900 !text-white'>
                            <th className='text-center whitespace-nowrap border'>
                                Nomor BA
                            </th>
                            <th className='text-center whitespace-nowrap border'>
                                Tanggal BA
                            </th>

                            <th className='text-center whitespace-nowrap border border-slate-900 bg-yellow-300 text-slate-900'>
                                Persediaan
                            </th>
                            <th className='text-center whitespace-nowrap border border-slate-900 bg-yellow-300 text-slate-900'>
                                Aset Tetap Tanah
                            </th>
                            <th className='text-center whitespace-nowrap border border-slate-900 bg-yellow-300 text-slate-900'>
                                Aset Tetap Peralatan dan Mesin
                            </th>
                            <th className='text-center whitespace-nowrap border border-slate-900 bg-yellow-300 text-slate-900'>
                                Aset Tetap Gedung dan Bangunan
                            </th>
                            <th className='text-center whitespace-nowrap border border-slate-900 bg-yellow-300 text-slate-900'>
                                Aset Tetap Jalan, Jaringan dan Irigasi
                            </th>
                            <th className='text-center whitespace-nowrap border border-slate-900 bg-yellow-300 text-slate-900'>
                                Aset Tetap Lainnya
                            </th>
                            <th className='text-center whitespace-nowrap border border-slate-900 bg-yellow-300 text-slate-900'>
                                Konstruksi Dalam Pekerjaan
                            </th>
                            <th className='text-center whitespace-nowrap border border-slate-900 bg-yellow-300 text-slate-900'>
                                Aset Lainnya
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dataInput.map((data: any, index: number) => (
                                <tr key={index} className='text-center'>
                                    <td>
                                        <div className="flex justify-center items-center gap-2">
                                            <Tippy content={`Dibuat Oleh : ${data.created_by ?? ''} | Diperbarui Oleh : ${data.updated_by ?? ''}`}
                                                theme='info'
                                                placement='top-start'>
                                                <button className='text-info select-none'>
                                                    <FontAwesomeIcon icon={faUser} className='w-3.5 h-3.5' />
                                                </button>
                                            </Tippy>

                                            <Tippy content='Hapus Data'
                                                theme='danger'>
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
                                                                    deleteData(data.id);
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
                                                value={data.nilai_awal_aset}
                                                onChange={(e) => {
                                                    setDataInput((prev: any) => {
                                                        const value = parseFloat(e?.target?.value);
                                                        const data = [...prev];
                                                        data[index].nilai_awal_aset = isNaN(value) ? 0 : value;
                                                        return data;
                                                    });
                                                }}
                                                className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                            <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.nilai_awal_aset)}
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
                                                value={data.hasil_penilaian}
                                                onChange={(e) => {
                                                    setDataInput((prev: any) => {
                                                        const value = parseFloat(e?.target?.value);
                                                        const data = [...prev];
                                                        data[index].hasil_penilaian = isNaN(value) ? 0 : value;
                                                        return data;
                                                    });
                                                }}
                                                className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                            <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.hasil_penilaian)}
                                            </div>
                                        </div>
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

                                    <td className='whitespace-nowrap border text-center !bg-white w-[1px] !p-1'></td>

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
                                                value={data.persediaan}
                                                onChange={(e) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        const value = parseFloat(e?.target?.value);
                                                        updated[index]['persediaan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }}
                                                className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                            <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.persediaan)}
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
                                                value={data.aset_tetap_tanah}
                                                onChange={(e) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        const value = parseFloat(e?.target?.value);
                                                        updated[index]['aset_tetap_tanah'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }}
                                                className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                            <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.aset_tetap_tanah)}
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
                                                value={data.aset_tetap_peralatan_mesin}
                                                onChange={(e) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        const value = parseFloat(e?.target?.value);
                                                        updated[index]['aset_tetap_peralatan_mesin'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }}
                                                className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                            <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.aset_tetap_peralatan_mesin)}
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
                                                value={data.aset_tetap_gedung_bangunan}
                                                onChange={(e) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        const value = parseFloat(e?.target?.value);
                                                        updated[index]['aset_tetap_gedung_bangunan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }}
                                                className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                            <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.aset_tetap_gedung_bangunan)}
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
                                                value={data.aset_tetap_jalan_jaringan_irigasi}
                                                onChange={(e) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        const value = parseFloat(e?.target?.value);
                                                        updated[index]['aset_tetap_jalan_jaringan_irigasi'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }}
                                                className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                            <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.aset_tetap_jalan_jaringan_irigasi)}
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
                                                value={data.aset_tetap_lainnya}
                                                onChange={(e) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        const value = parseFloat(e?.target?.value);
                                                        updated[index]['aset_tetap_lainnya'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }}
                                                className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                            <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.aset_tetap_lainnya)}
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
                                                value={data.konstruksi_dalam_pekerjaan}
                                                onChange={(e) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        const value = parseFloat(e?.target?.value);
                                                        updated[index]['konstruksi_dalam_pekerjaan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }}
                                                className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                            <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.konstruksi_dalam_pekerjaan)}
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
                                                value={data.aset_lainnya}
                                                onChange={(e) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        const value = parseFloat(e?.target?.value);
                                                        updated[index]['aset_lainnya'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }}
                                                className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                            <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.aset_lainnya)}
                                            </div>
                                        </div>
                                    </td>

                                    <td className='border'>
                                        <div className="flex">
                                            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                Rp.
                                            </div>
                                            <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.jumlah_penyesuaian)}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td></td>

                            <td colSpan={1} className='border text-center p-3'>
                                Total
                            </td>
                            <td colSpan={4} className='border text-center p-3'>
                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.total_data)} Item
                            </td>
                            <td className='border text-end p-3'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.nilai_awal_aset)}
                            </td>
                            <td className='border text-end p-3'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.hasil_penilaian)}
                            </td>

                            <td colSpan={3}></td>
                            <td className='whitespace-nowrap border text-center !bg-white w-[1px] !p-1'></td>

                            <td className='border text-end p-3'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.persediaan)}
                            </td>
                            <td className='border text-end p-3'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.aset_tetap_tanah)}
                            </td>
                            <td className='border text-end p-3'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.aset_tetap_peralatan_mesin)}
                            </td>
                            <td className='border text-end p-3'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.aset_tetap_gedung_bangunan)}
                            </td>
                            <td className='border text-end p-3'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.aset_tetap_jalan_jaringan_irigasi)}
                            </td>
                            <td className='border text-end p-3'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.aset_tetap_lainnya)}
                            </td>
                            <td className='border text-end p-3'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.konstruksi_dalam_pekerjaan)}
                            </td>
                            <td className='border text-end p-3'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.aset_lainnya)}
                            </td>
                            <td className='border text-end p-3'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.jumlah_penyesuaian)}
                            </td>
                        </tr>
                    </tfoot>
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
                        Simpan Penilaian Aset
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

export default PenilaianAset;
