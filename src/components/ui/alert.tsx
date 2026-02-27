type AlertVariant = "info" | "success" | "warning" | "error";

type AlertProps = {
  variant?: AlertVariant;
  children: React.ReactNode;
  className?: string;
};

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  info: "bg-accent-50 text-accent-900 border-accent-200",
  success: "bg-success-bg text-success-text border-success-border",
  warning: "bg-warning-bg text-warning-text border-warning-border",
  error: "bg-error-bg text-error-text border-error-border",
};

export function Alert({
  variant = "info",
  children,
  className = "",
}: AlertProps) {
  return (
    <div
      role="alert"
      className={`rounded-xl border px-4 py-3 text-sm ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </div>
  );
}
