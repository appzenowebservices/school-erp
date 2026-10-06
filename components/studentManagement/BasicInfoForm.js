// import React, { useEffect, useState } from 'react';
// import { LocateIcon, LucideMapPinned, Transgender, User } from 'lucide-react';
// import { RiUserStarFill } from 'react-icons/ri';
// import { TiSortAlphabeticallyOutline } from "react-icons/ti";
// import { PiListNumbersFill } from 'react-icons/pi';
// import { SiGoogleclassroom } from 'react-icons/si';
// import { MdEmail } from 'react-icons/md';
// import { getSubjectsList } from '../../api/subjects';

// const BasicInfoForm = ({
//   setFormData,
//   formData,
//   config,
//   classes,
//   context,
//   genderOptions
// }) => {


//   const [optionalSubjects, setOptionalSubjects] = useState([]);




//   useEffect(() => {
//     if (!formData.class || !config?.standards?.length) return;

//     // find standard that owns this class
//     const matchedStandard = config?.standards.find(std =>
//       std.classes?.some(cls => cls.id === formData.class)
//     );

//     if (!matchedStandard) {
//       setOptionalSubjects([]);
//       return;
//     }

//     const fetchOptionalSubjects = async () => {
//       setFormData(prev => ({
//         ...prev,
//         optionalSubjects: []
//       }));

//       try {
//         const res = await getSubjectsList(
//           matchedStandard.id,
//           context?.profileId,
//           context?.session,

//         );
//         // console.log('rs -___',matchedStandard.id, res)

//         setOptionalSubjects(res?.results?.subjects || []);
//       } catch (err) {
//         console.error("Failed to fetch optional subjects", err);
//         setOptionalSubjects([]);
//       }
//     };

//     fetchOptionalSubjects();
//   }, [formData.class, config.standard]);


//   // console.log('optionalSubjects - optionalSubjects', formData.class ,config?.standards?.length);



//   const handleChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };


//   return (
//     <div className="w-full bg-white p-6 rounded-xl shadow-md border border-gray-200">
//       <form
//         className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto p-4"
//       >

//         {/* Name */}
//         <div className="relative">
//           <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
//             Name <span className="ml-0.5 text-red-500 font-bold">*</span>
//           </label>

//           <div className="mt-1 relative rounded-md shadow-sm">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <TiSortAlphabeticallyOutline className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               value={formData.name || ''}
//               onChange={(e) => handleChange('name', e.target.value)}
//               className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
//                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
//                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
//               placeholder="Full Name"

//             />
//           </div>
//         </div>


//         {/* Gender */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
//             Gender <span className="ml-0.5 text-red-500 font-bold">*</span>
//           </label>
//           <div className="relative">
//             <Transgender className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

//             <select
//               value={formData.gender}
//               onChange={(e) => handleChange('gender', e.target.value)}
//               className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
//                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
//                 transition duration-200 placeholder-gray-400 hover:border-gray-400"              >
//               <option value="">Select Gender</option>
//               {genderOptions.map((g, i) => (
//                 <option key={i} value={g}>{g}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
//             Email
//           </label>
//           <div className="relative">
//             <MdEmail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               value={formData.email || ''}
//               onChange={(e) => handleChange('email', e.target.value)}
//               className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
//                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
//                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
//               placeholder="Enter email (like @gmail.com)"
//             />
//           </div>
//         </div>



//         {/* Roll Number */}
//         <div className="relative">
//           <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
//             Roll Number <span className="ml-0.5 text-red-500 font-bold">*</span>
//           </label>
//           <div className="mt-1 relative rounded-md shadow-sm">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <PiListNumbersFill className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               value={formData.rollNo || ''}
//               onChange={(e) => handleChange('rollNo', e.target.value)}
//               className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
//                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
//                 transition duration-200 placeholder-gray-400 hover:border-gray-400"              placeholder="Roll Number"
//             />
//           </div>
//         </div>


