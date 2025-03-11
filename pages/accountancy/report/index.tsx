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
import { faClipboardCheck, faCloudDownloadAlt, faCloudUploadAlt, faSave, faThList, faUndo } from '@fortawesome/free-solid-svg-icons';
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import { GlobalEndPoint } from '@/apis/serverConfig';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconMenu from '@/components/Icon/IconMenu';
import Neraca from '@/components/Accountancy/Report/Neraca';
import LaporanOperasional from '@/components/Accountancy/Report/LaporanOperasional';
import LPE from '@/components/Accountancy/Report/LPE';
import LRA from '@/components/Accountancy/Report/LRA';


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
        dispatch(setPageTitle('Laporan Akuntansi'));
    });

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
    const [arrKodeRekening, setArrKodeRekening] = useState<any>([])
    const [levels, setLevels] = useState<any>([]);
    const [level, setLevel] = useState<any>(3);

    useEffect(() => {
        if (isMounted) {
            setLevels([
                {
                    label: '1 - Akun',
                    value: 1,
                },
                {
                    label: '2 - Kelompok',
                    value: 2,
                },
                {
                    label: '3 - Jenis',
                    value: 3,
                },
                {
                    label: '4 - Objek',
                    value: 4,
                },
                {
                    label: '5 - Rincian',
                    value: 5,
                },
                {
                    label: '6 - Sub Rincian',
                    value: 6,
                },
            ]);
        }
    }, [isMounted]);

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
                    let tempInstances = res.data;
                    tempInstances = tempInstances.map((row: any) => {
                        return {
                            id: row.id,
                            name: row.name,
                        };
                    });

                    // push KABUPATEN OGAN ILIR with id 0 at the first index
                    tempInstances.unshift({
                        id: 0,
                        name: 'KABUPATEN OGAN ILIR',
                    });

                    setInstances(tempInstances);
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

    const [isShowNoteMenu, setIsShowNoteMenu] = useState<any>(false);
    const [selectedTab, setSelectedTab] = useState<any>('lra');

    const tabChanged = (type: string) => {
        setSelectedTab(type);
        setIsShowNoteMenu(false);
    };

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
                                <FontAwesomeIcon icon={faClipboardCheck} className='w-6 h-6' />
                            </div>
                            <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">
                                Laporan Akuntansi
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
                                        <FontAwesomeIcon icon={faClipboardCheck} className='w-4 h-4' />
                                        <div className="ltr:ml-3 rtl:mr-3">
                                            Laporan LRA
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
                                        <FontAwesomeIcon icon={faClipboardCheck} className='w-4 h-4' />
                                        <div className="ltr:ml-3 rtl:mr-3">
                                            Laporan Neraca
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
                                        <FontAwesomeIcon icon={faClipboardCheck} className='w-4 h-4' />
                                        <div className="ltr:ml-3 rtl:mr-3">
                                            Laporan LO
                                        </div>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${selectedTab === 'lpe' && 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary'
                                        }`}
                                    onClick={() => tabChanged('lpe')}
                                >
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faClipboardCheck} className='w-4 h-4' />
                                        <div className="ltr:ml-3 rtl:mr-3">
                                            Laporan LPE
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </PerfectScrollbar>
                    </div>
                    <div className="absolute bottom-0 w-full p-4 ltr:left-0 rtl:right-0">
                        <Link href={`/accountancy`}
                            className="btn btn-secondary whitespace-nowrap text-xs">
                            <IconArrowBackward className="w-4 h-4" />
                            <span className="ltr:ml-2 rtl:mr-2">
                                Menu Akuntansi
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
                            <>
                                <div className="">

                                    {(isMounted && instances.length > 0) && (
                                        <LRA data={isMounted && [periode, year, instance, level, years, instances, levels]}
                                            key={[year, instance, level]}
                                        />
                                    )}
                                </div>
                            </>
                        )}

                        {selectedTab === 'neraca' && (
                            <>
                                <div className="">

                                    {(isMounted && instances.length > 0) && (
                                        <Neraca data={isMounted && [periode, year, instance, level, years, instances, levels]}
                                            key={[year, instance, level]}
                                        />
                                    )}
                                </div>
                            </>
                        )}

                        {selectedTab === 'lo' && (
                            <>
                                <div className="">
                                    {(isMounted && instances.length > 0) && (
                                        <LaporanOperasional data={isMounted && [periode, year, instance, level, years, instances, levels]}
                                            key={[year, instance, level]}
                                        />
                                    )}
                                </div>
                            </>
                        )}

                        {selectedTab === 'lpe' && (
                            <>
                                <div className="">
                                    {(isMounted && instances.length > 0) && (
                                        <LPE data={isMounted && [periode, year, instance, level, years, instances, levels]}
                                            key={[year, instance]}
                                        />
                                    )}
                                </div>
                            </>
                        )}

                    </div>

                </div>
            </div>
        </div>
    );
}

export default Page;
