import { apiFetch, USE_MOCK } from "./api";
import { UPCOMING, COMPLIANCE } from "@/lib/mockData";

export interface TrainingRow {
  id: string;
  code?: string;
  name: string;
  category?: string;
  type?: string;
  status?: string;
  priority?: string;
  durationHrs?: number;
  department?: { name: string } | null;
}

export interface AuditRow {
  id: string;
  user: string;
  action: string;
  entity: string;
  entityId: string | null;
  ipAddress: string | null;
  timestamp: string;
}

export interface ComplianceRow {
  department: string;
  score: number;
  mandatory: number;
  completed: number;
}

export const trainingService = {
  async list(): Promise<{ data: TrainingRow[] }> {
    if (USE_MOCK) {
      return { data: UPCOMING.map((t) => ({ id: t.id, name: t.name, category: t.category, type: t.type, status: t.status, durationHrs: t.durationHrs, department: { name: t.department } })) };
    }
    return apiFetch("/training");
  },
};

export const complianceService = {
  async byDepartment(): Promise<{ data: ComplianceRow[] }> {
    if (USE_MOCK) {
      return { data: COMPLIANCE.map((c) => ({ department: c.department, score: c.score, mandatory: c.mandatory, completed: c.completed })) };
    }
    return apiFetch("/dashboard/compliance");
  },
};

export const auditService = {
  async list(): Promise<{ data: AuditRow[] }> {
    if (USE_MOCK) {
      return {
        data: [
          { id: "a1", user: "admin@iavispl.com", action: "LOGIN", entity: "User", entityId: null, ipAddress: "127.0.0.1", timestamp: new Date().toISOString() },
        ],
      };
    }
    return apiFetch("/audit?limit=50");
  },
};

export const profileService = {
  async get() {
    return apiFetch<{ id: string; email: string; role: string; employee?: any }>("/auth/me");
  },
  async update(payload: Record<string, unknown>) {
    return apiFetch("/employees/me", { method: "PATCH", body: JSON.stringify(payload) });
  },
};
