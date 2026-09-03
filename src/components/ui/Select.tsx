import { type SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'flex h-14 w-full rounded-2xl border-2 border-[var(--border-color)] bg-white px-5 py-3 text-base text-[var(--text-color)] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:border-[var(--primary)] focus-visible:ring-4 focus-visible:ring-[var(--primary)]/10 disabled:cursor-not-allowed disabled:opacity-50 appearance-none hover:border-gray-300 cursor-pointer',
          className
        )}
        {...props}
      />
    );
  }
);
Select.displayName = 'Select';
