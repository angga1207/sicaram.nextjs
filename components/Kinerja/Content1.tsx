import { fetchList1, fetchList2, fetchList3, fetchList4 } from "@/apis/fetchRealisasi";
import { useEffect, useState } from "react";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Link from "next/link";
import IconArrowForward from "../Icon/IconArrowForward";

const Content1 = (
    {
        arrInstances,
        arrYears,
        arrMonths,
        instance,
        changeInstance,
        year,
        changeYear,
        month,
        changeMonth,
    }: {
        arrInstances: any;
        arrYears: any;
        arrMonths: any;
        instance: string;
        changeInstance: (instance: string) => void;
        year: any;
        changeYear: (year: any) => void;
        month: any;
        changeMonth: (month: any) => void;
    }
) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [CurrentUser, setCurrentUser] = useState<any>([]);
    const [periode, setPeriode] = useState<any>({});
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

    const [datas, setDatas] = useState<any>([]);
    const [totalPagu, setTotalPagu] = useState<number>(0);
    const [paguType, setPaguType] = useState<any>(null);
    const [paguDate, setPaguDate] = useState<any>(null);
    const [totalRealisasi, setTotalRealisasi] = useState<number>(0);
    const [isLoading1, setIsLoading1] = useState<boolean>(false);


    const _fetchList1 = () => {
        setIsLoading1(true);

        setTotalPagu(0);
        setTotalRealisasi(0);
        setPaguType(null);
        setPaguDate(null);
        fetchList1(instance, year, month)
            .then((res: any) => {
                if (res?.data) {
                    setTotalPagu(res.data.total_pagu || 0);
                    setTotalRealisasi(res.data.total_realisasi || 0);
                    setPaguType(res.data.pagu_type || null);
                    setPaguDate(res.data.pagu_date || null);
                }
            })
            .catch((err: any) => {
                console.error("Error fetching data:", err);
            })
            .finally(() => {
                setIsLoading1(false);
            });
    }
    const [arrPrograms, setArrPrograms] = useState<any>([]);
    const [selectedProgram, setSelectedProgram] = useState<any>(null);
    const [isLoading2, setIsLoading2] = useState<boolean>(false);

    const _fetchList2 = () => {
        setIsLoading2(true);
        fetchList2(instance, year, month)
            .then((res: any) => {
                if (res?.data) {
                    setArrPrograms(res.data);
                } else {
                    setArrPrograms([]);
                }
            })
            .catch((err: any) => {
                console.error("Error fetching data:", err);
                setArrPrograms([]);
            })
            .finally(() => {
                setIsLoading2(false);
            });
    }

    useEffect(() => {
        if (isMounted && instance && year && month) {
            if (!isLoading1) {
                _fetchList1();
            }
            if (!isLoading2) {
                _fetchList2();
                setArrPrograms([]);
                setSelectedProgram(null);
                setArrKegiatans([]);
                setSelectedKegiatan(null);
                setArrSubKegiatans([]);
                setSelectedSubKegiatan(null);
            }
        }
    }, [isMounted, instance, year, month]);

    const handleProgramClick = (program: any) => {
        if (selectedProgram === program) {
            setSelectedProgram(null);
            setArrKegiatans([]);
            setSelectedKegiatan(null);
            setArrSubKegiatans([]);
            setSelectedSubKegiatan(null);
        } else {
            setSelectedProgram(program);
            setSelectedKegiatan(null);
            _fetchList3(program);
        }
    }

    const [arrKegiatans, setArrKegiatans] = useState<any>([]);
    const [selectedKegiatan, setSelectedKegiatan] = useState<any>(null);
    const [isLoading3, setIsLoading3] = useState<boolean>(false);

    const _fetchList3 = (program: any) => {
        setIsLoading3(true);
        fetchList3(instance, program.program_id, year, month)
            .then((res: any) => {
                if (res?.data) {
                    setArrKegiatans(res.data);
                } else {
                    setArrKegiatans([]);
                }
            })
            .catch((err: any) => {
                console.error("Error fetching data:", err);
                setArrKegiatans([]);
            })
            .finally(() => {
                setIsLoading3(false);
            });
    }

    const handleKegiatanClick = (kegiatan: any) => {
        if (selectedKegiatan === kegiatan) {
            setSelectedKegiatan(null);
            setArrSubKegiatans([]);
            setSelectedSubKegiatan(null);
        } else {
            setSelectedKegiatan(kegiatan);
            setSelectedSubKegiatan(null);
            _fetchList4(kegiatan);
        }
    }

    const [arrSubKegiatans, setArrSubKegiatans] = useState<any>([]);
    const [selectedSubKegiatan, setSelectedSubKegiatan] = useState<any>(null);
    const [isLoading4, setIsLoading4] = useState<boolean>(false);

    const _fetchList4 = (kegiatan: any) => {
        setIsLoading4(true);
        fetchList4(instance, kegiatan.kegiatan_id, year, month)
            .then((res: any) => {
                if (res?.data) {
                    setArrSubKegiatans(res.data);
                } else {
                    setArrSubKegiatans([]);
                }
            })
            .catch((err: any) => {
                console.error("Error fetching data:", err);
                setArrSubKegiatans([]);
            })
            .finally(() => {
                setIsLoading4(false);
            });
    }

    const handleSubKegiatanClick = (subKegiatan: any) => {
        setSelectedSubKegiatan(subKegiatan);
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10 select-none">

                <div className='col-span-2 lg:col-span-1 panel cursor-pointer bg-primary text-white'>
                    <div className="text-sm">
                        Pagu Anggaran
                    </div>
                    <div className="text-lg font-semibold whitespace-nowrap">
                        <span className="">Rp. </span>
                        <span className="">{isLoading1 ? '...' : new Intl.NumberFormat('id-ID').format(totalPagu)}</span>
                    </div>
                    <div className="text-xs text-slate-100">
                        <span className="font-semibold">
                            <span className="">{isLoading1 ? '...' : paguType}</span>
                        </span>
                        <span>
                            {(!isLoading1 && paguDate) ? ' | ' + new Date(paguDate).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }) : ''}
                        </span>
                    </div>
                </div>

                <div className='col-span-2 lg:col-span-1 panel cursor-pointer bg-success text-white'>
                    <div className="text-sm">
                        Realisasi
                    </div>
                    <div className="text-lg font-semibold whitespace-nowrap">
                        <span className="">Rp. </span>
                        <span className="">{isLoading1 ? '...' : new Intl.NumberFormat('id-ID').format(totalRealisasi)}</span>
                    </div>
                </div>

            </div>

            {instance && (
                <div className='mb-10 grid grid-cols-1 lg:grid-cols-4'>
                    <div className='col-span-4 lg:col-span-1'>
                        <div className="flex flex-wrap items-center justify-start gap-4">
                            {arrYears?.map((yr: any, index: number) => (
                                <button
                                    key={`yr-${yr}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        changeYear(yr);

                                        changeMonth(null)
                                        setTotalPagu(0);
                                        setTotalRealisasi(0);
                                        setPaguType(null);
                                        setPaguDate(null);
                                    }}
                                    className={year == yr ? 'btn btn-primary mr-2' : 'btn btn-outline-primary mr-2'}>
                                    {yr}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className='col-span-4 lg:col-span-3'>
                        <div className="grid grid-cols-6 items-center justify-center gap-4">
                            {arrMonths?.map((mth: any, index: number) => (
                                <button
                                    key={`mth-${index}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        changeMonth(mth.value);
                                    }}
                                    className={`${month == mth.value ? 'btn btn-primary mr-2' : 'btn btn-outline-primary mr-2'} col-span-1`}>
                                    {mth.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {(instance && year && month) && (
                <>
                    <div className="text-lg font-semibold mb-4">
                        Program
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">

                        {isLoading2 && (
                            [...Array(9)].map((_, index) => (
                                <div key={`loading-program-${index}`} className="panel animate-pulse h-20"></div>
                            ))
                        )}

                        {arrPrograms?.map((program: any, index: number) => (
                            <div
                                key={`program-${program.program_id}`}
                                onClick={() => {
                                    if (selectedProgram?.program_id != program.program_id) {
                                        handleProgramClick(program);
                                    } else {
                                        setSelectedProgram(null);
                                        setArrKegiatans([]);
                                        setSelectedKegiatan(null);
                                    }
                                }}
                                className={`panel select-none cursor-pointer hover:bg-slate-200 ${selectedProgram?.program_id === program.program_id ? 'bg-slate-200 lg:col-span-3' : ''} ${selectedProgram && selectedProgram.program_id !== program.program_id ? 'hidden' : ''}`}>
                                <div className="">
                                    <div className="text-xs">
                                        {program?.program_fullcode}
                                    </div>
                                    <div className="font-semibold text-sm">
                                        {program?.program_name}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-y-2 items-center justify-between mt-2">
                                    {/* pagu & realisasi */}
                                    <div className="w-full lg:w-1/2 text-sm text-primary">
                                        <div>
                                            Pagu Anggaran:
                                        </div>
                                        <span className="font-semibold">
                                            Rp. {new Intl.NumberFormat('id-ID').format(program?.total_pagu || 0)}
                                        </span>
                                    </div>
                                    <div className="w-full lg:w-1/2 text-sm lg:text-end text-success">
                                        <div>
                                            Realisasi:
                                        </div>
                                        <span className="font-semibold">
                                            Rp. {new Intl.NumberFormat('id-ID').format(program?.total_realisasi || 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </>
            )}

            {(instance && year && month && selectedProgram) && (
                <>
                    <div className="text-lg font-semibold mb-4">
                        Kegiatan
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">

                        {isLoading3 && (
                            [...Array(9)].map((_, index) => (
                                <div key={`loading-kegiatan-${index}`} className="panel animate-pulse h-20"></div>
                            ))
                        )}

                        {arrKegiatans?.map((kegiatan: any, index: number) => (
                            <div
                                key={`kegiatan-${kegiatan.kegiatan_id}`}
                                onClick={() => {
                                    if (selectedKegiatan?.kegiatan_id != kegiatan.kegiatan_id) {
                                        handleKegiatanClick(kegiatan);
                                    } else {
                                        setSelectedKegiatan(null);
                                        setArrSubKegiatans([]);
                                    }
                                }}
                                className={`panel select-none cursor-pointer hover:bg-slate-200 ${selectedKegiatan?.kegiatan_id === kegiatan.kegiatan_id ? 'bg-slate-200 lg:col-span-3' : ''} ${selectedKegiatan && selectedKegiatan.kegiatan_id !== kegiatan.kegiatan_id ? 'hidden' : ''}`}>
                                <div className="">
                                    <div className="text-xs">
                                        {kegiatan?.kegiatan_fullcode}
                                    </div>
                                    <div className="font-semibold text-sm">
                                        {kegiatan?.kegiatan_name}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-y-2 items-center justify-between mt-2">
                                    <div className="w-full lg:w-1/2 text-sm text-primary">
                                        <div>
                                            Pagu Anggaran:
                                        </div>
                                        <span className="font-semibold">
                                            Rp. {new Intl.NumberFormat('id-ID').format(kegiatan?.total_pagu || 0)}
                                        </span>
                                    </div>
                                    <div className="w-full lg:w-1/2 text-sm lg:text-end text-success">
                                        <div>
                                            Realisasi:
                                        </div>
                                        <span className="font-semibold">
                                            Rp. {new Intl.NumberFormat('id-ID').format(kegiatan?.total_realisasi || 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </>
            )}

            {(instance && year && month && selectedProgram && selectedKegiatan) && (
                <>
                    <div className="text-lg font-semibold mb-4">
                        Sub Kegiatan
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">

                        {isLoading4 && (
                            [...Array(9)].map((_, index) => (
                                <div key={`loading-sub-kegiatan-${index}`} className="panel animate-pulse h-20"></div>
                            ))
                        )}

                        {arrSubKegiatans?.map((subKegiatan: any, index: number) => (
                            <div
                                key={`subKegiatan-${subKegiatan.kegiatan_id}`}
                                onClick={() => {
                                    if (selectedSubKegiatan?.kegiatan_id != subKegiatan.kegiatan_id) {
                                        handleSubKegiatanClick(subKegiatan);
                                    } else {
                                        setSelectedSubKegiatan(null);
                                    }
                                }}
                                className={`panel select-none cursor-pointer hover:bg-slate-200 ${selectedSubKegiatan?.sub_kegiatan_id === subKegiatan.sub_kegiatan_id ? 'bg-slate-200 lg:col-span-3' : ''} ${selectedSubKegiatan && selectedSubKegiatan.sub_kegiatan_id !== subKegiatan.sub_kegiatan_id ? 'hidden' : ''}`}>
                                <div className="">
                                    <div className="text-xs">
                                        {subKegiatan?.sub_kegiatan_fullcode}
                                    </div>
                                    <div className="font-semibold text-sm">
                                        {subKegiatan?.sub_kegiatan_name}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-y-2 items-center justify-between mt-2">
                                    {/* pagu & realisasi */}
                                    <div className="w-full lg:w-1/2 text-sm text-primary">
                                        <div>
                                            Pagu Anggaran:
                                        </div>
                                        <span className="font-semibold">
                                            Rp. {new Intl.NumberFormat('id-ID').format(subKegiatan?.total_pagu || 0)}
                                        </span>
                                    </div>
                                    <div className="w-full lg:w-1/2 text-sm lg:text-end text-success">
                                        <div>
                                            Realisasi:
                                        </div>
                                        <span className="font-semibold">
                                            Rp. {new Intl.NumberFormat('id-ID').format(subKegiatan?.total_realisasi || 0)}
                                        </span>
                                    </div>
                                </div>

                                {(selectedSubKegiatan) && (
                                    <div className="flex items-center justify-between mt-4">

                                        <Tippy content={'Buka Pagu Anggaran'}>
                                            <Link
                                                target='_blank'
                                                href={`/kinerja/target/${subKegiatan.sub_kegiatan_id}?periode=${periode?.id}&year=${year}&month=${month}`}
                                                className='btn btn-secondary btn-sm font-normal'>
                                                <span className='truncate w-[80px] md:w-[100px] lg:w-auto'>
                                                    {'Buka Pagu Anggaran'}
                                                </span>
                                                <IconArrowForward className='w-4 h-4 ml-2 flex-none' />
                                            </Link>
                                        </Tippy>

                                        <Tippy content={'Buka Realisasi'}>
                                            <Link
                                                target='_blank'
                                                href={`/realisasi/${subKegiatan.sub_kegiatan_id}?periode=${periode?.id}&year=${year}&month=${month}`}
                                                className='btn btn-success btn-sm font-normal'>
                                                <span className='truncate w-[80px] md:w-[100px] lg:w-auto'>
                                                    {'Buka Realisasi'}
                                                </span>
                                                <IconArrowForward className='w-4 h-4 ml-2 flex-none' />
                                            </Link>
                                        </Tippy>

                                    </div>
                                )}
                            </div>
                        ))}

                    </div>
                </>
            )}

            {/* {(instance && year && month) && (
                <>
                    <div className="font-semibold text-lg mb-4">
                        Pilih Program
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                        {datas?.map((program: any, index: number) => (
                            <>
                                {(showPrograms.includes(program?.id) || showPrograms.length == 0) && (
                                    <div
                                        onClick={(e) => {
                                            e.preventDefault();
                                            togglePrograms(program.id);
                                        }}
                                        className={`panel hover:bg-primary-light cursor-pointer ${(showPrograms.includes(program.id)) ? 'col-span-12 bg-primary-light' : 'col-span-12 md:col-span-6 lg:col-span-4'}`}>

                                        <div className="h-full gap-x-4">
                                            <div className="font-semibold">
                                                {program?.fullcode}
                                            </div>
                                            <div className="grow">
                                                {program?.name}
                                            </div>
                                        </div>

                                    </div>
                                )}
                                {showPrograms.includes(program?.id) && (
                                    <div className='col-span-12'>
                                        <div className="font-semibold text-lg mb-4">
                                            Pilih Kegiatan
                                        </div>
                                        <div className='grid grid-cols-12 gap-4'>
                                            {program?.kegiatans?.map((kegiatan: any, index: number) => (
                                                <>
                                                    {(showKegiatans.includes(kegiatan.id) || showKegiatans.length == 0) && (
                                                        <div
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                toggleKegiatans(kegiatan.id);
                                                            }}
                                                            className={`panel hover:bg-primary-light cursor-pointer ${showKegiatans.includes(kegiatan.id) ? 'col-span-12 bg-primary-light' : 'col-span-12 md:col-span-6 lg:col-span-4'}`}>

                                                            <div className="h-full gap-x-4">
                                                                <div className="font-semibold">
                                                                    {kegiatan?.fullcode}
                                                                </div>
                                                                <div className="grow">
                                                                    {kegiatan?.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {showKegiatans.includes(kegiatan?.id) && (
                                                        <div className='col-span-12'>
                                                            <div className="font-semibold text-lg mb-4">
                                                                Pilih Sub Kegiatan
                                                            </div>
                                                            <div className='grid grid-cols-12 gap-4'>
                                                                {kegiatan?.sub_kegiatans?.map((subkegiatan: any, index: number) => (
                                                                    <>
                                                                        {(showSubKegiatans.includes(subkegiatan.id) || showSubKegiatans.length == 0) && (
                                                                            <div
                                                                                className={`panel hover:bg-primary-light cursor-pointer ${showSubKegiatans.includes(subkegiatan.id) ? 'col-span-12 bg-primary-light' : 'col-span-12 md:col-span-6 lg:col-span-4'}`}>

                                                                                <div className="h-full gap-x-4">
                                                                                    <div
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            toggleSubKegiatans(subkegiatan.id);
                                                                                        }} className=''>
                                                                                        <div className="font-semibold">
                                                                                            {subkegiatan?.fullcode}
                                                                                        </div>
                                                                                        <div className="">
                                                                                            {subkegiatan?.name}
                                                                                        </div>
                                                                                    </div>

                                                                                    {showSubKegiatans.includes(subkegiatan?.id) && (
                                                                                        <>
                                                                                            <div className="flex items-center gap-2 border-t border-slate-500 pt-3 mt-3 hidden">

                                                                                                <div className="text-center">
                                                                                                    <div className="text-xs mb-1">
                                                                                                        Renstra
                                                                                                    </div>
                                                                                                    {subkegiatan?.renstra_status == 'draft' && (
                                                                                                        <span className="badge bg-primary">
                                                                                                            Draft
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.renstra_status == 'verified' && (
                                                                                                        <span className="badge bg-success">
                                                                                                            Terverifikasi
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.renstra_status == 'return' && (
                                                                                                        <span className="badge bg-warning">
                                                                                                            Dikembalikan
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.renstra_status == 'waiting' && (
                                                                                                        <span className="badge bg-warning">
                                                                                                            Menunggu
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.renstra_status == 'sent' && (
                                                                                                        <span className="badge bg-info">
                                                                                                            Dikirim
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.renstra_status == 'reject' && (
                                                                                                        <span className="badge bg-danger">
                                                                                                            Ditolak
                                                                                                        </span>
                                                                                                    )}
                                                                                                </div>

                                                                                                <div className="text-center">
                                                                                                    <div className="text-xs mb-1">
                                                                                                        Renja
                                                                                                    </div>
                                                                                                    {subkegiatan?.renja_status == 'draft' && (
                                                                                                        <span className="badge bg-primary">
                                                                                                            Draft
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.renja_status == 'verified' && (
                                                                                                        <span className="badge bg-success">
                                                                                                            Terverifikasi
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.renja_status == 'return' && (
                                                                                                        <span className="badge bg-warning">
                                                                                                            Dikembalikan
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.renja_status == 'waiting' && (
                                                                                                        <span className="badge bg-warning">
                                                                                                            Menunggu
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.renja_status == 'sent' && (
                                                                                                        <span className="badge bg-info">
                                                                                                            Dikirim
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.renja_status == 'reject' && (
                                                                                                        <span className="badge bg-danger">
                                                                                                            Ditolak
                                                                                                        </span>
                                                                                                    )}
                                                                                                </div>

                                                                                                <div className="text-center">
                                                                                                    <div className="text-xs mb-1">
                                                                                                        APBD
                                                                                                    </div>
                                                                                                    {subkegiatan?.apbd_status == 'draft' && (
                                                                                                        <span className="badge bg-primary">
                                                                                                            Draft
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.apbd_status == 'verified' && (
                                                                                                        <span className="badge bg-success">
                                                                                                            Terverifikasi
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.apbd_status == 'return' && (
                                                                                                        <span className="badge bg-warning">
                                                                                                            Dikembalikan
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.apbd_status == 'waiting' && (
                                                                                                        <span className="badge bg-warning">
                                                                                                            Menunggu
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.apbd_status == 'sent' && (
                                                                                                        <span className="badge bg-info">
                                                                                                            Dikirim
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {subkegiatan?.apbd_status == 'reject' && (
                                                                                                        <span className="badge bg-danger">
                                                                                                            Ditolak
                                                                                                        </span>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex gap-2 mt-4">
                                                                                                <div className="text-xs font-normal mb-1">
                                                                                                    Input Realisasi Tahun {year}
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="flex flex-col md:flex-row items-center justify-start gap-2 md:divide-x divide-indigo-500 pb-3 lg:pb-0">

                                                                                                {(periode?.id && year && month) && (
                                                                                                    <div className="px-2 flex items-center gap-x-1">
                                                                                                        {(subkegiatan.renstra_status === 'verified' && subkegiatan.renja_status === 'verified' && subkegiatan.apbd_status === 'verified') ? (
                                                                                                            <Tippy content={CurrentUser?.role_id === 6 ? 'Lihat Target' : 'Pagu Anggaran'}>
                                                                                                                <Link
                                                                                                                    target='_blank'
                                                                                                                    href={`/kinerja/target/${subkegiatan.id}?periode=${periode?.id}&year=${year}&month=${month}`}
                                                                                                                    className='btn btn-secondary font-normal'>
                                                                                                                    <span className='truncate w-[80px] md:w-[100px] lg:w-auto'>
                                                                                                                        {CurrentUser?.role_id === 6 ? 'Lihat Target' : 'Pagu Anggaran'}
                                                                                                                    </span>
                                                                                                                    <IconArrowForward className='w-4 h-4 ml-2 flex-none' />
                                                                                                                </Link>
                                                                                                            </Tippy>
                                                                                                        ) : (
                                                                                                            <div className="flex items-center gap-2">
                                                                                                                {subkegiatan.renstra_status !== 'verified' && (
                                                                                                                    <span className="badge bg-danger">
                                                                                                                        Renstra Belum Terverifikasi
                                                                                                                    </span>
                                                                                                                )}
                                                                                                                {subkegiatan.renja_status !== 'verified' && (
                                                                                                                    <span className="badge bg-danger">
                                                                                                                        Renja Belum Terverifikasi
                                                                                                                    </span>
                                                                                                                )}
                                                                                                                {subkegiatan.apbd_status !== 'verified' && (
                                                                                                                    <span className="badge bg-danger">
                                                                                                                        APBD Belum Terverifikasi
                                                                                                                    </span>
                                                                                                                )}
                                                                                                            </div>
                                                                                                        )}

                                                                                                        {subkegiatan.target_status === 'verified' && (
                                                                                                            <Tippy content={CurrentUser?.role_id === 6 ? 'Lihat Realisasi' : 'Input Realisasi'}>
                                                                                                                <Link
                                                                                                                    target='_blank'
                                                                                                                    href={`/realisasi/${subkegiatan.id}?periode=${periode?.id}&year=${year}&month=${month}`}
                                                                                                                    className='btn btn-success font-normal'>
                                                                                                                    <span className='truncate w-[80px] md:w-[100px] lg:w-auto'>
                                                                                                                        {CurrentUser?.role_id === 6 ? 'Lihat Realisasi' : 'Input Realisasi'}
                                                                                                                    </span>
                                                                                                                    <IconArrowForward className='w-4 h-4 ml-2 flex-none' />
                                                                                                                </Link>
                                                                                                            </Tippy>
                                                                                                        )}
                                                                                                    </div>
                                                                                                )}

                                                                                            </div>
                                                                                        </>
                                                                                    )}


                                                                                </div>

                                                                            </div>
                                                                        )}
                                                                    </>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ))}
                    </div>

                    {datas?.length == 0 && (
                        <div className="w-full h-[calc(100vh-300px)] flex flex-col items-center justify-center">
                            <div className="dots-loading text-xl">Memuat Program {arrInstances?.[instance - 1]?.alias ?? '\u00A0'}...</div>
                        </div>
                    )}
                </>
            )} */}

        </>
    );
}
export default Content1;
