import { useState } from "react";
import { CiSquareCheck } from "react-icons/ci";

const themes = [
  { id: "dark", name: "Dark", color: "#1E293B" },
  { id: "light", name: "Light", color: "#FFFFFF" },
];

export default function ThemeSelector() {
  const [selectedTheme, setSelectedTheme] = useState("light");
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    document.documentElement.className = theme;
    setIsOpen(false);
  };

  return (
    <div className="relative w-72">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center bg-white text-gray-700 py-3 px-4 rounded-xl shadow-lg transition-all hover:bg-gray-100 focus:outline-none"
      >
        <span>{themes.find((t) => t.id === selectedTheme)?.name} Theme</span>
        <CiSquareCheck size={24} />
      </button>

      {isOpen && (
        <div className="absolute mt-3 w-full bg-white rounded-xl shadow-xl border border-gray-200 z-[var(--z-index-overlay)] overflow-hidden">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`flex items-center justify-between w-full text-left px-6 py-4 transition-all ${
                selectedTheme === theme.id
                  ? "bg-gray-200 font-semibold text-[var(--color-primary)]"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: theme.color }}
                ></span>
                {theme.name}
              </div>
              {selectedTheme === theme.id && <CiSquareCheck size={20} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}