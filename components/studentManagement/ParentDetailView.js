// "use client";
// import React from "react";
// import { User, Phone, Mail, Briefcase, MapPin, Users } from "lucide-react";
// import EditableField from "./EditableField";
// import { patchStudentDetail } from "../../api/student";

// export default function ParentInfoViewTab({
//   studentDetail,
//   session,
//   profile,
//   cookyGuid,
//   cookyId,
//   school,
//   setIsUpdated
// }) {
//   if (!studentDetail || !studentDetail.parents) return null;

//   const [parentPhones, setParentPhones] = React.useState({});

//   React.useEffect(() => {
//     if (!studentDetail?.parents) return;

//     const map = {};
//     Object.entries(studentDetail.parents).forEach(([relation, parent]) => {
//       map[relation] = (parent.phones || [])
//         .map(p => typeof p === "object" ? Number(p.phone) : Number(p))
//         .filter(Boolean);
//     });

//     setParentPhones(map);
//   }, [studentDetail]);

//   const basePayload = {
//     user_account_id: profile,
//     client_id: session,
//     guid: cookyGuid,
//     logged_in_user_account_id: cookyId,
//     id: studentDetail.id,
//     school_id: school,
//     class_id: studentDetail.class?.id
//   };

//   const handleSave = async (relation, key, value) => {
//     const parent = studentDetail.parents[relation];

//     const updatedParent = {
//       relation_with_student: relation,
//       name: parent.name || "",
//       gender: parent.gender || "",
//       phones: [...(parentPhones[relation] || [])],
//       emails: parent.emails || []
//     };

//     if (key === "phone") {
//       const { index, phone } = value;

//       if (!phone) {
//         updatedParent.phones.splice(index, 1);
//       } else {
//         updatedParent.phones[index] = Number(phone);
//       }

//       // 🔥 keep local state in sync
//       setParentPhones(prev => ({
//         ...prev,
//         [relation]: updatedParent.phones
//       }));
//     } else {
//       updatedParent[key] = value;
//     }

//     const payload = {
//       ...basePayload,
//       parents: [updatedParent]
//     };

//     console.log("FINAL PAYLOAD", payload);

//     await patchStudentDetail(payload);
//     setIsUpdated(true);
//   };




//   return (
//     <div className="space-y-10">
//       {Object.entries(studentDetail.parents)
//         .filter(([_, parent]) => parent)
//         .map(([relation, parent], index) => (
//           <div
//             key={index}
//             className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm"
//           >
//             <div className="flex items-center mb-4">
//               <Users className="h-5 w-5 text-blue-600 mr-2" />
//               <h3 className="text-lg font-semibold text-gray-800 capitalize">
//                 {relation.replace("_", " ")}
//               </h3>
//             </div>

//             <div className="grid md:grid-cols-2 gap-6">
//               <EditableField
//                 label="Name"
//                 value={parent.name}
//                 icon={User}
//                 type="text"
//                 onSave={(val) => handleSave(relation, "name", val)}
//                 setIsUpdated={setIsUpdated}
//               />

//               {/* <EditableField
//                 label="Phone"
//                 value={parent?.phones?.map(cls => cls?.phone) || ""}

//                 // value={parent.phone}
//                 icon={Phone}
//                 type="array"
//                 onSave={(val) => handleSave(relation, "phone", val)}
//                 setIsUpdated={setIsUpdated}
//               /> */}
//               {(parentPhones[relation] || []).map((phone, idx) => (
//                 <EditableField
//                   key={idx}
//                   label={`Phone ${idx + 1}`}
//                   value={phone}
//                   icon={Phone}
//                   type="text"
//                   onSave={(val) =>
//                     handleSave(relation, "phone", {
//                       index: idx,
//                       phone: val
//                     })
//                   }
//                   setIsUpdated={setIsUpdated}
//                 />
//               ))}



//               <EditableField
//                 label="Email"
//                 value={parent.email}
//                 icon={Mail}
//                 type="text"
//                 onSave={(val) => handleSave(relation, "email", val)}
//                 setIsUpdated={setIsUpdated}
//               />

//               <EditableField
//                 label="Occupation"
//                 value={parent.occupation}
//                 icon={Briefcase}
//                 type="text"
//                 onSave={(val) => handleSave(relation, "occupation", val)}
//                 setIsUpdated={setIsUpdated}
//               />

//               <EditableField
//                 label="Address"
//                 value={parent.address}
//                 icon={MapPin}
//                 type="text"
//                 onSave={(val) => handleSave(relation, "address", val)}
//                 setIsUpdated={setIsUpdated}
//               />

//               <EditableField
//                 label="Is Guardian"
//                 value={parent.is_guardian}
//                 icon={Users}
//                 type="boolean"
//                 onSave={(val) => handleSave(relation, "is_guardian", val)}
//                 setIsUpdated={setIsUpdated}
//               />
//             </div>
//           </div>
//         ))}
//       {studentDetail?.siblings.length > 0 && (
//         <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
//           <div className="flex items-center mb-4">
//             <Users className="h-5 w-5 text-indigo-600 mr-2" />
//             <h3 className="text-lg font-semibold text-gray-800">
//               Siblings
//             </h3>
//           </div>

