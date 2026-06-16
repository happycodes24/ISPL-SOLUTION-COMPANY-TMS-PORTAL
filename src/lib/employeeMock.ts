export interface EmployeeRow {
  id: string;
  employeeCode: string;
  name: string;
  designation: string;
  department: string;
  team: string | null;
  location: string | null;
  profilePhotoUrl: string | null;
  isActive: boolean;
  trainingStatus: string;
  testScore: number | null;
  completionDate: string | null;
}

export const MOCK_EMPLOYEES: EmployeeRow[] = [
  { id: "E1", employeeCode: "IAV-0001", name: "Aarav Mehta", designation: "System Administrator", department: "Information Technology", team: "Platform", location: "Gurugram", profilePhotoUrl: null, isActive: true, trainingStatus: "Completed", testScore: 100, completionDate: "2026-05-21" },
  { id: "E2", employeeCode: "IAV-0002", name: "Priya Nair", designation: "HR Manager", department: "Human Resources", team: "People Ops", location: "Bengaluru", profilePhotoUrl: null, isActive: true, trainingStatus: "Completed", testScore: 80, completionDate: "2026-05-18" },
  { id: "E3", employeeCode: "IAV-0003", name: "Rohit Sharma", designation: "Operations Executive", department: "Operations", team: "North", location: "Pune", profilePhotoUrl: null, isActive: true, trainingStatus: "In progress", testScore: null, completionDate: null },
  { id: "E4", employeeCode: "IAV-0004", name: "Kavita Rao", designation: "QA Lead", department: "Quality", team: "Audit", location: "Hyderabad", profilePhotoUrl: null, isActive: true, trainingStatus: "Completed", testScore: 100, completionDate: "2026-06-02" },
  { id: "E5", employeeCode: "IAV-0005", name: "Imran Qureshi", designation: "Security Engineer", department: "Information Technology", team: "SecOps", location: "Gurugram", profilePhotoUrl: null, isActive: true, trainingStatus: "In progress", testScore: null, completionDate: null },
  { id: "E6", employeeCode: "IAV-0006", name: "Sneha Banerjee", designation: "Process Analyst", department: "Operations", team: "South", location: "Chennai", profilePhotoUrl: null, isActive: false, trainingStatus: "Not assigned", testScore: null, completionDate: null },
];
