import dynamic from 'next/dynamic';

import React, { useState, useEffect, useRef } from 'react';
import { BiArchive, BiPackage, BiTag } from 'react-icons/bi';
import { CiShoppingCart } from 'react-icons/ci';
import { FaDollarSign, FaEye, FaCalendarAlt, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';
import { FcPackage } from 'react-icons/fc';
import { FiFileText, FiLayers } from 'react-icons/fi';
import { MdDeliveryDining } from 'react-icons/md'; // Import the new icon
import { CiUser } from "react-icons/ci";


{/* //====================================================================== */ }

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-2xl">
        <CiUser className="w-16 h-16 text-gray-400" />
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-full group">
      <div className="w-full h-full rounded-2xl overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={`Product image ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmM2Y0ZjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiLz48L2xpbmVhcjxncmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjIwMC alturasPSIyMDAiIGZpbGw9InVybCgjZykiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmUibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LXNpemU9IjE0Ij5ObyBJbWFnZTwvdGV4dD48L2x2Zz4=";
          }}
        />
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/80'
                  }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
{/* //====================================================================== */ }

// InfoCard Component (remains the same)
const InfoCard = ({ icon: Icon, label, value, className = "" }) => (
  <div className={`bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-all duration-200 ${className}`}>
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-sm font-bold text-gray-900 break-all">{value || 'N/A'}</p>
      </div>
    </div>
  </div>
);
{/* //====================================================================== */ }

// OrderDetailModal Component (with new button)
const OnlineClassesModal = ({ selectedData }) => {

  {/* //====================================================================== */ }

  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (selectedData) {
      setIsVisible(true);
    }
  }, [selectedData]);



  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };
  const handleClose = () => {
    setIsVisible(false);
  };
  if (!selectedData) return null;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-800 border-emerald-200';
      case 'pending':
        return 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 border-amber-200';
      case 'cancelled':
        return 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-200';
      default:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-800 border-gray-200';
    }
  };

  const calculateTotalPrice = (items) => {
    if (!Array.isArray(items) || items.length === 0) return 0;
    return items.reduce((total, item) => {
      // Only add if item and quantity are valid numbers
      if (item && typeof item.quantity === "number" && !isNaN(item.quantity)) {
        return total + item.quantity;
      }
      return total;
    }, 0);
  };


  {/* //====================================================================== */ }

  return (
    <>
      <div
        onClick={handleOverlayClick}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      >
        <div
          ref={modalRef}
          className={` border-6  border-[#15487d] bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden relative transform transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
            }`}
        >
          {/* //====================================================================== */}

          {/* Header */}
          <div className="bg-gradient-to-r from-[#15487d] via-[#15487d] to-[#1982ef] p-6 text-[#e6e6e6] shadow shadow-dm shadow-[#3d2701]
 p-6 text-[#3d2701] relative overflow-hidden">
            <div className="absolute inset-0 "></div>
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">Class For: {selectedData.subject.name}</h2>
                <div className="flex items-center gap-2 text-indigo-100">
                  <FaEye className="w-4 h-4 text-[#e6e6e6]" />
                  <span className="text-sm  text-[#e6e6e6] font-medium">Classes Details</span>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 ml-4"
              >
                <FaX className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(95vh-140px)]">
            <div className="p-6 space-y-6">
              {/* //====================================================================== */}

              {/* Order Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl text-white">
                      <FaDollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-800 uppercase tracking-wide">Total Items</p>
                      <p className="text-2xl font-bold text-gray-900">{(selectedData?.students?.length)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white">
                      <FaCalendarAlt className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-800 uppercase tracking-wide">Meet Date</p>
                      <p className="text-lg font-bold text-gray-900">
                        {new Date(selectedData.timestamp).toLocaleDateString()}
                      </p>
                      <div className="text-xs text-gray-500">
                        {selectedData.time || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* //====================================================================== */}

              {/* Payment Status Badge */}
              {/* <div className="flex justify-center">
                <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl border font-semibold text-sm ${getStatusColor(selectedData.paymentStatus)}`}>
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                  <span className="capitalize">Attendee: {selectedData.students.length}</span>
                </div>
              </div> */}
              {/* //====================================================================== */}

              {/* Classes & studebts Items Section */}
              {/* Classes & Students Section */}
              {selectedData?.students && selectedData?.students?.length > 0 && (
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                    Classes & Students
                  </h3>

                  <div className="space-y-6">
                    {selectedData?.students?.map((classItem) => (
                      <div key={classItem.class.id} className="space-y-3">
                        {/* Class Header */}
                        <h4 className="text-md font-semibold text-indigo-600">
                          {classItem.class.name}{" "}
                          <span className="text-gray-500 text-sm">
                            ({classItem.class.total} Students)
                          </span>
                        </h4>

                        {/* Students */}
                        {classItem.class.students.length > 0 ? (
                          <div className="space-y-3">
                            {classItem.class.students.map((student) => (
                              <div
                                key={student.id}
                                className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100"
                              >
                                {/* Student Image */}
                                <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                                  {student.image_url ? (
                                    <img
                                      src={student.image_url}
                                      alt={student.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span>{student.name?.charAt(0) || "?"}</span> // fallback initial
                                  )}
                                </div>

                                {/* Student Details */}
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800">{student.name}</p>
                                  <p className="text-sm text-gray-600">
                                    Roll No: {student.roll_number}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No students in this class.</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* //====================================================================== */}

              {/* Customer Details */}
              {selectedData.customer && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
                      <BiTag className="w-4 h-4" />
                    </div>
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoCard icon={FiFileText} label="Customer Name" value={selectedData.customer.name} />
                    <InfoCard icon={FaPhone} label="Contact Phone" value={selectedData.customer.address.contactPhone} />
                    <InfoCard
                      icon={FaMapMarkerAlt}
                      label="Delivery Address"
                      value={`${selectedData.customer.address.street}, ${selectedData.customer.address.area}, ${selectedData.customer.address.city}, ${selectedData.customer.address.state}, ${selectedData.customer.address.zipCode}, ${selectedData.customer.address.country}`}
                      className="col-span-1 sm:col-span-2"
                    />
                  </div>
                </div>
              )}
              {/* //====================================================================== */}
              {/* Map Section for Delivery Partners */}
              <div class="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-0 border border-gray-100 **h-[700px]** flex flex-col">

              </div>
              {/* //====================================================================== */}
            </div>
            {/* Footer */}

          </div>
          {/* //====================================================================== */}
        </div>
      </div>
    </>
  );
};
//======================================================================
export default OnlineClassesModal;
//======================================================================