// constants/icons.js
import { ListCollapse, Presentation, Projector } from "lucide-react";
import {
    FaSearch,
    FaFilter,
    FaChevronDown,
    FaTimes,
    FaCheck,
    FaArrowsAltV,
    FaThLarge,
    FaList,
    FaPlusCircle,
    FaAppleAlt,
    FaBook,
    FaTshirt,
    FaTools,
    
    FaUtensils,
    FaCheck as FaCheckIcon,
    FaTimes as FaTimesIcon
} from "react-icons/fa";
import { FaBowlRice } from "react-icons/fa6";
import {
    MdGrain,
    MdChildCare,
    MdLocalGroceryStore
} from "react-icons/md";

export const moduleIcons = {
    "Atta, Rice & Dal": <MdGrain className="text-yellow-600" />,
    "Kidz Zone": <MdChildCare className="text-blue-500" />,
    "Meetings": <Presentation className="text-blue-500" />,
};

export const categoryIcons = {
    "Upcoming": <ListCollapse className="text-blue-500" />,
    "All": <Projector className="text-blue-500" />,
    "Rice": <FaBowlRice className="text-yellow-500" />,
    "Daal": <FaBowlRice className="text-orange-500" />,
    "Wheat & Flour": <FaBowlRice className="text-amber-700" />,
    "Poha, Daliya & Other Grains": <FaBowlRice className="text-amber-500" />,
    "Arhar": <FaBowlRice className="text-orange-600" />,
    "Kids Magazines": <FaBowlRice className="text-blue-600" />,
    "toys": <FaBowlRice className="text-purple-500" />
};

export const statusIcons = {
    active: <FaCheckIcon className="text-green-500" />,
    inactive: <FaTimesIcon className="text-red-500" />
};

export const commonIcons = {
    FaSearch,
    FaFilter,
    FaChevronDown,
    FaTimes,
    FaCheck,
    FaArrowsAltV,
    FaThLarge,
    FaList,
    FaPlusCircle,
    FaAppleAlt,
    FaBook,
    FaTshirt,
    FaTools,
    
    FaUtensils,
    FaCheckIcon,
    FaTimesIcon,
    FaBowlRice,
    MdGrain,
    MdChildCare,
    MdLocalGroceryStore
}