import { useEffect, useState, Fragment, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setPageTitle } from '@/store/themeConfigSlice';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import Link from 'next/link';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import IconX from '@/components/Icon/IconX';
const angkaTerbilang = require('@develoka/angka-terbilang-js');
import axios, { AxiosRequestConfig } from "axios";

import { fetchPeriodes, fetchSatuans } from '@/apis/fetchdata';
import {
    getMasterData,
    getKeteranganSubKegiatan,
    SaveKeterangan,
    DeleteKeteranganImage,
    SaveRealisasi,
    fetchLogs,
    sendRequestVerification,
    sendReplyVerification,
    SaveRincianRealisasi,
    getKontrakSPSE
} from '@/apis/realisasi_apis';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSave,
    faMinus,
    faMinusCircle,
    faPlus,
    faPlusCircle,
    faArrowRightToBracket,
    faBriefcaseClock,
    faCheck,
    faTimes,
    faSyncAlt,
    faForward,
    faHourglassHalf,
    faShare,
    faUserAlt,
    faExclamationCircle,
    faCaretUp,
    faCaretDown,
    faTimesCircle,
    faListUl,
    faPencilAlt,
    faThumbTack,
    faFileSignature,
    faAngleDoubleRight,
    faExclamationTriangle,
    faAngleDoubleLeft
} from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import IconSend from '@/components/Icon/IconSend';

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

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

