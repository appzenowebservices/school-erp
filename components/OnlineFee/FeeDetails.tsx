"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { getFeeTypeDetail } from "../../api/fees";
import { getSessionCache } from "../../utils/sessionCache";
import Loader from "../ui/status/Loader";
import {
    CalendarDays,
    CreditCard,
    Users,
    Info,
    ChevronRight,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

export default function FeeDetails({ id, guid, schoolId }) {
    const context = getSessionCache('dashboardContext');
    const profileId = context?.profileId;
    const sessionId = context?.session;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pro-pattern: Use useRef for tracking component mount status
    const isMounted = useRef(true);

    const fetchFee = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            setError(null);

            const resp = await getFeeTypeDetail({
                profileId,
                sessionId,
                feeTypeId: id
            });

            if (isMounted.current) {
                if (resp?.data?.success) {
                    setData(resp?.data?.results);
                } else {
                    setError("Unable to retrieve fee structure details.");
                }
            }
        } catch (e) {
            if (isMounted.current) setError("A system error occurred. Please try again.");
        } finally {
            if (isMounted.current) setLoading(false);
        }
    }, [id, profileId, sessionId]);

    useEffect(() => {
        isMounted.current = true;
        fetchFee();
        return () => { isMounted.current = false; };
    }, [fetchFee]);

    if (!id) return null;

    if (loading) return (
        <div className="flex h-64 flex-col items-center justify-center gap-3"><Loader /><span className="text-sm font-semibold text-slate-500">Syncing Fee Records...</span></div>
    );

    if (error) return (
        <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <span className="font-medium">{error}</span>
        </div>
    );

    const {
        name, amount, type, standard, start_date, end_date, due_date,
        is_disabled, show_break_up_on_receipt, is_online_payment_allowed, is_partial_payment_allowed,
        fee_types_amount, class_fee_data, include_transport_fee, is_hostel_fee
    } = data;

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">

            {/* 1. Header Card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center gap-5">
                        <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <CreditCard size={32} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
                                <StatusBadge active={!is_disabled} />
                            </div>
                            <p className="text-gray-500 font-medium mt-1">
                                Grade: <span className="text-gray-900">{standard?.name}</span> • Type: <span className="text-gray-900 uppercase tracking-wider text-xs">{type}</span>
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm min-w-[180px] text-center md:text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase">Total Consolidated</p>
                        <p className="text-3xl font-black text-blue-600">₹{Number(amount).toLocaleString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 border-t border-gray-100">
                    <DateTile icon={<CalendarDays size={18} />} label="Collection Starts" date={start_date?.text} color="text-emerald-600" />
                    <DateTile icon={<CalendarDays size={18} />} label="Collection Ends" date={end_date?.text} color="text-amber-600" />
                    <DateTile icon={<AlertCircle size={18} />} label="Final Due Date" date={due_date?.text} color="text-rose-600" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 2. Breakdown Table (Left 2/3) */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6">
                    {/* Header Section: Stack on mobile, side-by-side on desktop */}
                    <div className="flex flex-col mb-6 gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Info size={18} className="text-blue-500 shrink-0" />
                                <span>Component Breakdown</span>
                            </h3>
                        </div>

                        {/* Feature Tags: Flex wrap ensures they don't break the layout on small screens */}
                        <div className="flex flex-wrap gap-2">
                            <FeatureTag active={is_disabled} label="Is Disabled" />
                            <FeatureTag active={show_break_up_on_receipt} label="Show break-up" />
                            <FeatureTag active={is_online_payment_allowed} label="Online Pay" />
                            <FeatureTag active={is_partial_payment_allowed} label="Partial Pay" />
                            <FeatureTag active={include_transport_fee} label="Transport Fee" />
                            <FeatureTag active={is_hostel_fee} label="Hostel Fee" />
                        </div>
                    </div>

                    {/* Table Wrapper: overflow-x-auto is key for mobile responsiveness */}
                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="w-full text-sm min-w-[500px]"> {/* min-w prevents columns from squishing too much */}
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                                <tr>
                                    <th className="text-left px-4 sm:px-6 py-4">Fee Head</th>
                                    <th className="text-right px-4 sm:px-6 py-4">Regular Students</th>
                                    <th className="text-right px-4 sm:px-6 py-4">New Admissions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {fee_types_amount?.body?.map(row => (
                                    <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-4 sm:px-6 py-4 font-semibold text-gray-700">{row.name}</td>
                                        <td className="px-4 sm:px-6 py-4 text-right text-gray-600 whitespace-nowrap">₹{row.regular_students}</td>
                                        <td className="px-4 sm:px-6 py-4 text-right text-gray-600 whitespace-nowrap">₹{row.new_students}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-blue-50/50 font-bold border-t-2 border-blue-100">
                                <tr>
                                    <td className="px-4 sm:px-6 py-4 text-blue-800">Total Payable</td>
                                    <td className="px-4 sm:px-6 py-4 text-right text-blue-800 whitespace-nowrap">₹{fee_types_amount?.footer?.regular_students}</td>
                                    <td className="px-4 sm:px-6 py-4 text-right text-blue-800 whitespace-nowrap">₹{fee_types_amount?.footer?.new_students}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Mobile Hint (Optional) */}
                    <p className="mt-3 text-[10px] text-gray-400 text-center sm:hidden italic">
                        Scroll horizontally to view full table
                    </p>
                </div>

                {/* 3. Class Wise Status (Right 1/3) */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col max-h-[600px]">
                    {/* Header - Fixed */}
                    <div className="flex items-center justify-between mb-6 shrink-0">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Users size={18} className="text-purple-500" />
                            Class Reach
                        </h3>
                        <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                            {class_fee_data?.length || 0} Classes
                        </span>
                    </div>

                    {/* Scrollable List Container */}
                    <div className="relative flex-1 min-h-0">
                        <div className="h-full overflow-y-auto pr-2 space-y-3 custom-scrollbar scroll-smooth pb-4">
                            {class_fee_data?.map((cls) => (
                                <div
                                    key={cls.id}
                                    className="group p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-white hover:shadow-md hover:shadow-blue-50/50 transition-all cursor-pointer"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-900 truncate">{cls.name}</p>
                                            <p className="text-[11px] font-medium text-gray-400 uppercase mt-0.5 tracking-tighter truncate">
                                                In-charge: {cls.class_teacher?.name || "Not Assigned"}
                                            </p>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 shrink-0 transition-transform group-hover:translate-x-1" />
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-gray-200/60 flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Collection</span>
                                        <span
                                            className="text-xs font-black px-2 py-0.5 rounded-full"
                                            style={{
                                                backgroundColor: `${cls.payment_done_text?.text_color}15`, // Light transparent bg
                                                color: cls.payment_done_text?.text_color
                                            }}
                                        >
                                            {cls.payment_done_text?.text}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pro-touch: Fading gradient to indicate more content below */}
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none sticky" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* --- Styled Sub-components --- */

const DateTile = ({ icon, label, date, color }) => (
    <div className="flex items-center gap-4 p-5 border-r border-gray-100 last:border-none">
        <div className={`p-2 rounded-lg bg-gray-50 ${color}`}>{icon}</div>
        <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-sm font-bold text-gray-800">{date || "TBD"}</p>
        </div>
    </div>
);

const StatusBadge = ({ active }) => (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${active ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"
        }`}>
        {active ? "Active Structure" : "Archived"}
    </span>
);

const FeatureTag = ({ active, label }) => (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold border transition-colors ${active ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-gray-50 text-gray-400 border-gray-100"
        }`}>
        {active ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
        {label}
    </div>
);