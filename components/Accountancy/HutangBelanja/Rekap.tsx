import Select from 'react-select';
import { faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import IconTrash from '@/components/Icon/IconTrash';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import InputRupiah from '@/components/InputRupiah';
import IconX from '@/components/Icon/IconX';
import { deleteData, getData, storeData } from '@/apis/Accountancy/HutangBelanja';
import LoadingSicaram from '@/components/LoadingSicaram';


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


const Rekap = (param: any) => {
    const paramData = param.data
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
        setPeriode(paramData[2]);
        setYear(paramData[3]);
        setYears(paramData[5]);
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

    useEffect(() => {
        if (isMounted && periode?.id && year && !instance) {
            if ([9].includes(CurrentUser?.role_id)) {
                setInstance(CurrentUser?.instance_id ?? '');
            } else {
                _getData();
            }
        }
        else if (isMounted && periode?.id && year && instance) {
            _getData();
        }
    }, [isMounted, instance, year])

    const _getData = () => {
        if (periode?.id) {
            getData(instance, periode?.id, year).then((res: any) => {
                if (res.status === 'success') {
                    if (res.data.length > 0) {
                        setDataInput(res.data);
                    } else {
                        setDataInput([
                            {
                                id: '',
                                instance_id: instance ?? '',

                                kode_rekening_id: '',
                                nama_kegiatan: '',
                                pelaksana_pekerjaan: '',
                                nomor_kontrak: '',
                                tahun_kontrak: '',
                                nilai_kontrak: 0,
                                kewajiban_tidak_terbayar: 0,
                                kewajiban_tidak_terbayar_last_year: 0,

                                p1_nomor_sp2d: '',
                                p1_tanggal: '',
                                p1_jumlah: 0,

                                p2_nomor_sp2d: '',
                                p2_tanggal: '',
                                p2_jumlah: 0,

                                p3_nomor_sp2d: '',
                                p3_tanggal: '',
                                p3_jumlah: 0,

                                jumlah_pembayaran_hutang: 0,
                                hutang_baru: 0,

                                pegawai: 0,
                                persediaan: 0,
                                perjadin: 0,
                                jasa: 0,
                                pemeliharaan: 0,
                                hibah: 0,

                                aset_tetap_tanah: 0,
                                aset_tetap_peralatan_mesin: 0,
                                aset_tetap_gedung_bangunan: 0,
                                aset_tetap_jalan_jaringan_irigasi: 0,
                                aset_tetap_lainnya: 0,
                                konstruksi_dalam_pekerjaan: 0,
                                aset_lain_lain: 0,
                            }
                        ])
                    }
                }
            });
        }
    }

    useEffect(() => {
        if (isMounted && periode?.id && year) {
            if ([9].includes(CurrentUser?.role_id)) {
                setInstance(CurrentUser?.instance_id ?? '');
            }
            _getData();
        }
    }, [isMounted, instance, periode?.id, year])


    const [totalData, setTotalData] = useState<any>({
        total_data: 0,
        nilai_kontrak: 0,
        kewajiban_tidak_terbayar: 0,
        kewajiban_tidak_terbayar_last_year: 0,

        p1_jumlah: 0,
        p2_jumlah: 0,
        p3_jumlah: 0,

        jumlah_pembayaran_hutang: 0,
        hutang_baru: 0,

        pegawai: 0,
        persediaan: 0,
        perjadin: 0,
        jasa: 0,
        pemeliharaan: 0,
        hibah: 0,

        aset_tetap_tanah: 0,
        aset_tetap_peralatan_mesin: 0,
        aset_tetap_gedung_bangunan: 0,
        aset_tetap_jalan_jaringan_irigasi: 0,
        aset_tetap_lainnya: 0,
        konstruksi_dalam_pekerjaan: 0,
        aset_lain_lain: 0,
    });

    const addDataInput = () => {
        const newData = {
            id: '',
            instance_id: instance ?? '',

            kode_rekening_id: '',
            nama_kegiatan: '',
            pelaksana_pekerjaan: '',
            nomor_kontrak: '',
            tahun_kontrak: '',
            nilai_kontrak: 0,
            kewajiban_tidak_terbayar: 0,
            kewajiban_tidak_terbayar_last_year: 0,

            p1_nomor_sp2d: '',
            p1_tanggal: '',
            p1_jumlah: 0,

            p2_nomor_sp2d: '',
            p2_tanggal: '',
            p2_jumlah: 0,

            p3_nomor_sp2d: '',
            p3_tanggal: '',
            p3_jumlah: 0,

            jumlah_pembayaran_hutang: 0,
            hutang_baru: 0,

            pegawai: 0,
            persediaan: 0,
            perjadin: 0,
            jasa: 0,
            pemeliharaan: 0,
            hibah: 0,

            aset_tetap_tanah: 0,
            aset_tetap_peralatan_mesin: 0,
            aset_tetap_gedung_bangunan: 0,
            aset_tetap_jalan_jaringan_irigasi: 0,
            aset_tetap_lainnya: 0,
            konstruksi_dalam_pekerjaan: 0,
            aset_lain_lain: 0,
        }
        setDataInput((prevData: any) => [...prevData, newData]);
        setIsUnsaved(true);
    }

    const updatedData = (data: any, index: number) => {
        setDataInput((prev: any) => {
            const updated = [...prev];
            updated[index].jumlah_pembayaran_hutang = parseFloat(updated[index].p1_jumlah) + parseFloat(updated[index].p2_jumlah) + parseFloat(updated[index].p3_jumlah);

            if (updated[index].tahun_kontrak == year) {
                updated[index].hutang_baru = parseFloat(updated[index].nilai_kontrak) - parseFloat(updated[index].jumlah_pembayaran_hutang);
                updated[index].kewajiban_tidak_terbayar = updated[index].hutang_baru;
            } else {
                updated[index].kewajiban_tidak_terbayar = parseFloat(updated[index].kewajiban_tidak_terbayar_last_year) - parseFloat(updated[index].jumlah_pembayaran_hutang);
            }
            return updated;
        })
        setIsUnsaved(true);
    }

    useEffect(() => {
        if (isMounted && dataInput.length > 0) {
            setTotalData((prev: any) => {
                const updated = { ...prev };
                updated.total_data = dataInput.length;
                updated.nilai_kontrak = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['nilai_kontrak']), 0);
                updated.kewajiban_tidak_terbayar = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['kewajiban_tidak_terbayar']), 0);
                updated.kewajiban_tidak_terbayar_last_year = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['kewajiban_tidak_terbayar_last_year']), 0);
                updated.p1_jumlah = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['p1_jumlah']), 0);
                updated.p2_jumlah = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['p2_jumlah']), 0);
                updated.p3_jumlah = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['p3_jumlah']), 0);
                updated.jumlah_pembayaran_hutang = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['jumlah_pembayaran_hutang']), 0);
                updated.hutang_baru = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['hutang_baru']), 0);
                updated.pegawai = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['pegawai']), 0);
                updated.persediaan = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['persediaan']), 0);
                updated.perjadin = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['perjadin']), 0);
                updated.jasa = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['jasa']), 0);
                updated.pemeliharaan = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['pemeliharaan']), 0);
                updated.hibah = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['hibah']), 0);
                updated.aset_tetap_tanah = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['aset_tetap_tanah']), 0);
                updated.aset_tetap_peralatan_mesin = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['aset_tetap_peralatan_mesin']), 0);
                updated.aset_tetap_gedung_bangunan = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['aset_tetap_gedung_bangunan']), 0);
                updated.aset_tetap_jalan_jaringan_irigasi = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['aset_tetap_jalan_jaringan_irigasi']), 0);
                updated.aset_tetap_lainnya = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['aset_tetap_lainnya']), 0);
                updated.konstruksi_dalam_pekerjaan = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['konstruksi_dalam_pekerjaan']), 0);
                updated.aset_lain_lain = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['aset_lain_lain']), 0);
                return updated;
            })
        }
    }, [isMounted, dataInput])

    const save = () => {
        setIsSaving(true);
        // console.log(dataInput);
        storeData(dataInput, periode?.id, year).then((res: any) => {
            if (res.status == 'error validation') {
                showAlert('error', 'Perangkat Daerah dan Nama Persediaan tidak boleh kosong');
                setIsSaving(false);
            } else if (res.status == 'success') {
                showAlert('success', 'Data berhasil disimpan');
                setIsUnsaved(false);
                setIsSaving(false);
                _getData();
            } else {
                showAlert('error', 'Data gagal disimpan');
                setIsSaving(false);
            }
        });
    }

    const _deleteData = (id: any) => {
        deleteData(id).then((res: any) => {
            if (res.status == 'success') {
                _getData();
                showAlert('success', 'Data berhasil dihapus');
            } else {
                showAlert('error', 'Data gagal dihapus');
            }
        });
    }

    return (
        <>
            <div className="table-responsive h-[calc(100vh-400px)] pb-5">
                {dataInput.length === 0 && (
                    <div className="flex flex-col gap-y-2 items-center justify-center h-full w-full">
                        <div>
                            <LoadingSicaram />
                        </div>
                        <h1 className="text-[30px] font-semibold">
                            Sedang memuat data...
                        </h1>
                    </div>
                )}
                {dataInput.length > 0 && (
                    <table className="table-striped">
                        <thead className='sticky top-0 z-[2]'>
                            <tr className='!bg-dark !text-white'>
                                <th rowSpan={3} className='text-center border border-slate-100 whitespace-nowrap min-w-[300px] max-w-[300px]'>
                                    Perangkat Daerah
                                </th>
                                <th rowSpan={3} className='text-center border border-slate-100 whitespace-nowrap'>
                                    Kode Rekening
                                </th>
                                <th rowSpan={3} className='sticky left-0 top-0 z-[2] bg-dark text-white text-center border border-slate-100 whitespace-nowrap'>
                                    Nama Kegiatan - Uraian Paket Pekerjaan
                                </th>
                                <th rowSpan={3} className='text-center border border-slate-100 whitespace-nowrap'>
                                    Pelaksana Pekerjaan
                                </th>
                                <th rowSpan={2} colSpan={2} className='text-center border border-slate-100 whitespace-nowrap'>
                                    Kontrak
                                </th>
                                <th rowSpan={3} className='text-center border border-slate-100 whitespace-nowrap'>
                                    Nilai Belanja / Nilai Kontrak
                                </th>
                                <th rowSpan={3} className='text-center border border-slate-100 whitespace-nowrap'>
                                    Kewajiban Tidak Terbayar {year - 1}
                                </th>
                                <th colSpan={9} className='text-center border border-slate-100 whitespace-nowrap'>
                                    Pembayaran s.d 31 Des {year}
                                </th>
                                <th rowSpan={3} className='text-center border border-slate-100 whitespace-nowrap'>
                                    Jumlah Pembayaran Hutang s.d 31 Des {year}
                                </th>
                                <th rowSpan={3} className='text-center border border-slate-100 whitespace-nowrap'>
                                    Kewajiban Tidak Terbayar {year}
                                </th>
                                <th rowSpan={3} className='text-center border border-slate-100 whitespace-nowrap'>
                                    Hutang Baru {year}
                                </th>
                                <th colSpan={13} rowSpan={2} className='text-center border border-slate-100 whitespace-nowrap'>
                                    Hutang (Rp)
                                </th>
                            </tr>
                            <tr className="!bg-dark !text-white">
                                <th colSpan={3} className='text-center border border-slate-100 whitespace-nowrap'>
                                    Pembayaran Ke - 1
                                </th>
                                <th colSpan={3} className='text-center border border-slate-100 whitespace-nowrap'>
                                    Pembayaran Ke - 2
                                </th>
                                <th colSpan={3} className='text-center border border-slate-100 whitespace-nowrap'>
                                    Pembayaran Ke - 3
                                </th>
                            </tr>
                            <tr className="!bg-dark !text-white">

                                <th className='text-center border border-slate-100 whitespace-nowrap'>
                                    Nomor
                                </th>
                                <th className='text-center border border-slate-100 whitespace-nowrap'>
                                    Tahun
                                </th>

                                <th className='text-center border border-slate-100 whitespace-nowrap'>
                                    No SP2D
                                </th>
                                <th className='text-center border border-slate-100 whitespace-nowrap'>
                                    Tanggal
                                </th>
                                <th className='text-center border border-slate-100 whitespace-nowrap'>
                                    Jumlah
                                </th>

                                <th className='text-center border border-slate-100 whitespace-nowrap'>
                                    No SP2D
                                </th>
                                <th className='text-center border border-slate-100 whitespace-nowrap'>
                                    Tanggal
                                </th>
                                <th className='text-center border border-slate-100 whitespace-nowrap'>
                                    Jumlah
                                </th>

                                <th className='text-center border border-slate-100 whitespace-nowrap'>
                                    No SP2D
                                </th>
                                <th className='text-center border border-slate-100 whitespace-nowrap'>
                                    Tanggal
                                </th>
                                <th className='text-center border border-slate-100 whitespace-nowrap'>
                                    Jumlah
                                </th>


                                <th className='text-center border border-slate-100 whitespace-nowrap bg-green-500'>
                                    Pegawai
                                </th>
                                <th className='text-center border border-slate-100 whitespace-nowrap bg-green-500'>
                                    Persediaan
                                </th>
                                <th className='text-center border border-slate-100 whitespace-nowrap bg-green-500'>
                                    Perjadin
                                </th>
                                <th className='text-center border border-slate-100 whitespace-nowrap bg-green-500'>
                                    Jasa
                                </th>
                                <th className='text-center border border-slate-100 whitespace-nowrap bg-green-500'>
                                    Pemeliharaan
                                </th>
                                <th className='text-center border border-slate-100 whitespace-nowrap bg-green-500'>
                                    Hibah
                                </th>

                                <th className='text-center border border-slate-100 whitespace-nowrap bg-yellow-500'>
                                    Aset Tetap Tanah
                                </th>
                                <th className='text-center border border-slate-100 whitespace-nowrap bg-yellow-500'>
                                    Aset Tetap Peralatan dan Mesin
                                </th>
                                <th className='text-center border border-slate-100 whitespace-nowrap bg-yellow-500'>
                                    Aset Tetap Gedung dan Bangunan
                                </th>
                                <th className='text-center border border-slate-100 whitespace-nowrap bg-yellow-500'>
                                    Aset Tetap Jalan Jaringan Irigasi
                                </th>
                                <th className='text-center border border-slate-100 whitespace-nowrap bg-yellow-500'>
                                    Aset Tetap Lainnya
                                </th>
                                <th className='text-center border border-slate-100 whitespace-nowrap bg-yellow-500'>
                                    Konstruksi Dalam Pekerjaan
                                </th>
                                <th className='text-center border border-slate-100 whitespace-nowrap bg-yellow-500'>
                                    Aset Lain-lain
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataInput.map((data: any, index: number) => (
                                <Fragment key={index}>
                                    <tr className=''>
                                        <td className='border'>
                                            {/* Perangkat Daerah */}
                                            <div className="flex items-center gap-2">
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
                                                    isDisabled={[9].includes(CurrentUser?.role_id) ? true : ((isSaving == true) || instance ? true : false)}
                                                    required={true}
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
                                            </div>
                                        </td>
                                        <td className='border'>
                                            <Select placeholder="Pilih Kode Rekening"
                                                className='w-[250px]'
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
                                                    arrKodeRekening?.map((data: any, index: number) => {
                                                        return {
                                                            value: data.id,
                                                            label: data.fullcode + ' - ' + data.name,
                                                        }
                                                    })
                                                } />
                                        </td>
                                        <td className='sticky left-0 z-[1] bg-slate-50 border'>
                                            <div className="flex items-center gap-2">
                                                <input type="text"
                                                    placeholder='Nama Kegiatan - Uraian Paket Pekerjaan'
                                                    autoComplete='off'
                                                    value={data.nama_kegiatan}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['nama_kegiatan'] = e.target.value;
                                                            return updated;
                                                        });
                                                    }}
                                                    className='form-input font-normal min-w-[250px]' />

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
                                                                            if (data.id) {
                                                                                _deleteData(data.id);
                                                                            } else {
                                                                                setDataInput((prev: any) => {
                                                                                    const updated = [...prev];
                                                                                    updated.splice(index, 1);
                                                                                    return updated;
                                                                                });
                                                                            }
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
                                            </div>
                                        </td>
                                        <td className='border'>
                                            <input type="text"
                                                placeholder='Pelaksana Pekerjaan'
                                                autoComplete='off'
                                                value={data.pelaksana_pekerjaan}
                                                onChange={(e) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['pelaksana_pekerjaan'] = e.target.value;
                                                        return updated;
                                                    });
                                                }}
                                                className='form-input font-normal min-w-[250px]' />
                                        </td>
                                        <td className='border'>
                                            <input type="text"
                                                placeholder='Nomor Kontrak'
                                                autoComplete='off'
                                                value={data.nomor_kontrak}
                                                onChange={(e) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['nomor_kontrak'] = e.target.value;
                                                        return updated;
                                                    });
                                                }}
                                                className='form-input font-normal min-w-[250px]' />
                                        </td>
                                        <td className='border'>
                                            <Select
                                                className="min-w-[250px]"
                                                id="tahun"
                                                options={years}
                                                placeholder="Pilih Tahun Kontrak"
                                                value={years?.find((option: any) => option.value === data.tahun_kontrak)}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['tahun_kontrak'] = e.value;
                                                        return updated;
                                                    });
                                                }}
                                                isSearchable={false}
                                                isClearable={false}
                                                classNamePrefix={'selectAngga'}
                                                isDisabled={(years?.length === 0) || false}
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
                                                    value={data.nilai_kontrak}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['nilai_kontrak'] = isNaN(value) ? 0 : value;
                                                            updatedData(updated, index);
                                                            return updated;
                                                        });
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.nilai_kontrak)}
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
                                                    value={data.kewajiban_tidak_terbayar_last_year}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['kewajiban_tidak_terbayar_last_year'] = isNaN(value) ? 0 : value;
                                                            updatedData(updated, index);
                                                            return updated;
                                                        });
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.kewajiban_tidak_terbayar_last_year)}
                                                </div>
                                            </div>
                                        </td>


                                        {/* Pembayaran 1 Start */}
                                        <td className='border'>
                                            <input type="text"
                                                placeholder='No SP2D'
                                                autoComplete='off'
                                                value={data.p1_nomor_sp2d}
                                                onChange={(e) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['p1_nomor_sp2d'] = e.target.value;
                                                        return updated;
                                                    });
                                                }}
                                                className='form-input font-normal min-w-[250px]' />
                                        </td>
                                        <td className='border'>
                                            <Flatpickr
                                                placeholder='Pilih Tanggal Perjanjian'
                                                options={{
                                                    dateFormat: 'Y-m-d',
                                                    position: 'auto right'
                                                }}
                                                className="form-input w-[250px] placeholder:font-normal"
                                                value={data?.p1_tanggal}
                                                onChange={(date) => {
                                                    let Ymd = new Date(date[0].toISOString());
                                                    Ymd.setDate(Ymd.getDate() + 1);
                                                    const newYmd = Ymd.toISOString().split('T')[0];
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['p1_tanggal'] = newYmd;
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
                                                    value={data.p1_jumlah}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['p1_jumlah'] = isNaN(value) ? 0 : value;
                                                            updatedData(updated, index);
                                                            return updated;
                                                        });
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.p1_jumlah)}
                                                </div>
                                            </div>
                                        </td>
                                        {/* Pembayaran 1 End */}

                                        {/* Pembayaran 2 Start */}
                                        <td className='border'>
                                            <input type="text"
                                                placeholder='No SP2D'
                                                autoComplete='off'
                                                value={data.p2_nomor_sp2d}
                                                onChange={(e) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['p2_nomor_sp2d'] = e.target.value;
                                                        return updated;
                                                    });
                                                }}
                                                className='form-input font-normal min-w-[250px]' />
                                        </td>
                                        <td className='border'>
                                            <Flatpickr
                                                placeholder='Pilih Tanggal Perjanjian'
                                                options={{
                                                    dateFormat: 'Y-m-d',
                                                    position: 'auto right'
                                                }}
                                                className="form-input w-[250px] placeholder:font-normal"
                                                value={data?.p2_tanggal}
                                                onChange={(date) => {
                                                    let Ymd = new Date(date[0].toISOString());
                                                    Ymd.setDate(Ymd.getDate() + 1);
                                                    const newYmd = Ymd.toISOString().split('T')[0];
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['p2_tanggal'] = newYmd;
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
                                                    value={data.p2_jumlah}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['p2_jumlah'] = isNaN(value) ? 0 : value;
                                                            updatedData(updated, index);
                                                            return updated;
                                                        });
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.p2_jumlah)}
                                                </div>
                                            </div>
                                        </td>
                                        {/* Pembayaran 2 End */}

                                        {/* Pembayaran 3 Start */}
                                        <td className='border'>
                                            <input type="text"
                                                placeholder='No SP2D'
                                                autoComplete='off'
                                                value={data.p3_nomor_sp2d}
                                                onChange={(e) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['p3_nomor_sp2d'] = e.target.value;
                                                        return updated;
                                                    });
                                                }}
                                                className='form-input font-normal min-w-[250px]' />
                                        </td>
                                        <td className='border'>
                                            <Flatpickr
                                                placeholder='Pilih Tanggal Perjanjian'
                                                options={{
                                                    dateFormat: 'Y-m-d',
                                                    position: 'auto right'
                                                }}
                                                className="form-input w-[250px] placeholder:font-normal"
                                                value={data?.p3_tanggal}
                                                onChange={(date) => {
                                                    let Ymd = new Date(date[0].toISOString());
                                                    Ymd.setDate(Ymd.getDate() + 1);
                                                    const newYmd = Ymd.toISOString().split('T')[0];
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['p3_tanggal'] = newYmd;
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
                                                    value={data.p3_jumlah}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['p3_jumlah'] = isNaN(value) ? 0 : value;
                                                            updatedData(updated, index);
                                                            return updated;
                                                        });
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.p3_jumlah)}
                                                </div>
                                            </div>
                                        </td>
                                        {/* Pembayaran 3 End */}

                                        <td className='border'>
                                            <div className="flex group">
                                                <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                    Rp.
                                                </div>
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end bg-slate-100">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.jumlah_pembayaran_hutang)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='border'>
                                            <div className="flex group">
                                                <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                    Rp.
                                                </div>
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end bg-slate-100">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.kewajiban_tidak_terbayar)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='border'>
                                            <div className="flex group">
                                                <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                    Rp.
                                                </div>
                                                {/* <input
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
                                            value={data.hutang_baru}
                                            onChange={(e) => {
                                                setDataInput((prev: any) => {
                                                    const updated = [...prev];
                                                    const value = parseFloat(e?.target?.value);
                                                    updated[index]['hutang_baru'] = isNaN(value) ? 0 : value;
                                                    updatedData(updated, index);
                                                    return updated;
                                                });
                                            }}
                                            className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" /> */}
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end bg-slate-100">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.hutang_baru)}
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
                                                    value={data.pegawai}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['pegawai'] = isNaN(value) ? 0 : value;
                                                            updatedData(updated, index);
                                                            return updated;
                                                        });
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.pegawai)}
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
                                                    value={data.persediaan}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['persediaan'] = isNaN(value) ? 0 : value;
                                                            updatedData(updated, index);
                                                            return updated;
                                                        });
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
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
                                                    value={data.perjadin}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['perjadin'] = isNaN(value) ? 0 : value;
                                                            updatedData(updated, index);
                                                            return updated;
                                                        });
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.perjadin)}
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
                                                    value={data.jasa}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['jasa'] = isNaN(value) ? 0 : value;
                                                            updatedData(updated, index);
                                                            return updated;
                                                        });
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.jasa)}
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
                                                    value={data.pemeliharaan}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['pemeliharaan'] = isNaN(value) ? 0 : value;
                                                            updatedData(updated, index);
                                                            return updated;
                                                        });
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.pemeliharaan)}
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
                                                    value={data.hibah}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['hibah'] = isNaN(value) ? 0 : value;
                                                            updatedData(updated, index);
                                                            return updated;
                                                        });
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.hibah)}
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
                                                        });
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
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
                                                        });
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
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
                                                        });
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
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
                                                        });
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
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
                                                        });
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
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
                                                        });
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
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
                                                    value={data.aset_lain_lain}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['aset_lain_lain'] = isNaN(value) ? 0 : value;
                                                            updatedData(updated, index);
                                                            return updated;
                                                        });
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.aset_lain_lain)}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </Fragment>
                            ))}
                        </tbody>
                        <tfoot className=''>
                            <tr>
                                <td className='border p-4 bg-slate-200 sticky left-0'>
                                    <div className="flex justify-center font-semibold">
                                        Jumlah
                                    </div>
                                </td>
                                <td colSpan={2} className='border p-4 bg-slate-200'>
                                    <div className="flex justify-center font-semibold">
                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.total_data)} Data
                                    </div>
                                </td>
                                <td colSpan={3} className='border p-4 bg-slate-200'></td>
                                <td className='border p-4 bg-slate-200'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div className="">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.nilai_kontrak)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border p-4 bg-slate-200'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div className="">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.kewajiban_tidak_terbayar_last_year)}
                                        </div>
                                    </div>
                                </td>
                                <td colSpan={2} className='border p-4 bg-slate-200'></td>
                                <td className='border p-4 bg-slate-200'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.p1_jumlah)}
                                        </div>
                                    </div>
                                </td>
                                <td colSpan={2} className='border p-4 bg-slate-200'></td>
                                <td className='border p-4 bg-slate-200'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.p2_jumlah)}
                                        </div>
                                    </div>
                                </td>
                                <td colSpan={2} className='border p-4 bg-slate-200'></td>
                                <td className='border p-4 bg-slate-200'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.p3_jumlah)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border p-4 bg-slate-200'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.jumlah_pembayaran_hutang)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border p-4 bg-slate-200'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.kewajiban_tidak_terbayar)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border p-4 bg-slate-200'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.hutang_baru)}
                                        </div>
                                    </div>
                                </td>

                                <td className='border p-4 bg-slate-200'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div className="">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.pegawai)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border p-4 bg-slate-200'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.persediaan)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border p-4 bg-slate-200'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.perjadin)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border p-4 bg-slate-200'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.jasa)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border p-4 bg-slate-200'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.pemeliharaan)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border p-4 bg-slate-200'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.hibah)}
                                        </div>
                                    </div>
                                </td>

                                <td className='border p-4 bg-slate-200'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.aset_tetap_tanah)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border p-4 bg-slate-200'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.aset_tetap_peralatan_mesin)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border p-4 bg-slate-200'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.aset_tetap_gedung_bangunan)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border p-4 bg-slate-200'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.aset_tetap_jalan_jaringan_irigasi)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border p-4 bg-slate-200'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.aset_tetap_lainnya)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border p-4 bg-slate-200'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.konstruksi_dalam_pekerjaan)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border p-4 bg-slate-200'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.aset_lain_lain)}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                )}
            </div>

            {/* <div className="flex items-center justify-end gap-4 mt-4 px-5">
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
                        Simpan Hutang Belanja
                    </button>
                ) : (
                    <button type="button"
                        disabled={true}
                        className='btn btn-success whitespace-nowrap text-xs'>
                        <FontAwesomeIcon icon={faSpinner} className='w-3 h-3 mr-1 animate-spin' />
                        Menyimpan..
                    </button>
                )}

            </div> */}
        </>
    );
}

export default Rekap;
