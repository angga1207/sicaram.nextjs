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
import { faThList } from '@fortawesome/free-solid-svg-icons';
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import { GlobalEndPoint } from '@/apis/serverConfig';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import ImportSaldoAwal from '@/components/Accountancy/AdminOnly/ImportSaldoAwal';

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
        dispatch(setPageTitle('Admin Only'));
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
        if (isMounted && arrKodeRekening?.length === 0) {
            // GlobalEndPoint('kode_rekening', 'where|code_6|!=|null').then((res: any) => {
            //     if (res.status === 'success') {
            //         setArrKodeRekening(res.data);
            //     }
            // });
            GlobalEndPoint('kode_rekening', ['where|code_1|=|5', 'where|code_6|!=|null']).then((res: any) => {
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
                        Admin Only
                        <br />
                        {instances?.find((i: any) => i.id == instance)?.name ?? ``}
                    </h2>

                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                        {[1, 12].includes(CurrentUser?.role_id) && (
                            <div className="">
                                <Select placeholder="Pilih Perangkat Daerah"
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
            </div>
            <div className="panel px-0">
                <Tab.Group>
                    <div className="mx-5 mb-5 sm:mb-0 flex flex-col lg:flex-row gap-5">
                        <Tab.List className="lg:m-auto w-full lg:!min-w-[250px] lg:!max-w-[250px] flex flex-row lg:flex-col justify-start items-start">
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`${selected ? '!bg-primary text-white !outline-none font-semibold' : ''} before:inline-block -mb-[1px] block border border-white-light p-3.5 py-2 hover:bg-primary hover:text-white dark:border-[#191e3a] w-full`}>
                                        IMPORT SALDO AWAL REKON ASET
                                    </button>
                                )}
                            </Tab>
                        </Tab.List>
                        <Tab.Panels className="border p-4 flex-grow">
                            <Tab.Panel>
                                <div className="active">
                                    {(isMounted && instances.length > 0) && (
                                        <ImportSaldoAwal
                                            data={isMounted && [instances, arrKodeRekening, periode, year, instance]}
                                            key={[year, instance]}
                                        />
                                    )}
                                </div>
                            </Tab.Panel>
                        </Tab.Panels>
                    </div>
                </Tab.Group>
            </div>
        </>
    );
}

export default Page;
