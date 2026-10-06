// import React, { useState, useEffect } from "react";
// import {
//     Calendar,
//     Check,
//     X,
//     DollarSign,
//     Layers,
//     ListChecks,
//     Sparkles,
//     Settings2,
//     Clock,
//     ReceiptIcon,
//     ReceiptIndianRupee,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import TooltipInfo from "../tooltip/TooltipInfo";
// import { getSessionCache } from "../../../utils/sessionCache";
// import { postFee } from "../../../api/fees";

// const CreateFee = () => {
//     const config = getSessionCache("dashboardConfig");
//     const standards = config?.standards || [];
//     const feeFrequency = config?.fee_frequency || [];
//     const feeTypes = config?.fee_types || [];
//     const context = getSessionCache("dashboardContext");
//     // console.log("config --->", context);

//     const [isOpen, setIsOpen] = useState(false);
//     const toggleDrawer = () => setIsOpen(!isOpen);

//     const [loading, setLoading] = useState(false);

//     // -----------------------------------------------------
//     // FORM DATA STATE
//     // -----------------------------------------------------
//     const [formData, setFormData] = useState({
//         name: "",
//         serial_number: "",
//         type: "",
//         start_date: "",
//         end_date: "",
//         due_date: "",
//         number_of_months: "",
//         transport_fee_multiplier: "",
//         include_transport_fee: false,
//         is_miscellaneous: false,
//         is_online_payment_allowed: false,
//         is_partial_payment_allowed: false,
//         is_adjustment_amount_applicable: false,
//         show_break_up_on_receipt: false,
//         is_disabled: false,
//         standard_ids: [],
//         fee_types_amount: [{ fee_type_id: "", amount: "" }],
//     });



//     // -----------------------------------------------------
//     // HANDLERS
//     // -----------------------------------------------------
//     const handleInputChange = (field, value) => {
//         setFormData((prev) => ({ ...prev, [field]: value }));
//     };

//     const handleToggle = (field) => {
//         setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
//     };

//     const handleFeeTypeChange = (index, field, value) => {
//         const updated = [...formData.fee_types_amount];
//         updated[index][field] = value;
//         setFormData((prev) => ({ ...prev, fee_types_amount: updated }));
//     };

//     const addFeeTypeRow = () => {
//         setFormData((prev) => ({
//             ...prev,
//             fee_types_amount: [...prev.fee_types_amount, { fee_type_id: "", amount: "" }],
//         }));
//     };

//     const removeFeeTypeRow = (index) => {
//         const updated = [...formData.fee_types_amount];
//         updated.splice(index, 1);
//         setFormData((prev) => ({ ...prev, fee_types_amount: updated }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         const payload = {

//             ...formData,
//             // convert booleans → "1"/"0" for API
//             include_transport_fee: formData.include_transport_fee ? "1" : "0",
//             is_miscellaneous: formData.is_miscellaneous ? "1" : "0",
//             is_online_payment_allowed: formData.is_online_payment_allowed ? "1" : "0",
//             is_partial_payment_allowed: formData.is_partial_payment_allowed ? "1" : "0",
//             is_adjustment_amount_applicable: formData.is_adjustment_amount_applicable
//                 ? "1"
//                 : "0",
//             show_break_up_on_receipt: formData.show_break_up_on_receipt ? "1" : "0",
//             is_disabled: formData.is_disabled ? "1" : "0",
//         };
//         console.log("🧾 ----- payload --:", context?.profileId);

//         const resp = await postFee(
//             context?.profileId,
//             context?.session,
//             payload)

//         console.log("🧾 Submitting Fee Payload:", resp);
//         if (resp?.data?.success) {
//             setLoading(false);
//             setIsOpen(false);
//             // Reset form   
//             setFormData({
//                 name: "",
//                 serial_number: "",
//             })
//         }

//         // setTimeout(() => setLoading(false), 1000);
//     };

//     // -----------------------------------------------------
//     // RENDER
//     // -----------------------------------------------------
//     return (
//         <>
//             <button
//                 onClick={toggleDrawer}
//                 className="cursor-pointer px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-700 transition"
//             >
//                 + Add Fee
//             </button>

