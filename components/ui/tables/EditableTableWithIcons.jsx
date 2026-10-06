"use client";

import React, { useState, useEffect } from "react";
import { Input } from "../input/input";
// import { AddButton } from "../button/addButton"; // Uncomment if needed
import MediaModal from "../modal/UpdateModal";
import { FaPencilAlt } from "react-icons/fa";
import { CiSaveDown1 } from "react-icons/ci";
import { GoXCircle } from "react-icons/go";

const EditableTableWithIcons = ({ title, columns, data, onSave, onAdd, onRowClick }) => {
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editRowData, setEditRowData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newEntry, setNewEntry] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleEdit = (index, row) => {
    setEditRowIndex(index);
    setEditRowData(row);
  };

  const handleChange = (key, value) => {
    setEditRowData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(editRowData);
    setEditRowIndex(null);
    setEditRowData({});
  };

  const handleCancel = () => {
    setEditRowIndex(null);
    setEditRowData({});
  };

  const handleAdd = () => {
    onAdd(newEntry);
    setShowModal(false);
    setNewEntry({});
  };

  const filteredData = data?.filter((row) =>
    columns.some((col) =>
      row[col.key]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  const paginatedData = filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (filteredData?.length <= itemsPerPage) {
      setCurrentPage(1);
    }
  }, [searchQuery, data]);

  return (
    <div className="relative w-full overflow-x-auto rounded-xl shadow bg-background p-4 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-primary-text">{title}</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 rounded-xl"
          />
        </div>
      </div>

      <div className="overflow-auto rounded-xl shadow">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-muted text-xs uppercase text-primary-text">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-sm font-semibold tracking-wide">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData?.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr
                  key={index}
                  className="last:border-none hover:bg-gray-100 dark:hover:bg-muted transition rounded-lg odd:bg-white even:bg-gray-100"
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 align-top">
                      {editRowIndex === index ? (
                        <input
                          type="text"
                          value={editRowData[col.key] || ""}
                          onChange={(e) => handleChange(col.key, e.target.value)}
                          className="w-full p-1 border rounded bg-white"
                        />
                      ) : col.render ? (
                        col.render(row[col.key], row)
                      ) : col.key === "status" ? (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium 
                          ${
                            row[col.key] === "new"
                              ? "bg-green-100 text-green-700"
                              : row[col.key] === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-600"
                          }
                        `}
                        >
                          {row[col.key]}
                        </span>
                      ) : (
                        row[col.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-8 text-muted">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end gap-2 pt-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                currentPage === i + 1
                  ? "bg-accent text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-accent hover:text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {showModal && (
        <MediaModal
          isOpen={showModal}
          title="Add New Entry"
          onSubmit={handleAdd}
          newEntry={newEntry}
          setNewEntry={setNewEntry}
        />
      )}
    </div>
  );
};

export default EditableTableWithIcons;
