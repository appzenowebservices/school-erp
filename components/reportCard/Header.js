import React from 'react';
import { useRouter } from "next/navigation";

import { FileDown } from 'lucide-react';
import TooltipInfo from '../ui/tooltip/TooltipInfo';
import { FaFilter, FaList, FaThLarge, FaPlusCircle } from 'react-icons/fa';
import Tabs from './Tabs';


const Header = ({
    headerTitle,
    headerIcon,
    toggleFilterPanel,
    getFilterCount,
    viewMode,
    setViewMode,

}) => {
    const router = useRouter();
    const [firstWord, ...restWords] = headerTitle.split(' ');
    const secondPart = restWords.join(' ');
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">





            <div className="flex items-center ">
                <div className="text-accent text-4xl mr-3">
                    {/* <IoBagCheckOutline className="text-accent text-4xl mr-3" /> */}
                    {headerIcon}
                </div>
                <div className='flex-col'>

                    <h1 className="text-4xl font-extrabold tracking-tight">
                        <span className="text-[color:var(--color-blue-text)]">{firstWord} </span>
                        <span className="text-[color:var(--color-navy-blue)]">{secondPart}</span>
                    </h1>
                    <div>
                        {/* <h1 className="text-2xl font-bold text-gray-900">Configure Report Card </h1> */}
                        <p className="text-gray-600">Design &configure report cards with real-time preview</p>
                    </div>
                </div>
            </div>



        </div >
    );
};

export default Header;