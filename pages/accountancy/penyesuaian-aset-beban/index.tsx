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
import LoadingSicaram from '@/components/LoadingSicaram';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faThList } from '@fortawesome/free-solid-svg-icons';
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import { GlobalEndPoint } from '@/apis/serverConfig';
import PenyesuaianBebanDanBarjas from '@/components/Accountancy/PenyesuaianAsetBeban/PenyesuaianBebanDanBarjas';
import ModalKeBeban from '@/components/Accountancy/PenyesuaianAsetBeban/ModalKeBeban';
import BarjasKeAset from '@/components/Accountancy/PenyesuaianAsetBeban/BarjasKeAset';
import PenyesuaianAset from '@/components/Accountancy/PenyesuaianAsetBeban/PenyesuaianAset';
import Atribusi from '@/components/Accountancy/PenyesuaianAsetBeban/Atribusi';

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
        dispatch(setPageTitle('Penyesuaian Aset dan Beban'));
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
            GlobalEndPoint('kode_rekening', 'where|code_6|!=|null').then((res: any) => {
                if (res.status === 'success') {
                    setArrKodeRekening(res.data);
                }
            });
        }
    }, [isMounted]);

    return (
        <>
            <div className="">
                <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5">
                    <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                        Penyesuaian Aset dan Beban
                        <br />
                        {instances?.find((i: any) => i.id == instance)?.name ?? 'Kabupaten Ogan Ilir'}
                    </h2>

                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">

                        <div className="">

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
                    <Tab.Group>
                        <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`uppercase font-semibold p-4 flex-grow ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                        Penyesuaian Beban Barjas
                                    </button>
                                )}
                            </Tab>
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`uppercase font-semibold p-4 flex-grow ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                        Modal ke Beban
                                    </button>
                                )}
                            </Tab>
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`uppercase font-semibold p-4 flex-grow ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                        Barjas ke Aset
                                    </button>
                                )}
                            </Tab>
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`uppercase font-semibold p-4 flex-grow ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                        Penyesuaian Aset
                                    </button>
                                )}
                            </Tab>
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`uppercase font-semibold p-4 flex-grow ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                        Atribusi
                                    </button>
                                )}
                            </Tab>
                        </Tab.List>

                        <Tab.Panels>
                            <Tab.Panel>
                                <div className="active pt-5">
                                    {(isMounted && instances.length > 0) && (
                                        <PenyesuaianBebanDanBarjas
                                            data={isMounted && [instances, arrKodeRekening, periode, year]}
                                            key={year}
                                        />
                                    )}
                                </div>
                            </Tab.Panel>

                            <Tab.Panel>
                                <div className="pt-5">
                                    {(isMounted && instances.length > 0) && (
                                        <ModalKeBeban
                                            data={isMounted && [instances, arrKodeRekening, periode, year]}
                                            key={year}
                                        />
                                    )}
                                </div>
                            </Tab.Panel>

                            <Tab.Panel>
                                <div className="pt-5">
                                    {(isMounted && instances.length > 0) && (
                                        <BarjasKeAset
                                            data={isMounted && [instances, arrKodeRekening, periode, year]}
                                            key={year}
                                        />
                                    )}
                                </div>
                            </Tab.Panel>

                            <Tab.Panel>
                                <div className="pt-5">
                                    {(isMounted && instances.length > 0) && (
                                        <PenyesuaianAset
                                            data={isMounted && [instances, arrKodeRekening, periode, year]}
                                            key={year}
                                        />
                                    )}
                                </div>
                            </Tab.Panel>

                            <Tab.Panel>
                                <div className="pt-5">
                                    {(isMounted && instances.length > 0) && (
                                        <Atribusi
                                            data={isMounted && [instances, arrKodeRekening, periode, year]}
                                            key={year}
                                        />
                                    )}
                                </div>
                            </Tab.Panel>

                        </Tab.Panels>
                    </Tab.Group>
                </div>

            </div>
        </>
    );
}

export default Page;
