import React, { useState, useMemo, useEffect } from "react";
import { X, CheckCircle, Search, User, GraduationCap, ArrowRight, Loader2, Sparkles } from "lucide-react";
import ManageAccessModal from "./ManageAccessModal";
import { getFeeTypes, addVariableFeeTypeStudentApi } from "../../api/fees";
import ConfirmationDialogueBox from "../ui/status/Confirmation";

export default function AddFeeTypeStudents({
  open,
  onClose,
  config,
  context,
  setSelectedStudent,
  selectedStudent,
}) {
  if (!open) return null;

  const [selectedStandardId, setSelectedStandardId] = useState("");
  const [search, setSearch] = useState("");
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);
  const [fees, setFees] = useState([]);
  const [allowFullConcession, setAllowFullConcession] = useState(null);
  const [apiResponse, setApiResponse] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchFeesTypes = async () => {
    try {
      const re = await getFeeTypes(
        context?.profileId,
        context?.session,
        1, // page
        20 // limit
      );
      if (re.status) {
        setFees(re?.data?.results?.fee_types || []);
      }
    } catch (error) {
      console.error("Error fetching fees:", error);
    }
  };

  useEffect(() => {
    fetchFeesTypes();
  }, []);

  const selectedStandard = useMemo(() => {
    return config?.standards?.find((s) => String(s.id) === String(selectedStandardId));
  }, [selectedStandardId, config]);

  const allStudents = useMemo(() => {
    if (!selectedStandard) return [];
    const items = selectedStandard.classes?.flatMap((cls) =>
      cls.students?.map((stu) => ({
        ...stu,
        className: cls.name,
      }))
    );
    const q = search.toLowerCase();
    return items.filter(
      (stu) =>
        stu.name.toLowerCase().includes(q) ||
        String(stu.admission_no || "").includes(q) ||
        String(stu.phone || "").includes(q)
    );
  }, [selectedStandard, search]);

  const handleManageAccess = (student) => {
    setActiveStudent(student);
    setManageModalOpen(true);
  };

  const updateStudentFeeType = async (payload) => {
    setLoading(true);
    setError(false);
    setApiResponse("");
    setShowSuccess(false);

    try {
      const matchedClass = selectedStandard?.classes?.find(
        (cls) => cls.name === selectedStudent?.className
      );

      const finalPayload = {
        ...payload,
        selectedStudent,
        selectedStandard,
        classId: matchedClass?.id || null,
      };

      const result = await addVariableFeeTypeStudentApi(
        context.profileId,
        context.session,
        finalPayload
      );

      if (result?.data?.success) {
        setShowSuccess(true);
        setApiResponse({ message: result.data?.results?.message });
        setManageModalOpen(false);
        setTimeout(() => { setShowSuccess(false); setApiResponse(""); }, 3000);
      } else {
        setError(true);
        setApiResponse({ status: "error", message: result.data?.results?.message });
        setTimeout(() => { setError(false); setApiResponse(""); }, 3000);
      }
    } catch (err) {
      setError(true);
      setApiResponse({ status: "error", message: "Request failed." });
      setTimeout(() => { setError(false); setApiResponse(""); }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] transition-all duration-300"
      />

      {/* Sidebar Panel */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[500px] bg-white z-[101] shadow-[-10px_0_30px_rgba(0,0,0,0.1)] flex flex-col transition-transform duration-300 ease-in-out">
        
        {/* HEADER */}
        <div className="p-6 border-b bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <GraduationCap size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Assign Fee Type</h2>
                <p className="text-xs text-slate-500 font-medium">Link student to specific fee structures</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 transition text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: SELECT STANDARD */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">
              1. Select Standard
            </label>
            <select
              value={selectedStandardId}
              onChange={(e) => {
                setSelectedStandardId(e.target.value);
                setSelectedStudent(null);
              }}
              className="w-full border-2 border-slate-100 bg-slate-50 px-4 py-3 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">Choose a Standard...</option>
              {config?.standards?.map((std) => (
                <option key={std.id} value={std.id}>{std.name}</option>
              ))}
            </select>
          </div>

          {/* STEP 2: SEARCH & SELECT STUDENT */}
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">
              2. Select Student
            </label>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                disabled={!selectedStandard}
                placeholder={selectedStandard ? "Search by name, admission or phone..." : "Please select standard first"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-2 border-slate-100 bg-slate-50 pl-10 pr-4 py-3 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-none transition-all disabled:opacity-50"
              />
            </div>

            <div className="min-h-[200px] max-h-[350px] overflow-y-auto border-2 border-slate-50 rounded-2xl bg-slate-50/30 p-2 space-y-2">
              {!selectedStandard ? (
                <div className="h-[200px] flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <User size={40} className="opacity-20" />
                  <p className="text-sm">Standard selection required</p>
                </div>
              ) : allStudents.length === 0 ? (
                <div className="py-10 text-center text-slate-400">No students found</div>
              ) : (
                allStudents.map((stu) => {
                  const isSelected = selectedStudent?.id === stu.id;
                  return (
                    <div
                      key={stu.id}
                      onClick={() => setSelectedStudent(stu)}
                      className={`p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200 border-2 ${
                        isSelected 
                          ? "bg-white border-indigo-500 shadow-md translate-x-1" 
                          : "bg-white border-transparent hover:border-slate-200 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          {stu.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${isSelected ? 'text-indigo-700' : 'text-slate-800'}`}>{stu.name}</p>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {stu.className} • Adm: <span className="text-slate-700">{stu.admission_no}</span>
                          </p>
                        </div>
                      </div>
                      {isSelected ? (
                        <CheckCircle size={22} className="text-indigo-600 fill-indigo-50" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-6 border-t bg-slate-50/80 backdrop-blur-md">
          {selectedStudent ? (
            <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-300">
               <div className="flex items-center justify-between mb-2">
                 <span className="text-xs font-bold text-slate-500 uppercase">Selected:</span>
                 <span className="text-xs font-bold text-indigo-600">{selectedStudent.name}</span>
               </div>
               <div className="grid grid-cols-2 gap-3">
                <button
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all hover:shadow-lg active:scale-95"
                  onClick={() => handleManageAccess(selectedStudent)}
                >
                  Configure Fees <ArrowRight size={16} />
                </button>

                <button
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all hover:shadow-lg active:scale-95"
                  onClick={() => setAllowFullConcession(selectedStudent)}
                >
                  <Sparkles size={16} /> Concession
                </button>
               </div>
            </div>
          ) : (
            <p className="text-center text-sm text-slate-400 font-medium py-4">
              Select a student to view available actions
            </p>
          )}
        </div>

        {/* TOAST NOTIFICATIONS */}
        <div className="fixed bottom-6 right-6 z-[120] space-y-3 pointer-events-none">
          {showSuccess && (
            <div className="bg-emerald-600 text-white rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-right-8 pointer-events-auto">
              <CheckCircle size={20} />
              <span className="font-bold text-sm">{apiResponse.message}</span>
            </div>
          )}
          {error && (
            <div className="bg-rose-600 text-white rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-right-8 pointer-events-auto">
              <X size={20} className="border-2 rounded-full" />
              <span className="font-bold text-sm">{apiResponse.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      <ManageAccessModal
        open={manageModalOpen}
        onClose={() => setManageModalOpen(false)}
        feeList={fees}
        feeTypes={config?.fee_types}
        onUpdate={updateStudentFeeType}
        loading={loading}
        setLoading={setLoading}
      />

      {allowFullConcession && (
        <ConfirmationDialogueBox
          title="Confirm Full Concession"
          description={`You are about to grant a 100% fee concession for "${allowFullConcession.name}". This will zero out their remaining balance for the session.`}
          onConfirm={() => {
            // Your logic for confirm
            setAllowFullConcession(null);
          }}
          onCancel={() => setAllowFullConcession(null)}
        />
      )}
    </>
  );
}