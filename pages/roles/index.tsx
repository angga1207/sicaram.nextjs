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
import { faBusinessTime, faCog, faEdit, faEye, faShield, faShieldAlt, faSpellCheck, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { fetchRoles, fetchRole } from '../../apis/fetchdata';
import { storeRole, updateRole, deleteRole } from '../../apis/storedata';
import { faSearchengin } from '@fortawesome/free-brands-svg-icons';
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
        dispatch(setPageTitle('Peran Pengguna'));
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

    const [datas, setDatas] = useState<any>([]);
    const [search, setSearch] = useState('');
    const [modalInput, setModalInput] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [dataInput, setDataInput] = useState<any>({
        inputType: 'create',
        id: '',
        name: '',
    });

    useEffect(() => {
        fetchRoles().then((data) => {
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
            fetchRoles(search).then((data) => {
                setDatas((data?.data));
            });
        }
    }

    const addRole = () => {
        setSaveLoading(false);
        var elements = document.getElementsByClassName('validation-elements');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = '';
        }
        setDataInput({
            inputType: 'create',
            id: '',
            name: '',
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
        });
        fetchRoles(id).then((data) => {
            if (data.status == 'success') {
                setDataInput({
                    inputType: 'edit',
                    id: data.data.id,
                    name: data.data.name ?? '',
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
            storeRole(dataInput).then((data) => {
                if (data.status == 'success') {
                    setModalInput(false);
                    fetchRoles(search).then((data) => {
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
                    console.log(data.message)
                    showAlert('error', data.message);
                }
                setSaveLoading(false);
            });
        } else {
            updateRole(dataInput).then((data) => {
                if (data.status == 'success') {
                    setModalInput(false);
                    fetchRoles(search).then((data) => {
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


    if (CurrentUser?.role_id && [1].includes(CurrentUser?.role_id)) {
        return (
            <>
                <div className="">
                    <div className="">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light">
                                Daftar Peran Pengguna
                            </h2>
                            <div className="flex items-center justify-center gap-1">

                                <div className="relative">
                                    <input type="search"
                                        className="form-input rtl:pl-12 ltr:pr-12"
                                        placeholder='Cari Peran Pengguna...'
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <div className="absolute rtl:left-0 ltr:right-0 top-0 bottom-0 flex items-center justify-center w-12 h-full">
                                        <IconSearch className="w-4 h-4 text-slate-400"></IconSearch>
                                    </div>
                                </div>

                                {/* <button type="button" className="btn btn-info whitespace-nowrap" onClick={() => addRole()} >
                                <IconPlus className="w-4 h-4" />
                                <span className="ltr:ml-2 rtl:mr-2">Tambah</span>
                            </button> */}
                            </div>

                        </div>
                    </div>

                    <div className="panel">

                        <div className="table-responsive mb-5">
                            <table className="table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th className=''>
                                            Nama Peran Pengguna
                                        </th>
                                        <th className='w-[200px] !text-center'>Jumlah Pengguna</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {datas?.map((data: any) => {
                                        return (
                                            <>
                                                <tr>
                                                    <td>
                                                        <div className="flex items-center gap-x-4">
                                                            <div>
                                                                {data?.display_name}
                                                            </div>
                                                            {data?.id == 2 && (
                                                                <>
                                                                    <div className="badge m-0 bg-green-200 text-green-900 cursor-pointer">
                                                                        <FontAwesomeIcon icon={faShieldAlt} className='w-3 h-3' />
                                                                    </div>
                                                                </>
                                                            )}
                                                            {(data?.id == 3 || data?.id == 4 || data?.id == 5) && (
                                                                <>
                                                                    <div className="badge m-0 bg-white-light text-black cursor-pointer">
                                                                        <FontAwesomeIcon icon={faShieldAlt} className='w-3 h-3' />
                                                                    </div>
                                                                </>
                                                            )}
                                                            {(data?.id == 6 || data?.id == 7 || data?.id == 8) && (
                                                                <>
                                                                    <div className="badge m-0 bg-amber-200 text-amber-900 cursor-pointer">
                                                                        <FontAwesomeIcon icon={faSpellCheck} className='w-3 h-3' />
                                                                    </div>
                                                                </>
                                                            )}
                                                            {(data?.id == 9) && (
                                                                <>
                                                                    <div className="badge m-0 bg-red-200 text-red-900 cursor-pointer">
                                                                        <FontAwesomeIcon icon={faBusinessTime} className='w-3 h-3' />
                                                                    </div>
                                                                </>
                                                            )}
                                                            {(data?.id == 10) && (
                                                                <>
                                                                    <div className="badge m-0 bg-indigo-200 text-indigo-900 cursor-pointer">
                                                                        <FontAwesomeIcon icon={faSearchengin} className='w-3 h-3' />
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="text-center">
                                                            {data?.users_count} Orang
                                                        </div>
                                                    </td>
                                                </tr>
                                            </>
                                        )
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

                </div>
            </>
        );
    }
    return (
        <Page403 />
    );
};

export default Index;
