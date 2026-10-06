import React from "react";
//==========================================================================================
export function IconButton({ children, className, variant = "default", disabled, ...props }) {
  //==========================================================================================
  return (
    <button
      className={` cursor-pointer font-semibold flex items-center justify-center ${props.fullwidth ? "w-full" : "w-fit"
        } bg-accent text-white rounded-md p-2  shadow hover:bg-accent-muted hover:text-accent hover:border hover:border-accent transition active:scale-95
        ${disabled ? "opacity-50 cursor-not-allowed hover:bg-accent" : ""}
      `}
      disabled={disabled} // Disables the button
      {...props}
    >
      {children}
    </button>
  );
}
//==========================================================================================