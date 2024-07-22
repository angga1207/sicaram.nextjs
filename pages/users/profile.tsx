import Link from 'next/link';
import { useEffect, useState, Fragment, FormEvent, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { IRootState } from '../../store';
import Dropdown from '../../components/Dropdown';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconPencilPaper from '../../components/Icon/IconPencilPaper';
import IconShoppingBag from '../../components/Icon/IconShoppingBag';
import IconTag from '../../components/Icon/IconTag';
import IconCreditCard from '../../components/Icon/IconCreditCard';
import IconClock from '../../components/Icon/IconClock';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import ReCAPTCHA from "react-google-recaptcha";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleLeft, faAngleDoubleRight, faBriefcase, faC, faCalendarAlt, faClock, faExclamationTriangle, faEye, faEyeSlash, faList, faLock, faLockOpen, faPenAlt, faTag, faUserTag } from '@fortawesome/free-solid-svg-icons';
import { faBell, faEnvelope, faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import { updateUserWithPhoto } from '@/apis/storedata';
import { fetchUserMe, fetchLogs, fetchNotif, markNotifAsRead, postSavePassword } from '@/apis/personal_profile';
import { faApple, faBrave, faChrome, faFirefox, faOpera, faSafari, faUbuntu, faWindows } from '@fortawesome/free-brands-svg-icons';

const showAlert = async (icon: any, text: string) => {
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
}

const showSweetAlert = async (icon: any, title: any, text: any, confirmButtonText: any, cancelButtonText: any, callback: any) => {
    Swal.fire({
        icon: icon,
        title: title,
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

const Profile = () => {
    const dispatch = useDispatch();

    const router = useRouter();

    useEffect(() => {
        dispatch(setPageTitle('Profil'));
    });

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [isMounted, setIsMounted] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const [CurrentUser, setCurrentUser] = useState<any>([]);
    const [data, setData] = useState<any>({});
    const [userLogs, setUserLogs] = useState<any>([]);
    const [userLogsPage, setUserLogsPage] = useState<number>(0);
    const [notifications, setNotifications] = useState<any>([]);
    const [notificationPage, setNotificationPage] = useState<number>(0);

    const [tab, setTab] = useState<number>(1);


    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (document.cookie) {
            let user = document.cookie.split(';').find((row) => row.trim().startsWith('user='))?.split('=')[1];
            user = user ? JSON.parse(user) : null;
            setCurrentUser(user);
            setUserLogsPage(1);
            setNotificationPage(1);
        }
    }, [isMounted]);

    useEffect(() => {
        if (router.query.tab) {
            setTab(parseInt(router?.query?.tab as string));
        }
    }, [router.query.tab]);

    useEffect(() => {
        setIsMounted(true)
        setIsClient(true)

    }, []);
    const { t, i18n } = useTranslation();

    const [saveLoadingProfile, setSaveLoadingProfile] = useState(false);

    const [dataInput, setDataInput] = useState<any>({
        fullname: '',
        username: '',
        email: '',
        photo: '',
        photoFile: '',
        password: '',
        password_confirmation: '',
    });

    const [photoProfile, setPhotoProfile] = useState('');

    useEffect(() => {
        fetchUserMe().then((res: any) => {
            if (res.status == 'success') {
                setDataInput({
                    fullname: res.data?.fullname ?? '',
                    username: res.data?.username ?? '',
                    email: res.data?.email ?? '',
                    photo: '',
                    photoFile: '',
                    password: '',
                    password_confirmation: '',
                })
            }
        });
    }, []);

    useEffect(() => {

        fetchLogs(userLogsPage).then((res: any) => {
            if (res.status == 'success') {
                setUserLogs(res.data?.data ?? []);
                setUserLogsPage(res.data?.current_page ?? 1);
            }
        })

    }, [userLogsPage]);

    useEffect(() => {

        fetchNotif(notificationPage).then((res: any) => {
            if (res.status == 'success') {
                setNotifications(res.data.data ?? []);
                setNotificationPage(res.data?.current_page ?? 1);
            }
        })

    }, [notificationPage]);

    const [isEditProfile, setIsEditProfile] = useState(false);

    const onChangePhotoProfile = (e: any) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setDataInput({
                'id': dataInput.id,
                'role': dataInput.role,
                'username': dataInput.username,
                'email': dataInput.email,
                'fullname': dataInput.fullname,
                'photo': reader.result ?? '',
                'photoFile': file,
                'password': dataInput.password,
                'password_confirmation': dataInput.password_confirmation,
            })
        }
    }

    const deleteTemporaryImage = (e: any) => {
        e.preventDefault();
        setDataInput({
            'id': dataInput.id,
            'role': dataInput.role,
            'username': dataInput.username,
            'email': dataInput.email,
            'fullname': dataInput.fullname,
            'photo': '',
            'photoFile': '',
            'password': dataInput.password,
            'password_confirmation': dataInput.password_confirmation,

        })
    }

    const saveProfile = async () => {
        setSaveLoadingProfile(true);
        const data = {
            id: CurrentUser?.id,
            fullname: dataInput.fullname,
            username: dataInput.username,
            email: dataInput.email,
            foto: dataInput.photo,
            fotoPath: dataInput.photoFile,
            role: CurrentUser?.role_id,
            password: dataInput.password ?? '',
            password_confirmation: dataInput.password_confirmation ?? '',
        }

        const res = await updateUserWithPhoto(data);
        if (res.status == 'success') {
            showAlert('success', res.message);
            setCurrentUser(res.data);
            sessionStorage.setItem('user', JSON.stringify(res.data));
            setIsEditProfile(false);
            setSaveLoadingProfile(false);
        }
        if (res.status == 'error validation') {

            Object.keys(res.message).map((key: any) => {

                let element = document.getElementById(key);
                if (element) {
                    if (key) {
                        element.classList.add('border-danger');
                    } else {
                        element.classList.remove('border-danger');
                    }
                }
            });
            showAlert('error', res?.message[0] ?? 'Data gagal disimpan');
            setSaveLoadingProfile(false);
        }

        if (!res || res.status == 'error') {
            showAlert('error', res?.message ?? 'Data gagal disimpan');
            setSaveLoadingProfile(false);
        }
    }

    const [isEditPassword, setIsEditPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [inputPassword, setInputPassword] = useState<any>({
        old_password: '',
        password: '',
        password_confirmation: '',
    });
    const [submitPasswordLoading, setSubmitPasswordLoading] = useState(false);
    const [isCanSubmitPassword, setIsCanSubmitPassword] = useState(false);
    const recaptchaRef = useRef<any>();

    const onReCAPTCHAChange = (captchaCode: any) => {
        if (captchaCode) {
            setIsCanSubmitPassword(true);
            return;
        }
        recaptchaRef?.current?.reset();
    }

    const savePassword = () => {
        setSubmitPasswordLoading(true);

        Object.keys(inputPassword).map((key: any) => {
            let element = document.getElementById('error-' + key);
            if (element) {
                element.innerHTML = '';
            }
        });

        if (!recaptchaRef?.current?.getValue()) {
            showSweetAlert(
                'error',
                'Verifikasi Robot', 'Anda tidak lolos verifikasi robot!',
                'OK',
                'Batal',
                () => {
                    return;
                });
            setSubmitPasswordLoading(false);
            return;
        }

        if (inputPassword.old_password != '') {
            if (inputPassword.old_password != localStorage.getItem('userPassword')) {
                showSweetAlert(
                    'error',
                    'Kata Sandi Lama Salah', 'Kata sandi lama yang Anda masukkan salah!',
                    'OK',
                    'Batal',
                    () => {
                        return;
                    });
                setSubmitPasswordLoading(false);
                return;
            }
        }

        postSavePassword(inputPassword).then((res: any) => {
            if (res.status == 'success') {
                showAlert('success', res.message);
                setInputPassword({
                    old_password: '',
                    password: '',
                    password_confirmation: '',
                });
                setIsEditPassword(false);
                setSubmitPasswordLoading(false);
            }

            if (res.status == 'error validation') {
                Object.keys(res.message).map((key: any) => {
                    let element = document.getElementById('error-' + key);
                    if (element) {
                        if (key) {
                            element.innerHTML = res.message[key];
                        } else {
                            element.innerHTML = '';
                        }
                    }
                    // showAlert('error', res?.message[key] ?? 'Data gagal disimpan');
                });
                setSubmitPasswordLoading(false);
            }

            if (res.status == 'error') {
                showAlert('error', res.message);
                setSubmitPasswordLoading(false);
            }
        });
    }


    return (
        <div>
            <div className="pt-5">
                <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3 xl:grid-cols-4">
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">
                                Profil
                            </h5>

                            <div className="flex items-center gap-x-2">
                                <Tippy content={isEditProfile == false ? "Ubah Profil" : "Batal Ubah Profil"} >
                                    <button type="button"
                                        className={isEditProfile == false ? "btn btn-primary rounded-full p-2 ltr:ml-auto rtl:mr-auto" : "btn btn-danger rounded-full p-2 ltr:ml-auto rtl:mr-auto"}
                                        onClick={() => {
                                            setIsEditProfile(!isEditProfile)
                                            setIsEditPassword(false)
                                            setIsCanSubmitPassword(false);
                                        }}>
                                        <FontAwesomeIcon icon={faPenAlt} className="w-3 h-3 shrink-0" />
                                    </button>
                                </Tippy>
                                <Tippy content={isEditPassword == false ? "Ubah Kata Sandi" : "Batal Ubah Kata Sandi"} >
                                    <button type="button"
                                        className={isEditPassword == false ? "btn btn-primary rounded-full p-2 ltr:ml-auto rtl:mr-auto" : "btn btn-danger rounded-full p-2 ltr:ml-auto rtl:mr-auto"}
                                        onClick={() => {
                                            setIsEditPassword(!isEditPassword)
                                            setIsEditProfile(false)
                                            setIsCanSubmitPassword(false);
                                        }}>
                                        <FontAwesomeIcon icon={isEditPassword ? faLockOpen : faLock} className="w-3 h-3 shrink-0" />
                                    </button>
                                </Tippy>

                            </div>
                        </div>

                        {isEditProfile && (
                            <div className="mb-5">
                                <div className="flex items-center justify-center">
                                    <div className="relative h-24 w-24">
                                        <div className='group'>
                                            <img src={dataInput?.photo != '' ? dataInput?.photo : CurrentUser?.photo} alt="img" className="rounded-full h-24 w-24 object-cover bg-slate-200 p-0.5" />
                                            <div className='w-full h-full bg-slate-400 bg-opacity-0 group-hover:bg-opacity-80 rounded-full absolute top-0 left-0'>
                                                <div className='flex items-center justify-center w-full h-full font-bold text-white opacity-0 group-hover:opacity-100'>
                                                    Ganti Foto
                                                </div>
                                            </div>
                                            <input type="file" className='absolute top-0 left-0 w-full h-full cursor-pointer opacity-0'
                                                title='Ganti Foto'
                                                accept="image/*"
                                                onChange={(e) => onChangePhotoProfile(e)}
                                            />
                                        </div>
                                        {dataInput.photo != '' && (
                                            <>
                                                <Tippy content="Hapus Foto">
                                                    <button type='button' className='absolute top-0 -right-[10px] rounded-full bg-red-200 p-2 cursor-pointer' onClick={(e) => deleteTemporaryImage(e)}>
                                                        <FontAwesomeIcon icon={faTrashAlt} className="w-3 h-3 shrink-0 text-red-500" />
                                                    </button>
                                                </Tippy>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="m-auto mt-5 flex max-w-[200px] flex-col space-y-1 font-semibold text-white-dark">
                                    <div>
                                        <label className='text-xs mb-0.5'>
                                            Nama Lengkap
                                        </label>
                                        <input
                                            type="text"
                                            name="fullname"
                                            autoComplete="given-name"
                                            className="form-input"
                                            id='fullname'
                                            placeholder="Nama Lengkap"
                                            value={dataInput.fullname}
                                            onChange={(e) => setDataInput({ ...dataInput, fullname: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className='text-xs mb-0.5'>
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            name="username"
                                            autoComplete="given-name"
                                            className="form-input"
                                            placeholder="Username"
                                            id='username'
                                            value={dataInput.username}
                                            onChange={(e) => setDataInput({ ...dataInput, username: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className='text-xs mb-0.5'>
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            autoComplete="given-name"
                                            className="form-input"
                                            placeholder="Email"
                                            id='email'
                                            value={dataInput.email}
                                            onChange={(e) => setDataInput({ ...dataInput, email: e.target.value })}
                                        />
                                    </div>

                                    {saveLoadingProfile == false ? (
                                        <>
                                            <div className="flex justify-center pt-2">
                                                <button type="submit" className="btn btn-success" onClick={() => { saveProfile() }}>
                                                    Simpan
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="pt-2 flex justify-center items-center">
                                                <button type="button" className="btn btn-success flex justify-center items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-transparent border-l-white rounded-full animate-spin"></div>
                                                    Menyimpan...
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {isEditPassword && (
                            <div className='space-y-4'>

                                <div className="pb-2 border-b font-semibold text-center">
                                    Ubah Kata Sandi
                                </div>

                                <div>
                                    <label className='text-xs mb-0.5'>
                                        Kata Sandi Lama
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="old_password"
                                            autoComplete="off"
                                            className="form-input"
                                            id='old_password"'
                                            placeholder="Kata Sandi Lama"
                                            value={inputPassword.old_password}
                                            onChange={(e) => {
                                                setInputPassword((prev: any) => ({
                                                    ...prev,
                                                    old_password: e.target.value
                                                }))
                                            }}
                                        />
                                        <div className="absolute top-0 right-0 h-full w-10 flex items-center justify-center rounded-r bg-slate-100 border">
                                            <div
                                                onClick={() => {
                                                    setShowPassword(!showPassword)
                                                }}
                                                className="cursor-pointer">
                                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className={`${showPassword ? 'text-green-500' : ''} w-4 h-4 shrink-0`} />
                                            </div>
                                        </div>
                                    </div>
                                    <div id="error-old_password" className='text-red-500 text-xs'></div>
                                </div>

                                <div>
                                    <label className='text-xs mb-0.5'>
                                        Kata Sandi Baru
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            autoComplete="off"
                                            className="form-input"
                                            id='password"'
                                            placeholder="Kata Sandi Baru"
                                            value={inputPassword.password}
                                            onChange={(e) => {
                                                setInputPassword((prev: any) => ({
                                                    ...prev,
                                                    password: e.target.value
                                                }))
                                            }}
                                        />
                                        <div className="absolute top-0 right-0 h-full w-10 flex items-center justify-center rounded-r bg-slate-100 border">
                                            <div
                                                onClick={() => {
                                                    setShowPassword(!showPassword)
                                                }}
                                                className="cursor-pointer">
                                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className={`${showPassword ? 'text-green-500' : ''} w-4 h-4 shrink-0`} />
                                            </div>
                                        </div>
                                    </div>
                                    <div id="error-password" className='text-red-500 text-xs'></div>
                                </div>

                                <div>
                                    <label className='text-xs mb-0.5'>
                                        Konfirmasi Kata Sandi Baru
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password_confirmation"
                                            autoComplete="off"
                                            className="form-input"
                                            id='password_confirmation"'
                                            placeholder="Konfirmasi Kata Sandi Baru"
                                            value={inputPassword.password_confirmation}
                                            onChange={(e) => {
                                                setInputPassword((prev: any) => ({
                                                    ...prev,
                                                    password_confirmation: e.target.value
                                                }))
                                            }}
                                        />
                                        <div className="absolute top-0 right-0 h-full w-10 flex items-center justify-center rounded-r bg-slate-100 border">
                                            <div
                                                onClick={() => {
                                                    setShowPassword(!showPassword)
                                                }}
                                                className="cursor-pointer">
                                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className={`${showPassword ? 'text-green-500' : ''} w-4 h-4 shrink-0`} />
                                            </div>
                                        </div>
                                    </div>
                                    <div id="error-password_confirmation" className='text-red-500 text-xs'></div>
                                </div>


                                <div className='relative'>
                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        sitekey="6LfFuEIpAAAAAKKQkSqEzQsWCOyC8sol7LxZkGzj"
                                        onChange={onReCAPTCHAChange}
                                    />
                                    <div id="errorCaptcha" className='validation text-red-500 text-sm'>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => {
                                            setIsEditPassword(false);
                                            setInputPassword({
                                                old_password: '',
                                                password: '',
                                                password_confirmation: '',
                                            });
                                        }}
                                    >
                                        Batal
                                    </button>

                                    <button
                                        type="button"
                                        className={`btn btn-success ${isCanSubmitPassword ? '' : 'cursor-not-allowed'}`}
                                        disabled={!isCanSubmitPassword}
                                        onClick={() => {
                                            isCanSubmitPassword &&
                                                savePassword();
                                        }}
                                    >
                                        Simpan
                                    </button>
                                </div>

                            </div>
                        )}

                        {(isEditProfile == false && isEditPassword == true) ||
                            (isEditProfile == true && isEditPassword == false) ||
                            (isEditProfile == false || isEditPassword == false)
                            && (
                                <div className="mb-5">
                                    <div className="flex flex-col items-center justify-center">
                                        <img src={CurrentUser?.photo} alt="img" className="mb-5 h-24 w-24 rounded-full object-cover bg-slate-200 p-0.5" />
                                        <p className="text-xl font-semibold text-primary">
                                            {CurrentUser?.fullname ?? ''}
                                        </p>
                                    </div>
                                    <ul className="m-auto mt-5 flex max-w-[160px] flex-col space-y-4 font-semibold text-white-dark">
                                        <li className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faUserTag} className="w-5 h-5 shrink-0" />
                                            {CurrentUser?.role_name ?? ''}
                                        </li>
                                        <li>
                                            <button className="flex items-center gap-2">
                                                <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 shrink-0" />
                                                <span className="truncate text-primary">
                                                    {CurrentUser?.email ?? ''}
                                                </span>
                                            </button>
                                        </li>
                                        {CurrentUser?.instance_name && (
                                            <>
                                                <li className="flex items-center gap-2">
                                                    <FontAwesomeIcon icon={faBriefcase} className="w-5 h-5 shrink-0" />
                                                    <span className="whitespace-nowrap" dir="ltr">
                                                        {CurrentUser?.instance_name ?? ''}
                                                    </span>
                                                </li>
                                            </>
                                        )}
                                    </ul>

                                </div>
                            )}
                    </div>

                    <div className="panel lg:col-span-2 xl:col-span-3">

                        <div className="w-full flex items-center mb-5">

                            <button
                                onClick={(e) => {
                                    setTab(1)
                                }}
                                className={`${tab === 1 ? 'text-white !outline-none before:!w-full bg-blue-500' : ''} grow text-blue-500 !outline-none relative -mb-[1px] flex items-center justify-center gap-2 p-4 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-blue-500 before:transition-all before:duration-700 hover:before:w-full`}
                            >
                                <FontAwesomeIcon icon={faList} className='w-4 h-4' />
                                <span className='font-semibold whitespace-nowrap uppercase'>
                                    Aktivitas Terakhir
                                </span>
                            </button>

                            <button
                                onClick={(e) => {
                                    setTab(2)
                                }}
                                className={`${tab === 2 ? 'text-white !outline-none before:!w-full bg-blue-500' : ''} grow text-blue-500 !outline-none relative -mb-[1px] flex items-center justify-center gap-2 p-4 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-blue-500 before:transition-all before:duration-700 hover:before:w-full`}
                            >
                                <FontAwesomeIcon icon={faBell} className='w-4 h-4' />
                                <span className='font-semibold whitespace-nowrap uppercase'>
                                    Pemberitahuan
                                </span>
                            </button>

                        </div>

                        {tab === 1 && (
                            <div className="mb-5">
                                <div className="table-responsive font-semibold text-[#515365] dark:text-white-light h-[calc(100vh-300px)]">
                                    <table className="">
                                        <thead>
                                            <tr className='!bg-slate-800 text-white'>
                                                <th className='!w-[0px] !text-center'>
                                                    <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 shrink-0" />
                                                </th>
                                                <th className="text-center"></th>
                                                <th className="text-center !w-[150px]"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="dark:text-white-dark">

                                            {userLogs?.map((item: any, index: number) => (
                                                <>
                                                    <tr className='bg-slate-100 dark:bg-slate-700'>
                                                        <td colSpan={3}>
                                                            <div className="flex items-center gap-2">
                                                                <div>
                                                                    {new Date(item?.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                                </div>

                                                                {/* display OS from item?.user_agent */}
                                                                <div className='flex items-center gap-2'>
                                                                    <div>
                                                                        |
                                                                    </div>
                                                                    {item?.device == 'Macintosh' && (
                                                                        <Tippy content="Macintosh">
                                                                            <FontAwesomeIcon icon={faApple} className="w-4.5 h-4.5 shrink-0" />
                                                                        </Tippy>
                                                                    )}
                                                                    {item?.device == 'Windows' && (
                                                                        <Tippy content="Windows">
                                                                            <FontAwesomeIcon icon={faWindows} className="w-4 h-4 shrink-0" />
                                                                        </Tippy>
                                                                    )}
                                                                    {item?.device == 'Linux' && (
                                                                        <Tippy content="Linux">
                                                                            <FontAwesomeIcon icon={faUbuntu} className="w-4 h-4 shrink-0" />
                                                                        </Tippy>
                                                                    )}
                                                                    {!['Macintosh', 'Windows', 'Linux'].includes(item?.device) && (
                                                                        <>
                                                                            {item?.device}
                                                                        </>
                                                                    )}
                                                                </div>

                                                                <div className='flex items-center gap-2'>
                                                                    <div>
                                                                        |
                                                                    </div>
                                                                    {item?.browser == 'Chrome' && (
                                                                        <Tippy content="Chrome">
                                                                            <FontAwesomeIcon icon={faChrome} className="w-4 h-4 shrink-0" />
                                                                        </Tippy>
                                                                    )}
                                                                    {item?.browser == 'Firefox' && (
                                                                        <Tippy content="Firefox">
                                                                            <FontAwesomeIcon icon={faFirefox} className="w-4 h-4 shrink-0" />
                                                                        </Tippy>
                                                                    )}
                                                                    {item?.browser == 'Safari' && (
                                                                        <Tippy content="Safari">
                                                                            <FontAwesomeIcon icon={faSafari} className="w-4 h-4 shrink-0" />
                                                                        </Tippy>
                                                                    )}
                                                                    {item?.browser == 'Opera' && (
                                                                        <Tippy content="Opera">
                                                                            <FontAwesomeIcon icon={faOpera} className="w-4 h-4 shrink-0" />
                                                                        </Tippy>
                                                                    )}
                                                                    {item?.browser == 'Brave' && (
                                                                        <Tippy content="Brave">
                                                                            <FontAwesomeIcon icon={faBrave} className="w-4 h-4 shrink-0" />
                                                                        </Tippy>
                                                                    )}


                                                                    {!['Chrome', 'Firefox', 'Safari', 'Opera', 'Brave'].includes(item?.browser) && (
                                                                        <>
                                                                            {item?.browser}
                                                                        </>
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    | &nbsp;
                                                                    {item?.ip_address}
                                                                </div>

                                                            </div>
                                                        </td>
                                                    </tr>
                                                    {item?.logs?.map((log: any, index: number) => (
                                                        <tr>
                                                            <td></td>
                                                            <td>
                                                                <div className="flex items-center gap-x-2 text-slate-500">
                                                                    <FontAwesomeIcon icon={faTag} className="w-4 h-4 shrink-0" />
                                                                    <div className="">
                                                                        {log?.description}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="text-center">
                                                                <div className="flex items-center gap-1 text-slate-400">
                                                                    <FontAwesomeIcon icon={faClock} className="w-3 h-3 shrink-0" />
                                                                    <div>
                                                                        {new Date(log?.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr >
                                                    ))}
                                                </>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex items-center justify-center gap-2 mt-4">
                                    {userLogsPage > 1 && (
                                        <button
                                            onClick={() => {
                                                setUserLogsPage(userLogsPage - 1);
                                            }}
                                            className="btn btn-sm btn-primary"
                                        >
                                            <FontAwesomeIcon icon={faAngleDoubleLeft} className="w-3 h-3 shrink-0" />
                                        </button>
                                    )}

                                    <button
                                        className="btn btn-sm btn-primary"
                                    >
                                        <span className='text-[10px]'>
                                            {userLogsPage}
                                        </span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setUserLogsPage(userLogsPage + 1);
                                        }}
                                        className="btn btn-sm btn-primary"
                                    >
                                        <FontAwesomeIcon icon={faAngleDoubleRight} className="w-3 h-3 shrink-0" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {tab === 2 && (
                            <div className="mb-5">
                                <div className="table-responsive font-semibold text-[#515365] dark:text-white-light h-[calc(100vh-300px)]">
                                    <table>
                                        <tbody>
                                            {notifications?.length > 0 && (
                                                <>
                                                    {notifications?.map((notif: any, index: number) => (
                                                        <tr>
                                                            <td className='!w-[250px]'>
                                                                <div className="flex items-center gap-2">
                                                                    <img src={notif?.photo} alt="img" className="w-8 h-8 rounded-full object-cover" />
                                                                    <div className="">
                                                                        <div>
                                                                            {notif?.fullname}
                                                                        </div>
                                                                        <div className="text-[10px] text-slate-400 font-normal">
                                                                            {notif?.user_role} |
                                                                            <span className='mx-1 font-semibold text-slate-600 dark:text-white'>
                                                                                {notif?.user_instance_alias}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <Link
                                                                    href={notif?.uri}
                                                                    className='hover:text-blue-500'
                                                                >
                                                                    <div className="">
                                                                        {notif?.title}
                                                                    </div>
                                                                    <div className="font-normal">
                                                                        {notif?.message}
                                                                    </div>
                                                                </Link>
                                                            </td>
                                                            <td className='!w-[150px]'>
                                                                <div className="flex items-center gap-1">
                                                                    <FontAwesomeIcon icon={faClock} className="w-3 h-3 shrink-0" />
                                                                    <div className="text-xs whitespace-nowrap">
                                                                        {/* {notif?.time} */}
                                                                        {new Date(notif?.date).toLocaleTimeString('id-ID', {
                                                                            day: '2-digit',
                                                                            month: '2-digit',
                                                                            year: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })} WIB
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex items-center justify-center gap-2 mt-4">
                                    {notificationPage > 1 && (
                                        <button
                                            onClick={() => {
                                                setNotificationPage(notificationPage - 1);
                                            }}
                                            className="btn btn-sm btn-primary"
                                        >
                                            <FontAwesomeIcon icon={faAngleDoubleLeft} className="w-3 h-3 shrink-0" />
                                        </button>
                                    )}

                                    <button
                                        className="btn btn-sm btn-primary"
                                    >
                                        <span className='text-[10px]'>
                                            {notificationPage}
                                        </span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setNotificationPage(notificationPage + 1);
                                        }}
                                        className="btn btn-sm btn-primary"
                                    >
                                        <FontAwesomeIcon icon={faAngleDoubleRight} className="w-3 h-3 shrink-0" />
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* <div className="panel lg:col-span-2 xl:col-span-3">
                        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-center h-full w-full text-warning cursor-pointer hover:text-orange-600 hover:bg-orange-50 duration-500">
                            <div>
                                <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 shrink-0" />
                            </div>
                            <div>
                                Work In Progress
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="panel">
                        <div className="mb-5">
                            <h5 className="text-lg font-semibold dark:text-white-light">Summary</h5>
                        </div>
                        <div className="space-y-4">
                            <div className="rounded border border-[#ebedf2] dark:border-0 dark:bg-[#1b2e4b]">
                                <div className="flex items-center justify-between p-4 py-2">
                                    <div className="grid h-9 w-9 place-content-center rounded-md bg-secondary-light text-secondary dark:bg-secondary dark:text-secondary-light">
                                        <IconShoppingBag />
                                    </div>
                                    <div className="flex flex-auto items-start justify-between font-semibold ltr:ml-4 rtl:mr-4">
                                        <h6 className="text-[13px] text-white-dark dark:text-white-dark">
                                            Income
                                            <span className="block text-base text-[#515365] dark:text-white-light">$92,600</span>
                                        </h6>
                                        <p className="text-secondary ltr:ml-auto rtl:mr-auto">90%</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded border border-[#ebedf2] dark:border-0 dark:bg-[#1b2e4b]">
                                <div className="flex items-center justify-between p-4 py-2">
                                    <div className="grid h-9 w-9 place-content-center rounded-md bg-info-light text-info dark:bg-info dark:text-info-light">
                                        <IconTag />
                                    </div>
                                    <div className="flex flex-auto items-start justify-between font-semibold ltr:ml-4 rtl:mr-4">
                                        <h6 className="text-[13px] text-white-dark dark:text-white-dark">
                                            Profit
                                            <span className="block text-base text-[#515365] dark:text-white-light">$37,515</span>
                                        </h6>
                                        <p className="text-info ltr:ml-auto rtl:mr-auto">65%</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded border border-[#ebedf2] dark:border-0 dark:bg-[#1b2e4b]">
                                <div className="flex items-center justify-between p-4 py-2">
                                    <div className="grid h-9 w-9 place-content-center rounded-md bg-warning-light text-warning dark:bg-warning dark:text-warning-light">
                                        <IconCreditCard />
                                    </div>
                                    <div className="flex flex-auto items-start justify-between font-semibold ltr:ml-4 rtl:mr-4">
                                        <h6 className="text-[13px] text-white-dark dark:text-white-dark">
                                            Expenses
                                            <span className="block text-base text-[#515365] dark:text-white-light">$55,085</span>
                                        </h6>
                                        <p className="text-warning ltr:ml-auto rtl:mr-auto">80%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="panel">
                        <div className="mb-10 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Pro Plan</h5>
                            <button className="btn btn-primary">Renew Now</button>
                        </div>
                        <div className="group">
                            <ul className="mb-7 list-inside list-disc space-y-2 font-semibold text-white-dark">
                                <li>10,000 Monthly Visitors</li>
                                <li>Unlimited Reports</li>
                                <li>2 Years Data Storage</li>
                            </ul>
                            <div className="mb-4 flex items-center justify-between font-semibold">
                                <p className="flex items-center rounded-full bg-dark px-2 py-1 text-xs font-semibold text-white-light">
                                    <IconClock className="w-3 h-3 ltr:mr-1 rtl:ml-1" />
                                    5 Days Left
                                </p>
                                <p className="text-info">$25 / month</p>
                            </div>
                            <div className="mb-5 h-2.5 overflow-hidden rounded-full bg-dark-light p-0.5 dark:bg-dark-light/10">
                                <div className="relative h-full w-full rounded-full bg-gradient-to-r from-[#f67062] to-[#fc5296]" style={{ width: '65%' }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Payment History</h5>
                        </div>
                        <div>
                            <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                                <div className="flex items-center justify-between py-2">
                                    <h6 className="font-semibold text-[#515365] dark:text-white-dark">
                                        March
                                        <span className="block text-white-dark dark:text-white-light">Pro Membership</span>
                                    </h6>
                                    <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                        <p className="font-semibold">90%</p>
                                        <div className="dropdown ltr:ml-4 rtl:mr-4">
                                            <Dropdown
                                                offset={[0, 5]}
                                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                                btnClassName="hover:text-primary"
                                                button={<IconHorizontalDots className="opacity-80 hover:opacity-100" />}
                                            >
                                                <ul className="!min-w-[150px]">
                                                    <li>
                                                        <button type="button">View Invoice</button>
                                                    </li>
                                                    <li>
                                                        <button type="button">Download Invoice</button>
                                                    </li>
                                                </ul>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                                <div className="flex items-center justify-between py-2">
                                    <h6 className="font-semibold text-[#515365] dark:text-white-dark">
                                        February
                                        <span className="block text-white-dark dark:text-white-light">Pro Membership</span>
                                    </h6>
                                    <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                        <p className="font-semibold">90%</p>
                                        <div className="dropdown ltr:ml-4 rtl:mr-4">
                                            <Dropdown
                                                offset={[0, 5]}
                                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                                button={<IconHorizontalDots className="opacity-80 hover:opacity-100" />}
                                            >
                                                <ul className="!min-w-[150px]">
                                                    <li>
                                                        <button type="button">View Invoice</button>
                                                    </li>
                                                    <li>
                                                        <button type="button">Download Invoice</button>
                                                    </li>
                                                </ul>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between py-2">
                                    <h6 className="font-semibold text-[#515365] dark:text-white-dark">
                                        January
                                        <span className="block text-white-dark dark:text-white-light">Pro Membership</span>
                                    </h6>
                                    <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                        <p className="font-semibold">90%</p>
                                        <div className="dropdown ltr:ml-4 rtl:mr-4">
                                            <Dropdown
                                                offset={[0, 5]}
                                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                                button={<IconHorizontalDots className="opacity-80 hover:opacity-100" />}
                                            >
                                                <ul className="!min-w-[150px]">
                                                    <li>
                                                        <button type="button">View Invoice</button>
                                                    </li>
                                                    <li>
                                                        <button type="button">Download Invoice</button>
                                                    </li>
                                                </ul>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Card Details</h5>
                        </div>
                        <div>
                            <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex-none">
                                        <img src="/assets/images/card-americanexpress.svg" alt="img" />
                                    </div>
                                    <div className="flex flex-auto items-center justify-between ltr:ml-4 rtl:mr-4">
                                        <h6 className="font-semibold text-[#515365] dark:text-white-dark">
                                            American Express
                                            <span className="block text-white-dark dark:text-white-light">Expires on 12/2025</span>
                                        </h6>
                                        <span className="badge bg-success ltr:ml-auto rtl:mr-auto">Primary</span>
                                    </div>
                                </div>
                            </div>
                            <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex-none">
                                        <img src="/assets/images/card-mastercard.svg" alt="img" />
                                    </div>
                                    <div className="flex flex-auto items-center justify-between ltr:ml-4 rtl:mr-4">
                                        <h6 className="font-semibold text-[#515365] dark:text-white-dark">
                                            Mastercard
                                            <span className="block text-white-dark dark:text-white-light">Expires on 03/2025</span>
                                        </h6>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex-none">
                                        <img src="/assets/images/card-visa.svg" alt="img" />
                                    </div>
                                    <div className="flex flex-auto items-center justify-between ltr:ml-4 rtl:mr-4">
                                        <h6 className="font-semibold text-[#515365] dark:text-white-dark">
                                            Visa
                                            <span className="block text-white-dark dark:text-white-light">Expires on 10/2025</span>
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

            </div>
        </div>
    );
};

export default Profile;
