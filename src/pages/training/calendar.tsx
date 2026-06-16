import Head from "next/head";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, X, Loader2, Bell } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import GlassCard from "@/components/common/GlassCard";
import PageHeader from "@/components/common/PageHeader";
import { apiFetch, USE_MOCK } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const ADMIN_ROLES = ["SUPER_ADMIN", "HR_ADMIN", "TRAINING_MANAGER"];

type EventType = "TRAINING" | "ASSESSMENT" | "MEETING";
interface CalEvent { id: string; title: string; date: string; type: EventType; description?: string }

const TYPE_COLOR: Record<EventType, string> = {
  TRAINING: "bg-sky-400/20 text-sky-500",
  ASSESSMENT: "bg-iav-red/15 text-iav-red",
  MEETING: "bg-emerald-400/15 text-emerald-500",
};

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function useMockEvents() {
  const today = new Date();
  const y = today.getFullYear(), m = today.getMonth();
  return [
    { id: "e1", title: "CSV Validation Training", date: new Date(y, m, 10).toISOString().slice(0,10), type: "TRAINING" as EventType, description: "Pharma CSV fundamentals session" },
    { id: "e2", title: "Assessment: CSV Essentials", date: new Date(y, m, 15).toISOString().slice(0,10), type: "ASSESSMENT" as EventType, description: "Final MCQ assessment" },
    { id: "e3", title: "QA Review Meeting", date: new Date(y, m, 20).toISOString().slice(0,10), type: "MEETING" as EventType },
  ];
}