//           <div className="space-y-4">
//             {studentDetail.siblings.map((sib) => (
//               <div
//                 key={sib.id}
//                 className="flex items-center justify-between bg-white rounded-lg p-4 border"
//               >
//                 <div>
//                   <p className="text-sm font-semibold text-gray-800">
//                     {sib.name}
//                   </p>

//                   <p className="text-xs text-gray-500">
//                     {sib.admission_number && `Admission No: ${sib.admission_number}`}
//                     {sib.roll_number && ` • Roll: ${sib.roll_number}`}
//                   </p>
//                 </div>

//                 {sib.image_url ? (
//                   <img
//                     src={sib.image_url}
//                     alt={sib.name}
//                     className="h-10 w-10 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
//                     N/A
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { User, Phone, Mail, Briefcase, MapPin, Users, PlusCircle, XCircle, Save, Loader2 } from "lucide-react";
import EditableField from "./EditableField";
import { patchStudentDetail } from "../../api/student";
import { FaUsers } from "react-icons/fa";

export default function ParentInfoViewTab({
  studentDetail,
  session,
  profile,
  cookyGuid,
  cookyId,
  school,
  setIsUpdated,
  classes,
  standards
}) {
  const [parentPhones, setParentPhones] = useState({});
  const [isAddingSibling, setIsAddingSibling] = useState(false);
  const [addingParentRelation, setAddingParentRelation] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  const classesList = useMemo(() => {
    if (!Array.isArray(standards)) return [];

    return standards.flatMap(std =>
      (std.classes || []).map(cls => ({
        id: cls.id,
        name: `${cls.name}${cls.section ? ` - ${cls.section}` : ""}`,
        students: cls.students || []
      }))
    );
  }, [standards]);

  const selectedClassObj = classesList.find(
    cls => cls.id === selectedClass
  );


  const availableStudents = selectedClassObj?.students || [];

  // Sync internal phone state whenever studentDetail prop changes
  useEffect(() => {
    if (!studentDetail?.parents) return;
    const map = {};
    Object.entries(studentDetail.parents).forEach(([relation, parent]) => {
      map[relation] = (parent.phones || [])
        .map(p => typeof p === "object" ? Number(p.phone) : Number(p))
        .filter(Boolean);
    });
    setParentPhones(map);
  }, [studentDetail]);

  if (!studentDetail) return null;

  // Derive missing relations dynamically
  const standardRelations = ["FATHER", "MOTHER", "GUARDIAN"];
  const existingRelations = Object.keys(studentDetail?.parents || {});
  const missingRelations = standardRelations.filter(rel => !existingRelations.includes(rel));

  const basePayload = {
    user_account_id: profile,
    client_id: session,
    guid: cookyGuid,
    logged_in_user_account_id: cookyId,
    id: studentDetail.id,
    school_id: school,
    class_id: studentDetail.class?.id
  };

  const handleSave = async (relation, key, value) => {
    setIsSaving(true);
    setError(null);
    try {
      const parent = studentDetail.parents[relation] || {};

      // Prepare updated parent object maintaining existing data
      const updatedParent = {
        relation_with_student: relation,
        name: key === "name" ? value : (parent.name || ""),
        gender: parent.gender || (relation === "MOTHER" ? "FEMALE" : "MALE"),
        phones: [...(parentPhones[relation] || [])],
        emails: key === "email" ? [value] : (parent.emails || parent.email ? [parent.email] : []),
        occupation: key === "occupation" ? value : (parent.occupation || ""),
        address: key === "address" ? value : (parent.address || ""),
        is_guardian: key === "is_guardian" ? value : (parent.is_guardian || false)
      };

      // Specific logic for phone arrays
      if (key === "phone") {
        const { index, phone } = value;
        const newPhones = [...updatedParent.phones];
        if (!phone) newPhones.splice(index, 1);
        else newPhones[index] = Number(phone);
        updatedParent.phones = newPhones;
        setParentPhones(prev => ({ ...prev, [relation]: newPhones }));
      }

      const payload = { ...basePayload, parents: [updatedParent] };
      console.log('___________ payload_____________', payload);
      return
      const resp = await patchStudentDetail(payload);
      console.log('___________ resp___', resp);

      if (resp?.success) {
        setSuccess(`${relation.toLowerCase()} updated successfully`);
        setIsUpdated(true);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(resp?.message || "Failed to update parent info");
      }
    } catch (err) {
      setError("An error occurred during save.");
    } finally {
      setIsSaving(false);
      setAddingParentRelation(null);
    }
  };

  const handleAddSibling = async () => {
    if (!selectedClass || !selectedStudent) return;

    setIsSaving(true);

    try {
      const newSibling = {
        student_id: selectedStudent,
        class_id: selectedClass
      };

      const payload = {
        ...basePayload,
        sibling_ids: [selectedStudent]
      };

      const resp = await patchStudentDetail(payload);

      if (resp?.success) {
        setIsAddingSibling(false);
        setSelectedClass("");
        setSelectedStudent("");
        setIsUpdated(true);
        setSuccess("Sibling added successfully");
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError("Failed to add sibling.");
    } finally {
      setIsSaving(false);
    }
  };

  // console.log(';availableStudents', selectedClassObj,availableStudents);

  return (
    <>
      <div className="relative space-y-10">
        {/* Loader Overlay */}
        {isSaving && (
          <div className="absolute inset-0 bg-white/50 z-20 flex items-center justify-center backdrop-blur-[1px]">
            <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
          </div>
        )}

        {/* --- PARENTS SECTION --- */}
        <div className="space-y-6">
          {Object.entries(studentDetail?.parents || {})
            .filter(([_, parent]) => parent)
            .map(([relation, parent]) => (
              <div key={relation} className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800 capitalize">{relation.replace("_", " ")}</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <EditableField label="Name" value={parent.name} icon={User} type="text" onSave={(val) => handleSave(relation, "name", val)} setIsUpdated={setIsUpdated} />

                  {Array.from(
                    { length: Math.max(3, parentPhones[relation]?.length || 0) },
                    (_, idx) => parentPhones[relation]?.[idx] || ""
                  ).map((phone, idx) => (
                    <EditableField
                      key={`${relation}-phone-${idx}`}
                      label={`Phone ${idx + 1}`}
                      value={phone}
                      icon={Phone}
                      type="text"
                      onSave={(val) =>
                        handleSave(relation, "phone", { index: idx, phone: val })
                      }
                      setIsUpdated={setIsUpdated}
                    />
                  ))}


                  <EditableField label="Email" value={parent.emails?.[0] || parent.email} icon={Mail} type="text" onSave={(val) => handleSave(relation, "email", val)} setIsUpdated={setIsUpdated} />
                  <EditableField label="Occupation" value={parent.occupation} icon={Briefcase} type="text" onSave={(val) => handleSave(relation, "occupation", val)} setIsUpdated={setIsUpdated} />
                  <EditableField label="Address" value={parent.address} icon={MapPin} type="text" onSave={(val) => handleSave(relation, "address", val)} setIsUpdated={setIsUpdated} />
                </div>
              </div>
            ))}

          {/* --- ADD MISSING PARENT BUTTONS --- */}
          {missingRelations.length > 0 && (
            <div className="flex gap-4">
              {missingRelations.map(rel => (
                <button
                  key={rel}
                  onClick={() => setAddingParentRelation(rel)}
                  className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 transition-all text-sm font-medium"
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> Add {rel.toLowerCase()}
                </button>
              ))}
            </div>
          )}

          {addingParentRelation && (
            <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-blue-800">New {addingParentRelation} Details</h3>
                <button onClick={() => setAddingParentRelation(null)}><XCircle className="text-gray-400 hover:text-red-500" /></button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    autoFocus
                    placeholder="Type Full Name and press Enter"
                    className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value) handleSave(addingParentRelation, "name", e.target.value);
                    }}
                  />
                  <p className="text-xs text-blue-600 mt-2 italic">Press Enter to save and create record.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- SIBLINGS SECTION --- */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Siblings</h3>
            </div>
            <button
              onClick={() => setIsAddingSibling(true)}
              className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-bold"
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Add Sibling
            </button>
          </div>

          <div className="space-y-4">
       
                {studentDetail?.siblings?.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Added Siblings
                    </h4>

                    {studentDetail?.siblings?.map((sib) => (
                      <div
                        key={sib.id}
                        className="flex items-center justify-between bg-gray-50 border rounded-lg px-4 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={sib.image_url}
                            alt={sib.name}
                            className="w-8 h-8 rounded-full object-cover border"
                          />

                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {sib.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              Class: {sib.class?.name || "—"} · Roll: {sib.roll_number || "—"}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveSibling(sib.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
            {isAddingSibling && (

              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FaUsers className="text-indigo-500 h-5 w-5" />
                  Sibling Information
                </h3>






                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Select Class */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Class
                    </label>
                    <select
                      value={selectedClass}
                      onChange={(e) => {
                        setSelectedClass(e.target.value);
                        setSelectedStudent("");
                      }}
                      className="w-full rounded-lg border px-3 py-2"
                    >
                      <option value="">Select class</option>
                      {classesList.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Student */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Student
                    </label>
                    <select
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      disabled={!selectedClass}
                      className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-100"
                    >
                      <option value="">Select student</option>
                      {availableStudents.map((stu) => (
                        <option key={stu.id} value={stu.id}>
                          {stu.name} {stu.roll_number && `(${stu.roll_number})`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleAddSibling}
                    disabled={!selectedClass || !selectedStudent}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    + Add Sibling
                  </button>
                </div>





              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md shadow-lg z-[60] flex items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-3 font-bold">&times;</button>
        </div>
      )}

      {success && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md shadow-lg z-[60]">
          <span>{success}</span>
        </div>
      )}
    </>
  );
}