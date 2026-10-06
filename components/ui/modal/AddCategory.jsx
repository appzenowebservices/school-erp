"use client"

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from '../input/input';
import SingleImageUploader from '../uploader/imageUploader';
// import { useAddCategory } from '../../../controllers/superAdmin/vendor/category';
import Loader from '../status/Loader'
import SuccessBadge from '../status/SuccessBadge';
import ErrorBadge from '../status/ErrorBadge';
import { useAddCategory } from '../../../controllers/category';
//=============================================================================
const AddCategory = ({ title, description, isOpen, onClose, moduleId }) => {
  //=============================================================================
  const { addCategory, isPending, error, isSuccess } = useAddCategory();

  console.log('moduleId', moduleId);

  const [imageFile, setImageFile] = useState(null); // Store the image file
  const [apiResponse, setApiResponse] = useState(''); // Success pop-up state



  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    description: '',
    icon: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryData = new FormData();
    categoryData.append('name', formData.name);
    categoryData.append('module', moduleId);
    categoryData.append('description', formData.description);
    if (imageFile) {
      categoryData.append('icon', imageFile);
    }

    const { success, error: addCategoryError, successMessage } = await addCategory(categoryData);

    if (success) {
      setApiResponse(successMessage)
    } else {
      setApiResponse(addCategoryError)
      console.error('Error adding category:', addCategoryError);
    }
  };
  if (!isOpen) return null;
  //=============================================================================

  return (

    <>
      {/* //============================================================================= */}


      <div className="animate-slide-down fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-sm z-50">
        <div className="bg-background-section p-2 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transition-transform transform scale-100 border border-accent/60 border-4">
          <div className="bg-background p-6 rounded-md mb-6">
            <h3 className="text-xl font-bold mb-2 text-center" style={{ color: 'var(--color-primary-text)' }}>{title}</h3>
            <p className="text-sm text-secondary-text text-center">{description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Category</label>
              <Input
                placeholder="Enter category name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-[#e7e7e7] rounded-md bg-muted text-primary-text shadow-md transition-transform transform active:translate-y-0 focus:shadow-md focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Description</label>
              <Input
                placeholder="Add small description"
                type="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-[#e7e7e7] rounded-md bg-muted text-primary-text shadow-md transition-transform transform active:translate-y-0 focus:shadow-md focus:outline-none"
                required
              />
            </div>

            <SingleImageUploader setImageFile={setImageFile} />

            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-muted text-primary-text hover:bg-opacity-80 transition border border-[#d3c5c5]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-accent text-white font-semibold hover:scale-105 transition-transform"
              >
                {isPending ? <Loader /> : "Submit"}
              </button>
            </div>
            {/* {true && <SuccessBadge message={'successMessage'} />} */}
            {isSuccess && <SuccessBadge onClose={onClose} message={apiResponse} />}
            {error && <ErrorBadge message={apiResponse} />}
          </form>
        </div>
      </div>

    </>
  );
};

AddCategory.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddCategory;