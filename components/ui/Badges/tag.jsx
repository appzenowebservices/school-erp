"use client"

import { useState } from "react";
import { FaTags, FaPlus } from "react-icons/fa";
import { Input } from "../input/input";
//=========================================================================================

export default function TagsSection() {
  const [tags, setTags] = useState([]);

  const addTag = (event) => {
    if (event.key === "Enter" && event.target.value.trim() !== "") {
      setTags([...tags, event.target.value.trim()]);
      event.target.value = "";
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };
  //=========================================================================================

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-4  text-primary-text-inverse">
      <h3 className="text-lg font-medium flex items-center">
        <FaTags className="mr-2 text-primary-text" /> Tags
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <p key={index} className="flex items-center bg-accent text-primary-text-inverse font-bold text-sm px-3 py-1 rounded-full shadow-md">
            {tag}
            <button
              onClick={() => removeTag(index)}
              className="ml-2 text-background focus:outline-none"
            >
              ✕
            </button>
          </p>
        ))}
      </div>
      <Input
        type="text"
        placeholder="Type and press Enter..."
        className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-md p-3 shadow-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
        onKeyDown={addTag}
      />

    </div>
  );
}
//=========================================================================================
