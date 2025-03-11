import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useEffect, useState } from 'react';
import { downloadReportNeraca, getReportNeraca, saveSingleNeraca } from '@/apis/Accountancy/Report';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons';
import { faSave } from '@fortawesome/free-regular-svg-icons';
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
const Neraca = (data: any) => {
    const [isMounted, setIsMounted] = useState(false);
    const paramData = data.data;
    const [periode, setPeriode] = useState(paramData[0]);
    const [year, setYear] = useState(paramData[1]);
    const [instance, setInstance] = useState<any>(paramData[2]);
    const [level, setLevel] = useState(paramData[3]);
    const [years, setYears] = useState(paramData[4]);
    const [instances, setInstances] = useState(paramData[5]);
    const [levels, setLevels] = useState(paramData[6]);
    const [rawDatas, setRawDatas] = useState<any>([]);
    const [datas, setDatas] = useState<any>([]);
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [CurrentUser, setCurrentUser] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

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
        if (isMounted && periode?.id && year && level && (instance || instance === 0)) {
            setDatas([]);
            setIsLoading(true);
            getReportNeraca(instance, periode?.id, year, level).then((res) => {
                if (res.status === 'error') {
                    showAlert('error', 'Terjadi kesalahan');
                }
                else if (res.status === 'success') {
                    setRawDatas(res.data);
                    if (level === 6) {
                        setDatas(res.data);
                    } else if (level === 5) {
                        const dt = res.data.filter((data: any) => data.code_6 === null);
                        setDatas(dt);
                    } else if (level === 4) {
                        const dt = res.data.filter((data: any) => data.code_5 === null);
                        setDatas(dt);
                    } else if (level === 3) {
                        const dt = res.data.filter((data: any) => data.code_4 === null);
                        setDatas(dt);
                    } else if (level === 2) {
                        const dt = res.data.filter((data: any) => data.code_3 === null);
                        setDatas(dt);
                    } else if (level === 1) {
                        const dt = res.data.filter((data: any) => data.code_2 === null);
                        setDatas(dt);
                    }
                }
                setIsLoading(false);
            });
        }
    }, [isMounted, year, instance]);

    useEffect(() => {
        if (isMounted && periode?.id && year && level && (instance || instance === 0)) {
            if (rawDatas.length > 0) {
                if (level === 6) {
                    setDatas(rawDatas);
                } else if (level === 5) {
                    const dt = rawDatas.filter((data: any) => data.code_6 === null);
                    setDatas(dt);
                } else if (level === 4) {
                    const dt = rawDatas.filter((data: any) => data.code_5 === null);
                    setDatas(dt);
                } else if (level === 3) {
                    const dt = rawDatas.filter((data: any) => data.code_4 === null);
                    setDatas(dt);
                } else if (level === 2) {
                    const dt = rawDatas.filter((data: any) => data.code_3 === null);
                    setDatas(dt);
                } else if (level === 1) {
                    const dt = rawDatas.filter((data: any) => data.code_2 === null);
                    setDatas(dt);
                }
            }
        }
    }, [level]);

    const updatedData = (data: any, index: number) => {
        setDatas((prev: any) => {
            const updated = [...prev];
            const currentData = updated[index];

            // if (currentData.code_6 !== null) {
            //     const parentIndex = updated.findIndex((item: any) => (currentData.code_1 === item.code_1) && (currentData.code_2 === item.code_2) && (currentData.code_3 === item.code_3) && (currentData.code_4 === item.code_4) && (currentData.code_5 === item.code_5) && (item.code_6 === null));
            //     updated[parentIndex].saldo_akhir = updated.filter((item: any) => (currentData.code_1 === item.code_1) && (currentData.code_2 === item.code_2) && (currentData.code_3 === item.code_3) && (currentData.code_4 === item.code_4) && (currentData.code_5 === item.code_5) && (item.code_6 !== null)).reduce((acc: any, item: any) => acc + parseFloat(item.saldo_akhir), 0);
            // }
            // if (currentData.code_5 !== null) {
            //     const parentIndex = updated.findIndex((item: any) => (currentData.code_1 === item.code_1) && (currentData.code_2 === item.code_2) && (currentData.code_3 === item.code_3) && (currentData.code_4 === item.code_4) && (item.code_5 === null));
            //     updated[parentIndex].saldo_akhir = updated.filter((item: any) => (currentData.code_1 === item.code_1) && (currentData.code_2 === item.code_2) && (currentData.code_3 === item.code_3) && (currentData.code_4 === item.code_4) && (item.code_5 !== null) && (item.code_6 !== null)).reduce((acc: any, item: any) => acc + parseFloat(item.saldo_akhir), 0);
            // }
            // if (currentData.code_4 !== null) {
            //     const parentIndex = updated.findIndex((item: any) => (currentData.code_1 === item.code_1) && (currentData.code_2 === item.code_2) && (currentData.code_3 === item.code_3) && (item.code_4 === null));
            //     updated[parentIndex].saldo_akhir = updated.filter((item: any) => (currentData.code_1 === item.code_1) && (currentData.code_2 === item.code_2) && (currentData.code_3 === item.code_3) && (item.code_4 !== null) && (item.code_5 !== null) && (item.code_6 !== null)).reduce((acc: any, item: any) => acc + parseFloat(item.saldo_akhir), 0);
            // }
            if (currentData.code_3 !== null) {
                const parentIndex = updated.findIndex((item: any) => (currentData.code_1 === item.code_1) && (currentData.code_2 === item.code_2) && (item.code_3 === null));
                // alert(parentIndex);
                updated[parentIndex].saldo_akhir = updated.filter((item: any) => (currentData.code_1 === item.code_1) && (currentData.code_2 === item.code_2) && (item.code_3 !== null) && (item.fullcode.length == 6)).reduce((acc: any, item: any) => acc + parseFloat(item.saldo_akhir), 0);
            }
            if (currentData.code_2 !== null) {
                const parentIndex = updated.findIndex((item: any) => (currentData.code_1 === item.code_1) && (item.code_2 === null));
                updated[parentIndex].saldo_akhir = updated.filter((item: any) => (currentData.code_1 === item.code_1) && (item.code_2 !== null) && (item.fullcode.length == 3)).reduce((acc: any, item: any) => acc + parseFloat(item.saldo_akhir), 0);
            }

            return updated;
        })
        setIsUnsaved(true);
    }

    return (
        <>
            <div className="">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                        Laporan Neraca
                    </h3>
                    <div className="flex items-center gap-2">
                        {((instance || instance === 0) && datas?.length > 0) && (
                            <button type="button" className="btn btn-outline-primary"
                                disabled={isDownloading}
                                onClick={() => {
                                    if (isDownloading == false) {
                                        Swal.fire({
                                            title: 'Unduh Laporan Neraca',
                                            text: 'Apakah Anda yakin ingin mengunduh laporan neraca ini?',
                                            icon: 'question',
                                            showCancelButton: true,
                                            confirmButtonColor: '#3085d6',
                                            cancelButtonColor: '#d33',
                                            confirmButtonText: 'Ya, unduh!',
                                            cancelButtonText: 'Batal',
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                if (datas.length > 0) {
                                                    setIsDownloading(true);
                                                    downloadReportNeraca(datas, instance, periode?.id, year, level).then((res) => {
                                                        if (res.status === 'error') {
                                                            showAlert('error', 'Terjadi kesalahan');
                                                        }
                                                        else if (res.status === 'success') {
                                                            const url = window.URL.createObjectURL(new Blob([res.data]));
                                                            const link = document.createElement('a');
                                                            link.href = url;
                                                            link.setAttribute('download', 'true');
                                                            link.setAttribute('href', res.data);
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            // console.log(res.data);
                                                        }
                                                        setIsDownloading(false);
                                                    });
                                                } else {
                                                    showAlert('error', 'Data belum tersedia');
                                                }
                                            }
                                        });
                                    }
                                }}>
                                <FontAwesomeIcon icon={faCloudDownloadAlt} className='w-4 h-4' />
                                <span className="ltr:ml-2 rtl:mr-2">
                                    {isDownloading == false ? (
                                        <>
                                            Unduh Laporan Neraca
                                        </>
                                    ) : (
                                        <>
                                            Memproses...
                                        </>
                                    )}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-4">
                    <div className="">
                        <label htmlFor="instance">
                            Perangkat Daerah
                        </label>
                        <Select placeholder="Pilih Perangkat Daerah"
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

                    <div className="">
                        <label htmlFor="level">
                            Level
                        </label>
                        <Select
                            className=""
                            id="level"
                            options={levels}
                            value={levels?.find((option: any) => option.value === level)}
                            onChange={(e: any) => {
                                setLevel(e.value)
                            }}
                            isSearchable={false}
                            isClearable={false}
                            isDisabled={isLoading || (levels?.length === 0) || false}
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
                                <th className='text-center w-[150px]'>
                                    Kode Rekening
                                </th>
                                <th className='text-start'>
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
                            {datas?.length === 0 && (
                                <tr>
                                    <td colSpan={4} className='text-center'>
                                        Sedang memuat data...
                                    </td>
                                </tr>
                            )}

                            {datas?.length > 0 && (
                                <>
                                    {datas.map((data: any, index: number) => (
                                        <tr key={index}>
                                            <td className='text-start'>
                                                <div className="font-semibold">
                                                    {data.fullcode}
                                                </div>
                                            </td>
                                            <td className='text-start'>
                                                <div className="font-semibold">
                                                    {data.name}
                                                </div>
                                            </td>
                                            <td className='text-center'>
                                                <InputRupiahSingleSave
                                                    readOnly={data?.fullcode?.length === 6 ? !instance ? true : false : true}
                                                    dataValue={data.saldo_akhir}
                                                    onChange={(value: any) => {
                                                        setDatas((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['saldo_akhir'] = isNaN(value) ? 0 : value;
                                                            updatedData(updated, index);
                                                            return updated;
                                                        });
                                                    }}
                                                    onSave={() => {
                                                        // showAlert('info', 'Fitur ini belum tersedia!');
                                                        if (isUnsaved) {
                                                            saveSingleNeraca(data).then((res) => {
                                                                if (res.status === 'error') {
                                                                    showAlert('error', 'Terjadi kesalahan');
                                                                }
                                                                else if (res.status === 'success') {
                                                                    showAlert('success', 'Data berhasil disimpan');
                                                                    setIsUnsaved(false);
                                                                }
                                                            });
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td className='text-center'>
                                                <InputRupiahSingleSave
                                                    readOnly={true}
                                                    dataValue={data.saldo_awal}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            )}
                        </tbody>
                    </table>
                )}
                {(!instance && instance !== 0) && (
                    <div className="flex items-center justify-center h-[calc(100vh-350px)]">
                        <div className="text-center">
                            <div className="text-3xl font-semibold">
                                Laporan Kabupaten Telah Tersedia
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

export default Neraca;
