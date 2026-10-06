import React, { useState, useMemo } from 'react';

const EnhancedEditableTable = ({ columns, data, onSave }) => {
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editRowData, setEditRowData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];

      if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const filteredData = useMemo(() => {
    return sortedData.filter((row) =>
      columns.some((col) =>
        String(row[col.key]).toLowerCase().includes(searchTerm)
      )
    );
  }, [sortedData, searchTerm, columns]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage]);

  return (
    <div className="relative overflow-x-auto w-xs md:w-full  shadow-lg rounded-xl">
      {/* Search Input */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Table */}
      <table className="w-full text-sm text-left text-gray-700 dark:text-gray-400">
        {/* Header */}
        <thead className="sticky top-0 z-10 text-xs uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-6 py-4 font-semibold cursor-pointer"
                onClick={() => handleSort(col.key)}
              >
                {col.label}
                {sortConfig.key === col.key && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
              </th>
            ))}
            <th scope="col" className="px-6 py-4 font-semibold">Actions</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, index) => (
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

      {/* Pagination */}
      <div className="p-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>Page {currentPage}</span>

        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={paginatedData.length < rowsPerPage}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EnhancedEditableTable;
