import React, { useState, useEffect } from "react";
import { BookOpen, Users, Settings, Loader2, CheckCircle, GraduationCap } from "lucide-react";
import { getClassSubjectMapping } from "../../api/ClassSubjectMapping";

export default function ClassSubjectMapping({ Context, config }) {
  const [loading, setLoading] = useState(false);
  const [standards, setStandards] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const teachers = config?.users?.filter(
    (user) => user?.designation?.role?.is_teaching_staff === '1'
  );
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await getClassSubjectMapping(
        Context?.profileId,
        Context?.session
      );
      console.log('res________________', res);

      if (res?.data?.success) {
        const data = res.data.results?.client_class_subject_teacher_mapping || {};

        setStandards(data.standards || []);
        setTeacherList(data.teachers || []);
      }
    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update teacher mapping
  const updateTeacher = async (classId, subjectId, teacherId) => {
    try {
      setIsUpdating(true);
      setLastUpdated(null);

      // Placeholder delay
      // await new Promise(resolve => setTimeout(resolve, 300));

      setLastUpdated({ classId, subjectId });
      // await fetchData();
    } catch (e) {
      console.log("Update teacher failed", e);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className=" mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Settings className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Subject Teacher Assignment
              </h1>
              <p className="text-sm text-gray-600">
                Manage and assign subject teachers for all classes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isUpdating && (
              <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </div>
            )}
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg border border-gray-200">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">
                {teacherList.length} Teachers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className=" mx-auto px-6 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading assignments...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {standards.map(std => (
              <div key={std.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

                {/* Standard Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5" /> {std.name}
                  </h2>
                </div>

                {/* Table */}
                <div className="p-6 overflow-x-auto">
                  {!std.subjects?.length ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No subjects defined for this standard.
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="sticky left-0 bg-gray-50 z-10 px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase w-40">
                            Subject Name
                          </th>

                          {/* Class headers */}
                          {std.classes?.map(cls => (
                            <th
                              key={cls.id}
                              className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase border-l border-gray-200"
                            >
                              {cls.name}
                              <p className="text-[10px] text-gray-500">
                                CT: {cls.class_teacher?.name || "None"}
                              </p>
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100 text-sm">
                        {std.subjects.map(sub => (
                          <tr key={sub.id}>

                            {/* Subject name */}
                            <td className="sticky left-0 bg-white z-10 px-4 py-3 font-medium text-gray-900 border-r border-gray-200">
                              <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-indigo-500" />
                                {sub.name}
                              </div>
                            </td>

                            {/* Loop classes */}
                            {std.classes.map(cls => {
                              const raw = cls.subject_teachers?.[sub.id] || "";
                              const teacherNames = raw
                                ? raw.split(",").map(s => s.trim())
                                : [];

                              const isLastUpdated =
                                lastUpdated?.classId === cls.id &&
                                lastUpdated?.subjectId === sub.id;

                              return (
                                <td
                                  key={cls.id}
                                  className={`px-4 py-3 border-l border-gray-100 relative ${isLastUpdated ? "bg-green-50" : ""
                                    }`}
                                >
                                  {/* Current teacher names */}
                                  <div className="flex flex-wrap gap-1 mb-1">
                                    {teacherNames.length ? (
                                      teacherNames.map((t, i) => (
                                        <span
                                          key={i}
                                          className="text-[10px] px-2 py-[2px] bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200 whitespace-nowrap"
                                        >
                                          {t}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-xs text-gray-400">No teacher</span>
                                    )}
                                  </div>

                                  {/* Dropdown */}
                                  <select
                                    className="mt-1 w-full border border-gray-300 rounded-lg px-2 py-1 text-xs
                                      focus:ring-indigo-500 focus:border-indigo-500"
                                    onChange={e =>
                                      updateTeacher(cls.id, sub.id, e.target.value)
                                    }
                                    disabled={isUpdating}
                                  >
                                    <option value="">Assign / Update</option>

                                    {teachers?.map(t => (
                                      <option key={t.id} value={t.id}>
                                        {t.name}
                                      </option>
                                    ))}
                                  </select>

                                  {isLastUpdated && (
                                    <span className="absolute top-0 right-0 m-1 flex items-center gap-1 text-[10px] font-semibold text-green-700">
                                      <CheckCircle className="w-3 h-3" />
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
