import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Users,
  Award,
  MoreVertical,
  Eye,
  Edit,
  Info,
  FileText,
  Clock,
  Monitor,
  BarChart3,
  Trash2,
  CheckCircle,
  XCircle,
  Calendar,
  Layers,
  Settings,
  Zap,
  Target,
  AwardIcon,
  Search,
  Plus
} from 'lucide-react';
import { useParams } from 'next/navigation';
import LoaderWIthoutBgBlurr from '../ui/status/LoaderWIthoutBgBlurr';
import ExamModal from './ExamModal';
import EditExamForm from './ExamEditModal';
import { addExam } from '../../api/exam';
import { getSessionCache } from '../../utils/sessionCache';

const ExamManagement = ({
  classes,
  subjects,
  selectedStandard,
  setSelectedStandard,
  cookyGuid,
  cookyId,
  exams
}) => {
  const Context = getSessionCache("dashboardContext");

  const [filterType, setFilterType] = useState(null);
  const [showExamEditModal, setShowExamEditModal] = useState(null);
  const [showExamModal, setShowExamModal] = useState(null);
  const [examFormData, setExamFormData] = useState({
    api: "exam.add",
    guid: `${Date.now()}${Math.random().toString(36).substring(2, 10)}`,
    logged_in_user_account_id: "",
    user_account_id: "",
    client_id: "428",
    platform: "WEB",
    standard_ids: [],
    standard: {
      id: "",
      name:""
    },
    name: "",
    code: "",
    serial_number: "",
    max_marks: "",
    pass_marks: "",
    no_of_working_days: "",
    is_displayable: "1",
    is_displayable_on_report_card_header: "1",
    weightage_percentage: "",
    pattern: "MARKS",
    marks_entry_format: "SOFT COPY",
    report_card_format_id: "",
    start_date: "",
    end_date: "",
    marks_submission_deadline_date: "",
    delivery_date: "",
    ptm_date: "",
    report_card_publish_date: "",
    report_card_publish_time: "",
    is_parent_subjects_accept_average: "1",
    is_qr_code_required_in_report_card: "1",
    is_applicable_for_delivery: "1",
    block_report_card: "0",
    block_analysis: "0",
    is_schedule_published: "1",
    report_card_publish_datetime: "",
  });


  const [error, setError] = useState('')

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [loading, setLoading] = useState(true); // start as true until initial load
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const [displayExams, setDisplayExams] = useState([]);

  // ------------------------------
  // Simulate or handle data loading
  // ------------------------------
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setDisplayExams(exams?.length > 0 ? exams : []);
      setLoading(false);
    }, 500); // artificial delay (or remove if your data is async)
    return () => clearTimeout(timeout);
  }, [exams]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getActionIcon = (action) => {
    const iconMap = {
      view: Eye,
      edit: Edit,
      examInfo: Info,
      examSyllabus: FileText,
      viewExamSchedule: Clock,
      viewOnlineExams: Monitor,
      viewMarksEntryReport: BarChart3,
      delete: Trash2
    };
    return iconMap[action] || Eye;
  };

  const handleActionClick = (exam, option) => {

    if (option.action === 'edit') {
      setShowExamModal(true);
      setExamFormData(exam);

    }
    setActiveDropdown(null);
  };

  const toggleDropdown = (examId) => {
    setActiveDropdown(activeDropdown === examId ? null : examId);
  };

  const MetricBadge = ({ metric, icon: Icon }) => {
    if (!metric || !metric.text) return null;
    return (
      <div
        className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
        style={{
          backgroundColor: metric.background_color,
          color: metric.text_color
        }}
      >
        {Icon && <Icon className="h-3 w-3" />}
        <span>{metric.key}:</span> <span className="font-bold">{metric.text}</span>
      </div>
    );
  };

  // ------------------------------
  // Filter exams by search term
  // ------------------------------
  const filteredExams = displayExams.filter(exam =>
    exam.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSave = (data) => {
    console.log("Saving subject:", data);
    // call API or update state
  };


  const submitExamAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...examFormData,
        standard_ids: examFormData.standard_ids.map((id) => String(id)),
        report_card_publish_datetime: `${examFormData.report_card_publish_date} ${examFormData.report_card_publish_time}`,
      };

      let res = await addExam(
        Context?.profileId,
        Context?.session,


        payload
      );

      if (!res?.data?.success) {
        setError(res?.data?.results?.message || 'Failed to save staff data. Please try again.');

      } else if (res?.data?.success) {
        alert(res?.data?.results?.message);
        console.log("✅ Exam added successfully:", res?.data);
        // alert("Exam created successfully!");

      }

    } catch (err) {
      console.error("❌ Error creating exam:", err);
      alert("Something went wrong while creating the exam.");
    }
  };

  console.log('====== showExamEditModal : ', showExamEditModal)
  const btnRef = useRef(null);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen relative">
      {/* Loader overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
          <LoaderWIthoutBgBlurr />
        </div>
      )}

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Exam Management</h1>
        <p className="text-sm text-gray-500">Manage and monitor all examinations</p>
      </div>

      {/* Filters and actions */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
        <div className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-3">
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

          <div className="col-span-4">
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

          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Type</label>
            <select
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-medium"
            >
              <option value="all">All Subjects</option>
              <option value="mandatory">Mandatory Only</option>
              <option value="optional">Optional Only</option>
            </select>
          </div>
          {/* 
          <div className="col-span-2">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                {viewMode === 'cards' ? '📋' : '🎴'}
                {viewMode === 'cards' ? 'Table' : 'Cards'}
              </button>
            </div>
          </div> */}

          <div className="col-span-2 flex">
            <button
              onClick={() => setShowExamModal(true)}
              className="cursor-pointer w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Exam
            </button>
            <button
              onClick={() => setShowExamEditModal(true)}
              className="cursor-pointer w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
            >
              <Edit className="w-5 h-5" />
              Edit  Exam
            </button>
          </div>
        </div>
      </div>

      {/* Exam Cards */}
      {!loading && (
        <>
          {filteredExams.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-white">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No exams found</h3>
              <p className="text-sm text-gray-500">Start by creating your first exam.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredExams.map((exam) => (
                <div key={exam.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-t-xl" />

                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-5 w-5 text-gray-500" />
                          <h3 className="text-xl font-bold text-gray-900 leading-tight">{exam.name}</h3>
                        </div>
                        <p className="text-xs text-gray-400 font-medium mb-3">ID: {exam.id}</p>

                        <div className="flex items-center text-sm font-medium text-gray-600 mb-3">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span>Standard: {exam.standard?.name}</span>
                        </div>

                        <div className="flex items-center flex-wrap gap-2">
                          <MetricBadge metric={exam.max_marks} icon={AwardIcon} />
                          <MetricBadge metric={exam.pass_marks} icon={Target} />
                          <MetricBadge metric={exam.no_of_working_days} icon={Clock} />
                        </div>
                      </div>

                      <div
                        className=""
                        ref={activeDropdown === exam.id ? dropdownRef : null}
                      >
                        <button
                          onClick={() => toggleDropdown(exam.id)}
                          className="cursor-pointer p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-500" />
                        </button>

                        {activeDropdown === exam.id && (
                          <div
                            className="relative z-[999] absolute right-0 sm:right-1 top-full mt-2 min-w-[10rem] sm:w-56 max-w-[90vw]
      bg-white rounded-lg shadow-xl border border-gray-200 divide-y divide-gray-100
      animate-fade-in-up overflow-hidden"
                          >
                            <div className="py-1">
                              {exam.options?.map((option, index) => {
                                const IconComponent = getActionIcon(option.action);
                                return (
                                  <button
                                    key={index}
                                    onClick={() => handleActionClick(exam, option)}
                                    className={`cursor-pointer w-full px-4 py-2 text-left flex items-center gap-3 text-sm transition-colors 
                ${option.action === 'delete'
                                        ? 'text-red-600 hover:bg-red-50'
                                        : 'text-gray-700 hover:bg-gray-50'}`}
                                  >
                                    <IconComponent className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">{option.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                  <div className="p-4 sm:p-5 bg-gray-50 rounded-b-2xl border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        {exam.round_off_marks === "1" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                        <span>Round Off</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {exam.take_best_average === "1" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                        <span>Best Average</span>
                      </div>
                    </div>
                    {exam.display_native_ad && (
                      <div className="flex items-center gap-1.5 text-blue-500 font-bold" title="Native Ad Enabled">
                        <Zap className="h-4 w-4" />
                        <span>Ad Enabled</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}



      {showExamModal &&
        <ExamModal
          examFormData={examFormData}
          setExamFormData={setExamFormData}
          setShowExamModal={setShowExamModal}
          onSave={handleSave}
          standards={classes}
          submitExamAdd={submitExamAdd}
        />
      }
      {showExamEditModal &&
        <EditExamForm
          examFormData={examFormData}
          setExamFormData={setExamFormData}
          setShowExamModal={setShowExamModal}
          onSave={handleSave}
          standards={classes}
          submitExamAdd={submitExamAdd}
        />
      }



      {error && (
        <div className="fixed top-4 right-4 flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md shadow-md z-50">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ExamManagement;
