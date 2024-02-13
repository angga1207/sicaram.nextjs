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
import { faCalendar, faCalendarAlt, faCalendarPlus, faCog, faEdit, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { fetchPeriodes, fetchBidangs, fetchPrograms, fetchProgram, fetchInstances } from '../../../apis/fetchdata';
import { storeProgram, updateProgram, deleteProgram } from '../../../apis/storedata';
import { set } from 'lodash';

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
        dispatch(setPageTitle('Master Program'));
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
    const [periodes, setPeriodes] = useState([]);
    const [periode, setPeriode] = useState(1);
    const [bidangs, setBidangs] = useState([]);
    const [instance, setInstance] = useState<any>(null);
    const [instances, setInstances] = useState<any>([]);
    const [search, setSearch] = useState('');
    const [modalInput, setModalInput] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [dataInput, setDataInput] = useState({
        inputType: 'create',
        id: '',
        periode_id: periode,
        bidang_id: '',
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
        fetchBidangs(periode).then((data) => {
            const bdgs = data.data.map((item) => {
                if (item.type == 'bidang') {
                    return item;
                }
            }).filter((item) => item != undefined);

            setBidangs(bdgs);
        });
        fetchInstances().then((data) => {
            setInstances(data.data);
        });
    }, [instance]);

    useEffect(() => {
        if (instance) {
            fetchPrograms(periode, instance).then((data) => {
                if (data.status == 'success') {
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
            fetchPrograms(periode, instance, search).then((data) => {
                setDatas((data?.data));
            });
        }
    }

    const addProgram = () => {
        setSaveLoading(false);
        var elements = document.getElementsByClassName('validation-elements');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = '';
        }
        setDataInput({
            inputType: 'create',
            id: '',
            periode_id: periode,
            bidang_id: '',
            instance_id: instance,
            name: '',
            code: '',
            fullcode: '',
            parent_code: '',
            description: '',
        });
        setModalInput(true);
        console.log(dataInput, instance);
    }

    const addDataOnSpesific = (bidang_id: any) => {
        setSaveLoading(false);
        var elements = document.getElementsByClassName('validation-elements');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = '';
        }
        setDataInput({
            inputType: 'create',
            id: '',
            periode_id: periode,
            bidang_id: bidang_id,
            instance_id: instance,
            name: '',
            code: '',
            fullcode: '',
            parent_code: bidangs.filter((data) => data.id == bidang_id)[0].code ?? '',
            description: '',
        });
        setModalInput(true);
    }

    const editProgram = (id: any) => {
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
            bidang_id: null,
            name: null,
            code: null,
            fullcode: null,
            parent_code: null,
            description: null,
        });
        fetchProgram(id).then((data) => {
            if (data.status == 'success') {
                setDataInput({
                    inputType: 'edit',
                    id: data.data.id,
                    periode_id: data.data.periode_id,
                    bidang_id: data.data.bidang_id,
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

    const changeBidang = (e) => {
        const Parent = bidangs.filter((data) => data.id == e);
        setDataInput((prevState) => ({
            ...prevState,
            bidang_id: e,
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
            storeProgram(dataInput).then((data) => {
                if (data.status == 'success') {
                    setModalInput(false);
                    setInstance(instance)
                    fetchPrograms(periode, instance, search).then((data) => {
                        setDatas((data?.data));
                    });
                    showAlert('success', data.message);
                }
                if (data.status == 'error validation') {
                    document.getElementById('error-name').innerHTML = data.message.name?.[0] ?? '';
                    document.getElementById('error-bidang_id').innerHTML = data.message.bidang_id?.[0] ?? '';
                    document.getElementById('error-code').innerHTML = data.message.code?.[0] ?? '';
                    document.getElementById('error-fullcode').innerHTML = data.message.fullcode?.[0] ?? '';
                    document.getElementById('error-description').innerHTML = data.message.description?.[0] ?? '';
                    showAlert('error', 'Please check your input!');
                }
                if (data.status == 'error') {
                    showAlert('error', data.message);
                }
                setSaveLoading(false);
            });
        } else {
            updateProgram(dataInput).then((data) => {
                if (data.status == 'success') {
                    setModalInput(false);
                    fetchPrograms(periode, instance, search).then((data) => {
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
                title: 'Hapus Program?',
                text: "Apakah Anda yakin untuk menghapus Program Ini!",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Tidak!',
                reverseButtons: true,
                padding: '2em',
            })
            .then((result) => {
                if (result.value) {
                    deleteProgram(id).then((data) => {
                        if (data.status == 'success') {
                            fetchPrograms(periode, instance, search).then((data) => {
                                setDatas((data?.data));
                            });
                            swalWithBootstrapButtons.fire('Terhapus!', data.message, 'success');
                        }
                        if (data.status == 'error') {
                            showAlert('error', data.message);
                        }
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire('Batal', 'Batal menghapus Program', 'info');
                }
            });
    }


    return (
        <>
            <div className="">

                <div className="">
                    <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5">
                        <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                            Daftar Program {instances?.[instance - 1]?.name ?? ''}
                        </h2>
                        <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">

                            {(CurrentUser?.role_id == 1 || CurrentUser?.role_id == 2 || CurrentUser?.role_id == 3 || CurrentUser?.role_id == 4 || CurrentUser?.role_id == 5 || CurrentUser?.role_id == 6 || CurrentUser?.role_id == 7 || CurrentUser?.role_id == 8) && (
                                <>
                                    <div className="relative w-[300px]">
                                        <Select placeholder="Pilih Perangkat Daerah"
                                            options={
                                                instances.map((data) => {
                                                    return {
                                                        value: data.id,
                                                        label: data.name,
                                                    };
                                                })
                                            }
                                            value={instances.filter((data) => data.id == instance).map((data) => {
                                                return {
                                                    value: data.id,
                                                    label: data.name,
                                                };
                                            })[0]}
                                            isSearchable={true}
                                            onChange={(e) => setInstance(e.value)}
                                            defaultValue={instance} />
                                    </div>
                                </>
                            )}

                            <div className="relative">
                                <input type="search"
                                    className="form-input rtl:pl-12 ltr:pr-12"
                                    placeholder='Cari Program...'
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <div className="absolute rtl:left-0 ltr:right-0 top-0 bottom-0 flex items-center justify-center w-12 h-full">
                                    <IconSearch className="w-4 h-4 text-slate-400"></IconSearch>
                                </div>
                            </div>

                            <button type="button" className="btn btn-info whitespace-nowrap" onClick={() => addProgram()} >
                                <IconPlus className="w-4 h-4" />
                                <span className="ltr:ml-2 rtl:mr-2">Tambah</span>
                            </button>
                        </div>

                    </div>
                </div>

                <div className="panel">
                    <div className="table-responsive mb-5">
                        <table className="align-middle">
                            <thead>
                                <tr>
                                    <th className='!py-5 w-[100px] !text-center'>
                                        Kode
                                    </th>
                                    <th colSpan={2} className='!py-5 min-w-[500px]'>
                                        Nama Program
                                    </th>
                                    <th className="!py-5 !text-center w-[100px]">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {(!datas || (datas.length == 0 && !search)) ? (
                                    <>
                                        {instance == null ? (
                                            <>
                                                <tr>
                                                    <td colSpan={5} className="text-center !p-5 bg-slate-200">
                                                        <div className="text-center font-bold text-xl">
                                                            Belum ada Perangkat Daerah yang dipilih
                                                        </div>
                                                    </td>
                                                </tr>
                                            </>
                                        ) : (
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
                                    </>

                                ) : (
                                    <>
                                        {datas.map((data) => {
                                            return (
                                                <tr className={data?.type != 'program' ? 'cursor-pointer group relative bg-green-100 dark:bg-green-800' : 'cursor-pointer group relative hover:bg-slate-100 dark:hover:bg-slate-700'}>
                                                    <td className='!py-5'>
                                                        <div className="text-center">
                                                            {data?.fullcode}
                                                        </div>
                                                    </td>
                                                    {data?.type == 'program' ? (
                                                        <>
                                                            <td className='!py-5' onClick={() => editProgram(data?.id)}>
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
                                                    <td className='w-[150px]' onClick={() => editProgram(data?.id)}>
                                                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100">
                                                            {data?.type == 'program' && (
                                                                <>
                                                                    <Tippy content="Dibuat Pada">
                                                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                                                            <FontAwesomeIcon icon={faCalendarPlus} className="w-3 h-3" />
                                                                            <div className="whitespace-nowrap">
                                                                                {
                                                                                    new Date(data?.created_at).toLocaleDateString('id-ID', {
                                                                                        weekday: 'short',
                                                                                        year: 'numeric',
                                                                                        month: 'short',
                                                                                        day: 'numeric',
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </Tippy>
                                                                    <Tippy content="Diperbarui Pada">
                                                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                                                            <FontAwesomeIcon icon={faCalendarAlt} className="w-3 h-3" />
                                                                            <div className="whitespace-nowrap">
                                                                                {
                                                                                    new Date(data?.updated_at).toLocaleDateString('id-ID', {
                                                                                        weekday: 'short',
                                                                                        year: 'numeric',
                                                                                        month: 'short',
                                                                                        day: 'numeric',
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </Tippy>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="relative">
                                                        <div className="flex justify-center items-center gap-2 absolute inset-y-0 inset-x-0 w-full">
                                                            {data?.type == 'program' ? (
                                                                <>
                                                                    <Tippy content="Edit">
                                                                        <button type="button" onClick={() => editProgram(data?.id)}>
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
                                                                <Tippy content="Tambah Program">
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
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>


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
                                                {dataInput.inputType == 'create' ? 'Tambah Program' : 'Edit Program'}
                                            </h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalInput(false)}>
                                                <IconX></IconX>
                                            </button>
                                        </div>
                                        <div className="p-5">

                                            <div className="space-y-3">
                                                <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
                                                    <div className='xl:col-span-2'>
                                                        <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                            Nama Program
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
                                                                        onKeyDown={(e) => {
                                                                            if (e.key == 'Enter') {
                                                                                e.preventDefault();
                                                                            }
                                                                        }}
                                                                        className="form-textarea min-h-[70px] resize-none"
                                                                        placeholder="Masukkan Program"
                                                                        value={dataInput.name}
                                                                        autoComplete='off'
                                                                        onChange={(e) => setDataInput({ ...dataInput, name: e.target.value })}
                                                                    ></textarea>
                                                                    <div id="error-name" className='validation-elements text-red-500 text-xs'></div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div className='xl:col-span-2'>
                                                        <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                            Bidang Urusan
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
                                                                    <select
                                                                        name="bidang_id"
                                                                        id="bidang_id"
                                                                        className='form-select'
                                                                        value={dataInput.bidang_id}
                                                                        onChange={(e) => changeBidang(e.target.value)}
                                                                    >
                                                                        <option value="" hidden>Pilih Bidang Urusan</option>
                                                                        {bidangs.map((data) => {
                                                                            return (
                                                                                <option key={data?.id} value={data?.id}>
                                                                                    {data?.fullcode + ' - ' + data?.name}
                                                                                </option>
                                                                            );
                                                                        })}
                                                                    </select>
                                                                    <div id="error-bidang_id" className='validation-elements text-red-500 text-xs'></div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label htmlFor="alias" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                            Kode Program
                                                            <span className='text-red-600 mx-1'>*</span>
                                                        </label>
                                                        {(dataInput.inputType == 'edit' && dataInput.code == null) ? (
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
                                                                    <input
                                                                        type="text"
                                                                        name="code"
                                                                        id="code"
                                                                        className="form-input"
                                                                        placeholder="Masukkan Kode Program"
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

