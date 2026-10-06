import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaRegTimesCircle } from "react-icons/fa"; // Using a different icon for error

const ErrorBadge = ({ title = "Error!", message, onClose }) => {
  console.log('message', message);

  const [isVisible, setIsVisible] = useState(true);

  // Automatically hide the badge after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // Hide the badge after 3 seconds
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose(); // Optional onClose callback for external control
    }
  };

  if (!isVisible) return null; // Don't render the badge if it's hidden

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex items-center justify-between gap-2 p-4 bg-red-500 text-white rounded-lg shadow-md mb-4"
    >
      {/* Error Icon */}
      <FaRegTimesCircle size={24} className="bg-white text-red-500 rounded-full p-1" />

      {/* Title and message in the center */}
      <div className="flex flex-col text-center flex-grow">
        <h2 className="font-bold text-lg">{title}</h2>
        <p className="text-sm">{message}</p>
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="ml-4 bg-transparent text-white font-bold hover:text-gray-300"
      >
        X
      </button>
    </motion.div>
  );
};

export default ErrorBadge;
