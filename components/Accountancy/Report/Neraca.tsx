import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useEffect, useState } from 'react';
import { getReportNeraca } from '@/apis/Accountancy/Report';

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
const Neraca = (data: any) => {
    const [isMounted, setIsMounted] = useState(false);
    const paramData = data.data;
    const [periode, setPeriode] = useState(paramData[0]);
    const [year, setYear] = useState(paramData[1]);
    const [instance, setInstance] = useState(paramData[2]);
    const [level, setLevel] = useState(paramData[3]);
    const [datas, setDatas] = useState<any>([]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && periode?.id, year, level) {
            getReportNeraca(instance, periode?.id, year, level).then((res) => {
                if (res.status === 'error') {
                    showAlert('error', 'Terjadi kesalahan');
                }
                else if (res.status === 'success') {
                    setDatas(res.data);
                    console.log(res.data);
                }
            });
        }
    }, [isMounted, year, instance, level]);

    return (
        <div className="table-responsive h-[calc(100vh-350px)]">
            <table className="table-striped">
                <thead>
                    <tr className='!bg-slate-900 !text-white sticky top-0'>
                        <th className='text-center w-[150px]'>
                            Kode Rekening
                        </th>
                        <th className='text-start'>
                            Uraian
                        </th>
                        <th className='text-center w-[250px]'>
                            {year}
                        </th>
                        <th className='text-center w-[250px]'>
                            {year - 1}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {datas?.length === 0 && (
                        <tr>
                            <td colSpan={4} className='text-center'>
                                Sedang memuat data...
                            </td>
                        </tr>
                    )}

                    {datas?.length > 0 && (
                        <>
                            {datas.map((data: any, index: number) => (
                                <tr key={index}>
                                    <td className='text-start'>
                                        <div className="font-semibold">
                                            {data.fullcode}
                                        </div>
                                    </td>
                                    <td className='text-start'>
                                        <div className="font-semibold">
                                            {data.name}
                                        </div>
                                    </td>
                                    <td className='text-center'>
                                        <div className="flex items-center justify-between">
                                            <div className="">
                                                Rp.
                                            </div>
                                            <div className="">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data.saldo_akhir)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className='text-center'>
                                        <div className="flex items-center justify-between">
                                            <div className="">
                                                Rp.
                                            </div>
                                            <div className="">
                                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data.saldo_awal)}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Neraca;
