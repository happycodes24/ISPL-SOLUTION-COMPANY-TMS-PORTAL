<div align="center">

<!-- ANIMATED HEADER BANNER -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=D82B25,BF1E26,1A1A1D&height=200&section=header&text=IAVISPL-TMS&fontSize=60&fontColor=ffffff&fontAlignY=38&desc=Enterprise%20Training%20Management%20System&descAlignY=58&descSize=18&animation=fadeIn" width="100%"/>

<!-- LOGO BADGE -->
<br/>

# 🎓 IAVISPL Training Management System

### *Powered by Integral Solutions Private Limited*

<!-- ANIMATED BADGES -->
<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-✨-0055FF?style=for-the-badge&logo=framer&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/RBAC-6_Roles-D82B25?style=for-the-badge&logo=shield&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-Cache-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Tests-12%2F12_Passing-22c55e?style=for-the-badge&logo=jest&logoColor=white" />
</p>

<br/>

> **A world-class, enterprise-grade Training Management System** covering the complete  
> employee training lifecycle — planning · delivery · assessment · certification · compliance · audit

<br/>

</div>

---

## 📋 Table of Contents

<details open>
<summary><b>Click to expand / collapse</b></summary>

- [✨ What is IAVISPL-TMS?](#-what-is-iavispl-tms)
- [🏗️ Project Structure](#️-project-structure)
- [🎨 Frontend — What it Does](#-frontend--what-it-does)
- [⚙️ Backend — What it Does](#️-backend--what-it-does)
- [🗄️ Database Architecture](#️-database-architecture)
- [🔐 Security Model](#-security-model)
- [🚀 Quick Start](#-quick-start)
- [🐳 Docker Deployment](#-docker-deployment)
- [🌐 API Reference](#-api-reference)
- [👥 Role & Permission System](#-role--permission-system)
- [📊 Tech Stack](#-tech-stack)
- [🗺️ Roadmap](#️-roadmap)
- [📁 Documentation](#-documentation)

</details>

---

## ✨ What is IAVISPL-TMS?

IAVISPL-TMS is a **full-stack, enterprise-grade Training Management System** built for organizations that need to manage the complete employee training lifecycle in one platform.

```
Plan Training → Schedule Sessions → Enroll Employees → Deliver Content
     → Assess Knowledge → Auto-Generate Certificates → Track Compliance → Audit
```

### 🌟 Core Capabilities at a Glance

| 🎯 Feature | 💡 What It Does |
|---|---|
| **Animated Dashboard** | Real-time KPIs with animated counters, progress rings, compliance charts & training trends |
| **Employee Management** | Full CRUD, bulk CSV/Excel import with row-level validation, department assignment |
| **Training Lifecycle** | DRAFT → SCHEDULED → ACTIVE → COMPLETED → EXPIRED state machine |
| **Assessment Engine** | MCQ / True-False with timer, auto-grading, randomization & score analytics |
| **Certificate Generator** | Auto-generated PDF certificates with QR-code verification |
| **Compliance Tracking** | Mandatory training alerts, expiry monitoring, renewal dashboard |
| **Training Calendar** | Monthly/weekly calendar view with drag-and-drop scheduling |
| **Audit Trail** | Every action logged (user, action, entity, IP, timestamp) for corporate compliance |
| **Reports & Export** | Data export to Excel, CSV, PDF with visual charts |
| **Dark / Light Mode** | Fully themed with a custom design system (crimson-on-ink brand palette) |
| **Role-Based Access** | 6 roles (Super Admin → Employee) with middleware-enforced permissions |
| **Demo Mode** | Full UI runs with zero backend — mock data & demo accounts included |

---

## 🏗️ Project Structure

```
iavispl-tms/
│
├── 🖥️  frontend/                 ← Next.js 14 (TypeScript)
│   ├── src/
│   │   ├── pages/               ← App pages (login, dashboard, training, employees…)
│   │   ├── components/
│   │   │   ├── common/          ← GlassCard, ProgressCircle, AnimatedCounter, LoadingAnimation
│   │   │   ├── layout/          ← Header, Sidebar, MainLayout
│   │   │   └── dashboard/       ← StatCard, ComplianceChart, TrainingTrends, UpcomingTrainings
│   │   ├── services/            ← API service layer (auth, training, assessments, dashboard…)
│   │   ├── context/             ← AuthContext, ThemeContext (dark/light mode)
│   │   ├── lib/                 ← Mock data & demo employees for no-backend mode
│   │   ├── types/               ← Shared TypeScript interfaces
│   │   └── utils/               ← Constants, role labels
│   ├── public/                  ← Logo, favicon (SVG/JPG)
│   └── tailwind.config.js       ← Custom iav-red, iav-crimson, glass shadows, custom fonts
│
├── ⚙️  backend/                  ← Node.js + Express (TypeScript)
│   ├── src/
│   │   ├── routes/              ← auth, training, employees, departments, dashboard,
│   │   │                           assessments, certificates, audit, admin, reports, settings
│   │   ├── services/            ← Business logic (employee, department, assessment…)
│   │   ├── repositories/        ← Prisma data-access layer
│   │   ├── middleware/          ← JWT auth, RBAC, rate limiting
│   │   ├── validators/          ← Zod schemas for all request bodies
│   │   ├── swagger/             ← Auto-generated API docs at /api/docs
│   │   ├── utils/               ← AppError, asyncHandler, logger, JWT, CSV util, certificate PDF
│   │   ├── config/              ← env.ts (validates env at startup, refuses bad config)
│   │   └── app.ts               ← Express app factory
│   ├── prisma/
│   │   ├── schema.prisma        ← 20+ models, full relational schema
│   │   └── seed.ts              ← Demo users & data seeder
│   └── tests/                   ← Unit tests (Employee, Department, Assessment)
│
├── 🐳  docker/
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── nginx.conf               ← Reverse proxy: / → frontend, /api → backend
│
├── 📖  docs/
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_DOCUMENTATION.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── SECURITY.md
│   ├── ROADMAP.md
│   └── UPGRADE_NOTES.md
│
├── docker-compose.yml           ← One-command: PostgreSQL + Redis + API + Frontend
└── package.json                 ← Monorepo scripts (dev, build, seed, install-all)
```

---

## 🎨 Frontend — What it Does

The frontend is a **Next.js 14** application with a premium design system built around Framer Motion animations, Tailwind CSS, and Recharts data visualization.

### 🔐 Authentication Pages

| Page | File | What it does |
|---|---|---|
| **Login** | `pages/login.tsx` | Animated login form with role-based redirect, JWT token storage, demo mode fallback |
| **Register** | `pages/register.tsx` | New user registration with validation |
| **Forgot Password** | `pages/forgot-password.tsx` | Password reset flow |

### 📊 Dashboard (`pages/dashboard/`)

The **animated dashboard** is the heart of the app:

- ⏱️ **`AnimatedCounter`** — numbers count up smoothly from 0 on page load
- 🔵 **`ProgressCircle`** — SVG ring that animates to the completion percentage
- 🃏 **`StatCard`** — glassmorphism stat cards (Total Employees, Active Trainings, Compliance Rate…)
- 📈 **`TrainingTrends`** — Recharts line/bar chart of training activity over months
- 🥧 **`ComplianceChart`** — Pie/donut chart of compliance status breakdown
- 📅 **`UpcomingTrainings`** — Next scheduled sessions list

> All dashboard data switches between **live API** and **mock data** transparently via the `dashboardService`.

### 👥 Employee Management (`pages/employees/`)

- Full CRUD table with search, filter, pagination
- **Bulk CSV/Excel import** with row-by-row validation and error reporting
- Department assignment, status toggling (Active / Inactive / On Leave)
- Employee profiles with training history

### 📚 Training Module (`pages/training/`)

| File | Purpose |
|---|---|
| `index.tsx` | Training catalogue — list, search, filter by status/type/priority |
| `[id].tsx` | Training detail page — materials, enrolled employees, sessions, assessments |
| `calendar.tsx` | Monthly/weekly calendar view with drag-and-drop session scheduling |

**Training status flow:**
```
DRAFT ──▶ SCHEDULED ──▶ ACTIVE ──▶ COMPLETED ──▶ EXPIRED
                                        │
                                     (renewal)
```

### 📝 Assessments (`pages/assessments/`)

- `index.tsx` — Assessment library with status tracking
- `[id].tsx` — Live assessment player: MCQ/True-False, countdown timer, auto-submit, instant score display

### 🎓 Certificates (`pages/certificates/`)

- Certificate gallery for logged-in employee
- Download PDF, verify via QR code, filter by expiry status

### 📋 Other Pages

| Page | What it does |
|---|---|
| **Compliance** | Mandatory training tracker, completion heatmap, risk indicators |
| **Reports** | Charts + data export (Excel/CSV/PDF) |
| **Audit** | Full audit-trail viewer (Super Admin & Auditor only) |
| **Profile** | User profile, password change, notification preferences |
| **Settings** | Org settings, working hours, notification config |

### 🎨 Design System Highlights

- **Custom brand palette:** `iav-red: #D82B25`, `iav-crimson: #BF1E26`, `iav-ink: #1A1A1D`
- **Glassmorphism cards:** `backdrop-blur + glass shadow` on all stat cards
- **Framer Motion** page transitions, staggered list animations, entrance effects
- **Dark / Light mode** via CSS variables + `ThemeContext` class toggle
- **Custom fonts:** Sora (display), Inter (body), JetBrains Mono (code)
- **`GlassCard`** — reusable frosted-glass container component
- **`LoadingAnimation`** — skeleton states and spinners

---

## ⚙️ Backend — What it Does

The backend is a **Node.js + Express + TypeScript** REST API with a clean layered architecture.

### Request Pipeline

```
HTTP Request
    │
    ├─ helmet()          ← Security headers (CSP, HSTS, X-Frame-Options…)
    ├─ cors()            ← CORS allow-list (no wildcard)
    ├─ express.json()    ← Body parsing (1MB limit)
    ├─ morgan()          ← HTTP request logging
    ├─ apiLimiter        ← Rate limiting (global + strict on /auth)
    │
    ├─ Router            ← /api/v1/...
    │       ├─ authenticate()    ← Verify JWT access token
    │       ├─ authorize(roles)  ← RBAC — check allowed roles
    │       ├─ Zod validation    ← Validate request body/params/query
    │       └─ Controller        ← Thin handler → Service
    │               └─ Service   ← Business logic → Repository
    │                       └─ Repository  ← Prisma queries
    │
    └─ AuditLog side-effect  ← Written after every mutating action
```

### API Routes

| Route | Description |
|---|---|
| `POST /api/v1/auth/login` | Login, returns access + refresh tokens |
| `POST /api/v1/auth/refresh` | Rotate refresh token |
| `POST /api/v1/auth/logout` | Revoke refresh token |
| `GET/POST /api/v1/employees` | Employee CRUD + CSV bulk import |
| `GET/POST /api/v1/departments` | Department management |
| `GET/POST /api/v1/training` | Training CRUD |
| `POST /api/v1/training-flow/enroll` | Enroll employee in training |
| `GET/POST /api/v1/assessments` | Assessment CRUD + attempt submission |
| `GET /api/v1/certificates` | Employee certificate retrieval |
| `GET /api/v1/dashboard` | Aggregated KPIs for the dashboard |
| `GET /api/v1/reports` | Data for reports (exportable) |
| `GET /api/v1/audit` | Audit log (paginated, filterable) |
| `GET /api/v1/admin` | Admin-only operations |
| `GET /api/v1/settings` | Org settings read/write |
| `GET /health` | Health check endpoint |
| `GET /api/docs` | Swagger UI — interactive API documentation |

### Key Utilities

| Utility | File | Purpose |
|---|---|---|
| **AppError** | `utils/AppError.ts` | Custom error class with HTTP status codes |
| **asyncHandler** | `utils/asyncHandler.ts` | Wraps async controllers, removes try/catch boilerplate |
| **logger** | `utils/logger.ts` | Structured logging |
| **jwt** | `utils/jwt.ts` | Sign/verify access & refresh tokens |
| **csv.util** | `utils/csv.util.ts` | CSV parsing for bulk employee import |
| **certificate.util** | `utils/certificate.util.ts` | PDF certificate generation with QR code |

---

## 🗄️ Database Architecture

**PostgreSQL 15** via **Prisma ORM** with 20+ models across 6 entity groups.

```
┌─────────────────────────────────────────────────────────────┐
│                    ENTITY RELATIONSHIP MAP                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Role 1────* User 1────1 Employee *────1 Department         │
│                              │                              │
│                    ┌─────────┼──────────────┐               │
│                    ▼         ▼              ▼               │
│              1 Trainer    * Enrollment   * Certificate       │
│                    │         │                              │
│                    ▼         ▼                              │
│              * Training ◀──────────── * TrainingMaterial    │
│                    │                                        │
│              * Schedule ──▶ * Attendance                    │
│                    │                                        │
│              1 Assessment ──▶ * Question                    │
│                    │                                        │
│              * AssessmentAttempt                            │
│                                                             │
│  User 1────* AuditLog                                       │
│  User 1────* Notification                                   │
│  User 1────* RefreshToken                                   │
│  Role *────* Permission   (via RolePermission)              │
└─────────────────────────────────────────────────────────────┘
```

### State Machines (Enums)

```
Training Status:     DRAFT → SCHEDULED → ACTIVE → COMPLETED → EXPIRED
Enrollment Status:   ASSIGNED → IN_PROGRESS → COMPLETED | FAILED | EXPIRED
Training Type:       CLASSROOM | VIRTUAL | SELF_LEARNING | HYBRID
Priority:            LOW | MEDIUM | HIGH | CRITICAL
Audit Actions:       LOGIN | LOGOUT | CREATE | UPDATE | DELETE | APPROVE | UPLOAD | EXPORT
```

### Notable Fields

| Model | Field | Why it matters |
|---|---|---|
| `Training` | `validityMonths` | Drives compliance expiry and renewal reminders |
| `Training` | `isMandatory` | Flags compliance-tracked required courses |
| `Certificate` | `verifyToken` | Backs the public QR-code verification URL |
| `Enrollment` | `progress` | 0–100 integer powering completion analytics |
| `AuditLog` | `ipAddress`, `userAgent` | Corporate audit & GDPR traceability |
| `RefreshToken` | `tokenHash`, `revoked` | Secure token rotation, instant revocation |

---

## 🔐 Security Model

| Control | Implementation |
|---|---|
| **Authentication** | Short-lived JWT access tokens (15 min) + rotating refresh tokens (7 days) |
| **Refresh Tokens** | Stored only as SHA-256 **hashes** — plaintext never persisted |
| **Account Lockout** | Configurable max failed logins + lock duration |
| **Passwords** | bcrypt (cost 10) — never stored or logged in plaintext |
| **Authorization** | `authorize(...roles)` middleware on every protected route |
| **Input Validation** | Zod schemas on all request bodies — invalid input returns 400 |
| **SQL Injection** | Prisma parameterizes all queries — no raw string SQL |
| **Security Headers** | Helmet (CSP / Frameguard / HSTS / etc.) |
| **CORS** | Explicit origin allow-list — no wildcard with credentials |
| **Rate Limiting** | Global API limiter + stricter limiter on `/auth` endpoints |
| **Error Handling** | Central handler — no stack traces or internals leaked to clients |
| **User Enumeration** | Login returns a generic message for unknown user / wrong password |
| **Config Safety** | `config/env.ts` validates env at startup and **refuses to boot** with placeholder JWT secrets in production |
| **Auditing** | Immutable `AuditLog` (user, action, entity, IP, user-agent, timestamp) |
| **DB Transport** | Neon / PostgreSQL TLS (`sslmode=require`) |

> ✅ `npm audit` (backend): **0 vulnerabilities** — Express 4.22.2, `qs` and `on-headers` pinned via `overrides`.

---

## 🚀 Quick Start

### ⚡ Option 1 — Frontend Only (Zero Backend Needed)

The frontend ships with full mock data and demo accounts. See the entire UI instantly:

```bash
git clone https://github.com/your-org/iavispl-tms.git
cd iavispl-tms/frontend
npm install
npm run dev
# Open http://localhost:3000
```

**Demo Accounts** (any password works in mock mode):

| Account | Role |
|---|---|
| `admin@iavispl.com` | 👑 Super Admin |
| `hr@iavispl.com` | 🧑‍💼 HR Admin |
| `employee@iavispl.com` | 👤 Employee |

---

### 🗄️ Option 2 — Full Stack (Frontend + Backend + Database)

**Prerequisites:** Node.js 18+, PostgreSQL 15+, Redis 7+ (optional)

```bash
# 1️⃣ Clone the repository
git clone https://github.com/your-org/iavispl-tms.git
cd iavispl-tms

# 2️⃣ Install all dependencies (frontend + backend)
npm run install-all

# 3️⃣ Configure environment variables
cp .env.example .env
cp .env.example backend/.env
# ✏️ Edit .env — set DATABASE_URL, JWT secrets, CORS_ORIGIN

# 4️⃣ Set up the database
cd backend
npx prisma migrate dev --name init
npx prisma generate
npm run seed          # Creates demo users (password: demo1234)

# 5️⃣ Run both apps from the repo root
cd ..
npm run dev
```

| Service | URL |
|---|---|
| 🖥️ Frontend | http://localhost:3000 |
| ⚙️ API | http://localhost:4000/api/v1 |
| 📖 Swagger Docs | http://localhost:4000/api/docs |
| 💚 Health Check | http://localhost:4000/health |

---

### 🌱 Environment Variables

**Root `.env` / `backend/.env`:**

```env
# ---- Server ----
NODE_ENV=development
PORT=4000

# ---- Database (Neon or local PostgreSQL) ----
DATABASE_URL="postgresql://USER:PASSWORD@host/iavispl_tms?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@host/iavispl_tms?sslmode=require"

# ---- Auth ----
JWT_ACCESS_SECRET=your-long-random-secret-min-32-chars
JWT_REFRESH_SECRET=your-other-long-random-secret-min-32
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

# ---- Security ----
CORS_ORIGIN=http://localhost:3000
MAX_FAILED_LOGINS=5
LOCK_MINUTES=15
```

**Frontend `.env.local`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_USE_MOCK=false       # Set to true for demo/no-backend mode
```

---

## 🐳 Docker Deployment

One command brings up the entire stack:

```bash
docker compose up --build
```

**What gets created:**

| Container | Port | Role |
|---|---|---|
| `postgres` | 5432 | PostgreSQL database |
| `redis` | 6379 | Cache & rate-limit store |
| `backend` | 4000 | Express API (auto-runs migrations on boot) |
| `frontend` | 3000 | Next.js app |
| `nginx` | 80 | Reverse proxy (`/` → frontend, `/api` → backend) |

```
                    ┌─────────────────────┐
                    │    nginx (port 80)   │
                    │  /  → :3000 (Next)  │
                    │  /api → :4000 (API) │
                    └──────────┬──────────┘
           ┌───────────────────┼────────────────────┐
           ▼                   ▼                    ▼
    ┌─────────────┐   ┌──────────────┐   ┌──────────────────┐
    │  Next.js    │   │  Express API │   │  PostgreSQL       │
    │  :3000      │──▶│  :4000       │──▶│  + Redis          │
    └─────────────┘   └──────────────┘   └──────────────────┘
```

---

## 🌐 API Reference

Live interactive docs available at **`/api/docs`** (Swagger UI) when the backend is running.

### Authentication

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@iavispl.com",
  "password": "demo1234"
}

# Returns:
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": { "id": "...", "name": "...", "role": "SUPER_ADMIN" }
}
```

All protected endpoints require:
```http
Authorization: Bearer <accessToken>
```

### Key Endpoints

```
GET    /api/v1/dashboard/stats       → KPI stats for dashboard
GET    /api/v1/employees             → List employees (paginated, filterable)
POST   /api/v1/employees             → Create employee
POST   /api/v1/employees/import      → Bulk CSV/Excel import
GET    /api/v1/training              → List trainings
POST   /api/v1/training-flow/enroll  → Enroll in training
GET    /api/v1/assessments/:id       → Get assessment with questions
POST   /api/v1/assessments/:id/submit → Submit attempt, get score
GET    /api/v1/certificates          → My certificates
GET    /api/v1/audit                 → Audit trail (paginated)
GET    /health                       → { "status": "ok" }
```

---

## 👥 Role & Permission System

6 built-in roles with middleware-enforced permissions:

| Role | Access Level |
|---|---|
| 👑 **SUPER_ADMIN** | Full system access — all modules, user management, audit |
| 🧑‍💼 **HR_ADMIN** | Employee CRUD, training management, reports |
| 📋 **TRAINING_MANAGER** | Training CRUD, assessments, certificates |
| 🧑‍🏫 **TRAINER** | Own trainings, mark attendance, view enrollees |
| 🔍 **AUDITOR** | Read-only access to audit logs, reports, compliance |
| 👤 **EMPLOYEE** | Own profile, enrolled trainings, assessments, certificates |

> Roles are enforced at the route level with `authorize('SUPER_ADMIN', 'HR_ADMIN')` middleware — not just hidden in the UI.

---

## 📊 Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 14 | React framework, SSR + CSR, pages router |
| **React** | 18 | UI library |
| **TypeScript** | 5.5 | Type safety throughout |
| **Tailwind CSS** | 3 | Utility-first styling with custom design tokens |
| **Framer Motion** | latest | Animations, page transitions, entrance effects |
| **Recharts** | latest | Charts — line, bar, pie, area |
| **lucide-react** | latest | Icon library |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ | Runtime |
| **Express** | 4.22.2 | HTTP framework |
| **TypeScript** | 5.5 | Type safety |
| **Prisma** | 5.17 | ORM + migration runner |
| **Zod** | 3.23 | Runtime input validation |
| **bcryptjs** | 2.4 | Password hashing |
| **jsonwebtoken** | 9.0 | JWT access + refresh tokens |
| **Helmet** | 7.1 | HTTP security headers |
| **express-rate-limit** | 7.3 | Rate limiting |
| **PDFKit** | 0.19 | Certificate PDF generation |
| **xlsx** | 0.18 | Excel export |
| **swagger-ui-express** | 5.0 | Interactive API docs |
| **morgan** | 1.10 | HTTP request logging |

### Infrastructure

| Technology | Purpose |
|---|---|
| **PostgreSQL 15+** | Primary database |
| **Redis 7+** | Cache, rate-limit state |
| **Docker + Compose** | Containerization |
| **nginx** | Reverse proxy, static serving |

---

## 🗺️ Roadmap

| Phase | Status | Scope |
|---|---|---|
| **Phase 0 — Foundation** | ✅ Complete | Design system, login, animated dashboard, Prisma schema, JWT/RBAC, Docker |
| **Phase 1 — Core Records** | ✅ Complete | Employee CRUD, CSV import, Department management, Training CRUD |
| **Phase 2 — Delivery** | 🚧 In Progress | Training calendar, LMS material upload, version control |
| **Phase 3 — Evaluation** | 📅 Planned | Assessment engine UI, auto-grading, feedback analytics |
| **Phase 4 — Compliance** | 📅 Planned | Certificate PDF + QR verify, compliance heatmap, renewal engine |
| **Phase 5 — Insight** | 📅 Planned | Reporting dashboards, Excel/CSV/PDF export, audit viewer |
| **Phase 6 — AI Features** | 🔮 Future | Training recommendations, dashboard assistant, report summaries |
| **Phase 7 — Hardening** | 🔮 Future | E2E tests, accessibility pass, performance budget, pen-test |

---

## 🧪 Running Tests

```bash
# Backend unit tests
cd backend
npm test

# Watch mode
npm run test:watch
```

Current test coverage:
- ✅ **Employee module** — 12/12 tests passing (CRUD, CSV import validation, duplicate detection)
- ✅ **Department module** — tests passing
- ✅ **Assessment module** — tests passing

---

## 📁 Documentation

| Doc | What's in it |
|---|---|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Three-tier architecture diagram, layer descriptions, scalability notes |
| [`docs/DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md) | Full entity-relationship map, enums, indexing strategy |
| [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md) | REST API endpoints, request/response examples |
| [`docs/DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md) | Step-by-step production deployment |
| [`docs/SECURITY.md`](docs/SECURITY.md) | Security controls mapped to OWASP Top 10 |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Phase-by-phase delivery plan |
| [`docs/NEON_SETUP.md`](docs/NEON_SETUP.md) | Setting up Neon serverless PostgreSQL |
| [`docs/UPGRADE_NOTES.md`](docs/UPGRADE_NOTES.md) | Backend-wiring changelog, what's done vs pending |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add some feature'`
4. Push the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow the existing TypeScript + Zod + Prisma patterns in the backend, and the component/service patterns in the frontend.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=D82B25,BF1E26,1A1A1D&height=120&section=footer&animation=fadeIn" width="100%"/>

**© Integral Solutions Private Limited (IAVISPL)**  
*Enterprise Training Management System — Internal Application*

<br/>

⭐ If this project helped you, please consider giving it a star!

</div>
