import React, { useState } from "react";
import { HiChevronRight } from 'react-icons/hi';

export function Select({ children, className }) {
  return <div className={`relative w-full ${className}`}>{children}</div>;
}

export function SelectTrigger({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex justify-between items-center px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      {children}
      <HiChevronRight className="w-4 h-4 ml-2" />
    </button>
  );
}

export function SelectContent({ children, className }) {
  return (
    <div className={`absolute w-full bg-white shadow-md rounded-lg mt-1 z-10 ${className}`}>{children}</div>
  );
}

export function SelectItem({ children, onClick, className }) {
  return (
    <div
      onClick={onClick}
      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
}

export function SelectValue({ value, placeholder, className }) {
  return (
    <span className={`text-gray-700 ${className}`}>
      {value || placeholder}
    </span>
  );
}
