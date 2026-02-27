import { forwardRef } from "react";

type SelectOption = { value: string; label: string };

type SelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> & {
  options: SelectOption[];
  placeholder?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { options, placeholder, className = "", ...props },
    ref
  ) {
    return (
      <select
        ref={ref}
        className={`h-9 rounded-xl border border-border bg-surface px-3 text-xs text-txt-2 transition-colors focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500/20 ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
);
