import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-[20px] border-[1.5px] border-white bg-white/50 backdrop-blur-md px-4 py-2 text-[14px] font-semibold transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--text-muted)]/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--primary)]/15 focus-visible:border-[var(--primary)]/50 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
