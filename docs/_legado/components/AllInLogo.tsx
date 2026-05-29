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
        {/* Círculo externo representando movimento/contorno */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-allin-orange"
          opacity="0.3"
        />

        {/* Símbolo central - representação de pé com tecnologia */}
        <g transform="translate(50, 50)">
          {/* Base do pé */}
          <ellipse
            cx="0"
            cy="15"
            rx="25"
            ry="12"
            fill="currentColor"
            className="text-allin-orange"
          />

          {/* Parte superior do pé */}
          <ellipse
            cx="0"
            cy="-5"
            rx="20"
            ry="15"
            fill="currentColor"
            className="text-allin-orange"
            opacity="0.8"
          />

          {/* Linhas representando tecnologia terapêutica */}
          <g stroke="currentColor" strokeWidth="1.5" className="text-allin-orange" opacity="0.6">
            {/* Linha de magnetoterapia */}
            <line x1="-15" y1="5" x2="15" y2="5" />
            <circle cx="-10" cy="5" r="2" fill="currentColor" className="text-allin-orange" />
            <circle cx="10" cy="5" r="2" fill="currentColor" className="text-allin-orange" />

            {/* Linha de infravermelho */}
            <line x1="-12" y1="15" x2="12" y2="15" />
            <circle cx="-8" cy="15" r="1.5" fill="currentColor" className="text-allin-orange" />
            <circle cx="8" cy="15" r="1.5" fill="currentColor" className="text-allin-orange" />

            {/* Linha central representando equilíbrio */}
            <line x1="0" y1="-10" x2="0" y2="20" strokeDasharray="2,2" />
          </g>
        </g>

        {/* Texto "ALL IN" estilizado */}
        <text
          x="50"
          y="85"
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