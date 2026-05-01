import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className, ...props }: InputProps) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-text-primary mb-1.5">
        {label}
      </label>
    )}
    <input
      className={cn(
        'w-full px-3 py-2.5 text-sm bg-bg-card border rounded-md transition-colors',
        'text-text-primary placeholder:text-text-muted-version-2',
        'focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent',
        error ? 'border-red-500' : 'border-border-light',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);
