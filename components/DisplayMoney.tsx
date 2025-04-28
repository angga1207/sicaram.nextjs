const DisplayMoney = (
    {
        data,
    }: {
        data?: any
    }
) => {
    return (
        <div className="flex items-center justify-between">
            <div className="">
                Rp.
            </div>
            <div className="">
                {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(data)}
            </div>
        </div>
    );
}

export default DisplayMoney;
