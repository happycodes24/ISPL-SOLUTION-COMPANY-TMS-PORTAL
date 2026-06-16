import { apiFetch, tokenStore, refreshStore, USE_MOCK } from "./api";
import { User } from "@/types";
import { DEMO_USERS } from "@/lib/mockData";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; role: User["role"] };
}

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

function storeTokens(res: LoginResponse) {
  tokenStore.set(res.accessToken);
  refreshStore.set(res.refreshToken);
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 600));
      const u = DEMO_USERS[email.toLowerCase().trim()];
      if (!u) throw new Error("Account not found.");
      return u;
    }
    const res = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    storeTokens(res);
    return authService.me();
  },

  async register(payload: Record<string, unknown>): Promise<User> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 600));
      throw new Error("Registration requires the live backend. Set NEXT_PUBLIC_USE_MOCK=false.");
    }
    const res = await apiFetch<LoginResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    storeTokens(res);
    return authService.me();
  },

  async me(): Promise<User> {
    const r = await apiFetch<{ id: string; email: string; role: User["role"]; employee?: any }>("/auth/me");
    return {
      id: r.id,
      email: r.email,
      role: r.role,
      name: r.employee ? `${r.employee.firstName} ${r.employee.lastName}` : r.email,
      department: r.employee?.department?.name ?? "—",
      avatarColor: "#D82B25",
    };
  },

  async forgotPassword(email: string, reason?: string): Promise<string> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      return "Your reset request has been sent to your administrator for approval.";
    }
    const r = await apiFetch<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email, reason }),
    });
    return r.message;
  },

  async logout() {
    const rt = refreshStore.get();
    if (rt && !USE_MOCK) {
      // Best-effort server-side revoke; ignore failures.
      try {
        await fetch(`${BASE}/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: rt }),
        });
      } catch {
        /* ignore */
      }
    }
    tokenStore.clear();
  },
};
