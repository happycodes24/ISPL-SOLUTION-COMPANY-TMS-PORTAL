import Head from "next/head";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import GlassCard from "@/components/common/GlassCard";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { complianceService, ComplianceRow } from "@/services/modules.service";

function riskColor(score: number) {
  if (score >= 95) return "#10B981";
  if (score >= 85) return "#D82B25";
  return "#BF1E26";
}

export default function CompliancePage() {
  const [rows, setRows] = useState<ComplianceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complianceService.byDepartment().then((r) => setRows(r.data ?? [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const avg = rows.length ? Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length) : 0;

  return (
    <MainLayout>
      <Head><title>Compliance · IAVISPL TMS</title></Head>
      <PageHeader
        eyebrow="Audit readiness"
        title="Compliance"
        action={!loading && rows.length > 0 ? <span className="rounded-full bg-iav-grad-soft px-3 py-1.5 text-sm font-600 text-iav-red">Org score {avg}%</span> : undefined}
      />

      {loading ? (
        <div className="grid gap-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
      ) : rows.length === 0 ? (
        <EmptyState icon="ShieldCheck" title="No compliance data yet" message="Once mandatory training is assigned, per-department compliance coverage and risk will appear here." />
      ) : (
        <GlassCard hover={false}>
          <div className="space-y-4">
            {rows.map((row, i) => (
              <div key={row.department}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-[var(--text)]">{row.department}</span>
                  <span className="font-mono text-[var(--text-muted)]">{row.completed}/{row.mandatory} · {row.score}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[var(--border)]">
                  <motion.div className="h-full rounded-full" style={{ background: riskColor(row.score) }} initial={{ width: 0 }} animate={{ width: `${row.score}%` }} transition={{ duration: 0.8, delay: i * 0.06 }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </MainLayout>
  );
}
