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
import Select from 'react-select';
import { Tab } from '@headlessui/react';

import { getRefTujuanSasaran, getDetailRefTujuanSasaran, saveRefTujuanSasaran, deleteRefTujuanSasaran } from '@/apis/references';
import { fetchInstances } from '@/apis/fetchdata';

import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconPlus from '@/components/Icon/IconPlus';
import IconX from '@/components/Icon/IconX';
import IconEdit from '@/components/Icon/IconEdit';
import IconSearch from '@/components/Icon/IconSearch';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
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
        dispatch(setPageTitle('Referensi Tujuan & Sasaran'));
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

    const route = useRouter();

    const [datas, setDatas] = useState<any>([]);
    const [type, setType] = useState<any>('tujuan');
    const [pagination, setPagination] = useState<any>({
        current_page: 1,
        from: 1,
        to: 1,
        last_page: null,
        per_page: 10,
        total: 0,
    });
    const [periode, setPeriode] = useState(1);
    const [instance, setInstance] = useState<any>(CurrentUser?.instance_id ?? null);
    // const [instance, setInstance] = useState<any>(14);
    const [instances, setInstances] = useState<any>([]);
    const [isEmptyDatas, setIsEmptyDatas] = useState(false);
    const [search, setSearch] = useState<any>('');
    const [modalInput, setModalInput] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [dataInput, setDataInput] = useState<any>({
        inputType: 'create',
        id: '',
        name: '',
        instance_id: instance,
        type: type,
    });

    useEffect(() => {
        if (CurrentUser?.role_id !== 9) {
            fetchInstances().then((data: any) => {
                setInstances(data.data.map((item: any) => {
                    return {
                        value: item.id,
                        label: item.name
                    }
                }));
                setInstances([
                    {
                        value: null,
                        label: 'KABUPATEN OGAN ILIR'
                    },
                    ...data.data.map((item: any) => {
                        return {
                            value: item.id,
                            label: item.name
                        }
                    })
                ]);
            });
        }
    }, []);

    useEffect(() => {
        setIsEmptyDatas(false);
        getRefTujuanSasaran(search, pagination?.current_page, instance, type).then((res: any) => {
            if (res.status == 'success') {
                setDatas(res.data);
            }
            if (res.status == 'error') {
                showAlert('error', res.message);
            }
        });
    }, [search, type, pagination?.current_page, instance]);

    const addData = () => {
        setDataInput({
            inputType: 'create',
            id: '',
            name: '',
            instance_id: instance,
            type: type,
        });
        setModalInput(true);
    }

    const getDetail = (id: any) => {
        getDetailRefTujuanSasaran(id, type).then((res: any) => {
            if (res.status == 'success') {
                setDataInput({
                    inputType: 'edit',
                    id: res.data.id,
                    name: res.data.name,
                    status: res.data.status,
                    instance_id: res.data.instance_id,
                    type: type,
                });
                setModalInput(true);
            }
            if (res.status == 'error') {
                showAlert('error', res.message);
            }
        });
        setModalInput(true);
    }

    const save = () => {
        setSaveLoading(true);
        saveRefTujuanSasaran(dataInput).then((res: any) => {
            if (res.status == 'success') {
                setModalInput(false);
                showAlert('success', res.message);
                setSaveLoading(false);
                getRefTujuanSasaran(search, pagination?.current_page, instance, type).then((res: any) => {
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
                setSaveLoading(false);
            }
        });
    }

    const deleteData = (id: any, type: any) => {
        deleteRefTujuanSasaran(id, type).then((res: any) => {
            if (res.status == 'success') {
                showAlert('success', res.message);
                getRefTujuanSasaran(search, pagination?.current_page, instance, type).then((res: any) => {
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

    if (CurrentUser?.role_id && [1, 2, 3, 6].includes(CurrentUser?.role_id)) {
        return (
            <>
                <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5 px-5">
                    <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                        Referensi {type === 'tujuan' ? 'Tujuan' : 'Sasaran'}
                    </h2>
                    <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">

                        <div className="relative">
                            <form
                                className='flex items-center gap-2'
                                onSubmit={
                                    (e) => {
                                        e.preventDefault();
                                        setSearch(ref?.current?.value);
                                    }
                                }>
                                <Select
                                    placeholder="Pilih Perangkat Daerah"
                                    isSearchable={true}
                                    value={instances?.find((item: any) => item.value === instance) ?? null}
                                    className='w-[300px]'
                                    onChange={(value: any) => {
                                        setInstance(value?.value);
                                    }}
                                    options={instances} />

                                <input type="search"
                                    className="form-input w-[200px]"
                                    placeholder={type === 'tujuan' ? 'Cari Tujuan...' : 'Cari Sasaran...'}
                                    // value={search}
                                    onChange={(e) => {
                                        // setSearch(e.target.value);
                                        const value = e.target.value;
                                        if (value == '') {
                                            setSearch(value)
                                        }
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            setSearch(ref?.current?.value);
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

                <div className="mr-3 flex border-b border-white-light dark:border-[#191e3a]">

                    <div
                        onClick={(e) => {
                            setType('tujuan');
                            setSearch('');
                            setPagination({
                                current_page: 1,
                                from: 1,
                                to: 1,
                                last_page: null,
                                per_page: 10,
                                total: 0,
                            });
                        }}
                        className={type === 'tujuan' ?
                            `w-full rounded-tl-lg bg-primary font-semibold !border-white-light !border-b-white text-white !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:font-semibold cursor-pointer` :
                            `w-full rounded-tl-lg !border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:text-primary cursor-pointer`}>
                        Tujuan
                    </div>

                    <div
                        onClick={(e) => {
                            setType('sasaran');
                            setSearch('');
                            setPagination({
                                current_page: 1,
                                from: 1,
                                to: 1,
                                last_page: null,
                                per_page: 10,
                                total: 0,
                            });
                        }}
                        className={type === 'sasaran' ?
                            `w-full rounded-tr-lg bg-primary font-semibold !border-white-light !border-b-white text-white !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:font-semibold cursor-pointer` :
                            `w-full rounded-tr-lg !border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black dark:hover:border-b-black' -mb-[1px] flex items-center justify-center border border-transparent p-3.5 hover:text-primary cursor-pointer`}>
                        Sasaran
                    </div>

                </div>

                <div className="panel">
                    <div className="table-responsive mb-5">
                        <table className="table-hover">
                            <thead>
                                <tr>
                                    <th className='!text-center border !min-w-[300px]'>
                                        Nama {type === 'tujuan' ? 'Tujuan' : 'Sasaran'}
                                    </th>
                                    <th className='!text-center border !w-[300px]'>
                                        Perangkat Daerah
                                    </th>
                                    <th className="!text-center border !w-[100px]">
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
                                        <td className='border !py-1 !text-center'>
                                            {data?.instance?.name ?? 'Kabupaten Ogan Ilir'}
                                        </td>
                                        <td className='border !py-1'>
                                            <div className="flex gap-1 items-center justify-center">

                                                <Tippy content="Edit" placement="top" arrow={false} delay={100}>
                                                    <button type="button"
                                                        className="btn btn-outline-info px-1.5 py-1.5"
                                                        onClick={() => {
                                                            getDetail(data?.id);
                                                        }}>
                                                        <IconEdit className="w-4 h-4" />
                                                    </button>
                                                </Tippy>

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
                                                                    deleteData(data?.id, type);
                                                                }
                                                            }
                                                            );
                                                        }
                                                        }>
                                                        <IconTrashLines className="w-4 h-4" />
                                                    </button>
                                                </Tippy>

                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {(datas?.length == 0 && isEmptyDatas == false) && (
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

                                {(datas?.length == 0 && isEmptyDatas == true) && (
                                    <tr>
                                        <td colSpan={5} className="text-center">
                                            <div className='text-center font-semibold'>
                                                Tidak Ada Data Tag Sumber Dana
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                            {pagination?.last_page > 1 && (
                                <tfoot>
                                    <tr>
                                        <td colSpan={5} className="text-center">
                                            <div className="flex items-center justify-center gap-2 py-2">
                                                <button type="button" className="btn btn-outline-info px-1.5 py-1" onClick={() => {
                                                    if (pagination?.current_page > 1) {
                                                        setPagination({
                                                            current_page: pagination?.current_page - 1,
                                                            from: 1,
                                                            to: 1,
                                                            last_page: null,
                                                            per_page: 10,
                                                            total: 0,
                                                        });
                                                    }
                                                }}>
                                                    <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
                                                </button>

                                                <div className="flex items-center gap-1">
                                                    <div className="text-xs">
                                                        {pagination?.from} - {pagination?.to} dari {pagination?.total}
                                                    </div>
                                                </div>

                                                <button type="button" className="btn btn-outline-info px-1.5 py-1" onClick={() => {
                                                    if (pagination?.current_page < pagination?.last_page) {
                                                        setPagination({
                                                            current_page: pagination?.current_page + 1,
                                                            from: 1,
                                                            to: 1,
                                                            last_page: null,
                                                            per_page: 10,
                                                            total: 0,
                                                        });
                                                    }
                                                }}>
                                                    <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
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
                                                {/* {dataInput?.inputType == 'create' ? 'Tambah Tag Sumber Dana' : 'Edit Tag Sumber Dana'} */}
                                                {dataInput?.inputType == 'create' ? 'Tambah' : 'Edit'}
                                                {type === 'tujuan' ? ' Tujuan' : ' Sasaran'}
                                            </h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalInput(false)}>
                                                <IconX className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="p-5">

                                            <form className="space-y-3" onSubmit={(e) => {
                                                e.preventDefault();
                                                save();
                                            }}>

                                                <div className="">
                                                    <label className="form-label font-normal text-xs mb-0.5">
                                                        Nama
                                                        {type === 'tujuan' ? ' Tujuan' : ' Sasaran'}
                                                    </label>
                                                    <input
                                                        type='text'
                                                        name="name"
                                                        id="input-name"
                                                        placeholder={'Nama ' + (type === 'tujuan' ? 'Tujuan' : 'Sasaran')}
                                                        value={dataInput?.name}
                                                        autoComplete='off'
                                                        autoFocus={true}
                                                        onChange={(e) => setDataInput({ ...dataInput, name: e.target.value })}
                                                        className="form-input font-normal" />
                                                    <div id="error-name" className="validation-elements text-red-500 text-xs"></div>
                                                </div>

                                            </form>

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
