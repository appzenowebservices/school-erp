import React, { useState, useEffect } from "react";
import { X, CheckCircle, CreditCard, Layers, Hash, Loader2, Save } from "lucide-react";
import { getFee } from "../../api/fees";
import { getSessionCache } from "../../utils/sessionCache";

export default function ManageAccessModal({
  open,
  onClose,
  feeTypes = [],
  onUpdate,
  loading,
}) {
  const [selectedFees, setSelectedFees] = useState([]);
  const [selectedFeeTypeId, setSelectedFeeTypeId] = useState("");
  const [amount, setAmount] = useState("");
  const [fees, setFees] = useState([]);

  const context = getSessionCache("dashboardContext");

  const fetchFees = async () => {
    try {
      const re = await getFee(context?.profileId, context?.session, 1, 50);
      if (re.status) {
        setFees(re?.data?.results?.fees || []);
      }
    } catch (error) {
      console.error("Error fetching fees:", error);
    }
  };

  useEffect(() => {
    if (open) fetchFees();
  }, [open]);

  const toggleFee = (id) => {
    setSelectedFees((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop with higher z-index to sit on top of the first modal */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] transition-opacity"
      />

      {/* Centered Modal (Better for sub-tasks) */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white z-[201] shadow-2xl rounded-3xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 leading-tight">Allocation Detail</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assign Installments</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          
          {/* 1. Multi Select Fees (Installments) */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[13px] font-bold text-slate-600 uppercase">
              <CheckCircle size={14} className="text-indigo-500" />
              Select Installments
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {fees.map((fee) => {
                const isSelected = selectedFees.includes(fee.id);
                return (
                  <div
                    key={fee.id}
                    onClick={() => toggleFee(fee.id)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                      isSelected 
                        ? "bg-indigo-50 border-indigo-500 shadow-sm" 
                        : "bg-white border-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <span className={`text-sm font-bold ${isSelected ? "text-indigo-700" : "text-slate-600"}`}>
                      {fee.name}
                    </span>
                    <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                      isSelected ? "bg-indigo-600 border-indigo-600" : "bg-white border-slate-200"
                    }`}>
                      {isSelected && <CheckCircle size={12} className="text-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Fee Type Dropdown */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[13px] font-bold text-slate-600 uppercase">
              <CreditCard size={14} className="text-indigo-500" />
              Assign Category
            </label>
            <select
              value={selectedFeeTypeId}
              onChange={(e) => setSelectedFeeTypeId(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-100 px-4 py-3 rounded-xl focus:border-indigo-500 focus:bg-white outline-none font-medium text-slate-700 transition-all appearance-none cursor-pointer"
            >
              <option value="">Select Fee Type...</option>
              {feeTypes.map((ft) => (
                <option key={ft.id} value={ft.id}>{ft.name}</option>
              ))}
            </select>
          </div>

          {/* 3. Amount Field */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[13px] font-bold text-slate-600 uppercase">
              <Hash size={14} className="text-indigo-500" />
              Override Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-50 border-2 border-slate-100 pl-10 pr-4 py-3 rounded-xl focus:border-indigo-500 focus:bg-white outline-none font-bold text-lg text-slate-800 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Footer with sticky action button */}
        <div className="p-5 bg-slate-50 border-t">
          <button
            disabled={loading || !selectedFeeTypeId || selectedFees.length === 0}
            onClick={() => onUpdate?.({
              selectedFees,
              selectedFeeTypeId,
              amount: Number(amount)
            })}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Save size={20} />
                Update Student Fee
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}