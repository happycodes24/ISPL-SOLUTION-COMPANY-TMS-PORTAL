import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Clock, CheckCircle2, Play, FileText, Loader2, ExternalLink } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import GlassCard from "@/components/common/GlassCard";
import { trainingFlowService, TrainingFlowData } from "@/services/training-flow.service";

export default function TrainingDetailPage() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const [data, setData] = useState<TrainingFlowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [readSec, setReadSec] = useState(0);
  const [reading, setReading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const readSecRef = useRef(0);

  async function load() {
    if (!id) return;
    setLoading(true);
    try {
      const r = await trainingFlowService.get(id);
      setData(r.data);
      setReadSec(r.data.reading.readSec);
      readSecRef.current = r.data.reading.readSec;
    } catch (e: any) {
      setError(e?.message ?? "Could not load training.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  // Cleanup timers on unmount
  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
  }, []);

  async function startReading() {
    if (!id || reading) return;
    const r = await trainingFlowService.startReading(id);
    setSessionId(r.sessionId);
    setReading(true);

    // Tick every second
    intervalRef.current = setInterval(() => {
      readSecRef.current += 1;
      setReadSec(readSecRef.current);
      if (data && readSecRef.current >= data.reading.requiredSec) {
        stopReading();
        load(); // refresh to show assessment unlocked
      }
    }, 1000);

    // Heartbeat to backend every 30s
    heartbeatRef.current = setInterval(() => {
      trainingFlowService.updateProgress(id, readSecRef.current).catch(() => {});
    }, 30000);
  }

  function stopReading() {
    setReading(false);
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (heartbeatRef.current) { clearInterval(heartbeatRef.current); heartbeatRef.current = null; }
    if (id) trainingFlowService.updateProgress(id, readSecRef.current).catch(() => {});
  }

  if (!id) return <MainLayout><div className="skeleton h-60 rounded-2xl" /></MainLayout>;
  if (loading) return <MainLayout><div className="space-y-3">{Array.from({length:4}).map((_,i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div></MainLayout>;
  if (error || !data) return <MainLayout><GlassCard hover={false}><p className="text-iav-red">{error || "Not found."}</p></GlassCard></MainLayout>;

  const { training, materials, enrollment, reading: readState, assessment } = data;
  const requiredSec = readState.requiredSec;
  const pct = Math.min((readSec / requiredSec) * 100, 100);
  const readingComplete = readSec >= requiredSec || readState.complete;
  const mm = String(Math.floor((requiredSec - readSec) / 60)).padStart(2, "0");
  const ss = String(Math.max(requiredSec - readSec, 0) % 60).padStart(2, "0");

  return (
    <MainLayout>
      <Head><title>{training.name} · IAVISPL TMS</title></Head>
      <Link href="/training" className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-iav-red">
        <ArrowLeft className="h-4 w-4" /> Back to training
      </Link>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-sm text-[var(--text-muted)]">{training.code}</p>
          <h1 className="font-display text-2xl font-700 text-[var(--text)] md:text-3xl">{training.name}</h1>
          {training.description && <p className="mt-1 text-sm text-[var(--text-muted)]">{training.description}</p>}
        </div>
        {enrollment && (
          <span className={`rounded-full px-3 py-1 text-xs font-700 ${
            enrollment.status === "COMPLETED" ? "bg-emerald-400/15 text-emerald-500" :
            enrollment.status === "IN_PROGRESS" ? "bg-sky-400/15 text-sky-500" :
            "bg-gray-400/15 text-gray-500"}`}>
            {enrollment.status.replace("_"," ")}
          </span>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left: material + reading timer */}
        <div className="space-y-4 lg:col-span-2">

          {/* Step 1: Read material */}
          <GlassCard hover={false}>
            <div className="mb-3 flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-iav-grad text-xs font-700 text-white">1</span>
              <h2 className="font-display font-600 text-[var(--text)]">Read training material</h2>
              {readingComplete && <CheckCircle2 className="ml-auto h-5 w-5 text-emerald-500" />}
            </div>

            {materials.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">No materials uploaded yet.</p>
            ) : (
              <div className="space-y-2">
                {materials.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3">
                    <div className="rounded-lg bg-iav-grad-soft p-2"><FileText className="h-4 w-4 text-iav-red" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-500 text-[var(--text)]">{m.title}</p>
                      <p className="text-xs text-[var(--text-muted)]">{m.type}</p>
                    </div>
                    {m.fileUrl && m.fileUrl !== "#" ? (
                      <a href={m.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 rounded-lg bg-iav-grad px-3 py-1.5 text-xs font-600 text-white">
                        <ExternalLink className="h-3.5 w-3.5" /> Open
                      </a>
                    ) : (
                      <span className="rounded-lg bg-gray-400/15 px-3 py-1.5 text-xs text-gray-500">No file</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Reading timer */}
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Required reading time</span>
                <span className={readingComplete ? "font-600 text-emerald-500" : "font-mono"}>
                  {readingComplete ? "Complete ✓" : `${mm}:${ss} remaining`}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[var(--border)]">
                <motion.div className="h-full rounded-full bg-iav-grad" style={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
              </div>
              <p className="mt-1 text-right text-xs text-[var(--text-muted)]">{Math.round(pct)}% read</p>

              {!readingComplete && (
                <div className="mt-3 flex gap-2">
                  {!reading ? (
                    <button onClick={startReading} className="flex items-center gap-2 rounded-xl bg-iav-grad px-4 py-2.5 text-sm font-600 text-white shadow-glow">
                      <BookOpen className="h-4 w-4" /> Start reading timer
                    </button>
                  ) : (
                    <button onClick={stopReading} className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-500 text-[var(--text-muted)]">
                      <Loader2 className="h-4 w-4 animate-spin text-iav-red" /> Pause
                    </button>
                  )}
                </div>
              )}
              {!readingComplete && (
                <p className="mt-2 text-xs text-[var(--text-muted)]">Open the material above, then start the timer. The assessment unlocks once reading is complete.</p>
              )}
            </div>
          </GlassCard>

          {/* Step 2: Assessment */}
          <GlassCard hover={false} className={readingComplete ? "" : "opacity-60"}>
            <div className="mb-3 flex items-center gap-2">
              <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-700 text-white ${readingComplete ? "bg-iav-grad" : "bg-gray-400"}`}>2</span>
              <h2 className="font-display font-600 text-[var(--text)]">Take assessment</h2>
              {!readingComplete && <span className="ml-auto rounded-full bg-amber-400/15 px-2 py-0.5 text-xs font-600 text-amber-500">🔒 Complete reading first</span>}
            </div>

            {!assessment ? (
              <p className="text-sm text-[var(--text-muted)]">No assessment linked to this training.</p>
            ) : (
              <div>
                <p className="text-sm font-500 text-[var(--text)]">{assessment.title}</p>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-[var(--text-muted)]">
                  {assessment.timeLimitMin && <span>⏱ {assessment.timeLimitMin} min</span>}
                  <span>✓ Pass: {assessment.passingScore}%</span>
                  <span>🔄 {assessment.attemptsLeft} attempt{assessment.attemptsLeft !== 1 ? "s" : ""} left</span>
                </div>
                {readingComplete && assessment.attemptsLeft > 0 && assessment.status === "ACTIVE" && (
                  <Link href={`/assessments/${assessment.id}`} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-iav-grad px-4 py-2.5 text-sm font-600 text-white shadow-glow">
                    <Play className="h-4 w-4" /> Start assessment
                  </Link>
                )}
                {assessment.attemptsLeft === 0 && (
                  <p className="mt-2 text-xs font-600 text-iav-red">No attempts remaining.</p>
                )}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right: progress summary */}
        <div className="space-y-3">
          <GlassCard hover={false}>
            <h3 className="mb-3 font-display font-600 text-[var(--text)]">Progress</h3>
            <div className="space-y-3">
              <ProgressRow label="Reading" done={readingComplete} value={Math.round(pct)} />
              <ProgressRow label="Assessment" done={enrollment?.status === "COMPLETED"} value={enrollment?.status === "COMPLETED" ? 100 : 0} />
              <ProgressRow label="Certificate" done={enrollment?.status === "COMPLETED"} value={enrollment?.status === "COMPLETED" ? 100 : 0} />
            </div>
            {enrollment?.status === "COMPLETED" && (
              <Link href="/certificates" className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-600 text-white">
                <CheckCircle2 className="h-4 w-4" /> View certificate
              </Link>
            )}
          </GlassCard>

          <GlassCard hover={false}>
            <h3 className="mb-2 font-display text-sm font-600 text-[var(--text)]">Training info</h3>
            <dl className="space-y-1 text-xs text-[var(--text-muted)]">
              <div className="flex justify-between"><dt>Duration</dt><dd>{training.durationHrs}h</dd></div>
              <div className="flex justify-between"><dt>Code</dt><dd className="font-mono">{training.code}</dd></div>
              {assessment && <div className="flex justify-between"><dt>Assessment</dt><dd>{assessment.attemptsUsed}/{assessment.maxAttempts} attempts</dd></div>}
            </dl>
          </GlassCard>
        </div>
      </div>
    </MainLayout>
  );
}

function ProgressRow({ label, done, value }: { label: string; done: boolean; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-[var(--text)]">{label}</span>
        <span className={done ? "font-600 text-emerald-500" : "text-[var(--text-muted)]"}>{done ? "Done ✓" : `${value}%`}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
        <motion.div className={`h-full rounded-full ${done ? "bg-emerald-500" : "bg-iav-grad"}`} style={{ width: `${value}%` }} transition={{ duration: 0.6 }} />
      </div>
    </div>
  );
}
