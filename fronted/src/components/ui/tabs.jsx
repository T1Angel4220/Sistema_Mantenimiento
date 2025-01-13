import React, { useState } from 'react';

export const Tabs = ({ defaultValue, children, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  return (
    <div className={className}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          activeTab,
          onTabChange: handleTabChange,
        })
      )}
    </div>
  );
};

export const TabsList = ({ children, className }) => {
  return <div className={`tabs-list ${className}`}>{children}</div>;
};

export const TabsTrigger = ({ value, activeTab, onTabChange, children }) => {
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => onTabChange(value)}
      className={`tabs-trigger ${isActive ? 'active' : ''}`}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, activeTab, children, className }) => {
  if (activeTab !== value) return null;

  return <div className={`tabs-content ${className}`}>{children}</div>;
};
