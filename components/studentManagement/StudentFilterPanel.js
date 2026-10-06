import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
// import { commonIcons, staffStatusIcons } from "./icons";
// ===============================================================================
// const { FaCheck } = commonIcons;
// ===============================================================================
const StudentFilterPanel = ({
  setFilters,
  config,
  isFilterPanelOpen,
  filters,


}) => {

  // console.log('config=======', config);

  // ===============================================================================

  if (!isFilterPanelOpen) {
    return null;
  }



  // ===============================================================================
  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      isSearch: prev => !prev
    }));

    console.log('filters____________', filters);

  };

  // ===============================================================================
  return (
    <div className="bg-white rounded shadow border border-gray-200 p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-6">


      {/* ======================= CLASS ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Class</h3>

        <select
          value={filters.classId || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, classId: e.target.value }))
          }
          className="w-full border border-gray-300 rounded-md p-2 text-gray-700
      focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
          <option value="">All Classes</option>

          {config?.standards
            ?.flatMap((std) => std.classes || [])
            .map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
        </select>
      </div>


      {/* ======================= STUDENT NAME ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Name</h3>
        <input
          type="text"
          placeholder="Student Name"
          value={filters.name || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, name: e.target.value }))
          }
          className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* ======================= ADMISSION NUMBER ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Admission Number</h3>
        <input
          type="text"
          value={filters.admission_number || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, admission_number: e.target.value }))
          }
          className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* ======================= PHONE NO ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Phone No.</h3>
        <input
          type="text"
          inputMode="numeric"
          maxLength={10}
          value={filters.phone || ""}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            setFilters((prev) => ({ ...prev, phone: val }));
          }}
          className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* ======================= FATHER NAME ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Father's Name</h3>
        <input
          type="text"
          value={filters.father_name || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, father_name: e.target.value }))
          }
          className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* ======================= MOTHER NAME ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Mother's Name</h3>
        <input
          type="text"
          value={filters.mother_name || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, mother_name: e.target.value }))
          }
          className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* ======================= DATE OF BIRTH ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Date of Birth</h3>
        <input
          type="date"
          value={filters.date_of_birth || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, date_of_birth: e.target.value }))
          }
          className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* ======================= APP USED ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">App Used</h3>
        <select
          value={filters.appUsed || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, appUsed: e.target.value }))
          }
          className="w-full border border-gray-300 rounded-md p-2 text-gray-700
      focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
          <option value="">All</option>
          <option value="Android">Android</option>
          <option value="iOS">IOS</option>
        </select>
      </div>

      {/* ======================= REGISTRATION NUMBER ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Registration Number</h3>
        <input
          type="text"
          value={filters.registration_number || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, registration_number: e.target.value }))
          }
          className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* ======================= REGISTERED PHONE FOR SMS ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Registered Phone (SMS)</h3>
        <input
          type="text"
          inputMode="numeric"
          maxLength={10}
          value={filters.registered_phone_for_sms || ""}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            setFilters((prev) => ({ ...prev, registered_phone_for_sms: val }));
          }}
          className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* ======================= OPTIONAL SUBJECT ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Optional Subject</h3>

        <input
          type="text"
          value={filters.optional_subject || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, optional_subject: e.target.value }))
          }
          className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200"
        />

      </div>

      {/* ======================= GENDER ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Gender</h3>
        <select
          value={filters.gender || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, gender: e.target.value }))
          }
          className="w-full border border-gray-300 rounded-md p-2 text-gray-700
      focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
          <option value="">All</option>
          <option value="MALE">MALE</option>
          <option value="FEMALE">FEMALE</option>
        </select>
      </div>

      {/* ======================= FEE CATEGORY ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Fee Category</h3>
        <select
          value={filters.feeCategory || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, feeCategory: e.target.value }))
          }
          className="w-full border border-gray-300 rounded-md p-2 text-gray-700
      focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
          <option value="">All</option>
          {config?.feeCategories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* ======================= STATUS ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Status</h3>
        <select
          value={filters.status || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
          className="w-full border border-gray-300 rounded-md p-2 text-gray-700
      focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
          <option value="">All</option>
          {["ACTIVE", "INACTIVE"].map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* ======================= EMAIL ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Email</h3>
        <input
          type="text"
          value={filters.email || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, email: e.target.value }))
          }
          className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* ======================= RENEWAL STATUS ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Renewal Status</h3>
        <select
          value={filters.renewal_status || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, renewal_status: e.target.value }))
          }
          className="w-full border border-gray-300 rounded-md p-2 text-gray-700
      focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
          <option value="">All</option>
          {config?.renewal_status_list.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* ======================= RADIO GROUPS ======================= */}
      <div className="col-span-4 border-t pt-4 flex flex-wrap gap-6">

        {/* ======================= FILTER TOGGLES ======================= */}
        <div className="col-span-4 border-t pt-4 flex flex-wrap gap-4">

          {[
            {
              key: "non_app_user",
              label: "Not Using App"
            },
            {
              key: "is_registered",
              label: "Registered Students"
            },
            {
              key: "with_out_any_phone_number",
              label: "Without any phone number"
            }
          ].map(({ key, label }) => (
            <label
              key={key}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer text-sm transition
        ${filters[key]
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={!!filters[key]}
                onChange={() =>
                  setFilters(prev => ({
                    ...prev,
                    [key]: !prev[key]
                  }))
                }
              />
              <span>{label}</span>
            </label>
          ))}

        </div>


        {/* ======================= SEARCH BUTTON ======================= */}
        <div className="col-span-4 flex justify-end mt-4">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

      </div>

    </div>
  );
};
// ===============================================================================
export default StudentFilterPanel;
