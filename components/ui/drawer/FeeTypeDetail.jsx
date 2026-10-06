import React, { useEffect, useState } from "react";
import {
    X,
    Calendar,
    Layers,
    ReceiptIndianRupee,
    Users,
    Banknote,
    Clock,
    CheckCircle2,
    XCircle,
    TrendingUp,
    GraduationCap,
    IndianRupee,
    DollarSign,
} from "lucide-react";
import { getFeeTypeDetail } from "../../../api/fees";

const FeeTypeDetail = ({ drawerOpen, selectedFee, context, setDrawerOpen }) => {
    const [feeDetailData, setFeeDetailData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchFeeTypeDetail = async () => {
        if (!drawerOpen || !selectedFee?.id) return;
        setLoading(true);
        try {
            const res = await getFeeTypeDetail(
                context?.profileId,
                context?.session,
                selectedFee?.id
            );
            if (res?.data?.success) {
                setFeeDetailData(res.data.results);
            }
        } catch (err) {
            console.error("Error fetching fee type detail:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeeTypeDetail();
    }, [drawerOpen, selectedFee]);

    const data = feeDetailData;
    console.log(data?.standard);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN").format(amount || 0);
    };

    return (
        <>
            {/* Drawer */}
            <div
                className={`fixed inset-y-0 right-0 w-full md:w-[32rem] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${drawerOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-accent px-6 py-5 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                            <ReceiptIndianRupee className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Fee Details</h3>
                            <p className="text-sm text-blue-100 mt-0.5">Complete breakdown and information</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setDrawerOpen(false)}
                        className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                            <p className="mt-4 text-gray-500 font-medium">Loading details...</p>
                        </div>
                    </div>
                ) : data ? (
                    <div className="overflow-y-auto h-[calc(100vh-88px)]">
                        <div className="p-6 space-y-6">
                            {/* Fee Title Card */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border-2 border-blue-100">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                            {data.name}
                                        </h2>
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-blue-200">
                                            <Layers className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm font-semibold text-gray-700">{data.type}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600 mb-1">Fee Amount</div>
                                        <div className="text-3xl font-bold text-blue-600 flex items-center gap-1">
                                            <IndianRupee className="w-6 h-6" />
                                            {formatCurrency(data.amount)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                                    <GraduationCap className="w-4 h-4" />
                                    <span className="font-medium">{data.standard?.name}</span>
                                </div>
                            </div>

                            {/* Date & Info Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-green-50 rounded-xl p-4 border-2 border-green-100">
                                    <div className="flex items-center gap-2 text-green-700 mb-2">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-xs font-semibold uppercase">Start Date</span>
                                    </div>
                                    <div className="text-lg font-bold text-gray-900">
                                        {data.start_date?.text || "N/A"}
                                    </div>
                                </div>

                                <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-100">
                                    <div className="flex items-center gap-2 text-orange-700 mb-2">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-xs font-semibold uppercase">Due Date</span>
                                    </div>
                                    <div className="text-lg font-bold text-gray-900">
                                        {data.due_date?.text || "N/A"}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Settings */}
                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Banknote className="w-4 h-4 text-blue-600" />
                                    Payment Settings
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                                        <span className="text-sm font-medium text-gray-700">Online Payment</span>
                                        <div className="flex items-center gap-2">
                                            {data.is_online_payment_allowed ? (
                                                <>
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                    <span className="text-sm font-semibold text-green-600">Allowed</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-5 h-5 text-red-500" />
                                                    <span className="text-sm font-semibold text-red-600">Not Allowed</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                                        <span className="text-sm font-medium text-gray-700">Partial Payment</span>
                                        <div className="flex items-center gap-2">
                                            {data.is_partial_payment_allowed ? (
                                                <>
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                    <span className="text-sm font-semibold text-green-600">Allowed</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-5 h-5 text-red-500" />
                                                    <span className="text-sm font-semibold text-red-600">Not Allowed</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Fee Breakdown */}
                            {data.fee_types_amount?.body && (
                                <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
                                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-5 py-4 border-b border-gray-200">
                                        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-purple-600" />
                                            Fee Breakdown
                                        </h4>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                        Fee Type
                                                    </th>
                                                    <th className="text-right px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                        Regular
                                                    </th>
                                                    <th className="text-right px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                        New
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {data.fee_types_amount.body.map((f) => (
                                                    <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                            {f.name}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">
                                                            ₹{formatCurrency(f.regular_students)}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-right font-semibold text-blue-600">
                                                            ₹{formatCurrency(f.new_students)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            {data.fee_types_amount.footer && (
                                                <tfoot className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t-2 border-blue-200">
                                                    <tr>
                                                        <td className="px-4 py-4 text-sm font-bold text-gray-900">
                                                            {data.fee_types_amount.footer.name}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-right font-bold text-green-700">
                                                            ₹{formatCurrency(data.fee_types_amount.footer.regular_students)}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-right font-bold text-blue-700">
                                                            ₹{formatCurrency(data.fee_types_amount.footer.new_students)}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            )}
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Class Fee Data */}
                            {data.class_fee_data && data.class_fee_data.length > 0 && (
                                <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-5 py-4 border-b border-gray-200">
                                        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                            <Users className="w-4 h-4 text-green-600" />
                                            Class Fee Summary
                                        </h4>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 sticky top-0">
                                                <tr>
                                                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                        Class
                                                    </th>
                                                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                        Teacher
                                                    </th>
                                                    <th className="text-right px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                        Students
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {data.class_fee_data.map((cls) => (
                                                    <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                                            {cls.name}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">
                                                            {cls.class_teacher?.name || "N/A"}
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                                                <Users className="w-3 h-3" />
                                                                {cls.number_of_students}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Total Collection Summary */}
                            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-semibold opacity-90">Total Collected</span>
                                </div>
                                <div className="text-4xl font-bold flex items-center gap-2">
                                    <IndianRupee className="w-8 h-8" />
                                    {formatCurrency(data?.standard?.amount_collected?.Total ?? 0)}
                                </div>
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <ReceiptIndianRupee className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">No Fee Data Available</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Backdrop */}
            {drawerOpen && (
                <div
                    onClick={() => setDrawerOpen(false)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 cursor-pointer"
                />
            )}
        </>
    );
};

export default FeeTypeDetail;