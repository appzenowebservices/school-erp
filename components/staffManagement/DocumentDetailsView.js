"use client";
import React from "react";
import { Calendar, PhoneCall, Text, MapIcon, UniversityIcon } from "lucide-react";
import { patchStaffDetail } from "../../api/staff"; // adjust import path
import EditableField from "./EditableField"; // assuming you export it separately
import { BiCategory } from "react-icons/bi";
import { HiNumberedList } from "react-icons/hi2";
// ===========================================================
export default function DocumentDetailsViewTab({
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
                label="Aadhaar Card Number"
                value={staffDetail.aadhaar_number}
                icon={HiNumberedList}
                type="text"
                onSave={(val) => handleSave("aadhaar_number", val)}
                setIsUpdated={setIsUpdated}
            />





            <EditableField
                label="PAN Number"
                value={staffDetail.pan_number}
                icon={HiNumberedList}
                type="text"
                onSave={(val) => handleSave("pan_number", val)}
                setIsUpdated={setIsUpdated}
            />







            <EditableField
                label="Employee ID"
                value={staffDetail.employee_id}
                icon={HiNumberedList}
                type="text"
                onSave={(val) => handleSave("employee_id", val)}
                setIsUpdated={setIsUpdated}
            />






            <EditableField
                label="Special Designation"
                value={staffDetail.special_designation}
                icon={HiNumberedList}
                type="text"
                onSave={(val) => handleSave("special_designation", val)}
                setIsUpdated={setIsUpdated}
            />






            <EditableField
                label="Date of Retirement"
                value={staffDetail.date_of_retirement}
                icon={HiNumberedList}
                type="date"
                onSave={(val) => handleSave("date_of_retirement", val)}
                setIsUpdated={setIsUpdated}
            />







            <EditableField
                label="Type of Appointment"
                value={staffDetail.type_of_appointment}
                icon={HiNumberedList}
                type="select"
                options={["Probation","Contractual","Temporary","Permanent",]}
                onSave={(val) => handleSave("type_of_appointment", val)}
                setIsUpdated={setIsUpdated}
            />








        </div>
    );
}
