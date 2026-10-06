
const LoaderWIthoutBgBlurr = () => {
    return (
        <>
            <div className="flex justify-center items-center">
                <div className="flex items-center gap-3 bg-white border border-gray-200 shadow-sm rounded-lg px-4 py-2">
                    <img
                        src="/logo/logo.png"
                        alt="Loading"
                        className="w-6 h-6 animate-spin"
                    />
                    <span className="text-gray-700 text-sm font-medium">
                        Loading...
                    </span>
                </div>
            </div>
        </>
    );
};

export default LoaderWIthoutBgBlurr;