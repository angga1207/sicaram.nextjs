import { useEffect, useState, Fragment } from 'react';
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

import IconTrashLines from '../../../components/Icon/IconTrashLines';
import IconPlus from '../../../components/Icon/IconPlus';
import IconEdit from '../../../components/Icon/IconEdit';
import IconX from '../../../components/Icon/IconX';
import IconCaretDown from '../../../components/Icon/IconCaretDown';
import IconSearch from '../../../components/Icon/IconSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faCalendarPlus, faCog, faEdit, faExclamationTriangle, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { fetchPeriodes, fetchKegiatans, fetchInstances, fetchPrograms, fetchIndikatorSubKegiatans, fetchSubKegiatans } from '../../../apis/fetchdata';
import { storeIndikatorSubKegiatan, updateIndikatorSubKegiatan, deleteIndikatorSubKegiatan } from '../../../apis/storedata';
import { set } from 'lodash';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconLayoutGrid from '@/components/Icon/IconLayoutGrid';
import IconListCheck from '@/components/Icon/IconListCheck';
import IconPencil from '@/components/Icon/IconPencil';
import IconEye from '@/components/Icon/IconEye';
import LoadingSicaram from '@/components/LoadingSicaram';

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


const SubKegiatan = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Indikator Kinerja Sub Kegiatan'));
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

    const [datas, setDatas] = useState([]);
    const [periodes, setPeriodes] = useState([]);
    const [periode, setPeriode] = useState(1);
    const [instance, setInstance] = useState<any>(CurrentUser?.instance_id ?? null);
    const [instances, setInstances] = useState<any>([]);
    const [programs, setPrograms] = useState<any>([]);
    const [program, setProgram] = useState<any>(null);
    const [kegiatans, setKegiatans] = useState<any>([]);
    const [kegiatan, setKegiatan] = useState<any>(null);
    const [subkegiatans, setSubKegiatans] = useState<any>([]);
    const [subkegiatan, setSubKegiatan] = useState<any>(null);
    const [search, setSearch] = useState('');
    const [modalInput, setModalInput] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [viewType, setViewType] = useState<any>('grid')
    const [dataInput, setDataInput] = useState<any>({
        inputType: 'create',
        id: '',
        name: '',
        kegiatan_id: '',
        program_id: '',
        instance_id: '',
        periode_id: '',
    });

    useEffect(() => {
        setInstance(CurrentUser?.instance_id ?? null);
    }, [CurrentUser]);

    useEffect(() => {
        fetchPeriodes().then((data) => {
            setPeriodes(data.data);
        });
        fetchInstances().then((data) => {
            setInstances(data.data);
        });
        if (instance) {
            fetchPrograms(periode, instance).then((data) => {
                const prgs = data.data.map((item: any) => {
                    if (item.type == 'program') {
                        return item;
                    }
                }).filter((item: any) => item != undefined);
                setPrograms(prgs);
            });
            setProgram(null);
            setKegiatans([]);
            setKegiatan(null);
            setSubKegiatans([]);
            setSubKegiatan(null);
            setDatas([]);
        }
    }, [instance]);

    const addData = () => {
        setModalInput(true);
        setDataInput({
            inputType: 'create',
            id: '',
            name: '',
            sub_kegiatan_id: subkegiatan?.id ?? '',
            program_id: program?.id ?? '',
            instance_id: instance,
            periode_id: periode,
        });
    }

    const editData = (id: any) => {
        setModalInput(true);
        setDataInput({
            inputType: 'edit',
            id: id,
            name: datas.filter((data: any) => data.id == id).map((data: any) => data.name)[0],
            sub_kegiatan_id: subkegiatan?.id ?? '',
            program_id: program?.id ?? '',
            instance_id: instance,
            periode_id: periode,
        });
    }

    const save = () => {
        setSaveLoading(true);
        if (dataInput.inputType == 'create') {
            storeIndikatorSubKegiatan(dataInput).then((data) => {
                // console.log(dataInput)
                if (data.status == 'error') {
                    showAlert('error', data.message);
                }
                if (data.status == 'error validation') {
                    Object.keys(data.message).map((key: any, index: any) => {
                        let element = document.getElementById('error-' + key);
                        if (element) {
                            element.innerHTML = data.message[key][0];
                        }
                    });
                    showAlert('error', 'Please check your input!');
                }
                if (data.status == 'success') {
                    showAlert('success', data.message);
                    fetchIndikatorSubKegiatans(instance, subkegiatan?.id).then((datas) => {
                        if (datas.status == 'no instance') {
                            showAlert('error', 'Belum memilih Perangkat Daerah');
                        }
                        if (datas.status == 'success') {
                            setDatas(datas.data);
                        }
                    });
                    setModalInput(false);
                }
                setSaveLoading(false);
            });
        }
        if (dataInput.inputType == 'edit') {
            updateIndikatorSubKegiatan(dataInput).then((data) => {
                if (data.status == 'error') {
                    showAlert('error', data.message);
                }
                if (data.status == 'success') {
                    showAlert('success', data.message);
                    fetchIndikatorSubKegiatans(instance, subkegiatan?.id).then((datas) => {
                        if (datas.status == 'no instance') {
                            showAlert('error', 'Belum memilih Perangkat Daerah');
                        }
                        if (datas.status == 'success') {
                            setDatas(datas.data);
                        }
                    });
                    setModalInput(false);
                }
                setSaveLoading(false);
            });
        }
    }

    const confirmDelete = (id: any) => {
        Swal.fire({
            title: 'Hapus Data?',
            text: 'Data yang dihapus tidak dapat dikembalikan!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#f44336',
            cancelButtonColor: '#3b3f5c',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteIndikatorSubKegiatan(id).then((data) => {
                    if (data.status == 'error') {
                        showAlert('error', data.message);
                    }
                    if (data.status == 'success') {
                        showAlert('success', data.message);
                        fetchIndikatorSubKegiatans(instance, subkegiatan?.id).then((datas) => {
                            if (datas.status == 'no instance') {
                                showAlert('error', 'Belum memilih Perangkat Daerah');
                            }
                            if (datas.status == 'success') {
                                setDatas(datas.data);
                            }
                        });
                    }
                });
            }
        });
    }


    return (
        <>

            <div className="">

                <div className="">
                    <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5">
                        <h2 className="text-lg leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                            Indikator Kinerja Sub Kegiatan <br />
                            {instances?.[instance - 1]?.name ?? '\u00A0'}
                        </h2>
                        <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">

                            {instance ? (
                                <>
                                    {(CurrentUser?.role_id == 1 || CurrentUser?.role_id == 2 || CurrentUser?.role_id == 3 || CurrentUser?.role_id == 4 || CurrentUser?.role_id == 5 || CurrentUser?.role_id == 6 || CurrentUser?.role_id == 7 || CurrentUser?.role_id == 8) && (
                                        <button type="button" className="btn btn-secondary whitespace-nowrap" onClick={(e) => {
                                            e.preventDefault();
                                            setInstance(null);
                                            setKegiatan(null);
                                            setSubKegiatan(null);
                                        }} >
                                            <IconArrowBackward className="w-4 h-4" />
                                            <span className="ltr:ml-2 rtl:mr-2">
                                                Kembali
                                            </span>
                                        </button>
                                    )}
                                </>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => {
                                            setViewType('grid')
                                        }}
                                        className={viewType == 'grid'
                                            ? 'btn btn-dark text-white px-2.5'
                                            : 'btn btn-outline-dark text-slate-900 hover:text-white dark:text-white px-2.5'
                                        }
                                        type='button'>
                                        <IconLayoutGrid className='w-4 h-4' />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setViewType('list')
                                        }}
                                        className={viewType == 'list'
                                            ? 'btn btn-dark text-white px-2.5'
                                            : 'btn btn-outline-dark text-slate-900 hover:text-white dark:text-white px-2.5'
                                        }
                                        type='button'>
                                        <IconListCheck className='w-4 h-4' />
                                    </button>
                                </div>
                            )}

                            <div className="relative hidden">
                                <input type="search"
                                    className="form-input rtl:pl-12 ltr:pr-12"
                                    placeholder='Cari Indikator Kinerja Kegiatan...'
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <div className="absolute rtl:left-0 ltr:right-0 top-0 bottom-0 flex items-center justify-center w-12 h-full">
                                    <IconSearch className="w-4 h-4 text-slate-400"></IconSearch>
                                </div>
                            </div>

                            {subkegiatan && (
                                <>
                                    <button type="button" className="btn btn-info whitespace-nowrap" onClick={() => addData()} >
                                        <IconPlus className="w-4 h-4" />
                                        <span className="ltr:ml-2 rtl:mr-2">Tambah</span>
                                    </button>
                                </>
                            )}
                        </div>

                    </div>
                </div>

                {(!instance && viewType == 'grid') && (
                    <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-5 w-full">
                        {instances?.map((data: any, index: number) => {
                            return (
                                <div className="bg-white dark:bg-[#1c232f] rounded-md overflow-hidden text-center shadow relative">
                                    <div className="bg-slate-700 rounded-t-md bg-center bg-cover p-6 pb-0" style={
                                        {
                                            backgroundImage: "url('/assets/images/notification-bg.png')"
                                            // backgroundImage: data?.logo ? `url(${data?.logo})` : "url('/assets/images/notification-bg.png')"
                                        }
                                    }>
                                        <img className="object-contain w-4/5 h-40 mx-auto" src={data?.logo} alt="contact_image" />
                                    </div>
                                    <div className="px-2 py-4">
                                        <div className="cursor-pointer group"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setInstance(data.id);
                                            }}>
                                            <div className="text-lg font-semibold line-clamp-2 h-15 group-hover:text-primary">
                                                {data?.name}
                                            </div>
                                            <div className="text-white-dark group-hover:text-primary">
                                                ({data?.alias})
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-center gap-4 w-full">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setInstance(data.id);
                                                }}
                                                type="button"
                                                className="btn btn-outline-primary">
                                                <IconEye className="w-4 h-4 mr-2" />
                                                Buka
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {(!instance && viewType == 'list') && (
                    <div className="table-responsive panel">
                        <table className='table-hover'>
                            <thead className=''>
                                <tr>
                                    <th className="!text-center bg-dark text-white border !min-w-[500px]">
                                        Nama Perangkat Daerah
                                    </th>
                                    <th className="!text-center bg-dark text-white border !w-[150px]">
                                        Opt
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {instances?.map((data: any, index: number) => {
                                    return (
                                        <tr>
                                            <td className='!p-2 border'>
                                                <div className="flex items-center gap-x-3">
                                                    <div className="w-[38px] flex-none">
                                                        <img className="object-contain w-full h-[38px] mx-auto" src={data?.logo} alt="contact_image" />
                                                    </div>
                                                    <div className="font-semibold">
                                                        {data?.name}
                                                        <div className="text-white-dark text-xs font-normal group-hover:text-primary">
                                                            ({data?.alias})
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="!p-2 border">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setInstance(data.id);
                                                        }}
                                                        type="button"
                                                        className="btn btn-outline-primary px-2 py-1 whitespace-nowrap text-[10px]">
                                                        <IconEye className="w-4 h-4 mr-1" />
                                                        Buka
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {!instance && instances?.length == 0 && (
                    <>
                        <div className="w-full h-[calc(100vh-300px)] flex flex-col items-center justify-center">
                            {LoadingSicaram()}
                            <div className="dots-loading text-xl">Memuat Perangkat Daerah...</div>
                        </div>
                    </>
                )}

                {instance && (
                    <div className="relative mt-5 flex flex-col gap-5 lg:flex-row">

                        <div className="panel w-full lg:w-80 flex-none divide-y divide-[#ebedf2] !overflow-auto border-0 p-0 dark:divide-[#191e3a] lg:relative lg:block ps lg:h-[calc(100vh-200px)]">
                            {instance ? (
                                <>
                                    {!program ? (
                                        <>
                                            {programs?.map((data: any, index: any) => {
                                                return (
                                                    <div key={index} className="flex items-center p-4 hover:bg-blue-100 dark:hover:bg-[#192A3A] cursor-pointer group" onClick={
                                                        () => {
                                                            setProgram(data);
                                                            fetchKegiatans(periode, instance).then((datas) => {
                                                                if (datas.status == 'no instance') {
                                                                    showAlert('error', 'Belum memilih Perangkat Daerah');
                                                                }
                                                                if (datas.status == 'success') {
                                                                    const kgts = datas.data.map((item: any) => {
                                                                        if (item.type == 'kegiatan') {
                                                                            if (item.program_id == data.id) {
                                                                                return item;
                                                                            }
                                                                        }
                                                                    }).filter((item: any) => item != undefined);
                                                                    setKegiatans(kgts);
                                                                }
                                                            });
                                                        }
                                                    }>
                                                        <div className="ml-0">
                                                            <div className="text-sm font-medium text-gray-600 group-hover:text-blue-800 dark:text-gray-400">
                                                                {data?.name}
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                {data?.fullcode}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {programs?.length == 0 && (
                                                <>
                                                    <div className="w-full flex items-center p-4 bg-blue-200 hover:bg-blue-200 dark:hover:bg-[#192A3A] cursor-pointer group">
                                                        <div className="dots-loading-2 whitespace-nowrap text-sm font-medium text-gray-600 group-hover:text-blue-800 dark:text-gray-400">
                                                            Memuat Program...
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <Tippy content="Tekan untuk kembali ke Program">
                                                <div className="flex items-center p-4 bg-blue-100 cursor-pointer group" onClick={
                                                    () => {
                                                        setProgram(null);
                                                        setKegiatans([]);
                                                        setKegiatan(null);
                                                        setSubKegiatans([]);
                                                        setSubKegiatan(null);
                                                        setDatas([]);
                                                    }
                                                }>
                                                    <div className="ml-0">
                                                        <div className="text-sm font-medium text-blue-800">
                                                            {program?.name}
                                                        </div>
                                                        <div className="text-xs text-blue-800">
                                                            {program?.fullcode}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Tippy>
                                            <div className="">

                                            </div>
                                            <div className="divide-y divide-[#ebedf2]">
                                                {!kegiatan ? (
                                                    <>
                                                        {kegiatans.map((data: any, index: number) => {
                                                            return (
                                                                <>
                                                                    <div key={index} className={data?.id == kegiatan?.id ? 'flex items-center p-4 bg-orange-200 hover:bg-orange-200 dark:hover:bg-[#192A3A] cursor-pointer group' : 'flex items-center p-4 hover:bg-orange-100 dark:hover:bg-[#192A3A] cursor-pointer group'} onClick={
                                                                        () => {
                                                                            setKegiatan(data)
                                                                            fetchSubKegiatans(periode, instance).then((datas) => {
                                                                                if (datas.status == 'no instance') {
                                                                                    showAlert('error', 'Belum memilih Perangkat Daerah');
                                                                                }
                                                                                if (datas.status == 'success') {
                                                                                    const skgts = datas.data.map((item: any) => {
                                                                                        if (item.type == 'sub-kegiatan') {
                                                                                            if (item.kegiatan_id == data.id) {
                                                                                                return item;
                                                                                            }
                                                                                        }
                                                                                    }).filter((item: any) => item != undefined);
                                                                                    setSubKegiatans(skgts);
                                                                                }
                                                                            });
                                                                        }
                                                                    }>
                                                                        <div className="ml-3">
                                                                            <div className={data?.id == kegiatan?.id ? 'ml-1 text-sm font-bold text-orange-700 group-hover:text-orange-800 dark:text-gray-400' : 'text-sm font-medium text-gray-600 group-hover:text-orange-800 dark:text-gray-400'}>
                                                                                {data?.name}
                                                                            </div>
                                                                            <div className={data?.id == kegiatan?.id ? 'ml-1 text-xs text-gray-500 dark:text-gray-400' : 'text-xs text-gray-500 dark:text-gray-400'}>
                                                                                {data?.fullcode}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )
                                                        })}

                                                        {kegiatans?.length == 0 && (
                                                            <>
                                                                <div className="w-full flex items-center p-4 bg-orange-200 hover:bg-orange-200 dark:hover:bg-[#192A3A] cursor-pointer group">
                                                                    <div className="dots-loading-2 whitespace-nowrap text-sm font-medium text-gray-600 group-hover:text-orange-800 dark:text-gray-400">
                                                                        Memuat Kegiatan...
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="divide-y divide-[#ebedf2]">
                                                            <Tippy content="Tekan untuk kembali ke Kegiatan">
                                                                <div className='flex items-center p-4 bg-orange-100 cursor-pointer group' onClick={
                                                                    () => {
                                                                        setKegiatan(null);
                                                                        setSubKegiatan(null);
                                                                        setDatas([]);
                                                                    }
                                                                }>
                                                                    <div className="ml-3">
                                                                        <div className='ml-1 text-sm font-bold text-orange-800 dark:text-gray-400' >
                                                                            {kegiatan?.name}
                                                                        </div>
                                                                        <div className='ml-1 text-xs text-gray-500 dark:text-gray-400'>
                                                                            {kegiatan?.fullcode}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Tippy>

                                                            {subkegiatans?.map((data: any, index: any) => {
                                                                return (
                                                                    <>
                                                                        <div key={index} className={data?.id == subkegiatan?.id ? 'flex items-center p-4 bg-green-200 hover:bg-green-200 dark:hover:bg-[#192A3A] cursor-pointer group' : 'flex items-center p-4 bg-green-50 hover:bg-green-100 dark:hover:bg-[#192A3A] cursor-pointer group'} onClick={
                                                                            () => {
                                                                                setSubKegiatan(data);
                                                                                setDatas([])
                                                                                fetchIndikatorSubKegiatans(instance, data.id).then((datas) => {
                                                                                    if (datas.status == 'no instance') {
                                                                                        showAlert('error', 'Belum memilih Perangkat Daerah');
                                                                                    }
                                                                                    if (datas.status == 'success') {
                                                                                        setDatas(datas.data);
                                                                                    }
                                                                                });
                                                                            }
                                                                        }>
                                                                            <div className="ml-5">
                                                                                <div className={data?.id == subkegiatan?.id ? 'ml-2 text-sm font-bold text-green-700 group-hover:text-green-800 dark:text-gray-400' : 'text-sm font-medium text-gray-600 group-hover:text-green-800 dark:text-gray-400'}>
                                                                                    {data?.name}
                                                                                </div>
                                                                                <div className={data?.id == subkegiatan?.id ? 'ml-2 text-xs text-gray-500 dark:text-gray-400' : 'text-xs text-gray-500 dark:text-gray-400'}>
                                                                                    {data?.fullcode}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )
                                                            })}

                                                            {subkegiatans?.length == 0 && (
                                                                <>
                                                                    <div className="w-full flex items-center p-4 bg-green-200 hover:bg-green-200 dark:hover:bg-[#192A3A] cursor-pointer group">
                                                                        <div className="dots-loading-2 whitespace-nowrap text-sm font-medium text-gray-600 group-hover:text-green-800 dark:text-gray-400">
                                                                            Memuat Sub Kegiatan...
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}

                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className='text-center p-4 hover:bg-gray-100 dark:hover:bg-[#192A3A] cursor-pointer text-base font-bold'>
                                        Pilih Perangkat Daerah
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="panel flex-1 p-0">
                            {subkegiatan && (
                                <div className="text-center text-lg border-b bg-slate-100 px-4 py-2">
                                    Indikator Kinerja Kegiatan
                                    <div className='font-semibold'>
                                        "{kegiatan?.name ?? '\u00A0'}"
                                    </div>
                                </div>
                            )}
                            <div className="divide-y divide-[#ebedf2]">
                                {datas.map((indi: any, index: number) => {
                                    return (
                                        <>
                                            <div key={indi?.id} className="flex items-center justify-between p-5 px-3 text-lg group hover:bg-slate-100 cursor-pointer">
                                                <div className="flex items-center gap-2 grow" onClick={() => editData(indi?.id)}>
                                                    <div className="w-[20px]">
                                                        {index + 1}.
                                                    </div>
                                                    <div>
                                                        {indi?.name}
                                                    </div>
                                                </div>
                                                <div className="w-[50px] text-center">
                                                    <Tippy content="Delete">
                                                        <button type="button" onClick={() => confirmDelete(indi?.id)}>
                                                            <IconTrashLines className="m-auto text-red-600 hover:text-red-800" />
                                                        </button>
                                                    </Tippy>
                                                </div>
                                            </div>
                                        </>
                                    )
                                })}

                                {datas.length == 0 && (
                                    <>
                                        <div className='text-center p-4 hover:bg-gray-100 dark:hover:bg-[#192A3A] cursor-pointer text-base font-bold'>
                                            {subkegiatan ? (
                                                <>
                                                    Belum ada data
                                                </>
                                            ) : (
                                                <div className='flex items-center justify-center gap-x-2 text-amber-600 text-xl'>
                                                    <FontAwesomeIcon icon={faExclamationTriangle} className="w-10 h-10" />
                                                    <div>
                                                        Pilih Program, Kegiatan & Sub Kegiatan terlebih dahulu
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {subkegiatan && (
                                    <>
                                        <div className="pt-5 flex justify-center items-center w-full">
                                            <button type="button" className="btn btn-info whitespace-nowrap" onClick={() => addData()} >
                                                <IconPlus className="w-4 h-4" />
                                                <span className="ltr:ml-2 rtl:mr-2">Tambah</span>
                                            </button>
                                        </div>
                                    </>
                                )}

                            </div>
                        </div>
                    </div>
                )}

                <Transition appear show={modalInput} as={Fragment}>
                    <Dialog as="div" open={modalInput} onClose={() => setModalInput(false)}>
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
                                    <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-[80%] md:max-w-[50%] my-8 text-black dark:text-white-dark">
                                        <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                            <h5 className="font-bold text-lg">
                                                {dataInput.inputType == 'create' ? 'Tambah Indikator Kinerja' : 'Edit Indikator Kinerja'}
                                            </h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalInput(false)}>
                                                <IconX></IconX>
                                            </button>
                                        </div>
                                        <div className="p-5">

                                            <div className="space-y-3">
                                                <div className='grid grid-cols-1 xl:grid-cols-2 gap-y-4 gap-x-2'>

                                                    <div className='xl:col-span-2'>
                                                        <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                            Nama Indikator Kinerja
                                                            <span className='text-red-600 mx-1'>*</span>
                                                        </label>
                                                        {(dataInput.inputType == 'edit' && dataInput.name == null) ? (
                                                            <>
                                                                <div className="w-full form-input flex items-center gap-2 text-slate-400">
                                                                    <div>
                                                                        <span className="animate-spin border-4 border-transparent border-l-slate-500 rounded-full w-6 h-6 inline-block align-middle m-auto dark:border-l-dark"></span>
                                                                    </div>
                                                                    <div>
                                                                        Loading...
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="">
                                                                    <textarea
                                                                        name="name"
                                                                        id="name"
                                                                        className="form-input h-[250px] resize-none"
                                                                        placeholder="Masukkan Indikator Kinerja"
                                                                        value={dataInput.name}
                                                                        autoComplete='off'
                                                                        // disable new lines
                                                                        onKeyDown={(e) => {
                                                                            if (e.keyCode === 13) {
                                                                                e.preventDefault();
                                                                            }
                                                                        }}
                                                                        onChange={(e) => setDataInput({ ...dataInput, name: e.target.value })}></textarea>
                                                                    <div id="error-name" className='validation-elements text-red-500 text-xs'></div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="flex justify-end items-center mt-4">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setModalInput(false)}>
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

                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>

            </div >
        </>
    )
}

export default SubKegiatan;
