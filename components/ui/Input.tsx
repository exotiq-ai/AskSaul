import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-slate">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`
            w-full bg-graphite border border-wire rounded-lg px-4 py-3
            text-cloud placeholder:text-dim
            focus:outline-none focus:border-cyan/60 focus:ring-1 focus:ring-cyan/30
            transition-colors duration-200
            ${
              error
                ? "border-error/60 focus:border-error/80 focus:ring-error/20"
                : ""
            }
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
