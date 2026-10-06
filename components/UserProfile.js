import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, Lock, LogOut } from "lucide-react";
import { useParams, useRouter } from 'next/navigation';

const UserProfile = ({ profile }) => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const router = useRouter()
    const params = useParams()

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMyAccount = () => {
        console.log("Navigating to My Account");
        setIsDropdownOpen(false);
        router.push(`/dashboard/${params.profile}/${params.session}/${params.school}/profile`);
    };

    const handleChangePassword = () => {
        console.log("Navigating to Change Password");
        setIsDropdownOpen(false);
    };

    const handleLogout = () => {
        console.log("Logging out");
        setIsDropdownOpen(false);
    };

    return (
        <div className="p-4 mt-auto relative"> 
            <button
                ref={buttonRef}
                onClick={toggleDropdown}
                className="flex items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer w-full justify-between" // Adjusted classes for button behavior
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
            >
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[color:var(--color-dark-blue)] flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium">AS</span>
                    </div>
                    <div className="ml-3 text-left"> {/* Aligned text to left */}
                        <p className="text-sm font-medium text-gray-900">{profile?.name}</p>
                        <p className="text-xs text-gray-500">{profile?.type}</p>
                    </div>
                </div>
                <ChevronDown
                    className={`h-5 w-5 text-gray-400  transition-transform ml-4 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                />
            </button>

            {isDropdownOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30" // Increased z-index
                >
                    <button
                        onClick={handleMyAccount}
                        className=" cursor-pointer flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <User className="mr-2 h-4 w-4" />
                        My Account
                    </button>
                    <button
                        onClick={handleChangePassword}
                        className="cursor-pointer flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <Lock className="mr-2 h-4 w-4" />
                        Change Password
                    </button>
                    <button
                        onClick={handleLogout}
                        className="cursor-pointer flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
