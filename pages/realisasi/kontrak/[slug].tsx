import { useEffect, useState, Fragment, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import { setPageTitle } from '../../../store/themeConfigSlice';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';
import Dropdown from '../../../components/Dropdown';
import Swal from 'sweetalert2';
import Link from 'next/link';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
const angkaTerbilang = require('@develoka/angka-terbilang-js');

import { fetchPeriodes } from '@/apis/fetchdata';
import {
    fetchDataInformasiSubKegiatan,
    fetchKodeRekening,
    fetchDataKontrak,
    saveKontrak,
    detailKontrak,
    updateKontrak,
    deleteKontrak,
} from '@/apis/fetchRealisasi';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconX from '@/components/Icon/IconX';
import IconInfoHexagon from '@/components/Icon/IconInfoHexagon';
import IconPlus from '@/components/Icon/IconPlus';
import IconSave from '@/components/Icon/IconSave';
import IconTrash from '@/components/Icon/IconTrash';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconPlusCircle from '@/components/Icon/IconPlusCircle';
import IconEdit from '@/components/Icon/IconEdit';
import IconNotesEdit from '@/components/Icon/IconNotesEdit';
import IconFolderPlus from '@/components/Icon/IconFolderPlus';
import IconUserPlus from '@/components/Icon/IconUserPlus';

const showAlert = async (icon: any, text: any) => {
    const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
    });
    toast.fire({
        icon: icon,
        title: text,
        padding: '10px 20px',
    });
};


