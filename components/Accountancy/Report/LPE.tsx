import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useEffect, useState } from 'react';
import { downloadReportLaporanLPE, getReportLPE } from '@/apis/Accountancy/Report';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons';
import InputRupiahSingleSave from '@/components/InputRupiahSingleSave';

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
const LPE = (data: any) => {
    const [isMounted, setIsMounted] = useState(false);
    const paramData = data.data;
    const [periode, setPeriode] = useState(paramData[0]);
    const [year, setYear] = useState(paramData[1]);
    const [instance, setInstance] = useState(paramData[2]);
    const [level, setLevel] = useState(paramData[3]);
    const [years, setYears] = useState(paramData[4]);
    const [instances, setInstances] = useState(paramData[5]);
    const [levels, setLevels] = useState(paramData[6]);
    const [datas, setDatas] = useState<any>([]);
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const [CurrentUser, setCurrentUser] = useState<any>([]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

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
        if (isMounted && periode?.id && year && (instance || instance === 0)) {
            setDatas([]);
            setIsLoading(true);
            getReportLPE(instance, periode?.id, year, level).then((res) => {
                if (res.status === 'error') {
                    showAlert('error', 'Terjadi kesalahan');
                }
                else if (res.status === 'success') {
                    setDatas(res.data);
                }
                setIsLoading(false);
            });
        }
    }, [isMounted, year, instance, level]);

    const updatedData = (data: any, index: number) => {
        setDatas((prev: any) => {
            const updated = [...prev];
            return updated;
        })
        setIsUnsaved(true);
    }

    return (
        <>
            <div className="">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                        Laporan LPE
                    </h3>
                    <div className="">
                        {((instance || instance === 0) && datas?.length > 0) && (
                            <button type="button" className="btn btn-outline-primary"
                                onClick={() => {
                                    Swal.fire({
                                        title: 'Unduh Laporan LPE',
                                        text: 'Apakah Anda yakin ingin mengunduh laporan LPE ini?',
                                        icon: 'question',
                                        showCancelButton: true,
                                        confirmButtonColor: '#3085d6',
                                        cancelButtonColor: '#d33',
                                        confirmButtonText: 'Ya, unduh!',
                                        cancelButtonText: 'Batal',
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            showAlert('info', 'Fitur belum tersedia');
                                            Swal.fire({
                                                'title': 'Fitur belum tersedia',
                                                'text': 'Fitur ini akan segera hadir',
                                                'icon': 'info',
                                                'confirmButtonText': 'Tutup',
                                                'confirmButtonColor': '#3085d6',
                                                'showCancelButton': false,
                                            });
                                            // if (datas.length > 0) {
                                            //     downloadReportLaporanLPE(datas, instance, periode?.id, year).then((res) => {
                                            //         if (res.status === 'error') {
                                            //             showAlert('error', 'Terjadi kesalahan');
                                            //         }
                                            //         else if (res.status === 'success') {
                                            //             const url = window.URL.createObjectURL(new Blob([res.data]));
                                            //             const link = document.createElement('a');
                                            //             link.href = url;
                                            //             link.setAttribute('download', 'true');
                                            //             link.setAttribute('href', res.data);
                                            //             document.body.appendChild(link);
                                            //             link.click();
                                            //             // console.log(res.data);
                                            //         }
                                            //     });
                                            // } else {
                                            //     showAlert('error', 'Data belum tersedia');
                                            // }
                                        }
                                    });
                                }}>
                                <FontAwesomeIcon icon={faCloudDownloadAlt} className='w-4 h-4' />
                                <span className="ltr:ml-2 rtl:mr-2">
                                    Unduh Laporan LPE
                                </span>
                            </button>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
                    <div className="">
                        <label htmlFor="instance">
                            Perangkat Daerah
                        </label>
                        <Select placeholder="Kabupaten Ogan Ilir"
                            id='instance'
                            className=''
                            onChange={(e: any) => {
                                if ([9].includes(CurrentUser?.role_id)) {
                                    showAlert('error', 'Anda tidak memiliki akses ke Perangkat Daerah ini');
                                } else {
                                    setInstance(e?.value);
                                }
                            }}
                            isLoading={instances?.length === 0}
                            isClearable={true}
                            isDisabled={isLoading || [9].includes(CurrentUser?.role_id) ? true : false}
                            value={
                                instances?.map((data: any, index: number) => {
                                    if (data.id == instance) {
                                        return {
                                            value: data.id,
                                            label: data.name,
                                        }
                                    }
                                })
                            }
                            options={
                                instances?.map((data: any, index: number) => {
                                    return {
                                        value: data.id,
                                        label: data.name,
                                    }
                                })
                            } />
                        <div className='text-danger text-xs error-validation' id="error-instance"></div>
                    </div>

                    <div className="">
                        <label htmlFor="tahun">
                            Tahun
                        </label>
                        <Select
                            className=""
                            id="tahun"
                            options={years}
                            value={years?.find((option: any) => option.value === year)}
                            onChange={(e: any) => {
                                setYear(e.value)
                            }}
                            isSearchable={false}
                            isClearable={false}
                            isDisabled={isLoading || (years?.length === 0) || false}
                        />
                        <div className='text-danger text-xs error-validation' id="error-year"></div>
                    </div>

                </div>
                <div className="my-4 h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
            </div>

            <div className="table-responsive h-[calc(100vh-350px)]">
                {(instance || instance === 0) && (
                    <table className="table-striped">
                        <thead>
                            <tr className='!bg-slate-900 !text-white sticky top-0'>
                                <th className='text-center min-w-[300px]'>
                                    Uraian
                                </th>
                                <th className='text-center w-[250px]'>
                                    {year}
                                </th>
                                <th className='text-center w-[250px]'>
                                    {year - 1}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {datas?.map((data: any, index: number) => (
                                <tr key={index} className='!bg-white dark:!bg-[#1a202c]'>
                                    <td className='!text-left'>
                                        <div className={`select-none cursor-pointer ${data.level == 2 ? 'pl-10' : 'font-semibold'}`}>
                                            {data.uraian}
                                        </div>
                                    </td>
                                    <td className='!text-right'>
                                        <Tippy content={data.notes ?? data.uraian}
                                            placement='top-end'
                                            arrow={false}>
                                            <div className="cursor-pointer">
                                                <InputRupiahSingleSave
                                                    readOnly={true}
                                                    dataValue={data.saldo_akhir}
                                                    onChange={(e: any) => {
                                                        const value = e.target.value;
                                                        updatedData({ ...data, saldo_akhir: value }, index);
                                                    }}
                                                />
                                            </div>
                                        </Tippy>
                                    </td>
                                    <td className='!text-right'>
                                        <InputRupiahSingleSave
                                            readOnly={true}
                                            dataValue={data.saldo_awal}
                                            onChange={(e: any) => {
                                                const value = e.target.value;
                                                updatedData({ ...data, saldo_awal: value }, index);
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {(!instance && instance !== 0) && (
                    <div className="flex items-center justify-center h-[calc(100vh-350px)]">
                        <div className="text-center">
                            <div className="text-3xl font-semibold">
                                Laporan Kabupaten Belum Tersedia
                            </div>
                            <div className="text-lg font-semibold">
                                Silahkan pilih Perangkat Daerah terlebih dahulu
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default LPE;
