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
import { faEdit, faTrash, faPlus, faTimes, faCog, faAngleDoubleDown, faTrashAlt, faCaretDown, faAngleDoubleUp, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import IconX from '@/components/Icon/IconX';
import Page403 from '@/components/Layouts/Page403';

import { getIndex, getDetail, update } from '@/apis/target_tujuan_sasaran'

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
        dispatch(setPageTitle('Target Tujuan & Sasaran Kabupaten Ogan Ilir'));
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

    const [periode, setPeriode] = useState<number>(1);
    const [datas, setDatas] = useState<any>([]);

    useEffect(() => {
        if (isMounted) {
            getIndex(periode, null).then((data: any) => {
                if (data.status === 'success') {
                    setDatas(data.data);
                }
            })
        }
    }, [isMounted])

    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const [collapsedId, setCollapsedId] = useState<any>(null);

    const collapseSasaran = (id: any) => {
        if (collapsedId === id) {
            setIsCollapsed(false)
            setCollapsedId(null)
        } else {
            setIsCollapsed(true);
            setCollapsedId(id);
        }
    }

    const [modalInput, setModalInput] = useState<boolean>(false);
    const [saveLoading, setSaveLoading] = useState<boolean>(false);
    const [safeToSave, setSafeToSave] = useState<boolean>(false);
    const [dataInput, setDataInput] = useState<any>({
        inputType: 'tujuan',
        id: '',
        data: [],
    });

    const closeModalInput = () => {
        setModalInput(false)
        setDataInput({
            inputType: 'tujuan',
            id: '',
        });
        setSafeToSave(false)
    }

    const editTujuan = (id: any) => {
        setModalInput(true);
        setSafeToSave(false)
        setDataInput({
            inputType: 'tujuan',
            id: id,
        });
        getDetail('tujuan', id, periode, null).then((data: any) => {
            if (data?.status == 'success') {
                setDataInput({
                    inputType: 'tujuan',
                    id: data?.data?.tujuan_id ?? id,
                    data: data?.data?.indikator_tujuan,
                    tujuan: data?.data?.tujuan
                });
                setSafeToSave(true)
            }
        })
    }

    const editSasaran = (id: any) => {
        setModalInput(true);
        setSafeToSave(false)
        setDataInput({
            inputType: 'sasaran',
            id: id,
        });
        getDetail('sasaran', id, periode, null).then((data: any) => {
            if (data?.status == 'success') {
                setDataInput({
                    inputType: 'sasaran',
                    id: data?.data?.sasaran_id ?? id,
                    data: data?.data?.indikator_sasaran,
                    tujuan: data?.data?.tujuan,
                    sasaran: data?.data?.sasaran,
                });
                setSafeToSave(true)
            }
        })
    }

    const save = () => {
        if (safeToSave) {
            update(dataInput).then((res: any) => {
                if (res?.status === 'success') {
                    showAlert('success', res?.message);

                    if (isMounted) {
                        getIndex(periode, null).then((data: any) => {
                            if (data.status === 'success') {
                                setDatas(data.data);
                            }
                        })
                    }
                }
            })
        } else {
            showAlert('info', 'Mohon Tunggu Beberapa Saat!');
            return;
        }
    }



    if (CurrentUser?.role_id && [1, 2, 3, 6].includes(CurrentUser?.role_id)) {
        return (
            <>
                <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5 px-5">
                    <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                        Target Tujuan & Sasaran Kabupaten
                    </h2>
                    <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">
                        {/* <button type="button" onClick={() => addTujuan()} className="btn btn-info whitespace-nowrap gap-1">
                            <IconPlus className="w-4 h-4" />
                            Tambah Tujuan
                        </button> */}
                    </div>
                </div>

                <div className="panel">
                    <div className="table-responsive h-[calc(100vh-200px)] pb-10">
                        <table className="table">
                            <thead className='sticky top-0 left-0'>
                                <tr className='!bg-dark text-white'>
                                    <th className='!w-[10px] text-center border' rowSpan={2} colSpan={1}>#</th>
                                    <th rowSpan={2} colSpan={1} className='text-center border'>
                                        Tujuan
                                        {isCollapsed && (
                                            <span className='text-xs font-normal'>
                                                &nbsp; / Sasaran
                                            </span>
                                        )}
                                    </th>
                                    <th rowSpan={2} colSpan={1} className='text-center border'>
                                        Indikator
                                    </th>
                                    <th colSpan={5} rowSpan={1} className='text-center border !w-[500px]'>
                                        Target
                                    </th>
                                    <th className='!w-[100px] border' rowSpan={2} colSpan={1}>
                                        <div className="flex items-center justify-center ">
                                            <FontAwesomeIcon icon={faCog} className="w-5 h-5" />
                                        </div>
                                    </th>
                                </tr>
                                <tr className='!bg-dark text-white'>
                                    <th className='!w-[125px] text-center border text-xs'>
                                        2022
                                    </th>
                                    <th className='!w-[125px] text-center border text-xs'>
                                        2023
                                    </th>
                                    <th className='!w-[125px] text-center border text-xs'>
                                        2024
                                    </th>
                                    <th className='!w-[125px] text-center border text-xs'>
                                        2025
                                    </th>
                                    <th className='!w-[125px] text-center border text-xs'>
                                        2026
                                    </th>
                                </tr>
                            </thead>
                            <tbody>

                                {datas?.map((item: any, index: number) => (
                                    <>
                                        <tr className={(isCollapsed && collapsedId === item?.id) ? 'border bg-slate-100' : 'border'}>
                                            <td rowSpan={item.indikator_tujuan.length} className='border text-center'>
                                                {index + 1}
                                            </td>
                                            <td rowSpan={item.indikator_tujuan.length} className='border font-semibold'>
                                                {item?.tujuan}
                                            </td>
                                            <td className='border font-semibold'>
                                                {item?.indikator_tujuan[0]?.name ?? '-'}
                                            </td>
                                            <td className='text-center font-semibold'>
                                                {item?.indikator_tujuan[0]?.target[0]?.value ?? '-'}
                                            </td>
                                            <td className='text-center font-semibold'>
                                                {item?.indikator_tujuan[0]?.target[1]?.value ?? '-'}
                                            </td>
                                            <td className='text-center font-semibold'>
                                                {item?.indikator_tujuan[0]?.target[2]?.value ?? '-'}
                                            </td>
                                            <td className='text-center font-semibold'>
                                                {item?.indikator_tujuan[0]?.target[3]?.value ?? '-'}
                                            </td>
                                            <td className='text-center font-semibold'>
                                                {item?.indikator_tujuan[0]?.target[4]?.value ?? '-'}
                                            </td>
                                            <td rowSpan={item.indikator_tujuan.length} className='border'>
                                                <div className="flex justify-center items-center gap-3">
                                                    <Tippy content={(isCollapsed && collapsedId === item?.id) ? "Tutup Sasaran" : "Buka Sasaran"}>
                                                        <button type="button"
                                                            onClick={() => collapseSasaran(item.id)}
                                                        >
                                                            <FontAwesomeIcon icon={faAngleDoubleDown}
                                                                className={(isCollapsed && collapsedId === item?.id) ? 'w-4 h-4 text-secondary transition-all duration-400 rotate-180' : 'w-4 h-4 text-secondary transition-all duration-400'}
                                                            />
                                                        </button>
                                                    </Tippy>
                                                    <Tippy content="Edit Tujuan">
                                                        <button type="button"
                                                            onClick={() => editTujuan(item.id)}
                                                        >
                                                            <FontAwesomeIcon icon={faEdit} className="w-4 h-4 text-primary" />
                                                        </button>
                                                    </Tippy>
                                                </div>
                                            </td>
                                        </tr>
                                        {item?.indikator_tujuan?.map((ind: any, key: number) => (
                                            <>
                                                {key > 0 && (
                                                    <tr className={(isCollapsed && collapsedId === item?.id) ? 'border bg-slate-100' : 'border'}>
                                                        <td className='border font-semibold'>
                                                            {ind?.name}
                                                        </td>
                                                        <td className='text-center font-semibold'>
                                                            {ind?.target[0]?.value ?? '-'}
                                                        </td>
                                                        <td className='text-center font-semibold'>
                                                            {ind?.target[1]?.value ?? '-'}
                                                        </td>
                                                        <td className='text-center font-semibold'>
                                                            {ind?.target[2]?.value ?? '-'}
                                                        </td>
                                                        <td className='text-center font-semibold'>
                                                            {ind?.target[3]?.value ?? '-'}
                                                        </td>
                                                        <td className='text-center font-semibold'>
                                                            {ind?.target[4]?.value ?? '-'}
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        ))}

                                        {(isCollapsed && collapsedId == item?.id) && (
                                            <>
                                                {item?.sasaran?.length == 0 && (
                                                    <tr className='border bg-slate-100'>
                                                        <td colSpan={100} className='text-center'>
                                                            <div className="flex items-center justify-center gap-1">
                                                                <FontAwesomeIcon icon={faExclamationTriangle} className='w-4 h-4 text-warning' />
                                                                <span className='text-base font-semibold'>
                                                                    Tidak Ada Sasaran
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                                {item?.sasaran?.map((sas: any, indSas: number) => (
                                                    <>
                                                        <tr className='border bg-slate-100'>
                                                            <td rowSpan={sas.indikator_sasaran.length} className='border text-center'>
                                                                #
                                                            </td>
                                                            <td rowSpan={sas.indikator_sasaran.length} className='border'>
                                                                <div className="ps-3">
                                                                    {sas?.sasaran}
                                                                </div>
                                                            </td>
                                                            <td className='border'>
                                                                {sas?.indikator_sasaran[0]?.name ?? '-'}
                                                            </td>
                                                            <td className='text-center'>
                                                                {sas?.indikator_sasaran[0]?.target[0]?.value ?? '-'}
                                                            </td>
                                                            <td className='text-center'>
                                                                {sas?.indikator_sasaran[0]?.target[1]?.value ?? '-'}
                                                            </td>
                                                            <td className='text-center'>
                                                                {sas?.indikator_sasaran[0]?.target[2]?.value ?? '-'}
                                                            </td>
                                                            <td className='text-center'>
                                                                {sas?.indikator_sasaran[0]?.target[3]?.value ?? '-'}
                                                            </td>
                                                            <td className='text-center'>
                                                                {sas?.indikator_sasaran[0]?.target[4]?.value ?? '-'}
                                                            </td>
                                                            <td rowSpan={sas.indikator_sasaran.length} className='border text-center'>
                                                                <div className="flex justify-center items-center gap-3">
                                                                    <Tippy content="Edit Sasaran">
                                                                        <button type="button"
                                                                            onClick={() => editSasaran(sas.id)}
                                                                        >
                                                                            <FontAwesomeIcon icon={faEdit} className="w-4 h-4 text-info" />
                                                                        </button>
                                                                    </Tippy>
                                                                </div>
                                                            </td>
                                                        </tr>

                                                        {sas?.indikator_sasaran?.map((ind: any, key: number) => (
                                                            <>
                                                                {key > 0 && (
                                                                    <tr className='border bg-slate-100'>
                                                                        <td className='border'>
                                                                            {ind?.name}
                                                                        </td>
                                                                        <td className='text-center'>
                                                                            {ind?.target[0]?.value ?? '-'}
                                                                        </td>
                                                                        <td className='text-center'>
                                                                            {ind?.target[1]?.value ?? '-'}
                                                                        </td>
                                                                        <td className='text-center'>
                                                                            {ind?.target[2]?.value ?? '-'}
                                                                        </td>
                                                                        <td className='text-center'>
                                                                            {ind?.target[3]?.value ?? '-'}
                                                                        </td>
                                                                        <td className='text-center'>
                                                                            {ind?.target[4]?.value ?? '-'}
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </>
                                                        ))}
                                                    </>
                                                ))}
                                            </>
                                        )}
                                    </>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>


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
                                                {dataInput.inputType == 'tujuan' ? 'Target Tujuan' : 'Target Sasaran'}
                                            </h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => closeModalInput()}>
                                                <IconX></IconX>
                                            </button>
                                        </div>
                                        <div className="p-5">

                                            <div className="space-y-5">

                                                <div className="">
                                                    <div className='underline font-semibold'>
                                                        Tujuan:
                                                    </div>
                                                    {!dataInput?.tujuan && (
                                                        <div className='mt-2 w-100 h-6 bg-slate-200 rounded animate-pulse'>
                                                        </div>
                                                    )}
                                                    <div className="">
                                                        {dataInput?.tujuan}
                                                    </div>
                                                </div>

                                                {dataInput.inputType == 'sasaran' && (
                                                    <div className="">
                                                        <div className='underline font-semibold'>
                                                            Sasaran:
                                                        </div>
                                                        {!dataInput?.sasaran && (
                                                            <div className='mt-2 w-100 h-6 bg-slate-200 rounded animate-pulse'>
                                                            </div>
                                                        )}
                                                        <div className="">
                                                            {dataInput?.sasaran}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="">
                                                    <div className='underline font-semibold'>
                                                        Indikator:
                                                    </div>


                                                    {!dataInput?.data && (
                                                        <div className='mt-2 w-100 h-12 bg-slate-200 rounded animate-pulse'>
                                                        </div>
                                                    )}

                                                    <Tab.Group>
                                                        <Tab.List className="mt-3 flex flex-wrap justify-between space-x-2 rtl:space-x-reverse">

                                                            {dataInput?.data?.map((item: any, index: number) => (
                                                                <Tab as={Fragment}>
                                                                    {({ selected }) => (
                                                                        <div className="flex-auto text-center !outline-none">
                                                                            <button
                                                                                className={`${selected ? 'bg-info text-white !outline-none' : ''}
                                                    -mb-[1px] block w-full rounded p-3.5 py-2 before:inline-block hover:bg-info hover:text-white`}
                                                                            >
                                                                                {item?.name}
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </Tab>
                                                            ))}

                                                        </Tab.List>
                                                        <Tab.Panels>

                                                            {dataInput?.data?.map((item: any, index: number) => (
                                                                <Tab.Panel>
                                                                    <div className={index == 0 ? 'active pt-5' : 'pt-5'}>
                                                                        <div className='underline font-semibold'>
                                                                            Rumus:
                                                                        </div>
                                                                        <div className="">
                                                                            {item?.rumus}
                                                                        </div>

                                                                        <hr className='my-4' />

                                                                        <div className='underline font-semibold'>
                                                                            Target:
                                                                        </div>

                                                                        <div className="grid xl:grid-cols-3 gap-4 mt-3">
                                                                            {item?.target?.map((target: any, key: number) => (
                                                                                <div key={'target-item' + key}>
                                                                                    <label className='text-sm' htmlFor={'target-item-' + target?.year}>
                                                                                        Tahun {target?.year}
                                                                                    </label>
                                                                                    <input
                                                                                        id={'target-item-' + target?.year}
                                                                                        type="search"
                                                                                        autoComplete='off'
                                                                                        placeholder={"Target Tahun " + target?.year}
                                                                                        value={target?.value}
                                                                                        onChange={(e) =>
                                                                                            setDataInput((prev: any) => {
                                                                                                const updated = { ...prev };
                                                                                                updated['data'][index]['target'][key] = {
                                                                                                    year: target?.year,
                                                                                                    value: e.target.value
                                                                                                }
                                                                                                return updated;
                                                                                            })
                                                                                        }
                                                                                        className="form-input" />
                                                                                </div>
                                                                            ))}
                                                                        </div>

                                                                    </div>
                                                                </Tab.Panel>
                                                            ))}

                                                        </Tab.Panels>
                                                    </Tab.Group>

                                                </div>

                                            </div>

                                            {safeToSave && (
                                                <div className="flex justify-end items-center mt-4">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => closeModalInput()}>
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
                                            )}

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