//         {/* Registration Number */}
//         <div className="relative">
//           <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
//             Registration Number</label>
//           <div className="mt-1 relative rounded-md shadow-sm">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <PiListNumbersFill className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               value={formData.registrationNumber || ''}
//               onChange={(e) => handleChange('registrationNumber', e.target.value)}
//               className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
//                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
//                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
//               placeholder="Registration Number"
//             />
//           </div>
//         </div>


//         {/* Admission Number */}
//         <div className="relative">
//           <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
//             Admission Number</label>
//           <div className="mt-1 relative rounded-md shadow-sm">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <PiListNumbersFill className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               value={formData.admissionNumber || ''}
//               onChange={(e) => handleChange('admissionNumber', e.target.value)}
//               className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
//                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
//                 transition duration-200 placeholder-gray-400 hover:border-gray-400"              placeholder="Admission Number"
//             />
//           </div>
//         </div>

//         {/* Class */}
//         <div className="relative">
//           <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
//             Class  <span className="ml-0.5 text-red-500 font-bold">*</span></label>
//           <div className="mt-1 relative rounded-md shadow-sm">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <SiGoogleclassroom className="h-5 w-5 text-gray-400" />
//             </div>
//             <select
//               value={formData.class || ''}
//               onChange={(e) => handleChange('class', e.target.value)}
//               className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
//                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
//                 transition duration-200 placeholder-gray-400 hover:border-gray-400"            >
//               <option value="">Select Class</option>
//               {classes?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
//             </select>
//           </div>
//         </div>




//         {/* Optional Subject */}
//         <div className="relative">
//           <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
//             Optional Subject
//           </label>
//           <div className="mt-1 relative rounded-md shadow-sm">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <SiGoogleclassroom className="h-5 w-5 text-gray-400" />
//             </div>
//             <select
//               multiple
//               value={formData.optionalSubjects || []}
//               onChange={(e) => {
//                 const values = Array.from(
//                   e.target.selectedOptions,
//                   opt => opt.value
//                 );
//                 handleChange('optionalSubjects', values);
//               }}
//               className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
//     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
//     transition duration-200 hover:border-gray-400"
//             >
//               {optionalSubjects.map(sub => (
//                 <option key={sub.id} value={String(sub.id)}>
//                   {sub.name}
//                 </option>
//               ))}
//             </select>

//           </div>
//         </div>



//         {/* Address (spans 2 columns) */}
//         <div className="relative sm:col-span-2">
//           <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
//             Address
//           </label>
//           <div className="mt-1 relative rounded-md shadow-sm">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <LucideMapPinned className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               value={formData.address || ''}
//               onChange={(e) => handleChange('address', e.target.value)}
//               className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
//                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
//                 transition duration-200 placeholder-gray-400 hover:border-gray-400"              placeholder="Full Address"
//             />
//           </div>
//         </div>







//       </form>


//     </div >
//   );
// };

// export default BasicInfoForm;









import React, { useEffect, useState } from 'react';
import {
  LucideMapPinned,
  Transgender
} from 'lucide-react';
import { TiSortAlphabeticallyOutline } from "react-icons/ti";
import { PiListNumbersFill } from 'react-icons/pi';
import { SiGoogleclassroom } from 'react-icons/si';
import { MdEmail } from 'react-icons/md';
import { getSubjectsList } from '../../api/subjects';

