'use client';
import React, { useState, useMemo, useEffect } from 'react';
import HeaderFeeTypesStudents from './HeaderFeeTypesStudents';
import { BookOpen } from 'lucide-react';
import { getFeeTypes } from '../../api/fees';
import { getSessionCache } from '../../utils/sessionCache';
import FeeTypesStudentsTable from './FeeTypesStudentsTable';

const FeeTypeStudents = () => {
  const context = getSessionCache('dashboardContext')
  // 1. State for the Selected Dropdown Value
  const [selectedFeeType, setSelectedFeeType] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [feeTypes, setFeeTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchFeeTypesData = async () => {
    setLoading(true);
    try {
      const response = await getFeeTypes(
        context?.profileId,
        context?.session,
        1,   // page
        100  // limit (getting all for the dropdown)
      );

      if (response.status) {
        // Ensure we extract the array correctly based on your API structure
        const types = response?.data?.results?.fee_types || [];
        setFeeTypes(types);
      } else {
        setError("Failed to load fee categories");
      }
    } catch (err) {
      console.error("Error fetching fee types:", err);
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (context?.profileId) {
      fetchFeeTypesData();
    }
  }, [context?.profileId, context?.session]);
  // 2. Your List of Fee Types

  // 3. Filtered results based on Dropdown Selection
  const displayData = useMemo(() => {
    if (selectedFeeType === "all") return feeTypes;
    return feeTypes.filter(item => item.id === selectedFeeType);
  }, [selectedFeeType]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        <HeaderFeeTypesStudents
          headerTitle="Student Fee Type"
          headerIcon={<BookOpen />}
          feeTypes={feeTypes} // Pass the list to the header
          selectedFeeType={selectedFeeType}
          onFeeTypeSelect={setSelectedFeeType}
          toggleFilterPanel={() => setIsFilterOpen(!isFilterOpen)}
          getFilterCount={() => 0} // Placeholder
        />

        <FeeTypesStudentsTable
          context={context}
          selectedFeeType={selectedFeeType}
        />
      </div>
    </div>
  );
};

export default FeeTypeStudents;