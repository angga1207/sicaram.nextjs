const InputTextExpanded = (
    {
        value,
        data,
        index,
        isDisabled,
        isReadOnly,
        placeholder,
        onChange,
        onBlur,
    }: {
        value: string;
        data: any;
        index: number;
        isDisabled?: boolean;
        isReadOnly?: boolean;
        placeholder?: string;
        onChange?: any;
        onBlur?: any;
    }
) => {
    return (
        <div className="group">
            <input type="text"
                placeholder={placeholder}
                autoComplete='off'
                value={value}
                disabled={isDisabled}
                onBlur={onBlur}
                onChange={(e) => {
                    onChange(e, data, index);
                }}
                className='group-hover:hidden group-focus-within:hidden form-input font-normal min-w-[250px]' />

            <textarea
                placeholder={placeholder}
                autoComplete='off'
                value={value}
                disabled={isDisabled}
                onBlur={onBlur}
                onChange={(e) => {
                    onChange(e, data, index);
                }}
                className='hidden group-hover:block group-focus-within:block form-textarea font-normal min-w-[250px] resize-none h-20' />
        </div>
    );
};

export default InputTextExpanded;
