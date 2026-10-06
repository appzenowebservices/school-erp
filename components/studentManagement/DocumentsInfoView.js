"use client";
import React, { useState } from "react";
import { UploadCloud, XCircle, FileText, Image as ImageIcon, Droplet } from "lucide-react";
import { patchStudentDetail } from "../../api/student";
import { getCookie } from "cookies-next";
import EditableField from "./EditableField";

export default function DocumentsInfoViewTab({
  studentDetail,
  session,
  profile,
  cookyGuid,
  cookyId,
  school,
  setIsUpdated,
}) {
  if (!studentDetail) return null;

  const [uploadingKey, setUploadingKey] = useState(null);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(null);
  const [success, setSuccess] = useState(false);

  const basePayload = {
    user_account_id: profile,
    client_id: session,
    guid: cookyGuid,
    logged_in_user_account_id: cookyId,
    id: studentDetail.id,
    school_id: school,
    class_id: studentDetail.class?.id,
  };
  const handleSave = async (key, value) => {
    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      const res = await patchStudentDetail({
        ...basePayload,
        [key]: value
      });

      console.log('res==____', res);

      if (!res?.data?.success) {
        setError(res?.results?.message || 'Failed to update.');
        return;
      }

      setSuccess(res?.data?.message || 'Updated');

    } catch (err) {
      console.error('Save error:', err);
      setError('Something went wrong while updating.');
    } finally {
      setIsSaving(false);

      setTimeout(() => {
        setError('');
        setSuccess('');
      }, 4000);
    }
  };







  const uploadAndSave = async (key, file) => {
    // console.log('key ---===========', key, file);
    if (!file) return;
    setError(null);
    setUploadingKey(key);

    try {
      const resolvedGuid = getCookie("guid");
      const resolvedUserId = getCookie("id");

      const data = new FormData();
      data.append("api", "file.upload");
      data.append("guid", resolvedGuid);
      data.append("logged_in_user_account_id", resolvedUserId);
      data.append("user_account_id", profile);
      data.append("client_id", session);
      data.append("platform", "WEB");
      data.append("file_upload_destination", "student_photo_upload");
      data.append("uploaded_files[]", file);

      const resp = await fetch("/api/file.upload", {
        method: "POST",
        body: data,
      });

      const result = await resp.json();
      // console.log('_result====', result,);

      if (result?.success && result?.results?.files?.[0]) {
        // const uploadedUrl = result.results.files[0].full_url;
        const uploadedUrl = result.results.files[0].url;
        // console.log('____===========', result.results.files);
        // const relativePath = uploadedUrl.split(
        //   "https://infoeight-s3-new.s3.ap-south-1.amazonaws.com/students/demo-model-school-secondary-bankura/"
        // )[1];


        console.log('____ uploadedUrl ===========', result?.results?.files[0]);
        // Call patch API with the uploaded URL
     const  res=   await patchStudentDetail({
          ...basePayload,
          [key]: uploadedUrl,
        });
        // console.log('____ res ===========', res);

        setIsUpdated((prev) => !prev);
      } else {
        setError("File upload failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Error uploading file.");
    } finally {
      setUploadingKey(null);
    }
  };

  const renderDocCard = (label, key, fileUrl) => (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col items-center text-center">
      <div className="bg-blue-50 p-3 rounded-full mb-3">
        <FileText className="h-6 w-6 text-blue-600" />
      </div>

      <p className="text-sm font-semibold text-gray-800 mb-2">{label}</p>

      {fileUrl ? (
        <div className="flex flex-col items-center space-y-2">
          {fileUrl.match(/\.(jpg|jpeg|png|webp)$/i) ? (
            <img
              src={fileUrl}
              alt={label}
              className="h-24 w-24 object-cover rounded-md border"
            />
          ) : (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
            >
              View File
            </a>
          )}
        </div>
      ) : (
        <div className="text-xs text-gray-400 mb-2">No file uploaded</div>
      )}

      <label className="cursor-pointer flex flex-col items-center text-blue-600 text-sm hover:text-blue-800">
        <UploadCloud className="h-5 w-5 mb-1" />
        {uploadingKey === key ? "Uploading..." : "Upload"}
        <input
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => uploadAndSave(key, e.target.files[0])}
        />
      </label>
    </div>
  );

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderDocCard("Profile Image", "image_url", studentDetail.image_url)}
        {renderDocCard("Birth Certificate", "birth_certificate", studentDetail.birth_certificate)}
        {renderDocCard("Aadhaar", "aadhaar_image", studentDetail.aadhaar_image)}
        {renderDocCard("Family Photo", "family_photo", studentDetail.family_photo)}

        {error && (
          <p className="col-span-full text-center text-xs text-red-500">{error}</p>
        )}
      </div>


      <EditableField
        label="Aadhar Card Number"
        value={studentDetail.aadhar_card_number || ""}
        icon={Droplet}
        type="text"
        onSave={(val) => handleSave("aadhar_card_number", val)}
        setIsUpdated={setIsUpdated}

      />



      <EditableField
        label="Name Matches With Aadhaar"
        value={studentDetail.name_matches_with_aadhaar || ""}
        icon={Droplet}
        type="boolean"
        onSave={(val) => handleSave("name_matches_with_aadhaar", val)}
        setIsUpdated={setIsUpdated}

      />


      <EditableField
        label="Date Of Birth Matches With Aadhaar"
        value={studentDetail.date_of_birth_matches_with_aadhaar || ""}
        icon={Droplet}
        type="boolean"
        onSave={(val) => handleSave("date_of_birth_matches_with_aadhaar", val)}
        setIsUpdated={setIsUpdated}

      />



      <EditableField
        label="Father Name Matches With Aadhaar"
        value={studentDetail.father_name_matches_with_aadhaar || ""}
        icon={Droplet}
        type="boolean"
        onSave={(val) => handleSave("father_name_matches_with_aadhaar", val)}
        setIsUpdated={setIsUpdated}

      />


      <EditableField
        label="Address Matches With Aadhaar"
        value={studentDetail.address_matches_with_aadhaar || ""}
        icon={Droplet}
        type="boolean"
        onSave={(val) => handleSave("address_matches_with_aadhaar", val)}
        setIsUpdated={setIsUpdated}

      />





    </>
  );
}
