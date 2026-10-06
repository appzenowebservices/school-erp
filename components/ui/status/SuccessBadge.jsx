import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaRegCheckCircle } from "react-icons/fa";

const SuccessBadge = ({ title = "Success!", message, onClose }) => {
  console.log('message', message);

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose(); // ✅ Ensure onClose is called after hiding
      }
    }, 1500); // 3 seconds timeout

    return () => clearTimeout(timer);
  }, [onClose]); // ✅ Include onClose in dependencies

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
      className="flex items-center justify-between gap-2 p-4 bg-green-500 text-white rounded-lg shadow-md mb-4"
    >
      {/* Check Icon */}
      <FaRegCheckCircle size={24} className="bg-white text-green-500 rounded-full p-1" />

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

export default SuccessBadge;
