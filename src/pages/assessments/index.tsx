import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2, Settings2, Play, X } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import GlassCard from "@/components/common/GlassCard";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { assessmentsService, AssessmentItem } from "@/services/assessments.service";

const ADMIN_ROLES = ["SUPER_ADMIN", "HR_ADMIN", "TRAINING_MANAGER"];
const DEPARTMENTS = [
  { code: "", name: "All departments" },
  { code: "IT", name: "Information Technology" },
  { code: "HR", name: "Human Resources" },
  { code: "OPS", name: "Operations" },
  { code: "QA", name: "Quality" },
];

const statusStyle: Record<string, string> = {
  ACTIVE: "bg-emerald-400/15 text-emerald-500",
  DRAFT: "bg-gray-400/15 text-gray-500",
  CLOSED: "bg-iav-red/15 text-iav-red",
};

export default function AssessmentsPage() {
  const { user } = useAuth();
  const isAdmin = !!user && ADMIN_ROLES.includes(user.role);
  const [rows, setRows] = useState<AssessmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  async function load() {
    setLoading(true);
    const r = await assessmentsService.list();
    setRows(r.data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const visible = isAdmin ? rows : rows.filter((a) => a.status === "ACTIVE");

  return (
    <MainLayout>
      <Head><title>Assessments · IAVISPL TMS</title></Head>
      <PageHeader
        eyebrow="Evaluation"
        title="Assessments"
        action={isAdmin ? (
          <button onClick={() => setShowCreate(true)} className="focus-ring flex items-center gap-2 rounded-xl bg-iav-grad px-4 py-2.5 font-600 text-white shadow-glow">
            <Plus className="h-4 w-4" /> Create assessment
          </button>
        ) : undefined}
      />

      {loading ? (
        <div className="grid gap-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
      ) : visible.length === 0 ? (
        <EmptyState icon="ClipboardCheck" title={isAdmin ? "No assessments yet" : "No assessments assigned"} message={isAdmin ? "Create an assessment, add MCQ / True-False questions, then set it Active so employees can take it." : "When an assessment is assigned and active, it will appear here for you to take."} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {visible.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard hover={false}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-600 text-[var(--text)]">{a.title}</h3>
                    <p className="text-sm text-[var(--text-muted)]">{a.departmentName ?? "All departments"} · {a.difficulty}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-600 ${statusStyle[a.status] ?? ""}`}>{a.status}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--text-muted)]">
                  <span>{a.questionCount} questions</span>
                  <span>Pass {a.passingScore}%</span>
                  {a.timeLimitMin && <span>{a.timeLimitMin} min</span>}
                  <span>{a.maxAttempts} attempt(s)</span>
                </div>
                <div className="mt-4 flex gap-2">
                  {isAdmin ? (
                    <Link href={`/assessments/${a.id}`} className="focus-ring flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-500 text-[var(--text)] hover:border-iav-red hover:text-iav-red">
                      <Settings2 className="h-4 w-4" /> Manage & results
                    </Link>
                  ) : (
                    <Link href={`/assessments/${a.id}`} className="focus-ring flex items-center gap-1.5 rounded-lg bg-iav-grad px-3 py-2 text-sm font-600 text-white">
                      <Play className="h-4 w-4" /> Start test
                    </Link>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); load(); }} />}
      </AnimatePresence>
    </MainLayout>
  );
}

function CreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ title: "", departmentCode: "", difficulty: "MEDIUM", passingScore: 80, timeLimitMin: 20, maxAttempts: 2, status: "DRAFT" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  async function submit() {
    setBusy(true); setError("");
    try {
      await assessmentsService.create({
        title: form.title,
        departmentCode: form.departmentCode || null,
        difficulty: form.difficulty,
        passingScore: Number(form.passingScore),
        timeLimitMin: Number(form.timeLimitMin),
        maxAttempts: Number(form.maxAttempts),
        status: form.status,
      });
      onCreated();
    } catch (e: any) {
      setError(e?.message ?? "Could not create assessment.");
      setBusy(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="card w-full max-w-lg p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-700 text-[var(--text)]">Create assessment</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-2)]"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3">
          <Field label="Assessment name"><input value={form.title} onChange={(e) => set("title", e.target.value)} className="inp" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Department">
              <select value={form.departmentCode} onChange={(e) => set("departmentCode", e.target.value)} className="inp">
                {DEPARTMENTS.map((d) => <option key={d.code} value={d.code}>{d.name}</option>)}
              </select>
            </Field>
            <Field label="Difficulty">
              <select value={form.difficulty} onChange={(e) => set("difficulty", e.target.value)} className="inp">
                <option>EASY</option><option>MEDIUM</option><option>HARD</option>
              </select>
            </Field>
            <Field label="Passing %"><input type="number" value={form.passingScore} onChange={(e) => set("passingScore", e.target.value)} className="inp" /></Field>
            <Field label="Time limit (min)"><input type="number" value={form.timeLimitMin} onChange={(e) => set("timeLimitMin", e.target.value)} className="inp" /></Field>
            <Field label="Max attempts"><input type="number" value={form.maxAttempts} onChange={(e) => set("maxAttempts", e.target.value)} className="inp" /></Field>
            <Field label="Status">
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className="inp">
                <option>DRAFT</option><option>ACTIVE</option><option>CLOSED</option>
              </select>
            </Field>
          </div>
          {error && <p className="text-sm text-iav-red">{error}</p>}
          <button onClick={submit} disabled={busy || !form.title} className="focus-ring mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-iav-grad py-3 font-600 text-white shadow-glow disabled:opacity-60">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}{busy ? "Creating…" : "Create"}
          </button>
        </div>
      </motion.div>
      <style jsx>{`.inp{width:100%;border-radius:0.75rem;border:1px solid var(--border);background:var(--surface);padding:0.55rem 0.9rem;color:var(--text)}`}</style>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-500 text-[var(--text)]">{label}</span>
      {children}
    </label>
  );
}
