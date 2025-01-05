import React from "react";

const Alert = ({ children, type = "info" }) => {
  const typeStyles = {
    info: "bg-blue-100 text-blue-800 border-blue-300",
    success: "bg-green-100 text-green-800 border-green-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
    error: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <div
      className={`border-l-4 p-4 rounded mb-4 ${typeStyles[type]}`}
      role="alert"
    >
      {children}
    </div>
  );
};

const AlertTitle = ({ children }) => (
  <div className="font-bold text-lg mb-2">{children}</div>
);

const AlertDescription = ({ children }) => (
  <div className="text-sm">{children}</div>
);

export { Alert, AlertTitle, AlertDescription };
