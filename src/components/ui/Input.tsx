import { forwardRef, type InputHTMLAttributes } from 'react';
import { useWishlistStore } from '../../store/wishlistStore';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const theme = useWishlistStore(state => state.theme);

    const inputStyles = theme === 'dark'
      ? `bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/40`
      : `bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400`;

    const labelStyles = theme === 'dark' ? 'text-white/80' : 'text-gray-700';

    return (
      <div className="w-full">
        {label && (
          <label className={`block text-sm font-medium ${labelStyles} mb-1.5`}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-xl
            ${inputStyles}
            focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
            transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const theme = useWishlistStore(state => state.theme);

    const textareaStyles = theme === 'dark'
      ? `bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/40`
      : `bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400`;

    const labelStyles = theme === 'dark' ? 'text-white/80' : 'text-gray-700';

    return (
      <div className="w-full">
        {label && (
          <label className={`block text-sm font-medium ${labelStyles} mb-1.5`}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-xl
            ${textareaStyles}
            focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
            transition-all duration-200 resize-none
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
