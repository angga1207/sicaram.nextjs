import { useEffect, useState, Fragment, useRef } from 'react';
import { faEdit, faEye, faFilePdf, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faArchive, faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../Icon/IconX';
import Select from 'react-select';
import Swal from 'sweetalert2';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { useRouter } from 'next/router';

const showAlertCenter = async (icon: any, text: any) => {
    const toast = Swal.mixin({
        toast: false,
        position: 'center',
        showConfirmButton: true,
        confirmButtonText: 'Tutup',
        showCancelButton: false,
    });
    toast.fire({
        icon: icon,
        title: text,
        padding: '10px 20px',
    });
};

const BerkasPendukung = ({
    datas,
    arrRekening,
    onInputChange,
    isLoading,
    isDone,
    onDelete,
}: {
    datas: any;
    arrRekening: any[];
    onInputChange: (data: any, rekeningId: any) => void
    isLoading: boolean;
    isDone: boolean;
    onDelete: (data: any) => void;
}) => {
    const router = useRouter();
    const [modalUpload, setModalUpload] = useState(false);
    const [rekeningId, setRekeningId] = useState<any>(null);
    const [uploadDatas, setUploadDatas] = useState<any>(null);

    // console.log('uploadDatas', uploadDatas?.filter((item: any) => item.name == 'default.webp'));


    // const [images, setImages] = useState<any>([]);
    const [openLightBox, setOpenLightBox] = useState(false);
    const [imagesIndex, setImagesIndex] = useState<any>(-1)
    const imageSizes = [16, 32, 48, 64, 96, 128, 256, 384];
    const deviceSizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];


    function nextImageUrl(src: any, size: any) {
        // return `/_next/image?url=${encodeURIComponent(src)}&w=${size}&q=75`;
        return `${src}?w=${size}&q=75`;
    }
    const [slides, setSlides] = useState<any>([]);

    useEffect(() => {
        if (isDone) {
            // setModalUpload(false);
            setUploadDatas(null);
        }
    }, [isDone]);

    return (
        <div>
            <div className="sticky top-0 left-0 bg-white dark:bg-slate-900 z-10 border-b border-slate-200 dark:border-slate-700 py-2 px-4 pt-5 flex items-center justify-between flex-wrap gap-4">
                <div className="text-lg font-semibold underline select-none">
                    Berkas Pendukung
                </div>
                <div className="">
                    <button
                        type="button"
                        className="btn btn-success relative"
                        onClick={() => {
                            setModalUpload(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faCloudUploadAlt} className="w-4 h-4 mr-2" />
                        <span className="text-base">
                            Unggah Berkas Pendukung
                        </span>
                    </button>
                </div>
            </div>

            <div className="mt-5">
                <div className="space-y-5">
                    {arrRekening?.filter((REK: any) => datas?.some((brks: any) => brks.kode_rekening_id === REK.id))
                        ?.map((kodeRekening: any, index: number) => (
                            <div key={`kodeR-${index}`} className="">
                                <div className="text-lg font-semibold mb-2 underline">
                                    {kodeRekening.fullcode} - {kodeRekening.uraian}
                                </div>

                                <div className="mt-3 flex flex-wrap gap-4">
                                    {datas?.filter((data: any) => (data.kode_rekening_id === kodeRekening.id))

                                        ?.map((item: any, indexImg: number) => (
                                            <div
                                                key={`berkas-pendukung1-${item.id}`}
                                                className="group panel min-w-[300px] w-full lg:w-[unset] lg:max-w-[500px] hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-lg p-2 cursor-pointer">
                                                <div className="flex gap-x-2">
                                                    <div className="w-[150px] h-[150px] shrink-0 relative">
                                                        <div className="">
                                                            {['jpg', 'png', 'webp'].includes(item?.extension) && (
                                                                <img
                                                                    src={item?.file}
                                                                    className='w-[150px] h-[150px] object-cover'
                                                                />
                                                            )}

                                                            {['zip', 'rar', '7zip'].includes(item?.extension) && (
                                                                <div className="w-[150px] h-[150px] flex items-center justify-center">
                                                                    <FontAwesomeIcon icon={faArchive} className="w-[100px] h-[100px] text-slate-400" />
                                                                </div>
                                                            )}

                                                            {['pdf'].includes(item?.extension) && (
                                                                <div className="w-[150px] h-[150px] flex items-center justify-center">
                                                                    <FontAwesomeIcon icon={faFilePdf} className="w-[100px] h-[100px] text-slate-400" />
                                                                </div>
                                                            )}

                                                            {['jpg', 'png', 'webp', 'zip', 'rar', '7zip', 'pdf'].includes(item?.extension) === false && (
                                                                <img
                                                                    src='/assets/images/logo-oi.png'
                                                                    className='w-[150px] h-[150px] object-cover'
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="absolute top-0 left-0 w-full h-full bg-slate-900/50 rounded-lg flex items-end gap-x-2 justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 pb-2">
                                                            <Tippy content="Lihat"
                                                                theme="success"
                                                                className="text-white transition-all duration-200"
                                                            >
                                                                <div
                                                                    onClick={() => {
                                                                        if (item?.mime_type.includes('image/')) {
                                                                            setSlides(datas?.filter((data: any) => (data.kode_rekening_id === kodeRekening.id)).map((img: any) => ({
                                                                                width: img.width ?? 1080,
                                                                                height: img.height ?? 1280,
                                                                                src: nextImageUrl(img.file, 1080),
                                                                                srcSet: imageSizes
                                                                                    .concat(...deviceSizes)
                                                                                    .filter((size) => size <= 1080)
                                                                                    .map((size) => ({
                                                                                        src: nextImageUrl(img.file, size),
                                                                                        width: size,
                                                                                        height: Math.round((1280 / 1080) * size),
                                                                                    })),
                                                                            })));
                                                                            setImagesIndex(indexImg);
                                                                            setOpenLightBox(true);
                                                                        } else {
                                                                            router.push(item?.file);
                                                                        }
                                                                    }}
                                                                    className="btn btn-success rounded-full w-8 h-8 p-0">
                                                                    <FontAwesomeIcon icon={faEye} className="w-4 h-4 text-white" />
                                                                </div>
                                                            </Tippy>
                                                            <Tippy content="Hapus"
                                                                theme="danger"
                                                                className="text-white transition-all duration-200"
                                                            >
                                                                <div
                                                                    onClick={(e) => {
                                                                        onDelete(item)
                                                                    }}
                                                                    className="btn btn-danger rounded-full w-8 h-8 p-0">
                                                                    <FontAwesomeIcon icon={faTrashAlt} className="w-4 h-4 text-white" />
                                                                </div>
                                                            </Tippy>
                                                        </div>
                                                    </div>
                                                    <div className="grow w-[calc(100%_-_150px)]">
                                                        <div className="font-semibold line-clamp-2">
                                                            {item?.filename}
                                                        </div>
                                                        <div className="text-2xs text-slate-500 mb-2">
                                                            {new Date(item?.created_at).toLocaleString('id-ID', {
                                                                month: 'long',
                                                                day: '2-digit',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </div>
                                                        <div className="text-xs">
                                                            {item?.kode_rekening_id && (
                                                                item.kode_rekening_fullcode + ' - ' + item.kode_rekening_name
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                </div>

                {datas?.filter((data: any) => data.kode_rekening_id === null)?.length > 0 && (
                    <div className="mt-5">
                        <div className="text-lg font-semibold mb-2 underline">
                            Berkas Pendukung Lainnya
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {datas?.filter((data: any) => data.kode_rekening_id === null)?.map((item: any, indexImg: number) => (
                                <div
                                    key={`berkas-pendukung2-${item.id}`}
                                    className="group panel min-w-[300px] w-full lg:w-[unset] lg:max-w-[500px] hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-lg p-2 cursor-pointer">
                                    <div className="flex gap-x-2">
                                        <div className="w-[150px] h-[150px] shrink-0 relative">
                                            <div className="">
                                                {['jpg', 'png', 'webp'].includes(item?.extension) && (
                                                    <img
                                                        // src='/assets/images/logo-oi.png'
                                                        src={item?.file}
                                                        className='w-[150px] h-[150px] object-cover'
                                                    />
                                                )}

                                                {['zip', 'rar', '7zip'].includes(item?.extension) && (
                                                    <div className="w-[150px] h-[150px] flex items-center justify-center">
                                                        <FontAwesomeIcon icon={faArchive} className="w-[100px] h-[100px] text-slate-400" />
                                                    </div>
                                                )}

                                                {['pdf'].includes(item?.extension) && (
                                                    <div className="w-[150px] h-[150px] flex items-center justify-center">
                                                        <FontAwesomeIcon icon={faFilePdf} className="w-[100px] h-[100px] text-slate-400" />
                                                    </div>
                                                )}

                                                {['jpg', 'png', 'webp', 'zip', 'rar', '7zip', 'pdf'].includes(item?.extension) === false && (
                                                    <img
                                                        src='/assets/images/logo-oi.png'
                                                        className='w-[150px] h-[150px] object-cover'
                                                    />
                                                )}
                                            </div>
                                            <div className="absolute top-0 left-0 w-full h-full bg-slate-900/50 rounded-lg flex items-end gap-x-2 justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 pb-2">
                                                <Tippy content="Lihat"
                                                    theme="success"
                                                    className="text-white transition-all duration-200"
                                                >
                                                    <div
                                                        onClick={() => {
                                                            if (item?.mime_type.includes('image/')) {
                                                                setSlides(datas?.filter((data: any) => (data.kode_rekening_id === null)).map((img: any) => ({
                                                                    width: img.width ?? 1080,
                                                                    height: img.height ?? 1280,
                                                                    src: nextImageUrl(img.file, 1080),
                                                                    srcSet: imageSizes
                                                                        .concat(...deviceSizes)
                                                                        .filter((size) => size <= 1080)
                                                                        .map((size) => ({
                                                                            src: nextImageUrl(img.file, size),
                                                                            width: size,
                                                                            height: Math.round((1280 / 1080) * size),
                                                                        })),
                                                                })));
                                                                setImagesIndex(indexImg);
                                                                setOpenLightBox(true);
                                                            } else {
                                                                router.push(item?.file);
                                                            }
                                                        }}
                                                        className="btn btn-success rounded-full w-8 h-8 p-0">
                                                        <FontAwesomeIcon icon={faEye} className="w-4 h-4 text-white" />
                                                    </div>
                                                </Tippy>

                                                <Tippy content="Hapus"
                                                    theme="danger"
                                                    className="text-white transition-all duration-200"
                                                >
                                                    <div
                                                        onClick={(e) => {
                                                            onDelete(item)
                                                        }}
                                                        className="btn btn-danger rounded-full w-8 h-8 p-0">
                                                        <FontAwesomeIcon icon={faTrashAlt} className="w-4 h-4 text-white" />
                                                    </div>
                                                </Tippy>
                                            </div>
                                        </div>
                                        <div className="grow w-[calc(100%_-_150px)]">
                                            <div className="font-semibold line-clamp-2">
                                                {item?.filename}
                                            </div>
                                            <div className="text-2xs text-slate-500 mb-2">
                                                {new Date(item?.created_at).toLocaleString('id-ID', {
                                                    month: 'long',
                                                    day: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {datas?.length === 0 && (
                    <div className="flex items-center justify-center w-full h-[200px]">
                        <div className="text-slate-500 text-lg font-semibold">
                            Belum ada berkas pendukung
                        </div>
                    </div>
                )}
            </div>

            <Transition appear show={modalUpload} as={Fragment}>
                <Dialog as="div" open={modalUpload} onClose={() => setModalUpload(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg w-full max-w-[100%] md:max-w-[40%] my-8 text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <h5 className="font-semibold text-md">
                                            Unggah Berkas
                                        </h5>
                                        <button
                                            type="button"
                                            className="text-white-dark hover:text-dark"
                                            onClick={() => setModalUpload(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5 space-y-3">

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="col-span-1 md:col-span-3">
                                                <div className="mb-5">
                                                    <Select placeholder="Pilih Kode Rekening"
                                                        onChange={(e: any) => {
                                                            setRekeningId(e?.value);
                                                        }}
                                                        isLoading={arrRekening?.length === 0}
                                                        isClearable={true}
                                                        isDisabled={isLoading}
                                                        value={
                                                            arrRekening?.map((data: any, index: number) => {
                                                                if (data.id == rekeningId) {
                                                                    return {
                                                                        value: data.id,
                                                                        label: data.fullcode + ' - ' + data.uraian,
                                                                    }
                                                                }
                                                            })
                                                        }
                                                        options={
                                                            arrRekening?.map((data: any, index: number) => {
                                                                return {
                                                                    value: data.id,
                                                                    label: data.fullcode + ' - ' + data.uraian,
                                                                }
                                                            })
                                                        } />
                                                </div>

                                                <div className="">
                                                    <button
                                                        type="button"
                                                        className="btn btn-success relative"
                                                        onClick={() => {
                                                            setModalUpload(true);
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faCloudUploadAlt} className="w-4 h-4 mr-2" />
                                                        <span className="text-base">
                                                            Pilih Berkas Pendukung
                                                        </span>
                                                        <input
                                                            type="file"
                                                            multiple
                                                            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                                            title="Pilih Berkas Pendukung"
                                                            onChange={(e) => {
                                                                if (isLoading) {
                                                                    showAlertCenter('warning', 'Tunggu Sebentar');
                                                                    return;
                                                                }
                                                                // const files = e.target.files;
                                                                setUploadDatas(e.target.files);
                                                            }}
                                                        />
                                                    </button>
                                                    <div className="">
                                                        {uploadDatas?.length ? uploadDatas?.length + ' berkas dipilih' : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-end border-t pt-1 gap-2">
                                            <div className='flex items-center gap-4'>
                                                <button
                                                    onClick={() => {
                                                        setModalUpload(false);
                                                    }}
                                                    type="button"
                                                    className="btn btn-outline-dark text-xs w-full">
                                                    <IconX className="w-4 h-4 mr-1" />
                                                    Tutup
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        if (uploadDatas?.length) {
                                                            onInputChange(uploadDatas, rekeningId);
                                                        } else {
                                                            showAlertCenter('warning', 'Berkas-berkas belum dipilih');
                                                        }
                                                    }}
                                                    type="button"
                                                    className="btn btn-outline-success text-xs w-full">
                                                    <FontAwesomeIcon icon={faCloudUploadAlt} className="w-4 h-4 mr-2" />
                                                    Unggah
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>


            <Lightbox
                index={imagesIndex}
                open={openLightBox}
                close={() => setOpenLightBox(false)}
                slides={slides}
                plugins={[Zoom]}
            />

        </div>
    );
}

export default BerkasPendukung;
