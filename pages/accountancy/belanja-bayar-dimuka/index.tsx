import { useEffect, useState, Fragment, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tab } from '@headlessui/react';
import { IRootState } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/themeConfigSlice';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Dropdown from '@/components/Dropdown';
import Swal from 'sweetalert2';
import Link from 'next/link';
import Select from 'react-select';

import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';

import LoadingSicaram from '@/components/LoadingSicaram';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSave, faSpinner, faThList } from '@fortawesome/free-solid-svg-icons';
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import { GlobalEndPoint } from '@/apis/serverConfig';
import PenyesuaianBebanDanBarjas from '@/components/Accountancy/PenyesuaianAsetBeban/PenyesuaianBebanDanBarjas';
import ModalKeBeban from '@/components/Accountancy/PenyesuaianAsetBeban/ModalKeBeban';
import BarjasKeAset from '@/components/Accountancy/PenyesuaianAsetBeban/BarjasKeAset';
import PenyesuaianAset from '@/components/Accountancy/PenyesuaianAsetBeban/PenyesuaianAset';
import Atribusi from '@/components/Accountancy/PenyesuaianAsetBeban/Atribusi';
import { deleteData, getData, storeData } from '@/apis/Accountancy/BelanjaBayarDimuka';
import IconTrash from '@/components/Icon/IconTrash';

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
const showAlertCenter = async (icon: any, text: any) => {
    const toast = Swal.mixin({
        toast: false,
        position: 'center',
        showConfirmButton: true,
        confirmButtonText: 'Tutup',
        showCancelButton: false,
    });
    toast.fire({
        icon: icon,
        title: text,
        padding: '10px 20px',
    });
};


