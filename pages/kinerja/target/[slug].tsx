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

import { getMasterData, Save, fetchLogs, sendRequestVerification, sendReplyVerification, DeleteRincianBelanja } from '@/apis/targetkinerja_apis';
import { fetchPeriodes, fetchSatuans } from '@/apis/fetchdata';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faMinus, faMinusCircle, faPlus, faPlusCircle, faArrowRightToBracket, faBriefcaseClock, faCheck, faTimes, faSyncAlt, faForward, faHourglassHalf, faShare, faUserAlt, faExclamationCircle, faSpinner, faCaretUp, faAngleDoubleUp, faBars, faLink } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import IconSend from '@/components/Icon/IconSend';
import LoadingSicaram from '@/components/LoadingSicaram';
import Dropdown from '@/components/Dropdown';


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
        dispatch(setPageTitle('Input Target Kinerja'));
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
    const [dataBackEndError, setDataBackEndError] = useState<any>(null);
    const [dataBackEndMessage, setDataBackEndMessage] = useState<any>(null);
    const [unsaveStatus, setUnsaveStatus] = useState<boolean>(false);
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
        setDatas(null);
        setSubKegiatan(null);
        setDataBackEndError(null);
        setDataBackEndMessage(null);
        if (subKegiatanId) {
            getMasterData(subKegiatanId, year, month).then((data) => {
                if (data.status == 'success') {
                    setDatas(data.data.data);
                    setSubKegiatan(data.data.subkegiatan);
                    setDataBackEndError(data.data.data_error);
                    setDataBackEndMessage(data.data.message_error);
                }
                if (data.status == 'error') {
                    showAlert('error', data.message);
                }
            });
        }
    }, [subKegiatanId, year, month]);

    const addRincianBelanja = (index: any) => {
        if (subKegiatan?.status == 'verified') {
            showAlert('error', 'Data tidak dapat diubah karena Status Target Sudah "Terverifikasi"');
            return;
        }
        setUnsaveStatus(true);
        setDatas((prev: any) => {
            const updated = [...prev];
            // const newRincianBelanja = ;
            updated[index]['rincian_belanja'].push({
                editable: true,
                long: false,
                type: 'rincian-belanja',
                id: null,
                target_kinerja_id: updated[index].id,
                pagu_sebelum_pergeseran: 0,
                pagu_sesudah_pergeseran: 0,
                pagu_selisih: 0,
                keterangan_rincian: [
                    {
                        editable: true,
                        long: false,
                        type: 'keterangan-rincian',
                        id: null,
                        target_kinerja_id: updated[index].id,
                        title: null,
                        koefisien: 0,
                        satuan_id: null,
                        satuan_name: null,
                        harga_satuan: 0,
                        ppn: 0,
                        pagu: 0,
                    },
                ],
                title: '',
            });
            return updated;
        });
    }

    const confirmDeleteRincianBelanja = (index: any, indexRincian: any, rincianId: any) => {
        if (subKegiatan?.status == 'verified') {
            showAlert('error', 'Data tidak dapat diubah karena Status Target Sudah "Terverifikasi"');
            return;
        }
        Swal.fire({
            title: 'Hapus Rincian Belanja',
            text: 'Apakah Anda yakin ingin menghapus rincian belanja ini? Rincian dihapus tidak dapat dikembalikan.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteRincianBelanja(index, indexRincian, rincianId);
            }
        });
    }

    const deleteRincianBelanja = (index: any, indexRincian: any, rincianId: any) => {
        setUnsaveStatus(true);
        if (rincianId) {
            DeleteRincianBelanja(rincianId, periode, year, month).then((data: any) => {
                if (data.status == 'success') {
                    setDatas((prev: any) => {
                        const updated = [...prev];
                        updated[index]['rincian_belanja'].splice(indexRincian, 1);
                        return updated;
                    });
                }
                else {
                    showAlert('error', data.message);
                    setDatas((prev: any) => {
                        const updated = [...prev];
                        updated[index]['rincian_belanja'].splice(indexRincian, 1);
                        return updated;
                    });
                }
            });
        } else {
            setDatas((prev: any) => {
                const updated = [...prev];
                updated[index]['rincian_belanja'].splice(indexRincian, 1);
                return updated;
            });
        }
    }

    const confirmSave = () => {
        Swal.fire({
            title: 'Simpan Target Kinerja',
            text: 'Apakah Anda yakin ingin menyimpan target kinerja ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Simpan',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                Save(subKegiatanId, datas, periode, year, month).then((data: any) => {
                    if (data.status == 'success') {
                        getMasterData(subKegiatanId, year, month).then((data) => {
                            if (data.status == 'success') {
                                setDatas(data.data.data);
                                setSubKegiatan(data.data.subkegiatan);
                                setDataBackEndError(data.data.data_error);
                                setDataBackEndMessage(data.data.message_error);
                                showAlert('success', 'Data berhasil disimpan');
                                setUnsaveStatus(false);
                            }
                        });
                    }
                    else {
                        showAlert('error', data);
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

    return (
        <>
            <div className="panel">
                <div className="table-responsive h-[calc(100vh-280px)] pr-3.5 border !border-slate-400 dark:!border-slate-100">
                    <table className=''>
                        <thead className='sticky top-0 left-0 z-[1]'>
                            <tr>
                                <th rowSpan={2}
                                    className='!text-center !text-xs !px-2.5 !py-1.5 border-0 !border-slate-400 dark:!border-slate-100 dark:text-white whitespace-nowrap !w-[150px]'>
                                    Kode Rekening
                                </th>
                                <th rowSpan={2}
                                    className='!text-center !text-xs !px-2.5 !py-1.5 border-x !border-slate-400 dark:!border-slate-100 dark:text-white whitespace-nowrap !min-w-[300px]'>
                                    Uraian
                                </th>
                                <th rowSpan={1} colSpan={4}
                                    className='!text-center !text-xs !px-2.5 !py-1.5 border-x !border-slate-400 dark:!border-slate-100 dark:text-white whitespace-nowrap !min-w-[650px]'>
                                    Rincian Perhitungan
                                </th>
                            </tr>
                            <tr>
                                <th className='!text-center !text-xs !px-2.5 !py-1.5 border !border-slate-400 dark:!border-slate-100 dark:text-white whitespace-nowrap !w-[150px]'>
                                    Koefisien
                                </th>
                                <th className='!text-center !text-xs !px-2.5 !py-1.5 border !border-slate-400 dark:!border-slate-100 dark:text-white whitespace-nowrap !w-[150px]'>
                                    Satuan
                                </th>
                                <th className='!text-center !text-xs !px-2.5 !py-1.5 border !border-slate-400 dark:!border-slate-100 dark:text-white whitespace-nowrap !w-[150px]'>
                                    Harga (Rp)
                                </th>
                                <th className='!text-center !text-xs !px-2.5 !pr-5 !py-1.5 border !border-slate-400 dark:!border-slate-100 dark:text-white whitespace-nowrap !w-[150px]'>
                                    Jumlah (Rp)
                                </th>
                            </tr>
                        </thead>
                        <tbody className='dark:text-white'>
                            {(!datas || datas?.length === 0) && (
                                <tr>
                                    <td colSpan={100} className='h-[calc(100vh-300px)]'>
                                        <div className="h-full w-full flex items-center justify-center flex-col">
                                            <LoadingSicaram></LoadingSicaram>
                                            <div className="dots-loading text-xl">Memuat Data...</div>
                                        </div>
                                    </td>
                                </tr>
                            )}

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
                                                                            {(data.is_detail == true && month == 1) && (
                                                                                <>
                                                                                    <Tippy content={`Tambah Rincian Belanja`}>
                                                                                        <button
                                                                                            type='button'
                                                                                            className='btn bg-success text-white w-4.5 h-4.5 p-1 rounded-full'
                                                                                            onClick={(e) => {
                                                                                                addRincianBelanja(index);
                                                                                            }}>
                                                                                            <FontAwesomeIcon icon={faPlus} className='' />
                                                                                        </button>
                                                                                    </Tippy>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td className='border !border-slate-400 dark:!border-slate-100 !px-1 !pr-4'>


                                                        {data?.type !== 'target-kinerja' && (
                                                            <div className="text-xs font-semibold whitespace-nowrap text-end px-2">
                                                                {new Intl.NumberFormat('id-ID', {
                                                                    style: 'decimal',
                                                                    minimumFractionDigits: 0,
                                                                }).format(data?.pagu ?? 0)}
                                                            </div>
                                                        )}

                                                        {/* {(data?.type === 'target-kinerja' && data?.is_detail === true) && (
                                                            <div className={data?.is_pagu_match === true ?
                                                                'text-green-700 text-xs font-semibold whitespace-nowrap text-end px-2' :
                                                                'text-red-600 text-xs font-semibold whitespace-nowrap text-end px-2'}>
                                                                {new Intl.NumberFormat('id-ID', {
                                                                    style: 'decimal',
                                                                    minimumFractionDigits: 0,
                                                                }).format(data?.pagu ?? 0)}
                                                            </div>
                                                        )}

                                                        {(data?.type === 'target-kinerja' && data?.is_detail === false) && (
                                                            <div className='text-xs font-semibold whitespace-nowrap text-end px-2'>
                                                                {new Intl.NumberFormat('id-ID', {
                                                                    style: 'decimal',
                                                                    minimumFractionDigits: 0,
                                                                }).format(data?.pagu ?? 0)}
                                                            </div>
                                                        )} */}

                                                        {data?.type === 'target-kinerja' && (
                                                            <>
                                                                <input
                                                                    type='text'
                                                                    value={data?.pagu}
                                                                    readOnly={subKegiatan?.status == 'verified' ? true : false}
                                                                    disabled={month == 1 ? false : true}
                                                                    onChange={
                                                                        (e) => {
                                                                            if (subKegiatan?.status == 'verified') {
                                                                                showAlert('error', 'Data tidak dapat diubah karena Status Target Sudah "Terverifikasi"');
                                                                                return;
                                                                            }
                                                                            setUnsaveStatus(true);
                                                                            setDatas((prev: any) => {
                                                                                const updated = [...prev];
                                                                                updated[index] = {
                                                                                    editable: data?.editable,
                                                                                    long: data?.long,
                                                                                    type: data?.type,
                                                                                    id: data?.id,
                                                                                    year: data?.year,
                                                                                    jenis: data?.jenis,
                                                                                    sumber_dana_id: data?.sumber_dana_id,
                                                                                    sumber_dana_fullcode: data?.sumber_dana_fullcode,
                                                                                    sumber_dana_name: data?.sumber_dana_name,
                                                                                    nama_paket: data?.nama_paket,
                                                                                    pagu: parseInt(e.target.value),
                                                                                    temp_pagu: data?.temp_pagu,
                                                                                    is_pagu_match: data?.is_pagu_match,
                                                                                    is_detail: data?.is_detail,
                                                                                    rincian_belanja: data?.rincian_belanja,
                                                                                };

                                                                                return updated;
                                                                            });
                                                                        }
                                                                    }
                                                                    className='form-input w-full border-slate-400 dark:border-slate-100 dark:text-white min-h-8 font-normal text-xs px-1.5 py-1 resize-none leading-tight disabled:opacity-50 text-end'
                                                                    placeholder='Pagu' />
                                                            </>
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
                                                                            <div className="flex items-center gap-x-2">
                                                                                <div className="w-full -m-2 mr-0">
                                                                                    <textarea
                                                                                        value={rincian?.title}
                                                                                        readOnly={subKegiatan?.status == 'verified' ? true : false}
                                                                                        disabled={month == 1 ? false : true}
                                                                                        onChange={
                                                                                            (e) => {
                                                                                                if (subKegiatan?.status == 'verified') {
                                                                                                    showAlert('error', 'Data tidak dapat diubah karena Status Target Sudah "Terverifikasi"');
                                                                                                    return;
                                                                                                }
                                                                                                setUnsaveStatus(true);
                                                                                                setDatas((prev: any) => {
                                                                                                    const updated = [...prev];
                                                                                                    updated[index]['rincian_belanja'][indexRincian] = {
                                                                                                        editable: rincian?.editable,
                                                                                                        long: rincian?.long,
                                                                                                        type: rincian?.type,
                                                                                                        id: rincian?.id,
                                                                                                        target_kinerja_id: rincian?.target_kinerja_id,
                                                                                                        pagu: rincian?.pagu,
                                                                                                        keterangan_rincian: rincian?.keterangan_rincian,
                                                                                                        title: e.target.value,
                                                                                                    };
                                                                                                    return updated;
                                                                                                });
                                                                                            }
                                                                                        }
                                                                                        style={{
                                                                                            height: rincian?.title?.split('\n').length > 1 ? 'auto' : '38px',
                                                                                            minHeight: rincian?.title?.split('\n').length > 1 ? '50px' ? rincian?.title?.split('\n').length > 2 ? '75px' : 'unset' : 'unset' : 'unset',
                                                                                            overflow: rincian?.title?.split('\n').length > 1 ? 'hidden' : 'hidden',
                                                                                        }}
                                                                                        className='form-input w-full border-slate-400 dark:border-slate-100 dark:text-white min-h-8 font-normal text-xs px-1.5 py-1 resize-none leading-tight disabled:opacity-50'
                                                                                        placeholder='Rincian Belanja' />
                                                                                </div>

                                                                                <div className="">
                                                                                    {month == 1 && (
                                                                                        <Tippy content={`Hapus Rincian Belanja`}>
                                                                                            <button
                                                                                                type='button'
                                                                                                className='btn bg-danger text-white w-5 h-5 p-1 rounded-full'
                                                                                                onClick={(e) => {
                                                                                                    confirmDeleteRincianBelanja(index, indexRincian, rincian?.id);
                                                                                                }}>
                                                                                                <FontAwesomeIcon icon={faTrashAlt} className='' />
                                                                                            </button>
                                                                                        </Tippy>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className='border !border-slate-400 dark:!border-slate-100 !px-1 !pr-4'>
                                                                            <div className={data?.is_pagu_match === true ?
                                                                                'text-green-700 text-xs font-semibold whitespace-nowrap text-end px-2' :
                                                                                'text-red-600 text-xs font-semibold whitespace-nowrap text-end px-2'}>
                                                                                {new Intl.NumberFormat('id-ID', {
                                                                                    style: 'decimal',
                                                                                    minimumFractionDigits: 0,
                                                                                }).format(rincian?.pagu ?? 0)}
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
                                                                                        <div className="-m-2">
                                                                                            <textarea
                                                                                                value={keterangan?.title}
                                                                                                readOnly={subKegiatan?.status == 'verified' ? true : false}
                                                                                                disabled={month == 1 ? false : true}
                                                                                                onChange={
                                                                                                    (e) => {
                                                                                                        if (subKegiatan?.status == 'verified') {
                                                                                                            showAlert('error', 'Data tidak dapat diubah karena Status Target Sudah "Terverifikasi"');
                                                                                                            return;
                                                                                                        }
                                                                                                        setUnsaveStatus(true);
                                                                                                        setDatas((prev: any) => {
                                                                                                            const updated = [...prev];
                                                                                                            updated[index]['rincian_belanja'][indexRincian]['keterangan_rincian'][indexKeterangan] = {
                                                                                                                editable: keterangan?.editable,
                                                                                                                id: keterangan?.id,
                                                                                                                long: keterangan?.long,
                                                                                                                type: keterangan?.type,
                                                                                                                target_kinerja_id: keterangan?.target_kinerja_id,
                                                                                                                title: e.target.value,
                                                                                                                koefisien: keterangan?.koefisien,
                                                                                                                satuan_id: keterangan?.satuan_id,
                                                                                                                satuan_name: keterangan?.satuan_name,
                                                                                                                harga_satuan: keterangan?.harga_satuan,
                                                                                                                ppn: keterangan?.ppn,
                                                                                                                pagu: keterangan?.pagu,
                                                                                                            };
                                                                                                            return updated;
                                                                                                        });
                                                                                                    }
                                                                                                }
                                                                                                style={{
                                                                                                    height: keterangan?.title?.split('\n').length > 1 ? 'auto' : '38px',
                                                                                                    minHeight: keterangan?.title?.split('\n').length > 1 ? '50px' ? keterangan?.title?.split('\n').length > 2 ? '75px' : 'unset' : 'unset' : 'unset',
                                                                                                    overflow: keterangan?.title?.split('\n').length > 1 ? 'hidden' : 'hidden',
                                                                                                }}
                                                                                                className='form-input border-slate-400 dark:border-slate-100 dark:text-white w-full min-h-8 font-normal text-xs px-1.5 py-1 resize-none leading-tight disabled:opacity-50'
                                                                                                placeholder='Keterangan Rincian Belanja' />
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className='border !border-slate-400 dark:!border-slate-100'>
                                                                                        <div className="text-xs -m-3 flex gap-x-1 items-center">
                                                                                            <input
                                                                                                type='text'
                                                                                                value={keterangan?.koefisien}
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
                                                                                                readOnly={subKegiatan?.status == 'verified' ? true : false}
                                                                                                onChange={
                                                                                                    (e) => {
                                                                                                        if (subKegiatan?.status == 'verified') {
                                                                                                            showAlert('error', 'Data tidak dapat diubah karena Status Target Sudah "Terverifikasi"');
                                                                                                            return;
                                                                                                        }
                                                                                                        setUnsaveStatus(true);
                                                                                                        const value = e.target.value ?? 0;
                                                                                                        setDatas((prev: any) => {
                                                                                                            const updated = [...prev];

                                                                                                            let hargaSatuan = keterangan?.harga_satuan && keterangan?.harga_satuan.toString().replace(/\./g, '.');
                                                                                                            let calculatePagu = parseFloat(value) * parseFloat(hargaSatuan);
                                                                                                            calculatePagu = parseFloat(calculatePagu.toFixed(0));
                                                                                                            let tempSumCalculatePagu = data.rincian_belanja.reduce((a: any, b: any) => a + (b['keterangan_rincian'][indexKeterangan]?.pagu || 0), 0);
                                                                                                            let isPaguMatch = tempSumCalculatePagu == data.pagu ? true : false;

                                                                                                            updated[index] = {
                                                                                                                editable: data?.editable,
                                                                                                                long: data?.long,
                                                                                                                type: data?.type,
                                                                                                                id: data?.id,
                                                                                                                year: data?.year,
                                                                                                                jenis: data?.jenis,
                                                                                                                sumber_dana_id: data?.sumber_dana_id,
                                                                                                                sumber_dana_fullcode: data?.sumber_dana_fullcode,
                                                                                                                sumber_dana_name: data?.sumber_dana_name,
                                                                                                                nama_paket: data?.nama_paket,
                                                                                                                pagu: data?.pagu,
                                                                                                                temp_pagu: tempSumCalculatePagu,
                                                                                                                is_pagu_match: isPaguMatch,
                                                                                                                is_detail: data?.is_detail,
                                                                                                                rincian_belanja: data?.rincian_belanja,
                                                                                                            };
                                                                                                            updated[index]['rincian_belanja'][indexRincian] = {
                                                                                                                editable: rincian?.editable,
                                                                                                                long: rincian?.long,
                                                                                                                type: rincian?.type,
                                                                                                                id: rincian?.id,
                                                                                                                target_kinerja_id: rincian?.target_kinerja_id,
                                                                                                                pagu: calculatePagu,
                                                                                                                keterangan_rincian: rincian?.keterangan_rincian,
                                                                                                                title: rincian?.title,
                                                                                                            };
                                                                                                            updated[index]['rincian_belanja'][indexRincian]['keterangan_rincian'][indexKeterangan] = {
                                                                                                                editable: keterangan?.editable,
                                                                                                                id: keterangan?.id,
                                                                                                                long: keterangan?.long,
                                                                                                                type: keterangan?.type,
                                                                                                                target_kinerja_id: keterangan?.target_kinerja_id,
                                                                                                                title: keterangan?.title,
                                                                                                                koefisien: e.target.value,
                                                                                                                satuan_id: keterangan?.satuan_id,
                                                                                                                satuan_name: keterangan?.satuan_name,
                                                                                                                harga_satuan: keterangan?.harga_satuan,
                                                                                                                ppn: keterangan?.ppn,
                                                                                                                pagu: calculatePagu,
                                                                                                            };
                                                                                                            return updated;
                                                                                                        });
                                                                                                    }
                                                                                                }
                                                                                                className='form-input border-slate-400 dark:border-slate-100 dark:text-white w-full min-h-8 font-normal text-xs px-1.5 py-1'
                                                                                                placeholder='Koefisien'
                                                                                            />
                                                                                            <Tippy content='Desimal menggunakan Koma " , "'>
                                                                                                <div className="cursor-pointer text-info">
                                                                                                    <FontAwesomeIcon icon={faExclamationCircle} className="w-3 h-3" />
                                                                                                </div>
                                                                                            </Tippy>
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className='border !border-slate-400 dark:!border-slate-100'>
                                                                                        <div className="text-xs -m-3">
                                                                                            <CreatableSelect
                                                                                                id='satuan'
                                                                                                className='!text-xs !w-[200px]'
                                                                                                styles={
                                                                                                    {
                                                                                                        menu: (provided: any, state: any) => ({
                                                                                                            ...provided,
                                                                                                            top: 'auto',
                                                                                                            bottom: '100%',
                                                                                                        }),
                                                                                                    }
                                                                                                }
                                                                                                minMenuHeight={50}
                                                                                                placeholder="Pilih Satuan"
                                                                                                onCreateOption={
                                                                                                    (e) => {
                                                                                                        setSatuans((prev: any) => {
                                                                                                            const updated = [...prev];
                                                                                                            updated.push({
                                                                                                                id: 0,
                                                                                                                name: e,
                                                                                                            });
                                                                                                            return updated;
                                                                                                        });
                                                                                                    }
                                                                                                }
                                                                                                options={
                                                                                                    satuans?.map((data: any) => {
                                                                                                        return {
                                                                                                            value: data.id,
                                                                                                            label: data.name,
                                                                                                        };
                                                                                                    })
                                                                                                }
                                                                                                isSearchable={true}
                                                                                                value={
                                                                                                    keterangan.satuan_name &&
                                                                                                    satuans.filter((data: any) => data.name == keterangan.satuan_name).map((data: any) => {
                                                                                                        return {
                                                                                                            value: data.id,
                                                                                                            label: data.name,
                                                                                                        };
                                                                                                    })[0]
                                                                                                }

                                                                                                createOptionPosition={
                                                                                                    'first'
                                                                                                }
                                                                                                isDisabled={subKegiatan?.status == 'verified' ? true : false}
                                                                                                onChange={
                                                                                                    (e: any) => {
                                                                                                        if (subKegiatan?.status == 'verified') {
                                                                                                            showAlert('error', 'Data tidak dapat diubah karena Status Target Sudah "Terverifikasi"');
                                                                                                            return;
                                                                                                        }
                                                                                                        setUnsaveStatus(true);
                                                                                                        setDatas((prev: any) => {
                                                                                                            const updated = [...prev];
                                                                                                            updated[index]['rincian_belanja'][indexRincian]['keterangan_rincian'][indexKeterangan] = {
                                                                                                                editable: keterangan?.editable,
                                                                                                                id: keterangan?.id,
                                                                                                                long: keterangan?.long,
                                                                                                                type: keterangan?.type,
                                                                                                                target_kinerja_id: keterangan?.target_kinerja_id,
                                                                                                                title: keterangan?.title,
                                                                                                                koefisien: keterangan?.koefisien,
                                                                                                                satuan_id: e.value,
                                                                                                                satuan_name: e.label,
                                                                                                                harga_satuan: keterangan?.harga_satuan,
                                                                                                                ppn: keterangan?.ppn,
                                                                                                                pagu: keterangan?.pagu,
                                                                                                            };
                                                                                                            return updated;
                                                                                                        });
                                                                                                    }
                                                                                                } />
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className='border !border-slate-400 dark:!border-slate-100'>
                                                                                        <div className="text-xs -m-3 mr-0 flex items-center gap-x-1">
                                                                                            <input
                                                                                                type='text'
                                                                                                value={keterangan?.harga_satuan}
                                                                                                onKeyDown={(e) => {
                                                                                                    if (
                                                                                                        !(
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
                                                                                                        )
                                                                                                    ) {
                                                                                                        e.preventDefault();
                                                                                                    }
                                                                                                }}
                                                                                                readOnly={subKegiatan?.status == 'verified' ? true : false}
                                                                                                onChange={
                                                                                                    (e) => {
                                                                                                        if (subKegiatan?.status == 'verified') {
                                                                                                            showAlert('error', 'Data tidak dapat diubah karena Status Target Sudah "Terverifikasi"');
                                                                                                            return;
                                                                                                        }
                                                                                                        setUnsaveStatus(true);
                                                                                                        const value = e.target.value ?? 0;
                                                                                                        setDatas((prev: any) => {
                                                                                                            const updated = [...prev];
                                                                                                            let koefisien = keterangan?.koefisien && keterangan?.koefisien.toString().replace(/\./g, '.');
                                                                                                            let calculatePagu = parseFloat(koefisien) * parseFloat(value);
                                                                                                            calculatePagu = parseFloat(calculatePagu.toFixed(0));
                                                                                                            let tempSumCalculatePagu = data.rincian_belanja.reduce((a: any, b: any) => a + (b['keterangan_rincian'][indexKeterangan]?.pagu || 0), 0);
                                                                                                            let isPaguMatch = tempSumCalculatePagu == data.pagu ? true : false;
                                                                                                            updated[index] = {
                                                                                                                editable: data?.editable,
                                                                                                                long: data?.long,
                                                                                                                type: data?.type,
                                                                                                                id: data?.id,
                                                                                                                year: data?.year,
                                                                                                                jenis: data?.jenis,
                                                                                                                sumber_dana_id: data?.sumber_dana_id,
                                                                                                                sumber_dana_fullcode: data?.sumber_dana_fullcode,
                                                                                                                sumber_dana_name: data?.sumber_dana_name,
                                                                                                                nama_paket: data?.nama_paket,
                                                                                                                pagu: data?.pagu,
                                                                                                                temp_pagu: tempSumCalculatePagu,
                                                                                                                is_pagu_match: isPaguMatch,
                                                                                                                is_detail: data?.is_detail,
                                                                                                                rincian_belanja: data?.rincian_belanja,
                                                                                                            };
                                                                                                            updated[index]['rincian_belanja'][indexRincian] = {
                                                                                                                editable: rincian?.editable,
                                                                                                                long: rincian?.long,
                                                                                                                type: rincian?.type,
                                                                                                                id: rincian?.id,
                                                                                                                target_kinerja_id: rincian?.target_kinerja_id,
                                                                                                                pagu: calculatePagu,
                                                                                                                keterangan_rincian: rincian?.keterangan_rincian,
                                                                                                                title: rincian?.title,
                                                                                                            };
                                                                                                            updated[index]['rincian_belanja'][indexRincian]['keterangan_rincian'][indexKeterangan] = {
                                                                                                                editable: keterangan?.editable,
                                                                                                                id: keterangan?.id,
                                                                                                                long: keterangan?.long,
                                                                                                                type: keterangan?.type,
                                                                                                                target_kinerja_id: keterangan?.target_kinerja_id,
                                                                                                                title: keterangan?.title,
                                                                                                                koefisien: keterangan?.koefisien,
                                                                                                                satuan_id: keterangan?.satuan_id,
                                                                                                                satuan_name: keterangan?.satuan_name,
                                                                                                                harga_satuan: value,
                                                                                                                ppn: keterangan?.ppn,
                                                                                                                pagu: calculatePagu,
                                                                                                            };
                                                                                                            return updated;
                                                                                                        });
                                                                                                    }
                                                                                                }
                                                                                                className='form-input border-slate-400 dark:border-slate-100 dark:text-white w-full min-h-8 font-normal text-xs px-1.5 py-1'
                                                                                                placeholder='Harga Satuan'
                                                                                            />
                                                                                            <Tippy content='Desimal menggunakan Koma " , "'>
                                                                                                <div className="cursor-pointer text-info">
                                                                                                    <FontAwesomeIcon icon={faExclamationCircle} className="w-3 h-3" />
                                                                                                </div>
                                                                                            </Tippy>
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className='border !border-slate-400 dark:!border-slate-100 !px-1 !pr-4'>
                                                                                        <div className={data?.is_pagu_match === true ? 'text-green-700 text-xs font-normal whitespace-nowrap text-end px-2' : 'text-red-600 text-xs font-normal whitespace-nowrap text-end px-2'}>
                                                                                            {new Intl.NumberFormat('id-ID', {
                                                                                                style: 'decimal',
                                                                                                minimumFractionDigits: 0,
                                                                                            }).format(keterangan?.pagu ?? 0)}
                                                                                        </div>
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
                </div >
            </div >

            {isMounted && (
                <div className="fixed bottom-0 left-0 w-full bg-slate-100 dark:bg-slate-800 sm:h-[70px] py-1 pr-16 pl-0 lg:pl-16">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pl-10 gap-y-2">
                        <div className="">
                            <div className="font-semibold">
                                Input Target
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

                            <div className="flex justify-end flex-wrap items-center gap-1 mr-3 w-[300px]">
                                {subKegiatan?.tag_sumber_dana?.length > 0 && (
                                    <>
                                        {showTags === false ? (
                                            <>
                                                {subKegiatan?.tag_sumber_dana?.length == 1 && (
                                                    <>
                                                        <Tippy content={`Sumber Dana ${subKegiatan?.tag_sumber_dana[0]?.tag_name}`}>
                                                            <div onClick={() => setShowTags(true)} className="text-xs bg-indigo-500 dark:bg-indigo-700 text-white px-2 py-1 rounded-md w-[75px] truncate cursor-pointer">
                                                                {subKegiatan?.tag_sumber_dana[0]?.tag_name}
                                                            </div>
                                                        </Tippy>
                                                    </>
                                                )}
                                                {subKegiatan?.tag_sumber_dana?.length == 2 && (
                                                    <>
                                                        <Tippy content={`Sumber Dana ${subKegiatan?.tag_sumber_dana[0]?.tag_name}`}>
                                                            <div onClick={() => setShowTags(true)} className="text-xs bg-indigo-500 dark:bg-indigo-700 text-white px-2 py-1 rounded-md w-[75px] truncate cursor-pointer">
                                                                {subKegiatan?.tag_sumber_dana[0]?.tag_name}
                                                            </div>
                                                        </Tippy>
                                                        <Tippy content={`Sumber Dana ${subKegiatan?.tag_sumber_dana[1]?.tag_name}`}>
                                                            <div onClick={() => setShowTags(true)} className="text-xs bg-indigo-500 dark:bg-indigo-700 text-white px-2 py-1 rounded-md w-[75px] truncate cursor-pointer">
                                                                {subKegiatan?.tag_sumber_dana[1]?.tag_name}
                                                            </div>
                                                        </Tippy>
                                                    </>
                                                )}
                                                {subKegiatan?.tag_sumber_dana?.length > 2 && (
                                                    <>
                                                        <Tippy content={`Sumber Dana ${subKegiatan?.tag_sumber_dana[0]?.tag_name}`}>
                                                            <div onClick={() => setShowTags(true)} className="text-xs bg-indigo-500 dark:bg-indigo-700 text-white px-2 py-1 rounded-md w-[75px] truncate cursor-pointer">
                                                                {subKegiatan?.tag_sumber_dana[0]?.tag_name}
                                                            </div>
                                                        </Tippy>
                                                        <Tippy content={`Sumber Dana ${subKegiatan?.tag_sumber_dana[1]?.tag_name}`}>
                                                            <div onClick={() => setShowTags(true)} className="text-xs bg-indigo-500 dark:bg-indigo-700 text-white px-2 py-1 rounded-md w-[75px] truncate cursor-pointer">
                                                                {subKegiatan?.tag_sumber_dana[1]?.tag_name}
                                                            </div>
                                                        </Tippy>
                                                        <Tippy content={`Dan ${subKegiatan?.tag_sumber_dana?.length - 2} Lainnya`}>
                                                            <div
                                                                onClick={() => setShowTags(true)}
                                                                className="text-xs bg-indigo-500 dark:bg-indigo-700 text-white px-2 py-1 rounded-md w-[75px] truncate cursor-pointer">
                                                                {subKegiatan?.tag_sumber_dana?.length - 2} Lainnya
                                                            </div>
                                                        </Tippy>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {subKegiatan?.tag_sumber_dana?.map((tag: any, index: any) => (
                                                    <Tippy content={`Sumber Dana ${tag?.tag_name}`}>
                                                        <div onClick={() => setShowTags(false)} className="text-xs bg-indigo-500 dark:bg-indigo-700 text-white px-2 py-1 rounded-md cursor-pointer whitespace-nowrap">
                                                            {tag?.tag_name}
                                                        </div>
                                                    </Tippy>
                                                ))}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
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

                            {/* {subKegiatan?.status === 'verified' && (
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
                                                        pathname: `/realisasi/${subKegiatanId}`,
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
                                                pathname: `/realisasi/${subKegiatanId}`,
                                                query: {
                                                    periode: periode,
                                                    year: year,
                                                    month: month,
                                                },
                                            });
                                        }
                                    }}
                                    className='btn btn-sm flex whitespace-nowrap dark:border-indigo-900 dark:shadow-black-dark-light bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-500 dark:hover:bg-indigo-800 text-white cursor-pointer'>
                                    <FontAwesomeIcon icon={faArrowRightToBracket} className='mr-2 w-4 h-4' />
                                    Buka Realisasi
                                </div>
                            )} */}



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
                                                <button
                                                    onClick={(e) => {
                                                        setMonth(parseInt(month) - 1);
                                                    }}
                                                    className='flex items-center'>
                                                    <FontAwesomeIcon icon={faArrowRightToBracket} className='mr-2 w-4 h-4 flex-none -scale-x-100' />
                                                    <span>
                                                        Target {new Date(year, month - 2).toLocaleString('id-ID', { month: 'long' })}
                                                    </span>
                                                </button>
                                            </li>
                                        )}
                                        {month < 12 && (
                                            <li>
                                                <button
                                                    onClick={(e) => {
                                                        setMonth(parseInt(month) + 1);
                                                    }}
                                                    className='flex items-center'>
                                                    <FontAwesomeIcon icon={faArrowRightToBracket} className='mr-2 w-4 h-4 flex-none' />
                                                    <span>
                                                        Target {new Date(year, month).toLocaleString('id-ID', { month: 'long' })}
                                                    </span>
                                                </button>
                                            </li>
                                        )}
                                        {subKegiatan?.status === 'verified' && (
                                            <li>
                                                <a href={`/realisasi/${subKegiatanId}?periode=${periode}&year=${year}&month=${month}`} className='flex items-center'>
                                                    <FontAwesomeIcon icon={faLink} className='mr-2 w-4 h-4 flex-none -scale-x-100' />
                                                    <span>
                                                        Buka Realisasi
                                                    </span>
                                                </a>
                                            </li>
                                        )}
                                    </ul>
                                </Dropdown>
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
                        </div>
                    </div>
                </div>
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
                                                                                        {log?.created_by_name}
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
                                            {[1, 2, 9].includes(CurrentUser?.role_id) && (
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

                                            {[1, 2, 3, 4, 5, 6, 7, 8].includes(CurrentUser?.role_id) && (
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

};

export default Index;
