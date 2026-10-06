import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const ExamDropdownOptions = ({ anchorRef, options, onSelect, getActionIcon, onClose }) => {
  const dropdownRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4, // small gap
        left: rect.right - 224, // width 224px (w-56)
        width: 224,
      });
    }

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [anchorRef, onClose]);

  const dropdown = (
    <div
      ref={dropdownRef}
      className="absolute bg-white shadow-xl rounded-lg border border-gray-200 divide-y divide-gray-100 animate-fade-in-up z-[9999]"
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
      }}
    >
      <div className="py-1">
        {options.map((option, index) => {
          const IconComponent = getActionIcon(option.action);
          return (
            <button
              key={index}
              onClick={() => onSelect(option)}
              className={`w-full px-4 py-2 text-left flex items-center gap-3 text-sm transition-colors ${
                option.action === 'delete'
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <IconComponent className="h-4 w-4 flex-shrink-0" />
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  // render in portal to avoid being clipped
  return createPortal(dropdown, document.body);
};

export default ExamDropdownOptions;
