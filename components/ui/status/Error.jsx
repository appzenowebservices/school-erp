"use client"
import { motion } from 'framer-motion';
import { FaExclamationCircle } from "react-icons/fa";
import { useEffect, useState } from 'react';

const ErrorStatus = ({ user, message }) => {

    const [visible, setVisible] = useState(true);

    const handleClose = () => setVisible(false);

    // useEffect(() => {
    //     const timer = setTimeout(handleClose, 3000);
    //     return () => clearTimeout(timer);
    // }, []);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center  bg-[rgba(0,0,0,0.6)] backdrop-blur-sm z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="max-w-sm w-full p-8 bg-white rounded-3xl shadow-lg text-center"
            >
                <div className="flex justify-center mb-6">
                    <FaExclamationCircle size={80} className="text-[#ffff] bg-error rounded-full p-2" />
                </div>

                <h2 className="font-bold text-primary-text mb-2" style={{ fontSize: 'var(--text-2xl)' }}>
                    {user ? `Welcome ${user}!` : 'Error Occurred !'}
                </h2>

                <p className="text-secondary-text text-sm mb-6" style={{ fontSize: 'var(--text-lg)' }}>
                    {message?.message || message || 'An unexpected error has occurred. Please try again later.'}
                </p>

                <button
                    onClick={handleClose}
                    className="bg-error w-full text-white py-2 px-8 rounded-full text-sm transition ease-in-out"
                >
                    Dismiss
                </button>
            </motion.div>
        </div>
    );
};

export default ErrorStatus;
