import Select from 'react-select';
import { faChevronLeft, faChevronRight, faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrash from '@/components/Icon/IconTrash';
import { deleteAtribusi, getAtribusi, storeAtribusi } from '@/apis/Accountancy/PenyesuaianAsetDanBeban';
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

const Atribusi = (data: any) => {
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
    const [arrKodeRekening2, setArrKodeRekening2] = useState<any>([])
    const [arrKodeRekening3, setArrKodeRekening3] = useState<any>([])

    useEffect(() => {
        if (paramData[0]?.length > 0) {
            setInstances(paramData[0]);
        }
    }, [isMounted, paramData]);

    useEffect(() => {
        if (paramData[1]?.length > 0) {
            const arrKodeRekening = paramData[1].map((data: any, index: number) => {
                if (data.code_2 == 1 && data.code_3 == '01') {
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

            const arrKodeRekening2 = paramData[1].map((data: any, index: number) => {
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
            setArrKodeRekening2(arrKodeRekening2)

            const arrKodeRekening3 = paramData[1].map((data: any, index: number) => {
                if (data.code_2 == 2) {
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
            setArrKodeRekening3(arrKodeRekening3)
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
            getAtribusi(instance, periode?.id, year).then((res: any) => {
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
                                uraian_pekerjaan: '',

                                bel_peg_kode_rekening_id: '',
                                bel_peg_nama_rekening: '',
                                bel_peg_belanja_last_year: 0,
                                bel_peg_hutang_last_year: 0,
                                bel_peg_jumlah: 0,

                                bel_barjas_kode_rekening_id: '',
                                bel_barjas_nama_rekening_rincian_paket: '',
                                bel_barjas_belanja: 0,
                                bel_barjas_hutang: 0,
                                bel_barjas_jumlah: 0,

                                bel_modal_kode_rekening_id: '',
                                bel_modal_nama_rekening_rincian_paket: '',
                                bel_modal_belanja: 0,
                                bel_modal_hutang: 0,
                                bel_modal_jumlah: 0,

                                ket_no_kontrak_pegawai_barang_jasa: '',
                                ket_no_sp2d_pegawai_barang_jasa: '',

                                atri_aset_tetap_tanah: 0,
                                atri_aset_tetap_peralatan_mesin: 0,
                                atri_aset_tetap_gedung_bangunan: 0,
                                atri_aset_tetap_jalan_jaringan_irigasi: 0,
                                atri_aset_tetap_tetap_lainnya: 0,
                                atri_konstruksi_dalam_pekerjaan: 0,
                                atri_aset_lain_lain: 0,
                                atri_ket_no_kontrak_sp2d: '',
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
        bel_peg_belanja_last_year: 0,
        bel_peg_hutang_last_year: 0,
        bel_peg_jumlah: 0,

        bel_barjas_belanja: 0,
        bel_barjas_hutang: 0,
        bel_barjas_jumlah: 0,

        bel_modal_belanja: 0,
        bel_modal_hutang: 0,
        bel_modal_jumlah: 0,

        atri_aset_tetap_tanah: 0,
        atri_aset_tetap_peralatan_mesin: 0,
        atri_aset_tetap_gedung_bangunan: 0,
        atri_aset_tetap_jalan_jaringan_irigasi: 0,
        atri_aset_tetap_tetap_lainnya: 0,
        atri_konstruksi_dalam_pekerjaan: 0,
        atri_aset_lain_lain: 0,
    });

    const addDataInput = () => {
        const newData = {
            id: '',
            instance_id: instance ?? '',
            uraian_pekerjaan: '',

            bel_peg_kode_rekening_id: '',
            bel_peg_nama_rekening: '',
            bel_peg_belanja_last_year: 0,
            bel_peg_hutang_last_year: 0,
            bel_peg_jumlah: 0,

            bel_barjas_kode_rekening_id: '',
            bel_barjas_nama_rekening_rincian_paket: '',
            bel_barjas_belanja: 0,
            bel_barjas_hutang: 0,
            bel_barjas_jumlah: 0,

            bel_modal_kode_rekening_id: '',
            bel_modal_nama_rekening_rincian_paket: '',
            bel_modal_belanja: 0,
            bel_modal_hutang: 0,
            bel_modal_jumlah: 0,

            ket_no_kontrak_pegawai_barang_jasa: '',
            ket_no_sp2d_pegawai_barang_jasa: '',

            atri_aset_tetap_tanah: 0,
            atri_aset_tetap_peralatan_mesin: 0,
            atri_aset_tetap_gedung_bangunan: 0,
            atri_aset_tetap_jalan_jaringan_irigasi: 0,
            atri_aset_tetap_tetap_lainnya: 0,
            atri_konstruksi_dalam_pekerjaan: 0,
            atri_aset_lain_lain: 0,
            atri_ket_no_kontrak_sp2d: '',
        }
        setDataInput((prevData: any) => [...prevData, newData]);
        setIsUnsaved(true);
        setMaxPage(Math.ceil((dataInput.length + 1) / perPage));
        setPage(Math.ceil((dataInput.length + 1) / perPage));
    }

    const updatedData = (data: any, index: number) => {
        setDataInput((prevData: any) => {
            const updated = [...prevData];

            const keysToSumBelPeg = ['bel_peg_belanja_last_year', 'bel_peg_hutang_last_year'];
            const sumBelPeg = keysToSumBelPeg.reduce((acc, key) => acc + (parseFloat(data[index][key]) || 0), 0);
            updated[index]['bel_peg_jumlah'] = sumBelPeg;

            const keyToSumBelBarjas = ['bel_barjas_belanja', 'bel_barjas_hutang'];
            const sumBelBarjas = keyToSumBelBarjas.reduce((acc, key) => acc + (parseFloat(data[index][key]) || 0), 0);
            updated[index]['bel_barjas_jumlah'] = sumBelBarjas;

            const keyToSumBelModal = ['bel_modal_belanja', 'bel_modal_hutang'];
            const sumBelModal = keyToSumBelModal.reduce((acc, key) => acc + (parseFloat(data[index][key]) || 0), 0);
            updated[index]['bel_modal_jumlah'] = sumBelModal;

            // const keysToSumAtri = [
            //     'atri_aset_tetap_tanah',
            //     'atri_aset_tetap_peralatan_mesin',
            //     'atri_aset_tetap_gedung_bangunan',
            //     'atri_aset_tetap_jalan_jaringan_irigasi',
            //     'atri_aset_tetap_tetap_lainnya',
            //     'atri_konstruksi_dalam_pekerjaan',
            //     'atri_aset_lain_lain'
            // ];
            // const sumAtri = keysToSumAtri.reduce((acc, key) => acc + (data[index][key] || 0), 0);
            // updated[index]['atri_jumlah'] = sumAtri;
            return updated;
        })
        setIsUnsaved(true);
    }

    useEffect(() => {
        if (isMounted && dataInput.length > 0) {
            setTotalData((prev: any) => {
                const updated = { ...prev };
                updated['bel_peg_belanja_last_year'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.bel_peg_belanja_last_year), 0);
                updated['bel_peg_hutang_last_year'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.bel_peg_hutang_last_year), 0);
                updated['bel_peg_jumlah'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.bel_peg_jumlah), 0);

                updated['bel_barjas_belanja'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.bel_barjas_belanja), 0);
                updated['bel_barjas_hutang'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.bel_barjas_hutang), 0);
                updated['bel_barjas_jumlah'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.bel_barjas_jumlah), 0);

                updated['bel_modal_belanja'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.bel_modal_belanja), 0);
                updated['bel_modal_hutang'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.bel_modal_hutang), 0);
                updated['bel_modal_jumlah'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.bel_modal_jumlah), 0);

                updated['atri_aset_tetap_tanah'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.atri_aset_tetap_tanah), 0);
                updated['atri_aset_tetap_peralatan_mesin'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.atri_aset_tetap_peralatan_mesin), 0);
                updated['atri_aset_tetap_gedung_bangunan'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.atri_aset_tetap_gedung_bangunan), 0);
                updated['atri_aset_tetap_jalan_jaringan_irigasi'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.atri_aset_tetap_jalan_jaringan_irigasi), 0);
                updated['atri_aset_tetap_tetap_lainnya'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.atri_aset_tetap_tetap_lainnya), 0);
                updated['atri_konstruksi_dalam_pekerjaan'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.atri_konstruksi_dalam_pekerjaan), 0);
                updated['atri_aset_lain_lain'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.atri_aset_lain_lain), 0);
                return updated;
            })
        }
    }, [isMounted, dataInput])

    const save = () => {
        setIsSaving(true);
        storeAtribusi(dataInput, periode?.id, year).then((res: any) => {
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
        deleteAtribusi(id).then((res: any) => {
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
                    item.uraian_pekerjaan?.toLowerCase().includes(e.toLowerCase()) ||
                    item.instance?.alias?.toLowerCase().includes(e.toLowerCase()) ||
                    item.instance?.code?.toLowerCase().includes(e.toLowerCase()) ||
                    item.kode_rekening_barjas?.fullcode?.toString().toLowerCase().includes(e.toLowerCase()) ||
                    item.kode_rekening_barjas?.fullcode?.toString().toLowerCase().includes(e.toLowerCase()) ||
                    item.kode_rekening_modal?.name?.toString().toLowerCase().includes(e.toLowerCase()) ||
                    item.kode_rekening_modal?.name?.toString().toLowerCase().includes(e.toLowerCase()) ||
                    item.kode_rekening_pegawai?.name?.toString().toLowerCase().includes(e.toLowerCase()) ||
                    item.kode_rekening_pegawai?.name?.toString().toLowerCase().includes(e.toLowerCase()) ||
                    item.ket_no_kontrak_pegawai_barang_jasa?.toLowerCase().includes(e.toLowerCase()) ||
                    item.ket_no_sp2d_pegawai_barang_jasa?.toLowerCase().includes(e.toLowerCase()) ||
                    item.bel_modal_nama_rekening_rincian_paket?.toLowerCase().includes(e.toLowerCase()) ||
                    item.bel_barjas_nama_rekening_rincian_paket?.toLowerCase().includes(e.toLowerCase())
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
                            {([9].includes(CurrentUser?.role_id) == false) && (
                                <th rowSpan={2}
                                    className='border text-center whitespace-nowrap'>
                                    Nama Perangkat Daerah
                                </th>
                            )}
                            <th rowSpan={2}
                                className='border text-center whitespace-nowrap'>
                                Uraian Pekerjaan
                            </th>

                            {/* <th colSpan={5}
                                className="text-center">
                                Belanja Pegawai
                            </th> */}
                            <th rowSpan={1}
                                className='border !bg-white !px-2'></th>
                            <th colSpan={5}
                                className="text-center">
                                Belanja Barang dan Jasa
                            </th>
                            <th rowSpan={1}
                                className='border !bg-white !px-2'></th>
                            <th colSpan={5}
                                className="text-center">
                                Belanja Modal
                            </th>
                            <th rowSpan={1}
                                className='border !bg-white !px-2'></th>
                            <th colSpan={2}
                                className="bg-green-300 text-center !text-slate-900">
                                Keterangan
                            </th>
                            <th rowSpan={1}
                                className='border !bg-white !px-2'></th>
                            <th colSpan={7}
                                className="bg-yellow-300 text-center !text-slate-900">
                                Atribusi/ Kapitalisasi ke Kelompok Aset (Rp)
                            </th>
                            {/* <th rowSpan={2}
                                className='bg-yellow-300 border text-center !text-slate-900 whitespace-nowrap'>
                                Keterangan - No Kontrak/ No SP2D
                            </th> */}
                        </tr>
                        <tr className='!bg-slate-900 !text-white left-0 sticky top-[45px] z-[1]'>
                            {/* <th className='border text-center whitespace-nowrap'>
                                Kode Rekening
                            </th>
                            <th className='border text-center whitespace-nowrap'>
                                Nama Rekening
                            </th>
                            <th className='border text-center whitespace-nowrap'>
                                Belanja {year} (Rp)
                            </th>
                            <th className='border text-center whitespace-nowrap'>
                                Hutang {year} (Rp)
                            </th>
                            <th className='border text-center whitespace-nowrap'>
                                Jumlah (Rp)
                            </th> */}

                            <th className='border !bg-white !px-2'></th>

                            <th className='border text-center whitespace-nowrap'>
                                Kode Rekening
                            </th>
                            <th className='border text-center whitespace-nowrap'>
                                Nama Rekening & Rincian Paket Pekerjaannya
                            </th>
                            <th className='border text-center whitespace-nowrap'>
                                Belanja {year} (Rp)
                            </th>
                            <th className='border text-center whitespace-nowrap'>
                                Hutang {year} (Rp)
                            </th>
                            <th className='border text-center whitespace-nowrap'>
                                Jumlah (Rp)
                            </th>

                            <th className='border !bg-white !px-2'></th>

                            <th className='border text-center whitespace-nowrap'>
                                Kode Rekening & Rincian Paket Pekerjaannya
                            </th>
                            <th className='border text-center whitespace-nowrap'>
                                Nama Rekening
                            </th>
                            <th className='border text-center whitespace-nowrap'>
                                Belanja {year} (Rp)
                            </th>
                            <th className='border text-center whitespace-nowrap'>
                                Hutang {year} (Rp)
                            </th>
                            <th className='border text-center whitespace-nowrap'>
                                Jumlah (Rp)
                            </th>

                            <th className='border !bg-white !px-2'></th>

                            <th className='bg-green-300 border text-center !text-slate-900 whitespace-nowrap'>
                                No Kontrak Pegawai / Barang Jasa
                            </th>
                            <th className='bg-green-300 border text-center !text-slate-900 whitespace-nowrap'>
                                No SP2D Pegawai / Barang Jasa
                            </th>

                            <th className='border !bg-white !px-2'></th>

                            <th className='bg-yellow-300 border text-center !text-slate-900 whitespace-nowrap'>
                                Aset Tetap Tanah
                            </th>
                            <th className='bg-yellow-300 border text-center !text-slate-900 whitespace-nowrap'>
                                Aset Tetap Peralatan dan Mesin
                            </th>
                            <th className='bg-yellow-300 border text-center !text-slate-900 whitespace-nowrap'>
                                Aset Tetap Gedung dan Bangunan
                            </th>
                            <th className='bg-yellow-300 border text-center !text-slate-900 whitespace-nowrap'>
                                Aset Tetap Jalan Jaringan Irigasi
                            </th>
                            <th className='bg-yellow-300 border text-center !text-slate-900 whitespace-nowrap'>
                                Aset Tetap Lainnya
                            </th>
                            <th className='bg-yellow-300 border text-center !text-slate-900 whitespace-nowrap'>
                                Konstruksi Dalam Pekerjaan
                            </th>
                            <th className='bg-yellow-300 border text-center !text-slate-900 whitespace-nowrap'>
                                Aset Lain-lain
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

                                        {/* Uraian Pekerjaan */}
                                        <td className="border">
                                            <div className="">
                                                <div className="flex">
                                                    <textarea
                                                        disabled={isSaving == true}
                                                        placeholder="Uraian Pekerjaan"
                                                        className="form-input min-h-[40px] min-w-[250px] placeholder:font-normal resize-none"
                                                        value={input.uraian_pekerjaan}
                                                        onChange={(e: any) => {
                                                            setDataInput((prev: any) => {
                                                                const updated = [...prev];
                                                                updated[index]['uraian_pekerjaan'] = e?.target?.value;
                                                                return updated;
                                                            })
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        {/* BELANJA PEGAWAI */}
                                        {/* Kode Rekening */}
                                        {/* <td className='border'>
                                            <div className="flex gap-2 items-center">
                                                <Select placeholder="Pilih Kode Rekening"
                                                    isDisabled={isSaving == true}
                                                    className='min-w-[400px]'
                                                    onChange={(e: any) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['bel_peg_kode_rekening_id'] = e?.value;
                                                            updated[index]['bel_peg_nama_rekening'] = arrKodeRekening?.filter((data: any, index: number) => data?.id === e.value)[0].name
                                                            return updated;
                                                        })
                                                    }}
                                                    value={
                                                        arrKodeRekening?.map((data: any, index: number) => {
                                                            if (data.id == input.bel_peg_kode_rekening_id) {
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
                                        </td> */}

                                        {/* Nama Barang / Pekerjaan */}
                                        {/* <td className='border'>
                                            <div className="">
                                                <div className="flex">
                                                    <input
                                                        disabled={isSaving == true}
                                                        type="text"
                                                        placeholder="Nama Barang / Pekerjaan"
                                                        className="form-input min-w-[250px] placeholder:font-normal"
                                                        value={input.bel_peg_nama_rekening}
                                                        onChange={(e: any) => {
                                                            setDataInput((prev: any) => {
                                                                const updated = [...prev];
                                                                updated[index]['bel_peg_nama_rekening'] = e?.target?.value;
                                                                return updated;
                                                            })
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </td> */}

                                        {/* Belanja Last Year */}
                                        {/* <td className='border'>
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.bel_peg_belanja_last_year}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['bel_peg_belanja_last_year'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td> */}

                                        {/* Hutang Last Year */}
                                        {/* <td className='border'>
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.bel_peg_hutang_last_year}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['bel_peg_hutang_last_year'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td> */}

                                        {/* Belanja Pegawai Jumlah */}
                                        {/* <td className='border'>
                                            <InputRupiah
                                                // isDisabled={isSaving == true}
                                                readOnly={true}
                                                dataValue={input.bel_peg_jumlah}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['bel_peg_jumlah'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td> */}


                                        <td className='bg-white !px-2'>
                                            {/* Separator */}
                                        </td>

                                        {/* BELANJA BARANG DAN JASA */}
                                        <td className='border'>
                                            {/* Kode Rekening */}
                                            <Select placeholder="Pilih Kode Rekening"
                                                className='min-w-[400px]'
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['bel_barjas_kode_rekening_id'] = e?.value;
                                                        updated[index]['bel_barjas_nama_rekening_rincian_paket'] = arrKodeRekening2?.filter((data: any, index: number) => data?.id === e.value)[0].name
                                                        return updated;
                                                    })
                                                }}
                                                value={
                                                    arrKodeRekening2?.map((data: any, index: number) => {
                                                        if (data.id == input.bel_barjas_kode_rekening_id) {
                                                            return {
                                                                value: data.id,
                                                                label: data.fullcode + ' - ' + data.name,
                                                            }
                                                        }
                                                    })
                                                }
                                                options={
                                                    arrKodeRekening2?.map((data: any, index: number) => {
                                                        return {
                                                            value: data.id,
                                                            label: data.fullcode + ' - ' + data.name,
                                                        }
                                                    })
                                                } />
                                        </td>

                                        <td className='border'>
                                            {/* Nama Barang / Pekerjaan */}
                                            <div className="">
                                                <div className="flex">
                                                    <input
                                                        disabled={isSaving == true}
                                                        type="text"
                                                        placeholder="Nama Barang / Pekerjaan"
                                                        className="form-input min-w-[250px] placeholder:font-normal"
                                                        value={input.bel_barjas_nama_rekening_rincian_paket}
                                                        onChange={(e: any) => {
                                                            setDataInput((prev: any) => {
                                                                const updated = [...prev];
                                                                updated[index]['bel_barjas_nama_rekening_rincian_paket'] = e?.target?.value;
                                                                return updated;
                                                            })
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        <td className='border'>
                                            {/* Belanja */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.bel_barjas_belanja}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['bel_barjas_belanja'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>

                                        <td className='border'>
                                            {/* Hutang Last Year */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.bel_barjas_hutang}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['bel_barjas_hutang'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>

                                        <td className='border'>
                                            {/* Belanja Pegawai Jumlah */}
                                            <InputRupiah
                                                // isDisabled={isSaving == true}
                                                readOnly={true}
                                                dataValue={input.bel_barjas_jumlah}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['bel_barjas_jumlah'] = value;
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

                                        {/* BELANJA MODAL */}
                                        <td className='border'>
                                            {/* Kode Rekening */}
                                            <div className="">
                                                <Select placeholder="Pilih Kode Rekening"
                                                    className='min-w-[400px]'
                                                    onChange={(e: any) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['bel_modal_kode_rekening_id'] = e?.value;
                                                            updated[index]['bel_modal_nama_rekening_rincian_paket'] = arrKodeRekening3?.filter((data: any, index: number) => data?.id === e.value)[0].name
                                                            return updated;
                                                        })
                                                    }}
                                                    value={
                                                        arrKodeRekening3?.map((data: any, index: number) => {
                                                            if (data.id == input.bel_modal_kode_rekening_id) {
                                                                return {
                                                                    value: data.id,
                                                                    label: data.fullcode + ' - ' + data.name,
                                                                }
                                                            }
                                                        })
                                                    }
                                                    options={
                                                        arrKodeRekening3?.map((data: any, index: number) => {
                                                            return {
                                                                value: data.id,
                                                                label: data.fullcode + ' - ' + data.name,
                                                            }
                                                        })
                                                    } />
                                            </div>
                                        </td>

                                        <td className='border'>
                                            {/* Nama Barang / Pekerjaan */}
                                            <div className="">
                                                <div className="flex">
                                                    <input
                                                        disabled={isSaving == true}
                                                        type="text"
                                                        placeholder="Nama Barang / Pekerjaan"
                                                        className="form-input min-w-[250px] placeholder:font-normal"
                                                        value={input.bel_modal_nama_rekening_rincian_paket}
                                                        onChange={(e: any) => {
                                                            setDataInput((prev: any) => {
                                                                const updated = [...prev];
                                                                updated[index]['bel_modal_nama_rekening_rincian_paket'] = e?.target?.value;
                                                                return updated;
                                                            })
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        <td className='border'>
                                            {/* Belanja */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.bel_modal_belanja}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['bel_modal_belanja'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>

                                        <td className='border'>
                                            {/* Hutang Last Year */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.bel_modal_hutang}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['bel_modal_hutang'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>

                                        <td className='border'>
                                            {/* Belanja Pegawai Jumlah */}
                                            <InputRupiah
                                                // isDisabled={isSaving == true}
                                                readOnly={true}
                                                dataValue={input.bel_modal_jumlah}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['bel_modal_jumlah'] = value;
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

                                        {/* KETERANGAN */}
                                        <td className='border'>
                                            {/* Nomor Kontrak Pegawai / Barang Jasa */}
                                            <div className="">
                                                <div className="flex">
                                                    <input
                                                        disabled={isSaving == true}
                                                        type="text"
                                                        placeholder="Nomor Kontrak Pegawai / Barang Jasa"
                                                        className="form-input min-w-[250px] placeholder:font-normal"
                                                        value={input.ket_no_kontrak_pegawai_barang_jasa}
                                                        onChange={(e: any) => {
                                                            setDataInput((prev: any) => {
                                                                const updated = [...prev];
                                                                updated[index]['ket_no_kontrak_pegawai_barang_jasa'] = e?.target?.value;
                                                                return updated;
                                                            })
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        <td className='border'>
                                            {/* Nomor SP2D Pegawai / Barang Jasa */}
                                            <div className="">
                                                <div className="flex">
                                                    <input
                                                        disabled={isSaving == true}
                                                        type="text"
                                                        placeholder="Nomor SP2D Pegawai / Barang Jasa"
                                                        className="form-input min-w-[250px] placeholder:font-normal"
                                                        value={input.ket_no_sp2d_pegawai_barang_jasa}
                                                        onChange={(e: any) => {
                                                            setDataInput((prev: any) => {
                                                                const updated = [...prev];
                                                                updated[index]['ket_no_sp2d_pegawai_barang_jasa'] = e?.target?.value;
                                                                return updated;
                                                            })
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        <td className='bg-white !px-2'>
                                            {/* Separator */}
                                        </td>


                                        {/* ATRIBUSI */}
                                        <td className='border'>
                                            {/* Aset Tetap Tanah */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.atri_aset_tetap_tanah}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['atri_aset_tetap_tanah'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border'>
                                            {/* Aset Tetap Peralatan dan Mesin */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.atri_aset_tetap_peralatan_mesin}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['atri_aset_tetap_peralatan_mesin'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border'>
                                            {/* Aset Tetap Gedung dan Bangunan */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.atri_aset_tetap_gedung_bangunan}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['atri_aset_tetap_gedung_bangunan'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border'>
                                            {/* Aset Tetap Jalan Jaringan Irigasi */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.atri_aset_tetap_jalan_jaringan_irigasi}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['atri_aset_tetap_jalan_jaringan_irigasi'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border'>
                                            {/* Aset Tetap Lainnya */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.atri_aset_tetap_tetap_lainnya}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['atri_aset_tetap_tetap_lainnya'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border'>
                                            {/* Konstruksi Dalam Pekerjaan */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.atri_konstruksi_dalam_pekerjaan}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['atri_konstruksi_dalam_pekerjaan'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border'>
                                            {/* Aset Lain-lain */}
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={input.atri_aset_lain_lain}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['atri_aset_lain_lain'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        {/* Keterangan Nomor Kontrak / SP2D */}
                                        {/* <td className='border'>
                                            <div className="">
                                                <div className="flex">
                                                    <input
                                                        disabled={isSaving == true}
                                                        type="text"
                                                        placeholder="Keterangan Nomor Kontrak / SP2D"
                                                        className="form-input min-w-[250px]"
                                                        value={input.atri_ket_no_kontrak_sp2d}
                                                        onChange={(e: any) => {
                                                            setDataInput((prev: any) => {
                                                                const updated = [...prev];
                                                                updated[index]['atri_ket_no_kontrak_sp2d'] = e?.target?.value;
                                                                updatedData(updated, index);
                                                                return updated;
                                                            })
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </td> */}
                                    </tr>
                                )}
                            </>
                        ))}


                        <tr className='!bg-slate-400'>
                            <td colSpan={([9].includes(CurrentUser?.role_id) == false) ? 2 : 0} className='!bg-slate-300'></td>
                            <td className='text-end !bg-slate-300'></td>
                            <td className='text-end !bg-slate-300 font-semibold left-0 sticky'>
                                Jumlah :
                            </td>

                            {/* <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.bel_peg_belanja_last_year)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.bel_peg_hutang_last_year)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.bel_peg_jumlah)}
                            </td> */}

                            <td colSpan={0} className='!bg-slate-300'></td>

                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.bel_barjas_belanja)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.bel_barjas_hutang)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.bel_barjas_jumlah)}
                            </td>

                            <td colSpan={3} className='!bg-slate-300'></td>

                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.bel_modal_belanja)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.bel_modal_hutang)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.bel_modal_jumlah)}
                            </td>

                            <td colSpan={4} className='!bg-slate-300'></td>

                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.atri_aset_tetap_tanah)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.atri_aset_tetap_peralatan_mesin)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.atri_aset_tetap_gedung_bangunan)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.atri_aset_tetap_jalan_jaringan_irigasi)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.atri_aset_tetap_tetap_lainnya)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.atri_konstruksi_dalam_pekerjaan)}
                            </td>
                            <td className='text-end !bg-slate-300 font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.atri_aset_lain_lain)}
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
                                    type: 'atribusi',
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
export default Atribusi;
