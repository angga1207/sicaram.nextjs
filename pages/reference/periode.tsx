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

import { fetchPeriodes } from '@/apis/fetchdata';
import { storePeriode, updatePeriode } from '@/apis/storedata';

import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconPlus from '@/components/Icon/IconPlus';
import IconX from '@/components/Icon/IconX';
import IconEdit from '@/components/Icon/IconEdit';
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
};

const Index = () => {
    const dispatch = useDispatch();
    const ref = useRef(null);

    useEffect(() => {
        dispatch(setPageTitle('Referensi Periode'));
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

    useEffect(() => {
        fetchPeriodes().then((res) => {
            if (res.status == 'success') {
                setDatas(res.data);
            }
            if (res.status == 'error') {
                showAlert('error', res.message);
            }
        });
    }, []);

    const [modalInput, setModalInput] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [dataInput, setDataInput] = useState<any>({
        inputType: 'create',
        id: '',
        name: '',
        start_date: '',
        end_date: '',
        status: '',
    });

    const [optionYearsStart, setOptionYearsStart] = useState<any>([]);
    const [optionYearsEnd, setOptionYearsEnd] = useState<any>([]);
    useEffect(() => {
        let years = [];
        let currentYear = new Date().getFullYear() + 10;
        for (let i = currentYear; i >= 2020; i--) {
            years.push(i);
        }
        setOptionYearsStart(years);
        setOptionYearsEnd(years);

    }, []);

    const addData = () => {
        setSaveLoading(false);
        setDataInput({
            inputType: 'create',
            id: '',
            name: '',
            start_date: '',
            end_date: '',
            status: '',
        });
        setModalInput(true);
    }

    const editData = (id: any) => {
        const startDate = new Date(datas.find((x: any) => x.id == id).start_date).getFullYear();
        const endDate = new Date(datas.find((x: any) => x.id == id).end_date).getFullYear();
        setDataInput({
            inputType: 'edit',
            id: id,
            name: datas?.find((x: any) => x.id == id).name,
            start_date: startDate,
            end_date: endDate,
            status: datas?.find((x: any) => x.id == id).status,
        });
        setSaveLoading(false);
        setModalInput(true);
    }

    const save = () => {
        setSaveLoading(true);

        if (dataInput?.inputType == 'create') {
            storePeriode(dataInput).then((res) => {
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
                    fetchPeriodes().then((res) => {
                        if (res.status == 'success') {
                            setDatas(res.data);
                        }
                        if (res.status == 'error') {
                            showAlert('error', res.message);
                        }
                    });
                    setSaveLoading(false);
                }
                if (res.status == 'error') {
                    showAlert('error', res.message);
                    setSaveLoading(false);
                }
            });
        };

        if (dataInput?.inputType == 'edit') {
            updatePeriode(dataInput).then((res) => {
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
                    fetchPeriodes().then((res) => {
                        if (res.status == 'success') {
                            setDatas(res.data);
                        }
                        if (res.status == 'error') {
                            showAlert('error', res.message);
                        }
                    });
                    setSaveLoading(false);
                }
                if (res.status == 'error') {
                    showAlert('error', res.message);
                    setSaveLoading(false);
                }
            });
        }
    }

    if (CurrentUser?.role_id && [1, 2].includes(CurrentUser?.role_id)) {
        return (
            <>
                <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5 px-5">
                    <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                        Referensi Periode
                    </h2>
                    <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">

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
                                    <th className='!text-center border !min-w-[300px]'>
                                        Nama
                                    </th>
                                    <th className='!text-center border !w-[200px]'>
                                        Tahun Awal
                                    </th>
                                    <th className='!text-center border !w-[200px]'>
                                        Tahun Akhir
                                    </th>
                                    <th className='!text-center border !w-[200px]'>
                                        Status
                                    </th>
                                    <th className="!text-center border !w-[150px]'">
                                        Opt
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {datas?.map((data: any, index: any) => (
                                    <tr key={index}>
                                        <td className='!text-center border'>
                                            {data?.name}
                                        </td>
                                        <td className='!text-center border'>
                                            {new Date(data?.start_date).getFullYear()}
                                        </td>
                                        <td className='!text-center border'>
                                            {new Date(data?.end_date).getFullYear()}
                                        </td>
                                        <td className='!text-center border'>
                                            {data?.status == 'active' ? (
                                                <span className="badge bg-success">Aktif</span>
                                            ) : (
                                                <span className="badge bg-danger">Tidak Aktif</span>
                                            )}
                                        </td>
                                        <td className='border'>
                                            <div className="flex items-center justify-center">
                                                <Tippy content="Edit" placement="top" arrow={false} delay={100}>
                                                    <button type="button"
                                                        className="btn btn-outline-info px-2 py-2"
                                                        onClick={() => {
                                                            editData(data?.id);
                                                        }}>
                                                        <IconEdit className="w-4 h-4" />
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
                                    <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-[100%] md:max-w-[40%] my-8 text-black dark:text-white-dark">
                                        <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                            <h5 className="font-bold text-lg">
                                                {dataInput?.inputType == 'create' ? 'Tambah Periode' : 'Edit Periode'}
                                            </h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalInput(false)}>
                                                <IconX className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="p-5">

                                            <div className="space-y-3">

                                                {(dataInput?.start_date || dataInput?.end_date) && (
                                                    <div className="">
                                                        <label className="form-label font-normal text-xs mb-0.5">
                                                            Nama Periode
                                                        </label>
                                                        <div className="form-input">
                                                            {dataInput?.start_date}
                                                            {dataInput?.end_date && ' - ' + dataInput?.end_date}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="">
                                                    <label htmlFor="start_date" className="form-label font-normal text-xs mb-0.5">
                                                        Tahun Awal
                                                    </label>
                                                    <select
                                                        className='form-select font-normal'
                                                        name="start_date"
                                                        value={dataInput?.start_date}
                                                        onChange={(e) => setDataInput({ ...dataInput, start_date: e.target.value })}
                                                    >
                                                        <option value="" hidden>Pilih Tahun Awal</option>
                                                        {optionYearsStart?.map((year: any, index: any) => (
                                                            <option key={index} value={year}>{year}</option>
                                                        ))}
                                                    </select>
                                                    <div id="error-start_date" className='validation-elements text-red-500 text-xs'></div>
                                                </div>

                                                <div className="">
                                                    <label htmlFor="end_date" className="form-label font-normal text-xs mb-0.5">
                                                        Tahun Akhir
                                                    </label>
                                                    <select
                                                        className='form-select font-normal'
                                                        name="end_date"
                                                        value={dataInput?.end_date}
                                                        onChange={(e) => setDataInput({ ...dataInput, end_date: e.target.value })}
                                                    >
                                                        <option value="" hidden>Pilih Tahun Akhir</option>
                                                        {optionYearsEnd?.map((year: any, index: any) => (
                                                            <option key={index} value={year}>{year}</option>
                                                        ))}
                                                    </select>
                                                    <div id="error-end_date" className='validation-elements text-red-500 text-xs'></div>
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

};

export default Index;

