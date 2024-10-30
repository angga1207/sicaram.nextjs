import { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import Swal from "sweetalert2";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useRouter } from 'next/router';
import { fetchInstanceSubUnit, fetchInstanceSubUnitDelete, fetchInstanceSubUnitDetail, storeInstanceSubUnit } from '@/apis/fetchdata';
import IconPlus from '@/components/Icon/IconPlus';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import Select from 'react-select';
import IconEdit from '@/components/Icon/IconEdit';
import IconTrash from '@/components/Icon/IconTrash';
import Page403 from '@/components/Layouts/Page403';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import Link from 'next/link';
import { storeInstance, updateInstance } from '@/apis/storedata';

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
}

const InstancePageSlug = () => {

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Perangkat Daerah Sub Unit'));
    });
    const router = useRouter();

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

    const [instanceId, setInstanceId] = useState(null);
    const [instanceAlias, setInstanceAlias] = useState<any>(null);
    const [instance, setInstance] = useState<any>([]);
    const [instanceInput, setInstanceInput] = useState<any>([]);
    const [datas, setDatas] = useState([]);
    const [optionPrograms, setOptionPrograms] = useState<any>([]);
    const [optionAdmin, setOptionAdmin] = useState<any>([]);
    const [modalInput, setModalInput] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [dataInput, setDataInput] = useState<any>({
        periode: periode?.id,
        inputType: 'create',
        type: 'bidang',
        id: '',
        name: '',
        alias: '',
        code: '',
        programs: [],
        admins: [],
    });

    useEffect(() => {
        if (isMounted && CurrentUser?.instance_id) {
            setInstanceId(CurrentUser?.instance_id)
        }
    }, [isMounted, CurrentUser?.instance_id])

    useEffect(() => {
        if (isMounted && router?.query) {
            setInstanceAlias(router?.query?.slug)
        }
        if (isMounted && CurrentUser?.role_id === 9) {
            setInstanceAlias(CurrentUser?.instance_alias);
        }
    }, [isMounted, router?.query, CurrentUser?.instance_alias])

    useEffect(() => {
        if (isMounted && instanceAlias && periode?.id) {
            fetchInstanceSubUnit(instanceAlias, periode?.id).then((res: any) => {
                if (res.status === 'success') {
                    setInstance(res.data.instance)
                    setDatas(res.data.data)
                    setOptionPrograms(res.data.programs.map((item: any) => {
                        return {
                            value: item.id,
                            label: item.name,
                        }
                    }))
                    setOptionAdmin(res.data.admins.map((item: any) => {
                        return {
                            value: item.id,
                            label: item.fullname,
                        }
                    }))


                    setInstanceInput({
                        'id': res.data.instance.id,
                        'name': res.data.instance.name,
                        'alias': res.data.instance.alias,
                        'code': res.data.instance.code,
                        'description': res.data.instance.description,
                        'address': res.data.instance.address,
                        'phone': res.data.instance.phone,
                        'fax': res.data.instance.fax,
                        'email': res.data.instance.email,
                        'website': res.data.instance.website,
                        'facebook': res.data.instance.facebook,
                        'instagram': res.data.instance.instagram,
                        'youtube': res.data.instance.youtube,
                    })
                }
            })
        }
    }, [isMounted, instanceAlias, periode?.id])

    const addNewData = () => {
        setSaveLoading(false);
        var elements = document.getElementsByClassName('validation-elements');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = '';
        }
        setDataInput({
            periode: periode?.id,
            inputType: 'create',
            type: instance?.code === '4.01.0.00.0.00.01.0000' ? 'bagian' : 'bidang',
            id: '',
            name: '',
            alias: '',
            code: '',
            programs: [],
            admins: [],
        });
        setModalInput(true);
    }

    const editData = (id: any) => {
        setSaveLoading(false);
        var elements = document.getElementsByClassName('validation-elements');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = '';
        }

        fetchInstanceSubUnitDetail(instanceAlias, id, periode?.id).then((res: any) => {
            if (res.status === 'success') {
                setDataInput({
                    periode: periode?.id,
                    inputType: 'edit',
                    type: res.data.type,
                    id: res.data.id,
                    name: res.data.name,
                    alias: res.data.alias,
                    code: res.data.code,
                    programs: res.data.programs,
                    admins: res.data.admins,
                });
                setModalInput(true);
            }
        });
    }

    const save = () => {
        setSaveLoading(true);
        var elements = document.getElementsByClassName('validation-elements');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = '';
        }
        storeInstanceSubUnit(instanceAlias, dataInput).then((res: any) => {
            if (res.status === 'success') {
                fetchInstanceSubUnit(instanceAlias, periode?.id).then((res: any) => {
                    if (res.status === 'success') {
                        setDatas(res.data.data)
                    }
                })

                setDataInput({
                    periode: periode?.id,
                    inputType: 'create',
                    type: instance?.code === '4.01.0.00.0.00.01.0000' ? 'bagian' : 'bidang',
                    id: '',
                    name: '',
                    alias: '',
                    code: '',
                    programs: [],
                    admins: [],
                });
                setModalInput(false)
            }

            if (res.status == 'error validation') {
                Object.keys(res.message).map((key: any, index: any) => {
                    let element = document.getElementById('error-' + key);
                    if (element) {
                        element.innerHTML = res.message[key][0];
                    }
                });
            }
            setSaveLoading(false);
        });
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
                title: 'Hapus Sub Unit?',
                text: "Apakah Anda yakin untuk menghapus Sub Unit Ini!",
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
                        fetchInstanceSubUnitDelete(instanceAlias, id, periode?.id).then((res: any) => {
                            if (res.status == 'success') {
                                fetchInstanceSubUnit(instanceAlias, periode?.id).then((res: any) => {
                                    if (res.status === 'success') {
                                        setDatas(res.data.data)
                                    }
                                })
                                swalWithBootstrapButtons.fire('Terhapus!', res.message, 'success');
                            }
                            if (res.status == 'error') {
                                showAlert('error', res.message);
                            }
                        })
                    }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire('Batal', 'Batal menghapus Sub Unit', 'info');
                }
            });
    }

    const saveInstance = () => {
        updateInstance(instanceInput).then((data) => {
            if (data.status == 'success') {
                fetchInstanceSubUnit(instanceAlias, periode?.id).then((res: any) => {
                    if (res.status === 'success') {
                        setDatas(res.data.data)
                    }
                })
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
    }

    return (
        <div className="space-y-5">

            <div className="panel">
                <div className="">
                    {instance?.code}
                </div>
                <div className="text-lg font-semibold">
                    {instance?.name}
                </div>

                <div className="my-5 grid lg:grid-cols-2 gap-5">

                    <div className="">
                        <label htmlFor="instance-name">
                            Nama Nomenklatur
                        </label>
                        <div className="">
                            <input
                                type="text"
                                id="instance-name"
                                className="form-input"
                                autoComplete='off'
                                placeholder='Nama Nomenklatur'
                                value={instanceInput.name}
                                onChange={(e) => setInstanceInput({ ...instanceInput, name: e.target.value })}
                            />
                            <div id="error-instance-name" className='validation-elements text-red-500 text-xs'></div>
                        </div>
                    </div>

                    <div className="">
                        <label htmlFor="instance-code">
                            Kode Nomenklatur
                        </label>
                        <div className="">
                            <input
                                type="text"
                                id="instance-code"
                                className="form-input"
                                autoComplete='off'
                                placeholder='Kode Nomenklatur'
                                value={instanceInput.code}
                                onChange={(e) => setInstanceInput({ ...instanceInput, code: e.target.value })}
                            />
                            <div id="error-instance-code" className='validation-elements text-red-500 text-xs'></div>
                        </div>
                    </div>

                    <div className="">
                        <label htmlFor="instance-phone">
                            Telepon
                        </label>
                        <div className="">
                            <input
                                type="text"
                                id="instance-phone"
                                className="form-input"
                                autoComplete='off'
                                placeholder='Telepon'
                                value={instanceInput.phone}
                                onChange={(e) => setInstanceInput({ ...instanceInput, phone: e.target.value })}
                            />
                            <div id="error-instance-phone" className='validation-elements text-red-500 text-xs'></div>
                        </div>
                    </div>

                    <div className="">
                        <label htmlFor="instance-alias">
                            Alias
                        </label>
                        <div className="">
                            <input
                                type="text"
                                id="instance-alias"
                                className="form-input"
                                autoComplete='off'
                                placeholder='Alias'
                                value={instanceInput.alias}
                                onChange={(e) => setInstanceInput({ ...instanceInput, alias: e.target.value })}
                            />
                            <div id="error-instance-alias" className='validation-elements text-red-500 text-xs'></div>
                        </div>
                    </div>

                    <div className="">
                        <label htmlFor="instance-description">
                            Deskripsi
                        </label>
                        <div className="">
                            <textarea
                                id="instance-description"
                                className="form-input min-h-[200px]"
                                autoComplete='off'
                                placeholder='Deskripsi'
                                value={instanceInput.description}
                                onChange={(e) => setInstanceInput({ ...instanceInput, description: e.target.value })}
                            ></textarea>
                            <div id="error-instance-description" className='validation-elements text-red-500 text-xs'></div>
                        </div>
                    </div>

                    <div className="">
                        <label htmlFor="instance-logo">
                            Logo
                        </label>
                        <div className="">
                            <div className="mb-5">
                                <img src={instance?.logo} alt="Logo Nomenklatur" className='w-full h-32 object-contain' />
                            </div>
                            <input
                                type="file"
                                id="instance-logo"
                                className="form-input"
                                placeholder='Logo'
                                onChange={(e) => setInstanceInput({ ...instanceInput, newlogo: e.target.value })}
                            />
                            <div id="error-instance-logo" className='validation-elements text-red-500 text-xs'></div>
                        </div>
                    </div>

                    <div className="">
                        <label htmlFor="instance-website">
                            Website
                        </label>
                        <div className="">
                            <input
                                type="text"
                                id="instance-website"
                                className="form-input"
                                autoComplete='off'
                                placeholder='Website'
                                value={instanceInput.website}
                                onChange={(e) => setInstanceInput({ ...instanceInput, website: e.target.value })}
                            />
                            <div id="error-instance-website" className='validation-elements text-red-500 text-xs'></div>
                        </div>
                    </div>

                    <div className="">
                        <label htmlFor="instance-facebook">
                            Facebook
                        </label>
                        <div className="">
                            <input
                                type="text"
                                id="instance-facebook"
                                className="form-input"
                                autoComplete='off'
                                placeholder='Facebook'
                                value={instanceInput.facebook}
                                onChange={(e) => setInstanceInput({ ...instanceInput, facebook: e.target.value })}
                            />
                            <div id="error-instance-facebook" className='validation-elements text-red-500 text-xs'></div>
                        </div>
                    </div>

                    <div className="">
                        <label htmlFor="instance-instagram">
                            Instagram
                        </label>
                        <div className="">
                            <input
                                type="text"
                                id="instance-instagram"
                                className="form-input"
                                autoComplete='off'
                                placeholder='Instagram'
                                value={instanceInput.instagram}
                                onChange={(e) => setInstanceInput({ ...instanceInput, instagram: e.target.value })}
                            />
                            <div id="error-instance-instagram" className='validation-elements text-red-500 text-xs'></div>
                        </div>
                    </div>

                    <div className="">
                        <label htmlFor="instance-youtube">
                            YouTube
                        </label>
                        <div className="">
                            <input
                                type="text"
                                id="instance-youtube"
                                className="form-input"
                                autoComplete='off'
                                placeholder='YouTube'
                                value={instanceInput.youtube}
                                onChange={(e) => setInstanceInput({ ...instanceInput, youtube: e.target.value })}
                            />
                            <div id="error-instance-youtube" className='validation-elements text-red-500 text-xs'></div>
                        </div>
                    </div>

                    <div className="col-span-2">
                        <div className="flex items-center justify-between">
                            <div className=""></div>

                            <div className="flex items-center gap-4">

                                <Link
                                    href={`/instances`}
                                    type="button"
                                    className="btn btn-dark">
                                    <FontAwesomeIcon icon={faArrowLeft} className='w-4 h-4 mr-2' />
                                    Kembali
                                </Link>

                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={() => {
                                        saveInstance();
                                    }}>
                                    <FontAwesomeIcon icon={faSave} className='w-4 h-4 mr-2' />
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>


            {(CurrentUser?.role_id && ([1, 2, 3, 4, 5].includes(CurrentUser?.role_id) || (CurrentUser?.role_id === 9 && CurrentUser?.instance_type === 'kepala'))) && (
                <>
                    <div className="panel">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="text-lg font-semibold">
                                Daftar {instance?.code === '4.01.0.00.0.00.01.0000' ? 'Bagian' : 'Bidang'}
                                &nbsp; - &nbsp;
                                {datas?.length} {instance?.code === '4.01.0.00.0.00.01.0000' ? 'Bagian' : 'Bidang'}
                            </div>
                            <div className="">

                                <button
                                    type="button"
                                    className="btn btn-info whitespace-nowrap"
                                    onClick={() => addNewData()} >
                                    <IconPlus className="w-4 h-4" />
                                    <span className="ltr:ml-2 rtl:mr-2">
                                        Tambah {instance?.code === '4.01.0.00.0.00.01.0000' ? ' Bagian' : ' Bidang'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="table-responsive mb-5">
                            <table>
                                <thead>
                                    <tr>
                                        <th>
                                            Nama {instance?.code === '4.01.0.00.0.00.01.0000' ? 'Bagian' : 'Bidang'}
                                        </th>
                                        <th>
                                            Program
                                        </th>
                                        <th>
                                            Admin
                                        </th>
                                        <th className="!text-center">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {datas?.map((data: any, index: number) => (
                                        <tr>
                                            <td>
                                                <div className="font-semibold">
                                                    {data?.name} {data?.alias ? '(' + data?.alias + ')' : ''}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                                                    {data?.CreatedBy && (
                                                        <Tippy
                                                            content={`Dibuat Oleh ${data?.CreatedBy}`}
                                                            placement='top-start'>
                                                            <div className="flex items-center cursor-pointer">
                                                                <FontAwesomeIcon icon={faUser} className='w-3 h-3 mr-2' />
                                                                <span>
                                                                    {data?.CreatedBy}
                                                                </span>
                                                            </div>
                                                        </Tippy>
                                                    )}
                                                    {data?.UpdatedBy && (
                                                        <Tippy
                                                            content={`Diperbarui Oleh ${data?.UpdatedBy}`}
                                                            placement='top-start'>
                                                            <div className="flex items-center cursor-pointer">
                                                                <FontAwesomeIcon icon={faUserAlt} className='w-3 h-3 mr-2' />
                                                                <span>
                                                                    {data?.UpdatedBy}
                                                                </span>
                                                            </div>
                                                        </Tippy>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="">
                                                    {data?.programs?.map((prg: any, indexPrg: number) => (
                                                        <div className="">
                                                            {prg?.fullcode} - {prg?.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="">
                                                    {data?.admins?.map((adm: any, indexPrg: number) => (
                                                        <div className="">
                                                            {adm?.fullname}
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center justify-center gap-2">
                                                    <Tippy content="Edit">
                                                        <button
                                                            type="button"
                                                            onClick={() => editData(data?.id)}
                                                            className='btn btn-primary btn-sm'>
                                                            <IconEdit className='w-4 h-4' />
                                                        </button>
                                                    </Tippy>
                                                    <Tippy content="Hapus">
                                                        <button
                                                            type="button"
                                                            onClick={() => confirmDelete(data?.id)}
                                                            className='btn btn-danger btn-sm'>
                                                            <IconTrash className='w-4 h-4' />
                                                        </button>
                                                    </Tippy>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
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
                                        <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg w-full max-w-[100%] md:max-w-[60%] max-h-[calc(100vh-200px)] my-8 text-black dark:text-white-dark overflow-auto">
                                            <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                                <h5 className="font-bold text-lg">
                                                    {dataInput.inputType == 'create' ? 'Tambah ' : 'Edit '} {instance?.code === '4.01.0.00.0.00.01.0000' ? ' Bagian' : ' Bidang'}
                                                </h5>
                                                <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalInput(false)}>
                                                    <IconX></IconX>
                                                </button>
                                            </div>
                                            <div className="p-5">

                                                <div className="space-y-3 min-h-[calc(100vh-400px)]">
                                                    <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
                                                        <div className='xl:col-span-2'>
                                                            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                                Nama {instance?.code === '4.01.0.00.0.00.01.0000' ? ' Bagian' : ' Bidang'}
                                                                <span className='text-red-600 mx-1'>*</span>
                                                            </label>
                                                            <div className="">
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    id="name"
                                                                    className="form-input"
                                                                    autoComplete='off'
                                                                    placeholder={instance?.code === '4.01.0.00.0.00.01.0000' ? 'Masukkan Nama Bagian' : 'Masukkan Nama Bidang'}
                                                                    value={dataInput.name}
                                                                    onChange={(e) => setDataInput({ ...dataInput, name: e.target.value })}
                                                                />
                                                                <div id="error-name" className='validation-elements text-red-500 text-xs'></div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label htmlFor="alias" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                                Nama Alias
                                                                <span className='text-red-600 mx-1'>*</span>
                                                            </label>
                                                            <div className="">
                                                                <input
                                                                    type="text"
                                                                    name="alias"
                                                                    id="alias"
                                                                    autoComplete='off'
                                                                    className="form-input"
                                                                    placeholder="Masukkan Nama Alias"
                                                                    value={dataInput.alias}
                                                                    onChange={(e) => setDataInput({ ...dataInput, alias: e.target.value })}
                                                                />
                                                                <div id="error-alias" className='validation-elements text-red-500 text-xs'></div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                                Kode {instance?.code === '4.01.0.00.0.00.01.0000' ? ' Bagian' : ' Bidang'}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="code"
                                                                id="code"
                                                                autoComplete='off'
                                                                className="form-input"
                                                                placeholder={instance?.code === '4.01.0.00.0.00.01.0000' ? 'Masukkan Kode Bagian' : 'Masukkan Kode Bidang'}
                                                                value={dataInput.code}
                                                                onChange={(e) => setDataInput({ ...dataInput, code: e.target.value })}
                                                            />
                                                            <div id="error-code" className='validation-elements text-red-500 text-xs'></div>
                                                        </div>

                                                        <div className="">
                                                            <label htmlFor="programs" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                                Pilih Program
                                                                <span className='text-red-600 mx-1'>*</span>
                                                            </label>
                                                            <Select
                                                                id="programs"
                                                                placeholder="Pilih Program"
                                                                options={optionPrograms}
                                                                value={optionPrograms?.filter((item: any) => dataInput?.programs?.includes(item.value)) ?? []}
                                                                onChange={(e: any) => {
                                                                    const values = e.map((item: any) => item.value);
                                                                    setDataInput({
                                                                        ...dataInput,
                                                                        programs: values,
                                                                    });
                                                                }}
                                                                isMulti
                                                                isSearchable={true} />
                                                            <div id="error-programs" className='validation-elements text-red-500 text-xs'></div>
                                                        </div>

                                                        <div className="">
                                                            <label htmlFor="admins" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                                Pilih Admin Data Input
                                                                <span className='text-red-600 mx-1'>*</span>
                                                            </label>
                                                            <Select
                                                                id="admins"
                                                                placeholder="Pilih Admin Data Input"
                                                                options={optionAdmin}
                                                                value={optionAdmin?.filter((item: any) => dataInput?.admins?.includes(item.value)) ?? []}
                                                                onChange={(e: any) => {
                                                                    const values = e.map((item: any) => item.value);
                                                                    setDataInput({
                                                                        ...dataInput,
                                                                        admins: values,
                                                                    });
                                                                }}
                                                                isMulti
                                                                isSearchable={true} />
                                                            <div id="error-admins" className='validation-elements text-red-500 text-xs'></div>
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="flex justify-end items-center mt-4">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger"
                                                        onClick={() => setModalInput(false)}>
                                                        Batalkan
                                                    </button>

                                                    {saveLoading == false ? (
                                                        <>
                                                            <button
                                                                type="button"
                                                                className="btn btn-success ltr:ml-4 rtl:mr-4"
                                                                onClick={() => save()}>
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
            )}

        </div>
    );
}
export default InstancePageSlug;
