'use client';
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Loader from '../ui/status/Loader';

const AttendanceReportSection = ({ reports, isSuccess, selectedDate, setSelectedDate }) => {

  // console.log('reports== -----------', reports[0]);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStandard, setSelectedStandard] = useState('');
  // const [selectedDate, setSelectedDate] = useState('');
  const reportsPerPage = 6; // Adjust this number as needed

  // console.log(reports, 'attendanceReportData=-=');

  // Extract unique standards/classes from reports
  const standards = useMemo(() => {
    if (!reports) return [];
    const uniqueStandards = [...new Set(reports.map(report => report?.class?.name))];
    return uniqueStandards.filter(Boolean).sort();
  }, [reports]);

  // Filter reports based on selected criteria
  const filteredReports = useMemo(() => {
    if (!reports) return [];

    return reports.filter(report => {
      // Filter only by selected standard
      return !selectedStandard || report?.class?.name === selectedStandard;
    });
  }, [reports, selectedStandard]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedStandard, selectedDate]);

  if (!isSuccess) {
    return (
      <Loader />
    )

  }
  if (reports?.length === 0) {
    return <p className="text-center text-gray-500">No attendance reports</p>;
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);

  // Pagination handlers
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedStandard('');
    setSelectedDate('');
  };

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Reports</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Standard/Class Dropdown */}
          <div>
            <label htmlFor="standard" className="block text-sm font-medium text-gray-700 mb-2">
              Standard/Class
            </label>
            <select
              id="standard"
              value={selectedStandard}
              onChange={(e) => setSelectedStandard(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">All Classes</option>
              {standards.map((standard) => (
                <option key={standard} value={standard}>
                  {standard}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Active Filters Info */}
        {(selectedStandard || selectedDate) && (
          <div className="mt-4 text-sm text-gray-600">
            Active filters:
            {selectedStandard && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">Class: {selectedStandard}</span>}
            {selectedDate && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">Date: {selectedDate}</span>}
          </div>
        )}
      </div>

      {/* Reports Grid */}
      {currentReports.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentReports?.map((report, idx) => (
            <div
              key={idx}
              className="rounded-xl shadow-lg overflow-hidden flex flex-col"
              style={{ backgroundColor: report?.background_color }}
            >
              {/* Header */}
              <div className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white">
                  <Image
                    src={report?.staff?.image_url || '/avatar.png'}
                    alt={report?.staff?.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {report?.staff?.name}
                  </h3>
                  <p className="text-sm opacity-90 text-white">
                    Class : {report?.class?.name}
                  </p>
                </div>
              </div>

              {/* Attendance Stats */}
              <div className="bg-white flex-1 p-6 flex flex-col justify-center items-center">
                <p className="text-4xl font-bold text-gray-800">
                  {report?.attendance?.percentage}%
                </p>
                <p className="text-gray-500 mt-1">
                  {report?.attendance?.number_of_students_present} /{' '}
                  {report?.attendance?.total_number_of_students} Present
                </p>
              </div>

              {/* Footer */}
              <div
                className="px-4 py-3 text-center text-sm"
                style={{ color: report?.text?.text_color }}
              >
                {report?.text?.text}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No reports found matching your filters</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && currentReports.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-10 h-10 rounded-lg transition ${currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Results Info */}
      {filteredReports.length > 0 && (
        <p className="text-center text-sm text-gray-600">
          Showing {indexOfFirstReport + 1}-{Math.min(indexOfLastReport, filteredReports.length)} of {filteredReports.length} reports
        </p>
      )}
    </div>
  );
};

export default AttendanceReportSection;