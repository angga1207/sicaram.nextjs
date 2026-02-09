import Select from 'react-select';
import { faChevronLeft, faChevronRight, faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import IconTrash from '@/components/Icon/IconTrash';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { deleteBarangHabisPakai, getBarangHabisPakai, storeBarangHabisPakai } from '@/apis/Accountancy/Persediaan';
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

const BarangHabisPakai = (data: any) => {
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
    const [dataInputOrigin, setDataInputOrigin] = useState<any>([]);
    const [search, setSearch] = useState<any>('');
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const _getDatas = () => {
        if (periode?.id) {
            getBarangHabisPakai(instance, periode?.id, year).then((res: any) => {
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

                                nama_persediaan: '',
                                saldo_awal: 0,
                                kode_rekening_id: '',
                                realisasi_lra: 0,
                                hutang_belanja: 0,
                                perolehan_hibah: 0,
                                saldo_akhir: 0,
                                beban_persediaan: 0,
                            }
                        ]);
                    }
                }
            });
        }
    }

    const addDataInput = () => {
        const newData = {
            id: '',
            instance_id: instance ?? '',

            nama_persediaan: '',
            saldo_awal: 0,
            kode_rekening_id: '',
            realisasi_lra: 0,
            hutang_belanja: 0,
            perolehan_hibah: 0,
            saldo_akhir: 0,
            beban_persediaan: 0,
        }
        setDataInput((prevData: any) => [...prevData, newData]);
        setIsUnsaved(true);
        setMaxPage(Math.ceil((dataInput.length + 1) / perPage));
        setPage(Math.ceil((dataInput.length + 1) / perPage));
    }

    const [totalData, setTotalData] = useState<any>({
        total_data: 0,
        saldo_awal: 0,
        realisasi_lra: 0,
        hutang_belanja: 0,
        perolehan_hibah: 0,
        saldo_akhir: 0,
        beban_persediaan: 0,
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

    const updatedData = (data: any, index: number) => {
        setDataInput((prev: any) => {
            const updated = [...prev];
            updated[index].beban_persediaan = parseFloat(updated[index].saldo_awal ?? 0) + parseFloat(updated[index].realisasi_lra ?? 0) + parseFloat(updated[index].hutang_belanja ?? 0) + parseFloat(updated[index].perolehan_hibah ?? 0) - parseFloat(updated[index].saldo_akhir ?? 0);
            return updated;
        })
        setIsUnsaved(true);
    }

    useEffect(() => {
        if (isMounted && dataInput.length > 0) {
            setTotalData((prev: any) => {
                const updated = { ...prev };
                updated.total_data = dataInput.length;
                updated.saldo_awal = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['saldo_awal']), 0);
                updated.realisasi_lra = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['realisasi_lra']), 0);
                updated.hutang_belanja = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['hutang_belanja']), 0);
                updated.perolehan_hibah = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['perolehan_hibah']), 0);
                updated.saldo_akhir = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['saldo_akhir']), 0);
                updated.beban_persediaan = dataInput.reduce((acc: any, obj: any) => acc + parseFloat(obj['beban_persediaan']), 0);
                return updated;
            })
        }
    }, [isMounted, dataInput])

    const save = () => {
        setIsSaving(true);
        // console.log(dataInput);
        storeBarangHabisPakai(dataInput, periode?.id, year).then((res: any) => {
            if (res.status == 'error validation') {
                showAlert('error', 'Perangkat Daerah dan Nama Persediaan tidak boleh kosong');
                setIsSaving(false);
            } else if (res.status == 'success') {
                showAlert('success', 'Data berhasil disimpan');
                setIsUnsaved(false);
                setIsSaving(false);
                _getDatas();
            } else {
                showAlert('error', 'Data gagal disimpan');
                setIsSaving(false);
            }
        });
    }

    const deleteData = (id: any) => {
        deleteBarangHabisPakai(id).then((res: any) => {
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
                    item.instance_name?.toLowerCase().includes(e.toLowerCase()) ||
                    item.kode_rekening_fullcode?.toLowerCase().includes(e.toLowerCase()) ||
                    item.kode_rekening_name?.toLowerCase().includes(e.toLowerCase()) ||
                    item.nama_persediaan?.toLowerCase().includes(e.toLowerCase())
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

    return (
        <>
            <div className="table-responsive h-[calc(100vh-420px)] pb-5">
                <table className="table-striped">
                    <thead>
                        <tr className='!bg-slate-900 !text-white left-0 sticky top-0 z-[1]'>
                            <th rowSpan={2} className='border text-center whitespace-nowrap'>
                                Nama Perangkat Daerah
                            </th>
                            <th rowSpan={2} className='border text-center whitespace-nowrap'>
                                Nama Persediaan
                            </th>
                            <th rowSpan={2} className='border text-center whitespace-nowrap'>
                                Saldo Awal {year} (Saldo Akhir {year - 1})
                            </th>
                            <th colSpan={4} className='border text-center whitespace-nowrap'>
                                Mutasi Penambahan Beban {year} (Belanja {year})
                            </th>
                            <th rowSpan={2} className='border text-center whitespace-nowrap'>
                                Saldo Akhir {year}
                            </th>
                            <th rowSpan={2} className='border text-center !max-w-[250px] whitespace-nowrap'>
                                Beban Persediaan
                                <div className='text-xs !whitespace-normal'>
                                    (Saldo Awal + Realisasi LRA + Hutang Belanja + Perolehan Hibah - Saldo Akhir)
                                </div>
                            </th>
                        </tr>
                        <tr className='!bg-slate-900 !text-white left-0 sticky top-[45px] z-[1]'>
                            <th className='border text-center whitespace-nowrap'>
                                Kode Rekening
                            </th>
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
                        {dataInput?.map((data: any, index: any) => (
                            <>
                                {(index >= (page - 1) * perPage && index < (page * perPage)) && (
                                    <tr>
                                        <td className='border'>
                                            {/* Perangkat Daerah */}
                                            <div className="flex gap-2 items-center">
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
                                                    required={true}
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
                                        <td className='border'>
                                            <div className="flex gap-2 items-center">
                                                <input type="text"
                                                    placeholder='Nama Persediaan'
                                                    autoComplete='off'
                                                    value={data.nama_persediaan}
                                                    onChange={(e) => {
                                                        setDataInput((prev: any) => {
                                                            const updated = [...prev];
                                                            updated[index]['nama_persediaan'] = e.target.value;
                                                            return updated;
                                                        });
                                                    }}
                                                    className='form-input font-normal min-w-[250px]' />

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
                                                                                setDataInput((prev: any) => {
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
                                        <td className='border'>
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={data.saldo_awal}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['saldo_awal'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border'>
                                            <Select placeholder="Pilih Kode Rekening"
                                                className='w-[250px]'
                                                isDisabled={isSaving == true}
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
                                                    arrKodeRekening?.map((data: any, index: number) => {
                                                        return {
                                                            value: data.id,
                                                            label: data.fullcode + ' - ' + data.name,
                                                        }
                                                    })
                                                } />
                                        </td>
                                        <td className='border'>
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={data.realisasi_lra}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['realisasi_lra'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border'>
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={data.hutang_belanja}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['hutang_belanja'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border'>
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={data.perolehan_hibah}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['perolehan_hibah'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border'>
                                            <InputRupiah
                                                isDisabled={isSaving == true}
                                                // readOnly={true}
                                                dataValue={data.saldo_akhir}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['saldo_akhir'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>
                                        <td className='border'>
                                            <InputRupiah
                                                // isDisabled={isSaving == true}
                                                readOnly={true}
                                                dataValue={data.beban_persediaan}
                                                onChange={(value: any) => {
                                                    setDataInput((prev: any) => {
                                                        const updated = [...prev];
                                                        updated[index]['beban_persediaan'] = value;
                                                        updatedData(updated, index);
                                                        return updated;
                                                    });
                                                    setIsUnsaved(true);
                                                }}
                                            />
                                        </td>

                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className='-bottom-5 !bg-slate-400 left-0 sticky'>
                            <td className='border p-3 text-center font-semibold'>
                                Jumlah
                            </td>
                            <td className='border p-3 text-end font-semibold'>
                                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.total_data)} Data
                            </td>
                            <td className='border p-3 text-end font-semibold'>
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.saldo_awal)}
                            </td>
                            <td className='border'></td>
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
                                Rp. {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalData.beban_persediaan)}
                            </td>
                        </tr>
                    </tfoot>
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
                        <>
                            <DownloadButtons
                                data={dataInput}
                                endpoint='/accountancy/download/excel'
                                uploadEndpoint={year != 2024 ? '/accountancy/upload/excel' : ''}
                                params={{
                                    type: 'barang_habis_pakai',
                                    category: 'persediaan',
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

export default BarangHabisPakai;
