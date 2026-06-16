import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const DEPARTMENTS = [
  { code: "IT", name: "Information Technology" },
  { code: "HR", name: "Human Resources" },
  { code: "OPS", name: "Operations" },
  { code: "QA", name: "Quality" },
];

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    employeeCode: "",
    email: "",
    phone: "",
    password: "",
    designation: "",
    departmentCode: "IT",
    team: "",
    location: "",
    joiningDate: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit() {
    setBusy(true);
    setError("");
    const res = await register(form);
    if (res.ok) router.push("/dashboard");
    else {
      setError(res.error ?? "Registration failed.");
      setBusy(false);
    }
  }

  const field = (label: string, key: keyof typeof form, type = "text", required = true) => (
    <div>
      <label className="mb-1.5 block text-sm font-500 text-[var(--text)]">
        {label}
        {required && <span className="text-iav-red"> *</span>}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        className="focus-ring w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-[var(--text)] placeholder:text-[var(--text-muted)]"
      />
    </div>
  );

  return (
    <div className="grid min-h-screen place-items-center bg-[var(--bg)] px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="mb-6 flex items-center gap-3">
          <Image src="/logo-mark.svg" alt="IAV" width={40} height={40} />
          <div>
            <h1 className="font-display text-2xl font-700 text-[var(--text)]">Create your account</h1>
            <p className="text-sm text-[var(--text-muted)]">Employee onboarding · IAVISPL TMS</p>
          </div>
        </div>

        <div className="card p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {field("Full name", "fullName")}
            {field("Employee ID", "employeeCode")}
            {field("Work email", "email", "email")}
            {field("Phone", "phone", "tel", false)}
            {field("Password", "password", "password")}
            {field("Designation", "designation")}
            <div>
              <label className="mb-1.5 block text-sm font-500 text-[var(--text)]">Department<span className="text-iav-red"> *</span></label>
              <select
                value={form.departmentCode}
                onChange={(e) => set("departmentCode", e.target.value)}
                className="focus-ring w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-[var(--text)]"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d.code} value={d.code}>{d.name}</option>
                ))}
              </select>
            </div>
            {field("Team", "team", "text", false)}
            {field("Location", "location", "text", false)}
            {field("Joining date", "joiningDate", "date", false)}
          </div>

          {error && <p className="mt-4 text-sm text-iav-red">{error}</p>}

          <button
            onClick={submit}
            disabled={busy}
            className="focus-ring mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-iav-grad py-3 font-600 text-white shadow-glow transition hover:opacity-95 disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {busy ? "Creating account…" : "Create account"}
          </button>

          <p className="mt-4 text-center text-sm text-[var(--text-muted)]">
            Already have an account?{" "}
            <Link href="/login" className="font-600 text-iav-red">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
