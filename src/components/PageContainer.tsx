'use client';

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
  safeArea?: boolean;
  bgColor?: string;
  className?: string;
}

export default function PageContainer({
  children,
  maxWidth = 'xl',
  padding = true,
  safeArea = true,
  bgColor = 'bg-gray-50',
  className = '',
}: PageContainerProps) {
  const widthClass =
    maxWidth === 'sm'
      ? 'sm:max-w-sm'
      : maxWidth === 'md'
        ? 'sm:max-w-md'
        : maxWidth === 'lg'
          ? 'sm:max-w-4xl'
          : maxWidth === 'xl'
            ? 'sm:max-w-6xl'
            : maxWidth === '2xl'
              ? 'sm:max-w-7xl'
              : '';

  return (
    <div
      className={`
        min-h-screen ${bgColor}
        ${safeArea ? 'pb-safe' : ''}
        ${className}
      `}
    >
      <div className={`mx-auto w-full ${widthClass} ${padding ? 'px-4 sm:px-6 lg:px-8 py-6 sm:py-8' : ''}`}>
        {children}
      </div>
    </div>
  );
}
