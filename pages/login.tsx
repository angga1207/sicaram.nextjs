'use client';
import { useEffect, useState, useRef } from 'react';
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
import { BaseUri } from '@/apis/serverConfig';
import axios from "axios";

import React from "react";
import { setCookie } from 'cookies-next';
import ReCAPTCHA from "react-google-recaptcha";

import Swal from 'sweetalert2';

const showSweetAlert = async (icon: any, title: any, text: any, confirmButtonText: any, cancelButtonText: any, callback: any) => {
    Swal.fire({
        icon: icon,
        // title: '<i>HTML</i> <u>example</u>',
        title: title,
        // html: 'You can use <b>bold text</b>, <a href="//github.com">links</a> and other HTML tags',
        html: text,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        padding: '2em',
        customClass: 'sweet-alerts',

        // callback on confirm
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
    });
}

const Login = () => {

    const [userToken, setUserToken] = useState<string | null>(null);

    useEffect(() => {
        if (window) {
            // localStorage.removeItem('token');
            // console.log(localStorage.getItem('token'))
            if (localStorage.getItem('token')) {
                // setUserToken(localStorage.getItem('token'));
                router.push('/');
                // return;
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

    const [email, setEmail] = React.useState("");
    const recaptchaRef = React.createRef<any>();

    const [showPassword, setShowPassword] = useState(false);

    const submitForm = (e: any) => {
        e.preventDefault();
        AttempLogin(e);
    };

    const onReCAPTCHAChange = (captchaCode: any) => {
        if (captchaCode) {
            return;
        }
        recaptchaRef?.current?.reset();
    }

    const [submitLoading, setSubmitLoading] = useState(false);

    const AttempLogin = async (e: any) => {
        e.preventDefault();
        setSubmitLoading(true);

        const elements = document.getElementsByClassName('validation');
        while (elements.length > 0) elements[0].remove();

        // document.getElementsByClassName('validation')?.innerHTML = '';

        if (!recaptchaRef?.current.getValue()) {

            // document.getElementById('errorCaptcha').innerHTML = 'Please check the captcha';
            showSweetAlert(
                'error',
                'Verifikasi Robot', 'Anda tidak lolos verifikasi robot!',
                'OK',
                'Batal',
                () => {
                    return;
                });
            setSubmitLoading(false);
            return;
        }

        const formData = {
            username: e.target.Username.value,
            password: e.target.Password.value,
        };
        const uri = BaseUri() + '/login';
        try {
            const res = await axios.post(uri, formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const json = await res?.data;

            if (json?.status === 'error validation') {
                Object.keys(json.message).map((key: any, index: any) => {
                    let element = document.getElementById('error-' + key);
                    if (element) {
                        element.innerHTML = json.message[key][0];
                    }
                });
                // if (json?.message?.username) {
                //     document.getElementById('errorUsername').innerHTML = json?.message?.username;
                // }
                // if (json?.message?.password) {
                //     document.getElementById('errorPassword').innerHTML = json?.message?.password;
                // }
                setSubmitLoading(false);
                return;
            }

            const data = await json.data;

            if (!data) {
                alert('Login failed');
                setSubmitLoading(false);
                return;
            }

            if (json.status == 'success') {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('userPassword', formData.password);
                localStorage.setItem('locked', 'false');
                setCookie('token', data.token);
                setUserToken(data.token);
            }

            // router push to latest url
            // router.push(router.query.next ? router.query.next.toString() : '/');

        } catch (error) {
            showSweetAlert(
                'error',
                'Terjadi Kesalahan Server', 'Server tidak merespon! <br /> Silahkan untuk reload halaman?',
                'Reload',
                'Batal',
                () => {
                    window.location.reload();
                });
            return error;
        }
    }

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


    useEffect(() => {
        if (localStorage.getItem('token')) {
            if (localStorage.user.role_id === 9) {
                router.push('/dashboard/pd');
            } else {
                router.push('/dashboard');
            }
        }
    }, [userToken]);

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
                <div className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">
                    <div className="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(21,84,121,1)_0%,rgba(1,162,233,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
                        <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
                        <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                            <Link href="/" className="ms-10 block w-48 lg:w-72">
                                <img src="/assets/images/logo-caram.png" alt="Logo" className="w-full" />
                            </Link>
                            <div className="mt-24 hidden w-full max-w-[430px] lg:block">
                                <img src="/assets/images/auth/login.svg" alt="Cover Image" className="w-full" />
                            </div>
                        </div>
                    </div>
                    <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                        <div className="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                            <Link href="/" className="block w-8 lg:hidden">
                                <img src="/assets/images/logo.svg" alt="Logo" className="mx-auto w-10" />
                            </Link>
                        </div>
                        <div className="w-full max-w-[440px] lg:mt-16">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">
                                    Masuk
                                </h1>
                                <p className="text-base font-bold leading-normal text-white-dark">
                                    Ketikan username dan password Anda untuk masuk ke aplikasi
                                </p>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                                <div>
                                    <label htmlFor="Username">
                                        Username
                                    </label>
                                    <div className="relative text-white-dark">
                                        <input id="Username" type="text" placeholder="Masukkan Username..." className="form-input ps-10 placeholder:text-white-dark"
                                        // value={'developer'}
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconUser fill={true} />
                                        </span>
                                    </div>
                                    <div id="error-username" className='validation text-red-500 text-sm'>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Password">Password</label>
                                    <div className="relative text-white-dark">
                                        <input id="Password" placeholder="Masukkan Password..." className="form-input ps-10 placeholder:text-white-dark"
                                            type={showPassword ? 'text' : 'password'}
                                            // value={'oganilir123'}
                                            onChange={(e) => {
                                                setShowPassword(false);
                                            }}
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>

                                        <div className="absolute end-4 top-1/2 -translate-y-1/2">
                                            <button type="button" className="btn btn-outline-primary p-2 rounded-full" onClick={() => setShowPassword(!showPassword)}>
                                                <IconEye />
                                            </button>
                                        </div>
                                    </div>
                                    <div id="error-password" className='validation text-red-500 text-sm'>
                                    </div>
                                </div>
                                <div className='hidden'>
                                    <label className="flex cursor-pointer items-center">
                                        <input type="checkbox" className="form-checkbox bg-white dark:bg-black" />
                                        <span className="text-white-dark">
                                            Tetap Login
                                        </span>
                                    </label>
                                </div>
                                <div className='relative'>
                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        // size="invisible"
                                        // sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                                        sitekey="6LfFuEIpAAAAAKKQkSqEzQsWCOyC8sol7LxZkGzj"
                                        onChange={onReCAPTCHAChange}
                                    />
                                    <div id="errorCaptcha" className='validation text-red-500 text-sm'>
                                    </div>
                                </div>
                                {submitLoading ? (
                                    <>
                                        <button type="button" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                            <div className="flex items-center justify-center">
                                                <div className="w-4 h-4 border-2 border-t-2 border-white rounded-full animate-spin"></div>
                                                <span className="ltr:ml-3 rtl:mr-3">Loading...</span>
                                            </div>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                            Masuk
                                        </button>
                                    </>
                                )}
                            </form>
                        </div>
                        <p className="absolute bottom-6 w-full text-center dark:text-white">
                            © {new Date().getFullYear() == 2022 ? 2022 : '2022 - ' + new Date().getFullYear()}.
                            SiCaram Kabupaten Ogan Ilir.
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
