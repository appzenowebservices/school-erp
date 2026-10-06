"use client";

import React from "react";
import {
    FileText,
    FileSpreadsheet,
    Archive,
    FolderDown,
    Download
} from "lucide-react";
import { getSessionCache } from "../../utils/sessionCache";
// ==================================================================
// ==================================================================
export default function DownloadStudentData() {
    function hasPermission(permission) {
        if (!permission) return true;
        return true;

    }

    function getFileIcon(name) {
        if (name.includes("pdf")) return <FileText size={16} />;
        if (name.includes("xls") || name.includes("xlsx"))
            return <FileSpreadsheet size={16} />;
        if (name.includes("zip")) return <Archive size={16} />;
        return <FolderDown size={16} />;
    }

    const context = getSessionCache("dashboardContext");
    const clientId = context?.session
    const menu = [
        {
            name: "Download Students Image",
            permission: "client.getStudentsPhotoFile",
            download: false,
            icon: "side-menu-icons/one.png",
            url: "#",
            sub_menu: [
                {
                    name: ".zip",
                    permission: "client.getStudentsPhotoFile",
                    download: false,
                    icon: "zip-icon.png",
                    url: `client/download-students-image?id=${clientId}?classId=99900`,
                    sub_menu: [],
                    class: "select-classes-for-download-student-image"
                },
                {
                    name: ".pdf",
                    permission: "client.getProofReadingData",
                    download: false,
                    icon: "pdf-icon.png",
                    url: `client/students-photo?id=${clientId}`,
                    sub_menu: [],
                    class: "select-classes-for-download-student-image"
                }
            ]
        },
        {
            name: "Student Without Phone Numbers",
            permission: "client.getStudentsWithoutPhoneNumbers",
            download: false,
            icon: "side-menu-icons/one.png",
            url: "#",
            sub_menu: [
                {
                    name: ".xls",
                    permission: "client.getStudentsWithoutPhoneNumbers",
                    download: false,
                    icon: "xls-icon.png",
                    url: `client/download-students-without-phones?id=${clientId}`,
                    sub_menu: []
                }
            ]
        },
        {
            name: "Proof Reading",
            permission: "client.getProofReadingData",
            download: false,
            icon: "side-menu-icons/one.png",
            url: "#",
            sub_menu: [
                {
                    name: ".pdf",
                    class: "pdf-download",
                    permission: "client.getProofReadingData",
                    download: false,
                    icon: "pdf-icon.png",
                    url: `client/proof-reading?id=${clientId}&format=HARD COPY`,
                    sub_menu: []
                },
                {
                    name: ".xls",
                    class: "xls-download",
                    permission: "client.getProofReadingData",
                    download: false,
                    icon: "xls-icon.png",
                    url: `client/proof-reading?id=${clientId}&format=SOFT COPY&all_students=true`,
                    sub_menu: []
                }
            ]
        },
        {
            name: "Students Without Aadhaar Number",
            permission: "client.getStudentsWithoutAadhaarCardNumber",
            download: false,
            icon: "side-menu-icons/one.png",
            url: "",
            sub_menu: [
                {
                    name: ".xls",
                    permission: "client.getProofReadingData",
                    download: false,
                    icon: "xls-icon.png",
                    url: `client/download-students-without-aadhaar-card-number?id=${clientId}&format=SOFT COPY`,
                    sub_menu: []
                }
            ]
        },
        {
            name: "Duplicate Admission Number",
            permission: "client.getStudentsWithDuplicateAdmissionNumber",
            download: false,
            icon: "side-menu-icons/one.png",
            url: "#",
            sub_menu: [
                {
                    name: ".xls",
                    permission: "client.getStudentsWithDuplicateAdmissionNumber",
                    download: false,
                    icon: "xls-icon.png",
                    url: `client/duplicate-admission-number?id=${clientId}&format=SOFT COPY`,
                    sub_menu: []
                },
                {
                    name: ".pdf",
                    permission: "client.getStudentsWithDuplicateAdmissionNumber",
                    download: false,
                    icon: "pdf-icon.png",
                    url: `client/duplicate-admission-number?id=${clientId}&format=HARD COPY`,
                    sub_menu: []
                }
            ]
        },
        {
            name: "Duplicate Roll Number",
            permission: "client.getStudentsWithDuplicateRollNumber",
            download: false,
            icon: "side-menu-icons/one.png",
            url: "#",
            sub_menu: [
                {
                    name: ".xls",
                    permission: "client.getStudentsWithDuplicateRollNumber",
                    download: false,
                    icon: "xls-icon.png",
                    url: `client/duplicate-roll-number?id=${clientId}&format=SOFT COPY`,
                    sub_menu: []
                },
                {
                    name: ".pdf",
                    permission: "client.getStudentsWithDuplicateRollNumber",
                    download: false,
                    icon: "pdf-icon.png",
                    url: `client/duplicate-roll-number?id=${clientId}&format=HARD COPY`,
                    sub_menu: []
                }
            ]
        },
        {
            name: "Duplicate Registration Number",
            permission: "client.getStudentsWithDuplicateRegistrationNumber",
            download: false,
            icon: "side-menu-icons/one.png",
            url: "#",
            sub_menu: [
                {
                    name: ".xls",
                    permission: "client.getStudentsWithDuplicateRegistrationNumber",
                    download: false,
                    icon: "xls-icon.png",
                    url: `client/duplicate-registration-number?id=${clientId}&format=SOFT COPY`,
                    sub_menu: []
                },
                {
                    name: ".pdf",
                    permission: "client.getStudentsWithDuplicateRegistrationNumber",
                    download: false,
                    icon: "pdf-icon.png",
                    url: `client/duplicate-registration-number?id=${clientId}&format=HARD COPY`,
                    sub_menu: []
                }
            ]
        },
        {
            name: "Students With Missing Roll Number",
            permission: "client.getStudentsMissingRollNumber",
            download: false,
            icon: "side-menu-icons/one.png",
            url: "#",
            sub_menu: [
                {
                    name: ".xls",
                    permission: "client.getStudentsMissingRollNumber",
                    download: false,
                    icon: "xls-icon.png",
                    url: `client/missing-roll-number?id=${clientId}&format=SOFT COPY`,
                    sub_menu: []
                },
                {
                    name: ".pdf",
                    permission: "client.getStudentsMissingRollNumber",
                    download: false,
                    icon: "pdf-icon.png",
                    url: `client/missing-roll-number?id=${clientId}&format=HARD COPY`,
                    sub_menu: []
                }
            ]
        },
        {
            name: "Students Without Photo",
            permission: "client.getStudentsWithoutPhoto",
            download: false,
            icon: "side-menu-icons/one.png",
            url: "#",
            sub_menu: [
                {
                    name: ".xls",
                    permission: "client.getStudentsWithoutPhoto",
                    download: false,
                    icon: "xls-icon.png",
                    url: `client/students-without-photo?id=${clientId}&format=SOFT COPY`,
                    sub_menu: []
                },
                {
                    name: ".pdf",
                    permission: "client.getStudentsWithoutPhoto",
                    download: false,
                    icon: "pdf-icon.png",
                    url: `client/students-without-photo?id=${clientId}&format=HARD COPY`,
                    sub_menu: []
                }
            ]
        },
        {
            name: "Student With Same Phone Numbers",
            permission: "client.getStudentsWithSamePhoneNumbers",
            download: false,
            icon: "side-menu-icons/one.png",
            url: "#",
            sub_menu: [
                {
                    name: ".xls",
                    permission: "client.getStudentsWithSamePhoneNumbers",
                    download: false,
                    icon: "xls-icon.png",
                    url: `client/download-students-with-same-phones?id=${clientId}&format=SOFT COPY`,
                    sub_menu: []
                },

            ]
        },




        // {
        //     name: "Student Report",
        //     permission: "client.getStudentsWithSamePhoneNumbers",
        //     download: false,
        //     icon: "side-menu-icons/one.png",
        //     url: "#",
        //     sub_menu: [
        //         {
        //             name: ".pdf",
        //             permission: "client.getStudentsWithSamePhoneNumbers",
        //             download: false,
        //             icon: "xls-icon.png",
        //             url: `client/download-students-with-same-phones?id=${clientId}&format=SOFT COPY`,
        //             sub_menu: []
        //         },

        //     ]
        // }

        //  {
        //     name: "Missing Basic Information",
        //     permission: "client.getStudentsWithSamePhoneNumbers",
        //     download: false,
        //     icon: "side-menu-icons/one.png",
        //     url: "#",
        //     sub_menu: [
        //         {
        //             name: ".xlsx",
        //             permission: "client.getStudentsWithSamePhoneNumbers",
        //             download: false,
        //             icon: "xls-icon.png",
        //             url: `client/download-students-with-same-phones?id=${clientId}&format=SOFT COPY`,
        //             sub_menu: []
        //         },

        //     ]
        // }
         {
            name: "Missing Parents",
            permission: "client.getStudentsWithSamePhoneNumbers",
            download: false,
            icon: "side-menu-icons/one.png",
            url: "#",
            sub_menu: [
                {
                    name: ".xlsx",
                    permission: "client.getStudentsWithSamePhoneNumbers",
                    download: false,
                    icon: "xls-icon.png",
                    url: `download-students-with-missing-parents?id=${clientId}&format=SOFT COPY`,
                    sub_menu: []
                },

            ]
        },
   {
            name: "Missing Health Status",
            permission: "client.getStudentsWithSamePhoneNumbers",
            download: false,
            icon: "side-menu-icons/one.png",
            url: "#",
            sub_menu: [
                {
                    name: ".xlsx",
                    permission: "client.getStudentsWithSamePhoneNumbers",
                    download: false,
                    icon: "xls-icon.png",
                    url: `download-students-with-missing-health-status?id=${clientId}&format=SOFT COPY`,
                    sub_menu: []
                },

            ]
        },


    ];

    // ==================================================================
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                        <Download className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                        Download Center
                    </h1>
                    <p className="text-slate-600">Select a report and choose your preferred format</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {menu?.map((item, index) => {
                        if (!hasPermission(item.permission)) return null;

                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-blue-300 group"
                            >
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
                                    <h3 className="font-semibold text-base leading-tight">
                                        {item.name}
                                    </h3>
                                </div>

                                {item.sub_menu?.length > 0 && (
                                    <div className="p-4 space-y-2">
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-3">
                                            Available Formats
                                        </p>
                                        {item.sub_menu.map((sub, subIndex) => {
                                            if (!hasPermission(sub.permission)) return null;
                                            const url = `https://portal.infoeight.com/${sub.url}`

                                            return (
                                                <a
                                                    key={subIndex}
                                                    href={url || "#"}
                                                    target="_blank"
                                                    className={`flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg hover:bg-blue-50 border border-slate-200 hover:border-blue-400 transition-all group/item ${sub.class || ""}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-white rounded-lg border border-slate-200 group-hover/item:border-blue-400 group-hover/item:bg-blue-50 transition-all">
                                                            <span className="text-slate-600 group-hover/item:text-blue-600">
                                                                {getFileIcon(sub.name)}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm font-medium text-slate-700 group-hover/item:text-blue-700">
                                                            {sub.name.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <Download size={16} className="text-slate-400 group-hover/item:text-blue-500 transition-colors" />
                                                </a>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
// ==================================================================