import React, { useState } from "react";

export function Select({ children, value, onChange, placeholder, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border rounded-md px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {value || placeholder}
      </button>
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border rounded-md shadow-lg z-10">
          {React.Children.map(children, (child) =>
            React.cloneElement(child, {
              onClick: () => {
                onChange(child.props.value);
                setIsOpen(false);
              },
            })
          )}
        </div>
      )}
    </div>
  );
}

export function SelectItem({ value, children, onClick }) {
  return (
    <div
      onClick={onClick}
      className="px-3 py-2 hover:bg-blue-500 hover:text-white cursor-pointer"
    >
      {children}
    </div>
  );
}

export function SelectTrigger({ children }) {
  return <>{children}</>;
}

export function SelectContent({ children }) {
  return <>{children}</>;
}

export function SelectValue({ placeholder, value }) {
  return <span>{value || placeholder}</span>;
}
