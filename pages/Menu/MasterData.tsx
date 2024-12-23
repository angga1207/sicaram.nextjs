import { useEffect, useState, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/themeConfigSlice';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faHomeUser } from '@fortawesome/free-solid-svg-icons';
import IconX from '@/components/Icon/IconX';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconSearch from '@/components/Icon/IconSearch';


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

const MasterData = () => {


    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        dispatch(setPageTitle('Menu Master Data'));
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

            let token = document.cookie.split(';').find((row) => row.trim().startsWith('token='))?.split('=')[1];
            setCurrentToken(token);
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


    const [modal, setModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const [selected, setSelected] = useState<any>(null);
    const [datas, setDatas] = useState<any>([]);

    useEffect(() => {
        if (isMounted) {
            setDatas([
                {
                    name: 'Master Urusan',
                    roles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12],
                    subMenu: [
                        {
                            name: 'Master Urusan',
                            roles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12],
                            url: '/master/urusan/'
                        },
                        {
                            name: 'Master Bidang Urusan',
                            roles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12],
                            url: '/master/bidang/'
                        },
                        {
                            name: 'Master Program',
                            roles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12],
                            url: '/master/program/'
                        },
                        {
                            name: 'Master Kegiatan',
                            roles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12],
                            url: '/master/kegiatan/'
                        },
                        {
                            name: 'Master Sub Kegiatan',
                            roles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12],
                            url: '/master/subkegiatan/'
                        },
                    ]
                },
                {
                    name: 'Indikator Kinerja',
                    roles: [1, 2, 3, 4, 5, 9],
                    subMenu: [
                        {
                            name: 'Indikator Kegiatan',
                            roles: [1, 2, 3, 4, 5, 9],
                            url: '/master/indikator-kinerja/kegiatan'
                        },
                        {
                            name: 'Indikator Sub Kegiatan',
                            roles: [1, 2, 3, 4, 5, 9],
                            url: '/master/indikator-kinerja/sub-kegiatan'
                        },
                    ]
                },
                {
                    name: 'Kode Rekening',
                    roles: [1, 2, 3, 4, 6, 7],
                    subMenu: [
                        {
                            name: 'Daftar Rekening',
                            roles: [1, 2, 4, 7],
                            url: '/rekening'
                        },
                        {
                            name: 'Sumber Dana',
                            roles: [1, 2, 3, 4, 6, 7],
                            url: '/sumber-dana'
                        },
                    ]
                },
                {
                    name: 'Referensi',
                    roles: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    subMenu: [
                        {
                            name: 'Periode',
                            roles: [1, 2],
                            url: '/reference/periode'
                        },
                        {
                            name: 'Satuan',
                            roles: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                            url: '/reference/satuan'
                        },
                        {
                            name: 'Tag Sumber Dana',
                            roles: [1, 2, 3, 4],
                            url: '/reference/tag-sumber-dana'
                        },
                        {
                            name: 'Tujuan & Sasaran',
                            roles: [1, 2, 3, 6],
                            url: '/reference/tujuan-sasaran'
                        },
                        {
                            name: 'Indikator Tujuan & Sasaran',
                            roles: [1, 2, 3, 6],
                            url: '/reference/indikator-tujuan-sasaran'
                        },
                    ]
                },
                {
                    name: 'Tujuan & Sasaran',
                    roles: [1, 2, 3, 6, 9],
                    subMenu: [
                        {
                            name: 'Master Tujuan Sasaran Kabupaten',
                            roles: [1, 2, 3, 6],
                            url: '/master/tujuan-sasaran'
                        },
                        {
                            name: 'Target Tujuan Sasaran Kabupaten',
                            roles: [1, 2, 3, 6],
                            url: '/target/tujuan-sasaran'
                        },
                        {
                            name: 'Target Perubahan Tujuan Sasaran Kabupaten',
                            roles: [1, 2, 3, 6],
                            url: '/target/perubahan/tujuan-sasaran'
                        },
                        {
                            name: 'Master Tujuan Sasaran',
                            roles: [1, 2, 3, 6, 9],
                            url: '/master/tujuan-sasaran/perangkat-daerah'
                        },
                        {
                            name: 'Target Tujuan Sasaran',
                            roles: [1, 2, 3, 6, 9],
                            url: '/target/tujuan-sasaran/perangkat-daerah'
                        },
                        {
                            name: 'Target Perubahan Tujuan Sasaran',
                            roles: [1, 2, 3, 6, 9],
                            url: '/target/perubahan/tujuan-sasaran-perangkat-daerah'
                        },
                    ]
                },
            ]);
        }
    }, [isMounted]);

    return (
        <>
            <div className="flex items-center justify-between mb-4 px-4">
                <div className="font-semibold text-xl uppercase">
                    MENU MASTER DATA
                </div>
                <div className="">
                    {/* <div className="relative bg-white border border-white-dark/20  w-full flex">
                        <button type="submit" placeholder="Cari Nama Menu" className="text-primary m-auto p-3 flex items-center justify-center">
                            <IconSearch className='w-5 h-5' />
                        </button>
                        <input
                            type="text"
                            placeholder="Cari Nama Menu"
                            className="form-input border-0 border-l rounded-none bg-white  focus:shadow-[0_0_5px_2px_rgb(194_213_255_/_62%)] dark:shadow-[#1b2e4b] placeholder:tracking-wider focus:outline-none py-3"
                        />
                    </div> */}
                </div>
            </div>

            <div className="flex items-center justify-center gap-x-6 gap-y-8 flex-wrap">


                <Tippy content="Master Urusan" placement='bottom'>
                    <div
                        onClick={() => {
                            setSelected(0);
                            setModal(true);
                        }}
                        className="w-full lg:w-[350px] cursor-pointer group transition-all duration-500">
                        <Player
                            autoplay
                            loop
                            src="/lottie/menu-1.json"
                            className='w-[100%] h-[200px] group-hover:scale-125 transition-all duration-500'
                        >
                        </Player>
                        <div className="mt-2 text-center text-lg uppercase font-semibold">
                            Master Urusan
                        </div>
                    </div>
                </Tippy>

                {([1, 2, 3, 6, 9].includes(CurrentUser?.role_id)) && (
                    <Tippy content="Indikator Kinerja" placement='bottom'>
                        <div
                            onClick={() => {
                                setSelected(1);
                                setModal(true);
                            }}
                            className="w-full lg:w-[350px] cursor-pointer group transition-all duration-500">
                            <Player
                                autoplay
                                loop
                                src="/lottie/menu-2.json"
                                className='w-[100%] h-[200px] group-hover:scale-125 transition-all duration-500'
                            >
                            </Player>
                            <div className="mt-2 text-center text-lg uppercase font-semibold">
                                Indikator Kinerja
                            </div>
                        </div>
                    </Tippy>
                )}

                {([1, 2, 3, 4, 6, 7].includes(CurrentUser?.role_id)) && (
                    <Tippy content="Kode Rekening" placement='bottom'>
                        <div
                            onClick={() => {
                                setSelected(2);
                                setModal(true);
                            }}
                            className="w-full lg:w-[350px] cursor-pointer group transition-all duration-500">
                            <Player
                                autoplay
                                loop
                                src="/lottie/menu-3.json"
                                className='w-[100%] h-[200px] group-hover:scale-125 transition-all duration-500'
                            >
                            </Player>
                            <div className="mt-2 text-center text-lg uppercase font-semibold">
                                Kode Rekening
                            </div>
                        </div>
                    </Tippy>
                )}

                {([1, 2, 3, 4, 5, 6, 7, 8, 9].includes(CurrentUser?.role_id)) && (
                    <Tippy content="Referensi" placement='bottom'>
                        <div
                            onClick={() => {
                                setSelected(3);
                                setModal(true);
                            }}
                            className="w-full lg:w-[350px] cursor-pointer group transition-all duration-500">
                            <Player
                                autoplay
                                loop
                                src="/lottie/menu-4.json"
                                className='w-[100%] h-[200px] group-hover:scale-125 transition-all duration-500'
                            >
                            </Player>
                            <div className="mt-2 text-center text-lg uppercase font-semibold">
                                Referensi
                            </div>
                        </div>
                    </Tippy>
                )}

                {([1, 2, 3, 6, 9].includes(CurrentUser?.role_id)) && (
                    <Tippy content="Tujuan & Sasaran" placement='bottom'>
                        <div
                            onClick={() => {
                                setSelected(4);
                                setModal(true);
                            }}
                            className="w-full lg:w-[350px] cursor-pointer group transition-all duration-500">
                            <Player
                                autoplay
                                loop
                                src="/lottie/menu-5.json"
                                className='w-[100%] h-[200px] group-hover:scale-125 transition-all duration-500'
                            >
                            </Player>
                            <div className="mt-2 text-center text-lg uppercase font-semibold">
                                Tujuan & Sasaran
                            </div>
                        </div>
                    </Tippy>
                )}

                {([1, 2, 3, 6, 9].includes(CurrentUser?.role_id)) && (
                    <Tippy content="Pohon Kinerja" placement='bottom'>
                        <Link
                            href="/pohon-kinerja"
                            className="w-full lg:w-[350px] cursor-pointer group transition-all duration-500">
                            <Player
                                autoplay
                                loop
                                src="/lottie/menu-9.json"
                                className='w-[100%] h-[200px] group-hover:scale-125 transition-all duration-500'
                            >
                            </Player>
                            <div className="mt-2 text-center text-lg uppercase font-semibold">
                                Pohon Kinerja
                            </div>
                        </Link>
                    </Tippy>
                )}

                {([1, 2, 4, 7, 9].includes(CurrentUser?.role_id)) && (
                    <Tippy content="Tagging Sumber Dana" placement='bottom'>
                        <Link
                            href="/tagging-sumber-dana"
                            className="w-full lg:w-[350px] cursor-pointer group transition-all duration-500">
                            <Player
                                autoplay
                                loop
                                src="/lottie/menu-6.json"
                                className='w-[100%] h-[200px] group-hover:scale-125 transition-all duration-500'
                            >
                            </Player>
                            <div className="mt-2 text-center text-lg uppercase font-semibold">
                                Tagging Sumber Dana
                            </div>
                        </Link>
                    </Tippy>
                )}

                {([1, 2, 3, 4, 6, 7, 9].includes(CurrentUser?.role_id)) && (
                    <>
                        <Tippy content="RPJMD" placement='bottom'>
                            <Link
                                href="/rpjmd"
                                className="w-full lg:w-[350px] cursor-pointer group transition-all duration-500">
                                <Player
                                    autoplay
                                    loop
                                    src="/lottie/menu-7.json"
                                    className='w-[100%] h-[200px] group-hover:scale-125 transition-all duration-500'
                                >
                                </Player>
                                <div className="mt-2 text-center text-lg uppercase font-semibold">
                                    RPJMD
                                </div>
                            </Link>
                        </Tippy>

                        <Tippy content="Renstra Induk" placement='bottom'>
                            <Link
                                href="/renstra"
                                className="w-full lg:w-[350px] cursor-pointer group transition-all duration-500">
                                <Player
                                    autoplay
                                    loop
                                    src="/lottie/menu-8.json"
                                    className='w-[100%] h-[200px] group-hover:scale-125 transition-all duration-500'
                                >
                                </Player>
                                <div className="mt-2 text-center text-lg uppercase font-semibold">
                                    Renstra Induk
                                </div>
                            </Link>
                        </Tippy>

                        <Tippy content="Renstra Perubahan" placement='bottom'>
                            <Link
                                href="/renja"
                                className="w-full lg:w-[350px] cursor-pointer group transition-all duration-500">
                                <Player
                                    autoplay
                                    loop
                                    src="/lottie/menu-8.json"
                                    className='w-[100%] h-[200px] group-hover:scale-125 transition-all duration-500'
                                >
                                </Player>
                                <div className="mt-2 text-center text-lg uppercase font-semibold">
                                    Renstra Perubahan
                                </div>
                            </Link>
                        </Tippy>
                    </>
                )}

            </div>

            <Transition appear show={modal} as={Fragment}>
                <Dialog as="div" open={modal} onClose={() => {
                    setModal(false);
                    setSelected(null);
                }}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-5xl my-8 text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <h5 className="font-bold text-lg">
                                            Menu {datas[selected]?.name}
                                        </h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => {
                                            setModal(false);
                                            setSelected(null);
                                        }}>
                                            <IconX className='w-5 h-5' />
                                        </button>
                                    </div>
                                    <div className="p-5">

                                        <div className="mb-5">
                                            <div className="flex flex-col rounded-md border border-white-light dark:border-[#1b2e4b]">

                                                {datas[selected]?.subMenu.map((item: any, index: number) => (
                                                    <>
                                                        {item?.roles.includes(CurrentUser?.role_id) && (
                                                            <Link href={item?.url ?? '#'} className="flex items-center border-b border-white-light dark:border-[#1b2e4b] px-4 py-2.5 hover:bg-[#eee] dark:hover:bg-[#eee]/10 cursor-pointer">
                                                                <div className="ltr:mr-2 rtl:ml-2.5 text-slate-900">
                                                                    <IconCaretDown className='w-5 h-5 -rotate-90' />
                                                                </div>
                                                                <div className="flex-1 font-semibold">
                                                                    <h6 className="text-base">
                                                                        {item?.name}
                                                                    </h6>
                                                                </div>
                                                            </Link>
                                                        )}
                                                    </>
                                                ))}

                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

        </>
    );
}

export default MasterData;
