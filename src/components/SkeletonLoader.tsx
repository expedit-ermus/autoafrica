'use client';

interface SkeletonLoaderProps {
  variant?: 'card' | 'table-row' | 'text' | 'avatar' | 'custom';
  lines?: number;
  className?: string;
  children?: React.ReactNode;
}

function SkeletonPulse({ className = '' }: { className?: string }) {
  return (
    <div
      className={`
        bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
        bg-[length:200%_100%]
        animate-[shimmer_1.5s_ease-in-out_infinite]
        rounded
        ${className}
      `}
    />
  );
}

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
      <div className="flex items-center gap-3">
        <SkeletonPulse className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonPulse className="h-4 w-1/3" />
          <SkeletonPulse className="h-3 w-1/2" />
        </div>
      </div>
      <SkeletonPulse className="h-32 w-full rounded-xl" />
      <div className="space-y-2">
        <SkeletonPulse className="h-3 w-full" />
        <SkeletonPulse className="h-3 w-4/5" />
        <SkeletonPulse className="h-3 w-2/3" />
      </div>
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-100">
      <SkeletonPulse className="w-8 h-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonPulse className="h-4 w-1/4" />
        <SkeletonPulse className="h-3 w-1/3" />
      </div>
      <SkeletonPulse className="h-6 w-16 rounded-full" />
      <SkeletonPulse className="h-4 w-20" />
    </div>
  );
}

function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonPulse
          key={i}
          className={`h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

function AvatarSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <SkeletonPulse className="w-12 h-12 rounded-full flex-shrink-0" />
      <div className="space-y-2">
        <SkeletonPulse className="h-4 w-24" />
        <SkeletonPulse className="h-3 w-16" />
      </div>
    </div>
  );
}

export default function SkeletonLoader({
  variant = 'text',
  lines = 3,
  className = '',
  children,
}: SkeletonLoaderProps) {
  if (variant === 'custom' && children) {
    return <div className={`${className}`}>{children}</div>;
  }

  return (
    <div className={`${className}`}>
      {variant === 'card' && <CardSkeleton />}
      {variant === 'table-row' && <TableRowSkeleton />}
      {variant === 'text' && <TextSkeleton lines={lines} />}
      {variant === 'avatar' && <AvatarSkeleton />}
    </div>
  );
}

export { SkeletonPulse, CardSkeleton, TableRowSkeleton, TextSkeleton, AvatarSkeleton };
