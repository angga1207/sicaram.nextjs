import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';
import { isEmpty } from "lodash";
import Swal from "sweetalert2";

const InputRupiah = (
    {
        dataValue,
        onChange,
        isDisabled = false,
        readOnly = false,
        isRealisasi = false,
        onBlur,
        placeholder = '',
        isFullWidth = false,
    }: {
        dataValue?: any,
        onChange?: any,
        isDisabled?: boolean,
        readOnly?: boolean,
        isRealisasi?: boolean,
        onBlur?: any,
        placeholder?: string,
        isFullWidth?: boolean,
    }
) => {

    const handleChange = (e: any) => {
        // const value = e.target.value;
        // let positiveAndNegativeValue = value.replace(/[^0-9-]/g, '');
        // positiveAndNegativeValue = isEmpty(positiveAndNegativeValue) ? 0 : positiveAndNegativeValue;
        // onChange(positiveAndNegativeValue);

        const value = e.target.value;
        let composedValue = value.replace(/[^0-9.-]/g, '');
        // only accept 1 dot
        // only accept 2 decimal
        composedValue = composedValue.replace(/(\.\d{2})\d+/, '$1');
        composedValue = isEmpty(composedValue) ? 0 : composedValue;
        onChange(composedValue);
    }

    return (
        <>
            {readOnly ? (
                <div className="flex group w-full">
                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                        Rp.
                    </div>
                    <div className={`form-input w-[250px] rounded-none font-semibold text-end bg-slate-200 ${dataValue < 0 ? '!text-red-500' : ''}`}>
                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(dataValue)}
                    </div>
                    {/* Copy Data */}
                    <Tippy content="Salin Data" placement="top" theme="secondary">
                        <div className={`bg-[#eee] flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b] select-none cursor-pointer`}
                            onClick={() => {
                                navigator.clipboard.writeText(dataValue);
                                Swal.fire({
                                    toast: true,
                                    position: 'top-end',
                                    icon: 'success',
                                    title: 'Data berhasil disalin',
                                    showConfirmButton: false,
                                    timer: 5000
                                });
                            }}>
                            <FontAwesomeIcon icon={faCopy} className="text-purple-600 cursor-pointer w-4 h-4" />
                        </div>
                    </Tippy>
                </div>
            ) : (
                <div className="flex group w-full">
                    {isRealisasi === false && (
                        <div className={`bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b] select-none`}>
                            Rp.
                        </div>
                    )}
                    <input
                        type="text"
                        onFocus={(e) => {
                            e.target.select();
                        }}
                        onKeyDown={(e) => {
                            if (!(
                                (e.keyCode >= 48 && e.keyCode <= 57) ||
                                (e.keyCode >= 96 && e.keyCode <= 105) ||
                                e.keyCode == 8 ||
                                e.keyCode == 46 ||
                                e.keyCode == 37 ||
                                e.keyCode == 39 ||
                                e.keyCode == 188 ||
                                e.keyCode == 9 ||
                                // minus underscore
                                e.keyCode == 189 ||
                                // copy & paste
                                (e.keyCode == 67 && e.ctrlKey) ||
                                (e.keyCode == 86 && e.ctrlKey) ||
                                // command + c & command + v
                                (e.keyCode == 67 && e.metaKey) ||
                                (e.keyCode == 86 && e.metaKey) ||
                                // command + a
                                (e.keyCode == 65 && e.metaKey) ||
                                (e.keyCode == 65 && e.ctrlKey) ||
                                // dot
                                e.keyCode == 190
                            )) {
                                e.preventDefault();
                            }
                        }}
                        value={dataValue}
                        onChange={(e) => {
                            handleChange(e);
                        }}
                        onBlur={(e) => {
                            if (onBlur) {
                                onBlur(e);
                            }
                        }}
                        disabled={isDisabled}
                        placeholder={placeholder}
                        className={`form-input font-semibold text-end hidden group-focus-within:block group-hover:block disabled:bg-slate-200 ${dataValue < 0 ? '!text-red-500' : ''} ${isRealisasi ? 'w-full min-h-8 text-xs px-1.5 py-1' : 'w-[250px] rounded-none'} ${isFullWidth ? 'w-full' : ''}`} />
                    <div className={`form-input font-semibold text-end block group-focus-within:hidden group-hover:hidden ${isDisabled ? 'bg-slate-200' : ''} ${dataValue < 0 ? '!text-red-500' : ''} ${isRealisasi ? 'w-full min-h-8 text-xs px-1.5 py-1' : 'w-[250px] rounded-none'} ${isFullWidth ? 'w-full' : ''}`}>
                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(dataValue)}
                    </div>
                    {/* Copy Data */}
                    <Tippy content="Salin Data" placement="top" theme="secondary">
                        <div className={`bg-[#eee] flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b] select-none cursor-pointer`}
                            onClick={() => {
                                navigator.clipboard.writeText(dataValue);
                                Swal.fire({
                                    toast: true,
                                    position: 'top-end',
                                    icon: 'success',
                                    title: 'Data berhasil disalin',
                                    showConfirmButton: false,
                                    timer: 5000
                                });
                            }}>
                            <FontAwesomeIcon icon={faCopy} className="text-purple-600 cursor-pointer w-4 h-4" />
                        </div>
                    </Tippy>
                </div>
            )}
        </>
    );
}

export default InputRupiah;
