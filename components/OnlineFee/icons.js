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
    FaTimes as FaTimesIcon,
    FaGraduationCap,
    FaCashRegister
} from "react-icons/fa";
import { RiCashFill } from "react-icons/ri";

import { FaBowlRice, FaMoneyBillTransfer } from "react-icons/fa6";
import {
    MdGrain,
    MdChildCare,
    MdLocalGroceryStore,
    MdNewReleases
} from "react-icons/md";
import { PiContactlessPaymentFill } from "react-icons/pi";
import { MdBookOnline } from "react-icons/md";
import { HiBanknotes } from "react-icons/hi2";
import { FaCreditCard } from "react-icons/fa";
import { RiBankFill } from "react-icons/ri";
import { SiIcicibank } from "react-icons/si";

export const paymentModeIcons = {
    "CASH": <RiCashFill className="text-accent" />,
    "CHEQUE": <HiBanknotes className="text-accent" />,
    "ONLINE": <MdBookOnline className="text-accent" />,
    "CARD(POS Machine)": <FaCashRegister className="text-accent" />,
    "BANK(Direct)": <RiBankFill className="text-accent" />,
    "DEMAND DRAFT": <SiIcicibank className="text-accent" />,
    "NACH": <FaCreditCard className="text-accent" />,
   
};

export const studentStatusIcons = {
    "Promoted": <FaGraduationCap className="text-accent" />,
    "New": <MdNewReleases className="text-accent" />,
    "Deposited": <FaMoneyBillTransfer  className="text-accent"/>,
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


export const viewFeeIcons = {
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