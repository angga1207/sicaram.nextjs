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
import { Player, Controls } from '@lottiefiles/react-lottie-player';

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
    getKontrakSPSE,
    getContract,
    addContract,
    deleteContract,
    SyncRincianRealisasi,
    SyncRealisasi,
    uploadBerkasRealisasi
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
    faAngleDoubleLeft,
    faSpinner,
    faAngleDoubleUp,
    faLink,
    faBars,
    faCloudUploadAlt,
    faArchive
} from '@fortawesome/free-solid-svg-icons';
import { faFileAlt, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import IconSend from '@/components/Icon/IconSend';

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import LoadingSicaram from '@/components/LoadingSicaram';
import Dropdown from '@/components/Dropdown';
import InputRupiah from '@/components/InputRupiah';
import RincianBelanja from '@/components/RealisasiProgram/RincianBelanja';
import Summary from '@/components/RealisasiProgram/Summary';
import ImportSIPD from '@/components/RealisasiProgram/ImportSIPD';
import BerkasPendukung from '@/components/RealisasiProgram/BerkasPendukung';
import Kontrak from '@/components/RealisasiProgram/Kontrak';

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
        dispatch(setPageTitle('Input Realisasi'));
    });

    const route = useRouter();

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
    const [isLoading, setIsLoading] = useState<boolean>(false);
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
    const [loadingFetchKontrak, setLoadingFetchKontrak] = useState<boolean>(false);
    const [kontrakSPSEOptions, setKontrakSPSEOptions] = useState<any>([]);
    const [selectedKontrak, setSelectedKontrak] = useState<any>(null);
    const [activeContracts, setActiveContracts] = useState<any>([]);

    const [arrRekening, setArrRekening] = useState<any>([]);

    useEffect(() => {
        if (isMounted) {
            fetchSatuans().then((data) => {
                if (data.status == 'success') {
                    setSatuans(data.data);
                }
            });
        }
    }, [isMounted]);

    useEffect(() => {
        if (route.query.slug) {
            setSubKegiatanId(route.query.slug);
        }
        setYear(route.query.year ?? new Date().getFullYear());
        setMonth(route.query.month ?? new Date().getMonth());
    }, [route.query.slug]);

    useEffect(() => {
        if (isMounted) {
            setIsLoading(true);
            setDatas(null);
            setDataRealisasiSubKegiatan([]);
            setSubKegiatan(null);
            setDataRincian([]);
            setDataBackEndError(null);
            setDataBackEndMessage(null);

            setDataKeterangan([]);
            setActiveContracts([]);

            if (subKegiatanId) {
                getMasterData(subKegiatanId, year, month).then((data: any) => {
                    if (data.status == 'success') {
                        setDatas(data.data.data);
                        setDataRealisasiSubKegiatan(data.data.realisasiSubKegiatan);
                        setSubKegiatan(data.data.subkegiatan);
                        setDataRincian(data.data.dataRincian)
                        setDataBackEndError(data.data.data_error);
                        setDataBackEndMessage(data.data.error_message);

                        setArrRekening(data.data.data.filter((item: any) => item.rek == 6));
                    }
                    if (data.status === 'error') {
                        showAlert('error', 'Terjadi Kesalahan Server! Harap Hubungi Admin!');
                    }
                    setIsLoading(false);
                });
            }
        }
    }, [subKegiatanId, year, month]);

    // console.log(arrRekening);

    useEffect(() => {
        if (dataRealisasiSubKegiatan.id && (tab == 3 || tab == 5)) {
            if (dataKeterangan?.length == 0) {
                getKeteranganSubKegiatan(dataRealisasiSubKegiatan.id, year, month).then((data: any) => {
                    if (data.status == 'success') {
                        setDataKeterangan(data.data);
                        setImages(data.data.files);
                    }
                });
            }
        }

        if (subKegiatanId && tab == 4) {
            if (activeContracts.length == 0) {
                // setLoadingFetchKontrak(true);
                // getContract(subKegiatanId, year, month).then((data: any) => {
                //     if (data.status == 'success') {
                //         setActiveContracts(data.data);
                //     }
                //     setLoadingFetchKontrak(false);
                // });
            }
        }
    }, [tab]);

    function nextImageUrl(src: any, size: any) {
        // return `/_next/image?url=${encodeURIComponent(src)}&w=${size}&q=75`;
        return `${src}?w=${size}&q=75`;
    }

    const slides = images?.filter((item: any) => item?.mime_type.includes('image/')).map((img: any) => ({
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
        if (subKegiatan?.status === 'verified') {
            Swal.fire({
                title: 'Peringatan!',
                text: 'Data tidak dapat diubah karena Status Realisasi Sudah "Terverifikasi"',
                icon: 'info',
                confirmButtonText: 'Tutup'
            });
            return;
        }
        if ([1, 2, 3, 4, 5, 9].includes(CurrentUser.role_id)) {
            Swal.fire({
                title: 'Simpan Realisasi',
                text: 'Aksi ini akan merubah data realisasi pada bulan ini dan tidak dapat dikembalikan!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, Simpan',
                cancelButtonText: 'Batal',
            }).then((result) => {
                if (result.isConfirmed) {

                    SaveRincianRealisasi(subKegiatanId, dataRincian, periode, year, month).then((data: any) => {
                        if (data.status == 'success') {
                            showAlertBox('success', 'Berhasil', data.message);
                        }
                        else {
                            showAlertBox('error', 'Error', data.message);
                        }
                        setUnsaveStatus(false);
                    });

                    // SaveRealisasi(subKegiatanId, datas, periode, year, month).then((data: any) => {
                    //     if (data.status == 'success') {
                    //         setUnsaveStatus(false);

                    //         SaveRincianRealisasi(subKegiatanId, dataRincian, periode, year, month).then((data: any) => {
                    //             if (data.status == 'success') {
                    //                 showAlertBox('success', 'Berhasil', data.message);
                    //                 setUnsaveStatus(false);
                    //             }
                    //             else {
                    //                 showAlertBox('error', 'Error', data.message);
                    //             }
                    //         });

                    //     }
                    //     else {
                    //         if (data.message == 'Target Kinerja Anggaran belum diverifikasi') {
                    //             Swal.fire({
                    //                 title: 'Terjadi Kesalahan',
                    //                 text: 'Target Kinerja Anggaran belum diverifikasi',
                    //                 icon: 'warning',
                    //                 showCancelButton: true,
                    //                 confirmButtonText: 'Ke Target Kinerja Anggaran',
                    //                 cancelButtonText: 'Tutup',
                    //             }).then((result) => {
                    //                 if (result.isConfirmed) {
                    //                     route.push(`/kinerja/target/${subKegiatanId}?periode=${periode}&year=${year}&month=${month}`)
                    //                 }
                    //             });

                    //         } else {
                    //             showAlertBox('error', 'Error', data.message);
                    //         }
                    //     }
                    // });
                }
            });
        }
    }

    const [syncLoading, setSyncLoading] = useState(false);

    const confirmSync = () => {
        if ([1, 2, 3, 4, 5, 9].includes(CurrentUser.role_id)) {
            Swal.fire({
                title: 'Singkronisasi Realisasi',
                text: 'Aksi ini akan merubah data pada bulan ini dan bulan berikutnya yang belum Diverifikasi',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, Singkronkan',
                cancelButtonText: 'Batal',
            }).then((result) => {
                if (result.isConfirmed) {
                    setSyncLoading(true);
                    // sync 1 start
                    SyncRealisasi(subKegiatanId, datas, periode, year, month).then((data: any) => {
                        if (data.status == 'success') {
                            setUnsaveStatus(false);

                            // sync 2 start
                            SyncRincianRealisasi(subKegiatanId, dataRincian, periode, year, month).then((data: any) => {
                                if (data.status == 'success') {
                                    setUnsaveStatus(false);

                                    // final notif
                                    showAlertBox('success', 'Berhasil', 'Data Realisasi Berhasil Singkronkan');
                                    setSyncLoading(false);
                                } else {
                                    showAlert('error', 'Terjadi Kesalahan Server! Harap Hubungi Admin!');
                                    setSyncLoading(false);
                                }
                            });

                        } else {
                            showAlert('error', 'Terjadi Kesalahan Server! Harap Hubungi Admin!');
                            setSyncLoading(false);
                        }
                    });
                }
            });
        }
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

    const [loadingRequestVerification, setLoadingRequestVerification] = useState(false);
    const sendReqVerification = () => {
        setLoadingRequestVerification(true);
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
            setLoadingRequestVerification(false);
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

    const [loadingReplyVerification, setLoadingReplyVerification] = useState(false);
    const sentRepVerification = () => {
        setLoadingReplyVerification(true);
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
            setLoadingReplyVerification(false);
        });
    }

    const updateTotalRealisasi = () => {
        let total = 0;
        if (month == 1) {
            total = datas[0]?.realisasi_anggaran_bulan_ini;
        }
        if (month > 1 && month < 13) {
            total = datas[0]?.realisasi_anggaran + datas[0]?.realisasi_anggaran_bulan_ini;
        }
        if (dataRincian) {
            setDataRincian((prev: any) => {
                const updated = prev;
                updated.indicators[0].realisasi = total ?? 0;
                return updated;
            });
        }
    }

    useEffect(() => {
        if (datas?.length > 0) {
            if (month == 1 && datas[0]?.realisasi_anggan_bulan_ini) {
                updateTotalRealisasi();
            }
            if (month > 1 && month < 13 && (datas[0]?.realisasi_anggaran && datas[0]?.realisasi_anggaran_bulan_ini)) {
                updateTotalRealisasi();
            }
        }
    }, [datas]);

    const saveKeterangan = () => {
        SaveKeterangan(dataRealisasiSubKegiatan.id, dataKeterangan, year, month).then((data: any) => {
            if (data.status === 'success') {
                showAlert('success', data.message)
                setUnsaveKeteranganStatus(false);
                if (dataRealisasiSubKegiatan.id && (tab == 3 || tab == 5)) {
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
                if (dataRealisasiSubKegiatan.id && (tab == 3 || tab == 5)) {
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

    return (
        <>
            <div className="panel p-0 mb-10 sm:h-[calc(100vh-16em)] h-full overflow-x-auto">

                <div className="p-4 block sm:hidden">
                    <div className="font-semibold">
                        Input Realisasi
                    </div>
                    <div className="text-sm line-clamp-2 md:line-clamp-none">
                        {subKegiatan?.fullcode}
                        <span className='ml-2 font-semibold'>
                            {subKegiatan?.name}
                        </span>
                    </div>
                    <div className="hidden md:block">
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

                <div className="w-full flex items-center overflow-x-auto">

                    <button
                        onClick={(e) => {
                            if (isLoading === false) {
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
                            if (isLoading === false) {
                                setTab(3)
                            }
                        }}
                        className={`${tab === 3 ? 'text-white !outline-none before:!w-full bg-blue-500' : ''} grow text-blue-500 !outline-none relative -mb-[1px] flex items-center justify-center gap-2 p-4 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-blue-500 before:transition-all before:duration-700 hover:before:w-full`}
                    >
                        <FontAwesomeIcon icon={faThumbTack} className='w-4 h-4' />
                        <span className='font-semibold whitespace-nowrap uppercase'>
                            Keterangan
                        </span>
                    </button>

                    <button
                        onClick={(e) => {
                            if (isLoading === false) {
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
                                    setTab(5)
                                }
                            }
                        }}
                        className={`${tab === 5 ? 'text-white !outline-none before:!w-full bg-blue-500' : ''} grow text-blue-500 !outline-none relative -mb-[1px] flex items-center justify-center gap-2 p-4 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-blue-500 before:transition-all before:duration-700 hover:before:w-full`}
                    >
                        <FontAwesomeIcon icon={faArchive} className='w-4 h-4' />
                        <span className='font-semibold whitespace-nowrap uppercase'>
                            Berkas Pendukung
                        </span>
                    </button>

                    <button
                        onClick={(e) => {
                            if (isLoading === false) {
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
                            }
                        }}
                        className={`${tab === 4 ? 'text-white !outline-none before:!w-full bg-blue-500' : ''} grow text-blue-500 !outline-none relative -mb-[1px] flex items-center justify-center gap-2 p-4 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-blue-500 before:transition-all before:duration-700 hover:before:w-full`}
                    >
                        <FontAwesomeIcon icon={faFileSignature} className='w-4 h-4' />
                        <span className='font-semibold whitespace-nowrap uppercase'>
                            Kontrak
                        </span>
                    </button>

                    <button
                        onClick={(e) => {
                            if (isLoading === false) {
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
                            }
                        }}
                        className={`${tab === 1 ? 'text-white !outline-none before:!w-full bg-blue-500' : ''} rounded-tr grow text-blue-500 !outline-none relative -mb-[1px] flex items-center justify-center gap-2 p-4 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-blue-500 before:transition-all before:duration-700 hover:before:w-full`}
                    >
                        <FontAwesomeIcon icon={faListUl} className='w-4 h-4' />
                        <span className='font-semibold whitespace-nowrap uppercase'>
                            Data Realisasi
                        </span>
                    </button>

                </div>

                {tab === 2 && (
                    <div className="">
                        {isMounted && (
                            <RincianBelanja
                                params={isMounted &&
                                {
                                    periode: periode,
                                    year: year,
                                    month: month,
                                    subKegiatan: subKegiatan,
                                    datas: datas,
                                }
                                }
                                updateData={(dt: any) => {
                                    setDatas(dt);

                                    let total = 0;
                                    if (month == 1) {
                                        total = dt[0]?.realisasi_anggaran_bulan_ini;
                                    }
                                    if (month > 1 && month < 13) {
                                        total = dt[0]?.realisasi_anggaran + dt[0]?.realisasi_anggaran_bulan_ini;
                                    }
                                    if (dataRincian) {
                                        setDataRincian((prev: any) => {
                                            const updated = prev;
                                            updated.indicators[0].realisasi = total ?? 0;
                                            return updated;
                                        });
                                    }

                                }}
                                isUnsave={setUnsaveStatus}
                            />
                        )}
                    </div>
                )}

                {tab === 1 && (
                    <div className="">
                        {isMounted && (
                            <Summary
                                params={isMounted &&
                                {
                                    periode: periode,
                                    year: year,
                                    month: month,
                                    subKegiatan: subKegiatan,
                                    datas: dataRincian,
                                }
                                }
                                updateData={setDataRincian}
                                isUnsave={setUnsaveStatus}
                                key={dataRincian}
                            />
                        )}
                    </div>
                )}

                {tab === 3 && (
                    <div className='p-5 h-[calc(100vh-250px)]'>
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
                                        className='form-input resize-none min-h-[250px]'></textarea>
                                </div>
                            </div>
                            <div className="col-span-10 md:col-span-5 space-y-5">
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
                            </div>
                            <div className="col-span-10 flex items-center justify-between">
                                <div className=""></div>
                                {([1, 2, 9].includes(CurrentUser?.role_id)) && (
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
                                )}
                            </div>

                        </form>
                    </div>
                )}

                {tab === 4 && (
                    <Kontrak
                        // datas={activeContracts}
                        subKegiatan={subKegiatan}
                        arrRekening={arrRekening}
                        year={year}
                    />
                )}

                {tab === 5 && (
                    <div className="p-5 pt-0 h-[calc(100vh-250px)] overflow-x-auto">
                        <BerkasPendukung
                            datas={dataKeterangan.files}
                            arrRekening={arrRekening}
                            isLoading={false}
                            isDone={unsaveKeteranganStatus}
                            onInputChange={(data: any, rekeningId: any) => {
                                setUnsaveKeteranganStatus(true);
                                uploadBerkasRealisasi(dataRealisasiSubKegiatan.id, year, month, data, rekeningId).then((data: any) => {
                                    if (data.status === 'success') {
                                        showAlert('success', data.message)
                                        setUnsaveKeteranganStatus(false);
                                        if (dataRealisasiSubKegiatan.id && tab == 5) {
                                            getKeteranganSubKegiatan(dataRealisasiSubKegiatan.id, year, month).then((data: any) => {
                                                if (data.status == 'success') {
                                                    setDataKeterangan(data.data);
                                                    setImages(data.data.files);
                                                }
                                            });
                                        }
                                    } else {
                                        showAlert('success', data.message)
                                        return;
                                    }
                                })
                            }}
                            onDelete={(data: any) => {
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
                                        deleteKeteranganImage(data?.id);
                                    }
                                });
                            }}
                        />
                    </div>
                )}

            </div>

            {isMounted && (
                <div className="fixed bottom-0 left-0 w-full bg-slate-100 dark:bg-slate-800 sm:h-[70px] py-1 pr-16 pl-0 lg:pl-16">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pl-10 gap-y-2 relative">
                        <div className="hidden sm:block">
                            <div className="font-semibold">
                                Input Realisasi
                            </div>
                            <div className="text-sm line-clamp-2 md:line-clamp-none">
                                {subKegiatan?.fullcode}
                                <span className='ml-2 font-semibold'>
                                    {subKegiatan?.name}
                                </span>
                            </div>
                            <div className="hidden md:block">
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
                        <div className="flex justify-end items-center gap-2 flex-wrap w-full md:w-1/2">
                            {(tab === 1 || tab === 2 || tab === 5) && (
                                <>
                                    <Tippy content={`Tekan Untuk Melihat Log`}>
                                        <button
                                            type='button'
                                            disabled={dataBackEndError === true ? true : false}
                                            className='relative'
                                            onClick={
                                                (e) => {
                                                    dataBackEndError === false &&
                                                        openLogsModal()
                                                }}>
                                            {subKegiatan?.status == 'draft' && (
                                                <div className="btn btn-primary btn-sm pr-8">
                                                    <FontAwesomeIcon icon={faBriefcaseClock} className='mr-2 w-4 h-4' />
                                                    Draft
                                                </div>
                                            )}
                                            {subKegiatan?.status == 'verified' && (
                                                <div className="btn btn-success btn-sm pr-8">
                                                    <FontAwesomeIcon icon={faCheck} className='mr-2 w-4 h-4' />
                                                    Terverifikasi
                                                </div>
                                            )}
                                            {subKegiatan?.status == 'reject' && (
                                                <div className="btn btn-danger btn-sm pr-8">
                                                    <FontAwesomeIcon icon={faTimes} className='mr-2 w-4 h-4' />
                                                    Ditolak
                                                </div>
                                            )}
                                            {subKegiatan?.status == 'return' && (
                                                <div className="btn btn-warning btn-sm pr-8">
                                                    <FontAwesomeIcon icon={faSyncAlt} className='mr-2 w-4 h-4' />
                                                    Dikembalikan
                                                </div>
                                            )}
                                            {subKegiatan?.status == 'sent' && (
                                                <div className="btn btn-info btn-sm pr-8">
                                                    <FontAwesomeIcon icon={faShare} className='mr-2 w-4 h-4' />
                                                    Dikirim
                                                </div>
                                            )}
                                            {subKegiatan?.status == 'waiting' && (
                                                <div className="btn btn-dark btn-sm pr-8">
                                                    <FontAwesomeIcon icon={faHourglassHalf} className='mr-2 w-4 h-4' />
                                                    Menunggu
                                                </div>
                                            )}
                                            <div className="flex items-center justify-center w-8 h-full absolute top-0 right-0">
                                                <FontAwesomeIcon icon={faAngleDoubleUp} className='border-l pl-1 w-5 h-5 text-white dark:text-white-dark' />
                                            </div>
                                        </button>
                                    </Tippy>

                                    <div className="border-r-2 border-slate-400 h-[35px] w-2 hidden sm:block"></div>

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

                                    <div className="dropdown">
                                        <Dropdown
                                            placement={`top-end`}
                                            btnClassName="btn btn-sm flex whitespace-nowrap dark:border-cyan-900 dark:shadow-black-dark-light bg-cyan-600 dark:bg-cyan-700 hover:bg-cyan-500 dark:hover:bg-cyan-800 text-white cursor-pointer dropdown-toggle"
                                            button={
                                                <>
                                                    Menu
                                                    <FontAwesomeIcon icon={faBars} className='ml-2 w-3 h-3' />
                                                </>
                                            }
                                        >
                                            <ul className="!min-w-[200px]">
                                                {month > 1 && (
                                                    <li>
                                                        <a
                                                            // onClick={(e) => {
                                                            //     setMonth(parseInt(month) - 1);
                                                            // }}
                                                            href={`/realisasi/${subKegiatanId}?periode=${periode}&year=${year}&month=${Number(month) - 1}`}
                                                            className='flex items-center'>
                                                            <FontAwesomeIcon icon={faArrowRightToBracket} className='mr-2 w-4 h-4 flex-none -scale-x-100' />
                                                            <span>
                                                                Bulan {new Date(year, month - 2).toLocaleString('id-ID', { month: 'long' })}
                                                            </span>
                                                        </a>
                                                    </li>
                                                )}
                                                {month < 12 && (
                                                    <li>
                                                        <a
                                                            // onClick={(e) => {
                                                            //     setMonth(parseInt(month) + 1);
                                                            // }}
                                                            href={`/realisasi/${subKegiatanId}?periode=${periode}&year=${year}&month=${Number(month) + 1}`}
                                                            className='flex items-center'>
                                                            <FontAwesomeIcon icon={faArrowRightToBracket} className='mr-2 w-4 h-4' />
                                                            <span>
                                                                Bulan {new Date(year, month).toLocaleString('id-ID', { month: 'long' })}
                                                            </span>
                                                        </a>
                                                    </li>
                                                )}
                                                <li>
                                                    <Link href={`/kinerja/target/${subKegiatanId}?periode=${periode}&year=${year}&month=${month}`} className='flex items-center'>
                                                        <FontAwesomeIcon icon={faLink} className='mr-2 w-4 h-4 flex-none -scale-x-100' />
                                                        <span>
                                                            Buka Target
                                                        </span>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </Dropdown>
                                    </div>

                                    {/* {(dataBackEndError === false && [1, 2, 3, 4, 5, 6, 7, 8, 9].includes(CurrentUser.role_id) && (tab === 1 || tab === 2)) && (
                                        <button
                                            type='button'
                                            className='btn btn-sm dark:border-indigo-900 dark:shadow-black-dark-light bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-500 dark:hover:bg-indigo-800 text-white'
                                            onClick={(e) => {
                                                if (syncLoading === false) {
                                                    confirmSync();
                                                } else {
                                                    showAlert('info', 'Sedang Melakukan Singkron Data');
                                                }
                                            }}>
                                            <FontAwesomeIcon icon={faSyncAlt} className='mr-2 w-4 h-4' />
                                            {syncLoading ? 'Sedang Melakukan Singkron Data' : 'Singkron Data'}
                                        </button>
                                    )} */}
                                    {(dataBackEndError === false && (tab === 1 || tab === 2)) ? (
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
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg w-full max-w-[100%] md:max-w-[70%] my-8 text-black dark:text-white-dark">
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
                                            {[1, 2, 8].includes(CurrentUser?.role_id) && (
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
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg w-full max-w-[100%] md:max-w-[50%] my-8 text-black dark:text-white-dark">
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

                                            {loadingRequestVerification == false ? (
                                                <button
                                                    onClick={() => sendReqVerification()}
                                                    type="button"
                                                    className="btn btn-success text-xs">
                                                    <IconSend className="w-4 h-4 mr-1" />
                                                    Ajukan Verifikasi
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    type="button"
                                                    className="btn btn-success text-xs">
                                                    <FontAwesomeIcon icon={faSpinner} className='w-4 h-4 animate-spin' />
                                                    <span className='ml-2'>Loading</span>
                                                </button>
                                            )}

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
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg w-full max-w-[100%] md:max-w-[50%] my-8 text-black dark:text-white-dark">
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

                                            {loadingReplyVerification == false ? (
                                                <button
                                                    onClick={() => sentRepVerification()}
                                                    type="button"
                                                    className="btn btn-success text-xs">
                                                    <IconSend className="w-4 h-4 mr-1" />
                                                    Kirim
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    type="button"
                                                    className="btn btn-success text-xs">
                                                    <FontAwesomeIcon icon={faSpinner} className='w-4 h-4 animate-spin' />
                                                    <span className='ml-2'>Loading</span>
                                                </button>
                                            )}

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
