"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Trash2,
  Download,
  CheckCircle2,
  CreditCard,
  FileText,
  Wallet,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { getStudentFeeDetails } from "../../api/fees";
import Loader from "../ui/status/Loader";
import { getSessionCache } from "../../utils/sessionCache";
import PayFeeModal from "./PayFeeModal";
import { TbDatabaseSearch } from "react-icons/tb";

export default function MarkStudentDrawer({ open, onClose, selectedStudent }) {
  const context = getSessionCache("dashboardContext");
  const config = getSessionCache("dashboardConfig");

  const [ledgerData, setLedgerData] = useState(null);
  const [selectedFees, setSelectedFees] = useState([]);
  const [loadingLedger, setLoadingLedger] = useState(false);
  const [payFee, setPayFee] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && selectedStudent?.id) {
      fetchStudentLedger();
    }
  }, [open, selectedStudent]);

  const fetchStudentLedger = async () => {
    setLoadingLedger(true);
    try {
      const res = await getStudentFeeDetails(
        context?.profileId,
        context?.session,
        selectedStudent?.id
      );
      if (res?.data?.success) {
        setLedgerData(res?.data?.results);
      }
    } catch (err) {
      console.error("Ledger Fetch Error:", err);
    } finally {
      setLoadingLedger(false);
    }
  };

  const feesList = ledgerData?.student_fees?.fees || [];

  const selectedTotal = useMemo(() => {
    return selectedFees.reduce((sum, f) => sum + Number(f.total_fee_amount || 0), 0);
  }, [selectedFees]);

  const toggleSelectAll = () => {
    // Only allow selecting unpaid fees for bulk payment
    const unpaidFees = feesList.filter(f => !f.is_paid);
    if (selectedFees.length === unpaidFees.length) {
      setSelectedFees([]);
    } else {
      setSelectedFees([...unpaidFees]);
    }
  };

  const toggleFeeSelection = (fee) => {
    if (fee.is_paid) return; // Prevent selecting already paid fees
    setSelectedFees((prev) =>
      prev.some((f) => f.id === fee.id)
        ? prev.filter((f) => f.id !== fee.id)
        : [...prev, fee]
    );
  };

  const handleDownloadReceipt = (url) => {
    if (url) window.open(url, "_blank");
  };

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 transition-all" />

      <div className="fixed right-0 top-0 h-full w-full lg:w-[85%] bg-[#F8FAFC] z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
        {/* HEADER */}
        <div className="bg-white border-b px-8 py-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-600">
                <Wallet size={18} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Financial Ledger</span>
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Fee Details: <span className="text-blue-600">{selectedStudent?.name}</span>
              </h2>
              <div className="flex items-center gap-4 text-slate-500">
                <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-xs font-bold italic">
                  Class: {selectedStudent?.className || "N/A"}
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-xs font-bold">
                  UID: {selectedStudent?.admission_no || "N/A"}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex flex-col items-end mr-6 pr-6 border-r border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Outstanding Balance</span>
                <span className="text-2xl font-black text-rose-600">
                  ₹{ledgerData?.student_fees?.total_due?.toLocaleString() || "0"}
                </span>
              </div>
              <button onClick={onClose} className="p-3 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all border border-slate-100">
                <X size={20} />
              </button>
            </div>
          </div>


          {/* QUICK ACTIONS BAR */}
          <div className="flex justify-between items-center mt-8 p-2 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex gap-2">
              <button className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 shadow-sm transition-all">
                <Download size={14} className="text-emerald-500" /> Session Fee Receipt
              </button>
              <button className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 shadow-sm transition-all">
                <Download size={14} className="text-blue-500" /> Multiple Fee Receipts
              </button>
                <button className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 shadow-sm transition-all">
                <TbDatabaseSearch size={14} className="text-blue-500" /> Fee Receipts By Date
              </button>
            </div>
            <div className="text-[11px] font-bold text-slate-400 bg-white px-4 py-2 rounded-xl border border-slate-200">
              Session: {context?.session || '2024-25'}
            </div>
          </div>
        </div>



        {/* MAIN TABLE AREA */}
        <div className="flex-1 overflow-auto p-8">
          {loadingLedger ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <Loader />
              <p className="text-xs font-bold text-slate-400 animate-pulse uppercase tracking-widest">Reconstructing Ledger...</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="p-5 w-12">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded-lg border-slate-700 text-blue-500 focus:ring-blue-500 transition-all cursor-pointer"
                        checked={selectedFees.length > 0 && selectedFees.length === feesList.filter(f => !f.is_paid).length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Fee Category</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Amount</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Paid</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Balance</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {feesList.map((fee) => {
                    const isSelected = selectedFees.some((f) => f.id === fee.id);
                    const isPaid = fee.is_paid === true || fee.payment_status === "FULLY PAID";

                    return (
                      <tr
                        key={fee.id}
                        onClick={() => toggleFeeSelection(fee)}
                        className={`group cursor-pointer transition-all ${isPaid ? 'bg-slate-50/30' : isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                      >
                        <td className="p-5">
                          {!isPaid && (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              className="w-5 h-5 rounded-lg text-blue-600"
                            />
                          )}
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${isPaid ? 'bg-emerald-100 text-emerald-600' : isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                              <CreditCard size={18} />
                            </div>
                            <div>
                              <div className="text-sm font-black text-slate-800">{fee.name}</div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                {isPaid ? `Paid On: ${fee.fee_paid_by?.time?.split(' ')[0] || 'N/A'}` : `Due: ${fee.due_date || 'N/A'}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-5 text-right font-bold text-slate-700">₹{Number(fee.total_fee_amount || 0).toLocaleString()}</td>
                        <td className="p-5 text-right font-bold text-emerald-600">₹{Number(fee.amount_paid || 0).toLocaleString()}</td>
                        <td className="p-5 text-right font-black text-slate-900">₹{Number(fee.amount_to_be_paid || 0).toLocaleString()}</td>
                        <td className="p-5 text-center">
                          {isPaid ? (
                            <div className="flex flex-col items-center gap-1">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase border border-emerald-100">
                                <CheckCircle2 size={12} /> Fully Paid
                              </span>
                              {fee.fee_paid_by && (
                                <span className="text-[8px] font-bold text-slate-400 uppercase">By: {fee.fee_paid_by.name}</span>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-black uppercase border border-rose-100">
                              <AlertCircle size={12} /> Unpaid
                            </span>
                          )}
                        </td>
                        <td className="p-5 text-center">
                          <div className="flex justify-center gap-2">
                            {isPaid && fee.fee_receipt?.url && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDownloadReceipt(fee.fee_receipt.url); }}
                                className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
                                title="Download Receipt"
                              >
                                <Download size={16} />
                              </button>
                            )}
                            <button className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="bg-white border-t p-8 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Summary</span>
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500">Heads Selected</span>
                  <span className="text-lg font-black text-slate-800">{selectedFees.length} <span className="text-xs font-medium text-slate-400">Items</span></span>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500">Processing Amount</span>
                  <span className="text-lg font-black text-blue-600">₹{selectedTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                disabled={selectedFees.length === 0 || submitting}
                onClick={() => setPayFee(true)}
                className="relative group overflow-hidden bg-slate-900 disabled:bg-slate-200 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-slate-200 transition-all hover:bg-blue-600 active:scale-95"
              >
                {submitting ? <Loader size="xs" color="white" /> : (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={16} /> Proceed to Pay
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <PayFeeModal
        onClose={() => { setPayFee(false); fetchStudentLedger(); }} // Refresh ledger on modal close
        open={payFee}
        selectedFees={selectedFees}
        context={context}
        config={config}
        selectedStudent={selectedStudent}
      />
    </>
  );
}