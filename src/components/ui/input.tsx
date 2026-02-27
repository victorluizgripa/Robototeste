import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ icon, className = "", ...props }, ref) {
    return (
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-3 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={`w-full rounded-xl border border-border bg-surface py-2.5 text-sm text-txt placeholder:text-txt-3 transition-colors focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500/20 ${
            icon ? "pl-10 pr-4" : "px-4"
          } ${className}`}
          {...props}
        />
      </div>
    );
  }
);
