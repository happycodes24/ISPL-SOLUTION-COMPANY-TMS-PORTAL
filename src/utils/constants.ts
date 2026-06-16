import { Role } from "@/types";

export const BRAND = {
  appName: "IAVISPL Training Management System",
  shortName: "IAVISPL-TMS",
  poweredBy: "Powered by Integral Solutions Private Limited",
  colors: { red: "#D82B25", crimson: "#BF1E26", charcoal: "#393939" },
};

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  HR_ADMIN: "HR Admin",
  TRAINING_MANAGER: "Training Manager",
  TRAINER: "Trainer",
  EMPLOYEE: "Employee",
  AUDITOR: "Auditor",
};

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: Role[];
}

const ALL: Role[] = [
  "SUPER_ADMIN",
  "HR_ADMIN",
  "TRAINING_MANAGER",
  "TRAINER",
  "EMPLOYEE",
  "AUDITOR",
];

export const NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard", roles: ALL },
  { label: "Employees", href: "/employees", icon: "Users", roles: ["SUPER_ADMIN", "HR_ADMIN", "TRAINING_MANAGER"] },
  { label: "Training", href: "/training", icon: "GraduationCap", roles: ["SUPER_ADMIN", "HR_ADMIN", "TRAINING_MANAGER", "TRAINER", "EMPLOYEE"] },
  { label: "Calendar", href: "/training/calendar", icon: "CalendarDays", roles: ALL },
  { label: "Assessments", href: "/assessments", icon: "ClipboardCheck", roles: ["SUPER_ADMIN", "TRAINING_MANAGER", "TRAINER", "EMPLOYEE"] },
  { label: "Certificates", href: "/certificates", icon: "Award", roles: ALL },
  { label: "Compliance", href: "/compliance", icon: "ShieldCheck", roles: ["SUPER_ADMIN", "HR_ADMIN", "AUDITOR"] },
  { label: "Reports", href: "/reports", icon: "BarChart3", roles: ["SUPER_ADMIN", "HR_ADMIN", "TRAINING_MANAGER", "AUDITOR"] },
  { label: "Audit Trail", href: "/audit", icon: "ScrollText", roles: ["SUPER_ADMIN", "AUDITOR"] },
  { label: "Profile", href: "/profile", icon: "UserCircle", roles: ALL },
  { label: "Settings", href: "/settings", icon: "Settings", roles: ["SUPER_ADMIN"] },
];
