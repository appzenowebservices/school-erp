import React from 'react';
import { CreditCard } from 'lucide-react';
import TooltipInfo from '../tooltip/TooltipInfo';
import { useRouter } from 'next/navigation';

const SchoolBadgeCard = ({
  schoolImage,
  schoolName,
  schoolBranch,
  toggleSidebarClient,
  smsBalance = null,
  onRechargeClick
}) => {
  const formatIndianNumber = (num) => {
    if (num === null || num === undefined) return '';
    const numStr = String(num);
    const parts = numStr.split('.');
    let integerPart = parts[0];
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
    const isNegative = integerPart.startsWith('-');
    if (isNegative) integerPart = integerPart.substring(1);

    if (integerPart.length <= 3) {
      return (isNegative ? '-' : '') + integerPart + decimalPart;
    }
    let lastThreeDigits = integerPart.substring(integerPart.length - 3);
    let otherDigits = integerPart.substring(0, integerPart.length - 3);
    otherDigits = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    return (isNegative ? '-' : '') + otherDigits + ',' + lastThreeDigits + decimalPart;
  };

  const router = useRouter()

  const formattedSmsBalance = smsBalance !== '' ? formatIndianNumber(smsBalance) : 0;

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 rounded-xl shadow-lg border border-white/10 hover:shadow-xl transition-all duration-300">

      {/* Left Section: Logo + Name/Branch */}
      <div className="flex flex-col items-center gap-2 flex-shrink-0 w-28">
        {/* Logo */}

        <TooltipInfo
          text="Change School">

          <div
            onClick={() => router.push('/profile-selection')}
            className="w-12 h-12 rounded-full bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 flex items-center justify-center overflow-hidden">
            {schoolImage ? (
              <img
                src={schoolImage}
                alt={`${schoolName} logo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://placehold.co/48x48/2563EB/FFFFFF?text=S";
                }}
              />
            ) : (
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            )}
          </div>
        </TooltipInfo>

        {/* School Details stacked below */}
        <div className="text-center w-full">
          <h3 className="font-semibold text-white text-sm truncate">{schoolName || "School Name"}</h3>
          <p className="text-blue-200 text-xs truncate">{schoolBranch || "Branch Not Specified"}</p>
        </div>
      </div>

      {/* Center: SMS Balance (if available) */}
      {smsBalance !== null && (
        <div className="hidden sm:flex items-center gap-3 px-4 border-l border-white/10 flex-1 justify-end">
          <div className="text-right">
            <p className="text-xs text-blue-200">SMS Balance</p>
            <p className="font-semibold text-white text-sm">₹{formattedSmsBalance}</p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onRechargeClick) onRechargeClick();
            }}
            className="p-2 bg-blue-600/80 hover:bg-blue-600 rounded-lg transition-colors backdrop-blur-sm border border-blue-400/30 group"
            title="Recharge SMS"
          >
            <CreditCard className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}

      {/* Mobile SMS Balance */}
      {smsBalance !== null && (
        <div className="sm:hidden flex items-center gap-2 flex-1 justify-end">
          <div className="text-right">
            <p className="text-xs text-blue-200">SMS</p>
            <p className="font-medium text-white text-xs">₹{formattedSmsBalance}</p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onRechargeClick) onRechargeClick();
            }}
            className="p-1.5 bg-blue-600/80 hover:bg-blue-600 rounded-lg transition-colors"
          >
            <CreditCard className="w-3 h-3 text-white" />
          </button>
        </div>
      )}

      {/* Right: Toggle Button */}
      {toggleSidebarClient && (
        <div className="flex-shrink-0 ml-3 pl-3 border-l border-white/10">
          {toggleSidebarClient}
        </div>
      )}
    </div>
  );
};

export default SchoolBadgeCard;
