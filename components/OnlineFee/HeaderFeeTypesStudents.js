import React from 'react';
import { FileDown, ChevronDown } from 'lucide-react';
import { commonIcons } from '../library/component/constants/icons';

const { FaFilter } = commonIcons;

const HeaderFeeTypesStudents = ({
    headerTitle,
    headerIcon,
    toggleFilterPanel,
    getFilterCount,
    feeTypes = [], // Array of objects like { id, name }
    selectedFeeType, // The current selected ID
    onFeeTypeSelect, // Function to handle the change
}) => {
    const [firstWord, ...restWords] = headerTitle.split(' ');
    const secondPart = restWords.join(' ');

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-8 transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* TITLE SECTION */}
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner shrink-0">
                        {headerIcon && React.isValidElement(headerIcon) 
                            ? React.cloneElement(headerIcon, { size: 28 }) 
                            : headerIcon}
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex flex-wrap gap-x-2">
                            <span className="text-blue-600">{firstWord}</span>
                            <span className="text-slate-800">{secondPart}</span>
                        </h1>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                            Management Portal
                        </p>
                    </div>
                </div>

                {/* ACTIONS SECTION */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    
                    {/* FEE TYPE DROPDOWN SELECT */}
                    <div className="relative group min-w-[260px]">
                        {/* Floating Label Style */}
                        <label className="absolute -top-2 left-3 px-1 bg-white text-[10px] font-bold text-blue-600 uppercase z-10 tracking-wider">
                            Fee Category
                        </label>
                        
                        <select 
                            value={selectedFeeType}
                            onChange={(e) => onFeeTypeSelect(e.target.value)}
                            className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-semibold text-gray-700 appearance-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all cursor-pointer"
                        >
                            <option value="all">All Fee Types</option>
                            {feeTypes?.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name || type.label}
                                </option>
                            ))}
                        </select>
                        
                        <ChevronDown 
                            size={18} 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors" 
                        />
                    </div>

                    <div className="flex items-center gap-2">
              

                        {/* EXPORT BUTTON */}
                        <button 
                            className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 active:scale-95 group"
                            title="Export Records"
                        >
                            <FileDown size={20} className="group-hover:translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderFeeTypesStudents;