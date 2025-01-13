import React, { useState } from "react";
import './tabs.css'
export const Tabs = ({ defaultValue, className, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const tabsList = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type.displayName === "TabsList"
  );
  const tabsContent = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type.displayName === "TabsContent"
  );

  return (
    <div className={className}>
      {tabsList &&
        React.cloneElement(tabsList, { activeTab, onClick: handleTabChange })}
      <div className="tabs-content-container">
        {tabsContent.map((content) => (
          <div
            key={content.props.value}
            className={`tabs-content ${
              activeTab === content.props.value ? "active" : "hidden"
            }`}
          >
            {content}
          </div>
        ))}
      </div>
    </div>
  );
};

export const TabsList = ({ children, activeTab, onClick }) => (
  <div className="tabs-list flex space-x-4">
    {React.Children.map(children, (child) =>
      React.isValidElement(child)
        ? React.cloneElement(child, { activeTab, onClick })
        : child
    )}
  </div>
);

export const TabsTrigger = ({ value, activeTab, onClick, children }) => {
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => onClick(value)}
      className={`tabs-trigger px-4 py-2 rounded-t-md font-bold ${
        isActive
          ? "bg-blue-500 text-white border-b-2 border-blue-500"
          : "bg-gray-200 text-gray-700"
      }`}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children }) => (
  <div className="p-4">{children}</div>
);
TabsList.displayName = "TabsList";
TabsTrigger.displayName = "TabsTrigger";
TabsContent.displayName = "TabsContent";
