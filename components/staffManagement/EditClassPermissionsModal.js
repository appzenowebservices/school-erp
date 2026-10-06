import React, { useState, useMemo, useEffect } from 'react';
import { Check, X } from 'lucide-react';

export default function EditClassPermissionsModal({
  isOpen,
  permittedClasses = [],
  staff,
  onToggleClass,
  onClose,
  onSave,
  
}) {
  if (!isOpen) return null;

  // Session cache reader
  const getSessionCache = (key) => {
    try {
      return JSON.parse(sessionStorage.getItem(key));
    } catch {
      return null;
    }
  };

  const config = getSessionCache("dashboardConfig");
  const standards = config?.standards || [];

  // Normalize permittedClasses → Set of ID strings
  const normalizeToSet = (arr) =>
    new Set(
      arr.map(item => {
        if (item && typeof item === "object") return String(item.id);
        return String(item);
      })
    );

  const normalizedInitialIds = normalizeToSet(permittedClasses);

  // LOCAL STATE
  const [selectedIds, setSelectedIds] = useState(normalizedInitialIds);

  // IMPORTANT: Keep state in sync when permittedClasses changes
  useEffect(() => {
    setSelectedIds(normalizeToSet(permittedClasses));
  }, [permittedClasses]);

  // Toggle one class
  const toggleClass = (classId) => {
    classId = String(classId);
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      newSet.has(classId) ? newSet.delete(classId) : newSet.add(classId);
      return newSet;
    });
  };

  // Select all
  const selectAll = () => {
    const all = standards.flatMap(std =>
      (std.classes || []).map(c => String(c.id))
    );
    setSelectedIds(new Set(all));
  };

  // Deselect all
  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  // All classes
  const allClasses = useMemo(() => {
    return standards.flatMap(std => std.classes || []);
  }, [standards]);

  const selectedClasses = useMemo(() => {
    return allClasses.filter(c => selectedIds.has(String(c.id)));
  }, [selectedIds, allClasses]);

  // Save
  const handleSave = () => {
    const result = Array.from(selectedIds).map(id => {
      const c = allClasses.find(cls => String(cls.id) === id);
      return { id: c.id, name: c.name };
    });


    onSave?.(result);
  };

  return (
    <div className="fixed inset-0 backdrop-blur bg-black/5 flex items-center justify-center z-50 p-4">
      <div className="border border-accent ring-2 bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className=" bg-gradient-to-br from-blue-900 to-blue-950 px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Edit Class Permissions
            </h1>
            <p className="text-blue-100 text-sm">
              {staff?.name
                ? `Managing permissions for ${staff.name}`
                : 'Select classes to permit'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Controls */}
        <div className="px-6 py-4 bg-gray-50 border-b flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">
              {selectedIds.size}
            </span> of {allClasses.length} classes selected
          </div>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Select All
            </button>
            <button
              onClick={deselectAll}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Deselect All
            </button>
          </div>
        </div>
 {selectedIds.size > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Selected Classes ({selectedIds.size}):
              </h3>

              <div className="flex flex-wrap gap-2">
                {selectedClasses.map(c => (
                  <span
                    key={c.id}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        {/* Scrollable Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {standards.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No standards available
              </div>
            ) : (
              <div className="space-y-6">
                {standards.map(standard => {
                  const classes = standard.classes || [];
                  if (classes.length === 0) return null;

                  return (
                    <div key={standard.id} className="space-y-3">
                      <div className="flex items-center gap-3 mb-3">
                        <h2 className="text-lg font-bold text-gray-900">
                          Standard {standard.name}
                        </h2>
                        <span className="text-sm text-gray-500">
                          ({classes.length} {classes.length === 1 ? "class" : "classes"})
                        </span>
                      </div>

                      {classes.map(classItem => {
                        const idStr = String(classItem.id);
                        const isSelected = selectedIds.has(idStr);

                        return (
                          <div
                            key={idStr}
                            onClick={() => toggleClass(idStr)}
                            className={`
                              relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all
                              ${isSelected
                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'}
                            `}
                          >
                            <div className="flex-shrink-0 mr-4">
                              <div
                                className={`
                                  w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors
                                  ${isSelected
                                    ? 'bg-blue-600 border-blue-600'
                                    : 'border-gray-300 bg-white'}
                                `}
                              >
                                {isSelected && (
                                  <Check className="w-4 h-4 text-white" />
                                )}
                              </div>
                            </div>

                            <div className="flex-grow">
                              <div className="flex items-center gap-3">
                                <h3 className="text-base font-semibold text-gray-900">
                                  {classItem.name}
                                </h3>
                              </div>
                            </div>

                            {isSelected && (
                              <div className="flex-shrink-0 ml-4">
                                <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                                  Selected
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

         
        </div>

        <div className="px-6 py-4 bg-white border-t flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-gradient-to-br from-blue-900 to-blue-950 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            Save Selection
          </button>
        </div>
      </div>
    </div>
  );
}
