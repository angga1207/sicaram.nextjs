import { Fragment, useEffect, useState } from "react";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import Link from 'next/link';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import IconX from '@/components/Icon/IconX';
const angkaTerbilang = require('@develoka/angka-terbilang-js');
import LoadingSicaram from "../LoadingSicaram";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSave,
    faMinus,
    faMinusCircle,
    faPlus,
    faPlusCircle,
    faArrowRightToBracket,
    faBriefcaseClock,
    faCheck,
    faTimes,
    faSyncAlt,
    faForward,
    faHourglassHalf,
    faShare,
    faUserAlt,
    faExclamationCircle,
    faCaretUp,
    faCaretDown,
    faTimesCircle,
    faListUl,
    faPencilAlt,
    faThumbTack,
    faFileSignature,
    faAngleDoubleRight,
    faExclamationTriangle,
    faAngleDoubleLeft,
    faSpinner,
    faAngleDoubleUp,
    faLink,
    faBars
} from '@fortawesome/free-solid-svg-icons';
import { faFileAlt, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import InputRupiahRealisasi from "../InputRupiahRealisasi";


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

const showAlertBox = async (icon: any, title: any, text: any) => {
    const toast = Swal.mixin({
        toast: false,
        position: 'center',
        showConfirmButton: true,
        showCancelButton: false,
        confirmButtonText: 'Tutup',
    });
    toast.fire({
        icon: icon,
        title: title,
        text: text,
        padding: '10px 20px',
    });
};

const RincianBelanja = (
    { params, updateData, isUnsave }:
        { params: any, updateData: any, isUnsave: any }
) => {
    const [periode, setPeriode] = useState<any>(null);
    const [year, setYear] = useState<any>(null);
    const [month, setMonth] = useState<any>(null);
    const [subKegiatan, setSubKegiatan] = useState<any>([]);
    const [datas, setDatas] = useState<any>([]);

    useEffect(() => {
        if (params?.datas) {
            setDatas(params?.datas);
            setSubKegiatan(params?.subKegiatan);
            setPeriode(params?.periode);
            setYear(params?.year);
            setMonth(params?.month);
        }
    }, [params]);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [unsaveStatus, setUnsaveStatus] = useState<boolean>(isUnsave ?? false);

    const updateTotalRealisasi = (newData: any) => {
        if (newData && newData.length > 0) {
            updateData(newData);
        }
    }

    return (
        <div className="table-responsive h-[calc(100vh-250px)] border !border-slate-400 dark:!border-slate-100 pr-5">
            <table className=''>
                <thead className='sticky top-0 left-0 z-[1]'>
                    <tr>
                        <th rowSpan={2}
                            className='!text-center !text-sm bg-slate-900 dark:!bg-slate-800 text-white !px-2.5 !py-3 border !border-white whitespace-nowrap !w-[150px]'>
                            Kode Rekening
                        </th>
                        <th rowSpan={2}
                            className='!text-center !text-sm bg-slate-900 dark:!bg-slate-800 text-white !px-2.5 !py-3 border !border-white whitespace-nowrap !min-w-[400px]'>
                            Uraian
                        </th>
                        <th rowSpan={1} colSpan={2}
                            className='!text-center !text-sm bg-slate-900 dark:!bg-slate-800 text-white !px-2.5 !py-3 border !border-white whitespace-nowrap !min-w-[250px]'>
                            Koefisien
                        </th>
                        <th rowSpan={2}
                            className='!text-center !text-sm bg-slate-900 dark:!bg-slate-800 text-white !px-2.5 !py-3 border !border-white whitespace-nowrap !w-[100px]'>
                            Harga (Rp)
                        </th>
                        <th rowSpan={1} colSpan={(month > 1 && month < 13) ? 3 : 2}
                            className='!text-center !text-sm bg-slate-900 dark:!bg-slate-800 text-white !px-2.5 !py-3 border !border-white whitespace-nowrap !w-[100px]'>
                            Jumlah (Rp)
                        </th>
                    </tr>
                    <tr>
                        <th className='!text-center !text-sm bg-slate-900 dark:!bg-slate-800 text-white !px-2.5 !py-3 border !border-white whitespace-nowrap !w-[100px]'>
                            Target
                        </th>
                        <th className='!text-center !text-sm bg-slate-900 dark:!bg-slate-800 text-white !px-2.5 !py-3 border !border-white whitespace-nowrap !w-[100px]'>
                            Realisasi
                        </th>
                        <th className='!text-center !text-sm bg-slate-900 dark:!bg-slate-800 text-white !px-2.5 !py-3 border !border-white whitespace-nowrap !w-[100px]'>
                            Anggaran
                        </th>
                        {month > 1 && month < 13 && (
                            <th className='!text-center !text-sm bg-slate-900 dark:!bg-slate-800 text-white !px-2.5 !py-3 border !border-white whitespace-nowrap !w-[100px]'>
                                Realisasi Terakhir
                            </th>
                        )}
                        <th className='!text-center !text-sm bg-slate-900 dark:!bg-slate-800 text-white !px-2.5 !py-3 border !border-white whitespace-nowrap !w-[100px]'>
                            Realisasi Bulan Ini
                        </th>
                    </tr>
                </thead>
                <tbody className='dark:text-white'>

                    {isLoading && (
                        <tr>
                            <td colSpan={8} className='text-center'>
                                <div className="w-full h-[calc(100vh-200px)] flex items-center justify-center">
                                    <LoadingSicaram />
                                </div>
                            </td>
                        </tr>
                    )}

                    {(datas && datas?.length > 0) && (
                        <>
                            {datas?.map((data: any, index: any) => (
                                <>
                                    <tr key={index} className=''>

                                        <td className='border-y !border-slate-400 dark:!border-slate-100'>
                                            <div className="text-xs font-semibold">
                                                {data.fullcode}
                                            </div>
                                        </td>

                                        <td className='border !border-slate-400 dark:!border-slate-100' colSpan={data.long ? 4 : 1} >
                                            <div className="text-xs font-semibold">
                                                {data.type == 'rekening' && (
                                                    <>
                                                        {data.uraian}
                                                    </>
                                                )}
                                                {data.type == 'target-kinerja' && (
                                                    <>
                                                        <div className="flex items-center justify-between">
                                                            <div className="">
                                                                <div className="">
                                                                    [#] {data.nama_paket}
                                                                </div>
                                                                <div className="">
                                                                    Sumber Dana : {data.sumber_dana_name}
                                                                </div>
                                                                <div className='flex items-center gap-x-2'>
                                                                    <Tippy content={`Dibuat Oleh`}
                                                                        animation='scale'
                                                                    >
                                                                        <div className="font-normal text-2xs mt-1.5 text-slate-500 flex items-center cursor-pointer">
                                                                            <FontAwesomeIcon icon={faUserAlt} className='mr-1 w-1.5 h-1.5' />
                                                                            {data.created_by_name}
                                                                        </div>
                                                                    </Tippy>

                                                                    {data?.updated_by && (
                                                                        <Tippy content={`Diperbarui Oleh`}
                                                                            animation='scale'
                                                                        >
                                                                            <div className="font-normal text-2xs mt-1.5 text-blue-500 flex items-center cursor-pointer">
                                                                                <FontAwesomeIcon icon={faUserAlt} className='mr-1 w-1.5 h-1.5' />
                                                                                {data.updated_by_name}
                                                                            </div>
                                                                        </Tippy>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="">
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </td>

                                        <td className='border !border-slate-400 dark:!border-slate-100 !px-1'>

                                            {/* <div className="text-xs font-semibold whitespace-nowrap text-end px-2">
                                                {new Intl.NumberFormat('id-ID', {
                                                    style: 'decimal',
                                                    minimumFractionDigits: 0,
                                                }).format(data?.pagu ?? 0)}
                                            </div> */}
                                            <InputRupiahRealisasi
                                                dataValue={data.pagu}
                                                readOnly={true}
                                            />

                                        </td>

                                        {month > 1 && month < 13 && (
                                            <td className='border !border-slate-400 dark:!border-slate-100 !px-1'>

                                                {data?.type == 'rekening' && (
                                                    <InputRupiahRealisasi
                                                        dataValue={data.realisasi_anggaran}
                                                        readOnly={true}
                                                    />
                                                )}

                                                {(data?.type == 'target-kinerja' && data?.is_detail === true && data?.rincian_belanja?.length > 0) && (
                                                    // <div className="text-xs font-semibold whitespace-nowrap text-end px-2">
                                                    //     {new Intl.NumberFormat('id-ID', {
                                                    //         style: 'decimal',
                                                    //         minimumFractionDigits: 0,
                                                    //     }).format(data?.realisasi_anggaran ?? 0)}
                                                    // </div>
                                                    <InputRupiahRealisasi
                                                        dataValue={data.realisasi_anggaran}
                                                        readOnly={true}
                                                    />
                                                )}

                                                {/* REALISASI ANGGARAN RINCIAN */}
                                                {/* REALISASI BULAN KEMAREN */}
                                                {(data?.type == 'target-kinerja' && data?.is_detail === true && data?.rincian_belanja?.length == 0) && (
                                                    // <div className="text-xs font-semibold whitespace-nowrap text-end px-2">
                                                    //     {new Intl.NumberFormat('id-ID', {
                                                    //         style: 'decimal',
                                                    //         minimumFractionDigits: 0,
                                                    //     }).format(data?.realisasi_anggaran ?? 0)}
                                                    // </div>
                                                    <InputRupiahRealisasi
                                                        dataValue={data.realisasi_anggaran}
                                                        readOnly={true}
                                                    />
                                                )}

                                                {/* REALISASI ANGGARAN RINCIAN */}
                                                {/* REALISASI BULAN KEMAREN */}
                                                {(data?.type == 'target-kinerja' && data?.is_detail === false) && (
                                                    // <div className="text-xs font-semibold whitespace-nowrap text-end px-2">
                                                    //     {new Intl.NumberFormat('id-ID', {
                                                    //         style: 'decimal',
                                                    //         minimumFractionDigits: 0,
                                                    //     }).format(data?.realisasi_anggaran ?? 0)}
                                                    // </div>
                                                    <InputRupiahRealisasi
                                                        dataValue={data.realisasi_anggaran}
                                                        readOnly={true}
                                                    />
                                                )}

                                            </td>
                                        )}

                                        <td className='border !border-slate-400 dark:!border-slate-100 !px-1 !pr-4'>
                                            {/* REALISASI BULAN INI */}

                                            {data?.type === 'rekening' && (
                                                <InputRupiahRealisasi
                                                    dataValue={data.realisasi_anggaran_bulan_ini}
                                                    readOnly={true}
                                                />
                                            )}

                                            {data?.type === 'target-kinerja' && (
                                                <InputRupiahRealisasi
                                                    isDisabled={true}
                                                    dataValue={data.realisasi_anggaran_bulan_ini}
                                                    onChange={(value: any) => {
                                                        if (subKegiatan?.status === 'verified') {
                                                            showAlert('error', 'Data tidak dapat diubah karena Status Realisasi Sudah "Terverifikasi"');
                                                            return;
                                                        }
                                                        if (subKegiatan?.status_target !== 'verified') {
                                                            showAlert('error', 'Target Belum Terverifikasi');
                                                            return;
                                                        }
                                                        setUnsaveStatus(true);
                                                        setDatas((prev: any) => {
                                                            const updated = [...prev];
                                                            let sumRealisasiAnggaran = data.rincian_belanja.reduce((a: any, b: any) => a + parseFloat(b['realisasi_anggaran_bulan_ini'] || 0), 0);
                                                            let isPaguMatch = sumRealisasiAnggaran == data.pagu ? true : false;
                                                            let isRealisasiMatch = value == data.pagu ? true : false;
                                                            updated[index] = {
                                                                editable: data?.editable,
                                                                long: data?.long,
                                                                type: data?.type,
                                                                id: data?.id,
                                                                id_rek_1: data?.id_rek_1,
                                                                id_rek_2: data?.id_rek_2,
                                                                id_rek_3: data?.id_rek_3,
                                                                id_rek_4: data?.id_rek_4,
                                                                id_rek_5: data?.id_rek_5,
                                                                id_rek_6: data?.id_rek_6,
                                                                parent_id: data?.parent_id,
                                                                year: data?.year,
                                                                jenis: data?.jenis,
                                                                sumber_dana_id: data?.sumber_dana_id,
                                                                sumber_dana_fullcode: data?.sumber_dana_fullcode,
                                                                sumber_dana_name: data?.sumber_dana_name,
                                                                nama_paket: data?.nama_paket,
                                                                pagu: data?.pagu,
                                                                realisasi_anggaran: data?.realisasi_anggaran,
                                                                // realisasi_anggaran_bulan_ini: value,
                                                                realisasi_anggaran_bulan_ini: isNaN(value) ? 0 : value,
                                                                temp_pagu: data?.temp_pagu,
                                                                is_pagu_match: isPaguMatch,
                                                                is_detail: data?.is_detail,
                                                                created_by: data?.created_by,
                                                                created_by_name: data?.created_by_name,
                                                                updated_by: data?.updated_by,
                                                                updated_by_name: data?.updated_by_name,
                                                                rincian_belanja: data?.rincian_belanja,
                                                            };

                                                            const Rekening6 = updated.find((item: any) => item.id == data.parent_id);
                                                            const Rekening6Index = updated.findIndex((item: any) => item.id == data.parent_id);
                                                            const RincianBelanjas = updated.filter((item: any) => item.type == 'target-kinerja' && item.parent_id == data.parent_id);
                                                            let RincianSumAnggaran = RincianBelanjas.filter((item: any) => item.type == 'target-kinerja').reduce((a: any, b: any) => a + parseFloat(b['realisasi_anggaran_bulan_ini'] || 0), 0);

                                                            updated[Rekening6Index] = {
                                                                editable: Rekening6?.editable,
                                                                long: Rekening6?.long,
                                                                type: Rekening6?.type,
                                                                rek: Rekening6?.rek,
                                                                id: Rekening6?.id,
                                                                parent_id: Rekening6?.parent_id,
                                                                uraian: Rekening6?.uraian,
                                                                fullcode: Rekening6?.fullcode,
                                                                pagu: Rekening6?.pagu,
                                                                rincian_belanja: Rekening6?.rincian_belanja,
                                                                realisasi_anggaran: Rekening6?.realisasi_anggaran,
                                                                realisasi_anggaran_bulan_ini: RincianSumAnggaran,
                                                            };

                                                            const Rekening5 = updated.find((item: any) => item.id == data.id_rek_5);
                                                            const Rekening5Index = updated.findIndex((item: any) => item.id == data.id_rek_5);
                                                            const updatedRekening6 = updated.filter((item: any) => item.rek == 6 && item.parent_id == data.id_rek_5);
                                                            let SumAnggaranRekening5 = updatedRekening6.reduce((a: any, b: any) => a + (b['realisasi_anggaran_bulan_ini'] || 0), 0);

                                                            updated[Rekening5Index] = {
                                                                editable: Rekening5?.editable,
                                                                long: Rekening5?.long,
                                                                type: Rekening5?.type,
                                                                rek: Rekening5?.rek,
                                                                id: Rekening5?.id,
                                                                parent_id: Rekening5?.parent_id,
                                                                uraian: Rekening5?.uraian,
                                                                fullcode: Rekening5?.fullcode,
                                                                pagu: Rekening5?.pagu,
                                                                rincian_belanja: Rekening5?.rincian_belanja,
                                                                realisasi_anggaran: Rekening5?.realisasi_anggaran,
                                                                realisasi_anggaran_bulan_ini: SumAnggaranRekening5,
                                                            };

                                                            const Rekening4 = updated.find((item: any) => item.id == data.id_rek_4);
                                                            const Rekening4Index = updated.findIndex((item: any) => item.id == data.id_rek_4);
                                                            const updatedRekening5 = updated.filter((item: any) => item.rek === 5 && item.parent_id == data.id_rek_4);
                                                            let SumAnggaranRekening4 = updatedRekening5.reduce((a: any, b: any) => a + parseFloat(b['realisasi_anggaran_bulan_ini'] || 0), 0);

                                                            updated[Rekening4Index] = {
                                                                editable: Rekening4?.editable,
                                                                long: Rekening4?.long,
                                                                type: Rekening4?.type,
                                                                rek: Rekening4?.rek,
                                                                id: Rekening4?.id,
                                                                parent_id: Rekening4?.parent_id,
                                                                uraian: Rekening4?.uraian,
                                                                fullcode: Rekening4?.fullcode,
                                                                pagu: Rekening4?.pagu,
                                                                rincian_belanja: Rekening4?.rincian_belanja,
                                                                realisasi_anggaran: Rekening4?.realisasi_anggaran,
                                                                realisasi_anggaran_bulan_ini: SumAnggaranRekening4,
                                                            };

                                                            const Rekening3 = updated.find((item: any) => item.id == data.id_rek_3);
                                                            const Rekening3Index = updated.findIndex((item: any) => item.id == data.id_rek_3);
                                                            const updatedRekening4 = updated.filter((item: any) => item.rek === 4 && item.parent_id == data.id_rek_3);
                                                            let SumAnggaranRekening3 = updatedRekening4.reduce((a: any, b: any) => a + (b['realisasi_anggaran_bulan_ini'] || 0), 0);

                                                            updated[Rekening3Index] = {
                                                                editable: Rekening3?.editable,
                                                                long: Rekening3?.long,
                                                                type: Rekening3?.type,
                                                                rek: Rekening3?.rek,
                                                                id: Rekening3?.id,
                                                                parent_id: Rekening3?.parent_id,
                                                                uraian: Rekening3?.uraian,
                                                                fullcode: Rekening3?.fullcode,
                                                                pagu: Rekening3?.pagu,
                                                                rincian_belanja: Rekening3?.rincian_belanja,
                                                                realisasi_anggaran: Rekening3?.realisasi_anggaran,
                                                                realisasi_anggaran_bulan_ini: SumAnggaranRekening3,
                                                            };

                                                            const Rekening2 = updated.find((item: any) => item.id == data.id_rek_2);
                                                            const Rekening2Index = updated.findIndex((item: any) => item.id == data.id_rek_2);
                                                            const updatedRekening3 = updated.filter((item: any) => item.rek === 3 && item.parent_id == data.id_rek_2);
                                                            let SumAnggaranRekening2 = updatedRekening3.reduce((a: any, b: any) => a + parseFloat(b['realisasi_anggaran_bulan_ini'] || 0), 0);

                                                            updated[Rekening2Index] = {
                                                                editable: Rekening2?.editable,
                                                                long: Rekening2?.long,
                                                                type: Rekening2?.type,
                                                                rek: Rekening2?.rek,
                                                                id: Rekening2?.id,
                                                                parent_id: Rekening2?.parent_id,
                                                                uraian: Rekening2?.uraian,
                                                                fullcode: Rekening2?.fullcode,
                                                                pagu: Rekening2?.pagu,
                                                                rincian_belanja: Rekening2?.rincian_belanja,
                                                                realisasi_anggaran: Rekening2?.realisasi_anggaran,
                                                                realisasi_anggaran_bulan_ini: SumAnggaranRekening2,
                                                            };

                                                            const Rekening1 = updated.find((item: any) => item.id == data.id_rek_1);
                                                            const Rekening1Index = updated.findIndex((item: any) => item.id == data.id_rek_1);
                                                            const updatedRekening2 = updated.filter((item: any) => item.rek === 2 && item.parent_id == data.id_rek_1);
                                                            let SumAnggaranRekening1 = updatedRekening2.reduce((a: any, b: any) => a + parseFloat(b['realisasi_anggaran_bulan_ini'] || 0), 0);

                                                            updated[Rekening1Index] = {
                                                                editable: Rekening1?.editable,
                                                                long: Rekening1?.long,
                                                                type: Rekening1?.type,
                                                                rek: Rekening1?.rek,
                                                                id: Rekening1?.id,
                                                                parent_id: Rekening1?.parent_id,
                                                                uraian: Rekening1?.uraian,
                                                                fullcode: Rekening1?.fullcode,
                                                                pagu: Rekening1?.pagu,
                                                                rincian_belanja: Rekening1?.rincian_belanja,
                                                                realisasi_anggaran: Rekening1?.realisasi_anggaran,
                                                                realisasi_anggaran_bulan_ini: SumAnggaranRekening1,
                                                            };
                                                            // updateTotalRealisasi(updated);
                                                            return updated;
                                                        })
                                                    }}
                                                    onBlur={() => {
                                                        updateTotalRealisasi(datas);
                                                    }}
                                                    isRealisasi={true}
                                                />
                                            )}
                                        </td>

                                    </tr>

                                    {(data?.rincian_belanja && data?.rincian_belanja?.length > 0) && (
                                        <>
                                            {data?.rincian_belanja?.map((rincian: any, indexRincian: any) => {
                                                return (
                                                    <>
                                                        <tr>
                                                            <td className='border-y !border-slate-400 dark:!border-slate-100'>
                                                            </td>
                                                            <td className='border !border-slate-400 dark:!border-slate-100' colSpan={4}>
                                                                <div className="text-xs font-semibold">
                                                                    {rincian?.title}
                                                                </div>
                                                            </td>
                                                            <td className='border !border-slate-400 dark:!border-slate-100 !px-1'>
                                                                <div className='text-xs font-semibold whitespace-nowrap text-end px-2'>
                                                                    {new Intl.NumberFormat('id-ID', {
                                                                        style: 'decimal',
                                                                        minimumFractionDigits: 0,
                                                                    }).format(rincian?.pagu ?? 0)}
                                                                </div>
                                                            </td>

                                                            {month > 1 && month < 13 && (
                                                                <td className='border !border-slate-400 dark:!border-slate-100 !px-1 !pr-4'>
                                                                    {/* RINCIAN BELANJA */}
                                                                    {/* REALISASI BULAN KEMAREN */}
                                                                    <div className='text-xs font-semibold whitespace-nowrap text-end px-2'>
                                                                        {new Intl.NumberFormat('id-ID', {
                                                                            style: 'decimal',
                                                                            minimumFractionDigits: 0,
                                                                        }).format(rincian?.realisasi_anggaran ?? 0)}
                                                                    </div>
                                                                </td>
                                                            )}

                                                            <td className='border !border-slate-400 dark:!border-slate-100 !px-1 !pr-4'>
                                                                {/* RINCIAN BELANJA */}
                                                                {/* REALISASI BULAN INI */}
                                                                <div className='text-xs font-semibold whitespace-nowrap text-end px-2'>
                                                                    {new Intl.NumberFormat('id-ID', {
                                                                        style: 'decimal',
                                                                        minimumFractionDigits: 0,
                                                                    }).format(rincian?.realisasi_anggaran_bulan_ini ?? 0)}
                                                                </div>
                                                            </td>
                                                        </tr>

                                                        {/* Keterangan Rincian Start */}
                                                        {rincian?.keterangan_rincian?.map((keterangan: any, indexKeterangan: any) => {
                                                            return (
                                                                <>
                                                                    <tr>
                                                                        <td className='border-y !border-slate-400 dark:!border-slate-100'>
                                                                        </td>
                                                                        <td className='border !border-slate-400 dark:!border-slate-100'>
                                                                            <div className="font-normal text-xs">
                                                                                {keterangan.title.split('\n').map((item: any, key: any) => {
                                                                                    return <Fragment key={key}>{item}<br /></Fragment>
                                                                                })}
                                                                            </div>
                                                                        </td>
                                                                        <td className='border !border-slate-400 dark:!border-slate-100'>
                                                                            <div className='text-xs whitespace-nowrap'>
                                                                                {keterangan?.koefisien.toString().replace(/\./g, ',')}
                                                                                {keterangan?.koefisien > 1 ? ' ' + keterangan?.satuan_name : ' ' + keterangan?.satuan_name}
                                                                            </div>
                                                                        </td>
                                                                        <td className='border !border-slate-400 dark:!border-slate-100 !p-1 !py-0'>
                                                                            <div className="text-xs flex gap-x-1 items-center">
                                                                                <input
                                                                                    className='form-input w-[125px] border-slate-400 dark:border-slate-100 dark:text-white min-h-8 font-normal text-xs px-1.5 py-1  disabled:text-end disabled:bg-slate-200 dark:disabled:bg-slate-700'
                                                                                    type='text'
                                                                                    value={keterangan?.koefisien_realisasi.toString().replace(/\./g, ',')}
                                                                                    onKeyDown={(e) => {
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
                                                                                    disabled={(subKegiatan?.status === 'verified' || subKegiatan?.status_target !== 'verified') ? true : false}
                                                                                    onChange={
                                                                                        (e) => {
                                                                                            if (subKegiatan?.status === 'verified') {
                                                                                                showAlert('error', 'Data tidak dapat diubah karena Status Realisasi Sudah "Terverifikasi"');
                                                                                                return;
                                                                                            }
                                                                                            if (subKegiatan?.status_target !== 'verified') {
                                                                                                showAlert('error', 'Target Belum Terverifikasi');
                                                                                                return;
                                                                                            }
                                                                                            setUnsaveStatus(true);
                                                                                            let value = e.target.value ? parseFloat(e.target.value.toString().replace(/,/g, '.')) : 0;
                                                                                            setDatas((prev: any) => {
                                                                                                const updated = [...prev];

                                                                                                let hargaSatuan = keterangan?.harga_satuan && keterangan?.harga_satuan.toString().replace(/\./g, '.');
                                                                                                let calculateRealisasiAnggaran = value * parseFloat(hargaSatuan);
                                                                                                calculateRealisasiAnggaran = parseFloat(calculateRealisasiAnggaran.toFixed(0));
                                                                                                let sumRealisasiAnggaran = data.rincian_belanja.reduce((a: any, b: any) => a + parseFloat(b['keterangan_rincian'][indexKeterangan]?.realisasi_anggaran_bulan_ini || 0), 0);
                                                                                                let isPaguMatch = sumRealisasiAnggaran == data.pagu ? true : false;
                                                                                                let isRealisasiMatch = calculateRealisasiAnggaran == keterangan?.pagu ? true : false;
                                                                                                updated[index] = {
                                                                                                    editable: data?.editable,
                                                                                                    long: data?.long,
                                                                                                    type: data?.type,
                                                                                                    id: data?.id,
                                                                                                    id_rek_1: data?.id_rek_1,
                                                                                                    id_rek_2: data?.id_rek_2,
                                                                                                    id_rek_3: data?.id_rek_3,
                                                                                                    id_rek_4: data?.id_rek_4,
                                                                                                    id_rek_5: data?.id_rek_5,
                                                                                                    id_rek_6: data?.id_rek_6,
                                                                                                    parent_id: data?.parent_id,
                                                                                                    year: data?.year,
                                                                                                    jenis: data?.jenis,
                                                                                                    sumber_dana_id: data?.sumber_dana_id,
                                                                                                    sumber_dana_fullcode: data?.sumber_dana_fullcode,
                                                                                                    sumber_dana_name: data?.sumber_dana_name,
                                                                                                    nama_paket: data?.nama_paket,
                                                                                                    pagu: data?.pagu,
                                                                                                    realisasi_anggaran: data?.realisasi_anggaran,
                                                                                                    realisasi_anggaran_bulan_ini: sumRealisasiAnggaran,
                                                                                                    temp_pagu: data?.temp_pagu,
                                                                                                    is_pagu_match: isPaguMatch,
                                                                                                    is_detail: data?.is_detail,
                                                                                                    rincian_belanja: data?.rincian_belanja,
                                                                                                };
                                                                                                updated[index]['rincian_belanja'][indexRincian] = {
                                                                                                    editable: rincian?.editable,
                                                                                                    long: rincian?.long,
                                                                                                    type: rincian?.type,
                                                                                                    id: rincian?.id,
                                                                                                    id_rek_1: rincian?.id_rek_1,
                                                                                                    id_rek_2: rincian?.id_rek_2,
                                                                                                    id_rek_3: rincian?.id_rek_3,
                                                                                                    id_rek_4: rincian?.id_rek_4,
                                                                                                    id_rek_5: rincian?.id_rek_5,
                                                                                                    id_rek_6: rincian?.id_rek_6,
                                                                                                    target_kinerja_id: rincian?.target_kinerja_id,
                                                                                                    keterangan_rincian: rincian?.keterangan_rincian,
                                                                                                    title: rincian?.title,
                                                                                                    pagu: rincian?.pagu,
                                                                                                    realisasi_anggaran: rincian?.realisasi_anggaran,
                                                                                                    realisasi_anggaran_bulan_ini: calculateRealisasiAnggaran,
                                                                                                };
                                                                                                updated[index]['rincian_belanja'][indexRincian]['keterangan_rincian'][indexKeterangan] = {
                                                                                                    editable: keterangan?.editable,
                                                                                                    id: keterangan?.id,
                                                                                                    long: keterangan?.long,
                                                                                                    type: keterangan?.type,
                                                                                                    target_kinerja_id: keterangan?.target_kinerja_id,
                                                                                                    title: keterangan?.title,
                                                                                                    koefisien: keterangan?.koefisien,
                                                                                                    koefisien_realisasi: e.target.value,
                                                                                                    satuan_id: keterangan?.satuan_id,
                                                                                                    satuan_name: keterangan?.satuan_name,
                                                                                                    harga_satuan: keterangan?.harga_satuan,
                                                                                                    ppn: keterangan?.ppn,
                                                                                                    pagu: keterangan?.pagu,
                                                                                                    is_realisasi_match: isRealisasiMatch,
                                                                                                    realisasi_anggaran_keterangan: keterangan?.realisasi_anggaran_keterangan,
                                                                                                    realisasi_anggaran_bulan_ini: calculateRealisasiAnggaran,
                                                                                                    target_persentase_kinerja: keterangan?.target_persentase_kinerja,
                                                                                                    persentase_kinerja: keterangan?.persentase_kinerja,
                                                                                                };

                                                                                                const Rekening6 = updated.find((item: any) => item.id == rincian.id_rek_6);
                                                                                                const Rekening6Index = updated.findIndex((item: any) => item.id == rincian.id_rek_6);
                                                                                                const RincianBelanjas = updated.filter((item: any) => item.type == 'target-kinerja' && item.parent_id == rincian.id_rek_6);
                                                                                                let RincianSumAnggaran = RincianBelanjas.filter((item: any) => item.type == 'target-kinerja').reduce((a: any, b: any) => a + parseFloat(b['realisasi_anggaran_bulan_ini'] || 0), 0);

                                                                                                updated[Rekening6Index] = {
                                                                                                    editable: Rekening6?.editable,
                                                                                                    long: Rekening6?.long,
                                                                                                    type: Rekening6?.type,
                                                                                                    rek: Rekening6?.rek,
                                                                                                    id: Rekening6?.id,
                                                                                                    parent_id: Rekening6?.parent_id,
                                                                                                    uraian: Rekening6?.uraian,
                                                                                                    fullcode: Rekening6?.fullcode,
                                                                                                    pagu: Rekening6?.pagu,
                                                                                                    rincian_belanja: Rekening6?.rincian_belanja,
                                                                                                    realisasi_anggaran: Rekening6?.realisasi_anggaran,
                                                                                                    realisasi_anggaran_bulan_ini: RincianSumAnggaran,
                                                                                                };

                                                                                                const Rekening5 = updated.find((item: any) => item.id == rincian.id_rek_5);
                                                                                                const Rekening5Index = updated.findIndex((item: any) => item.id == rincian.id_rek_5);
                                                                                                const updatedRekenings6 = updated.filter((item: any) => item.rek === 6 && item.parent_id == rincian.id_rek_5);
                                                                                                let SumAnggaranRekening5 = updatedRekenings6.reduce((a: any, b: any) => a + parseFloat(b['realisasi_anggaran_bulan_ini'] || 0), 0);

                                                                                                updated[Rekening5Index] = {
                                                                                                    editable: Rekening5?.editable,
                                                                                                    long: Rekening5?.long,
                                                                                                    type: Rekening5?.type,
                                                                                                    rek: Rekening5?.rek,
                                                                                                    id: Rekening5?.id,
                                                                                                    parent_id: Rekening5?.parent_id,
                                                                                                    uraian: Rekening5?.uraian,
                                                                                                    fullcode: Rekening5?.fullcode,
                                                                                                    pagu: Rekening5?.pagu,
                                                                                                    rincian_belanja: Rekening5?.rincian_belanja,
                                                                                                    realisasi_anggaran: Rekening5?.realisasi_anggaran,
                                                                                                    realisasi_anggaran_bulan_ini: SumAnggaranRekening5,
                                                                                                };

                                                                                                const Rekening4 = updated.find((item: any) => item.id == rincian.id_rek_4);
                                                                                                const Rekening4Index = updated.findIndex((item: any) => item.id == rincian.id_rek_4);
                                                                                                const updatedRekenings5 = updated.filter((item: any) => item.rek === 5 && item.parent_id == rincian.id_rek_4);
                                                                                                let SumAnggaranRekening4 = updatedRekenings5.reduce((a: any, b: any) => a + parseFloat(b['realisasi_anggaran_bulan_ini'] || 0), 0);

                                                                                                updated[Rekening4Index] = {
                                                                                                    editable: Rekening4?.editable,
                                                                                                    long: Rekening4?.long,
                                                                                                    type: Rekening4?.type,
                                                                                                    rek: Rekening4?.rek,
                                                                                                    id: Rekening4?.id,
                                                                                                    parent_id: Rekening4?.parent_id,
                                                                                                    uraian: Rekening4?.uraian,
                                                                                                    fullcode: Rekening4?.fullcode,
                                                                                                    pagu: Rekening4?.pagu,
                                                                                                    rincian_belanja: Rekening4?.rincian_belanja,
                                                                                                    realisasi_anggaran: Rekening4?.realisasi_anggaran,
                                                                                                    realisasi_anggaran_bulan_ini: SumAnggaranRekening4,
                                                                                                };

                                                                                                const Rekening3 = updated.find((item: any) => item.id == rincian.id_rek_3);
                                                                                                const Rekening3Index = updated.findIndex((item: any) => item.id == rincian.id_rek_3);
                                                                                                const updatedRekenings4 = updated.filter((item: any) => item.rek === 4 && item.parent_id == rincian.id_rek_3);
                                                                                                let SumAnggaranRekening3 = updatedRekenings4.reduce((a: any, b: any) => a + parseFloat(b['realisasi_anggaran_bulan_ini'] || 0), 0);

                                                                                                updated[Rekening3Index] = {
                                                                                                    editable: Rekening3?.editable,
                                                                                                    long: Rekening3?.long,
                                                                                                    type: Rekening3?.type,
                                                                                                    rek: Rekening3?.rek,
                                                                                                    id: Rekening3?.id,
                                                                                                    parent_id: Rekening3?.parent_id,
                                                                                                    uraian: Rekening3?.uraian,
                                                                                                    fullcode: Rekening3?.fullcode,
                                                                                                    pagu: Rekening3?.pagu,
                                                                                                    rincian_belanja: Rekening3?.rincian_belanja,
                                                                                                    realisasi_anggaran: Rekening3?.realisasi_anggaran,
                                                                                                    realisasi_anggaran_bulan_ini: SumAnggaranRekening3,
                                                                                                };

                                                                                                const Rekening2 = updated.find((item: any) => item.id == rincian.id_rek_2);
                                                                                                const Rekening2Index = updated.findIndex((item: any) => item.id == rincian.id_rek_2);
                                                                                                const updatedRekenings3 = updated.filter((item: any) => item.rek === 3 && item.parent_id == rincian.id_rek_2);
                                                                                                let SumAnggaranRekening2 = updatedRekenings3.reduce((a: any, b: any) => a + parseFloat(b['realisasi_anggaran_bulan_ini'] || 0), 0);

                                                                                                updated[Rekening2Index] = {
                                                                                                    editable: Rekening2?.editable,
                                                                                                    long: Rekening2?.long,
                                                                                                    type: Rekening2?.type,
                                                                                                    rek: Rekening2?.rek,
                                                                                                    id: Rekening2?.id,
                                                                                                    parent_id: Rekening2?.parent_id,
                                                                                                    uraian: Rekening2?.uraian,
                                                                                                    fullcode: Rekening2?.fullcode,
                                                                                                    pagu: Rekening2?.pagu,
                                                                                                    rincian_belanja: Rekening2?.rincian_belanja,
                                                                                                    realisasi_anggaran: Rekening2?.realisasi_anggaran,
                                                                                                    realisasi_anggaran_bulan_ini: SumAnggaranRekening2,
                                                                                                };

                                                                                                const Rekening1 = updated.find((item: any) => item.id == rincian.id_rek_1);
                                                                                                const Rekening1Index = updated.findIndex((item: any) => item.id == rincian.id_rek_1);
                                                                                                const updatedRekenings2 = updated.filter((item: any) => item.rek === 2 && item.parent_id == rincian.id_rek_1);
                                                                                                // let SumAnggaranRekening1 = updatedRekenings2.reduce((a: any, b: any) => a + (b['realisasi_anggaran'] || 0), 0);
                                                                                                let SumAnggaranRekening1 = updatedRekenings2.reduce((a: any, b: any) => a + parseFloat(b['realisasi_anggaran_bulan_ini'] || 0), 0);

                                                                                                updated[Rekening1Index] = {
                                                                                                    editable: Rekening1?.editable,
                                                                                                    long: Rekening1?.long,
                                                                                                    type: Rekening1?.type,
                                                                                                    rek: Rekening1?.rek,
                                                                                                    id: Rekening1?.id,
                                                                                                    parent_id: Rekening1?.parent_id,
                                                                                                    uraian: Rekening1?.uraian,
                                                                                                    fullcode: Rekening1?.fullcode,
                                                                                                    pagu: Rekening1?.pagu,
                                                                                                    rincian_belanja: Rekening1?.rincian_belanja,
                                                                                                    realisasi_anggaran: Rekening1?.realisasi_anggaran,
                                                                                                    realisasi_anggaran_bulan_ini: SumAnggaranRekening1,
                                                                                                };

                                                                                                // updateTotalRealisasi(updated);
                                                                                                return updated;
                                                                                            });
                                                                                        }
                                                                                    }
                                                                                    onBlur={() => {
                                                                                        updateTotalRealisasi(datas);
                                                                                    }}
                                                                                    placeholder='Koefisien Realisasi'
                                                                                />
                                                                                <Tippy content='Desimal menggunakan Koma " , "'>
                                                                                    <div className="cursor-pointer text-info">
                                                                                        <FontAwesomeIcon icon={faExclamationCircle} className="w-3 h-3" />
                                                                                    </div>
                                                                                </Tippy>
                                                                            </div>
                                                                        </td>
                                                                        <td className='border !border-slate-400 dark:!border-slate-100'>
                                                                            <div className="text-xs text-end px-2">
                                                                                {new Intl.NumberFormat('id-ID', {
                                                                                    style: 'decimal',
                                                                                    minimumFractionDigits: 0,
                                                                                }).format(keterangan?.harga_satuan ?? 0)}
                                                                            </div>
                                                                        </td>
                                                                        <td className='border !border-slate-400 dark:!border-slate-100 !px-1'>
                                                                            <div className='text-xs font-normal whitespace-nowrap text-end px-2'>
                                                                                {new Intl.NumberFormat('id-ID', {
                                                                                    style: 'decimal',
                                                                                    minimumFractionDigits: 0,
                                                                                }).format(keterangan?.pagu ?? 0)}
                                                                            </div>
                                                                        </td>
                                                                        {month > 1 && month < 13 && (
                                                                            <td className='border !border-slate-400 dark:!border-slate-100 !px-1'>
                                                                                {/* REALISASI BULAN KEMAREN */}
                                                                                <div className='text-xs font-normal whitespace-nowrap text-end px-2'>
                                                                                    {new Intl.NumberFormat('id-ID', {
                                                                                        style: 'decimal',
                                                                                        minimumFractionDigits: 0,
                                                                                    }).format(keterangan?.realisasi_anggaran_keterangan ?? 0)}
                                                                                </div>
                                                                            </td>
                                                                        )}
                                                                        <td className='border !border-slate-400 dark:!border-slate-100 !px-1 !pr-4'>
                                                                            {/* REALISASI BULAN INI */}
                                                                            <div className='flex items-center gap-x-1'>
                                                                                <input type='text'
                                                                                    className='form-input w-[125px] border-slate-400 dark:border-slate-100 dark:text-white min-h-8 font-normal text-xs px-1.5 py-1 disabled:bg-slate-200 dark:disabled:bg-slate-700 text-end'
                                                                                    value={keterangan?.realisasi_anggaran_bulan_ini ?? 0}
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
                                                                                    // disabled={(subKegiatan?.status === 'verified' || subKegiatan?.status_target !== 'verified') ? true : false}
                                                                                    onChange={(e) => {
                                                                                        if (subKegiatan?.status === 'verified') {
                                                                                            showAlert('error', 'Data tidak dapat diubah karena Status Realisasi Sudah "Terverifikasi"');
                                                                                            return;
                                                                                        }
                                                                                        if (subKegiatan?.status_target !== 'verified') {
                                                                                            showAlert('error', 'Target Belum Terverifikasi');
                                                                                            return;
                                                                                        }
                                                                                        setUnsaveStatus(true);
                                                                                        let value = e.target.value ? parseFloat(e.target.value.toString().replace(/,/g, '.')) : 0;
                                                                                        setDatas((prev: any) => {
                                                                                            const updated = [...prev];
                                                                                            // realisasi_anggaran_keterangan
                                                                                            let calculateRealisasiAnggaran = value;
                                                                                            calculateRealisasiAnggaran = parseFloat(calculateRealisasiAnggaran.toFixed(0));
                                                                                            let sumRealisasiAnggaran = data.rincian_belanja.reduce((a: any, b: any) => a + parseFloat(b['keterangan_rincian'][indexKeterangan]?.realisasi_anggaran_bulan_ini || 0), 0);

                                                                                            let isPaguMatch = sumRealisasiAnggaran == data.pagu ? true : false;

                                                                                            let isRealisasiMatch = calculateRealisasiAnggaran == keterangan?.pagu ? true : false;

                                                                                            updated[index] = {
                                                                                                editable: data?.editable,
                                                                                                long: data?.long,
                                                                                                type: data?.type,
                                                                                                id: data?.id,
                                                                                                id_rek_1: data?.id_rek_1,
                                                                                                id_rek_2: data?.id_rek_2,
                                                                                                id_rek_3: data?.id_rek_3,
                                                                                                id_rek_4: data?.id_rek_4,
                                                                                                id_rek_5: data?.id_rek_5,
                                                                                                id_rek_6: data?.id_rek_6,
                                                                                                parent_id: data?.parent_id,
                                                                                                year: data?.year,
                                                                                                jenis: data?.jenis,
                                                                                                sumber_dana_id: data?.sumber_dana_id,
                                                                                                sumber_dana_fullcode: data?.sumber_dana_fullcode,
                                                                                                sumber_dana_name: data?.sumber_dana_name,
                                                                                                nama_paket: data?.nama_paket,
                                                                                                pagu: data?.pagu,
                                                                                                realisasi_anggaran: data?.realisasi_anggaran,
                                                                                                realisasi_anggaran_bulan_ini: sumRealisasiAnggaran,
                                                                                                temp_pagu: data?.temp_pagu,
                                                                                                is_pagu_match: isPaguMatch,
                                                                                                is_detail: data?.is_detail,
                                                                                                rincian_belanja: data?.rincian_belanja,
                                                                                            };

                                                                                            updated[index]['rincian_belanja'][indexRincian] = {
                                                                                                editable: rincian?.editable,
                                                                                                long: rincian?.long,
                                                                                                type: rincian?.type,
                                                                                                id: rincian?.id,
                                                                                                id_rek_1: rincian?.id_rek_1,
                                                                                                id_rek_2: rincian?.id_rek_2,
                                                                                                id_rek_3: rincian?.id_rek_3,
                                                                                                id_rek_4: rincian?.id_rek_4,
                                                                                                id_rek_5: rincian?.id_rek_5,
                                                                                                id_rek_6: rincian?.id_rek_6,
                                                                                                target_kinerja_id: rincian?.target_kinerja_id,
                                                                                                keterangan_rincian: rincian?.keterangan_rincian,
                                                                                                title: rincian?.title,
                                                                                                pagu: rincian?.pagu,
                                                                                                realisasi_anggaran: rincian?.realisasi_anggaran,
                                                                                                realisasi_anggaran_bulan_ini: calculateRealisasiAnggaran,
                                                                                            };

                                                                                            updated[index]['rincian_belanja'][indexRincian]['keterangan_rincian'][indexKeterangan] = {
                                                                                                editable: keterangan?.editable,
                                                                                                id: keterangan?.id,
                                                                                                long: keterangan?.long,
                                                                                                type: keterangan?.type,
                                                                                                target_kinerja_id: keterangan?.target_kinerja_id,
                                                                                                title: keterangan?.title,
                                                                                                koefisien: keterangan?.koefisien,
                                                                                                koefisien_realisasi: keterangan?.koefisien_realisasi,
                                                                                                satuan_id: keterangan?.satuan_id,
                                                                                                satuan_name: keterangan?.satuan_name,
                                                                                                harga_satuan: keterangan?.harga_satuan,
                                                                                                ppn: keterangan?.ppn,
                                                                                                pagu: keterangan?.pagu,
                                                                                                is_realisasi_match: isRealisasiMatch,
                                                                                                realisasi_anggaran_keterangan: keterangan?.realisasi_anggaran_keterangan,
                                                                                                realisasi_anggaran_bulan_ini: value,
                                                                                                target_persentase_kinerja: keterangan?.target_persentase_kinerja,
                                                                                                persentase_kinerja: keterangan?.persentase_kinerja,
                                                                                            };

                                                                                            const Rekening6 = updated.find((item: any) => item.id == rincian.id_rek_6);
                                                                                            const Rekening6Index = updated.findIndex((item: any) => item.id == rincian.id_rek_6);
                                                                                            const RincianBelanjas = updated.filter((item: any) => item.type == 'target-kinerja' && item.parent_id == rincian.id_rek_6);
                                                                                            let RincianSumAnggaran = RincianBelanjas.filter((item: any) => item.type == 'target-kinerja').reduce((a: any, b: any) => a + parseFloat(b['realisasi_anggaran_bulan_ini'] || 0), 0);

                                                                                            updated[Rekening6Index] = {
                                                                                                editable: Rekening6?.editable,
                                                                                                long: Rekening6?.long,
                                                                                                type: Rekening6?.type,
                                                                                                rek: Rekening6?.rek,
                                                                                                id: Rekening6?.id,
                                                                                                parent_id: Rekening6?.parent_id,
                                                                                                uraian: Rekening6?.uraian,
                                                                                                fullcode: Rekening6?.fullcode,
                                                                                                pagu: Rekening6?.pagu,
                                                                                                rincian_belanja: Rekening6?.rincian_belanja,
                                                                                                realisasi_anggaran: Rekening6?.realisasi_anggaran,
                                                                                                realisasi_anggaran_bulan_ini: RincianSumAnggaran,
                                                                                            };

                                                                                            const Rekening5 = updated.find((item: any) => item.id == rincian.id_rek_5);
                                                                                            const Rekening5Index = updated.findIndex((item: any) => item.id == rincian.id_rek_5);
                                                                                            const updatedRekenings6 = updated.filter((item: any) => item.rek === 6 && item.parent_id == rincian.id_rek_5);
                                                                                            let SumAnggaranRekening5 = updatedRekenings6.reduce((a: any, b: any) => a + parseFloat(b['realisasi_anggaran_bulan_ini'] || 0), 0);

                                                                                            updated[Rekening5Index] = {
                                                                                                editable: Rekening5?.editable,
                                                                                                long: Rekening5?.long,
                                                                                                type: Rekening5?.type,
                                                                                                rek: Rekening5?.rek,
                                                                                                id: Rekening5?.id,
                                                                                                parent_id: Rekening5?.parent_id,
                                                                                                uraian: Rekening5?.uraian,
                                                                                                fullcode: Rekening5?.fullcode,
                                                                                                pagu: Rekening5?.pagu,
                                                                                                rincian_belanja: Rekening5?.rincian_belanja,
                                                                                                realisasi_anggaran: Rekening5?.realisasi_anggaran,
                                                                                                realisasi_anggaran_bulan_ini: SumAnggaranRekening5,
                                                                                            };

                                                                                            const Rekening4 = updated.find((item: any) => item.id == rincian.id_rek_4);
                                                                                            const Rekening4Index = updated.findIndex((item: any) => item.id == rincian.id_rek_4);
                                                                                            const updatedRekenings5 = updated.filter((item: any) => item.rek === 5 && item.parent_id == rincian.id_rek_4);
                                                                                            let SumAnggaranRekening4 = updatedRekenings5.reduce((a: any, b: any) => a + parseFloat(b['realisasi_anggaran_bulan_ini'] || 0), 0);

                                                                                            updated[Rekening4Index] = {
                                                                                                editable: Rekening4?.editable,
                                                                                                long: Rekening4?.long,
                                                                                                type: Rekening4?.type,
                                                                                                rek: Rekening4?.rek,
                                                                                                id: Rekening4?.id,
                                                                                                parent_id: Rekening4?.parent_id,
                                                                                                uraian: Rekening4?.uraian,
                                                                                                fullcode: Rekening4?.fullcode,
                                                                                                pagu: Rekening4?.pagu,
                                                                                                rincian_belanja: Rekening4?.rincian_belanja,
                                                                                                realisasi_anggaran: Rekening4?.realisasi_anggaran,
                                                                                                realisasi_anggaran_bulan_ini: SumAnggaranRekening4,
                                                                                            };

                                                                                            const Rekening3 = updated.find((item: any) => item.id == rincian.id_rek_3);
                                                                                            const Rekening3Index = updated.findIndex((item: any) => item.id == rincian.id_rek_3);
                                                                                            const updatedRekenings4 = updated.filter((item: any) => item.rek === 4 && item.parent_id == rincian.id_rek_3);
                                                                                            let SumAnggaranRekening3 = updatedRekenings4.reduce((a: any, b: any) => a + parseFloat(b['realisasi_anggaran_bulan_ini'] || 0), 0);

                                                                                            updated[Rekening3Index] = {
                                                                                                editable: Rekening3?.editable,
                                                                                                long: Rekening3?.long,
                                                                                                type: Rekening3?.type,
                                                                                                rek: Rekening3?.rek,
                                                                                                id: Rekening3?.id,
                                                                                                parent_id: Rekening3?.parent_id,
                                                                                                uraian: Rekening3?.uraian,
                                                                                                fullcode: Rekening3?.fullcode,
                                                                                                pagu: Rekening3?.pagu,
                                                                                                rincian_belanja: Rekening3?.rincian_belanja,
                                                                                                realisasi_anggaran: Rekening3?.realisasi_anggaran,
                                                                                                realisasi_anggaran_bulan_ini: SumAnggaranRekening3,
                                                                                            };

                                                                                            const Rekening2 = updated.find((item: any) => item.id == rincian.id_rek_2);
                                                                                            const Rekening2Index = updated.findIndex((item: any) => item.id == rincian.id_rek_2);
                                                                                            const updatedRekenings3 = updated.filter((item: any) => item.rek === 3 && item.parent_id == rincian.id_rek_2);
                                                                                            let SumAnggaranRekening2 = updatedRekenings3.reduce((a: any, b: any) => a + parseFloat(b['realisasi_anggaran_bulan_ini'] || 0), 0);

                                                                                            updated[Rekening2Index] = {
                                                                                                editable: Rekening2?.editable,
                                                                                                long: Rekening2?.long,
                                                                                                type: Rekening2?.type,
                                                                                                rek: Rekening2?.rek,
                                                                                                id: Rekening2?.id,
                                                                                                parent_id: Rekening2?.parent_id,
                                                                                                uraian: Rekening2?.uraian,
                                                                                                fullcode: Rekening2?.fullcode,
                                                                                                pagu: Rekening2?.pagu,
                                                                                                rincian_belanja: Rekening2?.rincian_belanja,
                                                                                                realisasi_anggaran: Rekening2?.realisasi_anggaran,
                                                                                                realisasi_anggaran_bulan_ini: SumAnggaranRekening2,
                                                                                            };

                                                                                            const Rekening1 = updated.find((item: any) => item.id == rincian.id_rek_1);
                                                                                            const Rekening1Index = updated.findIndex((item: any) => item.id == rincian.id_rek_1);
                                                                                            const updatedRekenings2 = updated.filter((item: any) => item.rek === 2 && item.parent_id == rincian.id_rek_1);
                                                                                            let SumAnggaranRekening1 = updatedRekenings2.reduce((a: any, b: any) => a + parseFloat(b['realisasi_anggaran_bulan_ini'] || 0), 0);

                                                                                            updated[Rekening1Index] = {
                                                                                                editable: Rekening1?.editable,
                                                                                                long: Rekening1?.long,
                                                                                                type: Rekening1?.type,
                                                                                                rek: Rekening1?.rek,
                                                                                                id: Rekening1?.id,
                                                                                                parent_id: Rekening1?.parent_id,
                                                                                                uraian: Rekening1?.uraian,
                                                                                                fullcode: Rekening1?.fullcode,
                                                                                                pagu: Rekening1?.pagu,
                                                                                                rincian_belanja: Rekening1?.rincian_belanja,
                                                                                                realisasi_anggaran: Rekening1?.realisasi_anggaran,
                                                                                                realisasi_anggaran_bulan_ini: SumAnggaranRekening1,
                                                                                            };

                                                                                            // updateTotalRealisasi(updated);
                                                                                            return updated;
                                                                                        });
                                                                                    }}
                                                                                    onBlur={() => {
                                                                                        updateTotalRealisasi(datas);
                                                                                    }}
                                                                                />
                                                                            </div>


                                                                        </td>
                                                                    </tr>
                                                                </>
                                                            )
                                                        })}
                                                        {/* Keterangan Rincian End */}
                                                        <tr>
                                                            <td colSpan={100} className='!p-0 !pt-0.5 bg-slate-300 dark:bg-slate-500'>

                                                            </td>
                                                        </tr>
                                                    </>
                                                )
                                            })}
                                        </>
                                    )}
                                </>
                            ))}
                        </>
                    )}

                </tbody>
            </table>
        </div>
    );
}

export default RincianBelanja;
