import { NextPage } from 'next'
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import Select from 'react-select';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { Indonesian } from 'flatpickr/dist/l10n/id';
import { deletePengembalianBelanja, getPengembalianBelanja, storePengembalianBelanja } from '@/apis/Accountancy/PengembalianBelanja';
import InputRupiah from '@/components/InputRupiah';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import DownloadButtons from '@/components/Buttons/DownloadButtons';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import IconTrash from '@/components/Icon/IconTrash';

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

const PBListData = (data: any) => {
    const paramData = data.data
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [CurrentUser, setCurrentUser] = useState<any>([]);

    const [periode, setPeriode] = useState<any>({});
    const [arrKodeRekening, setArrKodeRekening] = useState<any>([]);
    const [arrInstance, setArrInstance] = useState<any>([]);
    const [instanceId, setInstanceId] = useState<any>(null);
    const [year, setYear] = useState<any>(null);
    const [years, setYears] = useState<any>(null)
    const [search, setSearch] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [maxPage, setMaxPage] = useState(1);
    const [totalData, setTotalData] = useState<any>({})

    const spmOptions = [
        {
            value: 'UP',
            label: 'UP',
        },
        {
            value: 'GU',
            label: 'GU',
        },
        {
            value: 'TU',
            label: 'TU',
        },
        {
            value: 'LS',
            label: 'LS',
        },
        {
            value: 'Nihil',
            label: 'Nihil',
        },
    ];

    const [isLoading, setIsLoading] = useState(false);
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (document.cookie) {
            let user = document.cookie.split(';').find((row) => row.trim().startsWith('user='))?.split('=')[1];
            user = user ? JSON.parse(user) : null;
            setCurrentUser(user);

            // let token = document.cookie.split(';').find((row) => row.trim().startsWith('token='))?.split('=')[1];
            // setCurrentToken(token);
        }
        setPeriode(paramData[2]);
        setYear(paramData[3]);
        // setYears(paramData[5]);
        let arrYears = [];
        for (let i = 2015; i <= new Date().getFullYear() + 1; i++) {
            arrYears.push({
                value: i,
                label: i
            });
        }
        arrYears = arrYears.reverse();
        setYears(arrYears);
    }, [isMounted]);

    // console.log('paramData', paramData);

    useEffect(() => {
        if (isMounted && paramData) {
            setPeriode(paramData[2] ? paramData[2] : {});
            setYear(paramData[3] ? paramData[3] : null);
            setInstanceId(paramData[4] ? paramData[4] : null);
            setArrKodeRekening(paramData[1] ? paramData[1] : []);
            if (paramData[0]?.length > 0) {
                setArrInstance(paramData[0]);
            }
        }
    }, [isMounted, paramData]);

    const [datas, setDatas] = useState<any>([]);
    const [datasOrigin, setDatasOrigin] = useState<any>([]);

    const _getDatas = () => {
        setIsLoading(true);
        getPengembalianBelanja(instanceId, periode.id, year, search, page)
            .then((res: any) => {
                if (res.status === 'success') {
                    if (res.data.datas.length > 0) {
                        setDatas(res.data.datas);
                        setDatasOrigin(res.data.datas);
                        const maxPage = Math.ceil(res.data.datas.length / perPage);
                        setMaxPage(maxPage);
                        setTotalData({
                            total_data: res.data.total_data,
                            total_jumlah: res.data.total_jumlah
                        });
                    } else {
                        setDatas([
                            {
                                id: '',
                                periode_id: periode.id,
                                year: year,
                                instance_id: instanceId,
                                // instance_id: 1,
                                tanggal_setor: '',
                                kode_rekening_id: '',
                                uraian: '',
                                jenis_spm: 'Nihil',
                                jumlah: 0,
                            }
                        ]);
                        setTotalData({
                            total_data: 0,
                            total_jumlah: 0,
                        });
                    }
                } else {
                    showAlert('error', res.message);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const handleSearch = (e: any) => {
        if (e.length > 0) {
            setSearch(e);
            const filteredData = datasOrigin.filter((item: any) => {
                return (
                    item.instance_name?.toLowerCase().includes(e.toLowerCase()) ||
                    item.tanggal_setor?.toLowerCase().includes(e.toLowerCase()) ||
                    item.kode_rekening_fullcode?.toLowerCase().includes(e.toLowerCase()) ||
                    item.kode_rekening_name?.toLowerCase().includes(e.toLowerCase()) ||
                    item.uraian?.toLowerCase().includes(e.toLowerCase()) ||
                    item.jenis_spm?.toLowerCase().includes(e.toLowerCase()) ||
                    item.jumlah?.toString().toLowerCase().includes(e.toLowerCase())
                );
            });
            setDatas(filteredData);
            setMaxPage(Math.ceil(filteredData.length / perPage));
            setPage(1);
        } else {
            setSearch(e);
            setDatas(datasOrigin);
            setMaxPage(Math.ceil(datasOrigin.length / perPage));
            setPage(1);
        }
    }

    useEffect(() => {
        if (isMounted && periode && year) {
            _getDatas();
        }
    }, [isMounted, periode, year, instanceId, page]);

    const addDataInput = () => {
        const newData = {
            id: '',
            periode_id: periode.id,
            year: year,
            instance_id: instanceId,
            // instance_id: 1,
            tanggal_setor: '',
            kode_rekening_id: '',
            uraian: '',
            jenis_spm: 'Nihil',
            jumlah: 0,
        }
        setDatas((prevData: any) => [...prevData, newData]);
        setIsUnsaved(true);
        setMaxPage(Math.ceil((datas.length + 1) / perPage));
        setPage(Math.ceil((datas.length + 1) / perPage));
    }

    const save = () => {
        setIsSaving(true);
        storePengembalianBelanja(datas, periode.id, year)
            .then((res: any) => {
                if (res.status == 'success') {
                    showAlert('success', 'Data berhasil disimpan');
                    setIsUnsaved(false);
                    setIsSaving(false);
                    _getDatas();
                } else {
                    showAlert('error', 'Data gagal disimpan');
                    setIsSaving(false);
                }
            })
    }

    const deleteData = (id: any) => {
        if (id) {
            deletePengembalianBelanja(id).then((res: any) => {
                if (res.status == 'success') {
                    _getDatas();
                    showAlert('success', 'Data berhasil dihapus');
                } else {
                    showAlert('error', 'Data gagal dihapus');
                }
            });
        } else {
            showAlert('error', 'Data gagal dihapus');
        }
    }

    useEffect(() => {
        if (isMounted && datas.length > 0) {
            setTotalData((prev: any) => {
                const updated = { ...prev };
                updated['total_jumlah'] = datas.reduce((acc: any, curr: any) => acc + parseFloat(curr.jumlah), 0);
                return updated;
            })
        }
    }, [isMounted, datas])

    // console.log(totalData);

    return (
        <>
            <div className="panel">
                <div className="table-responsive h-[calc(100vh-400px)] pb-5">
                    <table className="table-striped">
                        <thead>
                            <tr className='!bg-slate-900 !text-white left-0 sticky top-0 z-[1]'>
                                {/* <!-- Perangkat Daerah --> */}
                                <th className="whitespace-nowrap !py-3 !px-3 !text-center !w-[200px]">
                                    Perangkat Daerah
                                </th>
                                {/* Tanggal Setor */}
                                <th className="whitespace-nowrap !py-3 !px-3 !text-center !w-[150px]">
                                    Tanggal Setor
                                </th>
                                {/* Kode Rekening */}
                                <th className="whitespace-nowrap !py-3 !px-3 !text-center !w-[150px]">
                                    Kode Rekening
                                </th>
                                {/* Uraian */}
                                <th className="whitespace-nowrap !py-3 !px-3 !text-center !w-[300px]">
                                    Uraian
                                </th>
                                {/* Jenis SPM */}
                                <th className="whitespace-nowrap !py-3 !px-3 !text-center !w-[150px]">
                                    Jenis SPM
                                </th>
                                {/* Jumlah Pengembalian */}
                                <th className="whitespace-nowrap !py-3 !px-3 !text-center !w-[200px]">
                                    Jumlah Pengembalian
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center !py-5">
                                        <div className="flex flex-col items-center h-[calc(100vh-550px)] justify-center">
                                            <FontAwesomeIcon icon={faSpinner} className='h-8 w-8 animate-spin mb-2' />
                                            <div>Memuat data...</div>
                                        </div>
                                    </td>
                                </tr>
                            ) : null}

                            {isLoading == false && datas && datas.length > 0 && datas.map((data: any, index: number) => (
                                <tr key={index} className="odd:bg-white even:bg-slate-100">
                                    {/* Perangkat Daerah */}
                                    <td className="whitespace-nowrap !py-2 !px-3 !text-left">
                                        <div className="flex gap-2 items-center">
                                            <Select placeholder="Pilih Perangkat Daerah"
                                                className='w-[300px]'
                                                onChange={(e: any) => {
                                                    if ([9].includes(CurrentUser?.role_id)) {
                                                        showAlert('error', 'Anda tidak memiliki akses ke Perangkat Daerah ini');
                                                    } else {
                                                        // console.log(e.value);
                                                        setDatas((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['instance_id'] = e?.value;
                                                            return updated;
                                                        })
                                                        console.log('datas', datas);
                                                        setIsUnsaved(true);
                                                    }
                                                }}
                                                isDisabled={[9].includes(CurrentUser?.role_id) ? true : ((isSaving == true) || instanceId ? true : false)}
                                                required={true}
                                                value={
                                                    arrInstance?.map((item: any, index: number) => {
                                                        if (item.id == data.instance_id) {
                                                            return {
                                                                value: item.id,
                                                                label: item.name,
                                                            }
                                                        }
                                                    })
                                                }
                                                options={
                                                    arrInstance?.map((item: any, index: number) => {
                                                        return {
                                                            value: item.id,
                                                            label: item.name,
                                                        }
                                                    })
                                                } />


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
                                                                        if (data.id) {
                                                                            deleteData(data.id);
                                                                        } else {
                                                                            setDatas((prev: any) => {
                                                                                const updated = [...prev];
                                                                                updated.splice(index, 1);
                                                                                return updated;
                                                                            });
                                                                        }
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
                                        </div>
                                    </td>
                                    {/* Tanggal Setor */}
                                    <td className="whitespace-nowrap !py-2 !px-3">
                                        <Flatpickr
                                            placeholder='Pilih Tanggal Setor'
                                            options={{
                                                dateFormat: 'Y-m-d',
                                                position: 'auto right',
                                                locale: Indonesian
                                            }}
                                            className="form-input w-[250px] placeholder:font-normal"
                                            value={data?.tanggal_setor}
                                            onChange={(date) => {
                                                let Ymd = new Date(date[0].toISOString());
                                                Ymd.setDate(Ymd.getDate() + 1);
                                                const newYmd = Ymd.toISOString().split('T')[0];
                                                setDatas((prev: any) => {
                                                    const updated = [...prev];
                                                    updated[index]['tanggal_setor'] = newYmd;
                                                    return updated;
                                                })
                                                setIsUnsaved(true);
                                            }} />
                                    </td>
                                    {/* Kode Rekening */}
                                    <td className="whitespace-nowrap !py-2 !px-3">
                                        {/* Kode Rekening */}
                                        <Select placeholder="Pilih Kode Rekening"
                                            className='min-w-[400px]'
                                            onChange={(e: any) => {
                                                setDatas((prev: any) => {
                                                    const updated = [...prev];
                                                    updated[index]['kode_rekening_id'] = e?.value;
                                                    // updated[index]['kode_rekening_nama'] = arrKodeRekening?.filter((data: any, index: number) => data?.id === e.value)[0].name
                                                    return updated;
                                                })
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
                                    </td>
                                    {/* Uraian */}
                                    <td className="whitespace-nowrap !py-2 !px-3 !text-left">
                                        <div className="flex">
                                            <input
                                                disabled={isSaving == true}
                                                type="text"
                                                placeholder="Nama Barang / Pekerjaan"
                                                className="form-input min-w-[250px] placeholder:font-normal"
                                                value={data.uraian}
                                                onChange={(e: any) => {
                                                    setDatas((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['uraian'] = e?.target?.value;
                                                        return updated;
                                                    })
                                                }}
                                            />
                                        </div>
                                    </td>
                                    {/* Jenis SPM */}
                                    <td className="whitespace-nowrap !py-2 !px-3">
                                        {/* select2 SPD Options */}
                                        <Select placeholder="Pilih Jenis SPM"
                                            className='min-w-[200px]'
                                            onChange={(e: any) => {
                                                setDatas((prev: any) => {
                                                    const updated = [...prev];
                                                    updated[index]['jenis_spm'] = e?.value;
                                                    // updated[index]['kode_rekening_nama'] = arrKodeRekening?.filter((data: any, index: number) => data?.id === e.value)[0].name
                                                    return updated;
                                                })
                                            }}
                                            value={
                                                spmOptions?.map((item: any, index: number) => {
                                                    if (item.value == data.jenis_spm) {
                                                        return {
                                                            value: item.value,
                                                            label: item.label,
                                                        }
                                                    }
                                                })
                                            }
                                            options={
                                                spmOptions?.map((item: any, index: number) => {
                                                    return {
                                                        value: item.value,
                                                        label: item.label,
                                                    }
                                                })
                                            } />

                                    </td>
                                    {/* Jumlah Pengembalian */}
                                    <td className="whitespace-nowrap !py-2 !px-3 !text-right">
                                        <InputRupiah
                                            isDisabled={isSaving == true}
                                            // readOnly={true}
                                            dataValue={data.jumlah}
                                            onChange={(value: any) => {
                                                setDatas((prev: any) => {
                                                    const updated = [...prev];
                                                    updated[index]['jumlah'] = value;
                                                    return updated;
                                                });
                                                setIsUnsaved(true);
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {isLoading == false && (
                            <tfoot>
                                <tr>
                                    <td colSpan={5} className='p-4 text-end !bg-slate-300 font-semibold'>
                                        Total : {totalData.total_data} Data
                                    </td>
                                    <td colSpan={1} className='p-4 text-end !bg-slate-300 font-semibold'>
                                        Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(totalData?.total_jumlah)}
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
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
                                type="search"
                                className="form-input text-xs min-w-1 py-1.5 px-2"
                                placeholder="Pencarian"
                                value={search}
                                onChange={(e: any) => {
                                    handleSearch(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 items-center">
                        {datas.length > 0 && (
                            <>
                                <DownloadButtons
                                    data={datas}
                                    endpoint='/accountancy/download/excel'
                                    // uploadEndpoint='/accountancy/upload/excel'
                                    params={{
                                        type: 'pengembalian-belanja',
                                        category: 'pengembalian-belanja',
                                        instance: instanceId,
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
            </div>
        </>
    )
}

export default PBListData
