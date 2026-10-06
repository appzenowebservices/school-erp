"use client";
import React from "react";
import { Calendar, PhoneCall, Text, MapIcon, UniversityIcon } from "lucide-react";
import { patchStaffDetail } from "../../api/staff"; // adjust import path
import EditableField from "./EditableField"; // assuming you export it separately
import { BiCategory } from "react-icons/bi";
import { CiBank } from "react-icons/ci";
// ===========================================================
export default function BankDetailsViewTab({
    staffDetail,
    session,
    profile,
    cookyGuid,
    cookyId,
    school,
    setIsUpdated,

}) {

console.log(staffDetail);


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
                label="Bank"
                value={staffDetail.bank_details?.bank?.name}
                icon={CiBank}
                type="text"
                onSave={(val) => handleSave("bank_details", val)}
                setIsUpdated={setIsUpdated}
            />





            <EditableField
                label="Account Holder Name"
                value={staffDetail?.bank_details?.account_holder_name}
                icon={CiBank}
                type="text"
                onSave={(val) => handleSave("account_holder_name", val)}
                setIsUpdated={setIsUpdated}
            />

            
            <EditableField
                label="Account Number"
                value={staffDetail.bank_details?.account_number}
                icon={CiBank}
                type="text"
                onSave={(val) => handleSave("bank_details", val)}
                setIsUpdated={setIsUpdated}
            />


       

         
            <EditableField
                label="IFSC Code"
                value={staffDetail.bank_details?.ifsc_code}
                icon={CiBank}
                type="text"
                onSave={(val) => handleSave("bank_details", val)}
                setIsUpdated={setIsUpdated}
            />


            
            <EditableField
                label="Branch Name"
                value={staffDetail.bank_details?.branch_name}
                icon={CiBank}
                type="text"
                onSave={(val) => handleSave("bank_details.branch_name", val)}
                setIsUpdated={setIsUpdated}
            />






        </div>
    );
}
