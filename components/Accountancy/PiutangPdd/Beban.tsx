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
import { deleteBeban, getBeban, storeBeban } from '@/apis/Accountancy/PiutangPdd';
import InputRupiah from '@/components/InputRupiah';
import IconX from '@/components/Icon/IconX';
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

const Beban = (data: any) => {
    const paramData = data.data
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
    const [arrKodeRekening1, setArrKodeRekening1] = useState<any>([])
    const [arrKodeRekening2, setArrKodeRekening2] = useState<any>([])
    const [arrKodeRekening3, setArrKodeRekening3] = useState<any>([])
    const [arrKodeRekening4, setArrKodeRekening4] = useState<any>([])
    const [arrKodeRekening5, setArrKodeRekening5] = useState<any>([])
    const [arrKodeRekening6, setArrKodeRekening6] = useState<any>([])

    useEffect(() => {
        if (isMounted && [9].includes(CurrentUser?.role_id) === false) {
            if (paramData[0]?.length > 0) {
                setInstances(paramData[0]);
            }
        }
    }, [isMounted, paramData]);

    useEffect(() => {
        if (isMounted) {
            if (paramData[1]?.length > 0) {
                setArrKodeRekening(paramData[1])
                setArrKodeRekening1(paramData[1].filter((item: any) => item.code_6 != null && item.code_1 == 4 && item.code_2 == 1 && item.code_3 == '01'))
                setArrKodeRekening2(paramData[1].filter((item: any) => item.code_6 != null && item.code_1 == 4 && item.code_2 == 1 && item.code_3 == '02'))
                setArrKodeRekening3(paramData[1].filter((item: any) => item.code_6 != null && item.code_1 == 4 && item.code_2 == 1 && item.code_3 == '03'))
                setArrKodeRekening4(paramData[1].filter((item: any) => item.code_6 != null && item.code_1 == 4 && item.code_2 == 1 && item.code_3 == '04'))
                setArrKodeRekening5(paramData[1].filter((item: any) => item.code_6 != null && item.code_1 == 4 && item.code_2 == 2 && item.code_3 == '01'))
                setArrKodeRekening6(paramData[1].filter((item: any) => item.code_6 != null && item.code_1 == 4 && item.code_2 == 2 && item.code_3 == '02'))
            }
            if ([9].includes(CurrentUser?.role_id)) {
                if (paramData[4]) {
                    setInstance(paramData[4]);
                }
            } else {
                if (paramData[4]) {
                    setInstance(paramData[4]);
                }
            }
        }
    }, [isMounted, paramData]);

    const [dataInput1, setDataInput1] = useState<any>([]);
    const [dataInput2, setDataInput2] = useState<any>([]);
    const [dataInput3, setDataInput3] = useState<any>([]);
    const [dataInput4, setDataInput4] = useState<any>([]);
    const [dataInput5, setDataInput5] = useState<any>([]);
    const [dataInput6, setDataInput6] = useState<any>([]);
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const _getDatas = () => {
        setDataInput1([]);
        setDataInput2([]);
        setDataInput3([]);
        setDataInput4([]);
        setDataInput5([]);
        setDataInput6([]);

        setIsLoading(true);
        if (periode?.id) {
            getBeban(instance, periode?.id, year).then((res: any) => {
                if (res.status == 'success') {
                    if (res.data.length > 0) {
                        // setDataInput1(res.data);
                        setDataInput1(res.data.filter((item: any) => item.type == 'pendapatan_pajak_daerah'));
                        setDataInput2(res.data.filter((item: any) => item.type == 'hasil_retribusi_daerah'));
                        setDataInput3(res.data.filter((item: any) => item.type == 'hasil_pengelolaan_kekayaan_daerah_yang_dipisahkan'));
                        setDataInput4(res.data.filter((item: any) => item.type == 'lain_lain_pad_yang_sah'));
                        setDataInput5(res.data.filter((item: any) => item.type == 'transfer_pemerintah_pusat'));
                        setDataInput6(res.data.filter((item: any) => item.type == 'transfer_antar_daerah'));
                    } else {
                        setDataInput1([
                            {
                                id: '',
                                instance_id: instance ?? '',
                                type: 'pendapatan_pajak_daerah',
                                kode_rekening_id: '',
                                jumlah_penyisihan: 0,
                                jumlah_penyisihan_last_year: 0,
                                koreksi_penyisihan: 0,
                                beban_penyisihan: 0,
                            }
                        ])
                        setDataInput2([
                            {
                                id: '',
                                instance_id: instance ?? '',
                                type: 'hasil_retribusi_daerah',
                                kode_rekening_id: '',
                                jumlah_penyisihan: 0,
                                jumlah_penyisihan_last_year: 0,
                                koreksi_penyisihan: 0,
                                beban_penyisihan: 0,
                            }
                        ])
                        setDataInput3([
                            {
                                id: '',
                                instance_id: instance ?? '',
                                type: 'hasil_pengelolaan_kekayaan_daerah_yang_dipisahkan',
                                kode_rekening_id: '',
                                jumlah_penyisihan: 0,
                                jumlah_penyisihan_last_year: 0,
                                koreksi_penyisihan: 0,
                                beban_penyisihan: 0,
                            }
                        ])
                        setDataInput4([
                            {
                                id: '',
                                instance_id: instance ?? '',
                                type: 'lain_lain_pad_yang_sah',
                                kode_rekening_id: '',
                                jumlah_penyisihan: 0,
                                jumlah_penyisihan_last_year: 0,
                                koreksi_penyisihan: 0,
                                beban_penyisihan: 0,
                            }
                        ])
                        setDataInput5([
                            {
                                id: '',
                                instance_id: instance ?? '',
                                type: 'transfer_pemerintah_pusat',
                                kode_rekening_id: '',
                                jumlah_penyisihan: 0,
                                jumlah_penyisihan_last_year: 0,
                                koreksi_penyisihan: 0,
                                beban_penyisihan: 0,
                            }
                        ])
                        setDataInput6([
                            {
                                id: '',
                                instance_id: instance ?? '',
                                type: 'transfer_antar_daerah',
                                kode_rekening_id: '',
                                jumlah_penyisihan: 0,
                                jumlah_penyisihan_last_year: 0,
                                koreksi_penyisihan: 0,
                                beban_penyisihan: 0,
                            }
                        ])
                    }
                }
            });
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (isMounted) {
            if ([9].includes(CurrentUser?.role_id)) {
                setInstance(CurrentUser?.instance_id ?? '');
            }
        }
    }, [isMounted])

    useEffect(() => {
        if (isMounted && periode?.id && year) {
            if ([9].includes(CurrentUser?.role_id) && !instance) {
                setInstance(CurrentUser?.instance_id ?? '');
            } else {
                _getDatas();
            }
        }
    }, [isMounted, instance, year])

    const [totalData, setTotalData] = useState<any>({
        jumlah_penyisihan: 0,
        jumlah_penyisihan_last_year: 0,
        koreksi_penyisihan: 0,
        beban_penyisihan: 0,
    });

    const [totalData1, setTotalData1] = useState<any>({
        jumlah_penyisihan: 0,
        jumlah_penyisihan_last_year: 0,
        koreksi_penyisihan: 0,
        beban_penyisihan: 0,
    });

    const [totalData2, setTotalData2] = useState<any>({
        jumlah_penyisihan: 0,
        jumlah_penyisihan_last_year: 0,
        koreksi_penyisihan: 0,
        beban_penyisihan: 0,
    });

    const [totalData3, setTotalData3] = useState<any>({
        jumlah_penyisihan: 0,
        jumlah_penyisihan_last_year: 0,
        koreksi_penyisihan: 0,
        beban_penyisihan: 0,
    });

    const [totalData4, setTotalData4] = useState<any>({
        jumlah_penyisihan: 0,
        jumlah_penyisihan_last_year: 0,
        koreksi_penyisihan: 0,
        beban_penyisihan: 0,
    });

    const [totalData5, setTotalData5] = useState<any>({
        jumlah_penyisihan: 0,
        jumlah_penyisihan_last_year: 0,
        koreksi_penyisihan: 0,
        beban_penyisihan: 0,
    });

    const [totalData6, setTotalData6] = useState<any>({
        jumlah_penyisihan: 0,
        jumlah_penyisihan_last_year: 0,
        koreksi_penyisihan: 0,
        beban_penyisihan: 0,
    });

    const addDataInput = (number: number) => {
        const type = number == 1 ? 'pendapatan_pajak_daerah' : number == 2 ? 'hasil_retribusi_daerah' : number == 3 ? 'hasil_pengelolaan_kekayaan_daerah_yang_dipisahkan' : number == 4 ? 'lain_lain_pad_yang_sah' : number == 5 ? 'transfer_pemerintah_pusat' : 'transfer_antar_daerah';
        const newData = {
            id: '',
            instance_id: instance ?? '',
            type: type,
            kode_rekening_id: '',
            jumlah_penyisihan: 0,
            jumlah_penyisihan_last_year: 0,
            koreksi_penyisihan: 0,
            beban_penyisihan: 0,
        }
        if (number == 1) {
            setDataInput1((prevData: any) => [...prevData, newData]);
        } else if (number == 2) {
            setDataInput2((prevData: any) => [...prevData, newData]);
        } else if (number == 3) {
            setDataInput3((prevData: any) => [...prevData, newData]);
        } else if (number == 4) {
            setDataInput4((prevData: any) => [...prevData, newData]);
        } else if (number == 5) {
            setDataInput5((prevData: any) => [...prevData, newData]);
        } else if (number == 6) {
            setDataInput6((prevData: any) => [...prevData, newData]);
        }
        setIsUnsaved(true);
    }

    const updatedData = (data: any, index: number) => {
        if (data.length > 0 && data[0]) {
            if (data[0].type == 'pendapatan_pajak_daerah') {
                setDataInput1((prev: any) => {
                    const updated = [...prev];
                    // updated[index]['koreksi_penyisihan'] = parseFloat(updated[index]['jumlah_penyisihan_last_year']) - parseFloat(updated[index]['jumlah_penyisihan']);
                    updated[index]['beban_penyisihan'] = parseFloat(updated[index]['jumlah_penyisihan']) - parseFloat(updated[index]['jumlah_penyisihan_last_year']) + parseFloat(updated[index]['koreksi_penyisihan']);
                    return updated;
                })
            }
            if (data[0].type == 'hasil_retribusi_daerah') {
                setDataInput2((prev: any) => {
                    const updated = [...prev];
                    // updated[index]['koreksi_penyisihan'] = parseFloat(updated[index]['jumlah_penyisihan_last_year']) - parseFloat(updated[index]['jumlah_penyisihan']);
                    updated[index]['beban_penyisihan'] = parseFloat(updated[index]['jumlah_penyisihan']) - parseFloat(updated[index]['jumlah_penyisihan_last_year']) + parseFloat(updated[index]['koreksi_penyisihan']);
                    return updated;
                })
            }
            if (data[0].type == 'hasil_pengelolaan_kekayaan_daerah_yang_dipisahkan') {
                setDataInput3((prev: any) => {
                    const updated = [...prev];
                    // updated[index]['koreksi_penyisihan'] = parseFloat(updated[index]['jumlah_penyisihan_last_year']) - parseFloat(updated[index]['jumlah_penyisihan']);
                    updated[index]['beban_penyisihan'] = parseFloat(updated[index]['jumlah_penyisihan']) - parseFloat(updated[index]['jumlah_penyisihan_last_year']) + parseFloat(updated[index]['koreksi_penyisihan']);
                    return updated;
                })
            }
            if (data[0].type == 'lain_lain_pad_yang_sah') {
                setDataInput4((prev: any) => {
                    const updated = [...prev];
                    // updated[index]['koreksi_penyisihan'] = parseFloat(updated[index]['jumlah_penyisihan_last_year']) - parseFloat(updated[index]['jumlah_penyisihan']);
                    updated[index]['beban_penyisihan'] = parseFloat(updated[index]['jumlah_penyisihan']) - parseFloat(updated[index]['jumlah_penyisihan_last_year']) + parseFloat(updated[index]['koreksi_penyisihan']);
                    return updated;
                })
            }
            if (data[0].type == 'transfer_pemerintah_pusat') {
                setDataInput5((prev: any) => {
                    const updated = [...prev];
                    // updated[index]['koreksi_penyisihan'] = parseFloat(updated[index]['jumlah_penyisihan_last_year']) - parseFloat(updated[index]['jumlah_penyisihan']);
                    updated[index]['beban_penyisihan'] = parseFloat(updated[index]['jumlah_penyisihan']) - parseFloat(updated[index]['jumlah_penyisihan_last_year']) + parseFloat(updated[index]['koreksi_penyisihan']);
                    return updated;
                })
            }
            if (data[0].type == 'transfer_antar_daerah') {
                setDataInput6((prev: any) => {
                    const updated = [...prev];
                    // updated[index]['koreksi_penyisihan'] = parseFloat(updated[index]['jumlah_penyisihan_last_year']) - parseFloat(updated[index]['jumlah_penyisihan']);
                    updated[index]['beban_penyisihan'] = parseFloat(updated[index]['jumlah_penyisihan']) - parseFloat(updated[index]['jumlah_penyisihan_last_year']) + parseFloat(updated[index]['koreksi_penyisihan']);
                    return updated;
                })
            }
        }
        setIsUnsaved(true);
    }

    useEffect(() => {
        if (isMounted) {
            setTotalData((prev: any) => {
                const updated = { ...prev };
                updated['jumlah_penyisihan'] = parseFloat(totalData1['jumlah_penyisihan'] ?? 0) + parseFloat(totalData2['jumlah_penyisihan'] ?? 0) + parseFloat(totalData3['jumlah_penyisihan'] ?? 0) + parseFloat(totalData4['jumlah_penyisihan'] ?? 0) + parseFloat(totalData5['jumlah_penyisihan'] ?? 0) + parseFloat(totalData6['jumlah_penyisihan'] ?? 0);
                updated['jumlah_penyisihan_last_year'] = parseFloat(totalData1['jumlah_penyisihan_last_year'] ?? 0) + parseFloat(totalData2['jumlah_penyisihan_last_year'] ?? 0) + parseFloat(totalData3['jumlah_penyisihan_last_year'] ?? 0) + parseFloat(totalData4['jumlah_penyisihan_last_year'] ?? 0) + parseFloat(totalData5['jumlah_penyisihan_last_year'] ?? 0) + parseFloat(totalData6['jumlah_penyisihan_last_year'] ?? 0);
                updated['koreksi_penyisihan'] = parseFloat(totalData1['koreksi_penyisihan'] ?? 0) + parseFloat(totalData2['koreksi_penyisihan'] ?? 0) + parseFloat(totalData3['koreksi_penyisihan'] ?? 0) + parseFloat(totalData4['koreksi_penyisihan'] ?? 0) + parseFloat(totalData5['koreksi_penyisihan'] ?? 0) + parseFloat(totalData6['koreksi_penyisihan'] ?? 0);
                updated['beban_penyisihan'] = parseFloat(totalData1['beban_penyisihan'] ?? 0) + parseFloat(totalData2['beban_penyisihan'] ?? 0) + parseFloat(totalData3['beban_penyisihan'] ?? 0) + parseFloat(totalData4['beban_penyisihan'] ?? 0) + parseFloat(totalData5['beban_penyisihan'] ?? 0) + parseFloat(totalData6['beban_penyisihan'] ?? 0);
                return updated;
            })
        }
    }, [isMounted, totalData1, totalData2, totalData3, totalData4, totalData5, totalData6])

    useEffect(() => {
        if (isMounted && dataInput1.length > 0) {
            setTotalData1((prev: any) => {
                const updated = { ...prev };
                updated['jumlah_penyisihan'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['jumlah_penyisihan']), 0);
                updated['jumlah_penyisihan_last_year'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['jumlah_penyisihan_last_year']), 0);
                updated['koreksi_penyisihan'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['koreksi_penyisihan']), 0);
                updated['beban_penyisihan'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['beban_penyisihan']), 0);
                return updated;
            })
        }
    }, [isMounted, dataInput1])

    useEffect(() => {
        if (isMounted && dataInput2.length > 0) {
            setTotalData2((prev: any) => {
                const updated = { ...prev };
                updated['jumlah_penyisihan'] = dataInput2.reduce((acc: any, obj: any) => acc + parseFloat(obj['jumlah_penyisihan']), 0);
                updated['jumlah_penyisihan_last_year'] = dataInput2.reduce((acc: any, obj: any) => acc + parseFloat(obj['jumlah_penyisihan_last_year']), 0);
                updated['koreksi_penyisihan'] = dataInput2.reduce((acc: any, obj: any) => acc + parseFloat(obj['koreksi_penyisihan']), 0);
                updated['beban_penyisihan'] = dataInput2.reduce((acc: any, obj: any) => acc + parseFloat(obj['beban_penyisihan']), 0);
                return updated;
            })
        }
    }, [isMounted, dataInput2])

    useEffect(() => {
        if (isMounted && dataInput3.length > 0) {
            setTotalData3((prev: any) => {
                const updated = { ...prev };
                updated['jumlah_penyisihan'] = dataInput3.reduce((acc: any, obj: any) => acc + parseFloat(obj['jumlah_penyisihan']), 0);
                updated['jumlah_penyisihan_last_year'] = dataInput3.reduce((acc: any, obj: any) => acc + parseFloat(obj['jumlah_penyisihan_last_year']), 0);
                updated['koreksi_penyisihan'] = dataInput3.reduce((acc: any, obj: any) => acc + parseFloat(obj['koreksi_penyisihan']), 0);
                updated['beban_penyisihan'] = dataInput3.reduce((acc: any, obj: any) => acc + parseFloat(obj['beban_penyisihan']), 0);
                return updated;
            })
        }
    }, [isMounted, dataInput3])

    useEffect(() => {
        if (isMounted && dataInput4.length > 0) {
            setTotalData4((prev: any) => {
                const updated = { ...prev };
                updated['jumlah_penyisihan'] = dataInput4.reduce((acc: any, obj: any) => acc + parseFloat(obj['jumlah_penyisihan']), 0);
                updated['jumlah_penyisihan_last_year'] = dataInput4.reduce((acc: any, obj: any) => acc + parseFloat(obj['jumlah_penyisihan_last_year']), 0);
                updated['koreksi_penyisihan'] = dataInput4.reduce((acc: any, obj: any) => acc + parseFloat(obj['koreksi_penyisihan']), 0);
                updated['beban_penyisihan'] = dataInput4.reduce((acc: any, obj: any) => acc + parseFloat(obj['beban_penyisihan']), 0);
                return updated;
            })
        }
    }, [isMounted, dataInput4])

    useEffect(() => {
        if (isMounted && dataInput5.length > 0) {
            setTotalData5((prev: any) => {
                const updated = { ...prev };
                updated['jumlah_penyisihan'] = dataInput5.reduce((acc: any, obj: any) => acc + parseFloat(obj['jumlah_penyisihan']), 0);
                updated['jumlah_penyisihan_last_year'] = dataInput5.reduce((acc: any, obj: any) => acc + parseFloat(obj['jumlah_penyisihan_last_year']), 0);
                updated['koreksi_penyisihan'] = dataInput5.reduce((acc: any, obj: any) => acc + parseFloat(obj['koreksi_penyisihan']), 0);
                updated['beban_penyisihan'] = dataInput5.reduce((acc: any, obj: any) => acc + parseFloat(obj['beban_penyisihan']), 0);
                return updated;
            })
        }
    }, [isMounted, dataInput5])

    useEffect(() => {
        if (isMounted && dataInput6.length > 0) {
            setTotalData6((prev: any) => {
                const updated = { ...prev };
                updated['jumlah_penyisihan'] = dataInput6.reduce((acc: any, obj: any) => acc + parseFloat(obj['jumlah_penyisihan']), 0);
                updated['jumlah_penyisihan_last_year'] = dataInput6.reduce((acc: any, obj: any) => acc + parseFloat(obj['jumlah_penyisihan_last_year']), 0);
                updated['koreksi_penyisihan'] = dataInput6.reduce((acc: any, obj: any) => acc + parseFloat(obj['koreksi_penyisihan']), 0);
                updated['beban_penyisihan'] = dataInput6.reduce((acc: any, obj: any) => acc + parseFloat(obj['beban_penyisihan']), 0);
                return updated;
            })
        }
    }, [isMounted, dataInput6])

    const save = () => {
        setIsSaving(true);
        const MergedDataInput = dataInput1.concat(dataInput2, dataInput3, dataInput4, dataInput5, dataInput6);
        storeBeban(MergedDataInput, periode?.id, year).then((res: any) => {
            if (res.status == 'error validation') {
                showAlert('error', 'Data gagal disimpan, pastikan semua data terisi dengan benar');
                setIsSaving(false);
            }
            else if (res.status == 'success') {
                showAlert('success', 'Data berhasil disimpan');
                setIsUnsaved(false);
                setIsSaving(false);
            } else {
                showAlert('error', 'Data gagal disimpan');
                setIsSaving(false);
            }
            _getDatas();
        });
    }

    const deleteData = (id: any) => {
        deleteBeban(id).then((res: any) => {
            if (res.status == 'success') {
                _getDatas();
                showAlert('success', 'Data berhasil dihapus');
            } else {
                showAlert('error', 'Data gagal dihapus');
            }
        });
    }

    return (
        <>
            <div className="table-responsive h-[calc(100vh-400px)] pb-5">
                <table className="table-striped">
                    <thead>
                        <tr className='bg-slate-900 text-white sticky top-0 z-[1]'>
                            {([9].includes(CurrentUser?.role_id) == false) && (
                                <th rowSpan={2} className='bg-slate-900 border text-center text-white min-w-[200px] whitespace-nowrap'>
                                    Nama Perangkat Daerah
                                </th>
                            )}
                            <th rowSpan={2} className="bg-slate-900 border text-center text-white min-w-[200px] whitespace-nowrap">
                                Jenis Piutang
                            </th>
                            <th rowSpan={2} className="bg-slate-900 border text-center text-white min-w-[200px] whitespace-nowrap">
                                Jumlah Penyisihan Tahun {year}
                            </th>
                            <th rowSpan={2} className="bg-slate-900 border text-center text-white min-w-[200px] whitespace-nowrap">
                                Jumlah Penyisihan Tahun {year - 1}
                            </th>
                            <th rowSpan={2} className="bg-slate-900 border text-center text-white min-w-[200px] whitespace-nowrap">
                                Koreksi Penyisihan (Surplus keg Non Operasional)
                            </th>
                            <th rowSpan={2} className="bg-slate-900 border text-center text-white min-w-[200px] whitespace-nowrap">
                                Beban Penyisihan
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading === false ? (
                            <>
                                {/* PENDAPATAN PAJAK DAERAH */}
                                <tr>
                                    <td colSpan={2} className='bg-slate-200/50 border text-md font-semibold'>
                                        <div className="flex justify-between items-center">
                                            <div className="">
                                                PENDAPATAN PAJAK DAERAH
                                            </div>
                                            <button type="button"
                                                disabled={isSaving == true}
                                                onClick={(e) => {
                                                    addDataInput(1)
                                                }}
                                                className='btn btn-primary text-xs whitespace-nowrap'>
                                                <FontAwesomeIcon icon={faPlus} className='h-3 w-3 mr-1' />
                                                Tambah Data
                                            </button>
                                        </div>
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData1.jumlah_penyisihan}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData1.jumlah_penyisihan_last_year}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData1.koreksi_penyisihan}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData1.beban_penyisihan}
                                            readOnly={true} />
                                    </td>
                                </tr>
                                {dataInput1.map((data: any, index: any) => (
                                    <tr key={index}>
                                        {([9].includes(CurrentUser?.role_id) == false) && (
                                            <td className='border'>
                                                {/* Perangkat Daerah */}
                                                <div className="">
                                                    <Select placeholder="Pilih Perangkat Daerah"
                                                        className='min-w-[300px]'
                                                        onChange={(e: any) => {
                                                            if ([9].includes(CurrentUser?.role_id)) {
                                                                showAlert('error', 'Anda tidak memiliki akses ke Perangkat Daerah ini');
                                                            } else {
                                                                setDataInput1((prev: any) => {
                                                                    const updated = [...prev];
                                                                    updated[index]['instance_id'] = e?.value;
                                                                    return updated;
                                                                })
                                                                setIsUnsaved(true);
                                                            }
                                                        }}
                                                        isDisabled={[9].includes(CurrentUser?.role_id) ? true : ((isSaving == true) || instance ? true : false)}
                                                        value={
                                                            instances?.map((item: any, index: number) => {
                                                                if (item.id == data.instance_id) {
                                                                    return {
                                                                        value: item.id,
                                                                        label: item.name,
                                                                    }
                                                                }
                                                            })
                                                        }
                                                        options={
                                                            instances?.map((item: any, index: number) => {
                                                                return {
                                                                    value: item.id,
                                                                    label: item.name,
                                                                }
                                                            })
                                                        } />
                                                </div>
                                            </td>
                                        )}
                                        <td className='border'>
                                            {/* Kode Rekening */}
                                            <div className="flex gap-2 items-center">
                                                <Select placeholder="Pilih Kode Rekening"
                                                    className='min-w-[400px]'
                                                    classNamePrefix={'selectAngga'}
                                                    isDisabled={isSaving == true}
                                                    onChange={(e: any) => {
                                                        setDataInput1((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['kode_rekening_id'] = e?.value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    value={
                                                        arrKodeRekening1?.map((item: any, index: number) => {
                                                            if (item.id == data.kode_rekening_id) {
                                                                return {
                                                                    value: item.id,
                                                                    label: item.fullcode + ' - ' + item.name,
                                                                }
                                                            }
                                                        })
                                                    }
                                                    options={
                                                        arrKodeRekening1?.map((item: any, index: number) => {
                                                            return {
                                                                value: item.id,
                                                                label: item.fullcode + ' - ' + item.name,
                                                            }
                                                        })
                                                    } />


                                                {data?.id && (
                                                    <div className="">
                                                        <Tippy content="Hapus Data" placement='top' theme='danger'>
                                                            <button
                                                                type="button"
                                                                onClick={() => {

                                                                    const swalWithBootstrapButtons = Swal.mixin({
                                                                        customClass: {
                                                                            confirmButton: 'btn btn-danger',
                                                                            cancelButton: 'btn btn-slate-200 ltr:mr-3 rtl:ml-3',
                                                                            popup: 'sweet-alerts',
                                                                        },
                                                                        buttonsStyling: false,
                                                                    });
                                                                    swalWithBootstrapButtons
                                                                        .fire({
                                                                            title: 'Hapus Data?',
                                                                            text: "Apakah Anda yakin untuk menghapus Data Ini!",
                                                                            icon: 'question',
                                                                            showCancelButton: true,
                                                                            confirmButtonText: 'Ya, Hapus!',
                                                                            cancelButtonText: 'Tidak!',
                                                                            reverseButtons: true,
                                                                            padding: '2em',
                                                                        })
                                                                        .then((result) => {
                                                                            if (result.value) {
                                                                                deleteData(data.id);
                                                                            } else if (result.dismiss === Swal.DismissReason.cancel) {
                                                                                swalWithBootstrapButtons.fire('Batal', 'Batal menghapus Data', 'info');
                                                                            }
                                                                        });
                                                                }}
                                                                className="btn btn-danger h-8 p-0 rounded-full w-8">
                                                                <IconTrash className='h-4 w-4' />
                                                            </button>
                                                        </Tippy>
                                                    </div>
                                                )}

                                            </div>
                                        </td>

                                        <td className="border">
                                            <InputRupiah
                                                readOnly={true}
                                                dataValue={data.jumlah_penyisihan}
                                                onChange={(value: any) => {
                                                    setDataInput1((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['jumlah_penyisihan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.jumlah_penyisihan_last_year}
                                                onChange={(value: any) => {
                                                    setDataInput1((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['jumlah_penyisihan_last_year'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                // readOnly={true}
                                                dataValue={data.koreksi_penyisihan}
                                                onChange={(value: any) => {
                                                    setDataInput1((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['koreksi_penyisihan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                readOnly={true}
                                                dataValue={data.beban_penyisihan}
                                                onChange={(value: any) => {
                                                    setDataInput1((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['beban_penyisihan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                    </tr>
                                ))}

                                {/* HASIL RETRIBUSI DAERAH */}
                                <tr>
                                    <td colSpan={2} className='bg-slate-200/50 border text-md font-semibold'>
                                        <div className="flex justify-between items-center">
                                            <div className="">
                                                HASIL RETRIBUSI DAERAH
                                            </div>
                                            <button type="button"
                                                disabled={isSaving == true}
                                                onClick={(e) => {
                                                    addDataInput(2)
                                                }}
                                                className='btn btn-primary text-xs whitespace-nowrap'>
                                                <FontAwesomeIcon icon={faPlus} className='h-3 w-3 mr-1' />
                                                Tambah Data
                                            </button>
                                        </div>
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData2.jumlah_penyisihan}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData2.jumlah_penyisihan_last_year}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData2.koreksi_penyisihan}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData2.beban_penyisihan}
                                            readOnly={true} />
                                    </td>
                                </tr>
                                {dataInput2.map((data: any, index: any) => (
                                    <tr key={index}>
                                        {([9].includes(CurrentUser?.role_id) == false) && (
                                            <td className='border'>
                                                {/* Perangkat Daerah */}
                                                <div className="">
                                                    <Select placeholder="Pilih Perangkat Daerah"
                                                        className='min-w-[300px]'
                                                        onChange={(e: any) => {
                                                            if ([9].includes(CurrentUser?.role_id)) {
                                                                showAlert('error', 'Anda tidak memiliki akses ke Perangkat Daerah ini');
                                                            } else {
                                                                setDataInput2((prev: any) => {
                                                                    const updated = [...prev];
                                                                    updated[index]['instance_id'] = e?.value;
                                                                    return updated;
                                                                })
                                                                setIsUnsaved(true);
                                                            }
                                                        }}
                                                        isDisabled={[9].includes(CurrentUser?.role_id) ? true : ((isSaving == true) || instance ? true : false)}
                                                        value={
                                                            instances?.map((item: any, index: number) => {
                                                                if (item.id == data.instance_id) {
                                                                    return {
                                                                        value: item.id,
                                                                        label: item.name,
                                                                    }
                                                                }
                                                            })
                                                        }
                                                        options={
                                                            instances?.map((item: any, index: number) => {
                                                                return {
                                                                    value: item.id,
                                                                    label: item.name,
                                                                }
                                                            })
                                                        } />
                                                </div>
                                            </td>
                                        )}
                                        <td className='border'>
                                            {/* Kode Rekening */}
                                            <div className="flex gap-2 items-center">
                                                <Select placeholder="Pilih Kode Rekening"
                                                    className='min-w-[400px]'
                                                    classNamePrefix={'selectAngga'}
                                                    isDisabled={isSaving == true}
                                                    onChange={(e: any) => {
                                                        setDataInput2((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['kode_rekening_id'] = e?.value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    value={
                                                        arrKodeRekening2?.map((item: any, index: number) => {
                                                            if (item.id == data.kode_rekening_id) {
                                                                return {
                                                                    value: item.id,
                                                                    label: item.fullcode + ' - ' + item.name,
                                                                }
                                                            }
                                                        })
                                                    }
                                                    options={
                                                        arrKodeRekening2?.map((item: any, index: number) => {
                                                            return {
                                                                value: item.id,
                                                                label: item.fullcode + ' - ' + item.name,
                                                            }
                                                        })
                                                    } />


                                                {data?.id && (
                                                    <div className="">
                                                        <Tippy content="Hapus Data" placement='top' theme='danger'>
                                                            <button
                                                                type="button"
                                                                onClick={() => {

                                                                    const swalWithBootstrapButtons = Swal.mixin({
                                                                        customClass: {
                                                                            confirmButton: 'btn btn-danger',
                                                                            cancelButton: 'btn btn-slate-200 ltr:mr-3 rtl:ml-3',
                                                                            popup: 'sweet-alerts',
                                                                        },
                                                                        buttonsStyling: false,
                                                                    });
                                                                    swalWithBootstrapButtons
                                                                        .fire({
                                                                            title: 'Hapus Data?',
                                                                            text: "Apakah Anda yakin untuk menghapus Data Ini!",
                                                                            icon: 'question',
                                                                            showCancelButton: true,
                                                                            confirmButtonText: 'Ya, Hapus!',
                                                                            cancelButtonText: 'Tidak!',
                                                                            reverseButtons: true,
                                                                            padding: '2em',
                                                                        })
                                                                        .then((result) => {
                                                                            if (result.value) {
                                                                                deleteData(data.id);
                                                                            } else if (result.dismiss === Swal.DismissReason.cancel) {
                                                                                swalWithBootstrapButtons.fire('Batal', 'Batal menghapus Data', 'info');
                                                                            }
                                                                        });
                                                                }}
                                                                className="btn btn-danger h-8 p-0 rounded-full w-8">
                                                                <IconTrash className='h-4 w-4' />
                                                            </button>
                                                        </Tippy>
                                                    </div>
                                                )}

                                            </div>
                                        </td>

                                        <td className="border">
                                            <InputRupiah
                                                readOnly={true}
                                                dataValue={data.jumlah_penyisihan}
                                                onChange={(value: any) => {
                                                    setDataInput2((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['jumlah_penyisihan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.jumlah_penyisihan_last_year}
                                                onChange={(value: any) => {
                                                    setDataInput2((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['jumlah_penyisihan_last_year'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                // readOnly={true}
                                                dataValue={data.koreksi_penyisihan}
                                                onChange={(value: any) => {
                                                    setDataInput2((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['koreksi_penyisihan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                readOnly={true}
                                                dataValue={data.beban_penyisihan}
                                                onChange={(value: any) => {
                                                    setDataInput2((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['beban_penyisihan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                    </tr>
                                ))}

                                {/*  HASIL PENGELOLAAN KEKAYAAN YANG DIPISAHKAN DAERAH  */}
                                <tr>
                                    <td colSpan={2} className='bg-slate-200/50 border text-md font-semibold'>
                                        <div className="flex justify-between items-center">
                                            <div className="">
                                                HASIL PENGELOLAAN KEKAYAAN YANG DIPISAHKAN DAERAH
                                            </div>
                                            <button type="button"
                                                disabled={isSaving == true}
                                                onClick={(e) => {
                                                    addDataInput(3)
                                                }}
                                                className='btn btn-primary text-xs whitespace-nowrap'>
                                                <FontAwesomeIcon icon={faPlus} className='h-3 w-3 mr-1' />
                                                Tambah Data
                                            </button>
                                        </div>
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData3.jumlah_penyisihan}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData3.jumlah_penyisihan_last_year}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData3.koreksi_penyisihan}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData3.beban_penyisihan}
                                            readOnly={true} />
                                    </td>
                                </tr>
                                {dataInput3.map((data: any, index: any) => (
                                    <tr key={index}>
                                        {([9].includes(CurrentUser?.role_id) == false) && (
                                            <td className='border'>
                                                {/* Perangkat Daerah */}
                                                <div className="">
                                                    <Select placeholder="Pilih Perangkat Daerah"
                                                        className='min-w-[300px]'
                                                        onChange={(e: any) => {
                                                            if ([9].includes(CurrentUser?.role_id)) {
                                                                showAlert('error', 'Anda tidak memiliki akses ke Perangkat Daerah ini');
                                                            } else {
                                                                setDataInput3((prev: any) => {
                                                                    const updated = [...prev];
                                                                    updated[index]['instance_id'] = e?.value;
                                                                    return updated;
                                                                })
                                                                setIsUnsaved(true);
                                                            }
                                                        }}
                                                        isDisabled={[9].includes(CurrentUser?.role_id) ? true : ((isSaving == true) || instance ? true : false)}
                                                        value={
                                                            instances?.map((item: any, index: number) => {
                                                                if (item.id == data.instance_id) {
                                                                    return {
                                                                        value: item.id,
                                                                        label: item.name,
                                                                    }
                                                                }
                                                            })
                                                        }
                                                        options={
                                                            instances?.map((item: any, index: number) => {
                                                                return {
                                                                    value: item.id,
                                                                    label: item.name,
                                                                }
                                                            })
                                                        } />
                                                </div>
                                            </td>
                                        )}
                                        <td className='border'>
                                            {/* Kode Rekening */}
                                            <div className="flex gap-2 items-center">
                                                <Select placeholder="Pilih Kode Rekening"
                                                    className='min-w-[400px]'
                                                    classNamePrefix={'selectAngga'}
                                                    isDisabled={isSaving == true}
                                                    onChange={(e: any) => {
                                                        setDataInput3((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['kode_rekening_id'] = e?.value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    value={
                                                        arrKodeRekening3?.map((item: any, index: number) => {
                                                            if (item.id == data.kode_rekening_id) {
                                                                return {
                                                                    value: item.id,
                                                                    label: item.fullcode + ' - ' + item.name,
                                                                }
                                                            }
                                                        })
                                                    }
                                                    options={
                                                        arrKodeRekening3?.map((item: any, index: number) => {
                                                            return {
                                                                value: item.id,
                                                                label: item.fullcode + ' - ' + item.name,
                                                            }
                                                        })
                                                    } />


                                                {data?.id && (
                                                    <div className="">
                                                        <Tippy content="Hapus Data" placement='top' theme='danger'>
                                                            <button
                                                                type="button"
                                                                onClick={() => {

                                                                    const swalWithBootstrapButtons = Swal.mixin({
                                                                        customClass: {
                                                                            confirmButton: 'btn btn-danger',
                                                                            cancelButton: 'btn btn-slate-200 ltr:mr-3 rtl:ml-3',
                                                                            popup: 'sweet-alerts',
                                                                        },
                                                                        buttonsStyling: false,
                                                                    });
                                                                    swalWithBootstrapButtons
                                                                        .fire({
                                                                            title: 'Hapus Data?',
                                                                            text: "Apakah Anda yakin untuk menghapus Data Ini!",
                                                                            icon: 'question',
                                                                            showCancelButton: true,
                                                                            confirmButtonText: 'Ya, Hapus!',
                                                                            cancelButtonText: 'Tidak!',
                                                                            reverseButtons: true,
                                                                            padding: '2em',
                                                                        })
                                                                        .then((result) => {
                                                                            if (result.value) {
                                                                                deleteData(data.id);
                                                                            } else if (result.dismiss === Swal.DismissReason.cancel) {
                                                                                swalWithBootstrapButtons.fire('Batal', 'Batal menghapus Data', 'info');
                                                                            }
                                                                        });
                                                                }}
                                                                className="btn btn-danger h-8 p-0 rounded-full w-8">
                                                                <IconTrash className='h-4 w-4' />
                                                            </button>
                                                        </Tippy>
                                                    </div>
                                                )}

                                            </div>
                                        </td>

                                        <td className="border">
                                            <InputRupiah
                                                readOnly={true}
                                                dataValue={data.jumlah_penyisihan}
                                                onChange={(value: any) => {
                                                    setDataInput3((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['jumlah_penyisihan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.jumlah_penyisihan_last_year}
                                                onChange={(value: any) => {
                                                    setDataInput3((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['jumlah_penyisihan_last_year'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                // readOnly={true}
                                                dataValue={data.koreksi_penyisihan}
                                                onChange={(value: any) => {
                                                    setDataInput3((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['koreksi_penyisihan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                readOnly={true}
                                                dataValue={data.beban_penyisihan}
                                                onChange={(value: any) => {
                                                    setDataInput3((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['beban_penyisihan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                    </tr>
                                ))}

                                {/*  LAIN-LAIN PAD YANG SAH  */}
                                <tr>
                                    <td colSpan={2} className='bg-slate-200/50 border text-md font-semibold'>
                                        <div className="flex justify-between items-center">
                                            <div className="">
                                                LAIN-LAIN PAD YANG SAH
                                            </div>
                                            <button type="button"
                                                disabled={isSaving == true}
                                                onClick={(e) => {
                                                    addDataInput(4)
                                                }}
                                                className='btn btn-primary text-xs whitespace-nowrap'>
                                                <FontAwesomeIcon icon={faPlus} className='h-3 w-3 mr-1' />
                                                Tambah Data
                                            </button>
                                        </div>
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData3.jumlah_penyisihan}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData3.jumlah_penyisihan_last_year}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData3.koreksi_penyisihan}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData3.beban_penyisihan}
                                            readOnly={true} />
                                    </td>
                                </tr>
                                {dataInput4.map((data: any, index: any) => (
                                    <tr key={index}>
                                        {([9].includes(CurrentUser?.role_id) == false) && (
                                            <td className='border'>
                                                {/* Perangkat Daerah */}
                                                <div className="">
                                                    <Select placeholder="Pilih Perangkat Daerah"
                                                        className='min-w-[300px]'
                                                        onChange={(e: any) => {
                                                            if ([9].includes(CurrentUser?.role_id)) {
                                                                showAlert('error', 'Anda tidak memiliki akses ke Perangkat Daerah ini');
                                                            } else {
                                                                setDataInput4((prev: any) => {
                                                                    const updated = [...prev];
                                                                    updated[index]['instance_id'] = e?.value;
                                                                    return updated;
                                                                })
                                                                setIsUnsaved(true);
                                                            }
                                                        }}
                                                        isDisabled={[9].includes(CurrentUser?.role_id) ? true : ((isSaving == true) || instance ? true : false)}
                                                        value={
                                                            instances?.map((item: any, index: number) => {
                                                                if (item.id == data.instance_id) {
                                                                    return {
                                                                        value: item.id,
                                                                        label: item.name,
                                                                    }
                                                                }
                                                            })
                                                        }
                                                        options={
                                                            instances?.map((item: any, index: number) => {
                                                                return {
                                                                    value: item.id,
                                                                    label: item.name,
                                                                }
                                                            })
                                                        } />
                                                </div>
                                            </td>
                                        )}
                                        <td className='border'>
                                            {/* Kode Rekening */}
                                            <div className="flex gap-2 items-center">
                                                <Select placeholder="Pilih Kode Rekening"
                                                    className='min-w-[400px]'
                                                    classNamePrefix={'selectAngga'}
                                                    isDisabled={isSaving == true}
                                                    onChange={(e: any) => {
                                                        setDataInput4((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['kode_rekening_id'] = e?.value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    value={
                                                        arrKodeRekening4?.map((item: any, index: number) => {
                                                            if (item.id == data.kode_rekening_id) {
                                                                return {
                                                                    value: item.id,
                                                                    label: item.fullcode + ' - ' + item.name,
                                                                }
                                                            }
                                                        })
                                                    }
                                                    options={
                                                        arrKodeRekening4?.map((item: any, index: number) => {
                                                            return {
                                                                value: item.id,
                                                                label: item.fullcode + ' - ' + item.name,
                                                            }
                                                        })
                                                    } />


                                                {data?.id && (
                                                    <div className="">
                                                        <Tippy content="Hapus Data" placement='top' theme='danger'>
                                                            <button
                                                                type="button"
                                                                onClick={() => {

                                                                    const swalWithBootstrapButtons = Swal.mixin({
                                                                        customClass: {
                                                                            confirmButton: 'btn btn-danger',
                                                                            cancelButton: 'btn btn-slate-200 ltr:mr-3 rtl:ml-3',
                                                                            popup: 'sweet-alerts',
                                                                        },
                                                                        buttonsStyling: false,
                                                                    });
                                                                    swalWithBootstrapButtons
                                                                        .fire({
                                                                            title: 'Hapus Data?',
                                                                            text: "Apakah Anda yakin untuk menghapus Data Ini!",
                                                                            icon: 'question',
                                                                            showCancelButton: true,
                                                                            confirmButtonText: 'Ya, Hapus!',
                                                                            cancelButtonText: 'Tidak!',
                                                                            reverseButtons: true,
                                                                            padding: '2em',
                                                                        })
                                                                        .then((result) => {
                                                                            if (result.value) {
                                                                                deleteData(data.id);
                                                                            } else if (result.dismiss === Swal.DismissReason.cancel) {
                                                                                swalWithBootstrapButtons.fire('Batal', 'Batal menghapus Data', 'info');
                                                                            }
                                                                        });
                                                                }}
                                                                className="btn btn-danger h-8 p-0 rounded-full w-8">
                                                                <IconTrash className='h-4 w-4' />
                                                            </button>
                                                        </Tippy>
                                                    </div>
                                                )}

                                            </div>
                                        </td>

                                        <td className="border">
                                            <InputRupiah
                                                readOnly={true}
                                                dataValue={data.jumlah_penyisihan}
                                                onChange={(value: any) => {
                                                    setDataInput4((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['jumlah_penyisihan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.jumlah_penyisihan_last_year}
                                                onChange={(value: any) => {
                                                    setDataInput4((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['jumlah_penyisihan_last_year'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                // readOnly={true}
                                                dataValue={data.koreksi_penyisihan}
                                                onChange={(value: any) => {
                                                    setDataInput4((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['koreksi_penyisihan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                readOnly={true}
                                                dataValue={data.beban_penyisihan}
                                                onChange={(value: any) => {
                                                    setDataInput4((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['beban_penyisihan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                    </tr>
                                ))}

                                {/*  TRANSFER PEMERINTAH PUSAT  */}
                                <tr>
                                    <td colSpan={2} className='bg-slate-200/50 border text-md font-semibold'>
                                        <div className="flex justify-between items-center">
                                            <div className="">
                                                TRANSFER PEMERINTAH PUSAT
                                            </div>
                                            <button type="button"
                                                disabled={isSaving == true}
                                                onClick={(e) => {
                                                    addDataInput(5)
                                                }}
                                                className='btn btn-primary text-xs whitespace-nowrap'>
                                                <FontAwesomeIcon icon={faPlus} className='h-3 w-3 mr-1' />
                                                Tambah Data
                                            </button>
                                        </div>
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData5.jumlah_penyisihan}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData5.jumlah_penyisihan_last_year}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData5.koreksi_penyisihan}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData5.beban_penyisihan}
                                            readOnly={true} />
                                    </td>
                                </tr>
                                {dataInput5.map((data: any, index: any) => (
                                    <tr key={index}>
                                        {([9].includes(CurrentUser?.role_id) == false) && (
                                            <td className='border'>
                                                {/* Perangkat Daerah */}
                                                <div className="">
                                                    <Select placeholder="Pilih Perangkat Daerah"
                                                        menuPlacement={'top'}
                                                        className='min-w-[300px]'
                                                        onChange={(e: any) => {
                                                            if ([9].includes(CurrentUser?.role_id)) {
                                                                showAlert('error', 'Anda tidak memiliki akses ke Perangkat Daerah ini');
                                                            } else {
                                                                setDataInput5((prev: any) => {
                                                                    const updated = [...prev];
                                                                    updated[index]['instance_id'] = e?.value;
                                                                    return updated;
                                                                })
                                                                setIsUnsaved(true);
                                                            }
                                                        }}
                                                        isDisabled={[9].includes(CurrentUser?.role_id) ? true : ((isSaving == true) || instance ? true : false)}
                                                        value={
                                                            instances?.map((item: any, index: number) => {
                                                                if (item.id == data.instance_id) {
                                                                    return {
                                                                        value: item.id,
                                                                        label: item.name,
                                                                    }
                                                                }
                                                            })
                                                        }
                                                        options={
                                                            instances?.map((item: any, index: number) => {
                                                                return {
                                                                    value: item.id,
                                                                    label: item.name,
                                                                }
                                                            })
                                                        } />
                                                </div>
                                            </td>
                                        )}
                                        <td className='border'>
                                            {/* Kode Rekening */}
                                            <div className="flex gap-2 items-center">
                                                <Select placeholder="Pilih Kode Rekening"
                                                    menuPlacement={'top'}
                                                    className='min-w-[400px]'
                                                    classNamePrefix={'selectAngga'}
                                                    isDisabled={isSaving == true}
                                                    onChange={(e: any) => {
                                                        setDataInput5((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['kode_rekening_id'] = e?.value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    value={
                                                        arrKodeRekening5?.map((item: any, index: number) => {
                                                            if (item.id == data.kode_rekening_id) {
                                                                return {
                                                                    value: item.id,
                                                                    label: item.fullcode + ' - ' + item.name,
                                                                }
                                                            }
                                                        })
                                                    }
                                                    options={
                                                        arrKodeRekening5?.map((item: any, index: number) => {
                                                            return {
                                                                value: item.id,
                                                                label: item.fullcode + ' - ' + item.name,
                                                            }
                                                        })
                                                    } />


                                                {data?.id && (
                                                    <div className="">
                                                        <Tippy content="Hapus Data" placement='top' theme='danger'>
                                                            <button
                                                                type="button"
                                                                onClick={() => {

                                                                    const swalWithBootstrapButtons = Swal.mixin({
                                                                        customClass: {
                                                                            confirmButton: 'btn btn-danger',
                                                                            cancelButton: 'btn btn-slate-200 ltr:mr-3 rtl:ml-3',
                                                                            popup: 'sweet-alerts',
                                                                        },
                                                                        buttonsStyling: false,
                                                                    });
                                                                    swalWithBootstrapButtons
                                                                        .fire({
                                                                            title: 'Hapus Data?',
                                                                            text: "Apakah Anda yakin untuk menghapus Data Ini!",
                                                                            icon: 'question',
                                                                            showCancelButton: true,
                                                                            confirmButtonText: 'Ya, Hapus!',
                                                                            cancelButtonText: 'Tidak!',
                                                                            reverseButtons: true,
                                                                            padding: '2em',
                                                                        })
                                                                        .then((result) => {
                                                                            if (result.value) {
                                                                                deleteData(data.id);
                                                                            } else if (result.dismiss === Swal.DismissReason.cancel) {
                                                                                swalWithBootstrapButtons.fire('Batal', 'Batal menghapus Data', 'info');
                                                                            }
                                                                        });
                                                                }}
                                                                className="btn btn-danger h-8 p-0 rounded-full w-8">
                                                                <IconTrash className='h-4 w-4' />
                                                            </button>
                                                        </Tippy>
                                                    </div>
                                                )}

                                            </div>
                                        </td>

                                        <td className="border">
                                            <InputRupiah
                                                readOnly={true}
                                                dataValue={data.jumlah_penyisihan}
                                                onChange={(value: any) => {
                                                    setDataInput5((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['jumlah_penyisihan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.jumlah_penyisihan_last_year}
                                                onChange={(value: any) => {
                                                    setDataInput5((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['jumlah_penyisihan_last_year'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                // readOnly={true}
                                                dataValue={data.koreksi_penyisihan}
                                                onChange={(value: any) => {
                                                    setDataInput5((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['koreksi_penyisihan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                readOnly={true}
                                                dataValue={data.beban_penyisihan}
                                                onChange={(value: any) => {
                                                    setDataInput5((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['beban_penyisihan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                    </tr>
                                ))}

                                {/*  TRANSFER ANTAR DAERAH  */}
                                <tr>
                                    <td colSpan={2} className='bg-slate-200/50 border text-md font-semibold'>
                                        <div className="flex justify-between items-center">
                                            <div className="">
                                                TRANSFER ANTAR DAERAH
                                            </div>
                                            <button type="button"
                                                disabled={isSaving == true}
                                                onClick={(e) => {
                                                    addDataInput(6)
                                                }}
                                                className='btn btn-primary text-xs whitespace-nowrap'>
                                                <FontAwesomeIcon icon={faPlus} className='h-3 w-3 mr-1' />
                                                Tambah Data
                                            </button>
                                        </div>
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData6.jumlah_penyisihan}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData6.jumlah_penyisihan_last_year}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData6.koreksi_penyisihan}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData6.beban_penyisihan}
                                            readOnly={true} />
                                    </td>
                                </tr>
                                {dataInput6.map((data: any, index: any) => (
                                    <tr key={index}>
                                        {([9].includes(CurrentUser?.role_id) == false) && (
                                            <td className='border'>
                                                {/* Perangkat Daerah */}
                                                <div className="">
                                                    <Select placeholder="Pilih Perangkat Daerah"
                                                        menuPlacement={'top'}
                                                        className='min-w-[300px]'
                                                        onChange={(e: any) => {
                                                            if ([9].includes(CurrentUser?.role_id)) {
                                                                showAlert('error', 'Anda tidak memiliki akses ke Perangkat Daerah ini');
                                                            } else {
                                                                setDataInput6((prev: any) => {
                                                                    const updated = [...prev];
                                                                    updated[index]['instance_id'] = e?.value;
                                                                    return updated;
                                                                })
                                                                setIsUnsaved(true);
                                                            }
                                                        }}
                                                        isDisabled={[9].includes(CurrentUser?.role_id) ? true : ((isSaving == true) || instance ? true : false)}
                                                        value={
                                                            instances?.map((item: any, index: number) => {
                                                                if (item.id == data.instance_id) {
                                                                    return {
                                                                        value: item.id,
                                                                        label: item.name,
                                                                    }
                                                                }
                                                            })
                                                        }
                                                        options={
                                                            instances?.map((item: any, index: number) => {
                                                                return {
                                                                    value: item.id,
                                                                    label: item.name,
                                                                }
                                                            })
                                                        } />
                                                </div>
                                            </td>
                                        )}
                                        <td className='border'>
                                            {/* Kode Rekening */}
                                            <div className="flex gap-2 items-center">
                                                <Select placeholder="Pilih Kode Rekening"
                                                    className='min-w-[400px]'
                                                    classNamePrefix={'selectAngga'}
                                                    isDisabled={isSaving == true}
                                                    menuPlacement={'top'}
                                                    onChange={(e: any) => {
                                                        setDataInput6((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['kode_rekening_id'] = e?.value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    value={
                                                        arrKodeRekening6?.map((item: any, index: number) => {
                                                            if (item.id == data.kode_rekening_id) {
                                                                return {
                                                                    value: item.id,
                                                                    label: item.fullcode + ' - ' + item.name,
                                                                }
                                                            }
                                                        })
                                                    }
                                                    options={
                                                        arrKodeRekening6?.map((item: any, index: number) => {
                                                            return {
                                                                value: item.id,
                                                                label: item.fullcode + ' - ' + item.name,
                                                            }
                                                        })
                                                    } />


                                                {data?.id && (
                                                    <div className="">
                                                        <Tippy content="Hapus Data" placement='top' theme='danger'>
                                                            <button
                                                                type="button"
                                                                onClick={() => {

                                                                    const swalWithBootstrapButtons = Swal.mixin({
                                                                        customClass: {
                                                                            confirmButton: 'btn btn-danger',
                                                                            cancelButton: 'btn btn-slate-200 ltr:mr-3 rtl:ml-3',
                                                                            popup: 'sweet-alerts',
                                                                        },
                                                                        buttonsStyling: false,
                                                                    });
                                                                    swalWithBootstrapButtons
                                                                        .fire({
                                                                            title: 'Hapus Data?',
                                                                            text: "Apakah Anda yakin untuk menghapus Data Ini!",
                                                                            icon: 'question',
                                                                            showCancelButton: true,
                                                                            confirmButtonText: 'Ya, Hapus!',
                                                                            cancelButtonText: 'Tidak!',
                                                                            reverseButtons: true,
                                                                            padding: '2em',
                                                                        })
                                                                        .then((result) => {
                                                                            if (result.value) {
                                                                                deleteData(data.id);
                                                                            } else if (result.dismiss === Swal.DismissReason.cancel) {
                                                                                swalWithBootstrapButtons.fire('Batal', 'Batal menghapus Data', 'info');
                                                                            }
                                                                        });
                                                                }}
                                                                className="btn btn-danger h-8 p-0 rounded-full w-8">
                                                                <IconTrash className='h-4 w-4' />
                                                            </button>
                                                        </Tippy>
                                                    </div>
                                                )}

                                            </div>
                                        </td>

                                        <td className="border">
                                            <InputRupiah
                                                readOnly={true}
                                                dataValue={data.jumlah_penyisihan}
                                                onChange={(value: any) => {
                                                    setDataInput6((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['jumlah_penyisihan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.jumlah_penyisihan_last_year}
                                                onChange={(value: any) => {
                                                    setDataInput6((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['jumlah_penyisihan_last_year'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                // readOnly={true}
                                                dataValue={data.koreksi_penyisihan}
                                                onChange={(value: any) => {
                                                    setDataInput6((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['koreksi_penyisihan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                readOnly={true}
                                                dataValue={data.beban_penyisihan}
                                                onChange={(value: any) => {
                                                    setDataInput6((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['beban_penyisihan'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                    </tr>
                                ))}
                            </>
                        ) : (
                            <tr>
                                <td colSpan={12} className='border text-center'>
                                    <div className="text-md font-semibold uppercase">
                                        Sedang Memuat Data
                                        <span className='dots-loading'>
                                            ...
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        )}

                    </tbody>
                    {isLoading === false && (
                        <tfoot>
                            <tr>
                                <td className='border p-4'></td>
                                <td className="bg-slate-50 border p-4 dark:bg-slate-900">
                                    <div className="text-end font-semibold">
                                        Jumlah
                                    </div>
                                </td>
                                <td className="border p-4">
                                    <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                        <div className="">
                                            Rp.
                                        </div>
                                        <div className="">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.jumlah_penyisihan)}
                                        </div>
                                    </div>
                                </td>
                                <td className="border p-4">
                                    <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                        <div className="">
                                            Rp.
                                        </div>
                                        <div className="">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.jumlah_penyisihan_last_year)}
                                        </div>
                                    </div>
                                </td>
                                <td className="border p-4">
                                    <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                        <div className="">
                                            Rp.
                                        </div>
                                        <div className="">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.koreksi_penyisihan)}
                                        </div>
                                    </div>
                                </td>
                                <td className="border p-4">
                                    <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                        <div className="">
                                            Rp.
                                        </div>
                                        <div className="">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.beban_penyisihan)}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>

            <div className="flex justify-end gap-4 items-center mt-4 px-5">
                <div className="flex items-center">
                    {(totalData) && (
                        <DownloadButtons
                            data={
                                dataInput1.concat(dataInput2, dataInput3, dataInput4, dataInput5, dataInput6)
                            }
                            endpoint='/accountancy/download/excel'
                            uploadEndpoint='/accountancy/upload/excel'
                            params={{
                                type: 'beban',
                                category: 'pendapatan_lo',
                                instance: instance,
                                periode: periode?.id,
                                year: year,
                            }}
                            afterClick={(e: any) => {
                                if (e[0] === 'error') {
                                    Swal.fire({
                                        title: 'Gagal!',
                                        text: e[1] ? e[1] : 'Terjadi kesalahan saat proses berlangsung.',
                                        icon: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: 'Tutup',
                                        confirmButtonColor: '#00ab55',
                                    });
                                    return;
                                } else {
                                    Swal.fire({
                                        title: e[1] === 'Downloaded' ? 'Download Berhasil!' : 'Upload Berhasil!',
                                        text: e[1] === 'Downloaded' ? 'File berhasil diunduh.' : 'File berhasil diunggah.',
                                        icon: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'Tutup',
                                        confirmButtonColor: '#00ab55',
                                    });
                                    if (e[1] == 'Uploaded') {
                                        _getDatas();
                                    }
                                    return;
                                }
                            }}
                        />
                    )}
                </div>

                {instance && (
                    <>
                        {isSaving == false ? (
                            <button type="button"
                                onClick={(e) => {
                                    save()
                                }}
                                className='btn btn-success text-xs whitespace-nowrap'>
                                <FontAwesomeIcon icon={faSave} className='h-3 w-3 mr-1' />
                                Simpan
                            </button>
                        ) : (
                            <button type="button"
                                disabled={true}
                                className='btn btn-success text-xs whitespace-nowrap'>
                                <FontAwesomeIcon icon={faSpinner} className='h-3 w-3 animate-spin mr-1' />
                                Menyimpan..
                            </button>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default Beban;

