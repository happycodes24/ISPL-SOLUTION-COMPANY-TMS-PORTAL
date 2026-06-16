import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import GlassCard from "@/components/common/GlassCard";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { trainingService, TrainingRow } from "@/services/modules.service";

const statusStyle: Record<string, string> = {
  ACTIVE: "bg-emerald-400/15 text-emerald-500",
  Active: "bg-emerald-400/15 text-emerald-500",
  SCHEDULED: "bg-amber-400/15 text-amber-500",
  Scheduled: "bg-amber-400/15 text-amber-500",
  DRAFT: "bg-gray-400/15 text-gray-500",
  COMPLETED: "bg-sky-400/15 text-sky-500",
  EXPIRED: "bg-iav-red/15 text-iav-red",
};

export default function TrainingPage() {
  const [rows, setRows] = useState<TrainingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trainingService.list().then((r) => setRows(r.data ?? [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <Head><title>Training · IAVISPL TMS</title></Head>
      <PageHeader eyebrow="Programs" title="Training" />

      {loading ? (
        <div className="grid gap-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
      ) : rows.length === 0 ? (
        <EmptyState icon="GraduationCap" title="No training programs yet" message="When training programs are created they will appear here with status, type and completion." note="Create programs via the API / admin tools" />
      ) : (
        <GlassCard hover={false} className="overflow-x-auto p-0">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wider text-[var(--text-muted)]">
                <th className="px-5 py-3 font-600">Training</th>
                <th className="px-3 py-3 font-600">Category</th>
                <th className="px-3 py-3 font-600">Type</th>
                <th className="px-3 py-3 font-600">Dept</th>
                <th className="px-5 py-3 font-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t, i) => (
                <motion.tr key={t.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="border-b border-[var(--border)] hover:bg-[var(--surface-2)]">
                  <td className="px-5 py-3">
                    <Link href={`/training/${t.id}`} className="font-500 text-[var(--text)] hover:text-iav-red hover:underline">{t.name}</Link>
                    {t.code && <div className="font-mono text-xs text-[var(--text-muted)]">{t.code}</div>}
                  </td>
                  <td className="px-3 py-3 text-[var(--text-muted)]">{t.category ?? "—"}</td>
                  <td className="px-3 py-3 text-[var(--text-muted)]">{t.type ?? "—"}</td>
                  <td className="px-3 py-3 text-[var(--text-muted)]">{t.department?.name ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-600 ${statusStyle[t.status ?? ""] ?? "bg-gray-400/15 text-gray-500"}`}>{t.status ?? "—"}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}
    </MainLayout>
  );
}
