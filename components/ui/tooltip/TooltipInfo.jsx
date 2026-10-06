import React, { useState } from 'react';
import PropTypes from 'prop-types';

const TooltipInfo = ({ text, position = 'top', children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative flex items-center" 
         onMouseEnter={() => setIsVisible(true)} 
         onMouseLeave={() => setIsVisible(false)}>
      {children}
      {isVisible && (
        <div 
          className={`absolute whitespace-nowrap px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-md z-50 ${
            position === 'top' ? 'bottom-full mb-2' : ''
          } ${
            position === 'bottom' ? 'top-full mt-2' : ''
          } ${
            position === 'left' ? 'right-full mr-2' : ''
          } ${
            position === 'right' ? 'left-full ml-2' : ''
          }`}
        >
          {text}
        </div>
      )}
    </div>
  );
};

TooltipInfo.propTypes = {
  text: PropTypes.string.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  children: PropTypes.node.isRequired,
};

export default TooltipInfo;
