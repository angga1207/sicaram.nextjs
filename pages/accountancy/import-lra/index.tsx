import { useEffect, useState, Fragment, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/themeConfigSlice';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Tab, Dialog, Transition } from '@headlessui/react';
import Dropdown from '@/components/Dropdown';
import Swal from 'sweetalert2';
import Link from 'next/link';
import Select from 'react-select';
import LoadingSicaram from '@/components/LoadingSicaram';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudDownloadAlt, faThList, faUndo } from '@fortawesome/free-solid-svg-icons';
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import { GlobalEndPoint } from '@/apis/serverConfig';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { getData, resetData, storeData } from '@/apis/Accountancy/Accountancy';

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
        dispatch(setPageTitle('Unggah LRA'));
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
                // setYear(currentYear);
                setYear(2024);
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


    useEffect(() => {
        if (isMounted && !instance && instances?.length === 0) {
            GlobalEndPoint('instances').then((res: any) => {
                if (res.status === 'success') {
                    setInstances(res.data);
                }
            });
        }
    }, [isMounted]);

    const [datas, setDatas] = useState<any>([]);

    function _getData(instance: any, periode: any, year: any) {
        getData(instance, periode, year).then((res: any) => {
            if (res.status === 'success') {
                setDatas(res.data);
            } else {
                showAlert('error', res.message);
            }
        });
    }

    useEffect(() => {
        if (isMounted && year) {
            _getData(instance, periode?.id, year);
        }
    }, [isMounted, instance, year]);

    const [dataFile, setDataFile] = useState<any>(null);
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);


    const upload = () => {
        // reset error message
        let elements = document.getElementsByClassName('error-validation');
        for (let i = 0; i < elements.length; i++) {
            elements[i].innerHTML = '';
        }

        storeData(instance, periode?.id, year, dataFile).then((res) => {
            if (res.status == 'error validation') {
                Object.keys(res.message).map((key: any) => {
                    let element = document.getElementById('error-' + key);
                    if (element) {
                        if (key) {
                            element.innerHTML = res.message[key][0];
                        } else {
                            element.innerHTML = '';
                        }
                    }
                });
                showAlert('error', 'Terdapat form yang belum diisi dengan benar');
                setIsSaving(false);
            } else if (res.status === 'success') {
                showAlert('success', res.message);
                // setDataFile(null);
                _getData(instance, periode?.id, year);
            } else {
                showAlert('error', res.message ?? 'Data gagal disimpan');
            }
        });
        setIsSaving(false);
    }

    const _resetData = () => {
        resetData(instance, periode?.id, year).then((res) => {
            if (res.status === 'success') {
                showAlert('success', res.message);
                _getData(instance, periode?.id, year);
            } else {
                showAlert('error', res.message);
            }
        });
    }

    return (
        <div>
            <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5">
                <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                    Informasi LRA
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
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
                    <div className="xl:col-span-1">
                        <form className="grid grid-cols-1 gap-4" onSubmit={async (e) => {
                            e.preventDefault();
                            setIsSaving(true);
                            upload();
                        }}>
                            <div className="uppercase font-bold text-center underline">
                                Form Unggah (Update) LRA
                            </div>

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
                                    isDisabled={(years?.length === 0) || (isSaving == true)}
                                />
                                <div className='text-danger text-xs error-validation' id="error-year"></div>
                            </div>

                            <div className="">
                                <label htmlFor="fileUpload">
                                    Unggah Berkas LRA (Excel) dari SIPD
                                </label>
                                <input
                                    id='fileUpload'
                                    disabled={isSaving == true}
                                    type="file"
                                    accept='.xlsx,.xls'
                                    placeholder="Nilai Kontrak"
                                    className="form-input p-1 border-slate-300"
                                    onChange={(e: any) => {
                                        setDataFile(e.target.files[0]);
                                    }}
                                />
                                <div className='text-danger text-xs error-validation' id="error-file"></div>
                            </div>

                            <div className="flex items-center justify-between">
                                {instance ? (
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={(e) => {
                                            // confirm reset data
                                            e.preventDefault();
                                            Swal.fire({
                                                title: 'Anda Yakin untuk Menghapus Data LRA Perangkat Daerah Ini?',
                                                text: 'Semua data yang sudah diunggah akan dihapus secara PERMANEN!',
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonText: 'Ya, Hapus',
                                                cancelButtonText: 'Tidak',
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    _resetData();
                                                }
                                            });
                                        }}
                                        disabled={isSaving == true}>
                                        <FontAwesomeIcon icon={faUndo} className="h-5 w-5 mr-2" />
                                        {isSaving ? 'Loading' : 'Hapus LRA'}
                                    </button>
                                ) : (
                                    <div></div>
                                )}
                                <div className="">
                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                        disabled={isSaving == true}>
                                        <FontAwesomeIcon icon={faSave} className="h-5 w-5 mr-2" />
                                        {isSaving ? 'Mengunggah' : 'Unggah'}
                                    </button>
                                </div>
                            </div>

                            <div className="hidden">
                                <div onClick={(e) => {
                                    e.preventDefault();
                                    showAlertCenter('info', 'Mohon maaf, fitur ini belum tersedia');
                                    // window.open('/assets/format-lra.xlsx', '_blank');
                                }} className="btn btn-primary flex items-center gap-2 cursor-pointer">
                                    <FontAwesomeIcon icon={faCloudDownloadAlt} className="h-5 w-5" />
                                    <div className="">
                                        Download Format LRA
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div>

                    <div className="xl:col-span-3">
                        <div className="table-responsive mb-5 h-[calc(100vh-350px)]">
                            <table className="table-striped">
                                <thead>
                                    <tr className='!bg-slate-900 !text-white sticky top-0 left-0 z-[1]'>
                                        <th className='!text-center min-w-[150px]'>
                                            Kode Rekening
                                        </th>
                                        <th className='!text-center min-w-[300px]'>
                                            Uraian
                                        </th>
                                        <th className='!text-center w-[250px]'>
                                            Anggaran
                                        </th>
                                        <th className='!text-center w-[250px]'>
                                            Realisasi {year}
                                        </th>
                                        <th className='!text-center w-[50px]'>
                                            Persentase {year}
                                        </th>
                                        <th className='!text-center w-[250px]'>
                                            Realisasi {year - 1}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        datas?.map((data: any, index: number) => {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        {data?.kode_rekening}
                                                    </td>
                                                    <td>
                                                        {data?.uraian}
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center justify-between">
                                                            <span>
                                                                Rp.
                                                            </span>
                                                            <span className='whitespace-nowrap'>
                                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data.anggaran)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center justify-between">
                                                            <span>
                                                                Rp.
                                                            </span>
                                                            <span className='whitespace-nowrap'>
                                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data.realisasi)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="text-center">
                                                            {new Intl.NumberFormat('id-ID', {}).format(data?.realisasi_percentage)} %
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center justify-between">
                                                            <span>
                                                                Rp.
                                                            </span>
                                                            <span className='whitespace-nowrap'>
                                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data.realisasi_last_year)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Page;