export default function CalendarPage() {
  const { user } = useAuth();
  const isAdmin = !!user && ADMIN_ROLES.includes(user.role);
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents] = useState<CalEvent[]>(useMockEvents());
  const [showCreate, setShowCreate] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [notifyMsg, setNotifyMsg] = useState("");

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1);

  function prev() { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); }
  function next() { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); }

  function eventsOn(day: number) {
    const d = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    return events.filter(e => e.date === d);
  }

  function handleCreate(ev: CalEvent) {
    setEvents(prev => [...prev, ev]);
    setShowCreate(false);
  }

  const selectedEvents = selectedDate ? events.filter(e => e.date === selectedDate) : [];

  return (
    <MainLayout>
      <Head><title>Training Calendar · IAVISPL TMS</title></Head>
      <PageHeader eyebrow="Scheduling" title="Training Calendar" action={isAdmin ? (
        <button onClick={() => setShowCreate(true)} className="focus-ring flex items-center gap-2 rounded-xl bg-iav-grad px-4 py-2.5 font-600 text-white shadow-glow">
          <Plus className="h-4 w-4" /> Schedule event
        </button>
      ) : undefined} />

      {notifyMsg && <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-400/15 px-4 py-2 text-sm font-600 text-emerald-600"><Bell className="h-4 w-4" />{notifyMsg}</div>}

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Calendar grid */}
        <GlassCard hover={false} className="lg:col-span-2 p-0">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <button onClick={prev} className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-2)]"><ChevronLeft className="h-5 w-5" /></button>
            <h3 className="font-display font-600 text-[var(--text)]">{MONTHS[month]} {year}</h3>
            <button onClick={next} className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-2)]"><ChevronRight className="h-5 w-5" /></button>
          </div>
          <div className="grid grid-cols-7 text-center text-xs text-[var(--text-muted)] border-b border-[var(--border)]">
            {DAYS.map(d => <div key={d} className="py-2 font-600">{d}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              if (!day) return <div key={i} className="h-16 border-b border-r border-[var(--border)]/40" />;
              const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const dayEvs = eventsOn(day);
              const isSelected = selectedDate === dateStr;
              return (
                <div key={i} onClick={() => setSelectedDate(isSelected ? null : dateStr)} className={`h-16 border-b border-r border-[var(--border)]/40 p-1 cursor-pointer hover:bg-[var(--surface-2)] transition ${isSelected ? "bg-iav-grad-soft" : ""}`}>
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-600 ${isToday ? "bg-iav-red text-white" : "text-[var(--text)]"}`}>{day}</span>
                  <div className="mt-0.5 space-y-0.5">
                    {dayEvs.slice(0,2).map(e => (
                      <div key={e.id} className={`truncate rounded px-1 text-[10px] font-500 ${TYPE_COLOR[e.type]}`}>{e.title}</div>
                    ))}
                    {dayEvs.length > 2 && <div className="text-[10px] text-[var(--text-muted)]">+{dayEvs.length - 2} more</div>}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div className="flex gap-4 px-5 py-3 text-xs text-[var(--text-muted)]">
            {(Object.entries(TYPE_COLOR) as [EventType, string][]).map(([t, c]) => (
              <span key={t} className="flex items-center gap-1.5"><span className={`h-2.5 w-2.5 rounded-sm ${c.split(" ")[0]}`} />{t}</span>
            ))}
          </div>
        </GlassCard>

        {/* Sidebar: upcoming / selected */}
        <div className="space-y-3">
          <GlassCard hover={false}>
            <h3 className="mb-3 font-display font-600 text-[var(--text)]">
              {selectedDate ? `Events · ${selectedDate}` : "Upcoming events"}
            </h3>
            {(selectedDate ? selectedEvents : events.sort((a,b) => a.date.localeCompare(b.date)).slice(0,5)).length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">{selectedDate ? "No events on this day." : "No upcoming events."}</p>
            ) : (
              <div className="space-y-2">
                {(selectedDate ? selectedEvents : events.sort((a,b) => a.date.localeCompare(b.date)).slice(0,5)).map(e => (
                  <div key={e.id} className="rounded-xl border border-[var(--border)] p-3">
                    <span className={`mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-700 uppercase ${TYPE_COLOR[e.type]}`}>{e.type}</span>
                    <p className="text-sm font-600 text-[var(--text)]">{e.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">{e.date}</p>
                    {e.description && <p className="mt-1 text-xs text-[var(--text-muted)]">{e.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      <AnimatePresence>
        {showCreate && <CreateEventModal onClose={() => setShowCreate(false)} onCreate={handleCreate} onNotify={(msg) => setNotifyMsg(msg)} isAdmin={isAdmin} />}
      </AnimatePresence>
    </MainLayout>
  );
}

function CreateEventModal({ onClose, onCreate, onNotify, isAdmin }: { onClose: () => void; onCreate: (e: CalEvent) => void; onNotify: (m: string) => void; isAdmin: boolean }) {
  const [form, setForm] = useState({ title: "", date: new Date().toISOString().slice(0,10), type: "TRAINING" as EventType, description: "", notify: true });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  async function submit() {
    setBusy(true); setError("");
    const ev: CalEvent = { id: Date.now().toString(), title: form.title, date: form.date, type: form.type, description: form.description };
    try {
      if (!USE_MOCK && form.notify) {
        await apiFetch("/admin/notifications", { method: "POST", body: JSON.stringify({ title: `${form.type}: ${form.title}`, body: `Scheduled for ${form.date}. ${form.description}`, link: "/training/calendar" }) });
        onNotify(`Notification sent to all employees about "${form.title}"`);
      }
      onCreate(ev);
    } catch (e: any) { setError(e?.message ?? "Failed."); }
    finally { setBusy(false); }
  }

  const inp = "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)]";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="card w-full max-w-md p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-700 text-[var(--text)]">Schedule event</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-2)]"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3">
          <label className="block"><span className="mb-1 block text-sm font-500 text-[var(--text)]">Event title</span><input value={form.title} onChange={e => set("title", e.target.value)} className={inp} /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="mb-1 block text-sm font-500 text-[var(--text)]">Date</span><input type="date" value={form.date} onChange={e => set("date", e.target.value)} className={inp} /></label>
            <label className="block"><span className="mb-1 block text-sm font-500 text-[var(--text)]">Type</span>
              <select value={form.type} onChange={e => set("type", e.target.value as EventType)} className={inp}>
                <option value="TRAINING">Training</option>
                <option value="ASSESSMENT">Assessment</option>
                <option value="MEETING">Meeting</option>
              </select>
            </label>
          </div>
          <label className="block"><span className="mb-1 block text-sm font-500 text-[var(--text)]">Description (optional)</span><textarea value={form.description} onChange={e => set("description", e.target.value)} rows={2} className={inp} /></label>
          {isAdmin && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.notify} onChange={e => set("notify", e.target.checked)} className="h-4 w-4 accent-iav-red" />
              <span className="text-sm text-[var(--text)]">Send notification to all employees</span>
            </label>
          )}
          {error && <p className="text-sm text-iav-red">{error}</p>}
          <button onClick={submit} disabled={busy || !form.title || !form.date} className="flex w-full items-center justify-center gap-2 rounded-xl bg-iav-grad py-3 font-600 text-white shadow-glow disabled:opacity-60">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}{busy ? "Scheduling…" : "Schedule"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
