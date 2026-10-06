'use client';
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Book, Users, Heart, Award, Shield, Bus, Globe } from 'lucide-react';
import Layout from '../../../layouts/Layout';
import { FaEdit } from 'react-icons/fa';
import { getSessionCache } from '../../../utils/sessionCache';

const Profile = () => {
  const config = getSessionCache("dashboardConfig");
  const [userProfile, setUserProfile] = useState(config?.profile || null);
  console.log(userProfile);

  const [activeTab, setActiveTab] = useState('personal');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [newStoreName, setNewStoreName] = useState(userProfile?.name ?? "N/A");
  const storeName = userProfile?.name ?? "N/A";


  const handleCancelEdit = () => {
    setNewStoreName(storeName); // Revert to original name
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
    if (!newStoreName.trim()) {
      setError("Store name cannot be empty.");
      return;
    }
    if (newStoreName === storeName) { // No change, just exit edit mode
      setIsEditingName(false);
      setError(null);
      return;
    }

    setIsSaving(true);
    setError(null); // Clear previous errors

    try {
      // Replace with your actual API endpoint and store ID
      const response = await updateVendorStoreDetails({ name: newStoreName.trim() })
      // body: JSON.stringify({ name: newStoreName.trim() }),

      if (!response?.data?.status == 200) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update store name.');
      }

      const updatedData = await response?.data?.data;
      // Update the local state with the new data
      setStoreData(prev => ({ ...prev, name: updatedData.name }));
      // If there's a parent component that needs to know about the update, call its callback
      if (onStoreUpdate) {
        onStoreUpdate(updatedData);
      }
      setIsEditingName(false); // Exit edit mode
    } catch (err) {
      console.error("Error updating store name:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };


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
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
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
                <div className="flex items-center gap-2">
                  {isEditingName ? (
                    <input
                      type="text"
                      value={newStoreName}
                      onChange={(e) => setNewStoreName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight border-b-2 border-red-600 focus:outline-none focus:border-red-700 bg-transparent"
                      autoFocus
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{userProfile?.name ?? "N/A"}</h1>

                  )}
                  {!isEditingName && (
                    <button
                      onClick={() => {
                        setIsEditingName(true);
                        // setNewStoreName(storeName); // Initialize with current name
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
                    <span>User Type : {userProfile?.type ?? "N/A"}</span>
                  </div>
                  {/* <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    <span>Roll No. {userProfile.rollNo}</span>
                  </div> */}
                  {/* <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{userProfile.dateOfBirth}</span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl shadow-lg mb-8">
            <div className="flex space-x-1 p-1">
              {[
                { id: 'personal', label: 'Personal Details', icon: User },
                // { id: 'parents', label: 'Parents', icon: Users },
                // { id: 'academic', label: 'Academic Info', icon: Book }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoCard icon={Calendar} title="Date of Birth" value={userProfile?.dateOfBirth ?? "N/A"} />
              <InfoCard icon={Heart} title="Blood Group" value={userProfile?.bloodGroup ?? "N/A"} />
              <InfoCard icon={Globe} title="Religion" value={userProfile?.religion ?? "N/A"} />
              <InfoCard icon={Globe} title="Mother Tongue" value={userProfile?.motherTongue?? "N/A"} />
              <InfoCard icon={Globe} title="Nationality" value={userProfile?.nationality?? "N/A"} />
              <InfoCard icon={Bus} title="School Bus" value={userProfile?.schoolBus?? "N/A"} />

              <div className="md:col-span-2 lg:col-span-3 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-blue-600" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Email Address</p>
                    <p className="text-gray-900">{userProfile?.email?? "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">SMS Number</p>
                    <p className="text-gray-900">{userProfile?.smsNumber?? "N/A"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-600 mb-1 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Address
                    </p>
                    <p className="text-gray-900">{userProfile?.address?? "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'parents' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userProfile?.parents.map((parent, index) => (
                <ParentCard key={index} parent={parent} />
              ))}
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoCard icon={Book} title="Class" value={userProfile?.class?? "N/A"} />
              <InfoCard icon={Shield} title="Roll Number" value={userProfile?.rollNo?? "N/A"} />
              <InfoCard icon={Award} title="Registration Number" value={userProfile?.registrationNumber?? "N/A"} />
              <InfoCard icon={Shield} title="Aadhar Card" value={userProfile?.aadharCard?? "N/A"} />

              <div className="md:col-span-2 lg:col-span-3 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600">Favourite Sports</p>
                    <p className="text-gray-500">Not specified</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Book className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600">Hobbies</p>
                    <p className="text-gray-500">Not specified</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600">Health Status</p>
                    <p className="text-gray-500">Not specified</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;