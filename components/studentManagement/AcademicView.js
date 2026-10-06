"use client";
import React from "react";
import { Heart, Calendar, Globe, Droplet, User, Church } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import { patchStudentDetail } from "../../api/student"; // adjust import path
import EditableField from "./EditableField"; // assuming you export it separately


export default function AcademicViewTab({
    studentDetail,
    session,
    profile,
    cookyGuid,
    cookyId,
    school,
    religions,
    nationalities,
    classes,
    setIsUpdated
}) {



    if (!studentDetail) return null;

    const basePayload = {
        user_account_id: profile,
        client_id: session,
        guid: cookyGuid,
        logged_in_user_account_id: cookyId,
        id: studentDetail.id,
        school_id: school,
        class_id: studentDetail.class?.id
    };

    const handleSave = async (key, value) => {
        console.log(key, value, basePayload);

        await patchStudentDetail({ ...basePayload, [key]: value });
    };

    return (
        <div className="grid md:grid-cols-2 gap-6">





            <EditableField
                label="Previous School"
                value={studentDetail.last_attended_school_name}
                icon={Heart}
                type="text"
                onSave={(val) => handleSave("last_attended_school_name", val)}
                setIsUpdated={setIsUpdated}
            />






            <EditableField
                label="Previous Board"
                value={studentDetail.previous_board}
                icon={Heart}
                type="text"
                onSave={(val) => handleSave("previous_board", val)}
                setIsUpdated={setIsUpdated}
            />



            <EditableField
                label="Previous Board(X) Roll No"
                value={studentDetail.previous_board_roll_number}
                icon={Heart}
                type="text"
                onSave={(val) => handleSave("previous_board_roll_number", val)}
                setIsUpdated={setIsUpdated}
            />







            <EditableField
                label="Year of Passing"
                value={studentDetail.year_of_passing}
                icon={Heart}
                type="text"
                onSave={(val) => handleSave("year_of_passing", val)}
                setIsUpdated={setIsUpdated}
            />






            <EditableField
                label="Board Registration No"
                value={studentDetail.board_registration_number}
                icon={Heart}
                type="text"
                onSave={(val) => handleSave("board_registration_number", val)}
                setIsUpdated={setIsUpdated}
            />




            <EditableField
                label="Previous Percentage"
                value={studentDetail.previous_percentage}
                icon={Heart}
                type="text"
                onSave={(val) => handleSave("previous_percentage", val)}
                setIsUpdated={setIsUpdated}
            />





            <EditableField
                label="Previous Working Days"
                value={studentDetail.previous_working_day}
                icon={Heart}
                type="text"
                onSave={(val) => handleSave("previous_working_day", val)}
                setIsUpdated={setIsUpdated}
            />



            <EditableField
                label="Permanent Education No"
                value={studentDetail.permanent_education_number}
                icon={Heart}
                type="text"
                onSave={(val) => handleSave("permanent_education_number", val)}
                setIsUpdated={setIsUpdated}
            />





            <EditableField
                label="Student Remarks"
                value={studentDetail.student_remarks}
                icon={Heart}
                type="text"
                onSave={(val) => handleSave("student_remarks", val)}
                setIsUpdated={setIsUpdated}
            />






            <EditableField
                label="Permanent Address"
                value={studentDetail.permanent_address}
                icon={Heart}
                type="text"
                onSave={(val) => handleSave("permanent_address", val)}
                setIsUpdated={setIsUpdated}
            />





            <EditableField
                label="Distance to School (km)"
                value={studentDetail.distance_to_school}
                icon={Heart}
                type="text"
                onSave={(val) => handleSave("distance_to_school", val)}
                setIsUpdated={setIsUpdated}
            />



        </div>
    );
}
