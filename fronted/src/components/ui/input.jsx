import React from "react";

export function Input({ type = "text", placeholder, value, onChange, ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
      {...props}
    />
  );
  
}

