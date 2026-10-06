"use client"

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiUser, FiMail, FiTag, FiUploadCloud, FiX } from 'react-icons/fi';

const AddModal = ({ title, description, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    description: '',
    media: null,
    mediaPreview: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        media: file,
        mediaPreview: URL.createObjectURL(file),
      });
    }
  };

  const removeMedia = () => {
    setFormData({ ...formData, media: null, mediaPreview: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-sm z-50">
      <div className="bg-background-section p-2 rounded-2xl shadow-2xl w-full max-w-lg transition-transform transform scale-100  border-accent/60 border-4">
        <div className="bg-background p-6 rounded-md mb-6">
          <h3 className="text-xl font-bold mb-2 text-center" style={{ color: 'var(--color-primary-text)' }}>{title}</h3>
          <p className="text-sm text-secondary-text">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-[#e7e7e7] rounded-md  text-primary-text shadow-md transition-transform transform hover:-translate-y-1 active:translate-y-0 focus:shadow-md focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-[#e7e7e7] rounded-md bg-muted text-primary-text shadow-md transition-transform transform hover:-translate-y-1 active:translate-y-0 focus:shadow-md focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Category</label>
            <div className="relative">
              <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent" />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-[#e7e7e7] rounded-md bg-muted text-primary-text shadow-md transition-transform transform hover:-translate-y-1 active:translate-y-0 focus:shadow-md focus:outline-none"
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
            <label className="block mb-2 text-sm font-medium">Upload Media</label>
            <div className="relative border-dashed border-2 border-gray-300 rounded-md p-4 cursor-pointer hover:bg-gray-100">
              <input
                type="file"
                name="media"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center text-center text-gray-500">
                <FiUploadCloud className="text-3xl mb-2 text-accent" />
                <p className="text-sm">Click to upload or drag & drop media</p>
              </div>
            </div>
            {formData.mediaPreview && (
              <div className="mt-4 relative">
                <img src={formData.mediaPreview} alt="Preview" className="object-cover rounded-md shadow-md" />
                <button
                  type="button"
                  onClick={removeMedia}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <FiX className="text-white" />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 py-2 px-8 rounded-md text-sm transition ease-in-out"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-accent text-white font-semibold hover:scale-105 transition-transform"
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