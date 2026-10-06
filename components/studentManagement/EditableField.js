import { useState } from "react";
import { FaEdit } from "react-icons/fa";

const EditableField = ({
  label,
  value,
  onSave,
  type = "text",
  options = [],
  icon: Icon,
  setIsUpdated,
  isEditable = true
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [temp, setTemp] = useState(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    
    if (type !== "boolean" && !temp) return setError("Cannot be empty");
    try {
      setLoading(true);
      await onSave(temp);
      setIsEditing(false);
      setIsUpdated?.((prev) => !prev);
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const renderValueDisplay = () => {
    if (type === "array") {
  if (!Array.isArray(value) || value.length === 0) {
    return <p className="text-gray-400 italic">—</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {value.map((item, idx) => (
        <span
          key={item.id || idx}
          className="px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-700 border border-blue-200"
        >
          {item.value || item}
        </span>
      ))}
    </div>
  );
}

    if (type === "boolean") {
      const active =
        value === true || value === "1" || value === 1 || value === "true";

      return (
        <span
          className={`px-3 py-1 text-sm font-medium rounded-full border ${active
              ? "bg-green-100 text-green-700 border-green-300"
              : "bg-red-100 text-red-700 border-red-300"
            }`}
        >
          {active ? "YES" : "NO"}
        </span>
      );
    }

    return <p className="text-lg font-semibold text-gray-900">{value || "—"}</p>;
  };

  const renderInput = () => {
    if (type === "select") {
      return (
        <select
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          className="border rounded-md px-2 py-1 text-sm"
        >
          <option value="">Select</option>
          {options.map((opt) => (
            <option
              key={typeof opt === "object" ? opt.id : opt}
              value={typeof opt === "object" ? opt.id : opt}
            >
              {typeof opt === "object" ? opt.name : opt}
            </option>
          ))}
        </select>
      );
    }

    if (type === "boolean") {
      const normalized =
        temp === true || temp === "1" || temp === 1 || temp === "true";
      return (
        <select
          value={normalized ? "1" : "0"}
          onChange={(e) => setTemp(e.target.value === "1" ? 1 : 0)}
          className="border rounded-md px-2 py-1 text-sm"
        >
          <option value="1">Enabled</option>
          <option value="0">Disabled</option>
        </select>
      );
    }

    return (
      <input
        type={type}
        value={temp}
        onChange={(e) => setTemp(e.target.value)}
        className="border-b border-blue-500 focus:outline-none bg-transparent"
      />
    );
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>

          {isEditable ? (
            isEditing ? (
              <div className="flex gap-2 items-center">
                {renderInput()}
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="cursor-pointer px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setTemp(value);
                    setIsEditing(false);
                  }}
                  disabled={loading}
                  className="cursor-pointer px-3 py-1 bg-gray-200 text-sm rounded-md"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {renderValueDisplay()}
                <button onClick={() => setIsEditing(true)}>
                  <FaEdit className="cursor-pointer h-4 w-4 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
            )
          ) : (
            renderValueDisplay()
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default EditableField;
