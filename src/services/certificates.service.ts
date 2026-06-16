import { apiFetch, USE_MOCK } from "./api";

export interface CertRow {
  id: string;
  certificateId: string;
  issuedAt: string;
  training: { name: string; code: string };
  employee?: { firstName: string; lastName: string; employeeCode: string };
}

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("iav-access-token");
}

export const certificatesService = {
  async listMine(): Promise<{ data: CertRow[] }> {
    if (USE_MOCK) return { data: [] };
    return apiFetch("/certificates/mine");
  },

  async listAll(): Promise<{ data: CertRow[] }> {
    if (USE_MOCK) return { data: [] };
    return apiFetch("/certificates");
  },

  async downloadPdf(certId: string) {
    const res = await fetch(`${BASE}/certificates/download/${certId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Download failed.");
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${certId}.pdf`;
    a.click();
  },
};
