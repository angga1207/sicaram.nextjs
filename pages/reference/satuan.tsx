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

import { fetchSatuans } from '@/apis/fetchdata';
import { deleteSatuan, storeSatuan, updateSatuan } from '@/apis/storedata';

import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconPlus from '@/components/Icon/IconPlus';
import IconX from '@/components/Icon/IconX';
import IconEdit from '@/components/Icon/IconEdit';
import IconSearch from '@/components/Icon/IconSearch';
import IconTrashLines from '@/components/Icon/IconTrashLines';
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
        dispatch(setPageTitle('Referensi Satuan'));
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

    const route = useRouter();

    const [datas, setDatas] = useState<any>([]);
    const [search, setSearch] = useState<any>('');
    const [modalInput, setModalInput] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [dataInput, setDataInput] = useState<any>({
        inputType: 'create',
        id: '',
        name: '',
        description: '',
        status: '',
    });

    useEffect(() => {
        fetchSatuans(search).then((res) => {
            if (res.status == 'success') {
                setDatas(res.data);
            }
            if (res.status == 'error') {
                showAlert('error', res.message);
            }
        });
    }, [search]);

    const addData = () => {
        setSaveLoading(false);
        setDataInput({
            inputType: 'create',
            id: '',
            name: '',
            description: '',
            status: '',
        });
        setModalInput(true);
    }

    const editData = (id: any) => {
        setSaveLoading(false);
        setDataInput({
            inputType: 'edit',
            id: id,
            name: datas?.find((x: any) => x.id == id)?.name,
            description: datas?.find((x: any) => x.id == id)?.description,
            status: datas?.find((x: any) => x.id == id)?.status,
        });
        setModalInput(true);
    }

    const save = () => {
        setSaveLoading(true);
        if (dataInput?.inputType == 'create') {
            storeSatuan(dataInput).then((res) => {
                if (res.status == 'error validation') {
                    setSaveLoading(false);
                    Object.keys(res.message).map((key: any, index: any) => {
                        let element = document.getElementById('error-' + key);
                        if (element) {
                            element.innerHTML = res.message[key][0];
                        }
                    });
                }
                if (res.status == 'success') {
                    showAlert('success', res.message);
                    setModalInput(false);
                    fetchSatuans(search).then((res) => {
                        if (res.status == 'success') {
                            setDatas(res.data);
                        }
                        if (res.status == 'error') {
                            showAlert('error', res.message);
                        }
                    });
                }
                if (res.status == 'error') {
                    showAlert('error', res.message);
                }
            });
        }
        if (dataInput?.inputType == 'edit') {
            updateSatuan(dataInput).then((res) => {
                if (res.status == 'error validation') {
                    setSaveLoading(false);
                    Object.keys(res.message).map((key: any, index: any) => {
                        let element = document.getElementById('error-' + key);
                        if (element) {
                            element.innerHTML = res.message[key][0];
                        }
                    });
                }
                if (res.status == 'success') {
                    showAlert('success', res.message);
                    setModalInput(false);
                    fetchSatuans(search).then((res) => {
                        if (res.status == 'success') {
                            setDatas(res.data);
                        }
                        if (res.status == 'error') {
                            showAlert('error', res.message);
                        }
                    });
                }
                if (res.status == 'error') {
                    showAlert('error', res.message);
                }
            });
        }
    }

    const deleteData = (id: any) => {
        deleteSatuan(id).then((res) => {
            if (res.status == 'success') {
                showAlert('success', res.message);
                fetchSatuans(search).then((res) => {
                    if (res.status == 'success') {
                        setDatas(res.data);
                    }
                    if (res.status == 'error') {
                        showAlert('error', res.message);
                    }
                });
            }
            if (res.status == 'error') {
                showAlert('error', res.message);
            }
        });
    }

    if (CurrentUser?.role_id && [10, 11].includes(CurrentUser?.role_id)) {
        return (
            <Page403 />
        )
    }

    return (
        <>
            <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5 px-5">
                <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                    Referensi Satuan
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">

                    <div className="relative">
                        <form onSubmit={
                            (e) => {
                                e.preventDefault();
                                setSearch(ref?.current?.value);
                            }
                        }>
                            <input type="search"
                                className="form-input rtl:pl-12 ltr:pr-12"
                                placeholder='Cari Satuan...'
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value == '') {
                                        setSearch(value);
                                    }
                                }}
                                ref={ref}
                            />
                        </form>
                        <div className="absolute rtl:left-0 ltr:right-0 top-0 bottom-0 flex items-center justify-center w-12 h-full">
                            <IconSearch className="w-4 h-4 text-slate-400" />
                        </div>
                    </div>


                    <button type="button" onClick={() => addData()} className="btn btn-info whitespace-nowrap gap-1">
                        <IconPlus className="w-4 h-4" />
                        Tambah
                    </button>

                </div>
            </div>

            <div className="panel">
                <div className="table-responsive mb-5">
                    <table className="table-hover">
                        <thead>
                            <tr>
                                <th className='border !min-w-[300px]'>
                                    Nama
                                </th>
                                <th className="!text-center border !w-[0px]'">
                                    Opt
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {datas?.map((data: any, index: any) => (
                                <tr key={index}>
                                    <td className='border !py-1'>
                                        {data?.name}
                                    </td>
                                    <td className='border !py-1'>
                                        <div className="flex gap-1 items-center justify-center">

                                            <Tippy content="Edit" placement="top" arrow={false} delay={100}>
                                                <button type="button"
                                                    className="btn btn-outline-info px-1.5 py-1.5"
                                                    onClick={() => {
                                                        editData(data?.id);
                                                    }}>
                                                    <IconEdit className="w-3 h-3" />
                                                </button>
                                            </Tippy>

                                            {[1, 2, 3, 4, 5].includes(CurrentUser?.role_id) && (
                                                <Tippy content="Hapus" placement="top" arrow={false} delay={100}>
                                                    <button type="button"
                                                        className="btn btn-outline-danger px-1.5 py-1.5"
                                                        onClick={() => {
                                                            Swal.fire({
                                                                title: 'Apakah Anda Yakin?',
                                                                text: "Data yang dihapus tidak dapat dikembalikan!",
                                                                icon: 'warning',
                                                                showCancelButton: true,
                                                                confirmButtonText: 'Ya, Hapus!',
                                                                cancelButtonText: 'Tidak, Batalkan!',
                                                                reverseButtons: true
                                                            }).then((result) => {
                                                                if (result.isConfirmed) {
                                                                    deleteData(data?.id);
                                                                }
                                                            }
                                                            );
                                                        }
                                                        }>
                                                        <IconTrashLines className="w-3 h-3" />
                                                    </button>
                                                </Tippy>
                                            )}

                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {datas?.length == 0 && (
                                <>
                                    <tr>
                                        <td colSpan={5} className="text-center">
                                            <div className="w-full h-[30px] rounded animate-pulse bg-slate-200">
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={5} className="text-center">
                                            <div className="w-full h-[30px] rounded animate-pulse bg-slate-200">
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={5} className="text-center">
                                            <div className="w-full h-[30px] rounded animate-pulse bg-slate-200">
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={5} className="text-center">
                                            <div className="w-full h-[30px] rounded animate-pulse bg-slate-200">
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={5} className="text-center">
                                            <div className="w-full h-[30px] rounded animate-pulse bg-slate-200">
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
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-[80%] md:max-w-[40%] my-8 text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <h5 className="font-bold text-lg">
                                            {dataInput?.inputType == 'create' ? 'Tambah Satuan' : 'Edit Satuan'}
                                        </h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalInput(false)}>
                                            <IconX className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="p-5">

                                        <div className="space-y-3">

                                            <div className="">
                                                <label className="form-label font-normal text-xs mb-0.5">
                                                    Nama Satuan
                                                </label>
                                                <input
                                                    type='text'
                                                    name="name"
                                                    placeholder='Nama Satuan'
                                                    value={dataInput?.name}
                                                    autoComplete='off'
                                                    autoFocus={true}
                                                    onChange={(e) => setDataInput({ ...dataInput, name: e.target.value })}
                                                    className="form-input font-normal" />
                                                <div id="error-name" className="validation-elements text-red-500 text-xs"></div>
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
};

export default Index;
