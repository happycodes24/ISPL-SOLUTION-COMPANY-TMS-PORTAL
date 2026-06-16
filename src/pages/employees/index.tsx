import Head from "next/head";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, UserCheck, UserX, Key, Edit2, X, Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import GlassCard from "@/components/common/GlassCard";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { employeeService } from "@/services/dashboard.service";
import { useAuth } from "@/context/AuthContext";

const ADMIN_ROLES = ["SUPER_ADMIN", "HR_ADMIN"];
const DEPARTMENTS = [
  { code: "IT", name: "Information Technology" },
  { code: "HR", name: "Human Resources" },
  { code: "OPS", name: "Operations" },
  { code: "QA", name: "Quality" },
];

interface Employee {
  id: string; name: string; employeeCode: string;
  department?: string; designation?: string;
  email?: string; isActive?: boolean; phone?: string;
  firstName?: string; lastName?: string;
}

type Modal = null | { type: "create" } | { type: "edit"; emp: Employee } | { type: "password"; emp: Employee } | { type: "resets" };

export default function EmployeesPage() {
  const { user } = useAuth();
  const isAdmin = !!user && ADMIN_ROLES.includes(user.role);
  const [rows, setRows] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Modal>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [toast, setToast] = useState("");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function load() {
    setLoading(true);
    const r = await employeeService.list({ search, status });
    setRows((r as any).data ?? []);
    setTotal((r as any).total ?? 0);
    setLoading(false);
  }

  async function loadResets() {
    if (!isAdmin) return;
    try {
      const r = await employeeService.listResetRequests();
      setPendingCount((r.data ?? []).length);
    } catch {}
  }

  useEffect(() => { load(); loadResets(); }, [search, status]);

  async function toggleStatus(emp: Employee) {
    try {
      await employeeService.setStatus(emp.id, !emp.isActive);
      showToast(`${emp.name ?? emp.id} ${!emp.isActive ? "enabled" : "disabled"}.`);
      load();
    } catch (e: any) { showToast(e?.message ?? "Failed."); }
  }

  return (
    <MainLayout>
      <Head><title>Employees · IAVISPL TMS</title></Head>
      <PageHeader
        eyebrow={`${total} total`}
        title="Employees"
        action={isAdmin ? (
          <div className="flex gap-2">
            {pendingCount > 0 && (
              <button onClick={() => setModal({ type: "resets" })} className="flex items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 px-3 py-2.5 text-sm font-600 text-amber-600">
                <AlertTriangle className="h-4 w-4" /> {pendingCount} reset request{pendingCount > 1 ? "s" : ""}
              </button>
            )}
            <button onClick={() => setModal({ type: "create" })} className="focus-ring flex items-center gap-2 rounded-xl bg-iav-grad px-4 py-2.5 font-600 text-white shadow-glow">
              <Plus className="h-4 w-4" /> Add employee
            </button>
          </div>
        ) : undefined}
      />

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, ID…" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-9 pr-4 py-2.5 text-sm text-[var(--text)]" />
        </div>
        <select value={status} onChange={e => setStatus(e.target.value)} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)]">
          <option value="">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
      ) : rows.length === 0 ? (
        <EmptyState icon="Users" title="No employees found" message="No employees match your search or filter." />
      ) : (
        <GlassCard hover={false} className="overflow-x-auto p-0">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wider text-[var(--text-muted)]">
                <th className="px-5 py-3 font-600">Employee</th>
                <th className="px-3 py-3 font-600">Department</th>
                <th className="px-3 py-3 font-600">Designation</th>
                <th className="px-3 py-3 font-600">Status</th>
                {isAdmin && <th className="px-5 py-3 font-600">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((emp, i) => (
                <motion.tr key={emp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-[var(--border)] hover:bg-[var(--surface-2)]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-iav-grad text-xs font-700 text-white">
                        {(emp.name || "?").charAt(0)}
                      </span>
                      <div>
                        <div className="font-500 text-[var(--text)]">{emp.name}</div>
                        <div className="font-mono text-xs text-[var(--text-muted)]">{emp.employeeCode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[var(--text-muted)]">{emp.department ?? "—"}</td>
                  <td className="px-3 py-3 text-[var(--text-muted)]">{emp.designation ?? "—"}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-600 ${emp.isActive !== false ? "bg-emerald-400/15 text-emerald-500" : "bg-gray-400/15 text-gray-500"}`}>
                      {emp.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <TipBtn icon={Edit2} tip="Edit" onClick={() => setModal({ type: "edit", emp })} />
                        <TipBtn icon={Key} tip="Change password" onClick={() => setModal({ type: "password", emp })} />
                        <TipBtn icon={emp.isActive !== false ? UserX : UserCheck} tip={emp.isActive !== false ? "Disable" : "Enable"} onClick={() => toggleStatus(emp)} className={emp.isActive !== false ? "hover:text-iav-red" : "hover:text-emerald-500"} />
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}

      {toast && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-6 right-6 z-50 rounded-xl bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-sm font-500 text-[var(--text)] shadow-xl">
          {toast}
        </motion.div>
      )}

      <AnimatePresence>
        {modal?.type === "create" && <CreateEmployeeModal onClose={() => setModal(null)} onDone={() => { setModal(null); load(); showToast("Employee created."); }} />}
        {modal?.type === "edit" && <EditEmployeeModal emp={modal.emp} onClose={() => setModal(null)} onDone={() => { setModal(null); load(); showToast("Employee updated."); }} />}
        {modal?.type === "password" && <ChangePasswordModal emp={modal.emp} onClose={() => setModal(null)} onDone={() => { setModal(null); showToast("Password changed."); }} />}
        {modal?.type === "resets" && <ResetRequestsModal onClose={() => { setModal(null); loadResets(); }} />}
      </AnimatePresence>
    </MainLayout>
  );
}

function TipBtn({ icon: Icon, tip, onClick, className = "" }: { icon: any; tip: string; onClick: () => void; className?: string }) {
  return (
    <button title={tip} onClick={onClick} className={`rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-2)] ${className}`}>
      <Icon className="h-4 w-4" />
    </button>
  );
}

function ModalWrap({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-700 text-[var(--text)]">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-2)]"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function FField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1 block text-sm font-500 text-[var(--text)]">{label}</span>{children}</label>;
}
const inp = "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)]";

function CreateEmployeeModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "Welcome@123", employeeCode: "", designation: "", departmentCode: "IT", phone: "", joiningDate: new Date().toISOString().slice(0, 10) });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function submit() {
    setBusy(true); setError("");
    try {
      await employeeService.create(form);
      onDone();
    } catch (e: any) { setError(e?.message ?? "Failed."); setBusy(false); }
  }

  return (
    <ModalWrap title="Add employee" onClose={onClose}>
      <div className="grid grid-cols-2 gap-3">
        <FField label="First name"><input value={form.firstName} onChange={e => set("firstName", e.target.value)} className={inp} /></FField>
        <FField label="Last name"><input value={form.lastName} onChange={e => set("lastName", e.target.value)} className={inp} /></FField>
        <FField label="Work email"><input type="email" value={form.email} onChange={e => set("email", e.target.value)} className={inp} /></FField>
        <FField label="Employee ID"><input value={form.employeeCode} onChange={e => set("employeeCode", e.target.value)} placeholder="IAV-0001" className={inp} /></FField>
        <FField label="Password"><input type="password" value={form.password} onChange={e => set("password", e.target.value)} className={inp} /></FField>
        <FField label="Phone"><input value={form.phone} onChange={e => set("phone", e.target.value)} className={inp} /></FField>
        <FField label="Designation"><input value={form.designation} onChange={e => set("designation", e.target.value)} className={inp} /></FField>
        <FField label="Department">
          <select value={form.departmentCode} onChange={e => set("departmentCode", e.target.value)} className={inp}>
            {DEPARTMENTS.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
          </select>
        </FField>
        <div className="col-span-2">
          <FField label="Joining date"><input type="date" value={form.joiningDate} onChange={e => set("joiningDate", e.target.value)} className={inp} /></FField>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-iav-red">{error}</p>}
      <button onClick={submit} disabled={busy || !form.firstName || !form.email} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-iav-grad py-3 font-600 text-white shadow-glow disabled:opacity-60">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}{busy ? "Creating…" : "Create employee"}
      </button>
    </ModalWrap>
  );
}

function EditEmployeeModal({ emp, onClose, onDone }: { emp: Employee; onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState({ designation: emp.designation ?? "", phone: emp.phone ?? "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function submit() {
    setBusy(true); setError("");
    try { await employeeService.update(emp.id, form); onDone(); }
    catch (e: any) { setError(e?.message ?? "Failed."); setBusy(false); }
  }

  return (
    <ModalWrap title={`Edit · ${emp.name}`} onClose={onClose}>
      <div className="space-y-3">
        <FField label="Designation"><input value={form.designation} onChange={e => set("designation", e.target.value)} className={inp} /></FField>
        <FField label="Phone"><input value={form.phone} onChange={e => set("phone", e.target.value)} className={inp} /></FField>
      </div>
      {error && <p className="mt-2 text-sm text-iav-red">{error}</p>}
      <button onClick={submit} disabled={busy} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-iav-grad py-3 font-600 text-white disabled:opacity-60">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}{busy ? "Saving…" : "Save changes"}
      </button>
    </ModalWrap>
  );
}

function ChangePasswordModal({ emp, onClose, onDone }: { emp: Employee; onClose: () => void; onDone: () => void }) {
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setBusy(true); setError("");
    try { await employeeService.changePassword(emp.id, pw); onDone(); }
    catch (e: any) { setError(e?.message ?? "Failed."); setBusy(false); }
  }

  return (
    <ModalWrap title={`Change password · ${emp.name}`} onClose={onClose}>
      <FField label="New password">
        <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Minimum 8 characters" className={inp} />
      </FField>
      {error && <p className="mt-2 text-sm text-iav-red">{error}</p>}
      <button onClick={submit} disabled={busy || pw.length < 8} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-iav-grad py-3 font-600 text-white disabled:opacity-60">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}{busy ? "Updating…" : "Update password"}
      </button>
    </ModalWrap>
  );
}

function ResetRequestsModal({ onClose }: { onClose: () => void }) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pws, setPws] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    employeeService.listResetRequests().then(r => setRequests(r.data ?? [])).finally(() => setLoading(false));
  }, []);

  async function approve(id: string) {
    if (!pws[id] || pws[id].length < 8) { setMsg("Enter a new password (min 8 chars) for this request."); return; }
    setBusy(id);
    try { await employeeService.approveReset(id, pws[id]); setRequests(r => r.filter(x => x.id !== id)); setMsg("Approved and password set."); }
    catch (e: any) { setMsg(e?.message ?? "Failed."); }
    finally { setBusy(null); }
  }

  async function reject(id: string) {
    setBusy(id);
    try { await employeeService.rejectReset(id); setRequests(r => r.filter(x => x.id !== id)); }
    catch (e: any) { setMsg(e?.message ?? "Failed."); }
    finally { setBusy(null); }
  }

  return (
    <ModalWrap title="Password Reset Requests" onClose={onClose}>
      {msg && <p className="mb-3 text-sm text-iav-red">{msg}</p>}
      {loading ? <div className="skeleton h-20 rounded-xl" /> : requests.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No pending reset requests.</p>
      ) : (
        <div className="space-y-4">
          {requests.map(r => (
            <div key={r.id} className="rounded-xl border border-[var(--border)] p-4">
              <div className="font-500 text-[var(--text)]">{r.user?.employee ? `${r.user.employee.firstName} ${r.user.employee.lastName}` : r.email}</div>
              <div className="text-xs text-[var(--text-muted)]">{r.email} · {r.user?.employee?.employeeCode}</div>
              {r.reason && <div className="mt-1 text-xs text-[var(--text-muted)]">Reason: {r.reason}</div>}
              <div className="mt-3 flex gap-2">
                <input value={pws[r.id] ?? ""} onChange={e => setPws(p => ({ ...p, [r.id]: e.target.value }))} placeholder="New password" type="password" className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)]" />
                <button onClick={() => approve(r.id)} disabled={busy === r.id} className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-600 text-white disabled:opacity-60">
                  {busy === r.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                </button>
                <button onClick={() => reject(r.id)} disabled={busy === r.id} className="rounded-lg bg-iav-red px-3 py-2 text-xs font-600 text-white disabled:opacity-60">
                  <XCircle className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ModalWrap>
  );
}
