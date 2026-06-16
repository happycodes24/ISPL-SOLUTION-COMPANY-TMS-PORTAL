import { motion } from "framer-motion";
import GlassCard from "@/components/common/GlassCard";
import { COMPLIANCE } from "@/lib/mockData";

function riskColor(score: number) {
  if (score >= 95) return "#10B981";
  if (score >= 85) return "#D82B25";
  return "#BF1E26";
}

export default function ComplianceChart() {
  return (
    <GlassCard className="h-full">
      <h3 className="font-display text-lg font-600 text-[var(--text)]">
        Compliance by department
      </h3>
      <p className="mb-4 text-sm text-[var(--text-muted)]">
        Mandatory training coverage · risk indicator
      </p>
      <div className="space-y-3.5">
        {COMPLIANCE.map((row, i) => (
          <div key={row.department}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-[var(--text)]">{row.department}</span>
              <span className="font-mono text-[var(--text-muted)]">
                {row.completed}/{row.mandatory} · {row.score}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--border)]">
              <motion.div
                className="h-full rounded-full"
                style={{ background: riskColor(row.score) }}
                initial={{ width: 0 }}
                whileInView={{ width: `${row.score}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.06, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
