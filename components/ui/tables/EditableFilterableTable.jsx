import React, { useState } from 'react';

const EditableTable = ({ columns, data, onSave }) => {
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editRowData, setEditRowData] = useState({});

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

  return (
    <div className="relative overflow-x-auto w-xs md:w-full shadow-lg rounded-xl">
      <table className="w-full text-sm text-left text-gray-700 dark:text-gray-400">
        {/* Table Header */}
        <thead className="sticky top-0 z-10 text-xs uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
          <tr>
            {columns.map((col) => (
              <th key={col.key} scope="col" className="px-6 py-4 font-semibold">
                {col.label}
              </th>
            ))}
            <th scope="col" className="px-6 py-4 font-semibold">Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr
                key={index}
                className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700 border-b dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4">
                    {editRowIndex === index ? (
                      <input
                        type="text"
                        value={editRowData[col.key] || ''}
                        onChange={(e) => handleChange(col.key, e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    ) : col.render ? (
                      col.render(row[col.key], row)
                    ) : (
                      row[col.key]
                    )}
                  </td>
                ))}

                <td className="px-6 py-4">
                  {editRowIndex === index ? (
                    <div className="flex gap-2">
                      <button onClick={handleSave} className="text-green-600 hover:underline">Save</button>
                      <button onClick={handleCancel} className="text-red-600 hover:underline">Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(index, row)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="text-center py-8 text-gray-400">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EditableTable;