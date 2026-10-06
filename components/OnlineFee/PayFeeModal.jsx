"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  CreditCard,
  Calendar,
  Bus,
  Building2,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Banknote,
  ChevronRight
} from "lucide-react";
import Loader from "../ui/status/Loader";
import { getFeePaymentDetails, markStudentFee } from "../../api/fees";

export default function PayFeeModal({
  selectedFees = [],
  open,
  onClose,
  context,
  config,
  selectedStudent
}) {

  // --- 1. HOOKS & STATE ---
  const [formData, setFormData] = useState({
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMode: "Cash",
    busId: "",
    transport_fee: "",
    location: "",
    bankName: "",
    remarks: ""
  });

  const [loading, setLoading] = useState(false);
  const [loadingLedger, setLoadingLedger] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [schoolBuses, setSchoolBuses] = useState([]);
  const [bank, setBank] = useState([]);
  const [submitted, setSubmitted] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // States for derived calculations
  const [feeTotals, setFeeTotals] = useState({
    subtotal: 0,
    calculatedLateFee: 0,
    grandTotal: 0
  });
  const [editableLateFee, setEditableLateFee] = useState(0);

  // --- 2. API FUNCTIONS ---
  const fetchFeePaymentDetails = async () => {
    if (!open) return;
    setLoadingLedger(true);
    try {
      const res = await getFeePaymentDetails(
        context?.profileId,
        context?.session
      );
      // console.log('res___', res);

      if (res?.data?.success) {
        setSchoolBuses(res?.data?.results?.school_buses || []);
        setBank(res?.data?.results?.banks || []);
      }
    } catch (err) {
      console.error("Ledger Fetch Error:", err);
    } finally {
      setLoadingLedger(false);
    }
  };

  // --- 3. EFFECTS ---
  useEffect(() => {
    if (open) {
      fetchFeePaymentDetails();
    }
  }, [open]);

  // Derived calculation based on selectedFees objects
  useEffect(() => {
    if (selectedFees.length > 0) {
      const subtotal = selectedFees.reduce((acc, fee) => {
        // Calculate amount without late fee: amount_to_be_paid - late_fee
        const pureAmount = (fee.amount_to_be_paid || 0) - (fee.late_fee || 0);
        return acc + pureAmount;
      }, 0);

      const lateFeeTotal = selectedFees.reduce((acc, fee) => acc + (fee.late_fee || 0), 0);

      setFeeTotals({
        subtotal,
        calculatedLateFee: lateFeeTotal,
        grandTotal: subtotal + lateFeeTotal
      });

      setEditableLateFee(lateFeeTotal);
    }
  }, [selectedFees]);

  if (!open) return null;



  const handlePay = async () => {
    setSubmitted(true); // Assuming 'submitted' controls your loading state/spinner
    setError(null);
    setSuccess(null);

    try {
      // 1. Construct the payload based on form state and breakdown
      const payload = {
        student_id: selectedStudent?.id,
        payment_date: formData.paymentDate,
        payment_mode_id: formData.paymentMode,
        bus_id: formData.busId,
        transport_fee: formData.transport_fee,
        location: formData.location,
        bank_name: formData.bankName,
        remarks: formData.remarks,
        // Map selected fees and include the late fee currently in state
        // fee_ids: selectedFees.map(fee => ({
        //   id: fee.id,
        //   amount: (fee.amount_to_be_paid || 0) - (fee.late_fee || 0),
        //   late_fee: editableLateFee / selectedFees.length, // Distributing late fee if multiple selected, or handle per business logic
        // })),
        fee_ids: selectedFees.map(fee => (fee.id)),
        amount: feeTotals.subtotal + Number(editableLateFee) + Number(formData.transport_fee || 0)
      };

      console.log('payload fees +___+_______', payload);

      
      const resp = await markStudentFee(
        context?.profileId,
        context?.session,
        payload // Passing the constructed data
      );

      if (resp?.data?.success) {
        setSuccess(resp?.data?.results?.message || "Fee payment recorded successfully");

        setTimeout(() => {
          setSuccess(null);
          onClose(); // Close the modal
          // Using your pattern to refresh the data view
          window.location.reload();
        }, 1500);

        setSubmitted(false);
      } else {
        setError(resp?.data?.results?.message || "Failed to record payment");
        setSubmitted(false);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Something went wrong while processing payment");
      setSubmitted(false);
    }
  };


  // --- 4. HANDLERS ---
  const handlePay_ = async () => {
    setLoading(true);
    // Logic for processing final payment using formData + selectedFees + editableLateFee
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => onClose(), 1500);
    }, 1000);
  };

  const banksList = [
    "HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank",
    "Kotak Mahindra Bank", "Punjab National Bank", "Bank of Baroda"
  ];
  // Find the currently selected bus object to get its specific stops
  const selectedBusData = schoolBuses.find(bus => String(bus.id) === String(formData.busId));

  const handleBusChange = (e) => {
    const selectedBusId = e.target.value;
    setFormData({
      ...formData,
      busId: selectedBusId,
      location: "" // Reset location when bus changes
    });
  };
  // console.log('config?.modes', config);

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]" />

      <div className="fixed right-0 top-0 h-full w-full sm:w-[550px] bg-[#F8FAFC] z-[70] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

        {/* HEADER */}
        <div className="px-8 py-6 bg-white border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Collect Student Fee</h2>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-1">Payment Processing Terminal</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">

          {/* PAYMENT TRANSACTION DETAILS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase ml-1">
                <Calendar size={14} /> Payment Date
              </label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                className="w-full bg-white border-2 border-slate-100 px-4 py-2.5 rounded-xl focus:border-blue-500 outline-none font-bold text-slate-700 shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase ml-1">
                <CreditCard size={14} /> Mode
              </label>
              <select
                value={formData.paymentMode}
                onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                className="w-full bg-white border-2 border-slate-100 px-4 py-2.5 rounded-xl focus:border-blue-500 outline-none font-bold text-slate-700 shadow-sm"
              >
                {config?.payment_modes?.map((mode, idx) => <option key={idx} value={mode?.id}>{mode?.name}</option>)}
              </select>
            </div>
          </div>

          {/* TRANSPORT LOGIC */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase ml-1">
                <Bus size={14} /> Bus No.
              </label>
              <select
                value={formData.busId}
                onChange={handleBusChange}
                className="w-full bg-white border-2 border-slate-100 px-4 py-2.5 rounded-xl focus:border-blue-500 outline-none font-bold text-slate-700 shadow-sm"
              >
                <option value="">Select Bus</option>
                {schoolBuses?.map((opt, idx) => (
                  <option key={idx} value={opt.id}>
                    {opt.bus_no || opt.number || `Bus ${opt.id}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase ml-1">
                Location
              </label>
              <select
                value={formData.location}
                onChange={(e) => {
                  const selectedStop = selectedBusData?.locations?.[e.target.selectedIndex - 1];
                  setFormData({
                    ...formData,
                    location: selectedStop?.name || e.target.value,
                    transport_fee: selectedStop?.transport_fee || "",
                  });
                }}
                disabled={!formData.busId}
                className="w-full bg-white disabled:bg-slate-50 border-2 border-slate-100 px-4 py-2.5 rounded-xl focus:border-blue-500 outline-none font-bold text-slate-700 shadow-sm appearance-none"
              >
                <option value="">
                  {formData.busId ? "Select Stop/Location" : "Select Bus First"}
                </option>

                {/* Map through the stops of the currently selected bus */}
                {selectedBusData?.locations?.map((stop, idx) => (
                  <option key={idx} value={stop.name || stop}>
                    {stop.name || stop}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* BANKING DETAILS */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase ml-1">
              <Building2 size={14} /> Bank Name
            </label>
            <select
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              className="w-full bg-white border-2 border-slate-100 px-4 py-2.5 rounded-xl focus:border-blue-500 outline-none font-bold text-slate-700 shadow-sm"
            >
              <option value="">Select Bank</option>
              {config?.banks?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>

          {/* REMARKS */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase ml-1">
              <MessageSquare size={14} /> Remarks
            </label>
            <textarea
              rows="2"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Payment notes..."
              className="w-full bg-white border-2 border-slate-100 px-4 py-2.5 rounded-xl focus:border-blue-500 outline-none font-medium text-slate-700 shadow-sm"
            />
          </div>

          {/* FEE SUMMARY CARD (PAYMENT BREAKDOWN) */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Banknote size={80} />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-slate-400">Payment Breakdown</h3>

            {/* Dynamic selected fees list inside breakdown */}
            <div className="space-y-3 mb-4 border-b border-slate-800 pb-4">
              {selectedFees.map((fee) => (
                <div key={fee.id} className="space-y-1">
                  <div className="flex justify-between items-center group">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
                      <span className="text-slate-300 font-medium text-sm">{fee.name}</span>
                    </div>
                    <span className="font-bold text-sm text-slate-100">
                      ₹{((fee.amount_to_be_paid || 0) - (fee.late_fee || 0)).toLocaleString()}
                    </span>
                  </div>
                  {/* Small sub-breakdown for Late Fee per item if exists */}
                  {fee.late_fee > 0 && (
                    <div className="flex justify-between items-center pl-4 opacity-70 text-[11px]">
                      <span className="font-medium italic">Incl. {fee.name} Late Fee</span>
                      <span className="font-bold">₹{fee.late_fee.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              ))}



              {/* Transport Fee  breakdown */}
              {formData.transport_fee && (
                <div className="flex justify-between items-center text-cyan-400 pt-2 border-t border-slate-800/50 mt-2">
                  <span className="font-medium text-sm">Transport Fee</span>
                  <span className="font-bold text-sm">₹{Number(formData.transport_fee).toLocaleString()}</span>
                </div>
              )}

              {/* Editable Late Fee Row inside breakdown */}
              <div className="flex justify-between items-center text-rose-400 pt-2 border-t border-slate-800/50 mt-2">
                <span className="font-medium text-sm">Adjustment Late Fee</span>
                <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-lg px-2">
                  <span className="text-xs">₹</span>
                  <input
                    type="number"
                    value={editableLateFee}
                    onChange={(e) => setEditableLateFee(Number(e.target.value))}
                    className="bg-transparent border-none outline-none font-bold w-20 py-1 text-right focus:ring-0 text-rose-400 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-blue-400 uppercase">Total Payable</p>
                <p className="text-3xl font-black">
                  ₹{(feeTotals.subtotal + Number(editableLateFee) + Number(formData.transport_fee || 0)).toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg text-[10px] font-black border border-blue-500/30 uppercase tracking-tighter">
                Verified Amount
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-8 bg-white border-t">
          <button
            onClick={handlePay}
            disabled={loading || selectedFees.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader size="xs" color="white" /> : (
              <>
                <CheckCircle2 size={18} />
                Confirm & Print Receipt
              </>
            )}
          </button>
        </div>


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
      </div>
    </>
  );
}