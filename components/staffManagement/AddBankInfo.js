import React, { useState, useEffect } from "react";
import { getBankList } from "../../api/bank"; // adjust path
import { Landmark, User, Hash, Building2, KeyRound } from "lucide-react";

const AddBankInfo = ({ setFormData, formData, Context }) => {
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);



  const [banks, setBanks] = useState([]);
  const [bankSearch, setBankSearch] = useState("");
  const [showBankDropdown, setShowBankDropdown] = useState(false);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await getBankList(
          Context?.profileId,
          Context?.session,
        );
        setBanks(res?.data?.results?.banks || []);
      } catch (err) {
        console.error("Failed to load banks", err);
      }
    };

    fetchBanks();
  }, []);


  const validate = () => {
    let newErrors = {};
    if (!formData.bank) newErrors.bank = "Bank name is required";
    if (!formData.accountHolderName)
      newErrors.accountHolderName = "Account holder name is required";
    if (!formData.accountNumber)
      newErrors.accountNumber = "Account number is required";
    if (!formData.ifscCode) newErrors.ifscCode = "IFSC code is required";
    if (!formData.branchName) newErrors.branchName = "Branch name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
      console.log("Bank info submitted:", formData);
    }
  };
const selectedBank = banks.find(b => b.id === formData.bank);

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto p-4"
      >

    {/* Bank Name */}
<div className="relative">
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Bank
  </label>

  {/* Display field */}
  <div
    onClick={() => setShowBankDropdown(true)}
    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white cursor-pointer
      flex items-center shadow-sm"
  >
    <Landmark className="h-5 w-5 text-gray-400 absolute left-3" />
    <span className={selectedBank ? "text-gray-800" : "text-gray-400"}>
      {selectedBank?.name || "Select bank"}
    </span>
  </div>

  {/* Dropdown */}
  {showBankDropdown && (
    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
      
      {/* Search bar */}
      <div className="p-2 border-b">
        <input
          type="text"
          autoFocus
          value={bankSearch}
          onChange={(e) => setBankSearch(e.target.value)}
          placeholder="Search bank..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Results */}
      <ul className="max-h-56 overflow-y-auto">
        {banks
          .filter(b =>
            b.name.toLowerCase().includes(bankSearch.toLowerCase())
          )
          .map(bank => (
            <li
              key={bank.id}
              onClick={() => {
                handleChange("bank", bank.id); // store ID
                setBankSearch("");
                setShowBankDropdown(false);
              }}
              className="px-4 py-2 cursor-pointer hover:bg-indigo-50 text-sm"
            >
              {bank.name}
            </li>
          ))}

        {banks.length === 0 && (
          <li className="px-4 py-2 text-gray-400 text-sm">
            No banks found
          </li>
        )}
      </ul>
    </div>
  )}

  {errors.bank && (
    <p className="mt-1 text-sm text-red-600">{errors.bank}</p>
  )}
</div>

        {/* Account Holder Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Account Holder Name
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="accountHolderName"
              value={formData.accountHolderName || ""}
              onChange={(e) => handleChange("accountHolderName", e.target.value)}
              placeholder="Enter account holder name"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
            />
          </div>
          {errors.accountHolderName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.accountHolderName}
            </p>
          )}
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Account Number
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Hash className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber || ""}
              onChange={(e) => handleChange("accountNumber", e.target.value)}
              placeholder="Enter account number"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
            />
          </div>
          {errors.accountNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>
          )}
        </div>

        {/* IFSC Code */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            IFSC Code
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyRound className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="ifscCode"
              value={formData.ifscCode || ""}
              onChange={(e) => handleChange("ifscCode", e.target.value.toUpperCase())}
              placeholder="Enter IFSC code"
              maxLength={11}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
            />
          </div>
          {errors.ifscCode && (
            <p className="mt-1 text-sm text-red-600">{errors.ifscCode}</p>
          )}
        </div>

        {/* Branch Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Branch Name
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="branchName"
              value={formData.branchName || ""}
              onChange={(e) => handleChange("branchName", e.target.value)}
              placeholder="Enter branch name"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
            />
          </div>
          {errors.branchName && (
            <p className="mt-1 text-sm text-red-600">{errors.branchName}</p>
          )}
        </div>

        {/* Submit */}

      </form>
    </div>
  );
};

export default AddBankInfo;
