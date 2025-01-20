import { isEmpty } from "lodash";

const InputRupiah = (
    { dataValue, onChange, isDisabled = false, readOnly = false, isRealisasi = false, onBlur, }:
        { dataValue?: any, onChange?: any, isDisabled?: boolean, readOnly?: boolean, isRealisasi?: boolean, onBlur?: any }
) => {

    const handleChange = (e: any) => {
        const value = e.target.value;
        let positiveAndNegativeValue = value.replace(/[^0-9-]/g, '');
        positiveAndNegativeValue = isEmpty(positiveAndNegativeValue) ? 0 : positiveAndNegativeValue;
        onChange(positiveAndNegativeValue);
    }

    return (
        <>
            {readOnly ? (
                <div className="flex group">
                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                        Rp.
                    </div>
                    <div className={`form-input w-[250px] ltr:rounded-l-none rtl:rounded-r-none font-semibold text-end bg-slate-200 ${dataValue < 0 ? '!text-red-500' : ''}`}>
                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(dataValue)}
                    </div>
                </div>
            ) : (
                <div className="flex group">
                    {isRealisasi === false && (
                        <div className={`bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b] select-none`}>
                            Rp.
                        </div>
                    )}
                    <input
                        type="text"
                        onFocus={(e) => {
                            if (parseFloat(e.target.value) == 0) {
                                e.target.select();
                            }
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
                                (e.keyCode == 65 && e.ctrlKey)
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
                        className={`form-input font-semibold text-end hidden group-focus-within:block group-hover:block disabled:bg-slate-200 ${dataValue < 0 ? '!text-red-500' : ''} ${isRealisasi ? 'w-full min-h-8 text-xs px-1.5 py-1' : 'w-[250px] ltr:rounded-l-none rtl:rounded-r-none'}`} />
                    <div className={`form-input font-semibold text-end block group-focus-within:hidden group-hover:hidden ${isDisabled ? 'bg-slate-200' : ''} ${dataValue < 0 ? '!text-red-500' : ''} ${isRealisasi ? 'w-full min-h-8 text-xs px-1.5 py-1' : 'w-[250px] ltr:rounded-l-none rtl:rounded-r-none'}`}>
                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(dataValue)}
                    </div>
                </div>
            )}
        </>
    );
}

export default InputRupiah;
