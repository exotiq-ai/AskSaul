interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "cyan" | "ice" | "muted";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variants = {
    default: "bg-wire/60 text-slate border border-wire",
    cyan: "bg-cyan/10 text-cyan border border-cyan/30",
    ice: "bg-ice/10 text-ice border border-ice/30",
    muted: "bg-graphite text-dim border border-wire/50",
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
