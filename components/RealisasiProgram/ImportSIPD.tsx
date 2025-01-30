import { uploadRealisasiExcel } from "@/apis/realisasi_apis";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

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

const ImportSIPD = (
    { params, updateData, isUnsave }:
        { params: any, updateData: any, isUnsave: any }
) => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [subKegiatan, setSubKegiatan] = useState<any>([]);
    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null);
    const [month, setMonth] = useState<any>(null);
    const [instance, setInstance] = useState<any>(null);
    const [file, setFile] = useState<any>(null);

    const [isUnsaved, setIsUnsaved] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        setPeriode(params.periode);
        setYear(params.year);
        setMonth(params.month);
        setSubKegiatan(params.subKegiatan);
        setInstance(params.subKegiatan.instance_id);

        setIsUnsaved(isUnsave);
    }, [isMounted]);

    const handleUpload = async () => {
        setIsUnsaved(true);
        setIsUploading(true);
        const res = await uploadRealisasiExcel(subKegiatan.id, instance, periode, year, month, file);

        if (res.status == 'error validation') {
            Object.keys(res.message).map((key: any) => {
                let element = document.getElementById('error-' + key);
                if (element) {
                    if (key) {
                        element.innerHTML = res.message[key][0];
                    } else {
                        element.innerHTML = '';
                    }
                }
            });
            Swal.fire({
                title: 'Peringatan!',
                text: 'Terdapat form yang belum diisi dengan benar',
                icon: 'info',
                confirmButtonText: 'OK'
            });
            setIsUnsaved(false);
        } else if (res.status == 'success') {
            // showAlert('success', 'Data berhasil disimpan');
            setIsUnsaved(false);
            updateData();
            isUnsave(false);
        } else if (res.status == 'error') {
            Swal.fire({
                title: 'Error!',
                text: res.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } else {
            // showAlert('error', 'Data gagal disimpan');
            Swal.fire({
                title: 'Error!',
                text: 'Data gagal disimpan',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
        setIsUploading(false);

        // setFile(null);
    }

    return (
        <>
            <div className="panel h-[calc(100vh-250px)]">
                <div
                    className="w-[500px] max-w-full flex flex-col gap-4 justify-start">
                    <div className="text-xl font-bold">
                        Unggah Berkas Realisasi dari SIPD
                    </div>
                    <div>
                        <label htmlFor="">
                            Berkas Realisasi (Excel)
                        </label>
                        <input
                            onChange={() => {
                                const file = (document.getElementById('addonsRight') as HTMLInputElement)?.files?.[0];
                                if (file) {
                                    setFile(file);
                                    setIsUnsaved(true);
                                }
                            }}
                            id="addonsRight"
                            type="file"
                            accept=".xls,.xlsx"
                            className="form-input" />
                    </div>

                    <div className={`self-end ${file ? 'block' : 'hidden'}`}>
                        {isUploading && (
                            <div className="btn btn-primary">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                <div className="whitespace-nowrap">
                                    Sedang mengunggah...
                                </div>
                            </div>
                        )}

                        {!isUploading && (
                            <button
                                onClick={() => {
                                    const file = (document.getElementById('addonsRight') as HTMLInputElement)?.files?.[0];
                                    if (file) {
                                        // handleUpload();
                                        Swal.fire({
                                            title: 'Peringatan!',
                                            text: 'Apakah Anda yakin ingin memperbarui data Realisasi dengan Data Ini? Data yang sudah ada akan dihapus dan digantikan dengan data yang baru',
                                            icon: 'info',
                                            confirmButtonText: 'Lanjutkan',
                                            showCancelButton: true,
                                            cancelButtonText: 'Batal',
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                handleUpload();
                                            }
                                        });
                                    } else {
                                        Swal.fire({
                                            title: 'Peringatan!',
                                            text: 'File belum dipilih',
                                            icon: 'info',
                                            confirmButtonText: 'OK'
                                        });
                                    }
                                }}
                                type="button"
                                className="btn btn-primary">
                                <FontAwesomeIcon icon={faCloudUploadAlt} className="mr-2 w-5 h-5" />
                                <div className="whitespace-nowrap">
                                    Unggah Berkas
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ImportSIPD;
