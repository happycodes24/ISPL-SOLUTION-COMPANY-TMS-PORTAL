import { motion } from "framer-motion";

interface Props {
  value: number; // 0–100
  size?: number;
  stroke?: number;
  label?: string;
}

export default function ProgressCircle({
  value,
  size = 132,
  stroke = 12,
  label,
}: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="iav-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D82B25" />
            <stop offset="100%" stopColor="#BF1E26" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#iav-ring)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-2xl font-700 text-[var(--text)]">
          {value}%
        </span>
        {label && (
          <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
