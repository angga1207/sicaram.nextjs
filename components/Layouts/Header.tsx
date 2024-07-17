import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IRootState } from '../../store';
import { toggleLocale, toggleTheme, toggleSidebar, toggleRTL } from '../../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';
import Dropdown from '../Dropdown';
import IconMenu from '../Icon/IconMenu';
import IconCalendar from '../Icon/IconCalendar';
import IconSun from '../Icon/IconSun';
import IconMoon from '../Icon/IconMoon';
import IconLaptop from '../Icon/IconLaptop';
import { serverCheck } from '@/apis/serverConfig';
import Tippy from '@tippyjs/react';
import IconUser from '../Icon/IconUser';
import IconLockDots from '../Icon/IconLockDots';
import IconLogout from '../Icon/IconLogout';

import Swal from 'sweetalert2';
import IconInfoCircle from '../Icon/IconInfoCircle';
import IconXCircle from '../Icon/IconXCircle';
import IconBellBing from '../Icon/IconBellBing';

import axios, { AxiosRequestConfig } from "axios";
import { BaseUri } from '@/apis/serverConfig';
import { fetchNotifLess, markNotifAsRead } from '@/apis/personal_profile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import IconBookmark from '../Icon/IconBookmark';
import IconPlus from '../Icon/IconPlus';
import IconMinus from '../Icon/IconMinus';


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

const notify = async (icon: any, text: any) => {
    const toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
    });
    toast.fire({
        icon: icon,
        title: text,
        // text: text,
        padding: '10px 20px',
    });
}

const showSweetAlert = async (icon: any, title: any, text: any, confirmButtonText: any, cancelButtonText: any, callback: any) => {
    Swal.fire({
        icon: icon,
        title: title,
        html: text,
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,

        // callback on confirm
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
    });
}


