import Select from 'react-select';
import { faExclamationCircle, faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { getRekapBelanja, saveRekapBelanja } from '@/apis/Accountancy/RekonsiliasiAset';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import InputRupiah from '@/components/InputRupiah';


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
            setInstance(paramData[2]);
        }
    }, [isMounted, paramData]);

    const [dataInput, setDataInput] = useState<any>([]);
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isMounted && periode?.id && year && !instance) {
            if ([9].includes(CurrentUser?.role_id)) {
                setInstance(CurrentUser?.instance_id ?? '');
            } else {
                _getDatas();
            }
        }
        if (isMounted && periode?.id && year && instance) {
            _getDatas();
        }
    }, [isMounted, instance, periode?.id, year]);

    const _getDatas = () => {
        getRekapBelanja(instance, periode?.id, year).then((data) => {
            if (data.status === 'error') {
                showAlert('error', data.message);
            } else {
                setDataInput(data.data.datas);
            }
        });
    }

    const _postData = (spesificData: any) => {
        setIsSaving(true);
        saveRekapBelanja(instance, periode?.id, year, spesificData).then((data) => {
            if (data.status === 'error') {
                showAlert('error', data.message);
            } else {
                showAlert('success', data.message);
                setIsUnsaved(false);
            }
            setIsSaving(false);
        });
    }

    return (
        <div>
            <div className="">
                <div className="table-responsive mb-5 pb-5 max-h-[calc(100vh-200px)]">
                    <table className="table-striped">
                        <thead>
                            <tr className='!bg-slate-900 !text-white sticky top-0 left-0'>
                                <th className='min-w-[300px]'>
                                    Perangkat Daerah
                                </th>
                                <th className='text-center whitespace-nowrap min-w-[200px] max-w-[200px]'>
                                    Tanah
                                </th>
                                <th className='text-center whitespace-nowrap min-w-[200px] max-w-[200px]'>
                                    Peralatan dan Mesin
                                </th>
                                <th className='text-center whitespace-nowrap min-w-[200px] max-w-[200px]'>
                                    Gedung dan Bangunan
                                </th>
                                <th className='text-center whitespace-nowrap min-w-[200px] max-w-[200px]'>
                                    Jalan Jaringan Irigasi
                                </th>
                                <th className='text-center whitespace-nowrap min-w-[200px] max-w-[200px]'>
                                    Aset Tetap Lainnya
                                </th>
                                <th className='text-center whitespace-nowrap min-w-[200px] max-w-[200px]'>
                                    KDP
                                </th>
                                <th className='text-center whitespace-nowrap min-w-[200px] max-w-[200px]'>
                                    Aset Lain-lain
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dataInput?.map((row: any, index: any) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <div className='font-semibold'>
                                                    {row.instance_name}
                                                </div>
                                            </td>
                                            <td className='whitespace-nowrap text-end'>
                                                <InputRupiah
                                                    dataValue={row.tanah}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td className='whitespace-nowrap text-end'>
                                                <InputRupiah
                                                    dataValue={row.peralatan_mesin}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td className='whitespace-nowrap text-end'>
                                                <InputRupiah
                                                    dataValue={row.gedung_bangunan}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td className='whitespace-nowrap text-end'>
                                                <InputRupiah
                                                    dataValue={row.jalan_jaringan_irigasi}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td className='whitespace-nowrap text-end'>
                                                <InputRupiah
                                                    dataValue={row.aset_tetap_lainnya}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td>
                                                <div className="flex group">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        Rp.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="KDP"
                                                        onKeyDown={(e) => {
                                                            if (!(
                                                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                                                e.keyCode == 8 ||
                                                                e.keyCode == 46 ||
                                                                e.keyCode == 37 ||
                                                                e.keyCode == 39 ||
                                                                e.keyCode == 188 ||
                                                                e.keyCode == 9 ||
                                                                // copy & paste
                                                                (e.keyCode == 67 && e.ctrlKey) ||
                                                                (e.keyCode == 86 && e.ctrlKey) ||
                                                                // command + c & command + v
                                                                (e.keyCode == 67 && e.metaKey) ||
                                                                (e.keyCode == 86 && e.metaKey) ||
                                                                // command + a
                                                                (e.keyCode == 65 && e.metaKey) ||
                                                                (e.keyCode == 65 && e.ctrlKey)
                                                            )) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={row.kdp}
                                                        onChange={(e) => {
                                                            setDataInput((prev: any) => {
                                                                const data = [...prev];
                                                                const value = parseFloat(e?.target?.value);
                                                                data[index].kdp = isNaN(value) ? 0 : value;
                                                                return data;
                                                            });
                                                        }}
                                                        onKeyDownCapture={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                _postData(row);
                                                            }
                                                        }}
                                                        className="form-input text-end ltr:rounded-l-none rtl:rounded-r-none font-normal hidden group-focus-within:block group-hover:block  w-[200px]" />
                                                    <div className="form-input text-end ltr:rounded-l-none rtl:rounded-r-none font-normal block group-focus-within:hidden group-hover:hidden w-[200px]">
                                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(row.kdp)}
                                                    </div>

                                                    <div className="ml-2 self-center">
                                                        <Tippy content="Tekan Enter untuk Menyimpan Data" theme='primary' placement='top'>
                                                            <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 text-primary cursor-pointer" />
                                                        </Tippy>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='whitespace-nowrap'>
                                                <InputRupiah
                                                    dataValue={row.aset_lain_lain}
                                                    readOnly={true}
                                                />
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
export default RekapBelanja;
