import React, { useState, useEffect } from 'react';
import {
  Home,
  Edit2,
  Trash2,
  Plus,
  Users,
  Trophy,
  Crown,
  Flame,
  Zap,
  Shield,
} from 'lucide-react';
import HouseCreate from './houseCreateForm';
import HouseEdit from './houseEditForm';
import { getSessionCache } from '../../utils/sessionCache';
import ConfirmationDialogueBox from '../ui/status/Confirmation';
import { deleteHouse } from '../../api/houses';

const HouseManagement = ({ houses, setIsHouseUpdatedOrCreated }) => {
  const context = getSessionCache('dashboardContext');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHouse, setEditingHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [houseData, setHouseData] = useState([]);
  const [houseToDelete, setHouseToDelete] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setHouseData(houses || []);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [houses]);

  const iconOptions = [
    { value: 'flame', icon: Flame },
    { value: 'zap', icon: Zap },
    { value: 'crown', icon: Crown },
    { value: 'shield', icon: Shield },
  ];

  const getIcon = (iconName) => {
    const iconObj = iconOptions.find((opt) => opt.value === iconName);
    return iconObj ? iconObj.icon : Shield;
  };

  const openAddModal = () => {
    setEditingHouse(null);
    setIsModalOpen(true);
  };

  const openEditModal = (house) => {
    setEditingHouse(house);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {

    setHouseToDelete(houseData.find((h) => h.id === id));
  };



  const handleHouseDelete = async () => {
    setSubmitted(true);
    setError(null);
    setSuccess(null);

    try {
      if (!houseToDelete?.id) {
        setError("Invalid department selected");
        setSubmitted(false);
        return;
      }

      const resp = await deleteHouse(
        context?.profileId,
        context?.session,
        houseToDelete?.id
      );

      if (resp?.data?.success) {
        setSuccess(resp?.data?.results?.message || "Designation deleted successfully");

        setTimeout(() => {
          setSuccess(null);

          window.location.reload(); // keeping your pattern
        }, 700);

        setSubmitted(false);
      } else {
        setError(resp?.data?.results?.message || "Failed to delete Designation");
        setSubmitted(false);
      }
    } catch (err) {
      console.error("Designation delete error:", err);
      setError(err.message || "Something went wrong while deleting department");
      setSubmitted(false);
    }
  };

  const sortedHouses = [...houseData].sort((a, b) => b.points - a.points);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-accent rounded-2xl flex items-center justify-center shadow-xl">
                <Home className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-accent bg-clip-text text-transparent">
                  House Management
                </h1>
                <p className="text-gray-600 font-medium mt-1">
                  Manage school houses and track performance
                </p>
              </div>
            </div>
            <button
              onClick={openAddModal}
              className="cursor-pointer flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-accent text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              <span>Add House</span>
            </button>
          </div>

          {/* Leaderboard Banner */}
          {!loading && sortedHouses.length > 0 && (
            <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl p-6 mb-8 shadow-xl">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <Trophy className="w-8 h-8" />
                  <div>
                    <h3 className="text-2xl font-black">Current Leader</h3>
                    <p className="text-white/90 font-medium">
                      House Championship 2025
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black">{sortedHouses[0]?.name}</div>
                  <div className="text-xl font-bold text-white/90">
                    {sortedHouses[0]?.points} Points
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Skeleton Loader */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-md overflow-hidden"
                >
                  <div className="h-32 bg-gray-200"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="flex gap-2 mt-4">
                      <div className="h-8 bg-gray-200 rounded flex-1"></div>
                      <div className="h-8 bg-gray-200 rounded flex-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Houses Grid */}
          {!loading && sortedHouses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {sortedHouses.map((house, index) => {
                const IconComponent = getIcon(house.icon);
                const totalMembers =
                  (house.student_count?.FEMALE || 0) +
                  (house.student_count?.MALE || 0);

                return (
                  <div
                    key={house.id}
                    className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
                  >
                    {/* Rank Badge */}
                    {index === 0 && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                          <Crown className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Header */}
                    <div
                      className="h-32 relative overflow-hidden"
                      style={{ backgroundColor: house.color }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white/25 backdrop-blur-sm rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 overflow-hidden">
                          {house.logo_url ? (
                            <img
                              src={house.logo_url}
                              alt="House Logo"
                              className="w-12 h-12 object-contain rounded-lg"
                            />
                          ) : (
                            <IconComponent className="w-12 h-12 text-white opacity-90" />
                          )}
                        </div>
                      </div>
                      <div className="absolute top-3 left-3">
                        <div className="w-8 h-8 bg-accent/30 backdrop-blur-sm rounded-lg flex items-center justify-center text-white font-extrabold text-sm shadow">
                          #{index + 1}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
                        {house.name}
                      </h3>
                      <p className="text-sm text-gray-500 italic mb-4 line-clamp-1">
                        “{house.motto || house.description || 'Motto not available'}”
                      </p>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-gray-700">
                          <span className="text-sm font-medium">Points</span>
                          <span className="text-lg font-bold">{house.points}</span>
                        </div>
                        <div className="flex items-center justify-between text-gray-700">
                          <span className="text-sm font-medium flex items-center gap-1">
                            <Users className="w-4 h-4" /> Members
                          </span>
                          <span className="text-base font-semibold">
                            {totalMembers}
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-3 mb-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-xs text-gray-500 font-semibold mb-1">
                              CAPTAIN
                            </p>
                            <p className="font-bold text-gray-900 truncate">
                              {house.captain || '—'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-semibold mb-1">
                              VICE CAPTAIN
                            </p>
                            <p className="font-bold text-gray-900 truncate">
                              {house.viceCaptain || '—'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(house)}
                          className="cursor-pointer flex-1 flex items-center justify-center px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(house.id)}
                          className="cursor-pointer flex-1 flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg shadow-sm hover:shadow-md transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>


        {houseToDelete && (
          <ConfirmationDialogueBox
            title="Delete House?"
            description={`Are you sure you want to delete "${houseToDelete.name}"?`}
            onConfirm={handleHouseDelete}
            onCancel={() => setHouseToDelete(null)}
          />
        )}





        {/* Modals */}
        <HouseCreate
          isModalOpen={isModalOpen && !editingHouse}
          setIsModalOpen={setIsModalOpen}
          context={context}
          setIsHouseUpdatedOrCreated={setIsHouseUpdatedOrCreated}
        />
        <HouseEdit
          isModalOpen={isModalOpen && !!editingHouse}
          setIsModalOpen={setIsModalOpen}
          selectedHouse={editingHouse}
          context={context}
          setIsHouseUpdatedOrCreated={setIsHouseUpdatedOrCreated}
        />
      </div>


      {/* Success/Error Notifications */}
      {success && (
        <div className="fixed top-4 right-4 flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl shadow-lg z-50 transition-all duration-300 animate-in fade-in slide-in-from-right-1">
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-lg z-50 transition-all duration-300 animate-in fade-in slide-in-from-right-1">
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

    </>
  );
};

export default HouseManagement;
