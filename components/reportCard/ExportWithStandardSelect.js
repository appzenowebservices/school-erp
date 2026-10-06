"use client";
import React, { useState } from "react";
import { Upload } from "lucide-react";

const ExportWithStandardSelect = ({ standards }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState([]);



  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    if (selected.length === 0) {
      alert("Pick at least one standard before exporting.");
      return;
    }
    console.log("Exporting for:", selected);
    // your export logic goes here
    setIsModalOpen(false);
  };

  return (
    <>
    
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center sm:justify-start gap-2 font-medium"
        >
          <Upload className="w-5 h-5" />
          Export
        </button>


      </div>
        {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Select Standards to Export
            </h2>

            <div className="max-h-60 overflow-y-auto space-y-2 mb-6">
              {standards.map((std) => (
                <label
                  key={std.id}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(std.id)}
                    onChange={() => toggleSelect(std.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="text-sm">{std.name}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="cursor-pointer px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Start Download
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExportWithStandardSelect;
