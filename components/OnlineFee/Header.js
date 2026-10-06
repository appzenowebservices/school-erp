import React from 'react';
import { useRouter } from "next/navigation";

import { FileDown } from 'lucide-react';
import TooltipInfo from '../ui/tooltip/TooltipInfo';
import { commonIcons } from '../library/component/constants/icons';

const { FaFilter, FaList, FaThLarge, FaPlusCircle } = commonIcons;

const Header = ({
    headerTitle,
    headerIcon,
    toggleFilterPanel,
    getFilterCount,
    viewMode,
    setViewMode,
    setCreateOnlineClasses
}) => {
    const router = useRouter();
    const [firstWord, ...restWords] = headerTitle.split(' ');
    const secondPart = restWords.join(' ');
    return (
        <div className="bg-white rounded shadow p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center">
                <div className="text-accent text-4xl mr-3">
                    {/* <IoBagCheckOutline className="text-accent text-4xl mr-3" /> */}
                    {headerIcon}
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight">
                    <span className="text-[color:var(--color-blue-text)]">{firstWord} </span>
                    <span className="text-[color:var(--color-navy-blue)]">{secondPart}</span>
                </h1>
                {/* <h1 className="text-3xl font-bold text-gray-900">{headerTitle}</h1> */}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        onClick={toggleFilterPanel}
                        className="cursor-pointer flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <FaFilter size={16} className="mr-2" />
                        <span>Filters</span>
                        {getFilterCount() > 0 && (
                            <span className="ml-2 bg-blue-500 text-white text-xs font-medium w-5 h-5 rounded-full flex items-center justify-center">
                                {getFilterCount()}
                            </span>
                        )}
                    </button>

                    {/* <div className="bg-white border border-gray-300 rounded-lg flex">
                        <button
                            onClick={() => setViewMode("table")}
                            className={`p-2 ${viewMode === "table" ? "bg-accent text-white" : "text-gray-500"} rounded-l-lg transition-colors`}
                            aria-label="Table view"
                        >
                            <FaList size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 ${viewMode === "grid" ? "bg-accent text-white" : "text-gray-500"} rounded-r-lg transition-colors`}
                            aria-label="Grid view"
                        >
                            <FaThLarge size={18} />
                        </button>
                    </div> */}
                </div>

                {/* <TooltipInfo
                    position={'bottom'}
                    text={'xxx'}
                >

                    <button
                        onClick={() => setViewMode("table")}
                        className={`cursor-pointer rounded-full w-10 h-10 flex items-center justify-center bg-accent text-white shadow-lg  transition-colors`}
                        aria-label="Table view"
                    >
                        <FileDown size={18} />
                    </button>
                </TooltipInfo> */}

                {/* <CreateOnlineClasses /> */}
            </div>
        </div >
    );
};

export default Header;