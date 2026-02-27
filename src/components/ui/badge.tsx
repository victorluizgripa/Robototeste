type BadgeVariant = "default" | "accent" | "success" | "error";

type BadgeProps = {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
};

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: "bg-surface-2 text-txt-2 border-border",
  accent: "bg-accent-50 text-accent-700 border-accent-200",
  success: "bg-success-bg text-success-text border-success-border",
  error: "bg-error-bg text-error-text border-error-border",
};

export function Badge({
  variant = "default",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
