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
import { faList12, faThList } from '@fortawesome/free-solid-svg-icons';
import { Player, Controls } from '@lottiefiles/react-lottie-player';

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
        dispatch(setPageTitle('Akuntansi'));
    });

    const ref = useRef<any>(null);

    const [isMounted, setIsMounted] = useState(false);
    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null)

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

    return (
        <div>
            <div className="flex items-center justify-center">
                {/* <FontAwesomeIcon icon={faList12} className='w-6 h-6 mr-1' /> */}
                <div className="font-semibold text-xl uppercase">
                    Menu Akuntansi
                    <span className='dots-loading'>
                        ...
                    </span>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex items-center justify-center gap-x-6 gap-y-4 flex-wrap">

                    <Tippy content="Import & Detail LRA" placement='bottom'>
                        <Link
                            href="/accountancy/import-lra"
                            className="panel w-full lg:w-[400px] cursor-pointer group hover:shadow-lg transition-all duration-500">

                            <Player
                                autoplay
                                loop
                                src="/lottie/accountant-8.json"
                                className='w-[100%] h-[200px] group-hover:scale-125 transition-all duration-500'
                            >
                            </Player>
                            <div className="mt-2 text-center text-lg uppercase font-semibold">
                                Import & Detail LRA
                            </div>
                        </Link>
                    </Tippy>

                    <Tippy content="Rekonsiliasi Aset" placement='bottom'>
                        <Link
                            href="/accountancy/rekonsiliasi-aset"
                            className="panel w-full lg:w-[400px] cursor-pointer group hover:shadow-lg transition-all duration-500">

                            <Player
                                autoplay
                                loop
                                src="/lottie/accountant-1.json"
                                className='w-[100%] h-[200px] group-hover:scale-125 transition-all duration-500'
                            >
                            </Player>
                            <div className="mt-2 text-center text-lg uppercase font-semibold">
                                Rekonsiliasi Aset
                            </div>
                        </Link>
                    </Tippy>

                    <Tippy content="Penyesuaian Aset dan Beban" placement='bottom'>
                        <Link
                            href="/accountancy/penyesuaian-aset-beban"
                            className="panel w-full lg:w-[400px] cursor-pointer group hover:shadow-lg transition-all duration-500">
                            <Player
                                autoplay
                                loop
                                src="/lottie/accountant-2.json"
                                className='w-[100%] h-[200px] group-hover:scale-125 transition-all duration-500'
                            >
                            </Player>
                            <div className="mt-2 text-center text-lg uppercase font-semibold">
                                Penyesuaian Aset dan Beban
                            </div>
                        </Link>
                    </Tippy>

                    <Tippy content="Belanja Bayar Dimuka" placement='bottom'>
                        <Link
                            href="/accountancy/belanja-bayar-dimuka"
                            className="panel w-full lg:w-[400px] cursor-pointer group hover:shadow-lg transition-all duration-500">

                            <Player
                                autoplay
                                loop
                                src="/lottie/accountant-5.json"
                                className='w-[100%] h-[200px] group-hover:scale-125 transition-all duration-500'
                            >
                            </Player>
                            <div className="mt-2 text-center text-lg uppercase font-semibold">
                                Belanja Bayar Dimuka
                            </div>
                        </Link>
                    </Tippy>

                    <Tippy content="Persediaan" placement='bottom' theme='default'>
                        <Link
                            href="/accountancy/persediaan"
                            className="panel w-full lg:w-[400px] cursor-pointer group hover:shadow-lg transition-all duration-500">

                            <Player
                                autoplay
                                loop
                                src="/lottie/accountant-3.json"
                                className='w-[100%] h-[200px] group-hover:scale-125 transition-all duration-500'
                            >
                            </Player>
                            <div className="mt-2 text-center text-lg uppercase font-semibold">
                                Persediaan
                            </div>
                        </Link>
                    </Tippy>

                    <Tippy content="Hutang Belanja" placement='bottom' theme='default'>
                        <Link
                            href="/accountancy/hutang-belanja"
                            className="panel w-full lg:w-[400px] cursor-pointer group hover:shadow-lg transition-all duration-500">

                            <Player
                                autoplay
                                loop
                                src="/lottie/accountant-9.json"
                                className='w-[100%] h-[200px] group-hover:scale-125 transition-all duration-500'
                            >
                            </Player>
                            <div className="mt-2 text-center text-lg uppercase font-semibold">
                                Hutang Belanja
                            </div>
                        </Link>
                    </Tippy>

                    <Tippy content="Beban Laporan Operasional" placement='bottom' theme='danger'>
                        <Link
                            href="#"
                            className="panel w-full lg:w-[400px] cursor-pointer group hover:shadow-lg transition-all duration-500">

                            <Player
                                autoplay
                                loop
                                src="/lottie/accountant-6.json"
                                className='w-[100%] h-[200px] group-hover:scale-125 transition-all duration-500'
                            >
                            </Player>
                            <div className="mt-2 text-center text-lg uppercase font-semibold">
                                Beban Laporan Operasional
                            </div>
                        </Link>
                    </Tippy>

                    <Tippy content="Pendapatan LRA LO" placement='bottom' theme='danger'>
                        <Link
                            href="#"
                            className="panel w-full lg:w-[400px] cursor-pointer group hover:shadow-lg transition-all duration-500">

                            <Player
                                autoplay
                                loop
                                src="/lottie/accountant-7.json"
                                className='w-[100%] h-[200px] group-hover:scale-125 transition-all duration-500'
                            >
                            </Player>
                            <div className="mt-2 text-center text-lg uppercase font-semibold">
                                Pendapatan LRA LO <br /> (Piutang & PDD)
                            </div>
                        </Link>
                    </Tippy>

                    <Tippy content="Admin Only" placement='bottom' theme='default'>
                        <Link
                            href="/accountancy/admin-only"
                            className="panel w-full lg:w-[400px] cursor-pointer group hover:shadow-lg transition-all duration-500">

                            <Player
                                autoplay
                                loop
                                src="/lottie/sicaram.json"
                                className='w-[100%] h-[200px] group-hover:scale-125 transition-all duration-500'
                            >
                            </Player>
                            <div className="mt-2 text-center text-lg uppercase font-semibold">
                                Admin Only
                            </div>
                        </Link>
                    </Tippy>

                </div>
            </div>
        </div>
    );
}
export default Page;
