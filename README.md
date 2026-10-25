# GoPratle Event Platform — Multi-Step Requirement Posting Flow

A production-ready, full-stack event requirement posting application built for the GoPratle Full-Stack Developer Intern assignment.

Users post event requirements through an intuitive, category-aware 4-step wizard. The form validates all inputs client-side via Zod, persists progress to `sessionStorage` across page refreshes, safely manages category transitions, and persists structured documents to MongoDB Atlas through an Express TypeScript REST API.

---

## 🚀 Key Features

- **4-Step Guided Flow**:
  1. **Event Basics**: Common event details (Event Name, Type, Dates, Location, Venue, and Service Category).
  2. **Category Requirements**: Dynamic quantitative inputs tailored to **Event Planner**, **Performer**, or **Crew** (Pax, Scope, Roles, Duration, Gear, and INR Budget).
  3. **Technical & Operational Logistics**: Deep qualitative specifications (Decor styling, Catering, Sound riders, Lighting, Backline, Shift schedules, and Responsibilities).
  4. **Review & Submission**: Comprehensive structured review with per-step `[Edit]` shortcuts, duplicate submission guard, cold-start resilience, and instant reference ID confirmation.
- **Dynamic Category Switching**:
  - Safe category switching with a confirmation dialog to prevent accidental loss of category-specific form entries.
  - Automatically resets stale child fields when switching between Planner, Performer, and Crew.
- **Session Persistence**:
  - Auto-saves form progress into `sessionStorage`. Survives accidental browser refreshes.
  - Automatically cleared on successful submission or manual reset.
- **End-to-End Type Safety & Validation**:
  - Mirrored Zod schemas with discriminated unions (`category: 'planner' | 'performer' | 'crew'`).
  - Real-time field validation, date range validation (Start Date ≤ End Date), and numeric INR currency handling.
- **Production Resilience**:
  - 30-second `AbortController` timeout handling Render free-tier cold starts gracefully with descriptive user notifications.
  - Dedicated `/health` endpoint for uptime monitoring.

---

## 📁 Repository Structure

```
gopratle-event-platform/
├── .gitignore
├── README.md
├── package.json               # Root convenience runner
├── frontend/                  # Next.js 16 App Router (TypeScript, Turbopack)
│   ├── .env.local.example
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── src/
│       ├── app/               # Routes, globals.css, layout
│       ├── components/
│       │   ├── ui/            # Button, Input, Select, Checkbox, CheckboxGroup, Textarea, Modal, Spinner
│       │   ├── layout/        # Navbar, StepIndicator
│       │   └── form/          # StepOne, StepFour, and steps/ (planner, performer, crew)
│       ├── hooks/             # useMultiStepForm, useFormPersist
│       ├── lib/               # api.ts, utils.ts
│       ├── schemas/           # Step & category Zod schemas
│       └── types/             # Shared TypeScript models & discriminated union
└── backend/                   # Express 4 (TypeScript)
    ├── .env.example
    ├── tsconfig.json
    ├── package.json
    └── src/
        ├── app.ts             # Express app setup, CORS, Helmet, Rate limits
        ├── server.ts          # HTTP server bootstrapper
        ├── config/db.ts       # Mongoose Atlas connection pool
        ├── models/            # Mongoose Requirement schema
        ├── controllers/       # Controller with Zod parse & Mongoose persist
        ├── routes/            # Requirements & health routes
        ├── middleware/        # Centralized error handler
        ├── schemas/           # Backend discriminated union Zod schemas
        └── types/             # Backend TypeScript interfaces
```

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | Next.js 16 (App Router) | React 19, TypeScript, Turbopack |
| **Form Management** | React Hook Form | `@hookform/resolvers/zod` |
| **Validation** | Zod 3.23.8 | Mirrored schemas on frontend & backend |
| **Styling** | Vanilla CSS Modules | Glassmorphism, CSS Custom Properties, Responsive Grid |
| **Backend Framework** | Node.js + Express 4 | TypeScript, Helmet, CORS |
| **Database** | MongoDB Atlas (M0) | Mongoose 8.8.0 connection pooling |
| **Deployment Target** | Vercel (Frontend) & Render (Backend) | Independent zero-cost tier hosting |

