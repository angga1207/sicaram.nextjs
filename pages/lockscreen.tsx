import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import React, { useEffect, useState, FormEvent } from 'react';
import { setPageTitle, toggleLocale, toggleRTL } from '@/store/themeConfigSlice';
import BlankLayout from '@/components/Layouts/BlankLayout';
import Dropdown from '@/components/Dropdown';
import { useTranslation } from 'react-i18next';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconLockDots from '@/components/Icon/IconLockDots';
import Link from 'next/link';
import { BaseUri } from '@/apis/serverConfig';
import axios from "axios";

import { setCookie, getCookie, hasCookie, deleteCookie } from 'cookies-next';


import Swal from 'sweetalert2';
import { signOut } from 'next-auth/react';
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


const UnlockBox = () => {
    setCookie('locked', 'true');

    const dispatch = useDispatch();

    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        dispatch(setPageTitle('Lock Screen'));
        setIsClient(true)
    });

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [CurrentUser, setCurrentUser] = useState<any>([]);
    const [CurrentToken, setCurrentToken] = useState<any>([]);
    const [lockedPassword, setLockedPassword] = useState<any>([]);
    const [Locked, setLocked] = useState<any>([]);

    useEffect(() => {
        if (document.cookie) {
            let user = document.cookie.split(';').find((row) => row.trim().startsWith('user='))?.split('=')[1];
            user = user ? JSON.parse(user) : null;
            setCurrentUser(user);

            let locked = document.cookie.split(';').find((row) => row.trim().startsWith('locked='))?.split('=')[1];
            setLocked(locked);

            let token = document.cookie.split(';').find((row) => row.trim().startsWith('token='))?.split('=')[1];
            setCurrentToken(token);

            let ups = document.cookie.split(';').find((row) => row.trim().startsWith('ups='))?.split('=')[1];
            setLockedPassword(ups);
        }
    }, [isMounted]);

    if (CurrentUser.length == 0 && !CurrentToken && isClient) {
        window.location.href = '/login';
    }

    if (Locked == 'true' && isClient) {
        // window.location.href = '/lockscreen';
    }

    const logout = () => {
        const uri = BaseUri() + '/logout';
        try {
            const res = axios.get(uri, {
                headers: {
                    'Authorization': 'Bearer ' + CurrentToken
                }
            }).then((response) => {
                if (response.status == 200) {
                    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                    document.cookie = 'userPassword=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                    document.cookie = 'ups=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                    document.cookie = 'user=; path/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                    document.cookie = 'locked=false; path/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                    signOut();
                    window.location.href = '/login';
                }
            }).catch((error) => {
                if (error.response.status == 401) {
                    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                    document.cookie = 'userPassword=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                    document.cookie = 'ups=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                    document.cookie = 'user=; path/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                    document.cookie = 'locked=false; path/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                    signOut();
                    window.location.href = '/login';
                }
            });
        } catch (error) {
            showAlert('error', 'Terjadi Kesalahan Server' + ' ' + error);
        }
    };

    const submitForm = (e: any) => {
        e.preventDefault();
        const password = e.target.password.value;
        if (password && !password) {
            e.target.password.value = '';
            const el = document.getElementById('passwordValidation');
            el?.classList.remove('hidden');
            if (el) {
                el.innerHTML = 'Password tidak boleh kosong';
            }
            return;
        }

        if (password === lockedPassword) {
            document.getElementById('passwordValidation')?.classList.add('hidden');
            document.cookie = 'locked=false';
            router.push('/');
        } else {
            e.target.password.value = '';
            const el = document.getElementById('passwordValidation');
            el?.classList.remove('hidden');
            if (el) {
                el.innerHTML = 'Password salah';
            }
        }
    };

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
    }, []);

    const { t, i18n } = useTranslation();

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 px-6 py-20 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px]">
                        <div className="absolute end-6 top-6">
                            <div className="dropdown hidden">
                                {flag && (
                                    <Dropdown
                                        offset={[0, 8]}
                                        placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                        btnClassName="flex items-center gap-2.5 rounded-lg border border-white-dark/30 bg-white px-2 py-1.5 text-white-dark hover:border-primary hover:text-primary dark:bg-black"
                                        button={
                                            <>
                                                <div>
                                                    <img src={`/assets/images/flags/${flag.toUpperCase()}.svg`} alt="image" className="h-5 w-5 rounded-full object-cover" />
                                                </div>
                                                <div className="text-base font-bold uppercase">{flag}</div>
                                                <span className="shrink-0">
                                                    <IconCaretDown />
                                                </span>
                                            </>
                                        }
                                    >
                                        <ul className="grid w-[280px] grid-cols-2 gap-2 !px-2 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                                            {themeConfig.languageList.map((item: any) => {
                                                return (
                                                    <li key={item.code}>
                                                        <button
                                                            type="button"
                                                            className={`flex w-full rounded-lg hover:text-primary ${i18n.language === item.code ? 'bg-primary/10 text-primary' : ''}`}
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
                                )}
                            </div>
                        </div>
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10 flex items-center">
                                <img
                                    src={CurrentUser ? CurrentUser.photo : '/assets/images/auth/coming-soon-object3.png'}
                                    className="w-20 h-20 p-1 rounded-full border-2 object-cover mr-2 rlt:ml-2"
                                    alt="images" />
                                <div className="flex-1">
                                    <h4 className="text-2xl dark:text-white">
                                        {/* Kunci Layar */}
                                        {CurrentUser ? CurrentUser?.firstname : 'User'}
                                    </h4>
                                    <p className="text-white-dark">Masukkan Password untuk Membuka Kunci</p>
                                </div>
                            </div>
                            <form className="space-y-5" onSubmit={submitForm}>
                                <div>
                                    <label className="dark:text-white">
                                        Password
                                    </label>
                                    <div className="relative text-white-dark">
                                        <input type="password" placeholder="Masukkan Password" className="form-input ps-10 placeholder:text-white-dark" name="password" autoComplete='false' autoSave='false' />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                    <div id="passwordValidation" className="text-red-500 text-sm mt-1 hidden">
                                    </div>
                                </div>
                                <button type="submit" className="btn bg-gradient-to-r from-blue-500 to-indigo-700 hover:from-blue-400 hover:to-indigo-800 hover:via-cyan-500 text-white !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    Buka Kunci
                                </button>
                                <button
                                    onClick={() => {
                                        logout();
                                    }}
                                    type='button'
                                    className="btn bg-gradient-to-r from-red-500 to-amber-700 hover:from-red-400 hover:to-amber-800 hover:via-orange-500 text-white !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    Logout
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
UnlockBox.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};
export default UnlockBox;
