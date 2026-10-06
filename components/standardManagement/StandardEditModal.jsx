import { useEffect, useRef, useState } from "react";
import {
  editStandard,
  getStandardLevelList,
  mobiPackageGetList,
  studentRecordGetlist,
  getStandardDetail
} from "../../api/standards";
import { X, User, Package, Calendar, TrendingUp, Award, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

const EMPTY_FORM = {
  id: "",
  name: "",
  studentRecordId: "",
  packageId: "",
  minAttendance: "",
  priority: "",
  sessionStart: "",
  sessionEnd: "",
  level: ""
};

export default function StandardEditModal({
  initialData = {},
  onClose,
  context,
  setReloadKey
}) {
  const modalRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [studentOptions, setStudentOptions] = useState([]);
  const [packageOptions, setPackageOptions] = useState([]);
  const [levelOptions, setLevelOptions] = useState([]);

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ---------------- FETCH DATA ----------------

  useEffect(() => {
    if (!initialData?.id) {
      setIsVisible(false);
      return;
    }

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await getStandardDetail(context.profileId, context.session, initialData.id);
        const d = res?.results;

        if (d) {
          setForm({
            id: d.id || "",
            name: d.name || "",
            studentRecordId: d.student_record?.id || "",
            packageId: d.mobi_package || "",
            minAttendance: d.min_attendance_percentage ?? "",
            priority: d.priority ?? "",
            sessionStart: d.session_start_date || "",
            sessionEnd: d.session_end_date || "",
            level: d.standard_level?.id || ""
          });
          setIsVisible(true);
        }
      } catch (e) {
        setError("Failed to load details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [initialData?.id]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [students, packages, levels] = await Promise.all([
          studentRecordGetlist(context.profileId, context.session),
          mobiPackageGetList(context.profileId, context.session),
          getStandardLevelList(context.profileId, context.session)
        ]);
        setStudentOptions(students?.results?.student_records || []);
        setPackageOptions(packages?.results?.mobi_packages || []);
        setLevelOptions(levels?.results?.standard_levels || []);
      } catch (err) {}
    };
    fetchOptions();
  }, []);

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.studentRecordId) {
      setError("Please fill in required fields");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const resp = await editStandard(context.profileId, context.session, form);
      if (resp?.success) {
        setSuccess("Standard updated successfully");
        setReloadKey(k => k + 1);
      } else {
        setError(resp?.results?.message || "Update failed");
      }
    } catch (err) {
      setError("Server Error");
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {/* Modal Container */}
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200"
      >
        {/* Fixed Header */}
        <div className="flex-none px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Edit Standard</h2>
              <p className="text-blue-100 text-xs md:text-sm mt-1">Adjust configuration settings below</p>
            </div>
            <button onClick={onClose} className="cursor-pointer p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-gray-50/30">
          
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <Award className="w-4 h-4 text-blue-600" /> Standard Name
              </label>
              <input
                value={form.name}
                onChange={e => handleChange("name", e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 focus:border-blue-500 outline-none transition-all"
                placeholder="Name"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <TrendingUp className="w-4 h-4 text-blue-600" /> Level
              </label>
              <select
                value={form.level}
                onChange={e => handleChange("level", e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 bg-white"
              >
                <option value="">Select Level</option>
                {levelOptions.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
          </div>

          {/* Section 2: Student Selection (Scrollable Grid) */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <User className="w-4 h-4 text-blue-600" /> Select Student
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-4 border-2 border-gray-100 rounded-xl bg-white shadow-inner">
              {studentOptions.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleChange("studentRecordId", s.id)}
                  className={`flex items-center justify-between p-3 rounded-lg text-sm transition-all border-2 ${
                    form.studentRecordId === s.id ? 'bg-blue-50 border-blue-500' : 'border-transparent hover:bg-gray-50'
                  }`}
                >
                  <span className="truncate font-medium text-gray-700">{s.name}</span>
                  {form.studentRecordId === s.id && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <Package className="w-4 h-4 text-blue-600" /> Package
              </label>
              <select
                value={form.packageId}
                onChange={e => handleChange("packageId", e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 bg-white"
              >
                <option value="">Select Package</option>
                {packageOptions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Min Attendance %</label>
                  <input
                    type="number"
                    value={form.minAttendance}
                    onChange={e => handleChange("minAttendance", e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Priority</label>
                  <input
                    type="number"
                    value={form.priority}
                    onChange={e => handleChange("priority", e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5"
                  />
               </div>
            </div>
          </div>

          {/* Section 4: Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <Calendar className="w-4 h-4 text-blue-600" /> Session Start
              </label>
              <input
                type="date"
                value={form.sessionStart}
                onChange={e => handleChange("sessionStart", e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <Calendar className="w-4 h-4 text-blue-600" /> Session End
              </label>
              <input
                type="date"
                value={form.sessionEnd}
                onChange={e => handleChange("sessionEnd", e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5"
              />
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex-none flex justify-end gap-3 px-8 py-5 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="cursor-pointer px-6 py-2.5 rounded-xl border-2 border-gray-300 font-semibold text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="cursor-pointer px-8 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-200"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Floating Notifications */}
      {(error || success) && (
        <div className="fixed bottom-6 right-6 z-[60] space-y-2">
          {error && (
            <div className="bg-white border-l-4 border-red-500 p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
              <AlertCircle className="text-red-500 w-5 h-5" />
              <p className="text-sm font-medium text-gray-800">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-white border-l-4 border-green-500 p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
              <CheckCircle2 className="text-green-500 w-5 h-5" />
              <p className="text-sm font-medium text-gray-800">{success}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}