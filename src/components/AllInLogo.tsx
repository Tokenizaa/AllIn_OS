import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const AllInLogo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Foot shape */}
        <path
          d="M50 10 C30 10 15 25 15 45 C15 65 25 80 40 85 C45 87 50 88 55 87 C70 82 80 67 80 47 C80 27 65 10 50 10 Z"
          fill="currentColor"
          className="text-allin-orange"
        />
        {/* Therapeutic lines */}
        <path
          d="M30 40 L45 55 L55 45 L70 60"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          className="text-allin-dark dark:text-allin-white"
        />
        <path
          d="M35 50 L45 60 L55 50 L65 60"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          className="text-allin-dark dark:text-allin-white"
        />
        {/* Text */}
        <text
          x="50"
          y="95"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill="currentColor"
          className="text-allin-dark dark:text-allin-white"
        >
          ALL IN
        </text>
      </svg>
    </div>
  );
};

export default AllInLogo;
