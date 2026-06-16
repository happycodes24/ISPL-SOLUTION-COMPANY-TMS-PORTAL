export type Role =
  | "SUPER_ADMIN"
  | "HR_ADMIN"
  | "TRAINING_MANAGER"
  | "TRAINER"
  | "EMPLOYEE"
  | "AUDITOR";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  avatarColor: string;
}

export type TrainingType = "Classroom" | "Virtual" | "Self-learning" | "Hybrid";
export type TrainingStatus =
  | "Draft"
  | "Scheduled"
  | "Active"
  | "Completed"
  | "Expired";

export interface Training {
  id: string;
  name: string;
  category: string;
  trainer: string;
  type: TrainingType;
  status: TrainingStatus;
  department: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  date: string;
  durationHrs: number;
  enrolled: number;
  completionRate: number;
}

export interface DashboardStat {
  key: string;
  label: string;
  value: number;
  suffix?: string;
  delta: number;
  icon: string;
}

export interface ComplianceRow {
  department: string;
  score: number;
  mandatory: number;
  completed: number;
  expiring: number;
}

export interface TrendPoint {
  month: string;
  completed: number;
  assigned: number;
}
