"use client";
import React, { useState } from "react";
import { Heart, Calendar, Globe, Droplet, User, Church, Mail, MapPin, Home, Languages, Phone, PhoneCall, Text, MapIcon, CheckCircle, X } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import { patchStaffDetail } from "../../api/staff"; // adjust import path
import EditableField from "./EditableField"; // assuming you export it separately
import { BiCategory } from "react-icons/bi";
import { SiNamebase } from "react-icons/si";

// const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
// const religions = ["HINDUISM", "ISLAM", "CHRISTIANITY", "SIKHISM", "BUDDHISM", "OTHER"];
// const nationalities = ["INDIAN", "OTHER"];

export default function PersonalDetailsViewTab({
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
    category
}) {



    if (!staffDetail) return null;
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    // console.log("staffDetail", staffDetail);

    const basePayload = {
        user_account_id: profile,
        client_id: session,
        guid: cookyGuid,
        logged_in_user_account_id: cookyId,

        id: staffDetail.id,

        date_of_birth: staffDetail?.date_of_birth,
        joining_date: staffDetail?.joining_date,
        is_enabled_for_invoice_notification: staffDetail?.is_enabled_for_invoice_notification !== null ? "1" : "0",
        class_coordinator_standard: staffDetail.class_coordinator_standard !== null ? "1" : "0",
        category: staffDetail?.category,
        blood_group: staffDetail?.blood_group,
        // emails: [...(staffDetail?.emails || []), staffDetail?.emails].filter(Boolean),
        emails: staffDetail?.emails?.[0] || "",
        phones: [...new Set([...(staffDetail?.phones || []), staffDetail?.phones].filter(Boolean))],
        emergency_contact_number: staffDetail?.emergency_contact_number,
        father_name: staffDetail?.father_name,
        mother_name: staffDetail?.mother_name,
        spouse_name: staffDetail?.spouse_name,
        name_of_son: staffDetail?.name_of_son,
        name_of_daughter: staffDetail?.name_of_daughter,
        address: staffDetail?.address,
        permanent_address: staffDetail?.permanent_address,

    };

    const handleSave = async (key, value) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const resp = await patchStaffDetail({
                ...basePayload,
                [key]: value
            });
            // console.log('03698745632',resp);

            if (resp?.success) {
                setSuccess(resp?.results?.message || "Updated successfully");
            } else {
                setError(
                    resp?.results?.message ||
                    "Update failed. The server chose violence."
                );
            }
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
                    label="Date Of Birth"
                    value={staffDetail.date_of_birth}
                    icon={Calendar}
                    type="date"
                    onSave={(val) => handleSave("date_of_birth", val)}
                    setIsUpdated={setIsUpdated}
                />


                <EditableField
                    label="Date Of Joining"
                    value={staffDetail.joining_date}
                    icon={Calendar}
                    type="date"
                    onSave={(val) => handleSave("joining_date", val)}
                    setIsUpdated={setIsUpdated}
                />





                <EditableField
                    label="Enabled for Invoice Notification"
                    value={staffDetail.joining_date}
                    icon={Calendar}
                    type="boolean"
                    onSave={(val) => handleSave("joining_date", val)}
                    setIsUpdated={setIsUpdated}
                />

                <EditableField
                    label="Is Class Coordinator"
                    value={staffDetail.class_coordinator_standard}
                    icon={Calendar}
                    type="boolean"
                    onSave={(val) => handleSave("class_coordinator_standard", val)}
                    setIsUpdated={setIsUpdated}
                />




                <EditableField
                    label="Category"
                    value={staffDetail.category}
                    icon={BiCategory}
                    type="select"
                    options={category}
                    onSave={(val) => handleSave("category", val)}
                    setIsUpdated={setIsUpdated}
                />




                <EditableField
                    label="Blood Group"
                    value={staffDetail.blood_group}
                    icon={BiCategory}
                    type="select"
                    options={bloodGroups}
                    onSave={(val) => handleSave("blood_group", val)}
                    setIsUpdated={setIsUpdated}
                />




                <EditableField
                    label="Emails"
                    value={staffDetail?.emails?.[0]?.email || ""}
                    icon={BiCategory}
                    type="text"
                    onSave={(val) => handleSave("emails", val)}
                    setIsUpdated={setIsUpdated}
                />


                <EditableField
                    label="Phone No(s)"
                    value={staffDetail?.phones?.[0]?.phone}
                    icon={PhoneCall}
                    type="text"
                    onSave={(val) => handleSave("phones", val)}
                    setIsUpdated={setIsUpdated}
                />


                <EditableField
                    label="Emergency Contact No."
                    value={staffDetail.emergency_contact_number}
                    icon={PhoneCall}
                    type="text"
                    onSave={(val) => handleSave("emergency_contact_number", val)}
                    setIsUpdated={setIsUpdated}
                />


                <EditableField
                    label="Father's Name"
                    value={staffDetail.father_name}
                    icon={Text}
                    type="text"
                    onSave={(val) => handleSave("father_name", val)}
                    setIsUpdated={setIsUpdated}
                />




                <EditableField
                    label="Mother's Name"
                    value={staffDetail.mother_name}
                    icon={Text}
                    type="text"
                    onSave={(val) => handleSave("mother_name", val)}
                    setIsUpdated={setIsUpdated}
                />




                <EditableField
                    label="Spouse's Name"
                    value={staffDetail.spouse_name}
                    icon={Text}
                    type="text"
                    onSave={(val) => handleSave("spouse_name", val)}
                    setIsUpdated={setIsUpdated}
                />




                <EditableField
                    label="Son's Name"
                    value={staffDetail.name_of_son}
                    icon={Text}
                    type="text"
                    onSave={(val) => handleSave("name_of_son", val)}
                    setIsUpdated={setIsUpdated}
                />


                <EditableField
                    label="Daughter's Name"
                    value={staffDetail.name_of_daughter}
                    icon={Text}
                    type="text"
                    onSave={(val) => handleSave("name_of_daughter", val)}
                    setIsUpdated={setIsUpdated}
                />


                <EditableField
                    label="Current Address"
                    value={staffDetail.address}
                    icon={MapIcon}
                    type="text"
                    onSave={(val) => handleSave("address", val)}
                    setIsUpdated={setIsUpdated}
                />


                <EditableField
                    label="Permanent Address"
                    value={staffDetail.permanent_address}
                    icon={MapIcon}
                    type="text"
                    onSave={(val) => handleSave("permanent_address", val)}
                    setIsUpdated={setIsUpdated}
                />




            </div>

            {
                success && (
                    <div className="fixed top-6 right-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-5 py-4 rounded-lg shadow-lg z-50">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 mt-0.5" />
                            <p className="text-sm font-semibold">{success}</p>
                        </div>
                    </div>
                )
            }

            {/* Error Toast */}
            {
                error && (
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
                )
            }



        </>
    );
}
