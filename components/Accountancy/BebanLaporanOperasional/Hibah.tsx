import Select from 'react-select';
import { faChevronLeft, faChevronRight, faPlus, faRecycle, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
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
import { calculateData, deleteHibah, getHibah, storeHibah } from '@/apis/Accountancy/BebanLaporanOperasional';
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

const Hibah = (data: any) => {
    const paramData = data.data
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null)
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [maxPage, setMaxPage] = useState(1);

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
    const [dataInputOrigin, setDataInputOrigin] = useState<any>([]);
    const [search, setSearch] = useState<any>('');
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const _getDatas = () => {
        if (periode?.id) {
            getHibah(instance, periode?.id, year).then((res: any) => {
                if (res.status == 'success') {
                    if (res.data.length > 0) {
                        setDataInput(res.data);
                        setDataInputOrigin(res.data);
                        const maxPage = Math.ceil(res.data.length / perPage);
                        setMaxPage(maxPage);
                    } else {
                        setDataInput([
                            {
                                id: '',
                                instance_id: instance ?? '',
                                kode_rekening_id: '',
                                realisasi_belanja: 0,
                                saldo_awal: 0,
                                belanja_dibayar_dimuka_akhir: 0,
                                hutang: 0,
                                hibah: 0,
                                reklas_tambah_dari_rekening: 0,
                                reklas_tambah_dari_modal: 0,
                                plus_jukor: 0,
                                saldo_akhir: 0,
                                beban_tahun_lalu: 0,
                                belanja_dibayar_dimuka_awal: 0,
                                pembayaran_hutang: 0,
                                reklas_kurang_ke_rekening: 0,
                                reklas_kurang_ke_aset: 0,
                                atribusi: 0,
                                min_jukor: 0,
                                beban_lo: 0,
                                plus_total: 0,
                                min_total: 0,
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
        realisasi_belanja: 0,
        saldo_awal: 0,
        belanja_dibayar_dimuka_akhir: 0,
        hutang: 0,
        hibah: 0,
        reklas_tambah_dari_rekening: 0,
        reklas_tambah_dari_modal: 0,
        plus_jukor: 0,
        saldo_akhir: 0,
        beban_tahun_lalu: 0,
        belanja_dibayar_dimuka_awal: 0,
        pembayaran_hutang: 0,
        reklas_kurang_ke_rekening: 0,
        reklas_kurang_ke_aset: 0,
        atribusi: 0,
        min_jukor: 0,
        beban_lo: 0,
        plus_total: 0,
        min_total: 0,
    });

    const addDataInput = () => {
        const newData = {
            id: '',
            instance_id: instance ?? '',
            kode_rekening_id: '',
            realisasi_belanja: 0,
            saldo_awal: 0,
            belanja_dibayar_dimuka_akhir: 0,
            hutang: 0,
            hibah: 0,
            reklas_tambah_dari_rekening: 0,
            reklas_tambah_dari_modal: 0,
            plus_jukor: 0,
            saldo_akhir: 0,
            beban_tahun_lalu: 0,
            belanja_dibayar_dimuka_awal: 0,
            pembayaran_hutang: 0,
            reklas_kurang_ke_rekening: 0,
            reklas_kurang_ke_aset: 0,
            atribusi: 0,
            min_jukor: 0,
            beban_lo: 0,
            plus_total: 0,
            min_total: 0,
        }
        setDataInput((prevData: any) => [...prevData, newData]);
        setIsUnsaved(true);
        setMaxPage(Math.ceil((dataInput.length + 1) / perPage));
        setPage(Math.ceil((dataInput.length + 1) / perPage));
    }

    const updatedData = (data: any, index: number) => {
        setDataInput((prev: any) => {
            const updated = [...prev];

            const keysToSumPlus = ['saldo_awal', 'belanja_dibayar_dimuka_akhir', 'hutang', 'hibah', 'reklas_tambah_dari_rekening', 'reklas_tambah_dari_modal', 'plus_jukor'];
            const sumPlus = keysToSumPlus.reduce((acc: any, key: any) => acc + (parseFloat(updated[index][key]) || 0), 0);
            updated[index]['plus_total'] = sumPlus;

            const keysToSumMinus = ['saldo_akhir', 'beban_tahun_lalu', 'belanja_dibayar_dimuka_awal', 'pembayaran_hutang', 'reklas_kurang_ke_rekening', 'reklas_kurang_ke_aset', 'atribusi', 'min_jukor'];
            const sumMinus = keysToSumMinus.reduce((acc: any, key: any) => acc + (parseFloat(updated[index][key]) || 0), 0);
            updated[index]['min_total'] = sumMinus;

            updated[index].beban_lo = (updated[index].realisasi_belanja + sumPlus) - sumMinus;
            return updated;
        })
        setIsUnsaved(true);
    }

    useEffect(() => {
        if (isMounted && dataInput.length > 0) {
            setTotalData((prev: any) => {
                const updated = { ...prev };

                updated['realisasi_belanja'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['realisasi_belanja']), 0);
                updated['saldo_awal'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['saldo_awal']), 0);
                updated['belanja_dibayar_dimuka_akhir'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['belanja_dibayar_dimuka_akhir']), 0);
                updated['hutang'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['hutang']), 0);
                updated['hibah'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['hibah']), 0);
                updated['reklas_tambah_dari_rekening'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['reklas_tambah_dari_rekening']), 0);
                updated['reklas_tambah_dari_modal'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['reklas_tambah_dari_modal']), 0);
                updated['plus_jukor'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['plus_jukor']), 0);
                updated['plus_total'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['plus_total']), 0);

                updated['saldo_akhir'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['saldo_akhir']), 0);
                updated['beban_tahun_lalu'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['beban_tahun_lalu']), 0);
                updated['belanja_dibayar_dimuka_awal'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['belanja_dibayar_dimuka_awal']), 0);
                updated['pembayaran_hutang'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['pembayaran_hutang']), 0);
                updated['reklas_kurang_ke_rekening'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['reklas_kurang_ke_rekening']), 0);
                updated['reklas_kurang_ke_aset'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['reklas_kurang_ke_aset']), 0);
                updated['atribusi'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['atribusi']), 0);
                updated['min_jukor'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['min_jukor']), 0);
                updated['beban_lo'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['beban_lo']), 0);
                updated['min_total'] = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['min_total']), 0);
                return updated;
            })
        }
    }, [isMounted, dataInput])


    const save = () => {
        setIsSaving(true);
        storeHibah(dataInput, periode?.id, year).then((res: any) => {
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
        deleteHibah(id).then((res: any) => {
            if (res.status == 'success') {
                _getDatas();
                showAlert('success', 'Data berhasil dihapus');
            } else {
                showAlert('error', 'Data gagal dihapus');
            }
        });
    }

    const handleSearch = (e: any) => {
        if (e.length > 0) {
            setSearch(e);
            const filteredData = dataInputOrigin.filter((item: any) => {
                return (
                    item.kode_rekening_fullcode?.toLowerCase().includes(e.toLowerCase()) ||
                    item.kode_rekening_name?.toLowerCase().includes(e.toLowerCase())
                );
            });
            setDataInput(filteredData);
            setMaxPage(Math.ceil(filteredData.length / perPage));
            setPage(1);
        } else {
            setSearch(e);
            setDataInput(dataInputOrigin);
            setMaxPage(Math.ceil(dataInputOrigin.length / perPage));
            setPage(1);
        }
    }

    const [isLoadingCalculate, setIsLoadingCalculate] = useState(false);
    const handleCalculate = () => {
        setIsLoadingCalculate(true);
        calculateData(periode?.id, year, 'hibah').then((res: any) => {
            if (res.status == 'success') {
                showAlert('success', 'Perhitungan selesai');
                _getDatas();
            } else {
                showAlert('error', 'Perhitungan gagal');
            }
            setIsLoadingCalculate(false);
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
                                Nomor Rekening
                            </th>
                            <th rowSpan={2} className="bg-slate-900 border text-center text-white left-0 min-w-[200px] sticky top-0 whitespace-nowrap z-[1]">
                                Nama Rekening
                            </th>
                            <th rowSpan={2} className="bg-slate-900 border text-center text-white min-w-[200px] whitespace-nowrap">
                                Realisasi Belanja
                            </th>
                            <th rowSpan={1} colSpan={8} className="bg-yellow-300 border border-slate-900 text-center text-slate-900 whitespace-nowrap">
                                Mutasi Tambah
                            </th>
                            <th rowSpan={1} colSpan={9} className="bg-green-300 border border-slate-900 text-center text-slate-900 whitespace-nowrap">
                                Mutasi Kurang
                            </th>
                            <th rowSpan={2} className="bg-slate-900 border text-center text-white min-w-[200px] whitespace-nowrap">
                                Beban LO
                            </th>
                        </tr>
                        <tr className='sticky top-[46px] z-[0]'>
                            <th className="bg-yellow-300 border border-slate-900 text-center min-w-[200px]">
                                Saldo Awal {year}
                            </th>
                            <th className="bg-yellow-300 border border-slate-900 text-center min-w-[200px]">
                                Belanja Dibayar Dimuka Akhir
                            </th>
                            <th className="bg-yellow-300 border border-slate-900 text-center min-w-[200px]">
                                Hutang {year}
                            </th>
                            <th className="bg-yellow-300 border border-slate-900 text-center min-w-[200px]">
                                Hibah Masuk
                            </th>
                            <th className="bg-yellow-300 border border-slate-900 text-center min-w-[200px]">
                                Reklas Tambah dari Rekening Lain/BOS
                            </th>
                            <th className="bg-yellow-300 border border-slate-900 text-center min-w-[200px]">
                                Reklas Tambah dari Modal
                            </th>
                            <th className="bg-yellow-300 border border-slate-900 text-center min-w-[200px]">
                                Jukor
                            </th>
                            <th className="bg-yellow-300 border border-slate-900 text-center min-w-[200px]">
                                Jumlah
                            </th>

                            <th className="bg-green-300 border border-slate-900 text-center min-w-[200px]">
                                Saldo Akhir {year - 1}
                            </th>
                            <th className="bg-green-300 border border-slate-900 text-center min-w-[200px]">
                                Beban Tahun Lalu Dibayar {year - 1}
                            </th>
                            <th className="bg-green-300 border border-slate-900 text-center min-w-[200px]">
                                Belanja Dibayar Dimuka Awal
                            </th>
                            <th className="bg-green-300 border border-slate-900 text-center min-w-[200px]">
                                Pembayaran Hutang
                            </th>
                            <th className="bg-green-300 border border-slate-900 text-center min-w-[200px]">
                                Reklas Kurang ke Rekening Lain
                            </th>
                            <th className="bg-green-300 border border-slate-900 text-center min-w-[200px]">
                                Reklas Kurang ke Aset
                            </th>
                            <th className="bg-green-300 border border-slate-900 text-center min-w-[200px]">
                                Atribusi / Kapitalisasi Belanja Modal
                            </th>
                            <th className="bg-green-300 border border-slate-900 text-center min-w-[200px]">
                                Jukor
                            </th>
                            <th className="bg-green-300 border border-slate-900 text-center min-w-[200px]">
                                Jumlah
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataInput.map((data: any, index: any) => (
                            <>
                                {(index >= (page - 1) * perPage && index < (page * perPage)) && (
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
                                                                setDataInput((prev: any) => {
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
                                            <div className="flex gap-2 items-center">
                                                <Select placeholder="Pilih Kode Rekening"
                                                    className='min-w-[400px]'
                                                    classNamePrefix={'selectAngga'}
                                                    isDisabled={isSaving == true ? true : data.kode_rekening_id ? true : false}
                                                    onChange={(e: any) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['kode_rekening_id'] = e?.value;
                                                            return updated;
                                                        })
                                                        setIsUnsaved(true);
                                                    }}
                                                    value={
                                                        arrKodeRekening?.map((item: any, index: number) => {
                                                            if (item.id == data.kode_rekening_id) {
                                                                return {
                                                                    value: item.id,
                                                                    label: item.fullcode + ' - ' + item.name,
                                                                }
                                                            }
                                                        })
                                                    }
                                                    options={
                                                        arrKodeRekening?.map((item: any, index: number) => {
                                                            return {
                                                                value: item.id,
                                                                label: item.fullcode + ' - ' + item.name,
                                                            }
                                                        })
                                                    } />


                                                {data?.id && (
                                                    <div className="hidden">
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
                                        <td className="bg-slate-50 border dark:bg-slate-900 left-0 sticky z-[0]">
                                            <div className="font-semibold min-w-[300px] whitespace-normal">
                                                {data.kode_rekening_id ? (
                                                    <>
                                                        <div>
                                                            {arrKodeRekening?.map((item: any, index: number) => {
                                                                if (item.id == data.kode_rekening_id) {
                                                                    return item.fullcode;
                                                                }
                                                            })}
                                                        </div>
                                                        <div>
                                                            {arrKodeRekening?.map((item: any, index: number) => {
                                                                if (item.id == data.kode_rekening_id) {
                                                                    return item.name;
                                                                }
                                                            })}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="text-center text-red-500">Pilih Kode Rekening</div>
                                                    </>
                                                )}
                                            </div>
                                        </td>

                                        <td className="border">
                                            <InputRupiah
                                                dataValue={data.realisasi_belanja}
                                                readOnly={true}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['realisasi_belanja'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>

                                        <td className="bg-yellow-300 border border-slate-900">
                                            <InputRupiah
                                                dataValue={data.saldo_awal}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['saldo_awal'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="bg-yellow-300 border border-slate-900">
                                            <InputRupiah
                                                dataValue={data.belanja_dibayar_dimuka_akhir}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['belanja_dibayar_dimuka_akhir'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="bg-yellow-300 border border-slate-900">
                                            <InputRupiah
                                                readOnly={true}
                                                dataValue={data.hutang}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['hutang'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="bg-yellow-300 border border-slate-900">
                                            <InputRupiah
                                                dataValue={data.hibah}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['hibah'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="bg-yellow-300 border border-slate-900">
                                            <InputRupiah
                                                dataValue={data.reklas_tambah_dari_rekening}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['reklas_tambah_dari_rekening'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="bg-yellow-300 border border-slate-900">
                                            <InputRupiah
                                                dataValue={data.reklas_tambah_dari_modal}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['reklas_tambah_dari_modal'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="bg-yellow-300 border border-slate-900">
                                            <InputRupiah
                                                dataValue={data.plus_jukor}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['plus_jukor'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="bg-yellow-300 border border-slate-900">
                                            <InputRupiah
                                                readOnly={true}
                                                dataValue={data.plus_total}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['plus_total'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>

                                        <td className="bg-green-300 border border-slate-900">
                                            <InputRupiah
                                                dataValue={data.saldo_akhir}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['saldo_akhir'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="bg-green-300 border border-slate-900">
                                            <InputRupiah
                                                dataValue={data.beban_tahun_lalu}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['beban_tahun_lalu'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="bg-green-300 border border-slate-900">
                                            <InputRupiah
                                                dataValue={data.belanja_dibayar_dimuka_awal}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['belanja_dibayar_dimuka_awal'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="bg-green-300 border border-slate-900">
                                            <InputRupiah
                                                dataValue={data.pembayaran_hutang}
                                                readOnly={true}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['pembayaran_hutang'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="bg-green-300 border border-slate-900">
                                            <InputRupiah
                                                dataValue={data.reklas_kurang_ke_rekening}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['reklas_kurang_ke_rekening'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="bg-green-300 border border-slate-900">
                                            <InputRupiah
                                                dataValue={data.reklas_kurang_ke_aset}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['reklas_kurang_ke_aset'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="bg-green-300 border border-slate-900">
                                            <InputRupiah
                                                dataValue={data.atribusi}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['atribusi'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="bg-green-300 border border-slate-900">
                                            <InputRupiah
                                                dataValue={data.min_jukor}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['min_jukor'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>
                                        <td className="bg-green-300 border border-slate-900">
                                            <InputRupiah
                                                readOnly={true}
                                                dataValue={data.min_total}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['min_total'] = isNaN(value) ? 0 : value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                }} />
                                        </td>

                                        <td className="border">
                                            <div className="flex group">
                                                <div className="flex bg-[#eee] border border-white-light justify-center dark:bg-[#1b2e4b] dark:border-[#17263c] font-semibold items-center ltr:border-r-0 ltr:rounded-l-md px-3 rtl:border-l-0 rtl:rounded-r-md">
                                                    Rp.
                                                </div>
                                                <div className="form-input bg-slate-200 text-end w-[250px] font-semibold ltr:rounded-l-none rtl:rounded-r-none">
                                                    {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(data.beban_lo)}
                                                </div>
                                            </div>
                                        </td>

                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className='border p-4'></td>
                            <td className='border p-4'></td>
                            <td className="bg-slate-50 border p-4 dark:bg-slate-900 left-0 sticky z-[0]">
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
                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.realisasi_belanja)}
                                    </div>
                                </div>
                            </td>
                            <td className="bg-yellow-300 border border-slate-900 p-4">
                                <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                    <div className="">
                                        Rp.
                                    </div>
                                    <div className="">
                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.saldo_awal)}
                                    </div>
                                </div>
                            </td>
                            <td className="bg-yellow-300 border border-slate-900 p-4">
                                <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                    <div className="">
                                        Rp.
                                    </div>
                                    <div className="">
                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.belanja_dibayar_dimuka_akhir)}
                                    </div>
                                </div>
                            </td>
                            <td className="bg-yellow-300 border border-slate-900 p-4">
                                <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                    <div className="">
                                        Rp.
                                    </div>
                                    <div className="">
                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.hutang)}
                                    </div>
                                </div>
                            </td>
                            <td className="bg-yellow-300 border border-slate-900 p-4">
                                <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                    <div className="">
                                        Rp.
                                    </div>
                                    <div className="">
                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.hibah)}
                                    </div>
                                </div>
                            </td>
                            <td className="bg-yellow-300 border border-slate-900 p-4">
                                <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                    <div className="">
                                        Rp.
                                    </div>
                                    <div className="">
                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.reklas_tambah_dari_rekening)}
                                    </div>
                                </div>
                            </td>
                            <td className="bg-yellow-300 border border-slate-900 p-4">
                                <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                    <div className="">
                                        Rp.
                                    </div>
                                    <div className="">
                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.reklas_tambah_dari_modal)}
                                    </div>
                                </div>
                            </td>
                            <td className="bg-yellow-300 border border-slate-900 p-4">
                                <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                    <div className="">
                                        Rp.
                                    </div>
                                    <div className="">
                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.plus_jukor)}
                                    </div>
                                </div>
                            </td>
                            <td className="bg-yellow-300 border border-slate-900 p-4">
                                <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                    <div className="">
                                        Rp.
                                    </div>
                                    <div className="">
                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.plus_total)}
                                    </div>
                                </div>
                            </td>

                            <td className="bg-green-300 border border-slate-900 p-4">
                                <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                    <div className="">
                                        Rp.
                                    </div>
                                    <div className="">
                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.saldo_akhir)}
                                    </div>
                                </div>
                            </td>
                            <td className="bg-green-300 border border-slate-900 p-4">
                                <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                    <div className="">
                                        Rp.
                                    </div>
                                    <div className="">
                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.beban_tahun_lalu)}
                                    </div>
                                </div>
                            </td>
                            <td className="bg-green-300 border border-slate-900 p-4">
                                <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                    <div className="">
                                        Rp.
                                    </div>
                                    <div className="">
                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.belanja_dibayar_dimuka_awal)}
                                    </div>
                                </div>
                            </td>
                            <td className="bg-green-300 border border-slate-900 p-4">
                                <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                    <div className="">
                                        Rp.
                                    </div>
                                    <div className="">
                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.pembayaran_hutang)}
                                    </div>
                                </div>
                            </td>
                            <td className="bg-green-300 border border-slate-900 p-4">
                                <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                    <div className="">
                                        Rp.
                                    </div>
                                    <div className="">
                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.reklas_kurang_ke_rekening)}
                                    </div>
                                </div>
                            </td>
                            <td className="bg-green-300 border border-slate-900 p-4">
                                <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                    <div className="">
                                        Rp.
                                    </div>
                                    <div className="">
                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.reklas_kurang_ke_aset)}
                                    </div>
                                </div>
                            </td>
                            <td className="bg-green-300 border border-slate-900 p-4">
                                <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                    <div className="">
                                        Rp.
                                    </div>
                                    <div className="">
                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.atribusi)}
                                    </div>
                                </div>
                            </td>
                            <td className="bg-green-300 border border-slate-900 p-4">
                                <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                    <div className="">
                                        Rp.
                                    </div>
                                    <div className="">
                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.min_jukor)}
                                    </div>
                                </div>
                            </td>
                            <td className="bg-green-300 border border-slate-900 p-4">
                                <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                    <div className="">
                                        Rp.
                                    </div>
                                    <div className="">
                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.min_total)}
                                    </div>
                                </div>
                            </td>

                            <td className="border border-slate-900 p-4">
                                <div className="flex justify-between text-end font-semibold whitespace-nowrap">
                                    <div className="">
                                        Rp.
                                    </div>
                                    <div className="">
                                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData.beban_lo)}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table >
            </div>

            <div className="flex justify-between gap-4 items-center mt-4 px-5">
                <div className="flex gap-2 items-center">
                    <button type="button"
                        onClick={(e) => {
                            if (page > 1) {
                                setPage(page - 1);
                            }
                        }}
                        disabled={page == 1}
                        className='btn btn-primary text-xs whitespace-nowrap'>
                        <FontAwesomeIcon icon={faChevronLeft} className='h-3 w-3 mr-1' />
                    </button>

                    <div className="flex align-center justify-center gap-1">
                        <input
                            type="number"
                            className="form-input text-center min-w-1 px-1 py-0"
                            value={page}
                            onChange={(e: any) => {
                                const value = e.target.value;
                                if (value < 1) {
                                    setPage(1);
                                } else if (value > maxPage) {
                                    setPage(maxPage);
                                }
                                else {
                                    setPage(parseInt(e.target.value));
                                }
                            }}
                            onFocus={(e) => e.target.select()}
                            onClick={(e: any) => e.target.select()}
                            min={1}
                            max={maxPage} />
                        <div>
                            <input
                                type="text"
                                className="form-input text-center min-w-1 px-1 py-0"
                                value={'/ ' + maxPage}
                                readOnly={true}
                                min={1}
                                max={maxPage} />
                        </div>
                    </div>

                    <button type="button"
                        onClick={(e) => {
                            if (page < maxPage) {
                                setPage(page + 1);
                            }
                        }}
                        disabled={page == maxPage}
                        className='btn btn-primary text-xs whitespace-nowrap'>
                        <FontAwesomeIcon icon={faChevronRight} className='h-3 w-3 mr-1' />
                    </button>

                    <div className="">
                        <input
                            type="text"
                            className="form-input text-xs min-w-1 py-1.5 px-2"
                            placeholder="Pencarian"
                            value={search}
                            onChange={(e: any) => {
                                handleSearch(e.target.value);
                            }} />
                    </div>
                </div>
                <div className="flex justify-end gap-4 items-center">
                    {dataInput.length > 0 && (
                        <button type="button"
                            onClick={(e) => {
                                if (isLoadingCalculate) return;
                                Swal.fire({
                                    title: 'Kalibrasi Data?',
                                    text: "Aksi ini akan mengkalibrasi data yang sudah ada, apakah anda yakin?",
                                    icon: 'warning',
                                    showCancelButton: true,
                                    cancelButtonText: 'Batal',
                                    confirmButtonText: 'Ya, Lanjutkan',
                                    confirmButtonColor: '#00ab55',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        handleCalculate();
                                    }
                                });
                            }}
                            className='btn btn-secondary text-xs whitespace-nowrap'>
                            <FontAwesomeIcon icon={faRecycle} className='h-3 w-3 mr-1' />
                            {isLoadingCalculate ? 'Menghitung...' : 'Kalibrasi Data'}
                        </button>
                    )}
                    {(dataInput.length > 0) && (
                        <DownloadButtons
                            data={dataInput}
                            endpoint='/accountancy/download/excel'
                            params={{
                                // type: instance ? 'hibah' : 'hibah_kab',
                                type: 'hibah',
                                category: 'beban_lo',
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
                    {(dataInput.length > 0 && instance) && (
                        <>
                            <button type="button"
                                disabled={isSaving == true}
                                onClick={(e) => {
                                    if (isSaving == false) {
                                        addDataInput()
                                    }
                                }}
                                className='btn btn-primary text-xs whitespace-nowrap'>
                                <FontAwesomeIcon icon={faPlus} className='h-3 w-3 mr-1' />
                                Tambah Data
                            </button>

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

export default Hibah;

