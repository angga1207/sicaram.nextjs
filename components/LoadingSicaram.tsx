
const LoadingSicaram = () => {
    return (
        <div className="flex items-center justify-center w-full h-full rounded select-none">
            <div className="flex items-center justify-center relatie">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                <div className="absolute">
                    <img className="ml-[5px] w-24 h-24 object-contain flex-none animate-bounce delay-100" src="/assets/images/logo-caram.png" alt="logo" />
                    <div className="after:absolute after:top-0 after:left-0 after:w-full after:h-full after:rounded-full"></div>

                </div>
            </div>
        </div>
    );
}

export default LoadingSicaram;
