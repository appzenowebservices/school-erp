import { useState } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";

export default function AddonItem({ title, price, onChange }) {
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);

  const toggleActive = () => {
    if (!active) {
      setActive(true);
      setCount(1);
      onChange?.(1);
    }
  };

  const handleChange = (val) => {
    const updated = Math.max(0, count + val);
    setCount(updated);
    if (onChange) onChange(updated);
    if (updated === 0) setActive(false); // auto-hide if count is 0
  };

  return (
    <div
      onClick={toggleActive}
      className={`
        group flex items-center justify-between 
        rounded-lg border p-4 mb-3 cursor-pointer transition-all duration-200
        ${active
          ? "bg-accent/10 border-accent ring-2 ring-accent/30"
          : "bg-white/60 hover:bg-gray-50 border-gray-200"
        }
      `}
    >
      <div>
        <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
        <p className="text-xs text-gray-500">${price}</p>
      </div>

      {active && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2"
        >
          <button
            onClick={() => handleChange(-1)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700"
          >
            <BiMinus size={16} />
          </button>
          <span className="w-6 text-center text-sm font-medium">{count}</span>
          <button
            onClick={() => handleChange(1)}
            className="w-8 h-8 rounded-full bg-accent text-white hover:bg-accent/90 flex items-center justify-center"
          >
            <BiPlus size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
