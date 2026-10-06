import { motion } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmationDialogueBox = ({ onConfirm, onCancel, title, description }) => {

    return (
        <div className="fixed inset-0 flex items-center justify-center  bg-[rgba(0,0,0,0.6)] backdrop-blur-sm z-99">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="max-w-md w-full p-8 bg-white rounded-3xl shadow-lg text-center"
            >
                <div className="flex justify-center mb-6">
                    <FaExclamationTriangle size={80} className="text-[#ffff] bg-warning rounded-full p-2" />
                </div>

                <h2 className="font-bold text-primary-text mb-2" style={{ fontSize: 'var(--text-2xl)' }}>
                    {title}
                </h2>

                <p className="text-secondary-text text-sm mb-6" style={{ fontSize: 'var(--text-md)' }}>
                    {description}
                </p>

                <div className="flex gap-4">
                    <button
                        onClick={onConfirm}
                        className="cursor-pointer bg-error w-full text-white py-2 px-8 rounded-full text-sm transition ease-in-out"
                    >
                        Yes
                    </button>

                    <button
                        onClick={onCancel}
                        className="cursor-pointer bg-gray-300 w-full text-gray-800 py-2 px-8 rounded-full text-sm transition ease-in-out"
                    >
                        Cancel
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ConfirmationDialogueBox;
