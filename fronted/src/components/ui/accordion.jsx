import React, { useState } from 'react';

export const Accordion = ({ children, type = 'single', ...props }) => {
  return <div {...props}>{children}</div>;
};

export const AccordionItem = ({ children, value, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div {...props}>
      {React.Children.map(children, (child) => {
        if (child.type.name === 'AccordionTrigger') {
          return React.cloneElement(child, { isOpen, onClick: () => setIsOpen(!isOpen) });
        }
        if (child.type.name === 'AccordionContent') {
          return React.cloneElement(child, { isOpen });
        }
        return child;
      })}
    </div>
  );
};

export const AccordionTrigger = ({ children, isOpen, onClick, ...props }) => {
  return (
    <div onClick={onClick} style={{ cursor: 'pointer' }} {...props}>
      {children}
      <span style={{ marginLeft: '10px' }}>{isOpen ? '▼' : '▶'}</span>
    </div>
  );
};

export const AccordionContent = ({ children, isOpen, ...props }) => {
  if (!isOpen) return null;
  return <div {...props}>{children}</div>;
};
