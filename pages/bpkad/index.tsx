import { Player } from "@lottiefiles/react-lottie-player";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () => {

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [CurrentUser, setCurrentUser] = useState<any>([]);

    useEffect(() => {
        if (document.cookie) {
            let user = document.cookie.split(';').find((row) => row.trim().startsWith('user='))?.split('=')[1];
            user = user ? JSON.parse(user) : null;
            setCurrentUser(user);
        }
    }, [isMounted]);

    return (
        <div className="relative flex w-full max-w-full flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[calc(100vh-200px)] lg:flex-row lg:gap-10 xl:gap-0">

            {/* Left */}
            <div className="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(255,36,36,1)_0%,rgba(255,213,0,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
                <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
                <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                    <div className="ms-10 block w-auto text-[50px] font-bold uppercase text-white">
                        BPKAD SECTION
                    </div>
                    <div className="mt-24 hidden w-full max-w-[430px] lg:block">
                        {/* <img src="/assets/images/auth/login.svg" alt="Cover Image" className="w-full" /> */}
                        <Player
                            autoplay
                            loop
                            src="/lottie/bpkad-1.json"
                            className='w-[100%] h-[400px] group-hover:scale-125 transition-all duration-500'
                        >
                        </Player>
                    </div>
                </div>
            </div>

            {/* Right */}
            <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 sm:pl-24">
                <div className="w-full lg:mt-16">
                    <div className="text-xl font-bold uppercase text-primary text-center mb-12">
                        pilih menu dibawah ini untuk melanjutkan
                    </div>
                    <div className="w-full flex flex-wrap gap-4 justify-center">

                        {([1, 2, 4].includes(CurrentUser?.role_id)) && (
                            <Link
                                href={"/bpkad/import"}
                                className="panel group w-[220px]">
                                <Player
                                    autoplay
                                    loop
                                    src="/lottie/upload-1.json"
                                    className='w-[150px] h-[150px] group-hover:scale-125 transition-all duration-500'
                                >
                                </Player>
                                <div className="font-semibold text-center text-lg mt-2">
                                    Unggah Rekap 5
                                </div>
                            </Link>
                        )}

                        {([1, 2, 4].includes(CurrentUser?.role_id)) && (
                            <Link
                                href={"/bpkad/monitoring-pagu"}
                                className="panel group w-[220px]">
                                <Player
                                    autoplay
                                    loop
                                    src="/lottie/bpkad-2.json"
                                    className='w-[150px] h-[150px] group-hover:scale-125 transition-all duration-500'
                                >
                                </Player>
                                <div className="font-semibold text-center text-lg mt-2">
                                    Monitoring Pagu
                                </div>
                            </Link>
                        )}

                        {([1, 2, 4].includes(CurrentUser?.role_id)) && (
                            <Link
                                href={"/bpkad/realisasi"}
                                className="panel group w-[220px]">
                                <Player
                                    autoplay
                                    loop
                                    src="/lottie/upload-2.json"
                                    className='w-[150px] h-[150px] group-hover:scale-125 transition-all duration-500'
                                >
                                </Player>
                                <div className="font-semibold text-center text-lg mt-2">
                                    Unggah Realisasi
                                </div>
                            </Link>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;
