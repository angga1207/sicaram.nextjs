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
// import Spline from '@splinetool/react-spline';

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
        <div className='relative'>
            {/* <div className="absolute w-full h-full items-center justify-center">
                <Spline className='w-full h-full'
                    scene="https://prod.spline.design/7pfuHjSLixtGtJxw/scene.splinecode"
                />
            </div> */}

            <div className="flex items-center justify-center">
                <div className="text-center">
                    <h1 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
               bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500
               bg-clip-text text-transparent drop-shadow-sm">
                        Menu Akuntansi
                    </h1>
                    <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500"></div>
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Kelola jurnal, buku besar, dan laporan secara terpadu.</p>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex items-center justify-center gap-x-6 gap-y-4 flex-wrap">

                    {([1, 2, 4, 12].includes(CurrentUser?.role_id)) && (
                        <Tippy content="Unggah Berkas dari SIPD" placement='bottom'>
                            <Link
                                href="/accountancy/import"
                                className="w-full lg:w-[350px] cursor-pointer group transition-all duration-500">

                                <Player
                                    autoplay
                                    loop
                                    src="/lottie/accountant-8.json"
                                    className='w-[100%] h-[200px] group-hover:scale-125 transition-all duration-500'
                                >
                                </Player>
                                <div className="mt-2 text-center text-lg uppercase font-semibold">
                                    Unggah Berkas dari SIPD
                                </div>
                            </Link>
                        </Tippy>
                    )}

                    <Tippy content="Rekonsiliasi Aset" placement='bottom'>
                        <Link
                            href="/accountancy/rekonsiliasi-aset"
                            className="w-full lg:w-[350px] cursor-pointer group transition-all duration-500">

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
                            className="w-full lg:w-[350px] cursor-pointer group transition-all duration-500">
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
                            className="w-full lg:w-[350px] cursor-pointer group transition-all duration-500">

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
                            className="w-full lg:w-[350px] cursor-pointer group transition-all duration-500">

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

                    <Tippy content="Utang Belanja" placement='bottom' theme='default'>
                        <Link
                            href="/accountancy/hutang-belanja"
                            className="w-full lg:w-[350px] cursor-pointer group transition-all duration-500">

                            <Player
                                autoplay
                                loop
                                src="/lottie/accountant-9.json"
                                className='w-[100%] h-[200px] group-hover:scale-125 transition-all duration-500'
                            >
                            </Player>
                            <div className="mt-2 text-center text-lg uppercase font-semibold">
                                Utang Belanja
                            </div>
                        </Link>
                    </Tippy>

                    <Tippy content="Beban Laporan Operasional" placement='bottom'>
                        <Link
                            href="/accountancy/beban-laporan-operasional"
                            className="w-full lg:w-[350px] cursor-pointer group transition-all duration-500">

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

                    <Tippy content="Pendapatan LO (Piutang & PDD)" placement='bottom'>
                        <Link
                            href="/accountancy/piutang-pdd"
                            className="w-full lg:w-[350px] cursor-pointer group transition-all duration-500">

                            <Player
                                autoplay
                                loop
                                src="/lottie/accountant-7.json"
                                className='w-[100%] h-[200px] group-hover:scale-125 transition-all duration-500'
                            >
                            </Player>
                            <div className="mt-2 text-center text-lg uppercase font-semibold">
                                Pendapatan LO <br /> (Piutang & PDD)
                            </div>
                        </Link>
                    </Tippy>

                    {/* <Tippy content="Unggah Saldo Awal Neraca & LO" placement='bottom'>
                        <Link
                            href="/accountancy/import"
                            className="w-full lg:w-[350px] cursor-pointer group transition-all duration-500">

                            <Player
                                autoplay
                                loop
                                src="/lottie/accountant-10.json"
                                className='w-[100%] h-[200px] group-hover:scale-125 transition-all duration-500'
                            >
                            </Player>
                            <div className="mt-2 text-center text-lg uppercase font-semibold">
                                Unggah Saldo Awal Neraca & LO
                            </div>
                        </Link>
                    </Tippy> */}

                    <Tippy content="Laporan Akuntansi" placement='bottom'>
                        <Link
                            href="/accountancy/report"
                            className="w-full lg:w-[350px] cursor-pointer group transition-all duration-500">

                            <Player
                                autoplay
                                loop
                                src="/lottie/accountant-11.json"
                                className='w-[100%] h-[200px] group-hover:scale-125 transition-all duration-500'
                            >
                            </Player>
                            <div className="mt-2 text-center text-lg uppercase font-semibold">
                                Laporan Akuntansi
                            </div>
                        </Link>
                    </Tippy>

                    {/* <Tippy content="Admin Only" placement='bottom' theme='default'>
                        <Link
                            href="/accountancy/admin-only"
                            className="w-full lg:w-[350px] cursor-pointer group transition-all duration-500">

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
                    </Tippy> */}

                </div>
            </div>
        </div>
    );
}
export default Page;
