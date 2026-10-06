import React from "react";

export function InputWithIcon({ icon: Icon, className, ...props }) {
  return (
    <div className="relative flex items-center">
      {Icon && <Icon className="absolute bg-accent" />} {/* Icon positioning */}
      <input
        className={`mt-2 w-full px-10 py-2 bg-gray-100 text-gray-800 text-sm rounded-md border border-[#e7eaf3] focus:ring-1 border-opacity-100 shadow placeholder-gray-400 focus:ring-accent focus:border-accent focus:border-opacity-50 outline-none transition ${className}`}
        {...props}
      />
    </div>
  );
}
