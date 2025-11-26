import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/utils.js';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--color-primary)] text-[var(--color-base)] hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)]',
        secondary:
          'bg-[var(--color-secondary)] text-[var(--color-base)] hover:bg-[var(--color-secondary-hover)] active:bg-[var(--color-secondary-active)]',
        outline:
          'border border-[var(--color-surface-plus)] bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]',
        ghost:
          'text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]',
        destructive:
          'bg-[var(--color-error)] text-[var(--color-text-primary)] hover:bg-[var(--color-error)]/90',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
