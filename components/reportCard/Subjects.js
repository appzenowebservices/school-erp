import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Book,
  Star,
  Award,
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  ScrollText,
  Map,
  IndianRupee,
  CaseUpper,
}
  from 'lucide-react';
import { getSubjectsList } from '../../api/subjects';
import { getExamList } from '../../api/exam';
import Loader from '../ui/status/Loader';
import SubjectsTabs from './SubjectsTabs';
import SubjectsCards from './SubjectsCards';
import SubjectsTable from './SubjectsTable';
import { SubjectModal } from './SubjectModal';
import { TestModal } from './TestModal';
import ExportWithStandardSelect from './ExportWithStandardSelect';
import { FaRegIdCard } from 'react-icons/fa6';
import { FaTable } from 'react-icons/fa';
// ===================================================================================================
const SubjectsManagement = ({
  classes,
  selectedStandard,
  setSelectedStandard,
  cookyGuid,
  cookyId,
  context

}) => {


  // ===================================================================================================

  const [activeTab, setActiveTab] = useState();
  const [subjects_, setSubjects] = useState();
  const [exams_, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('cards');

  const [subjectFormData, setSubjectFormData] = useState({ name: "", priority: "" });


  // ===================================================================================================

  const fetchData = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {


      const subjectRes = await getSubjectsList(
        selectedStandard,
        context?.profileId,
        context?.session,
        cookyGuid,
        cookyId
      );
      console.log('subjectRes', subjectRes)

      const examRes = await getExamList(selectedStandard);
      setSubjects(subjectRes?.results?.subjects || []);
      setExams(examRes?.results?.items || []);
    } catch (error) {
      setLoading(false); // Set loading to true before fetching data

      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  useEffect(() => {
    if (!selectedStandard) return;
    fetchData();
  }, [selectedStandard]);
  // console.log(' ----- currentSubjects -------', subjects_)


  const currentSubjects = (subjects_)
    // .filter(subject => subject?.id === selectedStandard)
    ?.filter(subject => {
      const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' ||
        // (filterType === 'mandatory' && !subject.is_optional) ||
        (filterType === 'mandatory') ||
        // (filterType === 'optional' && subject.is_optional);
        (filterType === 'optional');
      return matchesSearch && matchesFilter;
    });
  // ===================================================================================================

  const getGradientClass = (index) => {
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-teal-600',
      'from-orange-500 to-red-600',
      'from-pink-500 to-rose-600',
      'from-indigo-500 to-blue-600',
      'from-yellow-500 to-orange-600'
    ];
    return gradients[index % gradients.length];
  };



  const getSubjectIcon = (name) => {
    const iconMap = {
      'ENGLISH': CaseUpper,
      'MATHEMATICS': Calculator,
      'SCIENCE': FlaskConical,
      'HINDI': IndianRupee,
      'SOCIAL': Globe,
      'HISTORY': ScrollText,
      'GEOGRAPHY': Map,
    };
    return iconMap[name.toUpperCase()] || BookOpen;
  };

  const handleSave = (data) => {
    console.log("Saving subject:", data);
    // call API or update state
  };



  // ===================================================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      {/* --------------------------------------------------------------------------------------------------- */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 sticky top-0 z-40">
        <div className="mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent">
                Subjects Management
              </h1>
              <p className="text-gray-600 mt-1">Configure subjects, tests, and marking schemes for each standard</p>
            </div>
            {/* This container now uses `flex-col` for small screens and `sm:flex-row` for larger screens. */}
            {/* This is the key change to make the buttons stack. */}
            <ExportWithStandardSelect
              standards={classes}
            />
          </div>
        </div>
      </div>
      {/* --------------------------------------------------------------------------------------------------- */}

      <div className=" mx-auto px-6 py-8">
        {/* Controls Section */}


        {/* Filter and Controls Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 mb-8 mt-8 mx-auto">
          {/* The grid layout is now responsive. On small screens, it uses a single column (`grid-cols-1`),
            and on medium screens and up, it reverts to the 12-column layout. */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            {/* Select Standard Dropdown */}
            <div className="col-span-full md:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Select Standard</label>
              <select
                value={selectedStandard}
                onChange={(e) => setSelectedStandard(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-medium"
              >
                {classes?.map(standard => (
                  <option key={standard?.id} value={standard?.id}>
                    {standard?.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Subjects Input */}
            <div className="col-span-full md:col-span-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Search Subjects</label>
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by subject name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Filter by Type Dropdown */}
            <div className="col-span-full md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-medium"
              >
                <option value="all">All Subjects</option>
                <option value="mandatory">Mandatory Only</option>
                <option value="optional">Optional Only</option>
              </select>
            </div>

            {/* View Mode and Add Buttons */}
            <div className="col-span-full md:col-span-3 flex flex-col md:flex-row gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                {viewMode === 'cards' ? <FaRegIdCard /> : <FaTable />}
                {viewMode === 'cards' ? 'Table' : 'Cards'}
              </button>
              <button
                onClick={() => setShowSubjectModal(true)}
                className="cursor-pointer flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                Add subject
              </button>
            </div>
          </div>
        </div>
        {/* --------------------------------------------------------------------------------------------------- */}

        {/* Stats Cards */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Subjects</p>
                <p className="text-3xl font-bold text-gray-900">{currentSubjects?.length}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Mandatory</p>
                <p className="text-3xl font-bold text-green-600">{currentSubjects?.filter(s => !s?.is_optional)?.length}</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-xl">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Optional</p>
                <p className="text-3xl font-bold text-orange-600">{currentSubjects?.filter(s => s?.is_optional)?.length}</p>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Chapters</p>
                <p className="text-3xl font-bold text-purple-600">
                  {currentSubjects?.reduce((sum, s) => sum + parseInt(s?.chapters?.count || 0), 0)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl">
                <Book className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
        {/* --------------------------------------------------------------------------------------------------- */}

        {/* Subjects Display */}
        {!loading ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Subjects for {classes?.find(s => s?.id === selectedStandard)?.name}
                </h2>
                <div className="text-sm text-gray-500">
                  {currentSubjects?.length} subjects found
                </div>
              </div>
            </div>



            {/* ==================================================== */}

            <SubjectsTabs
              subjects={currentSubjects}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            {/* ============================================================= */}




            {viewMode === 'cards' ? (
              // Cards View
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentSubjects?.map((subject, index) => {
                    const SubjectIcon = getSubjectIcon(subject.name);

                    return (
                      <SubjectsCards
                        subject={subject}
                        index={index}
                        SubjectIcon={SubjectIcon}
                        setShowTestModal={setShowTestModal}
                        setSelectedSubject={setSelectedSubject}
                      />
                    )
                  })}
                </div>
              </div>
            ) : (
              // Table View
              <SubjectsTable subjects={subjects_} />
            )}

            {/* Empty State */}
            {currentSubjects?.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No subjects found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding subjects for this standard'}
                </p>
                <button
                  onClick={() => setShowSubjectModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add First Subject
                </button>
              </div>
            )}
          </div>
        ) : <Loader />}
      </div >
      {/* --------------------------------------------------------------------------------------------------- */}

      {/* Modals */}
      {showSubjectModal &&
        <SubjectModal
          subjectFormData={subjectFormData}
          setSubjectFormData={setSubjectFormData}
          setShowSubjectModal={setShowSubjectModal}
          onSave={handleSave}
        />
      }
      {showTestModal && <TestModal
        selectedSubject={selectedSubject}
      />}
    </div >
  );
};
// ===================================================================================================

export default SubjectsManagement;