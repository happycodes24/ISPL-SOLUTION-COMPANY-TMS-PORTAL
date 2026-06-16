import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import GlassCard from "@/components/common/GlassCard";
import { TRENDS } from "@/lib/mockData";

export default function TrainingTrends() {
  return (
    <GlassCard className="h-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-600 text-[var(--text)]">
            Training completion trend
          </h3>
          <p className="text-sm text-[var(--text-muted)]">Assigned vs completed · last 6 months</p>
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={TRENDS} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D82B25" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#D82B25" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#393939" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#393939" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                color: "var(--text)",
              }}
            />
            <Area type="monotone" dataKey="assigned" stroke="#393939" strokeWidth={2} fill="url(#gB)" />
            <Area type="monotone" dataKey="completed" stroke="#D82B25" strokeWidth={2.5} fill="url(#gA)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
