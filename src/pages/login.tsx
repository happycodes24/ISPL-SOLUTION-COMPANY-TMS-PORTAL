import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { BRAND } from "@/utils/constants";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setBusy(true);
    setError("");
    const res = await login(email, password);
    if (res.ok) router.push("/dashboard");
    else {
      setError(res.error ?? "Unable to sign in.");
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-surface-night lg:block">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-iav-red/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-iav-crimson/20 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Image src="/logo-mark.svg" alt="IAV" width={56} height={56} />
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display text-4xl font-700 leading-tight"
            >
              Train. Certify.
              <br />
              <span className="text-iav-red">Stay compliant.</span>
            </motion.h2>
            <p className="mt-4 max-w-md text-white/60">
              One platform for the complete employee training lifecycle — planning,
              delivery, assessment, certification and audit-ready compliance.
            </p>
            <div className="mt-8 flex items-center gap-2 text-sm text-white/50">
              <ShieldCheck className="h-4 w-4 text-iav-red" />
              JWT · RBAC · Encrypted · Audit trail
            </div>
          </div>
          <p className="text-xs text-white/40">{BRAND.poweredBy}</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-[var(--bg)] px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Image src="/logo-mark.svg" alt="IAV" width={40} height={40} />
            <span className="font-display text-lg font-700 text-[var(--text)]">IAVISPL TMS</span>
          </div>

          <h1 className="font-display text-2xl font-700 text-[var(--text)]">Welcome back</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Sign in to your training workspace.
          </p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-500 text-[var(--text)]">Work email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="you@iavispl.com"
                className="focus-ring w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-500 text-[var(--text)]">Password</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="••••••••"
                  className="focus-ring w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 pr-11 text-[var(--text)] placeholder:text-[var(--text-muted)]"
                />
                <button
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                  aria-label="Toggle password"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-iav-red">{error}</p>}

            <button
              onClick={submit}
              disabled={busy}
              className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl bg-iav-grad py-3 font-600 text-white shadow-glow transition hover:opacity-95 disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {busy ? "Signing in…" : "Sign in"}
            </button>

            <div className="flex items-center justify-between text-sm">
              <Link href="/register" className="font-600 text-iav-red hover:underline">
                Create account
              </Link>
              <Link href="/forgot-password" className="text-[var(--text-muted)] hover:text-iav-red">
                Forgot password?
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
