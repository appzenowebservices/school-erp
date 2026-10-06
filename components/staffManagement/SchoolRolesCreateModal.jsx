import React, { useState } from "react";
import { X, Briefcase, Building2, CheckCircle2, AlertCircle, Loader2, PlusCircle } from "lucide-react";

export default function SchoolRolesCreateModal({
  open,
  onClose,
  onCreate,
  context
}) {
  const [form, setForm] = useState({
    name: "",
    isTeachingStaff: false,
    isBusConductor: false,
    description: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    setSubmitted(true);
    setError(null);
    setSuccess(null);
  console.log('form', form.isBusConductor);

    try {
      const payload = {
        name: form.name?.trim(),
        isTeachingStaff: form.isTeachingStaff ? "1" : "0",
        isBusConductor: form.isBusConductor ? "1" : "0",
        description: form.description
      };

      if (!payload.name) {
        setError("Please provide a name for the new role");
        setSubmitted(false);
        return;
      }

      const resp = await onCreate(
        context?.profileId,
        context?.session,
        payload);

      if (resp?.data?.success) {
        setSuccess(resp?.data?.results?.message || "Role created successfully");
        setTimeout(() => {
          setSuccess(null);
          onClose();
          window.location.reload();
        }, 1200);
      } else {
        setError(resp?.data?.results?.message || "Failed to create role");
        setSubmitted(false);
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
      setSubmitted(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="px-8 py-7 flex justify-between items-center bg-white border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">New School Role</h2>
              <p className="text-slate-500 text-sm font-medium">Define a new staff designation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">

          {/* Input: Role Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Role Name <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                value={form.name}
                onChange={e => update("name", e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
                placeholder="e.g. Department Head"
              />
            </div>
          </div>

          {/* Category Selection Grid */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 ml-1">Role Classification</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => update("isTeachingStaff", !form.isTeachingStaff)}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col gap-3 text-left ${form.isTeachingStaff
                    ? "border-blue-500 bg-blue-50/50 ring-4 ring-blue-500/5"
                    : "border-slate-100 bg-white hover:border-slate-200"
                  }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${form.isTeachingStaff ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                  <CheckCircle2 size={16} />
                </div>
                <p className={`text-sm font-bold ${form.isTeachingStaff ? "text-blue-900" : "text-slate-700"}`}>Teaching Staff</p>
              </button>

              <button
                onClick={() => update("isBusConductor", !form.isBusConductor)}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col gap-3 text-left ${form.isBusConductor
                    ? "border-blue-500 bg-blue-50/50 ring-4 ring-blue-500/5"
                    : "border-slate-100 bg-white hover:border-slate-200"
                  }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${form.isBusConductor ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                  <CheckCircle2 size={16} />
                </div>
                <p className={`text-sm font-bold ${form.isBusConductor ? "text-blue-900" : "text-slate-700"}`}>Bus Conductor</p>
              </button>
            </div>
          </div>

          {/* Input: Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Responsibilities / Description</label>
            <textarea
              value={form.description}
              onChange={e => update("description", e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-800 resize-none min-h-[100px]"
              placeholder="Enter role details..."
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={submitted}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:text-slate-700 transition-colors"
          >
            Discard
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitted}
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            {submitted ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 size={18} />
            )}
            <span>Save Role</span>
          </button>
        </div>
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
              <p className="text-xs font-medium text-slate-500">{success}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}