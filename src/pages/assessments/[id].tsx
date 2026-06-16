import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Loader2, Plus, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import GlassCard from "@/components/common/GlassCard";
import { useAuth } from "@/context/AuthContext";
import {
  assessmentsService,
  AssessmentItem,
  PublicQuestion,
  ManageQuestion,
  GradedResult,
  ResultRow,
} from "@/services/assessments.service";

const ADMIN_ROLES = ["SUPER_ADMIN", "HR_ADMIN", "TRAINING_MANAGER"];

export default function AssessmentDetail() {
  const router = useRouter();
  const { user } = useAuth();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const isAdmin = !!user && ADMIN_ROLES.includes(user.role);

  if (!id) {
    return <MainLayout><div className="skeleton h-40 rounded-2xl" /></MainLayout>;
  }
  return isAdmin ? <ManageView id={id} /> : <TakeView id={id} />;
}

/* ------------------------- EMPLOYEE: timed test ------------------------- */

function TakeView({ id }: { id: string }) {
  const [meta, setMeta] = useState<AssessmentItem | null>(null);
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<GradedResult | null>(null);
  const [warnings, setWarnings] = useState(0);
  const submittedRef = useRef(false);

  useEffect(() => {
    assessmentsService.take(id)
      .then((r) => {
        setMeta(r.assessment);
        setQuestions(r.questions);
        if (r.assessment.timeLimitMin) setTimeLeft(r.assessment.timeLimitMin * 60);
      })
      .catch((e: any) => setError(e?.message ?? "Could not load assessment."))
      .finally(() => setLoading(false));
  }, [id]);

  // Countdown + auto-submit
  useEffect(() => {
    if (timeLeft === null || result) return;
    if (timeLeft <= 0) { doSubmit(); return; }
    const t = setTimeout(() => setTimeLeft((s) => (s === null ? s : s - 1)), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, result]);

  // Basic anti-cheat: count tab switches
  useEffect(() => {
    const onBlur = () => { if (!result) setWarnings((w) => w + 1); };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [result]);

  function toggle(q: PublicQuestion, option: string) {
    if (result) return;
    setAnswers((prev) => {
      const cur = prev[q.id] ?? [];
      if (q.type === "MULTIPLE_CORRECT") {
        return { ...prev, [q.id]: cur.includes(option) ? cur.filter((o) => o !== option) : [...cur, option] };
      }
      return { ...prev, [q.id]: [option] };
    });
  }

  async function doSubmit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    try {
      const payload = questions.map((q) => ({ questionId: q.id, answer: (answers[q.id] ?? []).join(",") }));
      const r = await assessmentsService.submit(id, payload);
      setResult(r.result);
    } catch (e: any) {
      setError(e?.message ?? "Could not submit.");
      submittedRef.current = false;
    } finally {
      setSubmitting(false);
    }
  }

  const answered = questions.filter((q) => (answers[q.id] ?? []).length > 0).length;
  const mm = timeLeft !== null ? String(Math.floor(timeLeft / 60)).padStart(2, "0") : "";
  const ss = timeLeft !== null ? String(timeLeft % 60).padStart(2, "0") : "";

  return (
    <MainLayout>
      <Head><title>{meta?.title ?? "Assessment"} · IAVISPL TMS</title></Head>
      <Link href="/assessments" className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-iav-red"><ArrowLeft className="h-4 w-4" /> Back to assessments</Link>

      {loading ? (
        <div className="skeleton h-60 rounded-2xl" />
      ) : error && !result ? (
        <GlassCard hover={false}><p className="text-iav-red">{error}</p></GlassCard>
      ) : result ? (
        <ResultCard result={result} />
      ) : (
        <div onCopy={(e) => e.preventDefault()} onPaste={(e) => e.preventDefault()} onContextMenu={(e) => e.preventDefault()}>
          <div className="glass sticky top-16 z-10 mb-4 flex items-center justify-between rounded-xl px-4 py-3">
            <div>
              <div className="font-display font-600 text-[var(--text)]">{meta?.title}</div>
              <div className="text-xs text-[var(--text-muted)]">{answered}/{questions.length} answered</div>
            </div>
            {timeLeft !== null && (
              <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono font-600 ${timeLeft < 60 ? "bg-iav-red/15 text-iav-red" : "bg-iav-grad-soft text-iav-red"}`}>
                <Clock className="h-4 w-4" /> {mm}:{ss}
              </div>
            )}
          </div>

          {warnings > 0 && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-amber-400/15 px-4 py-2 text-sm text-amber-600">
              <AlertTriangle className="h-4 w-4" /> Leaving the test window is recorded ({warnings} time{warnings > 1 ? "s" : ""}).
            </div>
          )}

          <div className="space-y-4">
            {questions.map((q, i) => (
              <GlassCard key={q.id} hover={false}>
                <p className="font-500 text-[var(--text)]"><span className="text-iav-red">Q{i + 1}.</span> {q.text}</p>
                <p className="mb-3 mt-0.5 text-xs text-[var(--text-muted)]">{q.type === "MULTIPLE_CORRECT" ? "Select all that apply" : "Select one"} · {q.points} pt</p>
                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const sel = (answers[q.id] ?? []).includes(opt);
                    return (
                      <button key={opt} onClick={() => toggle(q, opt)} className={`flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition ${sel ? "border-iav-red bg-iav-grad-soft text-iav-red" : "border-[var(--border)] text-[var(--text)] hover:border-iav-red/40"}`}>
                        <span className={`grid h-5 w-5 shrink-0 place-items-center border ${q.type === "MULTIPLE_CORRECT" ? "rounded-md" : "rounded-full"} ${sel ? "border-iav-red bg-iav-red text-white" : "border-[var(--border)]"}`}>{sel && "✓"}</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </GlassCard>
            ))}
          </div>

          <button onClick={doSubmit} disabled={submitting} className="focus-ring mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-iav-grad py-3.5 font-600 text-white shadow-glow disabled:opacity-60">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}{submitting ? "Submitting…" : "Submit assessment"}
          </button>
        </div>
      )}
    </MainLayout>
  );
}

/* ------------------------- Result card with animation ------------------------- */

function ResultCard({ result }: { result: GradedResult & { certificateId?: string } }) {
  const passed = result.passed;
  return (
    <GlassCard hover={false} className="relative overflow-hidden text-center">
      {/* Confetti burst for pass */}
      {passed && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 18 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, x: (i % 2 === 0 ? 1 : -1) * Math.random() * 200, opacity: 1 }}
              animate={{ y: 600, opacity: 0, rotate: Math.random() * 360 }}
              transition={{ duration: 1.5 + Math.random(), delay: i * 0.06, ease: "easeIn" }}
              className="absolute top-0"
              style={{ left: `${(i / 18) * 100}%`, width: 8, height: 8, background: i % 3 === 0 ? "#D82B25" : i % 3 === 1 ? "#BF1E26" : "#393939", borderRadius: 2 }}
            />
          ))}
        </div>
      )}

      {/* Badge */}
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
        className="mx-auto mb-4 flex h-24 w-24 flex-col items-center justify-center rounded-full shadow-glow"
        style={{ background: passed ? "linear-gradient(135deg,#10B981,#059669)" : "linear-gradient(135deg,#D82B25,#BF1E26)" }}
      >
        {passed ? <CheckCircle2 className="h-10 w-10 text-white" /> : <XCircle className="h-10 w-10 text-white" />}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-display text-4xl font-700 text-[var(--text)]"
      >
        {result.score}%
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`mt-1 text-lg font-700 ${passed ? "text-emerald-500" : "text-iav-red"}`}
      >
        {passed ? "🎉 Congratulations! You passed." : "Not passed — try again."}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-1 text-sm text-[var(--text-muted)]"
      >
        {result.earnedPoints} / {result.totalPoints} points · attempt #{result.attemptNumber}
      </motion.p>

      {passed && result.certificateId && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <div className="mx-auto mt-5 max-w-xs rounded-xl bg-emerald-400/15 px-4 py-3">
            <p className="text-sm font-600 text-emerald-600">🏆 Certificate issued!</p>
            <p className="mt-0.5 font-mono text-xs text-emerald-500">{result.certificateId}</p>
          </div>
          <Link href="/certificates" className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 font-600 text-white">
            Download certificate
          </Link>
        </motion.div>
      )}

      <div className="mt-4 flex justify-center gap-3">
        <Link href="/assessments" className="rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-500 text-[var(--text-muted)]">
          Back to assessments
        </Link>
        <Link href="/dashboard" className="rounded-xl bg-iav-grad px-5 py-2.5 text-sm font-600 text-white">
          Dashboard
        </Link>
      </div>
    </GlassCard>
  );
}

/* ------------------------- ADMIN: manage + results ------------------------- */

function ManageView({ id }: { id: string }) {
  const [meta, setMeta] = useState<AssessmentItem | null>(null);
  const [questions, setQuestions] = useState<ManageQuestion[]>([]);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [tab, setTab] = useState<"questions" | "results">("questions");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const m = await assessmentsService.manage(id);
    setMeta(m.assessment);
    setQuestions(m.questions);
    const r = await assessmentsService.results(id);
    setResults(r.data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, [id]);

  return (
    <MainLayout>
      <Head><title>{meta?.title ?? "Manage"} · IAVISPL TMS</title></Head>
      <Link href="/assessments" className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-iav-red"><ArrowLeft className="h-4 w-4" /> Back</Link>
      <h1 className="font-display text-2xl font-700 text-[var(--text)] md:text-3xl">{meta?.title ?? "Assessment"}</h1>
      <p className="mb-5 text-sm text-[var(--text-muted)]">{meta?.status} · pass {meta?.passingScore}% · {questions.length} questions</p>

      <div className="mb-4 flex gap-2">
        {(["questions", "results"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-4 py-2 text-sm font-600 capitalize ${tab === t ? "bg-iav-grad text-white" : "border border-[var(--border)] text-[var(--text-muted)]"}`}>{t}</button>
        ))}
      </div>

      {loading ? (
        <div className="skeleton h-40 rounded-2xl" />
      ) : tab === "questions" ? (
        <div className="space-y-4">
          <AddQuestion id={id} onAdded={load} />
          {questions.length === 0 ? (
            <GlassCard hover={false}><p className="text-sm text-[var(--text-muted)]">No questions yet. Add the first one above.</p></GlassCard>
          ) : questions.map((q, i) => (
            <GlassCard key={q.id} hover={false}>
              <p className="font-500 text-[var(--text)]"><span className="text-iav-red">Q{i + 1}.</span> {q.text}</p>
              <div className="mt-2 space-y-1 text-sm">
                {q.options.map((o) => {
                  const correct = q.correctAnswer.split(",").map((s) => s.trim().toLowerCase()).includes(o.trim().toLowerCase());
                  return <div key={o} className={correct ? "font-600 text-emerald-500" : "text-[var(--text-muted)]"}>{correct ? "✓ " : "• "}{o}</div>;
                })}
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard hover={false} className="overflow-x-auto p-0">
          {results.length === 0 ? (
            <p className="p-6 text-sm text-[var(--text-muted)]">No attempts yet.</p>
          ) : (
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead><tr className="border-b border-[var(--border)] text-xs uppercase tracking-wider text-[var(--text-muted)]">
                <th className="px-5 py-3 font-600">Employee</th><th className="px-3 py-3 font-600">Score</th><th className="px-3 py-3 font-600">Result</th><th className="px-3 py-3 font-600">Attempt</th><th className="px-5 py-3 font-600">When</th>
              </tr></thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id} className="border-b border-[var(--border)]">
                    <td className="px-5 py-3 text-[var(--text)]">{r.employeeName} <span className="font-mono text-xs text-[var(--text-muted)]">{r.employeeCode}</span></td>
                    <td className="px-3 py-3 font-mono">{r.score}%</td>
                    <td className="px-3 py-3"><span className={`text-xs font-600 ${r.passed ? "text-emerald-500" : "text-iav-red"}`}>{r.passed ? "Pass" : "Fail"}</span></td>
                    <td className="px-3 py-3 text-[var(--text-muted)]">{r.attemptNumber}</td>
                    <td className="px-5 py-3 text-[var(--text-muted)]">{new Date(r.submittedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </GlassCard>
      )}
    </MainLayout>
  );
}

function AddQuestion({ id, onAdded }: { id: string; onAdded: () => void }) {
  const [type, setType] = useState("MCQ");
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState("");
  const [points, setPoints] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const effectiveOptions = type === "TRUE_FALSE" ? ["True", "False"] : options.filter((o) => o.trim());

  async function add() {
    setBusy(true); setError("");
    try {
      await assessmentsService.addQuestion(id, {
        type, text, options: effectiveOptions, correctAnswer: correct.trim(), points: Number(points),
      });
      setText(""); setOptions(["", "", "", ""]); setCorrect(""); setPoints(1);
      onAdded();
    } catch (e: any) {
      setError(e?.message ?? "Could not add question.");
    } finally { setBusy(false); }
  }

  return (
    <GlassCard hover={false}>
      <h3 className="font-display font-600 text-[var(--text)]">Add question</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <label className="block"><span className="mb-1 block text-sm text-[var(--text)]">Type</span>
          <select value={type} onChange={(e) => setType(e.target.value)} className="aq-inp">
            <option value="MCQ">MCQ (single answer)</option>
            <option value="TRUE_FALSE">True / False</option>
            <option value="MULTIPLE_CORRECT">Multiple correct</option>
          </select>
        </label>
        <label className="block"><span className="mb-1 block text-sm text-[var(--text)]">Points</span>
          <input type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} className="aq-inp" />
        </label>
      </div>
      <label className="mt-3 block"><span className="mb-1 block text-sm text-[var(--text)]">Question</span>
        <input value={text} onChange={(e) => setText(e.target.value)} className="aq-inp" placeholder="e.g. What is CSV in pharmaceutical validation?" />
      </label>

      {type !== "TRUE_FALSE" && (
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {options.map((o, i) => (
            <input key={i} value={o} onChange={(e) => setOptions((p) => p.map((x, j) => (j === i ? e.target.value : x)))} className="aq-inp" placeholder={`Option ${i + 1}`} />
          ))}
        </div>
      )}

      <label className="mt-3 block">
        <span className="mb-1 block text-sm text-[var(--text)]">Correct answer {type === "MULTIPLE_CORRECT" ? "(comma-separated, must match option text)" : "(must match an option exactly)"}</span>
        <input value={correct} onChange={(e) => setCorrect(e.target.value)} className="aq-inp" placeholder={type === "TRUE_FALSE" ? "True or False" : type === "MULTIPLE_CORRECT" ? "Option 1, Option 3" : "exact option text"} />
      </label>

      {error && <p className="mt-2 text-sm text-iav-red">{error}</p>}
      <button onClick={add} disabled={busy || !text || !correct} className="mt-3 flex items-center gap-2 rounded-xl bg-iav-grad px-4 py-2.5 text-sm font-600 text-white shadow-glow disabled:opacity-60">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add question
      </button>
      <style jsx>{`.aq-inp{width:100%;border-radius:0.75rem;border:1px solid var(--border);background:var(--surface);padding:0.55rem 0.9rem;color:var(--text);font-size:0.875rem}`}</style>
    </GlassCard>
  );
}
