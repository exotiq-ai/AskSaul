import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export default function Card({
  glow = false,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`
        bg-carbon/80 backdrop-blur-sm border border-wire rounded-xl
        ${
          glow
            ? "hover:border-cyan/30 hover:shadow-[0_0_30px_rgba(0,212,170,0.08)] transition-all duration-300"
            : ""
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
