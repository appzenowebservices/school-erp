
export const EditClassModal = ({
    selectedItem,
    section,
    selectedTeacher,
    teachers,
    handleEditClass,
    loading,
    setShowEditModal,
    setSection ,
    setSelectedTeacher
}) => {



    return (
        <>
            <div className="fixed inset-0   backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
                <div className="bg-white border border-accent ring-2 rounded-lg p-6 w-full max-w-md">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Edit {selectedItem.type === 'standard' ? 'Standard' : 'Class'}
                    </h2>

                    <form className="space-y-4">
                        {selectedItem.type === 'class' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Section
                                    </label>
                                    <input
                                        value={section}
                                        type="text"
                                        placeholder="e.g., VI-E"
                                        onChange={(e) => setSection(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Class Teacher
                                    </label>

                                    <select
                                        value={selectedTeacher}
                                        onChange={(e) => setSelectedTeacher(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Choose Teacher</option>
                                        {teachers?.map(teacher => (
                                            <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Class Teacher
                                                </label>
                                                <input
                                                    type="text"
                                                    defaultValue={selectedItem.data.classTeacher}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div> */}
                                {/* <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Room Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        defaultValue={selectedItem.data.room}
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Capacity
                                                    </label>
                                                    <input
                                                        type="number"
                                                        defaultValue={selectedItem.data.capacity}
                                                        min="1"
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div> */}
                                {/* <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Current Students
                                                </label>
                                                <input
                                                    type="number"
                                                    defaultValue={selectedItem.data.students}
                                                    min="0"
                                                    max={selectedItem.data.capacity}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div> */}
                                {/* <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Schedule
                                                </label>
                                                <select
                                                    defaultValue={selectedItem.data.schedule}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="Morning">Morning Shift</option>
                                                    <option value="Afternoon">Afternoon Shift</option>
                                                </select>
                                            </div> */}
                            </>
                        )}
                    </form>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => {
                                setShowEditModal(false);
                                setSelectedItem(null);
                            }}
                            className="cursor-pointer px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleEditClass}
                            className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {!loading ? 'Save Changes' : 'saving ...'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}