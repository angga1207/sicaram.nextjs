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
import Swal from 'sweetalert2';

import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconPlus from '../../components/Icon/IconPlus';
import IconEdit from '../../components/Icon/IconEdit';
import IconX from '../../components/Icon/IconX';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconSearch from '../../components/Icon/IconSearch';

import { fetchRoles, fetchUsers, fetchUser, fetchAllDataUsers } from '../../apis/fetchdata';
import { storeUser, updateUser, deleteUser } from '../../apis/storedata';
import Page403 from '@/components/Layouts/Page403';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

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
        dispatch(setPageTitle('Pengguna'));
    });

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [isMounted, setIsMounted] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [CurrentUser, setCurrentUser] = useState<any>([]);
    useEffect(() => {
        if (window) {
            if (localStorage.getItem('user')) {
                setCurrentUser(JSON.parse(localStorage.getItem('user') ?? '{[]}') ?? []);
            }
        }
    }, []);

    useEffect(() => {
        setIsMounted(true)
        setIsClient(true)
    }, []);

    const { t, i18n } = useTranslation();

    // const [userType, setUserType] = useState<any>(CurrentUser.role_id == 9 ? 'admin' : 'perangkat_daerah');
    const [userType, setUserType] = useState<any>(null);

    const [roles, setRoles] = useState([]);
    const [instances, setInstances] = useState([]);
    const [datas, setDatas] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if ([9].includes(CurrentUser?.role_id)) {
            setUserType('perangkat_daerah');
        }
        if ([1, 2, 3, 4, 5].includes(CurrentUser?.role_id)) {
            setUserType('admin');
        }
    }, [isMounted])

    useEffect(() => {
        if (userType) {
            fetchAllDataUsers(userType)
                .then((data: any) => {
                    if (data.status == 'success') {
                        setRoles((data?.data?.roles) ?? [])
                    }
                    if (data.status == 'success') {
                        setInstances((data.data.instances) ?? [])
                    }
                });
        }
    }, [isMounted, userType]);

    // console.log(roles)

    useEffect(() => {
        if (userType) {
            if (CurrentUser.role_id == 9) {
                fetchUsers(userType, search, CurrentUser.instance_id).then((data) => {
                    setDatas((data?.data?.users));
                });
            } else {
                fetchUsers(userType, search).then((data) => {
                    setDatas((data?.data?.users));
                });
            }
        }
    }, [userType, search]);
    const changeUserType = (e: any) => {
        setDatas([]);
        setUserType(e);
    }

    const [modalInput, setModalInput] = useState(false);
    const [expandPassword, setExpandPassword] = useState(false);

    const [dataInput, setDataInput] = useState<any>({
        inputType: 'create',
        id: '',
        fullname: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
        photo: '',
        instance_id: '',
        instance_ids: '',
        instance_type: '',
    });

    const addUser = () => {
        setSaveLoading(false);
        var elements = document.getElementsByClassName('validation-elements');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = '';
        }
        if (CurrentUser?.role_id == 9) {
            setDataInput({
                inputType: 'create',
                id: '',
                fullname: '',
                username: '',
                email: '',
                password: '',
                password_confirmation: '',
                role: 9,
                photo: '',
                instance_id: CurrentUser?.instance_id,
                instance_ids: '',
                instance_type: '',
            });
        } else {
            setDataInput({
                inputType: 'create',
                id: '',
                fullname: '',
                username: '',
                email: '',
                password: '',
                password_confirmation: '',
                role: '',
                photo: '',
                instance_id: '',
                instance_ids: '',
                instance_type: '',
            });
        }
        setModalInput(true);
        setExpandPassword(true);
        console.log(roles)
    }

    const getDataById = (id: string) => {
        setSaveLoading(false);
        var elements = document.getElementsByClassName('validation-elements');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = '';
        }
        setDataInput({
            inputType: 'edit',
            id: id,
            fullname: null,
            username: null,
            email: null,
            password: null,
            password_confirmation: null,
            role: null,
            photo: null,
            instance_id: null,
            instance_ids: null,
            instance_type: null,
        });

        fetchUser(id).then((data) => {
            if (data.status == 'success') {
                setDataInput({
                    inputType: 'edit',
                    id: data.data.id,
                    fullname: data.data.fullname,
                    username: data.data.username,
                    email: data.data.email,
                    password: '',
                    password_confirmation: '',
                    role: data.data.role_id,
                    photo: data.data.photo,
                    instance_id: data.data.instance_id ?? '',
                    instance_ids: data.data.instance_ids ?? '',
                    instance_type: data.data.instance_type ?? '',
                });
                setModalInput(true);
                setExpandPassword(false);
            }

            if (data.status == 'error') {
                showAlert('error', data.message);
            }
        });
    }

    const [saveLoading, setSaveLoading] = useState(false);

    const save = () => {
        setSaveLoading(true);
        var elements = document.getElementsByClassName('validation-elements');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = '';
        }
        if (dataInput.inputType == 'create') {
            storeUser(dataInput).then((data) => {
                if (data.status == 'success') {
                    setModalInput(false);
                    if (CurrentUser.role_id == 9) {
                        fetchUsers(userType, '', CurrentUser.instance_id).then((data) => {
                            setDatas((data?.data?.users));
                        });
                    } else {
                        fetchUsers(userType, '').then((data) => {
                            setDatas((data?.data?.users));
                        });
                    }
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
            updateUser(dataInput).then((data) => {
                if (data.status == 'success') {
                    setModalInput(false);
                    if (CurrentUser.role_id == 9) {
                        fetchUsers(userType, '', CurrentUser.instance_id).then((data) => {
                            setDatas((data?.data?.users));
                        });
                    } else {
                        fetchUsers(userType, '').then((data) => {
                            setDatas((data?.data?.users));
                        });
                    }
                    showAlert('success', data.message);
                }
                if (data.status == 'error') {
                    showAlert('error', data.message);
                }
                setSaveLoading(false);
            });
        }
    }

    const confirmDelete = async (id: any) => {
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
                title: 'Hapus Pengguna?',
                text: "Apakah Anda yakin untuk menghapus Pengguna Ini!",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Tidak!',
                reverseButtons: true,
                padding: '2em',
            })
            .then((result) => {
                if (result.value) {
                    deleteUser(id).then((data) => {
                        if (data.status == 'success') {
                            if (CurrentUser.role_id == 9) {
                                fetchUsers(userType, '', CurrentUser.instance_id).then((data) => {
                                    setDatas((data?.data?.users));
                                });
                            } else {
                                fetchUsers(userType, '').then((data) => {
                                    setDatas((data?.data?.users));
                                });
                            }
                            swalWithBootstrapButtons.fire('Terhapus!', data.message, 'success');
                        }
                        if (data.status == 'error') {
                            showAlert('error', data.message);
                        }
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire('Batal', 'Batal menghapus pengguna', 'info');
                }
            });
    }

    if (CurrentUser?.role_id && [1, 2, 3, 4, 5, 9].includes(CurrentUser?.role_id)) {
        return (
            <>
                {CurrentUser?.role_id && [1, 2, 3, 4, 5].includes(CurrentUser?.role_id) && (
                    <div className="flex gap-2 mb-4">
                        <button type="button" className={userType == 'admin' ? 'btn btn-success' : 'btn btn-primary'} onClick={() => {
                            changeUserType('admin');
                        }}>
                            Administrator
                        </button>
                        <button type="button" className={userType == 'verifikator' ? 'btn btn-success' : 'btn btn-primary'} onClick={() => {
                            changeUserType('verifikator');
                        }}>
                            Verifikator
                        </button>
                        <button type="button" className={userType == 'perangkat_daerah' ? 'btn btn-success' : 'btn btn-primary'} onClick={() => {
                            changeUserType('perangkat_daerah');
                        }}>
                            Perangkat Daerah
                        </button>
                    </div>
                )}
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">
                            Daftar Pengguna
                        </h5>

                        <div className="flex items-center justify-center gap-1">
                            <div className="relative">
                                <input type="search"
                                    className="form-input rtl:pl-12 ltr:pr-12"
                                    placeholder='Cari Pengguna...'
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <div className="absolute rtl:left-0 ltr:right-0 top-0 bottom-0 flex items-center justify-center w-12 h-full">
                                    <IconSearch className="w-4 h-4 text-slate-400"></IconSearch>
                                </div>
                            </div>

                            {CurrentUser?.role_id && [1, 2, 3, 4, 5, 9].includes(CurrentUser?.role_id) && (
                                <>
                                    {(CurrentUser?.role_id == 9 && CurrentUser?.instance_type != 'kepala') ? (
                                        <></>
                                    ) : (
                                        <button type="button" onClick={() => addUser()} className="btn btn-info whitespace-nowrap gap-1">
                                            <IconPlus></IconPlus>
                                            Tambah Pengguna
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="table-responsive mb-5">
                        <table className="table-hover align-middle">
                            <thead>
                                <tr>
                                    <th className='min-w-[500px]'>
                                        Nama Lengkap
                                    </th>
                                    {userType == 'verifikator' ? (
                                        <th className='!text-center'>Verifikator Untuk</th>
                                    ) : (
                                        <th className='w-[200px] !text-center'>Jenis Pengguna</th>
                                    )}
                                    <th className='w-[200px]'>Username</th>
                                    <th className="!text-center w-[100px]">
                                        <div className="flex items-center justify-center">
                                            <FontAwesomeIcon icon={faCog} className="h-4 w-4 text-slate-400" />
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {datas?.map((data: any, index: number) => {
                                    return (
                                        <tr key={data?.id}>
                                            <td>
                                                <div className="flex gap-2 items-center">
                                                    <div>
                                                        <img src={data?.photo} alt="Photo Profile" className='w-12 h-12 rounded-full p-0.5 bg-slate-100 object-contain' />
                                                    </div>
                                                    <div className='font-bold text-base line-clamp-2'>
                                                        {data?.fullname}
                                                    </div>
                                                </div>
                                            </td>
                                            {userType == 'verifikator' ? (
                                                <td>
                                                    <div className="flex items-center flex-wrap gap-1">
                                                        {data?.instance_ids?.map((instance: any) => (
                                                            <div className='bg-sky-200 rounded px-2 py-1 text-xs'>
                                                                {instance}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            ) : (
                                                <td>
                                                    <div className="text-center">
                                                        {data?.role_name ? data?.role_name : ''}
                                                    </div>
                                                </td>
                                            )}
                                            <td>
                                                <div className="hover:text-primary cursor-pointer">
                                                    @{data?.username}
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div className="flex items-center gap-2">
                                                    <Tippy content="Edit">
                                                        <button type="button"
                                                            // onClick={() => setModalInput(true)}
                                                            onClick={() => getDataById(data?.id)}
                                                        >
                                                            <IconEdit className="m-auto text-primary" />
                                                        </button>
                                                    </Tippy>
                                                    <Tippy content="Delete">
                                                        <button type="button" onClick={() => confirmDelete(data?.id)}>
                                                            <IconTrashLines className="m-auto" />
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
                </div >

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
                                    <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-[80%] md:max-w-[45%] my-8 text-black dark:text-white-dark">
                                        <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                            <h5 className="font-bold text-lg">
                                                {dataInput.inputType == 'create' ? 'Tambah Pengguna' : 'Edit Pengguna'}
                                            </h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalInput(false)}>
                                                <IconX></IconX>
                                            </button>
                                        </div>
                                        <div className="p-5">

                                            <div className="space-y-3">
                                                <div className='flex flex-col lg:flex-row gap-2'>
                                                    {(dataInput.inputType == 'edit') && (
                                                        <>
                                                            <div>
                                                                {(dataInput.inputType == 'edit' && dataInput.photo) ? (
                                                                    <>
                                                                        <img className='w-full h-[200px] lg:w-[250px] object-contain rounded border bg-white shadow p-0.5' src={dataInput.photo} />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <div className='w-full h-[200px] lg:w-[250px] object-contain rounded border bg-white shadow p-0.5 flex items-center justify-center gap-2 text-slate-400'>
                                                                            <div className="dots-loading">....</div>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </>
                                                    )}

                                                    <div className='w-full space-y-3'>
                                                        <div>
                                                            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                                Nama Lengkap
                                                                <span className='text-red-600 mx-1'>*</span>
                                                            </label>
                                                            {(dataInput.inputType == 'edit' && dataInput.fullname == null) ? (
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
                                                                            name="fullname"
                                                                            id="fullname"
                                                                            className="form-input"
                                                                            placeholder="Masukkan Nama Lengkap"
                                                                            value={dataInput.fullname}
                                                                            onChange={(e) => setDataInput({ ...dataInput, fullname: e.target.value })}
                                                                        />
                                                                        <div id="error-fullname" className='validation-elements text-red-500 text-xs'></div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                                Username
                                                                <span className='text-red-600 mx-1'>*</span>
                                                            </label>
                                                            {(dataInput.inputType == 'edit' && dataInput.username == null) ? (
                                                                <>
                                                                    <div className="w-full form-input text-slate-400">
                                                                        <div className="dots-loading">....</div>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className=" relative">
                                                                        <div className='absolute w-8 h-[38px] rounded flex items-center justify-center ltr:left-0 rtl:right-0 font-bold bg-slate-100 text-slate-500'>
                                                                            @
                                                                        </div>
                                                                        <input
                                                                            type="text"
                                                                            name="username"
                                                                            id="username"
                                                                            className="form-input ltr:pl-10 rtl:pr-10"
                                                                            placeholder="Masukkan Username"
                                                                            value={dataInput.username}
                                                                            onChange={(e) => setDataInput({ ...dataInput, username: e.target.value })}
                                                                        />
                                                                    </div>
                                                                    <div id="error-username" className='validation-elements text-red-500 text-xs'></div>
                                                                </>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                                Email
                                                                <span className='text-red-600 mx-1'>*</span>
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
                                                    </div>
                                                </div>

                                                {CurrentUser?.role_id && [1, 2, 3, 4, 5].includes(CurrentUser?.role_id) && (
                                                    <>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                                Jenis Pengguna
                                                                <span className='text-red-600 mx-1'>*</span>
                                                            </label>
                                                            {(dataInput.inputType == 'edit' && dataInput.role == null) ? (
                                                                <div className="w-full form-input text-slate-400">
                                                                    <div className="dots-loading">....</div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <select
                                                                        className="form-select text-white-dark"
                                                                        value={dataInput.role}
                                                                        onChange={(e) => setDataInput({ ...dataInput, role: e.target.value })}>
                                                                        <option hidden value="">Pilih Jenis Pengguna</option>
                                                                        {roles?.map((role: any) => (
                                                                            <option value={role.id} key={role.id}>
                                                                                {role.display_name}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                    <div id="error-role" className='validation-elements text-red-500 text-xs'></div>
                                                                </>
                                                            )}
                                                        </div>

                                                        {(dataInput.role == 9) && (
                                                            <>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                                        Perangkat Daerah
                                                                        <span className='text-red-600 mx-1'>*</span>
                                                                    </label>
                                                                    {(dataInput.inputType == 'edit' && dataInput.instance_id == null) ? (
                                                                        <>
                                                                            <div className="w-full form-input text-slate-400">
                                                                                <div className="dots-loading">....</div>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <select className="form-select text-white-dark" value={dataInput.instance_id} onChange={(e) => setDataInput({ ...dataInput, instance_id: e.target.value })}>
                                                                                <option hidden value="">Pilih Jenis Pengguna</option>
                                                                                {instances.map((instance: any) => {
                                                                                    return (
                                                                                        <option value={instance.id}>
                                                                                            {instance.name}
                                                                                        </option>
                                                                                    )
                                                                                })}
                                                                            </select>
                                                                            <div id="error-instance_id" className='validation-elements text-red-500 text-xs'></div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </>
                                                        )}
                                                    </>
                                                )}

                                                {(dataInput.role == 6) && (
                                                    <>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                                Verifikator Untuk
                                                                <span className='text-red-600 mx-1'>*</span>
                                                            </label>
                                                            {(dataInput.inputType == 'edit' && dataInput.instance_ids == null) ? (
                                                                <>
                                                                    <div className="w-full form-input text-slate-400">
                                                                        <div className="dots-loading">....</div>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Select
                                                                        isMulti
                                                                        options={instances.map((instance: any) => {
                                                                            return {
                                                                                value: instance.id,
                                                                                label: instance.name,
                                                                            }
                                                                        })}
                                                                        value={dataInput.instance_ids}
                                                                        onChange={(e) => {
                                                                            setDataInput({
                                                                                ...dataInput,
                                                                                instance_ids: e
                                                                            })
                                                                        }}
                                                                    />
                                                                    <div id="error-instance_ids" className='validation-elements text-red-500 text-xs'></div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </>
                                                )}

                                                {(dataInput.role == 9) && (
                                                    <>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                                Jenis Akun
                                                                <span className='text-red-600 mx-1'>*</span>
                                                            </label>
                                                            {(dataInput.inputType == 'edit' && dataInput.instance_type == null) ? (
                                                                <>
                                                                    <div className="w-full form-input text-slate-400">
                                                                        <div className="dots-loading">....</div>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <select className="form-select text-white-dark" value={dataInput.instance_type} onChange={(e) => setDataInput({ ...dataInput, instance_type: e.target.value })}>
                                                                        <option hidden value="">Pilih Jenis Pengguna</option>
                                                                        <option value="staff">Admin PD</option>
                                                                        <option value="kepala">Kepala PD</option>
                                                                    </select>
                                                                    <div id="error-instance_type" className='validation-elements text-red-500 text-xs'></div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </>
                                                )}

                                                <hr />

                                                <div className="flex items-center justify-between cursor-pointer group"
                                                    onClick={() => setExpandPassword(!expandPassword)}>

                                                    {expandPassword == true ? (
                                                        <>
                                                            <div className='text-xs text-slate-600 group-hover:underline'>
                                                                Tutup password
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className='text-xs text-slate-400 group-hover:underline'>
                                                                Buka password
                                                            </div>
                                                        </>
                                                    )}

                                                    <div className="group-hover:bg-slate-100 rounded-full flex items-center justify-center w-5 h-5">
                                                        <IconCaretDown className={expandPassword ? 'rotate-180 group-hover:rotate-0 transition-all duration-300' : 'group-hover:rotate-180 transition-all duration-300'}></IconCaretDown>
                                                    </div>
                                                </div>
                                                <hr />

                                                {expandPassword == true ? (
                                                    <>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                                Password
                                                                {dataInput.inputType == 'create' && (
                                                                    <span className='text-red-600 mx-1'>*</span>
                                                                )}
                                                            </label>
                                                            {(dataInput.inputType == 'edit' && dataInput.password == null) ? (
                                                                <>
                                                                    <div className="w-full form-input text-slate-400">
                                                                        <div className="dots-loading">....</div>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className="">
                                                                        <input
                                                                            type="password"
                                                                            name="password"
                                                                            className="form-input"
                                                                            placeholder="Masukkan Password"
                                                                            value={dataInput.password}
                                                                            onChange={(e) => setDataInput({ ...dataInput, password: e.target.value })}
                                                                        />
                                                                        <div id="error-password" className='validation-elements text-red-500 text-xs'></div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                                Konfirmasi Password
                                                                {dataInput.inputType == 'create' && (
                                                                    <span className='text-red-600 mx-1'>*</span>
                                                                )}
                                                            </label>
                                                            {(dataInput.inputType == 'edit' && dataInput.password_confirmation == null) ? (
                                                                <>
                                                                    <div className="w-full form-input text-slate-400">
                                                                        <div className="dots-loading">....</div>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className="">
                                                                        <input
                                                                            type="password"
                                                                            name="password_confirmation"
                                                                            className="form-input"
                                                                            placeholder="Masukkan Konfirmasi Password"
                                                                            value={dataInput.password_confirmation}
                                                                            onChange={(e) => setDataInput({ ...dataInput, password_confirmation: e.target.value })}
                                                                        />
                                                                        <div id="error-password_confirmation" className='validation-elements text-red-500 text-xs'></div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                    </>
                                                )}
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
