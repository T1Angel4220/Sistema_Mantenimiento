import React, { useState, useRef } from "react";

export function Popover({ children, className = "" }) {
  return (
    <div className={`relative inline-block ${className}`}>
      {children}
    </div>
  );
}

export function PopoverTrigger({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer"
    >
      {children}
    </div>
  );
}

export function PopoverContent({ children, className = "" }) {
  return (
    <div
      className={`absolute mt-2 p-4 bg-white border border-gray-200 rounded shadow-lg z-10 ${className}`}
    >
      {children}
    </div>
  );
}
