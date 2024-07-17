import { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';
import Dropdown from '../../components/Dropdown';
import Swal from 'sweetalert2';
import Link from 'next/link';

import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconPlus from '../../components/Icon/IconPlus';
import IconEdit from '../../components/Icon/IconEdit';
import IconX from '../../components/Icon/IconX';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconSearch from '../../components/Icon/IconSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faEdit, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { fetchInstances, fetchInstance } from '../../apis/fetchdata';
import { storeInstance, updateInstance, deleteInstance } from '../../apis/storedata';
import Page403 from '@/components/Layouts/Page403';

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
}

const Index = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Perangkat Daerah'));
    });

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

    const [datas, setDatas] = useState([]);
    const [search, setSearch] = useState('');
    const [modalInput, setModalInput] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [dataInput, setDataInput] = useState<any>({
        inputType: 'create',
        id: '',
        name: '',
        alias: '',
        code: '',
        logo: '',
        description: '',
        address: '',
        phone: '',
        email: '',
    });

    useEffect(() => {
        fetchInstances().then((data) => {
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
            fetchInstances(search).then((data) => {
                setDatas((data?.data));
            });
        }
    }

    const addInstance = () => {
        setSaveLoading(false);
        var elements = document.getElementsByClassName('validation-elements');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = '';
        }
        setDataInput({
            inputType: 'create',
            id: '',
            name: '',
            alias: '',
            code: '',
            logo: '',
            description: '',
            address: '',
            phone: '',
            email: '',
        });
        setModalInput(true);
    }

    const editInstance = (id: any) => {
        setSaveLoading(false);
        var elements = document.getElementsByClassName('validation-elements');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = '';
        }
        setDataInput({
            inputType: 'edit',
            id: '',
            name: null,
            alias: null,
            code: null,
            description: null,
            address: null,
            phone: null,
            email: null,
            logo: null,
        });
        fetchInstance(id).then((data) => {
            if (data.status == 'success') {
                setDataInput({
                    inputType: 'edit',
                    id: data.data.id,
                    name: data.data.name ?? '',
                    alias: data.data.alias ?? '',
                    code: data.data.code ?? '',
                    logo: '',
                    description: data.data.description ?? '',
                    address: data.data.address ?? '',
                    phone: data.data.phone ?? '',
                    email: data.data.email ?? '',
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
            storeInstance(dataInput).then((data) => {
                if (data.status == 'success') {
                    setModalInput(false);
                    fetchInstances(search).then((data) => {
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
                }
                if (data.status == 'error') {
                    showAlert('error', data.message);
                }
                setSaveLoading(false);
            });
        } else {
            updateInstance(dataInput).then((data) => {
                if (data.status == 'success') {
                    setModalInput(false);
                    fetchInstances(search).then((data) => {
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
                title: 'Hapus Perangkat Daerah?',
                text: "Apakah Anda yakin untuk menghapus Perangkat Daerah Ini!",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Tidak!',
                reverseButtons: true,
                padding: '2em',
            })
            .then((result) => {
                if (result.value) {
                    if (id) {
                        deleteInstance(id ?? null).then((data) => {
                            if (data.status == 'success') {
                                fetchInstances(search).then((data) => {
                                    setDatas((data?.data));
                                });
                                swalWithBootstrapButtons.fire('Terhapus!', data.message, 'success');
                            }
                            if (data.status == 'error') {
                                showAlert('error', data.message);
                            }
                        });
                    }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire('Batal', 'Batal menghapus Perangkat Daerah', 'info');
                }
            });
    }

    if (CurrentUser?.role_id && [1, 2, 3, 4, 5].includes(CurrentUser?.role_id)) {
        return (
            <>
                <div className="">

                    <div className="">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light">
                                Daftar Perangkat Daerah
                            </h2>
                            <div className="flex items-center justify-center gap-1">

                                <div className="relative">
                                    <input type="search"
                                        className="form-input rtl:pl-12 ltr:pr-12"
                                        placeholder='Cari Perangkat Daerah...'
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <div className="absolute rtl:left-0 ltr:right-0 top-0 bottom-0 flex items-center justify-center w-12 h-full">
                                        <IconSearch className="w-4 h-4 text-slate-400"></IconSearch>
                                    </div>
                                </div>

                                <button type="button" className="btn btn-info whitespace-nowrap" onClick={() => addInstance()} >
                                    <IconPlus className="w-4 h-4" />
                                    <span className="ltr:ml-2 rtl:mr-2">Tambah</span>
                                </button>
                            </div>

                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                        {datas?.map((data: any, index: number) => (
                            <div className="flex items-center justify-center relative dropdown">

                                <div className="max-w-[30rem] w-full h-full bg-white hover:bg-slate-100 shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:hover:bg-slate-700 dark:shadow-none cursor-pointer">
                                    <div className="p-5">
                                        <div className="flex items-center flex-col sm:flex-row gap-y-4" onClick={() => editInstance(data?.id)}>
                                            <div className="flex-1 ltr:sm:pr-5 rtl:sm:pl-5 text-center sm:text-left">
                                                <h5 className="text-[#3b3f5c] text-[15px] font-semibold dark:text-white-light">
                                                    {data?.name}
                                                </h5>
                                                <p className="mb-1 text-white-dark">
                                                    {data?.code}
                                                </p>
                                                <span className="badge bg-primary rounded-full capitalize">
                                                    {data?.status}
                                                </span>
                                            </div>
                                            <div className="mb-5 min-w-20 flex flex-col items-center justify-center rounded overflow-hidden">
                                                <div className="">
                                                    <img src={data?.logo} alt="profile" className="w-20 h-16 object-contain" />
                                                </div>

                                                <Tippy content={data?.alias}>
                                                    <div className="text-center mt-1 font-bold text-blue-700">
                                                        ({data?.alias})
                                                    </div>
                                                </Tippy>
                                            </div>
                                        </div>
                                        {/* <div className="font-semibold text-white-dark line-clamp-2" dangerouslySetInnerHTML={{ __html: data?.description }}></div> */}

                                        <div className="flex items-center justify-end gap-x-3 mt-4">
                                            {/* <div>
                                            <Link href={`/dashboard/` + data?.code} className='flex items-center gap-2 text-slate-400 hover:text-slate-600'>
                                                <FontAwesomeIcon icon={faEye} className="text-xs w-4 h-4" />
                                                Lihat
                                            </Link>
                                        </div> */}
                                            <Tippy content='Pengaturan'>
                                                <button type="button" className='flex items-center gap-2 text-slate-500 hover:text-slate-700'
                                                    onClick={() => editInstance(data?.id)}>
                                                    <FontAwesomeIcon icon={faEdit} className="text-xs w-4 h-4" />
                                                </button>
                                            </Tippy>
                                            <Tippy content='Hapus'>
                                                <button type="button" className='flex items-center gap-2 text-red-500 hover:text-red-700'
                                                    onClick={() => confirmDelete(data?.id)}>
                                                    <FontAwesomeIcon icon={faTrashAlt} className="text-xs w-4 h-4" />
                                                </button>
                                            </Tippy>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

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
                                    <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-[80%] md:max-w-[60%] my-8 text-black dark:text-white-dark">
                                        <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                            <h5 className="font-bold text-lg">
                                                {dataInput.inputType == 'create' ? 'Tambah Perangkat Daerah' : 'Edit Perangkat Daerah'}
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
                                                            Nama Perangkat Daerah
                                                            <span className='text-red-600 mx-1'>*</span>
                                                        </label>
                                                        {(dataInput.inputType == 'edit' && dataInput.name == null) ? (
                                                            <>
                                                                <div className="w-full form-input text-slate-400">
                                                                    <div className="dots-loading">....</div>
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
                                                                        placeholder="Masukkan Nama Perangkat Daerah"
                                                                        value={dataInput.name}
                                                                        onChange={(e) => setDataInput({ ...dataInput, name: e.target.value })}
                                                                    />
                                                                    <div id="error-name" className='validation-elements text-red-500 text-xs'></div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label htmlFor="alias" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                            Nama Alias
                                                            <span className='text-red-600 mx-1'>*</span>
                                                        </label>
                                                        {(dataInput.inputType == 'edit' && dataInput.alias == null) ? (
                                                            <>
                                                                <div className="w-full form-input text-slate-400">
                                                                    <div className="dots-loading">....</div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="">
                                                                    <input
                                                                        type="text"
                                                                        name="alias"
                                                                        id="alias"
                                                                        className="form-input"
                                                                        placeholder="Masukkan Nama Alias"
                                                                        value={dataInput.alias}
                                                                        onChange={(e) => setDataInput({ ...dataInput, alias: e.target.value })}
                                                                    />
                                                                    <div id="error-alias" className='validation-elements text-red-500 text-xs'></div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                            Kode Perangkat Daerah
                                                            <span className='text-red-600 mx-1'>*</span>
                                                        </label>
                                                        {(dataInput.inputType == 'edit' && dataInput.code == null) ? (
                                                            <>
                                                                <div className="w-full form-input text-slate-400">
                                                                    <div className="dots-loading">....</div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <input
                                                                    type="text"
                                                                    name="code"
                                                                    id="code"
                                                                    className="form-input"
                                                                    placeholder="Masukkan Kode Perangkat Daerah"
                                                                    value={dataInput.code}
                                                                    onChange={(e) => setDataInput({ ...dataInput, code: e.target.value })}
                                                                />
                                                                <div id="error-code" className='validation-elements text-red-500 text-xs'></div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                            Email
                                                        </label>
                                                        {(dataInput.inputType == 'edit' && dataInput.email == null) ? (
                                                            <>
                                                                <div className="w-full form-input text-slate-400">
                                                                    <div className="dots-loading">....</div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="">
                                                                    <input
                                                                        type="email"
                                                                        name="email"
                                                                        id="email"
                                                                        className="form-input"
                                                                        placeholder="Masukkan Email"
                                                                        value={dataInput.email}
                                                                        onChange={(e) => setDataInput({ ...dataInput, email: e.target.value })}
                                                                    />
                                                                    <div id="error-email" className='validation-elements text-red-500 text-xs'></div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                            Nomor Telepon
                                                        </label>
                                                        {(dataInput.inputType == 'edit' && dataInput.phone == null) ? (
                                                            <>
                                                                <div className="w-full form-input text-slate-400">
                                                                    <div className="dots-loading">....</div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="">
                                                                    <input
                                                                        type="text"
                                                                        name="phone"
                                                                        id="phone"
                                                                        className="form-input"
                                                                        placeholder="Masukkan Nomor Telepon"
                                                                        value={dataInput.phone}
                                                                        onChange={(e) => setDataInput({ ...dataInput, phone: e.target.value })}
                                                                    />
                                                                    <div id="error-phone" className='validation-elements text-red-500 text-xs'></div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                            Deskripsi
                                                        </label>
                                                        {(dataInput.inputType == 'edit' && dataInput.description == null) ? (
                                                            <>
                                                                <div className="w-full form-input text-slate-400">
                                                                    <div className="dots-loading">....</div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <textarea
                                                                    name="description"
                                                                    id="description"
                                                                    className="form-input h-[100px] resize-none"
                                                                    placeholder="Masukkan Deskripsi...."
                                                                    value={dataInput.description}
                                                                    onChange={(e) => setDataInput({ ...dataInput, description: e.target.value })}></textarea>
                                                                <div id="error-description" className='validation-elements text-red-500 text-xs'></div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                            Alamat
                                                        </label>
                                                        {(dataInput.inputType == 'edit' && dataInput.address == null) ? (
                                                            <>
                                                                <div className="w-full form-input text-slate-400">
                                                                    <div className="dots-loading">....</div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <textarea
                                                                    name="address"
                                                                    id="address"
                                                                    className="form-input h-[100px] resize-none"
                                                                    placeholder="Masukkan Alamat...."
                                                                    value={dataInput.address}
                                                                    onChange={(e) => setDataInput({ ...dataInput, address: e.target.value })}></textarea>
                                                                <div id="error-address" className='validation-elements text-red-500 text-xs'></div>
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
            </>
        );
    }
    return (
        <Page403 />
    );
}

export default Index;
