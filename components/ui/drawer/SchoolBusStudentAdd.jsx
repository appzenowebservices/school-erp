import React, { useState, useMemo } from "react";
import {
    X,
    MapPin,
    Users,
    GraduationCap,
    Search,
    Bus,
    Check,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import { addSchoolBusStudent } from "../../../api/fees";

const SchoolBusStudentAdd = ({ busId, context, drawerOpen, setDrawerOpen, config, locations = [] }) => {

    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedStandardId, setSelectedStandardId] = useState("");
    const [selectedClassId, setSelectedClassId] = useState("");
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const availableClasses = useMemo(() => {
        const standard = config?.standards?.find(s => s.id === selectedStandardId);
        return standard ? standard.classes : [];
    }, [config, selectedStandardId]);

    const availableStudents = useMemo(() => {
        const targetClass = availableClasses.find(c => c.id === selectedClassId);
        return targetClass ? targetClass.students : [];
    }, [availableClasses, selectedClassId]);

    const filteredStudents = availableStudents.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.roll_number?.includes(searchTerm)
    );

    const toggleStudent = (studentId) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleStandardChange = (id) => {
        setSelectedStandardId(id);
        setSelectedClassId("");
        setSelectedStudents([]);
    };

    const handleSchoolBusStudentAdd = async () => {
        setSubmitted(true);
        setError(null);
        setSuccess(null);

        try {
            let payload = {
                pickup_location: selectedLocation,
                class_id: selectedClassId,
                student_ids: selectedStudents,
                busId
            }

            const resp = await addSchoolBusStudent(
                context?.profileId,
                context?.session,
                payload
            );

            if (resp?.data?.success) {
                setSuccess(resp?.data?.results?.message || "Role deleted successfully");

                setTimeout(() => {
                    setSuccess(null);
                    // setDepartmentToDelete(null);
                    window.location.reload(); // keeping your pattern
                }, 700);

                setSubmitted(false);
            } else {
                setError(resp?.data?.results?.message || "Failed to delete Role");
                setSubmitted(false);
            }
        } catch (err) {
            console.error("Role delete error:", err);
            setError(err.message || "Something went wrong while deleting Role");
            setSubmitted(false);
        }
    };

    return (
        <>
            <div className={`fixed inset-y-0 right-0 w-full md:w-[30rem] bg-slate-50 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>

                <div className="bg-white border-b px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <Bus className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Assign Students</h3>
                            <p className="text-xs text-slate-500 font-medium">Add students to bus route</p>
                        </div>
                    </div>
                    <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-160px)]">

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-500" /> Pickup Location
                        </label>
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium"
                        >
                            <option value="">Select Pickup Point...</option>
                            {[{ id: 1, name: "Kuliya" }].map(loc => (
                                <option key={loc.id} value={loc.name}>{loc.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-blue-500" /> Class Selection
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <select
                                value={selectedStandardId}
                                onChange={(e) => handleStandardChange(e.target.value)}
                                className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="">Standard</option>
                                {config?.standards?.map(std => (
                                    <option key={std.id} value={std.id}>{std.name}</option>
                                ))}
                            </select>

                            <select
                                value={selectedClassId}
                                onChange={(e) => setSelectedClassId(e.target.value)}
                                disabled={!selectedStandardId}
                                className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 disabled:cursor-not-allowed"
                            >
                                <option value="">Section/Class</option>
                                {availableClasses.map(cls => (
                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-500" /> Select Students
                            </div>
                            <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                {selectedStudents.length} Selected
                            </span>
                        </label>

                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="flex items-center px-3 border-b border-slate-100 bg-slate-50/50">
                                <Search className="w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or roll no..."
                                    className="w-full p-3 bg-transparent outline-none text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="max-h-64 overflow-y-auto p-2 space-y-1 bg-white">
                                {!selectedClassId ? (
                                    <p className="text-center py-10 text-slate-400 text-sm">Please select a class first</p>
                                ) : filteredStudents.length === 0 ? (
                                    <p className="text-center py-10 text-slate-400 text-sm">No students found</p>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <div
                                            key={student.id}
                                            onClick={() => toggleStudent(student.id)}
                                            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${selectedStudents.includes(student.id)
                                                ? "bg-blue-50 border-blue-200 ring-1 ring-blue-500/10"
                                                : "hover:bg-slate-50 border-transparent border"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {student.image_url ? (
                                                    <img src={student.image_url} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                                                ) : (
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${selectedStudents.includes(student.id) ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                                                        }`}>
                                                        {student.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-700">{student.name}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase font-medium">
                                                        Roll: {student.roll_number || 'N/A'} • Adm: {student.admission_number || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            {selectedStudents.includes(student.id) && (
                                                <div className="bg-blue-600 rounded-full p-1 shadow-sm">
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t flex gap-3">
                    <button onClick={() => setDrawerOpen(false)} className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
                        Cancel
                    </button>
                    <button
                        onClick={handleSchoolBusStudentAdd}
                        disabled={selectedStudents.length === 0 || !selectedLocation}
                        className="flex-[2] px-4 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:shadow-none"
                    >
                        Add {selectedStudents.length > 0 ? `${selectedStudents.length} Students` : "Students"}
                    </button>
                </div>
            </div>

            {drawerOpen && (
                <div onClick={() => setDrawerOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40" />
            )}



            {/* Floating Notifications */}
            <div className="fixed top-6 right-6 flex flex-col gap-3 z-[60]">
                {error && (
                    <div className="bg-white border-l-4 border-red-500 shadow-2xl rounded-2xl px-5 py-4 flex items-center gap-4 animate-in slide-in-from-right">
                        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600 shrink-0">
                            <AlertCircle size={20} />
                        </div>
                        <div className="pr-4">
                            <p className="text-sm font-bold text-slate-900">Wait a minute</p>
                            <p className="text-xs font-medium text-slate-500">{error}</p>
                        </div>
                        <button onClick={() => setError(null)} className="text-slate-300 hover:text-slate-500">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {success && (
                    <div className="bg-white border-l-4 border-green-500 shadow-2xl rounded-2xl px-5 py-4 flex items-center gap-4 animate-in slide-in-from-right">
                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
                            <CheckCircle2 size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">Done!</p>
                            <p className="text-sm font-medium text-slate-500">{success}</p>
                        </div>
                    </div>
                )}
            </div>

        </>
    );
};

export default SchoolBusStudentAdd;