const Page = () => {

    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        dispatch(setPageTitle('Belanja Bayar Dimuka'));
    });

    const ref = useRef<any>(null);

    const [isMounted, setIsMounted] = useState(false);
    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null)
    const [years, setYears] = useState<any>([])

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [CurrentUser, setCurrentUser] = useState<any>([]);
    const [CurrentToken, setCurrentToken] = useState<any>(null);
    useEffect(() => {
        if (document.cookie) {
            let user = document.cookie.split(';').find((row) => row.trim().startsWith('user='))?.split('=')[1];
            user = user ? JSON.parse(user) : null;
            setCurrentUser(user);

            let token = document.cookie.split(';').find((row) => row.trim().startsWith('token='))?.split('=')[1];
            setCurrentToken(token);
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

    useEffect(() => {
        if (isMounted) {
            setYears([]);
            if (periode?.id) {
                if (year >= periode?.start_year && year <= periode?.end_year) {
                    for (let i = periode?.start_year; i <= periode?.end_year; i++) {
                        setYears((years: any) => [
                            ...years,
                            {
                                label: i,
                                value: i,
                            },
                        ]);
                    }
                }
            }
        }
    }, [isMounted, year, periode?.id])


    const [instance, setInstance] = useState<any>((router.query.instance ?? null) ?? CurrentUser?.instance_id);
    const [instances, setInstances] = useState<any>([]);
    const [arrKodeRekening, setArrKodeRekening] = useState<any>([])

    useEffect(() => {
        if ([9].includes(CurrentUser?.role_id)) {
            setInstance((router.query.instance ?? null) ?? CurrentUser?.instance_id);
        }
    }, [CurrentUser]);

    useEffect(() => {
        setInstance((router.query.instance ?? null) ?? CurrentUser?.instance_id);
    }, [CurrentUser, router.query.instance]);

    useEffect(() => {
        if (isMounted && !instance && instances?.length === 0) {
            GlobalEndPoint('instances').then((res: any) => {
                if (res.status === 'success') {
                    setInstances(res.data);
                }
            });
        }
    }, [isMounted]);

    useEffect(() => {
        if (isMounted && arrKodeRekening?.length === 0) {
            GlobalEndPoint('kode_rekening', ['where|code_1|=|5', 'where|code_6|!=|null']).then((res: any) => {
                if (res.status === 'success') {
                    setArrKodeRekening(res.data);
                }
            });
        }
    }, [isMounted]);

    const [dataInput, setDataInput] = useState<any>([]);
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const _getData = () => {
        if (periode?.id) {
            getData(instance, periode?.id, year).then((res: any) => {
                if (res.status === 'success') {
                    if (res.data.length > 0) {
                        setDataInput(res.data);
                    } else {
                        setDataInput([
                            {
                                id: '',
                                instance_id: instance ?? '',

                                kode_rekening_id: '',
                                uraian: '',
                                nomor_perjanjian: '',
                                tanggal_perjanjian: '',
                                rekanan: '',
                                jangka_waktu: '',

                                kontrak_date_start: '',
                                kontrak_date_end: '',
                                kontrak_value: 0,

                                sudah_jatuh_tempo: 0,
                                belum_jatuh_tempo: 0,
                            }
                        ])
                    }
                }
            });
        }
    }

    useEffect(() => {
        if (isMounted && periode?.id && year) {
            if ([9].includes(CurrentUser?.role_id)) {
                setInstance(CurrentUser?.instance_id ?? '');
            }
            _getData();
        }
    }, [isMounted, instance, periode?.id, year])

    const [totalData, setTotalData] = useState<any>({
        kontrak_value: '',
        sudah_jatuh_tempo: '',
        belum_jatuh_tempo: '',
    });

    const addDataInput = () => {
        const newData = {
            id: '',
            instance_id: instance ?? '',

            kode_rekening_id: '',
            uraian: '',
            nomor_perjanjian: '',
            tanggal_perjanjian: '',
            rekanan: '',
            jangka_waktu: '',

            kontrak_date_start: '',
            kontrak_date_end: '',
            kontrak_value: 0,

            sudah_jatuh_tempo: 0,
            belum_jatuh_tempo: 0,
        }
        setDataInput((prevData: any) => [...prevData, newData]);
        setIsUnsaved(true);
    }

    useEffect(() => {
        if (isMounted && dataInput.length > 0) {
            setTotalData((prev: any) => {
                const updated = { ...prev };
                updated['kontrak_value'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['kontrak_value']), 0);
                updated['sudah_jatuh_tempo'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['sudah_jatuh_tempo']), 0);
                updated['belum_jatuh_tempo'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['belum_jatuh_tempo']), 0);
                return updated;
            })
        }
    }, [isMounted, dataInput])

    const save = () => {
        setIsSaving(true);
        storeData(dataInput, periode?.id, year).then((res: any) => {
            if (res.status == 'success') {
                // showAlert('success', 'Data berhasil disimpan');
                setIsUnsaved(false);
                setIsSaving(false);
                showAlertCenter('success', 'Data berhasil disimpan');
            } else {
                showAlert('error', 'Data gagal disimpan');
                setIsSaving(false);
            }
            _getData();
        });
    }

    const _deleteData = (id: any) => {
        deleteData(id).then((res: any) => {
            if (res.status == 'success') {
                _getData();
                showAlert('success', 'Data berhasil dihapus');
            } else {
                showAlert('error', 'Data gagal dihapus');
            }
        });
    }
    return (
        <>
            <div className="">
                <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5">
                    <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                        Belanja Bayar Dimuka
                        <br />
                        {instances?.find((i: any) => i.id == instance)?.name ?? 'Kabupaten Ogan Ilir'}
                    </h2>

                    <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">

                        <Link href={`/accountancy`}
                            className="btn btn-secondary whitespace-nowrap text-xs">
                            <IconArrowBackward className="w-4 h-4" />
                            <span className="ltr:ml-2 rtl:mr-2">
                                Kembali
                            </span>
                        </Link>
                    </div>
                </div>


                <div className="panel">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="text-lg font-semibold underline">
                            Belanja Bayar Dimuka
                        </div>
                        <div className="flex items-center gap-4">
                            <Select placeholder="Kabupaten Ogan Ilir"
                                className='min-w-[300px]'
                                onChange={(e: any) => {
                                    if ([9].includes(CurrentUser?.role_id)) {
                                        showAlert('error', 'Anda tidak memiliki akses ke Perangkat Daerah ini');
                                    } else {
                                        setInstance(e?.value);
                                    }
                                }}
                                isLoading={instances?.length === 0}
                                isClearable={true}
                                isDisabled={[9].includes(CurrentUser?.role_id) ? true : (isSaving == true)}
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

                            <Select
                                className="w-[200px] z-[2]"
                                options={years}
                                value={years?.find((option: any) => option.value === year)}
                                onChange={(e: any) => {
                                    setYear(e.value)
                                }}
                                isSearchable={false}
                                isClearable={false}
                                isDisabled={years?.length === 0}
                            />
                        </div>
                    </div>

                    <div className="table-responsive h-[calc(100vh-400px)] pb-5">
                        <table className="table-striped">
                            <thead>
                                <tr className='!bg-dark !text-white'>
                                    <th rowSpan={2} className='text-center border border-slate-100 whitespace-nowrap min-w-[300px] max-w-[300px]'>
                                        Perangkat Daerah
                                    </th>
                                    <th colSpan={9} className='text-center border border-slate-100 whitespace-nowrap'>
                                        Kontrak
                                    </th>
                                    <th colSpan={2} className='text-center border border-slate-100 whitespace-nowrap'>
                                        Nilai Per 31 Des {year}
                                    </th>
                                </tr>
                                <tr className='!bg-dark !text-white'>
                                    <th className='text-center border border-slate-100 whitespace-nowrap'>
                                        Kode Rekening
                                    </th>
                                    <th className='text-center border border-slate-100 whitespace-nowrap'>
                                        Uraian
                                    </th>
                                    <th className='text-center border border-slate-100 whitespace-nowrap'>
                                        Nomor Perjanjian
                                    </th>
                                    <th className='text-center border border-slate-100 whitespace-nowrap'>
                                        Tanggal Perjanjian
                                    </th>
                                    <th className='text-center border border-slate-100 whitespace-nowrap'>
                                        Rekanan
                                    </th>
                                    <th className='text-center border border-slate-100 whitespace-nowrap'>
                                        Jangka Waktu (Bulan)
                                    </th>
                                    <th className='text-center border border-slate-100 whitespace-nowrap'>
                                        Tanggal Mulai
                                    </th>
                                    <th className='text-center border border-slate-100 whitespace-nowrap'>
                                        Tanggal Berakhir
                                    </th>
                                    <th className='text-center border border-slate-100 whitespace-nowrap'>
                                        Nilai (Rp)
                                    </th>

                                    <th className='text-center border border-slate-100 whitespace-nowrap'>
                                        Sudah jatuh Tempo/ Digunakan
                                    </th>
                                    <th className='text-center border border-slate-100 whitespace-nowrap'>
                                        Belum jatuh Tempo/ Digunakan
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataInput?.map((input: any, index: number) => (
                                    <tr>
                                        <td className='border border-slate-900'>
                                            {([9].includes(CurrentUser?.role_id) == false) ? (
                                                <Select placeholder="Pilih Perangkat Daerah"
                                                    className='min-w-[300px]'
                                                    onChange={(e: any) => {
                                                        if ([9].includes(CurrentUser?.role_id)) {
                                                            showAlert('error', 'Anda tidak memiliki akses ke Perangkat Daerah ini');
                                                        } else {
                                                            setDataInput((prev: any) => {
                                                                const updated = [...prev];
                                                                updated[index]['instance_id'] = e?.value;
                                                                return updated;
                                                            })
                                                            setIsUnsaved(true);
                                                        }
                                                    }}
                                                    isDisabled={[9].includes(CurrentUser?.role_id) ? true : (isSaving == true)}
                                                    value={
                                                        instances?.map((data: any, index: number) => {
                                                            if (data.id == input.instance_id) {
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
                                            ) : (
                                                <>
                                                    {instances?.find((i: any) => i.id == input.instance_id)?.name ?? '-'}
                                                </>
                                            )}
                                        </td>

                                        <td className='border border-slate-900'>
                                            {/* Kode Rekening */}
                                            <div className="flex items-center gap-2">
                                                <Select placeholder="Pilih Kode Rekening"
                                                    className='w-[400px]'
                                                    isDisabled={isSaving == true}
                                                    onChange={(e: any) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['kode_rekening_id'] = e?.value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    value={
                                                        arrKodeRekening?.map((data: any, index: number) => {
                                                            if (data.id == input.kode_rekening_id) {
                                                                return {
                                                                    value: data.id,
                                                                    label: data.fullcode + ' - ' + data.name,
                                                                }
                                                            }
                                                        })
                                                    }
                                                    options={
                                                        arrKodeRekening?.map((data: any, index: number) => {
                                                            return {
                                                                value: data.id,
                                                                label: data.fullcode + ' - ' + data.name,
                                                            }
                                                        })
                                                    } />

                                                {input?.id && (
                                                    <div className="">
                                                        <Tippy content="Hapus Data" placement='top' theme='danger'>
                                                            <button
                                                                type="button"
                                                                onClick={() => {

                                                                    const swalWithBootstrapButtons = Swal.mixin({
                                                                        customClass: {
                                                                            confirmButton: 'btn btn-danger',
                                                                            cancelButton: 'btn btn-slate-200 ltr:mr-3 rtl:ml-3',
                                                                            popup: 'sweet-alerts',
                                                                        },
                                                                        buttonsStyling: false,
                                                                    });
                                                                    swalWithBootstrapButtons
                                                                        .fire({
                                                                            title: 'Hapus Data?',
                                                                            text: "Apakah Anda yakin untuk menghapus Data Ini!",
                                                                            icon: 'question',
                                                                            showCancelButton: true,
                                                                            confirmButtonText: 'Ya, Hapus!',
                                                                            cancelButtonText: 'Tidak!',
                                                                            reverseButtons: true,
                                                                            padding: '2em',
                                                                        })
                                                                        .then((result) => {
                                                                            if (result.value) {
                                                                                deleteData(input.id);
                                                                            } else if (result.dismiss === Swal.DismissReason.cancel) {
                                                                                swalWithBootstrapButtons.fire('Batal', 'Batal menghapus Data', 'info');
                                                                            }
                                                                        });
                                                                }}
                                                                className="btn btn-danger w-8 h-8 p-0 rounded-full">
                                                                <IconTrash className='w-4 h-4' />
                                                            </button>
                                                        </Tippy>
                                                    </div>
                                                )}

                                            </div>
                                        </td>

                                        <td className="border border-slate-900">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Uraian"
                                                className="form-input w-[250px] placeholder:font-normal"
                                                value={input.uraian}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['uraian'] = e?.target?.value;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>

                                        <td className="border border-slate-900">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Nomor Perjanjian"
                                                className="form-input w-[250px] placeholder:font-normal"
                                                value={input.nomor_perjanjian}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['nomor_perjanjian'] = e?.target?.value;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>

                                        <td className='border border-slate-900'>
                                            <Flatpickr
                                                placeholder='Pilih Tanggal Perjanjian'
                                                options={{
                                                    dateFormat: 'Y-m-d',
                                                    position: 'auto right'
                                                }}
                                                className="form-input w-[250px] placeholder:font-normal"
                                                value={input?.tanggal_perjanjian}
                                                onChange={(date) => {
                                                    let Ymd = new Date(date[0].toISOString());
                                                    Ymd.setDate(Ymd.getDate() + 1);
                                                    const newYmd = Ymd.toISOString().split('T')[0];
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['tanggal_perjanjian'] = newYmd;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }} />
                                        </td>

                                        <td className='border border-slate-900'>
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Rekanan"
                                                className="form-input w-[250px] placeholder:font-normal"
                                                value={input.rekanan}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['rekanan'] = e?.target?.value;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>

                                        <td className='border border-slate-900'>
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Jangka Waktu"
                                                className="form-input w-[250px] placeholder:font-normal"
                                                value={input.jangka_waktu}
                                                onChange={(e: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['jangka_waktu'] = e?.target?.value;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>

                                        <td className='border border-slate-900'>
                                            <Flatpickr
                                                placeholder='Pilih Tanggal Mulai'
                                                options={{
                                                    dateFormat: 'Y-m-d',
                                                    position: 'auto right'
                                                }}
                                                className="form-input w-[250px] placeholder:font-normal"
                                                value={input?.kontrak_date_start}
                                                onChange={(date) => {
                                                    let Ymd = new Date(date[0].toISOString());
                                                    Ymd.setDate(Ymd.getDate() + 1);
                                                    const newYmd = Ymd.toISOString().split('T')[0];
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['kontrak_date_start'] = newYmd;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }} />
                                        </td>

                                        <td className='border border-slate-900'>
                                            <Flatpickr
                                                placeholder='Pilih Tanggal Berakhir'
                                                options={{ dateFormat: 'Y-m-d', position: 'auto right' }}
                                                className="form-input w-[250px] placeholder:font-normal"
                                                value={input?.kontrak_date_end}
                                                onChange={(date) => {
                                                    let Ymd = new Date(date[0].toISOString());
                                                    Ymd.setDate(Ymd.getDate() + 1);
                                                    const newYmd = Ymd.toISOString().split('T')[0];
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['kontrak_date_end'] = newYmd;
                                                        return updated;
                                                    })
                                                    setIsUnsaved(true);
                                                }} />
                                        </td>
                                        <td className='border border-slate-900'>
                                            <div className="flex group">
                                                <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                    Rp.
                                                </div>
                                                <input
                                                    disabled={isSaving == true}
                                                    type="text"
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
                                                    value={input.kontrak_value}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['kontrak_value'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(input.kontrak_value)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='border border-slate-900'>
                                            <div className="flex group">
                                                <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                    Rp.
                                                </div>
                                                <input
                                                    disabled={isSaving == true}
                                                    type="text"
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
                                                    value={input.sudah_jatuh_tempo}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['sudah_jatuh_tempo'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(input.sudah_jatuh_tempo)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='border border-slate-900'>
                                            <div className="flex group">
                                                <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                    Rp.
                                                </div>
                                                <input
                                                    disabled={isSaving == true}
                                                    type="text"
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
                                                    value={input.belum_jatuh_tempo}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            const value = parseFloat(e?.target?.value);
                                                            updated[index]['belum_jatuh_tempo'] = isNaN(value) ? 0 : value;
                                                            return updated;
                                                        })
                                                    }}
                                                    className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end hidden group-focus-within:block group-hover:block" />
                                                <div className="form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end block group-focus-within:hidden group-hover:hidden">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(input.belum_jatuh_tempo)}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className='!bg-slate-400'>
                                    <td colSpan={8} className='py-4 !bg-slate-300'></td>
                                    <td className='py-4 !bg-slate-300 text-end'>
                                        Jumlah :
                                    </td>
                                    <td className='p-4 text-end font-semibold !bg-slate-300'>
                                        Rp. {new Intl.NumberFormat('id-ID', {}).format(totalData?.kontrak_value)}
                                    </td>
                                    <td className='p-4 text-end font-semibold !bg-slate-300'>
                                        Rp. {new Intl.NumberFormat('id-ID', {}).format(totalData?.sudah_jatuh_tempo)}
                                    </td>
                                    <td className='p-4 text-end font-semibold !bg-slate-300'>
                                        Rp. {new Intl.NumberFormat('id-ID', {}).format(totalData?.belum_jatuh_tempo)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>


                    <div className="flex items-center justify-end gap-4 mt-4 px-5">
                        <button type="button"
                            disabled={isSaving == true}
                            onClick={(e) => {
                                if (isSaving == false) {
                                    addDataInput()
                                }
                            }}
                            className='btn btn-primary whitespace-nowrap text-xs'>
                            <FontAwesomeIcon icon={faPlus} className='w-3 h-3 mr-1' />
                            Tambah Data
                        </button>

                        {isSaving == false ? (
                            <button type="button"
                                onClick={(e) => {
                                    save()
                                }}
                                className='btn btn-success whitespace-nowrap text-xs'>
                                <FontAwesomeIcon icon={faSave} className='w-3 h-3 mr-1' />
                                Simpan
                            </button>
                        ) : (
                            <button type="button"
                                disabled={true}
                                className='btn btn-success whitespace-nowrap text-xs'>
                                <FontAwesomeIcon icon={faSpinner} className='w-3 h-3 mr-1 animate-spin' />
                                Menyimpan..
                            </button>
                        )}

                    </div>

                </div>

            </div>
        </>
    );
}

export default Page;
