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
import { faEdit, faTrash, faPlus, faTimes, faCog, faAngleDoubleDown, faTrashAlt, faCaretDown, faAngleDoubleUp, faExclamationTriangle, faCaretLeft, faCaretRight, faCheckCircle, faCloudDownloadAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import IconX from '@/components/Icon/IconX';
import Page403 from '@/components/Layouts/Page403';
import IconLoader from '@/components/Icon/IconLoader';
import { fetchInstances } from '@/apis/fetchdata';
import IconSearch from '@/components/Icon/IconSearch';
import IconXCircle from '@/components/Icon/IconXCircle';
import { getIndex, postDelete, postSave } from '@/apis/pohon_kinerja';
import { faEye } from '@fortawesome/free-regular-svg-icons';

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
        dispatch(setPageTitle('Pohon Kinerja'));
    });

    const [isMounted, setIsMounted] = useState(false);
    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null)

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [CurrentUser, setCurrentUser] = useState<any>([]);

    const { t, i18n } = useTranslation();
    const route = useRouter();

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
    const [emptyData, setEmptyData] = useState<boolean>(true);
    const [isLoadingData, setIsLoadingData] = useState<boolean>(true)


    useEffect(() => {
        if (isMounted) {
            if (CurrentUser?.role_id !== 9) {
                fetchInstances().then((data: any) => {
                    setInstances(data?.data?.map((item: any) => {
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
        if (isMounted && instance && periode?.id) {
            setEmptyData(false);
            setDatas([]);
            getIndex(periode?.id, instance).then((res: any) => {
                if (res?.status === 'success') {
                    setDatas(res.data);
                    if (res?.data?.length == 0) {
                        setEmptyData(true);
                    }
                }
            });
        }
    }, [isMounted, instance, periode?.id])

    const [saveLoading, setSaveLoading] = useState<boolean>(false);
    const [safeToSave, setSafeToSave] = useState<boolean>(false);
    const [dataInput, setDataInput] = useState<any>({
        type: null,
        id: null,
    });

    const [modalView, setModalView] = useState<boolean>(false);
    const [dataView, setDataView] = useState<any>({})

    const openView = (data: any) => {
        setModalView(true);
        setDataView(data)
    }

    const closeModalView = () => {
        setModalView(false)
        setDataView({});
    }

    const [modalInput, setModalInput] = useState<boolean>(false);

    const onChangeFile = (e: any) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setDataInput({
                'type': dataInput?.type,
                'id': dataInput?.id,
                'periode_id': dataInput?.periode_id,
                'instance_id': dataInput?.instance_id,
                'name': dataInput?.name,
                'file': dataInput?.file,
                'newFile': reader.result ?? '',
                'filePath': file,
                'description': dataInput?.description,
            })
        }

        console.log(dataInput)
    }

    const removeFile = () => {
        setDataInput((prev: any) => {
            const updated = { ...prev };
            updated['filePath'] = '';
            updated['newFile'] = '';
            return updated;
        });
    }

    const openCreate = () => {
        setModalInput(true)
        setDataInput({
            type: 'create',
            id: null,
            periode_id: periode?.id,
            instance_id: instance,
            name: '',
            file: '',
            newFile: '',
            filePath: '',
            description: '',
        });
        setSafeToSave(true)
    }

    const openEdit = (data: any) => {
        setModalInput(true)
        setDataInput({
            type: 'edit',
            id: data?.id,
            periode_id: data?.periode_id,
            instance_id: data?.instance_id,
            name: data?.name,
            file: data?.file,
            newFile: '',
            filePath: '',
            description: data?.description,
        });
        setSafeToSave(true)
    }

    const closeModalInput = () => {
        setModalInput(false)
        setDataInput({
            type: null,
            id: '',
        });
        setSafeToSave(false)
    }

    const save = () => {
        var elements = document.getElementsByClassName('errordiv');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = '';
        }
        // postSave
        if (safeToSave) {
            postSave(dataInput).then((res: any) => {
                if (res.status == 'error validation') {
                    Object.keys(res.message).map((key: any, index: any) => {
                        let element = document.getElementById('error-' + key);
                        if (element) {
                            element.innerHTML = res.message[key][0];
                        }
                    });
                    showAlert('error', 'Please check your input!');
                }

                if (res?.status === 'success') {
                    showAlert('success', res?.message);
                    if (isMounted) {
                        setEmptyData(false);
                        setDatas([]);
                        getIndex(periode?.id, instance).then((res: any) => {
                            if (res?.status === 'success') {
                                setDatas(res.data);
                                if (res?.data?.length == 0) {
                                    setEmptyData(true);
                                }
                            }
                        });
                    }
                    closeModalInput();
                }
            })
        } else {
            showAlert('info', 'Mohon Tunggu Beberapa Saat!');
            return;
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
                title: 'Hapus Pohon Kinerja?',
                text: "Apakah Anda yakin untuk menghapus Pohon Kinerja Ini!",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Tidak!',
                reverseButtons: true,
                padding: '2em',
            })
            .then((result) => {
                if (result.value) {
                    postDelete(id, periode?.id, instance).then((res: any) => {
                        if (res.status == 'error validation') {
                            Object.keys(res.message).map((key: any, index: any) => {
                                showAlert('info', res.message[key][0]);
                            });
                        }
                        if (res.status == 'success') {
                            showAlert('success', res?.message);
                            setDatas([]);
                            if (isMounted) {
                                setEmptyData(false);
                                setDatas([]);
                                getIndex(periode?.id, instance).then((res: any) => {
                                    if (res?.status === 'success') {
                                        setDatas(res.data);
                                        if (res?.data?.length == 0) {
                                            setEmptyData(true);
                                        }
                                    }
                                });
                            }
                        }
                        if (res.status === 'error') {
                            showAlert('error', res?.message);
                        }
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire('Batal', 'Batal menghapus Pohon Kinerja', 'info');
                }
            });
    }


    if (CurrentUser?.role_id && [1, 2, 3, 6, 9].includes(CurrentUser?.role_id)) {
        return (
            <>
                <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5 px-5">
                    <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                        Pohon Kinerja
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
                        <div className="panel text-primary mb-8">
                            <div className="flex justify-between">
                                <div></div>
                                <div className="flex items-center gap-2">
                                    <div className="">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                openCreate()
                                            }}
                                            className="btn btn-outline-primary">
                                            <FontAwesomeIcon icon={faPlus} className='w-4 h-4 me-2' />
                                            Buat Pohon Kinerja
                                        </button>
                                    </div>
                                    {/* <div className="relative">
                                        <input
                                            type="text"
                                            className="peer form-input bg-gray-100 placeholder:tracking-widest ltr:pl-9 ltr:pr-9 rtl:pl-9 rtl:pr-9 sm:bg-transparent ltr:sm:pr-4 rtl:sm:pl-4"
                                            placeholder="Pencarian..."
                                        />
                                        <button type="button" className="absolute inset-0 h-9 w-9 appearance-none peer-focus:text-primary ltr:right-auto rtl:left-auto">
                                            <IconSearch className="mx-auto" />
                                        </button>
                                        <button type="button" className="absolute top-1/2 block -translate-y-1/2 hover:opacity-80 ltr:right-2 rtl:left-2" onClick={() => setSearch(false)}>
                                            <IconXCircle />
                                        </button>
                                    </div> */}
                                </div>
                            </div>

                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">

                            {(datas?.length == 0 && emptyData == false) && (
                                <div className="w-full xl:col-span-4">
                                    <div className="flex justify-center items-center mt-4">
                                        <IconLoader className="w-24 h-24 animate-spin inline-block align-middle ltr:mr-2 rtl:ml-2 shrink-0" />
                                    </div>
                                </div>
                            )}

                            {(datas?.length == 0 && emptyData) && (
                                <div className="w-full xl:col-span-4">
                                    <div className="panel">
                                        <div className="flex items-center justify-center text-warning">
                                            <FontAwesomeIcon icon={faExclamationTriangle} className='w-8 h-8 me-2' />
                                            <div className="text-center text-xl font-semibold">
                                                Sepertinya Perangkat Daerah Ini belum memiliki Pohon Kinerja.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {datas?.map((data: any, index: number) => (
                                <div className="panel cursor-pointer hover:bg-slate-50 dark:hover:bg-dark hover:shadow-xl transition-all duration-500">

                                    {(CurrentUser?.role_id && [1, 2, 3, 6].includes(CurrentUser?.role_id)) && (
                                        <div className="text-xs">
                                            {data?.instance_name}
                                        </div>
                                    )}
                                    <div className="text-lg font-semibold mb-4">
                                        {data?.name}
                                    </div>
                                    <div className="line-clamp-3 mb-4">
                                        {data?.description}
                                    </div>
                                    <div className="mb-4">
                                        <div className="flex items-center gap-1">
                                            <span>
                                                File
                                            </span>
                                            <span>
                                                <FontAwesomeIcon icon={faCheckCircle} className='w-3 h-3 text-success' />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap justify-center items-center gap-3 pt-4 border-t">

                                        <Tippy content="Lihat Pohon Kinerja">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    openView(data)
                                                }}
                                                className="btn btn-outline-info rounded-full w-10 h-10 p-0">
                                                <FontAwesomeIcon icon={faEye} className='w-4 h-4' />
                                            </button>
                                        </Tippy>

                                        <Tippy content="Edit Pohon Kinerja">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    openEdit(data)
                                                }}
                                                className="btn btn-outline-primary rounded-full w-10 h-10 p-0">
                                                <FontAwesomeIcon icon={faEdit} className='w-4 h-4' />
                                            </button>
                                        </Tippy>

                                        <Tippy content="Hapus Pohon Kinerja">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    confirmDelete(data?.id)
                                                }}
                                                className="btn btn-outline-danger rounded-full w-10 h-10 p-0">
                                                <FontAwesomeIcon icon={faTrashAlt} className='w-4 h-4' />
                                            </button>
                                        </Tippy>

                                    </div>
                                </div>
                            ))}

                            {datas?.length > 0 && (
                                <div className="panel cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900 hover:shadow-xl transition-all duration-500 group"
                                    onClick={(e) => {
                                        openCreate()
                                    }}>
                                    <div className="flex flex-col items-center justify-center w-full h-full">
                                        <div className="text-primary">
                                            <FontAwesomeIcon icon={faPlusCircle} className='w-8 h-8' />
                                        </div>
                                        <div className="text-center text-xl text-primary opacity-0 group-hover:opacity-100 transition-all duration-500">
                                            Buat Pohon Kinerja
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>


                        <Transition appear show={modalView} as={Fragment}>
                            <Dialog as="div" open={modalView} onClose={() => closeModalView()}>
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
                                            <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-[100%] md:max-w-[80%] my-8 text-black dark:text-white-dark">
                                                <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                                    <h5 className="font-bold text-lg">
                                                        Preview Pohon Kinerja
                                                    </h5>
                                                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => closeModalView()}>
                                                        <IconX></IconX>
                                                    </button>
                                                </div>
                                                <div className="p-5">


                                                    {dataView?.file && (
                                                        <div className="">
                                                            <iframe src={dataView?.file} className='w-full h-[calc(100vh-200px)]'></iframe>
                                                        </div>
                                                    )}


                                                    <div className="flex justify-end items-center gap-4 mt-4">
                                                        {dataView?.file && (
                                                            <a
                                                                href={dataView?.file}
                                                                target='_blank'
                                                                download={dataView?.file}
                                                                className="btn btn-outline-info">
                                                                Unduh
                                                                <FontAwesomeIcon icon={faCloudDownloadAlt} className='h-4 w-4 ms-2' />
                                                            </a>
                                                        )}
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger"
                                                            onClick={() => closeModalView()}>
                                                            Tutup
                                                            <FontAwesomeIcon icon={faTimes} className='h-4 w-4 ms-2' />
                                                        </button>
                                                    </div>

                                                </div>
                                            </Dialog.Panel>
                                        </Transition.Child>
                                    </div>
                                </div>
                            </Dialog>
                        </Transition>


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
                                                        {dataInput?.type === 'edit' ? 'Edit' : 'Tambah'} Pohon Kinerja
                                                    </h5>
                                                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => closeModalInput()}>
                                                        <IconX></IconX>
                                                    </button>
                                                </div>
                                                <div className="p-5">

                                                    <div className="space-y-5">

                                                        {([1, 2, 3, 4, 5, 6, 7, 8].includes(CurrentUser?.role_id)) && (
                                                            <div className="">
                                                                <label>
                                                                    Perangkat Daerah:
                                                                </label>

                                                                <div className="relative">
                                                                    <Select
                                                                        placeholder="Pilih Perangkat Daerah"
                                                                        isSearchable={true}
                                                                        isDisabled={true}
                                                                        value={instances?.find((item: any) => item.value === instance) ?? null}
                                                                        className='w-full'
                                                                        onChange={(value: any) => {
                                                                            setInstance(value?.value);
                                                                        }}
                                                                        options={instances} />
                                                                </div>
                                                                <div id="error-instance" className='errordiv text-xs text-danger mt-2'></div>
                                                            </div>
                                                        )}

                                                        <div className="">
                                                            <label>
                                                                Judul:
                                                            </label>
                                                            <div className="">
                                                                {safeToSave ? (
                                                                    <>
                                                                        <input
                                                                            type='text'
                                                                            placeholder='Judul Pohon Kinerja'
                                                                            className='form-input'
                                                                            autoComplete='off'
                                                                            value={dataInput?.name}
                                                                            onChange={(e) => {
                                                                                setDataInput((prev: any) => {
                                                                                    const updated = { ...prev };
                                                                                    updated['name'] = e.target.value;
                                                                                    return updated;
                                                                                });
                                                                            }}
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    <IconLoader className="animate-spin inline-block align-middle ltr:mr-2 rtl:ml-2 shrink-0" />
                                                                )}
                                                            </div>
                                                            <div id="error-name" className='errordiv text-xs text-danger mt-2'></div>
                                                        </div>

                                                        <div className="">
                                                            <label>
                                                                Deskripsi:
                                                            </label>
                                                            <div className="">
                                                                {safeToSave ? (
                                                                    <>
                                                                        <textarea
                                                                            placeholder='Deskripsi'
                                                                            className='form-input min-h-[200px]'
                                                                            value={dataInput?.description}
                                                                            onChange={(e) => {
                                                                                setDataInput((prev: any) => {
                                                                                    const updated = { ...prev };
                                                                                    updated['description'] = e.target.value;
                                                                                    return updated;
                                                                                });
                                                                            }}></textarea>
                                                                    </>
                                                                ) : (
                                                                    <IconLoader className="animate-spin inline-block align-middle ltr:mr-2 rtl:ml-2 shrink-0" />
                                                                )}
                                                            </div>
                                                            <div id="error-description" className='errordiv text-xs text-danger mt-2'></div>
                                                        </div>

                                                        {(dataInput?.file != '' || dataInput?.newFile != '') && (
                                                            <div className="relative py-4">
                                                                {dataInput?.newFile && (
                                                                    <>
                                                                        <div className="absolute top-5 left-4">
                                                                            Preview :
                                                                        </div>
                                                                        <div className="absolute top-6 right-4">
                                                                            <button type='button' onClick={(e) => { removeFile() }}>
                                                                                <FontAwesomeIcon icon={faTrashAlt} className='w-4 h-4 text-danger' />
                                                                            </button>
                                                                        </div>
                                                                    </>
                                                                )}
                                                                <iframe src={dataInput?.newFile != '' ? dataInput?.newFile : dataInput?.file} className='w-full'></iframe>
                                                            </div>
                                                        )}

                                                        <div className="">
                                                            <label>
                                                                Berkas:
                                                            </label>
                                                            <div className="">
                                                                {safeToSave ? (
                                                                    <>
                                                                        <input
                                                                            type='file'
                                                                            className='form-input'
                                                                            accept='.pdf'
                                                                            onChange={(e) => onChangeFile(e)}
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    <IconLoader className="animate-spin inline-block align-middle ltr:mr-2 rtl:ml-2 shrink-0" />
                                                                )}
                                                            </div>
                                                            <div className='text-xs font-normal text-info ms-2'>
                                                                *berkas berbentuk PDF
                                                            </div>
                                                            <div id="error-filePath" className='errordiv text-xs text-danger mt-2'></div>
                                                        </div>

                                                    </div>

                                                    {safeToSave ? (
                                                        <div className="flex justify-end items-center mt-4">
                                                            <button type="button" className="btn btn-outline-danger" onClick={() => closeModalInput()}>
                                                                Tutup
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
                                                    ) : (
                                                        <div className="flex justify-end items-center mt-4">
                                                            <IconLoader className="animate-spin inline-block align-middle ltr:mr-2 rtl:ml-2 shrink-0" />
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
        )
    } else {
        return (
            <Page403 />
        );
    }
};

export default Index;
