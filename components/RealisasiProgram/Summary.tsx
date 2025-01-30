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
import InputRupiah from "../InputRupiah";


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


const Summary = (
    { params, updateData, isUnsave, }:
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

    useEffect(() => {
        if (unsaveStatus) {
            updateTotalRealisasi(datas);
        }
    }, [datas]);

    return (
        <div className="flex flex-col xl:flex-col gap-4 mb-12 sm:mb-0 h-auto">
            <div className="table-responsive w-full">
                <table>
                    <tbody>

                        <tr>
                            <td className='!w-[150px]'>
                                <div className='!text-end text-xs'>
                                    Urusan Pemerintahan
                                </div>
                            </td>
                            <td>
                                <div className="text-xs font-semibold">
                                    {datas?.urusan_code} - {datas?.urusan_name}
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <div className='!text-end text-xs'>
                                    Bidang Urusan
                                </div>
                            </td>
                            <td>
                                <div className="text-xs font-semibold">
                                    {datas?.bidang_urusan_code} - {datas?.bidang_urusan_name}
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <div className='!text-end text-xs'>
                                    Perangkat Daerah
                                </div>
                            </td>
                            <td>
                                <div className="text-xs font-semibold">
                                    {datas?.instance_code} - {datas?.instance_name}
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <div className='!text-end text-xs'>
                                    Program
                                </div>
                            </td>
                            <td>
                                <div className="text-xs font-semibold">
                                    {datas?.program_code} - {datas?.program_name}
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <div className='!text-end text-xs'>
                                    Kegiatan
                                </div>
                            </td>
                            <td>
                                <div className="text-xs font-semibold">
                                    {datas?.kegiatan_code} - {datas?.kegiatan_name}
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <div className='!text-end text-xs'>
                                    Sub Kegiatan
                                </div>
                            </td>
                            <td>
                                <div className="text-xs font-semibold">
                                    {datas?.sub_kegiatan_code} - {datas?.sub_kegiatan_name}
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <div className='!text-end text-xs'>
                                    Sumber Dana
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-wrap items-center gap-1 mr-3 w-[300px]">
                                    {subKegiatan?.tag_sumber_dana?.length > 0 && (
                                        <>
                                            {subKegiatan?.tag_sumber_dana?.map((tag: any, index: any) => (
                                                <div className="text-xs border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white dark:border-blue-700 dark:hover:bg-blue-700 dark:text-blue-300 dark:hover:text-white px-2 py-1 rounded-md cursor-pointer whitespace-nowrap">
                                                    <div className='font-semibold'>{tag?.tag_name}</div>
                                                    <div className='text-center'>
                                                        Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(tag?.nominal)}
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <div className='!text-end text-xs'>
                                    Bulan dan Tahun
                                </div>
                            </td>
                            <td>
                                <div className="text-xs font-semibold">
                                    {new Date(year, month - 1).toLocaleString('id-ID',
                                        {
                                            month: 'long',
                                            year: 'numeric'
                                        }
                                    )}
                                </div>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>

            <div className="table-responsive w-full">
                <table>
                    <thead>
                        <tr>
                            <th colSpan={100}>
                                <div className="text-center">
                                    Indikator Kinerja Sub Kegiatan
                                </div>
                            </th>
                        </tr>
                        <tr>
                            <th className='!text-center !text-xs'>
                                Indikator
                            </th>
                            <th className='!text-center !text-xs !w-[150px]'>
                                Target (Renstra)
                            </th>
                            <th className='!text-center !text-xs !w-[150px]'>
                                Target (Renja)
                            </th>
                            <th className='!text-center !text-xs !w-[150px]'>
                                Target (APBD)
                            </th>
                            <th className='!text-center !text-xs !w-[150px]'>
                                Realisasi
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {datas?.indicators?.length > 0 && (
                            <>
                                {datas?.indicators?.map((indicator: any, index: any) => (
                                    <tr key={index}>
                                        <td>
                                            <div className='text-xs'>
                                                {indicator?.name}
                                            </div>
                                        </td>
                                        <td>
                                            <div className='text-xs'>
                                                <div className="whitespace-nowrap">
                                                    {indicator?.type === 'anggaran' && (
                                                        <>
                                                            Rp. {new Intl.NumberFormat('id-ID', {
                                                                style: 'decimal',
                                                                minimumFractionDigits: 0,
                                                            }).format(indicator?.target_renstra)}
                                                        </>
                                                    )}
                                                    {indicator?.type === 'kinerja' && (
                                                        <>
                                                            {new Intl.NumberFormat('id-ID', {
                                                                style: 'decimal',
                                                                minimumFractionDigits: 0,
                                                            }).format(indicator?.target_renstra ?? 0)} {indicator?.satuan_name_renstra}
                                                        </>
                                                    )}
                                                    {indicator?.type === 'persentase-kinerja' && (
                                                        <>
                                                            {indicator?.target_renstra} {indicator?.satuan_name_renstra}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className='text-xs'>
                                                <div className="whitespace-nowrap">
                                                    {indicator?.type === 'anggaran' && (
                                                        <>
                                                            Rp. {new Intl.NumberFormat('id-ID', {
                                                                style: 'decimal',
                                                                minimumFractionDigits: 0,
                                                            }).format(indicator?.target_renja)}
                                                        </>
                                                    )}
                                                    {indicator?.type === 'kinerja' && (
                                                        <>
                                                            {new Intl.NumberFormat('id-ID', {
                                                                style: 'decimal',
                                                                minimumFractionDigits: 0,
                                                            }).format(indicator?.target_renja ?? 0)} {indicator?.satuan_name_renja}
                                                        </>
                                                    )}
                                                    {indicator?.type === 'persentase-kinerja' && (
                                                        <>
                                                            {indicator?.target_renja} {indicator?.satuan_name_renja}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className='text-xs'>
                                                <div className="whitespace-nowrap">
                                                    {indicator?.type === 'anggaran' && (
                                                        <>
                                                            Rp. {new Intl.NumberFormat('id-ID', {
                                                                style: 'decimal',
                                                                minimumFractionDigits: 0,
                                                            }).format(indicator?.target)}
                                                        </>
                                                    )}
                                                    {indicator?.type === 'kinerja' && (
                                                        <>
                                                            {indicator?.target && (
                                                                <>
                                                                    {new Intl.NumberFormat('id-ID', {
                                                                        style: 'decimal',
                                                                        minimumFractionDigits: 0,
                                                                    }).format(indicator?.target ?? 0)} {indicator?.satuan_name}
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                    {indicator?.type === 'persentase-kinerja' && (
                                                        <>
                                                            {indicator?.target} {indicator?.satuan_name}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className='text-xs'>
                                                {index === 0 && (
                                                    <InputRupiah
                                                        readOnly={true}
                                                        dataValue={indicator?.realisasi}
                                                        onChange={(e: any) => {
                                                            setUnsaveStatus(true);
                                                            setDatas((prev: any) => {
                                                                const updated = { ...prev };
                                                                updated.indicators[index].realisasi = e;
                                                                return updated;
                                                            });
                                                        }}
                                                    />
                                                )}
                                                {index > 0 && (
                                                    <input
                                                        value={indicator?.realisasi}
                                                        disabled={(subKegiatan?.status === 'verified' || subKegiatan?.status_target !== 'verified') ? true : false}
                                                        onChange={(e) => {
                                                            setUnsaveStatus(true);
                                                            setDatas((prev: any) => {
                                                                const updated = { ...prev };
                                                                updated['indicators'][index] = {
                                                                    id: indicator?.id,
                                                                    name: indicator?.name,
                                                                    type: indicator?.type,
                                                                    target: indicator?.target,
                                                                    realisasi: e.target.value,
                                                                    satuan_id: indicator?.satuan_id,
                                                                    satuan_name: indicator?.satuan_name,
                                                                    target_renstra: indicator?.target_renstra,
                                                                    satuan_id_renstra: indicator?.satuan_id_renstra,
                                                                    satuan_name_renstra: indicator?.satuan_name_renstra,
                                                                    target_renja: indicator?.target_renja,
                                                                    satuan_id_renja: indicator?.satuan_id_renja,
                                                                    satuan_name_renja: indicator?.satuan_name_renja,
                                                                };
                                                                return updated;
                                                            });
                                                        }}
                                                        className='form-input px-1 py-0.5 text-xs font-normal disabled:bg-slate-200'
                                                    />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Summary;
