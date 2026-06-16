import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { DashboardStat } from "@/types";
import AnimatedCounter from "@/components/common/AnimatedCounter";
import GlassCard from "@/components/common/GlassCard";

export default function StatCard({ stat, index }: { stat: DashboardStat; index: number }) {
  const Icon = (Icons as Record<string, any>)[stat.icon] ?? Icons.Activity;
  const up = stat.delta >= 0;
  const Trend = up ? Icons.ArrowUpRight : Icons.ArrowDownRight;

  return (
    <GlassCard delay={index * 0.08}>
      <div className="flex items-start justify-between">
        <div className="rounded-xl bg-iav-grad-soft p-2.5">
          <Icon className="h-5 w-5 text-iav-red" />
        </div>
        <span
          className={`flex items-center gap-0.5 text-xs font-600 ${
            up ? "text-emerald-500" : "text-iav-red"
          }`}
        >
          <Trend className="h-3.5 w-3.5" />
          {Math.abs(stat.delta)}%
        </span>
      </div>
      <div className="mt-4">
        <div className="font-display text-3xl font-700 text-[var(--text)]">
          <AnimatedCounter value={stat.value} suffix={stat.suffix} />
        </div>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{stat.label}</p>
      </div>
      <motion.div
        className="mt-4 h-1 rounded-full bg-iav-grad"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: index * 0.08 }}
        style={{ originX: 0 }}
      />
    </GlassCard>
  );
}
