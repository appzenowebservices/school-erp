import React, { useState } from 'react';
import { X, CheckCircle, Ban, Settings, Sparkles } from 'lucide-react';
import { updateFeePermission } from '../../api/fees';

const permissionLabels = {
  is_online_payment_allowed: "Online Payment",
  is_partial_payment_allowed: "Partial Payment",
  is_disabled: "Disabled",
  is_adjustment_amount_applicable: "Adjustment Applicable",
  show_break_up_on_receipt: "Show Break-up on Receipt"
};

const FeePermissionManager = ({ open, onClose, feeTypes, context }) => {

  const [selectedFeeTypes, setSelectedFeeTypes] = useState([]);
  const [permissions, setPermissions] = useState({
    is_online_payment_allowed: "0",
    is_partial_payment_allowed: "0",
    is_disabled: "0",
    is_adjustment_amount_applicable: "0",
    show_break_up_on_receipt: "0",
  });

  const togglePermission = (key) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: prev[key] === "1" ? "0" : "1",
    }));
  }

  const handleFeeTypeSelection = (e) => {
    const values = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setSelectedFeeTypes(values);
  };

  const handleSave = async () => {
    const payload = {
      fee_ids: selectedFeeTypes,
      ...permissions,
    };

    const resp = await updateFeePermission(
      context?.profileId,
      context?.session,
      payload
    );

    // console.log("resps -------------->", resp?.data);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Enhanced Backdrop with Animation */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40 animate-in fade-in duration-300"
      ></div>

      {/* Enhanced Drawer with Gradient Border */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[580px]  from-white to-indigo-50/30 z-50 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Decorative gradient accent */}
        <div className="fixed right-0 top-0 h-full w-full sm:w-[580px] bg-white z-50 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">

          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          <div className="p-6">
            {/* Enhanced Header */}
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-indigo-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Fee Permissions
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Manage fee type settings</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-red-50 transition-all duration-200 group"
              >
                <X className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
              </button>
            </div>

            {/* Enhanced Fee Type Selection */}
            <div className="mb-8">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Select Fee Types
              </label>

              {/* Enhanced Container */}
              <div className="border-2 border-indigo-100 rounded-2xl p-3 max-h-72 overflow-y-auto bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                {feeTypes.map((fee) => {
                  const isSelected = selectedFeeTypes.includes(fee.id);

                  return (
                    <div
                      key={fee.id}
                      className={`flex justify-between items-center p-4 mb-2 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-[1.01]
                      ${isSelected
                          ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 shadow-md"
                          : "hover:bg-gray-50 border-2 border-transparent hover:border-gray-200"
                        }`}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedFeeTypes(selectedFeeTypes.filter((id) => id !== fee.id));
                        } else {
                          setSelectedFeeTypes([...selectedFeeTypes, fee.id]);
                        }
                      }}
                    >
                      <div className="flex flex-col flex-1">
                        <span className="font-semibold text-gray-800">{fee.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                            ₹{fee.amount}
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                            {fee.due_date?.text || "N/A"}
                          </span>
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                            {fee.type}
                          </span>
                        </div>
                      </div>

                      {/* Enhanced Checkbox */}
                      <div className="flex-shrink-0 ml-3">
                        {isSelected ? (
                          <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg transform scale-110 transition-transform">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <span className="w-7 h-7 border-2 border-gray-300 rounded-full block hover:border-indigo-400 transition-colors"></span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                Select multiple fee types to apply the same permissions
              </p>

              {/* Enhanced Selected Tags */}
              {selectedFeeTypes.length > 0 && (
                <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                  <p className="text-xs font-semibold text-indigo-700 mb-2">Selected ({selectedFeeTypes.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFeeTypes.map((id) => {
                      const fee = feeTypes.find((f) => f.id === id);
                      return (
                        <span
                          key={id}
                          className="bg-white border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
                        >
                          {fee?.name}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFeeTypes(selectedFeeTypes.filter((fid) => fid !== id));
                            }}
                            className="text-indigo-400 hover:text-red-500 hover:bg-red-50 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Permissions Section */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Settings className="w-4 h-4 text-purple-500" />
                Permission Settings
              </label>
              <div className="space-y-3">
                {Object.keys(permissionLabels).map((key) => (
                  <div
                    key={key}
                    onClick={() => togglePermission(key)}
                    className={`group flex items-center justify-between px-5 py-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 transform hover:scale-[1.01] ${permissions[key] === '1'
                      ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300 shadow-md"
                      : "hover:bg-gray-50 border-gray-200 hover:border-indigo-200"
                      }`}
                  >
                    <span className={`font-semibold transition-colors ${permissions[key] === '1' ? 'text-emerald-700' : 'text-gray-700'
                      }`}>
                      {permissionLabels[key]}
                    </span>
                    <div className="flex items-center gap-2">
                      {permissions[key] === '1' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                            Enabled
                          </span>
                          <CheckCircle className="w-6 h-6 text-emerald-500" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            Disabled
                          </span>
                          <Ban className="w-6 h-6 text-gray-400 group-hover:text-gray-500 transition-colors" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Footer Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-indigo-100">
              <button
                onClick={onClose}
                className="px-6 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 font-medium text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={selectedFeeTypes.length === 0}
                className={`cursor-pointer px-8 py-2.5 rounded-xl text-white font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg ${selectedFeeTypes.length === 0
                  ? "bg-gray-300 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
                  }`}
              >
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeePermissionManager;