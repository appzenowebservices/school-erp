import React, { useEffect, useState } from "react";
import { X, Briefcase, CheckCircle2, AlertCircle, Loader2, PencilLine } from "lucide-react";

export default function TitleEditModal({
  open,
  onClose,
  onUpdate,
  context,
  editingTitle
}) {
  const [form, setForm] = useState({ id: "", name: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (editingTitle && open) {
      setForm({
        id: String(editingTitle.id),
        name: editingTitle.name || "",
      });
      setError("");
    }
  }, [editingTitle, open]);

  if (!open) return null;

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    setSubmitted(true);
    setError(null);

    try {
      if (!form.name.trim()) throw new Error("Name is required");

      const payload = {
        id: form.id,
        name: form.name.trim()
      };

      const resp = await onUpdate(
        context?.profileId,
        context?.session,
        payload
      );

      if (resp?.data?.success) {
        setSuccess("Title updated successfully");
        setTimeout(() => {
          setSuccess(null);
          onClose();
          window.location.reload();
        }, 800);
      } else {
        setError(resp?.data?.results?.message || "Failed to update title");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-300"
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <PencilLine className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Edit Title</h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.1em]">Management Console</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-slate-700 ml-1">
              Title Name <span className="text-rose-500 font-black">*</span>
            </label>
            <input
              type="text"
              autoFocus
              value={form.name}
              onChange={e => update("name", e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 focus:bg-white transition-all outline-none text-slate-800 font-medium"
              placeholder="Enter title name..."
            />
          </div>

          {/* Inline Error */}
          {error && (
            <div className="mt-4 flex items-center gap-2 text-rose-600 bg-rose-50 p-3.5 rounded-xl border border-rose-100 animate-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="text-xs font-bold leading-tight">{error}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={submitted}
            className="px-5 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
          >
            Discard
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={submitted}
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            {submitted ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Briefcase className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Success Overlay */}
        {success && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center z-20 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 scale-110 border border-emerald-100">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{success}</h3>
            <p className="text-slate-400 text-xs font-medium">Reloading workspace...</p>
          </div>
        )}
      </div>
    </div>
  );
}