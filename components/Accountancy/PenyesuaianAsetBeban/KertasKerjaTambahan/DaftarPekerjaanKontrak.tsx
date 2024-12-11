import Select from 'react-select';
import { faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
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

    return (
        <>
            <div className="table-responsive h-[calc(100vh-400px)] pb-5">
                <table className="table-striped">
                    <thead className='sticky top-0 left-0 z-[1]'>
                        <tr className='!bg-slate-900 !text-white'>
                            <th className='whitespace-nowrap border text-center w-[1px]' rowSpan={2}>
                                No
                            </th>
                            <th className='whitespace-nowrap border text-center' rowSpan={2}>
                                Info
                            </th>
                            <th className='whitespace-nowrap border text-center min-w-[300px]' rowSpan={2}>
                                Perangkat Daerah
                            </th>
                            <th className='whitespace-nowrap border text-center' colSpan={2}>
                                Belanja
                            </th>
                            <th className='whitespace-nowrap border text-center min-w-[200px]' rowSpan={2}>
                                Nama Kegiatan - Paket Pekerjaan
                            </th>
                            <th className='whitespace-nowrap border text-center min-w-[200px]' rowSpan={2}>
                                Pelaksana Pekerjaan
                            </th>
                            <th className='whitespace-nowrap border text-center min-w-[200px]' rowSpan={2}>
                                No Kontrak
                            </th>
                            <th className='whitespace-nowrap border text-center min-w-[200px]' rowSpan={2}>
                                Periode Kontrak
                            </th>
                            <th className='whitespace-nowrap border text-center min-w-[200px]' rowSpan={2}>
                                Nilai Belanja / Nilai Kontrak
                            </th>
                            <th className='whitespace-nowrap border text-center' colSpan={3}>
                                Pembayaran Ke-1
                            </th>
                            <th className='whitespace-nowrap border text-center' colSpan={3}>
                                Pembayaran Ke-2
                            </th>
                            <th className='whitespace-nowrap border text-center' colSpan={3}>
                                Pembayaran Ke-3
                            </th>
                            <th className='whitespace-nowrap border text-center' colSpan={3}>
                                Pembayaran Ke-4
                            </th>
                            <th className='border text-center min-w-[250px]' rowSpan={2}>
                                Jumlah Pembayaran s/d 31 Desember {year}
                            </th>
                            <th className='border text-center min-w-[250px]' rowSpan={2}>
                                Kewajiban Tidak Terbayar s/d 31 Desember {year}
                            </th>
                            <th className='border text-center min-w-[250px]' rowSpan={2}>
                                Tanggal Berita Acara Serah Terima Barang/ Pekerjaan
                            </th>
                            <th className='border text-center min-w-[250px]' rowSpan={2}>
                                Tanggal Surat Pengakuan Hutang
                            </th>
                        </tr>
                        <tr className='!bg-slate-900 !text-white'>
                            <th className='whitespace-nowrap border text-center min-w-[300px]'>
                                Kode Rekening
                            </th>
                            <th className='whitespace-nowrap border text-center min-w-[300px]'>
                                Nama Rekening
                            </th>
                            <th className='whitespace-nowrap border text-center min-w-[150px]'>
                                SP2D
                            </th>
                            <th className='whitespace-nowrap border text-center min-w-[150px]'>
                                Tanggal
                            </th>
                            <th className='whitespace-nowrap border text-center min-w-[150px]'>
                                Jumlah
                            </th>

                            <th className='whitespace-nowrap border text-center min-w-[150px]'>
                                SP2D
                            </th>
                            <th className='whitespace-nowrap border text-center min-w-[150px]'>
                                Tanggal
                            </th>
                            <th className='whitespace-nowrap border text-center min-w-[150px]'>
                                Jumlah
                            </th>

                            <th className='whitespace-nowrap border text-center min-w-[150px]'>
                                SP2D
                            </th>
                            <th className='whitespace-nowrap border text-center min-w-[150px]'>
                                Tanggal
                            </th>
                            <th className='whitespace-nowrap border text-center min-w-[150px]'>
                                Jumlah
                            </th>

                            <th className='whitespace-nowrap border text-center min-w-[150px]'>
                                SP2D
                            </th>
                            <th className='whitespace-nowrap border text-center min-w-[150px]'>
                                Tanggal
                            </th>
                            <th className='whitespace-nowrap border text-center min-w-[150px]'>
                                Jumlah
                            </th>
                            {/* Pembayaran End */}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dataInput.map((data: any, index: number) => {
                                return (
                                    <tr key={index}>
                                        <td className='border text-center font-semibold'>
                                            {index + 1}
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
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
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
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
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
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
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
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
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
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.payment_4_jumlah)}
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
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.jumlah_pembayaran_sd_desember)}
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
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-normal text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.kewajiban_tidak_terbayar_sd_desember)}
                                                </div>
                                            </div>
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
                                        </td>

                                    </tr>
                                )
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={8} className='border p-4 text-end font-semibold'>
                                Total
                            </td>
                            <td className='border p-4 text-end font-semibold'>
                                {new Intl.NumberFormat('id-ID', {}).format(totalData.total_data)} Item
                            </td>
                            <td className='border p-4 font-semibold text-end'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.nilai_belanja_kontrak)}
                            </td>
                            <td className='border p-4 font-semibold text-end' colSpan={3}>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.payment_1_jumlah)}
                            </td>
                            <td className='border p-4 font-semibold text-end' colSpan={3}>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.payment_2_jumlah)}
                            </td>
                            <td className='border p-4 font-semibold text-end' colSpan={3}>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.payment_3_jumlah)}
                            </td>
                            <td className='border p-4 font-semibold text-end' colSpan={3}>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.payment_4_jumlah)}
                            </td>
                            <td className='border p-4 font-semibold text-end'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.jumlah_pembayaran_sd_desember)}
                            </td>
                            <td className='border p-4 font-semibold text-end'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.kewajiban_tidak_terbayar_sd_desember)}
                            </td>
                            <td colSpan={2} className='border p-4'></td>
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
                        Simpan Daftar Pekerjaan
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
export default DaftarPekerjaanKontrak;
