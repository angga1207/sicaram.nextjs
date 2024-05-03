import prettyMS from "pretty-ms";

const SimpleProgressBar = ({
    progress = 0,
    remaining = 0,
}: {
    progress?: number;
    remaining?: number;
}) => {
    return (
        <>
            {!!remaining && (
                <div className="mb-1.5 text-sm text-gray-700">
                    Remaining time: {prettyMS(remaining)}
                </div>
            )}
            <div className="py-1.5 h-6 relative">
                {/* The rest of the JSX */}
            </div>
        </>
    );
};

export default SimpleProgressBar;
