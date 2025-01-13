import React from 'react';

export const ScrollArea = ({ children, className, style }) => {
  return (
    <div
      className={`scroll-area ${className}`}
      style={{
        overflowY: 'auto',
        maxHeight: '400px',
        padding: '10px',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
