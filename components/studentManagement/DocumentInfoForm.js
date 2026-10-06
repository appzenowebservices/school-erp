import React, { useState } from 'react';
import { X, Upload, FileText, Image } from 'lucide-react';
import { PiListNumbersFill } from 'react-icons/pi';
import { FcDocument } from 'react-icons/fc';
import { GrDocumentVerified } from "react-icons/gr";
import { getCookie } from "cookies-next";
import { getSessionCache } from '../../utils/sessionCache';

const DocumentInfoForm = ({ formData, setFormData }) => {

  const documentFields = [
    { key: 'profileImage', label: 'Profile Image', icon: Image },
    { key: 'birthCertificate', label: 'Birth Certificate', icon: FileText },
    { key: 'aadhar', label: 'Aadhaar', icon: FileText },
    { key: 'familyPhoto', label: 'Family Photo', icon: Image }
  ];

  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(false)

  const handleFileChange = async (key, file) => {
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {

      const resolvedGuid = getCookie("guid");
      const resolvedUserId = getCookie("id");
      const context = getSessionCache("dashboardContext");

      const data = new FormData();

      data.append("api", "file.upload");
      data.append("guid", resolvedGuid);
      data.append("logged_in_user_account_id", resolvedUserId);
      data.append("user_account_id", context?.profileId);
      data.append("client_id", context?.session);
      data.append("platform", "WEB");
      data.append("file_upload_destination", "student_photo_upload");
      data.append("uploaded_files[]", file);

      const resp = await fetch("/api/file.upload", {
        method: "POST",
        body: data,
      });

      const result = await resp.json();

      if (result?.success && result?.results?.files?.[0]) {
        const fileUrl = result.results.files[0].url; // ONLY this is stored
        const previewUrl = URL.createObjectURL(file);

        setFormData(prev => ({
          ...prev,
          documents: {
            ...prev.documents,
            [key]: {
              file,
              preview: previewUrl,
              uploadedUrl: fileUrl // store url, not full_url
            }
          }
        }));

      } else {
        setUploadError(`Failed to upload ${file.name}`);
      }
    } catch (err) {
      console.error(err);
      setUploadError("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };


  const removeFile = (key) => {
    setFormData(prev => {
      const newDocs = { ...prev.documents };
      if (newDocs[key]?.preview) URL.revokeObjectURL(newDocs[key].preview);
      delete newDocs[key];
      return {
        ...prev,
        documents: newDocs
      };
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  // console.log('filters', formData);
  const parentPhones =
    formData?.parents
      ?.flatMap((p) => p?.phones || [])
      ?.filter(Boolean) || [];

  return (
    <div className="w-full  mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Document Upload</h2>
        <p className="text-sm text-gray-500">Please upload the required documents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-4">
        {documentFields.map((doc) => {
          const Icon = doc.icon;
          const docState = formData.documents?.[doc.key];
          const hasFile = !!docState?.file;
          const isLoading = uploading && !docState?.uploadedUrl;
          const imageUrl = docState?.preview || null;


          return (
            <div key={doc.key} className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Icon className="h-4 w-4 text-gray-400" />
                {doc.label}
              </label>

              {!hasFile ? (
                <label
                  htmlFor={`file-${doc.key}`}
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-10 w-10 text-gray-400 group-hover:text-gray-500 mb-3" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG or PDF</p>
                  </div>

                  <input
                    id={`file-${doc.key}`}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => e.target.files[0] && handleFileChange(doc.key, e.target.files[0])}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative w-full h-48 border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">

                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-10 h-10 border-4 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></div>
                      <p className="text-xs text-gray-500 mt-3">Uploading...</p>
                    </div>
                  ) : (
                    <>
                      <img
                        src={imageUrl}
                        alt={doc.label}
                        className="w-full h-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeFile(doc.key)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 opacity-100 transition-opacity">
                        <p className="text-white text-xs font-medium truncate">
                          {docState?.file?.name}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Previous Board (X) Roll No */}
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
          Aadhar Card Number
        </label>
        <div className="relative">
          <PiListNumbersFill className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

          <input
            type="text"
            value={formData.aadharCard || ''}
            onChange={(e) => handleChange('aadharCard', e.target.value)}
            placeholder="Enter Aadhar Card Number"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
        </div>
      </div>


      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <GrDocumentVerified className="text-indigo-500 h-5 w-5" />
          Documents Verification
        </h3>



        {/* Phone Number Registered for SMS */}
        {/* Phone Number Registered for SMS */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Phone Number Registered for SMS
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <GrDocumentVerified className="h-5 w-5 text-gray-400" />
            </div>

            <select
              value={formData.smsRegisteredNumber || ''}
              onChange={(e) => handleChange('smsRegisteredNumber', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm 
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
        transition duration-200 placeholder-gray-400 hover:border-gray-400"
            >
              <option value="">Select number</option>
              {parentPhones.map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Emergency Contact Number */}
        <div className="relative mb-10">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Emergency Contact Number
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <GrDocumentVerified className="h-5 w-5 text-gray-400" />
            </div>

            <select
              value={formData.emergencyContactNumber || ''}
              onChange={(e) => handleChange('emergencyContactNumber', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm 
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
        transition duration-200 placeholder-gray-400 hover:border-gray-400"
            >
              <option value="">Select number</option>
              {parentPhones.map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>






        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">



          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
              Name Matches With Aadhaar
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GrDocumentVerified className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={formData.name_matches_with_aadhaar || ''}
                onChange={(e) => handleChange('name_matches_with_aadhaar', e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"            >
                <option value="">Select options</option>
                {[{
                  label: 'Yes',
                  value: "1"
                },
                {
                  label: 'No',
                  value: "0"
                }
                ]?.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
          </div>


          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
              Date Of Birth Matches With Aadhaar
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GrDocumentVerified className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={formData.date_of_birth_matches_with_aadhaar || ''}
                onChange={(e) => handleChange('date_of_birth_matches_with_aadhaar', e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"            >
                <option value="">Select options</option>
                {[{
                  label: 'Yes',
                  value: "1"
                },
                {
                  label: 'No',
                  value: "0"
                }
                ]?.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
          </div>


          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
              Father Name Matches With Aadhaar
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GrDocumentVerified className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={formData.father_name_matches_with_aadhaar || ''}
                onChange={(e) => handleChange('father_name_matches_with_aadhaar', e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"            >
                <option value="">Select options</option>
                {[{
                  label: 'Yes',
                  value: "1"
                },
                {
                  label: 'No',
                  value: "0"
                }
                ]?.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
              Address Matches With Aadhaar
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GrDocumentVerified className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={formData.address_matches_with_aadhaar || ''}
                onChange={(e) => handleChange('address_matches_with_aadhaar', e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"            >
                <option value="">Select options</option>
                {[{
                  label: 'Yes',
                  value: "1"
                },
                {
                  label: 'No',
                  value: "0"
                }
                ]?.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
          </div>
        </div>


      </div>






    </div>
  );
};


export default DocumentInfoForm;