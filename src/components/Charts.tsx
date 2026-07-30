'use client';

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  showValues?: boolean;
  format?: (n: number) => string;
}

export default function BarChart({ data, height = 200, showValues = true, format }: BarChartProps) {
  const max = Math.max(...data.map(d => d.value), 1);
  const fmt = format || ((n: number) => String(n));

  return (
    <div className="w-full">
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((d, i) => {
          const pct = (d.value / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
              {showValues && d.value > 0 && (
                <span className="text-[10px] font-bold text-gray-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{fmt(d.value)}</span>
              )}
              <div
                className={`w-full rounded-t-lg transition-all duration-500 group-hover:opacity-80 ${d.color || 'bg-orange-400'}`}
                style={{ height: `${Math.max(pct, 4)}%` }}
              ></div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 mt-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center">
            <span className="text-[10px] text-gray-500 leading-tight block truncate">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DonutChartProps {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
}

export function DonutChart({ segments, size = 120, thickness = 16 }: DonutChartProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} className="transform -rotate-90">
        {segments.map((seg, i) => {
          const pct = (seg.value / total) * circumference;
          const dashArray = `${pct} ${circumference - pct}`;
          const dashOffset = -offset;
          offset += pct;
          return (
            <circle key={i} cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={seg.color}
              strokeWidth={thickness} strokeDasharray={dashArray} strokeDashoffset={dashOffset}
              className="transition-all duration-700" />
          );
        })}
      </svg>
      <div className="space-y-1.5">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: seg.color }}></div>
            <span className="text-xs text-gray-600">{seg.label}</span>
            <span className="text-xs font-bold text-gray-900">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SparkLineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export function SparkLine({ data, color = '#f97316', width = 80, height = 24 }: SparkLineProps) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data) || 1;
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="inline-block">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
