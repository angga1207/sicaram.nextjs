import Select from 'react-select';
import { faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import IconTrash from '@/components/Icon/IconTrash';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { getRekap } from '@/apis/Accountancy/Persediaan';
import DownloadButtons from '@/components/Buttons/DownloadButtons';

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

const Rekap = (data: any) => {
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
        setPeriode(paramData[2]);
        setYear(paramData[3]);
    }, [isMounted]);

    const [instance, setInstance] = useState<any>(CurrentUser?.instance_id ?? '');
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
        if (paramData[4]) {
            setInstance(paramData[4]);
        }
    }, [isMounted, paramData]);

    const [dataInput, setDataInput] = useState<any>([]);
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const _getDatas = () => {
        if (periode?.id) {
            getRekap(instance, periode?.id, year).then((res: any) => {
                if (res.status == 'success') {
                    console.log(res.data.length)
                    if (res.data.length > 0) {
                        setDataInput(res.data);
                    } else {
                        setDataInput([
                            {
                                id: '',
                                instance_id: instance ?? '',

                                nama_persediaan: '',
                                saldo_awal: 0,
                                kode_rekening_id: '',
                                realisasi_lra: 0,
                                hutang_belanja: 0,
                                perolehan_hibah: 0,
                                saldo_akhir: 0,
                                beban: 0,
                            }
                        ]);
                    }
                }
            });
        }
    }

    const [totalData, setTotalData] = useState<any>({
        total_data: 0,
        saldo_awal: 0,
        realisasi_lra: 0,
        hutang_belanja: 0,
        perolehan_hibah: 0,
        saldo_akhir: 0,
        beban: 0,
    });

    useEffect(() => {
        if (isMounted && periode?.id && year && !instance) {
            if ([9].includes(CurrentUser?.role_id)) {
                setInstance(CurrentUser?.instance_id ?? '');
            } else {
                _getDatas();
            }
        }
        else if (isMounted && periode?.id && year && instance) {
            _getDatas();
        }
    }, [isMounted, instance, periode?.id, year]);

    useEffect(() => {
        if (isMounted && dataInput.length > 0) {
            setTotalData((prev: any) => {
                const updated = { ...prev };
                updated.total_data = dataInput.length;
                // updated.saldo_awal = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['saldo_awal']), 0);
                // updated.realisasi_lra = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['realisasi_lra']), 0);
                // updated.hutang_belanja = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['hutang_belanja']), 0);
                // updated.perolehan_hibah = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['perolehan_hibah']), 0);
                // updated.saldo_akhir = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['saldo_akhir']), 0);
                // updated.beban = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['beban']), 0);

                updated.saldo_awal = parseFloat(dataInput[0]?.saldo_awal ?? 0) + parseFloat(dataInput[1]?.saldo_awal ?? 0) - parseFloat(dataInput[2]?.saldo_awal ?? 0);
                updated.realisasi_lra = parseFloat(dataInput[0]?.realisasi_lra ?? 0) + parseFloat(dataInput[1]?.realisasi_lra ?? 0) - parseFloat(dataInput[2]?.realisasi_lra ?? 0);
                updated.hutang_belanja = parseFloat(dataInput[0]?.hutang_belanja ?? 0) + parseFloat(dataInput[1]?.hutang_belanja ?? 0) - parseFloat(dataInput[2]?.hutang_belanja ?? 0);
                updated.perolehan_hibah = parseFloat(dataInput[0]?.perolehan_hibah ?? 0) + parseFloat(dataInput[1]?.perolehan_hibah ?? 0) - parseFloat(dataInput[2]?.perolehan_hibah ?? 0);
                updated.saldo_akhir = parseFloat(dataInput[0]?.saldo_akhir ?? 0) + parseFloat(dataInput[1]?.saldo_akhir ?? 0) - parseFloat(dataInput[2]?.saldo_akhir ?? 0);
                updated.beban = parseFloat(dataInput[0]?.beban ?? 0) + parseFloat(dataInput[1]?.beban ?? 0) - parseFloat(dataInput[2]?.beban ?? 0);
                return updated;
            })
        }
    }, [isMounted, dataInput])

    return (
        <>
            <div className="table-responsive h-[calc(100vh-420px)] pb-5">
                <table className="table-striped">
                    <thead>
                        <tr className='!bg-slate-900 !text-white left-0 sticky top-0 z-[1]'>
                            <th rowSpan={2} className='border text-center whitespace-nowrap'>
                                Uraian
                            </th>
                            <th rowSpan={2} className='border text-center whitespace-nowrap'>
                                Saldo Awal {year} (Saldo Akhir {year - 1})
                            </th>
                            <th colSpan={3} className='border text-center whitespace-nowrap'>
                                Mutasi Penambahan Beban {year} (Belanja {year})
                            </th>
                            <th rowSpan={2} className='border text-center whitespace-nowrap'>
                                Saldo Akhir {year}
                            </th>
                            <th rowSpan={2} className='border text-center whitespace-nowrap'>
                                Beban
                            </th>
                        </tr>
                        <tr className='!bg-slate-900 !text-white left-0 sticky top-[45px] z-[1]'>
                            <th className='border text-center whitespace-nowrap'>
                                Realisasi LRA {year} (Rp)
                            </th>
                            <th className='border text-center whitespace-nowrap'>
                                Hutang Belanja {year} (Rp)
                            </th>
                            <th className='border text-center whitespace-nowrap'>
                                Perolehan dari Hibah {year} (Rp)
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dataInput.map((data: any, index: any) => (
                                <tr>
                                    <td className='border !p-5 font-semibold'>
                                        {data.uraian}
                                    </td>
                                    <td className='border text-end !p-5'>
                                        Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.saldo_awal)}
                                    </td>
                                    <td className='border text-end !p-5'>
                                        Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.realisasi_lra)}
                                    </td>
                                    <td className='border text-end !p-5'>
                                        Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.hutang_belanja)}
                                    </td>
                                    <td className='border text-end !p-5'>
                                        Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.perolehan_hibah)}
                                    </td>
                                    <td className='border text-end !p-5'>
                                        Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.saldo_akhir)}
                                    </td>
                                    <td className='border text-end !p-5'>
                                        Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.beban)}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                    <tfoot>
                        <tr className='-bottom-5 !bg-slate-400 !text-white left-0 sticky'>
                            <td className='border p-3 text-center font-semibold'>
                                {/* Selisih (Jumlah A + B - Nilai Persediaan dalam Neraca) */}
                                Jumlah A + B
                            </td>
                            <td className='border p-3 text-end font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.saldo_awal)}
                            </td>
                            <td className='border p-3 text-end font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.realisasi_lra)}
                            </td>
                            <td className='border p-3 text-end font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.hutang_belanja)}
                            </td>
                            <td className='border p-3 text-end font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.perolehan_hibah)}
                            </td>
                            <td className='border p-3 text-end font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.saldo_akhir)}
                            </td>
                            <td className='border p-3 text-end font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.beban)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="flex justify-end gap-4 items-center">
                {dataInput.length > 0 && (
                    <>
                        <DownloadButtons
                            data={dataInput}
                            endpoint='/accountancy/download/excel'
                            params={{
                                type: 'rekap',
                                category: 'persediaan',
                                instance: instance,
                                periode: periode?.id,
                                year: year,
                            }}
                            afterClick={(e: any) => {
                                if (e === 'error') {
                                    Swal.fire({
                                        title: 'Download Gagal!',
                                        text: 'Terjadi kesalahan saat mendownload file.',
                                        icon: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: 'Tutup',
                                        confirmButtonColor: '#00ab55',
                                    });
                                    return;
                                } else {
                                    Swal.fire({
                                        title: 'Download Berhasil!',
                                        text: 'File telah berhasil didownload.',
                                        icon: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'Tutup',
                                        confirmButtonColor: '#00ab55',
                                    });
                                    return;
                                }
                            }}
                        />
                    </>
                )}
            </div>
        </>
    );
}

export default Rekap;
