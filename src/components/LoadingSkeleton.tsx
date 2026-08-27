export default function LoadingSkeleton({ height = 'h-64' }: { height?: string }) {
  return (
    <div className={`${height} w-full animate-pulse bg-slate-800/50 rounded-xl`} />
  );
}