//             {isOpen && (
//                 <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//                     <motion.div
//                         initial={{ scale: 0.9, opacity: 0 }}
//                         animate={{ scale: 1, opacity: 1 }}
//                         className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh]"
//                     >
//                         <div className="flex justify-between items-center mb-4">
//                             <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//                                 <ReceiptIndianRupee className="w-5 h-5 text-accent" />
//                                 Create Fee
//                             </h2>
//                             <button
//                                 onClick={toggleDrawer}
//                                 className="p-2 hover:bg-gray-100 rounded-full"
//                             >
//                                 <X />
//                             </button>
//                         </div>

//                         <form onSubmit={handleSubmit} className="space-y-5">
//                             {/* Name & Serial */}
//                             <div className="grid md:grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Fee Name
//                                     </label>
//                                     <input
//                                         type="text"
//                                         value={formData.name}
//                                         onChange={(e) => handleInputChange("name", e.target.value)}
//                                         className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                                         placeholder="e.g. Half Yearly Fee"
//                                         required
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Serial Number
//                                     </label>
//                                     <input
//                                         type="number"
//                                         value={formData.serial_number}
//                                         onChange={(e) =>
//                                             handleInputChange("serial_number", e.target.value)
//                                         }
//                                         className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                                         placeholder="e.g. 22"
//                                         required
//                                     />
//                                 </div>
//                             </div>

//                             {/* Type & Standard */}
//                             <div className="grid md:grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Fee Type
//                                     </label>
//                                     <select
//                                         value={formData.type}
//                                         onChange={(e) => handleInputChange("type", e.target.value)}
//                                         className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                                     >
//                                         <option value="">Select Type</option>
//                                         {feeFrequency?.map((freq) => (
//                                             <option key={freq?.key} value={freq?.value}>{freq?.key}</option>
//                                         ))}

//                                     </select>
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Applicable Standards
//                                     </label>

//                                     <div className="border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
//                                         <div className="flex flex-wrap gap-2 mb-2">
//                                             {formData.standard_ids.map((id) => {
//                                                 const std = standards.find((s) => s.id === id);
//                                                 return (
//                                                     <span
//                                                         key={id}
//                                                         className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full flex items-center gap-1"
//                                                     >
//                                                         {std?.name || id}
//                                                         <button
//                                                             type="button"
//                                                             onClick={() =>
//                                                                 handleInputChange(
//                                                                     "standard_ids",
//                                                                     formData.standard_ids.filter((sid) => sid !== id)
//                                                                 )
//                                                             }
//                                                             className="hover:text-red-600"
//                                                         >
//                                                             ×
//                                                         </button>
//                                                     </span>
//                                                 );
//                                             })}
//                                         </div>

//                                         <select
//                                             value=""
//                                             onChange={(e) => {
//                                                 const value = e.target.value;
//                                                 if (value && !formData.standard_ids.includes(value)) {
//                                                     handleInputChange("standard_ids", [...formData.standard_ids, value]);
//                                                 }
//                                             }}
//                                             className="w-full outline-none border-none bg-transparent text-sm"
//                                         >
//                                             <option value="">Select Standard</option>
//                                             {standards
//                                                 .filter((std) => !formData.standard_ids.includes(std.id))
//                                                 .map((std) => (
//                                                     <option key={std.id} value={std.id}>
//                                                         {std.name}
//                                                     </option>
//                                                 ))}
//                                         </select>
//                                     </div>
//                                 </div>

//                             </div>

