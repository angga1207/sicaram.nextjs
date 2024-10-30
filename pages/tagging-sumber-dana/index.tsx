import { useEffect, useState, Fragment, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setPageTitle } from '@/store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
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

import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconPlus from '@/components/Icon/IconPlus';
import IconX from '@/components/Icon/IconX';
import IconEdit from '@/components/Icon/IconEdit';
import IconSearch from '@/components/Icon/IconSearch';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faFileUpload } from '@fortawesome/free-solid-svg-icons';

import { fetchPeriodes, fetchRangePeriode } from '@/apis/fetchdata';
import { fetchInstances } from '@/apis/fetchRealisasi';
import IconLayoutGrid from '@/components/Icon/IconLayoutGrid';
import IconListCheck from '@/components/Icon/IconListCheck';
import IconPencil from '@/components/Icon/IconPencil';

import { IndexTaggingSumberDana, DetailTaggingSumberDana, SaveTaggingSumberDana } from '@/apis/tagging_sumber_dana';
import IconSave from '@/components/Icon/IconSave';
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
        dispatch(setPageTitle('Tagging Sumber Dana'));
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
    const [years, setYears] = useState<any>(null);
    const [months, setMonths] = useState<any>([
        { id: 1, name: 'Januari' },
        { id: 2, name: 'Februari' },
        { id: 3, name: 'Maret' },
        { id: 4, name: 'April' },
        { id: 5, name: 'Mei' },
        { id: 6, name: 'Juni' },
        { id: 7, name: 'Juli' },
        { id: 8, name: 'Agustus' },
        { id: 9, name: 'September' },
        { id: 10, name: 'Oktober' },
        { id: 11, name: 'November' },
        { id: 12, name: 'Desember' },
    ]);

    const [month, setMonth] = useState<any>(null);
    const [instance, setInstance] = useState<any>((router.query.instance ?? null) ?? CurrentUser?.instance_id);
    const [instances, setInstances] = useState<any>([]);
    const [searchInstance, setSearchInstance] = useState('');
    const [viewType, setViewType] = useState<any>('grid');

    const [prgActive, setPrgActive] = useState<any>(null);
    const [kgtActive, setKgtActive] = useState<any>(null);
    const [subKgtActive, setSubKgtActive] = useState<any>(null);
    const [selectedSubKegiatan, setSelectedSubKegiatan] = useState<any>(null);
    const [optionTags, setOptionTags] = useState<any>([]);
    const [dataInput, setDataInput] = useState<any>({});

    const togglePrgActive = (value: any) => {
        setPrgActive((oldValue: any) => {
            return oldValue === value ? '' : value;
        });
    };
    const toggleKgtActive = (value: any) => {
        setKgtActive((oldValue: any) => {
            return oldValue === value ? '' : value;
        });
    }
    const toggleSubKgtActive = (value: any) => {
        setSubKgtActive((oldValue: any) => {
            return oldValue === value ? '' : value;
        });
    }

    useEffect(() => {
        setInstance((router.query.instance ?? null) ?? CurrentUser?.instance_id);
    }, [CurrentUser, router.query.instance]);

    useEffect(() => {
        if (isMounted && periode?.id) {
            fetchPeriodes().then((data) => {
                setPeriodes(data.data);
            });
            fetchInstances(searchInstance).then((data) => {
                setInstances(data.data);
            });
            fetchRangePeriode(periode?.id).then((data) => {
                if (data.status == 'success') {
                    setYears(data.data.years);
                }
            });
        }
    }, [CurrentUser, isMounted, periode?.id]);

    useEffect(() => {
        if (searchInstance == '') {
            fetchInstances(searchInstance).then((data) => {
                setInstances(data.data);
            });
        } else {
            const instcs = instances.map((item: any) => {
                if (item.name.toLowerCase().includes(searchInstance.toLowerCase())) {
                    return item;
                }
            }).filter((item: any) => item != undefined);
            setInstances(instcs);
        }
    }, [searchInstance]);

    useEffect(() => {
        if (instance && periode?.id) {
            IndexTaggingSumberDana(instance, periode?.id).then((data) => {
                if (data.status === 'success') {
                    setDatas(data.data.data);
                    setOptionTags(data.data.options.map((item: any) => {
                        return {
                            value: item.id,
                            label: item.name
                        }
                    }));
                }
                if (data.status === 'error validation') {
                    showAlert('error', data.message)
                }

                if (data.status === 'error') {
                    showAlert('error', data.message)
                }
            });
        }
    }, [instance]);

    const backToInstances = () => {
        setInstance(null);
        setDatas([]);
    }

    const selectSubKegiatan = (data: any, index: any) => {
        setSelectedSubKegiatan(data);
        toggleSubKgtActive(`${index + 1}`)
        DetailTaggingSumberDana(data.id, instance, year).then((data) => {
            if (data.status == 'success') {
                setDataInput(data.data);
            }
        });
    }

    useEffect(() => {
        if (selectedSubKegiatan) {
            DetailTaggingSumberDana(selectedSubKegiatan.id, instance, year).then((data) => {
                if (data.status == 'success') {
                    setDataInput(data.data);
                }
            });
        }
    }, [year]);

    const save = () => {
        SaveTaggingSumberDana(selectedSubKegiatan.id, dataInput, instance).then((data) => {
            if (data.status == 'success') {
                showAlert('success', 'Data berhasil disimpan');
            } else if (data.status == 'error validation') {
                Object.keys(data.message).map((key: any) => {
                    showAlert('error', data.message[key])
                });
            } else {
                showAlert('error', 'Data gagal disimpan');
            }
        });
    }

    if (CurrentUser?.role_id && [1, 2, 4, 7, 9].includes(CurrentUser?.role_id)) {
        return (
            <>
                <div className="">
                    <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5">
                        <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                            Tagging Sumber Dana <br />
                            {instances?.[instance - 1]?.name ?? '\u00A0'}
                        </h2>
                        <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">

                            {!instance ? (
                                <>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => {
                                                setViewType('grid')
                                            }}
                                            className={viewType == 'grid'
                                                ? 'btn btn-dark text-white px-2.5'
                                                : 'btn btn-outline-dark text-slate-900 hover:text-white dark:text-white px-2.5'
                                            }
                                            type='button'>
                                            <IconLayoutGrid className='w-4 h-4' />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setViewType('list')
                                            }}
                                            className={viewType == 'list'
                                                ? 'btn btn-dark text-white px-2.5'
                                                : 'btn btn-outline-dark text-slate-900 hover:text-white dark:text-white px-2.5'
                                            }
                                            type='button'>
                                            <IconListCheck className='w-4 h-4' />
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <input type="search"
                                            className="form-input sm:w-[300px] rtl:pl-12 ltr:pr-12"
                                            placeholder='Cari Perangkat Daerah...'
                                            onChange={(e) => setSearchInstance(e.target.value)}
                                        />
                                        <div className="absolute rtl:left-0 ltr:right-0 top-0 bottom-0 flex items-center justify-center w-12 h-full">
                                            <IconSearch className="w-4 h-4 text-slate-400" />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {(CurrentUser?.role_id == 1 || CurrentUser?.role_id == 2 || CurrentUser?.role_id == 3 || CurrentUser?.role_id == 4 || CurrentUser?.role_id == 5 || CurrentUser?.role_id == 6 || CurrentUser?.role_id == 7 || CurrentUser?.role_id == 8) && (
                                        <>
                                            <button type="button" className="btn btn-secondary whitespace-nowrap" onClick={(e) => {
                                                e.preventDefault();
                                                backToInstances();
                                                setPrgActive(0);
                                                setKgtActive(0);
                                                setSubKgtActive(0);
                                                setSelectedSubKegiatan(null)
                                            }} >
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

                {(!instance && viewType == 'grid') && (
                    <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-5 w-full">
                        {instances?.map((data: any, index: number) => {
                            return (
                                <div className="bg-white dark:bg-[#1c232f] rounded-md overflow-hidden text-center shadow relative">
                                    <div className="bg-slate-700 rounded-t-md bg-center bg-cover p-6 pb-0" style={
                                        {
                                            backgroundImage: "url('/assets/images/notification-bg.png')"
                                            // backgroundImage: data?.logo ? `url(${data?.logo})` : "url('/assets/images/notification-bg.png')"
                                        }
                                    }>
                                        <img className="object-contain w-4/5 h-40 mx-auto" src={data?.logo} alt="contact_image" />
                                    </div>
                                    <div className="px-2 py-4">
                                        <div className="cursor-pointer group"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setInstance(data.id);
                                            }}>
                                            <div className="text-lg font-semibold line-clamp-2 h-15 group-hover:text-primary">
                                                {data?.name}
                                            </div>
                                            <div className="text-white-dark group-hover:text-primary">
                                                ({data?.alias})
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-center gap-4 w-full">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setInstance(data.id);
                                                }}
                                                type="button"
                                                className="btn btn-outline-primary">
                                                <IconPencil className="w-4 h-4 mr-2" />
                                                Buka
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {(!instance && viewType == 'list') && (
                    <div className="table-responsive panel">
                        <table className='table-hover'>
                            <thead className=''>
                                <tr>
                                    <th className="!text-center bg-dark text-white border !min-w-[500px]">
                                        Nama Perangkat Daerah
                                    </th>
                                    <th className="!text-center bg-dark text-white border !w-[300px]">
                                        Program / Kegiatan / Sub Kegiatan
                                    </th>
                                    <th className="!text-center bg-dark text-white border !w-[150px]">
                                        Opt
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {instances?.map((data: any, index: number) => {
                                    return (
                                        <tr>
                                            <td className='!p-2 border'>
                                                <div className="flex items-center gap-x-3">
                                                    <div className="w-[38px] flex-none">
                                                        <img className="object-contain w-full h-[38px] mx-auto" src={data?.logo} alt="contact_image" />
                                                    </div>
                                                    <div className="font-semibold">
                                                        {data?.name}
                                                        <div className="text-white-dark text-xs font-normal group-hover:text-primary">
                                                            ({data?.alias})
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="!p-2 border">
                                                <div className="flex items-center justify-center divide-x divide-slate-400">
                                                    <div className='px-1'>
                                                        {data?.programs}
                                                        <span className='text-[10px] pl-0.5'>
                                                            (Prg)
                                                        </span>
                                                    </div>
                                                    <div className='px-1'>
                                                        {data?.kegiatans}
                                                        <span className='text-[10px] pl-0.5'>
                                                            (Kgt)
                                                        </span>
                                                    </div>
                                                    <div className='px-1'>
                                                        {data?.sub_kegiatans}
                                                        <span className='text-[10px] pl-0.5'>
                                                            (Skgt)
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="!p-2 border">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setInstance(data.id);
                                                        }}
                                                        type="button"
                                                        className="btn btn-outline-primary px-2 py-1 whitespace-nowrap text-[10px]">
                                                        <IconPencil className="w-4 h-4 mr-1" />
                                                        Buka
                                                    </button>
                                                    {/* <button type="button" className="btn btn-outline-secondary px-2 py-1 whitespace-nowrap text-[10px]">
                                                        <IconLaptop className="w-4 h-4 mr-1" />
                                                        Lihat Laporan
                                                    </button> */}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {instance && (
                    <div className="panel flex flex-col md:flex-row gap-5">
                        <div className={selectedSubKegiatan === null ? 'space-y-2 transition-all duration-700 h-auto md:h-[calc(100vh-280px)] overflow-auto w-full' : 'space-y-2 transition-all duration-700 h-auto md:h-[calc(100vh-280px)] overflow-auto w-full md:w-1/2'}>

                            {datas?.map((data: any, index: number) => (
                                <div key={index} className="text-slate-700 dark:text-white border border-[#d3d3d3] rounded dark:border-[#1b2e4b]">
                                    <button
                                        type="button"
                                        className={prgActive === `${index + 1}` ?
                                            `p-4 w-full flex items-center bg-indigo-100 dark:bg-[#1b2e4b] font-semibold` :
                                            `p-4 w-full flex items-center bg-slate-200 dark:bg-[#1b2e4b] font-semibold`}
                                        onClick={(e) => {
                                            togglePrgActive(`${index + 1}`)
                                            toggleKgtActive(null)
                                            toggleSubKgtActive(null)
                                            setSelectedSubKegiatan(null)
                                        }}>
                                        {data?.fullcode} - {data?.name}
                                    </button>
                                    <div>
                                        <AnimateHeight duration={100} height={prgActive === `${index + 1}` ? 'auto' : 0}>
                                            <div className="space-y-2 p-4 pt-1 pr-0 text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">

                                                {data?.kegiatan?.map((kgt: any, kgtIndex: number) => (
                                                    <div key={kgtIndex} className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]">
                                                        <button
                                                            type="button"
                                                            className={kgtActive === `${kgtIndex + 1}` ?
                                                                `p-4 w-full flex items-center bg-indigo-100 dark:bg-[#1b2e4b] font-semibold` :
                                                                `p-4 w-full flex items-center bg-slate-200 dark:bg-[#1b2e4b] font-semibold`}
                                                            onClick={(e) => {
                                                                toggleKgtActive(`${kgtIndex + 1}`)
                                                                toggleSubKgtActive(null)
                                                                setSelectedSubKegiatan(null)
                                                            }}>
                                                            {kgt?.fullcode} - {kgt?.name}
                                                        </button>
                                                        <AnimateHeight duration={100} height={kgtActive === `${kgtIndex + 1}` ? 'auto' : 0}>
                                                            <div className="space-y-2 p-4 pt-1 pr-0 text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">

                                                                {kgt?.sub_kegiatan?.map((subKgt: any, subKgtIndex: number) => (
                                                                    <div key={subKgtIndex} className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]">
                                                                        <button
                                                                            type="button"
                                                                            className={subKgtActive === `${subKgtIndex + 1}` ?
                                                                                `p-4 w-full flex items-center bg-indigo-100 dark:bg-[#1b2e4b] font-semibold` :
                                                                                `p-4 w-full flex items-center bg-slate-200 dark:bg-[#1b2e4b] font-semibold`}
                                                                            onClick={(e) => {
                                                                                selectSubKegiatan(subKgt, subKgtIndex)
                                                                            }}>
                                                                            {subKgt?.fullcode} - {subKgt?.name}
                                                                        </button>
                                                                    </div>
                                                                ))}

                                                            </div>
                                                        </AnimateHeight>
                                                    </div>
                                                ))}

                                            </div>
                                        </AnimateHeight>
                                    </div>
                                </div>
                            ))}

                        </div>
                        <div className={selectedSubKegiatan ? 'w-full md:w-1/2 transition-all duration-700' : 'w-0 opacity-0 transition-all duration-700'}>
                            <div className="space-y-2">
                                <div className='font-semibold text-lg'>
                                    Form Tagging Sumber Dana
                                </div>
                                <div className="pb-4 border-b">
                                    <label>
                                        Sub Kegiatan
                                    </label>
                                    {selectedSubKegiatan?.fullcode} - {selectedSubKegiatan?.name}
                                </div>
                                <div>
                                    <label htmlFor="tag">
                                        Tag Sumber Dana
                                    </label>
                                    <Select
                                        id="tag"
                                        placeholder="Pilih Tag"
                                        isMulti={true}
                                        isSearchable={true}
                                        value={dataInput?.tags}
                                        onChange={(value: any) => {
                                            setDataInput((prev: any) => {
                                                return {
                                                    ...prev,
                                                    tags: value,
                                                    values: value?.map((item: any, index: any) => {
                                                        let isExist = prev?.values?.find((val: any) => val.id == item.value);
                                                        if (isExist) {
                                                            return isExist
                                                        }
                                                        return {
                                                            id: item.value,
                                                            nominal: 0
                                                        }
                                                    })
                                                }
                                            })
                                        }}
                                        options={optionTags} />
                                </div>
                                <div className="">
                                    <label htmlFor="year">
                                        Tahun
                                    </label>
                                    <Select placeholder="Pilih Tahun"
                                        className='w-full'
                                        onChange={(e: any) => {
                                            setDataInput((prev: any) => {
                                                return {
                                                    ...prev,
                                                    year: e.value
                                                }
                                            })
                                            setYear(e.value);
                                        }}
                                        value={
                                            years?.map((data: any, index: number) => {
                                                if (data == dataInput?.year) {
                                                    return {
                                                        value: data,
                                                        label: data,
                                                    }
                                                }
                                            })
                                        }
                                        options={
                                            years?.map((data: any, index: number) => {
                                                return {
                                                    value: data,
                                                    label: data,
                                                }
                                            })
                                        } />
                                </div>
                                <div className='pt-5'>
                                    {dataInput?.tags?.length > 0 && (
                                        <div className="space-y-3">
                                            {dataInput?.tags?.map((tag: any, index: number) => (
                                                <div className="">
                                                    <div>
                                                        Nominal <span className='font-semibold'>{tag?.label}</span>
                                                    </div>
                                                    <div className="relative">
                                                        <div className="font-semibold bg-slate-100 absolute left-[1px] top-[1px] h-[calc(100%-2px)] w-10 flex items-center justify-center rounded-l">
                                                            Rp.
                                                        </div>
                                                        <input
                                                            type='text'
                                                            className='form-input pl-12'
                                                            value={dataInput?.values?.[index].nominal}
                                                            onKeyDown={(e: any) => {
                                                                if (!(
                                                                    (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                    (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                    e.keyCode == 8 ||
                                                                    e.keyCode == 46 ||
                                                                    e.keyCode == 37 ||
                                                                    e.keyCode == 39 ||
                                                                    e.keyCode == 188 ||
                                                                    e.keyCode == 9 ||
                                                                    // copy & paste
                                                                    (e.keyCode == 67 && e.ctrlKey) ||
                                                                    (e.keyCode == 86 && e.ctrlKey) ||
                                                                    // command + c & command + v
                                                                    (e.keyCode == 67 && e.metaKey) ||
                                                                    (e.keyCode == 86 && e.metaKey) ||
                                                                    // command + a
                                                                    (e.keyCode == 65 && e.metaKey) ||
                                                                    (e.keyCode == 65 && e.ctrlKey)
                                                                )) {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                            onChange={(e) => {
                                                                let value = e.target.value ? parseFloat(e.target.value.toString().replace(/,/g, '.')) : 0;
                                                                setDataInput((prev: any) => {
                                                                    return {
                                                                        ...prev,
                                                                        values: prev?.values?.map((item: any, idx: any) => {
                                                                            if (idx == index) {
                                                                                return {
                                                                                    ...item,
                                                                                    nominal: value
                                                                                }
                                                                            }
                                                                            return item
                                                                        })
                                                                    }
                                                                })
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className='flex items-center justify-end gap-2'>
                                    {/* cancel */}
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedSubKegiatan(null)
                                            setDataInput({})
                                        }}>
                                        <IconX className="w-4 h-4 mr-2" />
                                        Batal
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-success"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            save();
                                        }}>
                                        <IconSave className="w-4 h-4 mr-2" />
                                        Simpan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </>
        );
    }

    return (
        <Page403 />
    );
};

export default Index;
