"use client";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { Check, X } from "lucide-react";

const EditableField = ({
  label,
  value,
  type = "text",
  icon: Icon,
  onSave,
  setIsUpdated,
  isEditable = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [temp, setTemp] = useState(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (!temp && type === "text") return setError("Field cannot be empty");
    try {
      setLoading(true);
      await onSave?.(temp);
      setIsEditing(false);
      setIsUpdated?.((prev) => !prev);
    } catch (err) {
      setError(err.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = () => {
    if (type === "color") {
      return (
        <input
          type="color"
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          className="w-10 h-10 rounded-md border border-gray-300 cursor-pointer shadow-sm"
        />
      );
    }
    return (
      <input
        type="text"
        value={temp}
        onChange={(e) => setTemp(e.target.value)}
        className="w-full sm:w-64 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        placeholder="Enter value..."
      />
    );
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start sm:items-center gap-4 flex-wrap sm:flex-nowrap">
        {Icon && (
          <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
            <Icon className="h-5 w-5 text-blue-600" />
          </div>
        )}

        <div className="flex-1 min-w-[180px] space-y-2">
          {label && (
            <p className="text-sm font-semibold text-gray-700 tracking-wide">
              {label}
            </p>
          )}

          {isEditable ? (
            isEditing ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {renderInput()}
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 text-sm rounded-md hover:bg-blue-700 active:scale-[.98] transition"
                  >
                    <Check className="w-4 h-4" />
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setTemp(value);
                      setIsEditing(false);
                    }}
                    disabled={loading}
                    className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1.5 text-sm rounded-md hover:bg-gray-300 active:scale-[.98] transition"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {type === "color" ? (
                  <div
                    className="w-7 h-7 rounded-md border shadow-sm"
                    style={{ backgroundColor: value }}
                  />
                ) : (
                  <p className="text-base sm:text-lg font-medium text-gray-900 break-all">
                    {value || "—"}
                  </p>
                )}
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-blue-600 transition"
                >
                  <FaEdit className="h-4 w-4" />
                </button>
              </div>
            )
          ) : (
            <p className="text-base sm:text-lg font-medium text-gray-900">
              {value || "—"}
            </p>
          )}

          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default EditableField;
