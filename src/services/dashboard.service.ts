import { apiFetch, USE_MOCK } from "./api";
import { DashboardStat } from "@/types";
import { STATS, COMPLIANCE } from "@/lib/mockData";
import { MOCK_EMPLOYEES, EmployeeRow } from "@/lib/employeeMock";

export interface LiveDashboardData {
  totalEmployees: number;
  activeEmployees: number;
  completionRate: number;
  activePrograms: number;
  complianceScore: number;
  pendingResets: number;
  passRate: number;
  completedEnrollments: number;
  totalEnrollments: number;
  trend: { month: string; assigned: number; completed: number }[];
  complianceByDept: { department: string; score: number; mandatory: number; completed: number }[];
}

export const dashboardService = {
  async stats(): Promise<{ stats: DashboardStat[]; completion: { rate: number; completed: number; inProgress: number } }> {
    if (USE_MOCK) {
      return { stats: STATS, completion: { rate: 87, completed: 312, inProgress: 46 } };
    }
    const r = await apiFetch<{ data: LiveDashboardData }>("/dashboard/stats");
    const d = r.data;
    const stats: DashboardStat[] = [
      { key: "employees", label: "Total Employees", value: d.totalEmployees, delta: 0, icon: "Users" },
      { key: "completion", label: "Training Completion", value: d.completionRate, suffix: "%", delta: 0, icon: "TrendingUp" },
      { key: "compliance", label: "Compliance Score", value: d.complianceScore, suffix: "%", delta: 0, icon: "ShieldCheck" },
      { key: "programs", label: "Active Programs", value: d.activePrograms, delta: 0, icon: "GraduationCap" },
    ];
    return {
      stats,
      completion: {
        rate: d.completionRate,
        completed: d.completedEnrollments,
        inProgress: d.totalEnrollments - d.completedEnrollments,
      },
    };
  },

  async liveData(): Promise<LiveDashboardData | null> {
    if (USE_MOCK) return null;
    const r = await apiFetch<{ data: LiveDashboardData }>("/dashboard/stats");
    return r.data;
  },

  async notifications() {
    if (USE_MOCK) return { data: [] };
    return apiFetch<{ data: any[] }>("/dashboard/notifications");
  },

  async markNotificationsRead() {
    if (USE_MOCK) return;
    return apiFetch("/dashboard/notifications/read", { method: "POST" });
  },

  async compliance() {
    if (USE_MOCK) return { data: COMPLIANCE };
    return apiFetch<{ data: typeof COMPLIANCE }>("/dashboard/compliance");
  },
};

export const employeeService = {
  async list(params: { search?: string; status?: string; page?: number } = {}): Promise<{ data: EmployeeRow[]; total: number }> {
    if (USE_MOCK) {
      let rows = MOCK_EMPLOYEES;
      if (params.search) {
        const q = params.search.toLowerCase();
        rows = rows.filter((r) => r.name.toLowerCase().includes(q) || r.employeeCode.toLowerCase().includes(q));
      }
      if (params.status === "active") rows = rows.filter((r) => r.isActive);
      if (params.status === "inactive") rows = rows.filter((r) => !r.isActive);
      return { data: rows, total: rows.length };
    }
    const qs = new URLSearchParams();
    if (params.search) qs.set("search", params.search);
    if (params.status) qs.set("status", params.status);
    if (params.page) qs.set("page", String(params.page));
    return apiFetch(`/employees?${qs.toString()}`);
  },

  async create(payload: Record<string, unknown>) {
    if (USE_MOCK) throw new Error("Creating employees requires live backend.");
    return apiFetch("/employees", { method: "POST", body: JSON.stringify(payload) });
  },

  async update(id: string, payload: Record<string, unknown>) {
    if (USE_MOCK) throw new Error("Updating employees requires live backend.");
    return apiFetch(`/employees/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
  },

  async setStatus(id: string, isActive: boolean) {
    if (USE_MOCK) return { data: { id, isActive } };
    return apiFetch(`/employees/${id}/status`, { method: "PATCH", body: JSON.stringify({ isActive }) });
  },

  async changePassword(id: string, newPassword: string) {
    if (USE_MOCK) throw new Error("Requires live backend.");
    return apiFetch(`/admin/employees/${id}/password`, { method: "PATCH", body: JSON.stringify({ newPassword }) });
  },

  async listResetRequests() {
    if (USE_MOCK) return { data: [] };
    return apiFetch<{ data: any[] }>("/admin/reset-requests");
  },

  async approveReset(id: string, newPassword: string) {
    return apiFetch(`/admin/reset-requests/${id}/approve`, { method: "POST", body: JSON.stringify({ newPassword }) });
  },

  async rejectReset(id: string) {
    return apiFetch(`/admin/reset-requests/${id}/reject`, { method: "POST" });
  },
};
