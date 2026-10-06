import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Award,
  TrendingUp,
  Star,
  Search,
  Filter,
  Download,
  Upload,
  Copy,
  Eye,
  Settings,
  X,
  Save,
  AlertCircle,
  Check,
  Zap,
  Target,
  BarChart3,
  Palette
} from 'lucide-react';
import { getGradesList } from '../../api/grades';

const GradesManagement = ({ grades }) => {


console.log('grades ===',grades );


  const [selectedGradeSystem, setSelectedGradeSystem] = useState('cbse-standard');
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showSystemModal, setShowSystemModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(null);

  // Grade Systems
  const gradeSystems = {
    'cbse-standard': {
      name: 'CBSE Standard Grading',
      description: 'Official CBSE grading system with 9-point scale',
      color: '#3b82f6',
      icon: '🏛️',
      totalGrades: 9
    },
    'percentage-based': {
      name: 'Percentage Based',
      description: 'Traditional percentage-based grading system',
      color: '#10b981',
      icon: '📊',
      totalGrades: 5
    },
    'international': {
      name: 'International (A-F)',
      description: 'International standard A to F grading',
      color: '#8b5cf6',
      icon: '🌍',
      totalGrades: 6
    },
    'custom-school': {
      name: 'Custom School System',
      description: 'School-specific custom grading criteria',
      color: '#f59e0b',
      icon: '⭐',
      totalGrades: 7
    }
  };

  // Sample grades data
  const gradesBySystem = {
    'cbse-standard': [
      {
        id: 1,
        name: 'A1',
        range: '91-100',
        displayRange: '91% - 100%',
        pattern: 'excellent',
        description: 'Outstanding Performance',
        color: '#10b981',
        points: 10,
        status: 'active'
      },
      {
        id: 2,
        name: 'A2',
        range: '81-90',
        displayRange: '81% - 90%',
        pattern: 'very-good',
        description: 'Excellent Performance',
        color: '#059669',
        points: 9,
        status: 'active'
      },
      {
        id: 3,
        name: 'B1',
        range: '71-80',
        displayRange: '71% - 80%',
        pattern: 'good',
        description: 'Very Good Performance',
        color: '#3b82f6',
        points: 8,
        status: 'active'
      },
      {
        id: 4,
        name: 'B2',
        range: '61-70',
        displayRange: '61% - 70%',
        pattern: 'satisfactory',
        description: 'Good Performance',
        color: '#6366f1',
        points: 7,
        status: 'active'
      },
      {
        id: 5,
        name: 'C1',
        range: '51-60',
        displayRange: '51% - 60%',
        pattern: 'average',
        description: 'Satisfactory Performance',
        color: '#f59e0b',
        points: 6,
        status: 'active'
      },
      {
        id: 6,
        name: 'C2',
        range: '41-50',
        displayRange: '41% - 50%',
        pattern: 'below-average',
        description: 'Acceptable Performance',
        color: '#f97316',
        points: 5,
        status: 'active'
      },
      {
        id: 7,
        name: 'D',
        range: '33-40',
        displayRange: '33% - 40%',
        pattern: 'needs-improvement',
        description: 'Needs Improvement',
        color: '#ef4444',
        points: 4,
        status: 'active'
      },
      {
        id: 8,
        name: 'E',
        range: '21-32',
        displayRange: '21% - 32%',
        pattern: 'unsatisfactory',
        description: 'Unsatisfactory Performance',
        color: '#dc2626',
        points: 0,
        status: 'active'
      },
      {
        id: 9,
        name: 'F',
        range: '0-20',
        displayRange: 'Below 21%',
        pattern: 'fail',
        description: 'Needs Significant Improvement',
        color: '#991b1b',
        points: 0,
        status: 'active'
      }
    ],
    'percentage-based': [
      { id: 10, name: 'Distinction', range: '75-100', displayRange: '75% and above', pattern: 'excellent', description: 'Exceptional Achievement', color: '#10b981', points: 10, status: 'active' },
      { id: 11, name: 'First Class', range: '60-74', displayRange: '60% - 74%', pattern: 'very-good', description: 'First Class Performance', color: '#3b82f6', points: 8, status: 'active' },
      { id: 12, name: 'Second Class', range: '50-59', displayRange: '50% - 59%', pattern: 'good', description: 'Second Class Performance', color: '#f59e0b', points: 6, status: 'active' },
      { id: 13, name: 'Third Class', range: '35-49', displayRange: '35% - 49%', pattern: 'satisfactory', description: 'Third Class Performance', color: '#f97316', points: 4, status: 'active' },
      { id: 14, name: 'Fail', range: '0-34', displayRange: 'Below 35%', pattern: 'fail', description: 'Below Passing Grade', color: '#ef4444', points: 0, status: 'active' }
    ]
  };

  const currentGrades = (grades || []).filter(grade =>
    grade.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPatternIcon = (pattern) => {
    const icons = {
      'excellent': '🏆',
      'very-good': '⭐',
      'good': '👍',
      'satisfactory': '✅',
      'average': '📊',
      'below-average': '📉',
      'needs-improvement': '⚠️',
      'unsatisfactory': '❌',
      'fail': '🚫'
    };
    return icons[pattern] || '📋';
  };

  const GradeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            {editingGrade ? 'Edit Grade' : 'Add New Grade'}
          </h2>
          <button
            onClick={() => {
              setShowGradeModal(false);
              setEditingGrade(null);
            }}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Grade Name & Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., A1, Distinction"
                defaultValue={editingGrade?.name}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  defaultValue={editingGrade?.color || '#3b82f6'}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  defaultValue={editingGrade?.color || '#3b82f6'}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Range Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Percentage Range</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 91-100"
                defaultValue={editingGrade?.range}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Range</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 91% - 100%"
                defaultValue={editingGrade?.displayRange}
              />
            </div>
          </div>

          {/* Pattern & Points */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Performance Pattern</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                defaultValue={editingGrade?.pattern}
              >
                <option value="excellent">Excellent</option>
                <option value="very-good">Very Good</option>
                <option value="good">Good</option>
                <option value="satisfactory">Satisfactory</option>
                <option value="average">Average</option>
                <option value="below-average">Below Average</option>
                <option value="needs-improvement">Needs Improvement</option>
                <option value="unsatisfactory">Unsatisfactory</option>
                <option value="fail">Fail</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade Points</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0-10"
                min="0"
                max="10"
                defaultValue={editingGrade?.points}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="3"
              placeholder="Describe what this grade represents..."
              defaultValue={editingGrade?.description}
            />
          </div>

          {/* Grade Preview */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: editingGrade?.color || '#3b82f6' }}>
                {editingGrade?.name || 'A+'}
              </div>
              <div>
                <div className="font-medium text-gray-900">{editingGrade?.name || 'Grade Name'}</div>
                <div className="text-sm text-gray-600">{editingGrade?.displayRange || 'Display Range'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t mt-6">
          <button
            onClick={() => {
              setShowGradeModal(false);
              setEditingGrade(null);
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
            <Save className="w-4 h-4" />
            {editingGrade ? 'Update Grade' : 'Create Grade'}
          </button>
        </div>
      </div>
    </div>
  );

  const GradeSystemModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Create New Grade System
          </h2>
          <button
            onClick={() => setShowSystemModal(false)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">System Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., IB Grading System"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">System Icon</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="🎓"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Describe this grading system..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
              <input
                type="color"
                defaultValue="#3b82f6"
                className="w-full h-10 rounded border border-gray-300 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Grades</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5"
                min="3"
                max="15"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t mt-6">
          <button
            onClick={() => setShowSystemModal(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Create System
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className=" bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Award className="w-7 h-7 text-purple-600" />
                Grades Management
              </h1>
              <p className="text-gray-600">Design and manage grading systems with visual excellence</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSystemModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New System
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Grade System Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Grading System</h2>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(gradeSystems).map(([key, system]) => (
              <div
                key={key}
                onClick={() => setSelectedGradeSystem(key)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${selectedGradeSystem === key
                  ? 'border-purple-500 bg-purple-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">{system.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{system.name}</h3>
                    <p className="text-xs text-gray-600">{system.totalGrades} grades</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{system.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600" />
              {gradeSystems[selectedGradeSystem].name}
            </h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search grades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                />
              </div>
              <button
                onClick={() => setShowGradeModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Grade
              </button>
            </div>
          </div>

          {/* Grade Statistics */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Total Grades</span>
              </div>
              <div className="text-2xl font-bold text-green-900">{currentGrades.length}</div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Active Grades</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">{currentGrades.filter(g => g.status === 'active').length}</div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Max Points</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">{Math.max(...currentGrades.map(g => g.points))}</div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">Avg Points</span>
              </div>
              <div className="text-2xl font-bold text-orange-900">
                {(currentGrades.reduce((sum, g) => sum + g.points, 0) / currentGrades.length).toFixed(1)}
              </div>
            </div>
          </div>

        </div>

        {/* Grades Display */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Grade Breakdown</h3>
            <p className="text-gray-600">Visual representation of your grading system</p>
          </div>

          {/* ====== Card_1  ============================================================================== */}

          {/* <div className="p-4 sm:p-6">
            <div className="grid gap-3 sm:gap-4">
              {grades.map((grade, index) => (
                <div
                  key={grade.id}
                  onClick={() => setSelectedGrade(grade)}
                  className={`group relative flex items-center justify-between bg-white rounded-xl border-2 p-4 sm:p-5 cursor-pointer transition-all duration-200 ease-in-out hover:shadow-md hover:border-purple-300 ${selectedGrade?.id === grade.id ? 'border-purple-500 shadow-lg' : 'border-gray-200'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg flex items-center justify-center text-white font-extrabold text-lg sm:text-xl shadow-inner"
                      style={{
                        backgroundColor: grade.background_color ? grade.background_color : "#171a20ff",
                        color: grade.color ? grade.color : "#f3f6fdff",
                      }}
                    >
                      {grade.name}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg sm:text-xl font-bold text-gray-900">{grade.name}</h4>
                        <span className="text-lg">{getPatternIcon(grade.pattern)}</span>
                        <div className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                          {grade.point || 'N/A'} points
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium truncate max-w-xs">{grade.description}</p>
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 font-medium mt-1">
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          Range: {grade.display_range}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          Pattern: {grade.pattern?.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2 transition-opacity duration-200 ease-in-out opacity-0 group-hover:opacity-100">
                    {grade.options?.map((option) => (
                      <button
                        key={option.action}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(option.action, grade);
                        }}
                        title={option.label}
                        className={`p-1.5 sm:p-2 rounded-md transition-colors ${option.action === 'edit'
                          ? 'text-blue-500 hover:bg-blue-50'
                          : option.action === 'delete'
                            ? 'text-red-500 hover:bg-red-50'
                            : 'text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        {option.action === 'edit' && <Edit2 className="w-4 h-4" />}
                        {option.action === 'delete' && <Trash2 className="w-4 h-4" />}
                        {option.action === 'copy' && <Copy className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>

                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* ====== Card_2  ============================================================================== */}


          <div className="p-4 sm:p-6 h-450 overflow-y-auto">
            <div className="grid gap-3 sm:gap-4">
              {currentGrades.map((grade, index) => (
                <div
                  key={grade.id}
                  onClick={() => setSelectedGrade(grade)}
                  className={`group relative flex items-center justify-between rounded-xl border-2 p-4 sm:p-5 cursor-pointer transition-all duration-200 ease-in-out hover:shadow-lg ${selectedGrade?.id === grade.id ? 'border-purple-500 shadow-xl' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  style={{
                    backgroundColor: grade.background_color,
                    boxShadow: selectedGrade?.id === grade.id ? `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 0 0 2px ${grade.color}` : 'none'
                  }}
                >
                  {/* Priority Indicator */}
                  <div className="absolute -top-3 -right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md z-10"
                    style={{ backgroundColor: grade.color }}>
                    {index + 1}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Grade Badge */}
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg flex items-center justify-center font-extrabold text-lg sm:text-2xl shadow-inner border-2 border-white/20"
                      style={{ backgroundColor: grade.background_color, color: grade.text_color }}
                    >
                      {grade.name}
                    </div>

                    {/* Grade Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-lg sm:text-xl font-bold" style={{ color: grade.text_color }}>{grade.name}</h4>
                        <span className="text-lg" style={{ color: grade.text_color }}>{getPatternIcon(grade.pattern)}</span>
                        <div className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: grade.color, color: 'white' }}>
                          {grade.point || 'N/A'} points
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm font-medium truncate max-w-xs" style={{ color: grade.text_color }}>
                        {grade.description || 'No description provided.'}
                      </p>
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs font-medium mt-1" style={{ color: grade.text_color }}>
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          Range: {grade.display_range}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          Pattern: {grade.pattern?.replace('-', ' ') || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 sm:gap-2 transition-opacity duration-200 ease-in-out opacity-0 group-hover:opacity-100">
                    {grade.options?.map((option) => (
                      <button
                        key={option.action}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(option.action, grade);
                        }}
                        title={option.label}
                        className="p-1.5 sm:p-2 rounded-md transition-colors"
                        style={{
                          color: grade.text_color,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          borderWidth: '1px',
                          backdropFilter: 'blur(5px)',
                        }}
                      >
                        {option.action === 'edit' && <Edit2 className="w-4 h-4" />}
                        {option.action === 'delete' && <Trash2 className="w-4 h-4" />}
                        {option.action === 'copy' && <Copy className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ======  ============================================================================== */}


          {currentGrades.length === 0 && (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No grades found</h3>
              <p className="text-gray-500 mb-4">Start building your grading system</p>
              <button
                onClick={() => setShowGradeModal(true)}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Create First Grade
              </button>
            </div>
          )}
        </div>

        {/* Grade Analytics */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Grade Distribution Analytics
          </h3>
          <div className="grid grid-cols-3 gap-6">
            {/* Distribution Chart */}
            <div className="col-span-2">
              <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                  <p className="text-gray-600">Grade distribution visualization</p>
                  <p className="text-sm text-gray-500">Coming soon with student data</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Highest Grade</span>
                </div>
                <div className="text-lg font-bold text-green-900">
                  {currentGrades.length > 0 ? currentGrades[0].name : 'N/A'}
                </div>
                <div className="text-xs text-green-600">
                  {currentGrades.length > 0 ? currentGrades[0].displayRange : ''}
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">Passing Grade</span>
                </div>
                <div className="text-lg font-bold text-orange-900">
                  {currentGrades.find(g => g.points > 0 && g.pattern !== 'fail')?.name || 'N/A'}
                </div>
                <div className="text-xs text-orange-600">Minimum to pass</div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Grade Span</span>
                </div>
                <div className="text-lg font-bold text-purple-900">
                  {currentGrades.length} levels
                </div>
                <div className="text-xs text-purple-600">Total grade levels</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center group">
              <Copy className="w-6 h-6 mx-auto mb-2 text-blue-600 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-medium">Duplicate System</div>
              <div className="text-xs text-gray-500">Copy to new standard</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center group">
              <Eye className="w-6 h-6 mx-auto mb-2 text-green-600 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-medium">Preview Report</div>
              <div className="text-xs text-gray-500">See how grades appear</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center group">
              <Settings className="w-6 h-6 mx-auto mb-2 text-purple-600 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-medium">Bulk Edit</div>
              <div className="text-xs text-gray-500">Edit multiple grades</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center group">
              <Zap className="w-6 h-6 mx-auto mb-2 text-orange-600 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-medium">Auto Generate</div>
              <div className="text-xs text-gray-500">AI-powered setup</div>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showGradeModal && <GradeModal />}
      {showSystemModal && <GradeSystemModal />}
    </div>
  );
};

export default GradesManagement;