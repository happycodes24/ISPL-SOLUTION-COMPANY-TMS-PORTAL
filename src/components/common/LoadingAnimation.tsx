import { motion } from "framer-motion";

interface Props {
  size?: number;
  label?: string;
}

/**
 * The signature IAVISPL loader: the A/V chevrons from the logo,
 * lifting in sequence like an upward training pulse.
 */
export default function LoadingAnimation({ size = 56, label }: Props) {
  const bars = [
    { color: "#BF1E26", delay: 0 },
    { color: "#D82B25", delay: 0.15 },
    { color: "#393939", delay: 0.3 },
  ];
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-end gap-1.5" style={{ height: size }}>
        {bars.map((b, i) => (
          <motion.span
            key={i}
            initial={{ height: size * 0.3, opacity: 0.4 }}
            animate={{ height: [size * 0.3, size, size * 0.3], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: b.delay,
            }}
            style={{ width: size * 0.18, background: b.color }}
            className="rounded-sm"
          />
        ))}
      </div>
      {label && (
        <span className="text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">
          {label}
        </span>
      )}
    </div>
  );
}
