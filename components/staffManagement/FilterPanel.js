import React, { useState } from "react";
import { commonIcons, staffStatusIcons } from "./icons";
// ===============================================================================
const { FaCheck } = commonIcons;
// ===============================================================================
const StaffFilterPanel = ({
  setFilters,
  config,
  isFilterPanelOpen,
  staffStatus,
  filters,
  toggleFilter,


}) => {
  // ===============================================================================

  if (!isFilterPanelOpen) {
    return null;
  }


  let titles = config?.titles;

  // ===============================================================================
  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      isSearch: true
    }));
  };

  // ===============================================================================
  return (
    <div className="bg-white rounded shadow border border-gray-200 p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-6">

      {/* ===========  Account Status  ========================================================================================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Account Status</h3>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {staffStatus?.map((item, index) => {
            const isSelected = filters.accountStatus.includes(item.value);

            return (
              <button
                key={index}
                type="button"
                onClick={() =>
                  setFilters(prev => ({
                    ...prev,
                    accountStatus: isSelected
                      ? prev.accountStatus.filter(v => v !== item.value)
                      : [...prev.accountStatus, item.value],
                  }))
                }
                className="flex items-center w-full text-left"
              >
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center
              ${isSelected
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300"}`}
                >
                  {isSelected && <FaCheck size={12} className="text-white" />}
                </div>

                <span className="ml-3 text-gray-700 flex items-center">
                  {staffStatusIcons[item.label] && (
                    <span className="mr-2">
                      {staffStatusIcons[item.label]}
                    </span>
                  )}
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===========  Active or not  ========================================================================================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-2">Status</h3>

        <div className="relative">
          <select
            value={filters?.status || ""}
            onChange={(e) =>
              toggleFilter("status", e.target.value)
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select status</option>

            {[{
              name: "Active",
              value: "ACTIVE"
            },
            {
              name: "Disabled",
              value: "DISABLED"
            },
            ]?.map((status, index) => (
              <option key={index} value={status?.value}>
                {status?.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ===========  Title  ========================================================================================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Title</h3>
        <select
          value={filters?.title || ""}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "") {
              setFilters((prev) => ({ ...prev, title: "" }));
            } else {
              setFilters((prev) => ({ ...prev, title: value }));
            }
          }}
          className="w-full border border-gray-300 rounded-md p-2 text-gray-700
               focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
          <option value="">All Titles</option>
          {titles?.map((mode) => (
            <option key={mode?.id} value={mode?.id}>
              {mode?.name}
            </option>
          ))}
        </select>
      </div>

      {/* =========== Joining Date  ========================================================================================= */}
      <div className="md:col-span-2">
        <h3 className="font-medium text-gray-700 mb-3">Joining Date</h3>
        <div className="flex gap-4">
          <input
            type="date"
            value={filters.joinedDate || ""}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, joinedDate: e.target.value }))
            }
            className="border border-gray-300 rounded-md p-2 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>
      </div>







      {/* =========== Designations ========================================================================================= */}
      <div className="md:col-span-2">
        <h3 className="font-medium text-gray-700 mb-3">Designations</h3>
        <div className="flex flex-wrap gap-3">
          {/* "All" Option */}
          <label
            className={`px-3 py-1.5 rounded-full border cursor-pointer transition 
        ${filters.designations?.length === 0 ? "bg-blue-500 text-white border-blue-500" : "border-gray-300 text-gray-700"}`}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                designations: [], // clear all selections
              }))
            }
          >
            All
          </label>

          {/* Individual Designations */}
          {config?.designations?.map((desig) => {
            const isSelected = filters.designations?.includes(desig.id);
            return (
              <label
                key={desig.id}
                className={`px-3 py-1.5 rounded-full border cursor-pointer transition 
            ${isSelected ? "bg-blue-500 text-white border-blue-500" : "border-gray-300 text-gray-700"}`}
                onClick={() =>
                  setFilters((prev) => {
                    const current = prev.designations || [];
                    const updated = isSelected
                      ? current.filter((d) => d !== desig.id) // remove
                      : [...current, desig.id]; // add
                    return { ...prev, designations: updated };
                  })
                }
              >
                {desig.name}
              </label>
            );
          })}
        </div>
      </div>





      {/* =========== Gender ========================================================================================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Gender</h3>
        <div className="flex flex-wrap gap-3">
          {["MALE", "FEMALE",].map((g) => (
            <label
              key={g}
              className={`flex items-center px-3 py-1.5 rounded-full border cursor-pointer transition 
          ${filters.gender === g ? "bg-blue-500 text-white border-blue-500" : "border-gray-300 text-gray-700"}`}
            >
              <input
                type="radio"
                name="gender"
                value={g}
                checked={filters.gender === g}
                onChange={() => setFilters((prev) => ({ ...prev, gender: g }))}
                className="hidden"
              />
              <span>{g}</span>
            </label>
          ))}
        </div>
      </div>

      {/* =========== App Used ========================================================================================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">App Used</h3>
        <div className="flex flex-wrap gap-3">
          {["Android", "IOS",].map((type) => (
            <label
              key={type}
              className={`flex items-center px-3 py-1.5 rounded-full border cursor-pointer transition 
          ${filters.appType === type ? "bg-blue-500 text-white border-blue-500" : "border-gray-300 text-gray-700"}`}
            >
              <input
                type="radio"
                name="appType"
                value={type}
                checked={filters.appType === type}
                onChange={() => setFilters((prev) => ({ ...prev, appType: type }))}
                className="hidden"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* =========== Search Section ========================================================================================= */}
      <div className="md:col-span-4 border-t pt-5">
        <h3 className="font-medium text-gray-700 mb-4">Search by Family & Contact Info</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Mother Name"
            value={filters.motherName}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, motherName: e.target.value }))

            }
            className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          <input
            type="text"
            placeholder="Father Name"
            value={filters.fatherName}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, fatherName: e.target.value }))

            }
            className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder="Mobile"
            value={filters.mobile || ""}
            maxLength={10}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, ""); // remove non-numeric chars
              if (val.length <= 10) {
                setFilters((prev) => ({ ...prev, mobile: val }));
              }
            }}
            className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
          />

          <input
            type="text"
            inputMode="numeric"

            placeholder="Emergency Contact No."
            value={filters.emergencyContact || ""}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, ""); // remove non-numeric chars
              if (val.length <= 10) {
                setFilters((prev) => ({ ...prev, emergencyContact: val }));
              }
            }}

            className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="mt-4 text-right">
          <button
            onClick={() => setFilters(prev => ({ ...prev, isSearch: !prev.isSearch }))}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};
// ===============================================================================
export default StaffFilterPanel;
