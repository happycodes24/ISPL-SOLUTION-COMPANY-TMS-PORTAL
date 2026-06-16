import Head from "next/head";
import { useEffect, useState } from "react";
import { Download, FileSpreadsheet, Users, Award, Loader2 } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import GlassCard from "@/components/common/GlassCard";
import PageHeader from "@/components/common/PageHeader";
import { USE_MOCK } from "@/services/api";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("iav-access-token");
}

async function downloadFile(url: string, filename: string) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
  if (!res.ok) throw new Error("Download failed.");
  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

export default function ReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [empId, setEmpId] = useState("");

  async function dl(key: string, url: string, filename: string) {
    if (USE_MOCK) { setMsg("Reports require the live backend (NEXT_PUBLIC_USE_MOCK=false)."); return; }
    setDownloading(key); setMsg("");
    try { await downloadFile(`${BASE}${url}`, filename); }
    catch (e: any) { setMsg(e?.message ?? "Download failed."); }
    finally { setDownloading(null); }
  }

  const cards = [
    {
      key: "all",
      icon: Users,
      title: "Company Training Report",
      desc: "All employees — training assigned, completion, assessment scores, certificates.",
      label: "Download Excel",
      action: () => dl("all", "/reports/download", `IAVISPL_Training_Report_${new Date().toISOString().slice(0,10)}.xlsx`),
    },
    {
      key: "cert",
      icon: Award,
      title: "Certificates Report",
      desc: "All issued certificates with employee, training, issue date and certificate ID.",
      label: "Download Excel",
      action: () => dl("cert", "/reports/download?type=certificates", `IAVISPL_Certificates_${new Date().toISOString().slice(0,10)}.xlsx`),
    },
  ];

  return (
    <MainLayout>
      <Head><title>Reports · IAVISPL TMS</title></Head>
      <PageHeader eyebrow="Insights" title="Reports & Downloads" />

      {msg && <div className="mb-4 rounded-xl bg-iav-red/10 px-4 py-3 text-sm text-iav-red">{msg}</div>}

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((c) => (
          <GlassCard key={c.key} hover={false}>
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-iav-grad-soft p-3"><c.icon className="h-5 w-5 text-iav-red" /></div>
              <div className="flex-1">
                <h3 className="font-display font-600 text-[var(--text)]">{c.title}</h3>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{c.desc}</p>
              </div>
            </div>
            <button onClick={c.action} disabled={!!downloading} className="focus-ring mt-4 flex items-center gap-2 rounded-xl bg-iav-grad px-4 py-2.5 text-sm font-600 text-white shadow-glow disabled:opacity-60">
              {downloading === c.key ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {downloading === c.key ? "Preparing…" : c.label}
            </button>
          </GlassCard>
        ))}
      </div>

      <GlassCard hover={false} className="mt-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-iav-grad-soft p-3"><FileSpreadsheet className="h-5 w-5 text-iav-red" /></div>
          <div className="flex-1">
            <h3 className="font-display font-600 text-[var(--text)]">Individual Employee Report</h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Enter the employee ID from the Employees list to download their personal training + assessment + certificate report.</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <input value={empId} onChange={(e) => setEmpId(e.target.value)} placeholder="Employee database ID (from Employees page)" className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)]" />
          <button onClick={() => dl("one", `/reports/download/${empId}`, `Employee_Report.xlsx`)} disabled={!empId || !!downloading} className="focus-ring flex items-center gap-2 rounded-xl bg-iav-grad px-4 py-2.5 text-sm font-600 text-white disabled:opacity-60">
            {downloading === "one" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {downloading === "one" ? "…" : "Download"}
          </button>
        </div>
      </GlassCard>
    </MainLayout>
  );
}
