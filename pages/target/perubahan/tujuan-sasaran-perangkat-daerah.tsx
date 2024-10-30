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

import { getIndexPerubahan, getDetailPerubahan, updatePerubahan } from '@/apis/target_tujuan_sasaran'
import { fetchInstances } from '@/apis/fetchdata';

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
        dispatch(setPageTitle('Target Perubahan Tujuan & Sasaran Kabupaten Ogan Ilir'));
    });

    const [isMounted, setIsMounted] = useState(false);
    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null)

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [CurrentUser, setCurrentUser] = useState<any>([]);

    const [instance, setInstance] = useState<any>(CurrentUser?.instance_id ?? null);
    const [instances, setInstances] = useState<any>([]);

    useEffect(() => {
        if (document.cookie) {
            let user = document.cookie.split(';').find((row) => row.trim().startsWith('user='))?.split('=')[1];
            user = user ? JSON.parse(user) : null;
            setCurrentUser(user);
            setInstance(CurrentUser?.instance_id ?? null);
        }
        if (isMounted) {
            const localPeriode = localStorage.getItem('periode');
            if (localPeriode) {
                setPeriode(JSON.parse(localPeriode ?? ""));
            }
        }
    }, [isMounted]);

    useEffect(() => {
        if (isMounted && periode?.id) {
            const currentYear = new Date().getFullYear();
            if (periode?.start_year <= currentYear) {
                setYear(currentYear);
            } else {
                setYear(periode?.start_year)
            }
        }
    }, [isMounted, periode?.id])

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
    const [datas, setDatas] = useState<any>([]);
    const [isLoadingData, setIsLoadingData] = useState<boolean>(true)

    useEffect(() => {
        if (isMounted) {
            if (CurrentUser?.role_id !== 9) {
                fetchInstances().then((data: any) => {
                    setInstances(data.data.map((item: any) => {
                        return {
                            value: item.id,
                            label: item.name
                        }
                    }));
                });
            }
        }
    }, [isMounted])

    useEffect(() => {
        if (isMounted) {
            setIsLoadingData(true)
            setYears([]);
            if (periode?.id) {
                if (year >= periode?.start_year && year <= periode?.end_year) {
                    for (let i = periode?.start_year; i <= periode?.end_year; i++) {
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
        }
    }, [isMounted, year, periode?.id])

    useEffect(() => {
        if (isMounted && instance && periode?.id && year) {
            setIsLoadingData(true)
            setDatas([]);
            getIndexPerubahan(periode?.id, year, instance).then((data: any) => {
                if (data.status === 'success') {
                    setDatas(data.data);
                }
                setIsLoadingData(false)
            })
        }
    }, [isMounted, year, instance, periode?.id])


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
        data: [],
    });

    const closeModalInput = () => {
        setModalInput(false)
        setDataInput({
            inputType: 'tujuan',
            id: '',
        });
        setSafeToSave(false)
    }

    const editTujuan = (id: any) => {
        setModalInput(true);
        setSafeToSave(false)
        setDataInput({
            inputType: 'tujuan',
            id: id,
        });
        getDetailPerubahan('tujuan', id, year, periode?.id, instance).then((data: any) => {
            if (data?.status == 'success') {
                setDataInput({
                    inputType: 'tujuan',
                    id: data?.data?.tujuan_id ?? id,
                    data: data?.data?.indikator_tujuan,
                    tujuan: data?.data?.tujuan
                });
                setSafeToSave(true)
            }
        })
    }


    const editSasaran = (id: any) => {
        setModalInput(true);
        setSafeToSave(false)
        setDataInput({
            inputType: 'sasaran',
            id: id,
        });
        getDetailPerubahan('sasaran', id, year, periode?.id, instance).then((data: any) => {
            if (data?.status == 'success') {
                setDataInput({
                    inputType: 'sasaran',
                    id: data?.data?.sasaran_id ?? id,
                    data: data?.data?.indikator_sasaran,
                    tujuan: data?.data?.tujuan,
                    sasaran: data?.data?.sasaran,
                });
                setSafeToSave(true)
            }
        })
    }

    const save = () => {
        if (safeToSave) {
            updatePerubahan(dataInput).then((res: any) => {
                if (res?.status === 'success') {
                    showAlert('success', res?.message);

                    if (isMounted) {
                        getIndexPerubahan(periode?.id, year, instance).then((data: any) => {
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


    if (CurrentUser?.role_id && [1, 2, 3, 6, 9].includes(CurrentUser?.role_id)) {
        return (
            <>

                <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5 px-5">
                    <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                        Target Perubahan Tujuan & Sasaran Perangkat Daerah Tahun {year}
                    </h2>
                    <div className="flex flex-wrap items-center justify-center gap-2">

                        {([1, 2, 3, 4, 5, 6, 7, 8].includes(CurrentUser?.role_id)) && (
                            <div className="relative">
                                <form
                                    className='flex items-center gap-2'>
                                    <Select
                                        placeholder="Pilih Perangkat Daerah"
                                        isSearchable={true}
                                        value={instances?.find((item: any) => item.value === instance) ?? null}
                                        className='w-[300px]'
                                        onChange={(value: any) => {
                                            setInstance(value?.value);
                                        }}
                                        options={instances} />
                                </form>
                            </div>
                        )}

                        {year > periode?.start_year && (
                            <Tippy content="Tahun Sebelumnya" >
                                <div className="btn btn-outline-dark w-8 h-8 p-0 rounded-full cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (isLoadingData === false) {
                                            if (year > periode?.start_year) {
                                                setYear(parseInt(year) - 1)
                                            }
                                        }
                                    }}>
                                    <FontAwesomeIcon icon={faCaretLeft} className='w-4 h-4' />
                                </div>
                            </Tippy>
                        )}

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

                        {year < periode?.end_year && (
                            <Tippy content="Tahun Berikutnya" >
                                <div className="btn btn-outline-dark w-8 h-8 p-0 rounded-full cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (isLoadingData === false) {
                                            if (year < periode?.end_year) {
                                                setYear(parseInt(year) + 1)
                                            }
                                        }
                                    }}>
                                    <FontAwesomeIcon icon={faCaretRight} className='w-4 h-4' />
                                </div>
                            </Tippy>
                        )}

                    </div>
                </div>

                {!instance && (
                    <div className="panel">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-[#3b3f5c] dark:text-white-light">
                                Pilih Perangkat Daerah terlebih dahulu
                            </h2>
                        </div>
                    </div>
                )}

                {instance && (
                    <>
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
                                            <th rowSpan={2} colSpan={1} className='!w-[125px] text-center border text-xs'>
                                                Tahun
                                            </th>
                                            <th rowSpan={2} colSpan={1} className='!w-[125px] text-center border text-xs bg-indigo-100 text-dark'>
                                                Target
                                            </th>
                                            <th colSpan={12} rowSpan={1} className='text-center border !w-[500px]'>
                                                Perubahan Target
                                            </th>
                                            <th className='!w-[100px] border' rowSpan={2} colSpan={1}>
                                                <div className="flex items-center justify-center ">
                                                    <FontAwesomeIcon icon={faCog} className="w-5 h-5" />
                                                </div>
                                            </th>
                                        </tr>
                                        <tr className='!bg-dark text-white'>

                                            {months?.map((month: any) => (
                                                <th className='!w-[125px] text-center border text-xs'>
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
                                                    <td rowSpan={item.indikator_tujuan.length} className='border text-center'>
                                                        {index + 1}
                                                    </td>
                                                    <td rowSpan={item.indikator_tujuan.length} className='border font-semibold'>
                                                        {item?.tujuan}
                                                    </td>
                                                    <td className='border font-semibold'>
                                                        {item?.indikator_tujuan[0]?.name ?? '-'}
                                                    </td>
                                                    <td className='text-center border font-semibold'>
                                                        {year ?? '-'}
                                                    </td>
                                                    <td className='text-center font-semibold border border-dashed bg-indigo-100'>
                                                        {item?.indikator_tujuan[0]?.target?.target ?? '-'}
                                                    </td>
                                                    <td className='text-center font-semibold border border-dashed'>
                                                        {item?.indikator_tujuan[0]?.target?.month_1 ?? '-'}
                                                    </td>
                                                    <td className='text-center font-semibold border border-dashed'>
                                                        {item?.indikator_tujuan[0]?.target?.month_2 ?? '-'}
                                                    </td>
                                                    <td className='text-center font-semibold border border-dashed'>
                                                        {item?.indikator_tujuan[0]?.target?.month_3 ?? '-'}
                                                    </td>
                                                    <td className='text-center font-semibold border border-dashed'>
                                                        {item?.indikator_tujuan[0]?.target?.month_4 ?? '-'}
                                                    </td>
                                                    <td className='text-center font-semibold border border-dashed'>
                                                        {item?.indikator_tujuan[0]?.target?.month_5 ?? '-'}
                                                    </td>
                                                    <td className='text-center font-semibold border border-dashed'>
                                                        {item?.indikator_tujuan[0]?.target?.month_6 ?? '-'}
                                                    </td>
                                                    <td className='text-center font-semibold border border-dashed'>
                                                        {item?.indikator_tujuan[0]?.target?.month_7 ?? '-'}
                                                    </td>
                                                    <td className='text-center font-semibold border border-dashed'>
                                                        {item?.indikator_tujuan[0]?.target?.month_8 ?? '-'}
                                                    </td>
                                                    <td className='text-center font-semibold border border-dashed'>
                                                        {item?.indikator_tujuan[0]?.target?.month_9 ?? '-'}
                                                    </td>
                                                    <td className='text-center font-semibold border border-dashed'>
                                                        {item?.indikator_tujuan[0]?.target?.month_10 ?? '-'}
                                                    </td>
                                                    <td className='text-center font-semibold border border-dashed'>
                                                        {item?.indikator_tujuan[0]?.target?.month_11 ?? '-'}
                                                    </td>
                                                    <td className='text-center font-semibold border border-dashed'>
                                                        {item?.indikator_tujuan[0]?.target?.month_12 ?? '-'}
                                                    </td>
                                                    <td rowSpan={item.indikator_tujuan.length} className='border'>
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
                                                            <Tippy content="Edit Tujuan">
                                                                <button type="button"
                                                                    onClick={() => editTujuan(item.id)}
                                                                >
                                                                    <FontAwesomeIcon icon={faEdit} className="w-4 h-4 text-primary" />
                                                                </button>
                                                            </Tippy>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {item?.indikator_tujuan?.map((ind: any, key: number) => (
                                                    <>
                                                        {key > 0 && (
                                                            <tr className={(isCollapsed && collapsedId === item?.id) ? 'border bg-slate-100' : 'border'}>
                                                                <td className='border font-semibold'>
                                                                    {ind?.name}
                                                                </td>
                                                                <td className='text-center border font-semibold'>
                                                                    {year ?? '-'}
                                                                </td>
                                                                <td className='text-center font-semibold border border-dashed bg-indigo-100'>
                                                                    {ind?.target?.target ?? '-'}
                                                                </td>
                                                                <td className='text-center font-semibold border border-dashed'>
                                                                    {ind?.target?.month_1 ?? '-'}
                                                                </td>
                                                                <td className='text-center font-semibold border border-dashed'>
                                                                    {ind?.target?.month_2 ?? '-'}
                                                                </td>
                                                                <td className='text-center font-semibold border border-dashed'>
                                                                    {ind?.target?.month_3 ?? '-'}
                                                                </td>
                                                                <td className='text-center font-semibold border border-dashed'>
                                                                    {ind?.target?.month_4 ?? '-'}
                                                                </td>
                                                                <td className='text-center font-semibold border border-dashed'>
                                                                    {ind?.target?.month_5 ?? '-'}
                                                                </td>
                                                                <td className='text-center font-semibold border border-dashed'>
                                                                    {ind?.target?.month_6 ?? '-'}
                                                                </td>
                                                                <td className='text-center font-semibold border border-dashed'>
                                                                    {ind?.target?.month_7 ?? '-'}
                                                                </td>
                                                                <td className='text-center font-semibold border border-dashed'>
                                                                    {ind?.target?.month_8 ?? '-'}
                                                                </td>
                                                                <td className='text-center font-semibold border border-dashed'>
                                                                    {ind?.target?.month_9 ?? '-'}
                                                                </td>
                                                                <td className='text-center font-semibold border border-dashed'>
                                                                    {ind?.target?.month_10 ?? '-'}
                                                                </td>
                                                                <td className='text-center font-semibold border border-dashed'>
                                                                    {ind?.target?.month_11 ?? '-'}
                                                                </td>
                                                                <td className='text-center font-semibold border border-dashed'>
                                                                    {ind?.target?.month_12 ?? '-'}
                                                                </td>
                                                            </tr>
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
                                                                    <td rowSpan={sas.indikator_sasaran.length} className='border text-center'>
                                                                        #
                                                                    </td>
                                                                    <td rowSpan={sas.indikator_sasaran.length} className='border'>
                                                                        <div className="ps-3">
                                                                            {sas?.sasaran}
                                                                        </div>
                                                                    </td>
                                                                    <td className='border'>
                                                                        {sas?.indikator_sasaran[0]?.name ?? '-'}
                                                                    </td>
                                                                    <td className='text-center border font-semibold'>
                                                                        {year ?? '-'}
                                                                    </td>
                                                                    <td className='text-center bg-indigo-100'>
                                                                        {sas?.indikator_sasaran[0]?.target?.target ?? '-'}
                                                                    </td>
                                                                    <td className='text-center'>
                                                                        {sas?.indikator_sasaran[0]?.target?.month_1 ?? '-'}
                                                                    </td>
                                                                    <td className='text-center'>
                                                                        {sas?.indikator_sasaran[0]?.target?.month_2 ?? '-'}
                                                                    </td>
                                                                    <td className='text-center'>
                                                                        {sas?.indikator_sasaran[0]?.target?.month_3 ?? '-'}
                                                                    </td>
                                                                    <td className='text-center'>
                                                                        {sas?.indikator_sasaran[0]?.target?.month_4 ?? '-'}
                                                                    </td>
                                                                    <td className='text-center'>
                                                                        {sas?.indikator_sasaran[0]?.target?.month_5 ?? '-'}
                                                                    </td>
                                                                    <td className='text-center'>
                                                                        {sas?.indikator_sasaran[0]?.target?.month_6 ?? '-'}
                                                                    </td>
                                                                    <td className='text-center'>
                                                                        {sas?.indikator_sasaran[0]?.target?.month_7 ?? '-'}
                                                                    </td>
                                                                    <td className='text-center'>
                                                                        {sas?.indikator_sasaran[0]?.target?.month_8 ?? '-'}
                                                                    </td>
                                                                    <td className='text-center'>
                                                                        {sas?.indikator_sasaran[0]?.target?.month_9 ?? '-'}
                                                                    </td>
                                                                    <td className='text-center'>
                                                                        {sas?.indikator_sasaran[0]?.target?.month_10 ?? '-'}
                                                                    </td>
                                                                    <td className='text-center'>
                                                                        {sas?.indikator_sasaran[0]?.target?.month_11 ?? '-'}
                                                                    </td>
                                                                    <td className='text-center'>
                                                                        {sas?.indikator_sasaran[0]?.target?.month_12 ?? '-'}
                                                                    </td>
                                                                    <td rowSpan={sas.indikator_sasaran.length} className='border text-center'>
                                                                        <div className="flex justify-center items-center gap-3">
                                                                            <Tippy content="Edit Sasaran">
                                                                                <button type="button"
                                                                                    onClick={() => editSasaran(sas.id)}
                                                                                >
                                                                                    <FontAwesomeIcon icon={faEdit} className="w-4 h-4 text-info" />
                                                                                </button>
                                                                            </Tippy>
                                                                        </div>
                                                                    </td>
                                                                </tr>


                                                                {sas?.indikator_sasaran?.map((ind: any, key: number) => (
                                                                    <>
                                                                        {key > 0 && (
                                                                            <tr className='border bg-slate-100'>
                                                                                <td className='border'>
                                                                                    {ind?.name}
                                                                                </td>
                                                                                <td className='text-center border font-semibold'>
                                                                                    {year ?? '-'}
                                                                                </td>
                                                                                <td className='text-center bg-indigo-100'>
                                                                                    {ind?.target?.target ?? '-'}
                                                                                </td>
                                                                                <td className='text-center'>
                                                                                    {ind?.target?.month_1 ?? '-'}
                                                                                </td>
                                                                                <td className='text-center'>
                                                                                    {ind?.target?.month_2 ?? '-'}
                                                                                </td>
                                                                                <td className='text-center'>
                                                                                    {ind?.target?.month_3 ?? '-'}
                                                                                </td>
                                                                                <td className='text-center'>
                                                                                    {ind?.target?.month_4 ?? '-'}
                                                                                </td>
                                                                                <td className='text-center'>
                                                                                    {ind?.target?.month_5 ?? '-'}
                                                                                </td>
                                                                                <td className='text-center'>
                                                                                    {ind?.target?.month_6 ?? '-'}
                                                                                </td>
                                                                                <td className='text-center'>
                                                                                    {ind?.target?.month_7 ?? '-'}
                                                                                </td>
                                                                                <td className='text-center'>
                                                                                    {ind?.target?.month_8 ?? '-'}
                                                                                </td>
                                                                                <td className='text-center'>
                                                                                    {ind?.target?.month_9 ?? '-'}
                                                                                </td>
                                                                                <td className='text-center'>
                                                                                    {ind?.target?.month_10 ?? '-'}
                                                                                </td>
                                                                                <td className='text-center'>
                                                                                    {ind?.target?.month_11 ?? '-'}
                                                                                </td>
                                                                                <td className='text-center'>
                                                                                    {ind?.target?.month_12 ?? '-'}
                                                                                </td>
                                                                            </tr>
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

                                </table>
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
                                                        {dataInput.inputType == 'tujuan' ? 'Target Tujuan' : 'Target Sasaran'} {year}
                                                    </h5>
                                                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => closeModalInput()}>
                                                        <IconX></IconX>
                                                    </button>
                                                </div>
                                                <div className="p-5">

                                                    <div className="space-y-5">

                                                        <div className="">
                                                            <div className='underline font-semibold'>
                                                                Tujuan:
                                                            </div>
                                                            {!dataInput?.tujuan && (
                                                                <div className='mt-2 w-100 h-6 bg-slate-200 rounded animate-pulse'>
                                                                </div>
                                                            )}
                                                            <div className="">
                                                                {dataInput?.tujuan}
                                                            </div>
                                                        </div>

                                                        {dataInput.inputType == 'sasaran' && (
                                                            <div className="">
                                                                <div className='underline font-semibold'>
                                                                    Sasaran:
                                                                </div>
                                                                {!dataInput?.sasaran && (
                                                                    <div className='mt-2 w-100 h-6 bg-slate-200 rounded animate-pulse'>
                                                                    </div>
                                                                )}
                                                                <div className="">
                                                                    {dataInput?.sasaran}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="">
                                                            <div className='underline font-semibold'>
                                                                Indikator:
                                                            </div>


                                                            {!dataInput?.data && (
                                                                <div className='mt-2 w-100 h-12 bg-slate-200 rounded animate-pulse'>
                                                                </div>
                                                            )}

                                                            <Tab.Group>
                                                                <Tab.List className="mt-3 flex flex-wrap justify-between space-x-2 rtl:space-x-reverse">

                                                                    {dataInput?.data?.map((item: any, index: number) => (
                                                                        <Tab as={Fragment}>
                                                                            {({ selected }) => (
                                                                                <div className="flex-auto text-center !outline-none">
                                                                                    <button
                                                                                        className={`${selected ? 'bg-info text-white !outline-none' : ''}
                                                    -mb-[1px] block w-full rounded p-3.5 py-2 before:inline-block hover:bg-info hover:text-white`}
                                                                                    >
                                                                                        {item?.name}
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </Tab>
                                                                    ))}

                                                                </Tab.List>
                                                                <Tab.Panels>

                                                                    {dataInput?.data?.map((item: any, index: number) => (
                                                                        <Tab.Panel>
                                                                            <div className={index == 0 ? 'active pt-5' : 'pt-5'}>
                                                                                <div className='underline font-semibold'>
                                                                                    Rumus:
                                                                                </div>
                                                                                <div className="">
                                                                                    {item?.rumus ?? '-'}
                                                                                </div>

                                                                                <hr className='my-4' />


                                                                                <div className="grid xl:grid-cols-2 gap-y-4">
                                                                                    <div className="">
                                                                                        <div className='underline font-semibold'>
                                                                                            Target:
                                                                                        </div>
                                                                                        <div className="mb-4">
                                                                                            {item?.target?.target ?? '-'}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="">
                                                                                        <div className='underline font-semibold'>
                                                                                            Tahun:
                                                                                        </div>
                                                                                        <div className="mb-4">
                                                                                            {year ?? '-'}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                <hr className='my-4' />

                                                                                <div className='underline font-semibold'>
                                                                                    Perubahan Target:
                                                                                </div>

                                                                                <div className="grid xl:grid-cols-3 gap-4 mt-3">

                                                                                    <div>
                                                                                        <label className='text-sm' htmlFor="month_1">
                                                                                            Januari
                                                                                        </label>
                                                                                        <input
                                                                                            id="month_1"
                                                                                            type="search"
                                                                                            autoComplete="off"
                                                                                            placeholder={"Target Januari"}
                                                                                            value={item?.target?.month_1}
                                                                                            onChange={(e) =>
                                                                                                setDataInput((prev: any) => {
                                                                                                    const updated = { ...prev };
                                                                                                    updated['data'][index]['target'] = {
                                                                                                        year: item?.target?.year,
                                                                                                        target: item?.target?.target,
                                                                                                        month_1: e.target.value,
                                                                                                        month_2: item?.target?.month_2,
                                                                                                        month_3: item?.target?.month_3,
                                                                                                        month_4: item?.target?.month_4,
                                                                                                        month_5: item?.target?.month_5,
                                                                                                        month_6: item?.target?.month_6,
                                                                                                        month_7: item?.target?.month_7,
                                                                                                        month_8: item?.target?.month_8,
                                                                                                        month_9: item?.target?.month_9,
                                                                                                        month_10: item?.target?.month_10,
                                                                                                        month_11: item?.target?.month_11,
                                                                                                        month_12: item?.target?.month_12,
                                                                                                    }
                                                                                                    return updated;
                                                                                                })
                                                                                            }
                                                                                            className="form-input" />
                                                                                    </div>

                                                                                    <div>
                                                                                        <label className='text-sm' htmlFor="month_2">
                                                                                            Februari
                                                                                        </label>
                                                                                        <input
                                                                                            id="month_2"
                                                                                            type="search"
                                                                                            autoComplete="off"
                                                                                            placeholder={"Target Februari"}
                                                                                            value={item?.target?.month_2}
                                                                                            onChange={(e) =>
                                                                                                setDataInput((prev: any) => {
                                                                                                    const updated = { ...prev };
                                                                                                    updated['data'][index]['target'] = {
                                                                                                        year: item?.target?.year,
                                                                                                        target: item?.target?.target,
                                                                                                        month_1: item?.target?.month_1,
                                                                                                        month_2: e.target.value,
                                                                                                        month_3: item?.target?.month_3,
                                                                                                        month_4: item?.target?.month_4,
                                                                                                        month_5: item?.target?.month_5,
                                                                                                        month_6: item?.target?.month_6,
                                                                                                        month_7: item?.target?.month_7,
                                                                                                        month_8: item?.target?.month_8,
                                                                                                        month_9: item?.target?.month_9,
                                                                                                        month_10: item?.target?.month_10,
                                                                                                        month_11: item?.target?.month_11,
                                                                                                        month_12: item?.target?.month_12,
                                                                                                    }
                                                                                                    return updated;
                                                                                                })
                                                                                            }
                                                                                            className="form-input" />
                                                                                    </div>

                                                                                    <div>
                                                                                        <label className='text-sm' htmlFor="month_3">
                                                                                            Maret
                                                                                        </label>
                                                                                        <input
                                                                                            id="month_3"
                                                                                            type="search"
                                                                                            autoComplete="off"
                                                                                            placeholder={"Target Maret"}
                                                                                            value={item?.target?.month_3}
                                                                                            onChange={(e) =>
                                                                                                setDataInput((prev: any) => {
                                                                                                    const updated = { ...prev };
                                                                                                    updated['data'][index]['target'] = {
                                                                                                        year: item?.target?.year,
                                                                                                        target: item?.target?.target,
                                                                                                        month_1: item?.target?.month_1,
                                                                                                        month_2: item?.target?.month_2,
                                                                                                        month_3: e.target.value,
                                                                                                        month_4: item?.target?.month_4,
                                                                                                        month_5: item?.target?.month_5,
                                                                                                        month_6: item?.target?.month_6,
                                                                                                        month_7: item?.target?.month_7,
                                                                                                        month_8: item?.target?.month_8,
                                                                                                        month_9: item?.target?.month_9,
                                                                                                        month_10: item?.target?.month_10,
                                                                                                        month_11: item?.target?.month_11,
                                                                                                        month_12: item?.target?.month_12,
                                                                                                    }
                                                                                                    return updated;
                                                                                                })
                                                                                            }
                                                                                            className="form-input" />
                                                                                    </div>

                                                                                    <div>
                                                                                        <label className='text-sm' htmlFor="month_4">
                                                                                            April
                                                                                        </label>
                                                                                        <input
                                                                                            id="month_4"
                                                                                            type="search"
                                                                                            autoComplete="off"
                                                                                            placeholder={"Target April"}
                                                                                            value={item?.target?.month_4}
                                                                                            onChange={(e) =>
                                                                                                setDataInput((prev: any) => {
                                                                                                    const updated = { ...prev };
                                                                                                    updated['data'][index]['target'] = {
                                                                                                        year: item?.target?.year,
                                                                                                        target: item?.target?.target,
                                                                                                        month_1: item?.target?.month_1,
                                                                                                        month_2: item?.target?.month_2,
                                                                                                        month_3: item?.target?.month_3,
                                                                                                        month_4: e.target.value,
                                                                                                        month_5: item?.target?.month_5,
                                                                                                        month_6: item?.target?.month_6,
                                                                                                        month_7: item?.target?.month_7,
                                                                                                        month_8: item?.target?.month_8,
                                                                                                        month_9: item?.target?.month_9,
                                                                                                        month_10: item?.target?.month_10,
                                                                                                        month_11: item?.target?.month_11,
                                                                                                        month_12: item?.target?.month_12,
                                                                                                    }
                                                                                                    return updated;
                                                                                                })
                                                                                            }
                                                                                            className="form-input" />
                                                                                    </div>

                                                                                    <div>
                                                                                        <label className='text-sm' htmlFor="month_5">
                                                                                            Mei
                                                                                        </label>
                                                                                        <input
                                                                                            id="month_5"
                                                                                            type="search"
                                                                                            autoComplete="off"
                                                                                            placeholder={"Target Mei"}
                                                                                            value={item?.target?.month_5}
                                                                                            onChange={(e) =>
                                                                                                setDataInput((prev: any) => {
                                                                                                    const updated = { ...prev };
                                                                                                    updated['data'][index]['target'] = {
                                                                                                        year: item?.target?.year,
                                                                                                        target: item?.target?.target,
                                                                                                        month_1: item?.target?.month_1,
                                                                                                        month_2: item?.target?.month_2,
                                                                                                        month_3: item?.target?.month_3,
                                                                                                        month_4: item?.target?.month_4,
                                                                                                        month_5: e.target.value,
                                                                                                        month_6: item?.target?.month_6,
                                                                                                        month_7: item?.target?.month_7,
                                                                                                        month_8: item?.target?.month_8,
                                                                                                        month_9: item?.target?.month_9,
                                                                                                        month_10: item?.target?.month_10,
                                                                                                        month_11: item?.target?.month_11,
                                                                                                        month_12: item?.target?.month_12,
                                                                                                    }
                                                                                                    return updated;
                                                                                                })
                                                                                            }
                                                                                            className="form-input" />
                                                                                    </div>

                                                                                    <div>
                                                                                        <label className='text-sm' htmlFor="month_6">
                                                                                            Juni
                                                                                        </label>
                                                                                        <input
                                                                                            id="month_6"
                                                                                            type="search"
                                                                                            autoComplete="off"
                                                                                            placeholder={"Target Juni"}
                                                                                            value={item?.target?.month_6}
                                                                                            onChange={(e) =>
                                                                                                setDataInput((prev: any) => {
                                                                                                    const updated = { ...prev };
                                                                                                    updated['data'][index]['target'] = {
                                                                                                        year: item?.target?.year,
                                                                                                        target: item?.target?.target,
                                                                                                        month_1: item?.target?.month_1,
                                                                                                        month_2: item?.target?.month_2,
                                                                                                        month_3: item?.target?.month_3,
                                                                                                        month_4: item?.target?.month_4,
                                                                                                        month_5: item?.target?.month_5,
                                                                                                        month_6: e.target.value,
                                                                                                        month_7: item?.target?.month_7,
                                                                                                        month_8: item?.target?.month_8,
                                                                                                        month_9: item?.target?.month_9,
                                                                                                        month_10: item?.target?.month_10,
                                                                                                        month_11: item?.target?.month_11,
                                                                                                        month_12: item?.target?.month_12,
                                                                                                    }
                                                                                                    return updated;
                                                                                                })
                                                                                            }
                                                                                            className="form-input" />
                                                                                    </div>

                                                                                    <div>
                                                                                        <label className='text-sm' htmlFor="month_7">
                                                                                            Juli
                                                                                        </label>
                                                                                        <input
                                                                                            id="month_7"
                                                                                            type="search"
                                                                                            autoComplete="off"
                                                                                            placeholder={"Target Juli"}
                                                                                            value={item?.target?.month_7}
                                                                                            onChange={(e) =>
                                                                                                setDataInput((prev: any) => {
                                                                                                    const updated = { ...prev };
                                                                                                    updated['data'][index]['target'] = {
                                                                                                        year: item?.target?.year,
                                                                                                        target: item?.target?.target,
                                                                                                        month_1: item?.target?.month_1,
                                                                                                        month_2: item?.target?.month_2,
                                                                                                        month_3: item?.target?.month_3,
                                                                                                        month_4: item?.target?.month_4,
                                                                                                        month_5: item?.target?.month_5,
                                                                                                        month_6: item?.target?.month_6,
                                                                                                        month_7: e.target.value,
                                                                                                        month_8: item?.target?.month_8,
                                                                                                        month_9: item?.target?.month_9,
                                                                                                        month_10: item?.target?.month_10,
                                                                                                        month_11: item?.target?.month_11,
                                                                                                        month_12: item?.target?.month_12,
                                                                                                    }
                                                                                                    return updated;
                                                                                                })
                                                                                            }
                                                                                            className="form-input" />
                                                                                    </div>

                                                                                    <div>
                                                                                        <label className='text-sm' htmlFor="month_8">
                                                                                            Agustus
                                                                                        </label>
                                                                                        <input
                                                                                            id="month_8"
                                                                                            type="search"
                                                                                            autoComplete="off"
                                                                                            placeholder={"Target Agustus"}
                                                                                            value={item?.target?.month_8}
                                                                                            onChange={(e) =>
                                                                                                setDataInput((prev: any) => {
                                                                                                    const updated = { ...prev };
                                                                                                    updated['data'][index]['target'] = {
                                                                                                        year: item?.target?.year,
                                                                                                        target: item?.target?.target,
                                                                                                        month_1: item?.target?.month_1,
                                                                                                        month_2: item?.target?.month_2,
                                                                                                        month_3: item?.target?.month_3,
                                                                                                        month_4: item?.target?.month_4,
                                                                                                        month_5: item?.target?.month_5,
                                                                                                        month_6: item?.target?.month_6,
                                                                                                        month_7: item?.target?.month_7,
                                                                                                        month_8: e.target.value,
                                                                                                        month_9: item?.target?.month_9,
                                                                                                        month_10: item?.target?.month_10,
                                                                                                        month_11: item?.target?.month_11,
                                                                                                        month_12: item?.target?.month_12,
                                                                                                    }
                                                                                                    return updated;
                                                                                                })
                                                                                            }
                                                                                            className="form-input" />
                                                                                    </div>

                                                                                    <div>
                                                                                        <label className='text-sm' htmlFor="month_9">
                                                                                            September
                                                                                        </label>
                                                                                        <input
                                                                                            id="month_9"
                                                                                            type="search"
                                                                                            autoComplete="off"
                                                                                            placeholder={"Target September"}
                                                                                            value={item?.target?.month_9}
                                                                                            onChange={(e) =>
                                                                                                setDataInput((prev: any) => {
                                                                                                    const updated = { ...prev };
                                                                                                    updated['data'][index]['target'] = {
                                                                                                        year: item?.target?.year,
                                                                                                        target: item?.target?.target,
                                                                                                        month_1: item?.target?.month_1,
                                                                                                        month_2: item?.target?.month_2,
                                                                                                        month_3: item?.target?.month_3,
                                                                                                        month_4: item?.target?.month_4,
                                                                                                        month_5: item?.target?.month_5,
                                                                                                        month_6: item?.target?.month_6,
                                                                                                        month_7: item?.target?.month_7,
                                                                                                        month_8: item?.target?.month_8,
                                                                                                        month_9: e.target.value,
                                                                                                        month_10: item?.target?.month_10,
                                                                                                        month_11: item?.target?.month_11,
                                                                                                        month_12: item?.target?.month_12,
                                                                                                    }
                                                                                                    return updated;
                                                                                                })
                                                                                            }
                                                                                            className="form-input" />
                                                                                    </div>

                                                                                    <div>
                                                                                        <label className='text-sm' htmlFor="month_10">
                                                                                            Oktober
                                                                                        </label>
                                                                                        <input
                                                                                            id="month_10"
                                                                                            type="search"
                                                                                            autoComplete="off"
                                                                                            placeholder={"Target Oktober"}
                                                                                            value={item?.target?.month_10}
                                                                                            onChange={(e) =>
                                                                                                setDataInput((prev: any) => {
                                                                                                    const updated = { ...prev };
                                                                                                    updated['data'][index]['target'] = {
                                                                                                        year: item?.target?.year,
                                                                                                        target: item?.target?.target,
                                                                                                        month_1: item?.target?.month_1,
                                                                                                        month_2: item?.target?.month_2,
                                                                                                        month_3: item?.target?.month_3,
                                                                                                        month_4: item?.target?.month_4,
                                                                                                        month_5: item?.target?.month_5,
                                                                                                        month_6: item?.target?.month_6,
                                                                                                        month_7: item?.target?.month_7,
                                                                                                        month_8: item?.target?.month_8,
                                                                                                        month_9: item?.target?.month_9,
                                                                                                        month_10: e.target.value,
                                                                                                        month_11: item?.target?.month_11,
                                                                                                        month_12: item?.target?.month_12,
                                                                                                    }
                                                                                                    return updated;
                                                                                                })
                                                                                            }
                                                                                            className="form-input" />
                                                                                    </div>

                                                                                    <div>
                                                                                        <label className='text-sm' htmlFor="month_11">
                                                                                            November
                                                                                        </label>
                                                                                        <input
                                                                                            id="month_11"
                                                                                            type="search"
                                                                                            autoComplete="off"
                                                                                            placeholder={"Target November"}
                                                                                            value={item?.target?.month_11}
                                                                                            onChange={(e) =>
                                                                                                setDataInput((prev: any) => {
                                                                                                    const updated = { ...prev };
                                                                                                    updated['data'][index]['target'] = {
                                                                                                        year: item?.target?.year,
                                                                                                        target: item?.target?.target,
                                                                                                        month_1: item?.target?.month_1,
                                                                                                        month_2: item?.target?.month_2,
                                                                                                        month_3: item?.target?.month_3,
                                                                                                        month_4: item?.target?.month_4,
                                                                                                        month_5: item?.target?.month_5,
                                                                                                        month_6: item?.target?.month_6,
                                                                                                        month_7: item?.target?.month_7,
                                                                                                        month_8: item?.target?.month_8,
                                                                                                        month_9: item?.target?.month_9,
                                                                                                        month_10: item?.target?.month_10,
                                                                                                        month_11: e.target.value,
                                                                                                        month_12: item?.target?.month_12,
                                                                                                    }
                                                                                                    return updated;
                                                                                                })
                                                                                            }
                                                                                            className="form-input" />
                                                                                    </div>

                                                                                    <div>
                                                                                        <label className='text-sm' htmlFor="month_12">
                                                                                            Desember
                                                                                        </label>
                                                                                        <input
                                                                                            id="month_12"
                                                                                            type="search"
                                                                                            autoComplete="off"
                                                                                            placeholder={"Target Desember"}
                                                                                            value={item?.target?.month_12}
                                                                                            onChange={(e) =>
                                                                                                setDataInput((prev: any) => {
                                                                                                    const updated = { ...prev };
                                                                                                    updated['data'][index]['target'] = {
                                                                                                        year: item?.target?.year,
                                                                                                        target: item?.target?.target,
                                                                                                        month_1: item?.target?.month_1,
                                                                                                        month_2: item?.target?.month_2,
                                                                                                        month_3: item?.target?.month_3,
                                                                                                        month_4: item?.target?.month_4,
                                                                                                        month_5: item?.target?.month_5,
                                                                                                        month_6: item?.target?.month_6,
                                                                                                        month_7: item?.target?.month_7,
                                                                                                        month_8: item?.target?.month_8,
                                                                                                        month_9: item?.target?.month_9,
                                                                                                        month_10: item?.target?.month_10,
                                                                                                        month_11: item?.target?.month_11,
                                                                                                        month_12: e.target.value,
                                                                                                    }
                                                                                                    return updated;
                                                                                                })
                                                                                            }
                                                                                            className="form-input" />
                                                                                    </div>

                                                                                </div>

                                                                            </div>
                                                                        </Tab.Panel>
                                                                    ))}

                                                                </Tab.Panels>
                                                            </Tab.Group>

                                                        </div>

                                                    </div>

                                                    {safeToSave && (
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
                                                    )}

                                                </div>
                                            </Dialog.Panel>
                                        </Transition.Child>
                                    </div>
                                </div>
                            </Dialog>
                        </Transition>
                    </>
                )}

            </>
        );
    } else {
        return (
            <Page403 />
        );
    }

};

export default Index;

