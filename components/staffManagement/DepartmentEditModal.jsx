import React, { useState, useEffect, useRef } from "react";
import { X, Briefcase, Building2, ChevronDown, Check, AlertCircle, Loader2, Search } from "lucide-react";

export default function DepartmentEditModal({
  open,
  onClose,
  editingDept = null,
  onUpdate,
  products = [],
  context
}) {
  const [form, setForm] = useState({
    id: null,
    name: "",
    product_ids: [],
    description: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [openCodeDropdown, setOpenCodeDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenCodeDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (editingDept) {
      setForm({
        id: editingDept.id,
        name: editingDept.name || "",
        description: editingDept.description || "",
        product_ids: editingDept.product_ids || [],
      });
    }
    setError("");
    setSearchTerm("");
  }, [editingDept, open]);

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    setSubmitted(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        id: form.id,
        name: form.name?.trim(),
        product_ids: form.product_ids,
        description: form.description
      };

      if (!payload.name) {
        setError("Department name is required");
        setSubmitted(false);
        return;
      }

      const resp = await onUpdate(context?.profileId, context?.session, payload);

      if (resp?.data?.success) {
        setSuccess(resp?.data?.results?.message || "Changes saved successfully");
        setTimeout(() => {
          setSuccess(null);
          onClose();
          window.location.reload();
        }, 1200);
      } else {
        setError(resp?.data?.results?.message || "Failed to update department");
        setSubmitted(false);
      }
    } catch (err) {
      setError(err.message || "An error occurred during update");
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

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-6 flex justify-between items-center border-b border-slate-100 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Edit Department</h2>
              <p className="text-slate-500 text-sm font-medium">Modify existing department details</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-8 space-y-6 max-h-[65vh] overflow-y-auto">
          
          {/* Department Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Department Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => update("name", e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
              placeholder="e.g. Humanities & Social Sciences"
            />
          </div>

          {/* Multi-Select Products with Search */}
          <div className="space-y-2" ref={dropdownRef}>
            <label className="text-sm font-bold text-slate-700 ml-1">Associated Products</label>
            <div className="relative">
              <div
                onClick={() => setOpenCodeDropdown(!openCodeDropdown)}
                className={`w-full px-4 py-2 bg-slate-50 border rounded-2xl cursor-pointer flex flex-wrap gap-2 min-h-[56px] items-center transition-all ${
                  openCodeDropdown ? "border-blue-500 ring-4 ring-blue-500/10 shadow-sm" : "border-slate-200"
                }`}
              >
                {form.product_ids?.length > 0 ? (
                  form.product_ids.map((id) => {
                    const prod = products.find(p => p.id === id);
                    return (
                      <span key={id} className="pl-3 pr-1.5 py-1.5 bg-white border border-blue-100 text-blue-600 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm animate-in scale-in-95">
                        {prod?.name || "ID: " + id}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            update("product_ids", form.product_ids.filter(pid => pid !== id));
                          }}
                          className="p-1 hover:bg-blue-50 rounded-lg text-blue-300 hover:text-blue-600 transition-colors"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </span>
                    );
                  })
                ) : (
                  <span className="text-slate-400 font-medium ml-1 text-sm">No products linked...</span>
                )}
                <ChevronDown className={`ml-auto w-4 h-4 text-slate-400 transition-transform ${openCodeDropdown ? "rotate-180" : ""}`} />
              </div>

              {openCodeDropdown && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-[1.5rem] shadow-2xl z-30 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 border-b border-slate-50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className="max-h-52 overflow-y-auto p-2 custom-scrollbar">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((prod) => {
                        const isSelected = form.product_ids.includes(prod.id);
                        return (
                          <div
                            key={prod.id}
                            onClick={() => {
                              const next = isSelected 
                                ? form.product_ids.filter(pid => pid !== prod.id)
                                : [...form.product_ids, prod.id];
                              update("product_ids", next);
                            }}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-colors ${
                              isSelected ? "bg-blue-50 text-blue-700 font-bold" : "hover:bg-slate-50 text-slate-600 font-medium"
                            }`}
                          >
                            <span className="text-sm">{prod.name}</span>
                            {isSelected && <Check size={16} strokeWidth={3} />}
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-8 text-center text-slate-400 text-sm italic">No products found</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => update("description", e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-800 resize-none min-h-[120px]"
              placeholder="Enter department scope and mission..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3">
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
              <Check size={18} strokeWidth={3} />
            )}
            <span>Update Department</span>
          </button>
        </div>
      </div>

      {/* Dynamic Toasts */}
      <div className="fixed top-6 right-6 flex flex-col gap-3 z-[60]">
        {error && (
          <div className="bg-white border-l-4 border-red-500 shadow-2xl rounded-2xl px-5 py-4 flex items-center gap-4 animate-in slide-in-from-right">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600 shrink-0">
              <AlertCircle size={20} />
            </div>
            <div className="pr-4">
              <p className="text-sm font-bold text-slate-900">Update Failed</p>
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
              <Check size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Saved</p>
              <p className="text-xs font-medium text-slate-500">{success}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}