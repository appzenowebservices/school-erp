'use client';
import React, { useEffect, useState } from 'react';
import { User, BadgePlus, List, Save, Heart, Book, File, Banknote, Notebook, Captions, } from 'lucide-react';
import { StaffList } from './listStaff';
import StaffProfile from './staffProfile';
import AddStaff from './addStaffForm';
import { getSessionCache } from '../../utils/sessionCache';
import { addStaff } from '../../api/staff';
import AddStaffPersonalInfo from './AddStaffPersonalInfo';
import AddDocumentInfo from './AddDocumentInfo';
import AddAcademicInfo from './AddAcademicInfo';
import DepartmentManagement from './departments';
import SchoolRolesManagement from './schoolRoles';
import SchoolTitleManagement from './titles';
import SchoolDesignationManagement from './schoolDesignation';
import ClassSubjectMapping from './ClassSubjectMapping';
import PermissionsViewer from './PermissionsViewer';
import AddBankInfo from './AddBankInfo';
import { useSearchParams,useRouter } from 'next/navigation';
import { VscSymbolClass } from "react-icons/vsc";
import { MdClass } from 'react-icons/md';
import { GrUserAdmin } from 'react-icons/gr';
// ===================================================================



const tabs = [
  { id: 'list', label: 'List Staff', icon: List },
  { id: 'add', label: 'Add Staff', icon: BadgePlus },
  { id: 'view', label: 'View Profile', icon: User },
  { id: 'departments', label: 'Departments', icon: VscSymbolClass },
  { id: 'schoolRoles', label: 'Roles', icon: Notebook },
  { id: 'schoolDesignation', label: 'Designation', icon: Captions },
  { id: 'schoolTitles', label: 'Titles', icon: Captions },
  { id: 'subjectClassMapping', label: 'Subject Class Mapping', icon: MdClass },
  { id: 'designationPermission', label: 'Revoke Designation Permission', icon: GrUserAdmin },
];

const StaffMangementDashboard = ({
  students,
  profile,
  session,
  cookyGuid,
  cookyId,
  school

}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const config = getSessionCache("dashboardConfig");
  const Context = getSessionCache("dashboardContext");
  // console.log('Context : ', Context);
  const designations = config?.designations
  const titles = config?.titles
  const gender_staffs = config?.gender_staffs
  const classes = config?.classes

  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentFormStep, setCurrentFormStep] = useState('basic');


  const [selectedTitle, setSelectedTitle] = useState('');



  const classesOptions = config?.classes || [];
  const schoolOptions = config?.school || [];
  const genderOptions = config?.gender_students || [];
  const religionsOptions = config?.religions || [];
  const motherTonguesOptions = config?.mother_tongues || [];
  const nationalitiesOptions = config?.nationalities || [];
  const bloodGroupsOptions = config?.blood_groups || [];
  const categoriesOptions = config?.caste_categories || [];







  // console.log('------------- $ stadffData--------', stadffData?.users);






  // console.log(selectedStaff,"selectedStaff");


  const [selectedStaff, setSelectedStaff] = useState('')
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    gender: "",
    designation: "",
    class: "",

    dateOfBirth: "",
    joiningDate: "",
    invoiceNotificationEnabled: false,
    classCoordinator: false,
    category: "",
    bloodGroup: "",
    email: "",
    phone: "",
    emergencyPhone: "",
    fatherName: "",
    motherName: "",
    spouseName: "",
    sonName: "",
    daughterName: "",
    currentAddress: "",
    permanentAddress: "",

    aadhaar: "",
    pan: "",
    employeeId: "",
    specialDesignation: "",
    dateOfRetirement: "",
    appointmentType: "",


    academicQualification: "",
    professionalQualification: "",
    experience: "",
    yearOfPassing: "",

    bank: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",





    rollNo: "",
    religion: "",
    motherTongue: "",
    nationality: "Indian",

    registrationNumber: "",
    schoolBus: "",
    smsNumber: "",

    school: "",
    parents: [
      { name: "", gender: "", relation: "FATHER", phone: "", email: "", occupation: "", address: "" },
      { name: "", gender: "", relation: "MOTHER", phone: "", email: "", occupation: "", address: "" }
    ]
  });

  const formSteps = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'personal', label: 'Personal Details', icon: Heart },
    { id: 'documents', label: 'Documents Info', icon: File },
    { id: 'academic', label: 'Academic Info', icon: Book },
    { id: 'bank', label: 'Bank Details', icon: Banknote }
  ];







  // useEffect(() => {
  //   const tab = searchParams.get("tab");
  //   if (tab) setActiveTab(tab);
  // }, [searchParams]);
