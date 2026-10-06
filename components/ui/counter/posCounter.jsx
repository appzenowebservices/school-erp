import { useState } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";

export default function POSCounter({ value = 0, onChange, min = 0, max = 99 }) {
  const [count, setCount] = useState(value);

  const updateCount = (delta) => {
    const newCount = Math.max(min, Math.min(max, count + delta));
    setCount(newCount);
    onChange?.(newCount);
  };

  return (
    <div className="flex items-center gap-4 bg-white rounded-xl  px-4 py-2 shadow-inner shadow-inner-lg shadow mb-4 w-fit">
      <button
        onClick={() => updateCount(-1)}
        disabled={count === min}
        className="w-5 h-5 flex items-center justify-center text-xl font-bold bg-gray-100 hover:bg-gray-200 rounded-full disabled:opacity-50"
      >
        <BiMinus size={18} />
      </button>

      <span className="min-w-[40px] text-center text-xl font-semibold text-gray-800">
        {count}
      </span>

      <button
        onClick={() => updateCount(1)}
        disabled={count === max}
        className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-accent text-white hover:bg-accent-muted rounded-full disabled:opacity-50"
      >
        <BiPlus size={18} />
      </button>
    </div>
  );
}