const Index = () => {
    const dispatch = useDispatch();
    const ref = useRef<any>(null);

    useEffect(() => {
        dispatch(setPageTitle('Realisasi Kinerja'));
    });

    const route = useRouter();

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [CurrentUser, setCurrentUser] = useState<any>([]);
    useEffect(() => {
        if (document.cookie) {
            let user = document.cookie.split(';').find((row) => row.trim().startsWith('user='))?.split('=')[1];
            user = user ? JSON.parse(user) : null;
            setCurrentUser(user);
        }
    }, [isMounted]);

    const { t, i18n } = useTranslation();

    const [periodes, setPeriodes] = useState([]);
    const [periode, setPeriode] = useState(1);
    const [rawKodeRekening, setRawKodeRekening] = useState<any>([]);

    const [satuans, setSatuans] = useState<any>([]);
    const [subKegiatan, setSubKegiatan] = useState<any>(null);
    const [year, setYear] = useState<any>(null);
    const [month, setMonth] = useState<any>(null);
    const [rekeningOptions1, setRekeningOptions1] = useState<any>([]);
    const [rekeningOptions2, setRekeningOptions2] = useState<any>([]);
    const [rekeningOptions3, setRekeningOptions3] = useState<any>([]);
    const [rekeningOptions4, setRekeningOptions4] = useState<any>([]);
    const [rekeningOptions5, setRekeningOptions5] = useState<any>([]);
    const [rekeningOptions6, setRekeningOptions6] = useState<any>([]);
    const [rekeningOptionsEdit, setRekeningOptionsEdit] = useState<any>([]);
    const [view, setView] = useState('kontrak');
    const [showInput, setShowInput] = useState<any>(false)
    const [modalInput, setModalInput] = useState(false);
    const [inputDisabled, setInputDisabled] = useState<boolean>(false);

    const [datas, setDatas] = useState<any>(null);
    const [dataKontrak, setDataKontrak] = useState<any>(null);

    useEffect(() => {
        fetchPeriodes().then((data) => {
            if (data.status == 'success') {
                setPeriodes(data.data);
            }
        });
        fetchKodeRekening(1).then((data) => {
            if (data.status == 'success') {
                setRawKodeRekening(data.data);
                setRekeningOptions1(data.data.map((data: any) => {
                    return {
                        value: data.id,
                        label: data.fullcode + ' - ' + data.name,
                    };
                }));
            }
        });
    }, [CurrentUser, periode]);

    useEffect(() => {
        setSubKegiatan({
            id: route.query.slug,
        });
        setYear(route.query.year ?? new Date().getFullYear());
        setMonth(route.query.month ?? new Date().getMonth());
    }, [route.query.slug]);

    useEffect(() => {
        if (subKegiatan?.id && year && month) {
            fetchDataInformasiSubKegiatan(subKegiatan?.id, periode, year, month).then((res) => {
                if (res.status == 'success') {
                    setDatas(res.data);
                }
                if (res.status != 'success') {
                    showAlert('error', res.message);
                    setInputDisabled(true);
                }
            });

            fetchDataKontrak(subKegiatan?.id, periode, year, month).then((res) => {
                if (res.status == 'success') {
                    setDataKontrak(res.data);
                    if (dataKontrak?.filter((data: any) => data.type == 'detail').length > 0) {
                        if (res.data.length > 0) {
                            let data = res.data;
                            let dataLength = data.length;
                            let dataLast = data[dataLength - 1];
                            while (dataLast.type != 'detail') {
                                data.pop();
                                dataLength = data.length;
                                dataLast = data[dataLength - 1];
                            }
                            setDataKontrak(data);
                        }
                    }
                }
                if (res.status != 'success') {
                    showAlert('error', res.message);
                    setDataKontrak([]);
                    setInputDisabled(true);
                }
            });
        }
    }, [subKegiatan?.id]);

    // console.log(dataKontrak)

    const [newInput, setNewInput] = useState<any>([
        {
            level: 1,
            rek_id: 1,
            kode_rek: rekeningOptions1.filter((data: any) => data.value == 1)[0]?.label,
        },
    ]);

    const [inputDatas, setInputDatas] = useState<any>([]);
    const [inputType, setInputType] = useState<any>('create');
    const [dataEdit, setDataEdit] = useState<any>(null);
    const [judulUraian, setJudulUraian] = useState<any>(null);
    const [inputUraian, setInputUraian] = useState<any>([]);
    const [optionKontrak, setOptionKontrak] = useState<any>([]);

    useEffect(() => {
        setOptionKontrak(
            {
                'Barang': [
                    { value: 'Penunjukan Langsung', label: 'Penunjukan Langsung' },
                    { value: 'Lelang', label: 'Lelang' },
                    { value: 'E-Purchasing', label: 'E-Purchasing' },
                    { value: 'Pengawasan', label: 'Pengawasan' },
                    { value: 'Perencanaan', label: 'Perencanaan' },
                    { value: 'Swakelola', label: 'Swakelola' },
                ],
                'Jasa Konsultasi': [
                    { value: 'Penunjukan Langsung', label: 'Penunjukan Langsung' },
                    { value: 'Lelang', label: 'Lelang' },
                ],
                'Pekerjaan Konstruksi': [
                    { value: 'Swakelola', label: 'Swakelola' },
                ],
                'Jasa Lainnya': [
                    { value: 'E-Purchasing', label: 'E-Purchasing' },
                ],
            }
        );
    }, []);

    // useEffect(() => {
    //     const handleOutSideClick = (event: any) => {
    //         if (!ref.current?.contains(event.target)) {
    //             setShowInput(false);
    //             setNewInput([]);
    //         }
    //     };
    //     window.addEventListener("mousedown", handleOutSideClick);
    //     return () => {
    //         window.removeEventListener("mousedown", handleOutSideClick);
    //     };
    // }, [ref]);


    const temporaryInsert = (level: number, value: any) => {
        if (inputDisabled) {
            showAlert('error', 'Input dinonaktifkan');
            return;
        }

        if (level == 1) {
            setNewInput((prev: any) => {
                const index = 0;
                const updated = [...prev];
                updated[index] = {
                    level: level,
                    rek_id: value,
                    kode_rek: rekeningOptions1.filter((data: any) => data.value == value)[0]?.label,
                };
                return updated;
            });

            fetchKodeRekening(2, value).then((data) => {
                if (data.status == 'success') {
                    setRekeningOptions2(data.data.map((data: any) => {
                        return {
                            value: data.id,
                            label: data.fullcode + ' - ' + data.name,
                        };
                    }));
                }
            });

            if (newInput?.[1]?.rek_id) {
                setNewInput(newInput.filter((data: any, index: number) => index < 1));
            }
        }

        if (level == 2) {
            setNewInput((prev: any) => {
                const index = 1;
                const updated = [...prev];
                updated[index] = {
                    level: level,
                    rek_id: value,
                    kode_rek: rekeningOptions2.filter((data: any) => data.value == value)[0]?.label,
                };
                return updated;
            });

            fetchKodeRekening(3, value).then((data) => {
                if (data.status == 'success') {
                    setRekeningOptions3(data.data.map((data: any) => {
                        return {
                            value: data.id,
                            label: data.fullcode + ' - ' + data.name,
                        };
                    }));
                }
            });

            if (newInput?.[2]?.rek_id) {
                setNewInput(newInput.filter((data: any, index: number) => index < 2));
            }
        }

        if (level == 3) {
            fetchKodeRekening(4, value).then((data) => {
                if (data.status == 'success') {
                    setRekeningOptions4(data.data.map((data: any) => {
                        return {
                            value: data.id,
                            label: data.fullcode + ' - ' + data.name,
                        };
                    }));
                }
            });

            setNewInput((prev: any) => {
                const index = 2;
                const updated = [...prev];
                updated[index] = {
                    level: level,
                    rek_id: value,
                    kode_rek: rekeningOptions3.filter((data: any) => data.value == value)[0]?.label,
                };
                return updated;
            });

            if (newInput?.[3]?.rek_id) {
                setNewInput(newInput.filter((data: any, index: number) => index < 3));
            }
        }

        if (level == 4) {
            setNewInput((prev: any) => {
                const index = 3;
                const updated = [...prev];
                updated[index] = {
                    level: level,
                    rek_id: value,
                    kode_rek: rekeningOptions4.filter((data: any) => data.value == value)[0]?.label,
                };
                return updated;
            });

            fetchKodeRekening(5, value).then((data) => {
                if (data.status == 'success') {
                    setRekeningOptions5(data.data.map((data: any) => {
                        return {
                            value: data.id,
                            label: data.fullcode + ' - ' + data.name,
                        };
                    }));
                }
            });

            if (newInput?.[4]?.rek_id) {
                setNewInput(newInput.filter((data: any, index: number) => index < 4));
            }
        }

        if (level == 5) {
            setNewInput((prev: any) => {
                const index = 4;
                const updated = [...prev];
                updated[index] = {
                    level: level,
                    rek_id: value,
                    kode_rek: rekeningOptions5.filter((data: any) => data.value == value)[0]?.label,
                };
                return updated;
            });

            fetchKodeRekening(6, value).then((data) => {
                if (data.status == 'success') {
                    setRekeningOptions6(data.data.map((data: any) => {
                        return {
                            value: data.id,
                            label: data.fullcode + ' - ' + data.name,
                        };
                    }));
                }
            });

            if (newInput?.[5]?.rek_id) {
                setNewInput(newInput.filter((data: any, index: number) => index < 5));
            }
        }

        if (level == 6) {
            setNewInput((prev: any) => {
                const index = 5;
                const updated = [...prev];
                updated[index] = {
                    level: level,
                    rek_id: value,
                    kode_rek: rekeningOptions6.filter((data: any) => data.value == value)[0]?.label,
                };
                return updated;
            });

            setJudulUraian(null);
            const uraian = [
                {
                    uraian: null,
                    jenis_pengadaan: null,
                    jenis_kontrak: null,
                    nomor_kontrak: null,
                    nilai_kontrak: null,
                    tanggal_kontrak: null,
                    tahap_pembayaran: null,
                    jangka_waktu_pelaksanaan: null,
                    status: null,
                }
            ];
            setInputUraian(uraian);
        }
    }

    const addNewUraian = () => {
        if (inputDisabled) {
            showAlert('error', 'Input dinonaktifkan');
            return;
        }
        setInputUraian((prev: any) => {
            const updated = [...prev];
            updated.push({
                uraian: null,
                jenis_pengadaan: null,
                jenis_kontrak: null,
                nomor_kontrak: null,
                nilai_kontrak: null,
                tanggal_kontrak: null,
                tahap_pembayaran: null,
                jangka_waktu_pelaksanaan: null,
                status: null,
            });
            return updated;
        });
    }

    const confirmDeleteUraian = (index: number) => {
        if (inputDisabled) {
            showAlert('error', 'Input dinonaktifkan');
            return;
        }
        Swal.fire({
            title: 'Apakah Anda Yakin?',
            text: 'Anda tidak akan dapat mengembalikan ini!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Tidak, Batalkan!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUraian(index);
            }
        });
    }

    const deleteUraian = (index: number) => {
        if (inputDisabled) {
            showAlert('error', 'Input dinonaktifkan');
            return;
        }
        setInputUraian(inputUraian.filter((data: any, i: number) => i !== index));
    }

    const editData = (id: any) => {
        if (inputDisabled) {
            showAlert('error', 'Input dinonaktifkan');
            return;
        }
        setInputType('update');
        detailKontrak(id, periode, year, month).then((res) => {
            const data = res.data;
            setShowInput(true);
            setInputType('edit');
            setDataEdit(data?.id);
            setNewInput([]);
            temporaryInsert(1, data?.rek_id_1);
            temporaryInsert(2, data?.rek_id_2);
            temporaryInsert(3, data?.rek_id_3);
            temporaryInsert(4, data?.rek_id_4);
            temporaryInsert(5, data?.rek_id_5);
            temporaryInsert(6, data?.rek_id_6);

            setRekeningOptionsEdit([
                {
                    'label': data?.kode_rek_1 + ' - ' + data?.kode_rek_1_uraian,
                },
                {
                    'label': data?.kode_rek_2 + ' - ' + data?.kode_rek_2_uraian,
                },
                {
                    'label': data?.kode_rek_3 + ' - ' + data?.kode_rek_3_uraian,
                },
                {
                    'label': data?.kode_rek_4 + ' - ' + data?.kode_rek_4_uraian,
                },
                {
                    'label': data?.kode_rek_5 + ' - ' + data?.kode_rek_5_uraian,
                },
                {
                    'label': data?.kode_rek_6 + ' - ' + data?.kode_rek_6_uraian,
                },
            ]);
            setInputUraian([
                {
                    uraian: data?.uraian,
                    jenis_pengadaan: data?.jenis_pengadaan,
                    jenis_kontrak: data?.jenis_kontrak,
                    nomor_kontrak: data?.nomor_kontrak,
                    nilai_kontrak: new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(data?.nilai_kontrak),
                    tanggal_kontrak: data?.tanggal_kontrak,
                    tahap_pembayaran: data?.tahap_pembayaran,
                    jangka_waktu_pelaksanaan: data?.jangka_waktu_pelaksanaan,
                    status: data?.status,
                }
            ]);
        });

    }

    const saveData = () => {
        if (inputDisabled) {
            showAlert('error', 'Input dinonaktifkan');
            return;
        }
        let FormData = {
            sub_kegiatan_id: subKegiatan?.id,
            periode: periode,
            year: year,
            month: month,
            rekenings: newInput,
            uraians: inputUraian,
        };
        if (inputType == 'create' || inputType == 'create2') {
            saveKontrak(FormData).then((res) => {
                if (res.status == 'success') {
                    showAlert('success', 'Data berhasil disimpan');
                    setInputUraian([]);
                    setShowInput(false);
                    fetchDataKontrak(subKegiatan?.id, periode, year, month).then((res) => {
                        setDataKontrak(res.data);
                    });
                }
                else {
                    // showAlert('error', 'Data gagal disimpan');
                    showAlert('error', res?.message);
                }
            });
        }

        if (inputType == 'edit') {
            updateKontrak(dataEdit, FormData, periode, year, month).then((res) => {
                if (res.status == 'success') {
                    showAlert('success', res.message);
                    setDataEdit(null);
                    setModalInput(false);
                    fetchDataKontrak(subKegiatan?.id, periode, year, month).then((res) => {
                        setDataKontrak(res.data);
                    });
                    setShowInput(false);
                }
                else {
                    showAlert('error', 'Data gagal disimpan');
                    showAlert('error', res?.message);
                }
            });
        }
    }

    const confirmDelete = async (id: any) => {
        if (inputDisabled) {
            showAlert('error', 'Input dinonaktifkan');
            return;
        }

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
                title: 'Hapus Pengguna?',
                text: "Apakah Anda yakin untuk menghapus Pengguna Ini!",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Tidak!',
                reverseButtons: true,
                padding: '2em',
            })
            .then((result) => {
                if (result.value) {
                    deleteKontrak(id, periode, year, month).then((res) => {
                        if (res.status == 'success') {
                            // showAlert('success', res.message);
                            fetchDataKontrak(subKegiatan?.id, periode, year, month).then((res) => {
                                setDataKontrak(res.data);
                            });
                            swalWithBootstrapButtons.fire('Terhapus!', res.message, 'success');
                        }
                        else {
                            showAlert('error', res.message);
                        }
                    });

                    // deleteDataRealisasiRincian(id, periode, year, month).then((data) => {
                    //     if (data.status == 'success') {
                    //         fetchDataRealisasi(subKegiatan?.id, periode, year, month).then((res) => {
                    //             setDataRealisasi(res.data);
                    //         });
                    //         swalWithBootstrapButtons.fire('Terhapus!', data.message, 'success');
                    //     }
                    //     if (data.status == 'error') {
                    //         showAlert('error', data.message);
                    //     }
                    // });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire('Batal', 'Batal menghapus pengguna', 'info');
                }
            });
    }

    return (
        <>

            {showInput == false && (
                <div className="lg:fixed lg:bottom-0 lg:left-0 w-full lg:bg-white lg:dark:bg-slate-800 lg:z-[49] lg:pl-24 lg:pr-16 lg:pt-2.5 lg:pb-5">
                    <div className="flex flex-wrap gap-y-2 items-center justify-between">
                        <h2 className="text-[14px] leading-6 font-semibold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                            {datas?.sub_kegiatan_fullcode ?? '\u00A0'} {datas?.sub_kegiatan_name ?? '\u00A0'}
                        </h2>
                        <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">

                            {(CurrentUser?.role_id == 1 || CurrentUser?.role_id == 2 || CurrentUser?.role_id == 3 || CurrentUser?.role_id == 4 || CurrentUser?.role_id == 5 || CurrentUser?.role_id == 6 || CurrentUser?.role_id == 7 || CurrentUser?.role_id == 8 || CurrentUser?.role_id == 9) && (
                                <>
                                    {view == 'informasi' && (
                                        <button
                                            type="button"
                                            className="btn btn-success whitespace-nowrap"
                                            onClick={() => {
                                                setView('kontrak');
                                                setNewInput([]);
                                            }} >
                                            <IconNotesEdit className="w-4 h-4" />
                                            <span className="ltr:ml-2 rtl:mr-2">
                                                Input Kontrak
                                            </span>
                                        </button>
                                    )}
                                    {view == 'kontrak' && (
                                        <>
                                            <button
                                                type="button"
                                                className={
                                                    showInput
                                                        ? 'btn btn-info whitespace-nowrap font-normal gap-x-1 transition-all duration-100 opacity-0 pointer-events-none w-[0px] p-0 m-0 overflow-hidden'
                                                        : 'btn btn-info whitespace-nowrap font-normal gap-x-1 transition-all duration-500'
                                                }
                                                onClick={() => {
                                                    setView('informasi');
                                                    setNewInput([]);
                                                }} >
                                                <IconInfoHexagon className="w-4 h-4" />
                                                <span className="ltr:ml-2 rtl:mr-2">
                                                    Informasi
                                                </span>
                                            </button>

                                            <button
                                                onClick={
                                                    () => {
                                                        if (inputDisabled) {
                                                            showAlert('error', 'Input dinonaktifkan');
                                                            return;
                                                        }
                                                        setShowInput(true);
                                                        setInputType('create');
                                                        setDataEdit(null);
                                                        setNewInput([]);
                                                        setInputUraian([]);
                                                    }
                                                }
                                                className='btn btn-outline-primary px-3 py-2 gap-1'
                                                type='button'>
                                                <IconPlusCircle className='w-4 h-4' />
                                                Tambah Kontrak
                                            </button>
                                        </>
                                    )}
                                </>
                            )}

                        </div>
                    </div>
                </div>
            )}

            {view == 'informasi' && (
                <div className="panel p-2 text-xs">
                    <table>
                        <tbody>
                            {/* Urusan Start */}
                            <tr>
                                <td className='w-[150px] !text-xs !px-2'>
                                    Urusan Pemerintahan
                                </td>
                                <td className='w-[0px] !px-0 !text-xs'>:</td>
                                <td className='!text-xs !px-2 font-semibold'>
                                    {datas?.urusan_fullcode ?? '-'} &nbsp;
                                    {datas?.urusan_name ?? '-'}
                                </td>
                            </tr>
                            {/* Urusan End */}

                            {/* Bidang Start */}
                            <tr>
                                <td className='!text-xs !px-2'>
                                    Bidang
                                </td>
                                <td className='w-[0px] !px-0 !text-xs'>:</td>
                                <td className='!text-xs !px-2 font-semibold'>
                                    {datas?.bidang_fullcode ?? '-'} &nbsp;
                                    {datas?.bidang_name ?? '-'}
                                </td>
                            </tr>
                            {/* Bidang End */}

                            {/* Program Start */}
                            <tr>
                                <td className='!text-xs !px-2'>
                                    Program
                                </td>
                                <td className='w-[0px] !px-0 !text-xs'>:</td>
                                <td className='!text-xs !px-2 font-semibold'>
                                    {datas?.program_fullcode ?? '-'} &nbsp;
                                    {datas?.program_name ?? '-'}
                                </td>
                            </tr>
                            <tr>
                                <td className='!text-xs !px-2'>
                                    Capaian Program
                                </td>
                                <td className='w-[0px] !px-0 !text-xs'>:</td>
                                <td className='!text-xs !px-2'>
                                    <table className='border'>
                                        <thead>
                                            <tr>
                                                <td className='!text-xs !px-2 font-semibold !text-center'>
                                                    Indikator
                                                </td>
                                                <td className='w-[150px] !text-xs !px-2 font-semibold !text-center'>
                                                    Target
                                                </td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {datas?.caps_program?.indikator?.map((item: any, index: number) => {
                                                return (
                                                    <>
                                                        <tr>
                                                            <td className='border !text-xs !px-2'>
                                                                {item?.name}
                                                            </td>
                                                            <td className='border !text-xs !px-2'>
                                                                {item?.value} &nbsp;
                                                                {item?.satuan_name}
                                                            </td>
                                                        </tr>
                                                    </>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td className='!text-xs !px-2'>
                                    Alokasi Tahun &nbsp;
                                    {new Date().getFullYear() - 1}
                                </td>
                                <td className="w-[0px] !px-0 !text-xs">:</td>
                                <td className='!text-xs !px-2'>
                                    Rp. &nbsp;
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'decimal',
                                    }).format(datas?.caps_program?.anggaran?.filter((item: any) => item.year == (new Date().getFullYear() - 1))[0]?.anggaran ?? 0) ?? 0}
                                    &nbsp;
                                    ({angkaTerbilang(datas?.caps_program?.anggaran?.filter((item: any) => item.year == (new Date().getFullYear() - 1))[0]?.anggaran ?? 0) ?? 0} rupiah)
                                </td>
                            </tr>
                            <tr>
                                <td className='!text-xs !px-2'>
                                    Alokasi Tahun &nbsp;
                                    {new Date().getFullYear()}
                                </td>
                                <td className="w-[0px] !px-0 !text-xs">:</td>
                                <td className='!text-xs !px-2'>
                                    Rp. &nbsp;
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'decimal',
                                    }).format(datas?.caps_program?.anggaran?.filter((item: any) => item.year == (new Date().getFullYear()))[0]?.anggaran ?? 0) ?? 0}
                                    &nbsp;
                                    ({angkaTerbilang(datas?.caps_program?.anggaran?.filter((item: any) => item.year == (new Date().getFullYear()))[0]?.anggaran ?? 0) ?? 0} rupiah)
                                </td>
                            </tr>
                            <tr>
                                <td className='!text-xs !px-2'>
                                    Alokasi Tahun &nbsp;
                                    {new Date().getFullYear() + 1}
                                </td>
                                <td className="w-[0px] !px-0 !text-xs">:</td>
                                <td className='!text-xs !px-2'>
                                    Rp. &nbsp;
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'decimal',
                                    }).format(datas?.caps_program?.anggaran?.filter((item: any) => item.year == (new Date().getFullYear() + 1))[0]?.anggaran ?? 0) ?? 0}
                                    &nbsp;
                                    ({angkaTerbilang(datas?.caps_program?.anggaran?.filter((item: any) => item.year == (new Date().getFullYear() + 1))[0]?.anggaran ?? 0) ?? 0} rupiah)
                                </td>
                            </tr>
                            {/* Program End */}

                            {/* Kegiatan Start */}
                            <tr>
                                <td className='!text-xs !px-2'>
                                    Kegiatan
                                </td>
                                <td className='w-[0px] !px-0 !text-xs'>:</td>
                                <td className='!text-xs !px-2 font-semibold'>
                                    {datas?.kegiatan_fullcode ?? '-'} &nbsp;
                                    {datas?.kegiatan_name ?? '-'}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={100} className='!text-center !text-xs font-semibold'>
                                    Indikator dan Tolak Ukur Kinerja Kegiatan
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={100}>
                                    <table>
                                        <thead className='!text-center !text-xs font-semibold'>
                                            <tr>
                                                <td className='!text-center !border'
                                                    colSpan={2}>
                                                    Renstra
                                                </td>
                                                <td className='!text-center !border'
                                                    colSpan={2}>
                                                    Renstra Perubahan
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='!text-center !border min-w-[200px]'>
                                                    Tolak Ukur Kinerja
                                                </td>
                                                <td className='!text-center !border w-[150px]'>
                                                    Target Kinerja
                                                </td>
                                                <td className='!text-center !border min-w-[200px]'>
                                                    Tolak Ukur Kinerja
                                                </td>
                                                <td className='!text-center !border w-[150px]'>
                                                    Target Kinerja
                                                </td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {datas?.caps_kegiatan?.indikator?.map((item: any, index: number) => {
                                                return (
                                                    <>
                                                        <tr>
                                                            <td className='!text-xs border'>
                                                                {item?.name}
                                                            </td>
                                                            <td className='!text-xs border'>
                                                                {item?.renstra_value} &nbsp;
                                                                {item?.renstra_satuan_name}
                                                            </td>
                                                            <td className='!text-xs border'>
                                                                {item?.name}
                                                            </td>
                                                            <td className='!text-xs border'>
                                                                {item?.renja_value} &nbsp;
                                                                {item?.renja_satuan_name}
                                                            </td>
                                                        </tr>
                                                    </>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            {/* Kegiatan End */}

                            {/* Sub Kegiatan Start */}
                            <tr>
                                <td className='!text-xs !px-2'>
                                    Sub Kegiatan
                                </td>
                                <td className='w-[0px] !px-0 !text-xs'>:</td>
                                <td className='!text-xs !px-2 font-semibold'>
                                    {datas?.sub_kegiatan_fullcode ?? '-'} &nbsp;
                                    {datas?.sub_kegiatan_name ?? '-'}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={100} className='!text-center !text-xs font-semibold'>
                                    Indikator dan Tolak Ukur Kinerja Sub Kegiatan
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={100}>
                                    <table>
                                        <thead className='!text-center !text-xs font-semibold'>
                                            <tr>
                                                <td className='!text-center !border'
                                                    colSpan={2}>
                                                    Renstra
                                                </td>
                                                <td className='!text-center !border'
                                                    colSpan={2}>
                                                    Renstra Perubahan
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='!text-center !border min-w-[200px]'>
                                                    Tolak Ukur Kinerja
                                                </td>
                                                <td className='!text-center !border w-[150px]'>
                                                    Target Kinerja
                                                </td>
                                                <td className='!text-center !border min-w-[200px]'>
                                                    Tolak Ukur Kinerja
                                                </td>
                                                <td className='!text-center !border w-[150px]'>
                                                    Target Kinerja
                                                </td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {datas?.caps_sub_kegiatan?.indikator?.map((item: any, index: number) => {
                                                return (
                                                    <>
                                                        <tr>
                                                            <td className='!text-xs border'>
                                                                {item?.name}
                                                            </td>
                                                            <td className='!text-xs border'>
                                                                {item?.renstra_value} &nbsp;
                                                                {item?.renstra_satuan_name}
                                                            </td>
                                                            <td className='!text-xs border'>
                                                                {item?.name}
                                                            </td>
                                                            <td className='!text-xs border'>
                                                                {item?.renja_value} &nbsp;
                                                                {item?.renja_satuan_name}
                                                            </td>
                                                        </tr>
                                                    </>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            {/* Sub Kegiatan End */}
                        </tbody>
                    </table>
                </div>
            )}

            {view == 'kontrak' && (
                <div className={showInput ? 'panel p-0.5 text-xs relative pb-[20px]' : 'panel p-0.5 text-xs relative pb-[20px]'}>
                    <div className="table-responsive !h-[calc(100vh-200px)]">
                        <table className=''>
                            <thead className='sticky top-0 left-0 w-full !z-10'>
                                <tr>
                                    <th rowSpan={2}
                                        className='!text-xs !p-2 !text-center border !w-[150px]'>
                                        Kode Rekening
                                    </th>
                                    <th rowSpan={2}
                                        className='!text-xs !p-2 !text-center border min-w-[400px]'>
                                        Uraian
                                    </th>
                                    <th colSpan={4}
                                        className='!text-xs !p-2 !text-center border w-[600px]'>
                                        Rincian Kontrak
                                    </th>
                                    <th className='!text-xs !p-2 !text-center border w-[200px]'>
                                        Nilai Kontrak
                                    </th>
                                    <th rowSpan={2}
                                        className='!text-xs !p-2 !text-center border w-[100px]'>
                                        Opt
                                    </th>
                                </tr>
                                <tr>
                                    <th className='!text-xs !p-2 !text-center border w-[150px]'>
                                        Jenis Pengadaan
                                    </th>
                                    <th className='!text-xs !p-2 !text-center border w-[150px]'>
                                        Jenis Kontrak
                                    </th>
                                    <th className='!text-xs !p-2 !text-center border w-[150px]'>
                                        Tanggal Kontrak
                                    </th>
                                    <th className='!text-xs !p-2 !text-center border w-[150px]'>
                                        Jangka Waktu Pelaksanaan
                                    </th>
                                    <th className='!text-xs !p-2 !text-center border w-[200px]'>
                                        (Rp)
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataKontrak?.map((data: any, index: number) => {
                                    return (
                                        <tr>
                                            <td className='!text-xs !p-2 font-semibold border'>
                                                {data?.type == 'summary' && (
                                                    <div className="relative">
                                                        {data?.rek_code}
                                                    </div>
                                                )}
                                            </td>
                                            <td
                                                colSpan={data?.type != 'detail' ? 5 : 1}
                                                className={data?.id ? '!text-xs !p-2 !text-start border group' : '!text-xs !p-2 !text-start border group !bg-red-400 !text-white dark:!bg-red-900'}>
                                                {data?.type == 'summary' ? (
                                                    <>
                                                        <span className='font-semibold'>
                                                            {data?.rek_name}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        {data?.id == null ? (
                                                            <div className='flex items-center gap-x-2'>
                                                                <div className='whitespace-pre-line'>
                                                                    {data?.uraian}
                                                                </div>
                                                                <button type='button'
                                                                    onClick={
                                                                        () => {
                                                                            if (inputDisabled) {
                                                                                showAlert('error', 'Input dinonaktifkan');
                                                                                return;
                                                                            }
                                                                            setShowInput(true);
                                                                            setInputType('create2');
                                                                            setDataEdit(null);
                                                                            setNewInput([]);
                                                                            temporaryInsert(1, data?.ref_kode_rekening_1);
                                                                            temporaryInsert(2, data?.ref_kode_rekening_2);
                                                                            temporaryInsert(3, data?.ref_kode_rekening_3);
                                                                            temporaryInsert(4, data?.ref_kode_rekening_4);
                                                                            temporaryInsert(5, data?.ref_kode_rekening_5);
                                                                            temporaryInsert(6, data?.ref_kode_rekening_6);
                                                                        }
                                                                    }
                                                                    className="hidden group-hover:block cursor-pointer">
                                                                    <div className="btn btn-success px-2 py-0.5 text-2xs">
                                                                        <IconPlusCircle className="w-2 h-2 mr-1" />
                                                                        TAMBAH
                                                                    </div>
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {data?.type == 'title' ? (
                                                                    <span className='font-semibold whitespace-pre-line'>
                                                                        {data?.uraian}
                                                                    </span>
                                                                ) : (
                                                                    <span className='font-normal whitespace-pre-line'>
                                                                        {data?.uraian}
                                                                    </span>
                                                                )}
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </td>
                                            {data?.type == 'detail' && (
                                                <>
                                                    <td className='!text-xs !p-2 !text-start border'>
                                                        <div className='whitespace-nowrap'>
                                                            {data?.jenis_pengadaan ?? ''}
                                                        </div>
                                                    </td>
                                                    <td className='!text-xs !p-2 border'>
                                                        <div className='text-start whitespace-nowrap'>
                                                            {data?.jenis_kontrak ?? ''}
                                                        </div>
                                                    </td>
                                                    <td className='!text-xs !p-2 border'>
                                                        {data?.tanggal_kontrak ?
                                                            new Date(data?.tanggal_kontrak).toLocaleDateString('id-ID', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            }) : '-'}
                                                    </td>
                                                    <td className='!text-xs !p-2 border'>
                                                        <div className="text-center">
                                                            {data?.jangka_waktu_pelaksanaan ?? 0}
                                                            <span className='text-2xs'>
                                                                &nbsp; (Hari)
                                                            </span>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                            <td className='!text-xs !p-2 !text-end border'>
                                                Rp. {new Intl.NumberFormat('id-ID', {
                                                    style: 'decimal',
                                                }).format(data?.nilai_kontrak ?? 0) ?? 0
                                                }
                                            </td>
                                            <td className='!text-xs !p-2 !text-center border'>
                                                <div className='flex justify-center items-center gap-1'>
                                                    {data?.type == 'detail' && (
                                                        <>
                                                            <Tippy content='Edit Kontrak'>
                                                                <button
                                                                    onClick={
                                                                        () => {
                                                                            editData(data?.id);
                                                                        }
                                                                    }
                                                                    type="button">
                                                                    <IconNotesEdit className="w-4 h-4 text-info hover:text-cyan-700" />
                                                                </button>
                                                            </Tippy>
                                                            <Tippy content='Hapus Kontrak'>
                                                                <button
                                                                    onClick={
                                                                        () => {
                                                                            confirmDelete(data?.id);
                                                                        }
                                                                    }
                                                                    type="button">
                                                                    <IconTrashLines className="w-4 h-4 text-danger hover:text-red-700" />
                                                                </button>
                                                            </Tippy>
                                                        </>
                                                    )}
                                                    {data?.type == 'unknown' && (
                                                        <Tippy content='Tambah Kontrak'>
                                                            <button type='button'
                                                                onClick={
                                                                    () => {
                                                                        if (inputDisabled) {
                                                                            showAlert('error', 'Input dinonaktifkan');
                                                                            return;
                                                                        }
                                                                        setShowInput(true);
                                                                        setInputType('create2');
                                                                        setDataEdit(null);
                                                                        setNewInput([]);
                                                                        temporaryInsert(1, data?.ref_kode_rekening_1);
                                                                        temporaryInsert(2, data?.ref_kode_rekening_2);
                                                                        temporaryInsert(3, data?.ref_kode_rekening_3);
                                                                        temporaryInsert(4, data?.ref_kode_rekening_4);
                                                                        temporaryInsert(5, data?.ref_kode_rekening_5);
                                                                        temporaryInsert(6, data?.ref_kode_rekening_6);
                                                                    }
                                                                }>
                                                                <IconPlusCircle className="w-4 h-4 text-indigo-500 hover:text-cyan-700" />
                                                            </button>
                                                        </Tippy>
                                                    )}
                                                </div>


                                            </td>
                                        </tr>
                                    )
                                })}

                                {(inputDatas?.length == 0 && !showInput) && (
                                    <tr>
                                        <td colSpan={1000}>
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={
                                                        () => {
                                                            if (inputDisabled) {
                                                                showAlert('error', 'Input dinonaktifkan');
                                                                return;
                                                            }
                                                            setShowInput(true);
                                                            setInputType('create');
                                                            setDataEdit(null);
                                                            setNewInput([]);
                                                            setInputUraian([]);
                                                        }
                                                    }
                                                    className='btn btn-outline-primary text-xs px-3 py-2 gap-1'
                                                    type='button'>
                                                    <IconPlusCircle className='w-4 h-4' />
                                                    Tambah Kontrak
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className={showInput ? 'h-[calc(100vh-90px)] mt-2 fixed bottom-0 sm:bottom-[0px] w-[calc(100%-50px)] sm:w-[calc(100%-125px)] overflow-x-auto panel pt-0 border border-slate-600 transition-all duration-500 pb-0 z-10' : 'h-[52px] mt-2 fixed bottom-0 sm:bottom-[60px] w-[calc(100%-50px)] sm:w-[calc(100%-125px)]  overflow-x-auto panel pt-0 cursor-pointer border border-slate-200 transition-all duration-500'}
                        ref={ref}
                    >
                        <div className="relative">
                            <div
                                onClick={
                                    () => {
                                        if (inputDisabled) {
                                            showAlert('error', 'Input dinonaktifkan');
                                            return;
                                        }

                                        setShowInput(!showInput);
                                        setInputType('create');
                                        setDataEdit(null);
                                    }
                                }
                                className="py-2 flex justify-center items-center gap-1 text-xs text-slate-500 hover:text-blue-600 group cursor-pointer sticky z-[20] top-0 w-full bg-white dark:bg-slate-900">
                                <IconCaretDown className={!showInput ? 'w-4 h-4 rotate-180 transition-all duration-500' : 'w-4 h-4 transition-all duration-500'} />
                                <span className='font-semibold'>
                                    {showInput ? 'Sembunyikan' : 'Tampilkan'} Input
                                </span>
                            </div>


                            <div className={showInput ? 'mt-1 pt-2 border-t p-2 relative h-[calc(100vh-120px)]' : 'hidden'}>
                                <div className="flex flex-col sm:flex-row justify-start gap-4 pb-16">
                                    <div className="space-y-4 sm:w-1/3">

                                        <div className='sm:col-span-2'>
                                            <label htmlFor="rekening_akun">
                                                Rekening Akun
                                            </label>

                                            {inputType == 'create2' || inputType == 'edit' ? (
                                                <>
                                                    <div className="border px-3 py-2.5 rounded bg-slate-100">
                                                        {rekeningOptionsEdit?.[0]?.label}
                                                    </div>
                                                </>
                                            ) : (
                                                <Select
                                                    id='rekening_akun'
                                                    placeholder="Pilih Rekening Akun"
                                                    autoFocus={true}
                                                    options={rekeningOptions1}
                                                    defaultValue={
                                                        newInput?.[0]?.rek_id ? rekeningOptions1?.filter((data: any) => data.value == newInput?.[0]?.rek_id)?.[0]?.value : null
                                                    }
                                                    isSearchable={true}
                                                    onChange={
                                                        (e: any) => {
                                                            temporaryInsert(1, e.value);
                                                        }
                                                    }
                                                />
                                            )}
                                        </div>

                                        {newInput?.[0]?.rek_id && (
                                            <div className='sm:col-span-2'>
                                                <label htmlFor="rekening">
                                                    Rekening Kelompok
                                                </label>

                                                {inputType == 'create2' || inputType == 'edit' ? (
                                                    <>
                                                        <div className="border px-3 py-2.5 rounded bg-slate-100">
                                                            {rekeningOptionsEdit?.[1]?.label}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <Select
                                                        id='rekening_kelompok'
                                                        placeholder="Pilih Rekening Kelompok"
                                                        autoFocus={true}
                                                        options={rekeningOptions2}
                                                        defaultValue={
                                                            newInput?.[1]?.rek_id ?
                                                                rekeningOptions2?.filter((data: any) => data.value == newInput?.[1].rek_id)?.[0]?.value
                                                                : null
                                                        }
                                                        isSearchable={true}
                                                        onChange={
                                                            (e: any) => {
                                                                temporaryInsert(2, e.value);
                                                            }
                                                        }
                                                    />
                                                )}
                                            </div>
                                        )}

                                        {newInput?.[1]?.rek_id && (
                                            <div className='sm:col-span-2'>
                                                <label htmlFor="rekening">
                                                    Rekening Jenis
                                                </label>

                                                {inputType == 'create2' || inputType == 'edit' ? (
                                                    <>
                                                        <div className="border px-3 py-2.5 rounded bg-slate-100">
                                                            {rekeningOptionsEdit?.[2]?.label}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <Select
                                                        id='rekening_jenis'
                                                        placeholder="Pilih Rekening Jenis"
                                                        autoFocus={true}
                                                        options={rekeningOptions3}
                                                        defaultValue={
                                                            newInput?.[2]?.rek_id ?
                                                                rekeningOptions3?.filter((data: any) => data.value == newInput?.[2]?.rek_id)?.[0]?.value
                                                                : null
                                                        }
                                                        isSearchable={true}
                                                        onChange={
                                                            (e: any) => {
                                                                temporaryInsert(3, e.value);
                                                            }
                                                        }
                                                    />
                                                )}
                                            </div>
                                        )}

                                        {newInput?.[2]?.rek_id && (
                                            <div className='sm:col-span-2'>
                                                <label htmlFor="rekening">
                                                    Rekening Objek
                                                </label>

                                                {inputType == 'create2' || inputType == 'edit' ? (
                                                    <>
                                                        <div className="border px-3 py-2.5 rounded bg-slate-100">
                                                            {rekeningOptionsEdit?.[3]?.label}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <Select
                                                        styles={
                                                            {
                                                                menu: (provided: any, state: any) => ({
                                                                    ...provided,
                                                                    top: 'auto',
                                                                    bottom: '100%',
                                                                }),
                                                            }
                                                        }
                                                        placeholder="Pilih Rekening Objek"
                                                        autoFocus={true}
                                                        options={rekeningOptions4}
                                                        defaultValue={
                                                            newInput?.[3]?.rek_id ?
                                                                rekeningOptions4?.filter((data: any) => data.value == newInput?.[3]?.rek_id)?.[0]?.value
                                                                : null
                                                        }
                                                        isSearchable={true}
                                                        onChange={
                                                            (e) => {
                                                                temporaryInsert(4, e.value);
                                                            }
                                                        }
                                                    />
                                                )}
                                            </div>
                                        )}

                                        {newInput?.[3]?.rek_id && (
                                            <div className='sm:col-span-2'>
                                                <label htmlFor="rekening">
                                                    Rekening Rincian Objek
                                                </label>

                                                {inputType == 'create2' || inputType == 'edit' ? (
                                                    <>
                                                        <div className="border px-3 py-2.5 rounded bg-slate-100">
                                                            {rekeningOptionsEdit?.[4]?.label}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <Select
                                                        styles={
                                                            {
                                                                menu: (provided: any, state: any) => ({
                                                                    ...provided,
                                                                    top: 'auto',
                                                                    bottom: '100%',
                                                                }),
                                                            }
                                                        }
                                                        placeholder="Pilih Rekening Rincian Objek"
                                                        autoFocus={true}
                                                        options={rekeningOptions5}
                                                        defaultValue={
                                                            newInput?.[4]?.rek_id ?
                                                                rekeningOptions5?.filter((data: any) => data.value == newInput?.[4]?.rek_id)?.[0]?.value
                                                                : null
                                                        }
                                                        isSearchable={true}
                                                        onChange={
                                                            (e) => {
                                                                temporaryInsert(5, e.value);
                                                            }
                                                        }
                                                    />
                                                )}
                                            </div>
                                        )}

                                        {newInput?.[4]?.rek_id && (
                                            <div className='sm:col-span-2'>
                                                <label htmlFor="rekening">
                                                    Rekening Sub Rincian Objek
                                                </label>

                                                {inputType == 'create2' || inputType == 'edit' ? (
                                                    <>
                                                        <div className="border px-3 py-2.5 rounded bg-slate-100">
                                                            {rekeningOptionsEdit?.[5]?.label}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <Select
                                                        className='relative top-0'
                                                        styles={
                                                            {
                                                                menu: (provided: any, state: any) => ({
                                                                    ...provided,
                                                                    top: 'auto',
                                                                    bottom: '100%',
                                                                }),

                                                            }
                                                        }
                                                        placeholder="Pilih Rekening Sub Rincian Objek"
                                                        autoFocus={true}
                                                        options={rekeningOptions6}
                                                        defaultValue={
                                                            newInput?.[5]?.rek_id ?
                                                                rekeningOptions6?.filter((data: any) => data.value == newInput?.[5]?.rek_id)?.[0]?.value
                                                                : null
                                                        }
                                                        isSearchable={true}
                                                        onChange={
                                                            (e) => {
                                                                temporaryInsert(6, e.value);
                                                            }
                                                        }
                                                    />
                                                )}
                                            </div>
                                        )}

                                    </div>

                                    <div className="sm:w-2/3 space-y-2 divide-y divide-slate-300">
                                        {newInput?.[5]?.rek_id && (
                                            <>
                                                {inputUraian?.map((data: any, index: number) => {
                                                    return (
                                                        <div>
                                                            <div className="flex flex-wrap items-start gap-2 w-full pt-2">

                                                                <div className="grow self-end">
                                                                    <label className='text-[10px] !mb-0'>
                                                                        Uraian
                                                                    </label>
                                                                    <textarea
                                                                        value={data?.uraian}
                                                                        onChange={
                                                                            (e) => {
                                                                                setInputUraian((prev: any) => {
                                                                                    const updated = [...prev];
                                                                                    updated[index] = {
                                                                                        uraian: e.target.value,
                                                                                        jenis_pengadaan: data?.jenis_pengadaan,
                                                                                        jenis_kontrak: data?.jenis_kontrak,
                                                                                        nomor_kontrak: data?.nomor_kontrak,
                                                                                        nilai_kontrak: data?.nilai_kontrak,
                                                                                        tanggal_kontrak: data?.tanggal_kontrak,
                                                                                        tahap_pembayaran: data?.tahap_pembayaran,
                                                                                        jangka_waktu_pelaksanaan: data?.jangka_waktu_pelaksanaan,
                                                                                        status: data?.status,
                                                                                    };
                                                                                    return updated;
                                                                                });
                                                                            }
                                                                        }
                                                                        className="form-textarea text-xs font-normal resize-none !m-0"
                                                                        placeholder="Ketik Rincian Uraian disini..." required></textarea>
                                                                </div>

                                                                {index > 0 && (
                                                                    <div className="flex items-center justify-center h-full self-center w-[25px]">
                                                                        <Tippy content="Delete">
                                                                            <button type="button" onClick={() => confirmDeleteUraian(index)}>
                                                                                <IconTrashLines className="m-auto text-red-400 hover:text-red-600" />
                                                                            </button>
                                                                        </Tippy>
                                                                    </div>
                                                                )}

                                                            </div>
                                                            <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2">

                                                                <div className="col-span-1">
                                                                    <label className='text-[10px] !mb-0'>
                                                                        Jenis Proses Pengadaan
                                                                    </label>
                                                                    <Select
                                                                        className='!text-xs !w-full'
                                                                        minMenuHeight={50}
                                                                        placeholder="Pilih Proses Pengadaan"
                                                                        options={[
                                                                            { value: 'Barang', label: 'Barang' },
                                                                            { value: 'Jasa Konsultasi', label: 'Jasa Konsultasi' },
                                                                            { value: 'Pekerjaan Konstruksi', label: 'Pekerjaan Konstruksi' },
                                                                            { value: 'Jasa Lainnya', label: 'Jasa Lainnya' },
                                                                        ]}
                                                                        isSearchable={true}
                                                                        value={
                                                                            data?.jenis_pengadaan &&
                                                                            {
                                                                                value: data?.jenis_pengadaan,
                                                                                label: data?.jenis_pengadaan,
                                                                            }
                                                                        }
                                                                        onChange={
                                                                            (e) => {
                                                                                setInputUraian((prev: any) => {
                                                                                    const updated = [...prev];
                                                                                    updated[index] = {
                                                                                        uraian: data?.uraian,
                                                                                        jenis_pengadaan: e.value,
                                                                                        jenis_kontrak: null,
                                                                                        nomor_kontrak: null,
                                                                                        nilai_kontrak: null,
                                                                                        tanggal_kontrak: null,
                                                                                        tahap_pembayaran: null,
                                                                                        jangka_waktu_pelaksanaan: null,
                                                                                        status: data?.status,
                                                                                    };
                                                                                    return updated;
                                                                                });
                                                                            }
                                                                        } />
                                                                </div>

                                                                <div className="col-span-1">
                                                                    <label className='text-[10px] !mb-0'>
                                                                        Jenis Kontrak
                                                                    </label>
                                                                    <Select
                                                                        className='!text-xs !w-full'
                                                                        minMenuHeight={50}
                                                                        placeholder="Pilih Kontrak"
                                                                        options={optionKontrak[data?.jenis_pengadaan ?? 'Barang']}
                                                                        isSearchable={true}
                                                                        value={
                                                                            data?.jenis_kontrak &&
                                                                            {
                                                                                value: data?.jenis_kontrak,
                                                                                label: data?.jenis_kontrak,
                                                                            }
                                                                        }
                                                                        onChange={
                                                                            (e) => {
                                                                                setInputUraian((prev: any) => {
                                                                                    const updated = [...prev];
                                                                                    updated[index] = {
                                                                                        uraian: data?.uraian,
                                                                                        jenis_pengadaan: data?.jenis_pengadaan,
                                                                                        jenis_kontrak: e.value,
                                                                                        nomor_kontrak: data?.nomor_kontrak,
                                                                                        nilai_kontrak: data?.nilai_kontrak,
                                                                                        tanggal_kontrak: data?.tanggal_kontrak,
                                                                                        tahap_pembayaran: data?.tahap_pembayaran,
                                                                                        jangka_waktu_pelaksanaan: data?.jangka_waktu_pelaksanaan,
                                                                                        status: data?.status,
                                                                                    };
                                                                                    return updated;
                                                                                });
                                                                            }
                                                                        } />
                                                                </div>

                                                                <div className="col-span-1">
                                                                    <label className='text-[10px] !mb-0'>
                                                                        Nomor Kontrak
                                                                    </label>
                                                                    <input
                                                                        value={data?.nomor_kontrak}
                                                                        onChange={
                                                                            (e) => {
                                                                                setInputUraian((prev: any) => {
                                                                                    const updated = [...prev];
                                                                                    updated[index] = {
                                                                                        uraian: data?.uraian,
                                                                                        jenis_pengadaan: data?.jenis_pengadaan,
                                                                                        jenis_kontrak: data?.jenis_kontrak,
                                                                                        nomor_kontrak: e.target.value,
                                                                                        nilai_kontrak: data?.nilai_kontrak,
                                                                                        tanggal_kontrak: data?.tanggal_kontrak,
                                                                                        tahap_pembayaran: data?.tahap_pembayaran,
                                                                                        jangka_waktu_pelaksanaan: data?.jangka_waktu_pelaksanaan,
                                                                                        status: data?.status,
                                                                                    };
                                                                                    return updated;
                                                                                });
                                                                            }
                                                                        }
                                                                        type="text"
                                                                        className="form-input text-xs font-normal px-2 !h-[38px]"
                                                                        placeholder="Nomor Kontrak" />
                                                                </div>

                                                                <div className="col-span-1">
                                                                    <label className='text-[10px] !mb-0'>
                                                                        Nilai Kontrak
                                                                    </label>
                                                                    <div className="relative">
                                                                        <div className="absolute left-0 inset-x-0 w-8 h-[38px] flex items-center justify-center text-slate-500">
                                                                            Rp.
                                                                        </div>
                                                                        <input
                                                                            className="form-input text-xs font-normal pr-2 pl-8 !h-[38px]"
                                                                            value={data?.nilai_kontrak}
                                                                            onChange={
                                                                                (e) => {
                                                                                    setInputUraian((prev: any) => {
                                                                                        const updated = [...prev];
                                                                                        updated[index] = {
                                                                                            uraian: data?.uraian,
                                                                                            jenis_pengadaan: data?.jenis_pengadaan,
                                                                                            jenis_kontrak: data?.jenis_kontrak,
                                                                                            nomor_kontrak: data?.nomor_kontrak,
                                                                                            nilai_kontrak: e.target.value,
                                                                                            tanggal_kontrak: data?.tanggal_kontrak,
                                                                                            tahap_pembayaran: data?.tahap_pembayaran,
                                                                                            jangka_waktu_pelaksanaan: data?.jangka_waktu_pelaksanaan,
                                                                                            status: data?.status,
                                                                                        };
                                                                                        return updated;
                                                                                    });
                                                                                    e.target.value = e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                                                                                }
                                                                            }
                                                                            onKeyDown={(e) => {
                                                                                if (
                                                                                    !(
                                                                                        (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                                        (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                                        e.keyCode == 8 ||
                                                                                        e.keyCode == 46 ||
                                                                                        e.keyCode == 37 ||
                                                                                        e.keyCode == 39
                                                                                    )
                                                                                ) {
                                                                                    e.preventDefault();
                                                                                }
                                                                            }}
                                                                            type="text"
                                                                            placeholder="Nilai Kontrak"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-span-1">
                                                                    <label className='text-[10px] !mb-0'>
                                                                        Tahap Pembayaran
                                                                    </label>
                                                                    <Select
                                                                        className='!text-xs !w-full'
                                                                        minMenuHeight={50}
                                                                        placeholder="Pilih Kontrak"
                                                                        options={[
                                                                            { value: '1 Kali', label: '1 Kali' },
                                                                            { value: '2 Kali', label: '2 Kali' },
                                                                            { value: '3 Kali', label: '3 Kali' },
                                                                            { value: '4 Kali', label: '4 Kali' },
                                                                            { value: '5 Kali', label: '5 Kali' },
                                                                            { value: '6 Kali', label: '6 Kali' },
                                                                        ]}
                                                                        isSearchable={true}
                                                                        value={
                                                                            data?.tahap_pembayaran &&
                                                                            {
                                                                                value: data?.tahap_pembayaran,
                                                                                label: data?.tahap_pembayaran,
                                                                            }
                                                                        }
                                                                        onChange={
                                                                            (e) => {
                                                                                setInputUraian((prev: any) => {
                                                                                    const updated = [...prev];
                                                                                    updated[index] = {
                                                                                        uraian: data?.uraian,
                                                                                        jenis_pengadaan: data?.jenis_pengadaan,
                                                                                        jenis_kontrak: data?.jenis_kontrak,
                                                                                        nomor_kontrak: data?.nomor_kontrak,
                                                                                        nilai_kontrak: data?.nilai_kontrak,
                                                                                        tanggal_kontrak: data?.tanggal_kontrak,
                                                                                        tahap_pembayaran: e.value,
                                                                                        jangka_waktu_pelaksanaan: data?.jangka_waktu_pelaksanaan,
                                                                                        status: data?.status,
                                                                                    };
                                                                                    return updated;
                                                                                });
                                                                            }
                                                                        } />
                                                                </div>

                                                                <div className="col-span-1">
                                                                    <label className='text-[10px] !mb-0'>
                                                                        Tanggal Kontrak
                                                                    </label>
                                                                    <input
                                                                        value={data?.tanggal_kontrak}
                                                                        onChange={
                                                                            (e) => {
                                                                                setInputUraian((prev: any) => {
                                                                                    const updated = [...prev];
                                                                                    updated[index] = {
                                                                                        uraian: data?.uraian,
                                                                                        jenis_pengadaan: data?.jenis_pengadaan,
                                                                                        jenis_kontrak: data?.jenis_kontrak,
                                                                                        nomor_kontrak: data?.nomor_kontrak,
                                                                                        nilai_kontrak: data?.nilai_kontrak,
                                                                                        tanggal_kontrak: e.target.value,
                                                                                        tahap_pembayaran: data?.tahap_pembayaran,
                                                                                        jangka_waktu_pelaksanaan: data?.jangka_waktu_pelaksanaan,
                                                                                        status: data?.status,
                                                                                    };
                                                                                    return updated;
                                                                                });
                                                                            }
                                                                        }
                                                                        type="date"
                                                                        className="form-input text-xs font-normal px-2 !h-[38px]"
                                                                        placeholder="Tanggal Kontrak" />
                                                                </div>

                                                                <div className="col-span-1">
                                                                    <label className='text-[10px] !mb-0'>
                                                                        Jangka Waktu Pelaksanaan
                                                                    </label>
                                                                    <div className="relative">
                                                                        <input
                                                                            className="form-input text-xs font-normal pl-2 pr-14 !h-[38px]"
                                                                            value={data?.jangka_waktu_pelaksanaan}
                                                                            onChange={
                                                                                (e) => {
                                                                                    setInputUraian((prev: any) => {
                                                                                        const updated = [...prev];
                                                                                        updated[index] = {
                                                                                            uraian: data?.uraian,
                                                                                            jenis_pengadaan: data?.jenis_pengadaan,
                                                                                            jenis_kontrak: data?.jenis_kontrak,
                                                                                            nomor_kontrak: data?.nomor_kontrak,
                                                                                            nilai_kontrak: data?.nilai_kontrak,
                                                                                            tanggal_kontrak: data?.tanggal_kontrak,
                                                                                            tahap_pembayaran: data?.tahap_pembayaran,
                                                                                            jangka_waktu_pelaksanaan: e.target.value,
                                                                                            status: data?.status,
                                                                                        };
                                                                                        return updated;
                                                                                    });
                                                                                }
                                                                            }
                                                                            onKeyDown={(e) => {
                                                                                if (
                                                                                    !(
                                                                                        (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                                        (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                                        e.keyCode == 8 ||
                                                                                        e.keyCode == 46 ||
                                                                                        e.keyCode == 37 ||
                                                                                        e.keyCode == 39
                                                                                    )
                                                                                ) {
                                                                                    e.preventDefault();
                                                                                }
                                                                            }}
                                                                            type="text"
                                                                            min={1}
                                                                            placeholder="Jangka Waktu Pelaksanaan" />
                                                                        <div className="absolute right-0 inset-y-0 w-14 h-[38px] flex items-center justify-center bg-slate-200 rounded-r">
                                                                            Hari
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    )
                                                })}

                                                {inputType == 'create' && (
                                                    <div className="flex justify-center pt-4">
                                                        <button
                                                            onClick={() => addNewUraian()}
                                                            type="button"
                                                            className="btn btn-outline-info font-normal text-xs gap-x-1 px-2 py-1">
                                                            <IconPlus className="w-4 h-4" />
                                                            Uraian Selanjutnya
                                                        </button>
                                                    </div>
                                                )}

                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-2 px-20 flex items-center justify-end fixed bottom-0 left-0 w-full bg-white py-2">
                                    <button
                                        onClick={() => saveData()}
                                        type="button"
                                        className={
                                            showInput
                                                ? 'btn btn-success font-normal gap-x-1 transition-all duration-500'
                                                : 'btn btn-success font-normal gap-x-1 transition-all duration-100 opacity-0 pointer-events-none w-[0px] p-0 m-0 overflow-hidden'
                                        }>
                                        <IconSave className="w-4 h-4" />
                                        {(showInput && inputType == 'create') && (
                                            <>
                                                Tambahkan Data
                                            </>
                                        )}
                                        {(showInput && inputType == 'edit') && (
                                            <>
                                                Simpan Perubahan
                                            </>
                                        )}
                                    </button>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            )}

        </>
    );
}

export default Index;
