import React from "react";

export function PriceButton({
  label ,
  price ,
  fullwidth ,
  ...props
}) {
  return (
    <button
      className={`
        flex items-center justify-between gap-3 
        px-4 py-2 rounded-md font-semibold text-sm shadow
        transition-all duration-150 active:scale-95 
        ${fullwidth ==='true' ? "w-full" : "w-fit"} 
        bg-accent text-white hover:bg-accent-muted hover:text-accent hover:border hover:border-accent
      `}
      {...props}
    >
      <span>{label}</span>
      <span className="bg-green-100 text-green-500 text-md font-semibold px-3 py-1 rounded-md shadow-sm">
        ₹{price}
      </span>
    </button>
  );
}
