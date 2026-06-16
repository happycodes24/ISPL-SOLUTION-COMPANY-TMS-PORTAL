import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { NAV } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar({ open }: { open: boolean }) {
  const router = useRouter();
  const { user } = useAuth();
  if (!user) return null;

  const items = NAV.filter((n) => n.roles.includes(user.role));

  return (
    <motion.aside
      animate={{ width: open ? 248 : 76 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] md:flex"
    >
      <div className="flex h-16 items-center gap-2.5 px-4">
        <Image src="/logo-mark.svg" alt="IAV" width={30} height={30} priority />
        {open && (
          <div className="leading-tight">
            <div className="font-display text-sm font-700 tracking-tight text-[var(--text)]">
              IAVISPL
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              TMS
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const Icon = (Icons as Record<string, any>)[item.icon] ?? Icons.Circle;
          const active =
            router.pathname === item.href ||
            (item.href !== "/dashboard" && router.pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`focus-ring group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-iav-grad-soft text-iav-red"
                  : "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-iav-grad"
                />
              )}
              <Icon className="h-5 w-5 shrink-0" />
              {open && <span className="truncate font-500">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {open && (
        <div className="border-t border-[var(--border)] p-4 text-[10px] leading-relaxed text-[var(--text-muted)]">
          Powered by Integral
          <br />
          Solutions Pvt. Ltd.
        </div>
      )}
    </motion.aside>
  );
}
