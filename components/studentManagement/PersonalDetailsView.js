"use client";
import React from "react";
import { Heart, Calendar, Globe, Droplet, User, Church, Mail, MapPin, Home, Languages, Phone } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import { patchStudentDetail } from "../../api/student"; // adjust import path
import EditableField from "./EditableField"; // assuming you export it separately

// const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
// const religions = ["HINDUISM", "ISLAM", "CHRISTIANITY", "SIKHISM", "BUDDHISM", "OTHER"];
// const nationalities = ["INDIAN", "OTHER"];

export default function PersonalDetailsViewTab({
    studentDetail,
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
    categories
}) {



    if (!studentDetail) return null;
    const basePayload = {
        user_account_id: profile,
        client_id: session,
        guid: cookyGuid,
        logged_in_user_account_id: cookyId,

        // core identifiers
        id: studentDetail.id,
        school_id: school,
        class_id: studentDetail.class?.id,

        blood_group: studentDetail.blood_group,          // "AB+"
        email: studentDetail.email,                      // "fi@gmail.com"
        address: studentDetail.address,                  // "narahi,lucknow"
        house_id: studentDetail.house_id,                      // null / —
        mother_tongue: studentDetail.mother_tongue,      // "BENGALI"
        religion: studentDetail.religion,                // "BUDDHISM"
        nationality: studentDetail.nationality,          // "INDIAN"
        is_hyper_active: studentDetail.is_hyper_active,  // "0" -> NO
        height: studentDetail.height,                    // "12"
        weight: studentDetail.weight,                    // "12"
        vision_left: studentDetail.vision_left,          // null / —
        vision_right: studentDetail.vision_right,        // null / —
        dental_hygiene: studentDetail.dental_hygiene,    // null / —
        category: studentDetail.category                 // "OBC"
    };


    const handleSave = async (key, value) => {
        await patchStudentDetail({ ...basePayload, [key]: value });
    };

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <EditableField
                label="Blood Group"
                value={studentDetail.blood_group}
                icon={Droplet}
                type="select"
                options={bloodGroups}
                onSave={(val) => handleSave("blood_group", val)}
                setIsUpdated={setIsUpdated}
            />

            <EditableField
                label="Email"
                value={studentDetail.email}
                icon={Mail}
                type="text"
                onSave={(val) => handleSave("email", val)}
                setIsUpdated={setIsUpdated}
            />

            {/* <EditableField
                label="Address"
                value={studentDetail.address}
                icon={MapPin}
                type="text"
                onSave={(val) => handleSave("address", val)}
                setIsUpdated={setIsUpdated}
            /> */}
            <EditableField
                label="House"
                value={houses?.find((h) => h?.id === studentDetail.house_id)?.name || ""}
                icon={Home}
                type="select"
                options={houses}
                onSave={(val) => handleSave("house_id", val)}
                setIsUpdated={setIsUpdated}
            />

            <EditableField
                label="Mother Tongue"
                value={studentDetail.mother_tongue}
                icon={Languages}
                type="select"
                options={motherTongues}

                onSave={(val) => handleSave("mother_tongue", val)}
                setIsUpdated={setIsUpdated}
            />



            {/* <EditableField
                label="Phone"
                value={studentDetail.phone}
                icon={Phone}
                type="text"
                onSave={(val) => handleSave("phone", val)}
                setIsUpdated={setIsUpdated}
            /> */}
            {/* <EditableField
                label="Locality"
                value={studentDetail.locality}
                icon={MapPin}
                type="text"
                onSave={(val) => handleSave("locality", val)}
                setIsUpdated={setIsUpdated}
            /> */}

            {/* <EditableField
                label="Landmark"
                value={studentDetail.landmark}
                icon={MapPin}
                type="text"
                onSave={(val) => handleSave("landmark", val)}
                setIsUpdated={setIsUpdated}
            /> */}
            <EditableField
                label="Religion"
                value={studentDetail.religion}
                icon={Church}
                type="select"
                options={religions}
                onSave={(val) => handleSave("religion", val)}
                setIsUpdated={setIsUpdated}
            />

            <EditableField
                label="Nationality"
                value={studentDetail.nationality}
                icon={User}
                type="select"
                options={nationalities}
                onSave={(val) => handleSave("nationality", val)}
                setIsUpdated={setIsUpdated}
            />

            {/* <EditableField
                label="Date of Birth"
                value={studentDetail.date_of_birth}
                icon={Calendar}
                type="date"
                onSave={(val) => handleSave("date_of_birth", val)}
                setIsUpdated={setIsUpdated}
            /> */}

            <EditableField
                label="Is Hyper Active"
                value={studentDetail.is_hyper_active}
                icon={Heart}
                type="boolean"
                onSave={(val) => handleSave("is_hyper_active", val)}
                setIsUpdated={setIsUpdated}
            // isEditable={false}
            />




            <EditableField
                label="Height (cm)"
                value={studentDetail.height}
                icon={Heart}
                type="text"
                onSave={(val) => handleSave("height", val)}
                setIsUpdated={setIsUpdated}
            />

            <EditableField
                label="Weight (kg)"
                value={studentDetail.weight}
                icon={Heart}
                type="text"
                onSave={(val) => handleSave("weight", val)}
                setIsUpdated={setIsUpdated}
            />

            <EditableField
                label="Vision (Left)"
                value={studentDetail.vision_left}
                icon={Heart}
                type="text"
                onSave={(val) => handleSave("vision_left", val)}
                setIsUpdated={setIsUpdated}
            />

            <EditableField
                label="Vision (Right)"
                value={studentDetail.vision_right}
                icon={Heart}
                type="text"
                onSave={(val) => handleSave("vision_right", val)}
                setIsUpdated={setIsUpdated}
            />



            <EditableField
                label="Dental Hygiene"
                value={studentDetail.dental_hygiene}
                icon={Heart}
                type="text"
                onSave={(val) => handleSave("dental_hygiene", val)}
                setIsUpdated={setIsUpdated}
            />


            <EditableField
                label="Category"
                value={studentDetail.category}
                icon={Heart}
                type="select"
                options={categories}
                onSave={(val) => handleSave("category", val)}
                setIsUpdated={setIsUpdated}
            />







        </div>
    );
}
