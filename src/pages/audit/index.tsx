import Head from "next/head";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import GlassCard from "@/components/common/GlassCard";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { auditService, AuditRow } from "@/services/modules.service";

export default function AuditPage() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auditService.list().then((r) => setRows(r.data ?? [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <Head><title>Audit Trail · IAVISPL TMS</title></Head>
      <PageHeader eyebrow="Governance" title="Audit Trail" />

      {loading ? (
        <div className="grid gap-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-12 rounded-lg" />)}</div>
      ) : rows.length === 0 ? (
        <EmptyState icon="ScrollText" title="No audit entries yet" message="User actions — logins, data changes, approvals, uploads — are recorded here with user, IP and timestamp." />
      ) : (
        <GlassCard hover={false} className="overflow-x-auto p-0">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wider text-[var(--text-muted)]">
                <th className="px-5 py-3 font-600">User</th>
                <th className="px-3 py-3 font-600">Action</th>
                <th className="px-3 py-3 font-600">Entity</th>
                <th className="px-3 py-3 font-600">IP</th>
                <th className="px-5 py-3 font-600">When</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-[var(--border)] hover:bg-[var(--surface-2)]">
                  <td className="px-5 py-3 text-[var(--text)]">{r.user}</td>
                  <td className="px-3 py-3"><span className="rounded-full bg-iav-grad-soft px-2 py-0.5 text-xs font-600 text-iav-red">{r.action}</span></td>
                  <td className="px-3 py-3 text-[var(--text-muted)]">{r.entity}</td>
                  <td className="px-3 py-3 font-mono text-xs text-[var(--text-muted)]">{r.ipAddress ?? "—"}</td>
                  <td className="px-5 py-3 text-[var(--text-muted)]">{new Date(r.timestamp).toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}
    </MainLayout>
  );
}
