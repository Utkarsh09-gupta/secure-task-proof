-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "skills" TEXT,
    "serviceCategories" TEXT,
    "clientType" TEXT,
    "completedTasks" INTEGER NOT NULL DEFAULT 0,
    "paymentBehavior" TEXT
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "totalAmount" REAL NOT NULL,
    "clientId" TEXT NOT NULL,
    "assigneeId" TEXT,
    "assigneeRole" TEXT,
    "status" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contractLocked" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Task_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "revisionCount" INTEGER NOT NULL DEFAULT 0,
    "submissionUrl" TEXT,
    "submissionNote" TEXT,
    "taskId" TEXT NOT NULL,
    CONSTRAINT "Milestone_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Deliverable" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "milestoneId" TEXT NOT NULL,
    CONSTRAINT "Deliverable_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProofCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "taskTitle" TEXT NOT NULL,
    "milestoneTitle" TEXT NOT NULL,
    "userRole" TEXT NOT NULL,
    "workSummary" TEXT NOT NULL,
    "evidenceUrl" TEXT NOT NULL,
    "clientApproval" BOOLEAN NOT NULL DEFAULT true,
    "clientName" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified" BOOLEAN NOT NULL DEFAULT true,
    "publicLink" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
