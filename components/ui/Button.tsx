import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", className = "", children, ...props },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap";

    const variants = {
      primary:
        "bg-cyan text-obsidian rounded-lg hover:bg-cyan/90 hover:shadow-[0_0_20px_rgba(0,212,170,0.3)] active:scale-[0.98]",
      secondary:
        "bg-ice/10 text-ice border border-ice/30 rounded-lg hover:bg-ice/20 hover:border-ice/60 active:scale-[0.98]",
      ghost:
        "text-cloud border border-wire rounded-lg hover:border-cyan/40 hover:text-cyan hover:bg-cyan/5 active:scale-[0.98]",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
