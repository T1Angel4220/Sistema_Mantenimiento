import React from 'react';

const Card = ({ title, children, footer, className = '', ...props }) => {
  return (
    <div className={`border rounded-lg shadow-md p-4 bg-white ${className}`} {...props}>
      {title && <div className="mb-4 text-xl font-bold">{title}</div>}
      <div className="mb-4">{children}</div>
      {footer && <div className="border-t pt-2">{footer}</div>}
    </div>
  );
};

export default Card;
