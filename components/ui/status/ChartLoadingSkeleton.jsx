const ChartLoadingSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header Skeleton */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>

            {/* Summary Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                ))}
            </div>

            {/* View Toggle Skeleton */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 animate-pulse">
                <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-10 bg-gray-200 rounded-lg w-24"></div>
                    ))}
                </div>
            </div>

            {/* Charts Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart Skeleton */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                        <div className="h-64 bg-gray-100 rounded flex items-end justify-around p-4 gap-2">
                            {[60, 80, 45, 90, 70].map((height, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div 
                                        className="w-full bg-gray-200 rounded-t"
                                        style={{ height: `${height}%` }}
                                    ></div>
                                    <div className="h-3 bg-gray-200 rounded w-8"></div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center gap-4 mt-4">
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </div>
                    </div>
                </div>

                {/* Pie Chart Skeleton */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                            <div className="relative w-48 h-48">
                                <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                                <div className="absolute inset-0 rounded-full border-t-8 border-r-8 border-gray-300 transform rotate-45"></div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4 mt-4">
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading Indicator */}
            <div className="fixed bottom-8 right-8">
                <div className="flex items-center gap-3 bg-white border border-gray-200 shadow-lg rounded-lg px-4 py-2">
                    <img
                        src="/logo/logo.png"
                        alt="Loading"
                        className="w-6 h-6 animate-spin"
                    />
                    <span className="text-gray-700 text-sm font-medium">
                        Loading chart data...
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChartLoadingSkeleton;