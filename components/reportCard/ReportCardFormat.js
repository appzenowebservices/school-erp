import React, { useState, useEffect } from 'react';

// Shadcn UI components (simulated for demonstration)
// In a real shadcn/ui setup, you would import these from '@/components/ui/...'
// For this example, we'll define simple versions or use direct HTML elements with Tailwind classes.

// Mock Tabs component for demonstration purposes
const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className="w-full">
      {/* TabsList */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-md mb-4 overflow-x-auto whitespace-nowrap">
        {React.Children.map(children, child => {
          if (child.type === TabsList) {
            return React.Children.map(child.props.children, trigger => {
              const value = trigger.props.value;
              return (
                <button
                  key={value}
                  className={`py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${activeTab === value ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  onClick={() => setActiveTab(value)}
                >
                  {trigger.props.children}
                </button>
              );
            });
          }
          return null;
        })}
      </div>

      {/* TabsContent */}
      {React.Children.map(children, child => {
        if (child.type === TabsContent && child.props.value === activeTab) {
          return child;
        }
        return null;
      })}
    </div>
  );
};

const TabsList = ({ children }) => <>{children}</>;
const TabsTrigger = ({ value, children }) => <>{children}</>;
const TabsContent = ({ value, children }) => <div>{children}</div>;

// Mock Input component for demonstration purposes
const Input = ({ type = 'text', value, onChange, placeholder, className = '' }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  />
);

// Mock Checkbox component for demonstration purposes
const Checkbox = ({ checked, onCheckedChange, children, className = '' }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="h-4 w-4 rounded border border-gray-300 text-blue-600 focus:ring-blue-500"
    />
    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {children}
    </label>
  </div>
);

// Mock Select component for demonstration purposes
const Select = ({ value, onValueChange, children }) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {children}
  </select>
);

const SelectTrigger = ({ children }) => <>{children}</>;
const SelectValue = ({ placeholder }) => <option disabled value="">{placeholder}</option>;
const SelectContent = ({ children }) => <>{children}</>;
const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;


// ReportCardPreview Component
const ReportCardPreview = ({ settings }) => {
  const {
    orientation, displayResult, noOfPages, borderColor, hasBorder, outlineColor,
    maxMarks, passMarks, highestMarksPerSubject, displayNames,
    reportCardTitle, bottomHeadStudentLabel, displayExam, examNameFontSize,
    name, studentClass, rollNo, admissionNo, fatherName, motherName, dateOfBirth,
    attendance, attendanceDisplayParams, classRevision, conduct,
    marksPerSubject, gradePerSubject, breakOnSubject, showPassFail, onlyParentSubjects, absentColor,
    bodyFontSize, bodyPadding, examParametersFontSize, defaultMargin,
    grade, total, percentage, weightage, rank, giveRankIf, housePoints,
    highestStd, highestClass, percentageSubject,
    extraCurricularFontSize, extraCurricularPadding,
    extraCurricularSubjects, extraCurricularExams, isBlankBoxRequired, blankBoxHeader, blankBoxContent,
    isPtmDisplay, ptmValue, remarksSignatureLabelColor, remarksFontSize, remarksPadding,
    attendanceFontSize, attendancePadding, additionalContent, comment, footerImage
  } = settings;

  const cardStyle = {

    backgroundImage: "url('/bg/appbackground@2x.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    border: hasBorder ? `1px solid ${borderColor}` : 'none',
    outline: hasBorder ? `1px solid ${outlineColor}` : 'none',
    outlineOffset: hasBorder ? '4px' : '0',
    padding: `${defaultMargin}px`,
    width: orientation === 'portrait' ? '210mm' : '297mm', // A4 dimensions
    height: orientation === 'portrait' ? '297mm' : '210mm',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: 'white',
    fontFamily: 'Inter, sans-serif',
    overflow: 'auto', // Allow scrolling if content overflows
  };

  const headerStyle = {
    marginBottom: '20px',
    textAlign: 'center',
    fontSize: `${examNameFontSize}px`,
  };

  const studentInfoStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '20px',
    fontSize: `${bodyFontSize}px`,
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
    fontSize: `${bodyFontSize}px`,
  };

  const thTdStyle = {
    border: '1px solid #ddd',
    padding: `${bodyPadding}px`,
    textAlign: 'left',
  };

  const remarksStyle = {
    fontSize: `${remarksFontSize}px`,
    padding: `${remarksPadding}px`,
    borderTop: '1px dashed #ccc',
    marginTop: '20px',
    color: remarksSignatureLabelColor,
  };

  const attendanceStyle = {
    fontSize: `${attendanceFontSize}px`,
    padding: `${attendancePadding}px`,
  };

  const blankBoxStyle = {
    border: '1px dashed #ccc',
    padding: '10px',
    marginTop: '20px',
    minHeight: '80px',
  };

  // Mock data for preview
  const mockStudent = {
    name: 'John Doe',
    class: '10th A',
    rollNo: '123',
    admissionNo: 'ADM001',
    fatherName: 'Richard Doe',
    motherName: 'Jane Doe',
    dateOfBirth: '2008-05-15',
    totalAttendance: 180,
    presentAttendance: 170,
  };

  const mockSubjects = [
    { name: 'Mathematics', max: 100, pass: 33, obtained: 5, grade: 'A', highest: 92 },
    { name: 'Science', max: 100, pass: 33, obtained: 78, grade: 'B+', highest: 88 },
    { name: 'English', max: 100, pass: 33, obtained: 90, grade: 'A+', highest: 90 },
    { name: 'Social Studies', max: 100, pass: 33, obtained: 70, grade: 'B', highest: 80 },
  ];

  const mockExtraCurricular = [
    { subject: 'Sports', exam: 'Annual Sports Meet', result: 'Participated' },
    { subject: 'Debate Club', exam: 'Inter-School Debate', result: 'Winner' },
  ];

  const totalMarksObtained = mockSubjects.reduce((sum, s) => sum + s.obtained, 0);
  const totalMaxMarks = mockSubjects.reduce((sum, s) => sum + s.max, 0);
  const calculatedPercentage = totalMaxMarks > 0 ? ((totalMarksObtained / totalMaxMarks) * 100).toFixed(2) : 0;

  return (
    <div className="flex justify-center p-4 bg-gray-50 min-h-screen">
      <div

        className="rounded-lg shadow-xl overflow-hidden" style={cardStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 className="text-2xl font-bold mb-2">{reportCardTitle || 'School Report Card'}</h1>
          {displayExam && <h2 className="text-xl font-semibold" style={{ fontSize: `${examNameFontSize}px` }}>{bottomHeadStudentLabel || 'Annual Examination 2024'}</h2>}
        </div>

        {/* Student Information */}
        <div style={studentInfoStyle}>
          {displayNames && name && <p><strong>Name:</strong> {mockStudent.name}</p>}
          {studentClass && <p><strong>Class:</strong> {mockStudent.class}</p>}
          {rollNo && <p><strong>Roll No:</strong> {mockStudent.rollNo}</p>}
          {admissionNo && <p><strong>Admission No:</strong> {mockStudent.admissionNo}</p>}
          {fatherName && <p><strong>Father's Name:</strong> {mockStudent.fatherName}</p>}
          {motherName && <p><strong>Mother's Name:</strong> {mockStudent.motherName}</p>}
          {dateOfBirth && <p><strong>Date of Birth:</strong> {mockStudent.dateOfBirth}</p>}
          {/* Image placeholder */}
          {settings.image && (
            <div className="col-span-2 text-center mt-4">
              <img
                src="https://placehold.co/100x100/aabbcc/ffffff?text=Student+Image"
                alt="Student"
                className="rounded-full mx-auto"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/aabbcc/ffffff?text=Image+Error"; }}
              />
            </div>
          )}
        </div>

        {/* Marks Table */}
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thTdStyle}>Subject</th>
              {maxMarks && <th style={thTdStyle}>Max Marks</th>}
              {passMarks && <th style={thTdStyle}>Pass Marks</th>}
              {marksPerSubject && <th style={thTdStyle}>Marks Obtained</th>}
              {gradePerSubject && <th style={thTdStyle}>Grade</th>}
              {highestMarksPerSubject && <th style={thTdStyle}>Highest Marks</th>}
              {showPassFail && <th style={thTdStyle}>Status</th>}
            </tr>
          </thead>
          <tbody>
            {mockSubjects.map((subject, index) => (
              <tr key={index}>
                <td style={thTdStyle}>{subject.name}</td>
                {maxMarks && <td style={thTdStyle}>{subject.max}</td>}
                {passMarks && <td style={thTdStyle}>{subject.pass}</td>}
                {marksPerSubject && <td style={thTdStyle}>{subject.obtained}</td>}
                {gradePerSubject && <td style={thTdStyle}>{subject.grade}</td>}
                {highestMarksPerSubject && <td style={thTdStyle}>{subject.highest}</td>}
                {showPassFail && (
                  <td style={{ ...thTdStyle }}>
                    <span
                      className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${subject.obtained >= subject.pass ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {subject.obtained >= subject.pass ? 'Pass' : 'Fail'}
                    </span>
                  </td>
                )}

              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary / Footer Params */}
        <div className="grid grid-cols-2 gap-4" style={{ fontSize: `${bodyFontSize}px` }}>
          {total && <p><strong>Total Marks:</strong> {totalMarksObtained} / {totalMaxMarks}</p>}
          {percentage && <p><strong>Percentage:</strong> {calculatedPercentage}%</p>}
          {rank && <p><strong>Rank:</strong> 1st (Mock)</p>}
          {attendance && (
            <p style={attendanceStyle}>
              <strong>Attendance:</strong> {mockStudent.presentAttendance} / {mockStudent.totalAttendance} (Days Present / Total Days)
            </p>
          )}
          {classRevision && <p><strong>Class Revision:</strong> Good</p>}
          {conduct && <p><strong>Conduct:</strong> Excellent</p>}
          {housePoints && <p><strong>House Points:</strong> 150</p>}
        </div>

        {/* Extra Curricular */}
        {(extraCurricularSubjects || extraCurricularExams) && (
          <div className="mt-4" style={{ fontSize: `${extraCurricularFontSize}px`, padding: `${extraCurricularPadding}px` }}>
            <h3 className="font-semibold mb-2">Extra Curricular Activities:</h3>
            <ul className="list-disc list-inside">
              {mockExtraCurricular.map((activity, index) => (
                <li key={index}>
                  {extraCurricularSubjects && <span>{activity.subject}</span>}
                  {extraCurricularExams && <span> ({activity.exam})</span>}: {activity.result}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Blank Box */}
        {isBlankBoxRequired && (
          <div style={blankBoxStyle}>
            <h4 className="font-semibold mb-1">{blankBoxHeader || 'Teacher Remarks'}</h4>
            <p>{blankBoxContent || 'This space is for additional comments or remarks from the teacher.'}</p>
          </div>
        )}

        {/* PTM Display */}
        {isPtmDisplay && (
          <div className="mt-4">
            <p><strong>PTM Value:</strong> {ptmValue || 'Next PTM: 2025-08-10'}</p>
          </div>
        )}

        {/* Remarks and Signature */}
        <div style={remarksStyle}>
          <p className="mb-2"><strong>Remarks:</strong> {additionalContent || 'A diligent student with good progress. Keep up the hard work!'}</p>
          <p className="text-right mt-4" style={{ color: remarksSignatureLabelColor }}>
            Signature: _________________________
          </p>
          <p className="text-right text-sm">Principal</p>
        </div>

        {/* Footer Image */}
        {footerImage && (
          <div className="text-center mt-4">
            <img
              src="https://placehold.co/150x50/cccccc/000000?text=School+Logo"
              alt="School Logo"
              className="mx-auto"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x50/cccccc/000000?text=Logo+Error"; }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ReportCardSettings Component
const ReportCardSettings = ({ settings, onSettingsChange }) => {
  const handleChange = (key, value) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const Section = ({ title, children }) => (
    <div className="mb-6 p-4 border rounded-lg shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-4 text-blue-700">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-inner overflow-y-auto max-h-[calc(100vh-100px)]">
      <h2 className="text-xl font-bold mb-6 text-blue-800">Report Card Format Settings</h2>

      <Section title="General Settings">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Orientation</label>
          <Select value={settings.orientation} onValueChange={(val) => handleChange('orientation', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select orientation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="portrait">Portrait</SelectItem>
              <SelectItem value="landscape">Landscape</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Checkbox checked={settings.displayResult} onCheckedChange={(val) => handleChange('displayResult', val)}>Display Result</Checkbox>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">No. of pages</label>
          <Input type="number" value={settings.noOfPages} onChange={(e) => handleChange('noOfPages', e.target.value)} />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Border Color</label>
          <Input type="color" value={settings.borderColor} onChange={(e) => handleChange('borderColor', e.target.value)} />
        </div>
        <Checkbox checked={settings.hasBorder} onCheckedChange={(val) => handleChange('hasBorder', val)}>Has Border</Checkbox>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Outline Color</label>
          <Input type="color" value={settings.outlineColor} onChange={(e) => handleChange('outlineColor', e.target.value)} />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Max Marks</label>
          <Input type="number" value={settings.maxMarks} onChange={(e) => handleChange('maxMarks', parseInt(e.target.value))} />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Pass Marks</label>
          <Input type="number" value={settings.passMarks} onChange={(e) => handleChange('passMarks', parseInt(e.target.value))} />
        </div>
        <Checkbox checked={settings.highestMarksPerSubject} onCheckedChange={(val) => handleChange('highestMarksPerSubject', val)}>Highest Marks Per Subject</Checkbox>
        <Checkbox checked={settings.displayNames} onCheckedChange={(val) => handleChange('displayNames', val)}>Display Names (Student Info)</Checkbox>
      </Section>

      <Section title="Header Style">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Report Card Title</label>
          <Input value={settings.reportCardTitle} onChange={(e) => handleChange('reportCardTitle', e.target.value)} />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Bottom Head / Student Label</label>
          <Input value={settings.bottomHeadStudentLabel} onChange={(e) => handleChange('bottomHeadStudentLabel', e.target.value)} />
        </div>
        <Checkbox checked={settings.displayExam} onCheckedChange={(val) => handleChange('displayExam', val)}>Display Exam Name</Checkbox>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Exam Name Font Size (Pixels)</label>
          <Input type="number" value={settings.examNameFontSize} onChange={(e) => handleChange('examNameFontSize', parseInt(e.target.value))} />
        </div>
        <Checkbox checked={settings.name} onCheckedChange={(val) => handleChange('name', val)}>Display Student Name</Checkbox>
        <Checkbox checked={settings.studentClass} onCheckedChange={(val) => handleChange('studentClass', val)}>Display Class</Checkbox>
        <Checkbox checked={settings.rollNo} onCheckedChange={(val) => handleChange('rollNo', val)}>Display Roll No.</Checkbox>
        <Checkbox checked={settings.admissionNo} onCheckedChange={(val) => handleChange('admissionNo', val)}>Display Admission No.</Checkbox>
        <Checkbox checked={settings.fatherName} onCheckedChange={(val) => handleChange('fatherName', val)}>Display Father's Name</Checkbox>
        <Checkbox checked={settings.motherName} onCheckedChange={(val) => handleChange('motherName', val)}>Display Mother's Name</Checkbox>
        <Checkbox checked={settings.dateOfBirth} onCheckedChange={(val) => handleChange('dateOfBirth', val)}>Display Date of Birth</Checkbox>
        <Checkbox checked={settings.image} onCheckedChange={(val) => handleChange('image', val)}>Display Student Image</Checkbox>
      </Section>

      <Section title="Body Parameters">
        <Checkbox checked={settings.attendance} onCheckedChange={(val) => handleChange('attendance', val)}>Display Attendance</Checkbox>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Attendance Display Params</label>
          <Input value={settings.attendanceDisplayParams} onChange={(e) => handleChange('attendanceDisplayParams', e.target.value)} />
        </div>
        <Checkbox checked={settings.classRevision} onCheckedChange={(val) => handleChange('classRevision', val)}>Display Class Revision</Checkbox>
        <Checkbox checked={settings.conduct} onCheckedChange={(val) => handleChange('conduct', val)}>Display Conduct</Checkbox>
        <Checkbox checked={settings.marksPerSubject} onCheckedChange={(val) => handleChange('marksPerSubject', val)}>Display Marks Per Subject</Checkbox>
        <Checkbox checked={settings.gradePerSubject} onCheckedChange={(val) => handleChange('gradePerSubject', val)}>Display Grade Per Subject</Checkbox>
        <Checkbox checked={settings.breakOnSubject} onCheckedChange={(val) => handleChange('breakOnSubject', val)}>Break On Subject</Checkbox>
        <Checkbox checked={settings.showPassFail} onCheckedChange={(val) => handleChange('showPassFail', val)}>Show Pass / Fail</Checkbox>
        <Checkbox checked={settings.onlyParentSubjects} onCheckedChange={(val) => handleChange('onlyParentSubjects', val)}>Only Parent Subjects</Checkbox>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Absent Color</label>
          <Input type="color" value={settings.absentColor} onChange={(e) => handleChange('absentColor', e.target.value)} />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Body Font Size (Pixels)</label>
          <Input type="number" value={settings.bodyFontSize} onChange={(e) => handleChange('bodyFontSize', parseInt(e.target.value))} />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Body Padding (Pixels)</label>
          <Input type="number" value={settings.bodyPadding} onChange={(e) => handleChange('bodyPadding', parseInt(e.target.value))} />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Exam Parameters Font Size (Pixels)</label>
          <Input type="number" value={settings.examParametersFontSize} onChange={(e) => handleChange('examParametersFontSize', parseInt(e.target.value))} />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Default Margin (Pixels)</label>
          <Input type="number" value={settings.defaultMargin} onChange={(e) => handleChange('defaultMargin', parseInt(e.target.value))} />
        </div>
      </Section>

      <Section title="Body Footer">
        <Checkbox checked={settings.grade} onCheckedChange={(val) => handleChange('grade', val)}>Display Grade (Total)</Checkbox>
        <Checkbox checked={settings.total} onCheckedChange={(val) => handleChange('total', val)}>Display Total Marks</Checkbox>
        <Checkbox checked={settings.percentage} onCheckedChange={(val) => handleChange('percentage', val)}>Display Percentage</Checkbox>
        <Checkbox checked={settings.weightage} onCheckedChange={(val) => handleChange('weightage', val)}>Display Weightage</Checkbox>
        <Checkbox checked={settings.rank} onCheckedChange={(val) => handleChange('rank', val)}>Display Rank</Checkbox>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Give Rank If</label>
          <Select value={settings.giveRankIf} onValueChange={(val) => handleChange('giveRankIf', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select criteria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="highest_std">Highest (%) / Std.</SelectItem>
              <SelectItem value="highest_class">Highest (%) / Class</SelectItem>
              <SelectItem value="percentage_subject">Percentage / Subject</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Checkbox checked={settings.housePoints} onCheckedChange={(val) => handleChange('housePoints', val)}>Display House Points</Checkbox>
      </Section>

      <Section title="Extra Curricular">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Extra Curricular Font Size (Pixels)</label>
          <Input type="number" value={settings.extraCurricularFontSize} onChange={(e) => handleChange('extraCurricularFontSize', parseInt(e.target.value))} />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Extra Curricular Padding (Pixels)</label>
          <Input type="number" value={settings.extraCurricularPadding} onChange={(e) => handleChange('extraCurricularPadding', parseInt(e.target.value))} />
        </div>
        <Checkbox checked={settings.extraCurricularSubjects} onCheckedChange={(val) => handleChange('extraCurricularSubjects', val)}>Display Extra Curricular Subjects</Checkbox>
        <Checkbox checked={settings.extraCurricularExams} onCheckedChange={(val) => handleChange('extraCurricularExams', val)}>Display Extra Curricular Exams</Checkbox>
      </Section>

      <Section title="Footer Parameters">
        <Checkbox checked={settings.isBlankBoxRequired} onCheckedChange={(val) => handleChange('isBlankBoxRequired', val)}>Is Blank Box Required</Checkbox>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Blank Box Header</label>
          <Input value={settings.blankBoxHeader} onChange={(e) => handleChange('blankBoxHeader', e.target.value)} />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Blank Box Content</label>
          <Input value={settings.blankBoxContent} onChange={(e) => handleChange('blankBoxContent', e.target.value)} />
        </div>
        <Checkbox checked={settings.isPtmDisplay} onCheckedChange={(val) => handleChange('isPtmDisplay', val)}>Is PTM Display</Checkbox>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">PTM Value</label>
          <Input value={settings.ptmValue} onChange={(e) => handleChange('ptmValue', e.target.value)} />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Remarks Signature Label Color</label>
          <Input type="color" value={settings.remarksSignatureLabelColor} onChange={(e) => handleChange('remarksSignatureLabelColor', e.target.value)} />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Remarks Font Size (Pixels)</label>
          <Input type="number" value={settings.remarksFontSize} onChange={(e) => handleChange('remarksFontSize', parseInt(e.target.value))} />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Remarks Padding (Pixels)</label>
          <Input type="number" value={settings.remarksPadding} onChange={(e) => handleChange('remarksPadding', parseInt(e.target.value))} />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Attendance Font Size (Pixels)</label>
          <Input type="number" value={settings.attendanceFontSize} onChange={(e) => handleChange('attendanceFontSize', parseInt(e.target.value))} />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Attendance Padding (Pixels)</label>
          <Input type="number" value={settings.attendancePadding} onChange={(e) => handleChange('attendancePadding', parseInt(e.target.value))} />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Additional Content (Remarks)</label>
          <Input value={settings.additionalContent} onChange={(e) => handleChange('additionalContent', e.target.value)} />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Comment (Footer)</label>
          <Input value={settings.comment} onChange={(e) => handleChange('comment', e.target.value)} />
        </div>
        <Checkbox checked={settings.footerImage} onCheckedChange={(val) => handleChange('footerImage', val)}>Display Footer Image</Checkbox>
      </Section>
    </div>
  );
};


// Main App Component
const App = () => {
  const [activeTab, setActiveTab] = useState('report-card-format'); // Default to Report Card Format

  // Initial settings for the report card preview
  const [reportCardSettings, setReportCardSettings] = useState({
    orientation: 'portrait',
    displayResult: true,
    noOfPages: 1,
    borderColor: '#000000',
    hasBorder: true,
    outlineColor: '#CCCCCC',
    maxMarks: true,
    passMarks: true,
    highestMarksPerSubject: true,
    displayNames: true,

    reportCardTitle: 'Annual Report Card',
    bottomHeadStudentLabel: 'Academic Year 2024-2025',
    displayExam: true,
    examNameFontSize: 24,
    name: true,
    studentClass: true,
    rollNo: true,
    admissionNo: true,
    fatherName: true,
    motherName: true,
    dateOfBirth: true,
    image: true,

    attendance: true,
    attendanceDisplayParams: 'Days Present / Total Days',
    classRevision: true,
    conduct: true,
    marksPerSubject: true,
    gradePerSubject: true,
    breakOnSubject: false,
    showPassFail: true,
    onlyParentSubjects: false,
    absentColor: '#FF0000',
    bodyFontSize: 14,
    bodyPadding: 8,
    examParametersFontSize: 12,
    defaultMargin: 20,

    grade: true,
    total: true,
    percentage: true,
    weightage: false,
    rank: true,
    giveRankIf: 'highest_std',
    housePoints: true,
    highestStd: true,
    highestClass: false,
    percentageSubject: false,

    extraCurricularFontSize: 12,
    extraCurricularPadding: 5,
    extraCurricularSubjects: true,
    extraCurricularExams: true,

    isBlankBoxRequired: true,
    blankBoxHeader: 'Teacher Remarks',
    blankBoxContent: 'This space is for additional comments or remarks from the teacher.',
    isPtmDisplay: true,
    ptmValue: 'Next PTM: 2025-08-10',
    remarksSignatureLabelColor: '#333333',
    remarksFontSize: 12,
    remarksPadding: 10,
    attendanceFontSize: 12,
    attendancePadding: 5,
    additionalContent: 'A diligent student with good progress. Keep up the hard work!',
    comment: 'Powered by School ERP SaaS',
    footerImage: true,
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans antialiased">
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
        /* Custom scrollbar for settings panel */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        `}
      </style>
      <div className="container mx-auto max-w-full bg-white rounded-xl shadow-lg p-6">
        {/* <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">School ERP - Report Card Section</h1> */}

        <Tabs defaultValue="report-card-format">
          <TabsList>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="exam">Exam</TabsTrigger>
            <TabsTrigger value="enter-marks">Enter Marks</TabsTrigger>
            <TabsTrigger value="student-entry">Student Entry</TabsTrigger>
            <TabsTrigger value="report-card-format">Report Card Format</TabsTrigger>
            <TabsTrigger value="analytical-sheets">Report Card & Analytical Sheets</TabsTrigger>
            <TabsTrigger value="block-report-card">Block Report Card</TabsTrigger>
          </TabsList>

          <TabsContent value="subjects">
            <div className="p-4 bg-gray-50 rounded-lg text-gray-700">
              <h2 className="text-xl font-semibold mb-2">Subjects Management</h2>
              <p>Manage and define subjects offered in the school.</p>
            </div>
          </TabsContent>

          <TabsContent value="grades">
            <div className="p-4 bg-gray-50 rounded-lg text-gray-700">
              <h2 className="text-xl font-semibold mb-2">Grades Configuration</h2>
              <p>Set up grading scales and criteria.</p>
            </div>
          </TabsContent>

          <TabsContent value="exam">
            <div className="p-4 bg-gray-50 rounded-lg text-gray-700">
              <h2 className="text-xl font-semibold mb-2">Exam Management</h2>
              <p>Configure different examinations (e.g., Mid-term, Annual).</p>
            </div>
          </TabsContent>

          <TabsContent value="enter-marks">
            <div className="p-4 bg-gray-50 rounded-lg text-gray-700">
              <h2 className="text-xl font-semibold mb-2">Enter Marks</h2>
              <p>Interface for teachers to input student marks for various subjects and exams.</p>
            </div>
          </TabsContent>

          <TabsContent value="student-entry">
            <div className="p-4 bg-gray-50 rounded-lg text-gray-700">
              <h2 className="text-xl font-semibold mb-2">Student Entry</h2>
              <p>Add and manage student profiles and details.</p>
            </div>
          </TabsContent>

          <TabsContent value="report-card-format">
            <div className="flex flex-col lg:flex-row gap-6 mt-4">
              {/* Settings Panel */}
              <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-md p-4">
                <ReportCardSettings settings={reportCardSettings} onSettingsChange={setReportCardSettings} />
              </div>
              {/* Live Preview */}
              <div className="w-full lg:w-full bg-gray-100 rounded-lg shadow-md p-4 flex justify-center items-start overflow-auto">
                <ReportCardPreview settings={reportCardSettings} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytical-sheets">
            <div className="p-4 bg-gray-50 rounded-lg text-gray-700">
              <h2 className="text-xl font-semibold mb-2">Report Card & Analytical Sheets</h2>
              <p>Generate various reports and analytical sheets based on student performance.</p>
            </div>
          </TabsContent>

          <TabsContent value="block-report-card">
            <div className="p-4 bg-gray-50 rounded-lg text-gray-700">
              <h2 className="text-xl font-semibold mb-2">Block Report Card</h2>
              <p>Generate report cards in batches or for specific groups of students.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default App;
