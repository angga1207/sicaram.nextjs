import Select from 'react-select';
import { faLink, faPlus, faSave, faSpinner, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { storeSaldoAwal } from '@/apis/Accountancy/AdminOnly';


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

const ImportSaldoAwal = (data: any) => {
    const paramData = data.data
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null)
    const [years, setYears] = useState<any>(null)

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
        setYear(paramData[3]);
    }, [isMounted]);

    useEffect(() => {
        if (isMounted && periode?.id && !year) {
            const currentYear = new Date().getFullYear();
            if (periode?.start_year <= currentYear) {
                setYear(currentYear);
            } else {
                setYear(periode?.start_year)
            }
        }
    }, [isMounted, periode?.id])

    useEffect(() => {
        if (isMounted) {
            setYears([]);
            if (periode?.id) {
                if (year >= periode?.start_year && year <= periode?.end_year) {
                    for (let i = periode?.start_year; i <= periode?.end_year; i++) {
                        setYears((years: any) => [
                            ...years,
                            {
                                label: i,
                                value: i,
                            },
                        ]);
                    }
                }
            }
        }
    }, [isMounted, year, periode?.id])

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
        if (paramData[2]) {
            setInstance(paramData[4]);
        }
    }, [isMounted, paramData]);

    const [dataInput, setDataInput] = useState<any>([]);
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        const res = await storeSaldoAwal(instance, periode?.id, year, dataInput);
        if (res.status == 'success') {
            showAlert('success', 'Data berhasil disimpan');
            setIsUnsaved(false);
        } else {
            showAlert('error', 'Data gagal disimpan');
        }
    }

    return (
        <>
            <div className="">
                <div className="mb-5">
                    <label htmlFor="addonsRight" className='uppercase'>
                        Berkas Saldo Awal {instances?.find((i: any) => i.id == instance)?.name ?? ''}
                    </label>
                    <div className="flex">
                        <input id="addonsRight"
                            type="file"
                            accept='.xls,.xlsx'
                            className="form-input ltr:rounded-r-none rtl:rounded-l-none" />
                        <button
                            type="button"
                            onClick={() => {
                                const file = (document.getElementById('addonsRight') as HTMLInputElement)?.files?.[0];
                                if (file) {
                                    setDataInput(file);
                                    setIsUnsaved(true);
                                    handleSave();
                                } else {
                                    showAlert('error', 'File belum dipilih');
                                }
                            }}
                            className="btn btn-secondary ltr:rounded-l-none rtl:rounded-r-none">
                            <FontAwesomeIcon icon={faUpload} className="w-4 h-4 mr-2" />
                            Unggah
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ImportSaldoAwal;
