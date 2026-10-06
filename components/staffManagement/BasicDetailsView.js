"use client";
import React, { useState } from "react";
import { Heart, Calendar, Globe, Droplet, User, Church, Mail, MapPin, Home, Languages, Phone, CheckCircle, X } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import { patchStaffDetail } from "../../api/staff"; // adjust import path
import EditableField from "./EditableField"; // assuming you export it separately

// const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
// const religions = ["HINDUISM", "ISLAM", "CHRISTIANITY", "SIKHISM", "BUDDHISM", "OTHER"];
// const nationalities = ["INDIAN", "OTHER"];

export default function BasicDetailsViewTab({
    staffDetail,
    session,
    profile,
    cookyGuid,
    cookyId,
    school,
    religions,
    nationalities,
    bloodGroups,
    setIsUpdated,
    houses,
    motherTongues,
    categories,
    titles,
    gender,
    designation,
    classes
}) {

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);


    if (!staffDetail) return null;

    const basePayload = {
        user_account_id: profile,
        client_id: session,
        guid: cookyGuid,
        logged_in_user_account_id: cookyId,
        id: staffDetail.id,
        school_id: school,
        class_id: staffDetail.class?.id
    };


    const handleSave = async (key, value) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            await patchStaffDetail({ ...basePayload, [key]: value });


            setSuccess("Details updated successfully");
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
                    label="Title"
                    value={staffDetail.title?.name}
                    icon={Mail}
                    type="select"
                    options={titles}
                    onSave={(val) => handleSave("user_title_id", val)}
                    setIsUpdated={setIsUpdated}
                />

                <EditableField
                    label="Gender"
                    value={staffDetail.gender}
                    icon={MapPin}
                    type="select"
                    options={gender}

                    onSave={(val) => handleSave("gender", val)}
                    setIsUpdated={setIsUpdated}
                />



                <EditableField
                    label="Designation"
                    value={staffDetail?.designation?.name}
                    icon={MapPin}
                    type="select"
                    options={designation}

                    onSave={(val) => handleSave("school_designation_id", val)}
                    setIsUpdated={setIsUpdated}
                />


                <EditableField
                    label="Class"
                    value={staffDetail.class?.name}
                    icon={MapPin}
                    type="select"
                    options={classes}

                    onSave={(val) => handleSave("class_id", val)}
                    setIsUpdated={setIsUpdated}
                />

            </div>


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
