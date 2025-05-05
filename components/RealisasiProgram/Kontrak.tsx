import { faCheck, faFileCirclePlus, faFileSignature, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from '@headlessui/react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import IconMenu from "../Icon/IconMenu";
import IconSearch from "../Icon/IconSearch";
import IconCaretDown from "../Icon/IconCaretDown";
import { faDotCircle, faSave, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { addContract, addManualContract, deleteContract, getContract, getKontrakSPSE } from "@/apis/realisasi_apis";
import Swal from "sweetalert2";
import DisplayMoney from "../DisplayMoney";
import IconX from "../Icon/IconX";
import Select from 'react-select';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import InputRupiah from "../InputRupiah";


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

const showAlertBox = async (icon: any, title: any, text: any) => {
    const toast = Swal.mixin({
        toast: false,
        position: 'center',
        showConfirmButton: true,
        showCancelButton: false,
        confirmButtonText: 'Tutup',
    });
    toast.fire({
        icon: icon,
        title: title,
        text: text,
        padding: '10px 20px',
    });
};

const Kontrak = (
    {
        subKegiatan,
        arrRekening,
        year,
    }: {
        subKegiatan: any,
        arrRekening: any,
        year: string,
    }
) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [activeContracts, setActiveContracts] = useState<any>([]);
    // console.log(arrRekening)
    // console.log(activeContracts)

    useEffect(() => {
        if (isMounted) {
            getContract(subKegiatan.id, year, 1).then((data: any) => {
                if (data.status == 'success') {
                    setActiveContracts(data.data);
                }
                setLoadingFetchKontrak(false);
            });
        }
    }, [isMounted]);

    const [selectedTab, setSelectedTab] = useState('');
    const [isShowTaskMenu, setIsShowTaskMenu] = useState(false);
    const tabChanged = () => {
        setIsShowTaskMenu(false);
    };

    const [loadingFetchKontrak, setLoadingFetchKontrak] = useState(false);
    const [searchKontrak, setSearchKontrak] = useState('');
    const [kontrakSPSEOptionsRaw, setKontrakSPSEOptionsRaw] = useState<any[]>([]);
    const [kontrakSPSEOptions, setKontrakSPSEOptions] = useState<any[]>([]);
    const [selectedKontrak, setSelectedKontrak] = useState<any>(null);
    const [selectedRekening, setSelectedRekening] = useState<any>(null);
    const [manualKontrakData, setManualKontrakData] = useState<any>([]);
    const [modalView, setModalView] = useState(false);
    const [modalViewKontrak, setModalViewKontrak] = useState(false);
    const [modalPilihRekening, setModalPilihRekening] = useState(false);

    useEffect(() => {
        if (isMounted) {
            resetManualKontrakData();
        }
    }, [isMounted]);

    const resetManualKontrakData = () => {
        setManualKontrakData({
            alamat_satker: '',
            alasan_addendum: '',
            alasan_nilai_kontrak_10_persen: '',
            alasan_penetapan_status_kontrak: '',
            alasan_ubah_nilai_kontrak: '',
            anggota_kso: '',
            apakah_addendum: '',
            bentuk_usaha_penyedia: '',
            informasi_lainnya: '',
            jabatan_ppk: '',
            jabatan_wakil_penyedia: '',
            jenis_klpd: '',
            jenis_kontrak: '',
            kd_klpd: '',
            kd_lpse: '',
            kd_penyedia: '',
            kd_satker: '',
            kd_satker_str: '',
            kd_tender: '',
            kota_kontrak: '',
            lingkup_pekerjaan: '',
            nama_klpd: '',
            nama_paket: '',
            nama_pemilik_rek_bank: '',
            nama_penyedia: '',
            nama_ppk: '',
            nama_rek_bank: '',
            nama_satker: '',
            nilai_kontrak: 0,
            nilai_pdn_kontrak: 0,
            nilai_umk_kontrak: 0,
            nip_ppk: '',
            no_kontrak: '',
            no_rek_bank: '',
            no_sk_ppk: '',
            no_sppbj: '',
            npwp_penyedia: '',
            status_kontrak: '',
            tahun_anggaran: '',
            tgl_kontrak: new Date().toISOString().split('T')[0],
            tgl_kontrak_akhir: new Date().toISOString().split('T')[0],
            tgl_kontrak_awal: new Date().toISOString().split('T')[0],
            tgl_penetapan_status_kontrak: '',
            tipe_penyedia: '',
            versi_addendum: '',
            wakil_sah_penyedia: '',
        });
    }

    const fetchingKontrak = (type: any) => {
        if (loadingFetchKontrak === false) {
            setLoadingFetchKontrak(true);
            getKontrakSPSE('', year, subKegiatan.instance_code, type).then((data: any) => {
                if (data.status === 'success') {
                    setKontrakSPSEOptionsRaw(data.data);
                    setKontrakSPSEOptions(data.data);
                }
                else {
                    setKontrakSPSEOptions([]);
                    showAlert('error', data.message);
                }
                setLoadingFetchKontrak(false);
            });
        } else {
            showAlert('info', 'Sedang Memuat Data Kontrak');
        }
    }

    useEffect(() => {
        setKontrakSPSEOptions([]);
        if (selectedTab == 'tender-ekontrak') {
            fetchingKontrak('tender');
        }
        if (selectedTab == 'nontender-ekontrak') {
            fetchingKontrak('non-tender');
        }
        setSearchKontrak('');
    }, [selectedTab]);

    const handleSearch = (value: string) => {
        setSearchKontrak(value);
        if (value.length > 0) {
            const filteredOptions = kontrakSPSEOptionsRaw.filter((option: any) => {
                // filter base no_kontrak & nama_paket & nama_penyedia & status
                return option.no_kontrak.toLowerCase().includes(value.toLowerCase()) ||
                    option.nama_paket.toLowerCase().includes(value.toLowerCase()) ||
                    option.nama_penyedia.toLowerCase().includes(value.toLowerCase()) ||
                    option.status_kontrak.toLowerCase().includes(value.toLowerCase());

                // return option.no_kontrak.toLowerCase().includes(value.toLowerCase());
            });
            setKontrakSPSEOptions(filteredOptions);
        }
        else {
            setKontrakSPSEOptions(kontrakSPSEOptionsRaw);
        }
    }

    const viewKontrak = (data: any) => {
        setModalView(true);
        setSelectedKontrak(data);
        console.log(data);
    }

    const pickKontrak = (data: any) => {
        setSelectedKontrak(data);
        setModalViewKontrak(true);
    }

    const AddKontrak = () => {
        addContract(subKegiatan.id, selectedKontrak, year, 1, selectedTab, selectedRekening).then((data: any) => {
            if (data.status === 'success') {
                showAlert('success', data.message)
                getContract(subKegiatan.id, year, 1).then((data: any) => {
                    if (data.status == 'success') {
                        setActiveContracts(data.data);
                    }
                });
                setModalPilihRekening(false);
                setModalViewKontrak(false);
                setSelectedKontrak(null);
            }
        });
    }

    const handlePickRekening = (data: any) => {
        setModalPilihRekening(true);
        setModalViewKontrak(false);
        setSelectedKontrak(data)
    }

    const handleLinkKontrak = (data: any) => {
        Swal.fire({
            title: 'Konfirmasi',
            text: 'Apakah Anda Yakin ingin menghubungkan kontrak ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hubungkan',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                AddKontrak();
            }
        })
    }

    const handleSaveManualKontrak = () => {
        Swal.fire({
            title: 'Konfirmasi',
            text: 'Apakah Anda Yakin ingin menambahkan kontrak ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Tambahkan',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                AddManualKontrak();
            }
        })
    }

    const AddManualKontrak = () => {
        addManualContract(subKegiatan.id, manualKontrakData, year, 1, 'manual-kontrak', selectedRekening).then((data: any) => {
            if (data.status === 'success') {
                showAlert('success', data.message)
                getContract(subKegiatan.id, year, 1).then((data: any) => {
                    if (data.status == 'success') {
                        setActiveContracts(data.data);
                    }
                });
                setSelectedTab('');
                resetManualKontrakData();
            } else if (data.status === 'error validation') {
                showAlertBox('error', 'Error', data.message);
            }
        });
    }

    const deleteKontrak = (id: any, no_kontrak: any) => {
        // confirm box
        Swal.fire({
            title: 'Hapus Kontrak',
            text: 'Apakah Anda Yakin Ingin Menghapus Kontrak Ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                setLoadingFetchKontrak(true);
                deleteContract(id, no_kontrak, year, 1).then((data: any) => {
                    if (data.status === 'success') {
                        showAlert('success', data.message)
                        getContract(subKegiatan.id, year, 1).then((data: any) => {
                            if (data.status == 'success') {
                                setActiveContracts(data.data);
                            }
                        });
                    }

                    if (data.status === 'error') {
                        showAlert('error', data.message)
                    }
                    setLoadingFetchKontrak(false);
                });
            }
        })
    }

    return (
        <div className="flex flex-col sm:flex-row gap-3 h-[calc(100%)]">
            <div className="panel border border-slate-500 p-4 flex-none w-full sm:w-[240px] max-w-full">
                <div className="flex flex-col h-full pb-16">

                    <div className="pb-5">
                        <div className="flex text-center items-center">
                            <div className="shrink-0">
                                <FontAwesomeIcon icon={faFileSignature} className="w-6 h-6 text-slate-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-500 ltr:ml-3 rtl:mr-3">
                                Menu Kontrak
                            </h3>
                        </div>
                    </div>
                    <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b] mb-5"></div>


                    <PerfectScrollbar className="relative h-full grow ltr:-mr-3.5 ltr:pr-3.5 rtl:-ml-3.5 rtl:pl-3.5">
                        <div className="space-y-1">

                            <button
                                type="button"
                                className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-success dark:hover:bg-[#181F32] dark:hover:text-success ${selectedTab === '' ? 'bg-gray-100 text-success dark:bg-[#181F32] dark:text-success' : 'text-success'}`}
                                onClick={() => {
                                    if (loadingFetchKontrak === false) {
                                        tabChanged();
                                        setSelectedTab('');
                                    }
                                }}
                            >
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faFileSignature} className="shrink-0 w-4 h-4" />
                                    <div className="ltr:ml-3 rtl:mr-3">
                                        Kontrak Aktif
                                    </div>
                                </div>
                                <div className="whitespace-nowrap rounded-md bg-primary-light px-2 py-0.5 font-semibold dark:bg-[#060818]">
                                    {activeContracts.length}
                                </div>
                            </button>


                            <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
                            <div className="px-1 py-3 text-white-dark">
                                Pencarian Kontrak
                            </div>

                            <button
                                type="button"
                                className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${selectedTab === 'tender-ekontrak' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : 'text-slate-500'}`}
                                onClick={() => {
                                    if (loadingFetchKontrak === false) {
                                        tabChanged();
                                        setSelectedTab('tender-ekontrak');
                                    }
                                }}
                            >
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faFileSignature} className="shrink-0 w-4 h-4" />
                                    <div className="ltr:ml-3 rtl:mr-3">
                                        Ekontrak Tender
                                    </div>
                                </div>
                            </button>

                            <button
                                type="button"
                                className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${selectedTab === 'nontender-ekontrak' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : 'text-slate-500'}`}
                                onClick={() => {
                                    if (loadingFetchKontrak === false) {
                                        tabChanged();
                                        setSelectedTab('nontender-ekontrak');
                                    }
                                }}
                            >
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faFileSignature} className="shrink-0 w-4 h-4" />
                                    <div className="ltr:ml-3 rtl:mr-3">
                                        Ekontrak Non Tender
                                    </div>
                                </div>
                            </button>

                            <button
                                type="button"
                                className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${selectedTab === 'manual-kontrak' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : 'text-slate-500'}`}
                                onClick={() => {
                                    if (loadingFetchKontrak === false) {
                                        tabChanged();
                                        setSelectedTab('manual-kontrak');
                                    }
                                }}
                            >
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faFileCirclePlus} className="shrink-0 w-4 h-4" />
                                    <div className="ltr:ml-3 rtl:mr-3 text-start text-xs">
                                        Tambah Kontrak <br />(Bukan dari LKPP)
                                    </div>
                                </div>
                            </button>

                        </div>
                    </PerfectScrollbar>
                </div>
            </div>
            <div className="panel border border-slate-500 p-0 flex-1 overflow-auto h-full">
                <div className={`overlay absolute z-[5] hidden h-full w-full rounded-md bg-black/60 ${isShowTaskMenu && '!block xl:!hidden'}`} onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}></div>

                {selectedTab == '' && (
                    <div className="table-responsive min-h-[400px] grow overflow-y-auto sm:min-h-[300px]">
                        <table className="table-hover">
                            <thead>
                                <tr>
                                    <th className="border">
                                        No. Rekening <br />
                                        Nama Paket & No. Kontrak
                                    </th>
                                    <th className="border">
                                        Jenis Kontrak
                                    </th>
                                    <th className="border">
                                        Nama Penyedia
                                    </th>
                                    <th className="text-center border">
                                        Nilai Kontrak
                                    </th>
                                    <th className="text-center border">
                                        Tanggal Kontrak
                                    </th>
                                    <th className="text-center border">
                                        Status Kontrak
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {arrRekening.filter((REK: any) => activeContracts.some((contract: any) => contract.kode_rekening_id === REK.id))
                                    .map((rek: any, index: number) => (
                                        <>
                                            <tr>
                                                <td colSpan={6} className="bg-slate-200">
                                                    <div className="font-semibold select-none">
                                                        {rek.fullcode} - {rek.uraian}
                                                    </div>
                                                </td>
                                            </tr>
                                            {activeContracts.filter((filted: any) => filted.kode_rekening_id == rek.id)
                                                .map((itemm: any, index: number) => (
                                                    <tr
                                                        onClick={() => {
                                                            viewKontrak(itemm);
                                                        }}
                                                        className={`group cursor-pointer select-none`}
                                                        key={itemm.id}>
                                                        <td className="border">
                                                            <div className="pl-5">
                                                                <div className="flex items-center justify-between gap-x-1">
                                                                    <div className={`whitespace-nowrap text-base font-semibold`}>
                                                                        {itemm.data_spse.no_kontrak}
                                                                    </div>
                                                                    <Tippy
                                                                        theme="danger"
                                                                        content={`Hapus Kontrak`}
                                                                    >
                                                                        <button
                                                                            onClick={() => {
                                                                                deleteKontrak(subKegiatan.id, itemm?.no_kontrak)
                                                                            }}
                                                                            className='btn btn-sm btn-outline-danger'
                                                                            type='button'>
                                                                            <FontAwesomeIcon icon={faTrashAlt} className='w-3 h-3' />
                                                                        </button>
                                                                    </Tippy>
                                                                </div>
                                                                <div className={`line-clamp-1 min-w-[300px] overflow-hidden text-white-dark`}>
                                                                    {itemm.data_spse.nama_paket}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="border">
                                                            {itemm?.type == 'tender-ekontrak' ? 'Ekontrak Tender'
                                                                : itemm?.type == 'nontender-ekontrak' ? 'Ekontrak Non Tender'
                                                                    : itemm?.type == 'manual-kontrak' ? 'Manual Kontrak'
                                                                        : 'Ekontrak Tender'}
                                                        </td>
                                                        <td className="border">
                                                            {itemm.data_spse.nama_penyedia}
                                                        </td>
                                                        <td className="border">
                                                            <DisplayMoney
                                                                data={itemm.data_spse.nilai_kontrak}
                                                            />
                                                        </td>
                                                        <td className="border">
                                                            <p className={`whitespace-nowrap font-medium text-white-dark text-center`}>
                                                                {itemm.data_spse.tgl_kontrak}
                                                            </p>
                                                        </td>
                                                        <td className="text-center border">
                                                            {itemm.data_spse.status_kontrak}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </>
                                    ))}

                                {/* TANPA REKENING START */}
                                {activeContracts.filter((filted: any) => filted.kode_rekening_id == null).length > 0 && (
                                    <tr>
                                        <td colSpan={6} className="bg-slate-200">
                                            <div className="font-semibold select-none">
                                                Tanpa Rekening
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {activeContracts.filter((filted: any) => filted.kode_rekening_id == null)
                                    .map((itemm: any, index: number) => (
                                        <tr
                                            onClick={() => {
                                                viewKontrak(itemm);
                                            }}
                                            className={`group cursor-pointer select-none`}
                                            key={itemm.id}>
                                            <td className="border">
                                                <div className="pl-5">
                                                    <div className="flex items-center justify-between gap-x-1">
                                                        <div className={`whitespace-nowrap text-base font-semibold`}>
                                                            {itemm.data_spse.no_kontrak}
                                                        </div>
                                                        <Tippy
                                                            theme="danger"
                                                            content={`Hapus Kontrak`}
                                                        >
                                                            <button
                                                                onClick={() => {
                                                                    deleteKontrak(subKegiatan.id, itemm?.no_kontrak)
                                                                }}
                                                                className='btn btn-sm btn-outline-danger'
                                                                type='button'>
                                                                <FontAwesomeIcon icon={faTrashAlt} className='w-3 h-3' />
                                                            </button>
                                                        </Tippy>
                                                    </div>
                                                    <div className={`line-clamp-1 min-w-[300px] overflow-hidden text-white-dark`}>
                                                        {itemm.data_spse.nama_paket}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="border">
                                                {itemm?.type == 'tender-ekontrak' ? 'Ekontrak Tender'
                                                    : itemm?.type == 'nontender-ekontrak' ? 'Ekontrak Non Tender'
                                                        : itemm?.type == 'manual-kontrak' ? 'Manual Kontrak'
                                                            : 'Ekontrak Tender'}
                                            </td>
                                            <td className="border">
                                                {itemm.data_spse.nama_penyedia}
                                            </td>
                                            <td className="border">
                                                <DisplayMoney
                                                    data={itemm.data_spse.nilai_kontrak}
                                                />
                                            </td>
                                            <td className="border">
                                                <p className={`whitespace-nowrap font-medium text-white-dark text-center`}>
                                                    {itemm.data_spse.tgl_kontrak}
                                                </p>
                                            </td>
                                            <td className="text-center border">
                                                {itemm.data_spse.status_kontrak}
                                            </td>
                                        </tr>
                                    ))}
                                {/* TANPA REKENING END */}

                            </tbody>
                        </table>
                    </div>
                )}

                {(selectedTab == 'tender-ekontrak' || selectedTab == 'nontender-ekontrak') && (
                    <div className="flex h-full flex-col">
                        <div className="flex w-full flex-col gap-4 p-4 sm:flex-row sm:items-center">
                            <div className="flex items-center ltr:mr-3 rtl:ml-3">
                                <button type="button" className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden" onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}>
                                    <IconMenu />
                                </button>
                                <div className="group relative flex-1">
                                    <input
                                        type="text"
                                        className="peer form-input ltr:!pr-10 rtl:!pl-10"
                                        placeholder="Filter Kontrak..."
                                        value={searchKontrak}
                                        onChange={(e) => {
                                            handleSearch(e.target.value);
                                        }}
                                    // onKeyUp={() => searchKontrak()}
                                    />
                                    <div className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
                                        <IconSearch />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center select-none cursor-pointer">
                                <FontAwesomeIcon icon={faDotCircle} className="w-4 h-4 text-purple-500" />
                                <span className="text-sm text-purple-500 ltr:ml-2 rtl:mr-2">
                                    Klik pada Kontrak di bawah ini untuk Menautkan Kontrak
                                </span>
                            </div>
                        </div>

                        <div className="table-responsive min-h-[400px] grow overflow-y-auto sm:min-h-[300px]">
                            <table className="">
                                <thead className="sticky top-0 left-0 z-10 bg-white dark:bg-[#1a2941]">
                                    <tr>
                                        <th>
                                            Nama Paket & No. Kontrak
                                        </th>
                                        <th>
                                            Nama Penyedia
                                        </th>
                                        <th className="text-center">
                                            Nilai Kontrak
                                        </th>
                                        <th className="text-center">
                                            Tanggal Kontrak
                                        </th>
                                        <th className="text-center">
                                            Status Kontrak
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {kontrakSPSEOptionsRaw.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center text-slate-700">
                                                <div className="flex items-center justify-center gap-x-5 p-20 text-lg">
                                                    <FontAwesomeIcon icon={faFileSignature} className="w-16 h-16 text-slate-500" />
                                                    <div className="">
                                                        Tidak ada data kontrak yang ditemukan / <br /> Coba cari dengan kata kunci lain
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {kontrakSPSEOptions.map((item: any, index: number) => (
                                        <tr
                                            onClick={() => {
                                                pickKontrak(item);
                                            }}
                                            className={`group cursor-pointer select-none ${activeContracts.filter((filted: any) => filted.no_kontrak === item.no_kontrak).length > 0 ? 'bg-success-light dark:bg-success-dark-light ' : ''}`}
                                            key={item.id}>
                                            <td>
                                                <div>
                                                    <div className="flex items-center gap-x-1">
                                                        <div className={`whitespace-nowrap text-base font-semibold ${activeContracts.filter((filted: any) => filted.no_kontrak === item.no_kontrak).length > 0 ? 'group-hover:text-success ' : 'group-hover:text-primary '}`}>
                                                            {item.no_kontrak}
                                                        </div>
                                                        {activeContracts.filter((filted: any) => filted.no_kontrak === item.no_kontrak).length > 0 && (
                                                            <span>
                                                                <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-success ltr:ml-2 rtl:mr-2" />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className={`line-clamp-1 min-w-[300px] overflow-hidden text-white-dark`}>
                                                        {item.nama_paket}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="">
                                                {item.nama_penyedia}
                                            </td>
                                            <td className="">
                                                <DisplayMoney
                                                    data={item.nilai_kontrak}
                                                />
                                            </td>
                                            <td className="">
                                                <p className={`whitespace-nowrap font-medium text-white-dark text-center`}>
                                                    {item.tgl_kontrak}
                                                </p>
                                            </td>
                                            <td className="text-center">
                                                {item.status_kontrak}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {(selectedTab == 'manual-kontrak') && (
                    <div className="p-5">
                        <div className="text-lg font-semibold text-slate-500 border-b pb-1 select-none">
                            Pembuatan Kontrak Manual
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSaveManualKontrak();
                            }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 mt-5 relative">

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="input-no_kontrak">
                                    <span className="text-sm text-slate-500">
                                        Nomor Kontrak
                                        <span className="text-danger">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        id="input-no_kontrak"
                                        className="form-input mt-1"
                                        placeholder="Masukkan Nomor Kontrak"
                                        value={manualKontrakData?.no_kontrak}
                                        onChange={(e) => {
                                            setManualKontrakData({ ...manualKontrakData, no_kontrak: e.target.value });
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="input-jenis_kontrak">
                                    <span className="text-sm text-slate-500">
                                        Jenis Kontrak
                                        <span className="text-danger">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        id="input-jenis_kontrak"
                                        className="form-input mt-1"
                                        placeholder="Masukkan Jenis Kontrak"
                                        value={manualKontrakData?.jenis_kontrak}
                                        onChange={(e) => {
                                            setManualKontrakData({ ...manualKontrakData, jenis_kontrak: e.target.value });
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="input-kd_tender">
                                    <span className="text-sm text-slate-500">
                                        Kode Tender
                                        <span className="text-danger">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        id="input-kd_tender"
                                        className="form-input mt-1"
                                        placeholder="Masukkan Kode Tender"
                                        value={manualKontrakData?.kd_tender}
                                        onChange={(e) => {
                                            setManualKontrakData({ ...manualKontrakData, kd_tender: e.target.value });
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="input-no_sppbj">
                                    <span className="text-sm text-slate-500">
                                        Nomor SPPBJ
                                        <span className="text-danger">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        id="input-no_sppbj"
                                        className="form-input mt-1"
                                        placeholder="Masukkan Nomor SPPBJ"
                                        value={manualKontrakData?.no_sppbj}
                                        onChange={(e) => {
                                            setManualKontrakData({ ...manualKontrakData, no_sppbj: e.target.value });
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="input-nama_paket">
                                    <span className="text-sm text-slate-500">
                                        Nama Paket
                                        <span className="text-danger">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        id="input-nama_paket"
                                        className="form-input mt-1"
                                        placeholder="Masukkan Nama Paket"
                                        value={manualKontrakData?.nama_paket}
                                        onChange={(e) => {
                                            setManualKontrakData({ ...manualKontrakData, nama_paket: e.target.value });
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="input-tgl_kontrak">
                                    <span className="text-sm text-slate-500">
                                        Tanggal Kontrak
                                        <span className="text-danger">*</span>
                                    </span>
                                    <input
                                        type="date"
                                        id="input-tgl_kontrak"
                                        className="form-input mt-1"
                                        placeholder="Masukkan Tanggal Kontrak"
                                        value={manualKontrakData?.tgl_kontrak}
                                        onChange={(e) => {
                                            setManualKontrakData({ ...manualKontrakData, tgl_kontrak: e.target.value });
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="input-tgl_kontrak_awal">
                                    <span className="text-sm text-slate-500">
                                        Tanggal Kontrak Awal
                                        <span className="text-danger">*</span>
                                    </span>
                                    <input
                                        type="date"
                                        id="input-tgl_kontrak_awal"
                                        className="form-input mt-1"
                                        placeholder="Masukkan Tanggal Kontrak Awal"
                                        value={manualKontrakData?.tgl_kontrak_awal}
                                        onChange={(e) => {
                                            setManualKontrakData({ ...manualKontrakData, tgl_kontrak_awal: e.target.value });
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="input-tgl_kontrak_akhir">
                                    <span className="text-sm text-slate-500">
                                        Tanggal Kontrak Akhir
                                        <span className="text-danger">*</span>
                                    </span>
                                    <input
                                        type="date"
                                        id="input-tgl_kontrak_akhir"
                                        className="form-input mt-1"
                                        placeholder="Masukkan Tanggal Kontrak Akhir"
                                        value={manualKontrakData?.tgl_kontrak_akhir}
                                        onChange={(e) => {
                                            setManualKontrakData({ ...manualKontrakData, tgl_kontrak_akhir: e.target.value });
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="input-status_kontrak">
                                    <span className="text-sm text-slate-500">
                                        Status Kontrak
                                        <span className="text-danger">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        id="input-status_kontrak"
                                        className="form-input mt-1"
                                        placeholder="Masukkan Status Kontrak"
                                        value={manualKontrakData?.status_kontrak}
                                        onChange={(e) => {
                                            setManualKontrakData({ ...manualKontrakData, status_kontrak: e.target.value });
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="mt-5 mb-2 col-span-2">
                                <div className="font-semibold text-lg border-b pb-2 text-slate-500">
                                    Satuan Kerja
                                </div>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="input-nama_satker">
                                    <span className="text-sm text-slate-500">
                                        Nama Satuan Kerja
                                        <span className="text-danger">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        id="input-nama_satker"
                                        className="form-input mt-1"
                                        placeholder="Masukkan Nama Satuan Kerja"
                                        value={manualKontrakData?.nama_satker}
                                        onChange={(e) => {
                                            setManualKontrakData({ ...manualKontrakData, nama_satker: e.target.value });
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="input-kd_satker_str">
                                    <span className="text-sm text-slate-500">
                                        Kode Satker
                                        <span className="text-danger">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        id="input-kd_satker_str"
                                        className="form-input mt-1"
                                        placeholder="Masukkan Kode Satker"
                                        value={manualKontrakData?.kd_satker_str}
                                        onChange={(e) => {
                                            setManualKontrakData({ ...manualKontrakData, kd_satker_str: e.target.value });
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="mt-5 mb-2 col-span-2">
                                <div className="font-semibold text-lg border-b pb-2 text-slate-500">
                                    Pejabat Pembuat Komitmen
                                </div>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="input-nama_ppk">
                                    <span className="text-sm text-slate-500">
                                        Nama PPK
                                        <span className="text-danger">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        id="input-nama_ppk"
                                        className="form-input mt-1"
                                        placeholder="Masukkan Nama PPK"
                                        value={manualKontrakData?.nama_ppk}
                                        onChange={(e) => {
                                            setManualKontrakData({ ...manualKontrakData, nama_ppk: e.target.value });
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="input-nip_ppk">
                                    <span className="text-sm text-slate-500">
                                        NIP PPK
                                        <span className="text-danger">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        id="input-nip_ppk"
                                        className="form-input mt-1"
                                        placeholder="Masukkan NIP PPK"
                                        value={manualKontrakData?.nip_ppk}
                                        onChange={(e) => {
                                            setManualKontrakData({ ...manualKontrakData, nip_ppk: e.target.value });
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="input-jabatan_ppk">
                                    <span className="text-sm text-slate-500">
                                        Jabatan PPK
                                        <span className="text-danger">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        id="input-jabatan_ppk"
                                        className="form-input mt-1"
                                        placeholder="Masukkan Jabatan PPK"
                                        value={manualKontrakData?.jabatan_ppk}
                                        onChange={(e) => {
                                            setManualKontrakData({ ...manualKontrakData, jabatan_ppk: e.target.value });
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="input-no_sk_ppk">
                                    <span className="text-sm text-slate-500">
                                        Nomor SK PPK
                                        <span className="text-danger">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        id="input-no_sk_ppk"
                                        className="form-input mt-1"
                                        placeholder="Masukkan Nomor SK PPK"
                                        value={manualKontrakData?.no_sk_ppk}
                                        onChange={(e) => {
                                            setManualKontrakData({ ...manualKontrakData, no_sk_ppk: e.target.value });
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="mt-5 mb-2 col-span-2">
                                <div className="font-semibold text-lg border-b pb-2 text-slate-500">
                                    Penyedia
                                </div>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="input-nama_penyedia">
                                    <span className="text-sm text-slate-500">
                                        Nama Penyedia
                                        <span className="text-danger">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        id="input-nama_penyedia"
                                        className="form-input mt-1"
                                        placeholder="Masukkan Nama Penyedia"
                                        value={manualKontrakData?.nama_penyedia}
                                        onChange={(e) => {
                                            setManualKontrakData({ ...manualKontrakData, nama_penyedia: e.target.value });
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="input-npwp_penyedia">
                                    <span className="text-sm text-slate-500">
                                        NPWP Penyedia
                                        <span className="text-danger">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        id="input-npwp_penyedia"
                                        className="form-input mt-1"
                                        placeholder="Masukkan NPWP Penyedia"
                                        value={manualKontrakData?.npwp_penyedia}
                                        onChange={(e) => {
                                            setManualKontrakData({ ...manualKontrakData, npwp_penyedia: e.target.value });
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="input-bentuk_usaha_penyedia">
                                    <span className="text-sm text-slate-500">
                                        Bentuk Usaha Penyedia
                                        <span className="text-danger">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        id="input-bentuk_usaha_penyedia"
                                        className="form-input mt-1"
                                        placeholder="Masukkan Bentuk Usaha Penyedia"
                                        value={manualKontrakData?.bentuk_usaha_penyedia}
                                        onChange={(e) => {
                                            setManualKontrakData({ ...manualKontrakData, bentuk_usaha_penyedia: e.target.value });
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="input-wakil_sah_penyedia">
                                    <span className="text-sm text-slate-500">
                                        Wakil Sah Penyedia
                                        <span className="text-danger">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        id="input-wakil_sah_penyedia"
                                        className="form-input mt-1"
                                        placeholder="Masukkan Wakil Sah Penyedia"
                                        value={manualKontrakData?.wakil_sah_penyedia}
                                        onChange={(e) => {
                                            setManualKontrakData({ ...manualKontrakData, wakil_sah_penyedia: e.target.value });
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="input-jabatan_wakil_penyedia">
                                    <span className="text-sm text-slate-500">
                                        Jabatan Wakil Penyedia
                                        <span className="text-danger">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        id="input-jabatan_wakil_penyedia"
                                        className="form-input mt-1"
                                        placeholder="Masukkan Jabatan Wakil Penyedia"
                                        value={manualKontrakData?.jabatan_wakil_penyedia}
                                        onChange={(e) => {
                                            setManualKontrakData({ ...manualKontrakData, jabatan_wakil_penyedia: e.target.value });
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="mt-5 mb-2 col-span-2">
                                <div className="font-semibold text-lg border-b pb-2 text-slate-500">
                                    Nilai Kontrak
                                </div>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="input-nilai_kontrak">
                                    <span className="text-sm text-slate-500">
                                        Nilai Kontrak
                                        <span className="text-danger">*</span>
                                    </span>
                                    <InputRupiah
                                        dataValue={manualKontrakData?.nilai_kontrak}
                                        onChange={(e: any) => {
                                            setManualKontrakData({ ...manualKontrakData, nilai_kontrak: e });
                                        }}
                                        placeholder="Masukkan Nilai Kontrak"
                                        isFullWidth={true}
                                    />
                                </label>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="input-nilai_pdn_kontrak">
                                    <span className="text-sm text-slate-500">
                                        Nilai PDN Kontrak
                                        <span className="text-danger">*</span>
                                    </span>
                                    <InputRupiah
                                        dataValue={manualKontrakData?.nilai_pdn_kontrak}
                                        onChange={(e: any) => {
                                            setManualKontrakData({ ...manualKontrakData, nilai_pdn_kontrak: e });
                                        }}
                                        placeholder="Masukkan Nilai Kontrak"
                                        isFullWidth={true}
                                    />
                                </label>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="input-nilai_umk_kontrak">
                                    <span className="text-sm text-slate-500">
                                        Nilai UMK Kontrak
                                        <span className="text-danger">*</span>
                                    </span>
                                    <InputRupiah
                                        dataValue={manualKontrakData?.nilai_umk_kontrak}
                                        onChange={(e: any) => {
                                            setManualKontrakData({ ...manualKontrakData, nilai_umk_kontrak: e });
                                        }}
                                        placeholder="Masukkan Nilai Kontrak"
                                        isFullWidth={true}
                                    />
                                </label>
                            </div>

                            <div className="mt-5 mb-2 col-span-2">
                                <div className="font-semibold text-lg border-b pb-2 text-slate-500">
                                    Kode Rekening
                                </div>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="input-kode_rekening_id">
                                    <span className="text-sm text-slate-500">
                                        Kode Rekening
                                    </span>
                                    <Select placeholder="Pilih Kode Rekening"
                                        onChange={(e: any) => {
                                            setSelectedRekening(e?.value);
                                        }}
                                        isLoading={arrRekening?.length === 0}
                                        isClearable={true}
                                        // isDisabled={isLoading}
                                        value={
                                            arrRekening?.map((data: any, index: number) => {
                                                if (data.id == selectedRekening) {
                                                    return {
                                                        value: data.id,
                                                        label: data.fullcode + ' - ' + data.uraian,
                                                    }
                                                }
                                            })
                                        }
                                        options={
                                            arrRekening?.map((data: any, index: number) => {
                                                return {
                                                    value: data.id,
                                                    label: data.fullcode + ' - ' + data.uraian,
                                                }
                                            })
                                        } />
                                </label>
                            </div>

                            <div className="col-span-2">
                                <div className="flex items-center justify-between">
                                    <div className=""></div>
                                    <div className="flex items-center gap-x-2">
                                        <button
                                            type="submit"
                                            className="btn btn-success text-xs w-full">
                                            <FontAwesomeIcon icon={faSave} className="w-4 h-4 mr-1" />
                                            Tambah & Simpan Kontrak
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div>
                )}

            </div>

            <Transition appear show={modalView} as={Fragment}>
                <Dialog as="div" open={modalView} onClose={() => {
                    setModalView(false)
                    setSelectedKontrak(null);
                }}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg w-full max-w-[100%] md:max-w-[70%] my-8 text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <h5 className="font-semibold text-md">
                                            Detail Kontrak {selectedKontrak?.no_kontrak}
                                        </h5>
                                        <button
                                            type="button"
                                            className="text-white-dark hover:text-dark"
                                            onClick={() => {
                                                setModalView(false)
                                                setSelectedKontrak(null);
                                            }}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5 space-y-3">

                                        <div className="h-[calc(100vh-300px)] overflow-auto">
                                            <table className=''>
                                                <tbody>

                                                    <tr>
                                                        <td className='!w-[200px]'>
                                                            Nomor Kontrak
                                                        </td>
                                                        <td>
                                                            {selectedKontrak?.data_spse?.no_kontrak}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className='!w-[200px]'>
                                                            Jenis Kontrak
                                                        </td>
                                                        <td>
                                                            {selectedKontrak?.data_spse?.jenis_kontrak}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Nomor SPPBJ
                                                        </td>
                                                        <td>
                                                            {selectedKontrak?.data_spse?.no_sppbj}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Nama Paket
                                                        </td>
                                                        <td>
                                                            {selectedKontrak?.data_spse?.nama_paket}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Tanggal Kontrak
                                                        </td>
                                                        <td>
                                                            {new Date(selectedKontrak?.data_spse?.tgl_kontrak).toLocaleString('id-ID', { dateStyle: 'full' })}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Tanggal Kontrak Awal
                                                        </td>
                                                        <td>
                                                            {new Date(selectedKontrak?.data_spse?.tgl_kontrak_awal).toLocaleString('id-ID', { dateStyle: 'full' })}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Tanggal Kontrak Akhir
                                                        </td>
                                                        <td>
                                                            {new Date(selectedKontrak?.data_spse?.tgl_kontrak_akhir).toLocaleString('id-ID', { dateStyle: 'full' })}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Status Kontrak
                                                        </td>
                                                        <td>
                                                            {selectedKontrak?.data_spse?.status_kontrak}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className='!text-center font-semibold' colSpan={2}>
                                                            Satuan Kerja
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Nama Satuan Kerja
                                                        </td>
                                                        <td>
                                                            {selectedKontrak?.data_spse?.kd_satker_str}
                                                            <br />
                                                            {selectedKontrak?.data_spse?.nama_satker}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className='!text-center font-semibold' colSpan={2}>
                                                            PPK
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Nama PPK
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                {selectedKontrak?.data_spse?.nama_ppk}
                                                            </div>
                                                            <div className="text-xs">
                                                                {selectedKontrak?.data_spse?.nip_ppk}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Jabatan PPK
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                {selectedKontrak?.data_spse?.jabatan_ppk}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Nomor SK PPK
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                {selectedKontrak?.data_spse?.no_sk_ppk}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className='!text-center font-semibold' colSpan={2}>
                                                            Penyedia
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Nama Penyedia
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                {selectedKontrak?.data_spse?.nama_penyedia}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            NPWP Penyedia
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                {selectedKontrak?.data_spse?.npwp_penyedia}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Bentuk Usaha Penyedia
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                {selectedKontrak?.data_spse?.bentuk_usaha_penyedia}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Wakil Sah Penyedia
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                {selectedKontrak?.data_spse?.wakil_sah_penyedia}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Jabatan Wakil Penyedia
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                {selectedKontrak?.data_spse?.jabatan_wakil_penyedia}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Jabatan Wakil Penyedia
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                {selectedKontrak?.data_spse?.jabatan_wakil_penyedia}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className='!text-center font-semibold' colSpan={2}>
                                                            Nilai Kontrak
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Nilai Kontrak
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(selectedKontrak?.data_spse?.nilai_kontrak)}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Nilai PDN Kontrak
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(selectedKontrak?.data_spse?.nilai_pdn_kontrak)}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Nilai UMK Kontrak
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(selectedKontrak?.data_spse?.nilai_umk_kontrak)}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-end border-t pt-4 gap-2">
                                            <div>
                                                <button
                                                    onClick={() => {
                                                        setModalView(false);
                                                        setSelectedKontrak(null);
                                                    }}
                                                    type="button"
                                                    className="btn btn-outline-dark text-xs w-full">
                                                    <IconX className="w-4 h-4 mr-1" />
                                                    Tutup
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={modalViewKontrak} as={Fragment}>
                <Dialog as="div" open={modalViewKontrak} onClose={() => {
                    setModalViewKontrak(false)
                    setSelectedKontrak(null);
                }}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg w-full max-w-[100%] md:max-w-[70%] my-8 text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <h5 className="font-semibold text-md">
                                            Detail Kontrak {selectedKontrak?.no_kontrak}
                                        </h5>
                                        <button
                                            type="button"
                                            className="text-white-dark hover:text-dark"
                                            onClick={() => {
                                                setModalViewKontrak(false)
                                                setSelectedKontrak(null);
                                            }}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5 space-y-3">

                                        <div className="h-[calc(100vh-300px)] overflow-auto">
                                            <table className=''>
                                                <tbody>

                                                    <tr>
                                                        <td className='!w-[200px]'>
                                                            Nomor Kontrak
                                                        </td>
                                                        <td>
                                                            {selectedKontrak?.no_kontrak}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className='!w-[200px]'>
                                                            Jenis Kontrak
                                                        </td>
                                                        <td>
                                                            {selectedKontrak?.jenis_kontrak}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Nomor SPPBJ
                                                        </td>
                                                        <td>
                                                            {selectedKontrak?.no_sppbj}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Nama Paket
                                                        </td>
                                                        <td>
                                                            {selectedKontrak?.nama_paket}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Tanggal Kontrak
                                                        </td>
                                                        <td>
                                                            {new Date(selectedKontrak?.tgl_kontrak).toLocaleString('id-ID', { dateStyle: 'full' })}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Tanggal Kontrak Awal
                                                        </td>
                                                        <td>
                                                            {new Date(selectedKontrak?.tgl_kontrak_awal).toLocaleString('id-ID', { dateStyle: 'full' })}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Tanggal Kontrak Akhir
                                                        </td>
                                                        <td>
                                                            {new Date(selectedKontrak?.tgl_kontrak_akhir).toLocaleString('id-ID', { dateStyle: 'full' })}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Status Kontrak
                                                        </td>
                                                        <td>
                                                            {selectedKontrak?.status_kontrak}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className='!text-center font-semibold' colSpan={2}>
                                                            Satuan Kerja
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Nama Satuan Kerja
                                                        </td>
                                                        <td>
                                                            {/* {selectedKontrak?.kd_satker_str + ' - ' + selectedKontrak?.nama_satker} */}
                                                            {selectedKontrak?.kd_satker_str}
                                                            <br />
                                                            {selectedKontrak?.nama_satker}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className='!text-center font-semibold' colSpan={2}>
                                                            PPK
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Nama PPK
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                {selectedKontrak?.nama_ppk}
                                                            </div>
                                                            <div className="text-xs">
                                                                {selectedKontrak?.nip_ppk}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Jabatan PPK
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                {selectedKontrak?.jabatan_ppk}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Nomor SK PPK
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                {selectedKontrak?.no_sk_ppk}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className='!text-center font-semibold' colSpan={2}>
                                                            Penyedia
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Nama Penyedia
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                {selectedKontrak?.nama_penyedia}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            NPWP Penyedia
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                {selectedKontrak?.npwp_penyedia}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Bentuk Usaha Penyedia
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                {selectedKontrak?.bentuk_usaha_penyedia}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Wakil Sah Penyedia
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                {selectedKontrak?.wakil_sah_penyedia}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Jabatan Wakil Penyedia
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                {selectedKontrak?.jabatan_wakil_penyedia}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Jabatan Wakil Penyedia
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                {selectedKontrak?.jabatan_wakil_penyedia}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className='!text-center font-semibold' colSpan={2}>
                                                            Nilai Kontrak
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Nilai Kontrak
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(selectedKontrak?.nilai_kontrak)}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Nilai PDN Kontrak
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(selectedKontrak?.nilai_pdn_kontrak)}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className=''>
                                                            Nilai UMK Kontrak
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(selectedKontrak?.nilai_umk_kontrak)}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-end border-t pt-4 gap-2">
                                            <div>
                                                <button
                                                    onClick={() => {
                                                        handlePickRekening(selectedKontrak);
                                                    }}
                                                    type="button"
                                                    className="btn btn-outline-success text-xs w-full">
                                                    <FontAwesomeIcon icon={faLink} className="w-4 h-4 mr-1" />
                                                    Tautkan Kontrak
                                                </button>
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() => {
                                                        setModalViewKontrak(false);
                                                        setSelectedKontrak(null);
                                                    }}
                                                    type="button"
                                                    className="btn btn-outline-dark text-xs w-full">
                                                    <IconX className="w-4 h-4 mr-1" />
                                                    Tutup
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={modalPilihRekening} as={Fragment}>
                <Dialog
                    as="div"
                    open={modalPilihRekening}
                    onClose={() => {
                        setModalPilihRekening(false)
                        setModalViewKontrak(true)
                    }}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 bg-[black]/60 z-[1000] overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg w-full max-w-[100%] md:max-w-[40%] my-8 text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <h5 className="font-semibold text-md">
                                            Pilih Rekening untuk Kontrak :
                                            {selectedKontrak?.no_kontrak ? (
                                                <>
                                                    <br />
                                                    {selectedKontrak?.no_kontrak}
                                                </>
                                            ) : ''}
                                        </h5>
                                        <button
                                            type="button"
                                            className="text-white-dark hover:text-dark"
                                            onClick={() => {
                                                setModalPilihRekening(false)
                                                setModalViewKontrak(true)
                                            }}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5 space-y-3">
                                        <div className="">
                                            <Select placeholder="Pilih Kode Rekening"
                                                onChange={(e: any) => {
                                                    setSelectedRekening(e?.value);
                                                }}
                                                isLoading={arrRekening?.length === 0}
                                                isClearable={true}
                                                // isDisabled={isLoading}
                                                value={
                                                    arrRekening?.map((data: any, index: number) => {
                                                        if (data.id == selectedRekening) {
                                                            return {
                                                                value: data.id,
                                                                label: data.fullcode + ' - ' + data.uraian,
                                                            }
                                                        }
                                                    })
                                                }
                                                options={
                                                    arrRekening?.map((data: any, index: number) => {
                                                        return {
                                                            value: data.id,
                                                            label: data.fullcode + ' - ' + data.uraian,
                                                        }
                                                    })
                                                } />
                                        </div>

                                        <div className="flex flex-wrap items-center justify-end border-t pt-4 gap-2">
                                            <div>
                                                <button
                                                    onClick={() => {
                                                        handleLinkKontrak(selectedKontrak);
                                                        // handlePickRekening(selectedKontrak);
                                                    }}
                                                    type="button"
                                                    className="btn btn-outline-success text-xs w-full">
                                                    <FontAwesomeIcon icon={faLink} className="w-4 h-4 mr-1" />
                                                    Tautkan Kontrak
                                                </button>
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() => {
                                                        setModalPilihRekening(false);
                                                        setModalViewKontrak(true)
                                                    }}
                                                    type="button"
                                                    className="btn btn-outline-dark text-xs w-full">
                                                    <IconX className="w-4 h-4 mr-1" />
                                                    Tutup
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}

export default Kontrak;
