import React from 'react';

const PageWrapper = ({ children, className = '' }) => {
  return (
    <div className={`content-container py-6 ${className}`.trim()}>
      {children}
    </div>
  );
};

export default PageWrapper;
