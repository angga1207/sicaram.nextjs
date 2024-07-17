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
import { Dialog, Transition } from '@headlessui/react';
import Dropdown from '@/components/Dropdown';
import Swal from 'sweetalert2';
import Link from 'next/link';
import Select from 'react-select';
import LoadingSicaram from '@/components/LoadingSicaram';
import IconLayoutGrid from '@/components/Icon/IconLayoutGrid';
import IconListCheck from '@/components/Icon/IconListCheck';
import IconSearch from '@/components/Icon/IconSearch';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';

import { fetchPeriodes, fetchSatuans, fetchRangePeriode } from '@/apis/fetchdata';
import { fetchInstances } from '@/apis/fetchRealisasi';
import IconPencil from '@/components/Icon/IconPencil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faGlobeAsia } from '@fortawesome/free-solid-svg-icons';
import IconLaptop from '@/components/Icon/IconLaptop';

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
    const router = useRouter();

    useEffect(() => {
        dispatch(setPageTitle('Laporan'));
    });

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const ref = useRef<any>(null);

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


    const [periodes, setPeriodes] = useState([]);
    const [periode, setPeriode] = useState(1);
    const [years, setYears] = useState<any>(null);
    const [year, setYear] = useState<any>(router.query.year ?? new Date().getFullYear());
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
    const [triwulans, setTriwulans] = useState<any>([
        { id: 0, name: 'Sepanjang Tahun' },
        { id: 1, name: 'Triwulan I' },
        { id: 2, name: 'Triwulan II' },
        { id: 3, name: 'Triwulan III' },
        { id: 4, name: 'Triwulan IV' },
    ]);
    const [triwulan, setTriwulan] = useState<any>(null);
    const [instance, setInstance] = useState<any>((router.query.instance ?? null) ?? CurrentUser?.instance_id);
    const [instances, setInstances] = useState<any>([]);
    const [satuans, setSatuans] = useState<any>([]);

    useEffect(() => {
        if ([9].includes(CurrentUser?.role_id)) {
            setInstance((router.query.instance ?? null) ?? CurrentUser?.instance_id);
        }
    }, [CurrentUser]);

    useEffect(() => {
        setInstance((router.query.instance ?? null) ?? CurrentUser?.instance_id);
    }, [CurrentUser, router.query.instance]);

    useEffect(() => {
        fetchPeriodes().then((data) => {
            if (data.status == 'success') {
                setPeriodes(data.data);
            } else if (data.status == 'error') {
                showAlert('error', data.message);
            } else {
                showAlert('error', 'Terjadi kesalahan');
            }

        });
        fetchInstances().then((data) => {
            if (data.status == 'success') {
                setInstances(data.data);
            } else if (data.status == 'error') {
                showAlert('error', data.message);
            } else {
                showAlert('error', 'Terjadi kesalahan');
            }
        });
        fetchRangePeriode(periode).then((data) => {
            if (data.status == 'success') {
                setYears(data.data.years);
            } else if (data.status == 'error') {
                showAlert('error', data.message);
            } else {
                showAlert('error', 'Terjadi kesalahan');
            }
        });

        // if Date().getFullYear() included in years
        if (years?.includes(new Date().getFullYear())) {
            setYear(new Date().getFullYear());
        }

    }, [CurrentUser, periode]);

    return (
        <>

            <div className="flex items-center justify-center w-full h-[calc(100vh-200px)]">
                <div className='panel w-full md:w-1/2 xl:w-1/3'>
                    <div className="mb-5 text-center text-xl font-semibold">
                        Filter Laporan
                    </div>
                    <div className="mb-5">
                        <label className="form-label mb-0">
                            Perangkat Daerah
                        </label>
                        <Select placeholder="Pilih Perangkat Daerah"
                            className='w-full'
                            onChange={(e: any) => {
                                if ([9].includes(CurrentUser?.role_id)) {
                                    showAlert('error', 'Anda tidak memiliki akses ke Perangkat Daerah ini');
                                } else {
                                    setInstance(e?.value);
                                }
                            }}
                            isDisabled={[9].includes(CurrentUser?.role_id) ? true : false}
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
                    </div>
                    <div className="mb-5">
                        <label className="form-label mb-0">
                            Tahun
                        </label>
                        <Select placeholder="Pilih Tahun"
                            className='w-full'
                            onChange={(e: any) => {
                                setYear(e?.value);
                            }}
                            value={
                                years?.map((data: any, index: number) => {
                                    if (data == year) {
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
                    <div className="mb-5">
                        <label className="form-label mb-0">
                            Triwulan
                        </label>
                        <Select placeholder="Pilih Triwulan"
                            className='w-full'
                            onChange={(e: any) => {
                                setTriwulan(e?.value);
                            }}
                            value={
                                triwulans?.map((data: any, index: number) => {
                                    if (data.id == triwulan) {
                                        return {
                                            value: data.id,
                                            label: data.name,
                                        }
                                    }
                                })
                            }
                            options={
                                triwulans?.map((data: any, index: number) => {
                                    return {
                                        value: data.id,
                                        label: data.name,
                                    }
                                })
                            } />
                    </div>
                    <div className="mb-5">
                        <button type="button" className="btn btn-primary w-full" onClick={(e) => {
                            e.preventDefault();
                            if (!instance) {
                                showAlert('error', 'Pilih Perangkat Daerah terlebih dahulu');
                                return;
                            }
                            if (!year) {
                                showAlert('error', 'Pilih Tahun terlebih dahulu');
                                return;
                            }
                            if (!triwulan && triwulan != 0) {
                                showAlert('error', 'Pilih Triwulan terlebih dahulu');
                                return;
                            }
                            router.push(`/report/realisasi?instance=${instance}&year=${year}&triwulan=${triwulan}`);
                        }}>
                            <IconSearch className="w-4 h-4" />
                            <span className="ltr:ml-2 rtl:mr-2">
                                Buka Laporan
                            </span>
                        </button>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Index;
