"use client"

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiUser, FiMail, FiTag, FiMessageSquare } from 'react-icons/fi';

const AddModal = ({ title, description, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-sm z-50 ">
      <div className="bg-background-section p-2  rounded-2xl shadow-2xl w-full max-w-lg transition-transform transform scale-100  border  border-accent/60 border-4 ">
        <div className="bg-background p-6 rounded-md mb-6">
          <h3 className="text-xl font-bold mb-2 text-center" style={{ color: 'var(--color-primary-text)' }}>{title}</h3>
          <p className="text-sm text-secondary-text">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-text" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 pl-10 border  border-[#e7e7e7] rounded-md bg-muted text-primary-text shadow-md transition-transform transform hover:-translate-y-1 active:translate-y-0 focus:shadow-md focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-text" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 pl-10 border  border-[#e7e7e7] rounded-md bg-muted text-primary-text shadow-md transition-transform transform hover:-translate-y-1 active:translate-y-0 focus:shadow-md focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Category</label>
            <div className="relative">
              <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-text" />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 pl-10 border  border-[#e7e7e7] rounded-md bg-muted text-primary-text shadow-md transition-transform transform hover:-translate-y-1 active:translate-y-0 focus:shadow-md focus:outline-none"
                required
              >
                <option value="">Select a category</option>
                <option value="Retail">Retail</option>
                <option value="Logistics">Logistics</option>
                <option value="ERP">ERP</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Description</label>
            <div className="relative">
              <FiMessageSquare className="absolute left-3 top-4 text-primary-text" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full p-3 pl-10 border  border-[#e7e7e7] rounded-md bg-muted text-primary-text shadow-md transition-transform transform hover:-translate-y-1 active:translate-y-0 focus:shadow-md focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-muted text-primary-text hover:bg-opacity-80 transition  border  border-[#d3c5c5] "
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-accent text-white font-semibold hover:scale-105 transition-transform"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddModal.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddModal;