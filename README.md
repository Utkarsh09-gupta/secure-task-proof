# Nexa: Secure Task Proof Platform

Nexa is a full-stack, milestone-based task collaboration platform that allows freelancers and clients to securely collaborate and automatically generate **cryptographically verifiable Proof Cards** for completed work. Freelancers can build a portable, client-verified reputation in their **Proof Wallet** that they can share with potential clients.

---

## 🚀 Key Advantages for Freelancers

1. **Verifiable Proof of Work (No More "Trust Me")**
   Every completed milestone generates a verified **Proof Card** in the freelancer's wallet. It includes the client's name, task details, milestone title, and a direct URL to the evidence of work (designs, repository, documents). Clients sign off on this, making it impossible to fake.
2. **Portable Reputation**
   Freelancers get a public **Proof Wallet** showcasing their complete history of verified achievements. They can share this link on LinkedIn, resumes, or portfolios to prove their skill set.
3. **Milestone Security & Dispute Protection**
   Tasks are broken down into locked milestones. Freelancers can submit deliverables step-by-step, request revisions, and receive payment confirmation, protecting them from scope creep and non-payment.
4. **Context-Based Profile Privacy**
   Protects freelancer privacy by hiding contact details and credentials until a contract/task is accepted.

---

## 🛠️ Tech Stack

### Frontend (User Interface)
* **Framework**: React 18 with TypeScript (compiled using Vite)
* **State Management**: Zustand (persists JWT session tokens in localStorage)
* **Styling**: Vanilla CSS for core layouts & responsive styles, Tailwind CSS for utilities
* **Icons**: Lucide React
* **Toasts & Feedback**: Sonner

### Backend (API Server)
* **Runtime**: Node.js + Express with TypeScript
* **ORM**: Prisma Client (Type-safe SQL builder)
* **Database**: SQLite (`dev.db` database file)
* **Security & Authentication**: JWT (JSON Web Tokens) and pre-hashed passwords using `bcryptjs`
* **Concurrency**: Configured to run frontend and backend servers together locally under a single port configuration

---

## 📁 Project Architecture

```bash
├── server/                    # Node.js + Express Backend
│   ├── prisma/
│   │   ├── schema.prisma      # SQLite Database Models (User, Task, Milestone, Deliverable, ProofCard)
│   │   ├── seed.ts            # Database seed script for default demo accounts
│   │   └── dev.db             # SQLite local database file (ignored in git)
│   ├── src/
│   │   ├── index.ts           # App entry point, CORS settings & auto-seeding
│   │   ├── middleware/
│   │   │   └── auth.ts        # JWT token verification middleware
│   │   └── routes/
│   │       ├── auth.ts        # Signup, login, profile routes
│   │       ├── tasks.ts       # Task creation, accept, milestone submission, and approval endpoints
│   │       └── proof.ts       # Proof Wallet query endpoints
│   ├── tsconfig.json
│   └── package.json
│
├── src/                       # React Frontend
│   ├── components/            # Layout and modal React components
│   ├── lib/
│   │   ├── store.ts           # Zustand global state & API integration action dispatchers
│   │   └── types.ts           # Shared TypeScript definitions
│   ├── pages/                 # Routing views (Dashboard, Auth, Profile, TaskDetail, TaskReview, ProofWallet)
│   ├── App.tsx                # Client router, ProtectedRoute verification
│   └── main.tsx
│
├── vercel.json                # Single Page Application (SPA) routing configuration
└── package.json               # Root scripts to run concurrently
```

---

## ⚙️ Local Development Setup

### Prerequisite
Ensure you have [Node.js](https://nodejs.org) installed on your system.

### 1. Install Dependencies
Install all package dependencies in both the root directory and the backend server folder:
```bash
# Install frontend packages
npm install

# Install backend packages
cd server
npm install
cd ..
```

### 2. Prepare the Database
Create the database tables and seed the demo data:
```bash
cd server
# Generate Prisma Client
npx prisma generate

# Run migrations to create SQLite database tables
npx prisma migrate dev --name init

# Seed database with initial users and tasks
npx prisma db seed
cd ..
```

### 3. Run Development Servers
Start both the React frontend and Node.js backend concurrently:
```bash
npm run dev
```
* **Frontend**: runs on [http://localhost:8080](http://localhost:8080)
* **Backend**: runs on [http://localhost:5000](http://localhost:5000)

---

## 🌐 Production Deployment Guide

### Step 1: Deploy Backend to Render (or Railway)
1. Set **Root Directory** to `server`.
2. Configure environment variables:
   * `DATABASE_URL` = `file:./dev.db`
   * `JWT_SECRET` = `any_random_string`
   * `FRONTEND_URL` = `https://your-app.vercel.app` (or `*` to allow any origin)
3. Set **Build Command**: `npm install && npm run build && npx prisma generate && npx prisma migrate deploy`
4. Set **Start Command**: `npm run start`

### Step 2: Deploy Frontend to Vercel
1. Import repository and set **Framework Preset** to Vite.
2. Set **Root Directory** as default `/`.
3. Configure environment variables:
   * **Key**: `VITE_API_URL`
   * **Value**: Your Render server URL (e.g. `https://your-backend.onrender.com`).
4. Click **Deploy**. Vercel will automatically compile the code and apply the `vercel.json` SPA redirection rules.
