import Select from 'react-select';
import { faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import IconTrash from '@/components/Icon/IconTrash';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { getRekap } from '@/apis/Accountancy/PiutangPdd';
import InputRupiah from '@/components/InputRupiah';
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
                    if (res.data.length > 0) {
                        setDataInput(res.data);
                    } else {
                        setDataInput([
                            {
                                id: '',
                                instance_id: instance ?? '',
                                kode_rekening_id: '',
                                realisasi_belanja: 0,
                                saldo_awal: 0,
                                beban_dimuka: 0,
                                hutang: 0,
                                hibah: 0,
                                reklas_tambah: 0,
                                plus_jukor: 0,
                                saldo_akhir: 0,
                                beban_tahun_lalu: 0,
                                beban_dimuka_last_year: 0,
                                pembayaran_hutang: 0,
                                reklas_kurang_dari_rekening: 0,
                                reklas_kurang_ke_modal: 0,
                                atribusi: 0,
                                min_jukor: 0,
                                beban_lo: 0,
                            }
                        ])
                    }
                }
            });
        }
    }


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
    }, [isMounted, instance, year])

    const [totalData, setTotalData] = useState<any>({
        saldo_awal: 0,
        saldo_akhir: 0,
        piutang_bruto: 0,
        penyisihan_piutang: 0,
        beban_penyisihan: 0,
    });

    useEffect(() => {
        if (isMounted && dataInput.length > 0) {
            setTotalData((prev: any) => {
                const updated = { ...prev };

                updated['saldo_awal'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['saldo_awal']), 0);
                updated['saldo_akhir'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['saldo_akhir']), 0);
                updated['piutang_bruto'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['piutang_bruto']), 0);
                updated['penyisihan_piutang'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['penyisihan_piutang']), 0);
                updated['beban_penyisihan'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['beban_penyisihan']), 0);

                return updated;
            })
        }
    }, [isMounted, dataInput])

    return (
        <>
            <div className="text-center text-gray-600 text-xl font-semibold mb-5">
                Rekap Piutang Pendapatan Audited Per 31 Desember {year}
            </div>

            <div className="table-responsive h-[calc(100vh-400px)] mb-5">
                <table>
                    <thead>
                        <tr>
                            <th className="bg-slate-900 border text-center text-white whitespace-nowrap">
                                No
                            </th>
                            <th className="bg-slate-900 border text-center text-white min-w-[200px] whitespace-nowrap">
                                Jenis Piutang
                            </th>
                            <th className="bg-slate-900 border text-center text-white min-w-[200px] whitespace-nowrap">
                                Saldo Awal Tahun {year}
                            </th>
                            <th className="bg-slate-900 border text-center text-white min-w-[200px] whitespace-nowrap">
                                Saldo Akhir Tahun {year}
                            </th>
                            <th className="bg-slate-900 border text-center text-white min-w-[200px] whitespace-nowrap">
                                Piutang Bruto
                            </th>
                            <th className="bg-slate-900 border text-center text-white min-w-[200px] whitespace-nowrap">
                                Penyisihan Piutang
                            </th>
                            <th className="bg-slate-900 border text-center text-white min-w-[200px] whitespace-nowrap">
                                Beban Penyisihan
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataInput.map((data: any, index: number) => (
                            <tr key={index}>
                                <td className="border text-center whitespace-nowrap">
                                    {index + 1}
                                </td>
                                <td className="border text-start font-semibold uppercase whitespace-nowrap">
                                    {data.uraian}
                                </td>
                                <td className="border text-center whitespace-nowrap">
                                    <InputRupiah
                                        readOnly={true}
                                        dataValue={data.saldo_awal} />
                                </td>
                                <td className="border text-center whitespace-nowrap">
                                    <InputRupiah
                                        readOnly={true}
                                        dataValue={data.saldo_akhir} />
                                </td>
                                <td className="border text-center whitespace-nowrap">
                                    <InputRupiah
                                        readOnly={true}
                                        dataValue={data.piutang_bruto} />
                                </td>
                                <td className="border text-center whitespace-nowrap">
                                    <InputRupiah
                                        readOnly={true}
                                        dataValue={data.penyisihan_piutang} />
                                </td>
                                <td className="border text-center whitespace-nowrap">
                                    <InputRupiah
                                        readOnly={true}
                                        dataValue={data.beban_penyisihan} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={2} className="bg-slate-200 border text-center font-semibold whitespace-nowrap">
                                Total
                            </td>
                            <td className="bg-slate-200 border text-center font-semibold whitespace-nowrap">
                                <InputRupiah
                                    readOnly={true}
                                    dataValue={totalData.saldo_awal} />
                            </td>
                            <td className="bg-slate-200 border text-center font-semibold whitespace-nowrap">
                                <InputRupiah
                                    readOnly={true}
                                    dataValue={totalData.saldo_akhir} />
                            </td>
                            <td className="bg-slate-200 border text-center font-semibold whitespace-nowrap">
                                <InputRupiah
                                    readOnly={true}
                                    dataValue={totalData.piutang_bruto} />
                            </td>
                            <td className="bg-slate-200 border text-center font-semibold whitespace-nowrap">
                                <InputRupiah
                                    readOnly={true}
                                    dataValue={totalData.penyisihan_piutang} />
                            </td>
                            <td className="bg-slate-200 border text-center font-semibold whitespace-nowrap">
                                <InputRupiah
                                    readOnly={true}
                                    dataValue={totalData.beban_penyisihan} />
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>


            <div className="flex justify-end gap-4 items-center">
                {(dataInput.length > 0) && (
                    <DownloadButtons
                        data={dataInput}
                        endpoint='/accountancy/download/excel'
                        params={{
                            type: 'rekap_pendapatan_lo',
                            category: 'pendapatan_lo',
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
                )}
            </div>
        </>
    );
}

export default Rekap;

