"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { MdEvent } from "react-icons/md";
import EventTypeCard from "./EventTypeCard";
import EventTypeTab from "./EventTypeTab";
import EventTypeEditForm from "./EventTypeEditForm";
import EventTypeAddForm from "./EventTypeAddForm";



const EventTypeDrawer = ({ drawerOpen, setDrawerOpen, eventsType = [] }) => {
    const [data, setData] = useState([]);
    const [mode, setMode] = useState("view"); // view | edit | add
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        if (drawerOpen) setData(eventsType || []);
    }, [drawerOpen, eventsType]);

    const handleCardSelect = (event) => {
        setSelectedEvent(event);
        setMode("edit");
    };

    const handleBackToList = () => {
        setMode("view");
        setSelectedEvent(null);
    };

    return (
        <>
            {/* Drawer */}
            <div
                className={`fixed inset-y-0 right-0 w-full md:w-[30rem] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${drawerOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                            <MdEvent className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Event Type Details</h3>
                            <p className="text-sm text-blue-100">
                                A quick glance at all configured event types
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setDrawerOpen(false)}
                        className="cursor-pointer p-2 hover:bg-white/20 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tab control (only show in non-view mode) */}
                <EventTypeTab
                    mode={mode}
                    onTabChange={(m) => setMode(m)}
                />
                {/* {mode !== "view" && (
        )} */}

                {/* Content */}
                <div className="overflow-y-auto h-[calc(100vh-88px)] p-6 space-y-4">
                    {mode === "view" && (
                        <>
                            {data.length > 0 ? (
                                data.map((event, idx) => (
                                    <div key={idx} onClick={() => handleCardSelect(event)}>


                                        <EventTypeCard event={event} idx={idx} />
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                    <MdEvent className="w-10 h-10 mb-3" />
                                    <p className="font-medium">No Event Types Available</p>
                                </div>
                            )}
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={() => setMode("add")}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-md"
                                >
                                    + Add New Event Type
                                </button>
                            </div>
                        </>
                    )}

                    {mode === "edit" && (
                        <>

                            <EventTypeEditForm
                                eventData={selectedEvent}

                                onBack={handleBackToList}
                            />
                        </>
                    )}

                    {mode === "add" && <EventTypeAddForm onBack={handleBackToList} />}
                </div>
            </div>

            {/* Backdrop */}
            {drawerOpen && (
                <motion.div
                    onClick={() => setDrawerOpen(false)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 cursor-pointer"
                />
            )}
        </>
    );
};

export default EventTypeDrawer;
