import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaPlus, FaTimes } from "react-icons/fa";

const SingleImageUploader = ({ setImageFile }) => {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null); // Store the actual file here

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0]; // Only the first file will be accepted
    setFile(selectedFile); // Set the file object
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result); // Set the image as base64 data URL
      setImageFile(selectedFile); // Send the file object to the parent component (or the form)
    };
    reader.readAsDataURL(selectedFile);
  };

  const removeImage = () => {
    setImage(null); // Set the image state to null to remove the image
    setFile(null); // Clear the file object as well
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false, // Allow only one file at a time
  });

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-4 mt-8">
      <label className="block text-center text-gray-700 font-medium mb-2">
        <span className="text-lg">Upload Category Icon</span>
        <p className="text-sm text-gray-500 mt-1">
          Please upload a clear image of the product. (JPG, PNG, etc.)
        </p>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 p-4">
        {/* Show upload box only if there is no image uploaded */}
        {!image ? (
          <div
            {...getRootProps()}
            className="h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-accent hover:bg-accent-muted transition"
          >
            <input {...getInputProps()} />
            <FaPlus className="text-gray-400 text-5xl" />
          </div>
        ) : (
          <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-300 shadow-md">
            <img
              src={image}
              alt="Uploaded"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-200 cursor-pointer"
            >
              <FaTimes className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleImageUploader;
