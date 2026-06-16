import Head from "next/head";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Award, ShieldCheck } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import GlassCard from "@/components/common/GlassCard";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { certificatesService, CertRow } from "@/services/certificates.service";

const ADMIN_ROLES = ["SUPER_ADMIN", "HR_ADMIN", "TRAINING_MANAGER"];

export default function CertificatesPage() {
  const { user } = useAuth();
  const isAdmin = !!user && ADMIN_ROLES.includes(user.role);
  const [certs, setCerts] = useState<CertRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fn = isAdmin ? certificatesService.listAll : certificatesService.listMine;
    fn().then(r => setCerts(r.data ?? [])).catch(() => {}).finally(() => setLoading(false));
  }, [isAdmin]);

  async function download(certId: string) {
    setDownloading(certId);
    try { await certificatesService.downloadPdf(certId); }
    catch (e: any) { setMsg(e?.message ?? "Download failed."); }
    finally { setDownloading(null); }
  }

  return (
    <MainLayout>
      <Head><title>Certificates · IAVISPL TMS</title></Head>
      <PageHeader eyebrow={isAdmin ? "All employee certificates" : "My certificates"} title="Certificates" />

      {msg && <div className="mb-4 rounded-xl bg-iav-red/10 px-4 py-2 text-sm text-iav-red">{msg}</div>}

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2">{Array.from({length:4}).map((_,i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}</div>
      ) : certs.length === 0 ? (
        <EmptyState icon="Award" title="No certificates yet"
          message={isAdmin ? "Certificates are issued automatically when an employee passes a linked assessment." : "Complete a training and pass its assessment to earn your first certificate."}
          note="Certificates are generated as downloadable PDFs" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {certs.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard hover={false} className="relative overflow-hidden">
                {/* Red accent stripe */}
                <div className="absolute left-0 top-0 h-full w-1 bg-iav-grad rounded-l-2xl" />
                <div className="pl-3">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="rounded-xl bg-iav-grad-soft p-2"><Award className="h-5 w-5 text-iav-red" /></div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-600 text-[var(--text)]">{c.training.name}</p>
                      <p className="font-mono text-xs text-[var(--text-muted)]">{c.training.code}</p>
                    </div>
                  </div>
                  {isAdmin && c.employee && (
                    <p className="mb-1 text-xs text-[var(--text-muted)]">
                      {c.employee.firstName} {c.employee.lastName} · {c.employee.employeeCode}
                    </p>
                  )}
                  <div className="flex items-center gap-1 text-xs text-emerald-500">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>{c.certificateId}</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">Issued: {new Date(c.issuedAt).toLocaleDateString("en-IN")}</p>
                  <button
                    onClick={() => download(c.certificateId)}
                    disabled={downloading === c.certificateId}
                    className="mt-3 flex items-center gap-1.5 rounded-lg bg-iav-grad px-3 py-1.5 text-xs font-600 text-white disabled:opacity-60"
                  >
                    <Download className="h-3.5 w-3.5" />
                    {downloading === c.certificateId ? "Generating…" : "Download PDF"}
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
