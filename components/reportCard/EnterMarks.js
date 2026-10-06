"use client";
import React, { useState, useEffect } from "react";
import { Search, CheckCircle, Loader2, ChevronDown, GraduationCap } from "lucide-react";
import { getExamList } from "../../api/exam";
import { getSubjectsList } from "../../api/subjects";
// ======================================================================================================
const EnterMarks = ({
  standards = [],
  context,
  fetchStudentsByClassAndSubject,
  onSubmitMarks,
}) => {
  // ======================================================================================================
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [marksData, setMarksData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClassValue, setSelectedClassValue] = useState("");


  // ======================================================================================================
  const handleMarksChange = (studentId, field, value) => {
    setMarksData((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }));
  };

  const handleAbsentToggle = (studentId, checked) => {
    setMarksData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        absent: checked,
        MM: checked ? "" : prev[studentId]?.MM || "",
        PM: checked ? "" : prev[studentId]?.PM || "",
      },
    }));
  };

  const handleGo = async () => {
    if (!selectedClass || !selectedExam || !selectedSubject) return;
    setLoading(true);
    try {
      const res = await fetchStudentsByClassAndSubject(selectedClass, selectedSubject);
      setStudents(res || []);
      setMarksData({});
    } finally {
      setLoading(false);
    }
  };

  const fetchExamByClass = async () => {

    const resp = await getExamList(
      selectedClass?.standard_id,
      context?.profileId,
      context?.session,
    )
    setExams(resp?.results?.exams)

  }


const fetchSubjectsByExam = async () => {

    const resp = await getSubjectsList(
      selectedClass?.standard_id,
      context?.profileId,
      context?.session,
    )
    setSubjects(resp?.results?.subjects)

  }


  // Fetch exams when class changes
  useEffect(() => {
    if (!selectedClass) return;
    setSelectedExam("");
    setSelectedSubject("");
    setSubjects([]);
    setStudents([]);
    fetchExamByClass()
  }, [selectedClass]);




  useEffect(() => {
    if (!selectedExam) return;
    setSelectedSubject("");
    setStudents([]);
    fetchSubjectsByExam()
  }, [selectedExam]);

  const getSelectedClassName = () => {
    for (const std of standards) {
      const cls = std.classes?.find((c) => {

        // console.log(c.id, selectedClass,'clscls');
        return (
          c.id == selectedClass?.class_id
        )
      });

      if (cls) {
        return `${std.name} - ${cls.name}${cls.section_name ? ` (${cls.section_name})` : ""}`;
      }
    }
    return "Select a class";
  };
  // ======================================================================================================
  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 rounded-xl shadow-md min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
        <GraduationCap className="w-8 h-8 text-indigo-600" />
        Enter Marks
      </h2>

      {/* ============================Selection Controls =========================================================*/}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ============================  Class Selector  =========================================================*/}

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Class
          </label>
          <div className="relative">
            <select
              value={selectedClassValue}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedClassValue(value);
                setSelectedClass(JSON.parse(value));
              }}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setIsOpen(false)}
              className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl 
    text-gray-900 font-medium bg-white cursor-pointer
    transition-all duration-200 ease-in-out
    hover:border-indigo-300 hover:shadow-sm
    focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500
    appearance-none"
            >
              <option value="">Select a class</option>

              {standards.map((std) => (
                <optgroup key={std.id} label={std.name}>
                  {std.classes?.map((cls) => (
                    <option
                      key={cls.id}
                      value={JSON.stringify({
                        standard_id: std.id,
                        class_id: cls.id
                      })}
                    >
                      {cls.name} {cls.section_name ? `(${cls.section_name})` : ""}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            <ChevronDown
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""
                }`}
            />
          </div>
          {selectedClass && (
            <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Selected:</p>
              <p className="font-semibold text-indigo-700">{getSelectedClassName()}</p>
            </div>
          )}
        </div>

        {/* ============================  Exam Selector  =========================================================*/}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Exam
          </label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            disabled={!selectedClass}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
              text-gray-900 bg-white
              focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500
              disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="">Select an exam</option>
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>
          {selectedExam && (
            <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Selected:</p>
              <p className="font-semibold text-indigo-700">{selectedExam}</p>
            </div>
          )}
        </div>

        {/* ============================  Subject Selector  =========================================================*/}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedExam}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
              text-gray-900 bg-white
              focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500
              disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="">Select a subject</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* GO Button */}
      <div className="flex justify-end">
        <button
          onClick={handleGo}
          disabled={!selectedSubject || loading}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
            text-white rounded-xl shadow-md hover:shadow-lg transition 
            flex items-center gap-2 disabled:opacity-50 font-semibold"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          GO
        </button>
      </div>
      {/* ============================ Student Marks Table  =========================================================*/}

      {students.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">Roll No</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Student Name</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Absent</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Marks (MM)</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Marks (PM)</th>
              </tr>
            </thead>
            <tbody>
              {students.map((stu, index) => (
                <tr
                  key={stu.id}
                  className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-indigo-50 transition`}
                >
                  <td className="px-4 py-3">{stu.roll_no}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{stu.name}</td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={marksData[stu.id]?.absent || false}
                      onChange={(e) => handleAbsentToggle(stu.id, e.target.checked)}
                      className="w-4 h-4 accent-indigo-600 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={marksData[stu.id]?.MM || ""}
                      onChange={(e) => handleMarksChange(stu.id, "MM", e.target.value)}
                      disabled={marksData[stu.id]?.absent}
                      placeholder="Max Marks"
                      className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg 
                        focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500
                        disabled:bg-gray-100"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={marksData[stu.id]?.PM || ""}
                      onChange={(e) => handleMarksChange(stu.id, "PM", e.target.value)}
                      disabled={marksData[stu.id]?.absent}
                      placeholder="Pass Marks"
                      className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg 
                        focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500
                        disabled:bg-gray-100"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-4 flex justify-end border-t bg-gray-50 rounded-b-xl">
            <button
              onClick={() => onSubmitMarks(marksData)}
              className="px-6 py-3 bg-green-600 text-white rounded-xl flex items-center gap-2 
                hover:bg-green-700 transition shadow-sm font-semibold"
            >
              <CheckCircle className="w-5 h-5" />
              Submit Marks
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
// ======================================================================================================

export default EnterMarks;
// ======================================================================================================
