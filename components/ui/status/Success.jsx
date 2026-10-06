"use client"
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRegCheckCircle } from "react-icons/fa";
//========================================================
const SuccessStatus = ({ user, message }) => {
    // console.log('=====dddd===================user, message:', user, message);


    // Automatically close the success card after 3 seconds
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         document.getElementById('success-card').style.display = 'none';
    //     }, 3000);
    //     return () => clearTimeout(timer);
    // }, []);

    const handleClose = () => {

        document.getElementById('success-card').style.display = 'none';
    };

    return (
        <div className=" fixed inset-0 flex items-center justify-center  bg-[rgba(0,0,0,0.6)] backdrop-blur-sm z-50" id='success-card'>







            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="max-w-sm w-full p-8 bg-white rounded-3xl shadow-lg text-center"
            >
                <div className="flex justify-center mb-6">
                    <FaRegCheckCircle size={80} className="text-[#ffff] bg-success rounded-full p-2" />
                </div>

                <h2 className="font-bold text-primary-text mb-2 " style={{ fontSize: 'var(--text-xl)' }}>
                    {user ? `Welcome ${user}!` : 'Success!'}
                </h2>

                <p className="text-secondary-text text-sm mb-6 " style={{ fontSize: 'var(--text-lg)' }}>{message}</p>

                <button
                    onClick={handleClose}
                    className="bg-success w-full text-white py-2 px-8 rounded-full text-sm transition ease-in-out"
                >
                    OK
                </button>
            </motion.div>
        </div>
    );
};
//========================================================
export default SuccessStatus;