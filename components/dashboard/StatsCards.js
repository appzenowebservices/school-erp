"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const DashboardStatsSection = ({ stats }) => {
  const router = useRouter();

  return (
    <div className="
      cursor-pointer 
      grid 
      grid-cols-1 
      sm:grid-cols-2 
      md:grid-cols-3
      lg:grid-cols-4 
      gap-4 
      md:gap-6 
      mb-10
      w-full
    ">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            onClick={() => router.push(stat?.url)}
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ scale: 1.04 }}
            className={`relative bg-gradient-to-br ${stat.color} text-white p-5 rounded-2xl shadow-lg flex items-center justify-between overflow-hidden min-h-[120px]`}
          >
            <div>
              <p className="text-xs sm:text-sm font-medium opacity-80">{stat.label}</p>
              <p className="text-2xl sm:text-3xl font-bold mt-1 tracking-tight">{stat.value}</p>
            </div>
            <div className="opacity-70">
              <Icon className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DashboardStatsSection;
