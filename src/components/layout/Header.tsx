import { useState } from "react";
import { Bell, Menu, Moon, Search, Sparkles, Sun, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { ROLE_LABELS } from "@/utils/constants";

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [menu, setMenu] = useState(false);

  return (
    <header className="glass sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-[var(--border)] px-4 md:px-6">
      <button
        onClick={onToggleSidebar}
        className="focus-ring rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--surface-2)]"
        aria-label="Toggle navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          placeholder="Search employees, training, certificates…"
          className="focus-ring w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface-2)] py-2 pl-10 pr-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button className="focus-ring hidden items-center gap-1.5 rounded-xl bg-iav-grad px-3 py-2 text-sm font-600 text-white sm:flex">
          <Sparkles className="h-4 w-4" /> Ask AI
        </button>
        <button
          onClick={toggle}
          className="focus-ring rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--surface-2)]"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button className="focus-ring relative rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--surface-2)]" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-iav-red" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenu((m) => !m)}
            className="focus-ring flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 hover:bg-[var(--surface-2)]"
          >
            <span
              className="grid h-9 w-9 place-items-center rounded-full text-sm font-700 text-white"
              style={{ background: user?.avatarColor }}
            >
              {user?.name.charAt(0)}
            </span>
            <span className="hidden text-left leading-tight md:block">
              <span className="block text-sm font-600 text-[var(--text)]">{user?.name}</span>
              <span className="block text-[11px] text-[var(--text-muted)]">
                {user ? ROLE_LABELS[user.role] : ""}
              </span>
            </span>
          </button>
          <AnimatePresence>
            {menu && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="card absolute right-0 mt-2 w-52 overflow-hidden p-1.5 shadow-glass"
              >
                <div className="px-3 py-2 text-xs text-[var(--text-muted)]">
                  {user?.email}
                </div>
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-iav-red hover:bg-iav-grad-soft"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
