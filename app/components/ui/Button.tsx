import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'social';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-mono font-medium uppercase tracking-widest2 transition-colors duration-150 rounded-sm border';

  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'btn-primary-cta',
    secondary: 'btn-secondary-cta',
    ghost:
      'bg-transparent border-transparent text-ink-dim hover:text-accent',
    social:
      'rounded-full p-2 border-transparent text-ink-dim hover:text-accent hover:border-hairline-strong',
  };

  const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'px-3 py-1.5 text-[11px]',
    md: 'px-4 py-2 text-[12px]',
    lg: 'px-5 py-2.5 text-[13px]',
  };

  const classes =
    variant === 'social'
      ? `${variants[variant]} ${className}`
      : `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
