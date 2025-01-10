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

                updated['realisasi_belanja'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['realisasi_belanja']), 0);
                updated['saldo_awal'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['saldo_awal']), 0);
                updated['beban_dimuka'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['beban_dimuka']), 0);
                updated['hutang'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['hutang']), 0);
                updated['hibah'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['hibah']), 0);
                updated['reklas_tambah'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['reklas_tambah']), 0);
                updated['plus_jukor'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['plus_jukor']), 0);
                updated['saldo_akhir'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['saldo_akhir']), 0);

                updated['beban_tahun_lalu'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['beban_tahun_lalu']), 0);
                updated['beban_dimuka_last_year'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['beban_dimuka_last_year']), 0);
                updated['pembayaran_hutang'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['pembayaran_hutang']), 0);
                updated['reklas_kurang_dari_rekening'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['reklas_kurang_dari_rekening']), 0);
                updated['reklas_kurang_ke_modal'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['reklas_kurang_ke_modal']), 0);
                updated['atribusi'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['atribusi']), 0);
                updated['min_jukor'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['min_jukor']), 0);
                updated['beban_lo'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['beban_lo']), 0);
                return updated;
            })
        }
    }, [isMounted, dataInput])

    return (
        <>
            <div className="text-xl text-center font-semibold text-gray-600 mb-5">
                Rekap Piutang Pendapatan Audited Per 31 Desember {year}
            </div>

            <div className="table-responsive h-[calc(100vh-400px)] mb-5">
                <table>
                    <thead>
                        <tr>
                            <th className="text-center whitespace-nowrap border bg-slate-900 text-white">
                                No
                            </th>
                            <th className="text-center whitespace-nowrap border bg-slate-900 text-white min-w-[200px]">
                                Jenis Piutang
                            </th>
                            <th className="text-center whitespace-nowrap border bg-slate-900 text-white min-w-[200px]">
                                Saldo Awal Tahun {year}
                            </th>
                            <th className="text-center whitespace-nowrap border bg-slate-900 text-white min-w-[200px]">
                                Saldo Akhir Tahun {year}
                            </th>
                            <th className="text-center whitespace-nowrap border bg-slate-900 text-white min-w-[200px]">
                                Piutang Bruto
                            </th>
                            <th className="text-center whitespace-nowrap border bg-slate-900 text-white min-w-[200px]">
                                Penyisihan Piutang
                            </th>
                            <th className="text-center whitespace-nowrap border bg-slate-900 text-white min-w-[200px]">
                                Beban Penyisihan
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataInput.map((data: any, index: number) => (
                            <tr key={index}>
                                <td className="text-center whitespace-nowrap border">
                                    {index + 1}
                                </td>
                                <td className="text-start uppercase font-semibold whitespace-nowrap border">
                                    {data.uraian}
                                </td>
                                <td className="text-center whitespace-nowrap border">
                                    <InputRupiah
                                        readOnly={true}
                                        dataValue={data.saldo_awal} />
                                </td>
                                <td className="text-center whitespace-nowrap border">
                                    <InputRupiah
                                        readOnly={true}
                                        dataValue={data.saldo_akhir} />
                                </td>
                                <td className="text-center whitespace-nowrap border">
                                    <InputRupiah
                                        readOnly={true}
                                        dataValue={data.piutang_bruto} />
                                </td>
                                <td className="text-center whitespace-nowrap border">
                                    <InputRupiah
                                        readOnly={true}
                                        dataValue={data.penyisihan_piutang} />
                                </td>
                                <td className="text-center whitespace-nowrap border">
                                    <InputRupiah
                                        readOnly={true}
                                        dataValue={data.beban_penyisihan} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={2} className="text-center whitespace-nowrap border bg-slate-200 font-semibold">
                                Total
                            </td>
                            <td className="text-center whitespace-nowrap border bg-slate-200 font-semibold">
                                <InputRupiah
                                    readOnly={true}
                                    dataValue={totalData.saldo_awal} />
                            </td>
                            <td className="text-center whitespace-nowrap border bg-slate-200 font-semibold">
                                <InputRupiah
                                    readOnly={true}
                                    dataValue={totalData.saldo_akhir} />
                            </td>
                            <td className="text-center whitespace-nowrap border bg-slate-200 font-semibold">
                                <InputRupiah
                                    readOnly={true}
                                    dataValue={totalData.piutang_bruto} />
                            </td>
                            <td className="text-center whitespace-nowrap border bg-slate-200 font-semibold">
                                <InputRupiah
                                    readOnly={true}
                                    dataValue={totalData.penyisihan_piutang} />
                            </td>
                            <td className="text-center whitespace-nowrap border bg-slate-200 font-semibold">
                                <InputRupiah
                                    readOnly={true}
                                    dataValue={totalData.beban_penyisihan} />
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    );
}

export default Rekap;

