import React from 'react';

const Badge = ({ variant = "default", children }) => {
  const styles = {
    default: "bg-blue-500 text-white rounded-full px-2 py-1 text-xs",
    secondary: "bg-gray-300 text-black rounded-full px-2 py-1 text-xs",
  };

  return <span className={styles[variant] || styles.default}>{children}</span>;
};

export default Badge;
