"use client";
import React, { useState, useMemo, useEffect } from "react";
import { X, CheckCircle, Search, User, CreditCard, Calendar, Repeat, CheckCircle2, AlertCircle } from "lucide-react";
import ManageAccessModal from "./ManageAccessModal";
import { getFeeTypes, addVariableFeeTypeStudentApi, addLateFee, getFee } from "../../api/fees";
import ConfirmationDialogueBox from "../ui/status/Confirmation";
import Loader from "../ui/status/Loader";

export default function AddLateFee({
  open,
  onClose,
  config,
  context,
  setSelectedStudent,
  selectedStudent
}) {
  if (!open) return null;

  const [selectedStandardId, setSelectedStandardId] = useState("");
  const [search, setSearch] = useState("");
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [fees, setFees] = useState([]);

  // New Form States
  const [selectedFees, setSelectedFees] = useState([]); // Multi-select
  const [lateFeeAmount, setLateFeeAmount] = useState("");
  const [lateFeeType, setLateFeeType] = useState("Fixed"); // Dropdown
  const [isRecurring, setIsRecurring] = useState(false);

  const [apiResponse, setApiResponse] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchFeesTypes = async () => {
    try {
      const re = await getFee(context?.profileId, context?.session, 1, 50);
      if (re.status) setFees(re?.data?.results?.fees || []);
    } catch (error) {
      console.error("Error fetching fees:", error);
    }
  };

  useEffect(() => { fetchFeesTypes(); }, []);

  const selectedStandard = useMemo(() => {
    return config?.standards?.find(s => String(s.id) === String(selectedStandardId));
  }, [selectedStandardId, config]);

  const allStudents = useMemo(() => {
    if (!selectedStandard) return [];
    const items = selectedStandard.classes?.flatMap(cls =>
      cls.students?.map(stu => ({ ...stu, className: cls.name }))
    );
    const q = search.toLowerCase();
    return items.filter(stu =>
      stu.name.toLowerCase().includes(q) ||
      String(stu.admission_no || "").includes(q)
    );
  }, [selectedStandard, search]);

  const handleSubmit = async () => {
    // setSubmitted(true);
    setError(null);
    setShowSuccess(null);

    try {
      const payload = {

        "fee_ids": selectedFees,
        "amount": lateFeeAmount,
        "type": lateFeeType,
        "is_recurring": isRecurring ? "1" : "0",
      }
      console.log('payload___', payload);
      const resp = await addLateFee(
        context?.profileId,
        context?.session,
        payload
      );
      console.log('resp___', resp);

      if (resp?.data?.success) {
        setShowSuccess(resp?.data?.results?.message || "Role deleted successfully");

        setTimeout(() => {
          setShowSuccess(null);
          // setDepartmentToDelete(null);
          window.location.reload(); // keeping your pattern
        }, 700);

        // setSubmitted(false);
      } else {
        setError(resp?.data?.results?.message || "Failed to delete Role");
        // setSubmitted(false);
      }
    } catch (err) {
      console.error("Role delete error:", err);
      setError(err.message || "Something went wrong while deleting Role");
      // setSubmitted(false);
    }
  };


  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity" />

      <div className="fixed right-0 top-0 h-full w-full sm:w-[520px] bg-white z-50 shadow-2xl flex flex-col rounded-l-3xl overflow-hidden">

        {/* HEADER */}
        <div className="px-8 py-6 bg-slate-50 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Configure Late Fee</h2>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1 text-blue-600">Manual Entry Console</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-slate-200">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">

          {/* STEP 1: CLIENT SELECTION */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400">
              <User size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Step 1: Select Client</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <select
                  value={selectedStandardId}
                  onChange={e => { setSelectedStandardId(e.target.value); setSelectedStudent(null); }}
                  className="w-full bg-slate-50 border-slate-200 border-2 px-4 py-2.5 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                >
                  <option value="">Choose Client</option>
                  {/* {config?.clients?.map(std => <option key={std.id} value={std.id}>{std.name}</option>)} */}
                  {[{
                    name: "DEMO SCHOOL BANKURA",
                    id: "2200"
                  }].map(std => <option key={std.id} value={std.id}>{std.name}</option>)}
                </select>
              </div>

            </div>


          </section>

          {/* STEP 2: FEE CONFIGURATION */}
          <section className="space-y-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-400">
              <CreditCard size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Step 2: Fee Details</span>
            </div>

            <div className="space-y-4">
              {/* Multi-select Fee Head */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700 ml-1">Select Applicable Fees</label>
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border-2 border-slate-200 rounded-xl min-h-[50px]">
                  {fees.map(f => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setSelectedFees(prev => prev.includes(f.id) ? prev.filter(id => id !== f.id) : [...prev, f.id])
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedFees.includes(f.id)
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "bg-white text-slate-500 border border-slate-200 hover:border-blue-300"
                        }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 ml-1">Late Fee Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={lateFeeAmount}
                    onChange={(e) => setLateFeeAmount(e.target.value)}
                    className="w-full bg-slate-50 border-slate-200 border-2 px-4 py-2.5 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 ml-1">Late Fee Type</label>
                  <select
                    value={lateFeeType}
                    onChange={(e) => setLateFeeType(e.target.value)}
                    className="w-full bg-slate-50 border-slate-200 border-2 px-4 py-2.5 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quaterly</option>
                    <option value="4MONTHS">4-Monthly</option>
                    <option value="HALFYEARLY">Half Yearly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>
              </div>

              {/* Recurring Toggle */}
              <div
                onClick={() => setIsRecurring(!isRecurring)}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${isRecurring ? "border-blue-500 bg-blue-50/50" : "border-slate-100 bg-slate-50 hover:border-slate-200"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isRecurring ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    <Repeat size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Recurring Charge</p>
                    <p className="text-[10px] text-slate-500 font-medium italic">Apply this fee automatically every cycle</p>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${isRecurring ? 'bg-blue-600' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isRecurring ? 'left-6' : 'left-1'}`} />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-8 border-t bg-white">
          <button
            disabled={selectedFees.length === 0}
            onClick={handleSubmit}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${selectedFees.length === 0
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-blue-600 hover:shadow-blue-200 active:scale-95"
              }`}
          >
            {loading ? <Loader size="xs" /> : "Apply Transaction"}
          </button>
          <p className="text-[10px] text-center text-slate-400 mt-4 font-bold uppercase tracking-tighter">
            System will log this entry for auditing automatically
          </p>
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

          {showSuccess && (
            <div className="bg-white border-l-4 border-green-500 shadow-2xl rounded-2xl px-5 py-4 flex items-center gap-4 animate-in slide-in-from-right">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Done!</p>
                <p className="text-xs font-medium text-slate-500">{showSuccess}</p>
              </div>
            </div>
          )}
        </div>
      </div>

    </>
  );
}