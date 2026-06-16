const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const ACCESS_KEY = "iav-access-token";
const REFRESH_KEY = "iav-refresh-token";

export const tokenStore = {
  get: () => (typeof window === "undefined" ? null : window.localStorage.getItem(ACCESS_KEY)),
  set: (t: string) => window.localStorage.setItem(ACCESS_KEY, t),
  clear: () => {
    window.localStorage.removeItem(ACCESS_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
  },
};

export const refreshStore = {
  get: () => (typeof window === "undefined" ? null : window.localStorage.getItem(REFRESH_KEY)),
  set: (t: string) => window.localStorage.setItem(REFRESH_KEY, t),
};

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** Exchange the stored refresh token for a fresh access token. */
async function tryRefresh(): Promise<boolean> {
  const rt = refreshStore.get();
  if (!rt) return false;
  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: rt }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.accessToken) tokenStore.set(data.accessToken);
    if (data.refreshToken) refreshStore.set(data.refreshToken);
    return !!data.accessToken;
  } catch {
    return false;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  _retried = false
): Promise<T> {
  const token = tokenStore.get();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  // Access token expired -> transparently refresh once and retry.
  if (res.status === 401 && !_retried && refreshStore.get()) {
    const ok = await tryRefresh();
    if (ok) return apiFetch<T>(path, options, true);
  }

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    /* empty body */
  }
  if (!res.ok) throw new ApiError(res.status, body?.error || `Request failed (${res.status}).`);
  return body as T;
}
