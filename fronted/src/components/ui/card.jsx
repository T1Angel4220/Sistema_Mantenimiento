import React from 'react';

export const Card = ({ children, className }) => (
  <div className={`card ${className}`}>{children}</div>
);

export const CardHeader = ({ children, className }) => (
  <div className={`card-header ${className}`}>{children}</div>
);

export const CardContent = ({ children, className }) => (
  <div className={`card-content ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className }) => (
  <h2 className={`card-title ${className}`}>{children}</h2>
);
export default { Card, CardContent, CardHeader, CardTitle };

