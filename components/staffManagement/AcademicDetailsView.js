"use client";
import React from "react";
import { Calendar, PhoneCall, Text, MapIcon, UniversityIcon } from "lucide-react";
import { patchStaffDetail } from "../../api/staff"; // adjust import path
import EditableField from "./EditableField"; // assuming you export it separately
import { BiCategory } from "react-icons/bi";
// ===========================================================
export default function AcademicDetailsViewTab({
    staffDetail,
    session,
    profile,
    cookyGuid,
    cookyId,
    school,
    bloodGroups,
    setIsUpdated,
    category
}) {


    // console.log('[---', staffDetail.emails[0]?.email);

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
        await patchStaffDetail({ ...basePayload, [key]: value });
    };

    return (
        <div className="grid md:grid-cols-2 gap-6">


            <EditableField
                label="Academic Qualification"
                value={staffDetail.academic_qualification}
                icon={UniversityIcon}
                type="text"
                onSave={(val) => handleSave("academic_qualification", val)}
                setIsUpdated={setIsUpdated}
            />


            <EditableField
                label="Professional Qualification"
                value={staffDetail.professional_qualification}
                icon={UniversityIcon}
                type="text"
                onSave={(val) => handleSave("professional_qualification", val)}
                setIsUpdated={setIsUpdated}
            />



            <EditableField
                label="Experience (in years)"
                value={staffDetail.experience}
                icon={UniversityIcon}
                type="text"
                onSave={(val) => handleSave("experience", val)}
                setIsUpdated={setIsUpdated}
            />



            
            <EditableField
                label="Year of Passing"
                value={staffDetail.year_of_passing}
                icon={UniversityIcon}
                type="date"
                onSave={(val) => handleSave("year_of_passing", val)}
                setIsUpdated={setIsUpdated}
            />








        </div>
    );
}