const Index = () => {
    const dispatch = useDispatch();
    const ref = useRef<any>(null);

    useEffect(() => {
        dispatch(setPageTitle('Input Target Kinerja'));
    });

    const route = useRouter();

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [isMounted, setIsMounted] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const [CurrentUser, setCurrentUser] = useState<any>([]);
    useEffect(() => {
        if (window) {
            if (localStorage.getItem('user')) {
                setCurrentUser(JSON.parse(localStorage.getItem('user') ?? '{[]}') ?? []);
            }
        }
    }, []);

    const { t, i18n } = useTranslation();

    const closeWindow = () => {
        if (history.length > 1) {
            history.back();
        }
        else {
            window.close();
        }
    }

    const [periodes, setPeriodes] = useState([]);
    const [periode, setPeriode] = useState(1);
    const [subKegiatan, setSubKegiatan] = useState<any>(null);
    const [subKegiatanId, setSubKegiatanId] = useState<any>(null);
    const [year, setYear] = useState<any>(null);
    const [month, setMonth] = useState<any>(null);
    const [datas, setDatas] = useState<any>(null);
    const [dataRealisasiSubKegiatan, setDataRealisasiSubKegiatan] = useState<any>([]);
    const [dataKeterangan, setDataKeterangan] = useState<any>([]);
    const [unsaveStatus, setUnsaveStatus] = useState<boolean>(false);
    const [unsaveKeteranganStatus, setUnsaveKeteranganStatus] = useState<boolean>(false);
    const [dataBackEndError, setDataBackEndError] = useState<any>(null);
    const [dataBackEndMessage, setDataBackEndMessage] = useState<any>(null);
    const [dataRincian, setDataRincian] = useState<any>([]);
    const [satuans, setSatuans] = useState<any>([]);
    const [modalLogs, setModalLogs] = useState(false);
    const [logs, setLogs] = useState<any>([]);
    const [modalRequestVerification, setModalRequestVerification] = useState<boolean>(false);
    const [requestVerificationData, setRequestVerificationData] = useState<any>({
        message: null,
    });
    const [modalReplyVerification, setModalReplyVerification] = useState<boolean>(false);
    const [replyVerificationData, setReplyVerificationData] = useState<any>({
        status: null,
        message: null,
    });
    const [showTags, setShowTags] = useState(false);
    const [tab, setTab] = useState(2);
    const [openLightBox, setOpenLightBox] = useState(false);

    const [images, setImages] = useState<any>([]);
    const [imagesIndex, setImagesIndex] = useState<any>(-1)
    const imageSizes = [16, 32, 48, 64, 96, 128, 256, 384];
    const deviceSizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

    const [searchKontrak, setSearchKontrak] = useState<any>(null);
    const [kontrakSPSEOptions, setKontrakSPSEOptions] = useState<any>([]);
    const [selectedKontrak, setSelectedKontrak] = useState<any>(null);

    useEffect(() => {
        fetchSatuans().then((data) => {
            if (data.status == 'success') {
                setSatuans(data.data);
            }
        });
    }, [CurrentUser]);

    useEffect(() => {
        if (route.query.slug) {
            setSubKegiatanId(route.query.slug);
        }
        setYear(route.query.year ?? new Date().getFullYear());
        setMonth(route.query.month ?? new Date().getMonth());
    }, [route.query.slug]);

    useEffect(() => {
        if (subKegiatanId) {
            getMasterData(subKegiatanId, year, month).then((data: any) => {
                if (data.status == 'success') {
                    setDatas(data.data.data);
                    setDataRealisasiSubKegiatan(data.data.realisasiSubKegiatan);
                    setSubKegiatan(data.data.subkegiatan);
                    setDataRincian(data.data.dataRincian)
                    setDataBackEndError(data.data.data_error);
                    setDataBackEndMessage(data.data.error_message);
                }
            });
        }
        setIsMounted(true);
    }, [subKegiatanId]);

    useEffect(() => {
        if (dataRealisasiSubKegiatan.id && tab == 3) {
            getKeteranganSubKegiatan(dataRealisasiSubKegiatan.id, year, month).then((data: any) => {
                if (data.status == 'success') {
                    setDataKeterangan(data.data);
                    setImages(data.data.files);
                }
            });
        }
    }, [tab]);

    function nextImageUrl(src: any, size: any) {
        // return `/_next/image?url=${encodeURIComponent(src)}&w=${size}&q=75`;
        return `${src}?w=${size}&q=75`;
    }

    const slides = images?.map((img: any) => ({
        width: img.width ?? 1080,
        height: img.height ?? 1280,
        src: nextImageUrl(img.file, 1080),
        srcSet: imageSizes
            .concat(...deviceSizes)
            .filter((size) => size <= 1080)
            .map((size) => ({
                src: nextImageUrl(img.file, size),
                width: size,
                height: Math.round((1280 / 1080) * size),
            })),
    }));

    const confirmSave = () => {
        Swal.fire({
            title: 'Simpan Realisasi',
            text: 'Aksi ini akan merubah data pada bulan ini dan bulan berikutnya',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Simpan',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                SaveRealisasi(subKegiatanId, datas, periode, year, month).then((data: any) => {
                    if (data.status == 'success') {
                        showAlertBox('success', 'Berhasil', data.message);
                        setUnsaveStatus(false);
                    }
                    else {
                        showAlertBox('error', 'Error', data.message);
                    }
                });
                SaveRincianRealisasi(subKegiatanId, dataRincian, periode, year, month).then((data: any) => {
                    if (data.status == 'success') {
                        showAlertBox('success', 'Berhasil', data.message);
                        setUnsaveStatus(false);
                    }
                    else {
                        showAlertBox('error', 'Error', data.message);
                    }
                });
            }
        });
    }

    const openLogsModal = () => {
        setModalLogs(true);
        fetchLogs(subKegiatanId, year, month).then((data: any) => {
            if (data.status == 'success') {
                setLogs(data.data.logs);
            }
        });
    }

    const requestVerification = () => {
        setModalLogs(false);
        setModalRequestVerification(true);
        setRequestVerificationData({
            message: null,
        });
    }

    const sendReqVerification = () => {
        sendRequestVerification(subKegiatanId, requestVerificationData, year, month).then((data: any) => {
            if (data.status == 'success') {
                showAlert('success', 'Permintaan Verifikasi berhasil dikirim');
                setModalRequestVerification(false);
                openLogsModal();

                setSubKegiatan((prev: any) => {
                    const updated = { ...prev };
                    updated.status = 'sent';
                    return updated;
                });
            }
            else if (data.status == 'error validation') {
                const errors = data.message;
                for (const key in errors) {
                    const el = document.getElementById(key + '-request-verification');
                    if (el) {
                        el.classList.add('border-red-500');
                    }
                }
            }
            else {
                showAlert('error', data.message);
            }
        });
    }

    const replyVerification = () => {
        setModalLogs(false);
        setModalReplyVerification(true);
        setReplyVerificationData({
            status: null,
            message: null,
        });
    }

    const sentRepVerification = () => {
        sendReplyVerification(subKegiatanId, replyVerificationData, year, month).then((data: any) => {
            if (data.status == 'success') {
                showAlert('success', 'Balasan Verifikasi berhasil dikirim');
                setModalReplyVerification(false);
                openLogsModal();

                setSubKegiatan((prev: any) => {
                    const updated = { ...prev };
                    updated.status = replyVerificationData.status;
                    return updated;
                })
            }
            else if (data.status == 'error validation') {
                const errors = data.message;
                for (const key in errors) {
                    const el = document.getElementById(key + '-reply-verification');
                    if (el) {
                        el.classList.add('border-red-500');
                    }
                }
            }
            else {
                showAlert('error', data.message);
            }
        });
    }

    const updateTotalRealisasi = () => {
        let total = datas[0]?.realisasi_anggaran;
        setDataRincian((prev: any) => {
            const updated = prev;
            updated.indicators[0].realisasi = total;
            return updated;
        });
    }

    const saveKeterangan = () => {
        SaveKeterangan(dataRealisasiSubKegiatan.id, dataKeterangan, year, month).then((data: any) => {
            if (data.status === 'success') {
                showAlert('success', data.message)
                setUnsaveKeteranganStatus(false);
                if (dataRealisasiSubKegiatan.id && tab == 3) {
                    getKeteranganSubKegiatan(dataRealisasiSubKegiatan.id, year, month).then((data: any) => {
                        if (data.status == 'success') {
                            setDataKeterangan(data.data);
                            setImages(data.data.files);
                        }
                    });
                }
            }
        });
    }

    const deleteKeteranganImage = (id: any) => {
        DeleteKeteranganImage(id).then((data: any) => {
            if (data.status === 'success') {
                showAlert('success', data.message)
                setUnsaveKeteranganStatus(false);
                if (dataRealisasiSubKegiatan.id && tab == 3) {
                    getKeteranganSubKegiatan(dataRealisasiSubKegiatan.id, year, month).then((data: any) => {
                        if (data.status == 'success') {
                            setDataKeterangan(data.data);
                            setImages(data.data.files);
                        }
                    });
                }
            }
        });
    }

    const fetchingKontrak = () => {
        getKontrakSPSE(searchKontrak, year, subKegiatan.instance_code).then((data: any) => {
            if (data.status === 'success') {
                setKontrakSPSEOptions(data.data);
            }
            else {
                setKontrakSPSEOptions([]);
                showAlert('error', data.message);
            }
        });
    }

    const pickKontrak = (data: any) => {
        setSelectedKontrak(data);
    }


    if (subKegiatan && subKegiatan.status_target != 'verified') {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
                <div className="flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faExclamationTriangle} className='w-8 h-8 text-cyan-500' />
                    <div className="text-[40px] font-semibold text-cyan-500">
                        Mohon Maaf,
                    </div>
                </div>
                <div className="text-xl font-semibold text-cyan-500">
                    Anda Tidak Dapat Mengakses Halaman Ini
                </div>
                <div className="text-lg font-semibold text-orange-500 mt-2">
                    Dikarenakan Target Belum Terverifikasi
                </div>
                {/* back button */}
                <div className="mt-4">
                    <button
                        onClick={() => {
                            closeWindow();
                        }}
                        className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faAngleDoubleLeft} className='w-4 h-4 mr-2' />
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="panel p-0">

                <div className="w-full flex items-center">

                    <button
                        onClick={(e) => {
                            if (unsaveKeteranganStatus) {
                                e.preventDefault();
                                Swal.fire({
                                    title: 'Peringatan',
                                    text: 'Data Keterangan Belum Disimpan, Apakah Anda Yakin Ingin Melanjutkan?',
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonText: 'Ya, Lanjutkan',
                                    cancelButtonText: 'Batal',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        setUnsaveKeteranganStatus(false);
                                        setTab(2);
                                    }
                                });
                            } else {
                                setTab(2)
                            }
                        }}
                        className={`${tab === 2 ? 'text-white !outline-none before:!w-full bg-blue-500' : ''} grow text-blue-500 !outline-none relative -mb-[1px] flex items-center justify-center gap-2 p-4 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-blue-500 before:transition-all before:duration-700 hover:before:w-full`}
                    >
                        <FontAwesomeIcon icon={faPencilAlt} className='w-4 h-4' />
                        <span className='font-semibold whitespace-nowrap uppercase'>
                            Rincian Belanja
                        </span>
                    </button>

                    <button
                        onClick={() => {
                            setTab(3)
                        }}
                        className={`${tab === 3 ? 'text-white !outline-none before:!w-full bg-blue-500' : ''} rounded-tr grow text-blue-500 !outline-none relative -mb-[1px] flex items-center justify-center gap-2 p-4 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-blue-500 before:transition-all before:duration-700 hover:before:w-full`}
                    >
                        <FontAwesomeIcon icon={faThumbTack} className='w-4 h-4' />
                        <span className='font-semibold whitespace-nowrap uppercase'>
                            Keterangan
                        </span>
                    </button>

                    <button
                        onClick={(e) => {
                            if (unsaveKeteranganStatus) {
                                e.preventDefault();
                                Swal.fire({
                                    title: 'Peringatan',
                                    text: 'Data Keterangan Belum Disimpan, Apakah Anda Yakin Ingin Melanjutkan?',
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonText: 'Ya, Lanjutkan',
                                    cancelButtonText: 'Batal',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        setUnsaveKeteranganStatus(false);
                                        setTab(4);
                                    }
                                });
                            } else {
                                setTab(4)
                            }
                        }}
                        className={`${tab === 4 ? 'text-white !outline-none before:!w-full bg-blue-500' : ''} rounded-tr grow text-blue-500 !outline-none relative -mb-[1px] flex items-center justify-center gap-2 p-4 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-blue-500 before:transition-all before:duration-700 hover:before:w-full`}
                    >
                        <FontAwesomeIcon icon={faFileSignature} className='w-4 h-4' />
                        <span className='font-semibold whitespace-nowrap uppercase'>
                            Kontrak
                        </span>
                    </button>

                    <button
                        onClick={(e) => {
                            if (unsaveKeteranganStatus) {
                                e.preventDefault();
                                Swal.fire({
                                    title: 'Peringatan',
                                    text: 'Data Keterangan Belum Disimpan, Apakah Anda Yakin Ingin Melanjutkan?',
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonText: 'Ya, Lanjutkan',
                                    cancelButtonText: 'Batal',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        setUnsaveKeteranganStatus(false);
                                        setTab(1);
                                    }
                                });
                            } else {
                                setTab(1);
                            }
                        }}
                        className={`${tab === 1 ? 'text-white !outline-none before:!w-full bg-blue-500' : ''} rounded-tl grow text-blue-500 !outline-none relative -mb-[1px] flex items-center justify-center gap-2 p-4 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-blue-500 before:transition-all before:duration-700 hover:before:w-full`}
                    >
                        <FontAwesomeIcon icon={faListUl} className='w-4 h-4' />
                        <span className='font-semibold whitespace-nowrap uppercase'>
                            Data Realisasi
                        </span>
                    </button>

                </div>

                {tab === 2 && (
                    <div className="">
                        <div className="table-responsive h-[calc(100vh-210px)] border !border-slate-400 dark:!border-slate-100">
                            <table className=''>
                                <thead className='sticky top-0 left-0 z-[1]'>
                                    <tr>
                                        <th rowSpan={2}
                                            className='!text-center !text-sm bg-slate-400 !px-2.5 !py-1.5  !border-slate-400 dark:!border-slate-100 dark:text-white whitespace-nowrap !w-[150px]'>
                                            Kode Rekening
                                        </th>
                                        <th rowSpan={2}
                                            className='!text-center !text-sm bg-slate-400 !px-2.5 !py-1.5  !border-slate-400 dark:!border-slate-100 dark:text-white whitespace-nowrap !min-w-[400px]'>
                                            Uraian
                                        </th>
                                        <th rowSpan={1} colSpan={2}
                                            className='!text-center !text-sm bg-slate-400 !px-2.5 !py-1.5  !border-slate-400 dark:!border-slate-100 dark:text-white whitespace-nowrap !min-w-[250px]'>
                                            Koefisien
                                        </th>
                                        <th rowSpan={2}
                                            className='!text-center !text-sm bg-slate-400 !px-2.5 !py-1.5  !border-slate-400 dark:!border-slate-100 dark:text-white whitespace-nowrap !w-[100px]'>
                                            Harga (Rp)
                                        </th>
                                        <th rowSpan={1} colSpan={2}
                                            className='!text-center !text-sm bg-slate-400 !px-2.5 !py-1.5  !border-slate-400 dark:!border-slate-100 dark:text-white whitespace-nowrap !w-[100px]'>
                                            Jumlah (Rp)
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className='!text-center !text-sm bg-slate-400 !px-2.5 !py-1.5  !border-slate-400 dark:!border-slate-100 dark:text-white whitespace-nowrap !w-[100px]'>
                                            Target
                                        </th>
                                        <th className='!text-center !text-sm bg-slate-400 !px-2.5 !py-1.5  !border-slate-400 dark:!border-slate-100 dark:text-white whitespace-nowrap !w-[100px]'>
                                            Realisasi
                                        </th>
                                        <th className='!text-center !text-sm bg-slate-400 !px-2.5 !py-1.5  !border-slate-400 dark:!border-slate-100 dark:text-white whitespace-nowrap !w-[100px]'>
                                            Anggaran
                                        </th>
                                        <th className='!text-center !text-sm bg-slate-400 !px-2.5 !py-1.5  !border-slate-400 dark:!border-slate-100 dark:text-white whitespace-nowrap !w-[100px]'>
                                            Realisasi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='dark:text-white'>

                                    {(datas && datas?.length > 0) && (
                                        <>
                                            {datas?.map((data: any, index: any) => {
                                                return (
                                                    <>
                                                        <tr key={index} className=''>

                                                            <td className='border-y !border-slate-400 dark:!border-slate-100'>
                                                                <div className="text-xs font-semibold">
                                                                    {data.fullcode}
                                                                </div>
                                                            </td>

                                                            <td className='border !border-slate-400 dark:!border-slate-100'
                                                                colSpan={data.long ? 4 : 1}
                                                            >
                                                                <div className="text-xs font-semibold">
                                                                    {data.type == 'rekening' && (
                                                                        <>
                                                                            {data.uraian}
                                                                        </>
                                                                    )}
                                                                    {data.type == 'target-kinerja' && (
                                                                        <>
                                                                            <div className="flex items-center justify-between">
                                                                                <div className="">
                                                                                    <div className="">
                                                                                        [#] {data.nama_paket}
                                                                                    </div>
                                                                                    <div className="">
                                                                                        Sumber Dana : {data.sumber_dana_name}
                                                                                    </div>
                                                                                    <div className='flex items-center gap-x-2'>
                                                                                        <Tippy content={`Dibuat Oleh`}
                                                                                            animation='scale'
                                                                                        >
                                                                                            <div className="font-normal text-2xs mt-1.5 text-slate-500 flex items-center cursor-pointer">
                                                                                                <FontAwesomeIcon icon={faUserAlt} className='mr-1 w-1.5 h-1.5' />
                                                                                                {data.created_by_name}
                                                                                            </div>
                                                                                        </Tippy>

                                                                                        {data?.updated_by && (
                                                                                            <Tippy content={`Diperbarui Oleh`}
                                                                                                animation='scale'
                                                                                            >
                                                                                                <div className="font-normal text-2xs mt-1.5 text-blue-500 flex items-center cursor-pointer">
                                                                                                    <FontAwesomeIcon icon={faUserAlt} className='mr-1 w-1.5 h-1.5' />
                                                                                                    {data.updated_by_name}
                                                                                                </div>
                                                                                            </Tippy>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="">
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </td>

                                                            <td className='border !border-slate-400 dark:!border-slate-100 !px-1'>

                                                                <div className="text-xs font-semibold whitespace-nowrap text-end px-2">
                                                                    {new Intl.NumberFormat('id-ID', {
                                                                        style: 'decimal',
                                                                        minimumFractionDigits: 0,
                                                                    }).format(data?.pagu ?? 0)}
                                                                </div>

                                                            </td>

                                                            <td className='border !border-slate-400 dark:!border-slate-100 !px-1 !pr-4'>

                                                                {data?.type == 'rekening' && (
                                                                    <div className="text-xs font-semibold whitespace-nowrap text-end px-2">
                                                                        {new Intl.NumberFormat('id-ID', {
                                                                            style: 'decimal',
                                                                            minimumFractionDigits: 0,
                                                                        }).format(data?.realisasi_anggaran ?? 0)}
                                                                    </div>
                                                                )}

                                                                {(data?.type == 'target-kinerja' && data?.is_detail === true && data?.rincian_belanja?.length > 0) && (
                                                                    <div className="text-xs font-semibold whitespace-nowrap text-end px-2">
                                                                        {new Intl.NumberFormat('id-ID', {
                                                                            style: 'decimal',
                                                                            minimumFractionDigits: 0,
                                                                        }).format(data?.realisasi_anggaran ?? 0)}
                                                                    </div>
                                                                )}

                                                                {(data?.type == 'target-kinerja' && data?.is_detail === true && data?.rincian_belanja?.length == 0) && (
                                                                    <div>
                                                                        <input type='text'
                                                                            className='form-input w-[125px] border-slate-400 dark:border-slate-100 dark:text-white min-h-8 font-normal text-xs px-1.5 py-1 disabled:text-end disabled:bg-slate-200 dark:disabled:bg-slate-700'
                                                                            value={data?.realisasi_anggaran}
                                                                            onKeyDown={(e: any) => {
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
                                                                            disabled={(subKegiatan?.status === 'verified' || subKegiatan?.status_target !== 'verified') ? true : false}
                                                                            onChange={(e) => {
                                                                                if (subKegiatan?.status === 'verified') {
                                                                                    showAlert('error', 'Data tidak dapat diubah karena Status Realisasi Sudah "Terverifikasi"');
                                                                                    return;
                                                                                }
                                                                                if (subKegiatan?.status_target !== 'verified') {
                                                                                    showAlert('error', 'Target Belum Terverifikasi');
                                                                                    return;
                                                                                }
                                                                                setUnsaveStatus(true);
                                                                                let value = e.target.value ? parseFloat(e.target.value.toString().replace(/,/g, '.')) : 0;
                                                                                setDatas((prev: any) => {
                                                                                    const updated = [...prev];
                                                                                    let sumRealisasiAnggaran = data.rincian_belanja.reduce((a: any, b: any) => a + (b['realisasi_anggaran'] || 0), 0);
                                                                                    let isPaguMatch = sumRealisasiAnggaran == data.pagu ? true : false;
                                                                                    let isRealisasiMatch = value == data.pagu ? true : false;
                                                                                    updated[index] = {
                                                                                        editable: data?.editable,
                                                                                        long: data?.long,
                                                                                        type: data?.type,
                                                                                        id: data?.id,
                                                                                        id_rek_1: data?.id_rek_1,
                                                                                        id_rek_2: data?.id_rek_2,
                                                                                        id_rek_3: data?.id_rek_3,
                                                                                        id_rek_4: data?.id_rek_4,
                                                                                        id_rek_5: data?.id_rek_5,
                                                                                        id_rek_6: data?.id_rek_6,
                                                                                        parent_id: data?.parent_id,
                                                                                        year: data?.year,
                                                                                        jenis: data?.jenis,
                                                                                        sumber_dana_id: data?.sumber_dana_id,
                                                                                        sumber_dana_fullcode: data?.sumber_dana_fullcode,
                                                                                        sumber_dana_name: data?.sumber_dana_name,
                                                                                        nama_paket: data?.nama_paket,
                                                                                        pagu: data?.pagu,
                                                                                        realisasi_anggaran: value,
                                                                                        temp_pagu: data?.temp_pagu,
                                                                                        is_pagu_match: isPaguMatch,
                                                                                        is_detail: data?.is_detail,
                                                                                        created_by: data?.created_by,
                                                                                        created_by_name: data?.created_by_name,
                                                                                        updated_by: data?.updated_by,
                                                                                        updated_by_name: data?.updated_by_name,
                                                                                        rincian_belanja: data?.rincian_belanja,
                                                                                    };

                                                                                    const Rekening6 = updated.find((item: any) => item.id == data.parent_id);
                                                                                    const Rekening6Index = updated.findIndex((item: any) => item.id == data.parent_id);
                                                                                    const RincianBelanjas = updated.filter((item: any) => item.type == 'target-kinerja' && item.parent_id == data.parent_id);
                                                                                    let RincianSumAnggaran = RincianBelanjas.filter((item: any) => item.type == 'target-kinerja').reduce((a: any, b: any) => a + (b['realisasi_anggaran'] || 0), 0);

                                                                                    updated[Rekening6Index] = {
                                                                                        editable: Rekening6?.editable,
                                                                                        long: Rekening6?.long,
                                                                                        type: Rekening6?.type,
                                                                                        rek: Rekening6?.rek,
                                                                                        id: Rekening6?.id,
                                                                                        parent_id: Rekening6?.parent_id,
                                                                                        uraian: Rekening6?.uraian,
                                                                                        fullcode: Rekening6?.fullcode,
                                                                                        pagu: Rekening6?.pagu,
                                                                                        rincian_belanja: Rekening6?.rincian_belanja,
                                                                                        realisasi_anggaran: RincianSumAnggaran,
                                                                                    };

                                                                                    const Rekening5 = updated.find((item: any) => item.id == data.id_rek_5);
                                                                                    const Rekening5Index = updated.findIndex((item: any) => item.id == data.id_rek_5);
                                                                                    const updatedRekening6 = updated.filter((item: any) => item.rek == 6 && item.parent_id == data.id_rek_5);
                                                                                    let SumAnggaranRekening5 = updatedRekening6.reduce((a: any, b: any) => a + (b['realisasi_anggaran'] || 0), 0);

                                                                                    updated[Rekening5Index] = {
                                                                                        editable: Rekening5?.editable,
                                                                                        long: Rekening5?.long,
                                                                                        type: Rekening5?.type,
                                                                                        rek: Rekening5?.rek,
                                                                                        id: Rekening5?.id,
                                                                                        parent_id: Rekening5?.parent_id,
                                                                                        uraian: Rekening5?.uraian,
                                                                                        fullcode: Rekening5?.fullcode,
                                                                                        pagu: Rekening5?.pagu,
                                                                                        rincian_belanja: Rekening5?.rincian_belanja,
                                                                                        realisasi_anggaran: SumAnggaranRekening5,
                                                                                    };

                                                                                    const Rekening4 = updated.find((item: any) => item.id == data.id_rek_4);
                                                                                    const Rekening4Index = updated.findIndex((item: any) => item.id == data.id_rek_4);
                                                                                    const updatedRekening5 = updated.filter((item: any) => item.rek === 5 && item.parent_id == data.id_rek_4);
                                                                                    let SumAnggaranRekening4 = updatedRekening5.reduce((a: any, b: any) => a + (b['realisasi_anggaran'] || 0), 0);

                                                                                    updated[Rekening4Index] = {
                                                                                        editable: Rekening4?.editable,
                                                                                        long: Rekening4?.long,
                                                                                        type: Rekening4?.type,
                                                                                        rek: Rekening4?.rek,
                                                                                        id: Rekening4?.id,
                                                                                        parent_id: Rekening4?.parent_id,
                                                                                        uraian: Rekening4?.uraian,
                                                                                        fullcode: Rekening4?.fullcode,
                                                                                        pagu: Rekening4?.pagu,
                                                                                        rincian_belanja: Rekening4?.rincian_belanja,
                                                                                        realisasi_anggaran: SumAnggaranRekening4,
                                                                                    };

                                                                                    const Rekening3 = updated.find((item: any) => item.id == data.id_rek_3);
                                                                                    const Rekening3Index = updated.findIndex((item: any) => item.id == data.id_rek_3);
                                                                                    const updatedRekening4 = updated.filter((item: any) => item.rek === 4 && item.parent_id == data.id_rek_3);
                                                                                    let SumAnggaranRekening3 = updatedRekening4.reduce((a: any, b: any) => a + (b['realisasi_anggaran'] || 0), 0);

                                                                                    updated[Rekening3Index] = {
                                                                                        editable: Rekening3?.editable,
                                                                                        long: Rekening3?.long,
                                                                                        type: Rekening3?.type,
                                                                                        rek: Rekening3?.rek,
                                                                                        id: Rekening3?.id,
                                                                                        parent_id: Rekening3?.parent_id,
                                                                                        uraian: Rekening3?.uraian,
                                                                                        fullcode: Rekening3?.fullcode,
                                                                                        pagu: Rekening3?.pagu,
                                                                                        rincian_belanja: Rekening3?.rincian_belanja,
                                                                                        realisasi_anggaran: SumAnggaranRekening3,
                                                                                    };

                                                                                    const Rekening2 = updated.find((item: any) => item.id == data.id_rek_2);
                                                                                    const Rekening2Index = updated.findIndex((item: any) => item.id == data.id_rek_2);
                                                                                    const updatedRekening3 = updated.filter((item: any) => item.rek === 3 && item.parent_id == data.id_rek_2);
                                                                                    let SumAnggaranRekening2 = updatedRekening3.reduce((a: any, b: any) => a + (b['realisasi_anggaran'] || 0), 0);

                                                                                    updated[Rekening2Index] = {
                                                                                        editable: Rekening2?.editable,
                                                                                        long: Rekening2?.long,
                                                                                        type: Rekening2?.type,
                                                                                        rek: Rekening2?.rek,
                                                                                        id: Rekening2?.id,
                                                                                        parent_id: Rekening2?.parent_id,
                                                                                        uraian: Rekening2?.uraian,
                                                                                        fullcode: Rekening2?.fullcode,
                                                                                        pagu: Rekening2?.pagu,
                                                                                        rincian_belanja: Rekening2?.rincian_belanja,
                                                                                        realisasi_anggaran: SumAnggaranRekening2,
                                                                                    };

                                                                                    const Rekening1 = updated.find((item: any) => item.id == data.id_rek_1);
                                                                                    const Rekening1Index = updated.findIndex((item: any) => item.id == data.id_rek_1);
                                                                                    const updatedRekening2 = updated.filter((item: any) => item.rek === 2 && item.parent_id == data.id_rek_1);
                                                                                    let SumAnggaranRekening1 = updatedRekening2.reduce((a: any, b: any) => a + (b['realisasi_anggaran'] || 0), 0);

                                                                                    updated[Rekening1Index] = {
                                                                                        editable: Rekening1?.editable,
                                                                                        long: Rekening1?.long,
                                                                                        type: Rekening1?.type,
                                                                                        rek: Rekening1?.rek,
                                                                                        id: Rekening1?.id,
                                                                                        parent_id: Rekening1?.parent_id,
                                                                                        uraian: Rekening1?.uraian,
                                                                                        fullcode: Rekening1?.fullcode,
                                                                                        pagu: Rekening1?.pagu,
                                                                                        rincian_belanja: Rekening1?.rincian_belanja,
                                                                                        realisasi_anggaran: SumAnggaranRekening1,
                                                                                    };

                                                                                    return updated;
                                                                                })
                                                                                updateTotalRealisasi();
                                                                            }}
                                                                            onBlur={(e) => {
                                                                                updateTotalRealisasi();
                                                                            }}
                                                                        />
                                                                    </div>
                                                                )}

                                                                {(data?.type == 'target-kinerja' && data?.is_detail === false) && (
                                                                    <div>
                                                                        <input type='text'
                                                                            className='form-input w-[125px] border-slate-400 dark:border-slate-100 dark:text-white min-h-8 font-normal text-xs px-1.5 py-1 disabled:text-end disabled:bg-slate-200 dark:disabled:bg-slate-700'
                                                                            value={data?.realisasi_anggaran}
                                                                            onKeyDown={(e: any) => {
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
                                                                            disabled={(subKegiatan?.status === 'verified' || subKegiatan?.status_target !== 'verified') ? true : false}
                                                                            onChange={(e) => {
                                                                                if (subKegiatan?.status === 'verified') {
                                                                                    showAlert('error', 'Data tidak dapat diubah karena Status Realisasi Sudah "Terverifikasi"');
                                                                                    return;
                                                                                }
                                                                                if (subKegiatan?.status_target !== 'verified') {
                                                                                    showAlert('error', 'Target Belum Terverifikasi');
                                                                                    return;
                                                                                }
                                                                                setUnsaveStatus(true);
                                                                                let value = e.target.value ? parseFloat(e.target.value.toString().replace(/,/g, '.')) : 0;
                                                                                setDatas((prev: any) => {
                                                                                    const updated = [...prev];
                                                                                    let sumRealisasiAnggaran = data.rincian_belanja.reduce((a: any, b: any) => a + (b['realisasi_anggaran'] || 0), 0);
                                                                                    let isPaguMatch = sumRealisasiAnggaran == data.pagu ? true : false;
                                                                                    let isRealisasiMatch = value == data.pagu ? true : false;
                                                                                    updated[index] = {
                                                                                        editable: data?.editable,
                                                                                        long: data?.long,
                                                                                        type: data?.type,
                                                                                        id: data?.id,
                                                                                        id_rek_1: data?.id_rek_1,
                                                                                        id_rek_2: data?.id_rek_2,
                                                                                        id_rek_3: data?.id_rek_3,
                                                                                        id_rek_4: data?.id_rek_4,
                                                                                        id_rek_5: data?.id_rek_5,
                                                                                        id_rek_6: data?.id_rek_6,
                                                                                        parent_id: data?.parent_id,
                                                                                        year: data?.year,
                                                                                        jenis: data?.jenis,
                                                                                        sumber_dana_id: data?.sumber_dana_id,
                                                                                        sumber_dana_fullcode: data?.sumber_dana_fullcode,
                                                                                        sumber_dana_name: data?.sumber_dana_name,
                                                                                        nama_paket: data?.nama_paket,
                                                                                        pagu: data?.pagu,
                                                                                        realisasi_anggaran: value,
                                                                                        temp_pagu: data?.temp_pagu,
                                                                                        is_pagu_match: isPaguMatch,
                                                                                        is_detail: data?.is_detail,
                                                                                        created_by: data?.created_by,
                                                                                        created_by_name: data?.created_by_name,
                                                                                        updated_by: data?.updated_by,
                                                                                        updated_by_name: data?.updated_by_name,
                                                                                        rincian_belanja: data?.rincian_belanja,
                                                                                    };

                                                                                    const Rekening6 = updated.find((item: any) => item.id == data.parent_id);
                                                                                    const Rekening6Index = updated.findIndex((item: any) => item.id == data.parent_id);
                                                                                    const RincianBelanjas = updated.filter((item: any) => item.type == 'target-kinerja' && item.parent_id == data.parent_id);
                                                                                    let RincianSumAnggaran = RincianBelanjas.filter((item: any) => item.type == 'target-kinerja').reduce((a: any, b: any) => a + (b['realisasi_anggaran'] || 0), 0);

                                                                                    updated[Rekening6Index] = {
                                                                                        editable: Rekening6?.editable,
                                                                                        long: Rekening6?.long,
                                                                                        type: Rekening6?.type,
                                                                                        rek: Rekening6?.rek,
                                                                                        id: Rekening6?.id,
                                                                                        parent_id: Rekening6?.parent_id,
                                                                                        uraian: Rekening6?.uraian,
                                                                                        fullcode: Rekening6?.fullcode,
                                                                                        pagu: Rekening6?.pagu,
                                                                                        rincian_belanja: Rekening6?.rincian_belanja,
                                                                                        realisasi_anggaran: RincianSumAnggaran,
                                                                                    };

                                                                                    const Rekening5 = updated.find((item: any) => item.id == data.id_rek_5);
                                                                                    const Rekening5Index = updated.findIndex((item: any) => item.id == data.id_rek_5);
                                                                                    const updatedRekening6 = updated.filter((item: any) => item.rek == 6 && item.parent_id == data.id_rek_5);
                                                                                    let SumAnggaranRekening5 = updatedRekening6.reduce((a: any, b: any) => a + (b['realisasi_anggaran'] || 0), 0);

                                                                                    updated[Rekening5Index] = {
                                                                                        editable: Rekening5?.editable,
                                                                                        long: Rekening5?.long,
                                                                                        type: Rekening5?.type,
                                                                                        rek: Rekening5?.rek,
                                                                                        id: Rekening5?.id,
                                                                                        parent_id: Rekening5?.parent_id,
                                                                                        uraian: Rekening5?.uraian,
                                                                                        fullcode: Rekening5?.fullcode,
                                                                                        pagu: Rekening5?.pagu,
                                                                                        rincian_belanja: Rekening5?.rincian_belanja,
                                                                                        realisasi_anggaran: SumAnggaranRekening5,
                                                                                    };

                                                                                    const Rekening4 = updated.find((item: any) => item.id == data.id_rek_4);
                                                                                    const Rekening4Index = updated.findIndex((item: any) => item.id == data.id_rek_4);
                                                                                    const updatedRekening5 = updated.filter((item: any) => item.rek === 5 && item.parent_id == data.id_rek_4);
                                                                                    let SumAnggaranRekening4 = updatedRekening5.reduce((a: any, b: any) => a + (b['realisasi_anggaran'] || 0), 0);

                                                                                    updated[Rekening4Index] = {
                                                                                        editable: Rekening4?.editable,
                                                                                        long: Rekening4?.long,
                                                                                        type: Rekening4?.type,
                                                                                        rek: Rekening4?.rek,
                                                                                        id: Rekening4?.id,
                                                                                        parent_id: Rekening4?.parent_id,
                                                                                        uraian: Rekening4?.uraian,
                                                                                        fullcode: Rekening4?.fullcode,
                                                                                        pagu: Rekening4?.pagu,
                                                                                        rincian_belanja: Rekening4?.rincian_belanja,
                                                                                        realisasi_anggaran: SumAnggaranRekening4,
                                                                                    };

                                                                                    const Rekening3 = updated.find((item: any) => item.id == data.id_rek_3);
                                                                                    const Rekening3Index = updated.findIndex((item: any) => item.id == data.id_rek_3);
                                                                                    const updatedRekening4 = updated.filter((item: any) => item.rek === 4 && item.parent_id == data.id_rek_3);
                                                                                    let SumAnggaranRekening3 = updatedRekening4.reduce((a: any, b: any) => a + (b['realisasi_anggaran'] || 0), 0);

                                                                                    updated[Rekening3Index] = {
                                                                                        editable: Rekening3?.editable,
                                                                                        long: Rekening3?.long,
                                                                                        type: Rekening3?.type,
                                                                                        rek: Rekening3?.rek,
                                                                                        id: Rekening3?.id,
                                                                                        parent_id: Rekening3?.parent_id,
                                                                                        uraian: Rekening3?.uraian,
                                                                                        fullcode: Rekening3?.fullcode,
                                                                                        pagu: Rekening3?.pagu,
                                                                                        rincian_belanja: Rekening3?.rincian_belanja,
                                                                                        realisasi_anggaran: SumAnggaranRekening3,
                                                                                    };

                                                                                    const Rekening2 = updated.find((item: any) => item.id == data.id_rek_2);
                                                                                    const Rekening2Index = updated.findIndex((item: any) => item.id == data.id_rek_2);
                                                                                    const updatedRekening3 = updated.filter((item: any) => item.rek === 3 && item.parent_id == data.id_rek_2);
                                                                                    let SumAnggaranRekening2 = updatedRekening3.reduce((a: any, b: any) => a + (b['realisasi_anggaran'] || 0), 0);

                                                                                    updated[Rekening2Index] = {
                                                                                        editable: Rekening2?.editable,
                                                                                        long: Rekening2?.long,
                                                                                        type: Rekening2?.type,
                                                                                        rek: Rekening2?.rek,
                                                                                        id: Rekening2?.id,
                                                                                        parent_id: Rekening2?.parent_id,
                                                                                        uraian: Rekening2?.uraian,
                                                                                        fullcode: Rekening2?.fullcode,
                                                                                        pagu: Rekening2?.pagu,
                                                                                        rincian_belanja: Rekening2?.rincian_belanja,
                                                                                        realisasi_anggaran: SumAnggaranRekening2,
                                                                                    };

                                                                                    const Rekening1 = updated.find((item: any) => item.id == data.id_rek_1);
                                                                                    const Rekening1Index = updated.findIndex((item: any) => item.id == data.id_rek_1);
                                                                                    const updatedRekening2 = updated.filter((item: any) => item.rek === 2 && item.parent_id == data.id_rek_1);
                                                                                    let SumAnggaranRekening1 = updatedRekening2.reduce((a: any, b: any) => a + (b['realisasi_anggaran'] || 0), 0);

                                                                                    updated[Rekening1Index] = {
                                                                                        editable: Rekening1?.editable,
                                                                                        long: Rekening1?.long,
                                                                                        type: Rekening1?.type,
                                                                                        rek: Rekening1?.rek,
                                                                                        id: Rekening1?.id,
                                                                                        parent_id: Rekening1?.parent_id,
                                                                                        uraian: Rekening1?.uraian,
                                                                                        fullcode: Rekening1?.fullcode,
                                                                                        pagu: Rekening1?.pagu,
                                                                                        rincian_belanja: Rekening1?.rincian_belanja,
                                                                                        realisasi_anggaran: SumAnggaranRekening1,
                                                                                    };

                                                                                    return updated;
                                                                                })
                                                                                updateTotalRealisasi();
                                                                            }}
                                                                            onBlur={(e) => {
                                                                                updateTotalRealisasi();
                                                                            }}
                                                                        />
                                                                    </div>
                                                                )}

                                                            </td>

                                                        </tr>

                                                        {(data?.rincian_belanja && data?.rincian_belanja?.length > 0) && (
                                                            <>
                                                                {data?.rincian_belanja?.map((rincian: any, indexRincian: any) => {
                                                                    return (
                                                                        <>
                                                                            <tr>
                                                                                <td className='border-y !border-slate-400 dark:!border-slate-100'>
                                                                                </td>
                                                                                <td className='border !border-slate-400 dark:!border-slate-100' colSpan={4}>
                                                                                    <div className="text-xs font-semibold">
                                                                                        {rincian?.title}
                                                                                    </div>
                                                                                </td>
                                                                                <td className='border !border-slate-400 dark:!border-slate-100 !px-1'>
                                                                                    <div className='text-xs font-semibold whitespace-nowrap text-end px-2'>
                                                                                        {new Intl.NumberFormat('id-ID', {
                                                                                            style: 'decimal',
                                                                                            minimumFractionDigits: 0,
                                                                                        }).format(rincian?.pagu ?? 0)}
                                                                                    </div>
                                                                                </td>
                                                                                <td className='border !border-slate-400 dark:!border-slate-100 !px-1 !pr-4'>
                                                                                    <div className='text-xs font-semibold whitespace-nowrap text-end px-2'>
                                                                                        {new Intl.NumberFormat('id-ID', {
                                                                                            style: 'decimal',
                                                                                            minimumFractionDigits: 0,
                                                                                        }).format(rincian?.realisasi_anggaran ?? 0)}
                                                                                    </div>
                                                                                </td>
                                                                            </tr>

                                                                            {rincian?.keterangan_rincian?.map((keterangan: any, indexKeterangan: any) => {
                                                                                return (
                                                                                    <>
                                                                                        <tr>
                                                                                            <td className='border-y !border-slate-400 dark:!border-slate-100'>
                                                                                            </td>
                                                                                            <td className='border !border-slate-400 dark:!border-slate-100'>
                                                                                                <div className="font-normal text-xs">
                                                                                                    {keterangan.title.split('\n').map((item: any, key: any) => {
                                                                                                        return <Fragment key={key}>{item}<br /></Fragment>
                                                                                                    })}
                                                                                                </div>
                                                                                            </td>
                                                                                            <td className='border !border-slate-400 dark:!border-slate-100'>
                                                                                                <div className='text-xs whitespace-nowrap'>
                                                                                                    {keterangan?.koefisien.toString().replace(/\./g, ',')}
                                                                                                    {keterangan?.koefisien > 1 ? ' ' + keterangan?.satuan_name : ' ' + keterangan?.satuan_name}
                                                                                                </div>
                                                                                            </td>
                                                                                            <td className='border !border-slate-400 dark:!border-slate-100 !p-1 !py-0'>
                                                                                                <div className="text-xs flex gap-x-1 items-center">
                                                                                                    <input
                                                                                                        className='form-input w-[125px] border-slate-400 dark:border-slate-100 dark:text-white min-h-8 font-normal text-xs px-1.5 py-1  disabled:text-end disabled:bg-slate-200 dark:disabled:bg-slate-700'
                                                                                                        type='text'
                                                                                                        // value={keterangan?.koefisien_realisasi}
                                                                                                        // change dot to comma
                                                                                                        value={keterangan?.koefisien_realisasi.toString().replace(/\./g, ',')}
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
                                                                                                        disabled={(subKegiatan?.status === 'verified' || subKegiatan?.status_target !== 'verified') ? true : false}
                                                                                                        onChange={
                                                                                                            (e) => {
                                                                                                                if (subKegiatan?.status === 'verified') {
                                                                                                                    showAlert('error', 'Data tidak dapat diubah karena Status Realisasi Sudah "Terverifikasi"');
                                                                                                                    return;
                                                                                                                }
                                                                                                                if (subKegiatan?.status_target !== 'verified') {
                                                                                                                    showAlert('error', 'Target Belum Terverifikasi');
                                                                                                                    return;
                                                                                                                }
                                                                                                                setUnsaveStatus(true);
                                                                                                                let value = e.target.value ? parseFloat(e.target.value.toString().replace(/,/g, '.')) : 0;
                                                                                                                setDatas((prev: any) => {
                                                                                                                    const updated = [...prev];

                                                                                                                    let hargaSatuan = keterangan?.harga_satuan && keterangan?.harga_satuan.toString().replace(/\./g, '.');
                                                                                                                    let calculateRealisasiAnggaran = value * parseFloat(hargaSatuan);
                                                                                                                    calculateRealisasiAnggaran = parseFloat(calculateRealisasiAnggaran.toFixed(0));
                                                                                                                    let sumRealisasiAnggaran = data.rincian_belanja.reduce((a: any, b: any) => a + (b['keterangan_rincian'][indexKeterangan]?.realisasi_anggaran_keterangan || 0), 0);
                                                                                                                    let isPaguMatch = sumRealisasiAnggaran == data.pagu ? true : false;
                                                                                                                    let isRealisasiMatch = calculateRealisasiAnggaran == keterangan?.pagu ? true : false;
                                                                                                                    updated[index] = {
                                                                                                                        editable: data?.editable,
                                                                                                                        long: data?.long,
                                                                                                                        type: data?.type,
                                                                                                                        id: data?.id,
                                                                                                                        id_rek_1: data?.id_rek_1,
                                                                                                                        id_rek_2: data?.id_rek_2,
                                                                                                                        id_rek_3: data?.id_rek_3,
                                                                                                                        id_rek_4: data?.id_rek_4,
                                                                                                                        id_rek_5: data?.id_rek_5,
                                                                                                                        id_rek_6: data?.id_rek_6,
                                                                                                                        parent_id: data?.parent_id,
                                                                                                                        year: data?.year,
                                                                                                                        jenis: data?.jenis,
                                                                                                                        sumber_dana_id: data?.sumber_dana_id,
                                                                                                                        sumber_dana_fullcode: data?.sumber_dana_fullcode,
                                                                                                                        sumber_dana_name: data?.sumber_dana_name,
                                                                                                                        nama_paket: data?.nama_paket,
                                                                                                                        pagu: data?.pagu,
                                                                                                                        realisasi_anggaran: sumRealisasiAnggaran,
                                                                                                                        temp_pagu: data?.temp_pagu,
                                                                                                                        is_pagu_match: isPaguMatch,
                                                                                                                        is_detail: data?.is_detail,
                                                                                                                        rincian_belanja: data?.rincian_belanja,
                                                                                                                    };
                                                                                                                    updated[index]['rincian_belanja'][indexRincian] = {
                                                                                                                        editable: rincian?.editable,
                                                                                                                        long: rincian?.long,
                                                                                                                        type: rincian?.type,
                                                                                                                        id: rincian?.id,
                                                                                                                        id_rek_1: rincian?.id_rek_1,
                                                                                                                        id_rek_2: rincian?.id_rek_2,
                                                                                                                        id_rek_3: rincian?.id_rek_3,
                                                                                                                        id_rek_4: rincian?.id_rek_4,
                                                                                                                        id_rek_5: rincian?.id_rek_5,
                                                                                                                        id_rek_6: rincian?.id_rek_6,
                                                                                                                        target_kinerja_id: rincian?.target_kinerja_id,
                                                                                                                        keterangan_rincian: rincian?.keterangan_rincian,
                                                                                                                        title: rincian?.title,
                                                                                                                        pagu: rincian?.pagu,
                                                                                                                        realisasi_anggaran: calculateRealisasiAnggaran,
                                                                                                                    };
                                                                                                                    updated[index]['rincian_belanja'][indexRincian]['keterangan_rincian'][indexKeterangan] = {
                                                                                                                        editable: keterangan?.editable,
                                                                                                                        id: keterangan?.id,
                                                                                                                        long: keterangan?.long,
                                                                                                                        type: keterangan?.type,
                                                                                                                        target_kinerja_id: keterangan?.target_kinerja_id,
                                                                                                                        title: keterangan?.title,
                                                                                                                        koefisien: keterangan?.koefisien,
                                                                                                                        koefisien_realisasi: e.target.value,
                                                                                                                        satuan_id: keterangan?.satuan_id,
                                                                                                                        satuan_name: keterangan?.satuan_name,
                                                                                                                        harga_satuan: keterangan?.harga_satuan,
                                                                                                                        ppn: keterangan?.ppn,
                                                                                                                        pagu: keterangan?.pagu,
                                                                                                                        is_realisasi_match: isRealisasiMatch,
                                                                                                                        realisasi_anggaran_keterangan: calculateRealisasiAnggaran,
                                                                                                                        target_persentase_kinerja: keterangan?.target_persentase_kinerja,
                                                                                                                        persentase_kinerja: keterangan?.persentase_kinerja,
                                                                                                                    };

                                                                                                                    const Rekening6 = updated.find((item: any) => item.id == rincian.id_rek_6);
                                                                                                                    const Rekening6Index = updated.findIndex((item: any) => item.id == rincian.id_rek_6);
                                                                                                                    const RincianBelanjas = updated.filter((item: any) => item.type == 'target-kinerja' && item.parent_id == rincian.id_rek_6);
                                                                                                                    let RincianSumAnggaran = RincianBelanjas.filter((item: any) => item.type == 'target-kinerja').reduce((a: any, b: any) => a + (b['realisasi_anggaran'] || 0), 0);

                                                                                                                    updated[Rekening6Index] = {
                                                                                                                        editable: Rekening6?.editable,
                                                                                                                        long: Rekening6?.long,
                                                                                                                        type: Rekening6?.type,
                                                                                                                        rek: Rekening6?.rek,
                                                                                                                        id: Rekening6?.id,
                                                                                                                        parent_id: Rekening6?.parent_id,
                                                                                                                        uraian: Rekening6?.uraian,
                                                                                                                        fullcode: Rekening6?.fullcode,
                                                                                                                        pagu: Rekening6?.pagu,
                                                                                                                        rincian_belanja: Rekening6?.rincian_belanja,
                                                                                                                        realisasi_anggaran: RincianSumAnggaran,
                                                                                                                    };

                                                                                                                    const Rekening5 = updated.find((item: any) => item.id == rincian.id_rek_5);
                                                                                                                    const Rekening5Index = updated.findIndex((item: any) => item.id == rincian.id_rek_5);
                                                                                                                    const updatedRekenings6 = updated.filter((item: any) => item.rek === 6 && item.parent_id == rincian.id_rek_5);
                                                                                                                    let SumAnggaranRekening5 = updatedRekenings6.reduce((a: any, b: any) => a + (b['realisasi_anggaran'] || 0), 0);

                                                                                                                    updated[Rekening5Index] = {
                                                                                                                        editable: Rekening5?.editable,
                                                                                                                        long: Rekening5?.long,
                                                                                                                        type: Rekening5?.type,
                                                                                                                        rek: Rekening5?.rek,
                                                                                                                        id: Rekening5?.id,
                                                                                                                        parent_id: Rekening5?.parent_id,
                                                                                                                        uraian: Rekening5?.uraian,
                                                                                                                        fullcode: Rekening5?.fullcode,
                                                                                                                        pagu: Rekening5?.pagu,
                                                                                                                        rincian_belanja: Rekening5?.rincian_belanja,
                                                                                                                        realisasi_anggaran: SumAnggaranRekening5,
                                                                                                                    };

                                                                                                                    const Rekening4 = updated.find((item: any) => item.id == rincian.id_rek_4);
                                                                                                                    const Rekening4Index = updated.findIndex((item: any) => item.id == rincian.id_rek_4);
                                                                                                                    const updatedRekenings5 = updated.filter((item: any) => item.rek === 5 && item.parent_id == rincian.id_rek_4);
                                                                                                                    let SumAnggaranRekening4 = updatedRekenings5.reduce((a: any, b: any) => a + (b['realisasi_anggaran'] || 0), 0);

                                                                                                                    updated[Rekening4Index] = {
                                                                                                                        editable: Rekening4?.editable,
                                                                                                                        long: Rekening4?.long,
                                                                                                                        type: Rekening4?.type,
                                                                                                                        rek: Rekening4?.rek,
                                                                                                                        id: Rekening4?.id,
                                                                                                                        parent_id: Rekening4?.parent_id,
                                                                                                                        uraian: Rekening4?.uraian,
                                                                                                                        fullcode: Rekening4?.fullcode,
                                                                                                                        pagu: Rekening4?.pagu,
                                                                                                                        rincian_belanja: Rekening4?.rincian_belanja,
                                                                                                                        realisasi_anggaran: SumAnggaranRekening4,
                                                                                                                    };

                                                                                                                    const Rekening3 = updated.find((item: any) => item.id == rincian.id_rek_3);
                                                                                                                    const Rekening3Index = updated.findIndex((item: any) => item.id == rincian.id_rek_3);
                                                                                                                    const updatedRekenings4 = updated.filter((item: any) => item.rek === 4 && item.parent_id == rincian.id_rek_3);
                                                                                                                    let SumAnggaranRekening3 = updatedRekenings4.reduce((a: any, b: any) => a + (b['realisasi_anggaran'] || 0), 0);

                                                                                                                    updated[Rekening3Index] = {
                                                                                                                        editable: Rekening3?.editable,
                                                                                                                        long: Rekening3?.long,
                                                                                                                        type: Rekening3?.type,
                                                                                                                        rek: Rekening3?.rek,
                                                                                                                        id: Rekening3?.id,
                                                                                                                        parent_id: Rekening3?.parent_id,
                                                                                                                        uraian: Rekening3?.uraian,
                                                                                                                        fullcode: Rekening3?.fullcode,
                                                                                                                        pagu: Rekening3?.pagu,
                                                                                                                        rincian_belanja: Rekening3?.rincian_belanja,
                                                                                                                        realisasi_anggaran: SumAnggaranRekening3,
                                                                                                                    };

                                                                                                                    const Rekening2 = updated.find((item: any) => item.id == rincian.id_rek_2);
                                                                                                                    const Rekening2Index = updated.findIndex((item: any) => item.id == rincian.id_rek_2);
                                                                                                                    const updatedRekenings3 = updated.filter((item: any) => item.rek === 3 && item.parent_id == rincian.id_rek_2);
                                                                                                                    let SumAnggaranRekening2 = updatedRekenings3.reduce((a: any, b: any) => a + (b['realisasi_anggaran'] || 0), 0);

                                                                                                                    updated[Rekening2Index] = {
                                                                                                                        editable: Rekening2?.editable,
                                                                                                                        long: Rekening2?.long,
                                                                                                                        type: Rekening2?.type,
                                                                                                                        rek: Rekening2?.rek,
                                                                                                                        id: Rekening2?.id,
                                                                                                                        parent_id: Rekening2?.parent_id,
                                                                                                                        uraian: Rekening2?.uraian,
                                                                                                                        fullcode: Rekening2?.fullcode,
                                                                                                                        pagu: Rekening2?.pagu,
                                                                                                                        rincian_belanja: Rekening2?.rincian_belanja,
                                                                                                                        realisasi_anggaran: SumAnggaranRekening2,
                                                                                                                    };

                                                                                                                    const Rekening1 = updated.find((item: any) => item.id == rincian.id_rek_1);
                                                                                                                    const Rekening1Index = updated.findIndex((item: any) => item.id == rincian.id_rek_1);
                                                                                                                    const updatedRekenings2 = updated.filter((item: any) => item.rek === 2 && item.parent_id == rincian.id_rek_1);
                                                                                                                    // let SumAnggaranRekening1 = updatedRekenings2.reduce((a: any, b: any) => a + (b['realisasi_anggaran'] || 0), 0);
                                                                                                                    let SumAnggaranRekening1 = updatedRekenings2.reduce((a: any, b: any) => a + (b['realisasi_anggaran'] || 0), 0);

                                                                                                                    updated[Rekening1Index] = {
                                                                                                                        editable: Rekening1?.editable,
                                                                                                                        long: Rekening1?.long,
                                                                                                                        type: Rekening1?.type,
                                                                                                                        rek: Rekening1?.rek,
                                                                                                                        id: Rekening1?.id,
                                                                                                                        parent_id: Rekening1?.parent_id,
                                                                                                                        uraian: Rekening1?.uraian,
                                                                                                                        fullcode: Rekening1?.fullcode,
                                                                                                                        pagu: Rekening1?.pagu,
                                                                                                                        rincian_belanja: Rekening1?.rincian_belanja,
                                                                                                                        realisasi_anggaran: SumAnggaranRekening1,
                                                                                                                    };

                                                                                                                    return updated;
                                                                                                                });
                                                                                                                updateTotalRealisasi();
                                                                                                            }
                                                                                                        }
                                                                                                        onBlur={(e) => {
                                                                                                            updateTotalRealisasi();
                                                                                                        }}
                                                                                                        placeholder='Koefisien Realisasi'
                                                                                                    />
                                                                                                    <Tippy content='Desimal menggunakan Koma " , "'>
                                                                                                        <div className="cursor-pointer text-info">
                                                                                                            <FontAwesomeIcon icon={faExclamationCircle} className="w-3 h-3" />
                                                                                                        </div>
                                                                                                    </Tippy>
                                                                                                </div>
                                                                                            </td>
                                                                                            <td className='border !border-slate-400 dark:!border-slate-100'>
                                                                                                <div className="text-xs text-end px-2">
                                                                                                    {new Intl.NumberFormat('id-ID', {
                                                                                                        style: 'decimal',
                                                                                                        minimumFractionDigits: 0,
                                                                                                    }).format(keterangan?.harga_satuan ?? 0)}
                                                                                                </div>
                                                                                            </td>
                                                                                            <td className='border !border-slate-400 dark:!border-slate-100 !px-1'>
                                                                                                <div className='text-xs font-normal whitespace-nowrap text-end px-2'>
                                                                                                    {new Intl.NumberFormat('id-ID', {
                                                                                                        style: 'decimal',
                                                                                                        minimumFractionDigits: 0,
                                                                                                    }).format(keterangan?.pagu ?? 0)}
                                                                                                </div>
                                                                                            </td>
                                                                                            <td className='border !border-slate-400 dark:!border-slate-100 !px-1 !pr-4'>

                                                                                                {(keterangan?.pagu < keterangan?.realisasi_anggaran_keterangan && keterangan?.realisasi_anggaran_keterangan !== 0) && (
                                                                                                    <Tippy content="Melebihi Target">
                                                                                                        <div className="flex justify-end items-center gap-x-1 px-2 cursor-pointer">
                                                                                                            <FontAwesomeIcon icon={faCaretUp} className='text-red-600 w-3 h-3' />
                                                                                                            <div className={keterangan?.is_realisasi_match === true ? 'text-green-700 text-xs font-normal whitespace-nowrap text-end' : 'text-red-600 text-xs font-normal whitespace-nowrap text-end'}>
                                                                                                                {new Intl.NumberFormat('id-ID', {
                                                                                                                    style: 'decimal',
                                                                                                                    minimumFractionDigits: 0,
                                                                                                                }).format(keterangan?.realisasi_anggaran_keterangan ?? 0)}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </Tippy>
                                                                                                )}

                                                                                                {(keterangan?.pagu > keterangan?.realisasi_anggaran_keterangan && keterangan?.realisasi_anggaran_keterangan !== 0) && (
                                                                                                    <Tippy content="Belum Tercapai">
                                                                                                        <div className="flex justify-end items-center gap-x-1 px-2 cursor-pointer">
                                                                                                            <FontAwesomeIcon icon={faCaretDown} className='text-red-600 w-3 h-3' />
                                                                                                            <div className={keterangan?.is_realisasi_match === true ? 'text-green-700 text-xs font-normal whitespace-nowrap text-end' : 'text-red-600 text-xs font-normal whitespace-nowrap text-end'}>
                                                                                                                {new Intl.NumberFormat('id-ID', {
                                                                                                                    style: 'decimal',
                                                                                                                    minimumFractionDigits: 0,
                                                                                                                }).format(keterangan?.realisasi_anggaran_keterangan ?? 0)}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </Tippy>
                                                                                                )}

                                                                                                {(
                                                                                                    keterangan?.pagu == keterangan?.realisasi_anggaran_keterangan ||
                                                                                                    keterangan?.realisasi_anggaran_keterangan == 0 ||
                                                                                                    !keterangan?.realisasi_anggaran_keterangan
                                                                                                ) && (
                                                                                                        <div className="flex justify-end items-center gap-x-1 px-2 cursor-pointer">
                                                                                                            <div className={keterangan?.is_realisasi_match === true ? 'text-green-700 text-xs font-normal whitespace-nowrap text-end' : 'text-red-600 text-xs font-normal whitespace-nowrap text-end'}>
                                                                                                                {new Intl.NumberFormat('id-ID', {
                                                                                                                    style: 'decimal',
                                                                                                                    minimumFractionDigits: 0,
                                                                                                                }).format(keterangan?.realisasi_anggaran_keterangan ?? 0)}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )}

                                                                                            </td>
                                                                                        </tr>
                                                                                    </>
                                                                                )
                                                                            })}
                                                                            <tr>
                                                                                <td colSpan={100} className='!p-0 !pt-0.5 bg-slate-300 dark:bg-slate-500'></td>
                                                                            </tr>
                                                                        </>
                                                                    )
                                                                })}
                                                            </>
                                                        )}
                                                    </>
                                                )
                                            })}
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {tab === 1 && (
                    <div className=" flex flex-col xl:flex-col gap-4 mb-12 sm:mb-0 h-auto">
                        <div className="table-responsive w-full">
                            <table>
                                <tbody>

                                    <tr>
                                        <td className='!w-[150px]'>
                                            <div className='!text-end text-xs'>
                                                Urusan Pemerintahan
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-xs font-semibold">
                                                {dataRincian?.urusan_code} - {dataRincian?.urusan_name}
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <div className='!text-end text-xs'>
                                                Bidang Urusan
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-xs font-semibold">
                                                {dataRincian?.bidang_urusan_code} - {dataRincian?.bidang_urusan_name}
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <div className='!text-end text-xs'>
                                                Perangkat Daerah
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-xs font-semibold">
                                                {dataRincian?.instance_code} - {dataRincian?.instance_name}
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <div className='!text-end text-xs'>
                                                Program
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-xs font-semibold">
                                                {dataRincian?.program_code} - {dataRincian?.program_name}
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <div className='!text-end text-xs'>
                                                Kegiatan
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-xs font-semibold">
                                                {dataRincian?.kegiatan_code} - {dataRincian?.kegiatan_name}
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <div className='!text-end text-xs'>
                                                Sub Kegiatan
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-xs font-semibold">
                                                {dataRincian?.sub_kegiatan_code} - {dataRincian?.sub_kegiatan_name}
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <div className='!text-end text-xs'>
                                                Sumber Dana
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-wrap items-center gap-1 mr-3 w-[300px]">
                                                {subKegiatan?.tag_sumber_dana?.length > 0 && (
                                                    <>
                                                        {subKegiatan?.tag_sumber_dana?.map((tag: any, index: any) => (
                                                            <div className="text-xs border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white dark:border-blue-700 dark:hover:bg-blue-700 dark:text-blue-300 dark:hover:text-white px-2 py-1 rounded-md cursor-pointer whitespace-nowrap">
                                                                <div className='font-semibold'>{tag?.tag_name}</div>
                                                                <div className='text-center'>
                                                                    Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(tag?.nominal)}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <div className='!text-end text-xs'>
                                                Bulan dan Tahun
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-xs font-semibold">
                                                {new Date(year, month - 1).toLocaleString('id-ID',
                                                    {
                                                        month: 'long',
                                                        year: 'numeric'
                                                    }
                                                )}
                                            </div>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>

                        <div className="table-responsive w-full">
                            <table>
                                <thead>
                                    <tr>
                                        <th colSpan={100}>
                                            <div className="text-center">
                                                Indikator Kinerja Sub Kegiatan
                                            </div>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className='!text-center !text-xs'>
                                            Indikator
                                        </th>
                                        <th className='!text-center !text-xs !w-[150px]'>
                                            Target (Renstra)
                                        </th>
                                        <th className='!text-center !text-xs !w-[150px]'>
                                            Target (Renja)
                                        </th>
                                        <th className='!text-center !text-xs !w-[150px]'>
                                            Target (APBD)
                                        </th>
                                        <th className='!text-center !text-xs !w-[150px]'>
                                            Realisasi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataRincian?.indicators?.length > 0 && (
                                        <>
                                            {dataRincian?.indicators?.map((indicator: any, index: any) => (
                                                <tr key={index}>
                                                    <td>
                                                        <div className='text-xs'>
                                                            {indicator?.name}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className='text-xs'>
                                                            <div className="whitespace-nowrap">
                                                                {indicator?.type === 'anggaran' && (
                                                                    <>
                                                                        Rp. {new Intl.NumberFormat('id-ID', {
                                                                            style: 'decimal',
                                                                            minimumFractionDigits: 0,
                                                                        }).format(indicator?.target_renstra)}
                                                                    </>
                                                                )}
                                                                {indicator?.type === 'kinerja' && (
                                                                    <>
                                                                        {new Intl.NumberFormat('id-ID', {
                                                                            style: 'decimal',
                                                                            minimumFractionDigits: 0,
                                                                        }).format(indicator?.target_renstra ?? 0)} {indicator?.satuan_name_renstra}
                                                                    </>
                                                                )}
                                                                {indicator?.type === 'persentase-kinerja' && (
                                                                    <>
                                                                        {indicator?.target_renstra} {indicator?.satuan_name_renstra}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className='text-xs'>
                                                            <div className="whitespace-nowrap">
                                                                {indicator?.type === 'anggaran' && (
                                                                    <>
                                                                        Rp. {new Intl.NumberFormat('id-ID', {
                                                                            style: 'decimal',
                                                                            minimumFractionDigits: 0,
                                                                        }).format(indicator?.target_renja)}
                                                                    </>
                                                                )}
                                                                {indicator?.type === 'kinerja' && (
                                                                    <>
                                                                        {new Intl.NumberFormat('id-ID', {
                                                                            style: 'decimal',
                                                                            minimumFractionDigits: 0,
                                                                        }).format(indicator?.target_renja ?? 0)} {indicator?.satuan_name_renja}
                                                                    </>
                                                                )}
                                                                {indicator?.type === 'persentase-kinerja' && (
                                                                    <>
                                                                        {indicator?.target_renja} {indicator?.satuan_name_renja}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className='text-xs'>
                                                            <div className="whitespace-nowrap">
                                                                {indicator?.type === 'anggaran' && (
                                                                    <>
                                                                        Rp. {new Intl.NumberFormat('id-ID', {
                                                                            style: 'decimal',
                                                                            minimumFractionDigits: 0,
                                                                        }).format(indicator?.target)}
                                                                    </>
                                                                )}
                                                                {indicator?.type === 'kinerja' && (
                                                                    <>
                                                                        {indicator?.target && (
                                                                            <>
                                                                                {new Intl.NumberFormat('id-ID', {
                                                                                    style: 'decimal',
                                                                                    minimumFractionDigits: 0,
                                                                                }).format(indicator?.target ?? 0)} {indicator?.satuan_name}
                                                                            </>
                                                                        )}
                                                                    </>
                                                                )}
                                                                {indicator?.type === 'persentase-kinerja' && (
                                                                    <>
                                                                        {indicator?.target} {indicator?.satuan_name}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className='text-xs'>
                                                            <input
                                                                value={indicator?.realisasi}
                                                                disabled={(subKegiatan?.status === 'verified' || subKegiatan?.status_target !== 'verified') ? true : false}
                                                                onChange={(e) => {
                                                                    setUnsaveStatus(true);
                                                                    setDataRincian((prev: any) => {
                                                                        const updated = { ...prev };
                                                                        updated['indicators'][index] = {
                                                                            id: indicator?.id,
                                                                            name: indicator?.name,
                                                                            type: indicator?.type,
                                                                            target: indicator?.target,
                                                                            realisasi: e.target.value,
                                                                            satuan_id: indicator?.satuan_id,
                                                                            satuan_name: indicator?.satuan_name,
                                                                            target_renstra: indicator?.target_renstra,
                                                                            satuan_id_renstra: indicator?.satuan_id_renstra,
                                                                            satuan_name_renstra: indicator?.satuan_name_renstra,
                                                                            target_renja: indicator?.target_renja,
                                                                            satuan_id_renja: indicator?.satuan_id_renja,
                                                                            satuan_name_renja: indicator?.satuan_name_renja,
                                                                        };
                                                                        return updated;
                                                                    });
                                                                }}
                                                                className='form-input px-1 py-0.5 text-xs font-normal disabled:bg-slate-200'
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {tab === 3 && (
                    <div className='p-5'>
                        <div className="font-semibold text-md text-center">
                            Update Informasi Realisasi {subKegiatan?.fullcode} - {subKegiatan?.name}
                        </div>
                        <form
                            className='mt-10 grid grid-cols-10 gap-5'>
                            <div className="col-span-10 md:col-span-5 space-y-2">
                                <div className="">
                                    <label>Catatan</label>
                                    <textarea
                                        value={dataKeterangan?.notes}
                                        onChange={(e) => {
                                            setUnsaveKeteranganStatus(true);
                                            setDataKeterangan((prev: any) => {
                                                const updated = { ...prev };
                                                updated['notes'] = e.target.value;
                                                return updated;
                                            });
                                        }}
                                        placeholder='Masukkan Catatan Disini...'
                                        className='form-input resize-none min-h-[150px]'></textarea>
                                </div>
                                <div className="">
                                    <label>Faktor Penghambat</label>
                                    <textarea
                                        value={dataKeterangan?.faktor_penghambat}
                                        onChange={(e) => {
                                            setUnsaveKeteranganStatus(true);
                                            setDataKeterangan((prev: any) => {
                                                const updated = { ...prev };
                                                updated['faktor_penghambat'] = e.target.value;
                                                return updated;
                                            });
                                        }}
                                        placeholder='Masukkan Faktor Penghambat Disini...'
                                        className='form-input resize-none min-h-[150px]'></textarea>
                                </div>
                            </div>
                            <div className="col-span-10 md:col-span-5 space-y-5">
                                <div className="">
                                    <label>Link Map</label>
                                    <input
                                        value={dataKeterangan?.link_map}
                                        onChange={(e) => {
                                            setUnsaveKeteranganStatus(true);
                                            setDataKeterangan((prev: any) => {
                                                const updated = { ...prev };
                                                updated['link_map'] = e.target.value;
                                                return updated;
                                            });
                                        }}
                                        type="text"
                                        placeholder="Masukkan Link Map"
                                        className="form-input" />
                                </div>
                                <div className="">
                                    <label>Upload Berkas Pendukung</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => {
                                            setUnsaveKeteranganStatus(true);
                                            setDataKeterangan((prev: any) => {
                                                const files = e.target.files;
                                                const updated = { ...prev };
                                                updated['newFiles'] = files;
                                                return updated;
                                            });
                                        }}
                                        className="form-input" />
                                </div>
                            </div>
                            <div className="col-span-10 flex items-center justify-between">
                                <div className=""></div>
                                <div className="">
                                    {unsaveKeteranganStatus === true && (
                                        <button
                                            onClick={() => {
                                                saveKeterangan();
                                            }}
                                            type="button"
                                            className="btn btn-success">
                                            <FontAwesomeIcon icon={faSave} className='mr-2 w-4 h-4' />
                                            Unggah Keterangan
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="col-span-10">
                                <div className="font-semibold underline mb-2">
                                    Berkas Pendukung
                                </div>
                                <div className="grid grid-cols-10 gap-5">
                                    {images?.map((image: any, index: any) => (
                                        <div className="col-span-10 md:col-span-1">
                                            <div className="relative group rounded-lg cursor-pointer overflow-hidden">
                                                <img
                                                    onClick={() => {
                                                        setImagesIndex(index);
                                                        setOpenLightBox(true);
                                                    }}
                                                    src={image?.file}
                                                    alt="Image"
                                                    className="w-full h-full border p-1 object-cover rounded-lg grayscale group-hover:grayscale-0 group-hover:scale-125 hover:shadow transition-all duration-300"
                                                />
                                                <div className="">
                                                    <div className="absolute top-0 right-0 bg-white bg-opacity-50 p-1 pr-2 pt-2 rounded-bl-lg">
                                                        <FontAwesomeIcon icon={faTrashAlt} className='text-red-600 w-4 h-4 cursor-pointer' onClick={() => {
                                                            Swal.fire({
                                                                title: 'Peringatan',
                                                                text: 'Apakah Anda yakin ingin menghapus gambar ini?',
                                                                icon: 'warning',
                                                                showCancelButton: true,
                                                                confirmButtonText: 'Ya, Hapus',
                                                                cancelButtonText: 'Batal',
                                                            }).then((result) => {
                                                                if (result.isConfirmed) {
                                                                    // setImages(images.filter((item: any, i: any) => i !== index));
                                                                    deleteKeteranganImage(image?.id);
                                                                }
                                                            });
                                                        }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Lightbox
                                    index={imagesIndex}
                                    open={openLightBox}
                                    close={() => setOpenLightBox(false)}
                                    slides={slides}
                                    plugins={[Zoom]}
                                />
                            </div>
                        </form>
                    </div>
                )}

                {tab === 4 && (
                    <div className="p-5">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="col-span-2 md:col-span-1">
                                <div className="">
                                    <label>Cari Nomor Kontrak</label>
                                    <input
                                        value={searchKontrak}
                                        onChange={(e: any) => {
                                            setSearchKontrak(e.target.value);
                                        }}
                                        onKeyDown={(e: any) => {
                                            if (e.keyCode === 13) {
                                                fetchingKontrak();
                                            }
                                        }}
                                        type="text"
                                        placeholder="Cari Nomor Kontrak..."
                                        className="form-input"
                                    />
                                </div>
                                <div className="mt-5 space-y-5 overflow-x-auto h-[calc(100vh-340px)] border rounded">

                                    {kontrakSPSEOptions?.length > 0 && (
                                        <>
                                            {kontrakSPSEOptions?.map((kontrak: any, index: any) => (
                                                <div key={`list-kontrak-${index}`}
                                                    onClick={() => {
                                                        pickKontrak(kontrak)
                                                    }}
                                                    className={`${kontrak?.no_kontrak === selectedKontrak?.no_kontrak ? 'bg-blue-100' : ''} p-4 shadow-md cursor-pointer select-none hover:bg-blue-100 hover:shadow-blue-200 group`}>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-lg mb-2 text-primary">
                                                            {kontrak?.no_kontrak}
                                                        </h4>
                                                        <div className="media-text">
                                                            <table>
                                                                <tbody>
                                                                    <tr>
                                                                        <td className='!p-0 !py-2 !w-[140px]'>
                                                                            Nama Paket
                                                                        </td>
                                                                        <td className='!p-0 !px-2'>:</td>
                                                                        <td className='!p-0 !py-2'>
                                                                            {kontrak?.nama_paket}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className='!p-0 !py-2'>
                                                                            Satuan Kerja
                                                                        </td>
                                                                        <td className='!p-0 !px-2'>:</td>
                                                                        <td className='!p-0 !py-2'>
                                                                            {kontrak?.nama_satker}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className='!p-0 !py-2'>
                                                                            Tanggal Kontrak
                                                                        </td>
                                                                        <td className='!p-0 !px-2'>:</td>
                                                                        <td className='!p-0 !py-2'>
                                                                            {kontrak?.tgl_kontrak}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className='!p-0 !py-2'>
                                                                            Penyedia
                                                                        </td>
                                                                        <td className='!p-0 !px-2'>:</td>
                                                                        <td className='!p-0 !py-2'>
                                                                            {kontrak?.nama_penyedia}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className='!p-0 !py-2'>
                                                                            Nilai Kontrak
                                                                        </td>
                                                                        <td className='!p-0 !px-2'>:</td>
                                                                        <td className='!p-0 !py-2'>
                                                                            Rp. {new Intl.NumberFormat('id-ID', {
                                                                                style: 'decimal',
                                                                                minimumFractionDigits: 0,
                                                                            }).format(kontrak?.nilai_kontrak)}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className='!p-0 !py-2'>
                                                                            Status Kontrak
                                                                        </td>
                                                                        <td className='!p-0 !px-2'>:</td>
                                                                        <td className='!p-0 !py-2'>
                                                                            {kontrak?.status_kontrak}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 text-end text-xs text-slate-700 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                        <FontAwesomeIcon icon={faAngleDoubleRight} className='w-3 h-3 mr-1' />
                                                        <span>
                                                            Klik untuk Memilih Kontrak
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    )}

                                </div>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                {selectedKontrak && (
                                    <div className="">
                                        <div className="text-md underline font-semibold">
                                            Pratinjau Kontrak
                                        </div>
                                        <div className="table-responsive h-[calc(100vh-360px)] mt-5">
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
                                        <div className="mt-5">
                                            <div className="text-end">
                                                <button
                                                    onClick={() => {
                                                        // saveKontrak();
                                                    }}
                                                    type="button"
                                                    className="btn btn-success">
                                                    <FontAwesomeIcon icon={faSave} className='mr-2 w-4 h-4' />
                                                    Simpan Kontrak
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {isMounted && (
                <div className="fixed bottom-0 left-0 w-full bg-slate-100 dark:bg-slate-800 sm:h-[70px] py-1 pr-16 pl-0 lg:pl-16">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pl-10 overflow-auto gap-y-2">
                        <div className="">
                            <div className="font-semibold">
                                Input Realisasi
                            </div>
                            <div className="text-sm">
                                {subKegiatan?.fullcode}
                                <span className='ml-2 font-semibold'>
                                    {subKegiatan?.name}
                                </span>
                            </div>
                            <div className="">
                                Bulan &nbsp;
                                <span className='font-semibold'>
                                    {new Date(year, month - 1).toLocaleString('id-ID', { month: 'long' })}
                                </span>
                                &nbsp; Tahun &nbsp;
                                <span className='font-semibold'>
                                    {year}
                                </span>
                                &nbsp; - &nbsp;
                                <span className='font-semibold'>
                                    {subKegiatan?.instance_name}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-end items-center gap-x-2">
                            {(tab === 1 || tab === 2) && (
                                <>
                                    <Tippy content={`Tekan Untuk Melihat Log`}>
                                        <button
                                            type='button'
                                            disabled={dataBackEndError === true ? true : false}
                                            onClick={
                                                (e) => {
                                                    dataBackEndError === false &&
                                                        openLogsModal()
                                                }}>
                                            {subKegiatan?.status == 'draft' && (
                                                <div className="btn btn-primary btn-sm">
                                                    <FontAwesomeIcon icon={faBriefcaseClock} className='mr-2 w-4 h-4' />
                                                    Draft
                                                </div>
                                            )}
                                            {subKegiatan?.status == 'verified' && (
                                                <div className="btn btn-success btn-sm">
                                                    <FontAwesomeIcon icon={faCheck} className='mr-2 w-4 h-4' />
                                                    Terverifikasi
                                                </div>
                                            )}
                                            {subKegiatan?.status == 'reject' && (
                                                <div className="btn btn-danger btn-sm">
                                                    <FontAwesomeIcon icon={faTimes} className='mr-2 w-4 h-4' />
                                                    Ditolak
                                                </div>
                                            )}
                                            {subKegiatan?.status == 'return' && (
                                                <div className="btn btn-warning btn-sm">
                                                    <FontAwesomeIcon icon={faSyncAlt} className='mr-2 w-4 h-4' />
                                                    Dikembalikan
                                                </div>
                                            )}
                                            {subKegiatan?.status == 'sent' && (
                                                <div className="btn btn-info btn-sm">
                                                    <FontAwesomeIcon icon={faShare} className='mr-2 w-4 h-4' />
                                                    Dikirim
                                                </div>
                                            )}
                                            {subKegiatan?.status == 'waiting' && (
                                                <div className="btn btn-dark btn-sm">
                                                    <FontAwesomeIcon icon={faHourglassHalf} className='mr-2 w-4 h-4' />
                                                    Menunggu
                                                </div>
                                            )}
                                        </button>
                                    </Tippy>
                                    <div className="border-r-2 border-slate-400 h-[35px] w-2"></div>
                                    {unsaveStatus && (
                                        <div
                                            onClick={(e) => {
                                                if (unsaveStatus) {
                                                    e.preventDefault();
                                                    Swal.fire({
                                                        title: 'Peringatan',
                                                        text: 'Apakah Anda yakin ingin memuat ulang data?',
                                                        icon: 'warning',
                                                        showCancelButton: true,
                                                        confirmButtonText: 'Lanjutkan,  Muat Ulang',
                                                        cancelButtonText: 'Batal',
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            getMasterData(subKegiatanId, year, month).then((data) => {
                                                                if (data.status == 'success') {
                                                                    setDatas(data.data.data);
                                                                    setSubKegiatan(data.data.subkegiatan);
                                                                    setDataRincian(data.data.dataRincian)
                                                                    setDataBackEndError(data.data.data_error);
                                                                    setDataBackEndMessage(data.data.error_message);

                                                                    showAlert('success', 'Data berhasil dimuat ulang');
                                                                    setUnsaveStatus(false);
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            }}
                                            className='btn btn-sm flex whitespace-nowrap dark:border-amber-600 dark:shadow-black-dark-light bg-amber-500 dark:bg-amber-500 hover:bg-amber-600 dark:hover:bg-amber-700 text-white  cursor-pointer'>
                                            <FontAwesomeIcon icon={faSyncAlt} className='mr-2 w-4 h-4' />
                                            Muat Ulang
                                        </div>
                                    )}
                                    <div
                                        onClick={(e) => {
                                            if (unsaveStatus) {
                                                e.preventDefault();
                                                Swal.fire({
                                                    title: 'Peringatan',
                                                    text: 'Data yang belum disimpan akan hilang. Apakah Anda yakin ingin meninggalkan halaman ini?',
                                                    icon: 'warning',
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Ya, Keluar',
                                                    cancelButtonText: 'Batal',
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        route.push({
                                                            pathname: `/kinerja/target/${subKegiatanId}`,
                                                            query: {
                                                                periode: periode,
                                                                year: year,
                                                                month: month,
                                                            },
                                                        });
                                                    }
                                                });
                                            } else {
                                                route.push({
                                                    pathname: `/kinerja/target/${subKegiatanId}`,
                                                    query: {
                                                        periode: periode,
                                                        year: year,
                                                        month: month,
                                                    },
                                                });
                                            }
                                        }}
                                        className='btn btn-sm flex whitespace-nowrap dark:border-cyan-900 dark:shadow-black-dark-light bg-cyan-600 dark:bg-cyan-700 hover:bg-cyan-500 dark:hover:bg-cyan-800 text-white cursor-pointer'>
                                        <FontAwesomeIcon icon={faArrowRightToBracket} className='mr-2 w-4 h-4 -scale-x-100' />
                                        Buka Target
                                    </div>
                                    {dataBackEndError === false ? (
                                        <button
                                            type='button'
                                            className='btn btn-sm dark:border-green-900 dark:shadow-black-dark-light bg-green-600 dark:bg-green-700 hover:bg-green-500 dark:hover:bg-green-800 text-white'
                                            onClick={(e) => {
                                                confirmSave();
                                            }}>
                                            <FontAwesomeIcon icon={faSave} className='mr-2 w-4 h-4' />
                                            Simpan
                                        </button>
                                    ) : (
                                        <button
                                            type='button'
                                            disabled={true}
                                            className='btn btn-sm dark:border-green-900 dark:shadow-black-dark-light bg-green-600 dark:bg-green-700 hover:bg-green-500 dark:hover:bg-green-800 text-white'>
                                            <FontAwesomeIcon icon={faSave} className='mr-2 w-4 h-4' />
                                            Simpan
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div >
            )}


            <Transition appear show={modalLogs} as={Fragment}>
                <Dialog as="div" open={modalLogs} onClose={() => setModalLogs(false)}>
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
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg w-full max-w-[80%] md:max-w-[70%] my-8 text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <h5 className="font-semibold text-md">
                                            Logs Perubahan Status
                                        </h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalLogs(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5 space-y-3">

                                        <div className="">
                                            <div className="table-responsive">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th className='!text-center !w-[175px]'>Tanggal</th>
                                                            <th className='!text-center !w-[175px]'>Status</th>
                                                            <th className='!text-center'>Pesan</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {logs?.length > 0 ? (
                                                            <>
                                                                {logs?.map((log: any, index: any) => {
                                                                    return (
                                                                        <tr>
                                                                            <td>
                                                                                <div className="text-xs mt-1.5 text-center">
                                                                                    {new Date(log?.created_at).toLocaleDateString('id-ID', { month: 'long', day: 'numeric', year: 'numeric' }) === new Date().toLocaleDateString('id-ID', { month: 'long', day: 'numeric', year: 'numeric' }) ? (
                                                                                        <div>
                                                                                            <div className="">
                                                                                                Hari Ini
                                                                                            </div>
                                                                                            <div>
                                                                                                Jam {new Date(log?.created_at).toLocaleString('id-ID', { hour: 'numeric', minute: 'numeric' })} WIB
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="">
                                                                                            <div>
                                                                                                {new Date(log?.created_at).toLocaleDateString('id-ID', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                                                            </div>
                                                                                            <div>
                                                                                                Jam {new Date(log?.created_at).toLocaleString('id-ID', { hour: 'numeric', minute: 'numeric' })} WIB
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div className='text-center'>
                                                                                    {log?.status === 'draft' && (
                                                                                        <div className='text-xs py-1 px-2 rounded text-white bg-primary cursor-pointer flex items-center justify-center gap-x-1'>
                                                                                            <FontAwesomeIcon icon={faBriefcaseClock} className='mr-2 w-4 h-4' />
                                                                                            Draft
                                                                                        </div>
                                                                                    )}

                                                                                    {log?.status === 'verified' && (
                                                                                        <div className='text-xs py-1 px-2 rounded text-white bg-success cursor-pointer flex items-center justify-center gap-x-1'>
                                                                                            <FontAwesomeIcon icon={faCheck} className='mr-2 w-4 h-4' />
                                                                                            Terverifikasi
                                                                                        </div>
                                                                                    )}

                                                                                    {log?.status == 'reject' && (
                                                                                        <div className='text-xs py-1 px-2 rounded text-white bg-danger cursor-pointer flex items-center justify-center gap-x-1'>
                                                                                            <FontAwesomeIcon icon={faTimes} className='mr-2 w-4 h-4' />
                                                                                            Ditolak
                                                                                        </div>
                                                                                    )}

                                                                                    {log?.status == 'return' && (
                                                                                        <div className='text-xs py-1 px-2 rounded text-white bg-warning cursor-pointer flex items-center justify-center gap-x-1'>
                                                                                            <FontAwesomeIcon icon={faSyncAlt} className='mr-2 w-4 h-4' />
                                                                                            Dikembalikan
                                                                                        </div>
                                                                                    )}

                                                                                    {log?.status === 'sent' && (
                                                                                        <div className='text-xs py-1 px-2 rounded text-white bg-info cursor-pointer flex items-center justify-center gap-x-1'>
                                                                                            <FontAwesomeIcon icon={faShare} className='mr-2 w-4 h-4' />
                                                                                            Dikirim
                                                                                        </div>
                                                                                    )}
                                                                                    {log?.status == 'waiting' && (
                                                                                        <div className='text-xs py-1 px-2 rounded text-white bg-dark cursor-pointer flex items-center justify-center gap-x-1'>
                                                                                            <FontAwesomeIcon icon={faHourglassHalf} className='mr-2 w-4 h-4' />
                                                                                            Menunggu
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div className="border-l-2 px-2 text-xs">
                                                                                    "{log?.message}"
                                                                                </div>
                                                                                <div className="mt-3 text-slate-400 flex items-center">
                                                                                    <FontAwesomeIcon icon={faUserAlt} className='mr-1 w-2 h-2' />
                                                                                    <div className="text-2xs">
                                                                                        {log?.type === 'system' ? (
                                                                                            <>
                                                                                                Sistem
                                                                                            </>
                                                                                        ) : (
                                                                                            <>
                                                                                                {log?.created_by_name}
                                                                                            </>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <tr>
                                                                    <td colSpan={100}>
                                                                        <div className="text-center text-gray-600 dark:text-gray-500">
                                                                            Tidak ada logs
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-end border-t pt-1 gap-2">
                                            {([1, 2, 9].includes(CurrentUser?.role_id)) && (
                                                <div>
                                                    <button
                                                        onClick={() => requestVerification()}
                                                        type="button"
                                                        className="btn btn-outline-success text-xs w-full">
                                                        <IconSend className="w-4 h-4 mr-1" />
                                                        Ajukan Verifikasi
                                                    </button>
                                                </div>
                                            )}
                                            {([1, 2, 6].includes(CurrentUser?.role_id)) && (
                                                <div>
                                                    <button
                                                        onClick={() => replyVerification()}
                                                        type="button"
                                                        className="btn btn-outline-success text-xs w-full">
                                                        <IconSend className="w-4 h-4 mr-1" />
                                                        Tanggapi Permintaan
                                                    </button>
                                                </div>
                                            )}
                                            <div>
                                                <button
                                                    onClick={() => {
                                                        setModalLogs(false);
                                                        setLogs([]);
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

            <Transition appear show={modalRequestVerification} as={Fragment}>
                <Dialog as="div" open={modalRequestVerification} onClose={() => setModalRequestVerification(false)}>
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
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg w-full max-w-[80%] md:max-w-[50%] my-8 text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <h5 className="font-semibold text-md">
                                            Ajukan Permintaan Verifikasi
                                        </h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => {
                                            openLogsModal()
                                            setModalRequestVerification(false)
                                        }}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5 space-y-3">
                                        <textarea
                                            rows={4}
                                            value={requestVerificationData?.message}
                                            id="message-request-verification"
                                            onChange={(e) => {
                                                setRequestVerificationData((prev: any) => {
                                                    return {
                                                        ...prev,
                                                        message: e.target.value,
                                                    };
                                                });
                                            }}
                                            placeholder='Tulis pesan permintaan verifikasi disini...'
                                            className="form-textarea resize-none"></textarea>
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => sendReqVerification()}
                                                type="button"
                                                className="btn btn-success text-xs">
                                                <IconSend className="w-4 h-4 mr-1" />
                                                Ajukan Verifikasi
                                            </button>
                                            <button
                                                onClick={() => {
                                                    openLogsModal()
                                                    setModalRequestVerification(false)
                                                }}
                                                type="button"
                                                className="btn btn-dark text-xs">
                                                <IconX className="w-4 h-4 mr-1" />
                                                Batal
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={modalReplyVerification} as={Fragment}>
                <Dialog as="div" open={modalReplyVerification} onClose={() => setModalReplyVerification(false)}>
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
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg w-full max-w-[80%] md:max-w-[50%] my-8 text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <h5 className="font-semibold text-md">
                                            Tanggapi Permintaan Verifikasi
                                        </h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => {
                                            openLogsModal()
                                            setModalReplyVerification(false)
                                        }}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <div>
                                            <textarea
                                                rows={4}
                                                value={replyVerificationData?.message}
                                                onChange={(e) => {
                                                    e.target.classList.remove('border-red-500');
                                                    setReplyVerificationData((prev: any) => {
                                                        return {
                                                            ...prev,
                                                            message: e.target.value,
                                                        };
                                                    });
                                                }}
                                                id="message-reply-verification"
                                                placeholder='Tulis pesan tanggapan verifikasi disini...'
                                                className="form-textarea mb-0 resize-none"></textarea>
                                            <select
                                                className='form-select mt-0'
                                                value={replyVerificationData?.status}
                                                onChange={(e) => {
                                                    e.target.classList.remove('border-red-500');
                                                    setReplyVerificationData((prev: any) => {
                                                        return {
                                                            ...prev,
                                                            status: e.target.value,
                                                        };
                                                    });

                                                }}
                                                id="status-reply-verification">
                                                <option value='' hidden>Pilih Status</option>
                                                <option value='verified'>Terverifikasi</option>
                                                <option value='draft'>Draft</option>
                                                <option value='reject'>Tolak</option>
                                                <option value='return'>Dikembalikan</option>
                                                <option value='waiting'>Menunggu</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center justify-end gap-2 mt-5">
                                            <button
                                                onClick={() => sentRepVerification()}
                                                type="button"
                                                className="btn btn-success text-xs">
                                                <IconSend className="w-4 h-4 mr-1" />
                                                Kirim
                                            </button>
                                            <button
                                                onClick={() => {
                                                    openLogsModal()
                                                    setModalReplyVerification(false)
                                                }}
                                                type="button"
                                                className="btn btn-dark text-xs">
                                                <IconX className="w-4 h-4 mr-1" />
                                                Batal
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );

}

export default Index;
