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
import { faThList } from '@fortawesome/free-solid-svg-icons';
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import { GlobalEndPoint } from '@/apis/serverConfig';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import Rekap from '@/components/Accountancy/AssetsReconciliation/Rekap';
import RekapOPD from '@/components/Accountancy/AssetsReconciliation/RekapOPD';
import RekapAsetTetap from '@/components/Accountancy/AssetsReconciliation/RekapAsetTetap';
import RekapBelanja from '@/components/Accountancy/AssetsReconciliation/RekapBelanja';
import KIB_A from '@/components/Accountancy/AssetsReconciliation/KIB_A';
import KIB_B from '@/components/Accountancy/AssetsReconciliation/KIB_B';
import KIB_C from '@/components/Accountancy/AssetsReconciliation/KIB_C';
import KIB_D from '@/components/Accountancy/AssetsReconciliation/KIB_D';
import KIB_E from '@/components/Accountancy/AssetsReconciliation/KIB_E';
import KDP from '@/components/Accountancy/AssetsReconciliation/KDP';
import AsetTakBerwujud from '@/components/Accountancy/AssetsReconciliation/AsetTakBerwujud';
import AsetLainLain from '@/components/Accountancy/AssetsReconciliation/AsetLainLain';
import RekapAsetLainnya from '@/components/Accountancy/AssetsReconciliation/RekapAsetLainnya';
import Penyusutan from '@/components/Accountancy/AssetsReconciliation/Penyusutan';

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
        dispatch(setPageTitle('Rekonsiliasi Aset'));
    });

    const ref = useRef<any>(null);

    const [isMounted, setIsMounted] = useState(false);
    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null)
    const [years, setYears] = useState<any>(null)
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
            // GlobalEndPoint('kode_rekening', ['where|code_1|=|5', 'where|code_6|!=|null', 'where|code_2|=|2']).then((res: any) => {
            //     if (res.status === 'success') {
            //         setArrKodeRekening(res.data);
            //     }
            // });
        }
    }, [isMounted]);

    return (
        <>
            <div className="">
                <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5">
                    <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase whitespace-nowrap">
                        Rekonsiliasi Aset
                        <br />
                        {instances?.find((i: any) => i.id == instance)?.name ?? 'Kabupaten Ogan Ilir'}
                    </h2>

                    <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">

                        {[1, 12].includes(CurrentUser?.role_id) && (
                            <div className="">
                                <Select placeholder="Kabupaten Ogan Ilir"
                                    className='min-w-[300px] max-w-[300px]'
                                    classNamePrefix={'selectAngga'}
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
                                className="min-w-[200px]"
                                id="tahun"
                                options={years}
                                value={years?.find((option: any) => option.value === year)}
                                onChange={(e: any) => {
                                    setYear(e.value)
                                }}
                                isSearchable={false}
                                isClearable={false}
                                classNamePrefix={'selectAngga'}
                                isDisabled={(years?.length === 0) || false}
                            />
                            <div className='text-danger text-xs error-validation' id="error-year"></div>
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
                    {queryApp != null && (
                        <Tab.Group defaultIndex={queryApp} key={queryApp}>
                            <Tab.List className="mt-3 pb-3 flex flex-nowrap overflow-y-auto border-b border-white-light dark:border-[#191e3a]">
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            onClick={() => {
                                                // router.push({
                                                //     pathname: '/accountancy/rekonsiliasi-aset',
                                                //     query: { app: 0 },
                                                // });
                                            }}
                                            className={`uppercase whitespace-nowrap font-semibold p-4 flex-grow ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                            Rekap
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            onClick={() => {
                                                // router.push({
                                                //     pathname: '/accountancy/rekonsiliasi-aset',
                                                //     query: { app: 1 },
                                                // });
                                            }}
                                            className={`uppercase whitespace-nowrap font-semibold p-4 flex-grow ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                            Rekap OPD
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            onClick={() => {
                                                // router.push({
                                                //     pathname: '/accountancy/rekonsiliasi-aset',
                                                //     query: { app: 2 },
                                                // });
                                            }}
                                            className={`uppercase whitespace-nowrap font-semibold p-4 flex-grow ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                            Rekap Aset Tetap
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            onClick={() => {
                                                // router.push({
                                                //     pathname: '/accountancy/rekonsiliasi-aset',
                                                //     query: { app: 3 },
                                                // });
                                            }}
                                            className={`uppercase whitespace-nowrap font-semibold p-4 flex-grow ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                            Rekap Belanja
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            onClick={() => {
                                                // router.push({
                                                //     pathname: '/accountancy/rekonsiliasi-aset',
                                                //     query: { app: 4 },
                                                // });
                                            }}
                                            className={`uppercase whitespace-nowrap font-semibold p-4 flex-grow ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                            KIB A
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            onClick={() => {
                                                // router.push({
                                                //     pathname: '/accountancy/rekonsiliasi-aset',
                                                //     query: { app: 5 },
                                                // });
                                            }}
                                            className={`uppercase whitespace-nowrap font-semibold p-4 flex-grow ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                            KIB B
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            onClick={() => {
                                                // router.push({
                                                //     pathname: '/accountancy/rekonsiliasi-aset',
                                                //     query: { app: 6 },
                                                // });
                                            }}
                                            className={`uppercase whitespace-nowrap font-semibold p-4 flex-grow ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                            KIB C
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            onClick={() => {
                                                // router.push({
                                                //     pathname: '/accountancy/rekonsiliasi-aset',
                                                //     query: { app: 7 },
                                                // });
                                            }}
                                            className={`uppercase whitespace-nowrap font-semibold p-4 flex-grow ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                            KIB D
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            onClick={() => {
                                                // router.push({
                                                //     pathname: '/accountancy/rekonsiliasi-aset',
                                                //     query: { app: 8 },
                                                // });
                                            }}
                                            className={`uppercase whitespace-nowrap font-semibold p-4 flex-grow ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                            KIB E
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            onClick={() => {
                                                // router.push({
                                                //     pathname: '/accountancy/rekonsiliasi-aset',
                                                //     query: { app: 9 },
                                                // });
                                            }}
                                            className={`uppercase whitespace-nowrap font-semibold p-4 flex-grow ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                            KDP
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            onClick={() => {
                                                // router.push({
                                                //     pathname: '/accountancy/rekonsiliasi-aset',
                                                //     query: { app: 10 },
                                                // });
                                            }}
                                            className={`uppercase whitespace-nowrap font-semibold p-4 flex-grow ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                            Aset Tak Berwujud
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            onClick={() => {
                                                // router.push({
                                                //     pathname: '/accountancy/rekonsiliasi-aset',
                                                //     query: { app: 11 },
                                                // });
                                            }}
                                            className={`uppercase whitespace-nowrap font-semibold p-4 flex-grow ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                            Aset Lain-lain
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            onClick={() => {
                                                // router.push({
                                                //     pathname: '/accountancy/rekonsiliasi-aset',
                                                //     query: { app: 12 },
                                                // });
                                            }}
                                            className={`uppercase whitespace-nowrap font-semibold p-4 flex-grow ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                            Rekap Aset Lainnya
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            onClick={() => {
                                                // router.push({
                                                //     pathname: '/accountancy/rekonsiliasi-aset',
                                                //     query: { app: 13 },
                                                // });
                                            }}
                                            className={`uppercase whitespace-nowrap font-semibold p-4 flex-grow ${selected ? '!border-white-light !border-b-white  text-primary bg-primary-light !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent hover:text-primary`}>
                                            Penyusutan
                                        </button>
                                    )}
                                </Tab>
                            </Tab.List>

                            <Tab.Panels>
                                <Tab.Panel>
                                    <div className="pt-5">
                                        {(isMounted && instances.length > 0) && (
                                            <Rekap data={isMounted && [instances, arrKodeRekening, instance, year]}
                                                key={[year, instance]}
                                            />
                                        )}
                                    </div>
                                </Tab.Panel>

                                <Tab.Panel>
                                    <div className="pt-5">
                                        {(isMounted && instances.length > 0) && (
                                            <RekapOPD data={isMounted && [instances, arrKodeRekening, instance, year]}
                                                key={[year, instance]}
                                            />
                                        )}
                                    </div>
                                </Tab.Panel>

                                <Tab.Panel>
                                    <div className="pt-5">
                                        {(isMounted && instances.length > 0) && (
                                            <RekapAsetTetap data={isMounted && [instances, arrKodeRekening, instance, year]}
                                                key={[year, instance]}
                                            />
                                        )}
                                    </div>
                                </Tab.Panel>

                                <Tab.Panel>
                                    <div className="pt-5">
                                        {(isMounted && instances.length > 0) && (
                                            <RekapBelanja data={isMounted && [instances, arrKodeRekening, instance, year]}
                                                key={[year, instance]}
                                            />
                                        )}
                                    </div>
                                </Tab.Panel>

                                <Tab.Panel>
                                    <div className="active pt-5">
                                        {(isMounted && instances.length > 0) && (
                                            <KIB_A data={isMounted && [instances, arrKodeRekening, instance, year]}
                                                key={[year, instance]}
                                            />
                                        )}
                                    </div>
                                </Tab.Panel>

                                <Tab.Panel>
                                    <div className="pt-5">
                                        {(isMounted && instances.length > 0) && (
                                            <KIB_B data={isMounted && [instances, arrKodeRekening, instance, year]}
                                                key={[year, instance]}
                                            />
                                        )}
                                    </div>
                                </Tab.Panel>

                                <Tab.Panel>
                                    <div className="pt-5">
                                        {(isMounted && instances.length > 0) && (
                                            <KIB_C data={isMounted && [instances, arrKodeRekening, instance, year]}
                                                key={[year, instance]}
                                            />
                                        )}
                                    </div>
                                </Tab.Panel>

                                <Tab.Panel>
                                    <div className="pt-5">
                                        {(isMounted && instances.length > 0) && (
                                            <KIB_D data={isMounted && [instances, arrKodeRekening, instance, year]}
                                                key={[year, instance]}
                                            />
                                        )}
                                    </div>
                                </Tab.Panel>

                                <Tab.Panel>
                                    <div className="pt-5">
                                        {(isMounted && instances.length > 0) && (
                                            <KIB_E data={isMounted && [instances, arrKodeRekening, instance, year]}
                                                key={[year, instance]}
                                            />
                                        )}
                                    </div>
                                </Tab.Panel>

                                <Tab.Panel>
                                    <div className="pt-5">
                                        {(isMounted && instances.length > 0) && (
                                            <KDP data={isMounted && [instances, arrKodeRekening, instance, year]}
                                                key={[year, instance]}
                                            />
                                        )}
                                    </div>
                                </Tab.Panel>

                                <Tab.Panel>
                                    <div className="pt-5">
                                        {(isMounted && instances.length > 0) && (
                                            <AsetTakBerwujud data={isMounted && [instances, arrKodeRekening, instance, year]}
                                                key={[year, instance]}
                                            />
                                        )}
                                    </div>
                                </Tab.Panel>

                                <Tab.Panel>
                                    <div className="pt-5">
                                        {(isMounted && instances.length > 0) && (
                                            <AsetLainLain data={isMounted && [instances, arrKodeRekening, instance, year]}
                                                key={[year, instance]}
                                            />
                                        )}
                                    </div>
                                </Tab.Panel>

                                <Tab.Panel>
                                    <div className="pt-5">
                                        {(isMounted && instances.length > 0) && (
                                            <RekapAsetLainnya data={isMounted && [instances, arrKodeRekening, instance, year]}
                                                key={[year, instance]}
                                            />
                                        )}
                                    </div>
                                </Tab.Panel>

                                <Tab.Panel>
                                    <div className="pt-5">
                                        {(isMounted && instances.length > 0) && (
                                            <Penyusutan data={isMounted && [instances, arrKodeRekening, instance, year]}
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
        </>
    );
}
export default Page;
