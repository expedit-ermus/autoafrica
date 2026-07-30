'use client';

interface StatItem {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface StatsGridProps {
  stats: StatItem[];
  className?: string;
}

export default function StatsGrid({ stats, className = '' }: StatsGridProps) {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg flex-shrink-0">
              {stat.icon}
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{stat.value}</p>
              <p className="text-xs sm:text-sm text-gray-500 truncate">{stat.label}</p>
            </div>
          </div>
          {stat.trend && (
            <div className="mt-3 flex items-center gap-1 text-xs">
              <span
                className={
                  stat.trend.isPositive ? 'text-green-600' : 'text-red-600'
                }
              >
                {stat.trend.isPositive ? '↑' : '↓'} {Math.abs(stat.trend.value)}%
              </span>
              <span className="text-gray-400">vs last period</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
