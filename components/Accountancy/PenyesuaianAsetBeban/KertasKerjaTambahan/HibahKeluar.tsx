import Select from 'react-select';
import { faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { deleteBarjasKeAset, deleteHibahKeluar, getBarjasKeAset, getHibahKeluar, storeBarjasKeAset, storeHibahKeluar } from '@/apis/Accountancy/PenyesuaianAsetDanBeban';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import IconTrash from '@/components/Icon/IconTrash';
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

const HibahKeluar = (data: any) => {
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
        nilai: 0,

        persediaan: 0,
        aset_tetap_tanah: 0,
        aset_tetap_peralatan_mesin: 0,
        aset_tetap_gedung_bangunan: 0,
        aset_tetap_jalan_jaringan_irigasi: 0,
        aset_tetap_lainnya: 0,
        konstruksi_dalam_pekerjaan: 0,
        aset_lainnya: 0,

    });

    const _getDatas = () => {
        if (periode?.id) {
            getHibahKeluar(instance, periode?.id, year).then((res: any) => {
                if (res.status == 'success') {
                    if (res.data.length > 0) {
                        setDataInput(res.data);
                    } else {
                        setDataInput([
                            {
                                id: '',
                                instance_id: instance ?? '',

                                penerima_hibah: '',
                                pemberi_hibah: '',
                                kode_rekening_id: '',
                                nama_barang: '',
                                nilai: 0,
                                nomor_berita_acara: '',
                                tanggal_berita_acara: '',
                                persediaan: 0,
                                aset_tetap_tanah: 0,
                                aset_tetap_peralatan_mesin: 0,
                                aset_tetap_gedung_bangunan: 0,
                                aset_tetap_jalan_jaringan_irigasi: 0,
                                aset_tetap_lainnya: 0,
                                konstruksi_dalam_pekerjaan: 0,
                                aset_lainnya: 0,
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

                penerima_hibah: '',
                pemberi_hibah: '',
                kode_rekening_id: '',
                nama_barang: '',
                nilai: 0,
                nomor_berita_acara: '',
                tanggal_berita_acara: '',
                persediaan: 0,
                aset_tetap_tanah: 0,
                aset_tetap_peralatan_mesin: 0,
                aset_tetap_gedung_bangunan: 0,
                aset_tetap_jalan_jaringan_irigasi: 0,
                aset_tetap_lainnya: 0,
                konstruksi_dalam_pekerjaan: 0,
                aset_lainnya: 0,
            }
        ]);
    }
    useEffect(() => {
        if (isMounted && dataInput.length > 0) {
            setTotalData((prevState: any) => {
                const updated = { ...prevState };
                updated.total_data = dataInput.length;
                updated.nilai = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.nilai), 0);
                updated.persediaan = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.persediaan), 0);
                updated.aset_tetap_tanah = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.aset_tetap_tanah), 0);
                updated.aset_tetap_peralatan_mesin = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.aset_tetap_peralatan_mesin), 0);
                updated.aset_tetap_gedung_bangunan = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.aset_tetap_gedung_bangunan), 0);
                updated.aset_tetap_jalan_jaringan_irigasi = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.aset_tetap_jalan_jaringan_irigasi), 0);
                updated.aset_tetap_lainnya = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.aset_tetap_lainnya), 0);
                updated.konstruksi_dalam_pekerjaan = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.konstruksi_dalam_pekerjaan), 0);
                updated.aset_lainnya = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.aset_lainnya), 0);
                return updated;
            });
        }
    }, [isMounted, dataInput]);

    const save = () => {
        setIsSaving(true);
        storeHibahKeluar(dataInput, periode?.id, year).then((res: any) => {
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
        deleteHibahKeluar(id).then((res: any) => {
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
                            {([9].includes(CurrentUser?.role_id) == false) && (
                                <th className='whitespace-nowrap border text-center' rowSpan={2}>
                                    Perangkat Daerah
                                </th>
                            )}
                            <th className='whitespace-nowrap border text-center' rowSpan={2}>
                                Penerima Hibah
                            </th>
                            <th className='whitespace-nowrap border text-center' rowSpan={2}>
                                Pemberi Hibah
                            </th>
                            <th className='whitespace-nowrap border text-center' rowSpan={2}>
                                Kode Rekening
                            </th>
                            <th className='whitespace-nowrap border text-center' rowSpan={2}>
                                Nama Barang
                            </th>
                            <th className='whitespace-nowrap border text-center' rowSpan={2}>
                                Nilai
                            </th>
                            <th className='whitespace-nowrap border text-center' colSpan={2}>
                                Berita Acara
                            </th>

                            <th className='whitespace-nowrap border text-center !bg-white w-[1px] !p-1' rowSpan={2}>
                            </th>

                            <th className='whitespace-nowrap border border-slate-800 text-center bg-green-300 text-slate-800' colSpan={8}>
                                Kelompok Barang / Aset Hibah Masuk (---)
                            </th>
                        </tr>
                        <tr className='!bg-slate-900 !text-white'>
                            <th className='whitespace-nowrap border text-center'>
                                No BA
                            </th>
                            <th className='whitespace-nowrap border text-center'>
                                Tanggal BA
                            </th>

                            <th className='whitespace-nowrap border border-slate-800 text-center bg-green-300 text-slate-800'>
                                Persediaan
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
                                Konstruksi Dalam Pekerjaan
                            </th>
                            <th className='whitespace-nowrap border border-slate-800 text-center bg-green-300 text-slate-800'>
                                Aset Lainnya
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dataInput.map((item: any, index: number) => {
                                return (
                                    <tr key={index} className='text-center'>
                                        <td className='border'>{index + 1}</td>
                                        <td>
                                            <div className="flex justify-center items-center gap-2">
                                                <Tippy content={`Dibuat Oleh : ${item.created_by ?? ''} | Diperbarui Oleh : ${item.updated_by ?? ''}`}
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
                                                                    if (item.id) {
                                                                        _deleteData(item.id);
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
                                                        instances?.map((data: any, index: number) => {
                                                            if (data.id == item.instance_id) {
                                                                return {
                                                                    value: data.id,
                                                                    label: data.name,
                                                                }
                                                            }
                                                        })
                                                    }
                                                    classNamePrefix={'selectAngga'}
                                                    placeholder='Pilih Perangkat Daerah'
                                                    onChange={(e: any) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['instance_id'] = e?.value;
                                                            return updated;
                                                        })
                                                    }}
                                                />
                                            </td>
                                        )}
                                        <td className='border'>
                                            <input type="text"
                                                placeholder='Penerima Hibah'
                                                value={item.penerima_hibah}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setDataInput((prevState: any) => {
                                                        const updated = [...prevState];
                                                        updated[index].penerima_hibah = value;
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                                className='form-input w-[200px]' />
                                        </td>
                                        <td className='border'>
                                            <input type="text"
                                                placeholder='Pemberi Hibah'
                                                value={item.pemberi_hibah}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setDataInput((prevState: any) => {
                                                        const updated = [...prevState];
                                                        updated[index].pemberi_hibah = value;
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                                className='form-input w-[200px]' />
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
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }}
                                                value={
                                                    arrKodeRekening?.map((data: any, index: number) => {
                                                        if (data.id == item.kode_rekening_id) {
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
                                            <input type="text"
                                                placeholder='Nama Barang'
                                                value={item.nama_barang}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setDataInput((prevState: any) => {
                                                        const updated = [...prevState];
                                                        updated[index].nama_barang = value;
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                                className='form-input w-[200px]' />
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
                                                    value={item.nilai}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['nilai'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(item.nilai)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='border'>
                                            <input type="text"
                                                placeholder='Nomor Berita Acara'
                                                value={item.nomor_berita_acara}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setDataInput((prevState: any) => {
                                                        const updated = [...prevState];
                                                        updated[index].nomor_berita_acara = value;
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                                className='form-input w-[200px]' />
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
                                                    value={item.persediaan}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['persediaan'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(item.persediaan)}
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
                                                    value={item.aset_tetap_tanah}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['aset_tetap_tanah'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(item.aset_tetap_tanah)}
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
                                                    value={item.aset_tetap_peralatan_mesin}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['aset_tetap_peralatan_mesin'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(item.aset_tetap_peralatan_mesin)}
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
                                                    value={item.aset_tetap_gedung_bangunan}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['aset_tetap_gedung_bangunan'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(item.aset_tetap_gedung_bangunan)}
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
                                                    value={item.aset_tetap_jalan_jaringan_irigasi}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['aset_tetap_jalan_jaringan_irigasi'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(item.aset_tetap_jalan_jaringan_irigasi)}
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
                                                    value={item.aset_tetap_lainnya}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['aset_tetap_lainnya'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(item.aset_tetap_lainnya)}
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
                                                    value={item.konstruksi_dalam_pekerjaan}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['konstruksi_dalam_pekerjaan'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(item.konstruksi_dalam_pekerjaan)}
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
                                                    value={item.aset_lainnya}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['aset_lainnya'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(item.aset_lainnya)}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={([9].includes(CurrentUser?.role_id) == false) ? 6 : 5} className='border text-end font-bold p-4'>Total</td>
                            <td className='border text-end font-semibold p-4'>
                                {totalData.total_data.toLocaleString('id-ID')} Data
                            </td>
                            <td className='border text-end font-semibold p-4'>
                                Rp. {totalData.nilai.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                            </td>
                            <td colSpan={3} className='border'></td>
                            <td className='border text-end font-semibold p-4'>
                                Rp. {totalData.persediaan.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                            </td>
                            <td className='border text-end font-semibold p-4'>
                                Rp. {totalData.aset_tetap_tanah.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                            </td>
                            <td className='border text-end font-semibold p-4'>
                                Rp. {totalData.aset_tetap_peralatan_mesin.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                            </td>
                            <td className='border text-end font-semibold p-4'>
                                Rp. {totalData.aset_tetap_gedung_bangunan.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                            </td>
                            <td className='border text-end font-semibold p-4'>
                                Rp. {totalData.aset_tetap_jalan_jaringan_irigasi.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                            </td>
                            <td className='border text-end font-semibold p-4'>
                                Rp. {totalData.aset_tetap_lainnya.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                            </td>
                            <td className='border text-end font-semibold p-4'>
                                Rp. {totalData.konstruksi_dalam_pekerjaan.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                            </td>
                            <td className='border text-end font-semibold p-4'>
                                Rp. {totalData.aset_lainnya.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
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
                        Simpan Hibah Keluar
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
export default HibahKeluar;