const BasicInfoForm = ({
  setFormData,
  formData,
  config,
  classes,
  context,
  genderOptions
}) => {

  const [optionalSubjects, setOptionalSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  /* --------------------------------------------
     FETCH OPTIONAL SUBJECTS WHEN CLASS CHANGES
  ---------------------------------------------*/
  useEffect(() => {
    if (!formData.class) {
      setOptionalSubjects([]);
      return;
    }

    const matchedStandard = config?.standards?.find(std =>
      std.classes?.some(cls => cls.id === formData.class)
    );

    if (!matchedStandard) {
      setOptionalSubjects([]);
      return;
    }

    const fetchOptionalSubjects = async () => {
      setLoadingSubjects(true);
      setOptionalSubjects([]);

      setFormData(prev => ({
        ...prev,
        optionalSubjects: []
      }));

      try {
        const res = await getSubjectsList(
          matchedStandard.id,
          context?.profileId,
          context?.session
        );

        setOptionalSubjects(res?.results?.subjects || []);
      } catch (err) {
        console.error("Failed to fetch optional subjects", err);
        setOptionalSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchOptionalSubjects();
  }, [formData.class]);

  /* --------------------------------------------
     GENERIC CHANGE HANDLER
  ---------------------------------------------*/
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /* --------------------------------------------
     TOGGLE OPTIONAL SUBJECT
  ---------------------------------------------*/
const toggleSubject = (name) => {
  setFormData(prev => {
    const current = prev.optionalSubjects || [];
    return {
      ...prev,
      optionalSubjects: current.includes(name)
        ? current.filter(v => v !== name)
        : [...current, name]
    };
  });
};

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-md ">
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto p-4">

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <TiSortAlphabeticallyOutline className="absolute left-3 top-3 text-gray-400" />
            <input
              value={formData.name || ''}
              onChange={e => handleChange('name', e.target.value)}
   className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"              />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Transgender className="absolute left-3 top-3 text-gray-400" />
            <select
              value={formData.gender || ''}
              onChange={e => handleChange('gender', e.target.value)}
   className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"              >
              <option value="">Select Gender</option>
              {genderOptions.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold mb-2">Email</label>
          <div className="relative">
            <MdEmail className="absolute left-3 top-3 text-gray-400" />
            <input
              value={formData.email || ''}
              onChange={e => handleChange('email', e.target.value)}
   className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"              />
          </div>
        </div>

        {/* Roll No */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Roll Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <PiListNumbersFill className="absolute left-3 top-3 text-gray-400" />
            <input
              value={formData.rollNo || ''}
              onChange={e => handleChange('rollNo', e.target.value)}
   className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"              />
          </div>
        </div>

        {/* Class */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Class <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <SiGoogleclassroom className="absolute left-3 top-3 text-gray-400" />
            <select
              value={formData.class || ''}
              onChange={e => handleChange('class', e.target.value)}
   className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"              >
              <option value="">Select Class</option>
              {classes?.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* OPTIONAL SUBJECTS */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold mb-2">
            Optional Subjects
          </label>

          {!formData.class && (
            <div className="text-sm text-gray-500 border rounded-lg p-3">
              Please select a class to load optional subjects
            </div>
          )}

          {loadingSubjects && (
            <div className="text-sm text-indigo-600 border rounded-lg p-3 animate-pulse">
              Loading subjects…
            </div>
          )}

          {!loadingSubjects && formData.class && optionalSubjects.length === 0 && (
            <div className="text-sm text-gray-500 border rounded-lg p-3">
              No optional subjects available
            </div>
          )}

          {!loadingSubjects && optionalSubjects.length > 0 && (
            <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
              {optionalSubjects.map(sub => (
  <label
    key={sub.id}
    className="flex items-center gap-2 cursor-pointer"
  >
    <input
      type="checkbox"
      checked={(formData.optionalSubjects || []).includes(sub.name)}
      onChange={() => toggleSubject(sub.name)}
    />
    <span>{sub.name}</span>
  </label>
))}

            </div>
          )}
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold mb-2">Address</label>
          <div className="relative">
            <LucideMapPinned className="absolute left-3 top-3 text-gray-400" />
            <input
              value={formData.address || ''}
              onChange={e => handleChange('address', e.target.value)}
   className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"              />
          </div>
        </div>

      </form>
    </div>
  );
};

export default BasicInfoForm;
