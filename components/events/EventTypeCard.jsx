"use client";
import React from "react";
import { motion } from "framer-motion";
import {

    Calendar,
    Info,
    CheckCircle2,

    AlertTriangle,
} from "lucide-react";
import TooltipInfo from "../ui/tooltip/TooltipInfo";

const EventTypeCard = ({ event, idx }) => {

    return (
        <>


            <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-200"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{
                                backgroundColor: event.color || "#e5e7eb",
                            }}
                        >
                            <Calendar className="w-6 h-6 text-white drop-shadow" />
                        </div>
                        <div className="bg-orange">



                            <h4 className="text-base font-semibold text-gray-800">
                                {event.name}
                            </h4>
                            <p className="text-sm text-gray-500 mt-0.5">
                                ID: {event.id}
                            </p>
                        </div>
                    </div>
                    {event.display_native_ad ? (
                        <TooltipInfo position="left" text={'Native ads enabled'}>

                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </TooltipInfo>
                    ) : (
                        <TooltipInfo position="left" text={'Native ads disabled'}>
                        <AlertTriangle className="w-5 h-5 text-gray-400" />
                            </TooltipInfo>
                    )}
                </div>

                <div className="mt-3 pl-1 flex items-start gap-2 text-gray-600">
                    <Info className="w-4 h-4 mt-0.5 text-blue-500" />
                    <p className="text-sm leading-relaxed">
                        {event.description || "No description available."}
                    </p>
                </div>

                {event.options?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {event.options.map((opt, i) => (
                            <span
                                key={i}
                                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
                            >
                                {opt}
                            </span>
                        ))}
                    </div>
                )}
            </motion.div>

        </>
    );
};

export default EventTypeCard;
