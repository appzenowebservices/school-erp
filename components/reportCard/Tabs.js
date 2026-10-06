import React, { useState } from 'react';
import {
    BookOpen, Building2, Languages, Truck,
    Home, Archive, Package, UserCheck, CreditCard,
    Library, User, Building, Globe, ShoppingCart, BadgePlus, List,
    LayoutDashboard // Assuming LayoutDashboard for the dashboard icon
} from 'lucide-react';

const Tabs = ({ setActiveTab, activeTab }) => {
    // const [activeTab, setActiveTab] = useState('dashboard'); // Set an initial active tab

    const modules = [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, color: 'bg-blue-500' },
        { id: 'authors', name: 'Authors', icon: User, color: 'bg-purple-500' },
        { id: 'publishers', name: 'Publishers', icon: Building, color: 'bg-green-500' },
        { id: 'categories', name: 'Categories', icon: Archive, color: 'bg-yellow-500' },
        { id: 'languages', name: 'Languages', icon: Globe, color: 'bg-red-500' },
        { id: 'suppliers', name: 'Suppliers', icon: ShoppingCart, color: 'bg-indigo-500' },
        { id: 'rooms', name: 'Rooms', icon: Building2, color: 'bg-pink-500' },
        { id: 'shelves', name: 'Shelves', icon: Home, color: 'bg-teal-500' }, // Changed icon to Home for shelves
        { id: 'racks', name: 'Racks', icon: Package, color: 'bg-orange-500' },
        { id: 'books', name: 'Books', icon: BookOpen, color: 'bg-cyan-500' },
        { id: 'borrowers', name: 'Borrowers', icon: UserCheck, color: 'bg-lime-500' },
        { id: 'fines', name: 'Fine Collection', icon: CreditCard, color: 'bg-rose-500' }
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm mb-6 sm:mb-8 border border-gray-200"> {/* Subtle shadow, border, and responsive margin */}

            <div className="w-[360px] sm:w-full md:w-[700px] lg:w-full overflow-x-auto">

                <div className="flex overflow-x-auto whitespace-nowrap py-2 px-2 sm:px-4 md:px-6 lg:px-8 scrollbar-hide"> {/* Horizontal scroll, responsive padding, hide scrollbar */}
                    {modules.map((tab) => (

                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out flex-shrink-0
                            ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                }`}
                        >
                            {/* Icon hidden on extra small screens, shown on small screens and up */}
                            <tab.icon className="h-4 w-4 hidden sm:inline-block" />
                            <span>{tab.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tabs;