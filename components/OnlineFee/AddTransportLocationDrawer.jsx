import React, { useState, useEffect } from "react";
import {
    X,
    MapPin,
    Bus,
    IndianRupee,
    Save,
    Building2,
} from "lucide-react";

const AddTransportLocationDrawer = ({ drawerOpen, setDrawerOpen, context, onSave }) => {
    // 1. Form State
    const [formData, setFormData] = useState({
        clientId: "",
        locationName: "",
        transportFee: "",
    });
    const [loading, setLoading] = useState(false);

    // Reset form when drawer opens/closes
    useEffect(() => {
        if (!drawerOpen) {
            setFormData({ clientId: "", locationName: "", transportFee: "" });
        }
    }, [drawerOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Here you would call your API to save the transport location
            // e.g., await addTransportLocation(formData);
            if (onSave) onSave(formData);
            setDrawerOpen(false);
        } catch (err) {
            console.error("Error saving transport location:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Drawer */}
            <div
                className={`fixed inset-y-0 right-0 w-full md:w-[30rem] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${drawerOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Bus className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Add Transport Location</h3>
                            <p className="text-sm text-blue-100 mt-0.5">Define new routes and pricing</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setDrawerOpen(false)}
                        className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="overflow-y-auto h-[calc(100vh-88px)] flex flex-col">
                    <div className="p-6 space-y-6 flex-grow">

                        {/* Client Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-blue-600" />
                                Select Client
                            </label>
                            <select
                                name="clientId"
                                required
                                value={formData.clientId}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                            >
                                <option value="">Select a client...</option>
                                {/* Replace with dynamic options from your context or API */}
                                <option value="1">Main Campus</option>
                                <option value="2">North Wing School</option>
                            </select>
                        </div>

                        {/* Location Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                Location Name
                            </label>
                            <input
                                type="text"
                                name="locationName"
                                required
                                placeholder="e.g. Sector 15, City Center"
                                value={formData.locationName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                            />
                        </div>

                        {/* Transport Fee */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <IndianRupee className="w-4 h-4 text-blue-600" />
                                Monthly Transport Fee
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
                                <input
                                    type="number"
                                    name="transportFee"
                                    required
                                    placeholder="0.00"
                                    value={formData.transportFee}
                                    onChange={handleInputChange}
                                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mt-8">
                            <p className="text-xs text-blue-600 font-medium leading-relaxed">
                                * This location will be available for selection during student registration and bus allocation.
                                Fees will be applied on a monthly billing cycle.
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6 border-t bg-gray-50">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            {loading ? "Saving..." : "Save Location"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Backdrop */}
            {drawerOpen && (
                <div
                    onClick={() => setDrawerOpen(false)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 cursor-pointer transition-opacity"
                />
            )}
        </>
    );
};

export default AddTransportLocationDrawer;