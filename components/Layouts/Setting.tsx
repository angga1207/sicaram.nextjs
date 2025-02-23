import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { toggleAnimation, toggleLayout, toggleMenu, toggleNavbar, toggleRTL, toggleTheme, toggleSemidark, toggleShowMoney } from '../../store/themeConfigSlice';
import IconSettings from '../Icon/IconSettings';
import IconX from '../Icon/IconX';
import IconSun from '../Icon/IconSun';
import IconMoon from '../Icon/IconMoon';
import IconLaptop from '../Icon/IconLaptop';
import IconEye from '../Icon/IconEye';

const Setting = () => {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();

    const [showCustomizer, setShowCustomizer] = useState(false);

    return (
        <div>
            <div className={`${(showCustomizer && '!block') || ''} fixed inset-0 z-[51] hidden bg-[black]/60 px-4 transition-[display]`} onClick={() => setShowCustomizer(false)}></div>

            <nav
                className={`${(showCustomizer && 'ltr:!right-0 rtl:!left-0') || ''
                    } fixed top-0 bottom-0 z-[51] w-full max-w-[400px] bg-white p-4 shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-[right] duration-300 ltr:-right-[400px] rtl:-left-[400px] dark:bg-black`}
            >
                <button
                    type="button"
                    className="absolute tops-0 bottom-16 my-auto flex h-10 w-12 cursor-pointer items-center justify-center bg-primary text-white ltr:-left-12 ltr:rounded-tl-full ltr:rounded-bl-full rtl:-right-12 rtl:rounded-tr-full rtl:rounded-br-full"
                    onClick={() => setShowCustomizer(!showCustomizer)}
                >
                    <IconSettings className="animate-[spin_3s_linear_infinite] w-5 h-5" />
                </button>

                <div className="perfect-scrollbar h-full overflow-y-auto overflow-x-hidden">
                    <div className="relative pb-5 text-center">
                        <button type="button" className="absolute top-0 opacity-30 hover:opacity-100 ltr:right-0 rtl:left-0 dark:text-white" onClick={() => setShowCustomizer(false)}>
                            <IconX className="w-5 h-5" />
                        </button>

                        <h4 className="mb-1 dark:text-white">
                            Pengaturan Tampilan Aplikasi
                        </h4>
                    </div>

                    <div className="mb-3 rounded-md border border-dashed border-white-light p-3 dark:border-[#1b2e4b]">
                        <h5 className="mb-1 text-base leading-none dark:text-white">
                            Mode Tampilan
                        </h5>
                        <p className="text-xs text-white-dark">
                            Pilih mode tampilan untuk aplikasi Anda.
                        </p>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            <button type="button" className={`${themeConfig.theme === 'light' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => dispatch(toggleTheme('light'))}>
                                <IconSun className="w-5 h-5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                Siang
                            </button>

                            <button type="button" className={`${themeConfig.theme === 'dark' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => dispatch(toggleTheme('dark'))}>
                                <IconMoon className="w-5 h-5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                Malam
                            </button>

                            <button type="button" className={`${themeConfig.theme === 'system' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => dispatch(toggleTheme('system'))}>
                                <IconLaptop className="w-5 h-5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                Sistem
                            </button>
                        </div>
                    </div>

                    <div className="mb-3 rounded-md border border-dashed border-white-light p-3 dark:border-[#1b2e4b]">
                        <h5 className="mb-1 text-base leading-none dark:text-white">
                            Menu
                        </h5>
                        <p className="text-xs text-white-dark">
                            Pilih tipe menu utama untuk aplikasi Anda.
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                            {/* <button type="button" className={`${themeConfig.menu === 'horizontal' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => dispatch(toggleMenu('horizontal'))}>
                                Horizontal
                            </button> */}

                            <button type="button" className={`${themeConfig.menu === 'vertical' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => dispatch(toggleMenu('vertical'))}>
                                Vertical
                            </button>

                            <button
                                type="button"
                                className={`${themeConfig.menu === 'collapsible-vertical' ? 'btn-primary' : 'btn-outline-primary'} btn`}
                                onClick={() => dispatch(toggleMenu('collapsible-vertical'))}
                            >
                                Collapsible
                            </button>
                        </div>
                        <div className="mt-5 text-primary">
                            <label className="mb-0 inline-flex">
                                <input type="checkbox" className="form-checkbox" checked={themeConfig.semidark} onChange={(e) => dispatch(toggleSemidark(e.target.checked))} />
                                <span>
                                    <span className="text-xs">Semi Dark</span>
                                    <span className="text-xs text-white-dark"> (Sidebar & Header)</span>
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="mb-3 rounded-md border border-dashed border-white-light p-3 dark:border-[#1b2e4b]">
                        <h5 className="mb-1 text-base leading-none dark:text-white">
                            Layout
                        </h5>
                        <p className="text-xs text-white-dark">
                            Pilih tipe layout utama untuk aplikasi Anda.
                        </p>
                        <div className="mt-3 flex gap-2">
                            <button
                                type="button"
                                className={`${themeConfig.layout === 'boxed-layout' ? 'btn-primary' : 'btn-outline-primary'} btn flex-auto`}
                                onClick={() => dispatch(toggleLayout('boxed-layout'))}
                            >
                                Kotak
                            </button>

                            <button type="button" className={`${themeConfig.layout === 'full' ? 'btn-primary' : 'btn-outline-primary'} btn flex-auto`} onClick={() => dispatch(toggleLayout('full'))}>
                                Penuh
                            </button>
                        </div>
                    </div>

                    <div className="mb-3 rounded-md border border-dashed border-white-light p-3 dark:border-[#1b2e4b]">
                        <h5 className="mb-1 text-base leading-none dark:text-white">
                            Navbar
                        </h5>
                        <p className="text-xs text-white-dark">
                            Pilih tipe navbar untuk aplikasi Anda.
                        </p>
                        <div className="mt-3 flex items-center gap-3 text-primary">
                            <label className="mb-0 inline-flex">
                                <input
                                    type="radio"
                                    checked={themeConfig.navbar === 'navbar-sticky'}
                                    value="navbar-sticky"
                                    className="form-radio"
                                    onChange={() => dispatch(toggleNavbar('navbar-sticky'))}
                                />
                                <span>Tempel</span>
                            </label>
                            <label className="mb-0 inline-flex">
                                <input
                                    type="radio"
                                    checked={themeConfig.navbar === 'navbar-floating'}
                                    value="navbar-floating"
                                    className="form-radio"
                                    onChange={() => dispatch(toggleNavbar('navbar-floating'))}
                                />
                                <span>Melayang</span>
                            </label>
                            <label className="mb-0 inline-flex">
                                <input
                                    type="radio"
                                    checked={themeConfig.navbar === 'navbar-static'}
                                    value="navbar-static"
                                    className="form-radio"
                                    onChange={() => dispatch(toggleNavbar('navbar-static'))}
                                />
                                <span>Statis</span>
                            </label>
                        </div>
                    </div>

                    <div className="mb-3 rounded-md border border-dashed border-white-light p-3 dark:border-[#1b2e4b]">
                        <h5 className="mb-1 text-base leading-none dark:text-white">Router Transition</h5>
                        <p className="text-xs text-white-dark">Animation of main content.</p>
                        <div className="mt-3">
                            <select className="form-select border-primary text-primary"
                                value={themeConfig.animation}
                                onChange={(e) => dispatch(toggleAnimation(e.target.value))}>
                                <option value=" ">None</option>
                                <option value="animate__fadeIn">Fade</option>
                                <option value="animate__fadeInDown">Fade Down</option>
                                <option value="animate__fadeInUp">Fade Up</option>
                                <option value="animate__fadeInLeft">Fade Left</option>
                                <option value="animate__fadeInRight">Fade Right</option>
                                <option value="animate__slideInDown">Slide Down</option>
                                <option value="animate__slideInLeft">Slide Left</option>
                                <option value="animate__slideInRight">Slide Right</option>
                                <option value="animate__zoomIn">Zoom In</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-3 rounded-md border border-dashed border-white-light p-3 dark:border-[#1b2e4b]">
                        <h5 className="mb-1 text-base leading-none dark:text-white">
                            Mode Tampilan Uang
                        </h5>
                        <p className="text-xs text-white-dark">
                            Pilih mode tampilan uang untuk aplikasi Anda.
                        </p>
                        <div className="mt-3 flex gap-2">
                            <button type="button" className={`${themeConfig.showMoney === true ? 'btn-primary' : 'btn-outline-primary'} btn flex-auto`} onClick={() => dispatch(toggleShowMoney(true))}>
                                <IconEye className="w-5 h-5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                Tamplikan
                            </button>

                            <button type="button" className={`${themeConfig.showMoney === false ? 'btn-primary' : 'btn-outline-primary'} btn flex-auto`} onClick={() => dispatch(toggleShowMoney(false))}>
                                <IconX className="w-5 h-5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                Sembunyikan
                            </button>
                        </div>
                    </div>

                </div>
            </nav>
        </div>
    );
};

export default Setting;
