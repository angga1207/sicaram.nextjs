import { useEffect, useState, Fragment, useRef } from 'react';
import { Tab } from '@headlessui/react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Select from 'react-select';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faTimes, faCog, faAngleDoubleDown, faTrashAlt, faCaretDown, faAngleDoubleUp, faExclamationTriangle, faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import IconX from '@/components/Icon/IconX';
import Page403 from '@/components/Layouts/Page403';
import { getDetail, getIndex, update } from '@/apis/realisasi_tujuan_sasaran';
import IconLoader from '@/components/Icon/IconLoader';

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

const Index = () => {
    const dispatch = useDispatch();
    const ref = useRef<any>(null);

    useEffect(() => {
        dispatch(setPageTitle('Realisasi Tujuan & Sasaran Kabupaten Ogan Ilir'));
    });

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
    const route = useRouter();

    const [periode, setPeriode] = useState<number>(1);

    const [months, setMonths] = useState([
        {
            id: 1,
            label: 'Januari',
            value: 1,
        },
        {
            id: 2,
            label: 'Februari',
            value: 2,
        },
        {
            id: 3,
            label: 'Maret',
            value: 3,
        },
        {
            id: 4,
            label: 'April',
            value: 4,
        },
        {
            id: 5,
            label: 'Mei',
            value: 5,
        },
        {
            id: 6,
            label: 'Juni',
            value: 6,
        },
        {
            id: 7,
            label: 'Juli',
            value: 7,
        },
        {
            id: 8,
            label: 'Agustus',
            value: 8,
        },
        {
            id: 9,
            label: 'September',
            value: 9,
        },
        {
            id: 10,
            label: 'Oktober',
            value: 10,
        },
        {
            id: 11,
            label: 'November',
            value: 11,
        },
        {
            id: 12,
            label: 'Desember',
            value: 12,
        },
    ]);
    const [years, setYears] = useState<any>([]);
    const [year, setYear] = useState<any>(new Date().getFullYear())
    const [datas, setDatas] = useState<any>([]);
    const [isLoadingData, setIsLoadingData] = useState<boolean>(true)


    useEffect(() => {
        if (isMounted) {
            setIsLoadingData(true)
            setYears([]);
            const currentYear = year ?? new Date().getFullYear();
            if (year > 2022 && year < 2026) {
                for (let i = currentYear - 1; i < currentYear + 2; i++) {
                    setYears((years: any) => [
                        ...years,
                        {
                            label: i,
                            value: i,
                        },
                    ]);
                }
            }
        }
    }, [isMounted, year])

    useEffect(() => {
        if (isMounted) {
            setIsLoadingData(true)
            setDatas([]);
            getIndex(periode, year, null).then((data: any) => {
                if (data.status === 'success') {
                    setDatas(data.data);
                }
                setIsLoadingData(false)
            })
        }
    }, [isMounted, year])


    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const [collapsedId, setCollapsedId] = useState<any>(null);

    const collapseSasaran = (id: any) => {
        if (collapsedId === id) {
            setIsCollapsed(false)
            setCollapsedId(null)
        } else {
            setIsCollapsed(true);
            setCollapsedId(id);
        }
    }

    const [modalInput, setModalInput] = useState<boolean>(false);
    const [saveLoading, setSaveLoading] = useState<boolean>(false);
    const [safeToSave, setSafeToSave] = useState<boolean>(false);
    const [dataInput, setDataInput] = useState<any>({
        inputType: 'tujuan',
        id: '',
    });

    const closeModalInput = () => {
        setModalInput(false)
        setDataInput({
            inputType: 'tujuan',
            id: '',
        });
        setSafeToSave(false)
    }

    const editTujuan = (id: any, ref_id: any, month: number) => {
        setModalInput(true);
        setSafeToSave(false)
        setDataInput({
            inputType: 'tujuan',
            id: id,
        });

        getDetail('tujuan', id, ref_id, year, month, periode, null).then((data: any) => {
            if (data?.status == 'success') {
                setDataInput({
                    inputType: 'tujuan',
                    id: data?.data?.tujuan_id ?? id,
                    realisasi_id: data?.data?.realisasi_id,
                    tujuan_name: data?.data?.tujuan_name,
                    ref_id: data?.data?.ref_id,
                    indikator: data?.data?.indikator,
                    year: data?.data?.year,
                    month: data?.data?.month,
                    periode_id: data?.data?.periode_id,
                    target_tahunan: data?.data?.target_tahunan,
                    target: data?.data?.target,
                    realisasiValue: data?.data?.realisasiValue,
                    realisasiKeterangan: data?.data?.realisasiKeterangan,
                    realisasiFiles: data?.data?.realisasiFiles,
                });
                setSafeToSave(true)
            }
        })
    }

    const editSasaran = (id: any, ref_id: any, month: number) => {
        setModalInput(true);
        setSafeToSave(false)
        setDataInput({
            inputType: 'sasaran',
            id: id,
        });
        getDetail('sasaran', id, ref_id, year, month, periode, null).then((data: any) => {
            if (data?.status == 'success') {
                setDataInput({
                    inputType: 'sasaran',
                    id: data?.data?.sasaran_id ?? id,
                    realisasi_id: data?.data?.realisasi_id,
                    sasaran_name: data?.data?.sasaran_name,
                    tujuan_id: data?.data?.tujuan_id,
                    tujuan_name: data?.data?.tujuan_name,
                    ref_id: data?.data?.ref_id,
                    indikator: data?.data?.indikator,
                    year: data?.data?.year,
                    month: data?.data?.month,
                    periode_id: data?.data?.periode_id,
                    target_tahunan: data?.data?.target_tahunan,
                    target: data?.data?.target,
                    realisasiValue: data?.data?.realisasiValue,
                    realisasiKeterangan: data?.data?.realisasiKeterangan,
                    realisasiFiles: data?.data?.realisasiFiles,
                });
                setSafeToSave(true)
            }
        })
    }

    const save = () => {
        if (safeToSave) {
            update(dataInput).then((res: any) => {
                if (res?.status === 'success') {
                    showAlert('success', res?.message);

                    if (isMounted) {
                        getIndex(periode, year, null).then((data: any) => {
                            if (data.status === 'success') {
                                setDatas(data.data);
                            }
                        })
                    }
                }
            })
        } else {
            showAlert('info', 'Mohon Tunggu Beberapa Saat!');
            return;
        }
    }


    if (CurrentUser?.role_id && [1, 2, 3, 6].includes(CurrentUser?.role_id)) {
        return (
            <>

                <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5 px-5">
                    <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                        Realisasi Tujuan & Sasaran Kabupaten Tahun {year}
                    </h2>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <div className="btn btn-outline-dark w-8 h-8 p-0 rounded-full cursor-pointer"

                            onClick={(e) => {
                                e.preventDefault();
                                if (isLoadingData === false) {
                                    if (year > 2022) {
                                        setYear(year - 1)
                                    }
                                }
                            }}>
                            <FontAwesomeIcon icon={faCaretLeft} className='w-4 h-4' />
                        </div>
                        <div className="grow">
                            <Select
                                required={true}
                                value={years.filter((item: any) => item.value === year)[0]}
                                onChange={(e: any) => {
                                    setYear(e.value)
                                }}
                                isDisabled={isLoadingData}
                                placeholder="Pilih Tahun"
                                options={years} />
                        </div>
                        <div className="btn btn-outline-dark w-8 h-8 p-0 rounded-full cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault();
                                if (isLoadingData === false) {
                                    if (year < 2026) {
                                        setYear(year + 1)
                                    }
                                }
                            }}>
                            <FontAwesomeIcon icon={faCaretRight} className='w-4 h-4' />
                        </div>

                    </div>
                </div>

                <div className="panel">
                    <div className="table-responsive h-[calc(100vh-200px)] pb-10">
                        <table className="table">
                            <thead className='sticky top-0 left-0'>
                                <tr className='!bg-dark text-white'>
                                    <th className='!w-[10px] text-center border' rowSpan={2} colSpan={1}>#</th>
                                    <th rowSpan={2} colSpan={1} className='text-center border min-w-[300px]'>
                                        <span>
                                            Tujuan
                                        </span>
                                        {isCollapsed && (
                                            <span className='text-xs font-normal'>
                                                &nbsp; / Sasaran
                                            </span>
                                        )}
                                    </th>
                                    <th rowSpan={2} colSpan={1} className='text-center border min-w-[300px]'>
                                        Indikator
                                    </th>
                                    <th rowSpan={2} colSpan={1} className='!w-[125px] text-center border text-xs bg-indigo-100 text-dark'>
                                        Target Tahunan
                                    </th>
                                    <th rowSpan={2} colSpan={1} className='!w-[125px] text-center border text-xs'>
                                        Target / Realisasi
                                    </th>
                                    <th colSpan={12} rowSpan={1} className='text-center border !w-[500px]'>
                                        Bulan
                                    </th>
                                    <th className='!min-w-[100px] border' rowSpan={2} colSpan={1}>
                                        <div className="flex items-center justify-center ">
                                            <FontAwesomeIcon icon={faCog} className="w-5 h-5" />
                                        </div>
                                    </th>
                                </tr>
                                <tr className='!bg-dark text-white'>

                                    {months?.map((month: any) => (
                                        <th className='min-w-[125px] text-center border text-xs'>
                                            {month?.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>

                                {datas?.length === 0 && (
                                    <>
                                        <tr>
                                            <td colSpan={100}>
                                                <div className="w-full h-16 bg-slate-100 animate-pulse"></div>
                                            </td>
                                        </tr>
                                    </>
                                )}

                                {datas?.map((item: any, index: number) => (
                                    <>
                                        <tr className={(isCollapsed && collapsedId === item?.id) ? 'border bg-slate-100' : 'border'}>
                                            <td rowSpan={2 * item.indikator_tujuan.length} className='border text-center'>
                                                {index + 1}
                                            </td>
                                            <td rowSpan={2 * item.indikator_tujuan.length} className='border font-semibold'>
                                                <div>
                                                    {item?.tujuan}
                                                </div>

                                                <div className="flex items-center gap-3 mt-3">
                                                    <button type="button"
                                                        onClick={() => collapseSasaran(item.id)}
                                                        className='text-xs font-normal'
                                                    >
                                                        {(isCollapsed && collapsedId === item?.id) ? '[Tutup Sasaran]' : '[Buka Sasaran]'}
                                                    </button>
                                                </div>
                                            </td>
                                            <td rowSpan={2} className='border font-semibold'>
                                                {item?.indikator_tujuan[0]?.name ?? '-'}
                                            </td>
                                            <td rowSpan={2} className='text-center border font-semibold'>
                                                {item?.indikator_tujuan[0]?.target?.target ?? '-'}
                                            </td>

                                            <td className='bg-slate-100 border font-semibold'>
                                                Target
                                            </td>

                                            <td className='bg-slate-100 text-center'>
                                                {item?.indikator_tujuan[0]?.target?.month_1 ?? '-'}
                                            </td>

                                            <td className='bg-slate-100 text-center'>
                                                {item?.indikator_tujuan[0]?.target?.month_2 ?? '-'}
                                            </td>

                                            <td className='bg-slate-100 text-center'>
                                                {item?.indikator_tujuan[0]?.target?.month_3 ?? '-'}
                                            </td>

                                            <td className='bg-slate-100 text-center'>
                                                {item?.indikator_tujuan[0]?.target?.month_4 ?? '-'}
                                            </td>

                                            <td className='bg-slate-100 text-center'>
                                                {item?.indikator_tujuan[0]?.target?.month_5 ?? '-'}
                                            </td>

                                            <td className='bg-slate-100 text-center'>
                                                {item?.indikator_tujuan[0]?.target?.month_6 ?? '-'}
                                            </td>

                                            <td className='bg-slate-100 text-center'>
                                                {item?.indikator_tujuan[0]?.target?.month_7 ?? '-'}
                                            </td>

                                            <td className='bg-slate-100 text-center'>
                                                {item?.indikator_tujuan[0]?.target?.month_8 ?? '-'}
                                            </td>

                                            <td className='bg-slate-100 text-center'>
                                                {item?.indikator_tujuan[0]?.target?.month_9 ?? '-'}
                                            </td>

                                            <td className='bg-slate-100 text-center'>
                                                {item?.indikator_tujuan[0]?.target?.month_10 ?? '-'}
                                            </td>

                                            <td className='bg-slate-100 text-center'>
                                                {item?.indikator_tujuan[0]?.target?.month_11 ?? '-'}
                                            </td>

                                            <td className='bg-slate-100 text-center'>
                                                {item?.indikator_tujuan[0]?.target?.month_12 ?? '-'}
                                            </td>

                                            {/* Menu */}
                                            <td rowSpan={2 * item.indikator_tujuan.length} className='border font-semibold'>
                                                <div className="flex justify-center items-center gap-3">
                                                    <Tippy content={(isCollapsed && collapsedId === item?.id) ? "Tutup Sasaran" : "Buka Sasaran"}>
                                                        <button type="button"
                                                            onClick={() => collapseSasaran(item.id)}
                                                        >
                                                            <FontAwesomeIcon icon={faAngleDoubleDown}
                                                                className={(isCollapsed && collapsedId === item?.id) ? 'w-4 h-4 text-secondary transition-all duration-400 rotate-180' : 'w-4 h-4 text-secondary transition-all duration-400'}
                                                            />
                                                        </button>
                                                    </Tippy>
                                                </div>
                                            </td>

                                        </tr>
                                        <tr className='border bg-green-100 hover:bg-green-300'>

                                            <td className='border font-semibold'>
                                                Realisasi
                                            </td>

                                            {months?.map((month: any) => (
                                                <td className='border-x border-y-2 border-dashed'>
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div>
                                                            {month.value == 1 && (
                                                                <>
                                                                    {item?.indikator_tujuan[0]?.realisasi?.realisasi_1 ?? '-'}
                                                                </>
                                                            )}
                                                            {month.value == 2 && (
                                                                <>
                                                                    {item?.indikator_tujuan[0]?.realisasi?.realisasi_2 ?? '-'}
                                                                </>
                                                            )}
                                                            {month.value == 3 && (
                                                                <>
                                                                    {item?.indikator_tujuan[0]?.realisasi?.realisasi_3 ?? '-'}
                                                                </>
                                                            )}
                                                            {month.value == 4 && (
                                                                <>
                                                                    {item?.indikator_tujuan[0]?.realisasi?.realisasi_4 ?? '-'}
                                                                </>
                                                            )}
                                                            {month.value == 5 && (
                                                                <>
                                                                    {item?.indikator_tujuan[0]?.realisasi?.realisasi_5 ?? '-'}
                                                                </>
                                                            )}
                                                            {month.value == 6 && (
                                                                <>
                                                                    {item?.indikator_tujuan[0]?.realisasi?.realisasi_6 ?? '-'}
                                                                </>
                                                            )}
                                                            {month.value == 7 && (
                                                                <>
                                                                    {item?.indikator_tujuan[0]?.realisasi?.realisasi_7 ?? '-'}
                                                                </>
                                                            )}
                                                            {month.value == 8 && (
                                                                <>
                                                                    {item?.indikator_tujuan[0]?.realisasi?.realisasi_8 ?? '-'}
                                                                </>
                                                            )}
                                                            {month.value == 9 && (
                                                                <>
                                                                    {item?.indikator_tujuan[0]?.realisasi?.realisasi_9 ?? '-'}
                                                                </>
                                                            )}
                                                            {month.value == 10 && (
                                                                <>
                                                                    {item?.indikator_tujuan[0]?.realisasi?.realisasi_10 ?? '-'}
                                                                </>
                                                            )}
                                                            {month.value == 11 && (
                                                                <>
                                                                    {item?.indikator_tujuan[0]?.realisasi?.realisasi_11 ?? '-'}
                                                                </>
                                                            )}
                                                            {month.value == 12 && (
                                                                <>
                                                                    {item?.indikator_tujuan[0]?.realisasi?.realisasi_12 ?? '-'}
                                                                </>
                                                            )}
                                                        </div>
                                                        {item?.indikator_tujuan[0]?.id_ref ? (
                                                            <div className="">
                                                                <Tippy content={`Edit Realisasi Bulan ${month?.label}`}>
                                                                    <button type="button"
                                                                        onClick={() => editTujuan(item.id, item?.indikator_tujuan[0]?.id_ref, month?.value)}
                                                                    >
                                                                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-primary" />
                                                                    </button>
                                                                </Tippy>
                                                            </div>
                                                        ) : (<></>)}
                                                    </div>
                                                </td>
                                            ))}

                                        </tr>


                                        {item?.indikator_tujuan?.map((ind: any, key: number) => (
                                            <>
                                                {key > 0 && (
                                                    <>
                                                        <tr className={(isCollapsed && collapsedId === item?.id) ? 'border bg-slate-100' : 'border'}>
                                                            <td rowSpan={2} className='border font-semibold'>
                                                                {ind?.name}
                                                            </td>
                                                            <td rowSpan={2} className='font-semibold'>
                                                                {ind?.target?.target}
                                                            </td>

                                                            <td className='bg-slate-100 font-semibold'>
                                                                Target
                                                            </td>

                                                            <td className='bg-slate-100 text-center'>
                                                                {ind?.target?.month_1 ?? '-'}
                                                            </td>

                                                            <td className='bg-slate-100 text-center'>
                                                                {ind?.target?.month_2 ?? '-'}
                                                            </td>

                                                            <td className='bg-slate-100 text-center'>
                                                                {ind?.target?.month_3 ?? '-'}
                                                            </td>

                                                            <td className='bg-slate-100 text-center'>
                                                                {ind?.target?.month_4 ?? '-'}
                                                            </td>

                                                            <td className='bg-slate-100 text-center'>
                                                                {ind?.target?.month_5 ?? '-'}
                                                            </td>

                                                            <td className='bg-slate-100 text-center'>
                                                                {ind?.target?.month_6 ?? '-'}
                                                            </td>

                                                            <td className='bg-slate-100 text-center'>
                                                                {ind?.target?.month_7 ?? '-'}
                                                            </td>

                                                            <td className='bg-slate-100 text-center'>
                                                                {ind?.target?.month_8 ?? '-'}
                                                            </td>

                                                            <td className='bg-slate-100 text-center'>
                                                                {ind?.target?.month_9 ?? '-'}
                                                            </td>

                                                            <td className='bg-slate-100 text-center'>
                                                                {ind?.target?.month_10 ?? '-'}
                                                            </td>

                                                            <td className='bg-slate-100 text-center'>
                                                                {ind?.target?.month_11 ?? '-'}
                                                            </td>

                                                            <td className='bg-slate-100 text-center'>
                                                                {ind?.target?.month_12 ?? '-'}
                                                            </td>

                                                        </tr>
                                                        <tr className='border bg-green-100 hover:bg-green-300'>
                                                            <td className='font-semibold'>
                                                                Realisasi
                                                            </td>

                                                            {months?.map((month: any) => (
                                                                <td className='border-x border-b-2 border-dashed'>
                                                                    <div className="flex flex-col items-center gap-3">
                                                                        <div>
                                                                            {month.value == 1 && (
                                                                                <>
                                                                                    {ind?.realisasi?.realisasi_1 ?? '-'}
                                                                                </>
                                                                            )}
                                                                            {month.value == 2 && (
                                                                                <>
                                                                                    {ind?.realisasi?.realisasi_2 ?? '-'}
                                                                                </>
                                                                            )}
                                                                            {month.value == 3 && (
                                                                                <>
                                                                                    {ind?.realisasi?.realisasi_3 ?? '-'}
                                                                                </>
                                                                            )}
                                                                            {month.value == 4 && (
                                                                                <>
                                                                                    {ind?.realisasi?.realisasi_4 ?? '-'}
                                                                                </>
                                                                            )}
                                                                            {month.value == 5 && (
                                                                                <>
                                                                                    {ind?.realisasi?.realisasi_5 ?? '-'}
                                                                                </>
                                                                            )}
                                                                            {month.value == 6 && (
                                                                                <>
                                                                                    {ind?.realisasi?.realisasi_6 ?? '-'}
                                                                                </>
                                                                            )}
                                                                            {month.value == 7 && (
                                                                                <>
                                                                                    {ind?.realisasi?.realisasi_7 ?? '-'}
                                                                                </>
                                                                            )}
                                                                            {month.value == 8 && (
                                                                                <>
                                                                                    {ind?.realisasi?.realisasi_8 ?? '-'}
                                                                                </>
                                                                            )}
                                                                            {month.value == 9 && (
                                                                                <>
                                                                                    {ind?.realisasi?.realisasi_9 ?? '-'}
                                                                                </>
                                                                            )}
                                                                            {month.value == 10 && (
                                                                                <>
                                                                                    {ind?.realisasi?.realisasi_10 ?? '-'}
                                                                                </>
                                                                            )}
                                                                            {month.value == 11 && (
                                                                                <>
                                                                                    {ind?.realisasi?.realisasi_11 ?? '-'}
                                                                                </>
                                                                            )}
                                                                            {month.value == 12 && (
                                                                                <>
                                                                                    {ind?.realisasi?.realisasi_12 ?? '-'}
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                        {ind?.id_ref ? (
                                                                            <div className="">
                                                                                <Tippy content={`Edit Realisasi Bulan ${month?.label}`}>
                                                                                    <button type="button"
                                                                                        onClick={() => editTujuan(item.id, ind?.id_ref, month?.value)}
                                                                                    >
                                                                                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-primary" />
                                                                                    </button>
                                                                                </Tippy>
                                                                            </div>
                                                                        ) : (<></>)}
                                                                    </div>
                                                                </td>
                                                            ))}

                                                        </tr>
                                                    </>
                                                )}
                                            </>
                                        ))}


                                        {(isCollapsed && collapsedId == item?.id) && (
                                            <>
                                                {item?.sasaran?.length == 0 && (
                                                    <tr className='border bg-slate-100'>
                                                        <td colSpan={100} className='text-center'>
                                                            <div className="flex items-center justify-center gap-1">
                                                                <FontAwesomeIcon icon={faExclamationTriangle} className='w-4 h-4 text-warning' />
                                                                <span className='text-base font-semibold'>
                                                                    Tidak Ada Sasaran
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}


                                                {item?.sasaran?.map((sas: any, indSas: number) => (
                                                    <>
                                                        <tr className='border bg-slate-100'>
                                                            <td rowSpan={2 * sas.indikator_sasaran.length} className='border text-center'>
                                                                #
                                                            </td>
                                                            <td rowSpan={2 * sas.indikator_sasaran.length} className='border'>
                                                                <div className="ps-3">
                                                                    {sas?.sasaran}
                                                                </div>
                                                            </td>
                                                            <td rowSpan={2} className='border'>
                                                                {sas?.indikator_sasaran[0]?.name ?? '-'}
                                                            </td>
                                                            <td rowSpan={2} className='text-center'>
                                                                {sas?.indikator_sasaran[0]?.target?.target ?? '-'}
                                                            </td>

                                                            <td className='bg-slate-50 border'>
                                                                Target
                                                            </td>

                                                            <td className='bg-slate-50 text-center'>
                                                                {sas?.indikator_sasaran[0]?.target?.month_1 ?? '-'}
                                                            </td>

                                                            <td className='bg-slate-50 text-center'>
                                                                {sas?.indikator_sasaran[0]?.target?.month_2 ?? '-'}
                                                            </td>

                                                            <td className='bg-slate-50 text-center'>
                                                                {sas?.indikator_sasaran[0]?.target?.month_3 ?? '-'}
                                                            </td>

                                                            <td className='bg-slate-50 text-center'>
                                                                {sas?.indikator_sasaran[0]?.target?.month_4 ?? '-'}
                                                            </td>

                                                            <td className='bg-slate-50 text-center'>
                                                                {sas?.indikator_sasaran[0]?.target?.month_5 ?? '-'}
                                                            </td>

                                                            <td className='bg-slate-50 text-center'>
                                                                {sas?.indikator_sasaran[0]?.target?.month_6 ?? '-'}
                                                            </td>

                                                            <td className='bg-slate-50 text-center'>
                                                                {sas?.indikator_sasaran[0]?.target?.month_7 ?? '-'}
                                                            </td>

                                                            <td className='bg-slate-50 text-center'>
                                                                {sas?.indikator_sasaran[0]?.target?.month_8 ?? '-'}
                                                            </td>

                                                            <td className='bg-slate-50 text-center'>
                                                                {sas?.indikator_sasaran[0]?.target?.month_9 ?? '-'}
                                                            </td>

                                                            <td className='bg-slate-50 text-center'>
                                                                {sas?.indikator_sasaran[0]?.target?.month_10 ?? '-'}
                                                            </td>

                                                            <td className='bg-slate-50 text-center'>
                                                                {sas?.indikator_sasaran[0]?.target?.month_11 ?? '-'}
                                                            </td>

                                                            <td className='bg-slate-50 text-center'>
                                                                {sas?.indikator_sasaran[0]?.target?.month_12 ?? '-'}
                                                            </td>

                                                            {/* Menu */}
                                                            <td rowSpan={2 * sas.indikator_sasaran.length} className='border font-semibold'>
                                                                {/* <div className="flex justify-center items-center gap-3">
                                                                    <Tippy content="Edit Sasaran">
                                                                        <button type="button"
                                                                            onClick={() => editSasaran(sas.id)}
                                                                        >
                                                                            <FontAwesomeIcon icon={faEdit} className="w-4 h-4 text-primary" />
                                                                        </button>
                                                                    </Tippy>
                                                                </div> */}
                                                            </td>

                                                        </tr>

                                                        <tr className='border bg-green-50 hover:bg-green-200'>

                                                            <td className='border'>
                                                                Realisasi
                                                            </td>

                                                            {months?.map((month: any) => (
                                                                <td className='border'>

                                                                    <div className="flex flex-col items-center gap-3">
                                                                        <div>

                                                                            {month.value == 1 && (
                                                                                <>
                                                                                    {sas?.indikator_sasaran[0]?.realisasi?.realisasi_1 ?? '-'}
                                                                                </>
                                                                            )}

                                                                            {month.value == 2 && (
                                                                                <>
                                                                                    {sas?.indikator_sasaran[0]?.realisasi?.realisasi_2 ?? '-'}
                                                                                </>
                                                                            )}

                                                                            {month.value == 3 && (
                                                                                <>
                                                                                    {sas?.indikator_sasaran[0]?.realisasi?.realisasi_3 ?? '-'}
                                                                                </>
                                                                            )}

                                                                            {month.value == 4 && (
                                                                                <>
                                                                                    {sas?.indikator_sasaran[0]?.realisasi?.realisasi_4 ?? '-'}
                                                                                </>
                                                                            )}

                                                                            {month.value == 5 && (
                                                                                <>
                                                                                    {sas?.indikator_sasaran[0]?.realisasi?.realisasi_5 ?? '-'}
                                                                                </>
                                                                            )}

                                                                            {month.value == 6 && (
                                                                                <>
                                                                                    {sas?.indikator_sasaran[0]?.realisasi?.realisasi_6 ?? '-'}
                                                                                </>
                                                                            )}

                                                                            {month.value == 7 && (
                                                                                <>
                                                                                    {sas?.indikator_sasaran[0]?.realisasi?.realisasi_7 ?? '-'}
                                                                                </>
                                                                            )}

                                                                            {month.value == 8 && (
                                                                                <>
                                                                                    {sas?.indikator_sasaran[0]?.realisasi?.realisasi_8 ?? '-'}
                                                                                </>
                                                                            )}

                                                                            {month.value == 9 && (
                                                                                <>
                                                                                    {sas?.indikator_sasaran[0]?.realisasi?.realisasi_9 ?? '-'}
                                                                                </>
                                                                            )}

                                                                            {month.value == 10 && (
                                                                                <>
                                                                                    {sas?.indikator_sasaran[0]?.realisasi?.realisasi_10 ?? '-'}
                                                                                </>
                                                                            )}

                                                                            {month.value == 11 && (
                                                                                <>
                                                                                    {sas?.indikator_sasaran[0]?.realisasi?.realisasi_11 ?? '-'}
                                                                                </>
                                                                            )}

                                                                            {month.value == 12 && (
                                                                                <>
                                                                                    {sas?.indikator_sasaran[0]?.realisasi?.realisasi_12 ?? '-'}
                                                                                </>
                                                                            )}


                                                                        </div>
                                                                        {sas?.indikator_sasaran[0]?.id_ref ? (
                                                                            <div className="">
                                                                                <Tippy content={`Edit Realisasi Bulan ${month.label}`}>
                                                                                    <button type="button"
                                                                                        onClick={() => editSasaran(sas.id, sas?.indikator_sasaran[0]?.id_ref, month?.value)}
                                                                                    >
                                                                                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-primary" />
                                                                                    </button>
                                                                                </Tippy>
                                                                            </div>
                                                                        ) : (<></>)}
                                                                    </div>

                                                                </td>
                                                            ))}

                                                        </tr>



                                                        {sas?.indikator_sasaran?.map((ind: any, key: number) => (
                                                            <>
                                                                {key > 0 && (
                                                                    <>
                                                                        <tr className='border bg-slate-100'>
                                                                            <td rowSpan={2} className='border'>
                                                                                {ind?.name}
                                                                            </td>
                                                                            <td rowSpan={2}>
                                                                                {ind?.target?.target}
                                                                            </td>

                                                                            <td className='bg-slate-50 text-center'>
                                                                                Target
                                                                            </td>

                                                                            <td className='bg-slate-50 text-center'>
                                                                                {ind?.target?.month_1 ?? '-'}
                                                                            </td>

                                                                            <td className='bg-slate-50 text-center'>
                                                                                {ind?.target?.month_2 ?? '-'}
                                                                            </td>

                                                                            <td className='bg-slate-50 text-center'>
                                                                                {ind?.target?.month_3 ?? '-'}
                                                                            </td>

                                                                            <td className='bg-slate-50 text-center'>
                                                                                {ind?.target?.month_4 ?? '-'}
                                                                            </td>

                                                                            <td className='bg-slate-50 text-center'>
                                                                                {ind?.target?.month_5 ?? '-'}
                                                                            </td>

                                                                            <td className='bg-slate-50 text-center'>
                                                                                {ind?.target?.month_6 ?? '-'}
                                                                            </td>

                                                                            <td className='bg-slate-50 text-center'>
                                                                                {ind?.target?.month_7 ?? '-'}
                                                                            </td>

                                                                            <td className='bg-slate-50 text-center'>
                                                                                {ind?.target?.month_8 ?? '-'}
                                                                            </td>

                                                                            <td className='bg-slate-50 text-center'>
                                                                                {ind?.target?.month_9 ?? '-'}
                                                                            </td>

                                                                            <td className='bg-slate-50 text-center'>
                                                                                {ind?.target?.month_10 ?? '-'}
                                                                            </td>

                                                                            <td className='bg-slate-50 text-center'>
                                                                                {ind?.target?.month_11 ?? '-'}
                                                                            </td>

                                                                            <td className='bg-slate-50 text-center'>
                                                                                {ind?.target?.month_12 ?? '-'}
                                                                            </td>

                                                                        </tr>
                                                                        <tr className='border bg-green-50 hover:bg-green-200'>
                                                                            <td className='border'>
                                                                                Realisasi
                                                                            </td>

                                                                            {months?.map((month: any) => (
                                                                                <td className='border'>

                                                                                    <div className="flex flex-col items-center gap-3">
                                                                                        <div>

                                                                                            {month.value == 1 && (
                                                                                                <>
                                                                                                    {ind?.realisasi?.realisasi_1 ?? '-'}
                                                                                                </>
                                                                                            )}

                                                                                            {month.value == 2 && (
                                                                                                <>
                                                                                                    {ind?.realisasi?.realisasi_2 ?? '-'}
                                                                                                </>
                                                                                            )}

                                                                                            {month.value == 3 && (
                                                                                                <>
                                                                                                    {ind?.realisasi?.realisasi_3 ?? '-'}
                                                                                                </>
                                                                                            )}

                                                                                            {month.value == 4 && (
                                                                                                <>
                                                                                                    {ind?.realisasi?.realisasi_4 ?? '-'}
                                                                                                </>
                                                                                            )}

                                                                                            {month.value == 5 && (
                                                                                                <>
                                                                                                    {ind?.realisasi?.realisasi_5 ?? '-'}
                                                                                                </>
                                                                                            )}

                                                                                            {month.value == 6 && (
                                                                                                <>
                                                                                                    {ind?.realisasi?.realisasi_6 ?? '-'}
                                                                                                </>
                                                                                            )}

                                                                                            {month.value == 7 && (
                                                                                                <>
                                                                                                    {ind?.realisasi?.realisasi_7 ?? '-'}
                                                                                                </>
                                                                                            )}

                                                                                            {month.value == 8 && (
                                                                                                <>
                                                                                                    {ind?.realisasi?.realisasi_8 ?? '-'}
                                                                                                </>
                                                                                            )}

                                                                                            {month.value == 9 && (
                                                                                                <>
                                                                                                    {ind?.realisasi?.realisasi_9 ?? '-'}
                                                                                                </>
                                                                                            )}

                                                                                            {month.value == 10 && (
                                                                                                <>
                                                                                                    {ind?.realisasi?.realisasi_10 ?? '-'}
                                                                                                </>
                                                                                            )}

                                                                                            {month.value == 11 && (
                                                                                                <>
                                                                                                    {ind?.realisasi?.realisasi_11 ?? '-'}
                                                                                                </>
                                                                                            )}

                                                                                            {month.value == 12 && (
                                                                                                <>
                                                                                                    {ind?.realisasi?.realisasi_12 ?? '-'}
                                                                                                </>
                                                                                            )}

                                                                                        </div>
                                                                                        {sas?.indikator_sasaran[0]?.id_ref ? (
                                                                                            <div className="">
                                                                                                <Tippy content={`Edit Realisasi Bulan ${month.label}`}>
                                                                                                    <button type="button"
                                                                                                        onClick={() => editSasaran(sas.id, ind?.id_ref, month?.value)}
                                                                                                    >
                                                                                                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-primary" />
                                                                                                    </button>
                                                                                                </Tippy>
                                                                                            </div>
                                                                                        ) : (<></>)}
                                                                                    </div>

                                                                                </td>
                                                                            ))}

                                                                        </tr>
                                                                    </>
                                                                )}
                                                            </>
                                                        ))}

                                                    </>
                                                ))}

                                            </>
                                        )}

                                    </>
                                ))}

                            </tbody>

                        </table >
                    </div>
                </div>


                <Transition appear show={modalInput} as={Fragment}>
                    <Dialog as="div" open={modalInput} onClose={() => closeModalInput()}>
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
                                    <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-[100%] md:max-w-[60%] my-8 text-black dark:text-white-dark">
                                        <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                            <h5 className="font-bold text-lg">
                                                {dataInput.inputType == 'tujuan' ? 'Edit Realisasi Tujuan' : 'Edit Realisasi Sasaran'}
                                            </h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => closeModalInput()}>
                                                <IconX></IconX>
                                            </button>
                                        </div>
                                        <div className="p-5">

                                            <div className="space-y-5">

                                                <div className="">
                                                    <label>
                                                        Tujuan:
                                                    </label>
                                                    <div className="text-lg">
                                                        {safeToSave ? (
                                                            <>
                                                                {dataInput?.tujuan_name}
                                                            </>
                                                        ) : (
                                                            <IconLoader className="animate-spin inline-block align-middle ltr:mr-2 rtl:ml-2 shrink-0" />
                                                        )}
                                                    </div>
                                                </div>

                                                {dataInput?.inputType === 'sasaran' && (
                                                    <div className="">
                                                        <label>
                                                            Sasaran:
                                                        </label>
                                                        <div className="text-lg">
                                                            {safeToSave ? (
                                                                <>
                                                                    {dataInput?.sasaran_name}
                                                                </>
                                                            ) : (
                                                                <IconLoader className="animate-spin inline-block align-middle ltr:mr-2 rtl:ml-2 shrink-0" />
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="grid xl:grid-cols-2 gap-5">
                                                    <div className="">
                                                        <label>
                                                            Indikator:
                                                        </label>
                                                        <div className="text-lg">
                                                            {safeToSave ? (
                                                                <>
                                                                    {dataInput?.indikator}
                                                                </>
                                                            ) : (
                                                                <IconLoader className="animate-spin inline-block align-middle ltr:mr-2 rtl:ml-2 shrink-0" />
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="">
                                                        <label>
                                                            Bulan/Tahun:
                                                        </label>
                                                        <div className="text-lg">
                                                            {safeToSave ? (
                                                                <>
                                                                    {months.filter((item: any, i: any) => item.value == dataInput?.month)[0]?.label}
                                                                </>
                                                            ) : (
                                                                <IconLoader className="animate-spin inline-block align-middle ltr:mr-2 rtl:ml-2 shrink-0" />
                                                            )}
                                                            /
                                                            {safeToSave ? (
                                                                <>
                                                                    {dataInput?.year}
                                                                </>
                                                            ) : (
                                                                <IconLoader className="animate-spin inline-block align-middle ltr:mr-2 rtl:ml-2 shrink-0" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="">
                                                    <label>
                                                        Target:
                                                    </label>
                                                    <div className="grid xl:grid-cols-2 gap-3">
                                                        <div className="rounded border p-4 shadow">
                                                            <div className="underline mb-2">
                                                                Target Tahunan
                                                            </div>
                                                            <div className="text-lg">
                                                                {safeToSave ? (
                                                                    <>
                                                                        {dataInput?.target_tahunan ?? '-'}
                                                                    </>
                                                                ) : (
                                                                    <IconLoader className="animate-spin inline-block align-middle ltr:mr-2 rtl:ml-2 shrink-0" />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="rounded border p-4 shadow">
                                                            <div className="underline mb-2">
                                                                Target {months.filter((item: any, i: any) => item.value == dataInput?.month)[0]?.label}
                                                            </div>
                                                            <div className="text-lg">
                                                                {safeToSave ? (
                                                                    <>
                                                                        {dataInput?.target ?? '-'}
                                                                    </>
                                                                ) : (
                                                                    <IconLoader className="animate-spin inline-block align-middle ltr:mr-2 rtl:ml-2 shrink-0" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="">
                                                    <label htmlFor="realisasi">
                                                        Realisasi:
                                                    </label>
                                                    <input
                                                        id="realisasi"
                                                        type="text"
                                                        placeholder="Nilai Realisasi"
                                                        autoComplete='off'
                                                        disabled={safeToSave == false}
                                                        value={dataInput?.realisasiValue}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const updated = { ...prev };
                                                                updated['realisasiValue'] = e.target.value;
                                                                return updated;
                                                            });
                                                        }}
                                                        className="form-input font-normal text-lg py-4 disabled:bg-slate-100" />
                                                </div>

                                                <div className="">
                                                    <label htmlFor="keterangan">
                                                        Keterangan:
                                                    </label>
                                                    <textarea
                                                        id="keterangan"
                                                        placeholder="Nilai Realisasi"
                                                        disabled={safeToSave == false}
                                                        value={dataInput?.realisasiKeterangan}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const updated = { ...prev };
                                                                updated['realisasiKeterangan'] = e.target.value;
                                                                return updated;
                                                            });
                                                        }}
                                                        className="form-input font-normal text-lg py-4 min-h-[200px] disabled:bg-slate-100"
                                                    ></textarea>
                                                </div>

                                            </div>

                                            {safeToSave ? (
                                                <div className="flex justify-end items-center mt-4">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => closeModalInput()}>
                                                        Batalkan
                                                    </button>

                                                    {saveLoading == false ? (
                                                        <>
                                                            <button type="button" className="btn btn-success ltr:ml-4 rtl:mr-4" onClick={() => save()}>
                                                                Simpan
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button type="button" className="btn btn-success ltr:ml-4 rtl:mr-4 gap-2">
                                                                <div className="w-4 h-4 border-2 border-transparent border-l-white rounded-full animate-spin"></div>
                                                                Menyimpan...
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex justify-end items-center mt-4">
                                                    <IconLoader className="animate-spin inline-block align-middle ltr:mr-2 rtl:ml-2 shrink-0" />
                                                </div>
                                            )}

                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>

            </>
        );
    } else {
        return (
            <Page403 />
        );
    }
};

export default Index;