useEffect(() => {
  const tab = searchParams.get("tab");
  if (tab && tabs.some(t => t.id === tab)) {
    setActiveTab(tab);
  }
}, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.replace(`?${params.toString()}`, { scroll: false });
  };




  // console.log('formData ==========', formData)

  const handleInputChange = (e) => {

    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };



  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        ...formData,
        school: Context?.schoolId,
      };

      const res = await addStaff(
        Context?.profileId,
        Context?.session,
        cookyGuid,
        cookyId,
        payload
      );

      if (!res?.data?.success) {
        setError(
          res?.data?.results?.message ||
          "Failed to save staff data. Please try again."
        );
        return;
      }

      // ✅ Success
      setSuccess(res?.data?.results?.message);

      setFormData({
        school: "",
        class: "",
        name: "",
        rollNo: "",
        phone: "",
        alternatePhone: "",
        email: "",
        dateOfBirth: "",
        aadharCard: "",
        religion: "",
        motherTongue: "",
        nationality: "Indian",
        bloodGroup: "",
        address: "",
        registrationNumber: "",
        schoolBus: "",
        smsNumber: "",
      });

      setCurrentFormStep("basic");
      setActiveTab("list");

      // Optional UX delay before refresh / navigation
      setTimeout(() => {
        setSuccess(null);
      }, 3000);

    } catch (error) {
      console.error("Error saving staff:", error);
      setError("Failed to save staff data. Please try again.");

    } finally {
      setIsSaving(false);

      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };


  // ===================================================================



  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 "

      >
        <div className=" mx-auto px-4 py-4 shadow-lg">
          {/* =====================     Navigation Tabs =================================================================== */}
          <div className="bg-white rounded-xl shadow-sm mb-6 border border-slate-100 overflow-hidden">
            {/* Container: Horizontal scroll on mobile, flex-wrap or normal flex on desktop */}
            <div className="flex items-center p-1 overflow-x-auto no-scrollbar scroll-smooth">
              <div className="flex space-x-1 min-w-max md:min-w-0 md:w-full">
                {tabs?.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.id}
  onClick={() => handleTabChange(tab.id)}
                      className={`
              relative flex items-center justify-center gap-2 
              px-4 py-2.5 rounded-lg text-sm font-semibold 
              transition-all duration-200 cursor-pointer whitespace-nowrap
              ${isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-1 ring-blue-600'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                        }
            `}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{tab.label}</span>

                      {/* Optional: Active indicator dot for mobile */}
                      {isActive && (
                        <span className="absolute -top-1 -right-1 flex h-2 w-2 md:hidden">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {activeTab === "add" && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Staff</h2>
                <p className="text-gray-600">Fill in the staff information step by step</p>
              </div>

              {/* Form Steps Navigation */}
              <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg mb-8">
                {formSteps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentFormStep(step.id)}
                    className={`cursor-pointer  flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors flex-1 justify-center ${currentFormStep === step.id
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <step.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{step.label}</span>
                  </button>
                ))}
              </div>

              {/* Form Content */}
              <div className="mb-8">
                {currentFormStep === "basic" && (

                  <AddStaff
                    formData={formData}
                    setFormData={setFormData}
                    handleInputChange={handleInputChange}
                    designations={designations}
                    titles={titles}
                    genderStaffs={gender_staffs}
                    school={school}
                    classes={classes}
                  />
                )}

              </div>






              <div className="mb-8">
                {currentFormStep === "personal" && (

                  <AddStaffPersonalInfo
                    formData={formData}
                    setFormData={setFormData}
                    categories={categoriesOptions}
                    bloodGroups={bloodGroupsOptions}

                  />
                )}

              </div>

              <div className="mb-8">
                {currentFormStep === "documents" && (

                  <AddDocumentInfo
                    formData={formData}
                    setFormData={setFormData}
                    handleInputChange={handleInputChange}

                  />
                )}

              </div>



              <div className="mb-8">
                {currentFormStep === "academic" && (

                  <AddAcademicInfo
                    formData={formData}
                    setFormData={setFormData}
                    handleInputChange={handleInputChange}

                  />
                )}

              </div>

              <div className="mb-8">
                {currentFormStep === "bank" && (

                  <AddBankInfo
                    formData={formData}
                    setFormData={setFormData}
                    handleInputChange={handleInputChange}
                    Context={Context}

                  />
                )}

              </div>




              {/* Form Actions */}
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    const currentIndex = formSteps.findIndex(
                      (step) => step.id === currentFormStep
                    );
                    if (currentIndex > 0) {
                      setCurrentFormStep(formSteps[currentIndex - 1].id);
                    }
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  disabled={formSteps.findIndex((step) => step.id === currentFormStep) === 0}
                >
                  Previous
                </button>

                <div className="space-x-4">
                  {formSteps.findIndex((step) => step.id === currentFormStep) <
                    formSteps.length - 1 ? (
                    <button
                      onClick={() => {
                        const currentIndex = formSteps.findIndex(
                          (step) => step.id === currentFormStep
                        );
                        if (currentIndex < formSteps.length - 1) {
                          setCurrentFormStep(formSteps[currentIndex + 1].id);
                        }
                      }}
                      className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="cursor-pointer flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      disabled={isSaving}
                    >
                      <Save className="h-4 w-4" />
                      <span>{isSaving ? "Saving..." : "Save Staff"}</span>
                    </button>
                  )}
                </div>


              </div>
            </div>
          )}
          {/* List Students */}
          {activeTab === 'list' && (
            <>
              <StaffList
                setActiveTab={setActiveTab}
                setSelectedStaff={setSelectedStaff}
              />
            </>
          )}

          {/* View Profile */}
          {activeTab === 'view' && (
            // <StaffProfile

            <>
              {selectedStaff ?
                <StaffProfile
                  bloodGroupsOptions={bloodGroupsOptions}
                  religionsOptions={religionsOptions}
                  school={school}
                  profile={Context?.profileId}
                  session={Context?.session}
                  cookyGuid={cookyGuid}
                  cookyId={cookyId}
                  studentData={selectedStaff}
                  studentId={selectedStaff?.id}
                  config={config}
                /> : (
                  <>
                    <div className="bg-white rounded-xl shadow-md p-6 text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">No Staff Selected</h2>
                      <p className="text-gray-600 mb-4">Please select a student from the list to view their profile.</p>
                    </div>
                  </>

                )}

            </>
          )}



          {activeTab === 'departments' && (
            <>
              <DepartmentManagement
                Context={Context}
                config={config}
                setActiveTab={setActiveTab}
              />
            </>
          )}


          {activeTab === 'schoolRoles' && (
            <>
              <SchoolRolesManagement
                Context={Context}
                config={config}
                setActiveTab={setActiveTab}

              />
            </>
          )}

          {activeTab === 'schoolDesignation' && (
            <>
              <SchoolDesignationManagement
                Context={Context}
                config={config}
              />
            </>
          )}

          {activeTab === 'schoolTitles' && (
            <>
              <SchoolTitleManagement
                Context={Context}
                config={config}
              />
            </>
          )}

          {activeTab === 'subjectClassMapping' && (
            <>
              <ClassSubjectMapping
                Context={Context}
                config={config}
              />
            </>
          )}

          {activeTab === 'designationPermission' && (
            <>
              <PermissionsViewer
                Context={Context}
                config={config}
              />
            </>
          )}


          {/* ======================================================================================== */}

          {error && (
            <div className="fixed top-4 right-4 flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md shadow-md z-50">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="fixed top-4 right-4 flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md shadow-md z-50">
              <span>{success}</span>
            </div>
          )}
        </div>
      </div>


    </>
  );
};

{/* ======================================================================================== */ }
export default StaffMangementDashboard;
{/* ======================================================================================== */ }