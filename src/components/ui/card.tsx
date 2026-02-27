type CardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
};

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface shadow-card ${
        hover ? "transition-all hover:shadow-card-hover hover:border-border-hover" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
