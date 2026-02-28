type SpinnerProps = {
  className?: string;
};

export function Spinner({ className = "" }: SpinnerProps) {
  return (
    <div className={`relative ${className}`} role="status" aria-label="Carregando">
      {/* Outer ring – accent track */}
      <div className="h-12 w-12 rounded-full border-4 border-accent-200" />
      {/* Spinning arc */}
      <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-accent-600" />
      {/* Roboto face in the center */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute inset-0 m-auto h-5 w-5 text-accent-600"
        aria-hidden
      >
        <rect x="4" y="6" width="16" height="12" rx="3" ry="3" />
        <circle cx="9" cy="11" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="15" cy="11" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
}
