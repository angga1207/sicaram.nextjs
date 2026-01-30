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
import PerfectScrollbar from 'react-perfect-scrollbar';
import LoadingSicaram from '@/components/LoadingSicaram';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudDownloadAlt, faCloudUploadAlt, faSave, faThList, faUndo } from '@fortawesome/free-solid-svg-icons';
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import { GlobalEndPoint } from '@/apis/serverConfig';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconMenu from '@/components/Icon/IconMenu';
import { storeKodeRekening, storeSaldoAwalLO, storeSaldoAwalNeraca } from '@/apis/Accountancy/Import';
import { getData, resetData, storeData } from '@/apis/Accountancy/Accountancy';
import ImportSaldoAwal from '@/components/Accountancy/AdminOnly/ImportSaldoAwal';
import { useSession } from 'next-auth/react';

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
        dispatch(setPageTitle('Panel Unggahan'));
    });

    const ref = useRef<any>(null);

    const [isMounted, setIsMounted] = useState(false);
    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null)
    const [years, setYears] = useState<any>([])
    const [queryApp, setQueryApp] = useState<any>(null);

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

    const [CurrentToken, setCurrentToken] = useState<any>(null);
    const session = useSession();
    useEffect(() => {
        if (isMounted && session.status === 'authenticated') {
            const token = session?.data?.user?.name;
            setCurrentToken(token);
        }
    }, [isMounted, session]);

    useEffect(() => {
        if (isMounted) {
            setQueryApp(router.query.app ?? 0);
        }
    }, [isMounted, router]);

    useEffect(() => {
        if (isMounted && periode?.id) {
            const currentYear = new Date().getFullYear();
            if (periode?.start_year <= currentYear) {
                // setYear(currentYear);
                setYear(2025);
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
            // GlobalEndPoint('kode_rekening', 'where|code_6|!=|null').then((res: any) => {
            //     if (res.status === 'success') {
            //         setArrKodeRekening(res.data);
            //     }
            // });
            // GlobalEndPoint('kode_rekening', ['where|code_1|=|5', 'where|code_6|!=|null']).then((res: any) => {
            //     if (res.status === 'success') {
            //         setArrKodeRekening(res.data);
            //     }
            // });
        }
    }, [isMounted]);

    const [isSaving, setIsSaving] = useState(false);
    const [dataFile, setDataFile] = useState<any>(null);
    const [isShowNoteMenu, setIsShowNoteMenu] = useState<any>(false);
    const [selectedTab, setSelectedTab] = useState<any>('lra');
    const [previewDataLRA, setPreviewDataLRA] = useState<any>([]);
    const [previewDataNeraca, setPreviewDataNeraca] = useState<any>([]);
    const [previewDataLO, setPreviewDataLO] = useState<any>([]);

    const tabChanged = (type: string) => {
        setSelectedTab(type);
        setIsShowNoteMenu(false);
    };

    useEffect(() => {
        if (selectedTab === 'lra' && instance && year) {
            _getDataLra(instance, periode?.id, year);
        } else if (selectedTab === 'lra' && (!instance || !year)) {
            setPreviewDataLRA([]);
        }
    }, [selectedTab == 'lra', instance, year]);

    function _getDataLra(instance: any, periode: any, year: any) {
        getData(instance, periode, year).then((res: any) => {
            if (res.status === 'success') {
                setPreviewDataLRA(res.data);
            } else {
                showAlert('error', res.message);
            }
        });
    }

    const uploadLRA = () => {
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
                _getDataLra(instance, periode?.id, year);
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
                _getDataLra(instance, periode?.id, year);
            } else {
                showAlert('error', res.message);
            }
        });
    }

    const uploadNeraca = () => {
        // reset error message
        let elements = document.getElementsByClassName('error-validation');
        for (let i = 0; i < elements.length; i++) {
            elements[i].innerHTML = '';
        }

        storeSaldoAwalNeraca(instance, periode?.id, year, dataFile).then((res) => {
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
                setDataFile(null);
                setPreviewDataNeraca(res.data);
            } else {
                showAlert('error', res.message ?? 'Data gagal disimpan');
            }
        });
        setIsSaving(false);
    }

    const uploadLO = () => {
        // reset error message
        let elements = document.getElementsByClassName('error-validation');
        for (let i = 0; i < elements.length; i++) {
            elements[i].innerHTML = '';
        }

        storeSaldoAwalLO(instance, periode?.id, year, dataFile).then((res) => {
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
                setDataFile(null);
                setPreviewDataLO(res.data);
            } else {
                showAlert('error', res.message ?? 'Data gagal disimpan');
            }
        });
        setIsSaving(false);
    }

    const uploadKodeRekening = () => {
        // reset error message
        let elements = document.getElementsByClassName('error-validation');
        for (let i = 0; i < elements.length; i++) {
            elements[i].innerHTML = '';
        }

        storeKodeRekening(periode?.id, year, dataFile).then((res) => {
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
                setDataFile(null);
                // _getDataLra(instance, periode?.id, year);
            } else {
                showAlert('error', res.message ?? 'Data gagal disimpan');
            }
        });
        setIsSaving(false);
    }

    return (
        <div>
            <div className="relative flex h-full gap-5 sm:h-[calc(100vh_-_150px)]">
                <div className={`absolute z-10 hidden h-full w-full rounded-md bg-black/60 ${isShowNoteMenu ? '!block xl:!hidden' : ''}`} onClick={() => setIsShowNoteMenu(!isShowNoteMenu)}></div>
                <div
                    className={`panel
                    absolute
                    z-10
                    hidden
                    h-full
                    w-[300px]
                    flex-none
                    space-y-4
                    overflow-hidden
                    p-4
                    ltr:rounded-r-none
                    rtl:rounded-l-none
                    ltr:lg:rounded-r-md rtl:lg:rounded-l-md
                    xl:relative xl:block
                    xl:h-auto ${isShowNoteMenu ? '!block h-full ltr:left-0 rtl:right-0' : 'hidden shadow'}`}
                >
                    <div className="flex h-full flex-col pb-16">
                        <div className="flex items-center text-center">
                            <div className="shrink-0">
                                <FontAwesomeIcon icon={faCloudUploadAlt} className='w-6 h-6' />
                            </div>
                            <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">
                                Panel Unggahan
                            </h3>
                        </div>

                        <div className="my-4 h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
                        <PerfectScrollbar className="relative h-full grow ltr:-mr-3.5 ltr:pr-3.5 rtl:-ml-3.5 rtl:pl-3.5">
                            <div className="space-y-1">

                                <button
                                    type="button"
                                    className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${selectedTab === 'lra' && 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary'
                                        }`}
                                    onClick={() => tabChanged('lra')}
                                >
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faCloudUploadAlt} className='w-4 h-4' />
                                        <div className="ltr:ml-3 rtl:mr-3">
                                            LRA
                                        </div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${selectedTab === 'neraca' && 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary'
                                        }`}
                                    onClick={() => tabChanged('neraca')}
                                >
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faCloudUploadAlt} className='w-4 h-4' />
                                        <div className="ltr:ml-3 rtl:mr-3">
                                            Saldo Awal Neraca
                                        </div>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${selectedTab === 'lo' && 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary'
                                        }`}
                                    onClick={() => tabChanged('lo')}
                                >
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faCloudUploadAlt} className='w-4 h-4' />
                                        <div className="ltr:ml-3 rtl:mr-3">
                                            Saldo Awal LO
                                        </div>
                                    </div>
                                </button>

                                {([1, 2, 5, 12].includes(CurrentUser?.role_id)) && (
                                    <button
                                        type="button"
                                        className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${selectedTab === 'kode_rekening' && 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary'
                                            }`}
                                        onClick={() => tabChanged('kode_rekening')}
                                    >
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faCloudUploadAlt} className='w-4 h-4' />
                                            <div className="ltr:ml-3 rtl:mr-3">
                                                Kode Rekening
                                            </div>
                                        </div>
                                    </button>
                                )}

                                {([1, 2, 5, 12].includes(CurrentUser?.role_id)) && (
                                    <button
                                        type="button"
                                        className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${selectedTab === 'saldo_awal_rekon_aset' && 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary'
                                            }`}
                                        onClick={() => tabChanged('saldo_awal_rekon_aset')}
                                    >
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faCloudUploadAlt} className='w-4 h-4' />
                                            <div className="ltr:ml-3 rtl:mr-3">
                                                Saldo Awal Rekon Aset
                                            </div>
                                        </div>
                                    </button>
                                )}

                            </div>
                        </PerfectScrollbar>
                    </div>
                    <div className="absolute bottom-0 w-full p-4 ltr:left-0 rtl:right-0">
                        <Link href={`/accountancy`}
                            className="btn btn-secondary whitespace-nowrap text-xs">
                            <IconArrowBackward className="w-4 h-4" />
                            <span className="ltr:ml-2 rtl:mr-2">
                                Kembali
                            </span>
                        </Link>
                    </div>
                </div>
                <div className="panel h-full flex-1 overflow-auto">
                    <div className="pb-5">
                        <button type="button" className="hover:text-primary xl:hidden" onClick={() => setIsShowNoteMenu(!isShowNoteMenu)}>
                            <IconMenu />
                        </button>
                    </div>

                    <div className="min-h-[400px] sm:min-h-[300px]">

                        {selectedTab === 'lra' && (
                            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
                                <div className="xl:col-span-1">
                                    <form className="grid grid-cols-1 gap-4" onSubmit={async (e) => {
                                        e.preventDefault();
                                        setIsSaving(true);
                                        uploadLRA();
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
                                                {previewDataLRA?.length > 0 && (
                                                    <>
                                                        {
                                                            previewDataLRA?.map((data: any, index: number) => {
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
                                                    </>
                                                )}
                                                {previewDataLRA?.length === 0 && (
                                                    <tr>
                                                        <td colSpan={6} className='text-center'>
                                                            Data tidak ditemukan
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedTab === 'neraca' && (
                            <>
                                <div className="">
                                    <form className="grid grid-cols-1 gap-4" onSubmit={async (e) => {
                                        e.preventDefault();
                                        setIsSaving(true);
                                        uploadNeraca();
                                    }}>
                                        <div className="uppercase font-bold text-center underline">
                                            Form Unggah Saldo Awal Neraca
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
                                                Unggah Berkas Neraca (Excel) dari SIPD
                                            </label>
                                            <input
                                                id='fileUpload'
                                                disabled={isSaving == true}
                                                type="file"
                                                accept='.xlsx,.xls'
                                                className="form-input p-1 border-slate-300"
                                                onChange={(e: any) => {
                                                    setDataFile(e.target.files[0]);
                                                }}
                                            />
                                            <div className='text-danger text-xs error-validation' id="error-file"></div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className=""></div>
                                            <div className="">
                                                <button
                                                    type="submit"
                                                    className="btn btn-success"
                                                    disabled={isSaving == true}>
                                                    <FontAwesomeIcon icon={faSave} className="h-5 w-5 mr-2" />
                                                    {isSaving ? 'Mengunggah' : 'Unggah Neraca'}
                                                </button>
                                            </div>
                                        </div>

                                    </form>
                                </div>

                                {previewDataNeraca?.length > 0 && (
                                    <div className="mt-4">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th className='text-center'>
                                                        Kode Rekening
                                                    </th>
                                                    <th className='text-start'>
                                                        Uraian
                                                    </th>
                                                    <th className='text-center'>
                                                        {year}
                                                    </th>
                                                    <th className='text-center'>
                                                        {year - 1}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {previewDataNeraca?.map((data: any, index: number) => (
                                                    <tr key={index}>
                                                        <td>
                                                            {data.fullcode}
                                                        </td>
                                                        <td>
                                                            {data.uraian}
                                                        </td>
                                                        <td>
                                                            <div className="flex gap-2 items-center justify-between">
                                                                <div className="">
                                                                    Rp.
                                                                </div>
                                                                <div className="">
                                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data.saldo_akhir)}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="flex gap-2 items-center justify-between">
                                                                <div className="">
                                                                    Rp.
                                                                </div>
                                                                <div className="">
                                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data.saldo_awal)}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        )}

                        {selectedTab === 'lo' && (
                            <>
                                <div className="">
                                    <form className="grid grid-cols-1 gap-4" onSubmit={async (e) => {
                                        e.preventDefault();
                                        setIsSaving(true);
                                        uploadLO();
                                    }}>
                                        <div className="uppercase font-bold text-center underline">
                                            Form Unggah Saldo Awal Laporan Operasional
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
                                                Unggah Berkas LO (Excel) dari SIPD
                                            </label>
                                            <input
                                                id='fileUpload'
                                                disabled={isSaving == true}
                                                type="file"
                                                accept='.xlsx,.xls'
                                                className="form-input p-1 border-slate-300"
                                                onChange={(e: any) => {
                                                    setDataFile(e.target.files[0]);
                                                }}
                                            />
                                            <div className='text-danger text-xs error-validation' id="error-file"></div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className=""></div>
                                            <div className="">
                                                <button
                                                    type="submit"
                                                    className="btn btn-success"
                                                    disabled={isSaving == true}>
                                                    <FontAwesomeIcon icon={faSave} className="h-5 w-5 mr-2" />
                                                    {isSaving ? 'Mengunggah' : 'Unggah LO'}
                                                </button>
                                            </div>
                                        </div>

                                    </form>
                                </div>

                                {previewDataLO?.length > 0 && (
                                    <div className="mt-4">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th className='text-center'>
                                                        Kode Rekening
                                                    </th>
                                                    <th className='text-start'>
                                                        Uraian
                                                    </th>
                                                    <th className='text-center'>
                                                        {year}
                                                    </th>
                                                    <th className='text-center'>
                                                        {year - 1}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {previewDataLO?.map((data: any, index: number) => (
                                                    <tr key={index}>
                                                        <td>
                                                            {data.fullcode}
                                                        </td>
                                                        <td>
                                                            {data.uraian}
                                                        </td>
                                                        <td>
                                                            <div className="flex gap-2 items-center justify-between">
                                                                <div className="">
                                                                    Rp.
                                                                </div>
                                                                <div className="">
                                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data.saldo_akhir)}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="flex gap-2 items-center justify-between">
                                                                <div className="">
                                                                    Rp.
                                                                </div>
                                                                <div className="">
                                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data.saldo_awal)}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        )}

                        {selectedTab === 'kode_rekening' && (
                            <div className="">
                                <form className="grid grid-cols-1 gap-4"
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        setIsSaving(true);
                                        uploadKodeRekening();
                                    }}>
                                    <div className="uppercase font-bold text-center underline">
                                        Form Unggah Kode Rekening
                                    </div>

                                    <div className="">
                                        <label htmlFor="fileUpload">
                                            Unggah Berkas Konsolidasi LO/Neraca (Excel) dari SIPD
                                        </label>
                                        <input
                                            id='fileUpload'
                                            disabled={isSaving == true}
                                            type="file"
                                            accept='.xlsx'
                                            className="form-input p-1 border-slate-300"
                                            onChange={(e: any) => {
                                                setDataFile(e.target.files[0]);
                                            }}
                                        />
                                        <div className='text-danger text-xs error-validation' id="error-file"></div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className=""></div>
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

                                </form>
                            </div>
                        )}

                        {selectedTab === 'saldo_awal_rekon_aset' && (
                            <>
                                {(isMounted && instances.length > 0) && (
                                    <ImportSaldoAwal
                                        data={isMounted && [instances, arrKodeRekening, periode, year, instance]}
                                        key={[year, instance]}
                                    />
                                )}
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Page;