const Header = () => {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [CurrentUser, setCurrentUser] = useState<any>(null);
    const [CurrentToken, setCurrentToken] = useState<any>([]);
    const [Locked, setLocked] = useState<any>([]);

    useEffect(() => {
        if (window) {
            if (isMounted) {
                setCurrentToken(localStorage.getItem('token') ?? '');
                setLocked(localStorage.getItem('locked') ?? '');
                if (CurrentToken && localStorage.getItem('user')) {
                    setCurrentUser(JSON.parse(localStorage.getItem('user') ?? '{[]}') ?? []);
                }
                if (!CurrentUser) {
                    serverCheck().then((res) => {
                        if (res.status == 'error') {
                            window.location.href = '/login';
                            // Swal.fire({
                            //     title: 'Terjadi Kesalahan Server',
                            //     text: 'Server tidak merespon! Silahkan untuk reload halaman?',
                            //     icon: 'error',
                            //     showCancelButton: true,
                            //     confirmButtonText: 'Login Ulang',
                            //     cancelButtonText: 'Reload',
                            // }).then((result) => {
                            //     if (result.isConfirmed) {
                            //         window.location.href = '/login';
                            //     }
                            //     if (result.isDismissed) {
                            //         // window.location.reload();
                            //     }
                            // });
                        }
                    });
                }

                if (Locked == 'true') {
                    window.location.href = '/lockscreen';
                }
            }
        }
    }, [CurrentToken, isMounted]);

    useEffect(() => {
        const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
        if (selector) {
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }

            let allLinks = document.querySelectorAll('ul.horizontal-menu a.active');
            for (let i = 0; i < allLinks.length; i++) {
                const element = allLinks[i];
                element?.classList.remove('active');
            }
            selector?.classList.add('active');

            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }, [router.pathname]);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };

    const [flag, setFlag] = useState('');
    useEffect(() => {
        setLocale(localStorage.getItem('i18nextLng') || themeConfig.locale);
    });
    const dispatch = useDispatch();

    const logout = () => {
        const uri = BaseUri() + '/logout';
        try {
            const res = axios.get(uri, {
                headers: {
                    'Authorization': 'Bearer ' + CurrentToken
                }
            }).then((response) => {
                if (response.status == 200) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('locked');
                    window.location.href = '/login';
                }
            }).catch((error) => {
                if (error.response.status == 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('locked');
                    window.location.href = '/login';
                }
            });
        } catch (error) {
            showAlert('error', 'Terjadi Kesalahan Server' + ' ' + error);
        }
    };

    const [messages, setMessages] = useState([
        {
            id: 1,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-success-light dark:bg-success text-success dark:text-success-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span>',
            title: 'Congratulations!',
            message: 'Your OS has been updated.',
            time: '1hr',
        },
        {
            id: 2,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-info-light dark:bg-info text-info dark:text-info-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>',
            title: 'Did you know?',
            message: 'You can switch between artboards.',
            time: '2hr',
        },
        {
            id: 3,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-danger-light dark:bg-danger text-danger dark:text-danger-light"> <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>',
            title: 'Something went wrong!',
            message: 'Send Reposrt',
            time: '2days',
        },
        {
            id: 4,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-warning-light dark:bg-warning text-warning dark:text-warning-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">    <circle cx="12" cy="12" r="10"></circle>    <line x1="12" y1="8" x2="12" y2="12"></line>    <line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span>',
            title: 'Warning',
            message: 'Your password strength is low.',
            time: '5days',
        },
    ]);

    const removeMessage = (value: any) => {
        setMessages(messages.filter((item) => item.id !== value));
    };

    const [notifications, setNotifications] = useState<any>([]);
    const [newNotification, setNewNotification] = useState<boolean>(true);

    // console.log(notifications)

    useEffect(() => {
        if (isMounted) {
            refreshNotificationLess();
        }
    }, [isMounted]);

    const refreshNotificationLess = () => {
        fetchNotifLess().then((res) => {
            if (res.status == 'success') {
                setNotifications(res.data);
                if (res.data.filter((item: any) => item.read === false).length > 0) {
                    setNewNotification(true);
                } else {
                    setNewNotification(false);
                }
            }
        })
    }

    const markRead = (value: any) => {
        markNotifAsRead(value).then((res: any) => {
            if (res.status == 'success') {
                // setNotifications(notifications.filter((item: any) => item?.id !== value));
            }
        });
        setNotifications((prev: any) => {
            return prev.map((item: any) => {
                if (item.id === value) {
                    return {
                        ...item,
                        read: true
                    }
                }
                return item;
            });
        });

        if (notifications.filter((item: any) => item.read === false).length > 0) {
            setNewNotification(true);
        } else {
            setNewNotification(false);
        }
    };

    const [search, setSearch] = useState(false);

    const { t, i18n } = useTranslation();

    const kunciLayar = () => {
        showSweetAlert('warning', 'Kunci Layar', 'Apakah anda yakin ingin mengunci layar?', 'Ya', 'Tidak', () => {
            localStorage.setItem('locked', 'true');
            window.location.href = '/lockscreen';
        });
    }


    const [bookmarks, setBookmars] = useState<any>([]);

    useEffect(() => {
        // clear local storage
        // localStorage.removeItem('bookmarks');
        const localBookmarks = JSON.parse(localStorage.getItem('bookmarks') ?? '[]');
        setBookmars(localBookmarks);
    }, [])

    const addToBookmark = () => {
        const pageTitle = document.title.split('|')[0].trim();
        const url = window.location.href;
        const newBookmark = {
            title: pageTitle,
            url: url,
        };

        const isExist = bookmarks.find((item: any) => item.url === newBookmark.url);
        if (isExist) {
            removeBookmark(bookmarks.findIndex((item: any) => item.url === newBookmark.url));
            return;
        }

        if (bookmarks.length >= 5) {
            notify('error', 'Menu Cepat Maksimal 5');
            return;
        }

        setBookmars((prev: any) => {
            return [...prev, newBookmark];
        });

        const newBookmarks = [...bookmarks, newBookmark];

        const jsonBookmarks = JSON.stringify(newBookmarks ?? []);
        localStorage.setItem('bookmarks', jsonBookmarks);
    };

    const removeBookmark = (index: number) => {
        setBookmars((prev: any) => {
            return prev.filter((item: any, i: number) => i !== index);
        });

        const newBookmarks = bookmarks.filter((item: any, i: number) => i !== index);

        const jsonBookmarks = JSON.stringify(newBookmarks ?? []);
        localStorage.setItem('bookmarks', jsonBookmarks);
    }

    // date time function update every second
    const [currentTime, setCurrentTime] = useState('');
    useEffect(() => {
        const interval = setInterval(() => {
            const date = new Date();
            setCurrentTime(date.toLocaleString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
            })
            );
        }, 1000);
        return () => clearInterval(interval);
    }, []);



    return (
        <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}>
            <div className="shadow-sm">
                <div className="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-black">
                    <div className="horizontal-logo flex items-center justify-between ltr:mr-2 rtl:ml-2 lg:hidden">
                        <Link href="/" className="main-logo flex shrink-0 items-center">
                            <img className="inline w-8 ltr:-ml-1 rtl:-mr-1" src="/assets/images/logo.svg" alt="logo" />
                            <span className="hidden align-middle text-2xl  font-semibold  transition-all duration-300 ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light md:inline">
                                SICARAM
                            </span>
                        </Link>
                        <button
                            type="button"
                            className="collapse-icon flex flex-none rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary ltr:ml-2 rtl:mr-2 dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary lg:hidden"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconMenu className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="hidden ltr:mr-2 rtl:ml-2 sm:block">
                        <ul className="flex items-center space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
                            <li>
                                <div className="text-base font-bold flex flex-col gap-x-3">
                                    <div>
                                        <span className="hidden sm:inline">SiCaram,</span> Kabupaten Ogan Ilir
                                    </div>
                                    <div className="flex items-center space-x-1.5 text-xs">
                                        <IconCalendar className="h-3.5 w-3.5" />
                                        <span className="font-semibold">
                                            {currentTime}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-slate-800 dark:text-[#d0d2d6] text-lg">

                                        {router.pathname.includes('realisasi/anggaran') && (
                                            <span className="flex items-center space-x-1.5">
                                                <span className="font-semibold">
                                                    Realisasi Anggaran
                                                </span>
                                            </span>
                                        )}

                                        {router.pathname.includes('realisasi/kontrak') && (
                                            <span className="flex items-center space-x-1.5">
                                                <span className="font-semibold">
                                                    Realisasi Kontrak
                                                </span>
                                            </span>
                                        )}

                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>


                    <div className="flex items-center space-x-1.5 ltr:ml-auto rtl:mr-auto rtl:space-x-reverse dark:text-[#d0d2d6] sm:flex-1 ltr:sm:ml-0 sm:rtl:mr-0 lg:space-x-2">

                        <div className="sm:ltr:mr-auto sm:rtl:ml-auto">
                        </div>

                        <div className="hidden lg:block">
                            <Tippy content={bookmarks.find((item: any) => item.url === window.location.href) ? 'Hapus Dari Menu Cepat' : 'Tambah Ke Menu Cepat'}
                                placement="bottom"
                                arrow={false}
                                duration={0}
                                delay={[500, 0]}
                                interactive={true}
                                theme={bookmarks.find((item: any) => item.url === window.location.href) ? 'warning' : 'dark'}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addToBookmark();
                                    }}
                                    type="button"
                                    className="btn btn-sm rounded-full shadow-none px-2 py-1.5 my-4 w-10 h-10 group hover:bg-slate-900 dark:hover:bg-slate-100">
                                    <FontAwesomeIcon
                                        icon={faBookmark}
                                        className={`w-4.5 h-4.5 ${bookmarks.find((item: any) => item.url === window.location.href) ? 'text-yellow-500' : 'group-hover:text-white dark:group-hover:text-dark'}`} />
                                </button>
                            </Tippy>
                        </div>

                        <div className="hidden lg:block dropdown shrink-0">
                            <Dropdown
                                offset={[0, -15]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="relative group block"
                                button={
                                    <div className="btn btn-sm rounded-xl shadow-none px-2 py-1.5 my-4">
                                        Menu Cepat
                                        {bookmarks?.length > 0 ? (
                                            <div className="w-6 h-6 rounded-xl my-0 bg-white-light text-black flex items-center justify-center ml-3">
                                                {bookmarks?.length}
                                            </div>
                                        ) : (
                                            <div className='w-2 h-6'></div>
                                        )}
                                    </div>
                                }
                            >
                                <ul className="!min-w-[230px] max-w-[400px] relative !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">

                                    {bookmarks?.length > 0 && (
                                        <>
                                            {bookmarks?.map((item: any, index: number) => (
                                                <li key={`bookmark-${index}`}>
                                                    <div className="w-full flex justify-between p-3 hover:bg-slate-100 dark:hover:bg-slate-700 group">
                                                        <Link href={item?.url} className="dark:hover:text-white w-full flex items-center justify-start group-hover:text-yellow-500 dark:group-hover:text-yellow-700">
                                                            <IconBookmark className="h-4.5 w-4.5 shrink-0 mr-2" />
                                                            <span className='whitespace-nowrap truncate'>
                                                                {item?.title}
                                                            </span>
                                                        </Link>
                                                        <Tippy content="Hapus" placement="top" arrow={false} duration={0} delay={[500, 0]} interactive={true} theme="danger">
                                                            <button
                                                                type="button"
                                                                className="text-danger ltr:ml-2 rtl:mr-2"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    removeBookmark(index);
                                                                }}
                                                            >
                                                                <IconXCircle className="h-4.5 w-4.5 shrink-0" />
                                                            </button>
                                                        </Tippy>
                                                    </div>
                                                </li>
                                            ))}
                                        </>
                                    )}

                                    {bookmarks?.length == 0 && (
                                        <li>
                                            <button type="button" className="!grid min-h-[200px] place-content-center text-lg hover:!bg-transparent">
                                                <div className="mx-auto mb-4 rounded-full ring-4 ring-primary/30">
                                                    <IconInfoCircle fill={true} className="h-10 w-10 text-primary" />
                                                </div>
                                                Tidak ada menu cepat
                                            </button>
                                        </li>
                                    )}

                                    {!bookmarks.find((item: any) => item.url === window.location.href) && (
                                        <li
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToBookmark();
                                            }}>
                                            <div className="w-full flex justify-between p-3 hover:bg-slate-100 dark:hover:bg-slate-700 group cursor-pointer mt-2 border-t">
                                                <div className="dark:hover:text-white w-full flex items-center justify-start group-hover:text-yellow-500 dark:group-hover:text-yellow-700 text-xs">
                                                    <IconPlus className="h-4 w-4 shrink-0 mr-2" />
                                                    <span className='whitespace-nowrap truncate'>
                                                        Tambahkan Halaman Ini
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    )}

                                </ul>
                            </Dropdown>
                        </div>

                        <div>
                            {themeConfig.theme === 'light' ? (
                                <button
                                    className={`${themeConfig.theme === 'light' &&
                                        'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                                        }`}
                                    onClick={() => dispatch(toggleTheme('dark'))}
                                >
                                    <IconSun />
                                </button>
                            ) : (
                                ''
                            )}
                            {themeConfig.theme === 'dark' && (
                                <button
                                    className={`${themeConfig.theme === 'dark' &&
                                        'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                                        }`}
                                    onClick={() => dispatch(toggleTheme('system'))}
                                >
                                    <IconMoon />
                                </button>
                            )}
                            {themeConfig.theme === 'system' && (
                                <button
                                    className={`${themeConfig.theme === 'system' &&
                                        'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                                        }`}
                                    onClick={() => dispatch(toggleTheme('light'))}
                                >
                                    <IconLaptop />
                                </button>
                            )}
                        </div>

                        <div className="dropdown shrink-0">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                                button={
                                    <span>
                                        <IconBellBing />
                                        {newNotification && (
                                            <span className="absolute top-0 flex h-3 w-3 ltr:right-0 rtl:left-0">
                                                <span className="absolute -top-[3px] inline-flex h-full w-full animate-ping rounded-full bg-success/50 opacity-75 ltr:-left-[3px] rtl:-right-[3px]"></span>
                                                <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-success"></span>
                                            </span>
                                        )}
                                    </span>
                                }
                            >
                                <ul className="w-[300px] divide-y !py-0 text-dark dark:divide-white/10 dark:text-white-dark sm:w-[350px]">
                                    <li onClick={(e) => {
                                        e.stopPropagation()
                                    }}>
                                        <div className="flex items-center justify-between px-4 py-2 font-semibold">
                                            <h4 className="text-lg">
                                                Pemberitahuan
                                            </h4>
                                            {notifications.length ? <span className="badge bg-primary/80">{notifications.length} </span> : ''}
                                        </div>
                                    </li>
                                    {notifications.length > 0 ? (
                                        <>
                                            {notifications.map((notification: any) => {
                                                return (
                                                    <li key={`notif-${notification.id}`}
                                                        className={`${notification.read ? '' : 'bg-blue-100'} dark:text-white-light/90 hover:bg-blue-50 cursor-pointer`}
                                                        onClick={(e) => e.stopPropagation()}>
                                                        <div className="group flex items-center px-4 py-2"
                                                            onClick={() => {
                                                                markRead(notification.id)
                                                            }}>
                                                            <div className="grid place-content-center rounded">
                                                                <div className="relative h-12 w-12">
                                                                    <img className="h-12 w-12 rounded-full object-cover" alt="profile" src={notification.profile} />
                                                                    <span className="absolute bottom-0 right-[6px] block h-2 w-2 rounded-full bg-success"></span>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-auto ltr:pl-3 rtl:pr-3">
                                                                <div className="ltr:pr-3 rtl:pl-3">
                                                                    {notification.uri ? (
                                                                        <Link
                                                                            href={notification.uri}
                                                                            className="font-semibold dark:hover:text-white" >
                                                                            <h6
                                                                                dangerouslySetInnerHTML={{
                                                                                    __html: notification.message,
                                                                                }}
                                                                            ></h6>
                                                                        </Link>
                                                                    ) : (
                                                                        <h6
                                                                            dangerouslySetInnerHTML={{
                                                                                __html: notification.message,
                                                                            }}
                                                                        ></h6>
                                                                    )}
                                                                    {/* <p>{notification.uri}</p> */}
                                                                    <span className="block text-xs font-normal dark:text-gray-500">{notification.time}</span>
                                                                </div>
                                                                <Tippy content="Tandai sudah dibaca" placement="top" arrow={false} duration={0} delay={[500, 0]} interactive={true} theme="primary">
                                                                    <button
                                                                        type="button"
                                                                        className="text-neutral-300 opacity-0 hover:text-primary group-hover:opacity-100 ltr:ml-auto rtl:mr-auto"
                                                                        onClick={() => markRead(notification.id)}
                                                                    >
                                                                        <FontAwesomeIcon icon={faCheckDouble} className='w-5 h-5' />
                                                                    </button>
                                                                </Tippy>
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                            <li>
                                                <div className="p-4">
                                                    <Link
                                                        href={`/users/profile?tab=2`}
                                                        className="btn btn-primary btn-small block w-full text-center">
                                                        Lihat Semua Pemberitahuan
                                                    </Link>
                                                </div>
                                            </li>
                                        </>
                                    ) : (
                                        <li onClick={(e) => e.stopPropagation()}>
                                            <button type="button" className="!grid min-h-[200px] place-content-center text-lg hover:!bg-transparent">
                                                <div className="mx-auto mb-4 rounded-full ring-4 ring-primary/30">
                                                    <IconInfoCircle fill={true} className="h-10 w-10 text-primary" />
                                                </div>
                                                Tidak ada pemberitahuan
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </Dropdown>
                        </div>

                        {/* <div className="dropdown shrink-0">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                                button={flag && <img className="h-5 w-5 rounded-full object-cover" src={`/assets/images/flags/${flag.toUpperCase()}.svg`} alt="flag" />}
                            >
                                <ul className="grid w-[280px] grid-cols-2 gap-2 !px-2 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                                    {themeConfig.languageList.map((item: any) => {
                                        return (
                                            <li key={'lang' + item.code}>
                                                <button
                                                    type="button"
                                                    className={`flex w-full hover:text-primary ${i18n.language === item.code ? 'bg-primary/10 text-primary' : ''}`}
                                                    onClick={() => {
                                                        dispatch(toggleLocale(item.code));
                                                        i18n.changeLanguage(item.code);
                                                        setLocale(item.code);
                                                    }}
                                                >
                                                    <img src={`/assets/images/flags/${item.code.toUpperCase()}.svg`} alt="flag" className="h-5 w-5 rounded-full object-cover" />
                                                    <span className="ltr:ml-3 rtl:mr-3">{item.name}</span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </Dropdown>
                        </div> */}

                        <div className="dropdown flex shrink-0">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="relative group block"
                                button={
                                    <img className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100" src={CurrentUser?.photo ?? "/assets/images/user-profile.jpeg"} alt="userProfile" />
                                }
                            >
                                <ul className="w-[230px] !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                                    <li>
                                        <div className="flex items-center px-4 py-4">
                                            <img className="h-10 w-10 rounded-md object-cover" src={CurrentUser?.photo ?? "/assets/images/user-profile.jpeg"} alt="userProfile" />
                                            <div className="ltr:pl-4 rtl:pr-4">
                                                <h4 className="truncate text-base">
                                                    {CurrentUser?.firstname}
                                                </h4>
                                                {CurrentUser?.role_name != 'Perangkat Daerah' ? (
                                                    <>
                                                        <button type="button" className="rounded bg-success-light px-1 text-xs text-success">
                                                            {CurrentUser?.role_name ? CurrentUser?.role_name : ''}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Tippy content={CurrentUser?.instance_name ? CurrentUser?.instance_name : ''}>
                                                            <div className="rounded bg-success-light px-1 text-xs text-success line-clamp-2 cursor-pointer text-center">
                                                                {CurrentUser?.instance_alias ? CurrentUser?.instance_alias : ''}
                                                            </div>
                                                        </Tippy>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <Link href="/users/profile" className="dark:hover:text-white">
                                            <IconUser className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                            Profil
                                        </Link>
                                    </li>
                                    <li>
                                        <div
                                            onClick={() => {
                                                kunciLayar();
                                            }}
                                            className="flex px-4 py-2 dark:hover:text-white cursor-pointer hover:bg-indigo-50 hover:text-indigo-700">
                                            <IconLockDots className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                            Kunci Layar
                                        </div>
                                    </li>
                                    <li className="border-t border-white-light dark:border-white-light/10">
                                        <Link href="#" className="!py-3 text-danger"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                logout();
                                            }}>
                                            <IconLogout className="h-4.5 w-4.5 shrink-0 rotate-90 ltr:mr-2 rtl:ml-2" />
                                            Log Out
                                        </Link>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
