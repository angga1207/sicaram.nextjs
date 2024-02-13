import Link from 'next/link';
import { useEffect, useState, Fragment, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBriefcase, faExclamationTriangle, faTag, faUserTag } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope, faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import { updateUserWithPhoto } from '../../apis/storedata';

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

const Profile = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Profil'));
    });

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [isMounted, setIsMounted] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const [CurrentUser, setCurrentUser] = useState<any>([]);
    useEffect(() => {
        if (window) {
            if (localStorage.getItem('user')) {
                setCurrentUser(JSON.parse(localStorage.getItem('user') ?? '{[]}') ?? []);
            }
        }
    }, []);

    useEffect(() => {
        setIsMounted(true)
        setIsClient(true)
    }, []);
    const { t, i18n } = useTranslation();

    const [saveLoadingProfile, setSaveLoadingProfile] = useState(false);

    const [dataInput, setDataInput] = useState({
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
        setDataInput({
            fullname: CurrentUser?.fullname ?? '',
            username: CurrentUser?.username ?? '',
            email: CurrentUser?.email ?? '',
            photo: '',
            photoFile: '',
            password: '',
            password_confirmation: '',
        })
    }, [CurrentUser]);

    const [isEditProfile, setIsEditProfile] = useState(false);

    const onChangePhotoProfile = (e) => {
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

    const deleteTemporaryImage = (e) => {
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
            if (res.message.fullname) {
                document.getElementById('fullname').classList.add('border-danger');
            } else {
                document.getElementById('fullname').classList.remove('border-danger');
            }
            if (res.message.username) {
                document.getElementById('username').classList.add('border-danger');
            } else {
                document.getElementById('fullname').classList.remove('border-danger');
            }
            if (res.message.email) {
                document.getElementById('email').classList.add('border-danger');
            } else {
                document.getElementById('fullname').classList.remove('border-danger');
            }
            // showAlert('error', res?.message ?? 'Data gagal disimpan');
            setSaveLoadingProfile(false);
        }

        if (!res || res.status == 'error') {
            showAlert('error', res?.message ?? 'Data gagal disimpan');
            setSaveLoadingProfile(false);
        }
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

                            <Tippy content={isEditProfile == false ? "Ubah Profil" : "Batal Ubah Profil"} >
                                <button type="button"
                                    // className="btn btn-primary rounded-full p-2 ltr:ml-auto rtl:mr-auto"
                                    className={isEditProfile == false ? "btn btn-primary rounded-full p-2 ltr:ml-auto rtl:mr-auto" : "btn btn-danger rounded-full p-2 ltr:ml-auto rtl:mr-auto"}
                                    onClick={() => setIsEditProfile(!isEditProfile)}>
                                    <IconPencilPaper />
                                </button>
                            </Tippy>
                        </div>
                        {isEditProfile ? (
                            <>
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
                            </>
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>

                    <div className="panel lg:col-span-2 xl:col-span-3 hidden">
                        <div className="mb-5">
                            <h5 className="text-lg font-semibold dark:text-white-light">Task</h5>
                        </div>
                        <div className="mb-5">
                            <div className="table-responsive font-semibold text-[#515365] dark:text-white-light">
                                <table className="whitespace-nowrap">
                                    <thead>
                                        <tr>
                                            <th>Projects</th>
                                            <th>Progress</th>
                                            <th>Task Done</th>
                                            <th className="text-center">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="dark:text-white-dark">
                                        <tr>
                                            <td>Figma Design</td>
                                            <td>
                                                <div className="flex h-1.5 w-full rounded-full bg-[#ebedf2] dark:bg-dark/40">
                                                    <div className="w-[29.56%] rounded-full bg-danger"></div>
                                                </div>
                                            </td>
                                            <td className="text-danger">29.56%</td>
                                            <td className="text-center">2 mins ago</td>
                                        </tr>
                                        <tr>
                                            <td>Vue Migration</td>
                                            <td>
                                                <div className="flex h-1.5 w-full rounded-full bg-[#ebedf2] dark:bg-dark/40">
                                                    <div className="w-1/2 rounded-full bg-info"></div>
                                                </div>
                                            </td>
                                            <td className="text-success">50%</td>
                                            <td className="text-center">4 hrs ago</td>
                                        </tr>
                                        <tr>
                                            <td>Flutter App</td>
                                            <td>
                                                <div className="flex h-1.5 w-full rounded-full bg-[#ebedf2] dark:bg-dark/40">
                                                    <div className="w-[39%] rounded-full  bg-warning"></div>
                                                </div>
                                            </td>
                                            <td className="text-danger">39%</td>
                                            <td className="text-center">a min ago</td>
                                        </tr>
                                        <tr>
                                            <td>API Integration</td>
                                            <td>
                                                <div className="flex h-1.5 w-full rounded-full bg-[#ebedf2] dark:bg-dark/40">
                                                    <div className="w-[78.03%] rounded-full  bg-success"></div>
                                                </div>
                                            </td>
                                            <td className="text-success">78.03%</td>
                                            <td className="text-center">2 weeks ago</td>
                                        </tr>

                                        <tr>
                                            <td>Blog Update</td>
                                            <td>
                                                <div className="flex h-1.5 w-full rounded-full bg-[#ebedf2] dark:bg-dark/40">
                                                    <div className="w-full  rounded-full  bg-secondary"></div>
                                                </div>
                                            </td>
                                            <td className="text-success">100%</td>
                                            <td className="text-center">18 hrs ago</td>
                                        </tr>
                                        <tr>
                                            <td>Landing Page</td>
                                            <td>
                                                <div className="flex h-1.5 w-full rounded-full bg-[#ebedf2] dark:bg-dark/40">
                                                    <div className="w-[19.15%] rounded-full  bg-danger"></div>
                                                </div>
                                            </td>
                                            <td className="text-danger">19.15%</td>
                                            <td className="text-center">5 days ago</td>
                                        </tr>
                                        <tr>
                                            <td>Shopify Dev</td>
                                            <td>
                                                <div className="flex h-1.5 w-full rounded-full bg-[#ebedf2] dark:bg-dark/40">
                                                    <div className="w-[60.55%] rounded-full bg-primary"></div>
                                                </div>
                                            </td>
                                            <td className="text-success">60.55%</td>
                                            <td className="text-center">8 days ago</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="panel lg:col-span-2 xl:col-span-3">
                        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-center h-full w-full text-warning cursor-pointer hover:text-orange-600 hover:bg-orange-50 duration-500">
                            <div>
                                <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 shrink-0" />
                            </div>
                            <div>
                                Work In Progress
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 hidden">
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
                </div>

            </div>
        </div>
    );
};

export default Profile;