---

## ⚡ Prerequisites

- **Node.js**: `v20.9.0` or higher (LTS recommended)
- **npm**: `v10.0.0` or higher
- **MongoDB**: A running local MongoDB instance or a free MongoDB Atlas connection string.

---

## 💻 Local Setup & Execution

### 1. Clone the repository
```bash
git clone <repo-url>
cd "Gopratle Event Platform"
```

### 2. Configure Environment Variables

**Backend (`backend/.env`):**
```bash
cp backend/.env.example backend/.env
```
Edit `backend/.env`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/gopratle?retryWrites=true&w=majority
PORT=4000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend (`frontend/.env.local`):**
```bash
cp frontend/.env.local.example frontend/.env.local
```
Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Install Dependencies

```bash
# In backend
cd backend
npm install

# In frontend
cd ../frontend
npm install
```

### 4. Run Development Servers

You can start both services from the root directory or independently:

**From root:**
```bash
# Start backend (runs on http://localhost:4000)
npm run dev:backend

# In a separate terminal, start frontend (runs on http://localhost:3000)
npm run dev:frontend
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You will be redirected to `/requirements/new`.

---

## 🌐 API Reference

### Health Check
- **`GET /health`**
- **Response**: `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2026-10-25T11:49:00.000Z"
}
```

### Create Requirement
- **`POST /api/requirements`**
- **Headers**: `Content-Type: application/json`
- **Request Body (Example - Performer)**:
```json
{
  "eventName": "GoPratle Music Fest 2026",
  "eventType": "Concert",
  "startDate": "2026-12-15T00:00:00.000Z",
  "endDate": "2026-12-16T00:00:00.000Z",
  "location": "Bengaluru, Karnataka",
  "venue": "Palace Grounds",
  "category": "performer",
  "details": {
    "performanceType": "band",
    "numberOfPerformers": 5,
    "performanceDuration": 3,
    "equipmentRequired": ["Drum kit", "In-ear monitors", "Wireless vocal mics"],
    "estimatedBudget": 85000,
    "lightingRequired": true,
    "backlineRequired": true,
    "stageSetup": "16x12 ft stage with drum riser",
    "soundRequirements": "4 stage wedges, FOH console"
  }
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "data": {
    "_id": "6740a1b2c3d4e5f6a7b8c9d0",
    "eventName": "GoPratle Music Fest 2026",
    "category": "performer",
    "status": "submitted",
    "createdAt": "2026-10-25T12:00:00.000Z"
  }
}
```

---

## 🚢 Deployment Guide

### Backend (Render)
1. Push repository to GitHub.
2. Create a new **Web Service** on [Render](https://render.com).
3. Set **Root Directory** to `backend`.
4. Set **Build Command** to `npm install && npm run build`.
5. Set **Start Command** to `npm start`.
6. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection URI.
   - `FRONTEND_URL`: Your Vercel frontend URL (e.g., `https://gopratle-events.vercel.app`).
   - `NODE_ENV`: `production`
7. Copy the assigned Render service URL (e.g. `https://gopratle-backend.onrender.com`).

### Frontend (Vercel)
1. Import repository to [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL (`https://gopratle-backend.onrender.com`).
4. Deploy.

---

## 📐 Assumptions & Design Decisions

1. **Currency**: Indian Rupees (₹). Budgets are captured, validated, and stored as numeric integer/float values in MongoDB to support range querying, while formatted as INR strings (`₹85,000`) for display.
2. **Session Storage vs Local Storage**: `sessionStorage` was chosen for form state recovery across page refreshes while ensuring stale state does not persist after tab closure.
3. **Cold-Start Handling**: Render free instances spin down after inactivity; the frontend includes a 30s timeout with clear feedback distinguishing spin-up delays from server errors.
