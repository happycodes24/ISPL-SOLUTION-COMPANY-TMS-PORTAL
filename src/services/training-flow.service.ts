import { apiFetch, USE_MOCK } from "./api";

export interface TrainingFlowData {
  training: { id: string; name: string; code: string; description: string | null; durationHrs: number };
  materials: { id: string; title: string; type: string; fileUrl: string }[];
  enrollment: { status: string; progress: number; completedAt: string | null } | null;
  reading: { readSec: number; requiredSec: number; complete: boolean };
  assessment: { id: string; title: string; timeLimitMin: number | null; passingScore: number; maxAttempts: number; attemptsUsed: number; attemptsLeft: number; status: string } | null;
}

const MOCK_FLOW: TrainingFlowData = {
  training: { id: "demo", name: "CSV Validation Essentials", code: "TRN-0001", description: "Core concepts of Computer System Validation in GxP environments.", durationHrs: 0.083 },
  materials: [{ id: "m1", title: "CSV Guidelines Document", type: "PDF", fileUrl: "#" }],
  enrollment: { status: "IN_PROGRESS", progress: 40, completedAt: null },
  reading: { readSec: 0, requiredSec: 300, complete: false },
  assessment: { id: "demo1", title: "CSV Validation Essentials Test", timeLimitMin: 15, passingScore: 70, maxAttempts: 3, attemptsUsed: 0, attemptsLeft: 3, status: "ACTIVE" },
};

export const trainingFlowService = {
  async get(trainingId: string): Promise<{ data: TrainingFlowData }> {
    if (USE_MOCK) return { data: MOCK_FLOW };
    return apiFetch(`/training-flow/${trainingId}`);
  },

  async startReading(trainingId: string): Promise<{ sessionId: string }> {
    if (USE_MOCK) return { sessionId: "mock-session" };
    return apiFetch(`/training-flow/${trainingId}/start-reading`, { method: "POST" });
  },

  async updateProgress(trainingId: string, durationSec: number) {
    if (USE_MOCK) return;
    return apiFetch(`/training-flow/${trainingId}/reading-progress`, {
      method: "PATCH",
      body: JSON.stringify({ durationSec }),
    });
  },
};
