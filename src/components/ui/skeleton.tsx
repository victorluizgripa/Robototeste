type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-accent-100/50 ${className}`}
      aria-hidden="true"
    />
  );
}