//                             {/* Dates */}
//                             <div className="grid md:grid-cols-3 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Start Date
//                                     </label>
//                                     <input
//                                         type="date"
//                                         value={formData.start_date}
//                                         onChange={(e) => handleInputChange("start_date", e.target.value)}
//                                         className="w-full border rounded-lg px-3 py-2"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         End Date
//                                     </label>
//                                     <input
//                                         type="date"
//                                         value={formData.end_date}
//                                         onChange={(e) => handleInputChange("end_date", e.target.value)}
//                                         className="w-full border rounded-lg px-3 py-2"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Due Date
//                                     </label>
//                                     <input
//                                         type="date"
//                                         value={formData.due_date}
//                                         onChange={(e) => handleInputChange("due_date", e.target.value)}
//                                         className="w-full border rounded-lg px-3 py-2"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Numeric */}
//                             <div className="grid md:grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Number of Months
//                                     </label>
//                                     <input
//                                         type="number"
//                                         value={formData.number_of_months}
//                                         onChange={(e) =>
//                                             handleInputChange("number_of_months", e.target.value)
//                                         }
//                                         className="w-full border rounded-lg px-3 py-2"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Transport Fee Multiplier
//                                     </label>
//                                     <input
//                                         type="number"
//                                         step="0.1"
//                                         value={formData.transport_fee_multiplier}
//                                         onChange={(e) =>
//                                             handleInputChange("transport_fee_multiplier", e.target.value)
//                                         }
//                                         className="w-full border rounded-lg px-3 py-2"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Toggles */}
//                             <div className="grid md:grid-cols-3 gap-3">
//                                 {[
//                                     "include_transport_fee",
//                                     "is_miscellaneous",
//                                     "is_online_payment_allowed",
//                                     "is_partial_payment_allowed",
//                                     "is_adjustment_amount_applicable",
//                                     "show_break_up_on_receipt",
//                                     "is_disabled",
//                                 ].map((field) => (
//                                     <label
//                                         key={field}
//                                         className="flex items-center gap-2 text-sm text-gray-700"
//                                     >
//                                         <input
//                                             type="checkbox"
//                                             checked={formData[field]}
//                                             onChange={() => handleToggle(field)}
//                                         />
//                                         {field
//                                             .replace(/_/g, " ")
//                                             .replace(/\b\w/g, (c) => c.toUpperCase())}
//                                     </label>
//                                 ))}
//                             </div>

//                             {/* Fee Type Amounts */}
//                             <div className="mt-6">
//                                 <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
//                                     <DollarSign className="w-4 h-4 text-blue-600" /> Fee Type Amounts
//                                 </h3>
//                                 <div className="space-y-3">
//                                     {formData.fee_types_amount.map((ft, idx) => (
//                                         <div
//                                             key={idx}
//                                             className="grid md:grid-cols-3 gap-3 items-center border p-3 rounded-lg"
//                                         >
//                                             <select
//                                                 value={ft.fee_type_id}
//                                                 onChange={(e) =>
//                                                     handleFeeTypeChange(idx, "fee_type_id", e.target.value)
//                                                 }
//                                                 className="border rounded-lg px-3 py-2"
//                                             >
//                                                 <option value="">Select Fee Type</option>
//                                                 {feeTypes.map((t) => (
//                                                     <option key={t.id} value={t.id}>
//                                                         {t.name}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                             <input
//                                                 type="number"
//                                                 placeholder="Amount"
//                                                 value={ft.amount}
//                                                 onChange={(e) =>
//                                                     handleFeeTypeChange(idx, "amount", e.target.value)
//                                                 }
//                                                 className="border rounded-lg px-3 py-2"
//                                             />
//                                             <button
//                                                 type="button"
//                                                 onClick={() => removeFeeTypeRow(idx)}
//                                                 className="text-red-500 hover:text-red-700 text-sm"
//                                             >
//                                                 Remove
//                                             </button>
//                                         </div>
//                                     ))}
//                                 </div>
//                                 <button
//                                     type="button"
//                                     onClick={addFeeTypeRow}
//                                     className="mt-2 text-blue-600 hover:underline text-sm"
//                                 >
//                                     + Add Fee Type
//                                 </button>
//                             </div>

//                             {/* Submit */}
//                             <div className="pt-4 flex justify-end gap-3">
//                                 <button
//                                     type="button"
//                                     onClick={toggleDrawer}
//                                     className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     disabled={loading}
//                                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//                                 >
//                                     {loading ? "Saving..." : "Save Fee"}
//                                 </button>
//                             </div>
//                         </form>
//                     </motion.div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default CreateFee;



import React, { useState } from "react";
import {
    X,
    DollarSign,
    ReceiptIndianRupee,
    Calendar,
    Layers,
    Settings2,
    Plus,
    Trash2,
} from "lucide-react";

import { getSessionCache } from "../../../utils/sessionCache";
import { postFee } from "../../../api/fees";



