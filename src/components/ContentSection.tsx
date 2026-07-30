'use client';

interface ContentSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  divider?: boolean;
  action?: React.ReactNode;
  className?: string;
}

export default function ContentSection({
  title,
  description,
  children,
  divider = false,
  action,
  className = '',
}: ContentSectionProps) {
  return (
    <section className={`${divider ? 'border-t border-gray-200 pt-6' : ''} ${className}`}>
      {(title || description || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div className="min-w-0">
            {title && (
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            )}
            {description && (
              <p className="text-sm text-gray-500 mt-0.5">{description}</p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
