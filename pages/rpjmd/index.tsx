import { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';

import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconPlus from '../../components/Icon/IconPlus';
import IconSearch from '../../components/Icon/IconSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowUp, faCalendarAlt, faCalendarPlus, faCog, faEdit, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { fetchPeriodes, fetchInstances, fetchSatuans, fetchPrograms, fetchRPJMD } from '../../apis/fetchdata';
import { saveRpjmd } from '../../apis/storedata';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconSave from '@/components/Icon/IconSave';
import IconInfoTriangle from '@/components/Icon/IconInfoTriangle';
import IconInfoCircle from '@/components/Icon/IconInfoCircle';
import IconSettings from '@/components/Icon/IconSettings';
import LoadingSicaram from '@/components/LoadingSicaram';
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
        dispatch(setPageTitle('RPJMD'));
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

    const [datas, setDatas] = useState([]);
    const [periodes, setPeriodes] = useState([]);
    const [periode, setPeriode] = useState(1);
    const [instance, setInstance] = useState<any>(CurrentUser?.instance_id ?? null);
    const [instances, setInstances] = useState<any>([]);
    const [satuans, setSatuans] = useState<any>([]);
    const [programs, setPrograms] = useState<any>([]);
    const [program, setProgram] = useState<any>(null);
    const [searchProgram, setSearchProgram] = useState<any>('');
    const [filteredPrograms, setFilteredPrograms] = useState<any>([]);
    const [rpjmd, setRpjmd] = useState<any>([]);
    const [range, setRange] = useState<any>([]);
    const [year, setYear] = useState<any>(null);
    const [anggarans, setAnggarans] = useState<any>([]);
    const [indicators, setIndicators] = useState<any>([]);
    // const [kegiatans, setKegiatans] = useState<any>([]);
    // const [kegiatan, setKegiatan] = useState<any>(null);
    const [search, setSearch] = useState('');
    const [searchInstance, setSearchInstance] = useState('');
    const [modalInput, setModalInput] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [unsave, setUnsave] = useState(false);
    const [dataInput, setDataInput] = useState({
        inputType: 'create',
        id: '',
        // name: '',
        // kegiatan_id: '',
        // program_id: '',
        // instance_id: '',
        // periode_id: '',
    });

    useEffect(() => {
        setInstance(CurrentUser?.instance_id ?? null);
    }, [CurrentUser]);

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
        if (instance) {
            fetchPrograms(periode, instance).then((data) => {
                const prgs = data.data.map((item: any) => {
                    if (item.type == 'program') {
                        return item;
                    }
                }).filter((item: any) => item != undefined);
                setPrograms(prgs);
            });
        }
    }, [instance]);

    const goSearchProgram = (search: any) => {
        setSearchProgram(search);
        setFilteredPrograms(programs.map((item: any) => {
            if (item.name.toLowerCase().includes(search.toLowerCase())) {
                return item;
            }
        }).filter((item: any) => item != undefined));
    }

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
    }

    const pickInstance = (id: any) => {
        setInstance(id);
        fetchPrograms(periode, id).then((data) => {
            const prgs = data.data.map((item: any) => {
                if (item.type == 'program') {
                    return item;
                }
            }).filter((item: any) => item != undefined);
            setPrograms(prgs);
        });
    }

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
                    setYear(null);
                    setFetchLoading(true);
                    setTimeout(() => {
                        fetchRPJMD(periode, instance, id).then((data) => {
                            if (data.status == 'success') {
                                setRpjmd(data.data.rpjmd);
                                setRange(data.data.range);
                                // setYear(range[0]);
                                setAnggarans(data.data.anggaran);
                                setIndicators(data.data.indikator);
                            }
                        });
                        setFetchLoading(false);
                    }, 1000);
                }
            });
            return;
        }
        setProgram(id);
        setYear(null);
        setFetchLoading(true);
        setTimeout(() => {
            fetchRPJMD(periode, instance, id).then((data) => {
                if (data.status == 'success') {
                    setRpjmd(data.data.rpjmd);
                    setRange(data.data.range);
                    // setYear(range[0]);
                    setAnggarans(data.data.anggaran);
                    setIndicators(data.data.indikator);
                }
            });
            setFetchLoading(false);
        }, 1000);
    }

    const addIndicators = (year: any) => {
        setIndicators((prev: any) => {
            return {
                ...prev,
                [year]: [
                    ...prev[year],
                    {
                        id: null,
                        name: '',
                        value: '',
                        satuan_id: ''
                    }
                ]
            }
        });
    }

    const deleteIndicator = (index: any) => {
        setIndicators((prev: any) => {
            const newIndicators = prev?.[year]?.filter((item: any, i: any) => i != index);
            return {
                ...prev,
                [year]: newIndicators
            }
        });
    }

    const save = () => {
        setSaveLoading(true);
        const data = {
            anggaran: anggarans,
            indikator: indicators
        }

        var elements = document.getElementsByClassName('validation-elements');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = '';
        }

        // validate indicators name, value and satuan_id
        let valid = true;
        let invalidIndex = null;
        let invalidMessage = '';
        let invalidType = '';

        // Object.keys(data.message).map((key: any, index: any) => {
        //     let element = document.getElementById('error-' + key);
        //     if (element) {
        //         element.innerHTML = data.message[key][0];
        //     }
        // });
        Object.keys(data.indikator).map((year: any, index: any) => {
            data.indikator?.[year]?.map((item: any, i: any) => {
                if (item.name == '') {
                    valid = false;
                    invalidIndex = i;
                    invalidMessage = 'Indikator Kinerja tidak boleh kosong';
                    invalidType = 'name';
                    let element = document.getElementById('error-name-' + year + '-' + i);
                    if (element) {
                        element.innerHTML = invalidMessage ?? '';
                    }
                }
                if (item.value == '') {
                    valid = false;
                    invalidIndex = i;
                    invalidMessage = 'Target Kinerja tidak boleh kosong';
                    invalidType = 'value';
                    let element = document.getElementById('error-value-' + year + '-' + i);
                    if (element) {
                        element.innerHTML = invalidMessage ?? '';
                    }
                }
                if (item.satuan_id == '') {
                    valid = false;
                    invalidIndex = i;
                    invalidMessage = 'Satuan tidak boleh kosong';
                    invalidType = 'satuan_id';
                    let element = document.getElementById('error-satuan-' + year + '-' + i);
                    if (element) {
                        element.innerHTML = invalidMessage ?? '';
                    }
                }
            });
        });

        if (!valid) {
            setSaveLoading(false);
            return;
        }

        saveRpjmd(periode, instance, program, rpjmd?.id, data).then((data) => {
            if (data?.status == 'success') {
                setUnsave(false);
                setSaveLoading(false);
                showAlert('success', data.message);

                fetchRPJMD(periode, instance, program).then((data) => {
                    if (data.status == 'success') {
                        setRpjmd(data.data.rpjmd);
                        setRange(data.data.range);
                        // setYear(range[0]);
                        setAnggarans(data.data.anggaran);
                        setIndicators(data.data.indikator);
                    }
                });
                setFetchLoading(false);
            }
        });
    }
    if (CurrentUser?.role_id && [1, 2, 3, 6, 9].includes(CurrentUser?.role_id)) {
        return (
            <>
                <div className="">
                    <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5">
                        <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                            RPJMD <br />
                            {instances?.[instance - 1]?.name ?? '\u00A0'}
                        </h2>
                        <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">

                            {!instance ? (
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
                            {instances?.map((data: any, index: number) => {
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
                        <div className="mb-5 flex flex-col sm:flex-row">

                            <div className="w-full sm:w-80 h-[calc(100vh-300px)] overflow-x-auto border-b">
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
                                {programs?.length > 0 ? (
                                    <>
                                        {!searchProgram ? (
                                            <>
                                                {programs?.map((data: any, index: number) => {
                                                    return (
                                                        <button onClick={(e) =>
                                                            fetchLoading == false && (
                                                                <>
                                                                    {pickProgram(data?.id)
                                                                    }
                                                                </>
                                                            )}
                                                            className={program == data?.id ? 'relative -mb-[1px] block w-full border-white-light p-3.5 py-4 before:absolute before:bottom-0 before:top-0 before:m-auto before:inline-block before:h-0 before:w-[1px] before:bg-primary before:transition-all before:duration-700  hover:before:h-[80%] hover:bg-primary-light group ltr:border-x ltr:before:-right-[1px] rtl:border-x rtl:before:-left-[1px] dark:border-[#191e3a] text-start bg-primary-light text-primary' : 'relative -mb-[1px] block w-full border-white-light p-3.5 py-4 before:absolute before:bottom-0 before:top-0 before:m-auto before:inline-block before:h-0 before:w-[1px] before:bg-primary before:transition-all before:duration-700  hover:before:h-[80%] hover:bg-primary-light group ltr:border-x ltr:before:-right-[1px] rtl:border-x rtl:before:-left-[1px] dark:border-[#191e3a] text-start'}
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
                                        ) : (
                                            <>
                                                {filteredPrograms?.map((data: any, index: number) => {
                                                    return (
                                                        <button onClick={(e) =>
                                                            fetchLoading == false && (
                                                                <>
                                                                    {pickProgram(data?.id)
                                                                    }
                                                                </>
                                                            )}
                                                            className={program == data?.id ? 'relative -mb-[1px] block w-full border-white-light p-3.5 py-4 before:absolute before:bottom-0 before:top-0 before:m-auto before:inline-block before:h-0 before:w-[1px] before:bg-primary before:transition-all before:duration-700  hover:before:h-[80%] hover:bg-primary-light group ltr:border-x ltr:before:-right-[1px] rtl:border-x rtl:before:-left-[1px] dark:border-[#191e3a] text-start bg-primary-light text-primary' : 'relative -mb-[1px] block w-full border-white-light p-3.5 py-4 before:absolute before:bottom-0 before:top-0 before:m-auto before:inline-block before:h-0 before:w-[1px] before:bg-primary before:transition-all before:duration-700  hover:before:h-[80%] hover:bg-primary-light group ltr:border-x ltr:before:-right-[1px] rtl:border-x rtl:before:-left-[1px] dark:border-[#191e3a] text-start'}
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
                                        className='relative -mb-[1px] block w-full border-white-light p-3.5 py-4 before:absolute before:bottom-0 before:top-0 before:m-auto before:inline-block before:h-0 before:w-[1px] before:bg-primary before:transition-all before:duration-700  hover:before:h-[80%] hover:bg-primary-light group ltr:border-r ltr:before:-right-[1px] rtl:border-l rtl:before:-left-[1px] dark:border-[#191e3a] text-center'
                                    >
                                        <div className='font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary'>
                                            Program tidak ditemukan
                                        </div>
                                    </button>
                                )}
                            </div>

                            <div className="w-full sm:w-[calc(100%-80rem)] px-4 grow">

                                {fetchLoading ? (
                                    <div className="flex items-center justify-center w-full h-full bg-slate-100 rounded">
                                        <div className="flex items-center justify-center relatie">
                                            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                                            <div className="absolute">
                                                <img className="ml-[5px] w-24 h-24 object-contain flex-none animate-bounce delay-100" src="/assets/images/logo-caram.png" alt="logo" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {program ? (
                                            <>
                                                <div className="flex items-center justify-center w-full divide divide-x border">
                                                    {range?.map((data: any, index: number) => {
                                                        return (
                                                            <>
                                                                <button type='button'
                                                                    onClick={(e) => setYear(data)}
                                                                    className={year == data ? 'px-4 py-2 grow bg-primary-light font-bold text-primary' : 'px-4 py-2 grow'}>
                                                                    {data}
                                                                </button>
                                                            </>
                                                        )
                                                    })}
                                                </div>

                                                {year ? (
                                                    <>
                                                        <div className="mt-3">
                                                            <div className="flex">
                                                                <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                                    Rp.
                                                                </div>
                                                                <input
                                                                    type="number"
                                                                    min={0}
                                                                    placeholder="Anggaran RPJMD"
                                                                    value={anggarans?.[year]?.anggaran ?? ''}
                                                                    onChange={(e) => {
                                                                        const anggaran = e.target.value;
                                                                        setAnggarans((prev: any) => {
                                                                            return {
                                                                                ...prev,
                                                                                [year]: {
                                                                                    ...prev[year],
                                                                                    anggaran: anggaran
                                                                                }
                                                                            }
                                                                        })
                                                                    }}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key == 'e' || e.key == 'E') {
                                                                            e.preventDefault();
                                                                        }
                                                                    }}
                                                                    className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
                                                            </div>
                                                        </div>

                                                        <div className="table-responsive mt-5">
                                                            <table className="table-hover">
                                                                <thead>
                                                                    <tr>
                                                                        <th className='!w-[10px]'>
                                                                            #
                                                                        </th>
                                                                        <th className="min-w-[400px]">
                                                                            Indikator Kinerja
                                                                        </th>
                                                                        <th className="!text-center w-[400px]">
                                                                            Target Kinerja
                                                                        </th>
                                                                        <th className="!text-center w-[100px]">
                                                                            <div className="flex items-centet justify-center">
                                                                                <IconSettings className="w-5 h-5 text-slate-500" />
                                                                            </div>
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>

                                                                    {indicators?.[year] && typeof indicators?.[year] == 'object' && (
                                                                        <>
                                                                            {indicators?.[year]?.map((data: any, index: number) => {
                                                                                return (
                                                                                    <tr key={data?.id}>
                                                                                        <td>
                                                                                            {index + 1}
                                                                                        </td>
                                                                                        <td>
                                                                                            <textarea
                                                                                                placeholder="Indikator Kinerja"
                                                                                                onKeyDown={(e) => {
                                                                                                    if (e.key == 'Enter') {
                                                                                                        e.preventDefault();
                                                                                                    }
                                                                                                }}
                                                                                                value={indicators?.[year]?.[index]?.name ?? ''}
                                                                                                onChange={(e) => {
                                                                                                    const name = e.target.value;
                                                                                                    setIndicators((prev: any) => {
                                                                                                        const newIndicators = prev?.[year]?.map((item: any, i: any) => {
                                                                                                            if (i == index) {
                                                                                                                return {
                                                                                                                    ...item,
                                                                                                                    name: name
                                                                                                                }
                                                                                                            }
                                                                                                            return item;
                                                                                                        }
                                                                                                        );
                                                                                                        return {
                                                                                                            ...prev,
                                                                                                            [year]: newIndicators
                                                                                                        }
                                                                                                    });
                                                                                                    setUnsave(true);
                                                                                                }}
                                                                                                className='form-textarea !min-h-[30px] !py-1.5 px-2 resize-none'
                                                                                            ></textarea>
                                                                                            <div className="text-xs text-red-500 validation-elements" id={'error-name-' + year + '-' + index}></div>
                                                                                        </td>
                                                                                        <td>
                                                                                            <div className="flex">
                                                                                                <div className="">
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        placeholder="Target Kinerja"
                                                                                                        value={indicators?.[year]?.[index]?.value ?? ''}
                                                                                                        onChange={(e) => {
                                                                                                            const value = e.target.value;
                                                                                                            setIndicators((prev: any) => {
                                                                                                                const newIndicators = prev?.[year]?.map((item: any, i: any) => {
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
                                                                                                                    [year]: newIndicators
                                                                                                                }
                                                                                                            });
                                                                                                            setUnsave(true);
                                                                                                        }}
                                                                                                        className="form-input ltr:rounded-r-none rtl:rounded-l-none" />

                                                                                                    <div className="text-xs text-red-500 validation-elements" id={'error-value-' + year + '-' + index}></div>
                                                                                                </div>

                                                                                                <div>
                                                                                                    <select
                                                                                                        name=""
                                                                                                        value={indicators?.[year]?.[index]?.satuan_id ?? ''}
                                                                                                        onChange={(e) => {
                                                                                                            const satuan_id = e.target.value;
                                                                                                            setIndicators((prev: any) => {
                                                                                                                const newIndicators = prev?.[year]?.map((item: any, i: any) => {
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
                                                                                                                    [year]: newIndicators
                                                                                                                }
                                                                                                            });
                                                                                                            setUnsave(true);
                                                                                                        }}
                                                                                                        className='form-select ltr:rounded-l-none rtl:rounded-r-none'>
                                                                                                        <option value="" hidden>
                                                                                                            Pilih satuan
                                                                                                        </option>
                                                                                                        {satuans?.map((data: any, index: number) => {
                                                                                                            return (
                                                                                                                <>
                                                                                                                    <option value={data?.id}>{data?.name}</option>
                                                                                                                </>
                                                                                                            )
                                                                                                        })}
                                                                                                    </select>
                                                                                                    <div className="text-xs text-red-500 validation-elements" id={'error-satuan-' + year + '-' + index}></div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex items-center justify-center gap-x-2 text-xs mt-1">
                                                                                                {data?.created_by && (
                                                                                                    <div className="flex items-center gap-x-1 text-indigo-700">
                                                                                                        <IconInfoCircle className="w-3 h-3 text-indigo-500" />
                                                                                                        {`dibuat oleh ` + data?.created_by}
                                                                                                    </div>
                                                                                                )}
                                                                                                {(data?.updated_by && data?.updated_by !== '-') && (
                                                                                                    <div className="flex items-center gap-x-1 text-pink-700">
                                                                                                        <IconInfoCircle className="w-3 h-3 text-pink-500" />
                                                                                                        {`diperbarui oleh ` + data?.updated_by}
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>
                                                                                        </td>

                                                                                        <td className="">
                                                                                            <div className="flex items-center justify-center gap-x-1">
                                                                                                {index > 0 && (
                                                                                                    <Tippy content="Delete">
                                                                                                        <button
                                                                                                            onClick={(e) => {
                                                                                                                deleteIndicator(index);
                                                                                                                setUnsave(true);
                                                                                                            }}
                                                                                                            type="button">
                                                                                                            <IconTrashLines className="w-5 h-5 text-red-500" />
                                                                                                        </button>
                                                                                                    </Tippy>
                                                                                                )}
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                )
                                                                            })}
                                                                        </>
                                                                    )}

                                                                    <tr>
                                                                        <td colSpan={100}>
                                                                            <div className="flex items-center justify-center gap-2">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        addIndicators(year);
                                                                                    }}
                                                                                    className="btn btn-info whitespace-nowrap" >
                                                                                    <IconPlus className="w-4 h-4" />
                                                                                    <span className="ltr:ml-2 rtl:mr-2">Tambah</span>
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        save()
                                                                                    }}
                                                                                    className="btn btn-success whitespace-nowrap" >
                                                                                    <IconSave className="w-4 h-4" />
                                                                                    <span className="ltr:ml-2 rtl:mr-2">
                                                                                        Simpan
                                                                                    </span>
                                                                                </button>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-center w-full font-bold text-xl mt-3 border bg-slate-100 rounded p-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <FontAwesomeIcon icon={faArrowUp} className="w-4 h-4 text-slate-800" />
                                                            Pilih Tahun
                                                        </div>
                                                    </div>
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
                    </div>
                )}
            </>
        )
    }
    return (
        <Page403 />
    );
}

export default Index;

