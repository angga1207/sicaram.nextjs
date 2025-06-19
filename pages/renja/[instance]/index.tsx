import { Tab } from '@headlessui/react';
import { Fragment, useRef } from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { Dialog, Transition } from '@headlessui/react';
import Link from "next/link";
import Swal from 'sweetalert2';
import Select from 'react-select';
import { useRouter } from 'next/router';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { getListProgramRenstraRenja, postRenjaNotes, postRenstraNotes, saveRenjaKegiatan, saveRenjaSubKegiatan, saveRenstraKegiatan, saveRenstraSubKegiatan } from '@/apis/storedata';
import { fetchDetailRenjaKegiatan, fetchDetailRenjaSubKegiatan, fetchDetailRenstraKegiatan, fetchDetailRenstraSubKegiatan, fetchRenja, fetchRenjaValidatorNotes, fetchRenstra, fetchRenstraValidatorNotes, fetchSatuans } from '@/apis/fetchdata';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faBusinessTime, faCheck, faClipboardCheck, faReplyAll, faStopwatch20, faUser, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import IconArrowLeft from '@/components/Icon/IconArrowLeft';
import IconArrowBackward from "@/components/Icon/IconArrowBackward";
import IconX from '@/components/Icon/IconX';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import IconSend from '@/components/Icon/IconSend';
import IconCalendar from '@/components/Icon/IconCalendar';
import IconUser from '@/components/Icon/IconUser';


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

const Page = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Renstra Perubahan'));
    });

    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null)
    const [years, setYears] = useState<any>([]);
    const [satuans, setSatuans] = useState<any>([]);
    const [instanceId, setInstanceId] = useState<any>(null)

    useEffect(() => {
        setIsMounted(true);
        setInstanceId(router.query.instance);
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
            fetchSatuans().then((data) => {
                setSatuans(data.data);
            });
        }
    }, [isMounted, periode?.id])

    useEffect(() => {
        if (isMounted) {
            setYears([]);
            for (let i = periode?.start_year; i <= periode?.end_year; i++) {
                setYears((prevRange: any) => [...prevRange, i]);
            }
        }
    }, [isMounted, periode?.id])

    const [instance, setInstance] = useState<any>(null);
    const [arrPrograms, setArrPrograms] = useState<any>([]);
    const [isLoadingPrograms, setIsLoadingPrograms] = useState<boolean>(false);

    const getListProgram = () => {
        setIsLoadingPrograms(true);
        getListProgramRenstraRenja(periode?.id, instanceId)
            .then((response) => {
                if (response?.status === 'success') {
                    setInstance(response.data.instance);
                    setArrPrograms(response.data.programs);
                }
            })
            .catch((error) => {
                console.error('Error fetching program data:', error);
                showAlert('error', 'Terjadi kesalahan saat mengambil data program');
            })
            .finally(() => {
                setIsLoadingPrograms(false);
            });
    }

    useEffect(() => {
        if (isMounted) {
            if (CurrentUser.instance_id) {
                if (router.query.instance != CurrentUser?.instance_id) {
                    router.push(`/renja/${CurrentUser?.instance_id}`);
                    setInstanceId(CurrentUser?.instance_id);
                    setArrPrograms([]);
                    return;
                }
            }
        }
    }, [isMounted, periode?.id, instanceId]);

    useEffect(() => {
        if (isMounted && periode?.id && instanceId && arrPrograms.length === 0 && CurrentUser) {
            getListProgram();
        }
    }, [isMounted, periode?.id, instanceId]);

    const [selectedProgram, setSelectedProgram] = useState<any>(null);

    useEffect(() => {
        if (isMounted && router.query.program && arrPrograms.length > 0) {
            const programId = router.query.program;
            const selectProgram = arrPrograms.find((program: any) => program.id == programId);
            if (selectProgram) {
                setSelectedProgram(selectProgram);
                if (periode?.id && instanceId && isLoadingData === false) {
                    _fetchRenja(periode.id, instanceId, selectProgram.id);
                }
            } else {
                setSelectedProgram(null);
            }
        }
    }, [isMounted, router.query.program, arrPrograms]);

    const [datas, setDatas] = useState<any>([]);
    const [dataInformation, setDataInformation] = useState<any>(null);
    const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

    const _fetchRenja = (periodeId: any, instanceId: any, programId: any) => {
        setIsLoadingData(true);
        setDatas([]);
        setDataInformation(null);
        fetchRenja(periodeId, instanceId, programId).then((data) => {
            if (data.status == 'success') {
                setDatas(data.data.datas);
                setDataInformation(data.data.renja);
            }
        }).catch((error) => {
            console.error('Error fetching renja data:', error);
            showAlert('error', 'Terjadi kesalahan saat mengambil data renja perubahan');
        }).finally(() => {
            setIsLoadingData(false);
        });
    }

    const [modalInput, setModalInput] = useState(false);
    const [dataInput, setDataInput] = useState<any>({
        inputType: 'create',
        type: null,
        id: '',
    });
    const [unsave, setUnsave] = useState<boolean>(false);
    const [saveLoading, setSaveLoading] = useState<boolean>(false);

    const openModalInput = (selected: any) => {
        if (selected.type == 'kegiatan') {
            fetchDetailRenjaKegiatan(periode?.id, instanceId, selected.program_id, selected.id, year).then((data) => {
                if (data.status == 'success') {
                    setDataInput({
                        ...data.data,
                        inputType: 'edit',
                    });
                }
            });
        }

        if (selected.type == 'sub-kegiatan') {
            fetchDetailRenjaSubKegiatan(periode?.id, instanceId, selected.program_id, selected.id, year).then((data) => {
                if (data.status == 'success') {
                    setDataInput({
                        ...data.data,
                        inputType: 'edit',
                    });
                }
            });
        }
        setModalInput(true);
    };

    const resetModalInput = () => {
        setDataInput({
            inputType: 'create',
            type: null,
            id: '',
        });
        setUnsave(false);
        setSaveLoading(false);
    };

    const closeModalInput = () => {
        if (isLoadingData) return;
        if (saveLoading) return;
        if (unsave) {
            Swal.fire({
                title: 'Perhatian',
                text: 'Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin menutup?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, tutup',
                cancelButtonText: 'Tidak, tetap buka',
            }).then((result) => {
                if (result.isConfirmed) {
                    resetModalInput();
                } else {
                    return;
                }
            });
        }

        setModalInput(false);
        setDataInput({
            inputType: 'create',
            type: null,
            id: '',
        });
        setUnsave(false);
    };


    const save = () => {
        if (dataInput?.type == 'kegiatan') {
            saveRenjaKegiatan(periode?.id, instanceId, selectedProgram.id, dataInput?.id, year, dataInput).then((data) => {
                if (data.status == 'success') {
                    showAlert('success', data.message);
                    setUnsave(false);
                    setModalInput(false);
                    _fetchRenja(periode?.id, instanceId, selectedProgram.id);
                }
                if (data.status == 'error') {
                    showAlert('error', data.message)
                }
            });
        }

        if (dataInput?.type == 'sub-kegiatan') {
            saveRenjaSubKegiatan(periode?.id, instanceId, selectedProgram.id, dataInput?.id, year, dataInput).then((data) => {
                if (data.status == 'success') {
                    showAlert('success', data.message);
                    setUnsave(false);
                    setModalInput(false);
                    _fetchRenja(periode?.id, instanceId, selectedProgram.id);
                }
                if (data.status == 'error') {
                    showAlert('error', data.message)
                }
            });
        }
    }

    const [message, setMessage] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [dataLogs, setDataLogs] = useState<any>([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(false);
    const [isLoadingSendMessage, setIsLoadingSendMessage] = useState<boolean>(false);

    const dummy = useRef<any>(null);
    useEffect(() => {
        dummy?.current?.scrollIntoView({ behavior: "smooth" });
    }, [dataLogs]);

    const _fetchLogs = () => {
        setDataLogs([]);
        setIsLoadingLogs(true);
        fetchRenjaValidatorNotes(periode?.id, instanceId, selectedProgram.id, dataInformation?.id)
            .then((data) => {
                if (data.status == 'success') {
                    setDataLogs(data.data);
                }
            })
            .catch((error) => {
                console.error('Error fetching logs:', error);
                showAlert('error', 'Terjadi kesalahan saat mengambil data log');
            })
            .finally(() => {
                setIsLoadingLogs(false);
            });

        document.getElementById('textarea-message')?.focus();
        setMessage('');
        setStatus('');
    }

    const sendMessage = () => {
        document.getElementById('textarea-message')?.classList.remove('border-red-500');
        document.getElementById('textarea-message')?.classList.remove('focus:border-red-500');

        document.getElementById('select-status')?.classList.remove('border-red-500');
        document.getElementById('select-status')?.classList.remove('focus:border-red-500');

        if (!message) {
            showAlert('warning', 'Pesan tidak boleh kosong');
            document.getElementById('textarea-message')?.focus();
            document.getElementById('textarea-message')?.classList.add('border-red-500');
            document.getElementById('textarea-message')?.classList.add('focus:border-red-500');
            // return false;
        }
        if (!status) {
            showAlert('warning', 'Status tidak boleh kosong');
            document.getElementById('select-status')?.focus();
            document.getElementById('select-status')?.classList.add('border-red-500');
            document.getElementById('select-status')?.classList.add('focus:border-red-500');
            // return false;
        }

        if (message && status) {
            setIsLoadingSendMessage(true);
            postRenjaNotes(periode?.id, instanceId, selectedProgram.id, dataInformation?.id, message, status)
                .then((data) => {
                    if (data.status == 'success') {
                        showAlert('success', data.message);
                        fetchRenjaValidatorNotes(periode?.id, instanceId, selectedProgram.id, dataInformation?.id).then((data) => {
                            if (data.status == 'success') {
                                setDataLogs(data.data);
                                setUnsave(false);
                                document.getElementById('textarea-message')?.focus();
                            }
                        });

                        // _fetchRenja(periode?.id, instance, selectedProgram.id);
                        setMessage('');
                        setStatus('');
                        setDataInformation((prev: any) => ({
                            ...prev,
                            status: status,
                        }));
                    }
                })
                .catch((error) => {
                    console.error('Error sending message:', error);
                    showAlert('error', 'Terjadi kesalahan saat mengirim pesan');
                })
                .finally(() => {
                    setIsLoadingSendMessage(false);
                });
        }
    }

    return (
        <>
            <div className="">
                <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5">
                    <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                        Renstra Perubahan <br />
                        {instance?.name}
                    </h2>
                    <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">
                        {!selectedProgram && (
                            <Link
                                href={`/renstra`}
                                className="btn btn-secondary whitespace-nowrap">
                                <IconArrowBackward className="w-4 h-4" />
                                <span className="ltr:ml-2 rtl:mr-2">
                                    Kembali
                                </span>
                            </Link>
                        )}
                        {selectedProgram && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (isLoadingData) return;
                                    setSelectedProgram(null);
                                    setDatas([]);
                                    setDataInformation(null);
                                    router.push({
                                        pathname: `/renja/${instanceId}`,
                                        query: {}
                                    });
                                }}
                                className="btn btn-secondary whitespace-nowrap">
                                <IconArrowBackward className="w-4 h-4" />
                                <span className="ltr:ml-2 rtl:mr-2">
                                    Kembali
                                </span>
                            </button>
                        )}
                    </div>
                </div>

                {isLoadingPrograms && (
                    <div className="flex flex-col gap-4 items-center justify-center h-[calc(100vh-200px)]">
                        <span className="text-gray-500 dark:text-white-light">
                            Memuat data program...
                        </span>
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 dark:border-white-light"></div>
                    </div>
                )}

                {!selectedProgram && (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4 font-semibold dark:text-white-dark mb-7">
                        {arrPrograms?.map((data: any, index: number) => (
                            <Tippy content={data.name} placement="top" key={index}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedProgram(data);
                                        router.push({
                                            pathname: `/renja/${instanceId}`,
                                            query: {
                                                program: data.id,
                                                year: year
                                            }
                                        });
                                    }}
                                    className="panel p-2.5 rounded-md group cursor-pointer hover:bg-primary-light text-start"
                                >
                                    <div className="text-lg">
                                        {data.fullcode}
                                    </div>
                                    <div className='group-hover:text-primary font-normal'>
                                        <h5 className="text-sm sm:text-base line-clamp-3">
                                            {data.name}
                                        </h5>
                                    </div>
                                </button>
                            </Tippy >
                        ))}
                    </div>
                )}

                {selectedProgram && (
                    <div className='panel mt-4'>
                        <Tab.Group>
                            <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={`${selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary font-bold uppercase`}>
                                            Data Renja
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (isLoadingData) return;
                                                if (selectedProgram?.id) {
                                                    _fetchLogs();
                                                }
                                            }}
                                            className={`${selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary font-bold uppercase`}>
                                            Informasi Program
                                        </button>
                                    )}
                                </Tab>
                            </Tab.List>

                            <Tab.Panels>
                                <Tab.Panel>
                                    <div className="active pt-5">
                                        <div className="flex items-center justify-center w-full divide divide-x border">
                                            {years?.map((data: any, index: number) => (
                                                <button type='button'
                                                    onClick={(e) => {
                                                        if (isLoadingData) return;
                                                        e.preventDefault();
                                                        if (year == data) return;
                                                        setYear(data)
                                                        if (router.query) {
                                                            router.query.year = data;
                                                        }
                                                        router.push(router)
                                                    }}
                                                    className={year == data ? 'px-4 py-2 grow bg-secondary-light font-bold text-secondary' : 'px-4 py-2 grow'}>
                                                    {data}
                                                </button>
                                            ))}
                                        </div>

                                        {isLoadingData && (
                                            <div className="flex flex-col gap-4 items-center justify-center h-[calc(100vh-300px)]">
                                                <span className="text-gray-500 dark:text-white-light">
                                                    Memuat data renstra perubahan...
                                                </span>
                                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 dark:border-white-light"></div>
                                            </div>
                                        )}

                                        {!isLoadingData && (
                                            <div className="mt-5 flex flex-col gap-2 select-none h-[calc(100vh-300px)] overflow-y-auto">
                                                {datas[year]?.map((data: any, index: number) => (
                                                    <>
                                                        {data?.type == 'program' && (
                                                            <div key={`${data.id}-${index}`} className="panel w-full group cursor-pointer hover:bg-success-light border border-slate-300 dark:border-slate-600 dark:hover:border-white-light">
                                                                <div className="flex flex-col sm:flex-row gap-y-2 sm:mr-5">
                                                                    <div className='grow sm:w-[500px]'>
                                                                        <div className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-700">
                                                                            {data?.program_name}
                                                                        </div>
                                                                        <div className="text-xs text-slate-500 dark:text-slate-300 group-hover:text-slate-700">
                                                                            {data?.program_fullcode}
                                                                        </div>
                                                                        <div className="flex items-center gap-x-2 text-xs mt-1">

                                                                            <Tippy content='Dibuat oleh' placement='bottom'>
                                                                                <div className="flex items-center gap-x-1 text-indigo-400">
                                                                                    <FontAwesomeIcon icon={faUser} className="w-2.5 h-2.5" />
                                                                                    {data?.created_by}
                                                                                </div>
                                                                            </Tippy>

                                                                            {data?.updated_by !== '-' && (
                                                                                <Tippy content='Diperbarui oleh' placement='bottom'>
                                                                                    <div className="flex items-center gap-x-1 text-pink-400">
                                                                                        <FontAwesomeIcon icon={faUserEdit} className="w-2.5 h-2.5" />
                                                                                        {data?.updated_by}
                                                                                    </div>
                                                                                </Tippy>
                                                                            )}

                                                                        </div>
                                                                    </div>

                                                                    <div className="">
                                                                        Anggaran <br />
                                                                        <span className='font-semibold whitespace-nowrap'>
                                                                            Rp. {data.total_anggaran_renja ? new Intl.NumberFormat(`id-ID`).format(data.total_anggaran_renja) : 0}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                <div className="mt-8 text-slate-800 dark:text-slate-200 group-hover:text-slate-700 border-y border-dotted py-1 border-slate-600 group-hover:border-white dark:border-white">
                                                                    <div className="w-full">
                                                                        <span className='font-semibold pl-4 underline'>
                                                                            Indikator Kinerja :
                                                                        </span>
                                                                        <div className="space-y-1 divide-y divide-slate-300 group-hover:divide-white mt-1 w-full pl-4">
                                                                            {(data?.indicators.length > 0) && (
                                                                                <>
                                                                                    {data?.indicators?.map((data: any, index: number) => {
                                                                                        return (
                                                                                            <div className="flex items-center justify-between w-full py-1">
                                                                                                <div className="flex items-center gap-1 grow">
                                                                                                    <IconArrowLeft className="w-4 h-4 inline-block mr-1" />
                                                                                                    <div className="">
                                                                                                        {data?.name}
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="shrink min-w-[150px]">
                                                                                                    <span className='mx-0.5'>
                                                                                                        {data?.value}
                                                                                                    </span>
                                                                                                    <span className='mx-0.5 whitespace-nowrap'>
                                                                                                        {data?.satuan_name}
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {data?.type == 'kegiatan' && (
                                                            <>
                                                                <hr className={`mt-4`} />
                                                                <Tippy content={`Klik untuk Mengubah Target`} theme='primary' placement="top-end">
                                                                    <div
                                                                        key={`${data.id}-${index}`}
                                                                        onClick={() => {
                                                                            if (isLoadingData) return;
                                                                            if (saveLoading) return;
                                                                            openModalInput(data);
                                                                        }}
                                                                        className={`panel mt-4 ml-[10px] w-[calc(100%-10px)] group cursor-pointer hover:bg-primary-light border border-slate-300 dark:border-slate-600 dark:hover:border-white-light}`}>
                                                                        <div className="flex flex-col sm:flex-row gap-y-2 sm:mr-5">
                                                                            <div className='grow sm:w-[500px]'>
                                                                                <div className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-700">
                                                                                    {data?.kegiatan_name}
                                                                                </div>
                                                                                <div className="text-xs text-slate-500 dark:text-slate-300 group-hover:text-slate-700">
                                                                                    {data?.kegiatan_fullcode}
                                                                                </div>
                                                                                <div className="flex items-center gap-x-2 text-xs mt-1">

                                                                                    <Tippy content='Dibuat oleh' placement='bottom'>
                                                                                        <div className="flex items-center gap-x-1 text-indigo-400">
                                                                                            <FontAwesomeIcon icon={faUser} className="w-2.5 h-2.5" />
                                                                                            {data?.created_by}
                                                                                        </div>
                                                                                    </Tippy>

                                                                                    {data?.updated_by !== '-' && (
                                                                                        <Tippy content='Diperbarui oleh' placement='bottom'>
                                                                                            <div className="flex items-center gap-x-1 text-pink-400">
                                                                                                <FontAwesomeIcon icon={faUserEdit} className="w-2.5 h-2.5" />
                                                                                                {data?.updated_by}
                                                                                            </div>
                                                                                        </Tippy>
                                                                                    )}

                                                                                </div>
                                                                            </div>

                                                                            <div className="">
                                                                                Anggaran <br />
                                                                                <span className='font-semibold whitespace-nowrap'>
                                                                                    Rp. {data.total_anggaran_renja ? new Intl.NumberFormat(`id-ID`).format(data.total_anggaran_renja) : 0}
                                                                                </span>
                                                                            </div>
                                                                        </div>

                                                                        <div className="mt-8 text-slate-800 dark:text-slate-200 group-hover:text-slate-700 border-y border-dotted py-1 border-slate-600 group-hover:border-white dark:border-white">
                                                                            <div className="w-full">
                                                                                <span className='font-semibold pl-4 underline'>
                                                                                    Indikator Kinerja :
                                                                                </span>
                                                                                <div className="space-y-1 divide-y divide-slate-300 group-hover:divide-white mt-1 w-full pl-4">
                                                                                    {(data?.indicators.length > 0) && (
                                                                                        <>
                                                                                            {data?.indicators?.map((data: any, index: number) => {
                                                                                                return (
                                                                                                    <div className="flex items-center justify-between w-full py-1">
                                                                                                        <div className="flex items-center gap-1 grow">
                                                                                                            <IconArrowLeft className="w-4 h-4 inline-block mr-1" />
                                                                                                            <div className="">
                                                                                                                {data?.name}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div className="shrink min-w-[150px]">
                                                                                                            <span className='mx-0.5'>
                                                                                                                {data?.value_renja}
                                                                                                            </span>
                                                                                                            <span className='mx-0.5 whitespace-nowrap'>
                                                                                                                {data?.satuan_name_renja}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )
                                                                                            })}
                                                                                        </>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Tippy>
                                                            </>
                                                        )}

                                                        {data?.type == 'sub-kegiatan' && (
                                                            <Tippy content={`Klik untuk Mengubah Target`} theme='secondary' placement="top-end">
                                                                <div
                                                                    key={`${data.id}-${index}`}
                                                                    onClick={() => {
                                                                        if (isLoadingData) return;
                                                                        if (saveLoading) return;
                                                                        openModalInput(data);
                                                                    }}
                                                                    className="panel ml-[20px] w-[calc(100%-20px)] group cursor-pointer hover:bg-secondary-light border border-slate-300 dark:border-slate-600 dark:hover:border-white-light">
                                                                    <div className="flex flex-col sm:flex-row gap-y-2 sm:mr-5">
                                                                        <div className='grow sm:w-[500px]'>
                                                                            <div className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-700">
                                                                                {data?.sub_kegiatan_name}
                                                                            </div>
                                                                            <div className="text-xs text-slate-500 dark:text-slate-300 group-hover:text-slate-700">
                                                                                {data?.sub_kegiatan_fullcode}
                                                                            </div>
                                                                            <div className="flex items-center gap-x-2 text-xs mt-1">

                                                                                <Tippy content='Dibuat oleh' placement='bottom'>
                                                                                    <div className="flex items-center gap-x-1 text-indigo-400">
                                                                                        <FontAwesomeIcon icon={faUser} className="w-2.5 h-2.5" />
                                                                                        {data?.created_by}
                                                                                    </div>
                                                                                </Tippy>

                                                                                {data?.updated_by !== '-' && (
                                                                                    <Tippy content='Diperbarui oleh' placement='bottom'>
                                                                                        <div className="flex items-center gap-x-1 text-pink-400">
                                                                                            <FontAwesomeIcon icon={faUserEdit} className="w-2.5 h-2.5" />
                                                                                            {data?.updated_by}
                                                                                        </div>
                                                                                    </Tippy>
                                                                                )}

                                                                            </div>
                                                                        </div>

                                                                        <div className="">
                                                                            Anggaran <br />
                                                                            <span className='font-semibold whitespace-nowrap'>
                                                                                Rp. {data.total_anggaran_renja ? new Intl.NumberFormat(`id-ID`).format(data.total_anggaran_renja) : 0}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="mt-8 text-slate-800 dark:text-slate-200 group-hover:text-slate-700 border-y border-dotted py-1 border-slate-600 group-hover:border-white dark:border-white">
                                                                        <div className="w-full">
                                                                            <span className='font-semibold pl-4 underline'>
                                                                                Indikator Kinerja :
                                                                            </span>
                                                                            <div className="space-y-1 divide-y divide-slate-300 group-hover:divide-white mt-1 w-full pl-4">
                                                                                {(data?.indicators.length > 0) && (
                                                                                    <>
                                                                                        {data?.indicators?.map((data: any, index: number) => {
                                                                                            return (
                                                                                                <div className="flex items-center justify-between w-full py-1">
                                                                                                    <div className="flex items-center gap-1 grow">
                                                                                                        <IconArrowLeft className="w-4 h-4 inline-block mr-1" />
                                                                                                        <div className="">
                                                                                                            {data?.name}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="shrink min-w-[150px]">
                                                                                                        <span className='mx-0.5'>
                                                                                                            {data?.value_renja}
                                                                                                        </span>
                                                                                                        <span className='mx-0.5 whitespace-nowrap'>
                                                                                                            {data?.satuan_name_renja}
                                                                                                        </span>
                                                                                                    </div>
                                                                                                </div>
                                                                                            )
                                                                                        })}
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Tippy>
                                                        )}
                                                    </>

                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel>
                                    <div className="flex flex-col md:flex-row gap-4 h-full">
                                        <div className="w-full md:w-[500px]">
                                            <div className="panel h-full">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                                                        Informasi Program
                                                    </h5>
                                                </div>
                                                {dataInformation && (
                                                    <div className="mt-4 space-y-2">
                                                        <div className="flex items-center gap-x-2">
                                                            <span>
                                                                {dataInformation?.program_fullcode}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-x-2">
                                                            <span className='font-semibold text-lg'>
                                                                {dataInformation?.program_name}
                                                            </span>
                                                        </div>

                                                        <div className="">
                                                            <div className=''>
                                                                Status Renja
                                                            </div>
                                                            <div className="flex">
                                                                {dataInformation?.status && (
                                                                    <>
                                                                        {dataInformation?.status == 'verified' && (
                                                                            <div className="badge bg-success text-white rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1">
                                                                                <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                                                                                Terverifikasi
                                                                            </div>
                                                                        )}
                                                                        {dataInformation?.status == 'draft' && (
                                                                            <div className="badge bg-primary text-white rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1">
                                                                                <FontAwesomeIcon icon={faBusinessTime} className="w-3 h-3" />
                                                                                Draft
                                                                            </div>
                                                                        )}
                                                                        {dataInformation?.status == 'sent' && (
                                                                            <div className="badge badge-outline-success text-success rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1">
                                                                                <FontAwesomeIcon icon={faClipboardCheck} className="w-3 h-3" />
                                                                                Dikirim
                                                                            </div>
                                                                        )}
                                                                        {dataInformation?.status == 'waiting' && (
                                                                            <div className="badge bg-slate-200 text-slate-700 rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1">
                                                                                <FontAwesomeIcon icon={faStopwatch20} className="w-3 h-3" />
                                                                                Menunggu
                                                                            </div>
                                                                        )}
                                                                        {dataInformation?.status == 'return' && (
                                                                            <div className="badge badge-outline-warning text-warning rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1">
                                                                                <FontAwesomeIcon icon={faReplyAll} className="w-3 h-3" />
                                                                                Dikembalikan
                                                                            </div>
                                                                        )}
                                                                        {dataInformation?.status == 'reject' && (
                                                                            <div className="badge bg-danger text-white rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1">
                                                                                <FontAwesomeIcon icon={faTimesCircle} className="w-3 h-3" />
                                                                                Ditolak
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="">
                                                            <span className='text-slate-500 text-xs'>
                                                                Pesan Verifikator :
                                                            </span>
                                                            <br />
                                                            <textarea
                                                                id="verificatorNote"
                                                                className='form-textarea min-h-[100px] resize-none text-slate-600 placeholder:text-slate-400 select-none focus:outline-none focus:border-slate-600 w-full rounded-xl border-transparent bg-[#f4f4f4] px-5 py-2'
                                                                readOnly={true}
                                                                placeholder={dataInformation?.notes_verificator ? 'Pesan Verifikator' : '~tidak ada pesan'}
                                                                value={dataInformation?.notes_verificator}
                                                            ></textarea>
                                                        </div>

                                                        <div className="">
                                                            <div className='text-slate-500 text-xs'>
                                                                Dibuat Pada :
                                                            </div>
                                                            <div className='flex items-center text-slate-600'>
                                                                <IconCalendar className="w-4 h-4 mr-1.5" />
                                                                {dataInformation?.created_at ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(new Date(dataInformation?.created_at)) : '-'}
                                                            </div>
                                                            {dataInformation?.updated_at && (
                                                                <>
                                                                    <div className='text-slate-500 text-xs'>
                                                                        Perbarui Pada :
                                                                    </div>
                                                                    <div className='flex items-center text-slate-600'>
                                                                        <IconCalendar className="w-4 h-4 mr-1.5" />
                                                                        {new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(new Date(dataInformation?.updated_at))}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>

                                                        <div className="">
                                                            <div className='text-slate-500 text-xs'>
                                                                Dibuat Oleh :
                                                            </div>
                                                            <div className='flex items-center text-slate-600'>
                                                                <IconUser className="w-4 h-4 mr-1.5" />
                                                                {dataInformation?.CreatedBy ?? '-'}
                                                            </div>
                                                            {dataInformation?.UpdatedBy && (
                                                                <>
                                                                    <div className='text-slate-500 text-xs'>
                                                                        Perbarui Oleh :
                                                                    </div>
                                                                    <div className='flex items-center text-slate-600'>
                                                                        <IconUser className="w-4 h-4 mr-1.5" />
                                                                        {dataInformation?.UpdatedBy}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>

                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className='grow w-full scrollbar-container relative h-full sm:h-[calc(100vh-250px)] chat-conversation-box ps mt-0 pt-0'>
                                            <div className="p-4 pt-20 pb-20 h-full overflow-x-auto space-y-5">
                                                {dataLogs.map((log: any, index: number) => (
                                                    <div key={`log-${index}`}>
                                                        {log?.type == 'return' && (
                                                            <div className="flex items-start gap-3 ">
                                                                <div className="flex-none cursor-pointer">
                                                                    <Tippy content={log?.user_name} placement='top' delay={300}>
                                                                        <img src={log?.user_photo} className="rounded-full h-10 w-10 object-cover" alt="" />
                                                                    </Tippy>
                                                                </div>
                                                                <div className="space-y-0">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="dark:bg-gray-800 p-4 py-2 rounded-md bg-black/10 ltr:rounded-bl-none rtl:rounded-br-none">
                                                                            <p className='whitespace-break-spaces'>
                                                                                {log?.message}
                                                                            </p>


                                                                            <div className="text-[10px] text-white-dark mt-1.5">
                                                                                {new Date(log?.created_at).toLocaleString('id-ID', {
                                                                                    weekday: 'short',
                                                                                    day: 'numeric',
                                                                                    month: 'short',
                                                                                    year: 'numeric',
                                                                                    hour: 'numeric',
                                                                                    minute: 'numeric',
                                                                                    second: 'numeric',
                                                                                    hour12: false
                                                                                }) + ' WIB'}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center divide-x">
                                                                        <div className="px-1">
                                                                            {log?.status == 'verified' && (
                                                                                <>
                                                                                    <div className="badge bg-success text-white rounded-full text-xs font-normal cursor-pointer flex items-center gap-1">
                                                                                        <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                                                                                        Terverifikasi
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                            {log?.status == 'draft' && (
                                                                                <>
                                                                                    <div className="badge bg-primary text-white rounded-full text-xs font-normal cursor-pointer flex items-center gap-1">
                                                                                        <FontAwesomeIcon icon={faBusinessTime} className="w-3 h-3" />
                                                                                        Draft
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                            {log?.status == 'sent' && (
                                                                                <>
                                                                                    <div className="badge badge-outline-success text-success rounded-full text-xs font-normal cursor-pointer flex items-center gap-1">
                                                                                        <FontAwesomeIcon icon={faClipboardCheck} className="w-3 h-3" />
                                                                                        Dikirim
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                            {log?.status == 'waiting' && (
                                                                                <>
                                                                                    <div className="badge bg-slate-200 text-slate-700 rounded-full text-xs font-normal cursor-pointer flex items-center gap-1">
                                                                                        <FontAwesomeIcon icon={faStopwatch20} className="w-3 h-3" />
                                                                                        Menunggu
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                            {log?.status == 'return' && (
                                                                                <>
                                                                                    <div className="badge badge-outline-warning text-warning rounded-full text-xs font-normal cursor-pointer flex items-center gap-1">
                                                                                        <FontAwesomeIcon icon={faReplyAll} className="w-3 h-3" />
                                                                                        Dikembalikan
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                            {log?.status == 'reject' && (
                                                                                <>
                                                                                    <div className="badge bg-danger text-white rounded-full text-xs font-normal cursor-pointer flex items-center gap-1">
                                                                                        <FontAwesomeIcon icon={faTimesCircle} className="w-3 h-3" />
                                                                                        Ditolak
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                        <div className="text-xs text-slate-500 hover:text-primary cursor-pointer px-1">
                                                                            @{log?.user_name}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {log?.type == 'request' && (
                                                            <div className="flex items-start gap-3 justify-end">
                                                                <div className="flex-none order-2 cursor-pointer">
                                                                    <Tippy content={log?.user_name} placement='top' delay={300}>
                                                                        <img src={log?.user_photo} className="rounded-full h-10 w-10 object-cover" alt="" />
                                                                    </Tippy>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div className="flex justify-end items-center gap-3">
                                                                        <div className="dark:bg-gray-800 p-4 py-2 rounded-md bg-black/10 ltr:rounded-br-none rtl:rounded-bl-none !bg-primary text-white">
                                                                            <p className='whitespace-break-spaces'>
                                                                                {log?.message}
                                                                            </p>
                                                                            <div className="text-[10px] text-white mt-1.5">
                                                                                {new Date(log?.created_at).toLocaleString('id-ID', {
                                                                                    weekday: 'short',
                                                                                    day: 'numeric',
                                                                                    month: 'short',
                                                                                    year: 'numeric',
                                                                                    hour: 'numeric',
                                                                                    minute: 'numeric',
                                                                                    second: 'numeric',
                                                                                    hour12: false
                                                                                }) + ' WIB'}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center justify-end divide-x">
                                                                        <div className="text-xs text-slate-500 hover:text-primary cursor-pointer px-1">
                                                                            @{log?.user_name}
                                                                        </div>
                                                                        <div className="px-1">
                                                                            {log?.status == 'verified' && (
                                                                                <>
                                                                                    <div className="badge bg-success text-white rounded-full text-xs font-normal cursor-pointer flex items-center gap-1">
                                                                                        <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                                                                                        Terverifikasi
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                            {log?.status == 'draft' && (
                                                                                <>
                                                                                    <div className="badge bg-primary text-white rounded-full text-xs font-normal cursor-pointer flex items-center gap-1">
                                                                                        <FontAwesomeIcon icon={faBusinessTime} className="w-3 h-3" />
                                                                                        Draft
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                            {log?.status == 'sent' && (
                                                                                <>
                                                                                    <div className="badge badge-outline-success text-success rounded-full text-xs font-normal cursor-pointer flex items-center gap-1">
                                                                                        <FontAwesomeIcon icon={faClipboardCheck} className="w-3 h-3" />
                                                                                        Dikirim
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                            {log?.status == 'waiting' && (
                                                                                <>
                                                                                    <div className="badge bg-slate-200 text-slate-700 rounded-full text-xs font-normal cursor-pointer flex items-center gap-1">
                                                                                        <FontAwesomeIcon icon={faStopwatch20} className="w-3 h-3" />
                                                                                        Menunggu
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                            {log?.status == 'return' && (
                                                                                <>
                                                                                    <div className="badge badge-outline-warning text-warning rounded-full text-xs font-normal cursor-pointer flex items-center gap-1">
                                                                                        <FontAwesomeIcon icon={faReplyAll} className="w-3 h-3" />
                                                                                        Dikembalikan
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                            {log?.status == 'reject' && (
                                                                                <>
                                                                                    <div className="badge bg-danger text-white rounded-full text-xs font-normal cursor-pointer flex items-center gap-1">
                                                                                        <FontAwesomeIcon icon={faTimesCircle} className="w-3 h-3" />
                                                                                        Ditolak
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div ref={dummy} />
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="p-2 sticky bottom-0 left-0 w-full bg-white z-10">

                                                {(['sent', 'waiting', 'verified'].includes(dataInformation?.status) && [1, 2, 6].includes(CurrentUser?.role_id)) && (
                                                    <div className="sm:flex w-full justify-center items-start sm:gap-1">
                                                        <div className="relative flex-1">
                                                            <textarea
                                                                value={message}
                                                                onChange={(e) => {
                                                                    setMessage(e.target.value);
                                                                }}
                                                                id="textarea-message"
                                                                className="form-textarea rounded-xl border-transparent bg-[#f4f4f4] px-5 focus:outline-none focus:border-slate-600 py-2 resize-none"
                                                                style={{
                                                                    height: message?.split('\n').length > 1 ? 'auto' : '38px',
                                                                    minHeight: message?.split('\n').length > 1 ? '50px' ? message?.split('\n').length > 2 ? '75px' : 'unset' : 'unset' : 'unset',
                                                                    overflow: message?.split('\n').length > 1 ? 'hidden' : 'hidden',
                                                                }}
                                                                placeholder="Ketik pesan disini..."
                                                            ></textarea>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row gap-1 items-center justify-center">
                                                            <select
                                                                value={status}
                                                                onChange={(e) => {
                                                                    setStatus(e.target.value)
                                                                }}
                                                                id="select-status"
                                                                className='form-select rounded-xl border-transparent bg-[#f4f4f4] px-6 w-full sm:w-[200px] focus:outline-none focus:border-slate-600'>

                                                                <option value="">Pilih Status</option>
                                                                <option value="verified">
                                                                    Verifikasi
                                                                </option>
                                                                <option value="reject">
                                                                    Tolak
                                                                </option>
                                                                <option value="return">
                                                                    Kembalikan
                                                                </option>
                                                                <option value="waiting">
                                                                    Tunggu
                                                                </option>

                                                            </select>
                                                            <button
                                                                onClick={(e) => {
                                                                    sendMessage();
                                                                    // setMessage('');
                                                                    // setStatus('');
                                                                }}
                                                                type="button"
                                                                className="bg-success dark:bg-success-dark-light text-white hover:bg-success-light p-2 hover:text-success flex gap-2 items-center justify-center rounded-xl w-auto sm:w-[150px]">
                                                                <IconSend className="w-5 h-5" />
                                                                Kirim
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {([1, 2, 6].includes(CurrentUser?.role_id) && ['draft', 'return', 'reject'].includes(dataInformation?.status)) && (
                                                    <div>
                                                        <div className="text-center font-semibold text-slate-500">
                                                            Menunggu Permintaan Verifikasi dari Perangkat Daerah
                                                        </div>
                                                    </div>
                                                )}

                                                {(['draft', 'return', 'reject'].includes(dataInformation?.status) && [1, 2, 9].includes(CurrentUser?.role_id)) && (
                                                    <div className="sm:flex w-full justify-center items-start sm:gap-1">
                                                        <div className="relative flex-1">
                                                            <textarea
                                                                value={message}
                                                                onChange={(e) => {
                                                                    setMessage(e.target.value);
                                                                }}
                                                                id="textarea-message"
                                                                className="form-textarea rounded-xl border-transparent bg-[#f4f4f4] px-5 focus:outline-none focus:border-slate-600 py-2 resize-none"
                                                                style={{
                                                                    height: message?.split('\n').length > 1 ? 'auto' : '38px',
                                                                    minHeight: message?.split('\n').length > 1 ? '50px' ? message?.split('\n').length > 2 ? '75px' : 'unset' : 'unset' : 'unset',
                                                                    overflow: message?.split('\n').length > 1 ? 'hidden' : 'hidden',
                                                                }}
                                                                placeholder="Ketik pesan disini..."
                                                            ></textarea>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row gap-1 items-center justify-center">
                                                            <select
                                                                value={status}
                                                                onChange={(e) => {
                                                                    setStatus(e.target.value)
                                                                }}
                                                                id="select-status"
                                                                className='form-select rounded-xl border-transparent bg-[#f4f4f4] px-6 w-full sm:w-[200px] focus:outline-none focus:border-slate-600'>
                                                                <option value="" hidden>Pilih Status</option>
                                                                <option value="sent">
                                                                    Kirim Ke Verifikator
                                                                </option>
                                                                <option value="draft">
                                                                    Draft
                                                                </option>
                                                            </select>
                                                            <button
                                                                onClick={(e) => {
                                                                    sendMessage();
                                                                    // setMessage('');
                                                                    // setStatus('');
                                                                }}
                                                                type="button"
                                                                className="bg-success dark:bg-success-dark-light text-white hover:bg-success-light p-2 hover:text-success flex gap-2 items-center justify-center rounded-xl w-auto sm:w-[150px]">
                                                                <IconSend className="w-5 h-5" />
                                                                Kirim
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {([1, 2, 9].includes(CurrentUser?.role_id)) && ['sent', 'waiting', 'verified'].includes(dataInformation?.status) && (
                                                    <div>
                                                        <div className="text-center font-semibold text-slate-500">
                                                            Menunggu Verifikasi dari Verifikator
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
                    </div>
                )}
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
                    <div className="fixed inset-0 bg-[black]/60 z-[999]">
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
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg w-full max-w-[80%] md:max-w-[65%] my-8 text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <h5 className="font-bold text-lg">
                                            {dataInput?.type == 'kegiatan' ? (
                                                <>
                                                    {dataInput?.inputType == 'create' ? 'Tambah Renstra Kegiatan' : 'Edit Renstra Kegiatan'}
                                                </>
                                            ) : (
                                                <>
                                                    {dataInput?.inputType == 'create' ? 'Tambah Renstra Sub Kegiatan' : 'Edit Renstra Sub Kegiatan'}
                                                </>
                                            )}
                                        </h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => {
                                            closeModalInput();
                                        }}>
                                            <IconX></IconX>
                                        </button>
                                    </div>
                                    <div className="p-5">


                                        <div className="space-y-3">
                                            {dataInput?.type == 'kegiatan' && (
                                                <>
                                                    <div className="xl:col-span-2">
                                                        <div className="font-semibold text-md">
                                                            {dataInput?.kegiatan_name}
                                                        </div>
                                                        <div className="text-sm text-slate-500">
                                                            {dataInput?.kegiatan_fullcode}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            {dataInput?.type == 'sub-kegiatan' && (
                                                <>
                                                    <div className="xl:col-span-2">
                                                        <div className="font-semibold text-md">
                                                            {dataInput?.sub_kegiatan_name}
                                                        </div>
                                                        <div className="text-sm text-slate-500">
                                                            {dataInput?.sub_kegiatan_fullcode}
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            <div className="xl:col-span-2">
                                                <div className="underline font-semibold text-slate-500 text-base">
                                                    Target Kinerja Tahun {year}
                                                </div>
                                                <div className="space-y-2 divide-y mt-4">
                                                    {dataInput?.indicators?.map((data: any, index: number) => (
                                                        <div
                                                            key={`data-input-indicator-${index}`}
                                                            className="flex flex-nowrap items-center justify-between py-1 gap-y-4">
                                                            <div className="grow w-[500px] flex items-center">
                                                                <FontAwesomeIcon icon={faArrowRight} className="w-2.5 h-2.5 inline-block mr-2 text-slate-400" />
                                                                <span>
                                                                    {data?.name}
                                                                </span>
                                                            </div>
                                                            <div className="w-[400px] text-center">
                                                                <div className="flex group">
                                                                    <input
                                                                        type="text"
                                                                        value={dataInput?.indicators?.[index]?.value ?? ''}
                                                                        onChange={(e) => {
                                                                            const value = e.target.value ?? 0;
                                                                            setDataInput((prev: any) => {
                                                                                const newIndicators = prev?.indicators?.map((item: any, i: any) => {
                                                                                    if (i == index) {
                                                                                        return {
                                                                                            ...item,
                                                                                            value: value
                                                                                        }
                                                                                    }
                                                                                    return item;
                                                                                }
                                                                                );
                                                                                return {
                                                                                    ...prev,
                                                                                    indicators: newIndicators
                                                                                }
                                                                            });
                                                                            setUnsave(true);
                                                                        }}
                                                                        placeholder="Target Kinerja..."
                                                                        className="form-input form-input-sm ltr:rounded-r-none rtl:rounded-l-none group-focus-within:border-indigo-400 cursor-pointer" />

                                                                    <Select placeholder="Pilih Satuan"
                                                                        className='ltr:rounded-l-none rtl:rounded-r-none w-[400px] group-focus-within:border-indigo-400 text-start'
                                                                        onChange={(e: any) => {
                                                                            const satuan_id = e?.value;
                                                                            setDataInput((prev: any) => {
                                                                                const newIndicators = prev?.indicators?.map((item: any, i: any) => {
                                                                                    if (i == index) {
                                                                                        return {
                                                                                            ...item,
                                                                                            satuan_id: satuan_id
                                                                                        }
                                                                                    }
                                                                                    return item;
                                                                                });
                                                                                return {
                                                                                    ...prev,
                                                                                    indicators: newIndicators
                                                                                }
                                                                            });
                                                                            setUnsave(true);
                                                                        }}
                                                                        isLoading={satuans?.length === 0}
                                                                        isClearable={true}
                                                                        isDisabled={isLoadingData}
                                                                        value={
                                                                            satuans?.map((data: any, indexOpt: number) => {
                                                                                if (data.id == dataInput?.indicators?.[index]?.satuan_id) {
                                                                                    return {
                                                                                        value: data.id,
                                                                                        label: data.name,
                                                                                    }
                                                                                }
                                                                            })
                                                                        }
                                                                        options={
                                                                            satuans?.map((data: any, index: number) => {
                                                                                return {
                                                                                    value: data.id,
                                                                                    label: data.name,
                                                                                }
                                                                            })
                                                                        } />

                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end items-center mt-4">
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() => {
                                                    closeModalInput();
                                                }}>
                                                Batalkan
                                            </button>

                                            {saveLoading == false ? (
                                                dataInput?.indicators?.length > 0 && (
                                                    <button type="button"
                                                        className="btn btn-success ltr:ml-4 rtl:mr-4"
                                                        onClick={() => save()}>
                                                        Simpan
                                                    </button>
                                                )
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
export default Page;
