import React from "react";

//==========================================================================================
export function IconLabelButton({
  children,
  className,
  variant = "default",
  disabled,
  label,
  ...props
}) {
  //==========================================================================================
  return (
    <button
      className={`group cursor-pointer font-semibold flex items-center justify-center gap-2
        ${props.fullwidth ? "w-full" : "w-fit"}
        bg-accent hover:bg-accent-muted rounded-md p-2 shadow hover:border hover:border-accent transition active:scale-95
        ${disabled ? "opacity-50 cursor-not-allowed hover:bg-accent" : ""} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}

      {label && (
        <p className="text-sm text-white font-medium group-hover:text-accent transition-colors duration-200">
          {label}
        </p>
      )}
    </button>
  );
}
//==========================================================================================
