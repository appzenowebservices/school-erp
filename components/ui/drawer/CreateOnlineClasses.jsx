import React, { useState, useEffect } from 'react';
import { ChevronDown, Clock, Calendar, Users, BookOpen, Sparkles, Check, X, Presentation } from 'lucide-react';

import { FaEye, FaSave, FaStar, FaStarOfLife } from "react-icons/fa";
import { FaEyeLowVision, FaPencil, FaXmark } from "react-icons/fa6";
import { SiGooglemeet } from "react-icons/si";
import TooltipInfo from '../tooltip/TooltipInfo';
import { createOnlineClasses } from '../../../api/onlineClasses';
import { getHomeworkSubjects } from '../../../api/homeworkSubjects';
import { useParams } from 'next/navigation';
import { getSessionCache } from '../../../utils/sessionCache';

const AddMeetingForm = () => {

  const config = getSessionCache("dashboardConfig");

    // console.log(config,'config');



 



    const { profile, session } = useParams()

    
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);



    const [isOpen, setIsOpen] = useState(false);
    const toggleDrawer = () => setIsOpen(!isOpen);

    const [formData, setFormData] = useState({
        subject: '',
        students: '',
        date: '',
        startTime: '',
        endTime: '',
        title: '',
        description: ''
    });

    const [dropdownOpen, setDropdownOpen] = useState({
        subject: false,
        students: false
    });

    const [animations, setAnimations] = useState({
        formLoaded: false,
        submitSuccess: false,
        fieldFocus: null
    });




    const fetchSubjects = async () => {
        try {
            const res = await getHomeworkSubjects();
            if (res.success) setSubjects(res.results);
        } catch (err) {
            if (err.name !== "CanceledError") setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // const controller = new AbortController();

        fetchSubjects();

        // return () => controller.abort(); // cleanup on unmount
    }, [profile, session]);




    // Sample data structure for classes, subjects, and students
    const classData = {
        'Class 10': {
            subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
            students: ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Eve Wilson'],
            color: 'from-purple-400 to-pink-400'
        },
        'Class 11': {
            subjects: ['Advanced Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English Literature'],
            students: ['Frank Miller', 'Grace Lee', 'Henry Ford', 'Ivy Chen', 'Jack Turner'],
            color: 'from-blue-400 to-cyan-400'
        },
        'Class 12': {
            subjects: ['Calculus', 'Advanced Physics', 'Organic Chemistry', 'Programming', 'Business Studies'],
            students: ['Kate Morgan', 'Liam Davis', 'Maya Patel', 'Noah Kim', 'Olivia Martinez'],
            color: 'from-green-400 to-teal-400'
        }
    };

    const [selectedClass, setSelectedClass] = useState('');
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [availableStudents, setAvailableStudents] = useState([]);
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        // Form load animation
        setTimeout(() => setAnimations(prev => ({ ...prev, formLoaded: true })), 100);

        // Create floating particles
        const newParticles = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 6 + 2,
            speed: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.3
        }));
        // setParticles(newParticles);

        // Animate particles
        const animateParticles = () => {
            // setParticles(prev => prev.map(particle => ({
            //     ...particle,
            //     y: particle.y > 100 ? -10 : particle.y + particle.speed * 0.1
            // })));
        };

        const interval = setInterval(animateParticles, 50);
        return () => clearInterval(interval);
    }, []);

    const handleClassChange = (className) => {
        setSelectedClass(className);
        setAvailableSubjects(classData[className]?.subjects || []);
        setAvailableStudents(classData[className]?.students || []);
        setFormData(prev => ({ ...prev, subject: '', students: '' }));
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleDropdown = (field) => {
        setDropdownOpen(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = () => {
        setAnimations(prev => ({ ...prev, submitSuccess: true }));




        // Simulate API call
        setTimeout(() => {
            console.log('Form submitted:', formData);
            setAnimations(prev => ({ ...prev, submitSuccess: false }));
        }, 2000);
    };

    const handleFieldFocus = (field) => {
        setAnimations(prev => ({ ...prev, fieldFocus: field }));
    };

    const handleFieldBlur = () => {
        setAnimations(prev => ({ ...prev, fieldFocus: null }));
    };

    return (
        <div className="font-sans">
            {/* Trigger Button */}

            <TooltipInfo
                text={'Create New Meet'}
                position={'left'}
            >


                <button
                    type="button"

                    onClick={toggleDrawer}
                    className="cursor-pointer rounded-full w-10 h-10 flex items-center justify-center bg-accent text-white shadow-lg  transition-colors"
                    aria-label="Edit Categories"
                >
                    <SiGooglemeet size={16} />
                </button>
            </TooltipInfo>

            {/* Slide Drawer */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={toggleDrawer}
            />

            <div
                className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-gray-50 shadow transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
                    <div className="flex justify-between items-center px-6 py-4">
                        <h1 className="text-xl font-semibold text-gray-800">Online Class Creation</h1>
                        <div className="flex items-center gap-4">

                            <button
                                type="button" // <-- Add this!

                                onClick={toggleDrawer}
                                className="rounded-full w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                                aria-label="Close"
                            >
                                <FaXmark size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex px-6 overflow-x-auto hide-scrollbar">

                    </div>
                </div>

                <div className="min-h-screen bg-gradient-to-r from-[var(--color-white)] to-[var(--color-navy-blue)] text-black p-6 relative overflow-hidden">
                    {/* Animated Background Particles */}
                    {/* {particles.map(particle => (
                        <div
                            key={particle.id}
                            className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
                            style={{
                                left: `${particle.x}%`,
                                top: `${particle.y}%`,
                                width: `${particle.size}px`,
                                height: `${particle.size}px`,
                                opacity: particle.opacity,
                                animation: `float ${particle.speed + 2}s ease-in-out infinite`
                            }}
                        />
                    ))} */}

                    {/* Floating Geometric Shapes */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-10 animate-bounce"></div>
                        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-green-400 to-blue-400 transform rotate-45 opacity-10 animate-spin-slow"></div>
                        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 animate-pulse"></div>
                    </div>

                    <div className="max-w-4xl mx-auto relative z-10">
                        {/* Header with Glassmorphism Effect */}
                        <div className={`bg-white/20 backdrop-blur-lg p-6 rounded-t-2xl border border-white/30 shadow flex justify-between items-center transform transition-all duration-1000 ${animations.formLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center animate-pulse">
                                    <Presentation className="w-5 h-5 text-white" />
                                </div>
                                <h1 className="text-4xl font-extrabold tracking-tight text-[color:var(--color-blue-text)]">
                                    Add<span className="text-[color:var(--color-navy-blue)]">Meeting</span>
                                </h1>

                            </div>
                            <button className="bg-accent  text-white px-6 py-3 rounded-full flex items-center gap-2 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                                {/* <span className="text-xl">📋</span> */}
                                <span className="font-semibold">View all</span>
                            </button>
                        </div>

                        {/* Form with Advanced Glassmorphism */}
                        <div className={`bg-white/10 backdrop-blur-lg p-8 rounded-b-2xl border border-white/20 shadow transform transition-all duration-1000 delay-200 ${animations.formLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                {/* Meeting Subject with Enhanced Styling */}
                                <div className="group">
                                    <label className="block text-sm font-medium text-black/90 mb-3 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        Meeting Subject
                                    </label>
                                    <div className="relative">
                                        <button
                                            onClick={() => toggleDropdown('subject')}
                                            onFocus={() => handleFieldFocus('subject')}
                                            onBlur={handleFieldBlur}
                                            className={`w-full p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-left text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 flex justify-between items-center transition-all duration-300 shadow hover:shadow-xl ${animations.fieldFocus === 'subject' ? 'scale-105 ring-2 ring-yellow-400' : ''}`}
                                        >
                                            {formData.subject || 'Select Subject'}
                                            <ChevronDown className={`w-5 h-5 text-white/70 transition-transform duration-300 ${dropdownOpen.subject ? 'rotate-180' : ''}`} />
                                        </button>

                                        {dropdownOpen.subject && (
                                            <div className="absolute z-20 w-full mt-2 bg-white/95 backdrop-blur-lg border border-white/30 rounded-xl shadow max-h-80 overflow-y-auto animate-fade-in">
                                                {/* Class Selection */}
                                                <div className="p-4 border-b border-gray-200/50">
                                                    <div className="text-xs font-bold text-gray-600 mb-3 flex items-center gap-2">
                                                        <Users className="w-3 h-3" />
                                                        SELECT CLASS
                                                    </div>
                                                    {Object.keys(classData).map((className) => (
                                                        <button
                                                            key={className}
                                                            onClick={() => handleClassChange(className)}
                                                            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all duration-300 hover:scale-105 ${selectedClass === className
                                                                ? `bg-gradient-to-r ${classData[className].color} text-white shadow`
                                                                : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200'
                                                                }`}
                                                        >
                                                            <div className="font-medium">{className}</div>
                                                            <div className="text-xs opacity-75">
                                                                {classData[className].subjects.length} subjects • {classData[className].students.length} students
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Subject Selection */}
                                                {availableSubjects.length > 0 && (
                                                    <div className="p-4">
                                                        <div className="text-xs font-bold text-gray-600 mb-3 flex items-center gap-2">
                                                            <BookOpen className="w-3 h-3" />
                                                            SELECT SUBJECT
                                                        </div>
                                                        {availableSubjects.map((subject, index) => (
                                                            <button
                                                                key={subject}
                                                                onClick={() => {
                                                                    handleInputChange('subject', subject);
                                                                    toggleDropdown('subject');
                                                                }}
                                                                className="w-full text-left px-4 py-3 rounded-lg mb-2 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:scale-105 hover:shadow-md"
                                                                style={{ animationDelay: `${index * 100}ms` }}
                                                            >
                                                                <div className="font-medium">{subject}</div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Students with Enhanced Styling */}
                                <div className="group">
                                    <label className="block text-sm font-medium text-black/90 mb-3 flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Students
                                    </label>
                                    <div className="relative">
                                        <button
                                            onClick={() => toggleDropdown('students')}
                                            onFocus={() => handleFieldFocus('students')}
                                            onBlur={handleFieldBlur}
                                            className={`w-full p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-left text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 flex justify-between items-center transition-all duration-300 shadow-lg hover:shadow-xl ${animations.fieldFocus === 'students' ? 'scale-105 ring-2 ring-yellow-400' : ''}`}
                                        >
                                            {formData.students || `Classes(${selectedClass ? 1 : 0}) Students(${availableStudents.length})`}
                                            <ChevronDown className={`w-5 h-5 text-white/70 transition-transform duration-300 ${dropdownOpen.students ? 'rotate-180' : ''}`} />
                                        </button>

                                        {dropdownOpen.students && (
                                            <div className="absolute z-20 w-full mt-2 bg-white/95 backdrop-blur-lg border border-white/30 rounded-xl shadow max-h-80 overflow-y-auto animate-fade-in">
                                                {availableStudents.length > 0 ? (
                                                    <div className="p-4">
                                                        <div className="text-xs font-bold text-gray-600 mb-3 flex items-center gap-2">
                                                            <Users className="w-3 h-3" />
                                                            SELECT STUDENTS FROM {selectedClass}
                                                        </div>
                                                        {availableStudents.map((student, index) => (
                                                            <button
                                                                key={student}
                                                                onClick={() => {
                                                                    handleInputChange('students', student);
                                                                    toggleDropdown('students');
                                                                }}
                                                                className="w-full text-left px-4 py-3 rounded-lg mb-2 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-300 hover:scale-105 hover:shadow-md flex items-center gap-3"
                                                                style={{ animationDelay: `${index * 100}ms` }}
                                                            >
                                                                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                                    {student.charAt(0)}
                                                                </div>
                                                                <div className="font-medium">{student}</div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="p-6 text-center text-gray-500">
                                                        <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                                        <p className="font-medium">Please select a class first</p>
                                                        <p className="text-sm">to view available students</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Date and Time Row with Enhanced Styling */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="group">
                                    <label className="block text-sm font-medium text-black/90 mb-3 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => handleInputChange('date', e.target.value)}
                                        onFocus={() => handleFieldFocus('date')}
                                        onBlur={handleFieldBlur}
                                        className={`w-full p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl ${animations.fieldFocus === 'date' ? 'scale-105 ring-2 ring-yellow-400' : ''}`}
                                    />
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-medium text-black/90 mb-3 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Start Time
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="time"
                                            value={formData.startTime}
                                            onChange={(e) => handleInputChange('startTime', e.target.value)}
                                            onFocus={() => handleFieldFocus('startTime')}
                                            onBlur={handleFieldBlur}
                                            className={`w-full p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl pr-12 ${animations.fieldFocus === 'startTime' ? 'scale-105 ring-2 ring-yellow-400' : ''}`}
                                        />
                                        {/* <Clock className="absolute right-4 top-4 w-5 h-5 text-white/70" /> */}
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-medium text-black/90 mb-3 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        End Time
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="time"
                                            value={formData.endTime}
                                            onChange={(e) => handleInputChange('endTime', e.target.value)}
                                            onFocus={() => handleFieldFocus('endTime')}
                                            onBlur={handleFieldBlur}
                                            className={`w-full p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl pr-12 ${animations.fieldFocus === 'endTime' ? 'scale-105 ring-2 ring-yellow-400' : ''}`}
                                        />
                                        {/* <Clock className="absolute right-4 top-4 w-5 h-5 text-white/70" /> */}
                                    </div>
                                </div>
                            </div>

                            {/* Title with Enhanced Styling */}
                            <div className="mb-8">
                                <label className="block text-sm font-medium text-black/90 mb-3 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter meeting title..."
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    onFocus={() => handleFieldFocus('title')}
                                    onBlur={handleFieldBlur}
                                    className={`w-full p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl ${animations.fieldFocus === 'title' ? 'scale-105 ring-2 ring-yellow-400' : ''}`}
                                />
                            </div>

                            {/* Description with Enhanced Styling */}
                            <div className="mb-8">
                                <label className="block text-sm font-medium text-black/90 mb-3 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    Description
                                </label>
                                <textarea
                                    rows="4"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    onFocus={() => handleFieldFocus('description')}
                                    onBlur={handleFieldBlur}
                                    className={`w-full p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl resize-none ${animations.fieldFocus === 'description' ? 'scale-105 ring-2 ring-yellow-400' : ''}`}
                                    placeholder="Enter meeting description..."
                                />
                            </div>

                            {/* Submit Button with Success Animation */}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSubmit}
                                    disabled={animations.submitSuccess}
                                    className={`px-8 py-4 rounded-full font-bold text-white transition-all duration-500 shadow hover:shadow transform hover:scale-105 active:scale-95 ${animations.submitSuccess
                                        ? 'bg-gradient-to-r from-green-400 to-green-600'
                                        : 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500'
                                        }`}
                                >
                                    {animations.submitSuccess ? (
                                        <div className="flex items-center gap-3">
                                            <Check className="w-5 h-5 animate-bounce" />
                                            <span>Meeting Added Successfully!</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <Sparkles className="w-5 h-5" />
                                            <span>Add Meeting</span>
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
      `}</style>
                </div>
            </div>
        </div>
    );
};

export default AddMeetingForm;