import { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
// import { useDeleteCategory } from "../controllers/superAdmin/vendor/category";
import ConfirmationDialogueBox from "./ui/status/Confirmation";

export default function CategorySelector({ categories, onSelect, prevCategory }) {
  const { deleteCategory, mutation } = useDeleteCategory();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Set prevCategory as the initially selected category if provided
  useEffect(() => {
    if (prevCategory) {
      setSelectedCategory(prevCategory);
    }
  }, [prevCategory]);

  const handleSelect = (category) => {
    const newSelection = selectedCategory === category?._id ? null : category?._id;
    setSelectedCategory(newSelection);
    onSelect(newSelection);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    const result = await deleteCategory(categoryToDelete._id);

    if (result.success) {
      setCategoryToDelete(null);
    } else {
      console.error(result.error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 p-2 rounded-md shadow w-full border border-gray-300 min-h-[60px]">
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <div key={category._id} className="relative">
              {/* Category Button */}
              <button
                onClick={() => handleSelect(category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition border
                  ${selectedCategory === category._id
                    ? "bg-blue-500 text-white border-blue-500 shadow-md"
                    : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                  }`}
              >
                {category.icon && (
                  <img
                    src={category.icon}
                    alt={category.name}
                    className="w-6 h-6 object-contain rounded-full"
                  />
                )}
                <span>{category.name}</span>
                {selectedCategory === category._id && <FaCheck className="ml-2 text-white" />}
              </button>

              {/* Delete Button */}
              <button
                onClick={() => setCategoryToDelete(category)}
                className="absolute bottom-8 right-0 text-red-500 hover:text-red-700"
              >
                <FaTimes className="w-5 h-5 text-accent-muted bg-accent rounded-full" />
              </button>
            </div>
          ))
        ) : (
          <div className="w-full flex items-center justify-center text-gray-500 text-sm py-4">
            No categories available.
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {categoryToDelete && (
        <ConfirmationDialogueBox
          title="Delete Category?"
          description={`Are you sure you want to delete "${categoryToDelete.name}"?`}
          onConfirm={confirmDelete}
          onCancel={() => setCategoryToDelete(null)}
        />
      )}
    </>
  );
}
