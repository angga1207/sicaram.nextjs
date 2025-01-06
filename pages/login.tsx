'use client';
import { useEffect, useState, useRef, FormEventHandler } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { setPageTitle, toggleRTL } from '../store/themeConfigSlice';
import BlankLayout from '../components/Layouts/BlankLayout';
import Link from 'next/link';
import { IRootState } from '../store';
import { useTranslation } from 'react-i18next';
import IconEye from '../components/Icon/IconEye';
import IconUser from '../components/Icon/IconUser';
import IconLockDots from '../components/Icon/IconLockDots';
import { BaseUri, GlobalEndPoint, serverCheck } from '@/apis/serverConfig';
import axios from "axios";
import { useSession, signIn, signOut } from 'next-auth/react';

import React from "react";
import { setCookie } from 'cookies-next';
import ReCAPTCHA from "react-google-recaptcha";

import Swal from 'sweetalert2';
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import LoadingSicaram from '@/components/LoadingSicaram';
import IconCalendar from '@/components/Icon/IconCalendar';

const showSweetAlert = async (icon: any, title: any, text: any, confirmButtonText: any, cancelButtonText: any, callback: any) => {
    Swal.fire({
        icon: icon,
        title: title,
        html: text,
        showCancelButton: true,
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        reverseButtons: true,
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
    });
}

