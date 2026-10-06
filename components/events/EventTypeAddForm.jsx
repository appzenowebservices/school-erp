"use client";
import React, { useState } from "react";
import { Check, X, Palette, PlusCircle } from "lucide-react";

const EventTypeAddForm = ({ onSave, onBack }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "#2563eb",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Event name is required.");

    try {
      setLoading(true);
      await onSave?.(form);
      setForm({ name: "", description: "", color: "#2563eb" }); // reset after save
      onBack?.();
    } catch (err) {
      console.error(err);
      alert("Failed to create event type.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 flex flex-col gap-5 text-gray-800 animate-fadeIn"
    >
      <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-indigo-600" />
        Add New Event Type
      </h4>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-600">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter event type name"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-600">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="Describe this event type..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-600">Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            name="color"
            value={form.color}
            onChange={handleChange}
            className="w-12 h-12 rounded-md border cursor-pointer"
          />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Palette className="w-4 h-4 text-gray-500" />
            <span>{form.color}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end mt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
        >
          <Check className="w-4 h-4" />
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
};

export default EventTypeAddForm;
