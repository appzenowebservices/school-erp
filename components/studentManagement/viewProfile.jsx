'use client';

import { getStudentDetail } from '../../api/student';
import {
  User, Mail, Phone, MapPin, Calendar, Book, Users, Heart, BadgePlus,
  Award, Shield, Bus, Globe, List, Save, X, Plus, Trash2,
  GraduationCap,
  School,
  ScrollText,
  FileMinus,
  FileInput,
  Church,
  Languages,
  Flag,
  HeartPulse,
  MapPinHouse,
  Transgender
} from 'lucide-react'; import { useState, useRef, useEffect } from "react";

const InfoCard = ({ icon: Icon, title, value, className = "" }) => (
  <div className={`bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${className}`}>
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const ParentCard = ({ parent }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-3">
      <h4 className="font-semibold text-gray-900">{parent.name}</h4>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${parent.gender === 'MALE' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
        }`}>
        {parent.relation}
      </span>
    </div>
    <div className="space-y-2">
      <div className="flex items-center text-sm text-gray-600">
        <Phone className="h-4 w-4 mr-2" />
        {parent.phone}
      </div>
    </div>
  </div>
);


export const StudentProfile = ({
  studentData,
  setSelectedStudent,
  studentId,
  profile,
  session,
  cookyGuid,
  cookyId,
}) => {



  const [studentDetail, setStudentDetail] = useState({})
  const fetchStudentDetail = async () => {
    try {
      const res = await getStudentDetail(
        profile,
        session,
        cookyGuid,
        cookyId,
        studentId
      );
      setStudentDetail(res.results);
    } catch (err) {
      console.error("Failed to fetch student detail", err);
    }
  };
  useEffect(() => {

    fetchStudentDetail();
  }, [profile, session, cookyGuid, cookyId, studentId]);


  console.log('=======d', studentDetail);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Award className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{studentDetail?.name}</h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center">
                <Book className="h-4 w-4 mr-1" />
                <span>Class {studentDetail?.class?.name}</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                <span>Roll No. {studentDetail?.roll_number}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{studentDetail?.dateOfBirth}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoCard icon={Calendar} title="Date of Birth" value={studentDetail.date_of_birth ? studentDetail.date_of_birth : "n/a"} />
        <InfoCard icon={Heart} title="Blood Group" value={studentDetail.blood_group ? studentDetail.blood_group : "n/a"} />
        <InfoCard icon={Globe} title="Religion" value={studentDetail.religion ? studentDetail.religion : "n/a"} />
        <InfoCard icon={Globe} title="Mother Tongue" value={studentDetail.mother_tongue ? studentDetail.mother_tongue : "n/a"} />
        <InfoCard icon={Globe} title="Nationality" value={studentDetail.nationality ? studentDetail.nationality : "n/a"} />
        <InfoCard icon={Bus} title="School Bus" value={studentDetail.school_bus ? studentDetail.school_bus : "n/a"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* {studentDetail?.parents?.map((parent, index) => (
          <ParentCard key={index} parent={parent} />
        ))} */}
      </div>
    </div>


  );
};