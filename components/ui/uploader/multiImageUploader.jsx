import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaImage, FaTimes, FaExpand, FaPlus } from "react-icons/fa";

const MultiImageUploader = ({ setImageFile }) => {
  const [images, setImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

const onDrop = async(acceptedFiles) => {
  if (images.length + acceptedFiles.length > 5) {
    alert("You can only upload up to 5 images.");
    return;
  }

  let imgArr = [...acceptedFiles]; // Store all selected files

  
  setImageFile((prevFiles = []) => [...prevFiles, ...acceptedFiles]);

  const newImages = imgArr.map((file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  });

  Promise.all(newImages).then((imageData) => {
    setImages((prevImages) => [...prevImages, ...imageData]);
  });
};


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true,
  });

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div >
      <label className="block text-gray-700 font-medium flex items-center">
        <FaImage className="mr-2" /> Product Images (Max: 5)
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative w-full h-32   rounded-lg overflow-hidden border border-gray-300 shadow-md">
            <img src={image} alt="Uploaded" className="w-full h-full object-cover rounded-lg" />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition"
            >
              <FaTimes className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewImage(image)}
              className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 rounded-full shadow hover:bg-blue-600 transition"
            >
              <FaExpand className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Show upload box only if there are less than 5 images */}
        {images.length < 5 && (
          <div
            {...getRootProps()}
            className="h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-accent hover:bg-accent-muted transition"
          >
            <input {...getInputProps()} />
            <FaPlus className="text-gray-400 text-5xl " />
          </div>
        )}
      </div>

      {/* Fullscreen Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-lg shadow-lg overflow-auto animate-zoom-in">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 transition"
            >
              <FaTimes className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-center p-4">
              <img
                src={previewImage}
                alt="Full Preview"
                className="max-w-full max-h-[80vh] rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tailwind Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-in-out;
          }

          @keyframes zoomIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-zoom-in {
            animation: zoomIn 0.3s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default MultiImageUploader;
