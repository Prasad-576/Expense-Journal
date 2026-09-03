import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'danger';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-bold transition-all duration-300 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
          {
            'glass-button text-white hover:opacity-90': variant === 'default',
            'bg-white/70 backdrop-blur-md border-[1.5px] border-white text-[var(--text-color)] hover:bg-white shadow-sm': variant === 'outline',
            'hover:bg-[var(--secondary)]/10 text-[var(--text-muted)] hover:text-[var(--primary)]': variant === 'ghost',
            'bg-[var(--danger)] text-white hover:bg-[#C2584A] shadow-[var(--shadow-soft)]': variant === 'danger',
            'h-11 px-5 rounded-[20px] text-[15px]': size === 'default',
            'h-9 px-4 rounded-[14px] text-sm': size === 'sm',
            'h-12 px-6 text-base rounded-[24px]': size === 'lg',
            'h-11 w-11 rounded-full': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
