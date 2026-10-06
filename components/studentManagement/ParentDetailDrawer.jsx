import React, { useState, useEffect } from 'react';
import {  FaUser, FaPhone, FaIdCard, FaBriefcase, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { getParentsDetails } from '../../api/parents';
import { FaXmark } from 'react-icons/fa6';

const ParentDetailDrawer = ({
    studentId,
    profile,
    session,
    parentDetailDrawer,
    context,
    onClose
}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [parentDetails, setParentDetails] = useState(null);

    const fetchParentDetail = async () => {
        if (!parentDetailDrawer?.id) return;

        setIsLoading(true);
        try {
            const resp = await getParentsDetails(
                context?.profileId,
                context?.session,
                parentDetailDrawer?.id
            );
            setParentDetails(resp?.data?.results || null);
        } catch (err) {
            console.error('Failed to fetch parent details:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchParentDetail();
    }, [parentDetailDrawer]);

    if (!parentDetailDrawer) return null;

    return (
        <>
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-gradient-to-br from-white to-gray-50 shadow-2xl z-50 flex flex-col animate-slide-in">

                {/* ================= HEADER ================= */}
                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Parent Details</h2>
                            <p className="text-blue-100 text-sm mt-1">Complete parent information</p>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 hover:rotate-90"
                        >
                            <FaXmark size={18} />
                        </button>
                    </div>
                    {/* Decorative wave */}
                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-br from-white to-gray-50">
                        <svg className="w-full h-4" preserveAspectRatio="none" viewBox="0 0 1200 20">
                            <path d="M0,10 Q300,0 600,10 T1200,10 L1200,20 L0,20 Z" fill="currentColor" className="text-white"/>
                        </svg>
                    </div>
                </div>

                {/* ================= BODY ================= */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">

                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                            <p className="text-gray-500 text-sm font-medium">Loading parent details...</p>
                        </div>
                    )}

                    {!isLoading && parentDetails && (
                        <div className="p-6 space-y-6">
                            {/* PROFILE CARD */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center gap-5">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                                            {parentDetails?.image_url ? (
                                                <img
                                                    src={parentDetails.image_url}
                                                    alt="Parent"
                                                    className="w-full h-full rounded-2xl object-cover"
                                                />
                                            ) : (
                                                parentDetails?.name?.[0] || "P"
                                            )}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white" />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                                            {parentDetails.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                                                {parentDetails.gender}
                                            </span>
                                            <span>•</span>
                                            <span>{parentDetails.info?.text}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* BASIC INFO */}
                            <Section icon={<FaUser />} title="Basic Information" color="blue">
                                <InfoRow label="Nationality" value={parentDetails.nationality} />
                                <InfoRow label="Date of Birth" value={parentDetails.date_of_birth || "—"} />
                                <InfoRow label="Blood Group" value={parentDetails.blood_group || "—"} />
                                <InfoRow 
                                    label="Single Parent" 
                                    value={parentDetails.is_single_parent === "1" ? "Yes" : "No"}
                                    badge={parentDetails.is_single_parent === "1"}
                                />
                            </Section>

                            {/* CONTACT */}
                            <Section icon={<FaPhone />} title="Contact & Identity" color="green">
                                <InfoRow label="Phone" value={parentDetails.phone || "—"} />
                                <InfoRow label="Aadhaar" value={parentDetails.aadhaar_number || "—"} />
                                <InfoRow label="PAN" value={parentDetails.pancard_number || "—"} />
                            </Section>

                            {/* PROFESSION */}
                            <Section icon={<FaBriefcase />} title="Professional Details" color="purple">
                                <InfoRow label="Profession" value={parentDetails.profession} />
                                <InfoRow label="Designation" value={parentDetails.designation} />
                                <InfoRow label="Organization" value={parentDetails.organization} />
                                <InfoRow label="Annual Income" value={parentDetails.annual_income} />
                                <InfoRow label="Qualification" value={parentDetails.qualification} />
                            </Section>

                            {/* ADDRESS */}
                            <Section icon={<FaMapMarkerAlt />} title="Address" color="orange">
                                <InfoRow label="Address" value={parentDetails.address || "—"} fullWidth />
                                <InfoRow label="Locality" value={parentDetails.locality || "—"} />
                                <InfoRow label="Landmark" value={parentDetails.landmark || "—"} />
                                <InfoRow label="City" value={parentDetails.city || "—"} />
                                <InfoRow label="State" value={parentDetails.state?.name || "—"} />
                                <InfoRow label="Pincode" value={parentDetails.pincode || "—"} />
                            </Section>

                            {/* STUDENTS */}
                            {parentDetails.students?.length > 0 && (
                                <Section icon={<FaUsers />} title={`Students (${parentDetails.students.length})`} color="indigo">
                                    <div className="space-y-3">
                                        {parentDetails.students.map((student) => (
                                            <div
                                                key={student.id}
                                                className="group flex items-center gap-4 p-4 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl hover:shadow-md hover:border-indigo-300 transition-all duration-200"
                                            >
                                                {/* Student Image */}
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform duration-200">
                                                    {student.image_url ? (
                                                        <img
                                                            src={student.image_url}
                                                            alt={student.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        student.name?.[0] || "S"
                                                    )}
                                                </div>

                                                {/* Student Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold text-gray-900 truncate">
                                                        {student.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                                        <span className="px-2 py-0.5 bg-gray-100 rounded">
                                                            Class {student.class}
                                                        </span>
                                                        <span>•</span>
                                                        <span>Roll: {student.roll_number || "—"}</span>
                                                    </div>
                                                </div>

                                                {/* Relation Badge */}
                                                <div className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200">
                                                    {student.relation_with_parent}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Section>
                            )}

                            {/* COMMENT */}
                            {parentDetails.comment && (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white">
                                            💬
                                        </div>
                                        <span className="font-semibold text-amber-900">Comment</span>
                                    </div>
                                    <p className="text-sm text-amber-800 leading-relaxed">
                                        {parentDetails.comment}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </>
    );
};

/* ================= HELPERS ================= */

const Section = ({ icon, title, children, color = "blue" }) => {
    const colorMap = {
        blue: "from-blue-500 to-blue-600",
        green: "from-green-500 to-green-600",
        purple: "from-purple-500 to-purple-600",
        orange: "from-orange-500 to-orange-600",
        indigo: "from-indigo-500 to-indigo-600"
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className={`bg-gradient-to-r ${colorMap[color]} px-5 py-3 flex items-center gap-3 text-white`}>
                <div className="text-lg">{icon}</div>
                <h3 className="font-bold text-base">{title}</h3>
            </div>
            <div className="p-5 space-y-3">
                {children}
            </div>
        </div>
    );
};

const InfoRow = ({ label, value, badge = false, fullWidth = false }) => (
    <div className={`flex ${fullWidth ? 'flex-col gap-1' : 'justify-between gap-4'} text-sm py-2 border-b border-gray-100 last:border-0`}>
        <span className="text-gray-600 font-medium">{label}</span>
        {badge ? (
            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold w-fit">
                {value}
            </span>
        ) : (
            <span className={`text-gray-900 font-medium ${fullWidth ? '' : 'text-right'}`}>
                {value}
            </span>
        )}
    </div>
);

export default ParentDetailDrawer;