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
import Pemeliharaan from '@/components/Accountancy/BebanLaporanOperasional/Pemeliharaan';
import Perjadin from '@/components/Accountancy/BebanLaporanOperasional/Perjadin';
import Pegawai from '@/components/Accountancy/BebanLaporanOperasional/Pegawai';
import Persediaan from '@/components/Accountancy/BebanLaporanOperasional/Persediaan';
import Jasa from '@/components/Accountancy/BebanLaporanOperasional/Jasa';
import Hibah from '@/components/Accountancy/BebanLaporanOperasional/Hibah';
import Subsidi from '@/components/Accountancy/BebanLaporanOperasional/Subsidi';
import UangJasaDiserahkan from '@/components/Accountancy/BebanLaporanOperasional/UangJasaDiserahkan';



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
        dispatch(setPageTitle('Beban Laporan Operasional'));
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
        if (isMounted) {
            setQueryApp(router.query.app ?? 0);
        }
    }, [isMounted, router]);

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
        if (isMounted && queryApp != null) {
            setArrKodeRekening([]);
            if (queryApp == 0) {
                GlobalEndPoint('kode_rekening', ['where|code_6|!=|null', 'where|code_1|=|5', 'where|code_2|=|1', 'where|code_3|=|01']).then((res: any) => {
                    if (res.status === 'success') {
                        setArrKodeRekening(res.data);
                    }
                });
            } else if (queryApp == 1) {
                GlobalEndPoint('kode_rekening', ['where|code_6|!=|null', 'where|code_1|=|5', 'where|code_2|=|1', 'where|code_3|=|02']).then((res: any) => {
                    if (res.status === 'success') {
                        setArrKodeRekening(res.data);
                    }
                });
            } else if (queryApp == 2) {
                GlobalEndPoint('kode_rekening', ['where|code_6|!=|null', 'where|code_1|=|5', 'where|code_2|=|1', 'where|code_3|=|02']).then((res: any) => {
                    if (res.status === 'success') {
                        setArrKodeRekening(res.data);
                    }
                });
            } else if (queryApp == 3) {
                GlobalEndPoint('kode_rekening', ['where|code_6|!=|null', 'where|code_1|=|5', 'where|code_2|=|1', 'where|code_3|=|02']).then((res: any) => {
                    if (res.status === 'success') {
                        setArrKodeRekening(res.data);
                    }
                });
            } else if (queryApp == 4) {
                GlobalEndPoint('kode_rekening', ['where|code_6|!=|null', 'where|code_1|=|5', 'where|code_2|=|1', 'where|code_3|=|02']).then((res: any) => {
                    if (res.status === 'success') {
                        setArrKodeRekening(res.data);
                    }
                });
            } else if (queryApp == 5) {
                GlobalEndPoint('kode_rekening', ['where|code_6|!=|null', 'where|code_1|=|5', 'where|code_2|=|1', 'where|code_3|=|02', 'where|code_4|=|05']).then((res: any) => {
                    if (res.status === 'success') {
                        setArrKodeRekening(res.data);
                    }
                });
            } else if (queryApp == 6) {
                GlobalEndPoint('kode_rekening', ['where|code_6|!=|null', 'where|code_1|=|5', 'where|code_2|=|1', 'where|code_3|=|05']).then((res: any) => {
                    if (res.status === 'success') {
                        setArrKodeRekening(res.data);
                    }
                });
            } else if (queryApp == 7) {
                GlobalEndPoint('kode_rekening', ['where|code_6|!=|null', 'where|code_1|=|5', 'where|code_2|=|1', 'where|code_3|=|04']).then((res: any) => {
                    if (res.status === 'success') {
                        setArrKodeRekening(res.data);
                    }
                });
            } else {
                GlobalEndPoint('kode_rekening', []).then((res: any) => {
                    if (res.status === 'success') {
                        setArrKodeRekening(res.data);
                    }
                });
            }
        }
    }, [isMounted, queryApp]);

    return (
        <div className="">
            <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5">
                <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                    Beban Laporan Operasional
                    <br />
                    {instances?.find((i: any) => i.id == instance)?.name ?? 'Kabupaten Ogan Ilir'}
                </h2>

                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                    {[1, 12].includes(CurrentUser?.role_id) && (
                        <div className="">
                            <Select placeholder="Kabupaten Ogan Ilir"
                                classNamePrefix={'selectAngga'}
                                className='min-w-[300px] max-w-[300px] z-[2]'
                                onChange={(e: any) => {
                                    if ([9].includes(CurrentUser?.role_id)) {
                                        showAlert('error', 'Anda tidak memiliki akses ke Perangkat Daerah ini');
                                    } else {
                                        setInstance(e?.value);
                                    }
                                }}
                                isLoading={instances?.length === 0}
                                isClearable={true}
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
                    )}

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
                {(isMounted && queryApp != null) && (
                    <Tab.Group defaultIndex={queryApp} key={queryApp}>
                        <Tab.List className="mt-3 flex flex-nowrap border-b border-white-light dark:border-[#191e3a overflow-x-auto">
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        onClick={() => {
                                            if (queryApp != 0) {
                                                router.replace({
                                                    pathname: '/accountancy/beban-laporan-operasional',
                                                    query: { app: 0 },
                                                });
                                            }
                                        }}
                                        className={`uppercase font-semibold p-4 flex-grow whitespace-nowrap ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                        Pegawai
                                    </button>
                                )}
                            </Tab>

                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        onClick={() => {
                                            if (queryApp != 1) {
                                                router.replace({
                                                    pathname: '/accountancy/beban-laporan-operasional',
                                                    query: { app: 1 },
                                                });
                                            }
                                        }}
                                        className={`uppercase font-semibold p-4 flex-grow whitespace-nowrap ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                        Persediaan
                                    </button>
                                )}
                            </Tab>

                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        onClick={() => {
                                            if (queryApp != 2) {
                                                router.push({
                                                    pathname: '/accountancy/beban-laporan-operasional',
                                                    query: { app: 2 },
                                                });
                                            }
                                        }}
                                        className={`uppercase font-semibold p-4 flex-grow whitespace-nowrap ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                        Jasa
                                    </button>
                                )}
                            </Tab>

                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        onClick={() => {
                                            if (queryApp != 3) {
                                                router.push({
                                                    pathname: '/accountancy/beban-laporan-operasional',
                                                    query: { app: 3 },
                                                });
                                            }
                                        }}
                                        className={`uppercase font-semibold p-4 flex-grow whitespace-nowrap ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                        Pemeliharaan
                                    </button>
                                )}
                            </Tab>

                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        onClick={() => {
                                            if (queryApp != 4) {
                                                router.push({
                                                    pathname: '/accountancy/beban-laporan-operasional',
                                                    query: { app: 4 },
                                                });
                                            }
                                        }}
                                        className={`uppercase font-semibold p-4 flex-grow whitespace-nowrap ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                        Perjadin
                                    </button>
                                )}
                            </Tab>

                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        onClick={() => {
                                            if (queryApp != 5) {
                                                router.push({
                                                    pathname: '/accountancy/beban-laporan-operasional',
                                                    query: { app: 5 },
                                                });
                                            }
                                        }}
                                        className={`uppercase font-semibold p-4 flex-grow whitespace-nowrap ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                        Uang / Jasa Diserahkan
                                    </button>
                                )}
                            </Tab>

                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        onClick={() => {
                                            if (queryApp != 6) {
                                                router.push({
                                                    pathname: '/accountancy/beban-laporan-operasional',
                                                    query: { app: 6 },
                                                });
                                            }
                                        }}
                                        className={`uppercase font-semibold p-4 flex-grow whitespace-nowrap ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                        Hibah
                                    </button>
                                )}
                            </Tab>

                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        onClick={() => {
                                            if (queryApp != 7) {
                                                router.push({
                                                    pathname: '/accountancy/beban-laporan-operasional',
                                                    query: { app: 7 },
                                                });
                                            }
                                        }}
                                        className={`uppercase font-semibold p-4 flex-grow whitespace-nowrap ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                        Subsidi
                                    </button>
                                )}
                            </Tab>

                        </Tab.List>

                        <Tab.Panels>
                            <Tab.Panel>
                                <div className="active pt-5">
                                    {(isMounted && instances.length > 0) && (
                                        <Pegawai
                                            data={isMounted && [instances, arrKodeRekening, periode, year, instance]}
                                            key={[year, instance]}
                                        />
                                    )}
                                </div>
                            </Tab.Panel>

                            <Tab.Panel>
                                <div className="active pt-5">
                                    {(isMounted && instances.length > 0) && (
                                        <Persediaan
                                            data={isMounted && [instances, arrKodeRekening, periode, year, instance]}
                                            key={[year, instance]}
                                        />
                                    )}
                                </div>
                            </Tab.Panel>

                            <Tab.Panel>
                                <div className="active pt-5">
                                    {(isMounted && instances.length > 0) && (
                                        <Jasa
                                            data={isMounted && [instances, arrKodeRekening, periode, year, instance]}
                                            key={[year, instance]}
                                        />
                                    )}
                                </div>
                            </Tab.Panel>

                            <Tab.Panel>
                                <div className="active pt-5">
                                    {(isMounted && instances.length > 0) && (
                                        <Pemeliharaan
                                            data={isMounted && [instances, arrKodeRekening, periode, year, instance]}
                                            key={[year, instance]}
                                        />
                                    )}
                                </div>
                            </Tab.Panel>

                            <Tab.Panel>
                                <div className="pt-5">
                                    {(isMounted && instances.length > 0) && (
                                        <Perjadin
                                            data={isMounted && [instances, arrKodeRekening, periode, year, instance]}
                                            key={[year, instance]}
                                        />
                                    )}
                                </div>
                            </Tab.Panel>

                            <Tab.Panel>
                                <div className="pt-5">
                                    {(isMounted && instances.length > 0) && (
                                        <UangJasaDiserahkan
                                            data={isMounted && [instances, arrKodeRekening, periode, year, instance]}
                                            key={[year, instance]}
                                        />
                                    )}
                                </div>
                            </Tab.Panel>

                            <Tab.Panel>
                                <div className="pt-5">
                                    {(isMounted && instances.length > 0) && (
                                        <Hibah
                                            data={isMounted && [instances, arrKodeRekening, periode, year, instance]}
                                            key={[year, instance]}
                                        />
                                    )}
                                </div>
                            </Tab.Panel>

                            <Tab.Panel>
                                <div className="pt-5">
                                    {(isMounted && instances.length > 0) && (
                                        <Subsidi
                                            data={isMounted && [instances, arrKodeRekening, periode, year, instance]}
                                            key={[year, instance]}
                                        />
                                    )}
                                </div>
                            </Tab.Panel>

                        </Tab.Panels>
                    </Tab.Group>
                )}
            </div>
        </div>
    );
}

export default Page;
