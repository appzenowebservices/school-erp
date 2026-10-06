import React, { useState, useEffect } from 'react';
import { Search, X, ReceiptText, UserCheck, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { deleteFeeTypeStudentsApi, getFeeTypeStudentsApi } from "../../api/fees";
import Loader from "../ui/status/Loader";
import ConfirmationDialogueBox from '../ui/status/Confirmation';

const FeeTypesStudentsTable = ({ selectedFeeType, context }) => {
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [students, setStudents] = useState([]);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [selectedFeeType_, setSelectedFeeType] = useState(null);
    const [selectedInstallment, setSelectedInstallment] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedFeeType && selectedFeeType !== "all") {
            fetchStudentFees();
        } else {
            setStudents([]);
        }
    }, [selectedFeeType, context?.session, context?.profileId]);

    const fetchStudentFees = async () => {
        setLoading(true);
        try {
            const res = await getFeeTypeStudentsApi(
                context?.profileId,
                context?.session,
                selectedFeeType
            );

            if (res?.data?.success) {
                setStudents(res?.data?.results?.items || []);
            }
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };

    // Placeholder for deletion logic
    const handleInstallmentMutation = (feeGroup, feeId) => {
        setSelectedFeeType(feeGroup?.fee_type)
        setSelectedInstallment(feeId)
        // console.log(feeGroup);
        // console.log(feeId);
        // Add your API call to feeType.removeStudent here
    };
    const handleRemoveInstallment = async () => {
        setError(null);
        setSuccess(null);

        try {


            const resp = await deleteFeeTypeStudentsApi(
                context?.profileId,
                context?.session,
                selectedRowData?.student,
                selectedInstallment,
                selectedFeeType_
            );

            if (resp?.data?.success) {
                setSuccess(resp?.data?.results?.message || "Role deleted successfully");

                setTimeout(() => {
                    setSuccess(null);
                    // setDepartmentToDelete(null);
                    window.location.reload(); // keeping your pattern
                }, 700);

            } else {
                setError(resp?.data?.results?.message || "Failed to delete Role");
            }
        } catch (err) {
            console.error("Role delete error:", err);
            setError(err.message || "Something went wrong while deleting Role");
        }
    };


// console.log('Students______',students);

    return (
        <>
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm min-h-[500px] flex flex-col overflow-hidden">
                {/* Header section */}
                <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="font-bold text-gray-800 text-lg">Student Fee Allocation</h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                            Registry for ID: {selectedFeeType}
                        </p>
                    </div>
                    {students.length > 0 && (
                        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl">
                            <UserCheck size={14} className="text-blue-600" />
                            <span className="text-xs font-black text-blue-600">
                                {students.length} Allocated
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col">
                    {(!selectedFeeType || selectedFeeType === "all") && (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gray-50/30">
                            <div className="w-20 h-20 bg-blue-50 text-blue-300 rounded-3xl flex items-center justify-center mb-4 border-2 border-dashed border-blue-100">
                                <Search size={40} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Select a Fee Category</h3>
                            <p className="text-gray-500 text-sm mt-2 max-w-xs">
                                Select a type from the dropdown to manage individual fee assignments.
                            </p>
                        </div>
                    )}

                    {selectedFeeType && selectedFeeType !== "all" && loading && (
                        <div className="flex-1 flex items-center justify-center py-24">
                            <Loader text="Fetching student ledger..." />
                        </div>
                    )}

                    {selectedFeeType && selectedFeeType !== "all" && !loading && students.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Class/Roll</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Allocated Installments (Click X to Remove)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 bg-white">
                                    {students?.map((item) => (
                                        <tr
                                            onClick={() => setSelectedRowData(item)}
                                            key={item?.student?.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap align-top">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500 border border-slate-200 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                        {item?.student?.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-800 capitalize">{item.student?.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium">UID: {item.student?.id}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap align-top">
                                                <p className="text-xs font-bold text-gray-700">{item.student?.class?.name}</p>
                                                <p className="text-[10px] text-gray-400">Roll: {item.student?.roll_number || 'NA'}</p>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-3">
                                                    {item?.fees?.map((feeGroup, gIdx) => (
                                                        <div key={gIdx} className="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
                                                            <p className="text-[9px] font-black text-blue-600 uppercase mb-2 tracking-tighter">
                                                                {feeGroup.fee_type?.full_name}
                                                            </p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {feeGroup.fees?.map((installment, iIdx) => (
                                                                    <div
                                                                        key={iIdx}
                                                                        className="group/fee flex items-center gap-2 bg-white pl-2 pr-1 py-1 rounded-lg border border-gray-200 shadow-sm hover:border-rose-200 hover:bg-rose-50 transition-all"
                                                                    >
                                                                        <div className="flex flex-col leading-none">
                                                                            <span className="text-[10px] font-bold text-gray-700">{installment.name}</span>
                                                                            <span
                                                                                className="text-[9px] font-black"
                                                                                style={{ color: installment.amount_text?.text_color }}
                                                                            >
                                                                                {installment.amount_text?.text}
                                                                            </span>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => handleInstallmentMutation(feeGroup, installment)}
                                                                            className="p-1 rounded-md text-gray-300 hover:text-rose-600 hover:bg-white transition-colors"
                                                                            title="Remove this installment"
                                                                        >
                                                                            <X size={12} strokeWidth={3} />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {selectedFeeType && selectedFeeType !== "all" && !loading && students.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center p-16 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-300">
                                <ReceiptText size={32} />
                            </div>
                            <h3 className="text-gray-800 font-bold">Registry Empty</h3>
                            <p className="text-gray-500 text-sm mt-1">No student data found for this fee type.</p>
                        </div>
                    )}
                </div>
            </div >



            {selectedInstallment && (
                <ConfirmationDialogueBox
                    title="Delete Fee?"
                    description={`Are you sure you want to delete "${selectedInstallment.name}"?`}
                    onConfirm={handleRemoveInstallment}
                    onCancel={() => setSelectedInstallment(null)}
                />
            )
            }
            {/* Floating Notifications */}
            <div className="fixed top-6 right-6 flex flex-col gap-3 z-999">
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
                            <p className="text-xs font-medium text-slate-500">{success}</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default FeeTypesStudentsTable;