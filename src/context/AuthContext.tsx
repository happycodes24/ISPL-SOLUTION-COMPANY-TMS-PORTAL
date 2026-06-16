import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/router";
import { User } from "@/types";
import { authService } from "@/services/auth.service";
import { USE_MOCK, tokenStore } from "@/services/api";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (payload: Record<string, unknown>) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  loading: true,
  login: async () => ({ ok: false }),
  register: async () => ({ ok: false }),
  logout: () => {},
});

const KEY = "iav-session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Restore session. In mock mode we cache the user; with a live backend we
  // re-validate the stored JWT against /auth/me.
  useEffect(() => {
    (async () => {
      try {
        if (USE_MOCK) {
          const raw = window.sessionStorage.getItem(KEY);
          if (raw) setUser(JSON.parse(raw));
        } else if (tokenStore.get()) {
          const me = await authService.me();
          setUser(me);
        }
      } catch {
        tokenStore.clear();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function persist(u: User) {
    setUser(u);
    if (USE_MOCK) window.sessionStorage.setItem(KEY, JSON.stringify(u));
  }

  async function login(email: string, password: string) {
    try {
      const u = await authService.login(email, password);
      persist(u);
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? "Unable to sign in." };
    }
  }

  async function register(payload: Record<string, unknown>) {
    try {
      const u = await authService.register(payload);
      persist(u);
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? "Registration failed." };
    }
  }

  function logout() {
    authService.logout();
    setUser(null);
    window.sessionStorage.removeItem(KEY);
    router.push("/login");
  }

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