const CreateFee = () => {
    const config = getSessionCache("dashboardConfig");
    const standards = config?.standards || [];
    const feeFrequency = config?.fee_frequency || [];
    const feeTypes = config?.fee_types || [];
    const context = getSessionCache("dashboardContext");
    // console.log("config --->", context);

    const [isOpen, setIsOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    // Mock data for demo



    const [formData, setFormData] = useState({
        name: "",
        serial_number: "",
        type: "",
        start_date: "",
        end_date: "",
        due_date: "",
        number_of_months: "",
        transport_fee_multiplier: "",
        include_transport_fee: false,
        is_miscellaneous: false,
        is_online_payment_allowed: false,
        is_partial_payment_allowed: false,
        is_adjustment_amount_applicable: false,
        show_break_up_on_receipt: false,
        is_disabled: false,
        standard_ids: [],
        fee_types_amount: [{ fee_type_id: "", amount: "" }],
    });

    const toggleDrawer = () => setIsOpen(!isOpen);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleToggle = (field) => {
        setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleFeeTypeChange = (index, field, value) => {
        const updated = [...formData.fee_types_amount];
        updated[index][field] = value;
        setFormData((prev) => ({ ...prev, fee_types_amount: updated }));
    };

    const addFeeTypeRow = () => {
        setFormData((prev) => ({
            ...prev,
            fee_types_amount: [...prev.fee_types_amount, { fee_type_id: "", amount: "" }],
        }));
    };

    const removeFeeTypeRow = (index) => {
        const updated = [...formData.fee_types_amount];
        updated.splice(index, 1);
        setFormData((prev) => ({ ...prev, fee_types_amount: updated }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {

            ...formData,
            // convert booleans → "1"/"0" for API
            include_transport_fee: formData.include_transport_fee ? "1" : "0",
            is_miscellaneous: formData.is_miscellaneous ? "1" : "0",
            is_online_payment_allowed: formData.is_online_payment_allowed ? "1" : "0",
            is_partial_payment_allowed: formData.is_partial_payment_allowed ? "1" : "0",
            is_adjustment_amount_applicable: formData.is_adjustment_amount_applicable
                ? "1"
                : "0",
            show_break_up_on_receipt: formData.show_break_up_on_receipt ? "1" : "0",
            is_disabled: formData.is_disabled ? "1" : "0",
        };
        console.log("🧾 ----- payload --:", context?.profileId);

        const resp = await postFee(
            context?.profileId,
            context?.session,
            payload)

        console.log("🧾 Submitting Fee Payload:", resp);
        if (resp?.data?.success) {
            setLoading(false);
            setIsOpen(false);
            // Reset form   
            setFormData({
                name: "",
                serial_number: "",
            })
        }

        // setTimeout(() => setLoading(false), 1000);
    };
    return (
        <>
            <button
                onClick={toggleDrawer}
                className="cursor-pointer group relative px-6 py-2.5 bg-gradient-to-r from-accent to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 font-medium"
            >
                <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Fee
                </span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden"
                        // style={{ maxHeight: "90vh" }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-accent to-blue-700 px-8 py-6 text-white">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <ReceiptIndianRupee className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">Create Fee</h2>
                                        <p className="text-blue-100 text-sm mt-0.5">Configure fee structure for students</p>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleDrawer}
                                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="overflow-y-auto px-8 py-6" style={{ maxHeight: "calc(90vh - 180px)" }}>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Basic Information */}
                                <div className="space-y-5">
                                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                                        <Layers className="w-5 h-5 text-blue-600" />
                                        <h3 className="text-lg">Basic Information</h3>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Fee Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="e.g. Half Yearly Fee"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Serial Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.serial_number}
                                                onChange={(e) => handleInputChange("serial_number", e.target.value)}
                                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="e.g. 22"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Fee Type
                                            </label>
                                            <select
                                                value={formData.type}
                                                onChange={(e) => handleInputChange("type", e.target.value)}
                                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                                            >
                                                <option value="">Select Type</option>
                                                {feeFrequency?.map((freq) => (
                                                    <option key={freq?.key} value={freq?.value}>
                                                        {freq?.key}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Applicable Standards
                                            </label>
                                            <div className="border-2 border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all bg-white">
                                                {formData.standard_ids.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {formData.standard_ids.map((id) => {
                                                            const std = standards.find((s) => s.id === id);
                                                            return (
                                                                <span
                                                                    key={id}
                                                                    className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-sm px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium border border-blue-200"
                                                                >
                                                                    {std?.name || id}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleInputChange(
                                                                                "standard_ids",
                                                                                formData.standard_ids.filter((sid) => sid !== id)
                                                                            )
                                                                        }
                                                                        className="hover:text-red-600 transition-colors"
                                                                    >
                                                                        <X className="w-3 h-3" />
                                                                    </button>
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                                <select
                                                    value=""
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (value && !formData.standard_ids.includes(value)) {
                                                            handleInputChange("standard_ids", [
                                                                ...formData.standard_ids,
                                                                value,
                                                            ]);
                                                        }
                                                    }}
                                                    className="w-full outline-none border-none bg-transparent text-sm"
                                                >
                                                    <option value="">Select Standard</option>
                                                    {standards
                                                        .filter((std) => !formData.standard_ids.includes(std.id))
                                                        .map((std) => (
                                                            <option key={std.id} value={std.id}>
                                                                {std.name}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Date Configuration */}
                                <div className="space-y-5">
                                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                        <h3 className="text-lg">Date Configuration</h3>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Start Date
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.start_date}
                                                onChange={(e) => handleInputChange("start_date", e.target.value)}
                                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                End Date
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.end_date}
                                                onChange={(e) => handleInputChange("end_date", e.target.value)}
                                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Due Date
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.due_date}
                                                onChange={(e) => handleInputChange("due_date", e.target.value)}
                                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Number of Months
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.number_of_months}
                                                onChange={(e) => handleInputChange("number_of_months", e.target.value)}
                                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="e.g. 6"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Transport Fee Multiplier
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={formData.transport_fee_multiplier}
                                                onChange={(e) =>
                                                    handleInputChange("transport_fee_multiplier", e.target.value)
                                                }
                                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="e.g. 1.5"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Settings */}
                                <div className="space-y-5">
                                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                                        <Settings2 className="w-5 h-5 text-blue-600" />
                                        <h3 className="text-lg">Fee Settings</h3>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-xl">
                                        {[
                                            { field: "include_transport_fee", label: "Include Transport Fee" },
                                            { field: "is_miscellaneous", label: "Is Miscellaneous" },
                                            { field: "is_online_payment_allowed", label: "Online Payment Allowed" },
                                            { field: "is_partial_payment_allowed", label: "Partial Payment Allowed" },
                                            {
                                                field: "is_adjustment_amount_applicable",
                                                label: "Adjustment Amount Applicable",
                                            },
                                            { field: "show_break_up_on_receipt", label: "Show Breakup On Receipt" },
                                            { field: "is_disabled", label: "Is Disabled" },
                                        ].map(({ field, label }) => (
                                            <label
                                                key={field}
                                                className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer group"
                                            >
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData[field]}
                                                        onChange={() => handleToggle(field)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                                                </div>
                                                <span className="font-medium group-hover:text-blue-600 transition-colors">
                                                    {label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Fee Type Amounts */}
                                <div className="space-y-5">
                                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                                        <DollarSign className="w-5 h-5 text-blue-600" />
                                        <h3 className="text-lg">Fee Type Amounts</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {formData.fee_types_amount.map((ft, idx) => (
                                            <div
                                                key={idx}
                                                className="grid md:grid-cols-[1fr,1fr,auto] gap-4 items-center bg-gradient-to-r from-gray-50 to-white p-5 rounded-xl border-2 border-gray-100 hover:border-blue-200 transition-colors"
                                            >
                                                <select
                                                    value={ft.fee_type_id}
                                                    onChange={(e) =>
                                                        handleFeeTypeChange(idx, "fee_type_id", e.target.value)
                                                    }
                                                    className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                                                >
                                                    <option value="">Select Fee Type</option>
                                                    {feeTypes.map((t) => (
                                                        <option key={t.id} value={t.id}>
                                                            {t.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="number"
                                                    placeholder="Amount (₹)"
                                                    value={ft.amount}
                                                    onChange={(e) =>
                                                        handleFeeTypeChange(idx, "amount", e.target.value)
                                                    }
                                                    className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeFeeTypeRow(idx)}
                                                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                    disabled={formData.fee_types_amount.length === 1}
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addFeeTypeRow}
                                        className="cursor-pointer flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm hover:gap-3 transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Fee Type
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 px-8 py-5  bg-blue-50 flex justify-end gap-6">
                            <button
                                type="button"
                                onClick={toggleDrawer}
                                className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="cursor-pointer px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 font-medium"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                fill="none"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Saving...
                                    </span>
                                ) : (
                                    "Save Fee"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreateFee;