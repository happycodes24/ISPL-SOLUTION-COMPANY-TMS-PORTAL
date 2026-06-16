import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2, MailCheck } from "lucide-react";
import { authService } from "@/services/auth.service";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState("");

  async function submit() {
    setBusy(true);
    const msg = await authService.forgotPassword(email, reason);
    setDone(msg);
    setBusy(false);
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[var(--bg)] px-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="mb-6 flex items-center gap-3">
          <Image src="/logo-mark.svg" alt="IAV" width={40} height={40} />
          <span className="font-display text-lg font-700 text-[var(--text)]">Reset password</span>
        </div>

        {done ? (
          <div className="card p-6 text-center">
            <MailCheck className="mx-auto mb-3 h-10 w-10 text-emerald-500" />
            <p className="text-sm text-[var(--text)]">{done}</p>
            <Link href="/login" className="mt-4 inline-block font-600 text-iav-red">Back to sign in</Link>
          </div>
        ) : (
          <div className="card p-6">
            <p className="mb-4 text-sm text-[var(--text-muted)]">
              Password resets are approved by an administrator. Submit a request and
              your admin will be notified.
            </p>
            <label className="mb-1.5 block text-sm font-500 text-[var(--text)]">Work email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@iavispl.com"
              className="focus-ring mb-3 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-[var(--text)] placeholder:text-[var(--text-muted)]"
            />
            <label className="mb-1.5 block text-sm font-500 text-[var(--text)]">Reason (optional)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="focus-ring mb-4 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-[var(--text)]"
            />
            <button
              onClick={submit}
              disabled={busy || !email}
              className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl bg-iav-grad py-3 font-600 text-white shadow-glow disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {busy ? "Sending…" : "Send reset request"}
            </button>
            <Link href="/login" className="mt-4 block text-center text-sm text-[var(--text-muted)]">
              Back to sign in
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
