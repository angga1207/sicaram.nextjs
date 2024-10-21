import { useEffect, useState, Fragment, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
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

import { getRefTujuanSasaran, saveRefTujuanSasaran, getRefIndikatorTujuanSasaran, saveRefIndikatorTujuanSasaran } from '@/apis/references';
import { fetchInstances } from '@/apis/fetchdata';
import { getMasterTujuan, saveMasterTujuan, getDetailMasterTujuan, deleteMasterTujuan, getDetailMasterSasaran, saveMasterSasaran, deleteMasterSasaran } from '@/apis/tujuan_sasaran';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faTimes, faCog, faAngleDoubleDown, faTrashAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import IconSearch from '@/components/Icon/IconSearch';
import IconPlus from '@/components/Icon/IconPlus';
import IconX from '@/components/Icon/IconX';
import Page403 from '@/components/Layouts/Page403';


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
        dispatch(setPageTitle('Master Tujuan & Sasaran Perangkat Daerah'));
    });

    const [isMounted, setIsMounted] = useState(false);
    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null)

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
        if (isMounted) {
            setPeriode(JSON.parse(localStorage.getItem('periode') ?? ""));
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

    const route = useRouter();
    const [datas, setDatas] = useState<any>([]);
    const [detail, setDetail] = useState<any>({});
    const [isDetail, setIsDetail] = useState<boolean>(false);
    const [detailParent, setDetailParent] = useState<any>({});
    const [isDetailParent, setIsDetailParent] = useState<boolean>(false);
    const [instance, setInstance] = useState<any>(CurrentUser?.instance_id ?? null);

    useEffect(() => {
        if (CurrentUser) {
            setInstance(CurrentUser.instance_id);
        }
    }, [CurrentUser]);

    const [instances, setInstances] = useState<any>([]);
    const [search, setSearch] = useState<any>('');
    const [saveLoading, setSaveLoading] = useState(false);
    const [optionRefTujuanKabupaten, setOptionRefTujuanKabupaten] = useState<any>([]);
    const [optionRefTujuan, setOptionRefTujuan] = useState<any>([]);
    const [optionRefIndikatorTujuan, setOptionRefIndikatorTujuan] = useState<any>([]);
    const [optionRefSasaran, setOptionRefSasaran] = useState<any>([]);
    const [optionRefIndikatorSasaran, setOptionRefIndikatorSasaran] = useState<any>([]);
    const [modalInputReferences, setModalInputReferences] = useState<any>(false);
    const [dataInputReferences, setDataInputReferences] = useState<any>({
        inputType: 'create',
        type: 'tujuan',
        id: '',
        name: '',
        instance_id: instance,
        periode_id: periode?.id,
    });
    const [modalInputIndikatorReferences, setModalInputIndikatorReferences] = useState<any>(false);
    const [dataInputIndikatorReferences, setDataInputIndikatorReferences] = useState<any>({
        inputType: 'create',
        type: 'tujuan',
        id: '',
        name: '',
        instance_id: instance,
        periode_id: periode?.id,
    });
    const [modalInputTujuan, setModalInputTujuan] = useState<any>(false);
    const [viewIndikatorTujuan, setViewIndikatorTujuan] = useState<any>(null);
    const [dataInputTujuan, setDataInputTujuan] = useState<any>({
        inputType: 'create',
        id: '',
        instance_id: instance,
        parent_id: null,
        parent_ref_tujuan_id: null,
        ref_tujuan_id: null,
        indikator_tujuan_ids: [],
        rumus_tujuan: [],
        periode: periode?.id,
    });
    const [modalInputSasaran, setModalInputSasaran] = useState<any>(false);
    const [viewIndikatorSasaran, setViewIndikatorSasaran] = useState<any>(null);
    const [dataInputSasaran, setDataInputSasaran] = useState<any>({
        inputType: 'create',
        id: '',
        instance_id: instance,
        tujuan_id: '',
        ref_tujuan_id: null,
        indikator_tujuan_ids: [],
        rumus_tujuan: [],
        periode: periode?.id,
    });

    useEffect(() => {
        if (isMounted && periode?.id) {
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

            getRefTujuanSasaran('', 1, '', 'tujuan', periode?.id).then((data: any) => {
                if (data?.status === 'success') {
                    setOptionRefTujuanKabupaten(data.data.map((item: any) => {
                        return {
                            value: item.id,
                            label: item.name
                        }
                    }
                    ));
                }
            });
        }
    }, [isMounted, periode?.id]);

    useEffect(() => {
        if (instance && isMounted && periode?.id) {
            getMasterTujuan(search, instance, periode?.id).then((data: any) => {
                if (data.status === 'success') {
                    setDatas(data.data);
                }
            });
            setIsDetail(false);
            setDetail({});

            getRefTujuanSasaran(search, 1, instance, 'tujuan', periode?.id).then((data: any) => {
                setOptionRefTujuan(data.data.map((item: any) => {
                    return {
                        value: item.id,
                        label: item.name
                    }
                }));
            });

            getRefTujuanSasaran(search, 1, instance, 'sasaran', periode?.id).then((data: any) => {
                setOptionRefSasaran(data.data.map((item: any) => {
                    return {
                        value: item.id,
                        label: item.name
                    }
                }));
            });

            getRefIndikatorTujuanSasaran(search, 1, instance, 'tujuan', periode?.id).then((data: any) => {
                setOptionRefIndikatorTujuan(data.data.map((item: any) => {
                    return {
                        value: item.id,
                        label: item.name
                    }
                }));
            });

            getRefIndikatorTujuanSasaran(search, 1, instance, 'sasaran', periode?.id).then((data: any) => {
                setOptionRefIndikatorSasaran(data.data.map((item: any) => {
                    return {
                        value: item.id,
                        label: item.name
                    }
                }));
            });
        }
    }, [instance, isMounted, periode?.id]);

    const detailData = (data: any) => {
        setDetail(data);
    }

    const detailParentData = (data: any) => {
        setDetailParent(data);
    }

    const addRefTujuan = () => {
        setDataInputReferences({
            inputType: 'create',
            type: 'tujuan',
            id: '',
            name: '',
            instance_id: instance,
            periode_id: periode?.id,
        });
        setModalInputReferences(true);
        setModalInputTujuan(false);
        setModalInputSasaran(false);
    }

    const addRefSasaran = () => {
        setDataInputReferences({
            inputType: 'create',
            type: 'sasaran',
            id: '',
            name: '',
            instance_id: instance,
            periode_id: periode?.id,
        });
        setModalInputReferences(true);
        setModalInputTujuan(false);
        setModalInputSasaran(false);
    }

    const addRefIndikatorTujuan = () => {
        setDataInputIndikatorReferences({
            inputType: 'create',
            type: 'tujuan',
            id: '',
            name: '',
            instance_id: instance,
            periode_id: periode?.id,
        });
        setModalInputIndikatorReferences(true);
        setModalInputTujuan(false);
        setModalInputSasaran(false);
    }

    const addRefIndikatorSasaran = () => {
        setDataInputIndikatorReferences({
            inputType: 'create',
            type: 'sasaran',
            id: '',
            name: '',
            instance_id: instance,
            periode_id: periode?.id,
        });
        setModalInputIndikatorReferences(true);
        setModalInputTujuan(false);
        setModalInputSasaran(false);
    }

    const saveReferences = () => {
        saveRefTujuanSasaran(dataInputReferences).then((data: any) => {
            if (data.status === 'success') {
                setModalInputReferences(false);
                showAlert('success', 'Data berhasil disimpan');
                if (dataInputReferences?.type === 'tujuan') {
                    getRefTujuanSasaran(search, 1, instance, 'tujuan', periode?.id).then((data: any) => {
                        setOptionRefTujuan(data.data.map((item: any) => {
                            return {
                                value: item.id,
                                label: item.name
                            }
                        }));
                    });
                    setModalInputTujuan(true);
                }
                if (dataInputReferences?.type === 'sasaran') {
                    getRefTujuanSasaran(search, 1, instance, 'sasaran', periode?.id).then((data: any) => {
                        setOptionRefSasaran(data.data.map((item: any) => {
                            return {
                                value: item.id,
                                label: item.name
                            }
                        }));
                    });
                    setModalInputSasaran(true);
                }
            } else {
                showAlert('error', 'Data gagal disimpan');
            }
        });
    }

    const saveIndikatorReferences = () => {
        saveRefIndikatorTujuanSasaran(dataInputIndikatorReferences).then((data: any) => {
            if (data.status === 'success') {
                setModalInputIndikatorReferences(false);
                showAlert('success', 'Data berhasil disimpan');
                if (dataInputIndikatorReferences?.type === 'tujuan') {
                    getRefIndikatorTujuanSasaran(search, 1, instance, 'tujuan', periode?.id).then((data: any) => {
                        setOptionRefIndikatorTujuan(data.data.map((item: any) => {
                            return {
                                value: item.id,
                                label: item.name
                            }
                        }));
                    });
                    setModalInputTujuan(true);
                }
                if (dataInputIndikatorReferences?.type === 'sasaran') {
                    getRefIndikatorTujuanSasaran(search, 1, instance, 'sasaran', periode?.id).then((data: any) => {
                        setOptionRefIndikatorSasaran(data.data.map((item: any) => {
                            return {
                                value: item.id,
                                label: item.name
                            }
                        }));
                    });
                    setModalInputSasaran(true);
                }
            } else {
                showAlert('error', 'Data gagal disimpan');
            }
        });
    }

    const addTujuan = () => {
        setDataInputTujuan({
            inputType: 'create',
            instance_id: instance,
            periode: periode?.id,
            parent_id: 1,
            ref_tujuan_id: null,
            indikator_tujuan_ids: [],
            rumus_tujuan: [],
        });
        setViewIndikatorTujuan(0);
        setModalInputTujuan(true);
    }

    const editTujuan = (id: any) => {
        getDetailMasterTujuan(id).then((data: any) => {
            if (data.status === 'success') {
                setDataInputTujuan({
                    inputType: 'edit',
                    id: data.data.id,
                    parent_id: data.data.parent_id,
                    parent_ref_tujuan_id: data.data.parent_ref_tujuan_id,
                    instance_id: instance,
                    periode: periode?.id,
                    ref_tujuan_id: data.data.ref_tujuan_id,
                    indikator_tujuan_ids: data.data.indikator_tujuan_ids,
                    rumus_tujuan: data.data.rumus_tujuan,
                });
                setViewIndikatorTujuan(0);
                setModalInputTujuan(true);
            }
        });
    }

    const save = (type: any) => {
        setSaveLoading(true);
        if (type === 'tujuan') {
            saveMasterTujuan(dataInputTujuan).then((data: any) => {
                if (data.status === 'success') {
                    setSaveLoading(false);
                    setModalInputTujuan(false);
                    showAlert('success', 'Data berhasil disimpan');
                    getMasterTujuan(search, instance, periode?.id).then((data: any) => {
                        if (data.status === 'success') {
                            setDatas(data.data);
                        }
                    });
                } else {
                    setSaveLoading(false);
                    showAlert('error', data?.message);
                }
            });
        }

        if (type === 'sasaran') {
            saveMasterSasaran(dataInputSasaran).then((data: any) => {
                if (data.status === 'success') {
                    setSaveLoading(false);
                    setModalInputSasaran(false);
                    showAlert('success', 'Data berhasil disimpan');
                    getMasterTujuan(search, instance, periode?.id).then((data: any) => {
                        if (data.status === 'success') {
                            setDatas(data.data);
                        }
                    });
                } else {
                    setSaveLoading(false);
                    showAlert('error', data?.message);
                }
            });
        }
    }

    const deleteTujuan = (id: any) => {
        // confirm swal
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMasterTujuan(id).then((data: any) => {
                    if (data.status === 'success') {
                        getMasterTujuan(search, instance, periode?.id).then((data: any) => {
                            if (data.status === 'success') {
                                setDatas(data.data);
                            }
                        });
                        showAlert('success', 'Data berhasil dihapus');
                    } else {
                        showAlert('error', 'Data gagal dihapus');
                    }
                });
            }
        });
    }

    const addSasaran = (data: any) => {
        setDataInputSasaran({
            inputType: 'create',
            id: '',
            instance_id: instance,
            periode: periode?.id,
            tujuan_id: data?.id,
            ref_sasaran_id: null,
            indikator_sasaran_ids: [],
            rumus_sasaran: [],
        });
        setViewIndikatorSasaran(0);
        setModalInputSasaran(true);
    }

    const editSasaran = (data: any) => {
        getDetailMasterSasaran(data?.id).then((data: any) => {
            if (data.status === 'success') {
                setDataInputSasaran({
                    inputType: 'edit',
                    id: data.data.id,
                    instance_id: instance,
                    periode: periode?.id,
                    tujuan_id: data.data.tujuan_id,
                    ref_sasaran_id: data.data.ref_sasaran_id,
                    indikator_sasaran_ids: data.data.indikator_sasaran_ids,
                    rumus_sasaran: data.data.rumus_sasaran,
                });
                setViewIndikatorSasaran(0);
                setModalInputSasaran(true);
            }
        });
    }

    const deleteSasaran = (data: any) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMasterSasaran(data?.id).then((data: any) => {
                    if (data.status === 'success') {
                        getMasterTujuan(search, instance, periode?.id).then((data: any) => {
                            if (data.status === 'success') {
                                setDatas(data.data);
                            }
                        });
                        showAlert('success', 'Data berhasil dihapus');
                    } else {
                        showAlert('error', 'Data gagal dihapus');
                    }
                });
            }
        });
    }

    if (CurrentUser?.role_id && [1, 2, 3, 9].includes(CurrentUser?.role_id)) {
        return (
            <>
                <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5 px-5">
                    <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                        Master Tujuan & Sasaran
                    </h2>
                    <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">

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
                    <div className="panel">
                        <div className="table-responsive">
                            <table className='!select-none'>
                                <thead>
                                    <tr>
                                        <th>
                                            <div className="text-md !font-semibold whitespace-nowrap">
                                                Tujuan & Sasaran Kabupaten
                                            </div>
                                        </th>
                                        <th className='!w-[150px]'>
                                            <div className="flex items-center justify-center gap-2">
                                                {/* <FontAwesomeIcon icon={faCog} className="w-5 h-5" /> */}
                                                <Tippy content="Tambah Tujuan" theme='sucess'>
                                                    <button type="button" onClick={() => addTujuan()} className="btn btn-sm btn-success whitespace-nowrap gap-1">
                                                        <IconPlus className="w-4 h-4" />
                                                        Tambah Tujuan
                                                    </button>
                                                </Tippy>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {datas?.map((item: any, index: number) => (
                                        <>
                                            <tr key={`data-` + index} className={isDetail ? (detail?.id === item?.id ? `` : `hidden`) : ``}>
                                                <td onClick={(e) => {
                                                    if (isDetail === false) {
                                                        detailData(item);
                                                        setIsDetail(true);
                                                        setIsDetailParent(false);
                                                        detailParentData({});
                                                    }
                                                    if (isDetail === true && detail?.id === item?.id) {
                                                        detailData({});
                                                        setIsDetail(false);
                                                        setIsDetailParent(false);
                                                        detailParentData({});
                                                    }
                                                    if (isDetail === true && detail?.id !== item?.id) {
                                                        detailData(item);
                                                        setIsDetail(true);
                                                        setIsDetailParent(false);
                                                        detailParentData({});
                                                    }
                                                }}
                                                    className='cursor-pointer'
                                                >
                                                    <span className='font-semibold text-md'>
                                                        {item?.tujuan}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Tippy content="Lihat Detail Kabupaten" theme='info'>
                                                            <button type="button" onClick={(e) => {
                                                                if (isDetailParent === false) {
                                                                    detailParentData(item);
                                                                    setIsDetailParent(true);
                                                                    detailData({});
                                                                    setIsDetail(false);
                                                                }
                                                                if (isDetailParent === true && detailParent?.id === item?.id) {
                                                                    detailParentData({});
                                                                    setIsDetailParent(false);
                                                                    detailData({});
                                                                    setIsDetail(false);
                                                                }
                                                                if (isDetailParent === true && detailParent?.id !== item?.id) {
                                                                    detailParentData(item);
                                                                    setIsDetailParent(true);
                                                                    detailData({});
                                                                    setIsDetail(false);
                                                                }
                                                            }}
                                                                className={detailParent?.id === item?.id ? `btn btn-sm btn-info` : `btn btn-sm btn-outline-info`}
                                                            >
                                                                <FontAwesomeIcon icon={faAngleDoubleDown} className={detailParent?.id === item?.id ? `w-4 h-4 transition-all duration-300 rotate-180` : `w-4 h-4 transition-all duration-300`} />
                                                            </button>
                                                        </Tippy>
                                                        <Tippy content="Lihat Detail" theme='info'>
                                                            <button type="button" onClick={(e) => {
                                                                if (isDetail === false) {
                                                                    detailData(item);
                                                                    setIsDetail(true);
                                                                    setIsDetailParent(false);
                                                                    detailParentData({});
                                                                }
                                                                if (isDetail === true && detail?.id === item?.id) {
                                                                    detailData({});
                                                                    setIsDetail(false);
                                                                    setIsDetailParent(false);
                                                                    detailParentData({});
                                                                }
                                                                if (isDetail === true && detail?.id !== item?.id) {
                                                                    detailData(item);
                                                                    setIsDetail(true);
                                                                    setIsDetailParent(false);
                                                                    detailParentData({});
                                                                }
                                                            }}
                                                                className={detail?.id === item?.id ? `btn btn-sm btn-info` : `btn btn-sm btn-outline-info`}
                                                            >
                                                                <FontAwesomeIcon icon={faAngleDoubleDown} className={detail?.id === item?.id ? `w-4 h-4 transition-all duration-300 rotate-180` : `w-4 h-4 transition-all duration-300`} />
                                                            </button>
                                                        </Tippy>
                                                    </div>
                                                </td>
                                            </tr>

                                            {isDetailParent && detailParent?.id === item?.id && (
                                                <>
                                                    <tr className='bg-info-light dark:bg-info-dark-light'>
                                                        <td colSpan={2}>
                                                            <div className='space-y-2 divide-y w-full'>
                                                                {item?.indikator_tujuan?.map((indikator: any, indexIndikator: number) => (
                                                                    <div className="pt-2 w-full flex justify-between items-center gap-2">
                                                                        <div className="w-1/2">
                                                                            {index + 1 + `.` + (indexIndikator + 1)} &nbsp;
                                                                            {indikator?.name}
                                                                        </div>
                                                                        <div className="w-1/2">
                                                                            <div className='underline text-xs mb-1'>
                                                                                Rumus:
                                                                            </div>
                                                                            {indikator?.rumus ?? '-'}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr className='bg-primary-light dark:bg-primary-dark-light !font-semibold'>
                                                        <td colSpan={2}>
                                                            <div className="font-semibold underline text-md">
                                                                Sasaran Kabupaten
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    {item?.sasaran?.map((sasaran: any, indexSasaran: number) => (
                                                        <tr className='bg-primary-light dark:bg-primary-dark-light'>
                                                            <td colSpan={2}>
                                                                <div className="">
                                                                    <div className="font-semibold">
                                                                        {indexSasaran + 1}. &nbsp;
                                                                        {sasaran?.sasaran}
                                                                    </div>
                                                                    <div className="pl-10 mt-2">
                                                                        Indikator
                                                                        <div className="space-y-2">
                                                                            {sasaran?.indikator_sasaran?.map((indikatorSasaran: any, indexIndikatorSasaran: number) => (
                                                                                <div className="">
                                                                                    <span className='font-semibold'>
                                                                                        {/* - &nbsp; */}
                                                                                        {(indexSasaran + 1) + `.` + (indexIndikatorSasaran + 1)}. &nbsp;
                                                                                        {indikatorSasaran?.name}
                                                                                    </span>
                                                                                    <div className="pl-10 mt-2">
                                                                                        <div className='underline text-xs mb-1'>
                                                                                            Rumus:
                                                                                        </div>
                                                                                        {indikatorSasaran?.rumus ?? '-'}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </>
                                            )}

                                            {isDetail && detail?.id === item?.id && (
                                                <>
                                                    <tr className=''>
                                                        <td colSpan={2} className='!p-0'>
                                                            <table>
                                                                <thead className=''>
                                                                    <tr className='!bg-dark dark:bg-dark-dark-light !text-white'>
                                                                        <td className='!w-[10px]'>#</td>
                                                                        <th>
                                                                            TUJUAN
                                                                            &nbsp;
                                                                            {instances?.filter((item: any) => item.value === instance)[0]?.label}
                                                                        </th>
                                                                        <th className='!w-[150px]'>
                                                                            <div className="flex items-center justify-center ">
                                                                                <FontAwesomeIcon icon={faCog} className="w-5 h-5" />
                                                                            </div>
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {item?.opd?.map((dataOpd: any, indexOpd: number) => (
                                                                        <>
                                                                            <tr className='border-b-0'>
                                                                                <td className='!font-bold'>{indexOpd + 1}</td>
                                                                                <td colSpan={1}>
                                                                                    <span className='font-semibold text-md'>
                                                                                        {dataOpd?.tujuan}
                                                                                    </span>
                                                                                </td>
                                                                                <td>
                                                                                    <div className="flex items-center justify-center gap-1">
                                                                                        <Tippy content="Edit Tujuan" theme='primary'>
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => {
                                                                                                    editTujuan(dataOpd?.id)
                                                                                                }}
                                                                                                className="btn btn-sm btn-primary">
                                                                                                <FontAwesomeIcon icon={faEdit} className="w-3 h-3" />
                                                                                            </button>
                                                                                        </Tippy>
                                                                                        <Tippy content="Hapus Tujuan" theme='danger'>
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => {
                                                                                                    deleteTujuan(dataOpd?.id)
                                                                                                }}
                                                                                                className="btn btn-sm btn-danger">
                                                                                                <FontAwesomeIcon icon={faTrashAlt} className="w-3 h-3" />
                                                                                            </button>
                                                                                        </Tippy>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                            <tr className='border-b-2 !border-slate-500'>
                                                                                <td></td>
                                                                                <td colSpan={2} className='!px-0'>
                                                                                    {dataOpd?.indikator_tujuan?.length > 0 && (
                                                                                        <>
                                                                                            <div className="underline px-4">
                                                                                                Indikator Tujuan :
                                                                                            </div>
                                                                                            <div className="space-y-4 divide-y px-4">
                                                                                                {dataOpd?.indikator_tujuan?.map((indikatorOpd: any, indexIndikatorOpd: number) => (
                                                                                                    <div className='p-2 hover:bg-slate-200 cursor-pointer rounded'>
                                                                                                        <div className="flex items-center font-semibold">
                                                                                                            <FontAwesomeIcon icon={faArrowRight} className='w-3 h-3 mr-1' />
                                                                                                            <span>
                                                                                                                {indikatorOpd?.name}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                        <div className="">
                                                                                                            <div className='underline text-xs'>
                                                                                                                Rumus :
                                                                                                            </div>
                                                                                                            <div className="">
                                                                                                                {indikatorOpd?.rumus}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))}
                                                                                            </div>
                                                                                        </>
                                                                                    )}
                                                                                    <table className='mt-2'>
                                                                                        <thead>
                                                                                            <tr className='!bg-dark dark:bg-dark-dark-light !text-white'>
                                                                                                <td className='!w-[10px]'>#</td>
                                                                                                <th>Sasaran</th>
                                                                                                <th className='!w-[150px]'>
                                                                                                    <div className="flex items-center justify-center gap-1">
                                                                                                        <button
                                                                                                            type="button"
                                                                                                            onClick={(e) => {
                                                                                                                addSasaran(dataOpd)
                                                                                                            }}
                                                                                                            className="btn btn-sm btn-success">
                                                                                                            <FontAwesomeIcon icon={faPlus} className="w-3 h-3 mr-1" />
                                                                                                            Sasaran
                                                                                                        </button>
                                                                                                    </div>
                                                                                                </th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {dataOpd?.sasaran?.map((sasaranOpd: any, indexSasaranOpd: number) => (
                                                                                                <>
                                                                                                    <tr>
                                                                                                        <td>
                                                                                                            <span className='font-semibold'>
                                                                                                                {(indexOpd + 1) + `.` + (indexSasaranOpd + 1)}
                                                                                                            </span>
                                                                                                        </td>
                                                                                                        <td className='font-semibold text-md'>
                                                                                                            {sasaranOpd?.sasaran}
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <div className="flex items-center justify-center gap-1">
                                                                                                                <Tippy content="Edit Sasaran" theme='primary'>
                                                                                                                    <button type="button" className="btn btn-sm btn-primary"
                                                                                                                        onClick={() => {
                                                                                                                            editSasaran(sasaranOpd)
                                                                                                                        }}>
                                                                                                                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3" />
                                                                                                                    </button>
                                                                                                                </Tippy>
                                                                                                                <Tippy content="Hapus Sasaran" theme='danger'>
                                                                                                                    <button type="button" className="btn btn-sm btn-danger"
                                                                                                                        onClick={() => {
                                                                                                                            deleteSasaran(sasaranOpd)
                                                                                                                        }}>
                                                                                                                        <FontAwesomeIcon icon={faTrashAlt} className="w-3 h-3" />
                                                                                                                    </button>
                                                                                                                </Tippy>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr className='border-b-2 !border-slate-500'>
                                                                                                        <td></td>
                                                                                                        <td colSpan={2}>
                                                                                                            <div className="underline px-4">
                                                                                                                Indikator Sasaran :
                                                                                                            </div>
                                                                                                            <div className="space-y-4 divide-y px-4">
                                                                                                                {sasaranOpd?.indikator_sasaran?.map((indikatorSasaranOpd: any, indexIndikatorSasaranOpd: number) => (
                                                                                                                    <>
                                                                                                                        <div className='p-2 hover:bg-slate-200 cursor-pointer rounded'>
                                                                                                                            <div className="flex items-center font-semibold">
                                                                                                                                <FontAwesomeIcon icon={faArrowRight} className='w-3 h-3 mr-1' />
                                                                                                                                <span>
                                                                                                                                    {indikatorSasaranOpd?.name}
                                                                                                                                </span>
                                                                                                                            </div>
                                                                                                                            <div className="">
                                                                                                                                <div className='underline text-xs'>
                                                                                                                                    Rumus :
                                                                                                                                </div>
                                                                                                                                <div className="">
                                                                                                                                    {indikatorSasaranOpd?.rumus}
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </>
                                                                                                                ))}
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </>
                                                                                            ))}
                                                                                        </tbody>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </>
                                            )}


                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div >
                )}

                <Transition appear show={modalInputReferences} as={Fragment}>
                    <Dialog as="div" open={modalInputReferences} onClose={() => setModalInputReferences(false)}>
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
                                    <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg w-full max-w-[100%] md:max-w-[40%] my-8 text-black dark:text-white-dark overflow-auto">
                                        <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                            <h5 className="font-bold text-lg">
                                                {dataInputTujuan?.inputType == 'create' ? 'Tambah' : 'Edit'} {dataInputReferences?.type === 'tujuan' ? ' Tujuan' : ' Sasaran'}
                                            </h5>
                                            <button type="button" className="text-white-dark hover:text-dark"
                                                onClick={() => {
                                                    setModalInputReferences(false);
                                                    if (dataInputReferences?.type === 'tujuan') {
                                                        setModalInputTujuan(true)
                                                    }
                                                    if (dataInputReferences?.type === 'sasaran') {
                                                        setModalInputSasaran(true)
                                                    }
                                                }}>
                                                <IconX className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="p-5">

                                            <form className="space-y-3" onSubmit={(e) => {
                                                e.preventDefault();
                                                saveReferences();
                                            }}>
                                                <div>
                                                    <label className="form-label font-normal text-xs mb-0.5">
                                                        Referensi {dataInputReferences?.type === 'tujuan' ? 'Tujuan' : 'Sasaran'}
                                                    </label>
                                                    <input
                                                        type='text'
                                                        name="name"
                                                        id="input-ref_name"
                                                        placeholder={`Referensi ${dataInputReferences?.type === 'tujuan' ? 'Tujuan' : 'Sasaran'}`}
                                                        value={dataInputReferences?.name}
                                                        autoComplete='off'
                                                        autoFocus={true}
                                                        // onChange={(e) => setDataInputTujuan({ ...dataInputTujuan, name: e.target.value })}
                                                        onChange={(e) => setDataInputReferences({ ...dataInputReferences, name: e.target.value })}
                                                        className="form-input font-normal resize-none"></input>
                                                    <div id="error-ref_name" className="validation-elements text-red-500 text-xs"></div>
                                                </div>

                                            </form>

                                            <div className="flex justify-end items-center mt-4">
                                                <button type="button" className="btn btn-outline-danger"
                                                    onClick={() => {
                                                        setModalInputReferences(false);
                                                        if (dataInputReferences?.type === 'tujuan') {
                                                            setModalInputTujuan(true)
                                                        }
                                                        if (dataInputReferences?.type === 'sasaran') {
                                                            setModalInputSasaran(true)
                                                        }
                                                    }}>
                                                    Batalkan
                                                </button>

                                                {saveLoading == false ? (
                                                    <>
                                                        <button type="button" className="btn btn-success ltr:ml-4 rtl:mr-4" onClick={() => saveReferences()}>
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

                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>

                <Transition appear show={modalInputIndikatorReferences} as={Fragment}>
                    <Dialog as="div" open={modalInputIndikatorReferences} onClose={() => setModalInputIndikatorReferences(false)}>
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
                                    <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg w-full max-w-[100%] md:max-w-[40%] my-8 text-black dark:text-white-dark overflow-auto">
                                        <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                            <h5 className="font-bold text-lg">
                                                {dataInputTujuan?.inputType == 'create' ? 'Tambah' : 'Edit'} Indikator {dataInputIndikatorReferences?.type === 'tujuan' ? 'Tujuan' : 'Sasaran'}
                                            </h5>
                                            <button type="button" className="text-white-dark hover:text-dark"
                                                onClick={() => {
                                                    setModalInputIndikatorReferences(false);
                                                    if (dataInputReferences?.type === 'tujuan') {
                                                        setModalInputTujuan(true)
                                                    }
                                                    if (dataInputReferences?.type === 'sasaran') {
                                                        setModalInputSasaran(true)
                                                    }
                                                }}>
                                                <IconX className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="p-5">

                                            <form className="space-y-3" onSubmit={(e) => {
                                                e.preventDefault();
                                                saveIndikatorReferences();
                                            }}>
                                                <div>
                                                    <label className="form-label font-normal text-xs mb-0.5">
                                                        Indikator {dataInputIndikatorReferences?.type === 'tujuan' ? 'Tujuan' : 'Sasaran'}
                                                    </label>
                                                    <input
                                                        type='text'
                                                        name="name"
                                                        id="input-ref_name"
                                                        placeholder={`Indikator ${dataInputIndikatorReferences?.type === 'tujuan' ? 'Tujuan' : 'Sasaran'}`}
                                                        value={dataInputIndikatorReferences?.name}
                                                        autoComplete='off'
                                                        autoFocus={true}
                                                        onChange={(e) => setDataInputIndikatorReferences({ ...dataInputIndikatorReferences, name: e.target.value })}
                                                        className="form-input font-normal resize-none"></input>
                                                    <div id="error-ref_name" className="validation-elements text-red-500 text-xs"></div>
                                                </div>

                                            </form>

                                            <div className="flex justify-end items-center mt-4">
                                                <button type="button" className="btn btn-outline-danger"
                                                    onClick={() => {
                                                        setModalInputIndikatorReferences(false);
                                                        if (dataInputReferences?.type === 'tujuan') {
                                                            setModalInputTujuan(true)
                                                        }
                                                        if (dataInputReferences?.type === 'sasaran') {
                                                            setModalInputSasaran(true)
                                                        }
                                                    }}>
                                                    Batalkan
                                                </button>

                                                {saveLoading == false ? (
                                                    <>
                                                        <button type="button" className="btn btn-success ltr:ml-4 rtl:mr-4" onClick={() => saveIndikatorReferences()}>
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

                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>

                <Transition appear show={modalInputTujuan} as={Fragment}>
                    <Dialog as="div" open={modalInputTujuan} onClose={() => setModalInputTujuan(false)}>
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
                                    <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg w-full max-w-[100%] md:max-w-[60%] h-[calc(100vh-100px)] my-8 text-black dark:text-white-dark overflow-auto">
                                        <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                            <h5 className="font-bold text-lg">
                                                {dataInputTujuan?.inputType == 'create' ? 'Tambah' : 'Edit'} Tujuan
                                            </h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalInputTujuan(false)}>
                                                <IconX className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="p-5">

                                            <form className="space-y-3" onSubmit={(e) => {
                                                e.preventDefault();
                                                save('tujuan');
                                            }}>
                                                <div className="mb-4 pb-5 border-b">
                                                    <div className=" flex items-center justify-between">
                                                        <label className="form-label font-normal mb-0.5">
                                                            Tujuan Kabupaten
                                                        </label>
                                                    </div>
                                                    <Select
                                                        placeholder="Pilih Tujuan Kabupaten"
                                                        isSearchable={true}
                                                        value={optionRefTujuanKabupaten?.find((item: any) => item.value === dataInputTujuan?.parent_ref_tujuan_id) ?? null}
                                                        className='w-full mt-2'
                                                        onChange={(value: any) => {
                                                            setDataInputTujuan((prev: any) => {
                                                                return {
                                                                    ...prev,
                                                                    parent_ref_tujuan_id: value?.value,
                                                                }
                                                            });
                                                        }}
                                                        options={optionRefTujuanKabupaten} />
                                                </div>

                                                <div className="">
                                                    <div className=" flex items-center justify-between">
                                                        <label className="form-label font-normal mb-0.5">
                                                            Tujuan
                                                        </label>
                                                        <div className="">
                                                            <button type="button" className="btn btn-sm btn-primary" onClick={() => addRefTujuan()}>
                                                                <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-1" />
                                                                Tambah Ref Tujuan
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <Select
                                                        placeholder="Pilih Tujuan"
                                                        isSearchable={true}
                                                        value={optionRefTujuan?.find((item: any) => item.value === dataInputTujuan?.ref_tujuan_id) ?? null}
                                                        className='w-full mt-2'
                                                        onChange={(value: any) => {
                                                            // setInstance(value?.value);
                                                            setDataInputTujuan((prev: any) => {
                                                                return {
                                                                    ...prev,
                                                                    ref_tujuan_id: value?.value,
                                                                }
                                                            });
                                                        }}
                                                        options={optionRefTujuan} />
                                                </div>

                                                <div className="">
                                                    <div className=" flex items-center justify-between">
                                                        <label className="form-label font-normal mb-0.5">
                                                            Indikator Tujuan
                                                        </label>
                                                        <div className="">
                                                            <button type="button" className="btn btn-sm btn-primary" onClick={() => addRefIndikatorTujuan()}>
                                                                <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-1" />
                                                                Tambah Indikator Tujuan
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <Select
                                                        placeholder="Pilih Indikator Tujuan"
                                                        isSearchable={true}
                                                        isMulti={true}
                                                        value={optionRefIndikatorTujuan?.filter((item: any) => dataInputTujuan?.indikator_tujuan_ids?.includes(item.value)) ?? []}
                                                        className='w-full mt-2'
                                                        onChange={(value: any) => {
                                                            const values = value.map((item: any) => item.value);
                                                            setDataInputTujuan((prev: any) => {
                                                                return {
                                                                    ...prev,
                                                                    indikator_tujuan_ids: values,
                                                                    rumus_tujuan: [...values.map((item: any) => {
                                                                        return {
                                                                            id: item,
                                                                            label: optionRefIndikatorTujuan.find((itemRef: any) => itemRef.value === item)?.label,
                                                                            rumus: dataInputTujuan?.rumus_tujuan?.find((itemRumus: any) => itemRumus.id === item)?.rumus ?? '-'
                                                                        }
                                                                    })]
                                                                }
                                                            });
                                                        }}
                                                        options={optionRefIndikatorTujuan} />
                                                </div>

                                                <div className="">
                                                    <div className="mt-3 flex border-b border-white-light dark:border-[#191e3a] overflow-auto">
                                                        {dataInputTujuan?.rumus_tujuan?.map((item: any, index: number) => (
                                                            <Tippy content={item?.label} key={`rumus-` + index}>
                                                                <button type='button'
                                                                    onClick={(e) => {
                                                                        setViewIndikatorTujuan(index);
                                                                    }}
                                                                    className={viewIndikatorTujuan === index ?
                                                                        `max-w-[300px] truncate !border-white-light !border-b-white bg-primary text-white !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] block border border-transparent p-3.5 py-2` :
                                                                        `max-w-[300px] truncate !border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary`} >
                                                                    {item?.label}
                                                                </button>
                                                            </Tippy>
                                                        ))}
                                                    </div>
                                                </div>
                                                {dataInputTujuan?.rumus_tujuan?.map((item: any, index: number) => (
                                                    <div className={viewIndikatorTujuan === index ? `` : `hidden`}>
                                                        <label className="form-label font-normal text-xs mb-0.5">
                                                            Rumus {item?.label}
                                                        </label>
                                                        <textarea
                                                            name="name"
                                                            id="input-name"
                                                            placeholder={`Rumus ${item?.label}`}
                                                            value={item?.rumus}
                                                            autoComplete='off'
                                                            autoFocus={true}
                                                            onChange={(e) => {
                                                                setDataInputTujuan((prev: any) => {
                                                                    return {
                                                                        ...prev,
                                                                        rumus_tujuan: [...prev?.rumus_tujuan?.map((itemRumus: any) => {
                                                                            if (itemRumus.id === item?.id) {
                                                                                return {
                                                                                    ...itemRumus,
                                                                                    rumus: e.target.value
                                                                                }
                                                                            }
                                                                            return itemRumus;
                                                                        })]
                                                                    }
                                                                });
                                                            }}
                                                            className="form-input font-normal min-h-[200px] resize-none"></textarea>
                                                        <div id="error-name" className="validation-elements text-red-500 text-xs"></div>
                                                    </div>
                                                ))}

                                            </form>

                                            <div className="flex justify-end items-center mt-4">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setModalInputTujuan(false)}>
                                                    Batalkan
                                                </button>

                                                {saveLoading == false ? (
                                                    <>
                                                        <button type="button" className="btn btn-success ltr:ml-4 rtl:mr-4" onClick={() => save('tujuan')}>
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

                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>

                <Transition appear show={modalInputSasaran} as={Fragment}>
                    <Dialog as="div" open={modalInputSasaran} onClose={() => setModalInputSasaran(false)}>
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
                                    <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg w-full max-w-[100%] md:max-w-[60%] h-[calc(100vh-200px)] my-8 text-black dark:text-white-dark overflow-auto">
                                        <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                            <h5 className="font-bold text-lg">
                                                {dataInputSasaran?.inputType == 'create' ? 'Tambah' : 'Edit'} Sasaran
                                            </h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalInputSasaran(false)}>
                                                <IconX className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="p-5">

                                            <form className="space-y-3" onSubmit={(e) => {
                                                e.preventDefault();
                                                save('sasaran');
                                            }}>
                                                <div className="">
                                                    <div className=" flex items-center justify-between">
                                                        <label className="form-label font-normal mb-0.5">
                                                            Sasaran
                                                        </label>
                                                        <div className="">
                                                            <button type="button" className="btn btn-sm btn-primary" onClick={() => addRefSasaran()}>
                                                                <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-1" />
                                                                Tambah Ref Sasaran
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <Select
                                                        placeholder="Pilih Sasaran"
                                                        isSearchable={true}
                                                        value={optionRefSasaran?.find((item: any) => item.value === dataInputSasaran?.ref_sasaran_id) ?? null}
                                                        className='w-full mt-2'
                                                        onChange={(value: any) => {
                                                            setDataInputSasaran((prev: any) => {
                                                                return {
                                                                    ...prev,
                                                                    ref_sasaran_id: value?.value,
                                                                }
                                                            });
                                                        }}
                                                        options={optionRefSasaran} />
                                                </div>

                                                <div className="">
                                                    <div className=" flex items-center justify-between">
                                                        <label className="form-label font-normal mb-0.5">
                                                            Indikator Sasaran
                                                        </label>
                                                        <div className="">
                                                            <button type="button" className="btn btn-sm btn-primary" onClick={() => addRefIndikatorSasaran()}>
                                                                <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-1" />
                                                                Tambah Indikator Sasaran
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <Select
                                                        placeholder="Pilih Indikator Sasaran"
                                                        isSearchable={true}
                                                        isMulti={true}
                                                        value={optionRefIndikatorSasaran?.filter((item: any) => dataInputSasaran?.indikator_sasaran_ids?.includes(item.value)) ?? []}
                                                        className='w-full mt-2'
                                                        onChange={(value: any) => {
                                                            const values = value.map((item: any) => item.value);
                                                            setDataInputSasaran((prev: any) => {
                                                                return {
                                                                    ...prev,
                                                                    indikator_sasaran_ids: values,
                                                                    rumus_sasaran: [...values.map((item: any) => {
                                                                        return {
                                                                            id: item,
                                                                            label: optionRefIndikatorSasaran.find((itemRef: any) => itemRef.value === item)?.label,
                                                                            rumus: dataInputSasaran?.rumus_sasaran?.find((itemRumus: any) => itemRumus.id === item)?.rumus ?? '-'
                                                                        }
                                                                    })]
                                                                }
                                                            });
                                                        }}
                                                        options={optionRefIndikatorSasaran} />
                                                </div>

                                                <div className="">
                                                    <div className="mt-3 flex border-b border-white-light dark:border-[#191e3a] overflow-auto">
                                                        {dataInputSasaran?.rumus_sasaran?.map((item: any, index: number) => (
                                                            <Tippy content={item?.label} key={`rumus-` + index}>
                                                                <button type='button'
                                                                    onClick={(e) => {
                                                                        setViewIndikatorSasaran(index);
                                                                    }}
                                                                    className={viewIndikatorSasaran === index ?
                                                                        `max-w-[300px] truncate !border-white-light !border-b-white bg-primary text-white !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] block border border-transparent p-3.5 py-2` :
                                                                        `max-w-[300px] truncate !border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary`} >
                                                                    {item?.label}
                                                                </button>
                                                            </Tippy>
                                                        ))}
                                                    </div>
                                                </div>
                                                {dataInputSasaran?.rumus_sasaran?.map((item: any, index: number) => (
                                                    <div className={viewIndikatorSasaran === index ? `` : `hidden`}>
                                                        <label className="form-label font-normal text-xs mb-0.5">
                                                            Rumus {item?.label}
                                                        </label>
                                                        <textarea
                                                            name="name"
                                                            id="input-name"
                                                            placeholder={`Rumus ${item?.label}`}
                                                            value={item?.rumus}
                                                            autoComplete='off'
                                                            autoFocus={true}
                                                            onChange={(e) => {
                                                                setDataInputSasaran((prev: any) => {
                                                                    return {
                                                                        ...prev,
                                                                        rumus_sasaran: [...prev?.rumus_sasaran?.map((itemRumus: any) => {
                                                                            if (itemRumus.id === item?.id) {
                                                                                return {
                                                                                    ...itemRumus,
                                                                                    rumus: e.target.value
                                                                                }
                                                                            }
                                                                            return itemRumus;
                                                                        })]
                                                                    }
                                                                });
                                                            }}
                                                            className="form-input font-normal min-h-[200px] resize-none"></textarea>
                                                        <div id="error-name" className="validation-elements text-red-500 text-xs"></div>
                                                    </div>
                                                ))}

                                            </form>

                                            <div className="flex justify-end items-center mt-4">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setModalInputSasaran(false)}>
                                                    Batalkan
                                                </button>

                                                {saveLoading == false ? (
                                                    <>
                                                        <button type="button" className="btn btn-success ltr:ml-4 rtl:mr-4" onClick={() => save('sasaran')}>
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
    return (
        <Page403 />
    );
}
export default Index;
