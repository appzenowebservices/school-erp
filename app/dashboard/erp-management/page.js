'use client'
import React, { useState } from 'react';
import {
  School,
  Users,
  FileText,
  UserCheck,
  Clock,
  Settings,
  Edit3,
  Upload,
  Eye,
  Plus,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Image,
  ChevronRight,
  Building2,
  GraduationCap,
  Home,
  UserCog
} from 'lucide-react';
import Layout from '../../../layouts/Layout';

const SchoolERPDashboard = () => {
  const [activeSection, setActiveSection] = useState('school');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [schoolData, setSchoolData] = useState({
    name: 'Greenwood High School',
    mobile: '+91 9876543210',
    email: 'info@greenwoodhigh.edu.in',
    address: '123 Education Street',
    state: 'Karnataka',
    district: 'Bangalore',
    city: 'Bangalore',
    pincode: '560001',
    currentSession: '2024-25'
  });

  const menuItems = [
    { id: 'school', label: 'School Setup', icon: School, color: 'bg-blue-500' },
    { id: 'students', label: 'Student Management', icon: GraduationCap, color: 'bg-green-500' },
    { id: 'reports', label: 'Report Cards', icon: FileText, color: 'bg-purple-500' },
    { id: 'staff', label: 'Staff Management', icon: UserCheck, color: 'bg-orange-500' },
    { id: 'timings', label: 'Timings Setup', icon: Clock, color: 'bg-red-500' }
  ];

  const renderSchoolSetup = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-500" />
            School Information
          </h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Edit3 className="w-4 h-4" />
            Edit Details
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <School className="w-4 h-4 text-gray-500" />
                <span className="text-gray-800">{schoolData.name}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-gray-800">{schoolData.mobile}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-800">{schoolData.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Session</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-800">{schoolData.currentSession}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-gray-800">{schoolData.address}</div>
                  <div className="text-sm text-gray-600">
                    {schoolData.city}, {schoolData.district}
                  </div>
                  <div className="text-sm text-gray-600">
                    {schoolData.state} - {schoolData.pincode}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
          <Image className="w-5 h-5 text-purple-500" />
          School Images
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4">
              <School className="w-12 h-12 text-blue-500" />
            </div>
            <h4 className="font-medium text-gray-800 mb-2">School Logo</h4>
            <button className="flex items-center gap-2 mx-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Upload className="w-4 h-4" />
              Upload Logo
            </button>
          </div>

          <div className="text-center">
            <div className="w-full h-32 bg-gradient-to-r from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4">
              <Image className="w-12 h-12 text-green-500" />
            </div>
            <h4 className="font-medium text-gray-800 mb-2">Header Image</h4>
            <button className="flex items-center gap-2 mx-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Upload className="w-4 h-4" />
              Upload Header
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudentManagement = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Standards', count: '10', icon: GraduationCap, color: 'bg-blue-500' },
          { title: 'Classes', count: '25', icon: Building2, color: 'bg-green-500' },
          { title: 'Houses', count: '4', icon: Home, color: 'bg-purple-500' },
          { title: 'Students', count: '1,250', icon: Users, color: 'bg-orange-500' }
        ].map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{item.title}</p>
                <p className="text-2xl font-bold text-gray-800">{item.count}</p>
              </div>
              <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Eye className="w-4 h-4" />
              View {item.title}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReportCards = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-6">
          <FileText className="w-10 h-10 text-purple-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Report Card Management</h3>
        <p className="text-gray-600 mb-6">Upload and manage student report cards</p>
        <button className="flex items-center gap-2 mx-auto px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
          <Upload className="w-5 h-5" />
          Upload Report Cards
        </button>
      </div>
    </div>
  );

  const renderStaffManagement = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Departments', count: '8', icon: Building2, action: 'Manage' },
          { title: 'Titles', count: '15', icon: UserCog, action: 'Manage' },
          { title: 'Designations', count: '12', icon: UserCheck, action: 'Manage' }
        ].map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">{item.title}</p>
                <p className="text-xl font-bold text-gray-800">{item.count}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <item.icon className="w-5 h-5 text-orange-500" />
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              <Settings className="w-4 h-4" />
              {item.action} {item.title}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-orange-500" />
          Staff Uploads
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-800">Upload Staff Documents</p>
              <p className="text-sm text-gray-600">Certificates, resumes, etc.</p>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Image className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-800">Upload Staff Photos</p>
              <p className="text-sm text-gray-600">Profile pictures</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderTimings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-red-500" />
          Login Timing Setup
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Staff Login Start Time</label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-800">08:00 AM</span>
              <button className="ml-auto text-red-500 hover:text-red-600">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Staff Login End Time</label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-800">08:30 AM</span>
              <button className="ml-auto text-red-500 hover:text-red-600">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-red-500" />
          Other Timings
        </h3>

        <div className="space-y-4">
          {[
            { label: 'School Start Time', value: '08:30 AM' },
            { label: 'Break Time', value: '11:00 AM - 11:30 AM' },
            { label: 'Lunch Time', value: '01:00 PM - 01:45 PM' },
            { label: 'School End Time', value: '04:00 PM' }
          ].map((timing, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-800">{timing.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-gray-600">{timing.value}</span>
                <button className="text-red-500 hover:text-red-600">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
          <Plus className="w-4 h-4" />
          Add New Timing
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'school': return renderSchoolSetup();
      case 'students': return renderStudentManagement();
      case 'reports': return renderReportCards();
      case 'staff': return renderStaffManagement();
      case 'timings': return renderTimings();
      default: return renderSchoolSetup();
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex">
          {/* Sidebar */}
          {sidebarOpen && <div className="w-64 bg-white shadow-lg border-r border-gray-200 min-h-screen">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {/* <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <School className="w-6 h-6 text-white" />
                </div> */}
                <div>
                  <h1 className="text-lg font-bold text-gray-800">ERP Management</h1>
                  {/* <p className="text-sm text-gray-600">School Admin Panel</p> */}
                </div>
              </div>
            </div>

            <nav className="p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${activeSection === item.id
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border-l-4 border-blue-500'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeSection === item.id ? 'text-blue-500' : 'text-gray-400'
                        }`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                      {activeSection === item.id && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>}

          {/* Main Content */}
          <div className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  {menuItems.find(item => item.id === activeSection)?.icon && (
                    <div className={`w-8 h-8 ${menuItems.find(item => item.id === activeSection)?.color} rounded-lg flex items-center justify-center`}>
                      {React.createElement(menuItems.find(item => item.id === activeSection)?.icon, { className: "w-5 h-5 text-white" })}
                    </div>
                  )}
                  <h2 className="text-3xl font-bold text-gray-800">
                    {menuItems.find(item => item.id === activeSection)?.label}
                  </h2>
                </div>
                <p className="text-gray-600">
                  Manage your school's {activeSection === 'school' ? 'basic information and settings' :
                    activeSection === 'students' ? 'student data and organization' :
                      activeSection === 'reports' ? 'report cards and academic records' :
                        activeSection === 'staff' ? 'staff information and departments' :
                          'timing configurations and schedules'}
                </p>
              </div>

              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SchoolERPDashboard;