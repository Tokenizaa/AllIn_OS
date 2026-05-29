import React from 'react';

interface BackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const Background: React.FC<BackgroundProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-allin-bg-dark-1 to-allin-bg-dark-2 dark:from-allin-bg-dark-1 dark:to-allin-bg-dark-2" />
      <div className="absolute inset-0 bg-gradient-to-br from-allin-orange/5 to-transparent dark:from-allin-orange/10"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-allin-orange/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-allin-orange/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      {children}
    </div>
  );
};

export default Background;
