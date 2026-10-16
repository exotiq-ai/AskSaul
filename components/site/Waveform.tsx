const HEIGHTS = [30, 55, 80, 45, 95, 65, 100, 50, 85, 40, 70, 95, 55, 75, 35, 90, 60, 45, 80, 30];

export default function Waveform({
  bars = HEIGHTS.length,
  className = "",
  barClassName = "w-[3px]",
}: {
  bars?: number;
  className?: string;
  barClassName?: string;
}) {
  return (
    <div className={`flex items-center gap-[3px] ${className}`} aria-hidden="true">
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className={`wave-bar rounded-full bg-gradient-to-t from-cyan to-ice ${barClassName}`}
          style={{ height: `${HEIGHTS[i % HEIGHTS.length]}%`, ["--d" as string]: `${(i * 97) % 1200}ms` }}
        />
      ))}
    </div>
  );
}
