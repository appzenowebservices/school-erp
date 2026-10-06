import React, { useState, useMemo, useEffect } from "react";
import { X, Upload, User, Users, Phone, Briefcase, FileText, UserPlus, Trash2, Image as ImageIcon } from "lucide-react";
import { getCookie } from "cookies-next";
import { getSessionCache } from "../../utils/sessionCache";

export default function ParentEditModal({
  open,
  onClose,
  editingParent = null,
  updateParents
}) {

  const context = getSessionCache("dashboardContext");
  const config = getSessionCache("dashboardConfig");

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const mapEditingParent = (p = {}) => {
    // produce a complete, safe form shape
    return {
      id: p?.id,
      profile_img: p?.image_url ? { preview: p.image_url, uploadedUrl: p.image_url } : null,
      family_img: null,
      name: p?.name || "",
      date_of_birth: p?.date_of_birth || "",
      gender: p?.gender || "",
      is_alumni: p?.is_alumni || "",
      is_single_parent: p?.is_single_parent || "",
      nationality: p?.nationality || "",
      pan: p?.pancard_number || "",
      aadhaar: p?.aadhaar_number || "",
      annual_income: p?.annual_income || "",
      profession: p?.profession || "",
      designation: p?.designation || "",
      organisation: p?.organization || "",
      org_address: p?.organization_address || "",
      qualification: p?.qualification || "",
      comment: p?.comment || "",
      emails: p?.emails || [],
      phones: Array.isArray(p?.phones) ? p.phones.map(x => x.phone || x) : [p?.phone || ""],
      children: Array.isArray(p?.students)
        ? p.students.map(s => ({
          id: s.id,
          name: s.name || "",
          className: s.class || "",
          rollNumber: s.roll_number || "",
          relation: s.relation_with_parent || "",
          image: s.image_url || null
        }))
        : [],

      locality: p?.locality || "",
      landmark: p?.landmark || "",
      city: p?.city || "",
      state_id: p?.state_id || "",
    };
  };

  const getEmptyForm = () => ({
    id: "",
    profile_img: null,
    family_img: null,
    name: "",
    date_of_birth: "",
    gender: "",
    is_alumni: "",
    is_single_parent: "",
    nationality: "",
    pan: "",
    aadhaar: "",
    annual_income: "",
    profession: "",
    designation: "",
    organisation: "",
    org_address: "",
    qualification: "",
    comment: "",
    emails: [],
    phones: [""],
    children: [],
    locality: "",
    landmark: "",
    city: "",
    state_id: ""
  });

  const [form, setForm] = useState(() => editingParent ? mapEditingParent(editingParent) : getEmptyForm());

  // Sync incoming editingParent -> form when prop changes or when modal opens
  useEffect(() => {
    if (editingParent) {
      setForm(mapEditingParent(editingParent));
    } else {
      setForm(getEmptyForm());
    }
  }, [editingParent, open]);


  const relations = ["Father", "Mother", "Guardian"];

  // Helper to get classes for a standard
  const getClassesByStandard = (standardId) => {
    const standard = config?.standards?.find((s) => s.id === standardId);
    return standard?.classes || [];
  };

  // Helper to get students for a class
  const getStudentsByClass = (standardId, classId) => {
    const classes = getClassesByStandard(standardId);
    const cls = classes.find((c) => c.id === classId);
    return cls?.students || [];
  };

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Children helpers
  const updateChild = (index, key, value) => {
    const arr = [...form.children];
    arr[index] = { ...arr[index], [key]: value };

    // Reset studentId if class changes
    if (key === "classId") arr[index].studentId = "";

    updateField("children", arr);
  };

  const addChild = () => {
    updateField("children", [
      ...form.children,
      { standardId: "", classId: "", studentId: "", relation: "" },
    ]);
  };

  const removeChild = (index) => {
    const arr = [...form.children];
    arr.splice(index, 1);
    updateField("children", arr);
  };

  const addPhone = () => {
    updateField("phones", [...form.phones, ""]);
  };

  const updatePhone = (i, v) => {
    const arr = [...form.phones];
    arr[i] = v;
    updateField("phones", arr);
  };

  const removePhone = (i) => {
    const arr = [...form.phones];
    arr.splice(i, 1);
    updateField("phones", arr);
  };

  const handleSubmit = async () => {
    setSubmitted(true)
    setError(null);
    setSuccess(null);

    try {
      const payload = {

        id: form.id,
        name: form.name,
        date_of_birth: form.date_of_birth || "",
        gender: form.gender,
        blood_group: form.blood_group || "",
        aadhaar_number: form.aadhaar || "",
        emails: form.emails || [],
        phones: form.phones,
        pan: form.pan || "",
        pan: form.qualification || "",
        designation: form.designation || "",
        organisation: form.organisation || "",
        comment: form.comment || "",
        org_address: form.org_address || "",
        profession: form.profession || "",
        annual_income: form.annual_income || "",
        is_single_parent: form.is_single_parent || "",
        is_alumni: form.is_alumni || "",
        profile_img: form.profile_img || "",
        family_img: form.family_img || "",

        students: form.children || "",
        nationality: form.nationality || "",
      };

      if (updateParents) {
        console.log('payload--', payload)

        const resp = await updateParents(
          context?.profileId,
          context?.session,
          payload
        );


        if (resp?.data?.success) {
          setSuccess(resp.data?.results?.message || "Parent saved successfully");
          setTimeout(() => {
            setSuccess(null);
            onClose();
            window.location.reload(); // reload the page

          }, 780);
          setSubmitted(false)
        } else {
          setError(resp?.data?.results?.message || "Failed to save parent");
          setSubmitted(false)

        }
      } else {
        throw new Error("No function provided to handle parent submission");
      }
    } catch (err) {
      console.error("Error submitting parent form:", err);
      setError(err.message || "Something went wrong while saving parent");
    }
  };

  const uploadParentImage = async (key, file) => {
    if (!file) return;

    try {
      updateField(key, { uploading: true, file: null, preview: null, uploadedUrl: null });

      const resolvedGuid = getCookie("guid");
      const resolvedUserId = getCookie("id");

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
        const fullUrl = result.results.files[0].full_url;

        const relative = fullUrl.split(
          "https://infoeight-s3-new.s3.ap-south-1.amazonaws.com/students/demo-model-school-secondary-bankura/"
        )[1];

        const previewUrl = URL.createObjectURL(file);

        updateField(key, {
          file,
          preview: previewUrl,
          uploadedUrl: fullUrl,
          relativePath: relative,
          uploading: false
        });
      } else {
        updateField(key, { error: "Upload failed", uploading: false });
      }
    } catch (err) {
      console.error(err);
      updateField(key, { error: "Upload error", uploading: false });
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        {/* Modal Container */}
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                {editingParent ? "Edit Parent Details" : "Add New Parent"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="cursor-pointer p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 p-6">
            <div className="space-y-8">
              {/* Image Uploads Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  Profile Images
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  {/* Profile Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Photo
                    </label>
                    {form.profile_img?.preview ? (
                      <div className="relative h-48 w-full border-2 border-gray-200 rounded-xl overflow-hidden group">
                        <img
                          src={form.profile_img.preview}
                          alt="profile"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transform hover:scale-110 transition-transform"
                            onClick={() => updateField("profile_img", null)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition-all group">
                        <Upload className="w-10 h-10 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                        <span className="text-sm font-medium text-gray-600">Upload Profile Photo</span>
                        <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => uploadParentImage("profile_img", e.target.files[0])}
                        />
                      </label>
                    )}
                  </div>

                  {/* Family Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Family Photo
                    </label>
                    {form.family_img?.preview ? (
                      <div className="relative h-48 w-full border-2 border-gray-200 rounded-xl overflow-hidden group">
                        <img
                          src={form.family_img.preview}
                          alt="family"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transform hover:scale-110 transition-transform"
                            onClick={() => updateField("family_img", null)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition-all group">
                        <Upload className="w-10 h-10 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                        <span className="text-sm font-medium text-gray-600">Upload Family Photo</span>
                        <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => uploadParentImage("family_img", e.target.files[0])}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      value={form.gender}
                      onChange={(e) => updateField("gender", e.target.value)}
                    >
                      <option value="">Select gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alumni Status
                    </label>
                    <select
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      value={form.is_alumni ?? ""}
                      onChange={(e) => updateField("is_alumni", e.target.value)}
                    >
                      <option value="">Select status</option>
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Single Parent
                    </label>
                    <select
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      value={form.is_single_parent ?? ""}
                      onChange={(e) => updateField("is_single_parent", e.target.value)}
                    >
                      <option value="">Select status</option>
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>

                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nationality
                    </label>
                    <input
                      type="text"
                      placeholder="Enter nationality"
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      value={form.nationality}
                      onChange={(e) => updateField("nationality", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Qualification
                    </label>
                    <input
                      type="text"
                      placeholder="Enter qualification"
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      value={form.qualification}
                      onChange={(e) => updateField("qualification", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Identity Documents */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Identity Documents
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PAN Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter PAN number"
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all uppercase"
                      value={form.pan}
                      onChange={(e) => updateField("pan", e.target.value.toUpperCase())}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aadhaar Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Aadhaar number"
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      value={form.aadhaar}
                      onChange={(e) => updateField("aadhaar", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Professional Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profession
                    </label>
                    <input
                      type="text"
                      placeholder="Enter profession"
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      value={form.profession}
                      onChange={(e) => updateField("profession", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      placeholder="Enter designation"
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      value={form.designation}
                      onChange={(e) => updateField("designation", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organisation
                    </label>
                    <input
                      type="text"
                      placeholder="Enter organisation name"
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      value={form.organisation}
                      onChange={(e) => updateField("organisation", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Annual Income
                    </label>
                    <input
                      type="number"
                      placeholder="Enter annual income"
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      value={form.annual_income}
                      onChange={(e) => updateField("annual_income", e.target.value)}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organisation Address
                    </label>
                    <input
                      type="text"
                      placeholder="Enter complete organisation address"
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      value={form.org_address}
                      onChange={(e) => updateField("org_address", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  {form?.phones.map((ph, i) => (
                    <div key={i} className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Enter phone number"
                        value={ph}
                        onChange={(e) => updatePhone(i, e.target.value)}
                        className="flex-1 border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                      {i > 0 && (
                        <button
                          onClick={() => removePhone(i)}
                          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addPhone}
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors font-medium flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Add Phone Number
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Linked Students
                </h3>

                {form.children.length === 0 && (
                  <div className="text-gray-500 text-sm">No children linked yet.</div>
                )}

                <div className="space-y-4">
                  {form.children.map((child, index) => (
                    <div
                      key={child.id || index}
                      className="border rounded-xl p-4 flex items-center justify-between bg-gray-50"
                    >
                      {/* Left Section: Avatar + Info */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                          {child.image ? (
                            <img
                              src={child.image_url}
                              alt={child.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={"/placeholder-student.png"}
                              alt={child.name}
                              className="w-full h-full object-cover"
                            />

                          )}
                        </div>

                        <div>
                          <div className="font-semibold">{child.name}</div>
                          <div className="text-sm text-gray-600">
                            {child.class} • Roll No. {child.roll_number || child.rollNumber}
                          </div>
                          <div className="text-sm text-blue-600">
                            Relation: {child.relation_with_parent || child?.relation}
                          </div>
                        </div>
                      </div>

                      {/* Right Section: Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => removeChild(index)}
                          className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Remove Student
                        </button>
                        <button
                          onClick={() => yourEditFunction(index)}
                          className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Update Relation
                        </button>

                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Children Mapping */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Children Details
                </h3>
                <div className="space-y-4">
                  {form.children.map((child, i) => (
                    <div key={i} className="p-4 border-2 border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-700">Child {i + 1}</span>
                        {i > 0 && (
                          <button
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                            onClick={() => removeChild(i)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Standard
                          </label>
                          <select
                            className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={child.standardId}
                            onChange={(e) => updateChild(i, "standardId", e.target.value)}
                          >
                            <option value="">Select</option>
                            {config?.standards?.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Class
                          </label>
                          <select
                            className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                            value={child.classId}
                            onChange={(e) => updateChild(i, "classId", e.target.value)}
                            disabled={!child.standardId}
                          >
                            <option value="">Select</option>
                            {child.standardId &&
                              getClassesByStandard(child.standardId).map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Student
                          </label>
                          <select
                            className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                            value={child.studentId}
                            onChange={(e) => updateChild(i, "studentId", e.target.value)}
                            disabled={!child.classId}
                          >
                            <option value="">Select</option>
                            {child.standardId &&
                              child.classId &&
                              getStudentsByClass(child.standardId, child.classId).map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.name}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Relation
                          </label>
                          <select
                            className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={child.relation}
                            onChange={(e) => updateChild(i, "relation", e.target.value)}
                          >
                            <option value="">Select</option>
                            {["Father", "Mother", "Guardian"].map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addChild}
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors font-medium flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add Child
                  </button>
                </div>
              </div>

              {/* Additional Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Comments
                </label>
                <textarea
                  placeholder="Enter any additional information or comments..."
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all min-h-[100px] resize-y"
                  value={form.comment}
                  onChange={(e) => updateField("comment", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              disabled={submitted}
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium"
            >
              {!submitted ? "Update Parent" : "Updating ..."}
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {error && (
        <div className="fixed top-6 right-6 flex items-center bg-red-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-lg shadow-lg z-50 animate-slide-in max-w-md">
          <div className="flex-1">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="ml-4">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {success && (
        <div className="fixed top-4 right-4 flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md shadow-md z-50">
          <span>{success}</span>
        </div>
      )}
    </>
  );
}
