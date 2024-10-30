import { useEffect, useState } from "react";

const OfflineModal = () => {
    const [isOnline, setOnline] = useState<boolean>(true);
    if (typeof window !== 'undefined') {
        const updateNetworkStatus = () => {
            setOnline(navigator.onLine);
        };

        useEffect(() => {
            window.addEventListener("load", updateNetworkStatus);
            window.addEventListener("online", updateNetworkStatus);
            window.addEventListener("offline", updateNetworkStatus);

            return () => {
                window.removeEventListener("load", updateNetworkStatus);
                window.removeEventListener("online", updateNetworkStatus);
                window.removeEventListener("offline", updateNetworkStatus);
            };
        }, [navigator.onLine]);
    }

    if (isOnline == false) {
        return (
            <div className="fixed inset-0 bg-[black]/90 backdrop-blur-xs z-[9999] overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <div className="text-white text-xl font-semibold text-center">
                        Anda Sedang Offline.
                        <br />
                        Mohon Periksa Koneksi Internet Anda!
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <>
            </>
        );
    }
}

export default OfflineModal;
