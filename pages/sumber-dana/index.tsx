import { useEffect, useState, Fragment, use } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setPageTitle } from '@/store/themeConfigSlice';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';
import Dropdown from '@/components/Dropdown';
import Swal from 'sweetalert2';
import Link from 'next/link';

import IconTrashLines from '@/components/Icon/IconTrashLines';
import IconPlus from '@/components/Icon/IconPlus';
import IconEdit from '@/components/Icon/IconEdit';
import IconX from '@/components/Icon/IconX';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconSearch from '@/components/Icon/IconSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faCalendarPlus, faCaretRight, faChevronRight, faCog, faEdit, faEye, faFileUpload, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { fetchSumberDanas } from '@/apis/fetchdata';
import { uploadExcelSumberDana } from '@/apis/storedata';
import Select from 'react-select';
import { deleteRefRekening, storeRefRekening, updateRefRekening, uploadExcel } from '@/apis/storedata';
import IconEye from '@/components/Icon/IconEye';
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

    useEffect(() => {
        dispatch(setPageTitle('Sumber Dana'));
    });

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

    const [datas, setDatas] = useState<any>([]);
    const [level, setLevel] = useState(1);
    const [modalInput, setModalInput] = useState(false);
    const [modalImport, setModalImport] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [noData, setNoData] = useState(false);
    const [file, setFile] = useState<any>(null);
    const [dataInput, setDataInput] = useState<any>({
        inputType: 'create',
        id: '',
        parent_id: '',
        rek_1_id: '',
        rek_2_id: '',
        rek_3_id: '',
        rek_4_id: '',
        rek_5_id: '',
        level: '',
        name: '',
        fullcode: '',
        code: '',
    });


    useEffect(() => {
        if (isMounted && periode?.id) {
            fetchSumberDanas(periode?.id).then((res) => {
                if (res.status === 'success') {
                    setDatas(res.data);
                }

                if (res.status === 'error') {
                    setNoData(true);
                    showAlert('error', res.message)
                }
            });
        }
    }, [isMounted, periode?.id]);


    const addImport = () => {
        setSaveLoading(false);
        setModalImport(true);
        setFile(null);
    }

    const uploadFile = () => {
        uploadExcelSumberDana(file, periode?.id, year).then((res: any) => {
            if (res.status == 'success') {
                setModalImport(false);
                fetchSumberDanas(periode?.id).then((res) => {
                    if (res.status === 'success') {
                        setDatas(res.data);
                    }

                    if (res.status === 'error') {
                        setNoData(true);
                        showAlert('error', res.message)
                    }
                });
                showAlert('success', res.message);
            }

            if (res.status != 'success') {
                console.log(res)
                showAlert('error', res.message);
            }
        });
    }

    const addData = (data: any) => {
        showAlert('info', 'Fitur ini belum tersedia');
    }

    const editData = (data: any) => {
        showAlert('info', 'Fitur ini belum tersedia');
    }

    const confirmDeleteData = (data: any) => {
        showAlert('info', 'Fitur ini belum tersedia');
    }


    if (CurrentUser?.role_id && [1, 2, 3, 4, 6, 7].includes(CurrentUser?.role_id)) {
        return (
            <>
                <div className="">
                    <div className="flex flex-col md:flex-row gap-y-3 items-center justify-between mb-5 px-5">
                        <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light">
                            Daftar Sumber Dana
                            <div className='text-xs font-normal text-red-500'>
                                *Data ini baru bisa ditambah & dirubah melalui import excel
                            </div>
                        </h2>
                        <div className="flex items-center justify-center gap-1">
                            <button type="button" className="btn btn-primary whitespace-nowrap" onClick={() => addImport()} >
                                <FontAwesomeIcon icon={faFileUpload} className="w-4 h-4" />
                                <span className="ltr:ml-2 rtl:mr-2">Import Excel</span>
                            </button>

                            {/* <button type="button" className="btn btn-info whitespace-nowrap">
                                <IconPlus className="w-4 h-4" />
                                <span className="ltr:ml-2 rtl:mr-2">Tambah</span>
                            </button> */}
                        </div>

                    </div>
                </div>

                <div className="panel">
                    <div className="table-responsive mb-3">
                        <table className="table-hover align-middle">
                            <thead>
                                <tr>
                                    <th className='!py-5 border w-[150px] !text-center'>
                                        Kode
                                    </th>
                                    <th colSpan={2} className='!py-5 border min-w-[500px]'>
                                        Uraian
                                    </th>
                                    <th className="!py-5 border !text-center w-[150px]">
                                        Option
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {datas?.map((data: any, index: number) => (
                                    <>
                                        <tr key={index}
                                            className='cursor-pointer group'>
                                            <td className="!py-1 border">
                                                <div className="text-xs">
                                                    {data?.fullcode}
                                                </div>
                                            </td>
                                            <td colSpan={2}
                                                className="!py-1 !px-0 border">
                                                <div className="flex items-center gap-x-1">
                                                    <IconEye className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-success" />
                                                    <div className='text-xs'>
                                                        {data?.name}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="!py-1 border !text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Tippy content="Edit" placement="top" arrow={false} delay={100} duration={200} >
                                                        <button type="button" className="btn btn-outline-info px-1 py-1" onClick={() => editData(data)} >
                                                            <IconEdit className="w-4 h-4" />
                                                        </button>
                                                    </Tippy>
                                                    <Tippy content="Hapus" placement="top" arrow={false} delay={100} duration={200} >
                                                        <button type="button" className="btn btn-outline-danger px-1 py-1" onClick={() => confirmDeleteData(data)} >
                                                            <IconTrashLines className="w-4 h-4" />
                                                        </button>
                                                    </Tippy>
                                                </div>
                                            </td>
                                        </tr>
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>


                {/* <Transition appear show={modalInput} as={Fragment}>
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
                                    <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-[100%] md:max-w-[70%] my-8 text-black dark:text-white-dark">

                                        <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                            <h5 className="font-bold text-lg">
                                                {dataInput.inputType == 'create' ? 'Tambah Rekening' : 'Edit Rekening'}
                                            </h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalInput(false)}>
                                                <IconX></IconX>
                                            </button>
                                        </div>

                                        <div className="p-5 pb-10 w-full h-[calc(100vh-350px)] relative overflow-auto">
                                            <div className="flex flex-col sm:flex-row gap-4">

                                                <div className={dataInput?.level >= 2 ? 'w-full sm:w-1/2 space-y-3 relative' : 'hidden'}>

                                                    <div className={dataInput?.level >= 1 ? '' : 'hidden'}>
                                                        <label className='text-xs font-normal'>
                                                            Akun
                                                        </label>
                                                        <Select
                                                            placeholder="Pilih Rekening Akun"
                                                            className='text-xs'
                                                            options={options1}
                                                            value={
                                                                dataInput?.rek_1_id ?
                                                                    options1?.filter((data: any) => data.value == dataInput?.rek_1_id)[0]
                                                                    : null
                                                            }
                                                            onChange={(e) => {
                                                                setDataInput({
                                                                    ...dataInput,
                                                                    rek_1_id: e?.value,
                                                                    rek_2_id: '',
                                                                    rek_3_id: '',
                                                                    rek_4_id: '',
                                                                    rek_5_id: '',
                                                                    level: 2,
                                                                });

                                                                fetchRekenings(periode, 2, e?.value).then((res) => {
                                                                    if (res.status === 'success') {
                                                                        setOptions2(res.data.map((data: any) => ({
                                                                            value: data.id,
                                                                            label: data.fullcode + ' - ' + data.name,
                                                                        })) ?? []);
                                                                    }
                                                                });
                                                                setOptions3([]);
                                                                setOptions4([]);
                                                                setOptions5([]);
                                                                setOptions6([]);
                                                            }}
                                                            isDisabled={dataInput.inputType == 'edit' ? true : false}
                                                        />
                                                    </div>

                                                    <div className={dataInput?.level >= 2 ? '' : 'hidden'}>
                                                        <label className='text-xs font-normal'>
                                                            Kelompok
                                                        </label>
                                                        <Select
                                                            placeholder="Pilih Rekening Kelompok"
                                                            className='text-xs'
                                                            options={options2}
                                                            value={
                                                                dataInput?.rek_2_id ?
                                                                    options2?.filter((data: any) => data.value == dataInput?.rek_2_id)[0]
                                                                    : null
                                                            }
                                                            onChange={(e) => {
                                                                setDataInput({
                                                                    ...dataInput,
                                                                    rek_2_id: e?.value,
                                                                    rek_3_id: '',
                                                                    rek_4_id: '',
                                                                    rek_5_id: '',
                                                                    level: 3,
                                                                });

                                                                fetchRekenings(periode, 3, e?.value).then((res) => {
                                                                    if (res.status === 'success') {
                                                                        setOptions3(res.data.map((data: any) => ({
                                                                            value: data.id,
                                                                            label: data.fullcode + ' - ' + data.name,
                                                                        })) ?? []);
                                                                    }
                                                                });
                                                                setOptions4([]);
                                                                setOptions5([]);
                                                                setOptions6([]);
                                                            }}
                                                            isDisabled={dataInput.inputType == 'edit' ? true : false}
                                                        />
                                                    </div>

                                                    <div className={dataInput?.level >= 3 ? '' : 'hidden'}>
                                                        <label className='text-xs font-normal'>
                                                            Jenis
                                                        </label>
                                                        <Select
                                                            placeholder="Pilih Rekening Jenis"
                                                            className='text-xs'
                                                            options={options3}
                                                            value={
                                                                dataInput?.rek_3_id ?
                                                                    options3?.filter((data: any) => data.value == dataInput?.rek_3_id)[0]
                                                                    : null
                                                            }
                                                            onChange={(e) => {
                                                                setDataInput({
                                                                    ...dataInput,
                                                                    rek_3_id: e?.value,
                                                                    rek_4_id: '',
                                                                    rek_5_id: '',
                                                                    level: 4,
                                                                });

                                                                fetchRekenings(periode, 4, e?.value).then((res) => {
                                                                    if (res.status === 'success') {
                                                                        setOptions4(res.data.map((data: any) => ({
                                                                            value: data.id,
                                                                            label: data.fullcode + ' - ' + data.name,
                                                                        })) ?? []);
                                                                    }
                                                                });
                                                                setOptions5([]);
                                                                setOptions6([]);
                                                            }}
                                                            isDisabled={dataInput.inputType == 'edit' ? true : false}
                                                        />
                                                    </div>

                                                    <div className={dataInput?.level >= 4 ? '' : 'hidden'}>
                                                        <label className='text-xs font-normal'>
                                                            Objek
                                                        </label>
                                                        <Select
                                                            placeholder="Pilih Rekening Objek"
                                                            className='text-xs'
                                                            options={options4}
                                                            value={
                                                                dataInput?.rek_4_id ?
                                                                    options4?.filter((data: any) => data.value == dataInput?.rek_4_id)[0]
                                                                    : null
                                                            }
                                                            onChange={(e) => {
                                                                setDataInput({
                                                                    ...dataInput,
                                                                    rek_4_id: e?.value,
                                                                    rek_5_id: '',
                                                                    level: 5,
                                                                });

                                                                fetchRekenings(periode, 5, e?.value).then((res) => {
                                                                    if (res.status === 'success') {
                                                                        setOptions5(res.data.map((data: any) => ({
                                                                            value: data.id,
                                                                            label: data.fullcode + ' - ' + data.name,
                                                                        })) ?? []);
                                                                    }
                                                                });
                                                                setOptions6([]);
                                                            }}
                                                            isDisabled={dataInput.inputType == 'edit' ? true : false}
                                                        />
                                                    </div>

                                                    <div className={dataInput?.level >= 5 ? '' : 'hidden'}>
                                                        <label className='text-xs font-normal'>
                                                            Rincian
                                                        </label>
                                                        <Select
                                                            placeholder="Pilih Rekening Rincian"
                                                            className='text-xs'
                                                            options={options5}
                                                            value={
                                                                dataInput?.rek_5_id ?
                                                                    options5?.filter((data: any) => data.value == dataInput?.rek_5_id)[0]
                                                                    : null
                                                            }
                                                            onChange={(e) => {
                                                                setDataInput({
                                                                    ...dataInput,
                                                                    rek_5_id: e?.value,
                                                                    level: 6,
                                                                });

                                                                fetchRekenings(periode, 6, e?.value).then((res) => {
                                                                    if (res.status === 'success') {
                                                                        setOptions6(res.data.map((data: any) => ({
                                                                            value: data.id,
                                                                            label: data.fullcode + ' - ' + data.name,
                                                                        })) ?? []);
                                                                    }
                                                                });
                                                            }}
                                                            isDisabled={dataInput.inputType == 'edit' ? true : false}
                                                        />
                                                    </div>

                                                </div>

                                                <div className={dataInput?.level >= 2 ? 'w-full sm:w-1/2 space-y-3' : 'w-full'}>

                                                    <div>
                                                        <label className="text-xs font-normal">
                                                            Kode
                                                            {dataInput?.level == 1 ? ' Akun' : ''}
                                                            {dataInput?.level == 2 ? ' Kelompok' : ''}
                                                            {dataInput?.level == 3 ? ' Jenis' : ''}
                                                            {dataInput?.level == 4 ? ' Objek' : ''}
                                                            {dataInput?.level == 5 ? ' Rincian' : ''}
                                                            {dataInput?.level == 6 ? ' Sub Rincian' : ''}
                                                        </label>
                                                        <div className="">
                                                            <input
                                                                type="number"
                                                                onKeyDown={(e) => {
                                                                    if (e.key == 'e') {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                                className="form-input font-normal text-xs px-2"
                                                                placeholder="Masukkan Kode"
                                                                value={dataInput?.code}
                                                                onChange={(e) => setDataInput({ ...dataInput, code: e.target.value })}
                                                            />
                                                            <div id="error-code" className='validation-elements text-red-500 text-xs'></div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="text-xs font-normal">
                                                            Uraian Rekening
                                                            {dataInput?.level == 1 ? ' Akun' : ''}
                                                            {dataInput?.level == 2 ? ' Kelompok' : ''}
                                                            {dataInput?.level == 3 ? ' Jenis' : ''}
                                                            {dataInput?.level == 4 ? ' Objek' : ''}
                                                            {dataInput?.level == 5 ? ' Rincian' : ''}
                                                            {dataInput?.level == 6 ? ' Sub Rincian' : ''}
                                                        </label>
                                                        <div className="">
                                                            <textarea
                                                                className="form-input h-[100px] resize-none font-normal text-xs px-2"
                                                                placeholder={
                                                                    (dataInput?.level == 1 ? 'Masukkan Uraian Akun' : '') ||
                                                                    (dataInput?.level == 2 ? 'Masukkan Uraian Kelompok' : '') ||
                                                                    (dataInput?.level == 3 ? 'Masukkan Uraian Jenis' : '') ||
                                                                    (dataInput?.level == 4 ? 'Masukkan Uraian Objek' : '') ||
                                                                    (dataInput?.level == 5 ? 'Masukkan Uraian Rincian' : '')
                                                                }
                                                                value={dataInput?.name}
                                                                onChange={(e) => setDataInput({ ...dataInput, name: e.target.value })}
                                                            ></textarea>
                                                            <div id="error-name" className='validation-elements text-red-500 text-xs'></div>
                                                        </div>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>

                                        <div className="sticky bottom-0 left-0 w-full p-4 bg-white dark:bg-slate-900">
                                            <div className="flex justify-end items-center">
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
                </Transition > */}

                <Transition appear show={modalImport} as={Fragment}>
                    <Dialog as="div" open={modalImport} onClose={() => setModalImport(false)}>
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
                                    <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-[100%] md:max-w-[50%] my-8 text-black dark:text-white-dark">

                                        <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                            <h5 className="font-bold text-lg">
                                                Import Sumber Dana
                                            </h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalImport(false)}>
                                                <IconX></IconX>
                                            </button>
                                        </div>

                                        <div className="p-5 pb-10 w-full relative overflow-auto">
                                            <div className="flex flex-col space-y-3">

                                                <div>
                                                    <label className="text-xs font-normal">
                                                        Pilih File Excel
                                                    </label>
                                                    <div className="">
                                                        <input type="file" className="form-input" onChange={(e: any) => setFile(e?.target?.files[0])} accept='.xlsx,.xls' />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="sticky bottom-0 left-0 w-full p-4 bg-white dark:bg-slate-900">
                                            <div className="flex justify-end items-center">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setModalImport(false)}>
                                                    Batalkan
                                                </button>

                                                {saveLoading == false ? (
                                                    <>
                                                        <button type="button" className="btn btn-success ltr:ml-4 rtl:mr-4" onClick={() => uploadFile()}>
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
                </Transition >
            </>
        );
    }
    return (
        <Page403 />
    );

}

export default Index;
