"use client";
import React, { useState, useEffect } from "react";
import { UploadCloud, CheckCircle, AlertCircle, X, Download } from "lucide-react";
import { getCookie } from "cookies-next";
import { uploadStaffSignature } from "../../api/staff";
import { getSessionCache } from "../../utils/sessionCache";

export default function SignatureUploadViewer({
  staffDetail,
  setIsUpdated, // This should be a function from parent to trigger a data re-fetch
  onClose
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Local state to show the saved URL immediately
  const [currentSignature, setCurrentSignature] = useState(staffDetail?.img_signature);

  // Keep local state in sync if staffDetail changes
  useEffect(() => {
    setCurrentSignature(staffDetail?.img_signature);
  }, [staffDetail]);

  if (!staffDetail) return null;

  const context = getSessionCache("dashboardContext");

  const uploadAndSave = async (file) => {
    if (!file) return;
    setError(null);
    setSuccess(null);
    setUploading(true);

    try {
      const resolvedGuid = getCookie("guid");
      const resolvedUserId = getCookie("id");

      // 1. Upload File to S3/Server
      const data = new FormData();
      data.append("api", "file.upload");
      data.append("guid", resolvedGuid);
      data.append("logged_in_user_account_id", resolvedUserId);
      data.append("user_account_id", context?.profileId);
      data.append("client_id", context?.session);
      data.append("platform", "WEB");
      data.append("file_upload_destination", "user_photo_upload");
      data.append("uploaded_files[]", file);

      const resp = await fetch("/api/file.upload", {
        method: "POST",
        body: data,
      });

      const result = await resp.json();

      if (result?.success && result?.results?.files?.[0]) {
        const uploadedUrl = result.results.files[0].full_url;

        // 2. Patch the Staff Record with the new URL
        const finalPayload = {
          api: "user.uploadSignature",
          logged_in_user_account_id: resolvedUserId,
          guid: resolvedGuid,
          user_account_id: context?.profileId,
          client_id: context?.session,
          id: staffDetail?.id,
          platform: "web",
          img_signature: uploadedUrl,
        };

        const response = await uploadStaffSignature(finalPayload);
        
        if (response?.success) {
          setSuccess("Signature saved successfully!");
          setCurrentSignature(uploadedUrl); // Update local view immediately
          
          // Trigger parent refresh if function provided
          if (setIsUpdated) setIsUpdated(prev => !prev); 

          // Close modal after short delay
          setTimeout(() => onClose(null), 1000);
            if (typeof window !== "undefined") {
            window.location.reload();
          }
        } else {
          setError("Failed to link signature to profile.");
        }
      } else {
        setError("File upload to server failed.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center transition-all">
      {/* Close Button */}
      <button
        onClick={() => onClose(null)}
        className="absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
      >
        <X size={16} />
      </button>

      <h3 className="text-sm font-bold text-gray-900 mb-1">Staff Signature</h3>
      <p className="text-[10px] text-gray-500 mb-6 uppercase tracking-wider">{staffDetail.full_name}</p>

      {/* Signature Display Area */}
      <div className="w-full aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden mb-4 relative group">
        {currentSignature ? (
          <>
            <img
              src={currentSignature}
              alt="Signature"
              className="h-full w-full object-contain p-4"
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <a href={currentSignature} download className="p-2 bg-white rounded-lg shadow-sm text-gray-700 hover:text-blue-600">
                  <Download size={16} />
               </a>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-gray-400">
             <UploadCloud size={32} strokeWidth={1.5} />
             <span className="text-xs mt-2">No signature saved</span>
          </div>
        )}

        {/* Loading Overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-[10px] font-bold text-blue-600 uppercase">Uploading...</p>
            </div>
          </div>
        )}
      </div>

      {/* Upload Action */}
      <label className="w-full">
        <div className={`
          flex items-center justify-center gap-2 px-4 py-3 rounded-xl border font-semibold text-sm transition-all cursor-pointer
          ${uploading ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600 hover:text-white'}
        `}>
          <UploadCloud size={18} />
          <span>{currentSignature ? "Replace Signature" : "Upload Signature"}</span>
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => uploadAndSave(e.target.files[0])}
        />
      </label>

      {/* Feedback Messages */}
      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg w-full">
          <AlertCircle size={14} />
          <span className="text-[11px] font-medium">{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-4 flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded-lg w-full">
          <CheckCircle size={14} />
          <span className="text-[11px] font-medium">{success}</span>
        </div>
      )}
    </div>
  );
}