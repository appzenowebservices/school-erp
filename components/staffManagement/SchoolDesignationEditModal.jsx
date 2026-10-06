import React, { useEffect, useState } from "react";
import { X, Briefcase, Building2, ShieldCheck, Key, Loader2, Edit3, Check } from "lucide-react";

export default function SchoolDesignationEditModal({
  open,
  onClose,
  onUpdate,
  context,
  config,
  editingDesingation
}) {
  const [form, setForm] = useState({
    id: "",
    name: "",
    department_ids: [],
    role_id: "",
    priority: "",
    adminAccess: false,
    loginAccess: false
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Sync form with editing data
  useEffect(() => {
    if (editingDesingation) {
      setForm({
        id: editingDesingation.id,
        name: editingDesingation.name || "",
        department_ids: editingDesingation.department_ids || [],
        role_id: editingDesingation.role?.id || editingDesingation.role_id || "",
        priority: editingDesingation.priority || "",
        adminAccess: editingDesingation.is_allowed_for_admin_access === "1",
        loginAccess: editingDesingation.is_login_allowed === "1"
      });
    }
    setError("");
  }, [editingDesingation, open]);

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const toggleDepartment = (id) => {
    setForm(prev => ({
      ...prev,
      department_ids: prev.department_ids.includes(id)
        ? prev.department_ids.filter(d => d !== id)
        : [...prev.department_ids, id]
    }));
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    setError(null);
    setSuccess(null);

    try {
      if (!form.name.trim()) {
        setError("Designation name is required");
        setSubmitted(false);
        return;
      }

      const payload = {
        id: form.id,
        name: form.name.trim(),
        department_ids: form.department_ids,
        role_id: form.role_id,
        priority: form.priority,
        is_allowed_for_admin_access: form.adminAccess ? "1" : "0",
        is_login_allowed: form.loginAccess ? "1" : "0"
      };

      const resp = await onUpdate(context?.profileId, context?.session, payload);

      if (resp?.data?.success) {
        setSuccess("Designation updated successfully");
        setTimeout(() => {
          setSuccess(null);
          onClose();
          window.location.reload();
        }, 1200);
      } else {
        setError(resp?.data?.results?.message || "Failed to update designation");
        setSubmitted(false);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
      setSubmitted(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-6 flex justify-between items-center border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100">
              <Edit3 className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Edit Designation</h2>
              <p className="text-slate-500 text-sm font-medium">Update permissions and details for this role</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-8 space-y-8 max-h-[65vh] overflow-y-auto custom-scrollbar">
          
          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Designation Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => update("name", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">System Role</label>
              <select
                value={form.role_id}
                onChange={e => update("role_id", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium cursor-pointer"
              >
                <option value="">Select Role</option>
                {config?.roles?.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Priority Level</label>
              <input
                type="number"
                value={form.priority}
                onChange={e => update("priority", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Department Chips */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
              <Building2 size={16} className="text-slate-400" />
              Assigned Departments
            </label>
            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              {config?.departments?.map(dep => {
                const isSelected = form.department_ids.includes(dep.id);
                return (
                  <button
                    key={dep.id}
                    onClick={() => toggleDepartment(dep.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all flex items-center gap-2 ${
                      isSelected 
                      ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100" 
                      : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                    }`}
                  >
                    {dep.name}
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Access Control Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => update("adminAccess", !form.adminAccess)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                form.adminAccess ? "border-blue-500 bg-blue-50/50" : "border-slate-100 bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${form.adminAccess ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-500"}`}>
                  <ShieldCheck size={20} />
                </div>
                <p className="text-sm font-bold text-slate-800">Admin Access</p>
              </div>
              <div className={`w-10 h-6 rounded-full relative transition-colors ${form.adminAccess ? "bg-blue-600" : "bg-slate-300"}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.adminAccess ? "left-5" : "left-1"}`} />
              </div>
            </div>

            <div 
              onClick={() => update("loginAccess", !form.loginAccess)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                form.loginAccess ? "border-blue-500 bg-blue-50/50" : "border-slate-100 bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${form.loginAccess ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-500"}`}>
                  <Key size={20} />
                </div>
                <p className="text-sm font-bold text-slate-800">Login Allowed</p>
              </div>
              <div className={`w-10 h-6 rounded-full relative transition-colors ${form.loginAccess ? "bg-blue-600" : "bg-slate-300"}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.loginAccess ? "left-5" : "left-1"}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:text-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitted}
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            {submitted ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check size={18} />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="fixed top-6 right-6 flex flex-col gap-3 z-[60]">
        {error && (
          <div className="bg-white border-l-4 border-red-500 shadow-2xl rounded-2xl px-5 py-4 flex items-center gap-4 animate-in slide-in-from-right">
            <X className="text-red-500" size={20} />
            <div>
              <p className="text-sm font-bold text-slate-900">Update Error</p>
              <p className="text-xs font-medium text-slate-500">{error}</p>
            </div>
          </div>
        )}
        {success && (
          <div className="bg-white border-l-4 border-green-500 shadow-2xl rounded-2xl px-5 py-4 flex items-center gap-4 animate-in slide-in-from-right">
            <Check className="text-green-500" size={20} />
            <div>
              <p className="text-sm font-bold text-slate-900">Updated</p>
              <p className="text-xs font-medium text-slate-500">{success}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}