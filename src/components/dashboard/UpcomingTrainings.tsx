import { motion } from "framer-motion";
import { CalendarDays, Clock, Users } from "lucide-react";
import GlassCard from "@/components/common/GlassCard";
import { UPCOMING } from "@/lib/mockData";
import { TrainingStatus } from "@/types";

const statusStyle: Record<TrainingStatus, string> = {
  Draft: "bg-gray-400/15 text-gray-500",
  Scheduled: "bg-amber-400/15 text-amber-500",
  Active: "bg-emerald-400/15 text-emerald-500",
  Completed: "bg-sky-400/15 text-sky-500",
  Expired: "bg-iav-red/15 text-iav-red",
};

export default function UpcomingTrainings() {
  return (
    <GlassCard>
      <h3 className="font-display text-lg font-600 text-[var(--text)]">
        Upcoming training
      </h3>
      <p className="mb-4 text-sm text-[var(--text-muted)]">Next sessions across departments</p>
      <div className="space-y-3">
        {UPCOMING.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ x: 4 }}
            className="card flex items-center justify-between gap-3 p-3.5"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate font-500 text-[var(--text)]">{t.name}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-600 ${statusStyle[t.status]}`}>
                  {t.status}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{t.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{t.durationHrs}h</span>
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{t.enrolled}</span>
                <span className="font-mono">{t.id}</span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-xs text-[var(--text-muted)]">{t.type}</div>
              <div className="font-display font-700 text-iav-red">{t.completionRate}%</div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
