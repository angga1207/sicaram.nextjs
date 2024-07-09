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
import { faCalendarAlt, faCalendarPlus, faCog, faEdit, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { fetchPeriodes, fetchKegiatans, fetchSubKegiatans, fetchSubKegiatan, fetchInstances } from '../../../apis/fetchdata';
import { storeSubKegiatan, updateSubKegiatan, deleteSubKegiatan } from '../../../apis/storedata';
import { set } from 'lodash';
import IconPencil from '@/components/Icon/IconPencil';
import IconLayoutGrid from '@/components/Icon/IconLayoutGrid';
import IconListCheck from '@/components/Icon/IconListCheck';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
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

const Index = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Master SubKegiatan'));
    });

    const [CurrentUser, setCurrentUser] = useState<any>([]);
    useEffect(() => {
        if (window) {
            if (localStorage.getItem('user')) {
                setCurrentUser(JSON.parse(localStorage.getItem('user') ?? '{[]}') ?? []);
            }
        }
    }, []);

    const { t, i18n } = useTranslation();

    const [datas, setDatas] = useState([]);
    const [isDatasEmpty, setIsDatasEmpty] = useState<any>(false)
    const [periodes, setPeriodes] = useState<any>([]);
    const [periode, setPeriode] = useState(1);
    const [kegiatans, setKegiatans] = useState<any>([]);
    const [instance, setInstance] = useState<any>(CurrentUser?.instance_id ?? null);
    const [instances, setInstances] = useState<any>([]);
    const [search, setSearch] = useState('');
    const [modalInput, setModalInput] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [viewType, setViewType] = useState<any>('grid')
    const [dataInput, setDataInput] = useState<any>({
        inputType: 'create',
        id: '',
        periode_id: periode,
        kegiatan_id: '',
        instance_id: instance,
        name: '',
        code: '',
        fullcode: '',
        parent_code: '',
        description: '',
    });

    useEffect(() => {
        setInstance(CurrentUser?.instance_id ?? null);
    }, [CurrentUser]);

    useEffect(() => {
        fetchPeriodes().then((data) => {
            setPeriodes(data.data);
        });
        if (instance) {
            fetchKegiatans(periode, instance).then((data) => {
                const bdgs = data.data.map((item: any) => {
                    if (item.type == 'kegiatan') {
                        return item;
                    }
                }).filter((item: any) => item != undefined);
                setKegiatans(bdgs);
            });
        }
        fetchInstances().then((data) => {
            setInstances(data.data);
        });
    }, [instance]);

    useEffect(() => {
        if (instance) {
            fetchSubKegiatans(periode, instance).then((data) => {
                if (data.status == 'success') {
                    if (data.data.length == 0) {
                        setIsDatasEmpty(true)
                        showAlert('error', 'Sub Kegiatan tidak ditemukan!');
                    }
                    setDatas(data.data);
                }
                if (data.status == 'no instance') {
                    setDatas([]);
                }
            });
        }
    }, [instance]);

    useEffect(() => {
        if (instance) {
            const timer = setTimeout(() => {
                reRenderDatas();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [search]);

    const reRenderDatas = () => {
        if (search.length >= 3 || search.length == 0) {
            fetchSubKegiatans(periode, instance, search).then((data) => {
                setDatas((data?.data));
            });
        }
    }

    const addSubKegiatan = () => {
        setSaveLoading(false);
        var elements = document.getElementsByClassName('validation-elements');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = '';
        }
        setDataInput({
            inputType: 'create',
            id: '',
            periode_id: periode,
            kegiatan_id: '',
            instance_id: instance,
            name: '',
            code: '',
            fullcode: '',
            parent_code: '',
            description: '',
        });
        setModalInput(true);
    }

    const addDataOnSpesific = (kegiatan_id: any) => {
        setSaveLoading(false);
        var elements = document.getElementsByClassName('validation-elements');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = '';
        }
        setDataInput({
            inputType: 'create',
            id: '',
            periode_id: periode,
            kegiatan_id: kegiatan_id,
            instance_id: instance,
            name: '',
            code: '',
            fullcode: '',
            parent_code: kegiatans?.filter((data: any) => data.id == kegiatan_id)[0].code ?? '',
            description: '',
        });
        setModalInput(true);
    }

    const editSubKegiatan = (id: any) => {
        setSaveLoading(false);
        var elements = document.getElementsByClassName('validation-elements');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = '';
        }
        setDataInput({
            inputType: 'edit',
            id: '',
            periode_id: periode,
            instance_id: instance,
            kegiatan_id: null,
            name: null,
            code: null,
            fullcode: null,
            parent_code: null,
            description: null,
        });
        fetchSubKegiatan(id).then((data) => {
            if (data.status == 'success') {
                setDataInput({
                    inputType: 'edit',
                    id: data.data.id,
                    periode_id: data.data.periode_id,
                    kegiatan_id: data.data.kegiatan_id,
                    instance_id: data.data.instance_id,
                    name: data.data.name ?? '',
                    code: data.data.code ?? '',
                    parent_code: data.data.parent_code ?? '',
                    fullcode: data.data.fullcode ?? '',
                    description: data.data.description ?? '',
                });
            }
        });
        setModalInput(true);

    }

    const changeKegiatan = (e: any) => {
        const Parent = kegiatans.filter((data: any) => data.id == e);
        setDataInput((prevState: any) => ({
            ...prevState,
            kegiatan_id: e,
            parent_code: Parent[0].fullcode ?? '',
        }));
    }

    const save = () => {
        setSaveLoading(true);
        var elements = document.getElementsByClassName('validation-elements');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = '';
        }
        if (dataInput.inputType == 'create') {
            storeSubKegiatan(dataInput).then((data) => {
                if (data.status == 'success') {
                    setModalInput(false);
                    setInstance(instance)
                    fetchSubKegiatans(periode, instance, search).then((data) => {
                        setDatas((data?.data));
                    });
                    showAlert('success', data.message);
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
                if (data.status == 'error') {
                    showAlert('error', data.message);
                }
                setSaveLoading(false);
            });
        } else {
            updateSubKegiatan(dataInput).then((data) => {
                if (data.status == 'success') {
                    setModalInput(false);
                    fetchSubKegiatans(periode, instance, search).then((data) => {
                        setDatas((data?.data));
                    });
                    showAlert('success', data.message);
                }
                if (data.status == 'error') {
                    showAlert('error', data.message);
                }
                setSaveLoading(false);
            });
        }
    }

    const confirmDelete = async (id: number) => {
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
                title: 'Hapus SubKegiatan?',
                text: "Apakah Anda yakin untuk menghapus SubKegiatan Ini!",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Tidak!',
                reverseButtons: true,
                padding: '2em',
            })
            .then((result) => {
                if (result.value) {
                    deleteSubKegiatan(id ?? null).then((data) => {
                        if (data.status == 'success') {
                            fetchSubKegiatans(periode, instance, search).then((data) => {
                                setDatas((data?.data));
                            });
                            swalWithBootstrapButtons.fire('Terhapus!', data.message, 'success');
                        }
                        if (data.status == 'error') {
                            showAlert('error', data.message);
                        }
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire('Batal', 'Batal menghapus SubKegiatan', 'info');
                }
            });
    }


    return (
        <>
            <div className="">

                <div className="">
                    <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5">
                        <h2 className="text-lg leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                            Daftar Sub Kegiatan {instances?.[instance - 1]?.name ?? ''}
                        </h2>

                        <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">

                            {instance ? (
                                <>
                                    <div className="relative">
                                        <input type="search"
                                            className="form-input rtl:pl-12 ltr:pr-12"
                                            placeholder='Cari Sub Kegiatan...'
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                        <div className="absolute rtl:left-0 ltr:right-0 top-0 bottom-0 flex items-center justify-center w-12 h-full">
                                            <IconSearch className="w-4 h-4 text-slate-400"></IconSearch>
                                        </div>
                                    </div>

                                    <button type="button" className="btn btn-info whitespace-nowrap" onClick={() => addSubKegiatan()} >
                                        <IconPlus className="w-4 h-4" />
                                        <span className="ltr:ml-2 rtl:mr-2">Tambah</span>
                                    </button>

                                    {(CurrentUser?.role_id == 1 || CurrentUser?.role_id == 2 || CurrentUser?.role_id == 3 || CurrentUser?.role_id == 4 || CurrentUser?.role_id == 5 || CurrentUser?.role_id == 6 || CurrentUser?.role_id == 7 || CurrentUser?.role_id == 8) && (
                                        <button type="button" className="btn btn-secondary whitespace-nowrap" onClick={(e) => {
                                            e.preventDefault();
                                            setInstance(null);
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
                                                <IconPencil className="w-4 h-4 mr-2" />
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
                                                        <IconPencil className="w-4 h-4 mr-1" />
                                                        Buka
                                                    </button>
                                                    {/* <button type="button" className="btn btn-outline-secondary px-2 py-1 whitespace-nowrap text-[10px]">
                                                    <IconLaptop className="w-4 h-4 mr-1" />
                                                    Lihat Laporan
                                                </button> */}
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
                    <div className="panel">
                        <div className="table-responsive mb-5">
                            <table className="align-middle">
                                <thead>
                                    <tr>
                                        <th className='!py-5 w-[100px] !text-center'>
                                            Kode
                                        </th>
                                        <th colSpan={2} className='!py-5 min-w-[500px]'>
                                            Nama Sub Kegiatan
                                        </th>
                                        <th className="!py-5 !text-center w-[50px]">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {(datas?.length == 0 && !search && isDatasEmpty === false) && (
                                        <>
                                            <tr>
                                                <td colSpan={5} className="text-center">
                                                    <div className="w-full h-[50px] rounded animate-pulse bg-slate-200">
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={5} className="text-center">
                                                    <div className="w-full h-[50px] rounded animate-pulse bg-slate-200">
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={5} className="text-center">
                                                    <div className="w-full h-[50px] rounded animate-pulse bg-slate-200">
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={5} className="text-center">
                                                    <div className="w-full h-[50px] rounded animate-pulse bg-slate-200">
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={5} className="text-center">
                                                    <div className="w-full h-[50px] rounded animate-pulse bg-slate-200">
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={5} className="text-center">
                                                    <div className="w-full h-[50px] rounded animate-pulse bg-slate-200">
                                                    </div>
                                                </td>
                                            </tr>
                                        </>
                                    )}

                                    {(datas?.length == 0 && !search && isDatasEmpty === true) && (
                                        <>
                                            <tr>
                                                <td colSpan={5}>
                                                    <div className="text-center text-lg font-semibold">
                                                        Program Tidak Ditemukan!
                                                    </div>
                                                </td>
                                            </tr>
                                        </>
                                    )}

                                    {datas?.map((data: any) => {
                                        return (
                                            <tr className={data?.type != 'sub-kegiatan' ? 'cursor-pointer group relative bg-green-100 dark:bg-green-800' : 'cursor-pointer group relative hover:bg-slate-100 dark:hover:bg-slate-700'}>
                                                <td className='!py-5'>
                                                    <div className="text-center">
                                                        {data?.fullcode}
                                                    </div>
                                                </td>
                                                {data?.type == 'sub-kegiatan' ? (
                                                    <>
                                                        <td className='!py-5' onClick={() => editSubKegiatan(data?.id)}>
                                                            <Tippy content="Tekan untuk Edit">
                                                                <span>
                                                                    {data?.name}
                                                                </span>
                                                            </Tippy>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className='!py-5'>
                                                            <span>
                                                                {data?.name}
                                                            </span>
                                                        </td>
                                                    </>
                                                )}
                                                <td className='w-[200px]' onClick={() => editSubKegiatan(data?.id)}>
                                                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100">
                                                        <Tippy content={`Dibuat Pada ` +
                                                            new Date(data?.created_at).toLocaleDateString('id-ID', {
                                                                weekday: 'short',
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })
                                                        }>
                                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                                <FontAwesomeIcon icon={faCalendarPlus} className="w-3 h-3" />
                                                                {data?.created_by}
                                                            </div>
                                                        </Tippy>
                                                        <Tippy content={`Diperbarui Pada ` +
                                                            new Date(data?.updated_at).toLocaleDateString('id-ID', {
                                                                weekday: 'short',
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })
                                                        }>
                                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                                <FontAwesomeIcon icon={faCalendarAlt} className="w-3 h-3" />
                                                                {data?.updated_by}
                                                            </div>
                                                        </Tippy>
                                                    </div>
                                                </td>
                                                <td className="relative">
                                                    <div className="flex justify-center items-center gap-2 absolute inset-y-0 inset-x-0 w-full">
                                                        {data?.type == 'sub-kegiatan' ? (
                                                            <>
                                                                <Tippy content="Edit">
                                                                    <button type="button" onClick={() => editSubKegiatan(data?.id)}>
                                                                        <IconEdit className="m-auto text-blue-600 hover:text-blue-800" />
                                                                    </button>
                                                                </Tippy>
                                                                <Tippy content="Delete">
                                                                    <button type="button" onClick={() => confirmDelete(data?.id)}>
                                                                        <IconTrashLines className="m-auto text-red-600 hover:text-red-800" />
                                                                    </button>
                                                                </Tippy>
                                                            </>
                                                        ) : (
                                                            <Tippy content="Tambah Kegiatan">
                                                                <button type="button" onClick={() => addDataOnSpesific(data?.id)}>
                                                                    <IconPlus className="m-auto text-blue-600 hover:text-blue-800" />
                                                                </button>
                                                            </Tippy>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                </tbody>
                            </table>
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
                                                {dataInput.inputType == 'create' ? 'Tambah Sub Kegiatan' : 'Edit Sub Kegiatan'}
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
                                                            Kegiatan
                                                            <span className='text-red-600 mx-1'>*</span>
                                                        </label>
                                                        {(dataInput.inputType == 'edit' && dataInput.name == null) ? (
                                                            <>
                                                                <div className="w-full form-input text-slate-400">
                                                                    <div className="dots-loading">Memuat...</div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="">
                                                                    <Select
                                                                        className='text-sm font-semibold'
                                                                        placeholder="Pilih Kegiatan"
                                                                        autoFocus={false}
                                                                        options={
                                                                            kegiatans?.map((data: any, index: number) => {
                                                                                return {
                                                                                    value: data?.id,
                                                                                    label: data?.fullcode + ' - ' + data?.name,
                                                                                }
                                                                            })
                                                                        }

                                                                        value={kegiatans?.filter((data: any) => data.id == dataInput?.kegiatan_id).map((data: any) => {
                                                                            return {
                                                                                value: data.id,
                                                                                label: data.fullcode + ' - ' + data.name,
                                                                            };
                                                                        })[0]}
                                                                        isSearchable={true}
                                                                        onChange={
                                                                            (e: any) => {
                                                                                setDataInput((prev: any) => {
                                                                                    return {
                                                                                        ...prev,
                                                                                        kegiatan_id: e.value,
                                                                                    };
                                                                                });
                                                                            }
                                                                        }
                                                                    />
                                                                    <div id="error-kegiatan_id" className='validation-elements text-red-500 text-xs'></div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div className='xl:col-span-2'>
                                                        <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                            Nama Sub Kegiatan
                                                            <span className='text-red-600 mx-1'>*</span>
                                                        </label>
                                                        {(dataInput.inputType == 'edit' && dataInput.name == null) ? (
                                                            <>
                                                                <div className="w-full form-input text-slate-400">
                                                                    <div className="dots-loading">Memuat...</div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="">
                                                                    <textarea
                                                                        name="name"
                                                                        id="name"
                                                                        onKeyDown={(e) => {
                                                                            if (e.key == 'Enter') {
                                                                                e.preventDefault();
                                                                            }
                                                                        }}
                                                                        className="form-textarea min-h-[70px] resize-none"
                                                                        placeholder="Masukkan Sub Kegiatan"
                                                                        value={dataInput.name}
                                                                        autoComplete='off'
                                                                        onChange={(e) => setDataInput({ ...dataInput, name: e.target.value })}
                                                                    ></textarea>
                                                                    <div id="error-name" className='validation-elements text-red-500 text-xs'></div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label htmlFor="alias" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                            Kode Sub Kegiatan
                                                            <span className='text-red-600 mx-1'>*</span>
                                                        </label>
                                                        {(dataInput.inputType == 'edit' && dataInput.code == null) ? (
                                                            <>
                                                                <div className="w-full form-input text-slate-400">
                                                                    <div className="dots-loading">Memuat...</div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="">
                                                                    <input
                                                                        type="text"
                                                                        name="code"
                                                                        id="code"
                                                                        className="form-input"
                                                                        placeholder="Masukkan Kode Sub Kegiatan"
                                                                        value={dataInput.code}
                                                                        autoComplete='off'
                                                                        onChange={(e) => setDataInput({ ...dataInput, code: e.target.value })}
                                                                    />
                                                                    <div id="error-code" className='validation-elements text-red-500 text-xs'></div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                            Fullcode
                                                        </label>
                                                        {(dataInput.inputType == 'edit' && dataInput.fullcode == null) ? (
                                                            <>
                                                                <div className="w-full form-input text-slate-400">
                                                                    <div className="dots-loading">Memuat...</div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <input
                                                                    type="text"
                                                                    name="fullcode"
                                                                    id="fullcode"
                                                                    className="form-input bg-slate-200"
                                                                    placeholder="Pilih Bidang & Masukkan Kode"
                                                                    value={dataInput.parent_code && dataInput.parent_code + '.' + dataInput.code}
                                                                    readOnly={true}
                                                                />
                                                                <div id="error-fullcode" className='validation-elements text-red-500 text-xs'></div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div className='col-span-2'>
                                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                            Deskripsi
                                                        </label>
                                                        {(dataInput.inputType == 'edit' && dataInput.description == null) ? (
                                                            <>
                                                                <div className="w-full form-input text-slate-400">
                                                                    <div className="dots-loading">Memuat...</div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <textarea
                                                                    name="description"
                                                                    id="description"
                                                                    className="form-input h-[150px] resize-none"
                                                                    placeholder="Masukkan Deskripsi...."
                                                                    value={dataInput.description}
                                                                    onChange={(e) => setDataInput({ ...dataInput, description: e.target.value })}></textarea>
                                                                <div id="error-description" className='validation-elements text-red-500 text-xs'></div>
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

            </div>
        </>
    );
}

export default Index;

