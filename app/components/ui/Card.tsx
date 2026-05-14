import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  className = '',
  style,
  hover = true,
  padding = 'md',
}: CardProps) {
  const pad =
    padding === 'sm' ? 'p-4' : padding === 'lg' ? 'p-8' : 'p-5 sm:p-6';

  return (
    <div
      className={`panel ${pad} transition-colors duration-200 ${
        hover ? 'hover:border-hairline-strong' : ''
      } ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
