import Select from 'react-select';
import { faPlus, faSave, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
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
import { deletePiutang, getPiutang, storePiutang } from '@/apis/Accountancy/PiutangPdd';
import InputRupiah from '@/components/InputRupiah';
import IconX from '@/components/Icon/IconX';
import DownloadButtons from '@/components/Buttons/DownloadButtons';
import { massDeleteData } from '@/apis/Accountancy/Accountancy';

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

const Piutang = (data: any) => {
    const paramData = data.data
    // console.log(paramData);
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
            _getDatas(paramData[4], paramData[3]);
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

    const _getDatas = (instanceId: any, tahun: any) => {
        setDataInput1([]);
        setDataInput2([]);
        setDataInput3([]);
        setDataInput4([]);
        setDataInput5([]);
        setDataInput6([]);
        setIsLoading(true);

        if (periode?.id) {
            getPiutang(instanceId, periode?.id, tahun).then((res: any) => {
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
                                instance_id: instanceId ?? '',
                                type: 'pendapatan_pajak_daerah',
                                kode_rekening_id: '',
                                saldo_awal: 0,
                                koreksi_saldo_awal: 0,
                                penghapusan_piutang: 0,
                                mutasi_debet: 0,
                                mutasi_kredit: 0,
                                saldo_akhir: 0,
                                umur_piutang_1: 0,
                                umur_piutang_2: 0,
                                umur_piutang_3: 0,
                                umur_piutang_4: 0,
                                piutang_bruto: 0,
                            }
                        ])
                        setDataInput2([
                            {
                                id: '',
                                instance_id: instanceId ?? '',
                                type: 'hasil_retribusi_daerah',
                                kode_rekening_id: '',
                                saldo_awal: 0,
                                koreksi_saldo_awal: 0,
                                penghapusan_piutang: 0,
                                mutasi_debet: 0,
                                mutasi_kredit: 0,
                                saldo_akhir: 0,
                                umur_piutang_1: 0,
                                umur_piutang_2: 0,
                                umur_piutang_3: 0,
                                umur_piutang_4: 0,
                                piutang_bruto: 0,
                            }
                        ])
                        setDataInput3([
                            {
                                id: '',
                                instance_id: instanceId ?? '',
                                type: 'hasil_pengelolaan_kekayaan_daerah_yang_dipisahkan',
                                kode_rekening_id: '',
                                saldo_awal: 0,
                                koreksi_saldo_awal: 0,
                                penghapusan_piutang: 0,
                                mutasi_debet: 0,
                                mutasi_kredit: 0,
                                saldo_akhir: 0,
                                umur_piutang_1: 0,
                                umur_piutang_2: 0,
                                umur_piutang_3: 0,
                                umur_piutang_4: 0,
                                piutang_bruto: 0,
                            }
                        ])
                        setDataInput4([
                            {
                                id: '',
                                instance_id: instanceId ?? '',
                                type: 'lain_lain_pad_yang_sah',
                                kode_rekening_id: '',
                                saldo_awal: 0,
                                koreksi_saldo_awal: 0,
                                penghapusan_piutang: 0,
                                mutasi_debet: 0,
                                mutasi_kredit: 0,
                                saldo_akhir: 0,
                                umur_piutang_1: 0,
                                umur_piutang_2: 0,
                                umur_piutang_3: 0,
                                umur_piutang_4: 0,
                                piutang_bruto: 0,
                            }
                        ])
                        setDataInput5([
                            {
                                id: '',
                                instance_id: instanceId ?? '',
                                type: 'transfer_pemerintah_pusat',
                                kode_rekening_id: '',
                                saldo_awal: 0,
                                koreksi_saldo_awal: 0,
                                penghapusan_piutang: 0,
                                mutasi_debet: 0,
                                mutasi_kredit: 0,
                                saldo_akhir: 0,
                                umur_piutang_1: 0,
                                umur_piutang_2: 0,
                                umur_piutang_3: 0,
                                umur_piutang_4: 0,
                                piutang_bruto: 0,
                            }
                        ])
                        setDataInput6([
                            {
                                id: '',
                                instance_id: instanceId ?? '',
                                type: 'transfer_antar_daerah',
                                kode_rekening_id: '',
                                saldo_awal: 0,
                                koreksi_saldo_awal: 0,
                                penghapusan_piutang: 0,
                                mutasi_debet: 0,
                                mutasi_kredit: 0,
                                saldo_akhir: 0,
                                umur_piutang_1: 0,
                                umur_piutang_2: 0,
                                umur_piutang_3: 0,
                                umur_piutang_4: 0,
                                piutang_bruto: 0,
                            }
                        ])
                    }
                }
                setIsLoading(false);
            });
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
            }
        }
    }, [isMounted, instance, year])

    const [totalData, setTotalData] = useState<any>({
        saldo_awal: 0,
        koreksi_saldo_awal: 0,
        penghapusan_piutang: 0,
        mutasi_debet: 0,
        mutasi_kredit: 0,
        saldo_akhir: 0,
        umur_piutang_1: 0,
        umur_piutang_2: 0,
        umur_piutang_3: 0,
        umur_piutang_4: 0,
        piutang_bruto: 0,
    });

    const [totalData1, setTotalData1] = useState<any>({
        saldo_awal: 0,
        koreksi_saldo_awal: 0,
        penghapusan_piutang: 0,
        mutasi_debet: 0,
        mutasi_kredit: 0,
        saldo_akhir: 0,
        umur_piutang_1: 0,
        umur_piutang_2: 0,
        umur_piutang_3: 0,
        umur_piutang_4: 0,
        piutang_bruto: 0,
    });

    const [totalData2, setTotalData2] = useState<any>({
        saldo_awal: 0,
        koreksi_saldo_awal: 0,
        penghapusan_piutang: 0,
        mutasi_debet: 0,
        mutasi_kredit: 0,
        saldo_akhir: 0,
        umur_piutang_1: 0,
        umur_piutang_2: 0,
        umur_piutang_3: 0,
        umur_piutang_4: 0,
        piutang_bruto: 0,
    });

    const [totalData3, setTotalData3] = useState<any>({
        saldo_awal: 0,
        koreksi_saldo_awal: 0,
        penghapusan_piutang: 0,
        mutasi_debet: 0,
        mutasi_kredit: 0,
        saldo_akhir: 0,
        umur_piutang_1: 0,
        umur_piutang_2: 0,
        umur_piutang_3: 0,
        umur_piutang_4: 0,
        piutang_bruto: 0,
    });

    const [totalData4, setTotalData4] = useState<any>({
        saldo_awal: 0,
        koreksi_saldo_awal: 0,
        penghapusan_piutang: 0,
        mutasi_debet: 0,
        mutasi_kredit: 0,
        saldo_akhir: 0,
        umur_piutang_1: 0,
        umur_piutang_2: 0,
        umur_piutang_3: 0,
        umur_piutang_4: 0,
        piutang_bruto: 0,
    });

    const [totalData5, setTotalData5] = useState<any>({
        saldo_awal: 0,
        koreksi_saldo_awal: 0,
        penghapusan_piutang: 0,
        mutasi_debet: 0,
        mutasi_kredit: 0,
        saldo_akhir: 0,
        umur_piutang_1: 0,
        umur_piutang_2: 0,
        umur_piutang_3: 0,
        umur_piutang_4: 0,
        piutang_bruto: 0,
    });

    const [totalData6, setTotalData6] = useState<any>({
        saldo_awal: 0,
        koreksi_saldo_awal: 0,
        penghapusan_piutang: 0,
        mutasi_debet: 0,
        mutasi_kredit: 0,
        saldo_akhir: 0,
        umur_piutang_1: 0,
        umur_piutang_2: 0,
        umur_piutang_3: 0,
        umur_piutang_4: 0,
        piutang_bruto: 0,
    });

    const addDataInput = (number: number) => {
        const type = number == 1 ? 'pendapatan_pajak_daerah' : number == 2 ? 'hasil_retribusi_daerah' : number == 3 ? 'hasil_pengelolaan_kekayaan_daerah_yang_dipisahkan' : number == 4 ? 'lain_lain_pad_yang_sah' : number == 5 ? 'transfer_pemerintah_pusat' : 'transfer_antar_daerah';
        const newData = {
            id: '',
            instance_id: instance ?? '',
            type: type,
            kode_rekening_id: '',
            saldo_awal: 0,
            koreksi_saldo_awal: 0,
            penghapusan_piutang: 0,
            mutasi_debet: 0,
            mutasi_kredit: 0,
            saldo_akhir: 0,
            umur_piutang_1: 0,
            umur_piutang_2: 0,
            umur_piutang_3: 0,
            umur_piutang_4: 0,
            piutang_bruto: 0,
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

                    updated[index]['saldo_akhir'] = parseFloat(updated[index]['saldo_awal']) + parseFloat(updated[index]['koreksi_saldo_awal']) - parseFloat(updated[index]['penghapusan_piutang']) + parseFloat(updated[index]['mutasi_debet']) - parseFloat(updated[index]['mutasi_kredit']);

                    const keyToSum2 = ['umur_piutang_1', 'umur_piutang_2', 'umur_piutang_3', 'umur_piutang_4'];
                    const sum2 = keyToSum2.reduce((acc: any, key: any) => acc + (parseFloat(updated[index][key]) || 0), 0);
                    updated[index]['piutang_bruto'] = sum2;

                    return updated;
                })
            }
            if (data[0].type == 'hasil_retribusi_daerah') {
                setDataInput2((prev: any) => {
                    const updated = [...prev];

                    updated[index]['saldo_akhir'] = parseFloat(updated[index]['saldo_awal']) + parseFloat(updated[index]['koreksi_saldo_awal']) - parseFloat(updated[index]['penghapusan_piutang']) + parseFloat(updated[index]['mutasi_debet']) - parseFloat(updated[index]['mutasi_kredit']);

                    const keyToSum2 = ['umur_piutang_1', 'umur_piutang_2', 'umur_piutang_3', 'umur_piutang_4'];
                    const sum2 = keyToSum2.reduce((acc: any, key: any) => acc + (parseFloat(updated[index][key]) || 0), 0);
                    updated[index]['piutang_bruto'] = sum2;

                    return updated;
                })
            }
            if (data[0].type == 'hasil_pengelolaan_kekayaan_daerah_yang_dipisahkan') {
                setDataInput3((prev: any) => {
                    const updated = [...prev];

                    updated[index]['saldo_akhir'] = parseFloat(updated[index]['saldo_awal']) + parseFloat(updated[index]['koreksi_saldo_awal']) - parseFloat(updated[index]['penghapusan_piutang']) + parseFloat(updated[index]['mutasi_debet']) - parseFloat(updated[index]['mutasi_kredit']);

                    const keyToSum2 = ['umur_piutang_1', 'umur_piutang_2', 'umur_piutang_3', 'umur_piutang_4'];
                    const sum2 = keyToSum2.reduce((acc: any, key: any) => acc + (parseFloat(updated[index][key]) || 0), 0);
                    updated[index]['piutang_bruto'] = sum2;

                    return updated;
                })
            }
            if (data[0].type == 'lain_lain_pad_yang_sah') {
                setDataInput4((prev: any) => {
                    const updated = [...prev];

                    updated[index]['saldo_akhir'] = parseFloat(updated[index]['saldo_awal']) + parseFloat(updated[index]['koreksi_saldo_awal']) - parseFloat(updated[index]['penghapusan_piutang']) + parseFloat(updated[index]['mutasi_debet']) - parseFloat(updated[index]['mutasi_kredit']);

                    const keyToSum2 = ['umur_piutang_1', 'umur_piutang_2', 'umur_piutang_3', 'umur_piutang_4'];
                    const sum2 = keyToSum2.reduce((acc: any, key: any) => acc + (parseFloat(updated[index][key]) || 0), 0);
                    updated[index]['piutang_bruto'] = sum2;

                    return updated;
                })
            }
            if (data[0].type == 'transfer_pemerintah_pusat') {
                setDataInput5((prev: any) => {
                    const updated = [...prev];

                    updated[index]['saldo_akhir'] = parseFloat(updated[index]['saldo_awal']) + parseFloat(updated[index]['koreksi_saldo_awal']) - parseFloat(updated[index]['penghapusan_piutang']) + parseFloat(updated[index]['mutasi_debet']) - parseFloat(updated[index]['mutasi_kredit']);

                    const keyToSum2 = ['umur_piutang_1', 'umur_piutang_2', 'umur_piutang_3', 'umur_piutang_4'];
                    const sum2 = keyToSum2.reduce((acc: any, key: any) => acc + (parseFloat(updated[index][key]) || 0), 0);
                    updated[index]['piutang_bruto'] = sum2;

                    return updated;
                })
            }
            if (data[0].type == 'transfer_antar_daerah') {
                setDataInput6((prev: any) => {
                    const updated = [...prev];

                    updated[index]['saldo_akhir'] = parseFloat(updated[index]['saldo_awal']) + parseFloat(updated[index]['koreksi_saldo_awal']) - parseFloat(updated[index]['penghapusan_piutang']) + parseFloat(updated[index]['mutasi_debet']) - parseFloat(updated[index]['mutasi_kredit']);

                    const keyToSum2 = ['umur_piutang_1', 'umur_piutang_2', 'umur_piutang_3', 'umur_piutang_4'];
                    const sum2 = keyToSum2.reduce((acc: any, key: any) => acc + (parseFloat(updated[index][key]) || 0), 0);
                    updated[index]['piutang_bruto'] = sum2;

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
                updated['saldo_awal'] = parseFloat(totalData1['saldo_awal'] ?? 0) + parseFloat(totalData2['saldo_awal'] ?? 0) + parseFloat(totalData3['saldo_awal'] ?? 0) + parseFloat(totalData4['saldo_awal'] ?? 0) + parseFloat(totalData5['saldo_awal'] ?? 0) + parseFloat(totalData6['saldo_awal'] ?? 0);
                updated['koreksi_saldo_awal'] = parseFloat(totalData1['koreksi_saldo_awal'] ?? 0) + parseFloat(totalData2['koreksi_saldo_awal'] ?? 0) + parseFloat(totalData3['koreksi_saldo_awal'] ?? 0) + parseFloat(totalData4['koreksi_saldo_awal'] ?? 0) + parseFloat(totalData5['koreksi_saldo_awal'] ?? 0) + parseFloat(totalData6['koreksi_saldo_awal'] ?? 0);
                updated['penghapusan_piutang'] = parseFloat(totalData1['penghapusan_piutang'] ?? 0) + parseFloat(totalData2['penghapusan_piutang'] ?? 0) + parseFloat(totalData3['penghapusan_piutang'] ?? 0) + parseFloat(totalData4['penghapusan_piutang'] ?? 0) + parseFloat(totalData5['penghapusan_piutang'] ?? 0) + parseFloat(totalData6['penghapusan_piutang'] ?? 0);
                updated['mutasi_debet'] = parseFloat(totalData1['mutasi_debet'] ?? 0) + parseFloat(totalData2['mutasi_debet'] ?? 0) + parseFloat(totalData3['mutasi_debet'] ?? 0) + parseFloat(totalData4['mutasi_debet'] ?? 0) + parseFloat(totalData5['mutasi_debet'] ?? 0) + parseFloat(totalData6['mutasi_debet'] ?? 0);
                updated['mutasi_kredit'] = parseFloat(totalData1['mutasi_kredit'] ?? 0) + parseFloat(totalData2['mutasi_kredit'] ?? 0) + parseFloat(totalData3['mutasi_kredit'] ?? 0) + parseFloat(totalData4['mutasi_kredit'] ?? 0) + parseFloat(totalData5['mutasi_kredit'] ?? 0) + parseFloat(totalData6['mutasi_kredit'] ?? 0);
                updated['saldo_akhir'] = parseFloat(totalData1['saldo_akhir'] ?? 0) + parseFloat(totalData2['saldo_akhir'] ?? 0) + parseFloat(totalData3['saldo_akhir'] ?? 0) + parseFloat(totalData4['saldo_akhir'] ?? 0) + parseFloat(totalData5['saldo_akhir'] ?? 0) + parseFloat(totalData6['saldo_akhir'] ?? 0);
                updated['umur_piutang_1'] = parseFloat(totalData1['umur_piutang_1'] ?? 0) + parseFloat(totalData2['umur_piutang_1'] ?? 0) + parseFloat(totalData3['umur_piutang_1'] ?? 0) + parseFloat(totalData4['umur_piutang_1'] ?? 0) + parseFloat(totalData5['umur_piutang_1'] ?? 0) + parseFloat(totalData6['umur_piutang_1'] ?? 0);
                updated['umur_piutang_2'] = parseFloat(totalData1['umur_piutang_2'] ?? 0) + parseFloat(totalData2['umur_piutang_2'] ?? 0) + parseFloat(totalData3['umur_piutang_2'] ?? 0) + parseFloat(totalData4['umur_piutang_2'] ?? 0) + parseFloat(totalData5['umur_piutang_2'] ?? 0) + parseFloat(totalData6['umur_piutang_2'] ?? 0);
                updated['umur_piutang_3'] = parseFloat(totalData1['umur_piutang_3'] ?? 0) + parseFloat(totalData2['umur_piutang_3'] ?? 0) + parseFloat(totalData3['umur_piutang_3'] ?? 0) + parseFloat(totalData4['umur_piutang_3'] ?? 0) + parseFloat(totalData5['umur_piutang_3'] ?? 0) + parseFloat(totalData6['umur_piutang_3'] ?? 0);
                updated['umur_piutang_4'] = parseFloat(totalData1['umur_piutang_4'] ?? 0) + parseFloat(totalData2['umur_piutang_4'] ?? 0) + parseFloat(totalData3['umur_piutang_4'] ?? 0) + parseFloat(totalData4['umur_piutang_4'] ?? 0) + parseFloat(totalData5['umur_piutang_4'] ?? 0) + parseFloat(totalData6['umur_piutang_4'] ?? 0);
                updated['piutang_bruto'] = parseFloat(totalData1['piutang_bruto'] ?? 0) + parseFloat(totalData2['piutang_bruto'] ?? 0) + parseFloat(totalData3['piutang_bruto'] ?? 0) + parseFloat(totalData4['piutang_bruto'] ?? 0) + parseFloat(totalData5['piutang_bruto'] ?? 0) + parseFloat(totalData6['piutang_bruto'] ?? 0);
                return updated;
            })
        }
    }, [isMounted, totalData1, totalData2, totalData3, totalData4, totalData5, totalData6])

    useEffect(() => {
        if (isMounted && dataInput1.length > 0) {
            setTotalData1((prev: any) => {
                const updated = { ...prev };
                updated['saldo_awal'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['saldo_awal']), 0);
                updated['koreksi_saldo_awal'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['koreksi_saldo_awal']), 0);
                updated['penghapusan_piutang'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['penghapusan_piutang']), 0);
                updated['mutasi_debet'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['mutasi_debet']), 0);
                updated['mutasi_kredit'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['mutasi_kredit']), 0);
                updated['saldo_akhir'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['saldo_akhir']), 0);
                updated['umur_piutang_1'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['umur_piutang_1']), 0);
                updated['umur_piutang_2'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['umur_piutang_2']), 0);
                updated['umur_piutang_3'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['umur_piutang_3']), 0);
                updated['umur_piutang_4'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['umur_piutang_4']), 0);
                updated['piutang_bruto'] = dataInput1.reduce((acc: any, obj: any) => acc + parseFloat(obj['piutang_bruto']), 0);
                return updated;
            })
        }
    }, [isMounted, dataInput1])

    useEffect(() => {
        if (isMounted && dataInput2.length > 0) {
            setTotalData2((prev: any) => {
                const updated = { ...prev };
                updated['saldo_awal'] = dataInput2.reduce((acc: any, obj: any) => acc + parseFloat(obj['saldo_awal']), 0);
                updated['koreksi_saldo_awal'] = dataInput2.reduce((acc: any, obj: any) => acc + parseFloat(obj['koreksi_saldo_awal']), 0);
                updated['penghapusan_piutang'] = dataInput2.reduce((acc: any, obj: any) => acc + parseFloat(obj['penghapusan_piutang']), 0);
                updated['mutasi_debet'] = dataInput2.reduce((acc: any, obj: any) => acc + parseFloat(obj['mutasi_debet']), 0);
                updated['mutasi_kredit'] = dataInput2.reduce((acc: any, obj: any) => acc + parseFloat(obj['mutasi_kredit']), 0);
                updated['saldo_akhir'] = dataInput2.reduce((acc: any, obj: any) => acc + parseFloat(obj['saldo_akhir']), 0);
                updated['umur_piutang_1'] = dataInput2.reduce((acc: any, obj: any) => acc + parseFloat(obj['umur_piutang_1']), 0);
                updated['umur_piutang_2'] = dataInput2.reduce((acc: any, obj: any) => acc + parseFloat(obj['umur_piutang_2']), 0);
                updated['umur_piutang_3'] = dataInput2.reduce((acc: any, obj: any) => acc + parseFloat(obj['umur_piutang_3']), 0);
                updated['umur_piutang_4'] = dataInput2.reduce((acc: any, obj: any) => acc + parseFloat(obj['umur_piutang_4']), 0);
                updated['piutang_bruto'] = dataInput2.reduce((acc: any, obj: any) => acc + parseFloat(obj['piutang_bruto']), 0);
                return updated;
            })
        }
    }, [isMounted, dataInput2])

    useEffect(() => {
        if (isMounted && dataInput3.length > 0) {
            setTotalData3((prev: any) => {
                const updated = { ...prev };
                updated['saldo_awal'] = dataInput3.reduce((acc: any, obj: any) => acc + parseFloat(obj['saldo_awal']), 0);
                updated['koreksi_saldo_awal'] = dataInput3.reduce((acc: any, obj: any) => acc + parseFloat(obj['koreksi_saldo_awal']), 0);
                updated['penghapusan_piutang'] = dataInput3.reduce((acc: any, obj: any) => acc + parseFloat(obj['penghapusan_piutang']), 0);
                updated['mutasi_debet'] = dataInput3.reduce((acc: any, obj: any) => acc + parseFloat(obj['mutasi_debet']), 0);
                updated['mutasi_kredit'] = dataInput3.reduce((acc: any, obj: any) => acc + parseFloat(obj['mutasi_kredit']), 0);
                updated['saldo_akhir'] = dataInput3.reduce((acc: any, obj: any) => acc + parseFloat(obj['saldo_akhir']), 0);
                updated['umur_piutang_1'] = dataInput3.reduce((acc: any, obj: any) => acc + parseFloat(obj['umur_piutang_1']), 0);
                updated['umur_piutang_2'] = dataInput3.reduce((acc: any, obj: any) => acc + parseFloat(obj['umur_piutang_2']), 0);
                updated['umur_piutang_3'] = dataInput3.reduce((acc: any, obj: any) => acc + parseFloat(obj['umur_piutang_3']), 0);
                updated['umur_piutang_4'] = dataInput3.reduce((acc: any, obj: any) => acc + parseFloat(obj['umur_piutang_4']), 0);
                updated['piutang_bruto'] = dataInput3.reduce((acc: any, obj: any) => acc + parseFloat(obj['piutang_bruto']), 0);
                return updated;
            })
        }
    }, [isMounted, dataInput3])

    useEffect(() => {
        if (isMounted && dataInput4.length > 0) {
            setTotalData4((prev: any) => {
                const updated = { ...prev };
                updated['saldo_awal'] = dataInput4.reduce((acc: any, obj: any) => acc + parseFloat(obj['saldo_awal']), 0);
                updated['koreksi_saldo_awal'] = dataInput4.reduce((acc: any, obj: any) => acc + parseFloat(obj['koreksi_saldo_awal']), 0);
                updated['penghapusan_piutang'] = dataInput4.reduce((acc: any, obj: any) => acc + parseFloat(obj['penghapusan_piutang']), 0);
                updated['mutasi_debet'] = dataInput4.reduce((acc: any, obj: any) => acc + parseFloat(obj['mutasi_debet']), 0);
                updated['mutasi_kredit'] = dataInput4.reduce((acc: any, obj: any) => acc + parseFloat(obj['mutasi_kredit']), 0);
                updated['saldo_akhir'] = dataInput4.reduce((acc: any, obj: any) => acc + parseFloat(obj['saldo_akhir']), 0);
                updated['umur_piutang_1'] = dataInput4.reduce((acc: any, obj: any) => acc + parseFloat(obj['umur_piutang_1']), 0);
                updated['umur_piutang_2'] = dataInput4.reduce((acc: any, obj: any) => acc + parseFloat(obj['umur_piutang_2']), 0);
                updated['umur_piutang_3'] = dataInput4.reduce((acc: any, obj: any) => acc + parseFloat(obj['umur_piutang_3']), 0);
                updated['umur_piutang_4'] = dataInput4.reduce((acc: any, obj: any) => acc + parseFloat(obj['umur_piutang_4']), 0);
                updated['piutang_bruto'] = dataInput4.reduce((acc: any, obj: any) => acc + parseFloat(obj['piutang_bruto']), 0);
                return updated;
            })
        }
    }, [isMounted, dataInput4])

    useEffect(() => {
        if (isMounted && dataInput5.length > 0) {
            setTotalData5((prev: any) => {
                const updated = { ...prev };
                updated['saldo_awal'] = dataInput5.reduce((acc: any, obj: any) => acc + parseFloat(obj['saldo_awal']), 0);
                updated['koreksi_saldo_awal'] = dataInput5.reduce((acc: any, obj: any) => acc + parseFloat(obj['koreksi_saldo_awal']), 0);
                updated['penghapusan_piutang'] = dataInput5.reduce((acc: any, obj: any) => acc + parseFloat(obj['penghapusan_piutang']), 0);
                updated['mutasi_debet'] = dataInput5.reduce((acc: any, obj: any) => acc + parseFloat(obj['mutasi_debet']), 0);
                updated['mutasi_kredit'] = dataInput5.reduce((acc: any, obj: any) => acc + parseFloat(obj['mutasi_kredit']), 0);
                updated['saldo_akhir'] = dataInput5.reduce((acc: any, obj: any) => acc + parseFloat(obj['saldo_akhir']), 0);
                updated['umur_piutang_1'] = dataInput5.reduce((acc: any, obj: any) => acc + parseFloat(obj['umur_piutang_1']), 0);
                updated['umur_piutang_2'] = dataInput5.reduce((acc: any, obj: any) => acc + parseFloat(obj['umur_piutang_2']), 0);
                updated['umur_piutang_3'] = dataInput5.reduce((acc: any, obj: any) => acc + parseFloat(obj['umur_piutang_3']), 0);
                updated['umur_piutang_4'] = dataInput5.reduce((acc: any, obj: any) => acc + parseFloat(obj['umur_piutang_4']), 0);
                updated['piutang_bruto'] = dataInput5.reduce((acc: any, obj: any) => acc + parseFloat(obj['piutang_bruto']), 0);
                return updated;
            })
        }
    }, [isMounted, dataInput5])

    useEffect(() => {
        if (isMounted && dataInput6.length > 0) {
            setTotalData6((prev: any) => {
                const updated = { ...prev };
                updated['saldo_awal'] = dataInput6.reduce((acc: any, obj: any) => acc + parseFloat(obj['saldo_awal']), 0);
                updated['koreksi_saldo_awal'] = dataInput6.reduce((acc: any, obj: any) => acc + parseFloat(obj['koreksi_saldo_awal']), 0);
                updated['penghapusan_piutang'] = dataInput6.reduce((acc: any, obj: any) => acc + parseFloat(obj['penghapusan_piutang']), 0);
                updated['mutasi_debet'] = dataInput6.reduce((acc: any, obj: any) => acc + parseFloat(obj['mutasi_debet']), 0);
                updated['mutasi_kredit'] = dataInput6.reduce((acc: any, obj: any) => acc + parseFloat(obj['mutasi_kredit']), 0);
                updated['saldo_akhir'] = dataInput6.reduce((acc: any, obj: any) => acc + parseFloat(obj['saldo_akhir']), 0);
                updated['umur_piutang_1'] = dataInput6.reduce((acc: any, obj: any) => acc + parseFloat(obj['umur_piutang_1']), 0);
                updated['umur_piutang_2'] = dataInput6.reduce((acc: any, obj: any) => acc + parseFloat(obj['umur_piutang_2']), 0);
                updated['umur_piutang_3'] = dataInput6.reduce((acc: any, obj: any) => acc + parseFloat(obj['umur_piutang_3']), 0);
                updated['umur_piutang_4'] = dataInput6.reduce((acc: any, obj: any) => acc + parseFloat(obj['umur_piutang_4']), 0);
                updated['piutang_bruto'] = dataInput6.reduce((acc: any, obj: any) => acc + parseFloat(obj['piutang_bruto']), 0);
                return updated;
            })
        }
    }, [isMounted, dataInput6])

    const save = () => {
        setIsSaving(true);
        const MergedDataInput = dataInput1.concat(dataInput2, dataInput3, dataInput4, dataInput5, dataInput6);
        storePiutang(MergedDataInput, periode?.id, year).then((res: any) => {
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
            _getDatas(instance, year);
        });
    }

    const [selectedMode, setSelectedMode] = useState<boolean>(false);
    const [selectedData, setSelectedData] = useState<any>([]);

    const deleteData = (id: any) => {
        deletePiutang(id).then((res: any) => {
            if (res.status == 'success') {
                _getDatas(instance, year);
                showAlert('success', 'Data berhasil dihapus');
            } else {
                showAlert('error', 'Data gagal dihapus');
            }
        });
    }

    const deleteSelectedData = () => {
        massDeleteData(selectedData, 'acc_plo_piutang').then((res: any) => {
            if (res.status == 'success') {
                _getDatas(instance, year);
                setSelectedData([]);
                setSelectedMode(false);
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
                                Saldo Awal Tahun {year}
                            </th>
                            <th rowSpan={2} className="bg-slate-900 border text-center text-white min-w-[200px] whitespace-nowrap">
                                Koreksi Saldo Awal
                            </th>
                            <th rowSpan={2} className="bg-slate-900 border text-center text-white min-w-[200px] whitespace-nowrap">
                                Penghapusan Piutang
                            </th>
                            <th rowSpan={1} colSpan={2} className="bg-slate-900 border text-center text-white whitespace-nowrap">
                                Mutasi
                            </th>
                            <th rowSpan={2} className="bg-slate-900 border text-center text-white min-w-[200px] whitespace-nowrap">
                                Saldo Akhir
                            </th>
                            <th rowSpan={1} colSpan={4} className="bg-slate-900 border text-center text-white whitespace-nowrap">
                                Umur Piutang Per 31 Desember {year}
                            </th>
                            <th rowSpan={2} className="bg-slate-900 border text-center text-white min-w-[200px] whitespace-nowrap">
                                Piutang Bruto
                            </th>
                        </tr>
                        <tr className='sticky top-[46px] z-[0]'>
                            <th className="bg-slate-900 border text-center text-white min-w-[200px]">
                                Debet
                            </th>
                            <th className="bg-slate-900 border text-center text-white min-w-[200px]">
                                Kredit
                            </th>

                            <th className="bg-slate-900 border text-center text-white min-w-[200px]">
                                Lancar ({`<`} 1 Tahun)
                            </th>
                            <th className="bg-slate-900 border text-center text-white min-w-[200px]">
                                Kurang Lancar (1-3 Tahun)
                            </th>
                            <th className="bg-slate-900 border text-center text-white min-w-[200px]">
                                Diragukan (3-5 Tahun)
                            </th>
                            <th className="bg-slate-900 border text-center text-white min-w-[200px]">
                                Macet (5 Tahun)
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
                                            dataValue={totalData1.saldo_awal}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData1.koreksi_saldo_awal}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData1.penghapusan_piutang}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData1.mutasi_debet}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData1.mutasi_kredit}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData1.saldo_akhir}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData1.umur_piutang_1}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData1.umur_piutang_2}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData1.umur_piutang_3}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData1.umur_piutang_4}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData1.piutang_bruto}
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
                                                    <div className="flex gap-2">
                                                        {selectedMode ? (
                                                            <label className="w-12 h-6 relative">
                                                                <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox1"
                                                                    disabled={isSaving == true}
                                                                    checked={selectedData.includes(data.id)}
                                                                    onChange={(e: any) => {
                                                                        if (e.target.checked) {
                                                                            setSelectedData((prev: any) => [...prev, data.id])
                                                                        } else {
                                                                            setSelectedData((prev: any) => prev.filter((item: any) => item != data.id))
                                                                        }
                                                                    }}
                                                                />
                                                                <span className="outline_checkbox bg-icon border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full before:bg-[url(/assets/images/close.svg)] before:bg-no-repeat before:bg-center peer-checked:before:left-7 peer-checked:before:bg-[url(/assets/images/checked.svg)] peer-checked:border-primary peer-checked:before:bg-primary before:transition-all before:duration-300"></span>
                                                            </label>
                                                        ) : (
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
                                                        )}
                                                    </div>
                                                )}

                                            </div>
                                        </td>

                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.saldo_awal}
                                                onChange={(value: any) => {
                                                    setDataInput1((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['saldo_awal'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.koreksi_saldo_awal}
                                                onChange={(value: any) => {
                                                    setDataInput1((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['koreksi_saldo_awal'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.penghapusan_piutang}
                                                onChange={(value: any) => {
                                                    setDataInput1((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['penghapusan_piutang'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.mutasi_debet}
                                                onChange={(value: any) => {
                                                    setDataInput1((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['mutasi_debet'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.mutasi_kredit}
                                                onChange={(value: any) => {
                                                    setDataInput1((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['mutasi_kredit'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.saldo_akhir}
                                                readOnly={true}
                                                onChange={(value: any) => {
                                                    setDataInput1((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['saldo_akhir'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.umur_piutang_1}
                                                onChange={(value: any) => {
                                                    setDataInput1((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['umur_piutang_1'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.umur_piutang_2}
                                                onChange={(value: any) => {
                                                    setDataInput1((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['umur_piutang_2'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.umur_piutang_3}
                                                onChange={(value: any) => {
                                                    setDataInput1((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['umur_piutang_3'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.umur_piutang_4}
                                                onChange={(value: any) => {
                                                    setDataInput1((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['umur_piutang_4'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                readOnly={true}
                                                dataValue={data.piutang_bruto}
                                                onChange={(value: any) => {
                                                    setDataInput1((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['piutang_bruto'] = isNaN(value) ? 0 : value;
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
                                            dataValue={totalData2.saldo_awal}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData2.koreksi_saldo_awal}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData2.penghapusan_piutang}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData2.mutasi_debet}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData2.mutasi_kredit}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData2.saldo_akhir}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData2.umur_piutang_1}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData2.umur_piutang_2}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData2.umur_piutang_3}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData2.umur_piutang_4}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData2.piutang_bruto}
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
                                                    <div className="flex gap-2">
                                                        {selectedMode ? (
                                                            <label className="w-12 h-6 relative">
                                                                <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox1"
                                                                    disabled={isSaving == true}
                                                                    checked={selectedData.includes(data.id)}
                                                                    onChange={(e: any) => {
                                                                        if (e.target.checked) {
                                                                            setSelectedData((prev: any) => [...prev, data.id])
                                                                        } else {
                                                                            setSelectedData((prev: any) => prev.filter((item: any) => item != data.id))
                                                                        }
                                                                    }}
                                                                />
                                                                <span className="outline_checkbox bg-icon border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full before:bg-[url(/assets/images/close.svg)] before:bg-no-repeat before:bg-center peer-checked:before:left-7 peer-checked:before:bg-[url(/assets/images/checked.svg)] peer-checked:border-primary peer-checked:before:bg-primary before:transition-all before:duration-300"></span>
                                                            </label>
                                                        ) : (
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
                                                        )}
                                                    </div>
                                                )}

                                            </div>
                                        </td>

                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.saldo_awal}
                                                onChange={(value: any) => {
                                                    setDataInput2((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['saldo_awal'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.koreksi_saldo_awal}
                                                onChange={(value: any) => {
                                                    setDataInput2((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['koreksi_saldo_awal'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.penghapusan_piutang}
                                                onChange={(value: any) => {
                                                    setDataInput2((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['penghapusan_piutang'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.mutasi_debet}
                                                onChange={(value: any) => {
                                                    setDataInput2((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['mutasi_debet'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.mutasi_kredit}
                                                onChange={(value: any) => {
                                                    setDataInput2((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['mutasi_kredit'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.saldo_akhir}
                                                onChange={(value: any) => {
                                                    setDataInput2((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['saldo_akhir'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.umur_piutang_1}
                                                onChange={(value: any) => {
                                                    setDataInput2((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['umur_piutang_1'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.umur_piutang_2}
                                                onChange={(value: any) => {
                                                    setDataInput2((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['umur_piutang_2'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.umur_piutang_3}
                                                onChange={(value: any) => {
                                                    setDataInput2((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['umur_piutang_3'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.umur_piutang_4}
                                                onChange={(value: any) => {
                                                    setDataInput2((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['umur_piutang_4'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                readOnly={true}
                                                dataValue={data.piutang_bruto}
                                                onChange={(value: any) => {
                                                    setDataInput2((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['piutang_bruto'] = isNaN(value) ? 0 : value;
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
                                            dataValue={totalData3.saldo_awal}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData3.koreksi_saldo_awal}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData3.penghapusan_piutang}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData3.mutasi_debet}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData3.mutasi_kredit}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData3.saldo_akhir}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData3.umur_piutang_1}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData3.umur_piutang_2}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData3.umur_piutang_3}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData3.umur_piutang_4}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData3.piutang_bruto}
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
                                                    <div className="flex gap-2">
                                                        {selectedMode ? (
                                                            <label className="w-12 h-6 relative">
                                                                <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox1"
                                                                    disabled={isSaving == true}
                                                                    checked={selectedData.includes(data.id)}
                                                                    onChange={(e: any) => {
                                                                        if (e.target.checked) {
                                                                            setSelectedData((prev: any) => [...prev, data.id])
                                                                        } else {
                                                                            setSelectedData((prev: any) => prev.filter((item: any) => item != data.id))
                                                                        }
                                                                    }}
                                                                />
                                                                <span className="outline_checkbox bg-icon border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full before:bg-[url(/assets/images/close.svg)] before:bg-no-repeat before:bg-center peer-checked:before:left-7 peer-checked:before:bg-[url(/assets/images/checked.svg)] peer-checked:border-primary peer-checked:before:bg-primary before:transition-all before:duration-300"></span>
                                                            </label>
                                                        ) : (
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
                                                        )}
                                                    </div>
                                                )}

                                            </div>
                                        </td>

                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.saldo_awal}
                                                onChange={(value: any) => {
                                                    setDataInput3((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['saldo_awal'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.koreksi_saldo_awal}
                                                onChange={(value: any) => {
                                                    setDataInput3((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['koreksi_saldo_awal'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.penghapusan_piutang}
                                                onChange={(value: any) => {
                                                    setDataInput3((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['penghapusan_piutang'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.mutasi_debet}
                                                onChange={(value: any) => {
                                                    setDataInput3((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['mutasi_debet'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.mutasi_kredit}
                                                onChange={(value: any) => {
                                                    setDataInput3((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['mutasi_kredit'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.saldo_akhir}
                                                onChange={(value: any) => {
                                                    setDataInput3((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['saldo_akhir'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.umur_piutang_1}
                                                onChange={(value: any) => {
                                                    setDataInput3((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['umur_piutang_1'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.umur_piutang_2}
                                                onChange={(value: any) => {
                                                    setDataInput3((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['umur_piutang_2'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.umur_piutang_3}
                                                onChange={(value: any) => {
                                                    setDataInput3((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['umur_piutang_3'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.umur_piutang_4}
                                                onChange={(value: any) => {
                                                    setDataInput3((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['umur_piutang_4'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                readOnly={true}
                                                dataValue={data.piutang_bruto}
                                                onChange={(value: any) => {
                                                    setDataInput3((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['piutang_bruto'] = isNaN(value) ? 0 : value;
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
                                            dataValue={totalData4.saldo_awal}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData4.koreksi_saldo_awal}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData4.penghapusan_piutang}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData4.mutasi_debet}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData4.mutasi_kredit}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData4.saldo_akhir}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData4.umur_piutang_1}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData4.umur_piutang_2}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData4.umur_piutang_3}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData4.umur_piutang_4}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData4.piutang_bruto}
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
                                                    <div className="flex gap-2">
                                                        {selectedMode ? (
                                                            <label className="w-12 h-6 relative">
                                                                <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox1"
                                                                    disabled={isSaving == true}
                                                                    checked={selectedData.includes(data.id)}
                                                                    onChange={(e: any) => {
                                                                        if (e.target.checked) {
                                                                            setSelectedData((prev: any) => [...prev, data.id])
                                                                        } else {
                                                                            setSelectedData((prev: any) => prev.filter((item: any) => item != data.id))
                                                                        }
                                                                    }}
                                                                />
                                                                <span className="outline_checkbox bg-icon border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full before:bg-[url(/assets/images/close.svg)] before:bg-no-repeat before:bg-center peer-checked:before:left-7 peer-checked:before:bg-[url(/assets/images/checked.svg)] peer-checked:border-primary peer-checked:before:bg-primary before:transition-all before:duration-300"></span>
                                                            </label>
                                                        ) : (
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
                                                        )}
                                                    </div>
                                                )}

                                            </div>
                                        </td>

                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.saldo_awal}
                                                onChange={(value: any) => {
                                                    setDataInput4((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['saldo_awal'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.koreksi_saldo_awal}
                                                onChange={(value: any) => {
                                                    setDataInput4((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['koreksi_saldo_awal'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.penghapusan_piutang}
                                                onChange={(value: any) => {
                                                    setDataInput4((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['penghapusan_piutang'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.mutasi_debet}
                                                onChange={(value: any) => {
                                                    setDataInput4((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['mutasi_debet'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.mutasi_kredit}
                                                onChange={(value: any) => {
                                                    setDataInput4((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['mutasi_kredit'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.saldo_akhir}
                                                onChange={(value: any) => {
                                                    setDataInput4((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['saldo_akhir'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.umur_piutang_1}
                                                onChange={(value: any) => {
                                                    setDataInput4((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['umur_piutang_1'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.umur_piutang_2}
                                                onChange={(value: any) => {
                                                    setDataInput4((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['umur_piutang_2'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.umur_piutang_3}
                                                onChange={(value: any) => {
                                                    setDataInput4((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['umur_piutang_3'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.umur_piutang_4}
                                                onChange={(value: any) => {
                                                    setDataInput4((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['umur_piutang_4'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                readOnly={true}
                                                dataValue={data.piutang_bruto}
                                                onChange={(value: any) => {
                                                    setDataInput4((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['piutang_bruto'] = isNaN(value) ? 0 : value;
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
                                            dataValue={totalData5.saldo_awal}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData5.koreksi_saldo_awal}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData5.penghapusan_piutang}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData5.mutasi_debet}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData5.mutasi_kredit}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData5.saldo_akhir}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData5.umur_piutang_1}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData5.umur_piutang_2}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData5.umur_piutang_3}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData5.umur_piutang_4}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData5.piutang_bruto}
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
                                                    <div className="flex gap-2">
                                                        {selectedMode ? (
                                                            <label className="w-12 h-6 relative">
                                                                <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox1"
                                                                    disabled={isSaving == true}
                                                                    checked={selectedData.includes(data.id)}
                                                                    onChange={(e: any) => {
                                                                        if (e.target.checked) {
                                                                            setSelectedData((prev: any) => [...prev, data.id])
                                                                        } else {
                                                                            setSelectedData((prev: any) => prev.filter((item: any) => item != data.id))
                                                                        }
                                                                    }}
                                                                />
                                                                <span className="outline_checkbox bg-icon border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full before:bg-[url(/assets/images/close.svg)] before:bg-no-repeat before:bg-center peer-checked:before:left-7 peer-checked:before:bg-[url(/assets/images/checked.svg)] peer-checked:border-primary peer-checked:before:bg-primary before:transition-all before:duration-300"></span>
                                                            </label>
                                                        ) : (
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
                                                        )}
                                                    </div>
                                                )}

                                            </div>
                                        </td>

                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.saldo_awal}
                                                onChange={(value: any) => {
                                                    setDataInput5((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['saldo_awal'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.koreksi_saldo_awal}
                                                onChange={(value: any) => {
                                                    setDataInput5((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['koreksi_saldo_awal'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.penghapusan_piutang}
                                                onChange={(value: any) => {
                                                    setDataInput5((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['penghapusan_piutang'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.mutasi_debet}
                                                onChange={(value: any) => {
                                                    setDataInput5((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['mutasi_debet'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.mutasi_kredit}
                                                onChange={(value: any) => {
                                                    setDataInput5((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['mutasi_kredit'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.saldo_akhir}
                                                onChange={(value: any) => {
                                                    setDataInput5((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['saldo_akhir'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.umur_piutang_1}
                                                onChange={(value: any) => {
                                                    setDataInput5((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['umur_piutang_1'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.umur_piutang_2}
                                                onChange={(value: any) => {
                                                    setDataInput5((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['umur_piutang_2'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.umur_piutang_3}
                                                onChange={(value: any) => {
                                                    setDataInput5((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['umur_piutang_3'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.umur_piutang_4}
                                                onChange={(value: any) => {
                                                    setDataInput5((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['umur_piutang_4'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                readOnly={true}
                                                dataValue={data.piutang_bruto}
                                                onChange={(value: any) => {
                                                    setDataInput5((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['piutang_bruto'] = isNaN(value) ? 0 : value;
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
                                            dataValue={totalData6.saldo_awal}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData6.koreksi_saldo_awal}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData6.penghapusan_piutang}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData6.mutasi_debet}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData6.mutasi_kredit}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData6.saldo_akhir}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData6.umur_piutang_1}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData6.umur_piutang_2}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData6.umur_piutang_3}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData6.umur_piutang_4}
                                            readOnly={true} />
                                    </td>
                                    <td className='bg-slate-200/50 border font-semibold'>
                                        <InputRupiah
                                            dataValue={totalData6.piutang_bruto}
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
                                                dataValue={data.saldo_awal}
                                                onChange={(value: any) => {
                                                    setDataInput6((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['saldo_awal'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.koreksi_saldo_awal}
                                                onChange={(value: any) => {
                                                    setDataInput6((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['koreksi_saldo_awal'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.penghapusan_piutang}
                                                onChange={(value: any) => {
                                                    setDataInput6((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['penghapusan_piutang'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.mutasi_debet}
                                                onChange={(value: any) => {
                                                    setDataInput6((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['mutasi_debet'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.mutasi_kredit}
                                                onChange={(value: any) => {
                                                    setDataInput6((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['mutasi_kredit'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.saldo_akhir}
                                                onChange={(value: any) => {
                                                    setDataInput6((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['saldo_akhir'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.umur_piutang_1}
                                                onChange={(value: any) => {
                                                    setDataInput6((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['umur_piutang_1'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.umur_piutang_2}
                                                onChange={(value: any) => {
                                                    setDataInput6((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['umur_piutang_2'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.umur_piutang_3}
                                                onChange={(value: any) => {
                                                    setDataInput6((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['umur_piutang_3'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.umur_piutang_4}
                                                onChange={(value: any) => {
                                                    setDataInput6((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['umur_piutang_4'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="border">
                                            <InputRupiah
                                                readOnly={true}
                                                dataValue={data.piutang_bruto}
                                                onChange={(value: any) => {
                                                    setDataInput6((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['piutang_bruto'] = isNaN(value) ? 0 : value;
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
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.saldo_awal)}
                                        </div>
                                    </div>
                                </td>
                                <td className="border p-4">
                                    <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                        <div className="">
                                            Rp.
                                        </div>
                                        <div className="">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.koreksi_saldo_awal)}
                                        </div>
                                    </div>
                                </td>
                                <td className="border p-4">
                                    <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                        <div className="">
                                            Rp.
                                        </div>
                                        <div className="">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.mutasi_debet)}
                                        </div>
                                    </div>
                                </td>
                                <td className="border p-4">
                                    <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                        <div className="">
                                            Rp.
                                        </div>
                                        <div className="">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.mutasi_kredit)}
                                        </div>
                                    </div>
                                </td>
                                <td className="border p-4">
                                    <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                        <div className="">
                                            Rp.
                                        </div>
                                        <div className="">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.saldo_akhir)}
                                        </div>
                                    </div>
                                </td>
                                <td className="border p-4">
                                    <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                        <div className="">
                                            Rp.
                                        </div>
                                        <div className="">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.umur_piutang_1)}
                                        </div>
                                    </div>
                                </td>
                                <td className="border p-4">
                                    <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                        <div className="">
                                            Rp.
                                        </div>
                                        <div className="">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.umur_piutang_2)}
                                        </div>
                                    </div>
                                </td>
                                <td className="border p-4">
                                    <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                        <div className="">
                                            Rp.
                                        </div>
                                        <div className="">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.umur_piutang_3)}
                                        </div>
                                    </div>
                                </td>
                                <td className="border p-4">
                                    <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                        <div className="">
                                            Rp.
                                        </div>
                                        <div className="">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.umur_piutang_4)}
                                        </div>
                                    </div>
                                </td>
                                <td className="border p-4">
                                    <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                        <div className="">
                                            Rp.
                                        </div>
                                        <div className="">
                                            {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.piutang_bruto)}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>

            <div className="flex justify-between gap-4 items-center mt-4 px-5">
                <div className="flex items-center gap-2">
                    <label className="flex-none flex items-center gap-2 cursor-pointer select-none mb-0">
                        <div className="w-12 h-6 relative">
                            <input
                                type="checkbox"
                                className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                checked={selectedMode}
                                onChange={(e: any) => {
                                    if (e?.target?.checked == false) {
                                        setSelectedData([]);
                                    }
                                    setSelectedMode(e?.target?.checked);
                                }}
                            />
                            <span className="outline_checkbox border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:border-primary peer-checked:before:bg-primary before:transition-all before:duration-300"></span>
                        </div>
                        <div className="text-xs">
                            Hapus Mode {selectedData.length > 0 ? `(${selectedData.length}) Item` : ''}
                        </div>
                    </label>

                    {selectedData.length > 0 && (
                        <button type="button"
                            disabled={isSaving == true}
                            onClick={(e) => {
                                if (isSaving == false) {
                                    deleteSelectedData()
                                }
                            }}
                            className='btn btn-danger btn-sm text-xs w-full'>
                            <FontAwesomeIcon icon={faTrash} className='h-3 w-3 mr-1' />
                            Hapus
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center">
                        {(totalData) && (
                            <DownloadButtons
                                data={
                                    dataInput1.concat(dataInput2, dataInput3, dataInput4, dataInput5, dataInput6)
                                }
                                endpoint='/accountancy/download/excel'
                                uploadEndpoint='/accountancy/upload/excel'
                                params={{
                                    type: 'piutang',
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
                                            _getDatas(instance, year);
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
            </div>
        </>
    );
}

export default Piutang;

