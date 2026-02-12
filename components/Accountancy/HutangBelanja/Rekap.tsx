import Select from 'react-select';
import { faChevronLeft, faChevronRight, faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
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
import DownloadButtons from '@/components/Buttons/DownloadButtons';
import InputTextExpanded from '@/components/InputTextExpanded';


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
    const [dataInputOrigin, setDataInputOrigin] = useState<any>([]);
    const [search, setSearch] = useState<any>('');
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
                        setDataInputOrigin(res.data);
                        const maxPage = Math.ceil(res.data.length / perPage);
                        setMaxPage(maxPage);
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
                                uang_jasa_diserahkan: 0,
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
        uang_jasa_diserahkan: 0,
        hibah: 0,

        aset_tetap_tanah: 0,
        aset_tetap_peralatan_mesin: 0,
        aset_tetap_gedung_bangunan: 0,
        aset_tetap_jalan_jaringan_irigasi: 0,
        aset_tetap_lainnya: 0,
        konstruksi_dalam_pekerjaan: 0,
        aset_lain_lain: 0,
    });

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
                updated.uang_jasa_diserahkan = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['uang_jasa_diserahkan']), 0);
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
                updated.total_hutang = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['total_hutang']), 0);
                return updated;
            })
        }
    }, [isMounted, dataInput])

    const handleSearch = (e: any) => {
        if (e.length > 0) {
            setSearch(e);
            const filteredData = dataInputOrigin.filter((item: any) => {
                return (
                    item.instance_name?.toLowerCase().includes(e.toLowerCase()) ||
                    item.nama_kegiatan?.toLowerCase().includes(e.toLowerCase()) ||
                    item.pelaksana_pekerjaan?.toLowerCase().includes(e.toLowerCase()) ||
                    item.nomor_kontrak?.toLowerCase().includes(e.toLowerCase()) ||
                    item.p1_nomor_sp2d?.toLowerCase().includes(e.toLowerCase()) ||
                    item.p2_nomor_sp2d?.toLowerCase().includes(e.toLowerCase()) ||
                    // item?.p3_nomor_sp2d?.toLowerCase().includes(e.toLowerCase()) ||
                    item.kode_rekening_fullcode?.toString().toLowerCase().includes(e.toLowerCase()) ||
                    item.kode_rekening_name?.toString().toLowerCase().includes(e.toLowerCase())
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
                {dataInput.length === 0 && (
                    <div className="flex flex-col h-full justify-center w-full gap-y-2 items-center">
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
                                <th rowSpan={3} className='border border-slate-100 text-center max-w-[300px] min-w-[300px] whitespace-nowrap'>
                                    Perangkat Daerah
                                </th>
                                <th rowSpan={3} className='border border-slate-100 text-center whitespace-nowrap'>
                                    Kode Rekening
                                </th>
                                <th rowSpan={3} className='bg-dark border border-slate-100 text-center text-white left-0 sticky top-0 whitespace-nowrap z-[2]'>
                                    Nama Kegiatan - Uraian Paket Pekerjaan
                                </th>
                                <th rowSpan={3} className='border border-slate-100 text-center whitespace-nowrap'>
                                    Pelaksana Pekerjaan
                                </th>
                                <th rowSpan={2} colSpan={2} className='border border-slate-100 text-center whitespace-nowrap'>
                                    Kontrak
                                </th>
                                <th rowSpan={3} className='border border-slate-100 text-center whitespace-nowrap'>
                                    Nilai Belanja / Nilai Kontrak
                                </th>
                                <th rowSpan={3} className='border border-slate-100 text-center whitespace-nowrap'>
                                    Kewajiban Tidak Terbayar {year - 1}
                                </th>
                                <th colSpan={9} className='border border-slate-100 text-center whitespace-nowrap'>
                                    Pembayaran s.d 31 Des {year}
                                </th>
                                <th rowSpan={3} className='border border-slate-100 text-center whitespace-nowrap'>
                                    Jumlah Pembayaran Utang s.d 31 Des {year}
                                </th>
                                <th rowSpan={3} className='border border-slate-100 text-center whitespace-nowrap'>
                                    Kewajiban Tidak Terbayar {year}
                                </th>
                                <th rowSpan={3} className='border border-slate-100 text-center whitespace-nowrap'>
                                    Utang Baru {year}
                                </th>
                                <th colSpan={14} rowSpan={2} className='border border-slate-100 text-center whitespace-nowrap'>
                                    Utang (Rp)
                                </th>
                                <th rowSpan={3} className='border border-slate-100 text-center whitespace-nowrap'>
                                    Total Utang
                                </th>
                            </tr>
                            <tr className="!bg-dark !text-white">
                                <th colSpan={3} className='border border-slate-100 text-center whitespace-nowrap'>
                                    Pembayaran Ke - 1
                                </th>
                                <th colSpan={3} className='border border-slate-100 text-center whitespace-nowrap'>
                                    Pembayaran Ke - 2
                                </th>
                                <th colSpan={3} className='border border-slate-100 text-center whitespace-nowrap'>
                                    Pembayaran Ke - 3
                                </th>
                            </tr>
                            <tr className="!bg-dark !text-white">

                                <th className='border border-slate-100 text-center whitespace-nowrap'>
                                    Nomor
                                </th>
                                <th className='border border-slate-100 text-center whitespace-nowrap'>
                                    Tahun
                                </th>

                                <th className='border border-slate-100 text-center whitespace-nowrap'>
                                    No SP2D
                                </th>
                                <th className='border border-slate-100 text-center whitespace-nowrap'>
                                    Tanggal
                                </th>
                                <th className='border border-slate-100 text-center whitespace-nowrap'>
                                    Jumlah
                                </th>

                                <th className='border border-slate-100 text-center whitespace-nowrap'>
                                    No SP2D
                                </th>
                                <th className='border border-slate-100 text-center whitespace-nowrap'>
                                    Tanggal
                                </th>
                                <th className='border border-slate-100 text-center whitespace-nowrap'>
                                    Jumlah
                                </th>

                                <th className='border border-slate-100 text-center whitespace-nowrap'>
                                    No SP2D
                                </th>
                                <th className='border border-slate-100 text-center whitespace-nowrap'>
                                    Tanggal
                                </th>
                                <th className='border border-slate-100 text-center whitespace-nowrap'>
                                    Jumlah
                                </th>


                                <th className='bg-green-500 border border-slate-100 text-center whitespace-nowrap'>
                                    Pegawai
                                </th>
                                <th className='bg-green-500 border border-slate-100 text-center whitespace-nowrap'>
                                    Persediaan
                                </th>
                                <th className='bg-green-500 border border-slate-100 text-center whitespace-nowrap'>
                                    Perjadin
                                </th>
                                <th className='bg-green-500 border border-slate-100 text-center whitespace-nowrap'>
                                    Jasa
                                </th>
                                <th className='bg-green-500 border border-slate-100 text-center whitespace-nowrap'>
                                    Pemeliharaan
                                </th>
                                <th className='bg-green-500 border border-slate-100 text-center whitespace-nowrap'>
                                    Uang/Jasa Diserahkan
                                </th>
                                <th className='bg-green-500 border border-slate-100 text-center whitespace-nowrap'>
                                    Hibah
                                </th>

                                <th className='bg-yellow-500 border border-slate-100 text-center whitespace-nowrap'>
                                    Aset Tetap Tanah
                                </th>
                                <th className='bg-yellow-500 border border-slate-100 text-center whitespace-nowrap'>
                                    Aset Tetap Peralatan dan Mesin
                                </th>
                                <th className='bg-yellow-500 border border-slate-100 text-center whitespace-nowrap'>
                                    Aset Tetap Gedung dan Bangunan
                                </th>
                                <th className='bg-yellow-500 border border-slate-100 text-center whitespace-nowrap'>
                                    Aset Tetap Jalan Jaringan Irigasi
                                </th>
                                <th className='bg-yellow-500 border border-slate-100 text-center whitespace-nowrap'>
                                    Aset Tetap Lainnya
                                </th>
                                <th className='bg-yellow-500 border border-slate-100 text-center whitespace-nowrap'>
                                    Konstruksi Dalam Pekerjaan
                                </th>
                                <th className='bg-yellow-500 border border-slate-100 text-center whitespace-nowrap'>
                                    Aset Lain-lain
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataInput.map((data: any, index: number) => (
                                <>
                                    {(index >= (page - 1) * perPage && index < (page * perPage)) && (
                                        <Fragment key={index}>
                                            <tr className=''>
                                                <td className='border'>
                                                    {/* Perangkat Daerah */}
                                                    <div className="flex gap-2 items-center">
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
                                                            isDisabled={true}
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
                                                        className='w-[500px]'
                                                        isDisabled={true}
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
                                                <td className='bg-slate-50 border left-0 sticky z-[1]'>
                                                    <Tippy content={data.type === 'pembayaran' ? 'Pembayaran Utang' : 'Utang Baru'} theme={data.type === 'pembayaran' ? 'success' : 'warning'}>
                                                        {/* <input type="text"
                                                            placeholder='Nama Kegiatan - Uraian Paket Pekerjaan'
                                                            autoComplete='off'
                                                            value={data.nama_kegiatan}
                                                            readOnly={true}
                                                            onChange={(e) => {
                                                                setDataInput((prev: any) => {
                                                                    const updated = [...prev];
                                                                    updated[index]['nama_kegiatan'] = e.target.value;
                                                                    return updated;
                                                                });
                                                            }}
                                                            className='form-input cursor-pointer font-normal min-w-[250px]' /> */}
                                                        <InputTextExpanded
                                                            placeholder='Nama Kegiatan - Uraian Paket Pekerjaan'
                                                            value={data.nama_kegiatan}
                                                            data={data}
                                                            index={index}
                                                            isDisabled={false}
                                                            isReadOnly={true}
                                                            onChange={(e: any, data: any, index: number) => {
                                                            }}
                                                            onBlur={(e: any) => {
                                                            }}
                                                        />
                                                    </Tippy>
                                                </td>
                                                <td className='border'>
                                                    <input type="text"
                                                        placeholder='Pelaksana Pekerjaan'
                                                        autoComplete='off'
                                                        value={data.pelaksana_pekerjaan}
                                                        readOnly={true}
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
                                                        readOnly={true}
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
                                                        isDisabled={true}
                                                    />
                                                </td>
                                                <td className='border'>
                                                    <InputRupiah
                                                        dataValue={data.nilai_kontrak}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className='border'>
                                                    <InputRupiah
                                                        dataValue={data.kewajiban_tidak_terbayar_last_year}
                                                        readOnly={true}
                                                    />
                                                </td>


                                                {/* Pembayaran 1 Start */}
                                                <td className='border'>
                                                    <input type="text"
                                                        placeholder='No SP2D'
                                                        autoComplete='off'
                                                        value={data.p1_nomor_sp2d}
                                                        readOnly={true}
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
                                                        disabled={true}
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
                                                    <InputRupiah
                                                        dataValue={data.p1_jumlah}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                {/* Pembayaran 1 End */}

                                                {/* Pembayaran 2 Start */}
                                                <td className='border'>
                                                    <input type="text"
                                                        placeholder='No SP2D'
                                                        autoComplete='off'
                                                        value={data.p2_nomor_sp2d}
                                                        readOnly={true}
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
                                                        disabled={true}
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
                                                    <InputRupiah
                                                        dataValue={data.p2_jumlah}
                                                        readOnly={true}
                                                    />
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
                                                        readOnly={true}
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
                                                        disabled={true}
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
                                                    <InputRupiah
                                                        dataValue={data.p3_jumlah}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                {/* Pembayaran 3 End */}

                                                <td className='border'>
                                                    <InputRupiah
                                                        dataValue={data.jumlah_pembayaran_hutang}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className='border'>
                                                    <InputRupiah
                                                        dataValue={data.kewajiban_tidak_terbayar}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className='border'>
                                                    <InputRupiah
                                                        dataValue={data.hutang_baru}
                                                        readOnly={true}
                                                    />
                                                </td>

                                                <td className='border'>
                                                    <InputRupiah
                                                        dataValue={data.pegawai}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className='border'>
                                                    <InputRupiah
                                                        dataValue={data.persediaan}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className='border'>
                                                    <InputRupiah
                                                        dataValue={data.perjadin}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className='border'>
                                                    <InputRupiah
                                                        dataValue={data.jasa}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className='border'>
                                                    <InputRupiah
                                                        dataValue={data.pemeliharaan}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className='border'>
                                                    <InputRupiah
                                                        dataValue={data.uang_jasa_diserahkan}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className='border'>
                                                    <InputRupiah
                                                        dataValue={data.hibah}
                                                        readOnly={true}
                                                    />
                                                </td>

                                                <td className='border'>
                                                    <InputRupiah
                                                        dataValue={data.aset_tetap_tanah}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className='border'>
                                                    <InputRupiah
                                                        dataValue={data.aset_tetap_peralatan_mesin}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className='border'>
                                                    <InputRupiah
                                                        dataValue={data.aset_tetap_gedung_bangunan}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className='border'>
                                                    <InputRupiah
                                                        dataValue={data.aset_tetap_jalan_jaringan_irigasi}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className='border'>
                                                    <InputRupiah
                                                        dataValue={data.aset_tetap_lainnya}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className='border'>
                                                    <InputRupiah
                                                        dataValue={data.konstruksi_dalam_pekerjaan}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className='border'>
                                                    <InputRupiah
                                                        dataValue={data.aset_lain_lain}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className='border'>
                                                    <InputRupiah
                                                        dataValue={data.total_hutang}
                                                        readOnly={true}
                                                    />
                                                </td>
                                            </tr>
                                        </Fragment>
                                    )}
                                </>
                            ))}
                        </tbody>
                        <tfoot className=''>
                            <tr>
                                <td className='bg-slate-200 border p-4 left-0 sticky'>
                                    <div className="flex justify-center font-semibold">
                                        Jumlah
                                    </div>
                                </td>
                                <td colSpan={2} className='bg-slate-200 border p-4'>
                                    <div className="flex justify-center font-semibold">
                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.total_data)} Data
                                    </div>
                                </td>
                                <td colSpan={3} className='bg-slate-200 border p-4'></td>
                                <td className='bg-slate-200 border p-4'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div className="">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.nilai_kontrak)}
                                        </div>
                                    </div>
                                </td>
                                <td className='bg-slate-200 border p-4'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div className="">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.kewajiban_tidak_terbayar_last_year)}
                                        </div>
                                    </div>
                                </td>
                                <td colSpan={2} className='bg-slate-200 border p-4'></td>
                                <td className='bg-slate-200 border p-4'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.p1_jumlah)}
                                        </div>
                                    </div>
                                </td>
                                <td colSpan={2} className='bg-slate-200 border p-4'></td>
                                <td className='bg-slate-200 border p-4'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.p2_jumlah)}
                                        </div>
                                    </div>
                                </td>
                                <td colSpan={2} className='bg-slate-200 border p-4'></td>
                                <td className='bg-slate-200 border p-4'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.p3_jumlah)}
                                        </div>
                                    </div>
                                </td>
                                <td className='bg-slate-200 border p-4'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.jumlah_pembayaran_hutang)}
                                        </div>
                                    </div>
                                </td>
                                <td className='bg-slate-200 border p-4'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.kewajiban_tidak_terbayar)}
                                        </div>
                                    </div>
                                </td>
                                <td className='bg-slate-200 border p-4'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.hutang_baru)}
                                        </div>
                                    </div>
                                </td>

                                <td className='bg-slate-200 border p-4'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div className="">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.pegawai)}
                                        </div>
                                    </div>
                                </td>
                                <td className='bg-slate-200 border p-4'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.persediaan)}
                                        </div>
                                    </div>
                                </td>
                                <td className='bg-slate-200 border p-4'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.perjadin)}
                                        </div>
                                    </div>
                                </td>
                                <td className='bg-slate-200 border p-4'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.jasa)}
                                        </div>
                                    </div>
                                </td>
                                <td className='bg-slate-200 border p-4'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.pemeliharaan)}
                                        </div>
                                    </div>
                                </td>
                                <td className='bg-slate-200 border p-4'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.uang_jasa_diserahkan)}
                                        </div>
                                    </div>
                                </td>
                                <td className='bg-slate-200 border p-4'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.hibah)}
                                        </div>
                                    </div>
                                </td>

                                <td className='bg-slate-200 border p-4'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.aset_tetap_tanah)}
                                        </div>
                                    </div>
                                </td>
                                <td className='bg-slate-200 border p-4'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.aset_tetap_peralatan_mesin)}
                                        </div>
                                    </div>
                                </td>
                                <td className='bg-slate-200 border p-4'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.aset_tetap_gedung_bangunan)}
                                        </div>
                                    </div>
                                </td>
                                <td className='bg-slate-200 border p-4'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.aset_tetap_jalan_jaringan_irigasi)}
                                        </div>
                                    </div>
                                </td>
                                <td className='bg-slate-200 border p-4'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.aset_tetap_lainnya)}
                                        </div>
                                    </div>
                                </td>
                                <td className='bg-slate-200 border p-4'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.konstruksi_dalam_pekerjaan)}
                                        </div>
                                    </div>
                                </td>
                                <td className='bg-slate-200 border p-4'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.aset_lain_lain)}
                                        </div>
                                    </div>
                                </td>
                                <td className='bg-slate-200 border p-4'>
                                    <div className="flex justify-between font-semibold">
                                        Rp.
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.total_hutang)}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                )}
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
                    <div>
                        {dataInput.length > 0 && (
                            <DownloadButtons
                                data={dataInput}
                                endpoint='/accountancy/download/excel'
                                params={{
                                    type: 'rekap_utang_belanja',
                                    category: 'hutang_belanja',
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
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Rekap;
