
export const QuickStats = ({
    standards,
    stats
}) => {




    return (
        <>
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{standards.reduce((sum, std) => sum + (std?.classes?.length || 0), 0)}</div>
                        <div className="text-sm text-gray-600">Total Classes</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{stats.totalStudents}</div>
                        <div className="text-sm text-gray-600">Total Enrollment</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{stats.totalCapacity}</div>
                        <div className="text-sm text-gray-600">Total Capacity</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{stats.occupancyRate}%</div>
                        <div className="text-sm text-gray-600">Occupancy Rate</div>
                    </div>
                </div>
            </div>
        </>
    )
}