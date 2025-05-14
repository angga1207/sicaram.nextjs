import { useEffect, useState, Fragment, useRef } from 'react';
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
import LoadingSicaram from '../../components/LoadingSicaram';
import AnimateHeight from 'react-animate-height';

import { getMessaging, onMessage } from 'firebase/messaging';
import firebaseApp from '@/utils/firebase/firebase';

import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconEdit from '../../components/Icon/IconEdit';
import IconX from '../../components/Icon/IconX';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconSearch from '../../components/Icon/IconSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faArrowUp, faBusinessTime, faCalendarAlt, faCalendarPlus, faCheck, faCheckToSlot, faClipboardCheck, faCog, faEdit, faEnvelopeCircleCheck, faEye, faFlagCheckered, faReply, faReplyAll, faSave, faStopwatch20, faTimesCircle, faTrashAlt, faUser, faUserEdit } from '@fortawesome/free-solid-svg-icons';

import { fetchPeriodes, fetchInstances, fetchSatuans, fetchPrograms, fetchRenja, fetchDetailRenjaKegiatan, fetchDetailRenjaSubKegiatan, fetchRenjaValidatorNotes } from '../../apis/fetchdata';
import { saveRenjaKegiatan, saveRenjaSubKegiatan, postRenjaNotes } from '../../apis/storedata';
import IconArrowLeft from '@/components/Icon/IconArrowLeft';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconCalendar from '@/components/Icon/IconCalendar';
import IconSend from '@/components/Icon/IconSend';
import IconUser from '@/components/Icon/IconUser';
import IconSave from '@/components/Icon/IconSave';
import Page403 from '@/components/Layouts/Page403';
import { useRouter } from 'next/router';


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
        dispatch(setPageTitle('Renstra Perubahan'));
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

    const router = useRouter();

    const [datas, setDatas] = useState([]);
    const [periodes, setPeriodes] = useState([]);
    const [instance, setInstance] = useState<any>(CurrentUser?.instance_id ?? null);
    const [instances, setInstances] = useState<any>([]);
    const [satuans, setSatuans] = useState<any>([]);
    const [programs, setPrograms] = useState<any>([]);
    const [program, setProgram] = useState<any>(null);
    const [searchProgram, setSearchProgram] = useState<any>('');
    const [filteredPrograms, setFilteredPrograms] = useState<any>([]);
    const [rpjmd, setRpjmd] = useState<any>([]);
    const [renstra, setRenstra] = useState<any>(null);
    const [renja, setRenja] = useState<any>(null);
    const [renjas, setRenjas] = useState<any>([]);
    const [range, setRange] = useState<any>([]);
    const [anggarans, setAnggarans] = useState<any>([]);
    const [indicators, setIndicators] = useState<any>([]);
    // const [kegiatans, setKegiatans] = useState<any>([]);
    // const [kegiatan, setKegiatan] = useState<any>(null);
    const [search, setSearch] = useState('');
    const [searchInstance, setSearchInstance] = useState('');
    const [modalInput, setModalInput] = useState(false);
    const [tabModal, setTabModal] = useState('kinerja');
    const [saveLoading, setSaveLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [unsave, setUnsave] = useState(false);
    const [viewValidating, setViewValidating] = useState(false);
    const [dataValidating, setDataValidating] = useState<any>([]);
    const [message, setMessage] = useState<any>(null);
    const [status, setStatus] = useState<any>(null);
    const [dataInput, setDataInput] = useState<any>({
        inputType: 'create',
        type: null,
        id: '',
    });

    const resetDataInput = () => {
        setDataInput({
            inputType: 'create',
            type: null,
            id: '',
        });
    }

    const dummy = useRef<any>(null);
    useEffect(() => {
        dummy?.current?.scrollIntoView({ behavior: "smooth" });
    }, [dataValidating]);

    const [active, setActive] = useState<any>(null);
    const togglePara = (value: any) => {
        setActive((oldValue = null) => {
            return oldValue === value ? null : value;
        });
    };

    useEffect(() => {
        if (CurrentUser?.instance_id) {
            setInstance(CurrentUser?.instance_id);
            router.query.instance = CurrentUser?.instance_id;
            router.push(router)
        } else {
            setInstance(null);
            router.query.instance = '';
            router.push(router)
        }
    }, [isMounted, CurrentUser?.instance_id]);

    useEffect(() => {
        fetchPeriodes().then((data) => {
            setPeriodes(data.data);
        });
        fetchInstances(searchInstance).then((data) => {
            setInstances(data.data);
        });
        fetchSatuans().then((data) => {
            setSatuans(data.data);
        });
    }, [CurrentUser]);

    useEffect(() => {
        if (searchInstance == '') {
            fetchInstances(searchInstance).then((data) => {
                setInstances(data.data);
            });
        } else {
            const instcs = instances.map((item: any) => {
                // filter instances by searchInstance
                if (item.name.toLowerCase().includes(searchInstance.toLowerCase())) {
                    return item;
                }
            }).filter((item: any) => item != undefined);
            setInstances(instcs);
        }
    }, [searchInstance]);

    useEffect(() => {
        if (instance && periode?.id && CurrentUser?.role_id == 9) {
            fetchPrograms(periode?.id, instance).then((data) => {
                const prgs = data.data.map((item: any) => {
                    if (item.type == 'program') {
                        return item;
                    }
                }).filter((item: any) => item != undefined);
                setPrograms(prgs);
            });
        }
    }, [instance, CurrentUser?.role_id]);

    const goSearchProgram = (search: any) => {
        setSearchProgram(search);
        setFilteredPrograms(programs.map((item: any) => {
            if (item.name.toLowerCase().includes(search.toLowerCase())) {
                return item;
            }
        }).filter((item: any) => item != undefined));
    }

    useEffect(() => {
        setInstance(router.query.instance)
        setProgram(router.query.program)
        setYear(router.query.year)
    }, [router.query])

    const backToInstances = () => {
        if (unsave) {
            Swal.fire({
                title: 'Perubahan belum disimpan',
                text: 'Anda yakin ingin meninggalkan halaman ini?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, saya yakin',
                cancelButtonText: 'Tidak',
            }).then((result) => {
                if (result.isConfirmed) {
                    setUnsave(false);
                    setInstance(null);
                    setProgram(null);
                    setYear(null);
                    setRange([]);
                    setAnggarans([]);
                    setIndicators([]);
                    setSearchProgram('');
                    resetDataInput();
                    setViewValidating(false);
                }
            });
            return;
        }
        setInstance(null);
        setProgram(null);
        setPrograms([]);
        setYear(null);
        setRange([]);
        setAnggarans([]);
        setIndicators([]);
        setSearchProgram('');
        resetDataInput();
        setViewValidating(false);

        if (router.query) {
            router.query.instance = '';
            router.query.program = '';
            router.query.year = '';
        }
        router.push(router)
    }

    const pickInstance = (id: any) => {
        // setInstance(id);
        setViewValidating(false);
        router.query.instance = id;
        router.push(router)
    }

    useEffect(() => {
        if (periode?.id && instance) {
            fetchPrograms(periode?.id, instance).then((data) => {
                const prgs = data.data.map((item: any) => {
                    if (item.type == 'program') {
                        return item;
                    }
                }).filter((item: any) => item != undefined);
                setPrograms(prgs);
            });
        }
    }, [instance]);

    const pickProgram = (id: any) => {
        if (unsave) {
            Swal.fire({
                title: 'Perubahan belum disimpan',
                text: 'Anda yakin ingin meninggalkan halaman ini?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, saya yakin',
                cancelButtonText: 'Tidak',
            }).then((result) => {
                if (result.isConfirmed) {
                    setUnsave(false);
                    setProgram(id);
                    setYear(new Date().getFullYear());
                    setFetchLoading(true);
                    setFetchLoading(false);
                }
            });
            return;
        }
        // setProgram(id);
        setYear(new Date().getFullYear());
        setFetchLoading(true);
        setFetchLoading(false);

        router.query.program = id;
        router.push(router)
    }

    useEffect(() => {
        if (isMounted) {
            if (periode?.id && instance && program) {
                fetchRenja(periode?.id, instance, program).then((data) => {
                    if (data.status == 'success') {
                        setRenjas(data.data.datas);
                        setRenja(data.data.renja)
                        setRenstra(data.data.renstra);
                        setRange(data.data.range);
                    }
                });
            }
        }
    }, [program])

    const goVerification = () => {

        if (viewValidating == false) {
            setViewValidating(true);
            fetchRenjaValidatorNotes(periode?.id, instance, program, renja?.id).then((data) => {
                if (data.status == 'success') {
                    setDataValidating(data.data);
                }
            });
            document.getElementById('textarea-message')?.focus();
            setMessage('');
            setStatus('');
        }
        if (viewValidating == true) {
            setViewValidating(false);
            setDataValidating([]);
        }
    }

    const unPickProgram = () => {
        if (unsave) {
            Swal.fire({
                title: 'Perubahan belum disimpan',
                text: 'Anda yakin ingin meninggalkan halaman ini?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, saya yakin',
                cancelButtonText: 'Tidak',
            }).then((result) => {
                if (result.isConfirmed) {
                    setUnsave(false);
                    setProgram(null);
                    setYear(new Date().getFullYear());
                    setRange([]);
                    setAnggarans([]);
                    setIndicators([]);
                    setSearchProgram('');
                    setRenstra(null);
                    setRenjas([]);
                    setRenja(null)
                    resetDataInput();
                    setViewValidating(false);
                }
            });
            return;
        }
        setProgram(null);
        setYear(new Date().getFullYear());
        setRange([]);
        setAnggarans([]);
        setIndicators([]);
        setSearchProgram('');
        setRenstra(null);
        setRenjas([]);
        setRenja(null)
        resetDataInput();
        setViewValidating(false);

        if (router.query) {
            router.query.program = '';
        }
        router.push(router)
    }

    const editData = (id: any, type: any) => {
        resetDataInput();
        if (type == 'program') {
            showAlert('warning', 'Fitur ini belum tersedia');
            return false;
        }

        if (type == 'kegiatan') {
            fetchDetailRenjaKegiatan(periode?.id, instance, program, id, year).then((data) => {
                if (data.status == 'success') {
                    setDataInput({
                        ...data.data,
                        inputType: 'edit',
                    });
                }
                // console.log(dataInput)
            });
        }

        if (type == 'sub-kegiatan') {
            fetchDetailRenjaSubKegiatan(periode?.id, instance, program, id, year).then((data) => {
                if (data.status == 'success') {
                    setDataInput({
                        ...data.data,
                        inputType: 'edit',
                    });
                }
                // console.log(dataInput)
            });
        }
        setModalInput(true);
    }

    const save = () => {
        if (dataInput?.type == 'kegiatan') {
            saveRenjaKegiatan(periode?.id, instance, program, dataInput?.id, year, dataInput).then((data) => {
                if (data.status == 'success') {
                    showAlert('success', data.message);
                    setUnsave(false);
                    fetchRenja(periode?.id, instance, program).then((data) => {
                        if (data.status == 'success') {
                            setRenjas(data.data.datas);
                            setRenstra(data.data.renstra);
                            setRenja(data.data.renja);
                            setRange(data.data.range);
                        }
                    });

                    setModalInput(false);
                }
                if (data.status == 'error') {
                    showAlert('error', data.message)
                }
            });
        }
        if (dataInput?.type == 'sub-kegiatan') {
            saveRenjaSubKegiatan(periode?.id, instance, program, dataInput?.id, year, dataInput).then((data) => {
                if (data.status == 'success') {
                    showAlert('success', data.message);
                    setUnsave(false);
                    fetchRenja(periode?.id, instance, program).then((data) => {
                        if (data.status == 'success') {
                            setRenjas(data.data.datas);
                            setRenstra(data.data.renstra);
                            setRenja(data.data.renja);
                            setRange(data.data.range);
                        }
                    });

                    setModalInput(false);
                }
                if (data.status == 'error') {
                    showAlert('error', data.message)
                }
            });
        }
    }

    useEffect(() => {
        document.getElementById('textarea-message')?.classList.remove('border-red-500');
        document.getElementById('textarea-message')?.classList.remove('focus:border-red-500');

        document.getElementById('select-status')?.classList.remove('border-red-500');
        document.getElementById('select-status')?.classList.remove('focus:border-red-500');
    }, [message, status]);


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
            postRenjaNotes(periode?.id, instance, program, renja?.id, message, status).then((data) => {
                if (data.status == 'success') {
                    showAlert('success', data.message);
                    fetchRenjaValidatorNotes(periode?.id, instance, program, renja?.id).then((data) => {
                        if (data.status == 'success') {
                            setDataValidating(data.data);
                        }
                    });

                    setRenja((prevState: any) => {
                        return {
                            ...prevState,
                            status: status,
                        };
                    });
                }
                setMessage('');
                setStatus('');
            });
        }
    }

    if (CurrentUser?.role_id && [1, 2, 3, 6, 9].includes(CurrentUser?.role_id)) {
        return (
            <>

                <div className="">
                    <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5 px-5">
                        <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                            Renstra Perubahan <br />
                            {instances?.[instance - 1]?.name ?? '\u00A0'}
                        </h2>
                        <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">

                            {!instance ? (
                                <>
                                    <div className="relative">
                                        <input type="search"
                                            className="form-input sm:w-[300px] rtl:pl-12 ltr:pr-12"
                                            placeholder='Cari Perangkat Daerah...'
                                            onChange={(e) => setSearchInstance(e.target.value)}
                                        />
                                        <div className="absolute rtl:left-0 ltr:right-0 top-0 bottom-0 flex items-center justify-center w-12 h-full">
                                            <IconSearch className="w-4 h-4 text-slate-400"></IconSearch>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {(CurrentUser?.role_id == 1 || CurrentUser?.role_id == 2 || CurrentUser?.role_id == 3 || CurrentUser?.role_id == 4 || CurrentUser?.role_id == 5 || CurrentUser?.role_id == 6 || CurrentUser?.role_id == 7 || CurrentUser?.role_id == 8) && (
                                        <>
                                            <button type="button" className="btn btn-secondary whitespace-nowrap" onClick={() => backToInstances()} >
                                                <IconArrowBackward className="w-4 h-4" />
                                                <span className="ltr:ml-2 rtl:mr-2">
                                                    Kembali
                                                </span>
                                            </button>
                                        </>
                                    )}

                                </>
                            )}

                        </div>

                    </div>
                </div>

                {!instance && (
                    <>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4 font-semibold dark:text-white-dark mb-7">
                            {instances?.map((data: any) => {
                                return (
                                    <>
                                        <Tippy content={data.name} placement="top">
                                            <div className="panel h-[84px] p-2.5 rounded-md flex items-center group cursor-pointer hover:bg-primary-light"
                                                onClick={(e) => {
                                                    pickInstance(data?.id)
                                                }}>
                                                <div className="w-20 h-[84px] -m-2.5 ltr:mr-4 rtl:ml-4 ltr:rounded-l-md rtl:rounded-r-md transition-all duration-700 group-hover:scale-110 bg-slate-200 flex-none">
                                                    <img src={data?.logo ?? "/assets/images/logo-caram.png"} alt="logo" className='w-full h-full object-contain p-2' />
                                                </div>
                                                <div className='group-hover:text-primary'>
                                                    <h5 className="text-sm sm:text-base line-clamp-3">{data.name}</h5>
                                                </div>
                                            </div>
                                        </Tippy >
                                    </>
                                )
                            })}
                        </div>
                    </>
                )}

                {!instance && instances?.length == 0 && (
                    <>
                        <div className="w-full h-[calc(100vh-300px)] flex flex-col items-center justify-center">
                            {LoadingSicaram()}
                            <div className="dots-loading text-xl">Memuat Perangkat Daerah...</div>
                        </div>
                    </>
                )}


                {instance && (
                    <div className="panel">
                        <div className="mb-5 flex flex-col sm:flex-row gap-4">
                            <div className="w-full sm:w-80 h-[calc(100vh-250px)] overflow-x-auto border-b border-x rounded-t-lg">
                                {!program && (
                                    <>
                                        <div className="sticky top-0 left-0 z-10">
                                            <div className="relative">
                                                <input type="search"
                                                    className="form-input rtl:pl-12 ltr:pr-12 rounded-b-none"
                                                    placeholder='Cari Program...'
                                                    onChange={(e) => goSearchProgram(e.target.value)}
                                                />
                                                <div className="absolute rtl:left-0 ltr:right-0 top-0 bottom-0 flex items-center justify-center w-12 h-full">
                                                    <IconSearch className="w-4 h-4 text-slate-400"></IconSearch>
                                                </div>
                                            </div>
                                        </div>
                                        {programs.length > 0 ? (
                                            <>
                                                {!searchProgram && (
                                                    <>
                                                        {programs?.map((data: any) => {
                                                            return (
                                                                <button onClick={(e) => {
                                                                    e.preventDefault();
                                                                    if (!fetchLoading) {
                                                                        pickProgram(data.id);
                                                                    }
                                                                }}
                                                                    className={program == data?.id ? 'relative -mb-[1px] block w-full border-white-light p-3.5 py-4 before:absolute before:bottom-0 before:top-0 before:m-auto before:inline-block before:h-0 before:w-[1px] before:bg-primary before:transition-all before:duration-700  hover:before:h-[80%] hover:bg-primary-light group ltr:border-r ltr:before:-right-[1px] rtl:border-l rtl:before:-left-[1px] dark:border-[#191e3a] text-start bg-primary-light text-primary' : 'relative -mb-[1px] block w-full border-white-light p-3.5 py-4 before:absolute before:bottom-0 before:top-0 before:m-auto before:inline-block before:h-0 before:w-[1px] before:bg-primary before:transition-all before:duration-700  hover:before:h-[80%] hover:bg-primary-light group ltr:border-r ltr:before:-right-[1px] rtl:border-l rtl:before:-left-[1px] dark:border-[#191e3a] text-start'}
                                                                >
                                                                    <div className={program == data?.id ? 'font-bold dark:text-slate-200 text-primary' : 'font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary'} >
                                                                        {data?.name}
                                                                    </div>
                                                                    <div className="text-xs font-normal text-slate-500 dark:text-slate-400">
                                                                        {data?.fullcode}
                                                                    </div>
                                                                </button>
                                                            )
                                                        })}
                                                    </>
                                                )}
                                                {searchProgram && (
                                                    <>
                                                        {filteredPrograms?.map((data: any) => {
                                                            return (
                                                                <button onClick={(e) =>
                                                                    fetchLoading == false && (
                                                                        <>
                                                                            {pickProgram(data?.id)
                                                                            }
                                                                        </>
                                                                    )}
                                                                    className={program == data?.id ? 'relative -mb-[1px] block w-full border-white-light p-3.5 py-4 before:absolute before:bottom-0 before:top-0 before:m-auto before:inline-block before:h-0 before:w-[1px] before:bg-primary before:transition-all before:duration-700  hover:before:h-[80%] hover:bg-primary-light group ltr:border-r ltr:before:-right-[1px] rtl:border-l rtl:before:-left-[1px] dark:border-[#191e3a] text-start bg-primary-light text-primary' : 'relative -mb-[1px] block w-full border-white-light p-3.5 py-4 before:absolute before:bottom-0 before:top-0 before:m-auto before:inline-block before:h-0 before:w-[1px] before:bg-primary before:transition-all before:duration-700  hover:before:h-[80%] hover:bg-primary-light group ltr:border-r ltr:before:-right-[1px] rtl:border-l rtl:before:-left-[1px] dark:border-[#191e3a] text-start'}
                                                                >
                                                                    <div className={program == data?.id ? 'font-bold dark:text-slate-200 text-primary' : 'font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary'} >
                                                                        {data?.name}
                                                                    </div>
                                                                    <div className="text-xs font-normal text-slate-500 dark:text-slate-400">
                                                                        {data?.fullcode}
                                                                    </div>
                                                                </button>
                                                            )
                                                        })}
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <button
                                                className='relative -mb-[1px] block w-full border-white-light p-3.5 py-4 before:absolute before:bottom-0 before:top-0 before:m-auto before:inline-block before:h-0 before:w-[1px] before:bg-primary before:transition-all before:duration-700 hover:before:h-[80%] hover:bg-primary-light group ltr:border-r ltr:before:-right-[1px] rtl:border-l rtl:before:-left-[1px] dark:border-[#191e3a] text-center'
                                            >
                                                <div className='font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary'>
                                                    Program tidak ditemukan
                                                </div>
                                            </button>
                                        )}
                                    </>
                                )}

                                {program && (
                                    <div className="rounded-t-lg border-t p-4 h-full relative">
                                        <div className="flex items-center justify-between mb-3 pb-1 border-b">
                                            <div className="text-lg font-semibold">
                                                Informasi Data
                                            </div>
                                            <div className="">
                                                <button
                                                    type='button'
                                                    onClick={(e) => {
                                                        unPickProgram()
                                                    }}
                                                    className='btn btn-secondary px-1 py-1 gap-1 font-normal'>
                                                    <IconX className="w-3 h-3" />
                                                    Tutup
                                                </button>
                                            </div>
                                        </div>
                                        {renja && (
                                            <>
                                                <div className="text-slate-500">
                                                    {renja?.program_fullcode ?? ''}
                                                </div>
                                                <div className="font-semibold">
                                                    {renja?.program_name ?? ''}
                                                </div>

                                                <div className="mt-3">
                                                    <div className="text-sm text-slate-500">
                                                        Status Renstra Perubahan
                                                    </div>
                                                    <div className="flex">
                                                        {renja?.status && (
                                                            <>
                                                                {renja?.status == 'verified' && (
                                                                    <>
                                                                        <div className="badge bg-success text-white rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1">
                                                                            <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                                                                            Terverifikasi
                                                                        </div>
                                                                    </>
                                                                )}
                                                                {renja?.status == 'draft' && (
                                                                    <>
                                                                        <div className="badge bg-primary text-white rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1">
                                                                            <FontAwesomeIcon icon={faBusinessTime} className="w-3 h-3" />
                                                                            Draft
                                                                        </div>
                                                                    </>
                                                                )}
                                                                {renja?.status == 'sent' && (
                                                                    <>
                                                                        <div className="badge badge-outline-success text-success rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1">
                                                                            <FontAwesomeIcon icon={faClipboardCheck} className="w-3 h-3" />
                                                                            Dikirim
                                                                        </div>
                                                                    </>
                                                                )}
                                                                {renja?.status == 'waiting' && (
                                                                    <>
                                                                        <div className="badge bg-slate-200 text-slate-700 rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1">
                                                                            <FontAwesomeIcon icon={faStopwatch20} className="w-3 h-3" />
                                                                            Menunggu
                                                                        </div>
                                                                    </>
                                                                )}
                                                                {renja?.status == 'return' && (
                                                                    <>
                                                                        <div className="badge badge-outline-warning text-warning rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1">
                                                                            <FontAwesomeIcon icon={faReplyAll} className="w-3 h-3" />
                                                                            Dikembalikan
                                                                        </div>
                                                                    </>
                                                                )}
                                                                {renja?.status == 'reject' && (
                                                                    <>
                                                                        <div className="badge bg-danger text-white rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1">
                                                                            <FontAwesomeIcon icon={faTimesCircle} className="w-3 h-3" />
                                                                            Ditolak
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-3 hidden">
                                                    <div className="text-sm text-slate-500">
                                                        Kepala Dinas
                                                    </div>
                                                    <div className="flex">
                                                        {renja?.status_leader && (
                                                            <>
                                                                {renja?.status_leader == 'verified' && (
                                                                    <>
                                                                        <div className="badge bg-success text-white rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1">
                                                                            <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                                                                            Terverifikasi
                                                                        </div>
                                                                    </>
                                                                )}
                                                                {renja?.status_leader == 'draft' && (
                                                                    <>
                                                                        <div className="badge bg-primary text-white rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1">
                                                                            <FontAwesomeIcon icon={faBusinessTime} className="w-3 h-3" />
                                                                            Draft
                                                                        </div>
                                                                    </>
                                                                )}
                                                                {renja?.status_leader == 'sent' && (
                                                                    <>
                                                                        <div className="badge badge-outline-success text-success rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1">
                                                                            <FontAwesomeIcon icon={faClipboardCheck} className="w-3 h-3" />
                                                                            Dikirim
                                                                        </div>
                                                                    </>
                                                                )}
                                                                {renja?.status_leader == 'waiting' && (
                                                                    <>
                                                                        <div className="badge bg-slate-200 text-slate-700 rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1">
                                                                            <FontAwesomeIcon icon={faStopwatch20} className="w-3 h-3" />
                                                                            Menunggu
                                                                        </div>
                                                                    </>
                                                                )}
                                                                {renja?.status_leader == 'return' && (
                                                                    <>
                                                                        <div className="badge badge-outline-warning text-warning rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1">
                                                                            <FontAwesomeIcon icon={faReplyAll} className="w-3 h-3" />
                                                                            Dikembalikan
                                                                        </div>
                                                                    </>
                                                                )}
                                                                {renja?.status_leader == 'reject' && (
                                                                    <>
                                                                        <div className="badge bg-danger text-white rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1">
                                                                            <FontAwesomeIcon icon={faTimesCircle} className="w-3 h-3" />
                                                                            Ditolak
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-3 hidden">
                                                    <span className='text-slate-500 text-xs'>
                                                        Pesan Verifikator :
                                                    </span>
                                                    <br />
                                                    <textarea
                                                        id="verificatorNote"
                                                        className='form-textarea min-h-[100px] resize-none text-slate-600 placeholder:text-slate-400'
                                                        readOnly={true}
                                                        placeholder={renja?.notes_verificator ? 'Pesan Verifikator' : '~tidak ada pesan'}
                                                        value={renja?.notes_verificator}
                                                    ></textarea>
                                                </div>

                                                <div className="mt-3">
                                                    <div className='text-slate-500 text-xs'>
                                                        Dibuat Pada :
                                                    </div>
                                                    <div className='flex items-center text-slate-600'>
                                                        <IconCalendar className="w-4 h-4 mr-1.5" />
                                                        {renja?.created_at ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(new Date(renja?.created_at)) : '-'}
                                                    </div>
                                                    {renja?.updated_at && (
                                                        <>
                                                            <div className='text-slate-500 text-xs'>
                                                                Perbarui Pada :
                                                            </div>
                                                            <div className='flex items-center text-slate-600'>
                                                                <IconCalendar className="w-4 h-4 mr-1.5" />
                                                                {new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(new Date(renja?.updated_at))}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>

                                                <div className="mt-3">
                                                    {renja?.CreatedBy && (
                                                        <>
                                                            <div className='text-slate-500 text-xs'>
                                                                Dibuat Oleh :
                                                            </div>
                                                            <div className='flex items-center text-slate-600'>
                                                                <IconUser className="w-4 h-4 mr-1.5" />
                                                                {renja?.CreatedBy}
                                                            </div>
                                                        </>
                                                    )}
                                                    {renja?.UpdatedBy && (
                                                        <>
                                                            <div className='text-slate-500 text-xs'>
                                                                Perbarui Oleh :
                                                            </div>
                                                            <div className='flex items-center text-slate-600'>
                                                                <IconUser className="w-4 h-4 mr-1.5" />
                                                                {renja?.UpdatedBy}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>

                                                <div className="sticky bottom-0 left-0 w-full p-4 pb-2">
                                                    <div className="flex flex-wrap items-center justify-center gap-2 relative">
                                                        {viewValidating ? (
                                                            <>
                                                                <button
                                                                    type='button'
                                                                    onClick={(e) => {
                                                                        goVerification()
                                                                    }}
                                                                    className='btn bg-slate-400 text-white gap-1'>
                                                                    <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
                                                                    Kembali ke Data
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    type='button'
                                                                    onClick={(e) => {
                                                                        goVerification()
                                                                    }}
                                                                    className='btn btn-primary gap-1'>
                                                                    <FontAwesomeIcon icon={faEnvelopeCircleCheck} className="w-4 h-4" />
                                                                    Verifikasi
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                            </>
                                        )}
                                        {!renja && (
                                            <LoadingSicaram />
                                        )}
                                    </div>
                                )}

                            </div>

                            <div className="w-full sm:w-[calc(100%-80rem)] h-full sm:px-4 grow relative">
                                {fetchLoading && (
                                    <div className="bg-slate-100 h-full w-full rounded">
                                        <LoadingSicaram />
                                    </div>
                                )}

                                {fetchLoading == false && (
                                    <>
                                        {program ? (
                                            <>
                                                {!viewValidating && (
                                                    <>
                                                        <div className="flex items-center justify-center w-full divide divide-x border">
                                                            {range?.map((data: any) => {
                                                                return (
                                                                    <>
                                                                        <button type='button'
                                                                            onClick={(e) => {
                                                                                setYear(data)
                                                                                if (router.query) {
                                                                                    router.query.year = data;
                                                                                }
                                                                                router.push(router)
                                                                            }}
                                                                            className={year == data ? 'px-4 py-2 grow bg-secondary-light font-bold text-secondary' : 'px-4 py-2 grow'}>
                                                                            {data}
                                                                        </button>
                                                                    </>
                                                                )
                                                            })}
                                                        </div>

                                                        {year ? (
                                                            <>
                                                                <div className="divide-y divide-dashed mt-5 !h-[calc(100vh-310px)] overflow-x-auto">
                                                                    {renjas?.[year]?.map((data: any, index: number) => {
                                                                        return (
                                                                            <>
                                                                                {data?.type == 'program' && (
                                                                                    <div className={active == index ? 'p-4 bg-blue-200 dark:bg-blue-200 group cursor-pointer rounded-t' : 'p-4 bg-blue-100 dark:bg-blue-700 hover:bg-blue-200 dark:hover:bg-blue-200 group cursor-pointer rounded-t'}>
                                                                                        <div
                                                                                            className="flex relative">
                                                                                            <div className="grow pr-[80px]"
                                                                                                onClick={() => togglePara(index)}>
                                                                                                <div className="flex flex-col sm:flex-row gap-y-2 sm:mr-5">
                                                                                                    <div className='grow w-[500px]'>
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
                                                                                                    <div className='w-full sm:w-[250px] flex items-center justify-between border-t pt-2 sm:border-0 sm:pt-0'>
                                                                                                        <div className="">
                                                                                                            Anggaran <br />
                                                                                                            <span className='font-semibold whitespace-nowrap'>
                                                                                                                Rp. {data.total_anggaran_renja ? new Intl.NumberFormat(`id-ID`).format(data.total_anggaran_renja) : 0}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                        <div className="">
                                                                                                            Kinerja <br />
                                                                                                            <span className="font-semibold whitespace-nowrap">
                                                                                                                {new Intl.NumberFormat(`id-ID`).format(data?.percent_kinerja_renja)} %
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="absolute top-0 right-[10px] flex items-center justify-center gap-4 w-[80px]">
                                                                                                <div className="w-7 h-7">

                                                                                                </div>
                                                                                                <Tippy content='Expand' placement='top' delay={300}>
                                                                                                    <button
                                                                                                        onClick={() => togglePara(index)}
                                                                                                        type="button">
                                                                                                        <IconCaretDown className={active == index ? 'w-7 h-7 hover:text-white rounded-full hover:bg-pink-500 p-1.5 delay-600 transition-all rotate-180' : 'w-7 h-7 hover:text-white rounded-full hover:bg-pink-500 p-1.5 delay-600 transition-all'} />
                                                                                                    </button>
                                                                                                </Tippy>
                                                                                            </div>
                                                                                        </div>

                                                                                        <AnimateHeight duration={300} height={active === index ? 'auto' : 0}>
                                                                                            <div>
                                                                                                <div className="mt-8 text-slate-800 dark:text-slate-200 group-hover:text-slate-700 border-y border-dotted py-1 border-slate-600 group-hover:border-white dark:border-white">
                                                                                                    <div className="w-full">
                                                                                                        <span className='font-semibold pl-4 underline'>
                                                                                                            Indikator Kinerja :
                                                                                                        </span>
                                                                                                        <div className="space-y-1 divide-y divide-slate-300 group-hover:divide-white mt-1 w-full pl-4">
                                                                                                            {(data?.indicators.length > 0) && (
                                                                                                                <>
                                                                                                                    {data?.indicators?.map((data: any) => {
                                                                                                                        return (
                                                                                                                            <>
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
                                                                                                                            </>
                                                                                                                        )
                                                                                                                    })}
                                                                                                                </>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="mt-8 text-slate-800 dark:text-slate-200 group-hover:text-slate-700 border-b py-1 border-slate-600 group-hover:border-white dark:border-white">
                                                                                                    <div className="w-full">
                                                                                                        <span className='font-semibold pl-4 underline'>
                                                                                                            Anggaran :
                                                                                                        </span>
                                                                                                        <div className="space-y-1 mt-1 w-full pl-4">
                                                                                                            {(data?.indicators.length > 0) && (
                                                                                                                <>
                                                                                                                    <div className="grid sm:grid-cols-2 gap-y-4 divide-slate-300">

                                                                                                                        <div className="">
                                                                                                                            <div className="text-xs">
                                                                                                                                Anggaran Belanja Operasional
                                                                                                                            </div>
                                                                                                                            <div className="font-semibold">
                                                                                                                                Rp. {data.anggaran_operasi_renja ? new Intl.NumberFormat(`id-ID`).format(data.anggaran_operasi_renja) : 0}
                                                                                                                            </div>
                                                                                                                        </div>

                                                                                                                        <div className="">
                                                                                                                            <div className="text-xs">
                                                                                                                                Anggaran Belanja Modal
                                                                                                                            </div>
                                                                                                                            <div className="font-semibold">
                                                                                                                                Rp. {data.anggaran_modal_renja ? new Intl.NumberFormat(`id-ID`).format(data.anggaran_modal_renja) : 0}
                                                                                                                            </div>
                                                                                                                        </div>

                                                                                                                        <div className="">
                                                                                                                            <div className="text-xs">
                                                                                                                                Anggaran Belanja Tidak Terduga
                                                                                                                            </div>
                                                                                                                            <div className="font-semibold">
                                                                                                                                Rp. {data.anggaran_tidak_terduga_renja ? new Intl.NumberFormat(`id-ID`).format(data.anggaran_tidak_terduga_renja) : 0}
                                                                                                                            </div>
                                                                                                                        </div>

                                                                                                                        <div className="">
                                                                                                                            <div className="text-xs">
                                                                                                                                Anggaran Belanja Transter
                                                                                                                            </div>
                                                                                                                            <div className="font-semibold">
                                                                                                                                Rp. {data.anggaran_transfer_renja ? new Intl.NumberFormat(`id-ID`).format(data.anggaran_transfer_renja) : 0}
                                                                                                                            </div>
                                                                                                                        </div>

                                                                                                                    </div>

                                                                                                                    <div className="mt-2 pt-2 border-t border-slate-600 group-hover:border-white">
                                                                                                                        <div className="">
                                                                                                                            Total Anggaran :
                                                                                                                        </div>
                                                                                                                        <div className="font-semibold text-lg">
                                                                                                                            Rp. {data.total_anggaran_renja ? new Intl.NumberFormat(`id-ID`).format(data.total_anggaran_renja) : 0}
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </AnimateHeight>

                                                                                    </div >
                                                                                )}

                                                                                {data?.type == 'kegiatan' && (
                                                                                    <div className={active == index ? 'p-4 bg-slate-300 dark:bg-slate-300 group cursor-pointer pl-6' : 'p-4 bg-slate-200 dark:bg-slate-200 hover:bg-slate-300 dark:hover:bg-slate-300 group cursor-pointer pl-6'}>
                                                                                        <div className="flex relative">
                                                                                            <div className="grow pr-[80px]"
                                                                                                onClick={() => togglePara(index)}>
                                                                                                <div className="flex flex-col sm:flex-row gap-y-2 sm:mr-5">
                                                                                                    <div className='grow w-[500px]'>
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
                                                                                                    <div className='w-full sm:w-[250px] flex items-center justify-between border-t pt-2 sm:border-0 sm:pt-0'>
                                                                                                        <div className="">
                                                                                                            Anggaran <br />
                                                                                                            <span className='font-semibold whitespace-nowrap'>
                                                                                                                Rp. {data.total_anggaran_renja ? new Intl.NumberFormat(`id-ID`).format(data.total_anggaran_renja) : 0}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                        <div className="">
                                                                                                            Kinerja <br />
                                                                                                            <span className="font-semibold whitespace-nowrap">
                                                                                                                {new Intl.NumberFormat(`id-ID`).format(data?.percent_kinerja_renja)} %
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="absolute top-0 right-[10px] flex items-center justify-center gap-4 w-[80px]">
                                                                                                <Tippy content='Edit' placement='top' delay={300}>
                                                                                                    <button
                                                                                                        onClick={(e) => {
                                                                                                            editData(data?.id, data?.type);
                                                                                                        }}
                                                                                                        type="button">
                                                                                                        <IconEdit className='w-7 h-7 hover:text-white rounded-full hover:bg-primary p-1.5 delay-600 transition-all' />
                                                                                                    </button>
                                                                                                </Tippy>
                                                                                                <Tippy content='Expand' placement='top' delay={300}>
                                                                                                    <button
                                                                                                        onClick={() => togglePara(index)}
                                                                                                        type="button">
                                                                                                        <IconCaretDown className={active == index ? 'w-7 h-7 hover:text-white rounded-full hover:bg-pink-500 p-1.5 delay-600 transition-all rotate-180' : 'w-7 h-7 hover:text-white rounded-full hover:bg-pink-500 p-1.5 delay-600 transition-all'} />
                                                                                                    </button>
                                                                                                </Tippy>
                                                                                            </div>
                                                                                        </div>

                                                                                        <AnimateHeight duration={300} height={active === index ? 'auto' : 0}>
                                                                                            <div
                                                                                                onClick={(e) => {
                                                                                                    editData(data?.id, data?.type);
                                                                                                }}>
                                                                                                <div className="mt-8 text-slate-800 dark:text-slate-200 group-hover:text-slate-700 border-y border-dotted py-1 border-slate-600 group-hover:border-white dark:border-white">
                                                                                                    <div className="w-full">
                                                                                                        <span className='font-semibold pl-4 underline'>
                                                                                                            Indikator Kinerja :
                                                                                                        </span>
                                                                                                        <div className="space-y-1 divide-y divide-slate-300 group-hover:divide-white mt-1 w-full pl-4">
                                                                                                            {(data?.indicators.length > 0) && (
                                                                                                                <>
                                                                                                                    {data?.indicators?.map((data: any) => {
                                                                                                                        return (
                                                                                                                            <>
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
                                                                                                                            </>
                                                                                                                        )
                                                                                                                    })}
                                                                                                                </>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="mt-8 text-slate-800 dark:text-slate-200 group-hover:text-slate-700 border-b py-1 border-slate-600 group-hover:border-white dark:border-white">
                                                                                                    <div className="w-full">
                                                                                                        <span className='font-semibold pl-4 underline'>
                                                                                                            Anggaran :
                                                                                                        </span>
                                                                                                        <div className="space-y-1 mt-1 w-full pl-4">
                                                                                                            {(data?.indicators.length > 0) && (
                                                                                                                <>
                                                                                                                    <div className="grid sm:grid-cols-2 gap-y-4 divide-slate-300">

                                                                                                                        <div className="">
                                                                                                                            <div className="text-xs">
                                                                                                                                Anggaran Belanja Operasional
                                                                                                                            </div>
                                                                                                                            <div className="font-semibold">
                                                                                                                                Rp. {data.anggaran_operasi_renja ? new Intl.NumberFormat(`id-ID`).format(data.anggaran_operasi_renja) : 0}
                                                                                                                            </div>
                                                                                                                        </div>

                                                                                                                        <div className="">
                                                                                                                            <div className="text-xs">
                                                                                                                                Anggaran Belanja Modal
                                                                                                                            </div>
                                                                                                                            <div className="font-semibold">
                                                                                                                                Rp. {data.anggaran_modal_renja ? new Intl.NumberFormat(`id-ID`).format(data.anggaran_modal_renja) : 0}
                                                                                                                            </div>
                                                                                                                        </div>

                                                                                                                        <div className="">
                                                                                                                            <div className="text-xs">
                                                                                                                                Anggaran Belanja Tidak Terduga
                                                                                                                            </div>
                                                                                                                            <div className="font-semibold">
                                                                                                                                Rp. {data.anggaran_tidak_terduga_renja ? new Intl.NumberFormat(`id-ID`).format(data.anggaran_tidak_terduga_renja) : 0}
                                                                                                                            </div>
                                                                                                                        </div>

                                                                                                                        <div className="">
                                                                                                                            <div className="text-xs">
                                                                                                                                Anggaran Belanja Transter
                                                                                                                            </div>
                                                                                                                            <div className="font-semibold">
                                                                                                                                Rp. {data.anggaran_transfer_renja ? new Intl.NumberFormat(`id-ID`).format(data.anggaran_transfer_renja) : 0}
                                                                                                                            </div>
                                                                                                                        </div>

                                                                                                                    </div>

                                                                                                                    <div className="mt-2 pt-2 border-t border-slate-600 group-hover:border-white">
                                                                                                                        <div className="">
                                                                                                                            Total Anggaran :
                                                                                                                        </div>
                                                                                                                        <div className="font-semibold text-lg">
                                                                                                                            Rp. {data.total_anggaran_renja ? new Intl.NumberFormat(`id-ID`).format(data.total_anggaran_renja) : 0}
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </AnimateHeight>
                                                                                    </div>
                                                                                )}

                                                                                {data?.type == 'sub-kegiatan' && (
                                                                                    <div className={active == index ? 'p-4 bg-slate-100 group cursor-pointer pl-8' : 'p-4 hover:bg-slate-100 group cursor-pointer pl-8'}>
                                                                                        <div className="flex relative">
                                                                                            <div className="grow pr-[80px]"
                                                                                                onClick={() => togglePara(index)}>
                                                                                                <div className="flex flex-col sm:flex-row gap-y-2 sm:mr-5">
                                                                                                    <div className='grow w-[500px]'>
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
                                                                                                    <div className='w-full sm:w-[250px] flex items-center justify-between border-t pt-2 sm:border-0 sm:pt-0'>
                                                                                                        <div className="">
                                                                                                            Anggaran <br />
                                                                                                            <span className='font-semibold whitespace-nowrap'>
                                                                                                                Rp. {data.total_anggaran_renja ? new Intl.NumberFormat(`id-ID`).format(data.total_anggaran_renja) : 0}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                        <div className="">
                                                                                                            Kinerja <br />
                                                                                                            <span className="font-semibold whitespace-nowrap">
                                                                                                                {new Intl.NumberFormat(`id-ID`).format(data?.percent_kinerja_renja)} %
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="absolute top-0 right-[10px] flex items-center justify-center gap-4 w-[80px]">
                                                                                                <Tippy content='Edit' placement='top' delay={300}>
                                                                                                    <button
                                                                                                        onClick={(e) => {
                                                                                                            editData(data?.id, data?.type);
                                                                                                        }}
                                                                                                        type="button">
                                                                                                        <IconEdit className='w-7 h-7 hover:text-white rounded-full hover:bg-primary p-1.5 delay-600 transition-all' />
                                                                                                    </button>
                                                                                                </Tippy>
                                                                                                <Tippy content='Expand' placement='top' delay={300}>
                                                                                                    <button
                                                                                                        onClick={() => togglePara(index)}
                                                                                                        type="button">
                                                                                                        <IconCaretDown className={active == index ? 'w-7 h-7 hover:text-white rounded-full hover:bg-pink-500 p-1.5 delay-600 transition-all rotate-180' : 'w-7 h-7 hover:text-white rounded-full hover:bg-pink-500 p-1.5 delay-600 transition-all'} />
                                                                                                    </button>
                                                                                                </Tippy>
                                                                                            </div>
                                                                                        </div>

                                                                                        <AnimateHeight duration={300} height={active === index ? 'auto' : 0}>
                                                                                            <div
                                                                                                onClick={(e) => {
                                                                                                    editData(data?.id, data?.type);
                                                                                                }}>
                                                                                                <div className="mt-8 text-slate-800 dark:text-slate-200 group-hover:text-slate-700 border-y border-dotted py-1 border-slate-600 group-hover:border-slate-600 dark:border-slate-600">
                                                                                                    <div className="w-full">
                                                                                                        <span className='font-semibold pl-4 underline'>
                                                                                                            Indikator Kinerja :
                                                                                                        </span>
                                                                                                        <div className="space-y-1 divide-y divide-slate-300 group-hover:divide-slate-600 mt-1 w-full pl-4">
                                                                                                            {(data?.indicators.length > 0) && (
                                                                                                                <>
                                                                                                                    {data?.indicators?.map((data: any) => {
                                                                                                                        return (
                                                                                                                            <>
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
                                                                                                                            </>
                                                                                                                        )
                                                                                                                    })}
                                                                                                                </>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="mt-8 text-slate-800 dark:text-slate-200 group-hover:text-slate-700 border-b py-1 border-slate-600 group-hover:border-slate-600 dark:border-slate-600">
                                                                                                    <div className="w-full">
                                                                                                        <span className='font-semibold pl-4 underline'>
                                                                                                            Anggaran :
                                                                                                        </span>
                                                                                                        <div className="space-y-1 mt-1 w-full pl-4">
                                                                                                            {(data?.indicators.length > 0) && (
                                                                                                                <>
                                                                                                                    <div className="grid sm:grid-cols-2 gap-y-4 divide-slate-300">

                                                                                                                        <div className="">
                                                                                                                            <div className="text-xs">
                                                                                                                                Anggaran Belanja Operasional
                                                                                                                            </div>
                                                                                                                            <div className="font-semibold">
                                                                                                                                Rp. {data.anggaran_operasi_renja ? new Intl.NumberFormat(`id-ID`).format(data.anggaran_operasi_renja) : 0}
                                                                                                                            </div>
                                                                                                                        </div>

                                                                                                                        <div className="">
                                                                                                                            <div className="text-xs">
                                                                                                                                Anggaran Belanja Modal
                                                                                                                            </div>
                                                                                                                            <div className="font-semibold">
                                                                                                                                Rp. {data.anggaran_modal_renja ? new Intl.NumberFormat(`id-ID`).format(data.anggaran_modal_renja) : 0}
                                                                                                                            </div>
                                                                                                                        </div>

                                                                                                                        <div className="">
                                                                                                                            <div className="text-xs">
                                                                                                                                Anggaran Belanja Tidak Terduga
                                                                                                                            </div>
                                                                                                                            <div className="font-semibold">
                                                                                                                                Rp. {data.anggaran_tidak_terduga_renja ? new Intl.NumberFormat(`id-ID`).format(data.anggaran_tidak_terduga_renja) : 0}
                                                                                                                            </div>
                                                                                                                        </div>

                                                                                                                        <div className="">
                                                                                                                            <div className="text-xs">
                                                                                                                                Anggaran Belanja Transter
                                                                                                                            </div>
                                                                                                                            <div className="font-semibold">
                                                                                                                                Rp. {data.anggaran_transfer_renja ? new Intl.NumberFormat(`id-ID`).format(data.anggaran_transfer_renja) : 0}
                                                                                                                            </div>
                                                                                                                        </div>

                                                                                                                    </div>

                                                                                                                    <div className="mt-2 pt-2 border-t border-slate-600 group-hover:border-slate-600">
                                                                                                                        <div className="">
                                                                                                                            Total Anggaran :
                                                                                                                        </div>
                                                                                                                        <div className="font-semibold text-lg">
                                                                                                                            Rp. {data.total_anggaran_renja ? new Intl.NumberFormat(`id-ID`).format(data.total_anggaran_renja) : 0}
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </AnimateHeight>
                                                                                    </div>
                                                                                )}
                                                                            </>
                                                                        )
                                                                    })}
                                                                </div>

                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="text-center w-full font-bold text-xl mt-3 border bg-slate-100 rounded p-4">
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        <FontAwesomeIcon icon={faArrowUp} className="w-4 h-4 text-slate-800" />
                                                                        Pilih Tahun
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </>
                                                )}

                                                {viewValidating && (
                                                    <>
                                                        <div className="scrollbar-container relative h-full sm:h-[calc(100vh-250px)] chat-conversation-box ps mt-0 pt-0">
                                                            <div className="p-4 pt-20 pb-20 h-full overflow-x-auto space-y-5">
                                                                {dataValidating?.map((data: any) => {
                                                                    return (
                                                                        <>
                                                                            <div>
                                                                                {data?.type == 'return' && (
                                                                                    <div className="flex items-start gap-3 ">
                                                                                        <div className="flex-none cursor-pointer">
                                                                                            <Tippy content={data?.user_name} placement='top' delay={300}>
                                                                                                <img src={data?.user_photo} className="rounded-full h-10 w-10 object-cover" alt="" />
                                                                                            </Tippy>
                                                                                        </div>
                                                                                        <div className="space-y-0">
                                                                                            <div className="flex items-center gap-3">
                                                                                                <div className="dark:bg-gray-800 p-4 py-2 rounded-md bg-black/10 ltr:rounded-bl-none rtl:rounded-br-none">
                                                                                                    <p className='whitespace-break-spaces'>
                                                                                                        {data?.message}
                                                                                                    </p>


                                                                                                    <div className="text-[10px] text-white-dark mt-1.5">
                                                                                                        {new Date(data?.created_at).toLocaleString('id-ID', {
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
                                                                                                    {data?.status == 'verified' && (
                                                                                                        <>
                                                                                                            <div className="badge bg-success text-white rounded-full text-xs font-normal cursor-pointer flex items-center gap-1">
                                                                                                                <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                                                                                                                Terverifikasi
                                                                                                            </div>
                                                                                                        </>
                                                                                                    )}
                                                                                                    {data?.status == 'draft' && (
                                                                                                        <>
                                                                                                            <div className="badge bg-primary text-white rounded-full text-xs font-normal cursor-pointer flex items-center gap-1">
                                                                                                                <FontAwesomeIcon icon={faBusinessTime} className="w-3 h-3" />
                                                                                                                Draft
                                                                                                            </div>
                                                                                                        </>
                                                                                                    )}
                                                                                                    {data?.status == 'sent' && (
                                                                                                        <>
                                                                                                            <div className="badge badge-outline-success text-success rounded-full text-xs font-normal cursor-pointer flex items-center gap-1">
                                                                                                                <FontAwesomeIcon icon={faClipboardCheck} className="w-3 h-3" />
                                                                                                                Dikirim
                                                                                                            </div>
                                                                                                        </>
                                                                                                    )}
                                                                                                    {data?.status == 'waiting' && (
                                                                                                        <>
                                                                                                            <div className="badge bg-slate-200 text-slate-700 rounded-full text-xs font-normal cursor-pointer flex items-center gap-1">
                                                                                                                <FontAwesomeIcon icon={faStopwatch20} className="w-3 h-3" />
                                                                                                                Menunggu
                                                                                                            </div>
                                                                                                        </>
                                                                                                    )}
                                                                                                    {data?.status == 'return' && (
                                                                                                        <>
                                                                                                            <div className="badge badge-outline-warning text-warning rounded-full text-xs font-normal cursor-pointer flex items-center gap-1">
                                                                                                                <FontAwesomeIcon icon={faReplyAll} className="w-3 h-3" />
                                                                                                                Dikembalikan
                                                                                                            </div>
                                                                                                        </>
                                                                                                    )}
                                                                                                    {data?.status == 'reject' && (
                                                                                                        <>
                                                                                                            <div className="badge bg-danger text-white rounded-full text-xs font-normal cursor-pointer flex items-center gap-1">
                                                                                                                <FontAwesomeIcon icon={faTimesCircle} className="w-3 h-3" />
                                                                                                                Ditolak
                                                                                                            </div>
                                                                                                        </>
                                                                                                    )}
                                                                                                </div>
                                                                                                <div className="text-xs text-slate-500 hover:text-primary cursor-pointer px-1">
                                                                                                    @{data?.user_name}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )}

                                                                                {data?.type == 'request' && (
                                                                                    <div className="flex items-start gap-3 justify-end">
                                                                                        <div className="flex-none order-2 cursor-pointer">
                                                                                            <Tippy content={data?.user_name} placement='top' delay={300}>
                                                                                                <img src={data?.user_photo} className="rounded-full h-10 w-10 object-cover" alt="" />
                                                                                            </Tippy>
                                                                                        </div>
                                                                                        <div className="space-y-2">
                                                                                            <div className="flex justify-end items-center gap-3">
                                                                                                <div className="dark:bg-gray-800 p-4 py-2 rounded-md bg-black/10 ltr:rounded-br-none rtl:rounded-bl-none !bg-primary text-white">
                                                                                                    <p className='whitespace-break-spaces'>
                                                                                                        {data?.message}
                                                                                                    </p>
                                                                                                    <div className="text-[10px] text-white mt-1.5">
                                                                                                        {new Date(data?.created_at).toLocaleString('id-ID', {
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
                                                                                                    @{data?.user_name}
                                                                                                </div>
                                                                                                <div className="px-1">
                                                                                                    {data?.status == 'verified' && (
                                                                                                        <>
                                                                                                            <div className="badge bg-success text-white rounded-full text-xs font-normal cursor-pointer flex items-center gap-1">
                                                                                                                <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                                                                                                                Terverifikasi
                                                                                                            </div>
                                                                                                        </>
                                                                                                    )}
                                                                                                    {data?.status == 'draft' && (
                                                                                                        <>
                                                                                                            <div className="badge bg-primary text-white rounded-full text-xs font-normal cursor-pointer flex items-center gap-1">
                                                                                                                <FontAwesomeIcon icon={faBusinessTime} className="w-3 h-3" />
                                                                                                                Draft
                                                                                                            </div>
                                                                                                        </>
                                                                                                    )}
                                                                                                    {data?.status == 'sent' && (
                                                                                                        <>
                                                                                                            <div className="badge badge-outline-success text-success rounded-full text-xs font-normal cursor-pointer flex items-center gap-1">
                                                                                                                <FontAwesomeIcon icon={faClipboardCheck} className="w-3 h-3" />
                                                                                                                Dikirim
                                                                                                            </div>
                                                                                                        </>
                                                                                                    )}
                                                                                                    {data?.status == 'waiting' && (
                                                                                                        <>
                                                                                                            <div className="badge bg-slate-200 text-slate-700 rounded-full text-xs font-normal cursor-pointer flex items-center gap-1">
                                                                                                                <FontAwesomeIcon icon={faStopwatch20} className="w-3 h-3" />
                                                                                                                Menunggu
                                                                                                            </div>
                                                                                                        </>
                                                                                                    )}
                                                                                                    {data?.status == 'return' && (
                                                                                                        <>
                                                                                                            <div className="badge badge-outline-warning text-warning rounded-full text-xs font-normal cursor-pointer flex items-center gap-1">
                                                                                                                <FontAwesomeIcon icon={faReplyAll} className="w-3 h-3" />
                                                                                                                Dikembalikan
                                                                                                            </div>
                                                                                                        </>
                                                                                                    )}
                                                                                                    {data?.status == 'reject' && (
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
                                                                        </>
                                                                    )
                                                                })}
                                                            </div>


                                                            <div className="p-2 sticky bottom-0 left-0 w-full bg-white z-10">
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
                                                                            {CurrentUser?.role_id == 9 && (
                                                                                <>
                                                                                    <option value="" hidden>Pilih Status</option>
                                                                                    <option value="sent">
                                                                                        Kirim Ke Verifikator
                                                                                    </option>
                                                                                    <option value="draft">
                                                                                        Draft
                                                                                    </option>
                                                                                </>
                                                                            )}

                                                                            {CurrentUser?.role_id != 9 && (
                                                                                <>
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
                                                                                </>
                                                                            )}
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
                                                            </div>

                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <div className="text-center w-full font-bold text-xl border bg-slate-100 rounded p-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 text-slate-800" />
                                                    Pilih Program
                                                </div>
                                            </div>
                                        )}

                                    </>
                                )}
                            </div>
                        </div>
                    </div >
                )}

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
                                    <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-[80%] md:max-w-[70%] my-8 text-black dark:text-white-dark">
                                        <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                            <h5 className="font-bold text-lg">
                                                {dataInput?.type == 'kegiatan' ? (
                                                    <>
                                                        {dataInput?.inputType == 'create' ? 'Tambah Renstra Perubahan Kegiatan' : 'Edit Renstra Perubahan Kegiatan'}
                                                    </>
                                                ) : (
                                                    <>
                                                        {dataInput?.inputType == 'create' ? 'Tambah Renstra Perubahan Sub Kegiatan' : 'Edit Renstra Perubahan Sub Kegiatan'}
                                                    </>
                                                )}
                                            </h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalInput(false)}>
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


                                                {dataInput?.type == 'sub-kegiatan' && (
                                                    <div className="w-full flex items-center justify-between rounded border divide-x cursor-pointer">
                                                        {/* <div
                                                            onClick={(e) => {
                                                                setTabModal('kinerja');
                                                            }}
                                                            className={tabModal == 'kinerja' ? 'text-center w-full py-2 px-4 font-semibold bg-blue-500 dark:bg-blue-800 hover:bg-blue-600 dark:hover:bg-blue-700 text-white' : 'text-center w-full py-2 px-4 hover:bg-blue-300 dark:hover:blue-700 hover:text-white'}>
                                                            Target Kinerja
                                                        </div>
                                                        <div
                                                            onClick={(e) => {
                                                                setTabModal('anggaran');
                                                            }}
                                                            className={tabModal == 'anggaran' ? 'text-center w-full py-2 px-4 font-semibold bg-blue-500 dark:bg-blue-800 hover:bg-blue-600 dark:hover:bg-blue-700 text-white' : 'text-center w-full py-2 px-4 hover:bg-blue-300 dark:hover:blue-700 hover:text-white'}>
                                                            Anggaran
                                                        </div> */}
                                                    </div>
                                                )}

                                                {tabModal == 'kinerja' && (
                                                    <div className="xl:col-span-2">
                                                        <div className="underline font-semibold text-slate-500 text-base">
                                                            Perubahan Target Kinerja Tahun {year}
                                                        </div>
                                                        <div className="space-y-2 divide-y mt-4">
                                                            {dataInput?.indicators?.map((data: any, index: number) => {
                                                                return (
                                                                    <>
                                                                        <div className="flex flex-nowrap overflow-y-auto items-center justify-between py-1 gap-y-4">
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
                                                                                        className="form-input ltr:rounded-r-none
                                                                                           rtl:rounded-l-none group-focus-within:border-indigo-400 cursor-pointer" />

                                                                                    <select
                                                                                        value={dataInput?.indicators?.[index]?.satuan_id ?? ''}
                                                                                        onChange={(e) => {
                                                                                            const satuan_id = e.target.value;
                                                                                            setDataInput((prev: any) => {
                                                                                                const newIndicators = prev?.indicators?.map((item: any, i: any) => {
                                                                                                    if (i == index) {
                                                                                                        return {
                                                                                                            ...item,
                                                                                                            satuan_id: satuan_id
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
                                                                                        className="form-select ltr:rounded-l-none rtl:rounded-r-none ltr:border-l-0 rtl:border-r-0  group-focus-within:border-indigo-400 cursor-pointer">
                                                                                        <option value="" hidden>Pilih Satuan</option>
                                                                                        {satuans?.map((data: any, index: number) => {
                                                                                            return (
                                                                                                <>
                                                                                                    <option value={data?.id}>
                                                                                                        {data?.name}
                                                                                                    </option>
                                                                                                </>
                                                                                            )
                                                                                        })}
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )
                                                            })}

                                                            <div className="pt-4">
                                                                <div className="text-xs text-slate-500">
                                                                    Persentase Target Kinerja (%)
                                                                </div>
                                                                <div className="flex group w-full lg:w-1/2">
                                                                    <input
                                                                        type="number"
                                                                        min={0}
                                                                        max={100}
                                                                        value={dataInput?.percent_kinerja ?? 0}
                                                                        onChange={(e) => {
                                                                            const value = e.target.value ?? 0;
                                                                            setDataInput((prev: any) => {
                                                                                return {
                                                                                    ...prev,
                                                                                    percent_kinerja: value
                                                                                }
                                                                            });
                                                                            setUnsave(true);
                                                                        }}
                                                                        placeholder="Target Kinerja..."
                                                                        className="form-input ltr:rounded-r-none
                                                                                           rtl:rounded-l-none group-focus-within:border-indigo-400 cursor-pointer" />
                                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b] text-slate-500">
                                                                        %
                                                                    </div>

                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                )}

                                                {(tabModal == 'anggaran' && dataInput?.type == 'sub-kegiatan') && (
                                                    <div className="xl:col-span-2">
                                                        <div className="underline font-semibold text-base">
                                                            Perubahan Anggaran Tahun {year}
                                                        </div>

                                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">

                                                            <div>
                                                                <label className='text-sm text-slate-500 font-normal'>
                                                                    Anggaran Belanja Operasional
                                                                </label>
                                                                <div className="flex group">
                                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b] text-slate-500">
                                                                        Rp.
                                                                    </div>
                                                                    <input
                                                                        type="number"
                                                                        min={0}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key == 'e') {
                                                                                e.preventDefault();
                                                                            }
                                                                        }}
                                                                        onChange={(e) => {
                                                                            let value: any = e.target.value ?? 0;
                                                                            if (value > 0) {
                                                                                value = value.replace(/^0+/, '');
                                                                            }
                                                                            if (value == '') value = 0;
                                                                            setDataInput((prev: any) => {
                                                                                return {
                                                                                    ...prev,
                                                                                    anggaran: {
                                                                                        ...prev?.anggaran,
                                                                                        anggaran_operasi: value
                                                                                    },
                                                                                    total_anggaran: parseInt(value) + parseInt(prev?.anggaran?.anggaran_modal ?? 0) + parseInt(prev?.anggaran?.anggaran_tidak_terduga ?? 0) + parseInt(prev?.anggaran?.anggaran_transfer ?? 0)
                                                                                }
                                                                            });
                                                                            setUnsave(true);
                                                                        }}
                                                                        value={dataInput?.anggaran?.anggaran_operasi ?? ''}
                                                                        placeholder="Anggaran Belanja Operasional"
                                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none group-focus-within:border-indigo-400 cursor-pointer" />
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <label className='text-sm text-slate-500 font-normal'>
                                                                    Anggaran Belanja Modal
                                                                </label>
                                                                <div className="flex group">
                                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b] text-slate-500">
                                                                        Rp.
                                                                    </div>
                                                                    <input
                                                                        type="number"
                                                                        min={0}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key == 'e') {
                                                                                e.preventDefault();
                                                                            }
                                                                        }}
                                                                        onChange={(e) => {
                                                                            let value: any = e.target.value ?? 0;
                                                                            if (value > 0) {
                                                                                value = value.replace(/^0+/, '');
                                                                            }
                                                                            if (value == '') value = 0;
                                                                            setDataInput((prev: any) => {
                                                                                return {
                                                                                    ...prev,
                                                                                    anggaran: {
                                                                                        ...prev?.anggaran,
                                                                                        anggaran_modal: value
                                                                                    },
                                                                                    total_anggaran: parseInt(prev?.anggaran?.anggaran_operasi ?? 0) + parseInt(value) + parseInt(prev?.anggaran?.anggaran_tidak_terduga ?? 0) + parseInt(prev?.anggaran?.anggaran_transfer ?? 0)
                                                                                }
                                                                            });
                                                                            setUnsave(true);
                                                                        }}
                                                                        value={dataInput?.anggaran?.anggaran_modal ?? ''}
                                                                        placeholder="Anggaran Belanja Modal"
                                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none group-focus-within:border-indigo-400 cursor-pointer" />
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <label className='text-sm text-slate-500 font-normal'>
                                                                    Anggaran Belanja Tidak Terduga
                                                                </label>
                                                                <div className="flex group">
                                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b] text-slate-500">
                                                                        Rp.
                                                                    </div>
                                                                    <input
                                                                        type="number"
                                                                        min={0}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key == 'e') {
                                                                                e.preventDefault();
                                                                            }
                                                                        }}
                                                                        onChange={(e) => {
                                                                            let value: any = e.target.value ?? 0;
                                                                            if (value > 0) {
                                                                                value = value.replace(/^0+/, '');
                                                                            }
                                                                            if (value == '') value = 0;
                                                                            setDataInput((prev: any) => {
                                                                                return {
                                                                                    ...prev,
                                                                                    anggaran: {
                                                                                        ...prev?.anggaran,
                                                                                        anggaran_tidak_terduga: value
                                                                                    },
                                                                                    total_anggaran: parseInt(prev?.anggaran?.anggaran_operasi ?? 0) + parseInt(prev?.anggaran?.anggaran_modal ?? 0) + parseInt(value) + parseInt(prev?.anggaran?.anggaran_transfer ?? 0)
                                                                                }
                                                                            });
                                                                            setUnsave(true);
                                                                        }}
                                                                        value={dataInput?.anggaran?.anggaran_tidak_terduga ?? ''}
                                                                        placeholder="Anggaran Belanja Tidak Terduga"
                                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none group-focus-within:border-indigo-400 cursor-pointer" />
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <label className='text-sm text-slate-500 font-normal'>
                                                                    Anggaran Belanja Transfer
                                                                </label>
                                                                <div className="flex group">
                                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b] text-slate-500">
                                                                        Rp.
                                                                    </div>
                                                                    <input
                                                                        type="number"
                                                                        min={0}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key == 'e') {
                                                                                e.preventDefault();
                                                                            }
                                                                        }}
                                                                        onChange={(e) => {
                                                                            let value: any = e.target.value ?? 0;
                                                                            if (value > 0) {
                                                                                value = value.replace(/^0+/, '');
                                                                            }
                                                                            if (value == '') value = 0;
                                                                            setDataInput((prev: any) => {
                                                                                return {
                                                                                    ...prev,
                                                                                    anggaran: {
                                                                                        ...prev?.anggaran,
                                                                                        anggaran_transfer: value
                                                                                    },
                                                                                    total_anggaran: parseInt(prev?.anggaran?.anggaran_operasi ?? 0) + parseInt(prev?.anggaran?.anggaran_modal ?? 0) + parseInt(prev?.anggaran?.anggaran_tidak_terduga ?? 0) + parseInt(value)
                                                                                }
                                                                            });
                                                                            setUnsave(true);
                                                                        }}
                                                                        value={dataInput?.anggaran?.anggaran_transfer ?? ''}
                                                                        placeholder="Anggaran Belanja Transfer"
                                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none group-focus-within:border-indigo-400 cursor-pointer" />
                                                                </div>
                                                            </div>

                                                            <div className=""></div>

                                                            <div>
                                                                <label className='text-sm text-slate-800 font-normal'>
                                                                    Total Anggaran
                                                                </label>
                                                                <div className="flex group">
                                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b] text-slate-500">
                                                                        Rp.
                                                                    </div>
                                                                    <input
                                                                        type="number"
                                                                        min={0}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key == 'e') {
                                                                                e.preventDefault();
                                                                            }
                                                                        }}
                                                                        readOnly={true}
                                                                        value={dataInput?.total_anggaran ?? 0}
                                                                        placeholder="Anggaran Belanja Transfer"
                                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none group-focus-within:border-slate-400 bg-slate-200 cursor-text" />
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                )}
                                                <div className='xl:col-span-2 hidden'>
                                                    <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
                                                        Nama Urusan
                                                        <span className='text-red-600 mx-1'>*</span>
                                                    </label>
                                                    {(dataInput?.inputType == 'edit' && dataInput?.name == null) ? (
                                                        <>
                                                            <div className="w-full form-input flex items-center gap-2 text-slate-400">
                                                                <div>
                                                                    <span className="animate-spin border-4 border-transparent border-l-slate-500 rounded-full w-6 h-6 inline-block align-middle m-auto dark:border-l-dark"></span>
                                                                </div>
                                                                <div>
                                                                    Loading...
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="">
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    id="name"
                                                                    className="form-input"
                                                                    placeholder="Masukkan Urusan"
                                                                    value={dataInput?.name}
                                                                    autoComplete='off'
                                                                    onChange={(e) => setDataInput({ ...dataInput, name: e.target.value })}
                                                                />
                                                                <div id="error-name" className='validation-elements text-red-500 text-xs'></div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex justify-end items-center mt-4">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setModalInput(false)}>
                                                    <IconX className="w-4 h-4 mr-2" />
                                                    Batalkan
                                                </button>

                                                {saveLoading == false ? (
                                                    <>
                                                        <button type="button" className="btn btn-success ltr:ml-4 rtl:mr-4" onClick={() => save()}>
                                                            <IconSave className="w-4 h-4 mr-2" />
                                                            Simpan Renstra Perubahan
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
