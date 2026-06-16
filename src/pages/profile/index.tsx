import Head from "next/head";
import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import GlassCard from "@/components/common/GlassCard";
import PageHeader from "@/components/common/PageHeader";
import { profileService } from "@/services/modules.service";
import { USE_MOCK } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ phone: "", designation: "", team: "", location: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (USE_MOCK) {
      setForm({ phone: "", designation: "—", team: "—", location: "—" });
      setLoading(false);
      return;
    }
    profileService.get().then((r) => {
      const e = r.employee || {};
      setForm({ phone: e.phone ?? "", designation: e.designation ?? "", team: e.team ?? "", location: e.location ?? "" });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    setMsg("");
    if (USE_MOCK) { setMsg("Profile editing requires the live backend (NEXT_PUBLIC_USE_MOCK=false)."); return; }
    setSaving(true);
    try {
      await profileService.update(form);
      setMsg("Profile updated.");
    } catch (e: any) {
      setMsg(e?.message ?? "Could not update profile.");
    } finally {
      setSaving(false);
    }
  }

  const field = (label: string, key: keyof typeof form, disabled = false) => (
    <div>
      <label className="mb-1.5 block text-sm font-500 text-[var(--text)]">{label}</label>
      <input value={form[key]} onChange={(e) => set(key, e.target.value)} disabled={disabled} className="focus-ring w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-[var(--text)] disabled:opacity-60" />
    </div>
  );

  return (
    <MainLayout>
      <Head><title>Profile · IAVISPL TMS</title></Head>
      <PageHeader eyebrow="My account" title="Profile" />

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="flex flex-col items-center text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-iav-grad text-2xl font-700 text-white">{user?.name?.charAt(0) ?? "U"}</span>
          <h3 className="mt-3 font-display text-lg font-600 text-[var(--text)]">{user?.name}</h3>
          <p className="text-sm text-[var(--text-muted)]">{user?.email}</p>
          <span className="mt-2 rounded-full bg-iav-grad-soft px-3 py-1 text-xs font-600 text-iav-red">{user?.role?.replace("_", " ")}</span>
        </GlassCard>

        <GlassCard hover={false} className="lg:col-span-2">
          {loading ? (
            <div className="grid gap-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-10 rounded-lg" />)}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {field("Designation", "designation")}
                {field("Phone", "phone")}
                {field("Team", "team")}
                {field("Location", "location")}
              </div>
              {msg && <p className="mt-4 text-sm text-iav-red">{msg}</p>}
              <button onClick={save} disabled={saving} className="focus-ring mt-5 flex items-center gap-2 rounded-xl bg-iav-grad px-5 py-2.5 font-600 text-white shadow-glow disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save changes
              </button>
            </>
          )}
        </GlassCard>
      </div>
    </MainLayout>
  );
}
