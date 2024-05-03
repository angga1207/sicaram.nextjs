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

import IconTrashLines from '../../../components/Icon/IconTrashLines';
import IconPlus from '../../../components/Icon/IconPlus';
import IconEdit from '../../../components/Icon/IconEdit';
import IconX from '../../../components/Icon/IconX';
import IconCaretDown from '../../../components/Icon/IconCaretDown';
import IconSearch from '../../../components/Icon/IconSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faCalendarPlus, faCog, faEdit, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { fetchPeriodes, fetchUrusans, fetchUrusan } from '../../../apis/fetchdata';
import { storeUrusan, updateUrusan, deleteUrusan } from '../../../apis/storedata';
import { number } from 'yup';

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
        dispatch(setPageTitle('Master Urusan'));
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
    const [search, setSearch] = useState('');
    const [modalInput, setModalInput] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [dataInput, setDataInput] = useState<any>({
        inputType: 'create',
        id: '',
        periode_id: '',
        name: '',
        code: '',
        fullcode: '',
        description: '',
    });


    useEffect(() => {
        fetchPeriodes().then((data) => {
            setPeriodes(data.data);
        });
    }, []);

    useEffect(() => {
        fetchUrusans(periode).then((data) => {
            if (data.status == 'success') {
                setDatas(data.data);
            }
        });
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            reRenderDatas();
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const reRenderDatas = () => {
        if (search.length >= 3 || search.length == 0) {
            fetchUrusans(periode, search).then((data) => {
                setDatas((data?.data));
            });
        }
    }

    const addUrusan = () => {
        setSaveLoading(false);
        var elements = document.getElementsByClassName('validation-elements');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = '';
        }
        setDataInput({
            inputType: 'create',
            id: '',
            periode_id: periode,
            name: '',
            code: '',
            fullcode: '',
            description: '',
        });
        setModalInput(true);
    }

    const editUrusan = (id: any) => {
        setSaveLoading(false);
        var elements = document.getElementsByClassName('validation-elements');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = '';
        }
        setDataInput({
            inputType: 'edit',
            id: '',
            periode_id: periode,
            name: null,
            code: null,
            fullcode: null,
            description: null,
        });
        fetchUrusan(id).then((data) => {
            if (data.status == 'success') {
                setDataInput({
                    inputType: 'edit',
                    id: data.data.id,
                    periode_id: data.data.periode_id,
                    name: data.data.name,
                    code: data.data.code,
                    fullcode: data.data.fullcode,
                    description: data.data.description,
                });
            }
        });
        setModalInput(true);
    }

    const save = () => {
        setSaveLoading(true);
        var elements = document.getElementsByClassName('validation-elements');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = '';
        }
        if (dataInput.inputType == 'create') {
            storeUrusan(dataInput).then((data) => {
                if (data.status == 'success') {
                    setModalInput(false);
                    fetchUrusans(periode, search).then((data) => {
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
            updateUrusan(dataInput).then((data) => {
                if (data.status == 'success') {
                    setModalInput(false);
                    fetchUrusans(periode, search).then((data) => {
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
                title: 'Hapus Urusan?',
                text: "Apakah Anda yakin untuk menghapus Urusan Ini!",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Tidak!',
                reverseButtons: true,
                padding: '2em',
            })
            .then((result) => {
                if (result.value) {
                    deleteUrusan(id ?? null).then((data) => {
                        if (data.status == 'success') {
                            fetchUrusans(periode, search).then((data) => {
                                setDatas((data?.data));
                            });
                            swalWithBootstrapButtons.fire('Terhapus!', data.message, 'success');
                        }
                        if (data.status == 'error') {
                            showAlert('error', data.message);
                        }
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire('Batal', 'Batal menghapus Urusan', 'info');
                }
            });
    }



    if (CurrentUser?.role_id >= 9) {
        return (
            <>
                <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-5xl font-bold text-slate-500 dark:text-slate-400">
                            403
                        </div>
                        <div className="text-2xl font-medium text-slate-600 dark:text-slate-400">
                            Forbidden
                        </div>
                        <div className="text-slate-600 dark:text-slate-400">
                            You are not allowed to access this page!
                        </div>
                        <div className="mt-5">
                            <Link href="/">
                                <div className="btn btn-outline-primary">
                                    Back to Home
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="">

                <div className="">
                    <div className="flex items-center justify-between mb-5 px-5">
                        <h2 className="text-lg leading-6 font-bold text-[#3b3f5c] dark:text-white-light">
                            Daftar Urusan
                        </h2>
                        <div className="flex items-center justify-center gap-1">

                            <div className="relative">
                                <input type="search"
                                    className="form-input rtl:pl-12 ltr:pr-12"
                                    placeholder='Cari Urusan...'
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <div className="absolute rtl:left-0 ltr:right-0 top-0 bottom-0 flex items-center justify-center w-12 h-full">
                                    <IconSearch className="w-4 h-4 text-slate-400"></IconSearch>
                                </div>
                            </div>

                            <button type="button" className="btn btn-info whitespace-nowrap" onClick={() => addUrusan()} >
                                <IconPlus className="w-4 h-4" />
                                <span className="ltr:ml-2 rtl:mr-2">Tambah</span>
                            </button>
                        </div>

                    </div>
                </div>

                <div className="panel">
                    <div className="table-responsive mb-5">
                        <table className="table-hover align-middle">
                            <thead>
                                <tr>
                                    <th className='!py-5 w-[100px] !text-center'>
                                        Kode
                                    </th>
                                    <th colSpan={2} className='!py-5 min-w-[500px]'>
                                        Nama Urusan
                                    </th>
                                    <th className="!py-5 !text-center w-[100px]">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>

                                {datas?.map((data: any) => {
                                    return (
                                        <tr key={data?.id} className='cursor-pointer relative hover:bg-slate-100 dark:hover:bg-slate-700 group'>
                                            <td onClick={() => editUrusan(data?.id)}>
                                                <div className="text-center">
                                                    {data?.code}
                                                </div>
                                            </td>
                                            <td className='!py-5' onClick={() => editUrusan(data?.id)}>
                                                <Tippy content="Tekan untuk Edit">
                                                    <span>
                                                        {data?.name}
                                                    </span>
                                                </Tippy>
                                            </td>
                                            <td className='w-[150px]' onClick={() => editUrusan(data?.id)}>
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
                                                    <Tippy content="Edit">
                                                        <button type="button" onClick={() => editUrusan(data?.id)}>
                                                            <IconEdit className="m-auto text-blue-600 hover:text-blue-800" />
                                                        </button>
                                                    </Tippy>
                                                    <Tippy content="Delete">
                                                        <button type="button" onClick={() => confirmDelete(data?.id)}>
                                                            <IconTrashLines className="m-auto text-red-600 hover:text-red-800" />
                                                        </button>
                                                    </Tippy>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {(datas?.length == 0 && !search) && (
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
                                                {dataInput.inputType == 'create' ? 'Tambah Urusan' : 'Edit Urusan'}
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
                                                            Nama Urusan
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
                                                                    <input
                                                                        type="text"
                                                                        name="name"
                                                                        id="name"
                                                                        className="form-input"
                                                                        placeholder="Masukkan Urusan"
                                                                        value={dataInput.name}
                                                                        autoComplete='off'
                                                                        onChange={(e) => setDataInput({ ...dataInput, name: e.target.value })}
                                                                    />
                                                                    <div id="error-name" className='validation-elements text-red-500 text-xs'></div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label htmlFor="alias" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                            Kode Urusan
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
                                                                        placeholder="Masukkan Kode Urusan"
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
                                                                    placeholder="Masukkan Kode Terlebih Dahulu"
                                                                    value={dataInput.code}
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

