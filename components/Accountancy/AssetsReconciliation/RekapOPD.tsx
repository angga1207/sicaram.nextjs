import Select from 'react-select';
import { faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { getRekapOPD } from '@/apis/Accountancy/RekonsiliasiAset';


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

const RekapOPD = (data: any) => {
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

    const [grandTotal, setGrandTotal] = useState<any>({
        tanah: 0,
        tanah_last_year: 0,
        peralatan_mesin: 0,
        peralatan_mesin_last_year: 0,
        gedung_bangunan: 0,
        gedung_bangunan_last_year: 0,
        jalan_jaringan_irigasi: 0,
        jalan_jaringan_irigasi_last_year: 0,
        aset_tetap_lainnya: 0,
        aset_tetap_lainnya_last_year: 0,
        kdp: 0,
        kdp_last_year: 0,
        aset_lainnya: 0,
        aset_lainnya_last_year: 0,
    });

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
        getRekapOPD(instance, periode?.id, year).then((res) => {
            if (res.status === 'success') {
                setDataInput(res.data.datas);
            }
        });
    }

    useEffect(() => {
        if (isMounted && dataInput.length > 0) {
            setGrandTotal((prev: any) => {
                const updated = { ...prev };
                updated['tanah'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.tanah), 0);
                updated['tanah_last_year'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.tanah_last_year), 0);
                updated['peralatan_mesin'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.peralatan_mesin), 0);
                updated['peralatan_mesin_last_year'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.peralatan_mesin_last_year), 0);
                updated['gedung_bangunan'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.gedung_bangunan), 0);
                updated['gedung_bangunan_last_year'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.gedung_bangunan_last_year), 0);
                updated['jalan_jaringan_irigasi'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.jalan_jaringan_irigasi), 0);
                updated['jalan_jaringan_irigasi_last_year'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.jalan_jaringan_irigasi_last_year), 0);
                updated['aset_tetap_lainnya'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.aset_tetap_lainnya), 0);
                updated['aset_tetap_lainnya_last_year'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.aset_tetap_lainnya_last_year), 0);
                updated['kdp'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.kdp), 0);
                updated['kdp_last_year'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.kdp_last_year), 0);
                updated['aset_lainnya'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.aset_lainnya), 0);
                updated['aset_lainnya_last_year'] = dataInput.reduce((acc: any, curr: any) => acc + parseFloat(curr.aset_lainnya_last_year), 0);
                return updated;
            });
        }
    }, [isMounted && dataInput]);

    return (
        <>
            <div className="">
                <div className="table-responsive mb-5">
                    <table className="table-striped">
                        <thead>
                            <tr className='!bg-slate-900 !text-white'>
                                <th rowSpan={2} className='border border-white text-center max-w-[300px] min-w-[300px]'>
                                    Perangkat Daerah
                                </th>
                                <th colSpan={2} className='border border-white text-center'>
                                    Tanah
                                </th>
                                <th colSpan={2} className='border border-white text-center'>
                                    Peralatan Mesin
                                </th>
                                <th colSpan={2} className='border border-white text-center'>
                                    Gedung dan Bangunan
                                </th>
                                <th colSpan={2} className='border border-white text-center'>
                                    Jalan Jaringan Irigasi
                                </th>
                                <th colSpan={2} className='border border-white text-center'>
                                    Aset Tetap Lainnya
                                </th>
                                <th colSpan={2} className='border border-white text-center'>
                                    KDP
                                </th>
                                <th colSpan={2} className='border border-white text-center'>
                                    Aset Lainnya
                                </th>
                            </tr>
                            <tr className='!bg-slate-900 !text-white'>
                                <th className='border border-white text-center min-w-[150px]'>
                                    {year - 1}
                                </th>
                                <th className='border border-white text-center min-w-[150px]'>
                                    {year}
                                </th>

                                <th className='border border-white text-center min-w-[150px]'>
                                    {year - 1}
                                </th>
                                <th className='border border-white text-center min-w-[150px]'>
                                    {year}
                                </th>

                                <th className='border border-white text-center min-w-[150px]'>
                                    {year - 1}
                                </th>
                                <th className='border border-white text-center min-w-[150px]'>
                                    {year}
                                </th>

                                <th className='border border-white text-center min-w-[150px]'>
                                    {year - 1}
                                </th>
                                <th className='border border-white text-center min-w-[150px]'>
                                    {year}
                                </th>

                                <th className='border border-white text-center min-w-[150px]'>
                                    {year - 1}
                                </th>
                                <th className='border border-white text-center min-w-[150px]'>
                                    {year}
                                </th>

                                <th className='border border-white text-center min-w-[150px]'>
                                    {year - 1}
                                </th>
                                <th className='border border-white text-center min-w-[150px]'>
                                    {year}
                                </th>

                                <th className='border border-white text-center min-w-[150px]'>
                                    {year - 1}
                                </th>
                                <th className='border border-white text-center min-w-[150px]'>
                                    {year}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dataInput.map((data: any, index: number) => (
                                    <tr key={index}>
                                        <td className='border border-slate-900'>
                                            <div className="font-semibold">
                                                {data.instance_name}
                                            </div>
                                        </td>

                                        <td className='border border-slate-900 text-right whitespace-nowrap'>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    Rp.
                                                </div>
                                                <div>
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data.tanah_last_year)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='border border-slate-900 text-right whitespace-nowrap'>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    Rp.
                                                </div>
                                                <div>
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data.tanah)}
                                                </div>
                                            </div>
                                        </td>

                                        <td className='border border-slate-900 text-right whitespace-nowrap'>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    Rp.
                                                </div>
                                                <div>
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data.peralatan_mesin_last_year)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='border border-slate-900 text-right whitespace-nowrap'>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    Rp.
                                                </div>
                                                <div>
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data.peralatan_mesin)}
                                                </div>
                                            </div>
                                        </td>

                                        <td className='border border-slate-900 text-right whitespace-nowrap'>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    Rp.
                                                </div>
                                                <div>
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data.gedung_bangunan_last_year)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='border border-slate-900 text-right whitespace-nowrap'>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    Rp.
                                                </div>
                                                <div>
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data.gedung_bangunan)}
                                                </div>
                                            </div>
                                        </td>

                                        <td className='border border-slate-900 text-right whitespace-nowrap'>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    Rp.
                                                </div>
                                                <div>
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data.jalan_jaringan_irigasi_last_year)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='border border-slate-900 text-right whitespace-nowrap'>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    Rp.
                                                </div>
                                                <div>
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data.jalan_jaringan_irigasi)}
                                                </div>
                                            </div>
                                        </td>

                                        <td className='border border-slate-900 text-right whitespace-nowrap'>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    Rp.
                                                </div>
                                                <div>
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data.aset_tetap_lainnya_last_year)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='border border-slate-900 text-right whitespace-nowrap'>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    Rp.
                                                </div>
                                                <div>
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data.aset_tetap_lainnya)}
                                                </div>
                                            </div>
                                        </td>

                                        <td className='border border-slate-900 text-right whitespace-nowrap'>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    Rp.
                                                </div>
                                                <div>
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data.kdp_last_year)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='border border-slate-900 text-right whitespace-nowrap'>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    Rp.
                                                </div>
                                                <div>
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data.kdp)}
                                                </div>
                                            </div>
                                        </td>

                                        <td className='border border-slate-900 text-right whitespace-nowrap'>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    Rp.
                                                </div>
                                                <div>
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data.aset_lainnya_last_year)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='border border-slate-900 text-right whitespace-nowrap'>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    Rp.
                                                </div>
                                                <div>
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data.aset_lainnya)}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }

                        </tbody>
                        <tfoot>
                            <tr className='text-white !bg-slate-900'>
                                <td className='border border-slate-900 p-4'>
                                    <div className="font-semibold">
                                        Total
                                    </div>
                                </td>

                                <td className='border border-slate-900 p-4 text-right font-semibold whitespace-nowrap'>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            Rp.
                                        </div>
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.tanah_last_year)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border border-slate-900 p-4 text-right font-semibold whitespace-nowrap'>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            Rp.
                                        </div>
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.tanah)}
                                        </div>
                                    </div>
                                </td>

                                <td className='border border-slate-900 p-4 text-right font-semibold whitespace-nowrap'>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            Rp.
                                        </div>
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.peralatan_mesin_last_year)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border border-slate-900 p-4 text-right font-semibold whitespace-nowrap'>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            Rp.
                                        </div>
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.peralatan_mesin)}
                                        </div>
                                    </div>
                                </td>

                                <td className='border border-slate-900 p-4 text-right font-semibold whitespace-nowrap'>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            Rp.
                                        </div>
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.gedung_bangunan_last_year)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border border-slate-900 p-4 text-right font-semibold whitespace-nowrap'>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            Rp.
                                        </div>
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.gedung_bangunan)}
                                        </div>
                                    </div>
                                </td>

                                <td className='border border-slate-900 p-4 text-right font-semibold whitespace-nowrap'>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            Rp.
                                        </div>
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.jalan_jaringan_irigasi_last_year)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border border-slate-900 p-4 text-right font-semibold whitespace-nowrap'>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            Rp.
                                        </div>
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.jalan_jaringan_irigasi)}
                                        </div>
                                    </div>
                                </td>

                                <td className='border border-slate-900 p-4 text-right font-semibold whitespace-nowrap'>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            Rp.
                                        </div>
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.aset_tetap_lainnya_last_year)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border border-slate-900 p-4 text-right font-semibold whitespace-nowrap'>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            Rp.
                                        </div>
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.aset_tetap_lainnya)}
                                        </div>
                                    </div>
                                </td>

                                <td className='border border-slate-900 p-4 text-right font-semibold whitespace-nowrap'>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            Rp.
                                        </div>
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.kdp_last_year)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border border-slate-900 p-4 text-right font-semibold whitespace-nowrap'>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            Rp.
                                        </div>
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.kdp)}
                                        </div>
                                    </div>
                                </td>

                                <td className='border border-slate-900 p-4 text-right font-semibold whitespace-nowrap'>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            Rp.
                                        </div>
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.aset_lainnya_last_year)}
                                        </div>
                                    </div>
                                </td>
                                <td className='border border-slate-900 p-4 text-right font-semibold whitespace-nowrap'>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            Rp.
                                        </div>
                                        <div>
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(grandTotal.aset_lainnya)}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </>
    );
}
export default RekapOPD;
