import React from "react";

export function Textarea({ placeholder, value, onChange, className = "", ...props }) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${className}`}
      rows="4"
      {...props}
    ></textarea>
  );
}
