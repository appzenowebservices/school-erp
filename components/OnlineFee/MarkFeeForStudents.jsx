import React, { useState } from 'react';
import { X, CheckCircle, Ban, Settings, Sparkles, ReceiptIndianRupee } from 'lucide-react';
import { updateFeePermission } from '../../api/fees';
import { FaUserGraduate } from 'react-icons/fa';


const MarkFeeForStudents = ({
  open,
  onClose,
  feeTypes,
  config,
  selectedFee
}) => {
  // console.log('selectedStandard=======>>', selectedFee, config?.standards);

  const [selectedFeeTypes, setSelectedFeeTypes] = useState([]);
  const [permissions, setPermissions] = useState({
    is_online_payment_allowed: "0",
    is_partial_payment_allowed: "0",
    is_disabled: "0",
    is_adjustment_amount_applicable: "0",
    show_break_up_on_receipt: "0",
  });



  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [selectedBus, setSelectedBus] = useState("");
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [bankName, setBankName] = useState("");
  const [remark, setRemark] = useState("");
  const [setAmount, setSetAmount] = useState("");
  const transportFee = selectedFee?.include_transport_fee ? selectedFee?.transport_fee_multiplier || 0 : 0;

  const paymentModes = [
    { value: "cash", label: "Cash" },
    { value: "online", label: "Online" },
    { value: "cheque", label: "Cheque" },
    { value: "dd", label: "Demand Draft" }
  ];


  const buses = [
    { value: "cash", label: "Cash" },
    { value: "online", label: "Online" },
    { value: "cheque", label: "Cheque" },
    { value: "dd", label: "Demand Draft" }
  ];



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
        className="cursor-pointer fixed inset-0 bg-black/40 z-40 animate-in fade-in duration-300"
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
                  <ReceiptIndianRupee className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Mark fee
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Manage fee type settings</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="cursor-pointer p-2 rounded-xl hover:bg-red-50 transition-all duration-200 group"
              >
                <X className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
              </button>
            </div>

            {/* Enhanced Student Selection */}
            <div className="mb-8">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <FaUserGraduate className="w-4 h-4 text-indigo-500" />
                Select Students
              </label>

              {(() => {
                const stdId = selectedFee?.standard?.id;
                const standard = config?.standards?.find(s => s.id == stdId);

                if (!standard) {
                  return (
                    <p className="text-xs text-red-500">
                      No standard found for ID {stdId}
                    </p>
                  );
                }

                return (
                  <div className="border-2 border-indigo-100 rounded-2xl p-3 max-h-72 overflow-y-auto bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                    {standard.classes?.map(cls => (
                      <div key={cls.id} className="mb-4">
                        {/* Class Name */}
                        <p className="font-semibold text-gray-800 mb-2">
                          {cls.name}
                        </p>

                        {/* Students */}
                        <div className="flex flex-col gap-2 ml-3">
                          {cls.students?.map(stu => {
                            const isSelected = selectedFeeTypes.includes(stu.id);

                            return (
                              <div
                                key={stu.id}
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedFeeTypes(prev =>
                                      prev.filter(id => id !== stu.id)
                                    );
                                  } else {
                                    setSelectedFeeTypes(prev => [...prev, stu.id]);
                                  }
                                }}
                                className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                                  ? "bg-indigo-50 border-indigo-300"
                                  : "bg-white border-gray-200 hover:bg-gray-50 hover:border-indigo-200"
                                  }`}
                              >
                                <span className="text-sm font-medium text-gray-700">
                                  {stu.name}
                                </span>

                                {isSelected ? (
                                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                                ) : (
                                  <span className="w-5 h-5 border-2 border-gray-300 rounded-full"></span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Selected Tags */}
              {selectedFeeTypes.length > 0 && (
                <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                  <p className="text-xs font-semibold text-indigo-700 mb-2">
                    Selected ({selectedFeeTypes.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFeeTypes.map((id) => {
                      // find student from all classes
                      const stdId = selectedFee?.standard?.id;
                      const standard = config?.standards?.find(s => s.id == stdId);
                      const student = standard?.classes?.flatMap(c => c.students)?.find(stu => stu.id === id);

                      return (
                        <span
                          key={id}
                          className="bg-white border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
                        >
                          {student?.name || "Student"}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFeeTypes(prev => prev.filter(fid => fid !== id));
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




            {/* Additional Fields */}
            <div className="mb-10 mt-6 space-y-6">

              {/* Payment Date */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                />
              </div>

              {/* Mode Of Payment */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Mode Of Payment
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                >
                  <option value="">Select Mode</option>
                  {paymentModes.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bus */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Bus
                </label>
                <select
                  value={selectedBus}
                  onChange={(e) => {
                    const busId = e.target.value;
                    setSelectedBus(busId);
                    const busObj = buses.find(b => b.id == busId);
                    setLocations(busObj?.locations || []);
                    setSelectedLocation("");
                  }}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                >
                  <option value="">Select Bus</option>
                  {buses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location (depends on Bus) */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  disabled={!selectedBus}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-white transition 
        ${selectedBus ? "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"}
      `}
                >
                  <option value="">Select Location</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bank Name */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Bank Name
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                >
                  <option value="">Select Bank</option>
                  {config?.banks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Remark */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Remark
                </label>
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  rows={3}
                  placeholder="Add any notes..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                ></textarea>
              </div>
            </div>


            {/* Summary Footer */}
            <div className="mt-10 rounded-2xl p-5 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 shadow">
              <h3 className="text-sm font-bold text-indigo-700 mb-4">
                Fee Summary
              </h3>

              <div className="grid grid-cols-2 gap-4">

                <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm">
                  <p className="text-xs text-gray-500">Fee Details</p>
                  <p className="text-lg font-semibold text-gray-800">
                    ₹{selectedFee?.amount || 0}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm">
                  <p className="text-xs text-gray-500">Transport Fee</p>
                  <p className="text-lg font-semibold text-gray-800">
                    ₹{transportFee || 0}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm">
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="text-lg font-semibold text-indigo-700">
                    ₹{(Number(selectedFee?.amount || 0) + Number(transportFee || 0)).toFixed(2)}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm">
                  <p className="text-xs text-gray-500">Set Amount</p>
                  <input
                    type="number"
                    value={setAmount}
                    onChange={(e) => setSetAmount(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

              </div>
            </div>




            {/* Enhanced Footer Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-indigo-100">
              <button
                onClick={onClose}
                className="cursor-pointer px-6 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 font-medium text-gray-700"
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
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarkFeeForStudents;