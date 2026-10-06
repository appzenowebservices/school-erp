"use client";
import React, { useState } from "react";
import {
    Home,
    Phone,
    Mail,
    MapPin,
    Droplet,
    User,
    Globe,
    Church,
    Languages,
    Calendar,
    CheckCircle,
    X
} from "lucide-react";
import EditableField from "./EditableField";
import { patchStudentDetail } from "../../api/student";
import { BiMobile } from "react-icons/bi";

export default function BasicDetailViewTab({
    studentDetail,
    session,
    profile,
    cookyGuid,
    cookyId,
    school,

    houses,
    motherTongues,
    setIsUpdated,
    classes
}) {
    // console.log('classes______________+++', classes);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!studentDetail) return null;

    const basePayload = {
        user_account_id: profile,
        client_id: session,
        guid: cookyGuid,
        logged_in_user_account_id: cookyId,
        id: studentDetail.id,
        school_id: school,
        address: studentDetail.address,                  // "narahi,lucknow"
        "class_id": studentDetail?.class_id,

        // class_id: studentDetail.class?.id

    };

    const handleSave = async (key, value) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            console.log('basePayload', basePayload);

            const resp = await patchStudentDetail({
                ...basePayload,
                [key]: value
            });
            console.log(resp);
            if (resp?.success) {

                setSuccess(resp?.results?.message);
            } else {
                setError(resp?.results?.message);

            }

            // setIsUpdated?.(prev => !prev);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Something broke. The server knows why."
            );
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(null), 3000);
        }
    };

    return (
        <>
            <div className="grid md:grid-cols-2 gap-6">
                <EditableField
                    label="Gender"
                    value={studentDetail.gender}
                    icon={User}
                    type="select"
                    options={["MALE", "FEMALE"]}
                    onSave={(val) => handleSave("gender", val)}
                    setIsUpdated={setIsUpdated}
                />

                <EditableField
                    label="Date of Birth"
                    value={studentDetail.date_of_birth}
                    icon={Calendar}
                    type="date"
                    onSave={(val) => handleSave("date_of_birth", val)}
                    setIsUpdated={setIsUpdated}
                />



                <EditableField
                    label="Roll Number"
                    value={studentDetail.roll_number}
                    icon={Calendar}
                    type="text"
                    onSave={(val) => handleSave("roll_number", val)}
                    setIsUpdated={setIsUpdated}
                />


                <EditableField
                    label="Registration Number"
                    value={studentDetail.registration_number}
                    icon={Calendar}
                    type="text"
                    onSave={(val) => handleSave("registration_number", val)}
                    setIsUpdated={setIsUpdated}
                />



                <EditableField
                    label="Admission Number"
                    value={studentDetail.admission_number}
                    icon={Calendar}
                    type="text"
                    onSave={(val) => handleSave("admission_number", val)}
                    setIsUpdated={setIsUpdated}
                />
                <EditableField
                    label="Class"
                    value={classes?.find(cls => cls?.id === studentDetail.class_id)?.name || ""}
                    icon={Droplet}
                    type="select"
                    options={classes}
                    onSave={(val) => handleSave("class_id", val)}
                    setIsUpdated={setIsUpdated}
                    isEditable={true}

                />


                <EditableField
                    label="Contact Number"
                    value={studentDetail?.calling_numbers?.map(cls => cls?.phone) || ""}
                    icon={BiMobile}
                    type="array"
                    options={classes}
                    onSave={(val) => handleSave("calling_numbers", val)}
                    setIsUpdated={setIsUpdated}
                    isEditable={false}

                />
                <EditableField
                    label="Number Registered for SMS"
                    value={studentDetail?.emergency_contact_number || ""}
                    icon={BiMobile}
                    type="text"
                    options={classes}
                    onSave={(val) => handleSave("emergency_contact_number", val)}
                    setIsUpdated={setIsUpdated}
                    isEditable={false}

                />

                <EditableField
                    label="Optional Subjects"
                    icon={Languages}
                    isEditable={false}
                    value={
                        <div className="flex flex-wrap gap-2">
                            {studentDetail?.optional_subject_front_end
                                ?.split(',')
                                .map(sub => (
                                    <span
                                        key={sub}
                                        className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700 border"
                                    >
                                        {sub.trim()}
                                    </span>
                                )) || "—"}
                        </div>
                    }
                />

                <EditableField
                    label="Address"
                    value={studentDetail?.address}
                    icon={MapPin}
                    type="text"
                    onSave={(val) => handleSave("address", val)}
                    setIsUpdated={setIsUpdated}
                />


            </div>
            {/* Success Toast */}
            {success && (
                <div className="fixed top-6 right-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-5 py-4 rounded-lg shadow-lg z-50">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 mt-0.5" />
                        <p className="text-sm font-semibold">{success}</p>
                    </div>
                </div>
            )}

            {/* Error Toast */}
            {error && (
                <div className="fixed top-6 right-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-lg shadow-lg z-50">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <p className="font-semibold">Update failed</p>
                            <p className="text-sm">{error}</p>
                        </div>
                        <button onClick={() => setError(null)}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}