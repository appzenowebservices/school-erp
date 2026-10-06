import dynamic from 'next/dynamic';

import React, { useState, useEffect, useRef } from 'react';
import { BiTag } from 'react-icons/bi';
import { FaMapMarkerAlt, FaPhone, FaChalkboardTeacher, FaUser, FaUserGraduate } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';
import { FiFileText, FiLayers } from 'react-icons/fi';
import TooltipInfo from '../../../tooltip/TooltipInfo';


//====================================================================== */ }

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
const StudentsModal = ({ selectedData, onClose, onSelectStudent }) => {
  // console.log('selectedData', selectedData);

  {/* //====================================================================== */ }

  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (selectedData) {
      setIsVisible(true);
    }
  }, [selectedData]);









  {/* //====================================================================== */ }

  return (
    <>
      <div
        // onClick={onClose}
        className={`fixed inset-0  backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
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
                <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">Class : {selectedData?.name}</h2>
                <div className="flex items-center gap-2 text-indigo-100">
                  <FaChalkboardTeacher className="w-4 h-4 text-[#e6e6e6]" />
                  <span className="text-sm  text-[#e6e6e6] font-medium"> Teacher : {selectedData?.class_teacher?.name}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="cursor-pointer bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 ml-4"
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
                      <FaUserGraduate className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-800 uppercase tracking-wide">Total Students</p>
                      <p className="text-2xl font-bold text-gray-900">{(selectedData?.students?.length)}</p>
                    </div>
                  </div>
                </div>

                {/* <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
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
                </div> */}
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
                    Students List
                  </h3>

                  <div className="space-y-6">
                    {selectedData?.students?.map((classItem) => {
                      // console.log('classItem', selectedData?.students);

                      return (
                        <>
                            <div
                              onClick={() => onSelectStudent(classItem)}
                              key={classItem?.id}
                              className="cursor-pointer shadow rounded space-y-3">
                              {/* Class Header */}
                          <TooltipInfo text="View Student Detail">
                              <h4 className="text-md font-semibold text-indigo-600">
                                {/* {classItem.class.name}{" "} */}
                                <span className="text-gray-500 text-sm">
                                  {/* ({classItem.class.total} Students) */}
                                </span>
                              </h4>

                              {/* Students */}
                              <div className="space-y-3">
                                <div
                                  key={classItem.id}
                                  className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100"
                                >
                                  {/* Student Image */}
                                  <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                                    {classItem?.image_url ? (
                                      <img
                                        src={classItem.image_url}
                                        alt={classItem.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span>{classItem.name?.charAt(0) || "?"}</span> // fallback initial
                                    )}
                                  </div>

                                  {/* Student Details */}
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{classItem.name}</p>
                                    <p className="text-sm text-gray-600">
                                      Roll No: {classItem.roll_number}
                                    </p>
                                  </div>
                                </div>

                              </div>
                          </TooltipInfo>
                            </div>

                        </>
                      )
                    })}
                  </div >
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
export default StudentsModal;
//======================================================================