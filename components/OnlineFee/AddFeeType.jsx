import React, { useState, useEffect } from "react";
import { X, Save, Layers, Info, Check, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { getFee, addVariableFeeTypeStudentApi, addFeeType } from "../../api/fees";

export default function AddFeeType({
  open,
  onClose,
  context,
  onSuccess, // Callback to refresh table
  fees
}) {
  if (!open) return null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // FORM STATE
  const [formData, setFormData] = useState({
    sn: "",
    name: "",
    code: "",
    parent_id: "",
    is_miscellaneous: false,
    is_editable: false,
    is_applicable_for_new_students: false,
    is_variable: false,
    is_applicable_for_promoted_students: false,
    is_optional: false,
    is_applicable_for_concession: false,
  });



  const handleToggle = (key) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const handleSubmit = async () => {
    setSubmitted(true);
    setError(null);
    setSuccess(null);

    try {


      const resp = await addFeeType(
        context.profileId,
        context.session,
        formData
      );

      console.log('resp', resp);

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
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]" />

      <div className="fixed right-0 top-0 h-full w-full sm:w-[550px] bg-white z-[101] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

        {/* HEADER */}
        <div className="p-6 border-b flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">
              <Layers size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Create Fee Type</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Configuration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition text-slate-400">
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">

          {/* BASIC INFO SECTION */}
          <section className="space-y-4">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
              <Info size={14} /> Basic Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 ml-1">Serila No.</label>
                <input
                  type="text"
                  placeholder="e.g. Tuition Fee"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all"
                  value={formData.sn}
                  onChange={(e) => setFormData({ ...formData, sn: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 ml-1">Fee Name</label>
                <input
                  type="text"
                  placeholder="e.g. Tuition Fee"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 ml-1">Fee Code</label>
                <input
                  type="text"
                  placeholder="TF-001"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all uppercase"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 ml-1">Parent Fee Category</label>
              <select
                value={formData.parent_id}
                onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all appearance-none"
              >
                <option value="">Select Parent Fee...</option>
                {fees?.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
          </section>

          {/* ATTRIBUTES TOGGLE SECTION */}
          <section className="space-y-4">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
              <Check size={14} /> Behavioral Attributes
            </h3>

            <div className="grid grid-cols-1 gap-2">
              {[
                { key: "is_miscellaneous", label: "Miscellaneous Fee", desc: "Flag as additional/non-standard charge" },
                { key: "is_editable", label: "Allow Price Editing", desc: "Staff can override the amount during collection" },
                { key: "is_applicable_for_new_students", label: "New Students Only", desc: "Only visible for fresh admissions" },
                { key: "is_variable", label: "Variable Amount", desc: "Amount changes based on student context" },
                { key: "is_applicable_for_promoted_students", label: "Promoted Students", desc: "Visible only for existing students" },
                { key: "is_optional", label: "Optional Selection", desc: "Students can choose to opt-out" },
                { key: "is_applicable_for_concession", label: "Allow Concessions", desc: "Eligible for scholarship/discount rules" },
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => handleToggle(item.key)}
                  className={`group flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData[item.key] ? "bg-indigo-50 border-indigo-200 shadow-sm" : "bg-white border-slate-50 hover:border-slate-200"
                    }`}
                >
                  <div className="flex flex-col">
                    <span className={`text-sm font-bold ${formData[item.key] ? "text-indigo-700" : "text-slate-700"}`}>
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{item.desc}</span>
                  </div>

                  {/* Custom Toggle Switch */}
                  <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${formData[item.key] ? "bg-indigo-600" : "bg-slate-200"}`}>
                    <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all duration-300 shadow-sm ${formData[item.key] ? "left-7" : "left-1"}`} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t bg-slate-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 px-4 rounded-2xl bg-white border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            disabled={loading || !formData.name}
            onClick={handleSubmit}
            className="flex-[2] flex items-center justify-center gap-2 py-4 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Save Fee Configuration</>}
          </button>
        </div>
      </div>



      {/* Floating Notifications */}
      <div className="fixed top-6 right-6 flex flex-col gap-3 z-9999">
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
}