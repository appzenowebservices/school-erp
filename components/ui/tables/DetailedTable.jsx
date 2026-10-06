import React from 'react';

const DetailedTable = ({ columns, data, onRowClick }) => {
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
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr
                key={index}
                onClick={() => onRowClick && onRowClick(row)}
                className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700 border-b dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-all"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-gray-400">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DetailedTable;
