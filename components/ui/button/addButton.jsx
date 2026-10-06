import React from "react";
//=========================================================================================
export function AddButton({ children, variant = "default", ...props }) {
  //=========================================================================================
  return (
    <button
      className={`cursor-pointer font-semibold  ml-2 flex items-center justify-center ${props.fullwidth ? 'w-full' : 'w-fit'} bg-accent text-white rounded-md p-2 mt-4 shadow hover:bg-accent-muted hover:text-accent hover:border  hover:border-accent transition active:scale-95`}
      {...props}>
      {children}
    </button>
  );
}
//=========================================================================================
