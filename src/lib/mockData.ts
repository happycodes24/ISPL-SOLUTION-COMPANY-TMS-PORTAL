import {
  ComplianceRow,
  DashboardStat,
  Training,
  TrendPoint,
  User,
} from "@/types";

export const DEMO_USERS: Record<string, User> = {
  "admin@iavispl.com": {
    id: "U-1001",
    name: "Aarav Mehta",
    email: "admin@iavispl.com",
    role: "SUPER_ADMIN",
    department: "Information Technology",
    avatarColor: "#D82B25",
  },
  "hr@iavispl.com": {
    id: "U-1002",
    name: "Priya Nair",
    email: "hr@iavispl.com",
    role: "HR_ADMIN",
    department: "Human Resources",
    avatarColor: "#BF1E26",
  },
  "employee@iavispl.com": {
    id: "U-1003",
    name: "Rohit Sharma",
    email: "employee@iavispl.com",
    role: "EMPLOYEE",
    department: "Operations",
    avatarColor: "#393939",
  },
};

export const STATS: DashboardStat[] = [
  { key: "employees", label: "Total Employees", value: 1284, delta: 4.2, icon: "Users" },
  { key: "completion", label: "Training Completion", value: 87, suffix: "%", delta: 6.1, icon: "TrendingUp" },
  { key: "compliance", label: "Compliance Score", value: 93, suffix: "%", delta: 2.4, icon: "ShieldCheck" },
  { key: "active", label: "Active Programs", value: 46, delta: -1.5, icon: "GraduationCap" },
];

export const COMPLIANCE: ComplianceRow[] = [
  { department: "Operations", score: 96, mandatory: 14, completed: 13, expiring: 2 },
  { department: "Engineering", score: 91, mandatory: 18, completed: 16, expiring: 4 },
  { department: "Quality", score: 99, mandatory: 12, completed: 12, expiring: 0 },
  { department: "Sales", score: 78, mandatory: 10, completed: 8, expiring: 5 },
  { department: "Finance", score: 88, mandatory: 9, completed: 8, expiring: 1 },
  { department: "HR", score: 94, mandatory: 8, completed: 8, expiring: 1 },
];

export const TRENDS: TrendPoint[] = [
  { month: "Jan", assigned: 220, completed: 180 },
  { month: "Feb", assigned: 260, completed: 210 },
  { month: "Mar", assigned: 300, completed: 268 },
  { month: "Apr", assigned: 280, completed: 250 },
  { month: "May", assigned: 340, completed: 312 },
  { month: "Jun", assigned: 380, completed: 356 },
];

export const UPCOMING: Training[] = [
  { id: "TRN-2041", name: "ISO 9001:2015 Awareness", category: "Compliance", trainer: "Kavita Rao", type: "Classroom", status: "Scheduled", department: "Quality", priority: "Critical", date: "2026-06-18", durationHrs: 4, enrolled: 42, completionRate: 0 },
  { id: "TRN-2042", name: "Cybersecurity Essentials", category: "Security", trainer: "Imran Q.", type: "Virtual", status: "Active", department: "IT", priority: "High", date: "2026-06-20", durationHrs: 3, enrolled: 88, completionRate: 61 },
  { id: "TRN-2043", name: "Lean Manufacturing 101", category: "Process", trainer: "S. Banerjee", type: "Hybrid", status: "Scheduled", department: "Operations", priority: "Medium", date: "2026-06-24", durationHrs: 6, enrolled: 30, completionRate: 0 },
  { id: "TRN-2044", name: "POSH Annual Refresher", category: "Compliance", trainer: "Priya Nair", type: "Self-learning", status: "Active", department: "All", priority: "Critical", date: "2026-06-30", durationHrs: 1, enrolled: 1284, completionRate: 74 },
];
