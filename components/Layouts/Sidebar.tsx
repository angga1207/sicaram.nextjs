import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import IconCaretsDown from '../../components/Icon/IconCaretsDown';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconMinus from '../../components/Icon/IconMinus';
import IconMenuUsers from '../../components/Icon/Menu/IconMenuUsers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faCartShopping, faCircleDollarToSlot, faClipboardCheck, faCloudUploadAlt, faDashboard, faDollarSign, faEnvelopeOpenText, faFileContract, faFileInvoice, faFileInvoiceDollar, faHome, faHomeAlt, faHomeUser, faIndent, faMoneyBills, faNetworkWired, faSitemap, faSync, faSyncAlt, faTag, faTags, faTree, faTreeCity } from '@fortawesome/free-solid-svg-icons';
import { faMoneyBillAlt, faRegistered } from '@fortawesome/free-regular-svg-icons';
import { faRust } from '@fortawesome/free-brands-svg-icons';
import Tippy from '@tippyjs/react';
import { useSession } from 'next-auth/react';

const Sidebar = () => {
    const APP_VERSION = "2.6b.3";
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const router = useRouter();
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    const [CurrentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }

        if (document.cookie) {
            let user = document.cookie.split(';').find((row) => row.trim().startsWith('user='))?.split('=')[1];
            if (user) {
                user = user ? JSON.parse(user) : null;
                setCurrentUser(user);
            }
        }
    }, []);

    useEffect(() => {
        setActiveRoute();
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [router.pathname]);

    const setActiveRoute = () => {
        let allLinks = document.querySelectorAll('.sidebar ul a.active');
        for (let i = 0; i < allLinks.length; i++) {
            const element = allLinks[i];
            element?.classList.remove('active');
        }
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        selector?.classList.add('active');
    };

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [isAuth, setIsAuth] = useState(false);
    const session = useSession();
    useEffect(() => {
        if (session) {
            const token = session.data?.user?.name;
            if (session.status == 'authenticated' && token) {
                setIsAuth(true);
            }
        }
    }, [isMounted, session]);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="bg-white h-full dark:bg-black">
                    <div className="flex justify-between group items-center px-4 py-3">
                        <Link href="/" className="flex items-center main-logo shrink-0">
                            <img className="flex-none h-10 w-10 animate-bounce delay-100 ml-[5px] object-contain" src="/assets/images/logo-caram.png" alt="logo" />
                            <span className="align-middle text-xl dark:text-white-light font-bold lg:inline ltr:ml-1.5 rtl:mr-1.5">{t('SICARAM')}</span>
                        </Link>

                        <button
                            type="button"
                            className="collapse-icon flex h-8 rounded-full w-8 dark:hover:bg-dark-light/10 dark:text-white-light duration-300 hover:bg-gray-500/10 items-center rtl:rotate-180 transition"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="h-[calc(100vh-100px)] relative">
                        {isAuth ? (
                            <ul className="p-4 font-semibold py-0 relative space-y-0.5">

                                {CurrentUser?.role_id === 9 && (
                                    <li className="nav-item menu">
                                        <Link href="/dashboard/pd" className="group">
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faHomeUser} className='group-hover:!text-primary shrink-0' />
                                                <span className="text-black dark:group-hover:text-white-dark dark:text-[#506690] ltr:pl-3 rtl:pr-3">
                                                    Dashboard
                                                </span>
                                            </div>
                                        </Link>
                                    </li>
                                )}

                                {CurrentUser?.role_id !== 9 && (
                                    <li className="nav-item menu">
                                        <button type="button" className={`${currentMenu === 'dashboard' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('dashboard')}>
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faHomeUser} className='group-hover:!text-primary shrink-0' />
                                                <span className="text-black dark:group-hover:text-white-dark dark:text-[#506690] ltr:pl-3 rtl:pr-3">
                                                    Dashboard
                                                </span>
                                            </div>
                                            <div className={currentMenu !== 'dashboard' ? '-rotate-90 rtl:rotate-90' : ''}>
                                                <IconCaretDown />
                                            </div>
                                        </button>

                                        <AnimateHeight duration={300} height={currentMenu === 'dashboard' ? 'auto' : 0}>
                                            <ul className="text-gray-500 sub-menu">
                                                <li>
                                                    <Link href="/dashboard">
                                                        Dashboard
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className='text-xs' href="/dashboard/capaian-keuangan">
                                                        Capaian Keuangan
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className='text-xs' href="/dashboard/capaian-kinerja">
                                                        Capaian Kinerja
                                                    </Link>
                                                </li>
                                            </ul>
                                        </AnimateHeight>
                                    </li>
                                )}


                                {/* Start Here */}

                                {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].includes(CurrentUser?.role_id)) && (
                                    <>
                                        {/* <h2 className="flex bg-white-light/30 -mx-4 dark:bg-dark dark:bg-opacity-[0.08] font-extrabold items-center mb-1 px-7 py-3 uppercase">
                                        <IconMinus className="flex-none h-5 w-4 hidden" />
                                        <span>
                                            Master Data
                                        </span>
                                    </h2> */}

                                        {([1, 9].includes(CurrentUser?.role_id)) && (
                                            <li className="nav-item menu">
                                                <Link href="/Menu/MasterData" className="group">
                                                    <div className="flex items-center">
                                                        <FontAwesomeIcon icon={faSitemap} className='group-hover:!text-primary shrink-0' />
                                                        <span className="text-black dark:group-hover:text-white-dark dark:text-[#506690] ltr:pl-3 rtl:pr-3">
                                                            Master Data
                                                        </span>
                                                    </div>
                                                </Link>
                                            </li>
                                        )}


                                        {([1, 2, 3, 4, 5, 10].includes(CurrentUser?.role_id)) && (
                                            <li className="nav-item menu">
                                                <button type="button" className={`${currentMenu === 'lpse' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('lpse')}>
                                                    <div className="flex items-center">
                                                        <FontAwesomeIcon icon={faNetworkWired} className='group-hover:!text-primary shrink-0' />
                                                        <span className="text-black dark:group-hover:text-white-dark dark:text-[#506690] ltr:pl-3 rtl:pr-3">
                                                            LPSE
                                                        </span>
                                                    </div>
                                                    <div className={currentMenu !== 'lpse' ? '-rotate-90 rtl:rotate-90' : ''}>
                                                        <IconCaretDown />
                                                    </div>
                                                </button>

                                                <AnimateHeight duration={300} height={currentMenu === 'lpse' ? 'auto' : 0}>
                                                    <ul className="text-gray-500 sub-menu">
                                                        <li>
                                                            <Link href="/lpse">
                                                                Dashboard
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link
                                                                href="/lpse/penyedia"
                                                                className='text-xs'>
                                                                Paket Penyedia Terumumkan
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link
                                                                href="/lpse/swakelola"
                                                                className='text-xs'>
                                                                Paket Swakelola Terumumkan
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </AnimateHeight>
                                            </li>
                                        )}

                                        {([1, 2, 3, 4, 5, 6, 7, 8, 9].includes(CurrentUser?.role_id)) && (
                                            <>
                                                <h2 className="flex bg-white-light/30 -mx-4 dark:bg-dark dark:bg-opacity-[0.08] font-extrabold items-center mb-1 px-7 py-3 uppercase">
                                                    <IconMinus className="flex-none h-5 w-4 hidden" />
                                                    <span>
                                                        REALISASI
                                                    </span>
                                                </h2>
                                                <li className="nav-item menu">
                                                    <Link href="/kinerja" className="group">
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon icon={faEnvelopeOpenText} className='group-hover:!text-primary shrink-0' />
                                                            <span className="text-black dark:group-hover:text-white-dark dark:text-[#506690] ltr:pl-3 rtl:pr-3">
                                                                Realisasi Program
                                                            </span>
                                                        </div>
                                                    </Link>
                                                </li>
                                                {([1, 2, 3, 6].includes(CurrentUser?.role_id)) && (
                                                    <li className="nav-item menu">
                                                        <Link href="/realisasi/tujuan-sasaran" className="group">
                                                            <div className="flex items-center">
                                                                <FontAwesomeIcon icon={faEnvelopeOpenText} className='group-hover:!text-primary shrink-0' />
                                                                <span className="text-black dark:group-hover:text-white-dark dark:text-[#506690] ltr:pl-3 rtl:pr-3">
                                                                    Realisasi Tujuan Sasaran
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                )}
                                                {([1, 2, 3, 6, 9].includes(CurrentUser?.role_id)) && (
                                                    <li className="nav-item menu">
                                                        <Link href="/realisasi/tujuan-sasaran-perangkat-daerah" className="group">
                                                            <div className="flex items-center">
                                                                <FontAwesomeIcon icon={faEnvelopeOpenText} className='group-hover:!text-primary shrink-0' />
                                                                <span className={`text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark ${([1, 2, 3, 6].includes(CurrentUser?.role_id)) ? "text-xs whitespace-normal" : ""}`}>
                                                                    Realisasi Tujuan Sasaran
                                                                    {([1, 2, 3, 6].includes(CurrentUser?.role_id)) ? " Perangkat Daerah" : ""}
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                )}
                                                {([1, 9].includes(CurrentUser?.role_id)) && (
                                                    <li className="nav-item menu">
                                                        <Link href="/realisasi/import" className="group">
                                                            <div className="flex items-center">
                                                                <FontAwesomeIcon icon={faCloudUploadAlt} className='group-hover:!text-primary shrink-0' />
                                                                <span className={`text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark ${([1, 2, 3, 6].includes(CurrentUser?.role_id)) ? "text-xs whitespace-normal" : ""}`}>
                                                                    Unggah Realisasi
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                )}
                                            </>
                                        )}

                                        {([1, 2, 3].includes(CurrentUser?.role_id)) && (
                                            <>
                                                <h2 className="flex bg-white-light/30 -mx-4 dark:bg-dark dark:bg-opacity-[0.08] font-extrabold items-center mb-1 px-7 py-3 uppercase">
                                                    <IconMinus className="flex-none h-5 w-4 hidden" />
                                                    <span>
                                                        BAPPEDA
                                                    </span>
                                                </h2>

                                                {([1, 2, 3].includes(CurrentUser?.role_id)) && (
                                                    <li className="nav-item menu">
                                                        <Link href="/bappeda" className="group">
                                                            <div className="flex items-center">
                                                                <FontAwesomeIcon icon={faTreeCity} className='group-hover:!text-primary shrink-0' />
                                                                <span className="text-black dark:group-hover:text-white-dark dark:text-[#506690] ltr:pl-3 rtl:pr-3">
                                                                    BAPPEDA Section
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                )}
                                            </>
                                        )}

                                        {([1, 2, 4, 9, 12].includes(CurrentUser?.role_id)) && (
                                            <>
                                                <h2 className="flex bg-white-light/30 -mx-4 dark:bg-dark dark:bg-opacity-[0.08] font-extrabold items-center mb-1 px-7 py-3 uppercase">
                                                    <IconMinus className="flex-none h-5 w-4 hidden" />
                                                    <span>
                                                        BPKAD
                                                    </span>
                                                </h2>

                                                {([1, 2, 4].includes(CurrentUser?.role_id)) && (
                                                    <li className="nav-item menu">
                                                        <Link href="/bpkad" className="group">
                                                            <div className="flex items-center">
                                                                <FontAwesomeIcon icon={faMoneyBillAlt} className='group-hover:!text-primary shrink-0' />
                                                                <span className="text-black dark:group-hover:text-white-dark dark:text-[#506690] ltr:pl-3 rtl:pr-3">
                                                                    BPKAD Section
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                )}

                                                {([1, 2, 4, 9, 12].includes(CurrentUser?.role_id)) && (
                                                    <li className="nav-item menu">
                                                        <Link href="/accountancy" className="group">
                                                            <div className="flex items-center">
                                                                <FontAwesomeIcon icon={faMoneyBills} className='group-hover:!text-primary shrink-0' />
                                                                <span className="text-black dark:group-hover:text-white-dark dark:text-[#506690] ltr:pl-3 rtl:pr-3">
                                                                    Akuntansi
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                )}
                                            </>
                                        )}

                                        <h2 className="flex bg-white-light/30 -mx-4 dark:bg-dark dark:bg-opacity-[0.08] font-extrabold items-center mb-1 px-7 py-3 uppercase">
                                            <IconMinus className="flex-none h-5 w-4 hidden" />
                                            <span>
                                                Report System
                                            </span>
                                        </h2>
                                        <li className="nav-item menu">
                                            <Link href="/report" className="group">
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faClipboardCheck} className='group-hover:!text-primary shrink-0' />
                                                    <span className="text-black dark:group-hover:text-white-dark dark:text-[#506690] ltr:pl-3 rtl:pr-3">
                                                        Laporan
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                        {([1, 4, 9, 12].includes(CurrentUser?.role_id)) && (
                                            <li className="nav-item menu">
                                                <Link href="/accountancy/report" className="group">
                                                    <div className="flex items-center">
                                                        <FontAwesomeIcon icon={faClipboardCheck} className='group-hover:!text-primary shrink-0' />
                                                        <span className="text-black dark:group-hover:text-white-dark dark:text-[#506690] ltr:pl-3 rtl:pr-3">
                                                            Akuntansi
                                                        </span>
                                                    </div>
                                                </Link>
                                            </li>
                                        )}

                                        {([1, 2, 3, 4, 5, 9].includes(CurrentUser?.role_id)) && (
                                            <>
                                                <h2 className="flex bg-white-light/30 -mx-4 dark:bg-dark dark:bg-opacity-[0.08] font-extrabold items-center mb-1 px-7 py-3 uppercase">
                                                    <IconMinus className="flex-none h-5 w-4 hidden" />
                                                    <span>
                                                        Manajemen
                                                    </span>
                                                </h2>

                                                <li className="nav-item menu">
                                                    <button type="button" className={`${currentMenu === 'user-management' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('user-management')}>
                                                        <div className="flex items-center">
                                                            <IconMenuUsers className="group-hover:!text-primary shrink-0" />
                                                            <span className="text-black dark:group-hover:text-white-dark dark:text-[#506690] ltr:pl-3 rtl:pr-3">
                                                                Manajemen Pengguna
                                                            </span>
                                                        </div>
                                                        <div className={currentMenu !== 'user-management' ? '-rotate-90 rtl:rotate-90' : ''}>
                                                            <IconCaretDown />
                                                        </div>
                                                    </button>

                                                    <AnimateHeight duration={300} height={currentMenu === 'user-management' ? 'auto' : 0}>
                                                        <ul className="text-gray-500 sub-menu">
                                                            {([1, 2, 3, 4, 5, 9].includes(CurrentUser?.role_id)) && (
                                                                <li>
                                                                    <Link href="/users">
                                                                        Daftar Pengguna
                                                                    </Link>
                                                                </li>
                                                            )}
                                                            {([1].includes(CurrentUser?.role_id)) && (
                                                                <li>
                                                                    <Link href="/roles">
                                                                        Peran Pengguna
                                                                    </Link>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </AnimateHeight>
                                                </li>
                                            </>
                                        )}

                                        {([1, 2, 3, 4, 5].includes(CurrentUser?.role_id)) && (
                                            <li className="nav-item menu">
                                                <Link href="/instances" className="group">
                                                    <div className="flex items-center">
                                                        <FontAwesomeIcon icon={faBriefcase} className='group-hover:!text-primary shrink-0' />
                                                        <span className="text-black dark:group-hover:text-white-dark dark:text-[#506690] ltr:pl-3 rtl:pr-3">
                                                            Perangkat Daerah
                                                        </span>
                                                    </div>
                                                </Link>
                                            </li>
                                        )}
                                    </>
                                )}
                                {/* End Here */}
                            </ul>
                        ) : (
                            <>
                                <ul className="p-4 font-semibold py-0 relative space-y-0.5">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((item, index) => (
                                        <li
                                            key={`item-sidebar-${index}`}
                                            className="nav-item menu">
                                            <Link href="#" className="group">
                                                <div className="flex w-full gap-x-2 items-center">
                                                    <div className="bg-slate-200 h-7 rounded-full w-9 animate-pulse grow"></div>
                                                    <div className="bg-slate-200 h-7 rounded w-full animate-pulse grow-0"></div>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}

                                </ul>
                            </>
                        )}
                    </PerfectScrollbar>

                    <div className="pt-2 px-2">
                        <Tippy content="Versi Aplikasi">
                            <div className="text-center text-xs cursor-pointer duration-300 font-semibold hover:text-primary transition-all truncate">
                                V. {APP_VERSION}
                            </div>
                        </Tippy>
                    </div>

                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
