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

            {/* Right */}
            <div className="relative flex w-full flex-col items-start justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 sm:pl-24">
                <div className="w-full">

                    <div className="flex items-center justify-center mb-12">
                        <div className="text-center">
                            <h1 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
               bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500
               bg-clip-text text-transparent drop-shadow-sm">
                                BPKAD Section
                            </h1>
                            <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500"></div>
                            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                                Menu khusus untuk pengelolaan data BPKAD.
                            </p>
                        </div>
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
