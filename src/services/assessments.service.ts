import { apiFetch, USE_MOCK } from "./api";

export interface AssessmentItem {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  timeLimitMin: number | null;
  passingScore: number;
  maxAttempts: number;
  status: string;
  questionCount: number;
  attemptCount: number;
  departmentName: string | null;
}

export interface PublicQuestion {
  id: string;
  type: string;
  text: string;
  options: string[];
  points: number;
}

export interface ManageQuestion extends PublicQuestion {
  correctAnswer: string;
  explanation: string | null;
}

export interface GradedResult {
  score: number;
  passed: boolean;
  earnedPoints: number;
  totalPoints: number;
  attemptNumber: number;
}

export interface ResultRow {
  id: string;
  employeeName: string;
  employeeCode: string;
  score: number;
  passed: boolean;
  attemptNumber: number;
  submittedAt: string;
}

const MOCK: AssessmentItem[] = [
  { id: "demo1", title: "CSV Validation Essentials", description: "Pharma CSV fundamentals.", difficulty: "MEDIUM", timeLimitMin: 20, passingScore: 80, maxAttempts: 2, status: "ACTIVE", questionCount: 3, attemptCount: 0, departmentName: "Quality" },
];
const MOCK_Q: PublicQuestion[] = [
  { id: "q1", type: "MCQ", text: "What does CSV stand for in pharma validation?", options: ["Computer System Validation", "Comma Separated Values", "Central System Verification"], points: 1 },
  { id: "q2", type: "TRUE_FALSE", text: "Validation must be documented.", options: ["True", "False"], points: 1 },
];

export const assessmentsService = {
  async list(): Promise<{ data: AssessmentItem[] }> {
    if (USE_MOCK) return { data: MOCK };
    return apiFetch("/assessments");
  },
  async create(payload: Record<string, unknown>): Promise<{ data: AssessmentItem }> {
    if (USE_MOCK) throw new Error("Creating assessments requires the live backend (NEXT_PUBLIC_USE_MOCK=false).");
    return apiFetch("/assessments", { method: "POST", body: JSON.stringify(payload) });
  },
  async manage(id: string): Promise<{ assessment: AssessmentItem; questions: ManageQuestion[] }> {
    if (USE_MOCK) return { assessment: MOCK[0], questions: [] };
    return apiFetch(`/assessments/${id}/manage`);
  },
  async addQuestion(id: string, payload: Record<string, unknown>) {
    if (USE_MOCK) throw new Error("Adding questions requires the live backend.");
    return apiFetch(`/assessments/${id}/questions`, { method: "POST", body: JSON.stringify(payload) });
  },
  async take(id: string): Promise<{ assessment: AssessmentItem; questions: PublicQuestion[]; attemptsLeft: number }> {
    if (USE_MOCK) return { assessment: MOCK[0], questions: MOCK_Q, attemptsLeft: 1 };
    return apiFetch(`/assessments/${id}/take`);
  },
  async submit(id: string, answers: { questionId: string; answer: string }[]): Promise<{ result: GradedResult }> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      return { result: { score: 100, passed: true, earnedPoints: 2, totalPoints: 2, attemptNumber: 1 } };
    }
    return apiFetch(`/assessments/${id}/submit`, { method: "POST", body: JSON.stringify({ answers }) });
  },
  async results(id: string): Promise<{ data: ResultRow[] }> {
    if (USE_MOCK) return { data: [] };
    return apiFetch(`/assessments/${id}/results`);
  },
};
