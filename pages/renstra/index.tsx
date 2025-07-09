import { useEffect, useState, Fragment, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';
import Dropdown from '../../components/Dropdown';
import Swal from 'sweetalert2';
import Link from 'next/link';
import Select from 'react-select';
import AnimateHeight from 'react-animate-height';
import LoadingSicaram from '@/components/LoadingSicaram';

import { getMessaging, onMessage } from 'firebase/messaging';
import firebaseApp from '@/utils/firebase/firebase';

import IconEdit from '../../components/Icon/IconEdit';
import IconX from '../../components/Icon/IconX';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconSearch from '../../components/Icon/IconSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faArrowUp, faBusinessTime, faCalendarAlt, faCalendarPlus, faCheck, faCheckToSlot, faClipboardCheck, faCog, faEdit, faEnvelopeCircleCheck, faEye, faFlagCheckered, faReply, faReplyAll, faSave, faStopwatch20, faTimesCircle, faTrashAlt, faUser, faUserEdit } from '@fortawesome/free-solid-svg-icons';

import { fetchPeriodes, fetchInstances, fetchSatuans, fetchPrograms, fetchRenstra, fetchDetailRenstraKegiatan, fetchDetailRenstraSubKegiatan, fetchRenstraValidatorNotes } from '../../apis/fetchdata';
import { saveRenstraKegiatan, saveRenstraSubKegiatan, postRenstraNotes } from '../../apis/storedata';
import IconArrowLeft from '@/components/Icon/IconArrowLeft';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconSend from '@/components/Icon/IconSend';
import IconCalendar from '@/components/Icon/IconCalendar';
import IconUser from '@/components/Icon/IconUser';
import Page403 from '@/components/Layouts/Page403';
import { useRouter } from 'next/router';


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

    useEffect(() => {
        dispatch(setPageTitle('Renstra Induk'));
    });

    const [isMounted, setIsMounted] = useState(false);
    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null)

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

    const router = useRouter();

    const [instance, setInstance] = useState<any>(CurrentUser?.instance_id ?? null);
    const [instances, setInstances] = useState<any>([]);
    const [searchInstance, setSearchInstance] = useState('');

    useEffect(() => {
        if (CurrentUser?.instance_id) {
            setInstance(CurrentUser?.instance_id);
            router.query.instance = CurrentUser?.instance_id;
            router.push(`/renstra/${CurrentUser?.instance_id}`);
        }
    }, [isMounted, CurrentUser?.instance_id]);

    useEffect(() => {
        if (isMounted && CurrentUser) {
            fetchInstances(searchInstance).then((data) => {
                setInstances(data.data);
            });
        }
    }, [isMounted, CurrentUser]);

    useEffect(() => {
        if (searchInstance == '') {
            fetchInstances(searchInstance).then((data) => {
                setInstances(data.data);
            });
        } else {
            const instcs = instances.map((item: any) => {
                // filter instances by searchInstance
                if (item.name.toLowerCase().includes(searchInstance.toLowerCase())) {
                    return item;
                }
            }).filter((item: any) => item != undefined);
            setInstances(instcs);
        }
    }, [searchInstance]);

    if (CurrentUser?.role_id && [1, 2, 3, 6, 9].includes(CurrentUser?.role_id)) {
        return (
            <>

                <div className="">
                    <div className="flex flex-wrap gap-y-2 items-center justify-between mb-5">
                        <h2 className="text-xl leading-6 font-bold text-[#3b3f5c] dark:text-white-light xl:w-1/2 line-clamp-2 uppercase">
                            Renstra Induk <br />
                            {instances?.[instance - 1]?.name ?? '\u00A0'}
                        </h2>
                        <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">

                            {!instance ? (
                                <>
                                    <div className="relative">
                                        <input type="search"
                                            className="form-input sm:w-[300px] rtl:pl-12 ltr:pr-12"
                                            placeholder='Cari Perangkat Daerah...'
                                            onChange={(e) => setSearchInstance(e.target.value)}
                                        />
                                        <div className="absolute rtl:left-0 ltr:right-0 top-0 bottom-0 flex items-center justify-center w-12 h-full">
                                            <IconSearch className="w-4 h-4 text-slate-400"></IconSearch>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {(CurrentUser?.role_id == 1 || CurrentUser?.role_id == 2 || CurrentUser?.role_id == 3 || CurrentUser?.role_id == 4 || CurrentUser?.role_id == 5 || CurrentUser?.role_id == 6 || CurrentUser?.role_id == 7 || CurrentUser?.role_id == 8) && (
                                        <>
                                            <button
                                                type="button"
                                                className="btn btn-secondary whitespace-nowrap"
                                                // onClick={() => backToInstances()}
                                            >
                                                <IconArrowBackward className="w-4 h-4" />
                                                <span className="ltr:ml-2 rtl:mr-2">
                                                    Kembali
                                                </span>
                                            </button>
                                        </>
                                    )}

                                </>
                            )}

                        </div>

                    </div>
                </div>

                {!instance && (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4 font-semibold dark:text-white-dark mb-7">
                        {instances?.map((data: any, index: number) => (
                            <Tippy content={data.name} placement="top">
                                <Link
                                    href={`/renstra/${data.id}`}
                                    className="panel h-[84px] p-2.5 rounded-md flex items-center group cursor-pointer hover:bg-primary-light"
                                // onClick={(e) => {
                                //     pickInstance(data?.id)
                                // }}
                                >
                                    <div className="w-20 h-[84px] -m-2.5 ltr:mr-4 rtl:ml-4 ltr:rounded-l-md rtl:rounded-r-md transition-all duration-700 group-hover:scale-110 bg-slate-200 flex-none">
                                        <img src={data?.logo ?? "/assets/images/logo-caram.png"} alt="logo" className='w-full h-full object-contain p-2' />
                                    </div>
                                    <div className='group-hover:text-primary'>
                                        <h5 className="text-sm sm:text-base line-clamp-3">{data.name}</h5>
                                    </div>
                                </Link>
                            </Tippy >
                        ))}
                    </div>
                )}

                {!instance && instances?.length == 0 && (
                    <>
                        <div className="w-full h-[calc(100vh-300px)] flex flex-col items-center justify-center">
                            {LoadingSicaram()}
                            <div className="dots-loading text-xl">Memuat Perangkat Daerah...</div>
                        </div>
                    </>
                )}
            </>
        );
    }
    return (
        <Page403 />
    );
}

export default Index;
