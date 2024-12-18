import React from "react";

export function RadioGroup({ value, onValueChange, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          checked: child.props.value === value,
          onChange: () => onValueChange(child.props.value),
        })
      )}
    </div>
  );
}

export function RadioGroupItem({ value, id, checked, onChange }) {
  return (
    <div className="flex items-center space-x-2">
      <input
        id={id}
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
      />
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {value}
      </label>
    </div>
  );
}
