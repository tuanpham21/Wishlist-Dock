import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef, type ReactNode } from 'react';
import { useWishlistStore } from '../../store/wishlistStore';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const theme = useWishlistStore(state => state.theme);

    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-medium rounded-xl transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const darkVariants = {
      primary: `
        bg-gradient-to-r from-violet-500 to-purple-600
        text-white shadow-lg shadow-violet-500/25
        hover:shadow-violet-500/40 hover:scale-[1.02]
        focus:ring-violet-500
      `,
      secondary: `
        bg-white/10 backdrop-blur-sm text-white
        border border-white/20
        hover:bg-white/20 hover:border-white/30
        focus:ring-white/50
      `,
      ghost: `
        text-white/70 hover:text-white hover:bg-white/10
        focus:ring-white/30
      `,
      danger: `
        bg-gradient-to-r from-red-500 to-rose-600
        text-white shadow-lg shadow-red-500/25
        hover:shadow-red-500/40 hover:scale-[1.02]
        focus:ring-red-500
      `,
    };

    const lightVariants = {
      primary: `
        bg-gradient-to-r from-violet-500 to-purple-600
        text-white shadow-lg shadow-violet-500/25
        hover:shadow-violet-500/40 hover:scale-[1.02]
        focus:ring-violet-500
      `,
      secondary: `
        bg-gray-100 text-gray-900
        border border-gray-200
        hover:bg-gray-200 hover:border-gray-300
        focus:ring-gray-300
      `,
      ghost: `
        text-gray-600 hover:text-gray-900 hover:bg-gray-100
        focus:ring-gray-300
      `,
      danger: `
        bg-gradient-to-r from-red-500 to-rose-600
        text-white shadow-lg shadow-red-500/25
        hover:shadow-red-500/40 hover:scale-[1.02]
        focus:ring-red-500
      `,
    };

    const variants = theme === 'dark' ? darkVariants : lightVariants;
    
    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };
    
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
