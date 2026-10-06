'use client';
import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Book, Users, Heart, Award, Shield, Bus, Globe, Church, Cake } from 'lucide-react';
import { FaEdit } from 'react-icons/fa';

import { getStaffDetails, patchStaffDetail } from '../../api/staff';
import { getSessionCache } from '../../utils/sessionCache';

import BasicDetailsViewTab from './BasicDetailsView';
import PersonalDetailsViewTab from './PersonalDetailsView';
import AcademicDetailsViewTab from './AcademicDetailsView';
import DocumentDetailsViewTab from './DocumentDetailsView';
import BankDetailsViewTab from './BankDetailsView';
import { CiBank } from 'react-icons/ci';




const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

const StaffProfile = ({
  bloodGroupsOptions,
  religionsOptions,
  studentId,
  profile,
  session,
  cookyGuid,
  cookyId,
  school,
  config

}) => {

  const context = getSessionCache("dashboardContext");

  const [staffDetail, setStaffDetail] = useState({})
  const [isUpdated, setIsUpdated] = useState(false);

  const fetchStaffDetail = async () => {
    try {
      const res = await getStaffDetails(
        context?.profileId,
        context?.session,
        cookyGuid,
        cookyId,
        studentId
      );
      setStaffDetail(res.results);
      setName(res.results?.name)
    } catch (err) {
      console.error("Failed to fetch student detail", err);
    }
  };




  useEffect(() => {

    fetchStaffDetail();
  }, [profile,
    session,
    cookyGuid,
    cookyId,
    studentId, isUpdated]);








  const [activeTab, setActiveTab] = useState('basic');


  // ====================================================================
  // ====================================================================




  const [isEditingName, setIsEditingName] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const [name, setName] = useState(staffDetail?.name);


  const handleCancelEdit = () => {
    setName(staffDetail?.name); // Revert to original name
    setIsEditingName(false);
    setError(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveName();
    }
    if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleSaveName = async () => {
    if (!name.trim()) {
      setError("Student name cannot be empty.");
      return;
    }
    // if (name === storeName) { // No change, just exit edit mode
    //   setIsEditingName(false);
    //   setError(null);
    //   return;
    // }

    setIsSaving(true);
    setError(null); // Clear previous errors

    try {
      // console.log(' ==========',staffDetail, profile, session);

      // Replace with your actual API endpoint and store ID
      const response = await patchStaffDetail(
        {
          "user_account_id": profile,
          "client_id": session,
          "guid": cookyGuid,

          "logged_in_user_account_id": cookyId,
          "id": studentId,
          "school_id": school,
          "class_id": staffDetail.class.id,

          name
        }
      )
      console.log('rsp ==========', response);

      if (!response?.data?.status == 200) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update store name.');
      }

      const updatedData = await response.results.message;



      // Update the local state with the new data
      // setName(prev => ({ ...prev, name: updatedData.name }));
      // If there's a parent component that needs to know about the update, call its callback
      if (updatedData) {
        setIsUpdated(true);
      }
      setIsEditingName(false); // Exit edit mode
    } catch (err) {
      console.error("Error updating store name:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };
  // -----------------------------------------------------------------


  const [isEditingDob, setIsEditingDob] = useState(false);
  const [dob, setDob] = useState(staffDetail?.date_of_birth || "");

  useEffect(() => {
    fetchStaffDetail();
  }, [profile, session, cookyGuid, cookyId, studentId, isUpdated]);



  useEffect(() => {
    if (staffDetail?.date_of_birth) {
      setDob(staffDetail.date_of_birth);
    }
  }, [staffDetail]);

  const handleCancelDob = () => {
    setDob(staffDetail?.date_of_birth || "");
    setIsEditingDob(false);
    setError(null);
  };

  const handleSaveDob = async () => {
    if (!dob) {
      setError("Date of Birth cannot be empty.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await patchStudentDetail(
        {
          profile,
          session,
          cookyGuid,
          cookyId,
          studentId,
          date_of_birth: dob
        }
      );

      if (response?.data?.status !== 200) {
        throw new Error("Failed to update Date of Birth.");
      }

      setIsUpdated(true);
      setIsEditingDob(false);
    } catch (err) {
      console.error("Error updating DOB:", err);
      setError(err.message || "Unexpected error.");
    } finally {
      setIsSaving(false);
    }
  };
  // -----------------------------------------------------------------


  const [isEditingBloodGroup, setIsEditingBloodGroup] = useState(false);
  const [bloodGroup, setBloodGroup] = useState(staffDetail?.blood_group);
  const [errorBloodGroup, setErrorBloodGroup] = useState(null);

  useEffect(() => {
    if (staffDetail?.blood_group) {
      setBloodGroup(staffDetail?.blood_group);
    }
  }, [staffDetail]);

  const handleSaveBloodGroup = async () => {
    if (!bloodGroup) {
      setError("Blood Group cannot be empty.");
      return;
    }

    setIsSaving(true);
    setErrorBloodGroup(null);

    try {
      const response = await patchStudentDetail(
        {
          "user_account_id": profile,
          "client_id": session,
          "guid": cookyGuid,

          "logged_in_user_account_id": cookyId,
          "id": studentId,
          "school_id": school,
          "class_id": staffDetail.class.id,


          blood_group: bloodGroup
        }
      );


      console.log('resp ==========', response);


      if (!response?.success) {
        throw new Error("Failed to update Blood Group");
      }

      setIsUpdated(true);
      setIsEditingBloodGroup(false);
    } catch (err) {
      console.error("Error updating Blood Group:", err);
      setErrorBloodGroup(err.message || "Unexpected error.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelBloodGroup = () => {
    setBloodGroup(staffDetail?.blood_group || "");
    setIsEditingBloodGroup(false);
    setErrorBloodGroup(null);
  };

  // -----------------------------------------------------------------


  const [isEditingReligion, setIsEditingReligion] = useState(false);
  const [religion, setReligion] = useState(staffDetail?.religion);
  const [errorReligion, setErrorReligion] = useState(null);

  useEffect(() => {
    if (staffDetail?.religion) {
      setReligion(staffDetail?.religion);
    }
  }, [staffDetail]);

  const handleSaveReligion = async () => {
    if (!religion) {
      setError("Blood Group cannot be empty.");
      return;
    }

    setIsSaving(true);
    setErrorReligion(null);

    try {
      const response = await patchStudentDetail(
        {
          "user_account_id": profile,
          "client_id": session,
          "guid": cookyGuid,

          "logged_in_user_account_id": cookyId,
          "id": studentId,
          "school_id": school,
          "class_id": staffDetail.class.id,


          religion: religion
        }
      );




      if (!response?.success) {
        throw new Error("Failed to update Blood Group");
      }

      setIsUpdated(true);
      setIsEditingReligion(false);
    } catch (err) {
      console.error("Error updating Blood Group:", err);
      setErrorReligion(err.message || "Unexpected error.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelReligion = () => {
    setReligion(staffDetail?.religion || "");
    setIsEditingReligion(false);
    setErrorReligion(null);
  };

  // ====================================================================
  // ====================================================================

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

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="flex items-center gap-3">
                {staffDetail?.image_url ? (
                  <div className="relative">
                    <img
                      src={staffDetail?.image_url}
                      alt={staffDetail?.name}
                      className="h-44 w-44 rounded-xl object-cover border-2 border-white shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                ) : (
                  <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm border-2 border-white">
                    <span className="text-white font-bold text-xs">{getInitials(staffDetail?.name ? staffDetail?.name : "")}</span>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                )}


              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Award className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight border-b-2 border-red-600 focus:outline-none focus:border-red-700 bg-transparent"
                    autoFocus
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {staffDetail?.name ? staffDetail.name : (
                      <div className="mb-6">
                        {/* Avatar + Name */}
                        <div className="flex items-center gap-4">
                          {/* Avatar skeleton */}
                          <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>

                          <div className="flex flex-col gap-2">
                            {/* Name skeleton */}
                            <div className="h-6 w-40 bg-gray-200 rounded-md animate-pulse"></div>
                            {/* Subtext skeleton */}
                            <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse"></div>
                          </div>
                        </div>

                        {/* Info rows */}
                        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="h-5 w-28 bg-gray-200 rounded-md animate-pulse"></div>
                          <div className="h-5 w-24 bg-gray-200 rounded-md animate-pulse"></div>
                          <div className="h-5 w-32 bg-gray-200 rounded-md animate-pulse"></div>
                          <div className="h-5 w-20 bg-gray-200 rounded-md animate-pulse"></div>
                        </div>
                      </div>

                    )}
                  </h1>
                )}
                {!isEditingName && (
                  <button
                    onClick={() => {
                      setIsEditingName(true);
                      // setName(storeName); // Initialize with current name
                    }}
                    aria-label="Edit store name"
                  >
                    <FaEdit className=' cursor-pointer' />
                  </button>
                )}
                {isEditingName && (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={handleSaveName}
                      disabled={isSaving}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <Book className="h-4 w-4 mr-1" />
                  <span>Designation : {staffDetail?.designation?.name}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Joined On . {staffDetail.joining_date}</span>
                </div>
                <div className="flex items-center">
                  <Cake className="h-4 w-4 mr-1" />
                  <span>{staffDetail.date_of_birth}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 mb-8 overflow-hidden">
          <div className="flex p-1 overflow-x-auto no-scrollbar scroll-smooth bg-slate-50/50">
            <div className="flex space-x-1 min-w-max">
              {[
                { id: 'basic', label: 'Basic Details', icon: User },
                { id: 'personal', label: 'Personal Details', icon: User },
                { id: 'academic', label: 'Academic Info', icon: Book },
                { id: 'document', label: 'Document Info', icon: Book },
                { id: 'bank', label: 'Bank Info', icon: CiBank }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
              flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold
              transition-all duration-200 whitespace-nowrap cursor-pointer
              ${isActive
                        ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/60'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                      }
            `}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>

                    {/* Active Indicator Underline (Mobile optimized) */}
                    {isActive && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full sm:hidden" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {activeTab === 'basic' && (


          <BasicDetailsViewTab
            staffDetail={staffDetail}
            session={session}
            profile={profile}
            cookyGuid={cookyGuid}
            cookyId={cookyId}
            school={school}
            titles={config?.titles}
            gender={config?.gender_staffs}
            designation={config?.designations}
            classes={config?.classes}
            // categories={config?.caste_categories}
            // nationalities={config?.nationalities}
            // bloodGroups={config?.blood_groups}
            setIsUpdated={setIsUpdated}
          // houses={config?.houses}
          // motherTongues={config?.mother_tongues}


          />

        )}

        {/* Content based on active tab */}
        {activeTab === 'personal' && (


          <PersonalDetailsViewTab
            staffDetail={staffDetail}
            session={session}
            profile={profile}
            cookyGuid={cookyGuid}
            cookyId={cookyId}
            school={school}
            titles={config?.titles}
            gender={config?.gender_staffs}
            designation={config?.designations}
            classes={config?.classes}
            category={config?.caste_categories}
            // categories={config?.caste_categories}
            // nationalities={config?.nationalities}
            bloodGroups={config?.blood_groups}
            setIsUpdated={setIsUpdated}
          // houses={config?.houses}
          // motherTongues={config?.mother_tongues}


          />

        )}





        {/* Content based on active tab */}
        {activeTab === 'document' && (

          <DocumentDetailsViewTab
            staffDetail={staffDetail}
            session={session}
            profile={profile}
            cookyGuid={cookyGuid}
            cookyId={cookyId}
            school={school}
            titles={config?.titles}
            gender={config?.gender_staffs}
            designation={config?.designations}
            classes={config?.classes}
            category={config?.caste_categories}
            // categories={config?.caste_categories}
            // nationalities={config?.nationalities}
            bloodGroups={config?.blood_groups}
            setIsUpdated={setIsUpdated}
          // houses={config?.houses}
          // motherTongues={config?.mother_tongues}


          />


        )}








        {activeTab === 'academic' && (

          <AcademicDetailsViewTab
            staffDetail={staffDetail}
            session={session}
            profile={profile}
            cookyGuid={cookyGuid}
            cookyId={cookyId}
            school={school}
            titles={config?.titles}
            gender={config?.gender_staffs}
            designation={config?.designations}
            classes={config?.classes}
            category={config?.caste_categories}
            // categories={config?.caste_categories}
            // nationalities={config?.nationalities}
            bloodGroups={config?.blood_groups}
            setIsUpdated={setIsUpdated}
          // houses={config?.houses}
          // motherTongues={config?.mother_tongues}


          />
        )}








        {activeTab === 'bank' && (

          <BankDetailsViewTab
            staffDetail={staffDetail}
            session={session}
            profile={profile}
            cookyGuid={cookyGuid}
            cookyId={cookyId}
            school={school}
            titles={config?.titles}
            gender={config?.gender_staffs}
            designation={config?.designations}
            classes={config?.classes}
            category={config?.caste_categories}
            // categories={config?.caste_categories}
            // nationalities={config?.nationalities}
            bloodGroups={config?.blood_groups}
            setIsUpdated={setIsUpdated}
          // houses={config?.houses}
          // motherTongues={config?.mother_tongues}


          />
        )}





      </div>
    </div>

  );
};

export default StaffProfile;