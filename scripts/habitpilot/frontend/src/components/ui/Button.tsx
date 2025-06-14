import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Button variants using class-variance-authority
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
        success: 'bg-success-500 text-white hover:bg-success-600 focus-visible:ring-success-500',
        destructive: 'bg-error-500 text-white hover:bg-error-600 focus-visible:ring-error-500',
        outline: 'border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-400 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800',
        ghost: 'text-gray-900 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-400 dark:text-gray-100 dark:hover:bg-gray-800',
        link: 'text-primary-500 underline-offset-4 hover:underline focus-visible:ring-primary-500',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth,
    asChild = false, 
    loading = false,
    disabled,
    leftIcon,
    rightIcon,
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? 'span' : 'button';
    
    return (
      <Comp
        className={buttonVariants({ variant, size, fullWidth, className })}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner className="mr-2" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

// Loading spinner component
const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={`animate-spin h-4 w-4 ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// Export button variants for external use
export { buttonVariants };
export default Button;

// Usage examples:
// <Button>Default Button</Button>
// <Button variant="secondary" size="lg">Large Secondary</Button>
// <Button variant="success" leftIcon={<CheckIcon />}>Complete Task</Button>
// <Button loading disabled>Saving...</Button>
// <Button variant="destructive" size="icon"><TrashIcon /></Button>