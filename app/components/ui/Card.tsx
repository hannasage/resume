import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hover?: boolean;
}

export default function Card({ children, className = '', style, hover = true }: CardProps) {
  const hasGlass = className.includes('glass');
  
  return (
    <div 
      className={`p-6 rounded-lg shadow-lg ${hover ? 'hover:shadow-xl' : ''} transition-shadow duration-300 ${className}`}
      style={hasGlass ? style : { backgroundColor: 'var(--color-background)', ...style }}
    >
      {children}
    </div>
  );
}