const Login = () => {

    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [serverStatus, setServerStatus] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    const [periodeOptions, setPeriodeOptions] = useState<any>([]);
    const [periode, setPeriode] = useState<any>(null)
    const [attemps, setAttemps] = useState<number>(0);
    const [maxAttemps, setMaxAttemps] = useState<number>(5);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const mySession = useSession();

    useEffect(() => {
        if (isMounted) {
            const res = axios.post(BaseUri() + '/bdsm', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            }).then((res) => {
                const data = res.data;
                if (data.status == 'success') {
                    if (data.message == 'Server is running') {
                        setServerStatus(true);
                    }
                }
            }
            ).catch((error) => {
                return {
                    status: 'error',
                    message: error
                }
            });

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userPassword');
            localStorage.removeItem('locked');


            if (document.cookie) {
                let token = document.cookie.split(';').find((row) => row.trim().startsWith('token='))?.split('=')[1];

                let cookieUser = document.cookie.split(';').find((row) => row.trim().startsWith('user='))?.split('=')[1];
                cookieUser = cookieUser ? JSON.parse(cookieUser) : null;
                setUser(cookieUser);

                let locked = document.cookie.split(';').find((row) => row.trim().startsWith('locked='))?.split('=')[1];
                let ups = document.cookie.split(';').find((row) => row.trim().startsWith('ups='))?.split('=')[1];

                if (mySession.status == 'authenticated') {
                    if (user?.role_id === 9) {
                        router.push('/dashboard/pd');
                    } else {
                        router.push('/dashboard');
                    }
                }
            } else {
                document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                document.cookie = 'userPassword=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                document.cookie = 'ups=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                document.cookie = 'user=; path/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                document.cookie = 'locked=false; path/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                if (mySession.status == 'authenticated') {
                    signOut();
                }
            }

            setAttemps(parseInt(localStorage.getItem('attemps') ?? '0'));
        }
    }, [isMounted]);

    useEffect(() => {
        if (isMounted) {
            setPeriode(localStorage.getItem('periode_id') ?? null)
            GlobalEndPoint('ref_periode').then((data: any) => {
                if (data.status == 'success') {
                    setPeriodeOptions(data.data)
                }
            })
        }
    }, [isMounted])

    useEffect(() => {
        if (window) {
            if (localStorage.getItem('token')) {
            } else {
                localStorage.removeItem('token');
            }
        }
    }, []);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Panel Login'));
    });
    const router = useRouter();

    const recaptchaRef = useRef<any>();
    const [recaptchaChecked, setRecaptchaChecked] = useState<boolean>(false);

    const [showPassword, setShowPassword] = useState(false);

    const submitForm = (e: any) => {
        e.preventDefault();
        if (serverStatus === false) {
            showSweetAlert(
                'error',
                'Server Offline', 'Server tidak merespon! <br /> Silahkan untuk reload halaman?',
                'Reload',
                'Batal',
                () => {
                    window.location.reload();
                });
            return;
        } else {
            AttempLogin(e);
        }
    };

    const onReCAPTCHAChange = (captchaCode: any) => {
        if (captchaCode) {
            setRecaptchaChecked(true);
            return;
        }
        recaptchaRef?.current?.reset();
        setRecaptchaChecked(false);
    }

    const [submitLoading, setSubmitLoading] = useState(false);

    const AttempLogin: FormEventHandler<HTMLFormElement> = async (e: any) => {
        e.preventDefault();
        setSubmitLoading(true);

        const elements = document?.getElementsByClassName('validation');
        if (elements.length > 0) {
            while (elements.length > 0) elements[0].remove();
        }

        if (e.target.Username.value !== 'developer') {
            if (attemps >= maxAttemps) {
                if (!recaptchaRef?.current.getValue()) {
                    showSweetAlert(
                        'error',
                        'Verifikasi Robot', 'Centang Verifikasi Robot!',
                        'OK',
                        'Batal',
                        () => {
                            return;
                        });
                    setSubmitLoading(false);
                    return;
                }
            }
        }

        if (!e.target.Periode.value) {
            Swal.fire('Mohon Maaf', 'Mohon Pilih Periode Terlebih Dahulu', 'warning');
            setSubmitLoading(false);
            localStorage.removeItem('periode_id');
            return;
        } else {
            localStorage.setItem('periode_id', e.target.Periode.value);
        }

        const formData = {
            username: e.target.Username.value,
            password: e.target.Password.value,
            periode: e.target.Periode.value,
        };

        const uri = BaseUri() + '/login';
        const res = await axios.post(uri, formData, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const json = await res?.data;

        if (json?.status === 'error validation') {
            Object.keys(json.message).map((key: any, index: any) => {
                let element = document?.getElementById('error-' + key);
                if (element) {
                    element.innerHTML = json.message[key][0];
                }
            });
            if (json?.message?.username) {
                showSweetAlert('error', 'Error', json?.message?.username, 'OK', 'Batal', () => {
                    return;
                })
            }
            if (json?.message?.password) {
                // document?.getElementById('error-password')?.innerHTML = json?.message?.password;
                showSweetAlert('error', 'Error', json?.message?.password, 'OK', 'Batal', () => {
                    return;
                })
            }
            setSubmitLoading(false);
            setAttemps(attemps + 1);
            localStorage.setItem('attemps', attemps.toString());
            return;
        }

        const data = await json.data;

        if (!data) {
            showSweetAlert('error', 'Error', 'Username atau Password salah!', 'OK', 'Batal', () => { });
            setSubmitLoading(false);
            return;
        }

        if (json.status == 'success') {
            setAttemps(0);
            localStorage.setItem('attemps', '0');


            localStorage.setItem('periode_id', formData.periode);

            // save to cookie 34560000 / 86400
            document.cookie = `token=${data.token}; path=/; max-age=34560000; Secure; priority=high; SameSite=Strict`;
            document.cookie = `mytoken=${data.token}; path=/'token'; max-age=34560000; Secure; priority=high; SameSite=Strict`;
            document.cookie = `user=${JSON.stringify(data.user)}; path=/; max-age=34560000; Secure; priority=high; SameSite=Strict`;
            document.cookie = `ups=${formData.password}; path=/; max-age=34560000; Secure; priority=high; SameSite=Strict`;
            document.cookie = `locked=false; path=/; max-age=34560000; Secure; priority=high; SameSite=Strict`;

            let callbackUrl = '/dashboard';

            if (data.user.role_id === 9) {
                callbackUrl = '/dashboard/pd';
            } else {
                callbackUrl = '/dashboard';
            }

            const auth = await signIn("credentials", {
                id: data.user.id,
                username: data.user.username,
                fullname: data.user.fullname,
                token: data.token,
                // redirect: false,
                callbackUrl: callbackUrl,
            });
        }
    }

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

    // console.log(localStorage.getItem('periode'))
    return (
        <div className='h-full'>
            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/bg-gradient.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">

                <div className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/30 backdrop-blur-sm dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">

                    <div className="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(239,18,98,1)_0%,rgba(67,97,238,1)_100%)] bg-opacity-100 p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
                        <div className="absolute inset-y-0 w-8 from-dark/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
                        <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                            <div className="flex items-center">
                                <Link href="/" className="ms-10 block w-full h-40">
                                    <img src="/assets/images/logo-oi.png" alt="Logo" className="w-full h-40 object-contain" />
                                </Link>
                            </div>

                            <div className="mt-0 hidden w-full lg:block">
                                <Player
                                    autoplay
                                    loop
                                    className='w-full'
                                    src="/lottie/animation-login-2.json"
                                    style={{ height: '450px', width: '450px' }}
                                >
                                </Player>
                            </div>

                            <div className="">
                                <Link href="https://pse.layanan.go.id/sealid/1771" className="block w-full h-10">
                                    <img src='/assets/images/badge_1771-sicaram.png' alt="Serifikat Kemenkominfo Nomor 1771" className="w-full h-10 object-contain" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="relative flex w-full flex-col items-center justify-between gap-6 px-4 pb-16 pt-16 sm:px-6 lg:max-w-[667px]">
                        <div className="mb-0">
                            <img src='/assets/images/logo-caram.png' alt="Logo" className="w-full h-20 object-contain" />
                            <div className="mb-2 text-center">
                                <h1 className="text-xl font-bold !leading-snug tracking-widest text-slate-800 mb-3">
                                    <span className='text-blue-600'>S</span>istem <span className='text-blue-600'>I</span>nformasi <span className='text-blue-600'>CA</span>paian <span className='text-blue-600'>R</span>ealisasi Pe<span className='text-blue-600'>M</span>bangunan
                                </h1>
                            </div>
                        </div>
                        <form
                            className="space-y-5 dark:text-white"
                            onSubmit={submitForm}>
                            {submitLoading == false ? (
                                <>

                                    <div>
                                        <label className='text-slate-600' htmlFor="Username">
                                            Username
                                        </label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id="Username"
                                                type="text"
                                                placeholder="Masukkan Username..."
                                                className="form-input ps-10 outline-white ring-0 focus:outline-white focus:ring-0 focus:border-white placeholder:text-white autofill:bg-transparent autofill:ring-0 autofill:border-white autofill:text-white"
                                                autoFocus
                                                autoComplete={'new-' + Math.random().toString(36).substring(7)}
                                            // value={'developer'}
                                            />
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <IconUser fill={true} className='text-slate-700' />
                                            </span>
                                        </div>
                                        <div id="error-username" className='validation text-red-500 text-sm'>
                                        </div>
                                    </div>

                                    <div>
                                        <label className='text-slate-600' htmlFor="Password">Password</label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id="Password"
                                                placeholder="Masukkan Password..."
                                                className="form-input ps-10 outline-white ring-0 focus:outline-white focus:ring-0 focus:border-white placeholder:text-white"
                                                type={showPassword ? 'text' : 'password'}
                                                // value={'oganilir123'}
                                                autoComplete={'new-' + Math.random().toString(36).substring(7)}
                                                onChange={(e) => {
                                                    setShowPassword(false);
                                                }}
                                            />
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <IconLockDots fill={true} className='text-slate-700' />
                                            </span>

                                            <div className="absolute end-4 top-1/2 -translate-y-1/2">
                                                <button type="button" className="btn btn-outline-dark p-2 rounded-full" onClick={() => setShowPassword(!showPassword)}>
                                                    <IconEye />
                                                </button>
                                            </div>
                                        </div>
                                        <div id="error-password" className='validation text-red-500 text-sm'>
                                        </div>
                                    </div>

                                    <div className="">
                                        <label className='text-slate-600' htmlFor="Periode">
                                            Periode
                                        </label>
                                        <div className="relative text-white-dark">
                                            <select id="Periode"
                                                onChange={(e) => {
                                                    e.preventDefault()
                                                    localStorage.setItem('periode_id', e.target.value);
                                                    const period = JSON.stringify(periodeOptions?.filter((item: any) => item?.id == e.target.value)[0]);
                                                    localStorage.setItem('periode', period);
                                                    setPeriode(e.target.value)
                                                }}
                                                value={periode}
                                                className="form-input ps-10 outline-white ring-0 focus:outline-white focus:ring-0 focus:border-white placeholder:text-white autofill:bg-transparent autofill:ring-0 autofill:border-white autofill:text-white">
                                                <option value="" hidden>Pilih Periode</option>
                                                {periodeOptions?.map((item: any, index: number) => (
                                                    <option value={item?.id}>
                                                        {item?.start_year} - {item?.end_year}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <IconCalendar className='text-slate-700' />
                                            </span>
                                        </div>
                                        <div id="error-username" className='validation text-red-500 text-sm'>
                                        </div>
                                    </div>



                                    {attemps >= maxAttemps && (
                                        <div className='relative'>
                                            <ReCAPTCHA
                                                className='flex items-center justify-center'
                                                ref={recaptchaRef}
                                                sitekey="6LfFuEIpAAAAAKKQkSqEzQsWCOyC8sol7LxZkGzj"
                                                onChange={onReCAPTCHAChange}
                                            />
                                            <div id="errorCaptcha" className='validation text-red-500 text-sm'>
                                            </div>
                                        </div>
                                    )}

                                </>
                            ) : (
                                <>
                                    <LoadingSicaram />
                                </>
                            )}

                            {serverStatus === true ? (
                                <div className='relative'>
                                    <div className={`${serverStatus ? 'bg-green-500' : 'bg-red-500'} absolute top-[2px] right-[2px] z-10 rounded-full w-4 h-4 animate-pulse`}></div>
                                    {submitLoading ? (
                                        <>
                                            <button type="button" className="btn bg-gradient-to-r from-slate-300 from-40% via-slate-500 via-75% to-slate-300 to-100% border-0 text-white !mt-6 w-full uppercase cursor-pointer">
                                                <div className="flex items-center justify-center">
                                                    <div className="w-4 h-4 border-2 border-t-2 border-white rounded-full animate-spin"></div>
                                                    <span className="ltr:ml-3 rtl:mr-3">
                                                        Loading...
                                                    </span>
                                                </div>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {serverStatus && (
                                                <button
                                                    type="submit"
                                                    // disabled={recaptchaChecked ? false : true}
                                                    className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                                    Masuk
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className='relative'>
                                    <div className={`${serverStatus ? 'bg-green-500' : 'bg-red-500'} absolute top-[2px] right-[2px] z-10 rounded-full w-4 h-4 animate-pulse`}></div>
                                    <button type="button" className="btn bg-gradient-to-r from-slate-300 from-10% via-gray-500 via-30% to-slate-300 to-90% hover:from-40% hover:via-75% hover:to-slate-600 hover:to-100% transition duration-900 border-0 text-white hover:text-slate-700 !mt-6 w-full uppercase cursor-pointer">
                                        Server Offline
                                    </button>
                                </div>
                            )}
                        </form>
                        <p className="w-full text-center text-slate-600">
                            © {new Date().getFullYear() == 2022 ? 2022 : '2022 - ' + new Date().getFullYear()}.
                            SiCaram Kabupaten Ogan Ilir | Hak Cipta Diskominfo Ogan Ilir.
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
};
Login.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};
export default Login;
