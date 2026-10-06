import React from 'react';
import { FileDown, Filter } from 'lucide-react';
import TooltipInfo from '../ui/tooltip/TooltipInfo';

const HeaderTransportLocation = ({
    headerTitle = "",
    headerIcon,
    toggleFilterPanel,
    getFilterCount,
}) => {
    const [firstWord, ...restWords] = headerTitle.split(' ');
    const secondPart = restWords.join(' ');
    const filterCount = getFilterCount();

    return (
        <div className="flex flex-col gap-6 mb-8">
            {/* Top Bar: Title & Primary Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Left: Title Logic */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[color:var(--color-blue-text)]/10 text-accent shadow-sm border border-blue-50">
                        {headerIcon}
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight flex items-baseline gap-2">
                            <span className="text-[color:var(--color-blue-text)]">{firstWord}</span>
                            <span className="text-[color:var(--color-navy-blue)]">{secondPart}</span>
                        </h1>
                        <p className="text-sm text-gray-500 font-medium">Fee Management Dashboard</p>
                    </div>
                </div>

                {/* Right: Functional Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleFilterPanel}
                        className={`
                            relative flex items-center px-4 py-2 text-sm font-bold rounded-lg transition-all border
                            ${filterCount > 0 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50'}
                        `}
                    >
                        <Filter size={16} className="mr-2" />
                        <span>Filters</span>
                        {filterCount > 0 && (
                            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-blue-600 text-[10px] font-black">
                                {filterCount}
                            </span>
                        )}
                    </button>

                    <TooltipInfo position="bottom" text="Export to CSV/PDF">
                        <button 
                            className="p-2 text-gray-500 bg-white border border-gray-200 rounded-lg hover:text-blue-600 hover:border-blue-400 hover:shadow-sm transition-all"
                            aria-label="Export"
                        >
                            <FileDown size={20} />
                        </button>
                    </TooltipInfo>
                </div>
            </div>

    

            {/* Visual Divider (Optional but Pro) */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50" />
        </div>
    );
};

export default HeaderTransportLocation;