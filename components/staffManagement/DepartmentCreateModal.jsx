import React, { useState, useEffect, useRef } from "react";
import { X, Briefcase, Building2, ChevronDown, Check, AlertCircle, Loader2 } from "lucide-react";

export default function DepartmentCreateModal({
  open,
  onClose,
  editingDept = null,
  onCreate,
  onUpdate,
  products = [],
  context
}) {
  const [form, setForm] = useState({
    name: "",
    productId: [],
    description: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [openCodeDropdown, setOpenCodeDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenCodeDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (editingDept) {
      setForm({
        ...editingDept,
        productId: Array.isArray(editingDept.productId) ? editingDept.productId : []
      });
    } else {
      setForm({ name: "", productId: [], description: "" });
    }
    setError("");
  }, [editingDept, open]);

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    setSubmitted(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        name: form.name?.trim() || "",
        productId: form.productId || [],
        description: form.description || ""
      };

      if (!payload.name) {
        setError("Please enter a department name");
        setSubmitted(false);
        return;
      }

      const resp = await onCreate(context?.profileId, context?.session, payload);

      if (resp?.data?.success) {
        setSuccess(resp?.data?.results?.message || "Department created successfully");
        setTimeout(() => {
          setSuccess(null);
          onClose();
          window.location.reload();
        }, 1200);
      } else {
        setError(resp?.data?.results?.message || "Failed to save department");
        setSubmitted(false);
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
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
      <div className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-6 flex justify-between items-center border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {editingDept ? "Edit Department" : "New Department"}
              </h2>
              <p className="text-slate-500 text-sm font-medium">Organize your institutional structure</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* Dept Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Department Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => update("name", e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
              placeholder="e.g. Faculty of Science"
            />
          </div>

          {/* Multi-Select Products */}
          <div className="space-y-2" ref={dropdownRef}>
            <label className="text-sm font-bold text-slate-700 ml-1">
              Associated Products / Codes
            </label>
            <div className="relative">
              <div
                onClick={() => setOpenCodeDropdown(!openCodeDropdown)}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-2xl cursor-pointer flex flex-wrap gap-2 min-h-[52px] items-center transition-all ${
                  openCodeDropdown ? "border-blue-500 ring-4 ring-blue-500/10" : "border-slate-200"
                }`}
              >
                {form.productId?.length > 0 ? (
                  form.productId.map((id) => {
                    const product = products.find(p => p.id === id);
                    return (
                      <span key={id} className="pl-3 pr-2 py-1 bg-white border border-blue-100 text-blue-600 text-xs font-bold rounded-xl flex items-center gap-1 group shadow-sm">
                        {product?.name || "Unknown"}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            update("productId", form.productId.filter(pid => pid !== id));
                          }}
                          className="p-0.5 hover:bg-blue-50 rounded-md text-blue-400 hover:text-blue-600 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    );
                  })
                ) : (
                  <span className="text-slate-400 font-medium ml-1">Link products to this department...</span>
                )}
                <ChevronDown className={`ml-auto w-4 h-4 text-slate-400 transition-transform ${openCodeDropdown ? "rotate-180" : ""}`} />
              </div>

              {openCodeDropdown && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="max-h-52 overflow-y-auto p-2">
                    {products.map((prod) => {
                      const isSelected = form.productId.includes(prod.id);
                      return (
                        <div
                          key={prod.id}
                          onClick={() => {
                            const newIds = isSelected 
                              ? form.productId.filter(pid => pid !== prod.id)
                              : [...form.productId, prod.id];
                            update("productId", newIds);
                          }}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-colors ${
                            isSelected ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-600"
                          }`}
                        >
                          <span className="text-sm font-bold">{prod.name}</span>
                          {isSelected && <Check size={16} className="text-blue-600" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Department Description</label>
            <textarea
              value={form.description}
              onChange={e => update("description", e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-800 resize-none min-h-[100px]"
              placeholder="Primary objectives and department goals..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitted}
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            {submitted ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Briefcase size={18} />
            )}
            <span>{editingDept ? "Update Department" : "Save Department"}</span>
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
              <p className="text-sm font-bold text-slate-900">Required Info Missing</p>
              <p className="text-xs font-medium text-slate-500">{error}</p>
            </div>
          </div>
        )}
        {success && (
          <div className="bg-white border-l-4 border-green-500 shadow-2xl rounded-2xl px-5 py-4 flex items-center gap-4 animate-in slide-in-from-right">
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
              <Check size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Success</p>
              <p className="text-xs font-medium text-slate-500">{success}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 