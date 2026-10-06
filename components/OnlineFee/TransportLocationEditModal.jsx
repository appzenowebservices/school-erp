'use client';
import React, { useEffect, useState } from "react";
import {
    X,
    MapPin,
    ReceiptIndianRupee,
    Save,
    School,
    IndianRupee,
    AlertCircle,
    Loader2
} from "lucide-react";

const TransportLocationEditModal = ({ drawerOpen, selectedLocation, setDrawerOpen, onSave }) => {
    const [formData, setFormData] = useState({
        clientName: "",
        name: "",
        transport_fee: ""
    });
    const [saving, setSaving] = useState(false);

    // Sync drawer state with incoming selected data
    useEffect(() => {
        if (selectedLocation) {
            setFormData({
                clientName: selectedLocation.client?.full_name || "N/A",
                name: selectedLocation.name || "",
                transport_fee: selectedLocation.transport_fee || ""
            });
        }
    }, [selectedLocation, drawerOpen]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Simulated API call - replace with your actual update function
            if (onSave) {
                await onSave({
                    id: selectedLocation.id,
                    ...formData
                });
            }
            setDrawerOpen(false);
        } catch (err) {
            console.error("Failed to save:", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            {/* Drawer Sidebar */}
            <div
                className={`fixed inset-y-0 right-0 w-full md:w-[28rem] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${drawerOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Edit Location</h3>
                            <p className="text-xs text-gray-500 font-medium tracking-tight uppercase">Update route pricing & info</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setDrawerOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Information Note */}
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                        <p className="text-xs text-amber-800 leading-relaxed font-medium">
                            Changes made to the transport fee will affect all students assigned to this route starting from the next billing cycle.
                        </p>
                    </div>

                    {/* Field: Client (Read Only) */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <School size={14} /> Associated Client
                        </label>
                        <input
                            type="text"
                            value={formData.clientName}
                            disabled
                            className="w-full bg-gray-50 border border-gray-200 text-gray-500 text-sm font-medium px-4 py-3 rounded-xl cursor-not-allowed"
                        />
                    </div>

                    {/* Field: Name */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Location / Route Name</label>
                        <div className="relative group">
                            <MapPin className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter location name"
                                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Field: Fee */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Monthly Transport Fee</label>
                        <div className="relative group">
                            <div className="absolute left-3.5 top-3.5 bg-gray-100 px-1.5 rounded text-gray-500 font-bold text-xs flex items-center h-5">
                                ₹
                            </div>
                            <input
                                type="number"
                                value={formData.transport_fee}
                                onChange={(e) => setFormData({ ...formData, transport_fee: e.target.value })}
                                placeholder="0.00"
                                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                                required
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium italic">Standard monthly rate for this specific location.</p>
                    </div>
                </form>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                    <button
                        type="button"
                        onClick={() => setDrawerOpen(false)}
                        className="flex-1 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-white rounded-xl border border-gray-200 transition-all shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        onClick={handleSave}
                        className="flex-[1.5] px-4 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:bg-blue-300 shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all"
                    >
                        {saving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Save size={18} /> Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Backdrop */}
            {drawerOpen && (
                <div
                    onClick={() => setDrawerOpen(false)}
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 transition-opacity animate-in fade-in duration-300"
                />
            )}
        </>
    );
};

export default TransportLocationEditModal;