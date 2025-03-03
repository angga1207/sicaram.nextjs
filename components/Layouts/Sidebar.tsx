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
import { faBriefcase, faCartShopping, faCircleDollarToSlot, faClipboardCheck, faCloudUploadAlt, faDashboard, faDollarSign, faEnvelopeOpenText, faFileContract, faFileInvoice, faFileInvoiceDollar, faHome, faHomeAlt, faHomeUser, faIndent, faMoneyBills, faNetworkWired, faSitemap, faSync, faSyncAlt, faTag, faTags, faTree } from '@fortawesome/free-solid-svg-icons';
import { faRegistered } from '@fortawesome/free-regular-svg-icons';
import { faRust } from '@fortawesome/free-brands-svg-icons';
import Tippy from '@tippyjs/react';

const Sidebar = () => {
    const APP_VERSION = "2.5b.24";
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

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="h-full bg-white dark:bg-black">
                    <div className="flex items-center justify-between px-4 py-3 group">
                        <Link href="/" className="main-logo flex shrink-0 items-center">
                            <img className="ml-[5px] w-10 h-10 object-contain flex-none animate-bounce delay-100" src="/assets/images/logo-caram.png" alt="logo" />
                            <span className="align-middle text-xl font-bold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">{t('SICARAM')}</span>
                        </Link>

                        <button
                            type="button"
                            className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="relative h-[calc(100vh-100px)]">
                        <ul className="relative space-y-0.5 p-4 py-0 font-semibold">

                            {CurrentUser?.role_id === 9 && (
                                <li className="menu nav-item">
                                    <Link href="/dashboard/pd" className="group">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faHomeUser} className='shrink-0 group-hover:!text-primary' />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                Dashboard
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            )}

                            {CurrentUser?.role_id !== 9 && (
                                <li className="menu nav-item">
                                    <button type="button" className={`${currentMenu === 'dashboard' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('dashboard')}>
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faHomeUser} className='shrink-0 group-hover:!text-primary' />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                Dashboard
                                            </span>
                                        </div>
                                        <div className={currentMenu !== 'dashboard' ? '-rotate-90 rtl:rotate-90' : ''}>
                                            <IconCaretDown />
                                        </div>
                                    </button>

                                    <AnimateHeight duration={300} height={currentMenu === 'dashboard' ? 'auto' : 0}>
                                        <ul className="sub-menu text-gray-500">
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
                                    {/* <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                        <IconMinus className="hidden h-5 w-4 flex-none" />
                                        <span>
                                            Master Data
                                        </span>
                                    </h2> */}

                                    {([1, 9].includes(CurrentUser?.role_id)) && (
                                        <li className="menu nav-item">
                                            <Link href="/Menu/MasterData" className="group">
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faSitemap} className='shrink-0 group-hover:!text-primary' />
                                                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        Master Data
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                    )}


                                    {([1, 2, 3, 4, 5, 10].includes(CurrentUser?.role_id)) && (
                                        <li className="menu nav-item">
                                            <button type="button" className={`${currentMenu === 'lpse' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('lpse')}>
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faNetworkWired} className='shrink-0 group-hover:!text-primary' />
                                                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        LPSE
                                                    </span>
                                                </div>
                                                <div className={currentMenu !== 'lpse' ? '-rotate-90 rtl:rotate-90' : ''}>
                                                    <IconCaretDown />
                                                </div>
                                            </button>

                                            <AnimateHeight duration={300} height={currentMenu === 'lpse' ? 'auto' : 0}>
                                                <ul className="sub-menu text-gray-500">
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


                                    {/* <li className="menu nav-item">
                                        <button type="button" className={`${currentMenu === 'master-urusan-kegiatan' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('master-urusan-kegiatan')}>
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faSitemap} className='shrink-0 group-hover:!text-primary' />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                    Master Urusan
                                                </span>
                                            </div>
                                            <div className={currentMenu !== 'master-urusan-kegiatan' ? '-rotate-90 rtl:rotate-90' : ''}>
                                                <IconCaretDown />
                                            </div>
                                        </button>

                                        <AnimateHeight duration={300} height={currentMenu === 'master-urusan-kegiatan' ? 'auto' : 0}>
                                            <ul className="sub-menu text-gray-500">
                                                <li>
                                                    <Link href="/master/urusan">
                                                        Urusan
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/master/bidang">
                                                        Bidang Urusan
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/master/program">
                                                        Program
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/master/kegiatan">
                                                        Kegiatan
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/master/subkegiatan">
                                                        Sub Kegiatan
                                                    </Link>
                                                </li>
                                            </ul>
                                        </AnimateHeight>
                                    </li> */}

                                    {/* {([1, 2, 3, 6, 9].includes(CurrentUser?.role_id)) && (
                                        <li className="menu nav-item">
                                            <button type="button" className={`${currentMenu === 'master-indikator-kinerja' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('master-indikator-kinerja')}>
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faIndent} className='shrink-0 group-hover:!text-primary' />
                                                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        Indikator Kinerja
                                                    </span>
                                                </div>
                                                <div className={currentMenu !== 'master-indikator-kinerja' ? '-rotate-90 rtl:rotate-90' : ''}>
                                                    <IconCaretDown />
                                                </div>
                                            </button>

                                            <AnimateHeight duration={300} height={currentMenu === 'master-indikator-kinerja' ? 'auto' : 0}>
                                                <ul className="sub-menu text-gray-500">
                                                    <li>
                                                        <Link href="/master/indikator-kinerja/kegiatan">
                                                            Indikator Kegiatan
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/master/indikator-kinerja/sub-kegiatan" className='text-xs'>
                                                            Indikator Sub Kegiatan
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </AnimateHeight>
                                        </li>
                                    )} */}

                                    {/* {([1, 2, 3, 4, 6, 7].includes(CurrentUser?.role_id)) && (
                                        <li className="menu nav-item">
                                            <button type="button" className={`${currentMenu === 'kode-rekening' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('kode-rekening')}>
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faFileInvoiceDollar} className='shrink-0 group-hover:!text-primary' />
                                                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        Kode Rekening
                                                    </span>
                                                </div>
                                                <div className={currentMenu !== 'kode-rekening' ? '-rotate-90 rtl:rotate-90' : ''}>
                                                    <IconCaretDown />
                                                </div>
                                            </button>

                                            <AnimateHeight duration={300} height={currentMenu === 'kode-rekening' ? 'auto' : 0}>
                                                <ul className="sub-menu text-gray-500">
                                                    {([1, 2, 4, 7].includes(CurrentUser?.role_id)) && (
                                                        <li>
                                                            <Link href="/rekening">
                                                                Daftar Rekening
                                                            </Link>
                                                        </li>
                                                    )}
                                                    {([1, 2, 3, 4, 6, 7].includes(CurrentUser?.role_id)) && (
                                                        <li>
                                                            <Link href="/sumber-dana">
                                                                Sumber Dana
                                                            </Link>
                                                        </li>
                                                    )}
                                                </ul>
                                            </AnimateHeight>
                                        </li>
                                    )} */}

                                    {/* {([1, 2, 3, 4, 5, 6, 7, 8, 9].includes(CurrentUser?.role_id)) && (
                                        <li className="menu nav-item">
                                            <button type="button" className={`${currentMenu === 'ref-data' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('ref-data')}>
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faRegistered} className='shrink-0 group-hover:!text-primary' />
                                                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        Referensi
                                                    </span>
                                                </div>
                                                <div className={currentMenu !== 'ref-data' ? '-rotate-90 rtl:rotate-90' : ''}>
                                                    <IconCaretDown />
                                                </div>
                                            </button>

                                            <AnimateHeight duration={300} height={currentMenu === 'ref-data' ? 'auto' : 0}>
                                                <ul className="sub-menu text-gray-500">
                                                    {([1, 2].includes(CurrentUser?.role_id)) && (
                                                        <li>
                                                            <Link href="/reference/periode">
                                                                Periode
                                                            </Link>
                                                        </li>
                                                    )}
                                                    {([1, 2, 3, 4, 5, 6, 7, 8, 9].includes(CurrentUser?.role_id)) && (
                                                        <li>
                                                            <Link href="/reference/satuan" className=''>
                                                                Satuan
                                                            </Link>
                                                        </li>
                                                    )}
                                                    {([1, 2, 3, 4].includes(CurrentUser?.role_id)) && (
                                                        <li>
                                                            <Link href="/reference/tag-sumber-dana" className='text-xs'>
                                                                Tag Sumber Dana
                                                            </Link>
                                                        </li>
                                                    )}
                                                    {([1, 2, 3, 6].includes(CurrentUser?.role_id)) && (
                                                        <li>
                                                            <Link href="/reference/tujuan-sasaran" className='text-xs'>
                                                                Tujuan & Sasaran
                                                            </Link>
                                                        </li>
                                                    )}
                                                    {([1, 2, 3, 6].includes(CurrentUser?.role_id)) && (
                                                        <li>
                                                            <Link href="/reference/indikator-tujuan-sasaran" className='text-xs'>
                                                                Indikator Tujuan & Sasaran
                                                            </Link>
                                                        </li>
                                                    )}
                                                </ul>
                                            </AnimateHeight>
                                        </li>
                                    )} */}

                                    {/* {([1, 2, 3, 6, 9].includes(CurrentUser?.role_id)) && (
                                        <>
                                            <li className="menu nav-item">
                                                <button type="button" className={`${currentMenu === 'head-tujuan-sasaran' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('head-tujuan-sasaran')}>
                                                    <div className="flex items-center">
                                                        <FontAwesomeIcon icon={faSitemap} className='shrink-0 group-hover:!text-primary' />
                                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                            Tujuan & Sasaran
                                                        </span>
                                                    </div>
                                                    <div className={currentMenu !== 'head-tujuan-sasaran' ? '-rotate-90 rtl:rotate-90' : ''}>
                                                        <IconCaretDown />
                                                    </div>
                                                </button>

                                                <AnimateHeight duration={300} height={currentMenu === 'head-tujuan-sasaran' ? 'auto' : 0}>
                                                    <ul className="sub-menu text-gray-500">
                                                        {([1, 2, 3, 6].includes(CurrentUser?.role_id)) && (
                                                            <>
                                                                <li>
                                                                    <div className="text-sm font-semibold py-2">
                                                                        Kabupaten
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <Link href="/master/tujuan-sasaran" className=''>
                                                                        Master
                                                                    </Link>
                                                                </li>
                                                                <li>
                                                                    <Link href="/target/tujuan-sasaran" className=''>
                                                                        Target
                                                                    </Link>
                                                                </li>
                                                                <li>
                                                                    <Link href="/target/perubahan/tujuan-sasaran" className=''>
                                                                        Target Perubahan
                                                                    </Link>
                                                                </li>

                                                                <li>
                                                                    <div className="text-sm font-semibold py-2">
                                                                        Perangkat Daerah
                                                                    </div>
                                                                </li>
                                                            </>
                                                        )}
                                                        {([1, 2, 3, 6, 9].includes(CurrentUser?.role_id)) && (
                                                            <>
                                                                <li>
                                                                    <Link href="/master/tujuan-sasaran/perangkat-daerah" className=''>
                                                                        {CurrentUser?.role_id === 9 ? 'Master Tujuan & Sasaran' : 'Master'}
                                                                    </Link>
                                                                </li>
                                                                <li>
                                                                    <Link href="/target/tujuan-sasaran/perangkat-daerah" className=''>
                                                                        Target
                                                                    </Link>
                                                                </li>
                                                                <li>
                                                                    <Link href="/target/perubahan/tujuan-sasaran-perangkat-daerah" className=''>
                                                                        Target Perubahan
                                                                    </Link>
                                                                </li>
                                                            </>
                                                        )}
                                                    </ul>
                                                </AnimateHeight>
                                            </li>

                                            <li className="menu nav-item">
                                                <button type="button" className={`${currentMenu === 'head-pohon-kinerja' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('head-pohon-kinerja')}>
                                                    <div className="flex items-center">
                                                        <FontAwesomeIcon icon={faTree} className='shrink-0 group-hover:!text-primary' />
                                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                            Pohon Kinerja
                                                        </span>
                                                    </div>
                                                    <div className={currentMenu !== 'head-pohon-kinerja' ? '-rotate-90 rtl:rotate-90' : ''}>
                                                        <IconCaretDown />
                                                    </div>
                                                </button>

                                                <AnimateHeight duration={300} height={currentMenu === 'head-pohon-kinerja' ? 'auto' : 0}>
                                                    <ul className="sub-menu text-gray-500">

                                                        <>
                                                            <li>
                                                                <Link href="/pohon-kinerja" className=''>
                                                                    Pohon Kinerja
                                                                </Link>
                                                            </li>
                                                        </>
                                                    </ul>
                                                </AnimateHeight>
                                            </li>
                                        </>
                                    )} */}

                                    {/* {([1, 2, 4, 7, 9].includes(CurrentUser?.role_id)) && (
                                        <li className="menu nav-item">
                                            <Link href="/tagging-sumber-dana" className="group">
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faTags} className='shrink-0 group-hover:!text-primary' />
                                                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark text-xs">
                                                        Tagging Sumber Dana
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                    )} */}

                                    {/* {([1, 2, 3, 4, 6, 7, 9].includes(CurrentUser?.role_id)) && (
                                        <li className="menu nav-item">
                                            <Link href="/rpjmd" className="group">
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faRust} className='shrink-0 group-hover:!text-primary' />
                                                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        RPJMD
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                    )} */}

                                    {/* {([1, 2, 3, 4, 6, 7, 9].includes(CurrentUser?.role_id)) && (
                                        <li className="menu nav-item">
                                            <Link href="/renstra" className="group">
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faFileInvoice} className='shrink-0 group-hover:!text-primary' />
                                                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        Renstra Induk
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                    )} */}

                                    {/* {([1, 2, 3, 4, 6, 7, 9].includes(CurrentUser?.role_id)) && (
                                        <li className="menu nav-item">
                                            <Link href="/renja" className="group">
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faFileContract} className='shrink-0 group-hover:!text-primary' />
                                                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        Renstra Perubahan
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                    )} */}

                                    {([1, 2, 3, 4, 6, 7, 9].includes(CurrentUser?.role_id)) && (
                                        <>
                                            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                                <IconMinus className="hidden h-5 w-4 flex-none" />
                                                <span>
                                                    REALISASI
                                                </span>
                                            </h2>
                                            <li className="menu nav-item">
                                                <Link href="/kinerja" className="group">
                                                    <div className="flex items-center">
                                                        <FontAwesomeIcon icon={faEnvelopeOpenText} className='shrink-0 group-hover:!text-primary' />
                                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                            Realisasi Program
                                                        </span>
                                                    </div>
                                                </Link>
                                            </li>
                                            {([1, 2, 3, 6, 9].includes(CurrentUser?.role_id)) && (
                                                <li className="menu nav-item">
                                                    <Link href="/realisasi/tujuan-sasaran" className="group">
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon icon={faEnvelopeOpenText} className='shrink-0 group-hover:!text-primary' />
                                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                                Realisasi Tujuan Sasaran
                                                            </span>
                                                        </div>
                                                    </Link>
                                                </li>
                                            )}
                                            {([1, 2, 3, 6, 9].includes(CurrentUser?.role_id)) && (
                                                <li className="menu nav-item">
                                                    <Link href="/realisasi/tujuan-sasaran-perangkat-daerah" className="group">
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon icon={faEnvelopeOpenText} className='shrink-0 group-hover:!text-primary' />
                                                            <span className={`text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark ${([1, 2, 3, 6].includes(CurrentUser?.role_id)) ? "text-xs whitespace-normal" : ""}`}>
                                                                Realisasi Tujuan Sasaran
                                                                {([1, 2, 3, 6, 9].includes(CurrentUser?.role_id)) ? " Perangkat Daerah" : ""}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                </li>
                                            )}
                                        </>
                                    )}

                                    {([1, 4, 9, 12].includes(CurrentUser?.role_id)) && (
                                        <>
                                            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                                <IconMinus className="hidden h-5 w-4 flex-none" />
                                                <span>
                                                    BPKAD
                                                </span>
                                            </h2>

                                            {([1, 2, 4].includes(CurrentUser?.role_id)) && (
                                                <li className="menu nav-item">
                                                    <Link href="/bpkad/import" className="group">
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon icon={faCloudUploadAlt} className='shrink-0 group-hover:!text-primary' />
                                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                                Import SIPD
                                                            </span>
                                                        </div>
                                                    </Link>
                                                </li>
                                            )}
                                            {([1, 2, 4, 9, 12].includes(CurrentUser?.role_id)) && (
                                                <li className="menu nav-item">
                                                    <Link href="/accountancy" className="group">
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon icon={faMoneyBills} className='shrink-0 group-hover:!text-primary' />
                                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                                Akuntansi
                                                            </span>
                                                        </div>
                                                    </Link>
                                                </li>
                                            )}
                                        </>
                                    )}

                                    <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                        <IconMinus className="hidden h-5 w-4 flex-none" />
                                        <span>
                                            Laporan
                                        </span>
                                    </h2>
                                    <li className="menu nav-item">
                                        <Link href="/report" className="group">
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faClipboardCheck} className='shrink-0 group-hover:!text-primary' />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                    Program Kegiatan
                                                </span>
                                            </div>
                                        </Link>
                                    </li>
                                    {([1, 4, 9, 12].includes(CurrentUser?.role_id)) && (
                                        <li className="menu nav-item">
                                            <Link href="/accountancy/report" className="group">
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faClipboardCheck} className='shrink-0 group-hover:!text-primary' />
                                                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        Akuntansi
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                    )}

                                    {([1, 2, 3, 4, 5, 9].includes(CurrentUser?.role_id)) && (
                                        <>
                                            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                                <IconMinus className="hidden h-5 w-4 flex-none" />
                                                <span>
                                                    Manajemen
                                                </span>
                                            </h2>

                                            <li className="menu nav-item">
                                                <button type="button" className={`${currentMenu === 'user-management' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('user-management')}>
                                                    <div className="flex items-center">
                                                        <IconMenuUsers className="shrink-0 group-hover:!text-primary" />
                                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                            Manajemen Pengguna
                                                        </span>
                                                    </div>
                                                    <div className={currentMenu !== 'user-management' ? '-rotate-90 rtl:rotate-90' : ''}>
                                                        <IconCaretDown />
                                                    </div>
                                                </button>

                                                <AnimateHeight duration={300} height={currentMenu === 'user-management' ? 'auto' : 0}>
                                                    <ul className="sub-menu text-gray-500">
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
                                        <li className="menu nav-item">
                                            <Link href="/instances" className="group">
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faBriefcase} className='shrink-0 group-hover:!text-primary' />
                                                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
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
                    </PerfectScrollbar>

                    <div className="px-2 pt-2">
                        <Tippy content="Versi Aplikasi">
                            <div className="text-center text-xs truncate font-semibold cursor-pointer hover:text-primary transition-all duration-300">
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
