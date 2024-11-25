import Select from 'react-select';
import { faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';


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

const RekapBelanja = (data: any) => {
    const paramData = data.data
    const router = useRouter();
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

    const [instance, setInstance] = useState<any>((router.query.instance ?? null) ?? CurrentUser?.instance_id);
    const [instances, setInstances] = useState<any>([]);
    const [arrKodeRekening, setArrKodeRekening] = useState<any>([])

    useEffect(() => {
        if (paramData[0]?.length > 0) {
            setInstances(paramData[0]);
        }
    }, [isMounted, paramData]);

    useEffect(() => {
        if (paramData[1]?.length > 0) {
            setArrKodeRekening(paramData[1])
        }
    }, [isMounted, paramData]);

    const [dataInput, setDataInput] = useState<any>([]);
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    return (
        <div>
            <div className="mb-4 text-lg font-semibold underline">
                Rekap Belanja
            </div>
            <div className="">
                <div className="table-responsive mb-5 pb-5">
                    <table className="table-striped">
                        <thead>
                            <tr>
                                <th>
                                    Perangkat Daerah
                                </th>
                                <th>
                                    Tanah
                                </th>
                                <th>
                                    Peralatan dan Mesin
                                </th>
                                <th>
                                    Gedung dan Bangunan
                                </th>
                                <th>
                                    Jalan Jaringan Irigasi
                                </th>
                                <th>
                                    Aset Tetap Lainnya
                                </th>
                                <th>
                                    KDP
                                </th>
                                <th>
                                    Aset Lain-lain
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    OPD
                                </td>
                                <td>
                                    Rp. 0
                                    [DARI LRA OPD]
                                </td>
                                <td>
                                    Rp. 0
                                    [DARI LRA OPD]
                                </td>
                                <td>
                                    Rp. 0
                                    [DARI LRA OPD]
                                </td>
                                <td>
                                    Rp. 0
                                    [DARI LRA OPD]
                                </td>
                                <td>
                                    Rp. 0
                                    [DARI LRA OPD]
                                </td>
                                <td>
                                    Rp. 0
                                    [DARI LRA OPD]
                                </td>
                                <td>
                                    Rp. 0
                                    [DARI LRA OPD]
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
export default RekapBelanja;
