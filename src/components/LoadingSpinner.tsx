'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  centered?: boolean;
  className?: string;
}

export default function LoadingSpinner({
  size = 'md',
  text,
  centered = false,
  className = '',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div
      className={`
        flex flex-col items-center justify-center gap-3
        ${centered ? 'min-h-[200px]' : ''}
        ${className}
      `}
    >
      <div
        className={`
          ${sizeClasses[size]}
          border-orange-200 border-t-orange-500
          rounded-full animate-spin
        `}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className={`${textSizeClasses[size]} text-gray-500 font-medium animate-pulse`}>
          {text}
        </p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
