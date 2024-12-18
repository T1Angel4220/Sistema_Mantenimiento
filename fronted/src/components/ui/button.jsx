import React from "react";

export function Button({ children, onClick, variant = "default", ...props }) {
  const baseClass = "px-4 py-2 rounded font-medium focus:outline-none";
  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
  };

  return (
    <button
      className={`${baseClass} ${variants[variant] || variants.default}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
