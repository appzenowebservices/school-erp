import React, { useState, useEffect } from 'react';
import {
  Settings,
  Type,
  Layout,
  User,
  FileText,
  Palette,
  Eye,
  Download,
  Save,
  RotateCw,
  Maximize,
  Image as ImageIcon
} from 'lucide-react';




const ReportCardDesigner = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [config, setConfig] = useState({
    // General Settings
    orientation: 'portrait',
    displayResult: true, // Corresponds to 'Display Result' in old settings
    noOfPages: 1, // Corresponds to 'No. of pages' in old settings
    borderColor: '#2563eb',
    hasBorder: true,
    outlineColor: '#1e40af',
    maxMarks: 100, // This is a general max marks, not per subject
    passMarks: 35,
    highestMarksPerSubject: true, // Corresponds to 'Show Highest Marks' in new config

    // Display Names (labels for columns/sections)
    displayNames: {
      maxMarks: 'Max Marks',
      passMarks: 'Pass Marks',
      marksObtained: 'Marks Obtained',
      grade: 'Grade',
      highestMarks: 'Highest Marks',
      remarksHeader: 'Remarks',
      attendanceHeader: 'Attendance',
      total: 'Total',
      percentage: 'Percentage',
      rank: 'Rank',
      absent: 'AB',
      examination: 'Annual Examination 2024-25'
    },

    // Header Style
    reportCardTitle: 'St. Mary\'s High School', // Corresponds to 'Report Card Title'
    examNameFontSize: 24, // Corresponds to 'Title Font Size'
    titleColor: '#1f2937',

    // Student Label (Body Params from old, mixed with Header Style from new)
    displayExam: true, // Corresponds to 'Show Exam'
    examFontSize: 16, // Corresponds to 'Exam Font Size'
    name: true, // Corresponds to 'Show Name'
    studentClass: true, // Corresponds to 'Show Class'
    rollNo: true, // Corresponds to 'Show Roll No.'
    admissionNo: true, // Corresponds to 'Show Admission No.'
    fatherName: true, // Corresponds to 'Show Father\'s Name'
    motherName: true, // Corresponds to 'Show Mother\'s Name'
    dateOfBirth: true, // Corresponds to 'Show Date of Birth'
    image: true, // Corresponds to 'Show Student Image'

    // Body Params
    attendance: true, // Corresponds to 'Show Attendance'
    attendanceDisplayParams: 'Days Present / Total Days', // New: 'Attendance Display Params'
    classRevision: true, // Corresponds to 'Show Class Revision'
    conduct: 'Good', // Corresponds to 'Show Conduct'
    marksPerSubject: true, // Corresponds to 'Show Marks Per Subject'
    gradePerSubject: true, // Corresponds to 'Show Grade Per Subject'
    breakOnSubject: false, // Corresponds to 'Break On Subject'
    showPassFail: true, // Corresponds to 'Show Pass/Fail'
    onlyParentSubjects: false, // Corresponds to 'Only Parent Subjects'
    absentColor: '#ef4444',
    bodyFontSize: 12,
    bodyPadding: 8,
    examParametersFontSize: 14, // Corresponds to 'Exam Parameters Font Size'
    defaultMargin: 10, // Corresponds to 'Default Margin'

    // Body Footer (from old, mixed with Footer Params from new)
    grade: true, // Corresponds to 'Show Grade (Total)'
    total: true, // Corresponds to 'Show Total Marks'
    percentage: true, // Corresponds to 'Show Percentage'
    weightage: false, // Corresponds to 'Show Weightage'
    rank: true, // Corresponds to 'Show Rank'
    giveRankIf: 'above_pass', // Corresponds to 'Give Rank If'
    housePoints: true, // Corresponds to 'Show House Points'
    highestStd: true, // Corresponds to 'Show Highest Per Std.'
    highestClass: true, // Corresponds to 'Show Highest Per Class'
    percentageSubject: true, // Corresponds to 'Show Percentage Per Subject'
    extraCurricularFontSize: 11,
    extraCurricularPadding: 6,

    // Footer Parameters
    extraCurricularSubjects: true, // Added for clarity
    extraCurricularExams: true, // Added for clarity
    isBlankBoxRequired: true,
    blankBoxHeader: 'Additional Remarks',
    blankBoxContent: 'This blank box can be used for any additional notes or specific remarks not covered elsewhere.', // Added content
    isPtmDisplay: true, // Corresponds to 'Is PTM Display'
    ptmValue: 'Next PTM: 15th March 2025',
    remarksSignatureLabelColor: '#374151', // Corresponds to 'Signature Label Color'
    remarksFontSize: 10,
    remarksPadding: 8,
    attendanceFontSize: 10, // Added based on old settings
    attendancePadding: 6, // Added based on old settings
    additionalContent: 'Arjun has shown consistent improvement in all subjects. His dedication to studies is commendable. Keep up the great work!', // Corresponds to 'Additional Content (Remarks)'
    comment: 'Powered by infoEIGHT', // Not directly mapped, but good to keep
    footerImage: false // Corresponds to 'Show Footer Image'
  });

  const [previewMode, setPreviewMode] = useState('desktop');

  const sampleStudent = {
    name: 'Arjun Sharma',
    class: 'X-A',
    rollNo: '15',
    admissionNo: 'SM2023/145',
    fatherName: 'Rajesh Sharma',
    motherName: 'Priya Sharma',
    dob: '15/08/2009',
    photo: 'https://placehold.co/100x100/aabbcc/ffffff?text=Student+Image'
  };

  const sampleSubjects = [
    { name: 'Mathematics', maxMarks: 100, obtained: 5, grade: 'A', highest: 95, passMarks: 35 },
    { name: 'English', maxMarks: 100, obtained: 78, grade: 'B+', highest: 92, passMarks: 35 },
    { name: 'Hindi', maxMarks: 100, obtained: 82, grade: 'A-', highest: 88, passMarks: 35 },
    { name: 'Science', maxMarks: 100, obtained: 91, grade: 'A+', highest: 96, passMarks: 35 },
    { name: 'Social Studies', maxMarks: 100, obtained: 76, grade: 'B+', highest: 89, passMarks: 35 },
  ];

  const tabs = [
    { id: 'general', label: 'General Settings', icon: Settings },
    { id: 'display', label: 'Display Names', icon: Type },
    { id: 'header', label: 'Header Style', icon: Layout },
    { id: 'student', label: 'Student Details', icon: User },
    { id: 'body', label: 'Body Settings', icon: FileText },
    { id: 'footer', label: 'Footer Settings', icon: Palette }
  ];

  // Utility function to update nested state
  const updateConfig = (path, value) => {
    setConfig(prev => {
      const newConfig = { ...prev };
      const keys = path.split('.');
      let current = newConfig;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
  };

  // Custom UI components for settings panel
  const ColorPicker = ({ label, value, onChange, className = "" }) => (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const NumberInput = ({ label, value, onChange, min = 0, max = 100, className = "" }) => (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  const TextInput = ({ label, value, onChange, className = "" }) => (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  const ToggleSwitch = ({ label, checked, onChange, className = "" }) => (
    <div className={`flex items-center justify-between ${className}`}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-200'
          }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
      </button>
    </div>
  );

  const SelectInput = ({ label, value, onChange, options, className = "" }) => (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  // Renders the content for each configuration tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <SelectInput
                label="Orientation"
                value={config.orientation}
                onChange={(value) => updateConfig('orientation', value)}
                options={[
                  { value: 'portrait', label: 'Portrait' },
                  { value: 'landscape', label: 'Landscape' }
                ]}
              />
              <NumberInput
                label="Number of Pages"
                value={config.noOfPages}
                onChange={(value) => updateConfig('noOfPages', Number(value))}
                min={1}
                max={5}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                label="Border Color"
                value={config.borderColor}
                onChange={(value) => updateConfig('borderColor', value)}
              />
              <ColorPicker
                label="Outline Color"
                value={config.outlineColor}
                onChange={(value) => updateConfig('outlineColor', value)}
              />
            </div>

            <ToggleSwitch
              label="Has Border"
              checked={config.hasBorder}
              onChange={(value) => updateConfig('hasBorder', value)}
            />
            <ToggleSwitch
              label="Display Result"
              checked={config.displayResult}
              onChange={(value) => updateConfig('displayResult', value)}
            />

            <div className="grid grid-cols-3 gap-4">
              <NumberInput
                label="Max Marks (Overall)"
                value={config.maxMarks}
                onChange={(value) => updateConfig('maxMarks', value)}
                max={1000}
              />
              <NumberInput
                label="Pass Marks (Overall)"
                value={config.passMarks}
                onChange={(value) => updateConfig('passMarks', value)}
                max={100}
              />
              <ToggleSwitch
                label="Show Highest Marks Per Subject"
                checked={config.highestMarksPerSubject}
                onChange={(value) => updateConfig('highestMarksPerSubject', value)}
                className="pt-6"
              />
            </div>
          </div>
        );

      case 'display':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Customize Display Labels</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(config.displayNames).map(([key, value]) => (
                <TextInput
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  value={value}
                  onChange={(newValue) => updateConfig(`displayNames.${key}`, newValue)}
                />
              ))}
            </div>
          </div>
        );

      case 'header':
        return (
          <div className="space-y-6">
            <TextInput
              label="Report Card Title"
              value={config.reportCardTitle}
              onChange={(value) => updateConfig('reportCardTitle', value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <NumberInput
                label="Title Font Size (px)"
                value={config.examNameFontSize} // Mapped to examNameFontSize
                onChange={(value) => updateConfig('examNameFontSize', value)}
                min={12}
                max={48}
              />
              <ColorPicker
                label="Title Color"
                value={config.titleColor}
                onChange={(value) => updateConfig('titleColor', value)}
              />
            </div>
            <TextInput
              label="Bottom Head / Student Label (Exam Name)"
              value={config.displayNames.examination}
              onChange={(value) => updateConfig('displayNames.examination', value)}
            />
            <ToggleSwitch
              label="Display Exam Name"
              checked={config.displayExam}
              onChange={(value) => updateConfig('displayExam', value)}
            />
          </div>
        );

      case 'student':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <ToggleSwitch
                label="Display Student Name"
                checked={config.name}
                onChange={(value) => updateConfig('name', value)}
              />
              <ToggleSwitch
                label="Display Class"
                checked={config.studentClass}
                onChange={(value) => updateConfig('studentClass', value)}
              />
              <ToggleSwitch
                label="Display Roll No."
                checked={config.rollNo}
                onChange={(value) => updateConfig('rollNo', value)}
              />
              <ToggleSwitch
                label="Display Admission No."
                checked={config.admissionNo}
                onChange={(value) => updateConfig('admissionNo', value)}
              />
              <ToggleSwitch
                label="Display Father's Name"
                checked={config.fatherName}
                onChange={(value) => updateConfig('fatherName', value)}
              />
              <ToggleSwitch
                label="Display Mother's Name"
                checked={config.motherName}
                onChange={(value) => updateConfig('motherName', value)}
              />
              <ToggleSwitch
                label="Display Date of Birth"
                checked={config.dateOfBirth}
                onChange={(value) => updateConfig('dateOfBirth', value)}
              />
              <ToggleSwitch
                label="Display Student Image"
                checked={config.image}
                onChange={(value) => updateConfig('image', value)}
              />
            </div>
          </div>
        );

      case 'body':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <ToggleSwitch
                label="Display Attendance"
                checked={config.attendance}
                onChange={(value) => updateConfig('attendance', value)}
              />
              <TextInput
                label="Attendance Display Params"
                value={config.attendanceDisplayParams}
                onChange={(value) => updateConfig('attendanceDisplayParams', value)}
              />
              <ToggleSwitch
                label="Display Class Revision"
                checked={config.classRevision}
                onChange={(value) => updateConfig('classRevision', value)}
              />
              <TextInput
                label="Conduct"
                value={config.conduct}
                onChange={(value) => updateConfig('conduct', value)}
              />
              <ToggleSwitch
                label="Display Marks Per Subject"
                checked={config.marksPerSubject}
                onChange={(value) => updateConfig('marksPerSubject', value)}
              />
              <ToggleSwitch
                label="Display Grade Per Subject"
                checked={config.gradePerSubject}
                onChange={(value) => updateConfig('gradePerSubject', value)}
              />
              <ToggleSwitch
                label="Break On Subject"
                checked={config.breakOnSubject}
                onChange={(value) => updateConfig('breakOnSubject', value)}
              />
              <ToggleSwitch
                label="Show Pass / Fail"
                checked={config.showPassFail}
                onChange={(value) => updateConfig('showPassFail', value)}
              />
              <ToggleSwitch
                label="Only Parent Subjects"
                checked={config.onlyParentSubjects}
                onChange={(value) => updateConfig('onlyParentSubjects', value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <ColorPicker
                label="Absent Color"
                value={config.absentColor}
                onChange={(value) => updateConfig('absentColor', value)}
              />
              <NumberInput
                label="Body Font Size (px)"
                value={config.bodyFontSize}
                onChange={(value) => updateConfig('bodyFontSize', value)}
                min={8}
                max={18}
              />
              <NumberInput
                label="Body Padding (px)"
                value={config.bodyPadding}
                onChange={(value) => updateConfig('bodyPadding', value)}
                min={0}
                max={20}
              />
              <NumberInput
                label="Exam Parameters Font Size (px)"
                value={config.examParametersFontSize}
                onChange={(value) => updateConfig('examParametersFontSize', value)}
                min={10}
                max={24}
              />
              <NumberInput
                label="Default Margin (px)"
                value={config.defaultMargin}
                onChange={(value) => updateConfig('defaultMargin', value)}
                min={0}
                max={50}
              />
            </div>
          </div>
        );

      case 'footer':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <ToggleSwitch
                label="Display Grade (Total)"
                checked={config.grade}
                onChange={(value) => updateConfig('grade', value)}
              />
              <ToggleSwitch
                label="Display Total Marks"
                checked={config.total}
                onChange={(value) => updateConfig('total', value)}
              />
              <ToggleSwitch
                label="Display Percentage"
                checked={config.percentage}
                onChange={(value) => updateConfig('percentage', value)}
              />
              <ToggleSwitch
                label="Display Weightage"
                checked={config.weightage}
                onChange={(value) => updateConfig('weightage', value)}
              />
              <ToggleSwitch
                label="Display Rank"
                checked={config.rank}
                onChange={(value) => updateConfig('rank', value)}
              />
              <SelectInput
                label="Give Rank If"
                value={config.giveRankIf}
                onChange={(value) => updateConfig('giveRankIf', value)}
                options={[
                  { value: 'highest_std', label: 'Highest (%) / Std.' },
                  { value: 'highest_class', label: 'Highest (%) / Class' },
                  { value: 'percentage_subject', label: 'Percentage / Subject' },
                ]}
              />
              <ToggleSwitch
                label="Display House Points"
                checked={config.housePoints}
                onChange={(value) => updateConfig('housePoints', value)}
              />
              <ToggleSwitch
                label="Display Extra Curricular Subjects"
                checked={config.extraCurricularSubjects}
                onChange={(value) => updateConfig('extraCurricularSubjects', value)}
              />
              <ToggleSwitch
                label="Display Extra Curricular Exams"
                checked={config.extraCurricularExams}
                onChange={(value) => updateConfig('extraCurricularExams', value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <NumberInput
                label="Extra Curricular Font Size (px)"
                value={config.extraCurricularFontSize}
                onChange={(value) => updateConfig('extraCurricularFontSize', value)}
                min={8}
                max={16}
              />
              <NumberInput
                label="Extra Curricular Padding (px)"
                value={config.extraCurricularPadding}
                onChange={(value) => updateConfig('extraCurricularPadding', value)}
                min={0}
                max={20}
              />
            </div>

            <ToggleSwitch
              label="Is Blank Box Required"
              checked={config.isBlankBoxRequired}
              onChange={(value) => updateConfig('isBlankBoxRequired', value)}
            />
            {config.isBlankBoxRequired && (
              <>
                <TextInput
                  label="Blank Box Header"
                  value={config.blankBoxHeader}
                  onChange={(value) => updateConfig('blankBoxHeader', value)}
                />
                <TextInput
                  label="Blank Box Content"
                  value={config.blankBoxContent}
                  onChange={(value) => updateConfig('blankBoxContent', value)}
                />
              </>
            )}

            <ToggleSwitch
              label="Is PTM Display"
              checked={config.isPtmDisplay}
              onChange={(value) => updateConfig('isPtmDisplay', value)}
            />
            <TextInput
              label="PTM Value"
              value={config.ptmValue}
              onChange={(value) => updateConfig('ptmValue', value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                label="Remarks Signature Label Color"
                value={config.remarksSignatureLabelColor}
                onChange={(value) => updateConfig('remarksSignatureLabelColor', value)}
              />
              <NumberInput
                label="Remarks Font Size (px)"
                value={config.remarksFontSize}
                onChange={(value) => updateConfig('remarksFontSize', value)}
                min={8}
                max={16}
              />
              <NumberInput
                label="Remarks Padding (px)"
                value={config.remarksPadding}
                onChange={(value) => updateConfig('remarksPadding', value)}
                min={0}
                max={20}
              />
              <NumberInput
                label="Attendance Font Size (px)"
                value={config.attendanceFontSize}
                onChange={(value) => updateConfig('attendanceFontSize', value)}
                min={8}
                max={16}
              />
              <NumberInput
                label="Attendance Padding (px)"
                value={config.attendancePadding}
                onChange={(value) => updateConfig('attendancePadding', value)}
                min={0}
                max={20}
              />
            </div>

            <TextInput
              label="Additional Content (Remarks)"
              value={config.additionalContent}
              onChange={(value) => updateConfig('additionalContent', value)}
            />
            <TextInput
              label="Comment (Footer)"
              value={config.comment}
              onChange={(value) => updateConfig('comment', value)}
            />
            <ToggleSwitch
              label="Display Footer Image"
              checked={config.footerImage}
              onChange={(value) => updateConfig('footerImage', value)}
            />
          </div>
        );

      default:
        return <div>Select a tab to configure</div>;
    }
  };

  const calculateTotals = () => {
    const totalMarks = sampleSubjects.reduce((sum, subject) => sum + subject.obtained, 0);
    const totalMaxMarks = sampleSubjects.reduce((sum, subject) => sum + subject.maxMarks, 0);
    const percentage = totalMaxMarks > 0 ? ((totalMarks / totalMaxMarks) * 100).toFixed(2) : 0;
    return { totalMarks, totalMaxMarks, percentage };
  };

  const { totalMarks, totalMaxMarks, percentage } = calculateTotals();

  return (
    <div

      className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* <div>
              <h1 className="text-2xl font-bold text-gray-900">Configure Report Card </h1>
              <p className="text-gray-600">Design &configure report cards with real-time preview</p>
            </div> */}
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${previewMode === 'desktop' ? 'bg-white shadow-sm' : 'text-gray-600'
                    }`}
                >
                  <Maximize className="w-4 h-4 inline mr-1" />
                  Preview
                </button>
                <button
                  onClick={() => setPreviewMode('print')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${previewMode === 'print' ? 'bg-white shadow-sm' : 'text-gray-600'
                    }`}
                >
                  <FileText className="w-4 h-4 inline mr-1" />
                  Print
                </button>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Template
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full  mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Configuration Panel */}
          <div className="col-span-4 bg-white  rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Configuration</h2>
            </div>

            {/* Tabs */}
            <div className="border-b">
              <div className="flex flex-wrap">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-0 px-3 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <tab.icon className="w-4 h-4 mx-auto mb-1" />
                    <div className="truncate">{tab.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6  overflow-y-auto">
              {renderTabContent()}
            </div>
          </div>

          {/* Live Preview */}
          <div

            className="col-span-8">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </h2>
                <div className="text-sm text-gray-500">
                  Updates in real-time as you configure
                </div>
              </div>

              <div className="p-4">
                <div

                  className={`mx-auto bg-white transition-all duration-300 ${config.orientation === 'portrait' ? 'w-full max-w-2xl' : 'w-full'
                    } ${previewMode === 'print' ? 'shadow-lg' : 'shadow-sm'}`}
                  style={{
                    backgroundImage: "url('/bg/appbackground@2x.png')",

                    border: config.hasBorder ? `3px solid ${config.borderColor}` : 'none',
                    outline: config.hasBorder ? `1px solid ${config.outlineColor}` : 'none',
                    outlineOffset: config.hasBorder ? '4px' : '0', // Added outlineOffset
                    minHeight: config.orientation === 'portrait' ? '800px' : '600px',
                    padding: `${config.defaultMargin}px`, // Apply default margin as padding
                    fontFamily: 'Inter, sans-serif' // Ensure font is applied to preview
                  }}>

                  {/* Header */}
                  <div className="text-center p-6 border-b border-gray-200">
                    <h1
                      className="font-bold mb-2"
                      style={{
                        fontSize: `${config.examNameFontSize}px`, // Using examNameFontSize for title
                        color: config.titleColor
                      }}
                    >
                      {config.reportCardTitle}
                    </h1>
                    {config.displayExam && (
                      <div
                        className="font-semibold text-gray-700"
                        style={{ fontSize: `${config.examFontSize}px` }}
                      >
                        {config.displayNames.examination}
                      </div>
                    )}
                  </div>

                  {/* Student Information */}
                  <div className="p-6 border-b border-gray-200" style={{ fontSize: `${config.bodyFontSize}px` }}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-2">
                        {config.name && (
                          <div><strong>Name:</strong> {sampleStudent.name}</div>
                        )}
                        {config.studentClass && (
                          <div><strong>Class:</strong> {sampleStudent.class}</div>
                        )}
                        {config.rollNo && (
                          <div><strong>Roll No:</strong> {sampleStudent.rollNo}</div>
                        )}
                        {config.admissionNo && (
                          <div><strong>Admission No:</strong> {sampleStudent.admissionNo}</div>
                        )}
                        {config.fatherName && (
                          <div><strong>Father's Name:</strong> {sampleStudent.fatherName}</div>
                        )}
                        {config.motherName && (
                          <div><strong>Mother's Name:</strong> {sampleStudent.motherName}</div>
                        )}
                        {config.dateOfBirth && (
                          <div><strong>Date of Birth:</strong> {sampleStudent.dob}</div>
                        )}
                      </div>
                      {config.image && (
                        <div className="ml-6">
                          <img
                            src={sampleStudent.photo}
                            alt="Student"
                            className="w-20 h-24 object-cover border border-gray-300 rounded"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x96/aabbcc/ffffff?text=No+Image"; }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Marks Table */}
                  <div className="p-6" style={{ padding: `${config.bodyPadding}px` }}>
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 p-2 text-left">Subject</th>
                          {config.marksPerSubject && (
                            <>
                              <th className="border border-gray-300 p-2 text-center">{config.displayNames.maxMarks}</th>
                              <th className="border border-gray-300 p-2 text-center">{config.displayNames.marksObtained}</th>
                            </>
                          )}
                          {config.gradePerSubject && (
                            <th className="border border-gray-300 p-2 text-center">{config.displayNames.grade}</th>
                          )}
                          {config.highestMarksPerSubject && (
                            <th className="border border-gray-300 p-2 text-center">{config.displayNames.highestMarks}</th>
                          )}
                          {config.showPassFail && (
                            <th className="border border-gray-300 p-2 text-center">Status</th>
                          )}
                        </tr>
                      </thead>
                      <tbody style={{ fontSize: `${config.bodyFontSize}px` }}>
                        {sampleSubjects.map((subject, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 p-2">{subject.name}</td>
                            {config.marksPerSubject && (
                              <>
                                <td className="border border-gray-300 p-2 text-center">{subject.maxMarks}</td>
                                <td className="border border-gray-300 p-2 text-center">{subject.obtained}</td>
                              </>
                            )}
                            {config.gradePerSubject && (
                              <td className="border border-gray-300 p-2 text-center font-semibold">{subject.grade}</td>
                            )}
                            {config.highestMarksPerSubject && (
                              <td className="border border-gray-300 p-2 text-center">{subject.highest}</td>
                            )}
                            {config.showPassFail && (
                              <td className="border border-gray-300 p-2 text-center" style={{ color: subject.obtained >= subject.passMarks ? 'green' : config.absentColor }}>
                                {subject.obtained >= subject.passMarks ? 'Pass' : 'Fail'}
                              </td>
                            )}
                          </tr>
                        ))}

                        {/* Totals Row */}
                        <tr className="bg-blue-50 font-semibold">
                          <td className="border border-gray-300 p-2">{config.displayNames.total}</td>
                          {config.marksPerSubject && (
                            <>
                              <td className="border border-gray-300 p-2 text-center">{totalMaxMarks}</td>
                              <td className="border border-gray-300 p-2 text-center">{totalMarks}</td>
                            </>
                          )}
                          {/* {config.grade && ( // Use config.grade for overall grade display
                            <td className="border border-gray-300 p-2 text-center">A</td>
                          {config.highestMarksPerSubject && (
                            <td className="border border-gray-300 p-2 text-center">-</td>
                          )}
                          {config.showPassFail && (
                            <td className="border border-gray-300 p-2 text-center">
                              {totalMarks >= (totalMaxMarks * config.passMarks / 100) ? 'PASS' : 'FAIL'}
                            </td>
                          )} */}
                        </tr>
                      </tbody>
                    </table>

                    {/* Summary */}
                    <div className="mt-6 grid grid-cols-2 gap-6" style={{ fontSize: `${config.bodyFontSize}px` }}>
                      <div className="space-y-2">
                        {config.percentage && (
                          <div><strong>{config.displayNames.percentage}:</strong> {percentage}%</div>
                        )}
                        {config.rank && (
                          <div><strong>{config.displayNames.rank}:</strong> 3rd</div>
                        )}
                        {config.attendance && (
                          <div style={{ fontSize: `${config.attendanceFontSize}px`, padding: `${config.attendancePadding}px` }}>
                            <strong>{config.displayNames.attendanceHeader}:</strong> 95% ({config.attendanceDisplayParams})
                          </div>
                        )}
                        {config.housePoints && (
                          <div><strong>House Points:</strong> 85</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        {config.displayResult && (
                          <div><strong>Result:</strong> <span className="text-green-600 font-semibold">PASS</span></div>
                        )}
                        {config.classRevision && (
                          <div><strong>Class Revision:</strong> Promoted to XI</div>
                        )}
                        <div><strong>Conduct:</strong> {config.conduct}</div>
                      </div>
                    </div>

                    {/* Extra Curricular */}
                    {config.showExtraCurricular && ( // Use combined showExtraCurricular
                      <div className="mt-6">
                        <h3 className="font-semibold mb-3 text-gray-800">Extra Curricular Activities</h3>
                        <div
                          className="space-y-1"
                          style={{
                            fontSize: `${config.extraCurricularFontSize}px`,
                            padding: `${config.extraCurricularPadding}px`
                          }}
                        >
                          {config.extraCurricularSubjects && <div>• Sports: Excellent in Football</div>}
                          {config.extraCurricularExams && <div>• Art: Good in Drawing (Annual Art Competition)</div>}
                          <div>• Music: Participated in School Choir</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-200 p-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        {true && ( // Assuming showRemarks controls this section
                          <div
                            style={{
                              fontSize: `${config.remarksFontSize}px`,
                              padding: `${config.remarksPadding}px`
                            }}
                          >
                            <strong>{config.displayNames.remarksHeader}:</strong>
                            <div className="mt-2 p-3 bg-gray-50 rounded border min-h-16">
                              {config.additionalContent || 'Arjun has shown consistent improvement in all subjects. His dedication to studies is commendable. Keep up the great work!'}
                            </div>
                          </div>
                        )}

                        {config.isBlankBoxRequired && (
                          <div className="mt-6">
                            <h4 className="font-semibold mb-2">{config.blankBoxHeader}</h4>
                            <div className="p-3 bg-gray-50 rounded border min-h-24">
                              {config.blankBoxContent}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end justify-end text-right space-y-4">
                        {config.isPtmDisplay && (
                          <div className="text-sm">
                            <strong>PTM:</strong> {config.ptmValue}
                          </div>
                        )}
                        <div style={{ color: config.remarksSignatureLabelColor, fontSize: `${config.remarksFontSize}px` }}>
                          Principal's Signature: _________________________
                        </div>
                        {config.footerImage && (
                          <img
                            src="https://placehold.co/150x50/cccccc/000000?text=School+Logo"
                            alt="School Logo"
                            className="mt-4"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x50/cccccc/000000?text=Logo+Error"; }}
                          />
                        )}
                      </div>
                    </div>
                    {config.comment && ( // Display comment if available
                      <div className="text-center text-xs text-gray-500 mt-4">
                        {config.comment}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default ReportCardDesigner;
