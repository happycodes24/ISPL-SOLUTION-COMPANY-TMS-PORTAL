import Head from "next/head";
import { useEffect, useState } from "react";
import { Loader2, Save, Building2, Lock, GraduationCap, ClipboardCheck, Settings2 } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import GlassCard from "@/components/common/GlassCard";
import PageHeader from "@/components/common/PageHeader";
import { apiFetch, USE_MOCK } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

type Section = { company: R; auth: R; training: R; assessment: R; system: R };
type R = Record<string, string>;

const SECTIONS = [
  { key: "company", label: "Company", icon: Building2, fields: [
    { k: "name", label: "Company name" },
    { k: "shortName", label: "Short name / code" },
    { k: "email", label: "Admin email" },
    { k: "website", label: "Website" },
    { k: "address", label: "HQ address" },
  ]},
  { key: "auth", label: "Authentication", icon: Lock, fields: [
    { k: "passwordMinLength", label: "Min password length", type: "number" },
    { k: "maxFailedLogins", label: "Max failed login attempts", type: "number" },
    { k: "sessionTimeoutMinutes", label: "Session timeout (minutes)", type: "number" },
    { k: "requireStrongPassword", label: "Require strong password", type: "select", options: ["true","false"] },
  ]},
  { key: "training", label: "Training", icon: GraduationCap, fields: [
    { k: "defaultPassingScore", label: "Default passing score (%)", type: "number" },
    { k: "allowSelfEnrollment", label: "Allow self enrollment", type: "select", options: ["true","false"] },
    { k: "sendCompletionEmail", label: "Send completion email", type: "select", options: ["true","false"] },
  ]},
  { key: "assessment", label: "Assessment", icon: ClipboardCheck, fields: [
    { k: "defaultTimeLimit", label: "Default time limit (min)", type: "number" },
    { k: "defaultMaxAttempts", label: "Default max attempts", type: "number" },
  ]},
  { key: "system", label: "System", icon: Settings2, fields: [
    { k: "timezone", label: "Timezone" },
    { k: "dateFormat", label: "Date format" },
    { k: "maintenanceMode", label: "Maintenance mode", type: "select", options: ["false","true"] },
  ]},
];

export default function SettingsPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const [settings, setSettings] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [active, setActive] = useState("company");

  useEffect(() => {
    if (USE_MOCK) {
      setSettings({ company: { name: "Integral Solutions Private Limited", shortName: "IAVISPL", email: "admin@iavispl.com", website: "https://www.iavispl.com", address: "India" }, auth: { passwordMinLength: "8", maxFailedLogins: "5", sessionTimeoutMinutes: "60", requireStrongPassword: "true" }, training: { defaultPassingScore: "70", allowSelfEnrollment: "false", sendCompletionEmail: "true" }, assessment: { defaultTimeLimit: "30", defaultMaxAttempts: "2" }, system: { timezone: "Asia/Kolkata", dateFormat: "DD-MM-YYYY", maintenanceMode: "false" } });
      setLoading(false);
      return;
    }
    apiFetch<{ data: Section }>("/settings").then((r) => setSettings(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  function update(section: string, key: string, val: string) {
    setSettings((prev) => {
      if (!prev) return prev;
      return { ...prev, [section]: { ...(prev as any)[section], [key]: val } };
    });
  }

  async function save() {
    if (!settings) return;
    setSaving(true); setMsg("");
    if (USE_MOCK) { await new Promise(r => setTimeout(r, 500)); setSaving(false); setMsg("Settings saved (mock mode — no backend)."); return; }
    // Flatten to key.subkey format
    const flat: R = {};
    for (const [sec, vals] of Object.entries(settings)) {
      for (const [k, v] of Object.entries(vals as R)) flat[`${sec}.${k}`] = v;
    }
    try {
      await apiFetch("/settings", { method: "PATCH", body: JSON.stringify(flat) });
      setMsg("Settings saved.");
    } catch (e: any) { setMsg(e?.message ?? "Save failed."); }
    finally { setSaving(false); }
  }

  const cur = SECTIONS.find(s => s.key === active);

  return (
    <MainLayout>
      <Head><title>Settings · IAVISPL TMS</title></Head>
      <PageHeader eyebrow="Administration" title="System Settings" action={isSuperAdmin ? (
        <button onClick={save} disabled={saving} className="focus-ring flex items-center gap-2 rounded-xl bg-iav-grad px-4 py-2.5 font-600 text-white shadow-glow disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving…" : "Save settings"}
        </button>
      ) : undefined} />

      {msg && <div className="mb-4 rounded-xl bg-iav-grad-soft px-4 py-2 text-sm font-600 text-iav-red">{msg}</div>}
      {!isSuperAdmin && <div className="mb-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm text-amber-600">View only — Super Admin access required to edit settings.</div>}

      <div className="flex gap-4">
        <div className="flex w-44 shrink-0 flex-col gap-1">
          {SECTIONS.map(s => {
            const Icon = s.icon;
            return (
              <button key={s.key} onClick={() => setActive(s.key)} className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-500 transition ${active === s.key ? "bg-iav-grad text-white" : "text-[var(--text-muted)] hover:bg-[var(--surface-2)]"}`}>
                <Icon className="h-4 w-4" />{s.label}
              </button>
            );
          })}
        </div>

        <GlassCard hover={false} className="flex-1">
          {loading ? (
            <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-10 rounded-lg" />)}</div>
          ) : cur && settings ? (
            <div className="space-y-4">
              <h3 className="font-display font-600 text-[var(--text)]">{cur.label} settings</h3>
              {cur.fields.map(f => {
                const val = (settings as any)[cur.key]?.[f.k] ?? "";
                const inp = "flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] disabled:opacity-60";
                return (
                  <label key={f.k} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span className="w-56 shrink-0 text-sm text-[var(--text)]">{f.label}</span>
                    {f.type === "select" ? (
                      <select value={val} onChange={e => update(cur.key, f.k, e.target.value)} disabled={!isSuperAdmin} className={inp}>
                        {(f.options ?? []).map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={f.type ?? "text"} value={val} onChange={e => update(cur.key, f.k, e.target.value)} disabled={!isSuperAdmin} className={inp} />
                    )}
                  </label>
                );
              })}
            </div>
          ) : null}
        </GlassCard>
      </div>
    </MainLayout>
  );
}
